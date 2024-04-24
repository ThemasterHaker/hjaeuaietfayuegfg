function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                alert('Login successful');
                window.location.href = '/chatroom';
            } else {
                alert('Invalid username or password');
            }
        }
    };
    xhr.send(JSON.stringify({ username, password }));
}

function loadMessages(username) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/get-messages', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const messages = JSON.parse(xhr.responseText);
                const chatMessages = document.getElementById('chat-messages');
                chatMessages.innerHTML = '';

                messages.forEach(function(message) {
                    const parts = message.split(':');
                    const sender = parts[0].trim();
                    const content = parts.slice(1).join(':').trim();
                    
                    if (sender === username) {
                        const messageElement = document.createElement('div');
                        messageElement.textContent = `You: ${content}`;
                        messageElement.classList.add('self-message');
                        chatMessages.appendChild(messageElement);
                    } else {
                        const messageElement = document.createElement('div');
                        messageElement.textContent = `${sender}: ${content}`;
                        chatMessages.appendChild(messageElement);
                    }
                });
            } else {
                alert('Failed to load messages');
            }
        }
    };
    xhr.send();
}

function sendMessage() {
    const username = document.getElementById('username').value;
    const message = document.getElementById('message').value;

    if (username && message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${username}: ${message}`;
        document.getElementById('chat-messages').appendChild(messageElement);

        // Call Python script to log message
        logMessage(username, message);

        // Clear input fields
        document.getElementById('message').value = '';
    } else {
        alert('Please enter both username and message.');
    }
}

function logMessage(username, message) {
    // Make an AJAX request to Python script to log the message
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/log-message', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ username, message }));
}

// Load saved messages when the chatroom page is loaded
window.addEventListener('load', function() {
    if (window.location.pathname === '/chatroom') {
        const username = document.getElementById('username').value;
        loadMessages(username);
    }
});
