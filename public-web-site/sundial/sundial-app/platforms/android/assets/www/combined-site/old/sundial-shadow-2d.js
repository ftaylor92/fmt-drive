/*  Show a pyramid with five differently colored sides using Three.js.
 *  The pyramid geometry is constructed directly.
 *  The cube can be rotated using the arrow keys.  The home key
 *  or the return key will reset the rotation to zero.  WebGL
 *  will be used if available.  If not, the program will attempt
 *  to use the canvas 2D API.
 */

sundialShadowpackage.setInitial= function() {
	
	document.getElementById('comparison-sundialName').value= "Wakefield";
	document.getElementById('comparison-dtime').value= (new Date()).getFormattedDateTime(); //new Date(2014, 5, 21);
	document.getElementById('comparison-latitude').value= '42.5109955';
	document.getElementById('comparison-longitude').value= '-71.0382657';
};

astropackage.azElToCartensian= function(az, el, radius) {
	var retVal= new Object();
	retVal.x = radius * Math.cos(astropackage.degToRad(el)) * Math.sin(astropackage.degToRad(az));
	retVal.y = radius * Math.sin(astropackage.degToRad(el));
	retVal.z = radius * Math.cos(astropackage.degToRad(el)) * Math.cos(astropackage.degToRad(az));
	
	return retVal;
};

sundialShadowpackage.doAz= function(place) {
	var az= Number(document.getElementById('lat').value);
	var el= Number(document.getElementById('lon').value);
	console.log("doLatLon(): ");
};

sundialShadowpackage.doLocationName= function(lat, lon) {
	//if(Math.round(position.coords.latitude*100) != 4251 && Math.round(position.coords.longitude*100) != -7104) {
	var geoUrl= "http://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lon+"&sensor=true";
	console.log("geoURL: "+ geoUrl);
	$.get(geoUrl, function(data, txtstatus, xbr) {

		var placeName= "Here";
		data.results[0].address_components.forEach(function(entry) {
		//console.debug(entry);
		if(entry.types[0] == "locality" && entry.types[1] == "political") {
			placeName= entry.short_name;
		}
		});
		/*risesetpackage.here.name= placeName;
		risesetpackage.setPlaceTxt(risesetpackage.here);*/
		document.getElementById("placeName").value= placeName;
		
	});
	//}
};

sundialShadowpackage.sendBroadcast= function() {
	var broadObj= new Object();
	broadObj.date= y;
};
sundialShadowpackage.receiveBroadcast= function(broadObj) {
	sundialShadowpackage.setValue(broadObj);
};

sundialShadowpackage.setInitial= function(broadObj) {
	sundialShadowpackage.setValue(broadObj);
	if(broadObj.latitude) {
		sundialTwopackage.createDialCurrent(broadObj);
	}
};
sundialShadowpackage.getValue= function() {};
sundialShadowpackage.setValue= function(broadObj) {
	utilpackage.log("sundialShadowpackage.setValue: "+ broadObj.date+", "+broadObj.latitude+", "+ broadObj.longitude);

	if(broadObj.latitude) {
		document.getElementById('comparison-latitude').value= broadObj.latitude;
		document.getElementById('comparison-longitude').value= broadObj.longitude;
		document.getElementById('current-latitude').value= broadObj.latitude;
		document.getElementById('current-longitude').value= broadObj.longitude;
		//sundialTwopackage.createDialCurrent(broadObj);
	}
	if(broadObj.placeName) {
		document.getElementById('comparison-sundialName').value= broadObj.placeName;
		document.getElementById('current-sundialName').value= broadObj.placeName;
	} else {
		document.getElementById('comparison-sundialName').value= "Here";
		document.getElementById('current-sundialName').value= "HereNow";
	}
	if(null != broadObj.date) {
		var full= document.getElementById("comparison-dtime");
		androidpackage.setDateTimeElement(full, broadObj.date);
		full= document.getElementById("current-dtime");
		androidpackage.setDateTimeElement(full, broadObj.date);
	}
};
