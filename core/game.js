var WIDTH = 500;
var HEIGHT = 500;
// var SUBDIVISIONS = 10;
var HOLE_MAX_SIZE = 11;

var FOOD_SIZE = 11;
var DEFAULT_FOOD_AMOUNT = 4;
var NUM_FOOD = 4;
var FOOD_RADIUS = 20;

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
        x = (x+WIDTH)%WIDTH;
        y = (y+HEIGHT)%HEIGHT;
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

function Food() {
    this.position = {
        x: WIDTH * Math.random(),
        y: HEIGHT * Math.random()
    }
    this.size = DEFAULT_FOOD_AMOUNT;
}

Food.prototype.getConsumed = function(amount) {
    var oldSize = this.size;
    this.size = Math.max(0, this.size - amount);
    return oldSize - this.size;
}

var players = {};

var holes = [];
var foods = [];
for (var i = 0; i < NUM_FOOD; i++) {
    foods.push(new Food());
}

function getTouchingHole(position) {
    return holes.filter(function(hole) {
        return dist(position, hole.position) < hole.size;
    })[0];
}

function getFood(position) {
    return foods.filter(function(food) {
        return dist(position, food.position) < FOOD_RADIUS;
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
        // var hole = getHole(player.position);
        // if (!hole) {
        //     hole = makeHole(player.position);
        // }
        // players[uuid].eat(hole.enlargen(amount));
        var food = getFood(player.position);
        if (food) {
            players[uuid].eat(food.getConsumed(amount));
            if (food.size === 0) {
                var index = foods.indexOf(food);
                if (index > -1) {
                    foods.splice(index, 1);
                    foods.push(new Food());
                }
            }
        }
    },
    setImg: function(uuid, img) {
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
    },
    getFoods: function() {
        return foods;
    }
}

module.exports = game;
