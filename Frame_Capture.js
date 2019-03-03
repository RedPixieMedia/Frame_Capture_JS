/*	
 *	Package: Frame Capture JS
 *	Author: Sunshine (Red Pixie Media)
 *	Description: Capture Individual Frames From Videos
 *	Usage: frameCapture(src, pos, ext, callback)
 *		src = (String) - video file (Any browser supported video format)
 *		pos = (Number) - seeking position
 *		ext = (String) - desired extension (png, jpg, etc.)
 *		callback = (function) -  callback function with the ouput datURL as an argument
 *	Returns: Nothing, callback function executed when calculations finish.
 *	Example:
 *		frameCapture("Video.mp4", 5, "jpeg", function(dataUrl) {console.log(dataUrl);});
 */
function frameCapture(src, pos, ext, callback) {
	var FC = this;
	var video = document.createElement("video");
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	video.src = src;
	video.style.display = "none";
	canvas.style.display = "none";
	document.body.appendChild(video);
	document.body.appendChild(canvas);
	video.addEventListener("loadedmetadata", function() {
		video.currentTime = pos;
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
	}, false);
	video.addEventListener("seeked", function() {
		context.drawImage(video, 0, 0, canvas.width, canvas.height);
		FC.dataUrl = canvas.toDataURL("image/" + ext);
		callback(FC.dataUrl);
		video.parentElement.removeChild(video);
		canvas.parentElement.removeChild(canvas);
	}, false);
} 