

function setUp() {
	var video = document.getElementsByClassName("FC-Video")[0];
	var updateDisplay = function() {
		autoFrame(video, "jpeg")
	};
	video.addEventListener("pause", updateDisplay, false);
}


function autoFrame(video, ext) {
	var spinner = document.getElementsByClassName("Spinner")[0];
	spinner.style.display = "block";
	var callback = function(url) {
		spinner.style.display = "none";
		document.getElementsByClassName("FC-Display")[0].src = url;
	};
	frameCapture(video.currentSrc, video.currentTime, ext, callback);
}

window.addEventListener("load", setUp, false);