tiltpackage.watchID = null;
tiltpackage.tiltAngle= -1;
tiltpackage.tiltAngle2= -1;

// Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    console.log("onDeviceReady()");
	startWatch();
}

// Start watching the compass
function startWatch() {
 try{
	// Update acceleration every 3 seconds
    var options = { frequency: 500 };

    watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
} catch(err) {
	console.error(err.message);
}

 try {
	window.addEventListener('deviceorientation', function(eventData) {
	// gamma is the left-to-right tilt in degrees, where right is positive
	var tiltLR = eventData.gamma;

	// beta is the front-to-back tilt in degrees, where front is positive
	var tiltFB = eventData.beta;

	// alpha is the compass direction the device is facing in degrees
	var dir = eventData.alpha

	// deviceorientation does not provide this data
	var motUD = null;

	// call our orientation event handler
	deviceOrientationHandler(tiltLR, tiltFB, dir, motUD);
	}, false);
 } catch(err) {
	console.error(err.message);
 }

}

function drawGlobe(acceleration) {
	var txt= 'Acceleration: x:' + acceleration.x+" y: "+ acceleration.y+" z: "+ acceleration.z+" timestamp: "+ acceleration.timestamp;
	console.debug(txt);
	var element = document.getElementById('acceleromete');
    element.innerHTML = txt;

	
}

function doTxt() {
	var element = document.getElementById('acceleromete');
	element.innerHTML= "goTxt";
}

// onSuccess: Get the current heading
function onSuccess(acceleration) {
	drawGlobe(acceleration);
}

// onError: Failed to get the heading
function onError(accelerationError) {
    alert('Compass error: ' + accelerationError.code);
}

function deviceOrientationHandler(tiltLR, tiltFB, dir, motUD) {
	tiltAngle= tiltLR; //270+ tiltLR; //tiltLR;
	tiltAngle2= tiltFB; //270+ tiltFB; //tiltFB;
	if(tiltFB > 75) {}
	var txt= 'Orientation: tiltLR:' + tiltLR+" tiltFB: "+ tiltFB+" dir: "+ dir+" motUD: "+ motUD;
	console.debug(txt);
	var element = document.getElementById('acceleromete2');
	element.innerHTML = txt;
}

