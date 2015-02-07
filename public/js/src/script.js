var io = require('socket.io-client');
var store = require('./store');
var tracker = require('./tracker');
var features = require ('./features');

function onTrackerSuccess() {
    console.log('got tracking!');
    // setTimeout(function() {
    //     console.log(tracker.getPositions())
    //     console.log(tracker.getScore())
    // }, 1000);
    features.setTracker(tracker);
    setInterval(function() {
        console.log('mouth', features.getMouth());
        console.log('eyebrows', features.getEyebrows());
        console.log('tilt', features.getTilt());
    }, 500);
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
