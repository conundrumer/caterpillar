var EYEBROWS_THRESH = 0.05;
var MOUTH_THRESH = 0.05;

var gesture = {
    init: function(features, period, cb) {
        this.features = features;
        this.interval = setInterval(this.loop.bind(this), period)
        this.cb = cb;
        this.eyebrows = null;
        this.mouth = null;
    },
    getScore: function() {
        score = Math.min(1, (this.features.tracker.getScore() - 0.3) / 0.6);
        return score * score;
    },
    loop: function() {
        if (!this.features.isAvailable()) {
            this.eyebrows = null;
            this.mouth = null;
            return;
        }

        var eyebrows = this.features.getEyebrows();
        var eyebrowsDiff = this.eyebrows === null ? 0 : Math.abs(eyebrows - this.eyebrows);
        eyebrowsDiff = Math.max(0, eyebrowsDiff - EYEBROWS_THRESH);

        var mouth = this.features.getMouth();
        var mouthDiff = this.mouth === null ? 0 : Math.abs(mouth - this.mouth);
        mouthDiff = Math.max(0, mouthDiff - MOUTH_THRESH);

        this.eyebrows = eyebrows;
        this.mouth = mouth;
        this.cb({
            eyebrows: eyebrowsDiff * this.getScore(),
            mouth: mouthDiff * this.getScore(),
            tilt: this.features.getTilt() * this.getScore()
        })
    }
}

module.exports = gesture;
