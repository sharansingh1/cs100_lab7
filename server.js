// import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const { MongoClient } = require('mongodb');
// Import the express-handlebars
const { engine } = require('express-handlebars');
const path = require('path');

// import handlers
const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');
const { roomIdGenerator } =  require('./util/roomIdGenerator.js')
const app = express();
const port = 8080;
const uri = "mongodb+srv://ssing288:5K9QeJCD47KpQHmt@cluster0.fuhnjvj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
// view engine setup
app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views/layouts')
}));app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// set up stylesheets route

// TODO: Add server side code

// Create controller handlers to handle requests at each endpoint
app.get('/', homeHandler.getHome);
app.get('/:roomName', roomHandler.getRoom);

app.post('/create', (req, res) => {
    const roomName = req.body.roomName || roomIdGenerator();
    res.redirect('/' + roomName);
});

// NOTE: This is the sample server.js code we provided, feel free to change the structures
client.connect(err => {
    if (err) throw err;
    const db = client.db("chatroomDB");
  });
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));