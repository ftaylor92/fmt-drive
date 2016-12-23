

compasspackage.setInitial= function(broadObj) {
	console.log("compasspackage.setInitial: "+ broadObj);
	
	compasspackage.heading= -1;
	compasspackage.azimuth= null;
	compasspackage.elevation= null;
	compasspackage.latitude= null;
	compasspackage.longitude= null;
	compasspackage.place= null;
	compasspackage.observer= null;
	compasspackage.date= new Date();
	compasspackage.placeName= "Here";
	//-----
	compasspackage.setValue(broadObj);
	
	if(androidpackage.isWebView()) {
		//document.addEventListener("deviceready", compasspackage.onDeviceReady, false);
		//compasspackage.startWatch();
	}
};

compasspackage.receiveBroadcast= function(broadObj) {
	compasspackage.setValue(broadObj);
};

compasspackage.setValue= function(broadObj) {
	console.log("compasspackage.setValue: "+ broadObj);
	if(null != broadObj.date) {
		compasspackage.date= broadObj.date;
	}
	if(null != broadObj.placeName) {
		compasspackage.placeName= broadObj.placeName;
	}
	if(null != broadObj.latitude) {
		if(androidpackage.isPC() && !isMinimalSite) {
			document.getElementById('compass-latitude').value= broadObj.latitude;
			document.getElementById('compass-longitude').value= broadObj.longitude;
		
			compasspackage.latitude= broadObj.latitude;
			compasspackage.longitude= broadObj.longitude;
		}
		
		if(null === compasspackage.place) {
			compasspackage.place= astropackage.createPlace(compasspackage.placeName, compasspackage.latitude, compasspackage.longitude);
			compasspackage.observer= new observatory(compasspackage.place, compasspackage.date);
			var azVals= astropackage.getAzElRiseSet(compasspackage.observer);
			compasspackage.azimuth= azVals.az;
			compasspackage.elevation= azVals.el;
			
			console.log("compass- AzEl set: "+ compasspackage.azimuth);
			//az= 360.0- az+ 90.0;
			var northAngle= 90.0;
			if(-1 !== compasspackage.heading) {
				northAngle= compasspackage.heading;
			}
			if(androidpackage.isPC() && !isMinimalSite) {
				protractorpackage.drawProtractor("protractor", northAngle, 360.0- compasspackage.azimuth+ 90.0);//, compasspackage.elevation);
				compasspackage.drawCompass(90.0);
			}
			protractorpackage.drawProtractor("time-protractor", northAngle, 360.0- compasspackage.azimuth+ 90.0);//, compasspackage.elevation);
			protractorpackage.drawProtractor("sun-protractor", northAngle, 360.0- compasspackage.azimuth+ 90.0- 90.0);//, compasspackage.elevation);
			
			
			//compasspackage.drawCompass(90.0)
		}
	}
	if(null != broadObj.azimuth) {
		console.log("azimuth received");
	}
	
	
};


//-compasspackage.watchID = null;

// Wait for device API libraries to load
//
//document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
compasspackage.onDeviceReady= function() {
    compasspackage.startWatch();
};

// Start watching the compass
//
compasspackage.startWatch= function() {

    // Update compass every 3 seconds
    var options = { frequency: 3000 };

    watchID = navigator.compass.watchHeading(compasspackage.onSuccess, compasspackage.onError, options);
	
	/*var heading= new Object();
	heading.magneticHeading= 45;
	heading.trueHeading= 45;
	heading.headingAccuracy= 30;
	heading.timestamp= new Date();
	
	drawCompass(heading);*/
};


// onSuccess: Get the current heading
//
compasspackage.onSuccess= function(heading) {
	compasspackage.heading= heading;
	drawCompass(heading);
	
	var broadObj= new Object();
	broadObj.heading= heading;
	broadcastpackage.broadcastToAll(broadObj, "compasspackage");
};

compasspackage.drawCompass= function(heading) {
	//Heading Text
	if(androidpackage.isPC() && !isMinimalSite) {
		var aelement = document.getElementById('heading');
		var txt= 'GPS Heading: ' + heading.magneticHeading+" trueHeading: "+ heading.trueHeading+" headingAccuracy: "+ heading.headingAccuracy+" timestamp: "+ heading.timestamp;
		console.debug(txt);
		aelement.innerHTML = txt;
	}
	
	//Compass Graphics
	var c=document.getElementById("compass");
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
	imageObj.src = "./img/round200.png";
	
	if(heading.trueHeading > 357 || heading.trueHeading < 3 ) {
		navigator.notification.vibrate(500);
	}
};

// onError: Failed to get the heading
//
compasspackage.onError= function(compassError) {
    alert('Compass error: ' + compassError.code);
};
