var express = require('express');
var app = express();
var auth = require('./controllers/auth')
var products = require('./controllers/products')
// const io = require('socket.io')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors')
var con = require('./connections/conn')
const bodyParser = require('body-parser');
var authenticator = require('./services/authenticator');

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on("chat", (data, cb) => {
        console.log("msg received", data)
        io.emit("chat", data);
    });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(auth);
app.use(authenticator.validateMiddleware)
app.use(products)

http.listen(8060, function () {
    console.log("I am running on 8060")
});



