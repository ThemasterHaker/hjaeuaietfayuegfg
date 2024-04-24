from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)

valid_users = {
    'George': 'george1',
    'Pablo': 'pablo1'
}

@app.route('/')
def index():
    return send_from_directory('templates', 'login.html')

@app.route('/chatroom')
def chatroom():
    return send_from_directory('templates', 'chatroom.html')

@app.route('/log-message', methods=['POST'])
def log_message():
    data = request.get_json()
    username = data['username']
    message = data['message']
    
    if username in valid_users:
        with open('message_log.txt', 'a') as f:
            f.write(f'{username}: {message}\n')
        return '', 204
    else:
        return 'Unauthorized', 401

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    
    if username in valid_users and valid_users[username] == password:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return 'Invalid username or password', 401

@app.route('/get-messages')
def get_messages():
    with open('message_log.txt', 'r') as f:
        messages = f.readlines()
    return jsonify(messages)

if __name__ == '__main__':
    app.run(debug=True)
