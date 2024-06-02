// chat.js
document.addEventListener('DOMContentLoaded', function() {
    const createRoomForm = document.getElementById('createRoomForm');

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
            .then(response => response.json())
            .then(data => {
                window.location.href = '/' + data.roomName; // Redirect to the new room
            })
            .catch(error => console.error('Error:', error));
        });
    }
});
