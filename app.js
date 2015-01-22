
var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io').listen(8080);
var fs = require('fs');


var brackets = require('brackets');
var bracketsOpts = {
  projectsDir: path.join(__dirname, '..'),
  supportDir:  path.join(__dirname, './support')
};
brackets(http, bracketsOpts);

app.get('/', function(req, res) {
  res.send('Hello world');
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});

var socks = []
var body = '';
fs.readFile('index.html', 'utf8', function(err, data) {
  body = data;
  console.log(body);
})

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
      socks.forEach(function (sock) {
	if (sock != socket)
	  sock.emit('change', op);
      });
    };
  });
});

/*
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
