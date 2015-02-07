var io = require('socket.io-client');
var store = require('./store');

window.onload = function() {
    console.log('hey there!!');
};

store.onChange = function(data) {
    console.log(data[0].id, data[0].position, data[0].heading);
}
