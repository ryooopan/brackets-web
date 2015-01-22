


var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, http = require('http')
, path = require('path');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, '.')));
app.get('/', function(req, res) {
  res.send('Hello world');
});

var server = http.createServer(app);
var socketio = require('socket.io');
//var io = socketio.listen(server);
var io = socketio.listen(8080);
var fs = require('fs');

var brackets = require('brackets');
var bracketsOpts = {
  projectsDir: path.join(__dirname, '..'),
  supportDir:  path.join(__dirname, './support')
};
brackets(server, bracketsOpts);

server.listen(app.get('port'), function() {
  console.log('listening on *:3000');
});

var socks = []
var body = '';
fs.readFile('index.html', 'utf8', function(err, data) {
  body = data;
  //console.log(body);
});

io.sockets.on('connection', function (socket) {
  socks.push(socket);
  socket.emit('refresh', {body: body});

  socket.on('refresh', function (body_) {
    console.log('new body');
    body = body_;
  });

  socket.on('change', function (op) {
    console.log(op);
    if (op.origin == '+input' || op.origin == 'paste' || op.origin == '+delete') {
      socket.broadcast.emit('change', op);
    }
  });

  socket.on('cursor', function (pos) {
    console.log(pos);
    socket.broadcast.emit('cursor', pos);
  });
});


/*
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

io.on('connection', function(socket) {
  var address = socket.handshake.address;
  console.log('connected from ' + address.address + ':' + address.port);
  socket.on('change', function(data) {
    console.log(data);
    io.sockets.emit('change', data);
  });

  socket.on('disconnect', function () {
    console.log("disconnectted from " + address.address + ":" + address.port)
  });
});

*/
