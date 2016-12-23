androidpackage.setDateTimeElement= function(element, dtime) {
	var isMobile= this.isAndroid();

	if(isMobile) {
		element.value= dtime.getAndroidDateTime();
	} else {
		element.value= dtime.getFormattedDateTime();
	}
};

androidpackage.setDateElement= function(element, dtime) {
	var isMobile= this.isAndroid();

	if(isMobile) {
		element.value= dtime.getAndroidDate();
	} else {
		element.value= dtime.getFormattedDate();
	}
};

androidpackage.setTimeElement= function(element, dtime) {
	var isMobile= this.isAndroid();

	if(isMobile) {
		element.value= dtime.getAndroidTime();
	} else {
		element.value= dtime.getFormattedTime();
	}
};

androidpackage.getDateElement= function(element) {
	//var isMobile= this.isAndroid();

	//var newDate= element.value;
	//if(!isMobile) {
		newDate= new Date(element.value);
	//}

	return newDate;
};

androidpackage.getBrowserPlatform= function() {
	var txt = "<p>Browser CodeName: " + navigator.appCodeName + "</p>";
	txt+= "<p>Browser Name: " + navigator.appName + "</p>";
	txt+= "<p>Browser Version: " + navigator.appVersion + "</p>";
	txt+= "<p>Cookies Enabled: " + navigator.cookieEnabled + "</p>";
	txt+= "<p>Platform: " + navigator.platform + "</p>";
	txt+= "<p>User-agent header: " + navigator.userAgent + "</p>";

	var browser = navigator.userAgent.toLowerCase();
	return browser+": "+ txt;
};

androidpackage.isFirefox= function() {
	return this.getBrowserPlatform().indexOf("Firefox") != -1;
};

androidpackage.isChrome= function() {
	return this.getBrowserPlatform().indexOf("Chrome") != -1;
};

androidpackage.isPC= function() {
	return this.getBrowserPlatform().indexOf("86") != -1;
};

androidpackage.isAndroid= function() {
	return this.getBrowserPlatform().indexOf("android") != -1;
};

androidpackage.isWebView= function() {
	return this.getBrowserPlatform().indexOf("google_sdk") != -1;
};

androidpackage.handlesSvg= function() {
	return this.isAndroid() && navigator.appVersion.indexOf("android") != -1;
};
