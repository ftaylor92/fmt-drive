/*
links:

http://www.rmg.co.uk/make-your-own/sundial
http://www.anycalculator.com/horizontalsundial.htm
*/

sundialTwopackage.setInitial= function(broadObj) {
	sundialTwopackage.latitude= 0.0;
	sundialTwopackage.longitude= 0.0;
	sundialTwopackage.canvasWidth= 457;
	sundialTwopackage.canvasHeight= 468;
	sundialTwopackage.RA= 45.0;
	sundialTwopackage.radius= 200; //155;
	sundialTwopackage.places= new Array();
	sundialTwopackage.interval;
};

sundialTwopackage.animate= function() {
	interval= window.setInterval("sundialTwopackage.animateOnce()", 250);	//100
	//sundialTwopackage.animateOnce();
	var pause_button = document.getElementById('pause');
	pause_button.style.visibility = 'visible';
	document.getElementById('pause').childNodes[0].nodeValue="Pause";
};

sundialTwopackage.step= function() {
	window.clearInterval(interval);
	sundialTwopackage.animateOnce();
	document.getElementById('pause').childNodes[0].nodeValue="Step";
};

sundialTwopackage.getNextTickData= function(plce) {
	var obs= new observatory(plce.place, plce.ticker);
	var azVals= astropackage.getAzElRiseSet(obs);
	
	return azVals;
};

sundialTwopackage.animateOnce= function() {
	//drawDial1('brazil');

	for (var p=0;p<this.places.length;p++) {
		//for(var n= 0; n < NavyAngles.length; n++) {
			//console.log("places[p].ticker: "+ this.places[p].ticker);
			var tickData= this.getNextTickData(this.places[p]);
			//console.log("tickData: "+ tickData);
			//console.log("tickData.az: "+ tickData.el);
			this.places[p].tickData= tickData;
			this.drawFromPlace(this.places[p]);
			//console.log("places[p].ndate: "+ this.places[p].date);
			this.places[p].ticker.setMinutes(this.places[p].date.getMinutes()+ 10);
			//console.log("ticker2: "+ this.places[p].ticker);
			
			this.places[p].date.addMins(10);
			this.places[p].ticker.addMins(10);
			//this.places[p].time.addMins(10);
		//}
	}
};

/**
Draws one Sundial from Place
**/
sundialTwopackage.drawFromPlace= function(place) {
	//console.log("place: "+ place.place.name);
	//appendDial(place.sundialName, 457, 468);

//	sundialValues(place.time, place.latitude, place.longitude);
	var c=document.getElementById(place.sundialName);
	var ctx=c.getContext("2d");
	this.drawSundial(ctx, place);
};

/**
creates a Sundial on screen
**/
sundialTwopackage.createDial= function() {
	document.getElementById('addDial').childNodes[0].nodeValue="Add Another SunDial";

	var lat= Number(document.getElementById('comparison-latitude').value);
	var lon= Number(document.getElementById('comparison-longitude').value);
	var dtimeVal= document.getElementById('comparison-dtime').value.toDate();

	var place= shapepackage.Place(lat, lon, dtimeVal, document.getElementById('comparison-sundialName').value);
	document.getElementById('comparison-sundialName').value= document.getElementById('comparison-sundialName').value+"2";
	
	this.places[this.places.length]= place;

	place.tickData= this.getNextTickData(place);

	this.appendDial(place.sundialName, 457, 468);

	//this.sundialValues(place.time, place.latitude, place.longitude);
	var c=document.getElementById(place.sundialName);
	var ctx=c.getContext("2d");
	this.drawSundial(ctx, place);
};

sundialTwopackage.createDialCurrent= function(broadObj) {
	//document.getElementById('addDial').childNodes[0].nodeValue="Add Another SunDial";

	var lat= broadObj.latitude;
	var lon= broadObj.longitude;
	var dtimeVal= new Date(); //document.getElementById('comparison-dtime').value.toDate();

	var place= shapepackage.Place(lat, lon, dtimeVal, "Current");
	//document.getElementById('comparison-sundialName').value= document.getElementById('comparison-sundialName').value+"2";
	
	this.places[this.places.length]= place;

	place.tickData= this.getNextTickData(place);

	this.appendDialCurrent(place.sundialName, 457, 468);

	//this.sundialValues(place.time, place.latitude, place.longitude);
	var c=document.getElementById(place.sundialName);
	var ctx=c.getContext("2d");
	this.drawSundial(ctx, place);
};

/**
appends sunDial canvas to DOM div.
params: name, width and height
**/
sundialTwopackage.appendDial= function(nme, w, h) {
	var label= document.createElement("label");
	//<label for="male">Male</label>
	label.setAttribute("for", nme);
	label.setAttribute("value", nme);
	label.innerHTML= nme;

	var canvas = document.createElement("canvas");
	canvas.id= nme;
	canvas.width=w;
	canvas.height=h;
	canvas.style="border:1px solid #000000;";

	//document.getElementById("sundialCanvases").appendChild(document.createElement("br"));
	document.getElementById("sundialCanvases").appendChild(canvas);
	//document.getElementById("sundialCanvases").appendChild(document.createElement("br"));
	document.getElementById("sundialCanvases").appendChild(label);
	//document.getElementById("sundialCanvases").appendChild(document.createElement("br"));

	var el = document.getElementById(nme);
	el.addEventListener("click", function() {console.log("clicked"); }, false);
};

sundialTwopackage.appendDialCurrent= function(nme, w, h) {
	var label= document.createElement("label");
	//<label for="male">Male</label>
	label.setAttribute("for", nme);
	label.setAttribute("value", nme);
	label.innerHTML= nme;

	var canvas = document.createElement("canvas");
	canvas.id= nme;
	canvas.width=w;
	canvas.height=h;
	canvas.style="border:1px solid #000000;";

	//document.getElementById("sundialCanvases").appendChild(document.createElement("br"));
	document.getElementById("current-sundialCanvases").appendChild(canvas);
	//document.getElementById("sundialCanvases").appendChild(document.createElement("br"));
	document.getElementById("current-sundialCanvases").appendChild(label);
	//document.getElementById("sundialCanvases").appendChild(document.createElement("br"));

	var el = document.getElementById(nme);
	el.addEventListener("click", function() {console.log("clicked"); }, false);
};

/**
Draws sundial on canvas.
**/
sundialTwopackage.drawSundial= function(context, place) {
	//console.log("navy: "+ place.tickData.az+", "+place.tickData.el);
	var lat= Number(place.latitude);
	var lon= Number(place.longitude);

	//rotate and move
	//context.translate(100 + 200 / 2, 100 + 200 / 2);	//width, height
	
	//context.translate(-150,150);
	//context.rotate(degToRad(315));

	var imageObj = new Image();
	imageObj.onload = function() {
		context.drawImage(imageObj, 0, 0);
		var pixelsFromBotton= 21;
		var baseLength= 235;
		
		var flagPoleHeight= 242;
		var origin= shapepackage.Point(sundialTwopackage.canvasWidth/2, sundialTwopackage.canvasHeight- pixelsFromBotton);
		//console.log("originx: "+ origin.toString());
		var topOfBase= shapepackage.Point(sundialTwopackage.canvasWidth/2, sundialTwopackage.canvasHeight- (pixelsFromBotton+ baseLength));
		var stick= shapepackage.Line(origin, topOfBase);
		var base=  shapepackage.Line(origin, shapepackage.Point(sundialTwopackage.canvasWidth/2,sundialTwopackage.canvasHeight- (pixelsFromBotton+ baseLength)));

		//console.debug("stick: "+ stick.toString());
		//console.debug("base: "+ base.toString());
		//console.debug("quadrant: "+ place.quadrant);
		//console.debug("az: "+ place.tickData.az+ ", el: "+ place.tickData.el);

		//stick.draw(context, 9, "Navy");
		//base.draw(context, 3, "Navy");
		shapepackage.drawClock(context, 4, "OliveDrab", place.tickData.date, stick.p1, 227-148);

		//stick.draw(context, 3, "Navy");

		var triDial= shapepackage.Triangle(stick, stick, stick);
		triDial= triDial.createFromAngle(topOfBase, baseLength, Math.abs(place.latitude), -1);
		var dialHeight= triDial.b.p2.x-triDial.b.p1.x;
		//console.debug("triDial: "+ triDial.toString());
		//console.debug("dialHeight: "+ dialHeight);
		triDial= triDial.tiltX(70);
		var dialHeight= triDial.b.p2.x-triDial.b.p1.x;
		//console.debug("triDial: "+ triDial.toString());
		//console.debug("dialHeight: "+ dialHeight);

		context.globalAlpha = 0.8;
		triDial.draw(context, 2, "brown");

		var shadow= shapepackage.Triangle(stick, stick, stick);
/*		shadow= shadow.createFromAngle2(triDial.a.p1, triDial.a.p1.y-triDial.a.p2.y, 30, -1);

		
		var dialAngle= calcShadownAngle("11:00", lat);
		console.log("dialAngle: "+ dialAngle);
		dialAngle= calcShadownAngle("13:30", lat);
		console.log("dialAngle: "+ dialAngle);
		dialAngle= calcShadownAngle("14:00", lat);
		console.log("dialAngle: "+ dialAngle);
		dialAngle= calcShadownAngle("10:00", lat);
		console.log("dialAngle: "+ dialAngle);
		dialAngle= calcShadownAngle("15:00", lat);
		console.log("dialAngle: "+ dialAngle);
		//dialAngle= calcShadownAngle("9:45", lat);
		//console.log("dialAngle: "+ dialAngle);
*/

		//ThreeJS shadow
		var threeAz= document.getElementById('location-lat');
		var threeEl= document.getElementById('location-lon');
		if(null != threeAz && null != threeEl) {
			//threeAz.value= place.tickData.az;
			//threeEl.value= place.tickData.el;
			sundialShadowpackage.doAz(place.tickData.az, place.tickData.el);
			//console.log("call doAz()");
		}

		var el= place.tickData.el;
		var sunAngle= place.tickData.az;
		var dialAngle= sunAngle;
		if(place.quadrant.contains("S")) {
			dialAngle= 360.0- sunAngle;
		} else {
			dialAngle= sunAngle- 180.0;
		}
		if(true || place.tickData.el > 0.0) {
			var shadowHeight= sundialpackage.gnomonCalc(place.tickData.el, flagPoleHeight);

			{
			var lon= place.tickData.az;
			var lat= place.tickData.el;

			var x = flagPoleHeight * Math.cos(astropackage.degToRad(lat)) * Math.sin(astropackage.degToRad(lon));
			var y = flagPoleHeight * Math.sin(astropackage.degToRad(lat));

			x= (origin.x- Math.round(x));
			y= (origin.y- Math.round(y));
			
			shapepackage.Point(x,y).draw(context, 2, "Fuchsia");	
			}
			/*{ var lon= 360.0- place.tickData.az;
			if(place.quadrant.contains("S")) {
				lon= 360.0- place.tickData.az;
			} else {
				lon= place.tickData.az- 180.0;
			}
			var complementLatitude = el; //(90.0 - el);
			
			var cartesian= astropackage.azElToCartensian(lon, complementLatitude, flagPoleHeight);
			utilpackage.log("cartesian: "+ cartesian.x+", "+cartesian.y);
			var azElShadow= shadow.createFromPoints(shapepackage.Point(cartesian.x, cartesian.y), base.p1, base.p2);
			//if(dialAngle < 95.0 || dialAngle > 265.0) {
				azElShadow.draw(context, 2, "yellow");
			//} }
			*/

			//console.debug("shadowHeight: "+ shadowHeight);
			//shadowHeight= dialHeight* Tan^-1(el)=A/O
			shadow= shadow.createFromAngle2(triDial.a.p2, shadowHeight, dialAngle, -1);

			context.globalAlpha = 0.6;

	/*		if(place.tickData.el > 0.0)if(dialAngle < 95.0 || dialAngle > 265.0) { 
				shadow.draw(context, "#cccccc");
			}
	*/
			//shadow2.draw(context, 5, "DarkSlateGray"); //"#cccccc");
			//shadow.a.draw(context, 5, "DarkSlateGray");

			//draw az el line
			var topOfLine= base.p2.copy();
			shadowHeight= sundialpackage.gnomonCalc(place.tickData.el, flagPoleHeight);
			topOfLine.move(0,flagPoleHeight*-1);

			var azElAngle= dialAngle- 90;
			//console.debug("c: "+ shadowHeight*Math.cos(astropackage.degToRad(azElAngle)));
			//console.debug("s: "+ shadowHeight*Math.sin(astropackage.degToRad(azElAngle)));
			//console.debug("shadowHeight: "+ shadowHeight);

			var azElLine= shapepackage.Line(base.p1, shapepackage.Point(base.p1.x+ shadowHeight*Math.cos(astropackage.degToRad(azElAngle)), base.p1.y+ shadowHeight*Math.sin(astropackage.degToRad(azElAngle))));
		
			azElLine.draw(context, 3, "red");

			var azElShadow= shadow.createFromPoints(azElLine.p1, azElLine.p2, base.p2);
			if(dialAngle < 95.0 || dialAngle > 265.0) {
				azElShadow.draw(context, 2, "DarkSlateGray");
			}
		}
		var n1= shapepackage.Point(topOfBase.x, 40);
		context.fillStyle = "Ochre";
		context.strokeStyle = "Ochre";
		try{
			context.fillText("N", n1.x-3, n1.y);
			context.fillText(dialAngle+" at "+ place.tickData.date+"T"+place.tickData.strTime, shadow.a.p1.x, shadow.a.p1.y);
			context.fillText(place.tickData.date+"T"+place.tickData.strTime+ " Az: "+sunAngle+", El: "+ place.tickData.el, 10, 10);
			//context.fillText(place.time.getAndroidDateTime(), shadow.a.p1.x, shadow.a.p1.y);
		}catch(ex){}
	};
	imageObj.src = './img/sundial.jpg';//'./img/sundial3.png';
};


sundialpackage.gnomonCalc= function(el, dialHeight)
{
   var complementAngle = (90.0 - el);
   if ((complementAngle < 0) || (complementAngle > 90)) {
      console.log("Invalid latitude - must be between 0 and 90: "+ el);
   } else {
      var calculatedTangent = Math.tan(complementAngle / 57.295779513082320876798154814105);
      var gnomonLength = calculatedTangent * dialHeight;
      var gnomonLength = Math.round(gnomonLength * 100) / 100;
      return gnomonLength;
   }
};

datepackage.minutesSinceNoon= function(h) {
	var hms= h.split(":");
	var hr= Number(hms[0]);
	if(hr > 12) {
		 return (hr%12)*60 + Number(hms[1]);
	} else {
		var magH= Math.abs(hr-12)*60 - Number(hms[1]);
		return magH* -1;
	}
};

/* gets angle of shadow, given time and latitude. */
sundialpackage.calcShadownAngle= function(hour, lat){

	var mins= minutesSinceNoon(hour);
	//console.log(hour+ " mins: "+ mins);

	return Math.abs(mins)/60.0*15.0;

/*tan(@) = sin(lat) * tan(hour)
	var tanHour= Math.cot(hour);	//hour* 360/24;//
	console.log("tan of hour("+hour+"): "+ tanHour);
	var multrig = eval(tanHour * Math.sin(lat));
	var radShadAng = Math.atan(multrig);
	angle = radToDeg(radShadAng); // convert rads to degrees
	//shadAng = Math.round(angle * 100)/100; // round to 2 decimal places
	return angle;*/
};

/*
ha3_75tan = 0.065543;
ha7_5tan = 0.131652;
ha11_25tan = 0.198912;
ha15tan = 0.267949; // tan of 15 degrees, 360/24 = 15
ha18_75tan = 0.339454;
ha22_5tan = 0.414214;
ha26_25tan = 0.493145;
ha30tan = 0.57735;
ha33_75tan = 0.668179;
ha37_5tan = 0.767327;
ha41_25tan = 0.876976;
ha45tan = 1;
ha48_75tan = 1.140281;
ha52_5tan = 1.303225;
ha56_25tan = 1.496606;
ha60tan = 1.7320508;
ha63_75tan = 2.027799;
ha67_5tan = 2.414214;
ha71_25tan = 2.945905;
ha75tan = 3.7320508;
ha78_75tan = 5.027339;
ha82_5tan = 7.595754;
ha86_25tan = 15.257052;
ha90tan = 5729578;
*/

/* gets values from Sun.js package.
sundialTwopackage.sundialValues= function(date, lat, lon) {
	latitude= lat;
	longitude= lon;
	console.log('date: '+ Sun.date);

    Sun.date= date;
    var daylightHours= Sun.getDaylightHours(latitude); // Returns 16.15
	var daylightInYear= Sun.getTotalDaylightHoursInYear(latitude); // Returns 4404.769999999997
    var julianDays= Sun.getJulianDays(); //Returns the Julian Days passed based on the current Sun.date
    var equationOfTime= Sun.getEquationOfTime(); //The equation of time is the difference between apparent solar time and mean solar time.
    var T = (julianDays - 2451545.0) / 36525.0;	
    RA= Sun._getRightAscension(T); // Need to get the Suns Declination

	console.log('Sundial Values:');
	console.log('date: '+ Sun.date);
	console.log('latitude: '+ latitude);
	console.log('longitude: '+ longitude);

	console.log('daylightHours: '+ daylightHours);
	console.log('daylightInYear: '+ daylightInYear);
	console.log('julianDays: '+ julianDays);
	console.log('equationOfTime: '+ equationOfTime);
	console.log('RA: '+ RA);
} */
sundialTwopackage.sendBroadcast= function() {
	var broadObj= new Object();
	broadObj.date= y;
};
sundialTwopackage.receiveBroadcast= function(broadObj) {
	//sundialShadowpackage.setValue(broadObj);
};

sundialTwopackage.getValue= function() {};
sundialTwopackage.setValue= function(broadObj) {
	utilpackage.log("sundialTwopackage.setValue: "+ broadObj.date+", "+broadObj.latitude+", "+ broadObj.longitude);

	/*if(broadObj.latitude) {
		document.getElementById('comparison-latitude').value= broadObj.latitude;
		document.getElementById('comparison-longitude').value= broadObj.longitude;
	}
	if(broadObj.placeName) {
		document.getElementById('comparison-sundialName').value= broadObj.placeName;
	} else {
		document.getElementById('comparison-sundialName').value= "Wakefield";
	}
	if(null != broadObj.date) {
		var full= document.getElementById("comparison-dtime");
		androidpackage.setDateTimeElement(full, broadObj.date);
	}*/
};
