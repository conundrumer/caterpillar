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

function flasher(data) {
    // wiggled += data.eyebrows;
    // $("#wiggle-bar")[0].value = wiggled;
    wiggleProp = Math.min(Math.max(data.eyebrows*10,0),1);
    wiggleColor = getColorForPercentage(wiggleProp);
    wiggleColor = rgbToHex(wiggleColor[0], wiggleColor[1], wiggleColor[2]);
    $("#wiggle").css("background-color", wiggleColor);  

    // eated += data.mouth;
    // $("#eated-bar")[0].value = eated;
    eatedProp = Math.min(Math.max(data.mouth*10,0),1);
    eatedColor = getColorForPercentage(eatedProp);
    eatedColor = rgbToHex(eatedColor[0], eatedColor[1], eatedColor[2]);
    $("#eated").css("background-color", eatedColor);    

    if (data.tilt >= 0) {
        leftProp = data.tilt;
        leftColor = getColorForPercentage(leftProp)
        leftColor = rgbToHex(leftColor[0], leftColor[1], leftColor[2]);
        $("#left").css("background-color", leftColor);
    }

    if (data.tilt <= 0) {
        rightProp = Math.abs(data.tilt);
        rightColor = getColorForPercentage(rightProp)
        rightColor = rgbToHex(rightColor[0], rightColor[1], rightColor[2]);
        $("#right").css("background-color", rightColor);
    }
}

function onTrackerSuccess() {
    // var uuid = generateUUID();
    console.log('got tracking!');
    $("#go-btn")[0].hidden = false;
    // setTimeout(function() {
    //     console.log(tracker.getPositions())
    //     console.log(tracker.getScore())
    // }, 1000);
    features.setTracker(tracker);
    faceCapture.init(features, GESTURE_SAMPLE_PERIOD, function(data) {
        updateCaterpillarFace(data);
    });

    gesture.init(features, GESTURE_SAMPLE_PERIOD, function(data) {
        flasher(data);
    });
}

function onTrackerFail(message) {
    console.log('failed to get tracking!', message);
}

function updateCaterpillarFace(data) {
    var props = {
        heading: Math.PI,
        position: {x:300, y:300},
        img: data,
        size: 3
    };
    view.renderPlayer(props, document.getElementById('react-container'));
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

function loadGamePage(callback) {
    $("#go-btn").remove();
    $("#game-canvas").remove();

    // $('#canvas-container').append("<div id='react-container'></div>");
    callback();
};

function startGame() {
    loadGamePage(function() {
        var uuid = generateUUID();
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
        gesture.init(features, GESTURE_SAMPLE_PERIOD, function(data) {
            flasher(data);
            socket.emit('gesture', data);
        });

        faceCapture.cb = function(data) {
            // console.log('img', data.length)
            socket.emit('face_img', data);
        };

        socket.on('state', function(state){
            view.render(state,document.getElementById('react-container'));
        });
    });
};

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var percentColors = [
    { pct: 0.0, color: { r: 252, g: 143, b: 104 } },
    { pct: 0.25, color: { r: 253, g: 107, b: 78 } },
    { pct: 0.5, color: { r: 254, g: 72, b: 52 } },
    { pct: 0.75, color: { r: 254, g: 36, b: 26 } },
    { pct: 1.0, color: { r: 255, g: 0, b: 0 } } ];

var getColorForPercentage = function(pct) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return [color.r, color.g, color.b];
    // or output as hex if preferred
} 

