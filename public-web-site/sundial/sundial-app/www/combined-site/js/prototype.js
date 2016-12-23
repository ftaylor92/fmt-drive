CanvasRenderingContext2D.prototype.clear = 
  CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
    if (preserveTransform) {
      this.save();
      this.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //this.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (preserveTransform) {
      this.restore();
    }           
};

CanvasRenderingContext2D.prototype.clearTwo = 
  function (preserveTransform) {
    //this.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //this.clearRect(0, 0, this.canvas.width, this.canvas.height);  
	this.width = this.width;         
};

Date.prototype.roundTenMinutes = function() {
	this.setSeconds(0);
	//console.log("round: "+ Math.round(this.getMinutes()/10)* 10);
	this.setMinutes(Math.round(this.getMinutes()/10)* 10);
};

Number.prototype.pad= function(length) {
    var str = '' + this;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;
};

Date.prototype.getDOY = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((this - onejan) / 86400000);
};

Date.prototype.addMins= function(days) {
	var t= this.getTime();
	var dz= Number(days);
	var dzm= dz* 60000;
	var dmzp= t+ dzm;
//	this.setTime(this.getTime()+Number(days)*3600000);
	this.setTime(dmzp);
};

Date.prototype.addDays= function(days) {
	this.setTime(this.getTime()+Number(days)*86400000);
	//return this;
};

Date.prototype.addHours= function(days) {
	//hours= 3600000;
	//minutes= 60000;
	//seconds= 1000;
	this.setTime(this.getTime()+Number(days)*3600000);
	//return this;
};

//Object.prototype.clone = function() {
utilpackage.objectClone= function(orig) {
	var ocopy = new Object();
	for (var i in orig) {
		ocopy[i] = orig[i];
	}
	return ocopy;
};

Number.prototype.roundDec= function(places) {
	var zeros= Math.pow(10, places);
	var num= this* zeros;
	//console.log("roundDec: "+ Math.round(num)/zeros);
	return Math.round(num)/zeros;
};

Date.prototype.clone = function() {
	var newDate= new Date();

	newDate.setMonth(this.getMonth());
	newDate.setDate(this.getDate());
	newDate.setFullYear(this.getFullYear());

	return newDate;
};

mathpackage.pad2= function(number) {
     return (number < 10 ? '0' : '') + number;
};

utilpackage.alert2= function(msg) {
	if(false) alert(msg);
};

utilpackage.alert3= function(msg) {
	if(false) alert(msg);

	return false;
};

utilpackage.log= function(msg) {
	console.log(msg);
};

Date.prototype.getAndroidDate= function() {
	//console.debug("this.getFullYear(): "+ this.getFullYear());
	//return (mathpackage.pad2(this.getMonth()+1))+"/"+mathpackage.pad2(this.getDate())+"/"+this.getFullYear();
	return this.getFullYear()+"-"+(mathpackage.pad2(this.getMonth()+1))+"-"+mathpackage.pad2(this.getDate());
};
Date.prototype.getAndroidTime= function() {
	return (mathpackage.pad2(this.getHours()))+":"+(mathpackage.pad2(this.getMinutes()))+":"+mathpackage.pad2(this.getSeconds());
};
Date.prototype.getAndroidTime2= function() {
	return (mathpackage.pad2(this.getHours()))+":"+(mathpackage.pad2(this.getMinutes()));
};
Date.prototype.getAndroidDateTime= function() {
	//console.debug("this.getFullYear(): "+ this.getFullYear());
	//return (mathpackage.pad2(this.getMonth()+1))+"/"+mathpackage.pad2(this.getDate())+"/"+this.getFullYear();
	return this.getAndroidDate()+"T"+this.getAndroidTime2()+"Z";
};

Date.prototype.getFormattedDate= function() {
	//console.debug("this.getFullYear(): "+ this.getFullYear());
	//return (mathpackage.pad2(this.getMonth()+1))+"/"+mathpackage.pad2(this.getDate())+"/"+this.getFullYear();
	return this.getFullYear()+"-"+(mathpackage.pad2(this.getMonth()+1))+"-"+mathpackage.pad2(this.getDate());
};
Date.prototype.getFormattedTime= function() {
	return (mathpackage.pad2(this.getHours()))+":"+(mathpackage.pad2(this.getMinutes()))+":"+mathpackage.pad2(this.getSeconds());
};
Date.prototype.getFormattedDateTime= function() {
	//console.debug("this.getFullYear(): "+ this.getFullYear());
	//return (mathpackage.pad2(this.getMonth()+1))+"/"+mathpackage.pad2(this.getDate())+"/"+this.getFullYear();
	return this.getFormattedDate()+"T"+this.getFormattedTime()+"Z";
};

//for this format: 2014-02-01T02:34:26Z
Date.prototype.setString= function(str) {
	var dtStr= str.split("T");
	var tstr= null;
	if(2 == dtStr.length) {
		tstr= dtStr[1];
	}

	//console.debug("str: "+ str);
	var monStr= str.substring(5,7);
	var dayStr= str.substring(8,10);
	if(0 == parseInt(monStr))	monStr= str.substring(6,7);
	if(0 == parseInt(dayStr))	dayStr= str.substring(9,10);

	var newDate= new Date();
	newDate.setMonth(parseInt(monStr)-1);
	//console.debug("monStr: "+ monStr);
	//console.debug("parseInt(monStr): "+ parseInt(monStr));
	//console.debug("month: "+ newDate.getMonth());
	//console.debug("parseInt(dayStr): "+ parseInt(dayStr));
	//console.debug("dayStr: "+ dayStr);
	newDate.setDate(parseInt(str.substring(8,10)));
	//console.debug("parseInt(str.substring(0,4)): "+ parseInt(str.substring(0,4)));
	newDate.setFullYear(parseInt(str.substring(0,4)));

	if(!newDate.getFullYear() === str.substring(0,4) || newDate.getFullYear() < 1900 || newDate.getFullYear() > 3000) { 
		throw(str+" is not valid date format yyyy-mm-dd");
	} else {
		this.setMonth(parseInt(monStr)-1);
		this.setDate(parseInt(dayStr));
		this.setFullYear(parseInt(str.substring(0,4)));
	}
	
	if(null !== tstr) {
		var timePieces= tstr.split(":");
		//console.log("hrs: "+ parseInt(timePieces[0]));
		//console.log("mins: "+ Number(-1 + parseInt(timePieces[1])));

		this.setHours(parseInt(timePieces[0]));
		this.setMinutes(Number(-0 + parseInt(timePieces[1])));
		//dt.setSeconds(parseInt(dtStr.substring(0,4)));
	}
};

Date.prototype.getMonthStr= function() {
	var month=new Array();
	month[0]="January";
	month[1]="February";
	month[2]="March";
	month[3]="April";
	month[4]="May";
	month[5]="June";
	month[6]="July";
	month[7]="August";
	month[8]="September";
	month[9]="October";
	month[10]="November";
	month[11]="December";
	return month[this.getMonth()]; 
};

datepackage.getShortMonthStr= function(str) {
	var month=new Array();
	month[0]="Jan";
	month[1]="Feb";
	month[2]="Mar";
	month[3]="Apr";
	month[4]="May";
	month[5]="Jun";
	month[6]="Jul";
	month[7]="Aug";
	month[8]="Sep";
	month[9]="Oct";
	month[10]="Nov";
	month[11]="Dec";
	return int(month[str]); 
};

Date.prototype.getDayStr= function() {
	var day_name=new Array();
	day_name[0]="Sunday"
	day_name[1]="Monday"
	day_name[2]="Tuesday"
	day_name[3]="Wednesday"
	day_name[4]="Thursday"
	day_name[5]="Friday"
	day_name[6]="Saturday"
	return day_name[this.getDay()]; 
};

String.prototype.contains = function(it) { 
	return this.indexOf(it) != -1; 
};

String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) { 
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};

String.prototype.toDate = function() {
	var dt= new Date();
	var dtStr= this.toString();
	//console.log("dtStr: "+ dtStr);
	if("/" === dtStr.match("/")) {	//12/15/2010
		//console.debug("dt: "+ dtStr);
		var monStr= dtStr.substring(0,2);
		var dayStr= dtStr.substring(3,5);
		if(0 == parseInt(monStr))	monStr= dtStr.substring(1,2);
		if(0 == parseInt(dayStr))	dayStr= dtStr.substring(4,5);

		dt.setMonth(parseInt(dtStr.substring(0,2)- 1));
		dt.setDate(parseInt(dtStr.substring(3,5)));
		dt.setFullYear(parseInt(dtStr.substring(6,10)));
	} else if("GMT" === dtStr.match("GMT")) {	//Tue Mar 12 2013 03:17:32 GMT-0400 (EDT) 
		throw(dtStr+" is not valid date format mm/dd/yyyy");
	} else {	//2012-01-15T11:54:22.253Z
		//console.debug("dt2: "+ dtStr);
		var monStr= dtStr.substring(5,7);
		var dayStr= dtStr.substring(8,10);
		if(0 == parseInt(monStr))	monStr= dtStr.substring(6,7);
		if(0 == parseInt(dayStr))	dayStr= dtStr.substring(9,10);

		dt.setDate(parseInt(dtStr.substring(8,10)));
		dt.setMonth(parseInt(dtStr.substring(5,7)- 1));
		dt.setFullYear(parseInt(dtStr.substring(0,4)));

		if(dtStr.length > 14) {
			var tStr= dtStr.substring(11);
			var timePieces= tStr.split(":");
			//console.log("hrs: "+ parseInt(timePieces[0]));
			//console.log("mins: "+ Number(-1 + parseInt(timePieces[1])));

			dt.setHours(parseInt(timePieces[0]));
			dt.setMinutes(Number(-0 + parseInt(timePieces[1])));
			//dt.setSeconds(parseInt(dtStr.substring(0,4)));			
		}
	}

	return dt;
};

String.prototype.endsWith = function(str)
{
	return (this.match(str+"$")==str);
};

String.prototype.startssWith = function(str)
{
	return (this.match("^"+str)==str);
};

/**
	returns the position in array of an element in array with attribute of field who's value is val
**/
utilpackage.positionInArray= function(array, field, val) {
	var idx= -1;
	$.each(array, function(index, element) {
		if(eval("element."+field+"===\'"+val+"\'")) idx= index;
	});
	
	return idx;
};

/*  (c) APV, Artistic License 2, retain this notice  */

Date.prototype.julianDays = function () {
  //if ( this.jd ) return this.jd;
  var y = this.getFullYear();
  var m = this.getMonth() + 1;
  var d = this.getDate();

/*
 Julian Days conversion algorithm is from
 "Astronomical Algorithms," 1991, page 61,
 Jean Meeus. Found via Peter Baum.
*/

  if ( m < 3 ) {
    m += 12;
    y--;
  }

  this.jd = 
    Math.floor( 365.25*( y + 4716.0 ) ) + 
    Math.floor( 30.6001*( m + 1 ) ) + d + 2.0 -
    Math.floor( y/100.0 ) +
    Math.floor( Math.floor( y/100.0 ) / 4.0 ) - 1524.5;

  return this.jd;
};

datepackage.dayFraction= function (hour, min, sec) {
	var fraction= ((hour)/24.0)+(min/1440.0)+(sec/86400.0);
	//console.log("hour: "+ hour+", min"+ min+", sec"+ sec+", fraction"+ fraction);
	return fraction;	//hour- 12
};

Date.prototype.dayFraction= function() {
	return datepackage.dayFraction(this.getHours(), this.getMinutes(), this.getSeconds());
};

Date.prototype.firstDayOfYear= function() {
	var firstDayOfYear= this.clone();
	firstDayOfYear.setMonth(0);
	firstDayOfYear.setDate(1);

	return firstDayOfYear;
};

Date.prototype.julianDateTime = function () {
	var hour= this.getUTCHours();
	var min= this.getUTCMinutes();
	var sec= this.getUTCSeconds();
	//console.log("h: "+ hour+", m: "+ min+", sec: "+ sec);
	var jdays= this.julianDays();
	return jdays+ dayFraction(hour, min, sec);
};

Date.prototype.modifiedJulianDay = function () {
	return (this.julianDays()- 2400000.5);
};

Date.prototype.deltaDays = function ( date2 ) {
  // might want to try/throw custom errors here
  return Math.abs( this.julianDays() - date2.julianDays() );
};

/* degrees to radians. */
astropackage.degToRad= function(degrees) {
		return degrees*Math.PI/180.0;
};
/* radians to degrees. */
astropackage.radToDeg= function(radians) {
		return radians*180.0/Math.PI;
};
