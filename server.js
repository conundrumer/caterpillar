var express = require('express');
var game = require('./core/game');

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

var TILT_FACTOR = 0.4;
var STRIDE_FACTOR = 70;
var EAT_FACTOR = 30;

io.on('connection', function(socket) {
    socket.on('init', function(uuid) {
        console.log('connected', uuid);
        game.connect(uuid);
        var i = setInterval(function() {
            // var player = game.getPlayer(uuid);
            // console.log(player.food, player.position, player.heading);
            // console.log('holes', game.getHoles());
            socket.emit('state', {
                players: game.getPlayers(),
                holes: game.getHoles(),
                foods: game.getFoods()
            })
        }, 100)

        socket.on('gesture', function(data) {
            // console.log ('received gesture, tilt', data.tilt)
            var rotation = TILT_FACTOR * data.tilt;
            var stride = STRIDE_FACTOR * data.eyebrows;
            game.move(uuid, stride);
            if (stride > 0) {
                game.rotate(uuid, -rotation);
            }
            var eatAmount = data.mouth;
            if (eatAmount > 0) {
                game.eat(uuid, EAT_FACTOR*eatAmount);
            }
        });
        socket.on('face_img', function(data) {
            // console.log('received face_img', data.length)
            game.setImg(uuid, data);
        });
        socket.on('disconnect', function() {
            console.log('disconencted', uuid);
            clearInterval(i);
            game.disconnect(uuid);
        })
    })
});
