var FACE_RATIO = 4/3;
var K = 1.6; //god damn canvas doing weird scaling
var WIDTH = 30;
var HEIGHT = 40;

module.exports = {
    init: function(features, period) {
        this.features = features;
        this.canvas = document.getElementById('face');
        this.ctx = this.canvas.getContext('2d');
        this.video = document.getElementById('videoel');
        this.interval = setInterval(this.render.bind(this), period);
        // this.prevRotation = 0;
    },
    render: function() {
        // this.ctx.restore();
        // this.ctx.scale(0.5,0.5);
        if(!this.features.isAvailable()) return;
        var box = this.features.getBoundingBox();
        var left = box.center[0] - box.width/2;
        var top = box.center[1] - box.width/2 * FACE_RATIO;
        var width = box.width;
        var height = box.width * FACE_RATIO;

        this.ctx.save();

        this.ctx.translate(WIDTH/2, HEIGHT/2);
        // this.ctx.rotate(this.prevRotation);
        this.ctx.rotate(-box.tilt);

        this.ctx.translate(-WIDTH/2, -HEIGHT/2);
        // this.prevRotation = box.tilt;
        this.ctx.drawImage(this.video,
            K*left, K*top, K*width, K*height,
            // 0, 0, 1.6*400, 1.6*300,
            0, 0, WIDTH, HEIGHT);
        this.ctx.restore();
    }
}
