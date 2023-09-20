from flask import *
import mysql.connector
import os
from dotenv import load_dotenv
import os.path
import jwt
import datetime
# import logging
# logging.basicConfig(filename='app.log', level=logging.DEBUG)

# 載入.env文件中的環境變數
load_dotenv()
# 從環境變數中讀取資料庫配置
db_config = {
    "host": os.environ.get("DB_HOST"),
    "user": os.environ.get("DB_USER"),
    "password": os.environ.get("DB_PASSWORD"),
    "database": os.environ.get("DB_DATABASE"),
}

connection = mysql.connector.connect(**db_config)
# 建立游標
# cursor其實盡可能不要共用，因為同時開需求就會亂掉
print(connection)

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
    cursor=None
    try:
        connection = mysql.connector.connect(**db_config)
        # 建立游標
        # cursor其實盡可能不要共用，因為同時開需求就會亂掉
        print(connection)
        cursor = connection.cursor(dictionary=True)
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
    finally:
        if cursor:
            cursor.close()
@app.route("/api/attraction/<int:attractionId>", methods=["GET"])
def get_attraction(attractionId):
    cursor=None
    try:
        connection = mysql.connector.connect(**db_config)
        # 建立游標
        # cursor其實盡可能不要共用，因為同時開需求就會亂掉
        print(connection)
        cursor = connection.cursor(dictionary=True)
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
    finally:
        if cursor:
            cursor.close()
@app.route("/api/mrts", methods=["GET"])
def get_mrt_stations():
    cursor=None  
    try:
        connection = mysql.connector.connect(**db_config)
        # 建立游標
        # cursor其實盡可能不要共用，因為同時開需求就會亂掉
        print(connection)
        cursor = connection.cursor()
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
    finally:
        if cursor:
            cursor.close()

#註冊會員

secret_key = 'secret_key'

@app.route('/api/user', methods=['POST'])
def register_user():
    cursor=None 
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            connection.close()
            return jsonify({"error": True, "message": "重複的 Email 或其他原因"}), 400

        cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
                       (name, email, password))
        connection.commit()
        connection.close()

        return jsonify({"ok": True})

    except Exception as e:
        return jsonify({"error": True, "message": str(e)}), 500
    finally:
        if cursor:
            cursor.close()


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
        print("get登入資料後，user_data",user_data)
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

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

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
            return jsonify({"error": True, "message": "登入失敗，帳號或密碼錯誤或其他原因"}), 400
    except Exception as e:
        return jsonify({"error": True, "message": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
app.debug = True
app.run(host="0.0.0.0", port=3000)
