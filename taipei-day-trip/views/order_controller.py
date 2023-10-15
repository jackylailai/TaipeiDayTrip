from flask import *
from models.booking import *
from models.user import *
from models.order import *
from models.attraction import *
from .booking_controller import is_user_authenticated
from dateutil import parser
import time
from models.contact import *
import requests
from config import partner_key,merchant_id

order_blueprint = Blueprint('order', __name__)

@order_blueprint.route('/api/orders', methods=['POST'])
def create_order_view():
    print("收到/api/orders")
    try:
        data = request.get_json()
        print(data,"data")
        identified = is_user_authenticated()
        if not identified:
            return jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403
        print("訂單收到錢通過jwt驗證")
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
    


@order_blueprint.route('/api/order/<string:orderNumber>', methods=['GET'])
def get_order_view(orderNumber):
    identified = is_user_authenticated()
    if not identified:
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
