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
    var wiggleProp = Math.min(Math.max(data.eyebrows*10,0),1);
    var wiggleColor = getColorForPercentage(wiggleProp);
    wiggleColor = "rgba(" + wiggleColor.join(",") + ",0.5)";
    $("#wiggle").css("background-color", wiggleColor);


    var eatedProp = Math.min(Math.max(data.mouth*10,0),1);
    var eatedColor = getColorForPercentage(eatedProp);
    eatedColor = "rgba(" + eatedColor.join(",") + ",0.5)";
    $("#eated").css("background-color", eatedColor);

    if (data.tilt >= 0) {
        var leftProp = data.tilt;
        var leftColor = getColorForPercentage(leftProp);
        leftColor = "rgba(" + leftColor.join(",") + ",0.5)";
        $("#left").css("background-color", leftColor);
    }

    if (data.tilt <= 0) {
        var rightProp = Math.abs(data.tilt);
        var rightColor = getColorForPercentage(rightProp);
        rightColor = "rgba(" + rightColor.join(",") + ",0.5)";
        $("#right").css("background-color", rightColor);
    }
}

function onTrackerSuccess() {
    console.log('got tracking!');
    $("#go-shadow")[0].hidden = false;
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
        position: {x:200, y:300},
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
    $(".move").on('click', function() {
        alert("Stop clicking me you dingaling and use your face (and brain. if you had one.)")
    });
};

store.onChange = function(data) {
    // console.log(data[0].id, data[0].position, data[0].heading);
};

function loadGamePage(callback) {
    $("#go-btn").remove();
    $("#game-canvas").remove();

    callback();
};

function startGame() {
    $('#go-shadow').addClass('hidden');
    loadGamePage(function() {
        $('#audio-src')[0].play();
        // console.log($('#audio-src')[0]);
        var uuid = generateUUID();
        var socket = io.connect();
        console.log('connecting');
        socket.on('connect', function() {
            console.log('game session connected');
            socket.emit('init', uuid);
        });
        socket.on('connect_error', function(err) {
            console.error(err);
        });
        socket.on('disconnect', function() {
            console.log('disconnected');
        });

        // gesture.init(features, GESTURE_SAMPLE_PERIOD, function(data) {
        //     flasher(data);
        //     socket.emit('gesture', data);
        // });
        gesture.cb = function(data) {
            flasher(data);
            socket.emit('gesture', data);
        }

        faceCapture.cb = function(data) {
            socket.emit('face_img', data);
        };

        socket.on('state', function(state){
            $('#food-bar').val(state.players[uuid].food);
            console.log($('#food-bar').val());
            // blah
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
    { pct: 0.0, color: { r: 255, g: 255, b: 255 } },
    { pct: 0.25, color: { r: 191, g: 242, b: 255 } },
    { pct: 0.5, color: { r: 128, g: 230, b: 255 } },
    { pct: 0.75, color: { r: 64, g: 217, b: 255 } },
    { pct: 1.0, color: { r: 0, g: 204, b: 255 } } ];

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

