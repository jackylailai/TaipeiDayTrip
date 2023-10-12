import time
from flask import *
import mysql.connector
import os
from dotenv import load_dotenv
import os.path
import jwt
import requests
from dateutil import parser
from mysql.connector import pooling
# import logging
# logging.basicConfig(filename='app.log', level=logging.DEBUG)

# 載入.env文件中的環境變數
load_dotenv()
partner_key=os.environ.get("partner_key")
print("partnerkey",partner_key)
merchant_id=os.environ.get("merchant_id")
print("merchant_id",merchant_id)
# 從環境變數中讀取資料庫配置
db_config = {
    "host": os.environ.get("DB_HOST"),
    "user": os.environ.get("DB_USER"),
    "password": os.environ.get("DB_PASSWORD"),
    "database": os.environ.get("DB_DATABASE"),
}
db_pool = pooling.MySQLConnectionPool(pool_name="my_pool", pool_size=5, **db_config)
# connection = mysql.connector.connect(**db_config)
# 建立游標
# cursor其實盡可能不要共用，因為同時開需求就會亂掉
print(db_pool,":db_pool")

app=Flask(__name__)
#好像會引起fetch有問題
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")
@app.route("/api/attractions", methods=["GET"])
def get_attractions():
    try:
        with db_pool.get_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                # connection = mysql.connector.connect(**db_config)
                # 建立游標
                # cursor其實盡可能不要共用，因為同時開需求就會亂掉
                print(connection)
                # cursor = connection.cursor(dictionary=True)
                page = int(request.args.get("page", 0))
                keyword = request.args.get("keyword", "")
                per_page = 12
                if page >=0:
                    start_index = page * per_page
                else:
                    start_index = 0
                #用來計算要是第幾個索引開始（用頁數去減）
            
                query = "SELECT * FROM attractions WHERE name LIKE %s OR mrt LIKE %s LIMIT %s, %s"
                cursor.execute(query, ("%" + keyword + "%", "%" + keyword + "%", start_index, per_page))
                attractions=cursor.fetchall()
                #一個一個放進來改image為list
                for attraction in attractions:
                    images_str = attraction["images"]
                    image_list = json.loads(images_str)
                    attraction["images"] = image_list
                response = {
                    "nextPage": page + 1 if len(attractions) >= per_page else None,
                    "data": attractions
                }
                return jsonify(response), 200

    except Exception as e:
        error_response = {
            "error": True,
            "message": str(e)
        }
        return jsonify(error_response), 500
@app.route("/api/attraction/<int:attractionId>", methods=["GET"])
def get_attraction(attractionId):
    print(db_pool,"attractionid dbpool")
    try:
        with db_pool.get_connection() as connection:
            with connection.cursor(dictionary=True) as cursor:
                # connection = mysql.connector.connect(**db_config)
                # 建立游標
                # cursor其實盡可能不要共用，因為同時開需求就會亂掉
                print(connection)
                query = "SELECT * FROM attractions WHERE id = %s"
                cursor.execute(query, (attractionId,))
                attraction = cursor.fetchone()

                if attraction:
                    images_str = attraction["images"]
                    image_list = json.loads(images_str)
                    response = {
                        "data": {
                            "id": attraction["id"],
                            "name": attraction["name"],
                            "category": attraction["category"],
                            "description": attraction["description"],
                            "address": attraction["address"],
                            "transport": attraction["transport"],
                            "mrt": attraction["mrt"],
                            "lat": attraction["lat"],
                            "lng": attraction["lng"],
                            "images": image_list,
                        }
                    }
                    return jsonify(response), 200
                else:
                    error_response = {
                        "error": True,
                        "message": "景點不正確"
                    }
                    return jsonify(error_response), 400
    except Exception as e:
        error_response = {
            "error": True,
            "message": str(e)
        }
        return jsonify(error_response), 500
@app.route("/api/mrts", methods=["GET"])
def get_mrt_stations(): 
    try:
        with db_pool.get_connection() as connection:
            with connection.cursor() as cursor:
                # connection = mysql.connector.connect(**db_config)
                # 建立游標
                # cursor其實盡可能不要共用，因為同時開需求就會亂掉
                print(connection)
                query="SELECT MRT,COUNT(*) AS attractions_count FROM attractions GROUP BY MRT ORDER BY attractions_count DESC"
                cursor.execute(query)
                results = cursor.fetchall()
                mrt_list = [result[0] for result in results]
                response = {
                    "data": mrt_list
                }
                
                return jsonify(response), 200
    except Exception as e:
        error_response = {
            "error": True,
            "message": str(e)
        }
        return jsonify(error_response), 500

#註冊會員

secret_key = 'secret_key'

@app.route('/api/user', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        with db_pool.get_connection() as connection, connection.cursor() as cursor:
            # connection = mysql.connector.connect(**db_config)

            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            existing_user = cursor.fetchone()

            if existing_user:
                connection.close()
                return jsonify({"error": True, "message": "重複的 Email "}), 400

            cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
                        (name, email, password))
            connection.commit()
            connection.close()

            return jsonify({"ok": True})

    except Exception as e:
        return jsonify({"error": True, "message": str(e)}), 500


#處理token get登入資訊
@app.route('/api/user/auth', methods=['GET'])
def get_current_user():
    try:
        token = request.headers.get('Authorization')
        print(token)
        if not token:
            print("get登入資料後，沒資料")
            return jsonify({"data": None}), 200  
        decoded_token = jwt.decode(token, secret_key, algorithms=['HS256'])

        user_id = decoded_token.get('id')
        user_name = decoded_token.get('name')
        user_email = decoded_token.get('email')

        user_data = {
            "id": user_id,
            "name": user_name,
            "email": user_email
        }
        # print("get登入資料後，user_data",user_data)
        return jsonify({"data": user_data}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"data": None}), 200  
    except jwt.InvalidTokenError:
        return jsonify({"data": None}), 200  
    except Exception as e:
        return jsonify({"error": True, "message": str(e)}), 500
    
#登入部分
@app.route('/api/user/auth', methods=['PUT'])
def login_user():
    cursor = None 
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        with db_pool.get_connection() as connection, connection.cursor() as cursor:
            # connection = mysql.connector.connect(**db_config)

            cursor.execute("SELECT id, name, email FROM users WHERE email = %s AND password = %s", (email, password))
            user = cursor.fetchone()
            print("user",user)
            if user:
                payload = {
                    'id': user[0],
                    'name': user[1],
                    'email': user[2]
                }
                # expiration_time = datetime.datetime.utcnow() + datetime.timedelta(days=7)
                token = jwt.encode(payload, secret_key, algorithm='HS256')
                print("token",token)
                token_bytes = token.encode('utf-8')
                print("token_byte",token_bytes)
                return jsonify({"token": token_bytes.decode('utf-8')})
            else:
                return jsonify({"error": True, "message": "登入失敗，Email或密碼錯誤"}), 400
    except Exception as e:
        return jsonify({"error": True, "message": str(e)}), 500

@app.route('/api/booking', methods=['POST'])
def create_booking():
    decoded_token=is_user_authenticated()
    if not decoded_token:  # 檢查使用者是否未登入
        return jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403
    try:
        user_id = decoded_token['id']
        # user_name = decoded_token['name']
        # user_email = decoded_token['email']

        attraction_id = request.form.get('attractionId')
        date = request.form.get('date')
        time = request.form.get('time')
        price = request.form.get('price')
        image = request.form.get('image')
        with db_pool.get_connection() as connection, connection.cursor() as cursor:
            # connection = mysql.connector.connect(**db_config)
            print(connection,"connection")


            delete_query = "DELETE FROM booking WHERE user_id = %s"
            cursor.execute(delete_query,(user_id,))
            connection.commit()

            insert_query = "INSERT INTO booking (booking_attraction_id, date, time, price,image,user_id) VALUES (%s, %s, %s, %s, %s, %s)"
            data = (attraction_id, date, time, price, image, user_id)
            print(data)
            cursor.execute(insert_query, data,)
            connection.commit()


            return jsonify({'message': '預約成功'}), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': True, 'message': '預約失敗'}), 400
    
@app.route('/api/booking', methods=['GET'])
def get_bookings():
    decoded_token=is_user_authenticated()
    if not decoded_token:  # 檢查使用者是否未登入
        return jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403
    try:
        print(decoded_token,"token解讀出的資料")
        user_id = decoded_token['id']
        # user_name = decoded_token['name']
        # user_email = decoded_token['email']
        with db_pool.get_connection() as connection, connection.cursor() as cursor:
        # connection = mysql.connector.connect(**db_config)
            cursor.execute("""
                SELECT b.date, b.price, b.time, b.image, a.name, a.address,a.id
                FROM booking AS b
                JOIN attractions AS a ON b.booking_attraction_id = a.id
                WHERE b.user_id = %s
                LIMIT 1
            """, (user_id,))

            booking_data = cursor.fetchone() 
            print("time,",booking_data[2])
            print("進來檢查登入資料庫東西booking_data",booking_data)
            if booking_data:
                response_data = {
                    "attraction": {
                        "id":booking_data[6],
                        "name": booking_data[4],  
                        "address": booking_data[5],  
                        "image": booking_data[3], 
                    },
                    "date": booking_data[0],  
                    "price": booking_data[1],  
                    "time": booking_data[2],  
                }
                print(response_data)
                return jsonify({"data": response_data}), 200

            return jsonify(None), 200

    except Exception as e:
        return jsonify({"error": True, "message": str(e)}), 500


@app.route('/api/booking', methods=['DELETE'])
def delete_booking():
    decoded_token=is_user_authenticated()
    if not decoded_token:  
        return jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403
    try:
        user_id = decoded_token['id']
        # user_name = decoded_token['name']
        # user_email = decoded_token['email']
        with db_pool.get_connection() as connection, connection.cursor() as cursor:
            # connection = mysql.connector.connect(**db_config)
            print(cursor)
            query = "DELETE FROM booking WHERE user_id = %s"
            cursor.execute(query,(user_id,))
            print(cursor,"delete")
            connection.commit()

            if cursor.rowcount > 0:
                return jsonify({"ok": True}), 200
            else:
                return jsonify({"error": True, "message": "找不到預定"}), 404

    except Exception as e:
        print("刪除時發生錯誤", str(e))
        return jsonify({"error": True, "message": "删除時發生錯誤"}), 500   

def is_user_authenticated():
    token = request.headers.get('Authorization')
    # print(token,"token")
    if not token:
        return False  
    try:
        decoded_token = jwt.decode(token, secret_key, algorithms=['HS256'])
        # print(decoded_token,"decoded_token")
        return decoded_token
    except jwt.ExpiredSignatureError:
        return False  
    except jwt.InvalidTokenError:
        return False  



@app.route('/api/orders', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        print(data,"data")
        order = data.get("order")
        contact = order.get("contact")
        price = int(order.get("price"))
        trip = order.get("trip")
        attraction_date = trip.get("date")
        attraction_time = trip.get("time")
        attraction = trip.get("attraction")
        attraction_id = int(attraction.get("id"))
        name = contact.get("name")
        prime = data.get("prime")
        email = contact.get("email")
        phone_number = contact.get("phone")

        attraction_date = parser.parse(attraction_date)
        # contact_id = 1 
        contact_id=insert_contact(name, email, phone_number)
        print(contact_id)
        current_time = int(time.time() * 1000)
        order_number=str(current_time) 
        print(order_number,"order_number")
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': partner_key,
        }

        payload = {
            'prime': prime,
            'partner_key': partner_key,
            'merchant_id': merchant_id,
            'details': 'TapPay Payment',
            'amount': price,
            "order_number":order_number,
            "cardholder": {
                "phone_number": phone_number,
                "name": name,
                "email": email,
            },
            'remember': True, 
        }
        
        response = requests.post('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime', json=payload, headers=headers)
        response_data = response.json()
        print("response_data",response_data)
        if response_data['status'] == 0:
            final_data = {
                "data": {
                    "number": order_number,
                    "payment": {
                        "status": 0,
                        "message": "付款成功"
                    }
                }
            }
            print("成功走完",order_number)
            status=0
            insert_order(order_number, price, attraction_id, contact_id, attraction_date,attraction_time, status)

            user_id = get_user_id_by_email(email)
            delete_booking_by_user_id(user_id)

            return jsonify(final_data), 200
        else:
            return jsonify({'error': True, 'message': '付款失敗'}), 400

    except Exception as e:
        return jsonify({'error': True, 'message': str(e)}), 500
    
@app.route('/api/order/<string:orderNumber>', methods=['GET'])
def get_order(orderNumber):
    print("剛進來")
    decoded_token=is_user_authenticated()
    if not decoded_token: 
        print("token驗證沒過") 
        return jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403
    try:
        print("帳號驗證有過")
        order_info = get_order_info(orderNumber)
        print("近來get_order_info",order_info)
        if order_info:
            attraction_info = get_attraction_info(order_info["attraction_id"])
            images_str = attraction_info["images"]
            image_list = json.loads(images_str)
            contact_info = get_contact_info(order_info["contact_id"])
            # print(f"{attraction_info},,,{contact_info}")
            if attraction_info and contact_info:
                result = {
                    "data": {
                        "number": order_info["number"],
                        "price": order_info["price"],
                        "trip": {
                            "attraction": {
                                "id": attraction_info["id"],
                                "name": attraction_info["name"],
                                "address": attraction_info["address"],
                                "image": image_list[0]
                            },
                            "date": order_info["Date"],
                            "time": order_info["Time"]
                        },
                        "contact": {
                            "name": contact_info["name"],
                            "email": contact_info["email"],
                            "phone": contact_info["phone"]
                        },
                        "status": order_info["status"]
                    }
                }
                print("order_result",result)
                return result
    except Exception as e:
        print("error：", str(e))
        return jsonify({"error": True, "message": "server錯誤"}), 500
def insert_contact(name, email, phone):
    try:
        print("insert contact")
        with db_pool.get_connection() as connection, connection.cursor() as cursor:
            # connection = mysql.connector.connect(**db_config)
            query = "SELECT id FROM contact WHERE name=%s AND email=%s AND phone=%s"
            values = (name, email, phone)
            cursor.execute(query, values)
            contact_row = cursor.fetchone()
            if contact_row is not None:
                contact__ = contact_row[0]
                print("有東西")
            else:
                query = "INSERT IGNORE INTO contact (name, email, phone) VALUES (%s, %s, %s)"
                values = (name, email, phone)
                cursor.execute(query, values)
                connection.commit()
                query = "SELECT id FROM contact WHERE name=%s AND email=%s AND phone=%s"
                cursor.execute(query, values)
                contact_row = cursor.fetchone()
                if contact_row is not None:
                    contact__ = contact_row[0]
                    print("insert裡面的contact__")
                else:
                    contact__ = None

            print("cursor完",contact__)
            return contact__
    except Exception as e:
        print("error：", str(e))
        return -1

def insert_order(order_number, price, attraction_id, contact_id, date, time, status):
    try:
        with db_pool.get_connection() as connection, connection.cursor() as cursor:
            # connection = mysql.connector.connect(**db_config)
            query = "INSERT INTO orders (number, price, attraction_id, contact_id, Date, Time, status) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            values = (order_number, price, attraction_id, contact_id, date, time, status)
            cursor.execute(query, values,)
            connection.commit()
            print("成功insert付費訂單")
    except Exception as e:
        print("error：", str(e))

def get_user_id_by_email(email):
    # cursor = None
    # connection = None
    try:
        # connection = mysql.connector.connect(**db_config)
        with db_pool.get_connection() as connection, connection.cursor() as cursor:
            query = "SELECT id FROM users WHERE email = %s"
            values = (email,)
            cursor.execute(query, values)
            user_id = cursor.fetchone()
            print(user_id,"找到user_id")
            if user_id:
                return user_id[0]
            else:
                return None
    except Exception as e:
        print("error：", str(e))
        return None
def delete_booking_by_user_id(user_id):
    # cursor = None
    # connection = None
    try:
        with db_pool.get_connection() as connection, connection.cursor() as cursor:
            # connection = mysql.connector.connect(**db_config)
            query = "DELETE FROM booking WHERE user_id = %s"
            cursor.execute(query, (user_id,))
            print(cursor, "delete")
            connection.commit()
            print("刪除成功")
    except Exception as e:
        print("error：", str(e))
def get_order_info(order_number):
    try:
        with db_pool.get_connection() as connection, connection.cursor(dictionary=True) as cursor:
            # connection = mysql.connector.connect(**db_config)
            query_order = "SELECT * FROM orders WHERE number = %s"
            cursor.execute(query_order, (order_number,))
            order_data = cursor.fetchone()
            return order_data
    except Exception as e:
        print("error：", str(e))
        return None

def get_attraction_info(attraction_id):
    try:
        with db_pool.get_connection() as connection, connection.cursor(dictionary=True) as cursor:
            # connection = mysql.connector.connect(**db_config)
            query_attraction = "SELECT * FROM attractions WHERE id = %s"
            cursor.execute(query_attraction, (attraction_id,))
            attraction_data = cursor.fetchone()
            return attraction_data
    except Exception as e:
        print("error：", str(e))
        return None
def get_contact_info(contact_id):
    try:
        with db_pool.get_connection() as connection, connection.cursor(dictionary=True) as cursor:
            # connection = mysql.connector.connect(**db_config)
            query_contact = "SELECT * FROM contact WHERE id = %s"
            cursor.execute(query_contact, (contact_id,))
            contact_data = cursor.fetchone()
            return contact_data
    except Exception as e:
        print("發生異常：", str(e))
        return None


app.debug = True
app.run(host="0.0.0.0", port=3000)
