from flask import *
from models.user import *
import jwt

user_blueprint =Blueprint("user",__name__)
@user_blueprint.route('/api/user', methods=['POST'])
def register_user_view():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    return register_user(name, email, password)

@user_blueprint.route('/api/user/auth', methods=['GET'])
def get_current_user_view():
    try:
        token = request.headers.get('Authorization')
        if not token:
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

        return jsonify({"data": user_data}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"data": None}), 200
    except jwt.InvalidTokenError:
        return jsonify({"data": None}), 200
    except Exception as e:
        return jsonify({"error": True, "message": str(e)}), 500
    
@user_blueprint.route('/api/user/auth', methods=['PUT'])
def login_user_view():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = login_user(email, password)

        if user:
            token = generate_token(user)
            return jsonify({"token": token})
        else:
            return jsonify({"error": True, "message": "登入失敗，Email或密碼錯誤"}), 400
    except Exception as e:
        return jsonify({"error": True, "message": str(e)}), 500
