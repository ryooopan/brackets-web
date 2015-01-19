
var express  = require('express'),
    http     = require('http'),
    path     = require('path'),
    brackets = require('brackets'),
    socketio = require('socket.io');

var app      = express(),
    server   = http.createServer(app),
    io       = socketio.listen(server);

app.get('/', function(req, res) {
  res.send('Hello world');
});

var bracketsOpts = {
  projectsDir: path.join(__dirname, '..'),
  supportDir:  path.join(__dirname, './support')
};
brackets(server, bracketsOpts);

server.listen(3000, function() {
  console.log('You can access Brackets on http://localhost:3000/brackets/');
});

io.sockets.on('connection', function(socket) {
  var address = socket.handshake.address;
  console.log('connected from ' + address.address + ':' + address.port);

  socket.on('msg', function(data) {
    console.log(data);
    io.sockets.emit('msg', data);
  });

  socket.on('disconnect', function () {
    console.log("disconnectted from " + address.address + ":" + address.port)
  });
});
