
var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io').listen(8080);

var brackets = require('brackets');
var bracketsOpts = {
  projectsDir: path.join(__dirname, '..'),
  supportDir:  path.join(__dirname, './support')
};
brackets(http, bracketsOpts);

app.get('/', function(req, res) {
  res.send('Hello world');
});

io.on('connection', function(socket) {
  var address = socket.handshake.address;
  console.log('connected from ' + address.address + ':' + address.port);

  socket.on('pos', function(data) {
    console.log(data);
    io.sockets.emit('pos', data);
  });

  socket.on('msg', function(data) {
    console.log(data);
    io.sockets.emit('msg', data);
  });

  socket.on('disconnect', function () {
    console.log("disconnectted from " + address.address + ":" + address.port)
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
