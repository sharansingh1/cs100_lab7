// controllers/room.js

const roomGenerator = require('../util/roomIdGenerator.js');
const Chatroom = require('../models/Chatroom'); // Ensure this path is correct

async function getRoom(request, response) {
    const roomName = request.params.roomName;

    try {
        let room = await Chatroom.findOne({ name: roomName });

        if (!room) {
            const newRoomId = roomGenerator.roomIdGenerator();
            room = new Chatroom({
                name: roomName,
                roomID: newRoomId
            });
            await room.save();
        }

        response.render('room', { title: 'Chatroom', roomName: room.name, newRoomId: room.roomID });
    } catch (error) {
        console.error('Database operation failed', error);
        response.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getRoom
};
