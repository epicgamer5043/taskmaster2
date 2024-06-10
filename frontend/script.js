let isRecording = false;
let actions = [];
let startTime = 0;
let token = '';

const startButton = document.getElementById('startRecording');
const stopButton = document.getElementById('stopRecording');
const playbackButton = document.getElementById('startPlayback');

startButton.addEventListener('click', () => {
    isRecording = true;
    startTime = Date.now();
    actions = [];
    startButton.disabled = true;
    stopButton.disabled = false;
});

stopButton.addEventListener('click', () => {
    isRecording = false;
    startButton.disabled = false;
    stopButton.disabled = true;
    saveActions();
});

playbackButton.addEventListener('click', startPlayback);

document.addEventListener('mousemove', recordAction);
document.addEventListener('click', recordAction);
document.addEventListener('keydown', recordAction);

function recordAction(event) {
    if (!isRecording) return;
    const action = {
        type: event.type,
        timestamp: Date.now() - startTime,
        x: event.clientX || 0,
        y: event.clientY || 0,
        key: event.key || null
    };
    actions.push(action);
}

async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (response.ok) {
        alert('Registered successfully!');
    } else {
        alert('Registration failed!');
    }
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
        token = data.accessToken;
        startButton.disabled = false;
        playbackButton.disabled = false;
        alert('Logged in successfully!');
    } else {
        alert('Login failed!');
    }
}

async function saveActions() {
    const response = await fetch('http://localhost:3000/api/saveActions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ actions })
    });
    if (response.ok) {
        alert('Actions saved successfully!');
    } else {
        alert('Failed to save actions!');
    }
}

async function startPlayback() {
    const repetitions = parseInt(document.getElementById('repetitions').value);
    const interval = parseInt(document.getElementById('interval').value) * 1000;
    const variableChange = parseInt(document.getElementById('variableChange').value);

    for (let i = 0; i < repetitions; i++) {
        for (const action of actions) {
            setTimeout(() => {
                performAction(action, variableChange * i);
            }, action.timestamp + interval * i);
        }
    }
}

function performAction(action, offset) {
    if (action.type === 'mousemove') {
        const event = new MouseEvent('mousemove', {
            clientX: action.x + offset,
            clientY: action.y + offset
        });
        document.dispatchEvent(event);
    } else if (action.type === 'click') {
        const event = new MouseEvent('click', {
            clientX: action.x + offset,
            clientY: action.y + offset
        });
        document.dispatchEvent(event);
    } else if (action.type === 'keydown') {
        const event = new KeyboardEvent('keydown', { key: action.key });
        document.dispatchEvent(event);
    }
}

document.getElementById('register').addEventListener('click', register);
document.getElementById('login').addEventListener('click', login);
