from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

DATA_DIR = "data"
USERS_FILE = f"{DATA_DIR}/users.csv"
ATTENDANCE_FILE = f"{DATA_DIR}/attendance.csv"
PROJECTS_FILE = f"{DATA_DIR}/projects.csv"
CHAT_FILE = f"{DATA_DIR}/chat.csv"

os.makedirs(DATA_DIR, exist_ok=True)

# -------------------- UTIL --------------------
def file_exists(file):
    return os.path.isfile(file)

def write_csv(file, header, row):
    file_new = not file_exists(file)
    with open(file, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if file_new:
            writer.writerow(header)
        writer.writerow(row)

def read_csv(file):
    if not file_exists(file):
        return []
    with open(file, "r", encoding="utf-8") as f:
        return list(csv.DictReader(f))

# -------------------- AUTH --------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    write_csv(
        USERS_FILE,
        ["id", "name", "year", "batch", "password"],
        [data["id"], data["name"], data["year"], data["batch"], data["password"]]
    )
    return jsonify({"message": "User registered"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    users = read_csv(USERS_FILE)
    for u in users:
        if u["id"] == data["id"] and u["password"] == data["password"]:
            return jsonify(u), 200
    return jsonify({"error": "Invalid credentials"}), 401

# -------------------- ATTENDANCE --------------------
@app.route("/users", methods=["GET"])
def get_users():
    users = []
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                users.append(row)
    return jsonify(users)

@app.route("/attendance", methods=["POST"])
def save_attendance():
    data = request.json
    write_csv(
        ATTENDANCE_FILE,
        ["date", "topic", "taken_by", "member", "status"],
        [
            data["date"],
            data["topic"],
            data["taken_by"],
            data["member"],
            data["status"]
        ]
    )
    return jsonify({"message": "Attendance saved"}), 201

@app.route("/attendance", methods=["GET"])
def get_attendance():
    return jsonify(read_csv(ATTENDANCE_FILE))

# -------------------- PROJECTS --------------------
@app.route("/projects", methods=["POST"])
def add_project():
    data = request.json
    write_csv(
        PROJECTS_FILE,
        ["id", "name", "type", "members", "start", "end", "link"],
        [
            int(datetime.now().timestamp()),
            data["name"],
            data["type"],
            data["members"],
            data["start"],
            data.get("end", ""),
            data.get("link", "")
        ]
    )
    return jsonify({"message": "Project added"}), 201

@app.route("/projects", methods=["GET"])
def get_projects():
    return jsonify(read_csv(PROJECTS_FILE))

# -------------------- CHAT --------------------
@app.route("/chat", methods=["POST"])
def send_message():
    data = request.json
    write_csv(
        CHAT_FILE,
        ["sender", "message", "time"],
        [
            data["sender"],
            data["message"],
            datetime.now().strftime("%H:%M")
        ]
    )
    return jsonify({"message": "Message sent"}), 201

@app.route("/chat", methods=["GET"])
def get_chat():
    return jsonify(read_csv(CHAT_FILE))

# -------------------- RUN --------------------
if __name__ == "__main__":
    app.run(debug=True)
