
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    brackets = require('brackets'),
    app = express(),
    server = http.createServer(app);

app.get('/', function(req, res) {
  res.send('Hello world');
});

var bracketsOpts = {
  projectsDir: path.join(__dirname, '..'),
  supportDir:  path.join(__dirname, '..', '/support')
};
brackets(server, bracketsOpts);

server.listen(3000);
console.log('Brackets is avarialable on http://localhost:3000/brackets/');
