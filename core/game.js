var WIDTH = 500;
var HEIGHT = 500;
// var SUBDIVISIONS = 10;
var HOLE_MAX_SIZE = 11;

function dist(p1, p2) {
    var x = p1.x - p2.x;
    var y = p1.y - p2.y;
    return Math.sqrt(x*x+y*y);
}

function Player() {
    this.heading = Math.random() * 2 * Math.PI;
    this.position = {
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT
    }
    this.img = null;
    this.food = 0;
}

Player.prototype = {
    turn: function (rotation) {
        this.heading = (this.heading + rotation)%(2*Math.PI);
    },
    step: function(stride) {
        x = this.position.x + stride*Math.cos(this.heading);
        y = this.position.y + stride*Math.sin(this.heading);
        x %= WIDTH;
        y %= HEIGHT;
        this.position = {
            x: x,
            y: y
        }
    },
    eat: function(amount) {
        this.food += amount;
    }
}

function Hole(position) {
    this.position = position;
    this.size = 0;
}
Hole.prototype.enlargen = function(amount) {
    var oldSize = this.size;
    this.size = Math.min(HOLE_MAX_SIZE, this.size + amount);
    return this.size - oldSize;
}

var players = {};

var holes = [];

function getTouchingHole(position) {
    return holes.filter(function(hole) {
        return dist(position, hole.position) < hole.size;
    })[0];
}

function getHole(position) {
    // var row = Math.floor(position.y / HEIGHT * SUBDIVISIONS);
    // var col = Math.floor(position.x / WIDTH * SUBDIVISIONS);
    return getTouchingHole(position);
}

function makeHole(position) {
    var hole = new Hole(position);
    holes.push(hole);

    // var row = Math.floor(position.y / HEIGHT * SUBDIVISIONS);
    // var col = Math.floor(position.x / WIDTH * SUBDIVISIONS);
    return hole;
}

var game = {
    connect: function(uuid) {
        players[uuid] = new Player();
    },
    disconnect: function(uuid) {
        delete players[uuid];
    },
    rotate: function(uuid, rotation) {
        players[uuid].turn(rotation);
    },
    move: function(uuid, stride) {
        players[uuid].step(stride);
    },
    eat: function(uuid, intensity) {
        var player = players[uuid];
        var amount = intensity;
        var hole = getHole(player.position);
        if (!hole) {
            hole = makeHole(player.position);
        }
        players[uuid].eat(hole.enlargen(amount));
    },
    setImg: function(img) {
        players[uuid].img = img;
    },
    getPlayer: function(uuid) {
        return players[uuid];
    },
    getPlayers: function() {
        return players;
    },
    getHoles: function() {
        return holes;
    }
}

module.exports = game;
