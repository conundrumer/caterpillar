var NOSE = {
    LEFT: 35,
    RIGHT: 39,
    TOP: 33,
    BOTTOM: 37
}
var MOUTH = {
    TOP: 60,
    BOTTOM: 57
}
var EYEBROW = {
    LEFT: 22,
    RIGHT: 18
}
var EYE = {
    LEFT: 25,
    RIGHT: 30
}
var JAW = {
    LEFT: 0,
    RIGHT: 14,
    BOTTOM: 7
}

function dist(p1, p2) {
    var dx = p1[0] - p2[0];
    var dy = p1[1] - p2[1];
    return Math.sqrt(dx*dx + dy*dy);
}

function angle(p1, p2) {
    var dx = p1[0] - p2[0];
    var dy = p1[1] - p2[1];
    return Math.atan2(dy, dx);
}

var features = {
    setTracker: function(tracker) {
        this.tracker = tracker;
    },
    isAvailable: function() {
        return !!this.tracker.getPositions();
    },
    getMouth: function() {
        var pos = this.tracker.getPositions();
        var height = dist(pos[MOUTH.TOP], pos[MOUTH.BOTTOM]);
        return height / this.getEyesWidth();
    },
    getEyebrows: function() {
        var pos = this.tracker.getPositions();
        var heightLeft = dist(pos[EYE.LEFT], pos[EYEBROW.LEFT])
        var heightRight = dist(pos[EYE.RIGHT], pos[EYEBROW.RIGHT])
        return 0.5 * (heightLeft + heightRight) / this.getEyesWidth();
    },
    getTilt: function() {
        var pos = this.tracker.getPositions();
        return angle(pos[EYE.RIGHT], pos[EYE.LEFT]);
    },
    getNoseWidth: function() {
        var pos = this.tracker.getPositions();
        return dist(pos[NOSE.LEFT], pos[NOSE.RIGHT]);
    },
    getEyesWidth: function() {
        var pos = this.tracker.getPositions();
        return dist(pos[EYE.LEFT], pos[EYE.RIGHT]);
    },
    getBoundingBox: function() {
        var pos = this.tracker.getPositions();
        var middleJaw = [
            (pos[JAW.LEFT][0] + pos[JAW.RIGHT][0])/2,
            (pos[JAW.LEFT][1] + pos[JAW.RIGHT][1])/2
        ];
        var center = [
            (3*middleJaw[0] + pos[JAW.BOTTOM][0])/4,
            (3*middleJaw[1] + pos[JAW.BOTTOM][1])/4
        ]
        var width = dist(pos[JAW.LEFT], pos[JAW.RIGHT])
        return {
            center: center,
            width: width,
            tilt: this.getTilt()
        }
    }
}

module.exports = features;
