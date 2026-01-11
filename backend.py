from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os

app = Flask(__name__)
CORS(app)  # Enable CORS so your frontend can call this API

# Load food CO2 data from CSV
def load_food_data():
    food_data = {}
    csv_path = os.path.join(os.path.dirname(__file__), "food price FINAL(food price FINAL).csv")
    
    try:
        with open(csv_path, 'r') as file:
            reader = csv.reader(file)
            for row in reader:
                if len(row) >= 3:
                    food_name = row[0].strip().lower()
                    try:
                        co2_value = float(row[2])
                        food_data[food_name] = co2_value
                    except ValueError:
                        continue
    except FileNotFoundError:
        print(f"CSV file not found at {csv_path}")
    
    return food_data

# Load data once at startup
FOOD_CO2_DATA = load_food_data()

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "backend running", "foods_loaded": len(FOOD_CO2_DATA)})

@app.route("/api/analyze-receipt", methods=["POST"])
def analyze_receipt():
    """
    Analyze a receipt image and return CO2 data for each item.
    For now, this uses mock data - you can integrate OCR later.
    """
    data = request.json
    
    # TODO: In a real implementation, you would:
    # 1. Extract the base64 image from data["image"]
    # 2. Use OCR (Tesseract, Google Vision, or OpenAI) to read text
    # 3. Parse the receipt text to extract food items
    
    # For demo purposes, return mock data with real CO2 values from your CSV
    mock_items = [
        {"name": "Chicken breasts", "quantity": 1},
        {"name": "Milk", "quantity": 2},
        {"name": "Eggs", "quantity": 1},
        {"name": "Bread", "quantity": 1},
        {"name": "Tomatoes", "quantity": 1},
        {"name": "Ground beef", "quantity": 1},
        {"name": "Rice", "quantity": 1},
        {"name": "Bananas", "quantity": 1},
    ]
    
    # Look up CO2 values from our data
    items_with_co2 = []
    for item in mock_items:
        name_lower = item["name"].lower()
        
        # Try to find a match in our CO2 data
        co2 = 1.0  # Default value
        for food_name, food_co2 in FOOD_CO2_DATA.items():
            if name_lower in food_name or food_name in name_lower:
                co2 = food_co2
                break
        
        items_with_co2.append({
            "name": item["name"],
            "quantity": item["quantity"],
            "co2": co2
        })
    
    response = {
        "storeName": "Grocery Store",
        "date": "January 11, 2026",
        "items": items_with_co2
    }
    
    return jsonify(response)

@app.route("/api/lookup", methods=["POST"])
def lookup_food():
    """Look up CO2 value for a specific food item."""
    data = request.json
    food_name = data.get("name", "").lower()
    
    for name, co2 in FOOD_CO2_DATA.items():
        if food_name in name or name in food_name:
            return jsonify({"name": name, "co2": co2})
    
    return jsonify({"error": "Food not found"}), 404

if __name__ == "__main__":
    print(f"Loaded {len(FOOD_CO2_DATA)} food items with CO2 data")
    app.run(debug=True, host="0.0.0.0", port=5000)
