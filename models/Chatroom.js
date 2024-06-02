const mongoose = require('mongoose');


const chatroomSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    roomID: {type: String, required: true, unique: true}

});

module.exports = mongoose.model('Chatroom', chatroomSchema);