from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "backend running"})

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "pong"})

@app.route("/echo", methods=["POST"])
def echo():
    data = request.json
    return jsonify(data)

def parse_receipt(receipt_data):
    return #Outputs a receipt data

def rate_carbon(receipt_data): #everything written in receipt as parameter
    food_file = open("food price FINAL(food price FINAL).csv", 'r')
    food_list = []
    for food in food_file:
        current_food = food.strip().split(",")
        food_list.append(current_food)

    carbon_list = []
    for food in food_file:
        if food[0] in receipt_data:
            carbon_list.append([food[0], food[2]])
    print(carbon_list)

    
    return #Outputs a 2D list of food and corresponding carbon rating.

if __name__ == "__main__":
    app.run(debug=True)

