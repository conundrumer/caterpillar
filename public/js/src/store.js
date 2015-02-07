// this is not the final api, i'm literally hacking this
var store = {
    // example data, please change!
    data: [{
        id: 'davidlu',
        position: {
            x: 10,
            y: 20
        },
        heading: 0 // radians
    }],
    // change onChange to your callback
    onChange: function(data) {},
    onNewData: function(data) {
        this.data = data;
        this.trigger(data);
    },
    trigger: function(data) {
        // lol useless indirection
        this.onChange(data);
    }
};

var MOVE_AMOUNT = 5;
var X_BOUNDS = 500;
var Y_BOUNDS = 500;

// example state changes
setInterval(function() {
    var data = store.data;
    data = data.map(function(d) {
        heading = (d.heading + (Math.random() - 0.5)/5)%(2*Math.PI);
        x = d.position.x + MOVE_AMOUNT*Math.cos(d.heading);
        y = d.position.y + MOVE_AMOUNT*Math.sin(d.heading);
        x %= X_BOUNDS;
        y %= Y_BOUNDS;
        return {
            id: d.id,
            position: {
                x: x,
                y: y
            },
            heading: heading
        }
    })
    store.onNewData(data);
}, 500);

module.exports = store;
