var io = require('socket.io-client');
var store = require('./store');
var tracker = require('./tracker');
var features = require ('./features');
var gesture = require('./gesture');
var faceCapture = require('./face-capture');
var generateUUID = require('../../../utils/uuid');
var view = require('./view.jsx');

var GESTURE_SAMPLE_PERIOD = 200;

var eated = 0;
var wiggled = 0;

function onTrackerSuccess() {
    var uuid = generateUUID();
    console.log('got tracking!');
    makeCaterpillar();
    // setTimeout(function() {
    //     console.log(tracker.getPositions())
    //     console.log(tracker.getScore())
    // }, 1000);
    features.setTracker(tracker);

    var socket = io.connect();
    console.log('connecting');
    socket.on('connect', function() {
        console.log('game session connected');
        // this.sync = 0;
        // this.trigger(this.sync);
        socket.emit('init', uuid);
    });
    socket.on('connect_error', function(err) {
        console.error(err);
    });
    socket.on('disconnect', function() {
        console.log('disconnected');
    });
    // socket.on('add', LineRiderActions.addLine);
    // socket.on('remove', LineRiderActions.removeLine);
    // this.socket = socket;

    gesture.init(features, GESTURE_SAMPLE_PERIOD, function(data) {
        if (data.eyebrows > 0) {
            wiggled += data.eyebrows;
            $("#wiggle-bar")[0].value = wiggled;
        }
        if (data.mouth > 0) {
            eated += data.mouth;
            $("#eated-bar")[0].value = eated;
        }
        socket.emit('gesture', data);
    });
    faceCapture.init(features, GESTURE_SAMPLE_PERIOD, function(data) {
        // console.log('img', data.length)
        socket.emit('face_img', data);
    });

    socket.on('state', function(state){
        view.render(state,document.getElementById('react-container'));
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
