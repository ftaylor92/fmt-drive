/* This is the pseudocode you need to follow:
 * It's a modified version from 
 * http://en.wikipedia.org/wiki/Geographic_coordinate_conversion#Conversion_from_Decimal_Degree_to_DMS

function deg_to_dms( degfloat )
   Compute degrees, minutes and seconds:
   deg ← integerpart ( degfloat )
   minfloat ← 60 * ( degfloat - deg )
   min ← integerpart ( minfloat )
   secfloat ← 60 * ( minfloat - min )
   Round seconds to desired accuracy:
   secfloat ← round( secfloat, digits )
   After rounding, the seconds might become 60. These two
   if-tests are not necessary if no rounding is done.
   if secfloat = 60
      min ← min + 1
      secfloat ← 0
   end if
   if min = 60
      deg ← deg + 1
      min ← 0
   end if
   Return output:
   return ( deg, min, secfloat )
end function
*/

astropackage.createPlace= function(name, lat, lon) {
	var latStr= this.deg_to_dms(Math.abs(lat));
	var lonStr= this.deg_to_dms(Math.abs(lon));

	var ns= (lat > 0) ? 0 : 1;
	var we= (lon > 0) ? 1 : 0;

	//dss,dse
	var zone= 60* (Math.floor(Math.abs(lon)/ (360/ 24))+ (1- we));
	if(1 === we) {
		zone= -zone;
	}

	//zone=-600;
	var daylightSavingStarts= null;
	var daylightSavingEnds= null;
	
	//console.log("zone: "+ zone);
	//console.log("lon: "+ lonStr);

/*	new place("FR:Marseille","43:18:00",0,"5:22:00",1,-60,"3:5:0","10:5:0"),
	new place("PL:Warszawa","52:15:00",0,"21:00:00",1,-60,"3:5:0","10:5:0"),
	new place("GB:Greenwich","51:28:38",0,"00:00:00",0,0,"3:5:0","10:5:0"),
	new place("AU:Melbourne","37:48:00",1,"144:58:00",1,-600,"10:5:0","03:5:0"),
	new place("BR:Rio de Janeiro","22:54:00",1,"43:16:00",0,180,"",""),
	new place("US:WashD.C.","42:30:51",0,"71:06:33",0,300,"03:2:0","11:1:0"); */
	//console.log("place("+name+", "+latStr+", "+ns+", "+lonStr+", "+we+", "+zone+", "+daylightSavingStarts+", "+daylightSavingEnds+")");


	
	var here= new place(name, latStr, ns, lonStr, we, zone, daylightSavingStarts, daylightSavingEnds);

	return here;
};

astropackage.deg_to_dms= function(deg) {
   var d = Math.floor (deg);
   var minfloat = (deg-d)*60;
   var m = Math.floor(minfloat);
   var secfloat = (minfloat-m)*60;
   var s = Math.round(secfloat);
   // After rounding, the seconds might become 60. These two
   // if-tests are not necessary if no rounding is done.
   if (s==60) {
     m++;
     s=0;
   }
   if (m==60) {
     d++;
     m=0;
   }
   
   return ("" + d.pad(2) + ":" + m.pad(2) + ":" + s.pad(2));
};

astropackage.dmstr_to_deg= function(str) {
	//console.log("dmstr_to_deg("+str+")");
	if(str.substr(0,1) === '-') {
		str= str.substr(1);
		return Number(-1.0* this.dms_to_deg(Number(str.substr(0,2)),Number(str.substr(3,2)),Number(str.substr(6,2))));
	}
	return Number(this.dms_to_deg(Number(str.substr(0,2)),Number(str.substr(3,2)),Number(str.substr(6,2))));
};

astropackage.dms_to_deg= function(degrees,minutes,seconds) {
	//console.log("dms_to_deg("+degrees+","+minutes+","+seconds+")");

	//begin  23°26’49”**
	//degrees = 23.0;
	//minutes = 26.0;
	//seconds = 49.0;
	var decimal = ((minutes * 60.0)+seconds) / (60.0*60.0);
	var answer = degrees + decimal;
	//finish  23.44694444**

	return answer;
};

astropackage.diffTimes= function(t, t2) {
	var diff= new Object();

	var dt= new Date();
	var dt2= dt.clone();

	dt.setHours(Number(t.substr(0,2)));
	dt.setMinutes(Number(t.substr(3,2)));
	dt.setSeconds(Number(t.substr(6,2)));

	dt2.setHours(Number(t2.substr(0,2)));
	dt2.setMinutes(Number(t2.substr(3,2)));
	dt2.setSeconds(Number(t2.substr(6,2)));

	var millis= dt2.getTime()- dt.getTime();
	//console.log("millis: "+ millis);
	diff.hours= Math.floor(millis/3600000);
	diff.minutes= Math.floor(millis/60000)- (diff.hours* 60);
	diff.seconds= Math.floor(millis/1000);
	
	return diff;
};

astropackage.getAzElRiseSet= function(obsr) {
	//console.log("Time1 = "+timestring(obsr,false));
	var retVal= new Object();
	var obscopy = utilpackage.objectClone(obsr);
	//console.log("Time2 = "+timestring(obscopy,false));
	
	//console.log("Date = "+datestring(obscopy));
	//var sunDate= datestring(obscopy).split(":")[1]+"/"+datestring(obscopy).split(":")[2];
    retVal.strDate= datestring(obscopy);
    //console.log("Time3 = "+timestring(obscopy,false));
    retVal.date= new Date(obscopy.year, obscopy.month, obscopy.day, obscopy.hours, obscopy.minutes, obscopy.seconds, 0);
	retVal.strTime= timestring(obscopy,false);
	var sun_xyz = new Array(0.0, 0.0, 0.0);

	var earth_xyz = helios(planets[2], obscopy);
	var radec = radecr(sun_xyz, earth_xyz, obscopy);
	retVal.ra=radec[0];
	retVal.dec=radec[1];
	
	var altaz = radtoaa(radec[0], radec[1], obscopy);
	retVal.el=altaz[0];
	retVal.az=altaz[1];
	//console.log("az: "+ altaz[1]+ ", el: "+ altaz[0]);
	var sunAngle= altaz[1];
	retVal.earthDistance = Math.round(radec[2]);
	// Do the various twilight definitions			var twilight= new Array(-0.833,-6.0,-12.0,-18.0);
	var twilight = new Array(-0.833, -6.0, -12.0, -18.0);
	var riseset = sunrise(obscopy, twilight[0]);
	//console.log("rize: " + riseset[0]);
	var sunTime= riseset[0];
	//console.log("set: " + riseset[1]);
	retVal.rise=riseset[0];
	retVal.set=riseset[1];
				
	//console.log("days: "+ dtNum+", az: "+ altaz[1]);
	
	return retVal;
};

astropackage.getAzElRaDec= function(obsr) {
	//console.log("Time1 = "+timestring(obsr,false));
	var retVal= new Object();
	var obscopy = utilpackage.objectClone(obsr);
	//console.log("Time2 = "+timestring(obscopy,false));
	//
	//console.log("Date = "+datestring(obscopy));
	//var sunDate= datestring(obscopy).split(":")[1]+"/"+datestring(obscopy).split(":")[2];
    retVal.strDate= datestring(obscopy);
    //console.log("Time3 = "+timestring(obscopy,false));
    retVal.date= new Date(obscopy.year, obscopy.month, obscopy.day, obscopy.hours, obscopy.minutes, obscopy.seconds, 0);
	retVal.strTime= timestring(obscopy,false);
	//console.log("Time4 = "+retVal.strTime);
	var sun_xyz = new Array(0.0, 0.0, 0.0);

	var earth_xyz = helios(planets[2], obscopy);
	var radec = radecr(sun_xyz, earth_xyz, obscopy);
	retVal.ra=radec[0];
	retVal.dec=radec[1];
	
	var altaz = radtoaa(radec[0], radec[1], obscopy);
	retVal.el=altaz[0];
	retVal.az=altaz[1];
	
	return retVal;
};