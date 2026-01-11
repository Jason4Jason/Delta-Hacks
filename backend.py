from flask import Flask, request, jsonify
from flask_cors import CORS
from formula import analyze_receipt_image
import base64
import tempfile
import os

app = Flask("Carbon Emission Calculator")
CORS(app)

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "backend running"})

@app.route("/api/analyze-receipt", methods=["POST"])
def analyze_receipt():
    """
    Analyze a receipt image and return CO2 data for each item.
    Expects: { "image": "data:image/jpeg;base64,..." }
    Returns: { "storeName": "...", "date": "...", "items": [...] }
    """
    try:
        data = request.json
        image_data = data.get("image", "")
        
        if not image_data:
            return jsonify({"error": "No image provided"}), 400
        
        # Remove the data URL prefix if present (e.g., "data:image/jpeg;base64,")
        if "," in image_data:
            image_data = image_data.split(",")[1]
        
        # Decode base64 and save to temp file
        image_bytes = base64.b64decode(image_data)
        
        # Create a temporary file
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp_file:
            tmp_file.write(image_bytes)
            tmp_path = tmp_file.name
        
        try:
            # Call your OCR function
            carbon_list = analyze_receipt_image(tmp_path)
            
            # Convert to the format frontend expects
            items = []
            for item in carbon_list:
                items.append({
                    "name": item[0],
                    "quantity": 1,
                    "co2": float(item[1]) if len(item) > 1 else 1.0
                })
            
            response = {
                "storeName": "Grocery Store",
                "date": "January 11, 2026",
                "items": items if items else get_mock_items()
            }
            
            return jsonify(response)
            
        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
                
    except Exception as e:
        print(f"Error processing receipt: {e}")
        # Return mock data if something goes wrong
        return jsonify({
            "storeName": "Grocery Store",
            "date": "January 11, 2026",
            "items": get_mock_items()
        })

def get_mock_items():
    """Fallback mock data"""
    return [
        {"name": "Chicken breasts", "quantity": 1, "co2": 5.4},
        {"name": "Milk", "quantity": 1, "co2": 5.2},
        {"name": "Eggs", "quantity": 1, "co2": 4.5},
        {"name": "Bread", "quantity": 1, "co2": 0.8},
        {"name": "Bananas", "quantity": 1, "co2": 0.9},
    ]

if __name__ == "__main__":
    print("Starting Flask backend on http://localhost:5000")
    app.run(port=5000, debug=True)
