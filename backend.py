from flask import Flask, request, jsonify
from flask_cors import CORS
from formula import main

app = Flask("Carbon Emission Calculator")
CORS(app)

@app.route("/api/calc/carbon emission", methods=["POST"])
def carbon_emission():
    data = request.json
    carbon = main(data['IMAGE PATH'])

if __name__ == "__main__":
    app.run(port=5000, debug=True)
