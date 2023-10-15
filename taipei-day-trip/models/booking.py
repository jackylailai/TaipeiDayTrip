import jwt
from flask import jsonify
from mysql.connector import pooling
from .model import create_db_connection



def create_booking(user_id, attraction_id, date, time, price, image):
    try:
        with create_db_connection() as connection, connection.cursor() as cursor:
            delete_query = "DELETE FROM booking WHERE user_id = %s"
            cursor.execute(delete_query, (user_id,))
            connection.commit()

            insert_query = "INSERT INTO booking (booking_attraction_id, date, time, price, image, user_id) VALUES (%s, %s, %s, %s, %s, %s)"
            data = (attraction_id, date, time, price, image, user_id)
            cursor.execute(insert_query, data)
            connection.commit()

            return {'message': '預約成功'}, 200
    except Exception as e:
        return {'error': True, 'message': '預約失敗'}, 400

def get_bookings(user_id):
    try:
        with create_db_connection() as connection, connection.cursor() as cursor:
            cursor.execute("""
                SELECT b.date, b.price, b.time, b.image, a.name, a.address, a.id
                FROM booking AS b
                JOIN attractions AS a ON b.booking_attraction_id = a.id
                WHERE b.user_id = %s
                LIMIT 1
            """, (user_id,))

            booking_data = cursor.fetchone()
            if booking_data:
                return booking_data
            return None
    except Exception as e:
        return {"error": True, "message": str(e)}, 500

def delete_booking(user_id):
    try:
        with create_db_connection() as connection, connection.cursor() as cursor:
            query = "DELETE FROM booking WHERE user_id = %s"
            cursor.execute(query, (user_id,))
            connection.commit()

            if cursor.rowcount > 0:
                return {"ok": True}, 200
            else:
                return {"error": True, "message": "找不到預定"}, 404
    except Exception as e:
        return {"error": True, "message": "刪除時錯誤"}, 500


def delete_booking_by_user_id(user_id):
    # cursor = None
    # connection = None
    try:
        with create_db_connection() as connection, connection.cursor() as cursor:
            # connection = mysql.connector.connect(**db_config)
            query = "DELETE FROM booking WHERE user_id = %s"
            cursor.execute(query, (user_id,))
            print(cursor, "delete")
            connection.commit()
            print("刪除成功")
    except Exception as e:
        print("error：", str(e))