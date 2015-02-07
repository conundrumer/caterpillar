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
    tracker.onUpdate = function(data) {
        console.log(data);
    }
    tracker.init(onTrackerSuccess, onTrackerFail);
};

store.onChange = function(data) {
    // console.log(data[0].id, data[0].position, data[0].heading);
}
