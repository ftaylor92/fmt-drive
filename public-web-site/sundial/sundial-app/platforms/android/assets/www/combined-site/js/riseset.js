
risesetpackage.sunAzEl= function(dtNum, fromGui) {
	//console.debug("slider-dtNum: "+ dtNum);
	//console.debug("slider-SelectedDateTime: "+ SelectedDateTime.getDate());
	var firstDayOfYear= sundialpackage.SelectedDateTime.firstDayOfYear();
	//console.debug("slider-firstDayOfYear: "+ firstDayOfYear.toString());
	firstDayOfYear.addDays(dtNum);
	this.setSliderPos(firstDayOfYear);
	
	var obs= new observatory(this.here, sundialpackage.now);	//sundialpackage.now

	var obsvr= utilpackage.objectClone(obs);
	obsvr.day= firstDayOfYear.getDate();
	obsvr.month= firstDayOfYear.getMonth()+ 1;
	
	//console.log("obsvr: "+ hayespackage.observatoryToString(obsvr));
	var first= astropackage.getAzElRiseSet(obsvr);

	obsvr.hours =   Number(first.rise.split(":")[0]);
	obsvr.minutes = Number(first.rise.split(":")[1]);//+10 % 59;
	obsvr.seconds = 00;
	//console.log("riseTime = "+timestring(obsvr,false));
	
	var riseVals= astropackage.getAzElRiseSet(obsvr);
	
	obsvr.hours =   Number(first.set.split(":")[0]);
	obsvr.minutes = Number(first.set.split(":")[1]);//+10 % 59;
	obsvr.seconds = 00;
	//console.log("setTime = "+timestring(obsvr,false));
	
	var setVals= astropackage.getAzElRiseSet(obsvr);

	var noonTime= this.getNoonTime(obsvr);
	var noonDiv= document.getElementById("noon-time");
	if(noonDiv !== null)	noonDiv.innerHTML= noonTime.getFormattedTime();
	noonDiv= document.getElementById("SH-noon-time");
	if(noonDiv !== null)	noonDiv.innerHTML= noonTime.getFormattedTime();

	var night= astropackage.diffTimes(riseVals.strTime, setVals.strTime);
	var txt = document.getElementById("txtDayLight");
	txt.innerHTML= "Daylight Hours: "+ night.hours+":"+night.minutes.pad(2);	
	txt = document.getElementById("SH-txtDayLight");
	txt.innerHTML= "Daylight Hours: "+ night.hours+":"+night.minutes.pad(2);	
	txt = document.getElementById("txtNightLight");
	txt.innerHTML= "Night-time Hours: "+ (23-night.hours)+":"+(60-night.minutes).pad(2);
	txt = document.getElementById("SH-txtNightLight");
	txt.innerHTML= "Night-time Hours: "+ (23-night.hours)+":"+(60-night.minutes).pad(2);
	
	//console.log("days: "+ dtNum+", az: "+ riseVals.az);
	
	var horizEast= 100.0* Math.sin(astropackage.degToRad(riseVals.az+ 90.0));
	var sun1 = document.getElementById("eastSun1");
	sun1.cx.baseVal.value= this.eastCenter+ horizEast;
	sun1 = document.getElementById("SH-eastSun1");
	sun1.cx.baseVal.value= this.eastCenter+ horizEast;
	var shadow1= document.getElementById("lnEastShadow");
	shadow1.x1.baseVal.value= this.eastCenter+ horizEast;
	shadow1= document.getElementById("SH-lnEastShadow");
	shadow1.x1.baseVal.value= this.eastCenter+ horizEast;

	//console.log("one");
	
	var arrowSeg= document.getElementById("lnEastArrow1");
	arrowSeg.x1.baseVal.value= this.eastCenter+ horizEast;
	arrowSeg.x2.baseVal.value= this.eastCenter+ horizEast;
	arrowSeg= document.getElementById("SH-lnEastArrow1");
	arrowSeg.x1.baseVal.value= this.eastCenter+ horizEast;
	arrowSeg.x2.baseVal.value= this.eastCenter+ horizEast;
	arrowSeg= document.getElementById("lnEastArrow2");
	arrowSeg.x1.baseVal.value= this.eastCenter+ horizEast-10;
	arrowSeg.x2.baseVal.value= this.eastCenter+ horizEast;
	arrowSeg= document.getElementById("SH-lnEastArrow2");
	arrowSeg.x1.baseVal.value= this.eastCenter+ horizEast-10;
	arrowSeg.x2.baseVal.value= this.eastCenter+ horizEast;
	arrowSeg= document.getElementById("lnEastArrow3");
	arrowSeg.x1.baseVal.value= this.eastCenter+ horizEast+ 10;
	arrowSeg.x2.baseVal.value= this.eastCenter+ horizEast;
	arrowSeg= document.getElementById("SH-lnEastArrow3");
	arrowSeg.x1.baseVal.value= this.eastCenter+ horizEast+ 10;
	arrowSeg.x2.baseVal.value= this.eastCenter+ horizEast;

	//console.log("two");

	txt = document.getElementById("txtEastTime");
	txt.innerHTML= riseVals.strTime.substr(0,5);
	txt.setAttribute("x", this.eastCenter+ horizEast);
txt = document.getElementById("SH-txtEastTime");
	txt.innerHTML= riseVals.strTime.substr(0,5);
	txt.setAttribute("x", this.eastCenter+ horizEast);
	txt = document.getElementById("txtEastDate");
	txt.innerHTML= riseVals.strDate.substring(5).replace(":","/");
	txt.setAttribute("x", this.eastCenter+ horizEast);
	txt = document.getElementById("SH-txtEastDate");
	txt.innerHTML= riseVals.strDate.substring(5).replace(":","/");
	txt.setAttribute("x", this.eastCenter+ horizEast);
	txt = document.getElementById("txtEastAngle");
	txt.innerHTML= Math.round(riseVals.az)+"&deg;";
	txt = document.getElementById("SH-txtEastAngle");
	txt.innerHTML= Math.round(riseVals.az)+"&deg;";
	
	//-------------------
	
	var horizWest= 100.0* Math.sin(astropackage.degToRad(setVals.az- 270.0));
	sun1 = document.getElementById("westSun1");
	sun1.cx.baseVal.value= this.westCenter+ horizWest;
	shadow1= document.getElementById("lnWestShadow");
	shadow1.x1.baseVal.value= this.westCenter+ horizWest;
	
	arrowSeg= document.getElementById("lnWestArrow1");
	arrowSeg.x1.baseVal.value= this.westCenter+ horizWest;
	arrowSeg.x2.baseVal.value= this.westCenter+ horizWest;
	arrowSeg= document.getElementById("lnWestArrow2");
	arrowSeg.x1.baseVal.value= this.westCenter+ horizWest-10;
	arrowSeg.x2.baseVal.value= this.westCenter+ horizWest;
	arrowSeg= document.getElementById("lnWestArrow3");
	arrowSeg.x1.baseVal.value= this.westCenter+ horizWest+ 10;
	arrowSeg.x2.baseVal.value= this.westCenter+ horizWest;
	
	txt = document.getElementById("txtWestTime");
	txt.innerHTML= setVals.strTime.substr(0,5);
	txt.setAttribute("x", this.westCenter+ horizWest);
	txt = document.getElementById("txtWestDate");
	txt.innerHTML= setVals.strDate.substring(5).replace(":","/");
	txt.setAttribute("x", this.westCenter+ horizWest);
	txt = document.getElementById("txtWestAngle");
	txt.innerHTML= Math.round(setVals.az)+"&deg;";
	
	sun1 = document.getElementById("SH-westSun1");
	sun1.cx.baseVal.value= this.westCenter+ horizWest;
	shadow1= document.getElementById("SH-lnWestShadow");
	shadow1.x1.baseVal.value= this.westCenter+ horizWest;
	
	arrowSeg= document.getElementById("SH-lnWestArrow1");
	arrowSeg.x1.baseVal.value= this.westCenter+ horizWest;
	arrowSeg.x2.baseVal.value= this.westCenter+ horizWest;
	arrowSeg= document.getElementById("SH-lnWestArrow2");
	arrowSeg.x1.baseVal.value= this.westCenter+ horizWest-10;
	arrowSeg.x2.baseVal.value= this.westCenter+ horizWest;
	arrowSeg= document.getElementById("SH-lnWestArrow3");
	arrowSeg.x1.baseVal.value= this.westCenter+ horizWest+ 10;
	arrowSeg.x2.baseVal.value= this.westCenter+ horizWest;
	
	txt = document.getElementById("SH-txtWestTime");
	txt.innerHTML= setVals.strTime.substr(0,5);
	txt.setAttribute("x", this.westCenter+ horizWest);
	txt = document.getElementById("SH-txtWestDate");
	txt.innerHTML= setVals.strDate.substring(5).replace(":","/");
	txt.setAttribute("x", this.westCenter+ horizWest);
	txt = document.getElementById("SH-txtWestAngle");
	txt.innerHTML= Math.round(setVals.az)+"&deg;";
	
	if(fromGui) {
		risesetpackage.sendBroadcast(firstDayOfYear);
	}
};

risesetpackage.getNoonTime= function(obsvr) {
	var noonDt= hayespackage.getObserverTime(obsvr);

	obsvr.hours =   12;
	obsvr.minutes = 00;
	obsvr.seconds = 00;
	var noon= null;

	noon= astropackage.getAzElRiseSet(obsvr);
	var noonAz= noon.az;

	obsvr.minutes = 15;
	noon= astropackage.getAzElRiseSet(obsvr);
	noonFifteenAz= noon.az;
	
	var step= (noonAz > noonFifteenAz) ? -1 : 1;
	if(step === 1 && noonAz >= 180.0)	step= -1;
	if(step ===-1 && noonAz <= 180.0)	step= 1;

	//console.log("noon az: "+noonAz+", 15Az: "+ noonFifteenAz+ ", step: "+ step);

	noonDt.setHours(12);
	noonDt.setMinutes(0);
	var noonObs= astropackage.getAzElRiseSet(obsvr);
	var flr= 180- step;
	for(var m= 0; m < 120; m++) {
		hayespackage.setObserverTime(obsvr, noonDt);

		var noonAzEl= astropackage.getAzElRiseSet(obsvr);
		
		//console.log("noon az: "+ noonAzEl.az+ ", "+ noonDt);
		//console.log("floor az: "+ Math.floor(noonAzEl.az)+", ciel: "+Math.ceil(noonAzEl.az));

		if(180 === ((step == 1) ? Math.floor(noonAzEl.az) : Math.ceil(noonAzEl.az))) break;

		noonDt.addMins(step);
	}

	return noonDt;
};

risesetpackage.setLatLon= function(lat, lon) {
	var oldName= this.here.name;
	this.here= astropackage.createPlace(oldName, lat, lon);
/*	var strLat= astropackage.deg_to_dms(lat);
	if(strLat.substr(0,1) === '-') {
		strLat= strLat.substr(1);
		risesetpackage.here.ns= 1;
	} else {
		risesetpackage.here.ns= 0;
	}
	risesetpackage.here.latitude= strLat;

	var strLon= astropackage.deg_to_dms(lon);
	if(strLon.substr(0,1) === '-') {
		strLon= strLon.substr(1);
		risesetpackage.here.we= 0;
	} else {
		risesetpackage.here.we= 1;
	}

	risesetpackage.here.longitude= strLon;*/
};

risesetpackage.solsticeEquinox= function(summer, equinox) {
	var dt= sundialpackage.SelectedDateTime.clone();
	var firstDayOfYear= sundialpackage.SelectedDateTime.firstDayOfYear();

	if(summer) {
		if(equinox) {
			dt.setMonth(8);
			dt.setDate(23);
		} else {
			dt.setMonth(5);
			dt.setDate(21);
		}
	} else {
		if(equinox) {
			dt.setMonth(2);
			dt.setDate(20);
		} else {
			dt.setMonth(11);
			dt.setDate(21);
		}
	}

	var dayNum= dt.deltaDays(firstDayOfYear);

	this.sunAzEl(dayNum, true);
};

risesetpackage.selectPlace= function() {
	//select a place
};

risesetpackage.setPlace= function(nm, lat, lon) {
	this.here.name= nm;

	if(nm === "Stonehenge") {
		utilpackage.log("stoneh");
		this.here.latitude= "51:10:44";
		this.here.longitude= "01:49:34";
		document.getElementById("rect-east").display="none";
		document.getElementById("rect-west").display="none";
		document.getElementById("stone-east").display="block";
		document.getElementById("stone-west").display="block";
	} else {
		document.getElementById("rect-east").display="block";
		document.getElementById("rect-west").display="block";
		document.getElementById("stone-east").display="none";
		document.getElementById("stone-west").display="none";
	}

	this.setPlaceTxt(this.here);
};

risesetpackage.setPlaceTxt= function(plc) {
	//console.log("setPlaceTxt");

	var sunSlider= document.getElementById("placeTxt");
	if(sunSlider !== null) {
	
		var latSign= (plc.ns === 0) ? "" : "-";
		var lonSign= (plc.we === 0) ? "-" : "";
	
		sunSlider.innerHTML= "place: "+ plc.name+": ("+ latSign+ astropackage.dmstr_to_deg(plc.latitude).roundDec(3)+", "+ lonSign+ astropackage.dmstr_to_deg(plc.longitude).roundDec(3)+")";
	}
	
	sunSlider= document.getElementById("SH-placeTxt");
	if(sunSlider !== null) {
	
		var latSign= (plc.ns === 0) ? "" : "-";
		var lonSign= (plc.we === 0) ? "-" : "";
	
		sunSlider.innerHTML= "place: "+ plc.name+": ("+ latSign+ astropackage.dmstr_to_deg(plc.latitude).roundDec(3)+", "+ lonSign+ astropackage.dmstr_to_deg(plc.longitude).roundDec(3)+")";
	}
};

risesetpackage.step= function(amt) {
	var sunSlider= document.getElementById("sun-date-slider");
	var SHsunSlider= document.getElementById("SH-sun-date-slider");
	if(sunSlider === null)	return;
	
	var slVal= Number(sunSlider.value);
	var SHslVal= Number(SHsunSlider.value);
	
	//console.log("slVal: "+slVal+", amt: "+ amt);
	
	var newVal= slVal+ amt;
	if(newVal <= 0)	{
		newVal= 364;
	} else if(newVal >= 365)	{
		newVal= 1;
	}
	this.sunAzEl(newVal, true);
	
	if(0 === amt) {
		var pauseButton = document.getElementById('run-button');
		var SHpauseButton = document.getElementById('SH-run-button');
		if(null == this.interval) {
			this.interval= window.setInterval("risesetpackage.step(1)", 250);
			pauseButton.childNodes[0].nodeValue="||";
			SHpauseButton.childNodes[0].nodeValue="||";
		} else {
			window.clearInterval(this.interval);
			pauseButton.childNodes[0].nodeValue=">";
			SHpauseButton.childNodes[0].nodeValue=">";
			this.interval= null;			
		}
	}
};

risesetpackage.setSliderPos= function(dt) {
	//console.log("slider-dt: "+ dt.toString());
	var firstDayOfYear= dt.firstDayOfYear();

	var days= dt.deltaDays(firstDayOfYear);
	//console.log("days1: "+ days);

	var sunSlider= document.getElementById("sun-date-slider");
	var SHsunSlider= document.getElementById("SH-sun-date-slider");
	if(sunSlider !== null)	{
		sunSlider.value= days;
		SHsunSlider.value= days;
	}	

	var pTime= document.getElementById("slider-time");
	var SHpTime= document.getElementById("SH-slider-time");
	if(pTime !== null)	{
		pTime.innerHTML= dt.getMonthStr()+" "+ dt.getDate()+", "+ dt.getFullYear();
		SHpTime.innerHTML= dt.getMonthStr()+" "+ dt.getDate()+", "+ dt.getFullYear();
	}
};

risesetpackage.addendSunset= function () {
	var svgId= "sunset";
	/*<div id="canvases">
<svg id="svgSet" width="300" height="100">
	<rect y=50 width="300" height="50" style="fill:OliveDrab;stroke-width:3;stroke:DarkOliveGreen;" />
	<circle id="sun" cx="50" cy="50" r="30" stroke="orange" stroke-width="4" fill="yellow" />
	<line x1="50" y1="60" x2="50" y2="30" style="stroke:rgb(255,0,0);stroke-width:2" />
	<line x1="40" y1="37" x2="50" y2="30" style="stroke:rgb(255,0,0);stroke-width:2" />
	<line x1="60" y1="37" x2="50" y2="30" style="stroke:rgb(255,0,0);stroke-width:2" />
	<text x="30" y="70" style="font-size:small;fill:MidnightBlue;" >10:45</text>
	<text x="30" y="84" style="font-size:small;fill:MidnightBlue;" >12/25</text>
</svg>
</div>*/
	var sunDivs= document.getElementById("canvases");
	
	var sunDiv = document.createElement("div");
	sunDiv.id= "div"+ svgId;
	sunDiv.width=300;
	sunDiv.height=100;
	sunDiv.style="border:1px solid #000000;";
	var sunSvg = document.createElement("svg");
	sunSvg.id= "svg"+ svgId;
	sunSvg.width=300;
	sunSvg.height=100;
	sunSvg.style="border:1px solid #000000;";
	var pRect = document.createElement("rect");
	pRect.y= 50;
	pRect.width= 300;
	pRect.height= 50;
	pRect.style= "fill:OliveDrab;stroke-width:3;stroke:DarkOliveGreen;";
	
	sunSvg.appendChild(pRect);
	
	sunDiv.appendChild(sunSvg);
	
	var sunXDiv= jQuery.extend(true, {}, document.getElementById("svgSet"));	//clone
	var sunYDiv= document.getElementById("svgSet");
	sunXDiv.id= "divtwo";
	//console.log("sunXDiv.id: "+ sunXDiv.id);
	//console.log("sunYDiv.id: "+ sunYDiv.id);
	sunDivs.appendChild(sunXDiv);
	
	sunDivs.appendChild(sunDiv);
};

risesetpackage.doMySun= function(obs, repeat) {
	// doSun creates the Sun window
	// obs is the observer
	// repeat = 0 only do for 1 day
	// repeat = 1 do for several days
	// repeat = 3 do for the full month

	//var oname=sitename();
	//var i;
	var obscopy = new Object();
	for (var i in obs) {
		obscopy[i] = obs[i];
		//console.log("i: "+ i+ ", oc: "+ obscopy[i]);
	}
					/*
	i: name, oc: My Home
	i: year, oc: 2014
	i: month, oc: 1
	i: day, oc: 23
	i: hours, oc: 7
	i: minutes, oc: 11
	i: seconds, oc: 41
	i: tz, oc: -60
	i: latitude, oc: 51.88
	i: longitude, oc: 2.12
	i: dss, oc:
	i: dse, oc: 
					 */
	obscopy.name = "My Home";
	obscopy.month = 1;
	obscopy.day = 23;
	obscopy.year = 2014;
	obscopy.hours = 7;
	obscopy.minutes = 11;
	obscopy.seconds = 41;
	obscopy.tz = -60;
	obscopy.latitude = 51.88;
	obscopy.longitude= 2.12;
	obscopy.dss= "";
	obscopy.dse= "";
	var sun_xyz = new Array(0.0, 0.0, 0.0);
	
	for (var i in obscopy) {
		//console.log("i: "+ i+ ", oc: "+ obscopy[i]);
	}
	
	//console.log("Date = " + datestring(obscopy));
	//console.log("Time = " + timestring(obscopy, false));
	

	var earth_xyz = helios(planets[2], obscopy);
	var radec = radecr(sun_xyz, earth_xyz, obscopy);
	var altaz = radtoaa(radec[0], radec[1], obscopy);
	//console.log("ra: " + (radec[0]));
	//console.log("ra: " + hmdstring(radec[0]));
	//console.log("dec: " + anglestring(radec[1], false));
	//console.log("dec: " + (radec[1]));
	//console.log("el: " + anglestring(altaz[0], false));
	//console.log("az: " + anglestring(altaz[1], true));
	//console.log("el: " + (altaz[0]));
	//console.log("az: " + (altaz[1]));

	var out = "ra: " + radec[0] + "<br/>";
	out += "ra: " + hmdstring(radec[0]) + "<br/>";
	out += "dec: " + anglestring(radec[1], false) + "<br/>";
	out += "dec: " + radec[1] + "<br/>";
	out += "el: " + anglestring(altaz[0], false) + "<br/>";
	out += "az: " + anglestring(altaz[1], true) + "<br/>";
	out += "el: " + altaz[0] + "<br/>";
	out += "az: " + altaz[1] + "<br/>";
	document.getElementById("output").innerHTML = out;
	document.getElementById("SH-output").innerHTML = out;

	var earthDistance = Math.round(radec[2]);
	// Do the various twilight definitions			var twilight= new Array(-0.833,-6.0,-12.0,-18.0);
	var twilight = new Array(-0.833, -6.0, -12.0, -18.0);
	var riseset = sunrise(obscopy, twilight[0]);
	//console.log("rize: " + riseset[0]);
	//console.log("set: " + riseset[1]);
};

risesetpackage.setValue= function(broadObj) {
	if(broadObj.date) {
		sundialpackage.GMDateTime= broadObj.date;
		sundialpackage.LocalDateTime= broadObj.date;
		sundialpackage.SelectedDateTime= broadObj.date;
		sundialpackage.now= broadObj.date;
	}
	
	if(broadObj.place) {
		risesetpackage.here= broadObj.place;
	}
	//------------------
	risesetpackage.setPlaceTxt(risesetpackage.here);
};

risesetpackage.getValue= function() {
	var broadObj= new Object();
	
	return broadObj;
};

risesetpackage.setInitial= function(broadObj) {
	risesetpackage.eastCenter= 100;
	risesetpackage.westCenter= 300;
	
	risesetpackage.interval= null;
	
	if(null !== broadObj.place) {
		broadObj.place= new place("US:Washington DC","38:53:51",0,"77:00:33",0,300,"03:2:0","11:1:0");
	} else {
		//console.log("broadObj.place: "+ broadObj.place);
	}
	if(null != broadObj.date) {
		broadObj.date= new Date();
	}
	
	risesetpackage.setValue(broadObj);

	risesetpackage.setSliderPos(now);

	var firstDayOfYear = now.firstDayOfYear();
	var days = now.deltaDays(firstDayOfYear);
	risesetpackage.sunAzEl(days);

	/*function doIt() {
	var here = new place("US:Washington DC", "38:53:51", 0, "77:00:33", 0, 300, "03:2:0", "11:1:0");
	var now = new Date();
	var obs = new observatory(here, now);
	doMySun(obs, 0);

	var sun1 = document.getElementById("sun");
	sun1.cx.baseVal.value -= 30;

	//addendSunset();
	}*/
};

risesetpackage.receiveBroadcast= function(broadObj) {
	console.log("risesetpackage.receiveBroadcast");
	if(broadObj.date) {
		risesetpackage.sunAzEl(broadObj.date.getDOY());
	}
	
	if(broadObj.placeName) {
		//risesetpackage.here.latitude = hmdstring(42.5109955);
		//Wakefield, MA, USA
		//risesetpackage.here.longitude = hmdstring(-71.0382657);
		risesetpackage.here.name = broadObj.placeName;
		risesetpackage.setPlaceTxt(risesetpackage.here);
	}
	
	if(broadObj.latitude) {
		risesetpackage.setLatLon(broadObj.latitude, broadObj.longitude);
		risesetpackage.here.name = "Here";
		console.debug("HLatitude, Longitude: " + risesetpackage.here.latitude + ", " + risesetpackage.here.longitude);
		console.debug("Latitude, Longitude: " + broadObj.latitude + ", " + broadObj.longitude);
		console.debug("Here&Now: " + (new Date()));
		if(Math.round(broadObj.latitude*100) != 4251 && Math.round(broadObj.longitude*100) != -7104) {
			var geoUrl= "http://maps.googleapis.com/maps/api/geocode/json?latlng="+broadObj.latitude+","+broadObj.longitude+"&sensor=true";
			$.get(geoUrl, function(data, txtstatus, xbr) {

				var placeName= "Here";
				data.results[0].address_components.forEach(function(entry) {
				//console.debug(entry);
				if(entry.types[0] == "locality" && entry.types[1] == "political") {
					placeName= entry.short_name;
				}
				});
				risesetpackage.here.name= placeName;
				risesetpackage.setPlaceTxt(risesetpackage.here);
			});
		}

		risesetpackage.setPlaceTxt(risesetpackage.here);
	}
};

risesetpackage.sendBroadcast= function(dtime) {
	var broadObj= new Object();
	broadObj.date= dtime;
	
	broadcastpackage.broadcastToAll(broadObj, "risesetpackage");
};
