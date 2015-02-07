var io = require('socket.io-client');
var store = require('./store');
var tracker = require('./tracker');

function onTrackerSuccess() {
    console.log('got tracking!');
    makeCaterpillar();
}

function onTrackerFail(message) {
    console.log('failed to get tracking!', message);
}

function makeCaterpillar() {
	canvas = $("#game-canvas")[0];
	var ctx = canvas.getContext("2d");
	ctx.font = "30px Arial";
	ctx.fillText("Nice to meet you.",10,50);
	$("#go-btn")[0].hidden = false;
}

window.onload = function() {
    console.log('hey there!!');
    $("#go-btn").on('click', startGame);
    tracker.onUpdate = function(data) {
    	console.log(data);
    }
    tracker.init(onTrackerSuccess, onTrackerFail);
};

store.onChange = function(data) {
    console.log(data[0].id, data[0].position, data[0].heading);
};

function startGame() {
	// tell server to add the caterpillar
	loadGamePage();
};

function loadGamePage() {
	$("#go-btn").remove();
	canvas = $("#game-canvas")[0];
	var ctx = canvas.getContext("2d");
	ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
};
