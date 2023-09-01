from flask import *
import mysql.connector
import os
from dotenv import load_dotenv
import os.path



app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['DB_HOST'] = os.environ.get('DB_HOST')
app.config['DB_USER'] = os.environ.get('DB_USER')
app.config['DB_PASSWORD'] = os.environ.get('DB_PASSWORD')
app.config['DB_DATABASE'] = os.environ.get('DB_DATABASE')
print(app.config['DB_DATABASE'])
db_config = {
    "host": app.config['DB_HOST'],
    "user": app.config['DB_USER'],
    "password": app.config['DB_PASSWORD'],
    "database": app.config['DB_DATABASE'],
}
# 載入.env文件中的環境變數
load_dotenv()
# 從環境變數中讀取資料庫配置


connection = mysql.connector.connect(**db_config)
# 建立游標
# cursor其實盡可能不要共用，因為同時開需求就會亂掉
print(connection)
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
        cursor = connection.cursor(dictionary=True)
        page = int(request.args.get("page", 1))
        keyword = request.args.get("keyword", "")
        per_page = 12
        start_index = (page - 1) * per_page#用來計算要是第幾個索引開始（用頁數去減）
    
        query = "SELECT * FROM attractions WHERE name LIKE %s OR mrt LIKE %s LIMIT %s, %s"
        cursor.execute(query, ("%" + keyword + "%", "%" + keyword + "%", start_index, per_page))
        attractions=cursor.fetchall()
        
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
          cursor.close()
@app.route("/api/attraction/<int:attractionId>", methods=["GET"])
def get_attraction(attractionId):
    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM attractions WHERE id = %s"
        cursor.execute(query, (attractionId,))
        attraction = cursor.fetchone()

        if attraction:
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
                    "images": attraction["images"].split(","),
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
        cursor.close()

@app.route("/api/mrts", methods=["GET"])
def get_mrt_stations():
	try:
		cursor = connection.cursor()
		query="SELECT MRT,COUNT(*) AS attractions_count FROM attractions GROUP BY MRT ORDER BY attractions_count DESC"
		cursor.execute(query)
		results = cursor.fetchall()
		mrt_list = [result[0] for result in results]
		response = {
            "data": mrt_list
        }
		cursor.close()
		return jsonify(response), 200
	
	except Exception as e:
		error_response = {
            "error": True,
            "message": str(e)
		}
		return jsonify(error_response), 500
	finally:
		cursor.close()
	
app.run(host="0.0.0.0", port=3000)