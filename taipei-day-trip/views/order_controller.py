from flask import *
from models.booking import *
from models.user import *
from models.order import *
from booking_controller import is_user_authenticated
from dateutil import parser
import time
from models.contact import *
import requests
from app import partner_key,merchant_id

order_blueprint = Blueprint('order', __name__)

@order_blueprint.route('/api/orders', methods=['POST'])
def create_order_view():
    try:
        data = request.get_json()
        identified = is_user_authenticated()
        if not identified:
            return jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403
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
    


@order_blueprint.route('/api/orders/<string:orderNumber>', methods=['GET'])
def get_order_view(orderNumber):
    user_id = is_user_authenticated()

    if not user_id:
        return jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403

    order_info = get_order(orderNumber)

    if not order_info:
        return jsonify({'error': True, 'message': '訂單不存在'}), 404

    return jsonify(order_info), 200
