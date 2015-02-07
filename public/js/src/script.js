var io = require('socket.io-client');
var store = require('./store');

window.onload = function() {
    console.log('hey there!!');
    $("#dummy-webcam").on('click', makeCaterpillar);
    $("#go-btn").on('click', startGame);
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



