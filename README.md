# Frame_Capture_JS
A simple JS library for capturing a single frame of a browser playable video.
[Example: https://redpixiemedia.github.io/Frame_Capture_JS/](https://redpixiemedia.github.io/Frame_Capture_JS/)

##Info:
Package: Frame Capture JS
Author: Sunshine (Red Pixie Media)
Usage: frameCapture(src, pos, ext, callback)
	src = (String) - video file (Any browser supported video format)
	pos = (Number) - seeking position
	ext = (String) - desired extension (png, jpeg, etc.)
	callback = (function) -  callback function with the ouput datURL as an argument
Returns: Nothing, callback function executed when calculations finish.
Example:
	`frameCapture("Video.mp4", 5.4, "jpeg", function(dataUrl) {console.log(dataUrl);});`

