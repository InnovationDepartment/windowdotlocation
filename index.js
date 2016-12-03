var express = require('express');
var app = express();

var port = process.env.PORT || 5000;

try {
  require('./secret');
}
catch (err) {
  console.log("ERR: Could not load secret.js");
}

require('./db/db');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 3000;

mainDb.sync().then(function () {
  server.listen(port, function () {
    console.log('Server listening at port %d', port);
  });
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
  socket.on('register', function (data) {
    UserRecord.register(data).then(function (user) {
      socket.emit('registered', user);
    }).catch(function (err) {
      socket.emit('register-fail', err);
    })
  });

  socket.on('visit', function (data) {
    VisitRecord.create(data);

    socket.broadcast.emit('new-visit', data);
  });
});