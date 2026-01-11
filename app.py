from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask("Carbon Emission Calculator")
CORS(app)

# Example function endpoint
@app.route("/api/calc/square", methods=["POST"])
def square_number():
    data = request.json
    n = data.get("number")

    if n is None:
        return jsonify({"error": "number missing"}), 400

    result = n * n
    return jsonify({"input": n, "result": result})

@app.route("/api/calc/carbon emission", methods=["POST"])
def carbon_emission():
    data = request.json
    # carbon_list = 

# Example complex logic
@app.route("/api/calc/robot_speed", methods=["POST"])
def robot_speed():
    data = request.json
    rpm = data["rpm"]
    wheel_diameter = data["diameter"]

    speed = 3.14159 * wheel_diameter * rpm / 60
    return jsonify({"speed_m_per_s": speed})


if __name__ == "__main__":
    app.run(port=5000, debug=True)
