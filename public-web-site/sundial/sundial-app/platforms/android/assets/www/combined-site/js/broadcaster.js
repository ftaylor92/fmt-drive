/*
 * sets up and sends and recieves broadcasts to other packages.
 * 
 * Broadcaster interface functions:
 * 	void setInitial(BroadObj)
 * 	BroadObj getValue
 * 	void setValue(BroadObj)
 * 	void sendBroadcast()
 * 	void receiveBroadcast(BroadObj)
 * 
 * BroadObj member variables are:
 * 	Date		date
 * 	float		latitude
 * 	float		longitude
 * 	observatory	observer
 * 	place		place
 *	string		placeName
 * 	float		azimuth
 * 	float		elevation
 * code:
xpackage.sendBroadcast= function() {
	var broadObj= new Object();
	broadObj.date= y;
	
	broadcastpackage.broadcastToAll(broadObj, "xpackage");
};
xpackage.receiveBroadcast= function(broadObj) {};
xpackage.setInitial= function(broadObj) {
	this.setValue(broadObj);
};
xpackage.getValue= function() {};
xpackage.setValue= function(broadObj) {
	if(broadObj.latitude) {
	}
};
 */
//broadcastpackage.allPackages= new Array();

broadcastpackage.broadcastToAll= function(broadObj, sendingPackageName) {
	broadcastpackage.addToBroadObj(broadObj);
	
	//var strParam = dtime;
	 
	for(var i= 0; i < this.allPackages.length; i++) { 
		try {
			utilpackage.log("broadcast to: "+ this.allPackages[i]+"::receiveBroadcast() from "+ sendingPackageName);
			
			if(sendingPackageName === this.allPackages[i]) continue;
			
			utilpackage.log("broadcasted");
			
			var strFunction = this.allPackages[i]+ ".receiveBroadcast";
			
			//Create the function
			var fn = eval(strFunction); //window[strFunction];
			
			//Call the function
			//var funcCall = strFunction + "('" + strParam + "');";
			//window.setTimeout("fn(broadObj)", 3000 ); //fn(broadObj);
			fn(broadObj);
		} catch(err) { 
			console.error(err.message);
			//document.getElementById("mobile-errors").innerHTML= err.message;
		}
	}
};

broadcastpackage.setupAll= function(broadObj) {
	console.log("broadcastpackage.setupAll.broadObj: "+ broadObj);
	broadcastpackage.addToBroadObj(broadObj);
	
	for(var i= 0; i < this.allPackages.length; i++) {
		try {
			var strFunction = this.allPackages[i]+ ".setInitial";
			
			//Create the function
			var fn = eval(strFunction);
			//utilpackage.log("strFunction: "+ strFunction+", fn: "+ fn);
			
			//Call the function
			fn(broadObj);
		} catch(err) { 
			console.error(err.message);
		}
	}
};

broadcastpackage.addBroadcaster= function(broadcastPackageName) {
	this.allPackages.push(broadcastPackageName);
};

broadcastpackage.addToBroadObj= function(broadObj) {
	if(broadcastpackage.allBroadObj === null)	broadcastpackage.allBroadObj= new Object;
	
	/*if(broadObj.date)	broadcastpackage.allBroadObj.date= broadObj.date;
	if(broadObj.latitude)	broadcastpackage.allBroadObj.latitude= broadObj.latitude;
	if(broadObj.longitude)	broadcastpackage.allBroadObj.longitude= broadObj.longitude;
	if(broadObj.observer)	broadcastpackage.allBroadObj.observer= broadObj.observer;
	if(broadObj.place)	broadcastpackage.allBroadObj.place= broadObj.place;
	if(broadObj.placeName)	broadcastpackage.allBroadObj.placeName= broadObj.placeName;
	*/
	for (var i in broadObj) {
		broadcastpackage.allBroadObj[i]= broadObj[i];
	}
};

utilpackage.objectClone= function(orig) {
	var ocopy = new Object();
	for (var i in orig) {
		ocopy[i] = orig[i];
	}
	return ocopy;
};