/*
links:

http://www.rmg.co.uk/make-your-own/sundial
http://www.anycalculator.com/horizontalsundial.htm
*/

var latitude= 0.0;
var longitude= 0.0;
var canvasWidth= 457;
var canvasHeight= 468;
var RA= 45.0;
var radius= 200; //155;
var places= new Array();
var interval;

function animate() {
	interval= window.setInterval("animateOnce()", 250);	//100
	//animateOnce();
	var pause_button = document.getElementById('pause');
	pause_button.style.visibility = 'visible';
	document.getElementById('pause').childNodes[0].nodeValue="Pause";
}

function step() {
	window.clearInterval(interval);
	animateOnce();
	document.getElementById('pause').childNodes[0].nodeValue="Step";
}

function getNextTickData(plce) {
	for(var n= 0; n < plce.navyAngles.length; n++) {
		var dtPart= dateStringConverter(plce.navyAngles[n].ddate); //plce.navyAngles[n].ddate.replace(/\//g,'-');
		
		var dstr= dtPart+"T"+timeConverter(plce.navyAngles[n].Time);
		//console.log("dstr: "+ dstr);
		var dataDate= new Date(dstr);
		if(dataDate.getHours() === plce.ticker.getHours() && dataDate.getMinutes() === plce.ticker.getMinutes()) {
			console.log("--FOUND--: "+dstr);
			return plce.navyAngles[n];
		}
	}

	return plce.navyAngles[0];	//return to beginning
}

function animateOnce() {
	//drawDial1('brazil');

	for (var p=0;p<places.length;p++) {
		//for(var n= 0; n < NavyAngles.length; n++) {
			console.log("places[p].ticker: "+ places[p].ticker);
			var currentTimeForThisPlace= getNextTickData(places[p]);
			console.log("currentTimeForThisPlace: "+ currentTimeForThisPlace.Time);
			places[p].setNavyData(currentTimeForThisPlace);
			drawFromPlace(places[p]);
			console.log("places[p].ndate: "+ places[p].ndate);
			places[p].ticker.setMinutes(places[p].ndate.getMinutes()+ 10);
			console.log("ticker2: "+ places[p].ticker);
		//}
	}
}

/**
Draws one Sundial from Place
**/
function drawFromPlace(place) {
	//appendDial(place.sundialName, 457, 468);

//	sundialValues(place.time, place.latitude, place.longitude);
	var c=document.getElementById(place.sundialName);
	var ctx=c.getContext("2d");
	drawSundial(ctx, place.time, place.latitude, place.longitude, place.navyData, place.quadrant);
}

/**
creates a Sundial on screen
**/
function createDial() {
	document.getElementById('addDial').childNodes[0].nodeValue="Add Another SunDial";

	var lat= Number(document.getElementById('latitude').value);
	var long= Number(document.getElementById('longitude').value)
	var dtimeVal= document.getElementById('dtime').value.toDate();

	var place= new Place(lat, long, dtimeVal, document.getElementById('sundialName').value);
	document.getElementById('sundialName').value= document.getElementById('sundialName').value+"2";

	
	places[places.length]= place;

	getAzEl(places.length- 1, lat, long, dtimeVal);

	appendDial(place.sundialName, 457, 468);

	sundialValues(place.time, place.latitude, place.longitude);
	var c=document.getElementById(place.sundialName);
	var ctx=c.getContext("2d");
	drawSundial(ctx, place.time, place.latitude, place.longitude, place.navyData, place.quadrant);
}

/**
appends sunDial canvas to DOM div.
params: name, width and height
**/
function appendDial(nme, w, h) {
	var label= document.createElement("label");
	//<label for="male">Male</label>
	label.for=nme;
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
}

/**
Draws sundial on canvas.
**/
function drawSundial(context, dt, slat, slon, navy, quadrant) {
	var lat= Number(slat);
	var lon= Number(slon);

	//rotate and move
	//context.translate(100 + 200 / 2, 100 + 200 / 2);	//width, height
	
	//context.translate(-150,150);
	//context.rotate(degToRad(315));

	var imageObj = new Image();
	imageObj.onload = function() {
		context.drawImage(imageObj, 0, 0);

		var flagPoleHeight= 142;
		var p1= new Point(canvasWidth/2,canvasHeight- 71);
		var p2= new Point(canvasWidth/2,canvasHeight- 206);
		var stick= new Line(p1, p2);
		var base=  new Line(p1, new Point(canvasWidth/2,canvasHeight- 206));

		console.debug("stick: "+ stick.toString());
		console.debug("base: "+ base.toString());
		console.debug("quadrant: "+ quadrant);
		console.debug("az: "+ navy.AzimuthAngle+ ", el: "+ navy.ElevationRefracted);

		//stick.draw(context, 9, "Navy");
		//base.draw(context, 3, "Navy");
		drawClock(context, 4, "OliveDrab", navy.dateObj, stick.p1, 227-148);

		//stick.draw(context, 3, "Navy");

		var triDial= new Triangle(stick, stick, stick);
		triDial- triDial.createFromAngle(p2, flagPoleHeight, Math.abs(latitude), -1);
		var dialHeight= triDial.b.p2.x-triDial.b.p1.x;
		console.debug("triDial: "+ triDial.toString());
		console.debug("dialHeight: "+ dialHeight);
		triDial= triDial.tiltX(70);
		var dialHeight= triDial.b.p2.x-triDial.b.p1.x;
		console.debug("triDial: "+ triDial.toString());
		console.debug("dialHeight: "+ dialHeight);

		context.globalAlpha = 0.8;
		triDial.draw(context, 2, "brown");

		var shadow= new Triangle(stick, stick, stick);
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
		var el= navy.ElevationRefracted;
		var sunAngle= navy.AzimuthAngle;
		if(quadrant.contains("S")) {
			dialAngle= 360.0- sunAngle;
		} else {
			dialAngle= sunAngle- 180.0;
		}
		if(navy.ElevationRefracted > 0.0) {
			var shadowHeight= gnomonCalc(navy.ElevationRefracted, flagPoleHeight);
			console.debug("shadowHeight: "+ shadowHeight);
			//shadowHeight= dialHeight* Tan^-1(el)=A/O
			shadow= shadow.createFromAngle2(triDial.a.p2, shadowHeight, dialAngle, -1);

			context.globalAlpha = 0.6;

	/*		if(navy.ElevationRefracted > 0.0)if(dialAngle < 95.0 || dialAngle > 265.0) { 
				shadow.draw(context, "#cccccc");
			}
	*/
			//shadow2.draw(context, 5, "DarkSlateGray"); //"#cccccc");
			//shadow.a.draw(context, 5, "DarkSlateGray");

			//draw az el line
			var topOfLine= base.p2.copy();
			shadowHeight= gnomonCalc(navy.ElevationRefracted, flagPoleHeight);
			topOfLine.move(0,flagPoleHeight*-1);

			var azElAngle= dialAngle- 90;
			console.debug("c: "+ shadowHeight*Math.cos(degToRad(azElAngle)));
			console.debug("s: "+ shadowHeight*Math.sin(degToRad(azElAngle)));
			console.debug("shadowHeight: "+ shadowHeight);

			var azElLine= new Line(base.p1, new Point(base.p1.x+ shadowHeight*Math.cos(degToRad(azElAngle)), base.p1.y+ shadowHeight*Math.sin(degToRad(azElAngle))));
		
			azElLine.draw(context, 3, "red");

			var azElShadow= shadow.createFromPoints(azElLine.p1, azElLine.p2, base.p2);
			if(dialAngle < 95.0 || dialAngle > 265.0) {
				azElShadow.draw(context, 2, "DarkSlateGray");
			}
		}
		var n1= new Point(p2.x, 40);
		context.fillStyle = "Ochre";
		context.strokeStyle = "Ochre";
		try{
			context.fillText("N", n1.x-3, n1.y);
			context.fillText(dialAngle+" at "+ navy.ddate+"T"+navy.Time, shadow.a.p1.x, shadow.a.p1.y);
			context.fillText(navy.ddate+"T"+navy.Time+ " Az: "+sunAngle+", El: "+ navy.ElevationRefracted, 10, 10);
			//context.fillText(dt.getFormattedDateTime(), shadow.a.p1.x, shadow.a.p1.y);
		}catch(ex){}
	};
	imageObj.src = 'img/sundial3.png';
}


function gnomonCalc(el, dialHeight)
{
   var complementAngle = (90.0 - el);
   if ((complementAngle < 0) || (complementAngle > 90)) {
      console.error("Invalid latitude - must be between 0 and 90: "+ el);
   } else {
      var calculatedTangent = Math.tan(complementAngle / 57.295779513082320876798154814105);
      var gnomonLength = calculatedTangent * dialHeight;
      var gnomonLength = Math.round(gnomonLength * 100) / 100;
      return gnomonLength;
   }
}

function minutesSinceNoon(h) {
	var hms= h.split(":");
	var hr= Number(hms[0]);
	if(hr > 12) {
		 return (hr%12)*60 + Number(hms[1]);
	} else {
		var magH= Math.abs(hr-12)*60 - Number(hms[1]);
		return magH* -1;
	}
}

/* gets angle of shadow, given time and latitude. */
function calcShadownAngle(hour, lat){

	var mins= minutesSinceNoon(hour);
	console.log(hour+ " mins: "+ mins);

	return Math.abs(mins)/60.0*15.0;

/*tan(@) = sin(lat) * tan(hour)
	var tanHour= Math.cot(hour);	//hour* 360/24;//
	console.log("tan of hour("+hour+"): "+ tanHour);
	var multrig = eval(tanHour * Math.sin(lat));
	var radShadAng = Math.atan(multrig);
	angle = radToDeg(radShadAng); // convert rads to degrees
	//shadAng = Math.round(angle * 100)/100; // round to 2 decimal places
	return angle;*/
}

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

/* gets values from Sun.js package. */
function sundialValues(date, lat, lon) {
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
}
