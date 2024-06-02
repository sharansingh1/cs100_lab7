// Import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { engine } = require('express-handlebars');
const path = require('path');

// Import handlers
const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');
const Chatroom = require('./models/Chatroom'); // Ensure correct path
const Message = require('./models/Message'); // Ensure correct path
const { roomIdGenerator } = require('./util/roomIdGenerator.js');

const app = express();
const port = 8080;
const uri = "mongodb+srv://ssing288:5K9QeJCD47KpQHmt@cluster0.fuhnjvj.mongodb.net/chatroomDB?retryWrites=true&w=majority";

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars setup
app.engine('hbs', engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: path.join(__dirname, 'views/layouts') }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Routes
app.get('/', homeHandler.getHome);
app.get('/:roomName', roomHandler.getRoom);

app.post('/create', (req, res) => {
  const roomName = req.body.roomName || roomIdGenerator();
  res.redirect('/' + roomName);
});


app.post('/:roomName/messages', async (req, res) => {
  try {
      const { nickname, text } = req.body;
      const roomName = req.params.roomName;
      const chatroom = await Chatroom.findOne({ name: roomName });

      if (!chatroom) {
          return res.status(404).json({ message: 'Chatroom not found' });
      }

      const message = new Message({ roomID: chatroom.roomID, nickname, text });
      await message.save();
      res.json(message);  // Ensure a response is sent back to the client
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.get('/:roomName/messages', async (req, res) => {
  try {
      const roomName = req.params.roomName;
      const chatroom = await Chatroom.findOne({ name: roomName });

      if (!chatroom) {
          return res.status(404).json({ message: 'Chatroom not found' });
      }

      const messages = await Message.find({ roomID: chatroom.roomID }).sort({ timestamp: 1 });
      res.json(messages);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// MongoDB connection and server start
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Server listening on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB", err);
    });
