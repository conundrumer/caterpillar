var WIDTH = 500;
var HEIGHT = 500;

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

var players = {};

var board = [];

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
        var amount = intensity;
        if (true) {
            players[uuid].eat(amount);
            // do something with board;
        }
    },
    setImg: function(img) {
        players[uuid].img = img;
    },
    getPlayer: function(uuid) {
        return players[uuid];
    }
}

module.exports = game;
