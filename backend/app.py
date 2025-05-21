from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend (React) to call Flask easily

# Dummy users
users = [
    {"id": 1, "name": "Amit"},
    {"id": 2, "name": "Neha"},
]

@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify(users)

@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.get_json()
    users.append({"id": len(users)+1, "name": data["name"]})
    return jsonify({"message": "User added successfully"}), 201

if __name__ == '__main__':
    app.run(port=5000)
