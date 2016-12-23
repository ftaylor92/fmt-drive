protractorpackage.setInitial=function(broadObj) {
	var watchID = null;
	var tiltAngle= -1;
	
	// Wait for device API libraries to load
	//
	//document.addEventListener("deviceready", protractorpackage.onDeviceReady, false);
	
	/*window.addEventListener("devicemotion", function(event) {
	      // Process event.acceleration, event.accelerationIncludingGravity,
	      // event.rotationRate and event.interval
	*		        {acceleration: {x: v^2/r, y: 0, z: 0},
					   accelerationIncludingGravity: {x: v^2/r, y: 0, z: 9.81},
					   rotationRate: {alpha: 0, beta: 0, gamma: -v/r*180/pi} };
	*
	  }, true);
	  
	  if(androidpackage.isWebView()) {
	  	//protractorpackage.startWatch();
	  	document.addEventListener("deviceready", protractorpackage.onDeviceReady, false);
	  }*/
};

protractorpackage.receiveBroadcast= function(broadObj) {
	//compasspackage.setValue(broadObj);
};

// device APIs are available
//
protractorpackage.onDeviceReady= function() {
    protractorpackage.startWatch();
};

// Start watching the compass
//
protractorpackage.startWatch= function () {

	// Update acceleration every 3 seconds
    var options = { frequency: 3000 };

    //watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);

	
	/*var heading= new Object();
	heading.magneticHeading= 45;
	heading.trueHeading= 45;
	heading.headingAccuracy= 30;
	heading.timestamp= new Date();
	
	drawCompass(heading);*/
	
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
	protractorpackage.deviceOrientationHandler(tiltLR, tiltFB, dir, motUD);
	}, false);
};


// onSuccess: Get the current heading
//
protractorpackage.onSuccess= function(acceleration) {
	protractorpackage.drawProtractor(acceleration);
};

protractorpackage.deviceOrientationHandler= function(tiltLR, tiltFB, dir, motUD) {
	tiltAngle= tiltLR;
	if(tiltFB > 75) {}
	var txt= 'Orientation: tiltLR:' + tiltLR+" tiltFB: "+ tiltFB+" dir: "+ dir+" motUD: "+ motUD;
	console.debug(txt);
};

protractorpackage.drawProtractor= function(protractorName, northAngle, az) {
	//Heading Text
	if(androidpackage.isPC() && !isMinimalSite) {
		var celement = document.getElementById('accelerometer');
		var txt= 'Azimuth: az:' + az;//+", Elevation: "+ el;
		//console.debug(txt);
		celement.innerHTML = txt;
	}
	
	//Protractor Graphics
	var c=document.getElementById(protractorName);
	var ctx=c.getContext("2d");

	var imageObj = new Image();
	imageObj.onload = function() {
		//ctx.drawImage(imageObj,0, 0);
		
		//translate context to center of canvas
		//ctx.translate(100, 100);

		// rotate 45 degrees clockwise
		//ctx.rotate(astropackage.degToRad(heading.trueHeading));
		// Save the current context
		ctx.save();
		// Translate to the center point of our image
		ctx.translate(imageObj.width * 0.5, imageObj.height * 0.5);
		// Perform the rotation
		//ctx.rotate(astropackage.degToRad(heading.trueHeading));
		// Translate back to the top left of our image
		ctx.translate(-imageObj.width * 0.5, -imageObj.height * 0.5);
		// Finally we draw the image
		ctx.drawImage(imageObj, 0, 0);
		// And restore the context ready for the next loop
		ctx.restore();
		
			var radius= 240;
			var origin= shapepackage.Point(477/2, 250);
			//var levelLine= shapepackage.Line(origin, );
			var levelLine= shapepackage.Line(origin, shapepackage.Point(origin.x+ Math.cos(astropackage.degToRad(northAngle))* radius, origin.y- Math.sin(astropackage.degToRad(northAngle))* radius));
			levelLine.draw(ctx, 4, "red");
			//az= 165.6;
			//az= 360.0- az+ 90.0;
			levelLine= shapepackage.Line(origin, shapepackage.Point(origin.x+ Math.cos(astropackage.degToRad(az))* radius, origin.y- Math.sin(astropackage.degToRad(az))* radius));
			levelLine.draw(ctx, 4, "DodgerBlue");

	};
	imageObj.src = "./img/protractor-android.png";
	
	var radius= 240;
	var origin= shapepackage.Point(477/2, 250);
	var levelLine= shapepackage.Line(origin, shapepackage.Point(origin.x+ Math.cos(astropackage.degToRad(az))* radius, origin.y+ Math.sin(astropackage.degToRad(az))* radius));
	levelLine.draw(ctx, 2, "Ochre");
	//draw line from 477/2, 250 to Math.cos(
};

protractorpackage.drawProtractorAcc= function(acceleration) {
	//Heading Text
	if(androidpackage.isPC() && !isMinimalSite) {
		var belement = document.getElementById('accelerometer');
		var txt= 'Acceleration: x:' + acceleration.x+" y: "+ acceleration.y+" z: "+ acceleration.z+" timestamp: "+ acceleration.timestamp;
		console.debug(txt);
		belement.innerHTML = txt;
	}
	
	//Protractor Graphics
	var c=document.getElementById("protractor");
	var ctx=c.getContext("2d");

	var imageObj = new Image();
	imageObj.onload = function() {
		//ctx.drawImage(imageObj,0, 0);
		
		//translate context to center of canvas
		//ctx.translate(100, 100);

		// rotate 45 degrees clockwise
		//ctx.rotate(astropackage.degToRad(heading.trueHeading));
		// Save the current context
		ctx.save();
		// Translate to the center point of our image
		ctx.translate(imageObj.width * 0.5, imageObj.height * 0.5);
		// Perform the rotation
		ctx.rotate(astropackage.degToRad(heading.trueHeading));
		// Translate back to the top left of our image
		ctx.translate(-imageObj.width * 0.5, -imageObj.height * 0.5);
		// Finally we draw the image
		ctx.drawImage(imageObj, 0, 0);
		// And restore the context ready for the next loop
		ctx.restore();
	};
	imageObj.src = "./protractor-android.png";
	
	var radius= 240;
	var origin= new Point(477/2, 250);
	var levelLine= new Line(origin, new Point(origin.x+ Math.cos(tiltLR)* radius, origin.y+ Math.sin(tiltLR)* radius))
	levelLine.draw(ctx, 2, "Ochre");
	//draw line from 477/2, 250 to Math.cos(
};

// onError: Failed to get the heading
//
protractorpackage.onError= function(accelerationError) {
    alert('Compass error: ' + accelerationError.code);
};

//-protractorpackage.startWatch();
