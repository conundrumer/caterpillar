var io = require('socket.io-client');
var store = require('./store');
var tracker = require('./tracker');
var features = require ('./features');
var gesture = require('./gesture');
var faceCapture = require('./face-capture');

var GESTURE_SAMPLE_PERIOD = 200;

function onTrackerSuccess() {
    console.log('got tracking!');
    // setTimeout(function() {
    //     console.log(tracker.getPositions())
    //     console.log(tracker.getScore())
    // }, 1000);
    features.setTracker(tracker);
    gesture.init(features, GESTURE_SAMPLE_PERIOD, function(data) {
        // console.log(data)
        // console.log(tracker.getScore());
        if (data.eyebrows > 0) {
            console.log ('eyebrow wiggle', data.eyebrows);
        }
        if (data.mouth > 0) {
            console.log('omnomnom', data.mouth);
        }
    });
    faceCapture.init(features, GESTURE_SAMPLE_PERIOD);
}

function onTrackerFail(message) {
    console.log('failed to get tracking!', message);
}

window.onload = function() {
    console.log('hey there!!');
    tracker.onUpdate = function(data) {
        console.log(data);
    }
    tracker.init(onTrackerSuccess, onTrackerFail);
};

store.onChange = function(data) {
    // console.log(data[0].id, data[0].position, data[0].heading);
}
