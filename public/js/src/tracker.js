// globals: clm, pModel, requestAnimFrame

var tracker = {
    getPositions: function() {},
    getScore: function() {},
    init: function(success, fail) {

        var vid = document.getElementById('videoel');
        var overlay = document.getElementById('overlay');
        var overlayCC = overlay.getContext('2d');

        var ctrack = new clm.tracker({useWebGL : true});
        ctrack.init(pModel);

        function enablestart() {
            success();
            tracker.getPositions = function () {
                return ctrack.getCurrentPosition();
            };
            tracker.getScore = function() {
                return ctrack.getScore();
            };
            // var startbutton = document.getElementById('startbutton');
            // startbutton.value = "start";
            // startbutton.disabled = null;

            startVideo();
        }

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

        // check for camerasupport
        if (navigator.getUserMedia) {
            // set up stream

            var videoSelector = {video : true};
            if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
                var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
                if (chromeVersion < 20) {
                    videoSelector = "video";
                }
            };

            navigator.getUserMedia(videoSelector, function( stream ) {
                if (vid.mozCaptureStream) {
                    vid.mozSrcObject = stream;
                } else {
                    vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
                }
                vid.play();
            }, function() {
                // insertAltVideo(vid);
                // document.getElementById('gum').className = "hide";
                // document.getElementById('nogum').className = "nohide";
                // alert("There was some problem trying to fetch video from your webcam");
                fail("There was some problem trying to fetch video from your webcam");
            });
        } else {
            // insertAltVideo(vid);
            // document.getElementById('gum').className = "hide";
            // document.getElementById('nogum').className = "nohide";
            // alert("Your browser does not seem to support getUserMedia");
            fail("Your browser does not seem to support getUserMedia");
        }

        vid.addEventListener('canplay', enablestart, false);

        function startVideo() {
            // start video
            vid.play();
            // start tracking
            ctrack.start(vid);
            // start loop to draw face
            drawLoop();
        }

        function drawLoop() {
            requestAnimFrame(drawLoop);
            overlayCC.clearRect(0, 0, 400, 300);
            //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
            if (ctrack.getCurrentPosition()) {
                ctrack.draw(overlay);
            }
        }
    }
}
module.exports = tracker;
