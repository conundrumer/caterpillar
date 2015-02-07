var io = require('socket.io-client');
var store = require('./store');
var tracker = require('./tracker');

function onTrackerSuccess() {
    console.log('got tracking!');
}

function onTrackerFail(message) {
    console.log('failed to get tracking!', message);
}

window.onload = function() {
    console.log('hey there!!');
    $("#dummy-webcam").on('click', makeCaterpillar);
    $("#go-btn").on('click', startGame);
    tracker.onUpdate = function(data) {
    	console.log(data);
    }
    tracker.init(onTrackerSuccess, onTrackerFail);
};

store.onChange = function(data) {
    console.log(data[0].id, data[0].position, data[0].heading);
};

function makeCaterpillar() {
	canvas = $("#intro-caterpillar")[0];
	var ctx = canvas.getContext("2d");
	ctx.font = "30px Arial";
	ctx.fillText("Nice to meet you.",10,50);
	$("#go-btn")[0].hidden = false;
};

function startGame() {
	// tell server to add the caterpillar
	data = {};
	loadGamePage(data);
};

function loadGamePage(data) {
	$(".intro-view").remove();
	$("#game-view")[0].hidden = false;
};
