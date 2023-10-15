from flask import *
from models.booking import *
from models.user import secret_key
import jwt

booking_blueprint = Blueprint('booking', __name__)

@booking_blueprint.route('/api/booking', methods=['POST'])
def create_booking_view():
    decoded_token = is_user_authenticated()
    if not decoded_token:
        return jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403

    user_id = decoded_token['id']
    attraction_id = request.form.get('attractionId')
    date = request.form.get('date')
    time = request.form.get('time')
    price = request.form.get('price')
    image = request.form.get('image')

    try:
        create_booking(user_id,attraction_id,date,time,price,image)
        return jsonify({'message': '預約成功'}), 200
    except Exception as e:
        return jsonify({'error': True, 'message': '預約失敗'}), 400

@booking_blueprint.route('/api/booking', methods=['GET'])
def get_bookings_view():
    decoded_token = is_user_authenticated()
    if not decoded_token:
        return jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403

    user_id = decoded_token['id']

    try:
        booking_data = get_bookings(user_id)
        if booking_data:
            response_data = {
                "attraction": {
                    "id": booking_data[6],
                    "name": booking_data[4],
                    "address": booking_data[5],
                    "image": booking_data[3],
                },
                "date": booking_data[0],
                "price": booking_data[1],
                "time": booking_data[2],
            }
            return jsonify({"data": response_data}), 200

        return jsonify(None), 200
    except Exception as e:
        return jsonify({"error": True, "message": str(e)}), 500

@booking_blueprint.route('/api/booking', methods=['DELETE'])
def delete_booking_view():
    decoded_token = is_user_authenticated()
    if not decoded_token:
        return jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403

    user_id = decoded_token['id']

    try:
        result, status_code = delete_booking(user_id)
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"error": True, "message": "刪除時錯誤"}), 500

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