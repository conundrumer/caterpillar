var express = require('express');
// var game = require('./core/game');

// Start the app / server

var app = express();
var server = app.listen(process.env.PORT || 3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});

//serve static files
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/clmtrackr'));

//views
// app.set('views', __dirname + '/../views');
// app.set('view engine', 'jade');

app.get('/', function(req, res) {
    res.sendFile('/views/index.html', {root: __dirname});
});

app.get('/admin', function(req, res) {
    res.sendFile('/views/admin.html', {root: __dirname});
});

var io = require('socket.io')(server);

io.on('connection', function(socket) {
    socket.on('gesture', function(data) {
        console.log ('received gesture', data.id)
    });
    socket.on('face_img', function(data) {
        console.log('received face_img', data.img.length)
    });
});
