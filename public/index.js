document.addEventListener('DOMContentLoaded', function() {
    const createRoomForm = document.getElementById('createRoomForm');
    const messageForm = document.getElementById('messageForm');

    if (createRoomForm) {
        createRoomForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const roomName = document.getElementById('roomName').value;
            fetch('/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roomName })
            })
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    return response.json();
                }
            })
            .then(data => {
                if (data && data.roomName) {
                    window.location.href = '/' + data.roomName; 
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nickname = document.getElementById('nickname').value;
            const text = document.getElementById('messageText').value;
            const roomName = window.location.pathname.split('/')[1]; 

            fetch(`/${roomName}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nickname, text })
            })
            .then(response => response.json())
            .then(message => {
                console.log('Message sent', message);
                fetchMessages();  
            })
            .catch(error => console.error('Error:', error));
        });
    }

    if (window.location.pathname !== '/') {
        setInterval(fetchMessages, 3000);
    } else {
        fetchRooms();
    }
});

const displayedMessages = new Set();

function fetchMessages() {
    const roomName = window.location.pathname.split('/')[1]; 
    if (!roomName) return; 
    console.log('Fetching messages for room:', roomName); 
    fetch(`/${roomName}/messages`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(messages => {
        const messagesContainer = document.getElementById('messages');
        messages.forEach(msg => {
            if (!displayedMessages.has(msg._id)) {
                displayedMessages.add(msg._id);
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.innerHTML = `<strong>${msg.nickname}</strong>: ${msg.text} - <small>${new Date(msg.timestamp).toLocaleTimeString()}</small>`;
                messagesContainer.appendChild(messageElement);
            }
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight; 
    })
    .catch(error => console.error('Error fetching messages:', error));
}

function fetchRooms (){
    fetch('/api/rooms')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(rooms => {
        const roomsContainer = document.getElementById('roomList');
        rooms.forEach(room => {
            const roomElement = document.createElement('div');
            roomElement.classList.add('room');
            roomElement.innerHTML = `<a href="/${room.name}">${room.name}</a>`;
            roomsContainer.appendChild(roomElement);
        });
    })
    .catch(error => console.error('Error fetching rooms:', error));
}