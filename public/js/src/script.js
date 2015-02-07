var io = require('socket.io-client');
var store = require('./store');
var tracker = require('./tracker');
var features = require ('./features');
var gesture = require('./gesture');
var tween = require('./tween');
// var paper = require('./paper-core.min.js');
// var movement = require('./movement');

var GESTURE_SAMPLE_PERIOD = 200;

var eated = 0;
var wiggled = 0;

function onTrackerSuccess() {
    console.log('got tracking!');
    makeCaterpillar();
    // setTimeout(function() {
    //     console.log(tracker.getPositions())
    //     console.log(tracker.getScore())
    // }, 1000);
    features.setTracker(tracker);
    gesture.init(features, GESTURE_SAMPLE_PERIOD, function(data) {
        // console.log(data)
        // console.log(tracker.getScore());
        if (data.eyebrows > 0) {
            // console.log ('eyebrow wiggle', data.eyebrows);
            wiggled += data.eyebrows;
            // console.log('wiggled', wiggled);
            $("#wiggle-bar")[0].value = wiggled;
        }
        if (data.mouth > 0) {
            // console.log('omnomnom', data.mouth);
            eated += data.mouth;
            // console.log('eated', eated);
            $("#eated-bar")[0].value = eated;
        }
    });
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
    // console.log(data[0].id, data[0].position, data[0].heading);
    // sperm.draw();
	// canvas = $("#game-canvas")[0];
	// var ctx = canvas.getContext("2d");
	// ctx.clearRect (0, 0, canvas.width, canvas.height);
};

function startGame() {
	// tell server to add the caterpillar
	loadGamePage();
};

function loadGamePage() {
	$("#go-btn").remove();
	canvas = $("#game-canvas")[0];
	var ctx = canvas.getContext("2d");
	ctx.clearRect (0, 0, canvas.width, canvas.height);
};
