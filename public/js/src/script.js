var io = require('socket.io-client');
var store = require('./store');
var gesture = require('./gesture');

window.onload = function() {
    console.log('hey there!!');
    gesture.onUpdate = function(data) {
        console.log(data);
    }
    gesture.init();
};

store.onChange = function(data) {
    console.log(data[0].id, data[0].position, data[0].heading);
}
