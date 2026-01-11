from flask import Flask, request, jsonify

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

if __name__ == "__main__":
    app.run(debug=True)
