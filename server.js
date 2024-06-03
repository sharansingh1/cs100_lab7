// import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { engine } = require('express-handlebars');
const path = require('path');

// import handlers
const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');
const Chatroom = require('./models/Chatroom'); 
const Message = require('./models/Message'); 
const { roomIdGenerator } = require('./util/roomIdGenerator.js');

const app = express();
const port = 8080;
const uri = "mongodb+srv://ssing288:5K9QeJCD47KpQHmt@cluster0.fuhnjvj.mongodb.net/chatroomDB?retryWrites=true&w=majority";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
// view engine setup
app.engine('hbs', engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: path.join(__dirname, 'views/layouts') }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// TODO: Add server side code

// Create controller handlers to handle requests at each endpoint
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
          return res.status(404).json({ message: 'room doesnt exist' });
      }

      const message = new Message({ roomID: chatroom.roomID, nickname, text });
      await message.save();
      res.json(message);  
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.get('/:roomName/messages', async (req, res) => {
  try {
      const roomName = req.params.roomName;
      const chatroom = await Chatroom.findOne({ name: roomName });

      if (!chatroom) {
          return res.status(404).json({ message: 'room doesnt exist' });
      }

      const messages = await Message.find({ roomID: chatroom.roomID }).sort({ timestamp: 1 });
      res.json(messages);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// NOTE: This is the sample server.js code we provided, feel free to change the structures
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(port, () => console.log(`Server listening on http://localhost:${port}`)))
    .catch(err => console.error("cant connect to mongo", err));
