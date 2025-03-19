const socket = io();

const messageArea = document.getElementById('messageArea');
const messageInput = document.getElementById('messageInput');
const usernameInput = document.getElementById('usernameInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');

let username = null;

// Set username

function setUsername() {
    const inputUsername = usernameInput.value.trim();
    if (inputUsername) {
        username = inputUsername;
        socket.emit('setUsername', username);
        usernameInput.disabled = true;
        usernameInput.style.opacity = '0.5';
        messageInput.disabled = false;
        sendButton.disabled = false;
    }
}

// Send message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message && username) {
        socket.emit('chatMessage', message);
        messageInput.value = '';
        socket.emit('stopTyping');
    }
}

// Receive message
socket.on('chatMessage', ({ username: sender, msg, id }) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = `${sender}: ${msg}`;
    messageElement.classList.add(id === socket.id ? 'sent' : 'received');
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
});

// User connection/disconnection
socket.on('userConnected', (msg) => {
    const systemMessage = document.createElement('div');
    systemMessage.classList.add('message', 'system');
    systemMessage.textContent = msg;
    messageArea.appendChild(systemMessage);
    messageArea.scrollTop = messageArea.scrollHeight;
});

socket.on('userDisconnected', (msg) => {
    const systemMessage = document.createElement('div');
    systemMessage.classList.add('message', 'system');
    systemMessage.textContent = msg;
    messageArea.appendChild(systemMessage);
    messageArea.scrollTop = messageArea.scrollHeight;
});

// Typing indicator
let typingTimeout;
messageInput.addEventListener('input', () => {
    if (username) {
        socket.emit('typing');
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => socket.emit('stopTyping'), 1000);
    }
});

socket.on('typing', (username) => {
    typingIndicator.textContent = `${username} is typing...`;
});

socket.on('stopTyping', () => {
    typingIndicator.textContent = '';
});


// Send message on Enter key
messageInput.addEventListener('keypress', (e) =>  {
    if (e.key === 'Enter') {
        sendMessage();
    }
});


// Set username on Enter key in username input
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        setUsername();
    }
});