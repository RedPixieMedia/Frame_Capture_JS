/******** Globals ********/
var controls = {};
var video, updateDisplay;
/******* Functions *******/
function setUp() {
	video = document.getElementsByClassName("FC-Video")[0];
	updateDisplay = function() {
		var extElement = document.getElementsByClassName("FC-Ext")[0];
		var extension = extElement.children[extElement.selectedIndex].value;
		autoFrame(video, extension);
	};
	video.addEventListener("pause", updateDisplay, false);
	controlsSetup();
}
function controlsSetup() {
	controls = {
		pause:document.getElementsByClassName("FC-Pause")[0],
		seek:document.getElementsByClassName("FC-Seek-Display")[0],
		seekSlider:document.getElementsByClassName("FC-Seek-Slider")[0],
		seekArea:document.getElementsByClassName("FC-Seek-Slider-Area")[0],
		seekBar:document.getElementsByClassName("FC-Seek-Slider-Bar")[0],
		mute:document.getElementsByClassName("FC-Mute")[0],
		upload:document.getElementsByClassName("FC-Upload")[0],
		uploadFile:document.getElementsByClassName("FC-Upload-Input")[0],
		ext:document.getElementsByClassName("FC-Ext")[0],
		save:document.getElementsByClassName("FC-Save")[0],
		interval:0, URL:""
	}
	
	var pauseCallback = function() {
		if (video.paused) {
			video.play();
			controls.pause.children[0].textContent = "pause";
		}
		else {
			video.pause();
			controls.pause.children[0].textContent = "play_arrow";
		}
	}
	controls.pause.addEventListener("click", pauseCallback, false);
	
	var seekUpdate = function() {
		var finalDisplayTime = timeConv("display");
		var finalSeekTime = timeConv("seekBar") * 100;
		controls.seek.textContent = finalDisplayTime;
		controls.seekBar.style.left = finalSeekTime + "%";
	}
	var intervalStart = function() {
		controls.interval = setInterval(seekUpdate, "100");
	}
	var intervalStop = function() {
		clearInterval(controls.interval);
	}
	video.addEventListener("play", intervalStart, false);
	video.addEventListener("pause", intervalStop, false);
	
	function clickSlider(event) {
		event.stopPropagation();
		controls.seekArea.addEventListener("mousemove", holdSlider, false);
		var hund = controls.seekSlider.clientWidth/100;
		var offset = (window.innerWidth/100) * 10 + (hund * 25);
		var x = event.clientX - offset;
		var left = ((x / controls.seekSlider.clientWidth) * 100) - hund;
		left = (left < 0) ? 0 : left;
		left = (left > 100) ? 100 : left;
		controls.seekBar.style.left = left + "%"
		
		var finalSeek = (video.duration/100) * left;
		video.currentTime = finalSeek;
		seekUpdate();
	}
	function holdSlider(event) {
		var hund = controls.seekSlider.clientWidth/100;
		var offset = (window.innerWidth/100) * 10 + (hund * 25);
		var x = event.clientX - offset;
		var left = ((x / controls.seekSlider.clientWidth) * 100) - hund;
		left = (left < 0) ? 0 : left;
		left = (left > 100) ? 100 : left;
		controls.seekBar.style.left = left + "%"
		
		var finalSeek = (video.duration/100) * left;
		video.currentTime = finalSeek;
		seekUpdate();
	}
	function releaseSlider() {
		controls.seekArea.removeEventListener("mousemove", holdSlider, false);
	}
	function clickBar(event) {
		event.stopPropagation();
		controls.seekArea.addEventListener("mousemove", holdSlider, false);
	}
	controls.seekSlider.addEventListener("mousedown", clickSlider, false);
	controls.seekSlider.addEventListener("mouseup", releaseSlider, false);
	controls.seekBar.addEventListener("mousedown", clickBar, false);
	controls.seekBar.addEventListener("mouseup", releaseSlider, false);
	
	var muteCallback = function() {
		video.muted = !video.muted;
		controls.mute.children[0].textContent = (!video.muted) ? "volume_up" : "volume_mute";
	}
	controls.mute.addEventListener("click", muteCallback, false);
	
	function uploadCallback() {
		var vidURL = window.URL.createObjectURL(controls.uploadFile.files[0]);
		var source = document.getElementById("Video-Src");
		source.src = vidURL;
		source.parentElement.load();
	}
	controls.uploadFile.addEventListener("change", uploadCallback, false);
	
	controls.ext.addEventListener("change", updateDisplay, false);
	
	function saveCallback() {
		if (controls.URL == "") {
			alert("No Frame Capture Yet");
			return;
		}
		var extElement = document.getElementsByClassName("FC-Ext")[0];
		var extension = extElement.children[extElement.selectedIndex].value;
		var videoName = video.currentSrc.split("/").pop().split(".")[0];
		var videoTime = controls.seek.textContent.replace(":", "_");
		var file = videoName + "_" + videoTime + "." + extension;
		
		saveBlob(controls.URL, file);
	}
	controls.save.addEventListener("click", saveCallback, false);
}
function timeConv(dir, input) {
	var finalTime;
	if (dir == "display") {
		var rawTime = Math.round(video.currentTime * 100) / 100;
		var seconds = Math.floor(rawTime);
		var miliseconds = Math.floor((rawTime - seconds) * 100);
		var minutes = Math.floor(seconds/60);
		seconds = seconds - (minutes * 60);
		
		miliseconds = (miliseconds < 10) ? "0" + miliseconds : miliseconds;
		minutes = (minutes < 10) ? "0" + minutes : minutes;
		seconds = (seconds < 10) ? "0" + seconds : seconds;
		finalTime = minutes + ":" + seconds + ":" + miliseconds;
	}
	else {
		finalTime = video.currentTime/video.duration;
	}
	return finalTime;
}
function dataURLtoBlob(url) {
	var arr = url.split(',');
	var mime = arr[0].match(/:(.*?);/)[1];
	var bstr = atob(arr[1]); 
	var n = bstr.length;
	var u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
function saveBlob(dataURL, fileName) {
	var a = document.createElement("a");
	document.body.appendChild(a);
	a.style.display = "none";
	var blob = dataURLtoBlob(dataURL);
	var url = window.URL.createObjectURL(blob);
	a.href = url;
	a.download = fileName;
	a.click();
	window.URL.revokeObjectURL(url);
}
function autoFrame(video, ext) {
	var spinner = document.getElementsByClassName("Spinner")[0];
	spinner.style.display = "block";
	var callback = function(url) {
		spinner.style.display = "none";
		document.getElementsByClassName("FC-Display")[0].src = url;
		document.getElementsByClassName("FC-Save")[0].href = url;
		controls.URL = url;
	};
	frameCapture(video.currentSrc, video.currentTime, ext, callback);
}
/********** Init *********/
window.addEventListener("load", setUp, false);