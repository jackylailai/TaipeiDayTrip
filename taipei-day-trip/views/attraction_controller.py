import requests
from flask import *
import json
from models.attraction import *

attraction_blueprint =Blueprint("attraction",__name__)

@attraction_blueprint.route("/api/attractions", methods=["GET"])
def get_attractions_api():
    page = int(request.args.get("page", 0))
    keyword = request.args.get("keyword", "")
    per_page = 12
    
    attractions = get_attractions(page, per_page, keyword)   
    for attraction in attractions:
        images_str = attraction["images"]
        image_list = json.loads(images_str)
        attraction["images"] = image_list
    
    response = {
        "nextPage": page + 1 if len(attractions) >= per_page else None,
        "data": attractions
    }
    
    return jsonify(response), 200

@attraction_blueprint.route("/api/attraction/<int:attractionId>", methods=["GET"])
def get_attraction_api(attractionId):
    attraction = get_attraction(attractionId)
    
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

@attraction_blueprint.route("/api/mrts", methods=["GET"])
def get_mrt_stations_api():
    try:
        mrt_list = get_mrt_stations()
        response = {
            "data": mrt_list
        }
        return jsonify(response), 200

    except AttractionsError as ae:
        error_response = {
            "error": True,
            "message": str(ae)
        }
        return jsonify(error_response), 500