
sundialTimepackage.doDateTime= function(elementChanged) {
	var full= document.getElementById("datetime-slider");
	//console.log("full.value: "+ full.value);
	var oldDate= new Date();
	oldDate= androidpackage.getDateElement(full);

	//console.log("in doDateTime: "+ oldDate);

	if('dt' === elementChanged) {
		//var newDate= document.getElementById('datetime-slider').value.toDate();
	} else if('d' === elementChanged) {
		var slider= document.getElementById("date-slider");
		var val= slider.value;
		//console.log("slider-val: "+ val);
		var firstDayOfYear= oldDate.firstDayOfYear();
		firstDayOfYear.addDays(val);
		oldDate= firstDayOfYear;
	} else if('t' === elementChanged) {
		var slider= document.getElementById("time-slider");
		var val= slider.value;
		//console.log("slider-val: "+ val);
		oldDate.setHours(0);
		oldDate.setMinutes(0);
		oldDate.setSeconds(0);
		oldDate.addMins(val);
	}

	//androidpackage.setDateTimeElement(full, oldDate);

	//this.drawClock(oldDate);
	
	//console.log("out doDateTime: "+ oldDate);
	
	var broadObj= new Object();
	broadObj.date= oldDate;
	sundialTimepackage.setValue(broadObj);
	
	sundialTimepackage.sendBroadcast();
};

sundialTimepackage.setDateTime= function() {
	androidpackage.setDateTimeElement(document.getElementById('datetime-slider'), new Date());
};

sundialTimepackage.doSliders= function() {
	var full= document.getElementById("datetime-slider");
	var oldDate= new Date();
	//oldDate.setString(document.getElementById('datetime-slider').value);
	oldDate= androidpackage.getDateElement(full);
	
	var tVal= 1440* oldDate.dayFraction();
	var dVal= oldDate.getDOY(); //365/oldDate.getDOY();
	
	//console.log("tVal: "+ tVal+", dVal"+ dVal+", oldDate"+ oldDate);
	
	var slider= document.getElementById("time-slider");
	slider.value= tVal;
	slider= document.getElementById("date-slider");
	slider.value= dVal;
};

sundialTimepackage.step= function(type, val) {
	if(-2 === val) {
		this.playType= type;
		var pauseButton = document.getElementById('run-'+type);
		if(null == this.interval) {
			this.interval= window.setInterval("sundialTimepackage.step('"+type+"', 1)", 250);
			pauseButton.childNodes[0].nodeValue="| |";
		} else {
			window.clearInterval(this.interval);
			pauseButton.childNodes[0].nodeValue=">";
			this.interval= null;			
		}
	} else {
		var slider= null;
		//var txt= null;
		var full= document.getElementById("datetime-slider");
		//console.log("full.value-in: "+ full.value);
		var oldDate= new Date();
		//console.log("setString-in: "+ oldDate);
		oldDate.setString(full.value);
		//console.log("setString-out: "+ oldDate);
	
		if("date" === type) {
			slider= document.getElementById("date-slider");
			//txt= document.getElementById("date-val");
			oldDate.addDays(val);
		} else {
			//console.log("step-time-in: "+ oldDate);
			slider= document.getElementById("time-slider");
			//txt= document.getElementById("time-val");
			oldDate.addMins(val);
			//console.log("step-time-out: "+ oldDate+", "+ typeof full.value+", "+ typeof oldDate);
		}

		androidpackage.setDateTimeElement(full, oldDate);
		//console.log("full.value-out: "+ full.value);

		this.drawClock(oldDate);

	}	
	
	var broadObj= new Object();
	broadObj.date= oldDate;
	//this.doSliders();
	sundialTimepackage.setValue(broadObj);
	
	sundialTimepackage.sendBroadcast();
};

sundialTimepackage.sendBroadcast= function() {
	var full= document.getElementById("datetime-slider");
	console.log("sundialTimepackage.sendBroadcast-full.value: "+ full.value);
	var oldDate= new Date();
	oldDate= androidpackage.getDateElement(full);
	
	var broadObj= new Object();
	broadObj.date= oldDate;
	
	broadcastpackage.broadcastToAll(broadObj, "sundialTimepackage");
};

sundialTimepackage.drawClock= function(dtime) {
		var clockCanvas= document.getElementById("clock-canvas");
		var context= clockCanvas.getContext("2d");
		context.clearRect(0, 0, clockCanvas.width, clockCanvas.height);
		
		var obs= new observatory(comparepackage.topPlace, dtime);//comparepackage.topTime);
		var first= astropackage.getAzElRiseSet(obs);

		shapepackage.drawClock(context, 4, "OliveDrab", dtime, shapepackage.Point(50,55), 38, true, first.az);
};

sundialTimepackage.receiveBroadcast= function(broadObj) {
	console.log("sundialTimepackage.receiveBroadcast");

	sundialTimepackage.setValue(broadObj);
};

sundialTimepackage.getValue= function() {
	var full= document.getElementById("datetime-slider");
	var broadObj= new Object();
	broadObj.date= androidpackage.setDateTimeElement(full);
	
	utilpackage.log("getValue: "+ broadObj.date);
	
	return broadObj;
};

sundialTimepackage.setValue= function(broadObj) {
	utilpackage.log("sundialTimepackage.setValue: "+ broadObj.latitude+broadObj.date);
	
	if(null != broadObj.date) {
		var full= document.getElementById("datetime-slider");
		console.log("sundialTimepackage.setValue-full: "+ full);
		if(null !== full) {
			androidpackage.setDateTimeElement(full, broadObj.date);
			sundialTimepackage.doSliders();
			sundialTimepackage.drawClock(broadObj.date);
		}
	}
};

sundialTimepackage.setInitial= function(broadObj) {
	utilpackage.log("sundialTimepackage.setInitial: "+ broadObj.date);
	
	
	sundialTimepackage.selectedTime= new Date();

	sundialTimepackage.interval= null;
	sundialTimepackage.playType= 'time';
	comparepackage.topPlace= new place("US:Scottsdale,AZ","42:30:00",0,"71:04:00",0,300,"03:2:0","11:1:0");//new place("US:Scottsdale,AZ","38:29:30",0,"111:55:30",0,420,"03:2:0","11:1:0");//new place("US:Washington DC","38:53:51",0,"77:00:33",0,300,"03:2:0","11:1:0");//
	comparepackage.topTime= new Date();
	comparepackage.topHereNow= new observatory(comparepackage.topPlace, comparepackage.topTime);

	
	
	//broadcastpackage.addBroadcaster("sundialTimepackage");
	//if(broadObj.date) {
		sundialTimepackage.setValue(broadObj);
	//}
};
