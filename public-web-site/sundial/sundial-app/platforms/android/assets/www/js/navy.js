var minutesBetweenSteps= 2;

/* convert from 12/12/2012 to 2012-12-12 */
function dateStringConverter(mdy) {
	var pieces= mdy.split("/");
	var yr= pieces[2];
	var m= pieces[0];
	var d= pieces[1];

	if(m.length === 1)	m= "0"+m;
	if(d.length === 1)	d= "0"+d;

	return yr+"-"+m+"-"+d;
}

/* convert from 0:00:00 to 00:00:00 )*/
function timeConverter(hms) {
	if(hms.length < 8)	hms= "0"+hms;
	return hms;
}

	/**
		encode URL to use with HTTPCacher web service.
		param: originalUrl URL you want called and HTTP-Result returned.
	**/
	function encodeForHttpCacher(originalUrl) {
		return encodeURI(originalUrl).replace(/&/g,'ANDK');
	}

	/**
	creates full URL to use to call HTTPCacher web service with the URL you want called/mocked.
		param: originalUrl URL you want called and HTTP-Result returned.
	**/
	function createFullHttpCacherUrl(originalUrl) {
			var cacherlUrl= "http://rest-db-jsp-servlet-jersey.herokuapp.com/rest/httpcache?url=";
		return cacherlUrl+ encodeForHttpCacher(originalUrl);
	}

function NavyData(ddate,Time,AzimuthAngle,ElevationRefracted,Declination,MeanAnomaly,MeanLongitude,JulianDay) {
	this.ddate= ddate;
	this.Time= timeConverter(Time);
	this.AzimuthAngle= Number(AzimuthAngle);
	this.ElevationRefracted= Number(ElevationRefracted);
	this.Declination= Number(Declination);
	this.MeanAnomaly= Number(MeanAnomaly);
	this.MeanLongitude= Number(MeanLongitude);
	this.JulianDay= Number(JulianDay);
	var dtPart= dateStringConverter(ddate); //NavyAngles[n].ddate.replace(/\//g,'-');
		
	var dStr= dtPart+"T"+timeConverter(Time);
	//console.debug("dStr: "+ dStr);
	this.dateObj= new Date(dStr);
	//console.debug("dateObj: "+ this.dateObj);
}

function getAzEl(placesPlace, lat, long, dtimeVal) {
	//var counterUrl="https://fmt-bookmarks.herokuapp.com/rest/counter?site="+ encodeURIComponent(window.location.href);
	//var azElUrl= "http://localhost:8080/full-j2EE/rest/sundial";
	var timezoneOffset= 2.0;
	//var azElUrl= "http://localhost:8080/full-j2EE/rest/httpcache?url=";//"http://rest-db-jsp-servlet-jersey.herokuapp.com/rest/httpcache?url=";
	//var nn= "http://www.nrel.gov/midc/apps/solpos.pl?syear=1997&smonth=9&sday=25&eyear=1997&emonth=9&eday=25&step=10&stepunit=1&latitude=-26.25&longitude=28.00&timezone=-0.0&press=1013.0&temp=15&aspect=180&tilt=0&solcon=1367&sbwid=7.6&sbrad=31.7&sbsky=0.04&interval=0&field=2&field=11&field=6&field=21&field=22&field=19&zip=0";
	//console.debug("navyURL: "+ nn);
	var navyUrl= "http://www.nrel.gov/midc/apps/solpos.pl?syear="+dtimeVal.getFullYear()+"&smonth="+(dtimeVal.getMonth()+1)+"&sday="+dtimeVal.getDate()+"&eyear="+dtimeVal.getFullYear()+"&emonth="+(dtimeVal.getMonth()+1)+"&eday="+dtimeVal.getDate()+"&step="+minutesBetweenSteps+"&stepunit=1&latitude="+lat+"&longitude="+long+"&timezone="+timezoneOffset+"&press=1013.0&temp=15&aspect=180&tilt=0&solcon=1367&sbwid=7.6&sbrad=31.7&sbsky=0.04&interval=0&field=2&field=11&field=6&field=21&field=22&field=19&zip=0";
	//console.debug("navyVal: "+ navyUrl);

	var cacherUrl= createFullHttpCacherUrl(navyUrl);

	console.debug("fullUrl: "+ cacherUrl);

	$.get(cacherUrl, function(data, txtstatus, xbr) {
		//$("#counter").html("<br/><br/><small><em>count: "+ data+"</em></small>");
		var dataArray= (""+ data).split(',');
		
		var c= 0;
		var NavyAngles= new Array();
		for(var i= 8; i < dataArray.length; i+= 8) {
			var navy= new NavyData(dataArray[i], dataArray[i+1], dataArray[i+2], dataArray[i+3], dataArray[i+4], dataArray[i+5], dataArray[i+6], dataArray[i+7]);
			console.log("response: "+ navy.ddate+","+navy.Time+","+navy.AzimuthAngle+","+navy.ElevationRefracted+"\n");
			NavyAngles[c++]= navy;
		}

		places[placesPlace].setNavyAngles(NavyAngles);
	});
}
