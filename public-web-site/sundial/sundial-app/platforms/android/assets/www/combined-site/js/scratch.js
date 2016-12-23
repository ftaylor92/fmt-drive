//calcpackage.here= new place("US:Wakefield","42:30:40",0,"71:02:18",0,300,"03:2:0","11:1:0");
//calcpackage.here= new place("PL:Warszawa","52:15:00",0,"21:00:00",1,-60,"3:5:0","10:5:0");
calcpackage.here= new place("AU:Melbourne","37:48:00",1,"144:58:00",1,-600,"10:5:0","03:5:0");
//calcpackage.here= new place("BR:Rio de Janeiro","22:54:00",1,"43:16:00",0,180,null,null);

calcpackage.sunAzEl= function(daysAhead) {
	document.write("<output>");

	var now= new Date();
	var firstDayOfYear= now.firstDayOfYear();
	now.setHours(0);

	for(var d= 0; d < 24; d++) {
		//now.setMonth(6);
		//now.setDate(15);
		//now.setFullYear(2000);

		//document.write(now+"<br/>");
		document.write(now.getHours()+":"+now.getMinutes()+"  ");
		
		var obs= new observatory(this.here, now);
		var azVals= astropackage.getAzElRiseSet(obs);

		//var here2= astropackage.createPlace("Rio",-22.90,-43.27);
		var here2= astropackage.createPlace("Melbourne",-37.8,144.9668);
		//var here2= astropackage.createPlace("Warsaw",52.25,21.0);
		//var here2= astropackage.createPlace("Wakefield",42.510985399999996,-71.0380153);
		var obs2= new observatory(here2, now);
		var azVals2= astropackage.getAzElRiseSet(obs2);

		document.write(azVals.az+", "+ azVals.el+"<br/>");

		/*document.write(now.getHours()+":"+now.getMinutes()+"  ");
		document.write(azVals2.az+", "+ azVals2.el+"<br/>");*/
		
		var xyz= this.cartesian(azVals.az, azVals.el, obs);

		now.setHours(now.getHours()+1);
	}

	document.write("</output>");
};

calcpackage.cartesian= function(az, el, place) {
	console.log("az: "+ az+", el: "+ el);
	var lon= az;
	var lat= el;
	var x,y,z,alt;
	var liteDesc;
	
	var canvasHeight= 300.0;
	var r= 200.0;
	var etsc= 90.0- el; //Math.acos(lightDistantance/earthRadius);
	console.log("etsc="+etsc);

	alt = 100.0;
	x = alt * Math.cos(astropackage.degToRad(lat)) * Math.sin(astropackage.degToRad(lon));
	y = alt * Math.sin(astropackage.degToRad(lat));
	z = alt * Math.cos(astropackage.degToRad(lat)) * Math.cos(astropackage.degToRad(lon));
	liteDesc= "x="+ (alt- Math.round(x))+", y="+ (canvasHeight- Math.round(y))+", z="+ Math.round(z);
	liteDesc+= 
	document.write(liteDesc+"(2d sundial)<br/>");
	
	alt = 100.0;
	x = alt * Math.cos(astropackage.degToRad(lat)) * Math.sin(astropackage.degToRad(lon));
	y = alt * Math.sin(astropackage.degToRad(lat));
	z = alt * Math.cos(astropackage.degToRad(lat)) * Math.cos(astropackage.degToRad(lon));
	liteDesc= "x="+ Math.round(x)+", y="+ Math.round(y)+", z="+ Math.round(z);
	document.write(liteDesc+"(best)<br/>");
	
	x = r * Math.sin(astropackage.degToRad(etsc)) * Math.cos(astropackage.degToRad(az));
	y = r * Math.sin(astropackage.degToRad(etsc)) * Math.sin(astropackage.degToRad(az));
	z = r * Math.sin(astropackage.degToRad(el));	//=Math.cos(astropackage.degToRad(etsc));
	liteDesc= "x="+ Math.round(x)+", y="+ Math.round(y)+", z="+ Math.round(z);
	document.write(liteDesc+"<br/>");
	
	x = r *Math.cos(astropackage.degToRad(el))* Math.sin(astropackage.degToRad(az));
	y = r *Math.cos(astropackage.degToRad(el))* Math.cos(astropackage.degToRad(az));
	z = r *Math.sin(astropackage.degToRad(el));
	liteDesc= "x="+ Math.round(x)+", y="+ Math.round(y)+", z="+ Math.round(z);
	document.write(liteDesc+"<br/>");
	
	x = r *Math.sin(astropackage.degToRad(el))* Math.cos(astropackage.degToRad(az));
	y = r *Math.sin(astropackage.degToRad(el))* Math.sin(astropackage.degToRad(az));
	z = r *Math.cos(astropackage.degToRad(el));
	liteDesc= "x="+ Math.round(x)+", y="+ Math.round(y)+", z="+ Math.round(z);
	document.write(liteDesc+"<br/>");
	
	var radec= aatorad(az, el, place);
	var RA= radec[0];
	var Decl= radec[1];
	
	console.log("RA: "+ RA+", DEC: "+ Decl);
	
	x = r * Math.cos(astropackage.degToRad(RA)) * Math.cos(astropackage.degToRad(Decl));
    y = r * Math.sin(astropackage.degToRad(RA)) * Math.cos(astropackage.degToRad(Decl));
    z = r * Math.sin(astropackage.degToRad(Decl));
	
	//console.log("star x="+star.position.x+", y="+star.position.y+", z="+ star.position.z);
	/*this.light.position.x = x;
	this.light.position.y = y;
	this.light.position.z = z;*/
	liteDesc= "x="+ Math.round(x)+", y="+ Math.round(y)+", z="+ Math.round(z);
	document.write(liteDesc+"<br/>");
	
	/*alt= lightDistantance;
	x = alt * Math.cos(astropackage.degToRad(lat)) * Math.sin(astropackage.degToRad(lon));
	y = alt * Math.sin(astropackage.degToRad(lat));
	z = alt * Math.cos(astropackage.degToRad(lat)) * Math.cos(astropackage.degToRad(lon));*/
};
