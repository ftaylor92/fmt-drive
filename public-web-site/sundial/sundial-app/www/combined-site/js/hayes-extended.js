
hayespackage.observatoryToString= function(obsrvr) {
	return "date: "+ this.getObserverTime(obsrvr)+ ", name: "+ obsrvr.name+ ", lat: "+ obsrvr.latitude+ ", long: "+ obsrvr.longitude+ ", timezone: "+ obsrvr.tz;
};

hayespackage.getObserverTime= function(obrvr) {
  var dtime= new Date();

  dtime.setFullYear(obrvr.year);
  dtime.setMonth(obrvr.month- 1);
  dtime.setDate(obrvr.day);
  dtime.setHours(obrvr.hours);
  dtime.setMinutes(obrvr.minutes);
  dtime.setSeconds(obrvr.seconds);

  return dtime;
};

hayespackage.setObserverTime= function(obrvr, when) {
  obrvr.year = when.getFullYear();
  obrvr.month = when.getMonth()+1;
  obrvr.day = when.getDate();
  obrvr.hours = when.getHours();
  obrvr.minutes = when.getMinutes();
  obrvr.seconds = when.getSeconds();
};

