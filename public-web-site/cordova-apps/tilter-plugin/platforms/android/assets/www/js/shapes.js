shapepackage.drawClock= function(context, thickness, color, dtime, originPt, radius, drawMinuteHand, azAngle) {
		var origin= originPt.copy();

		// Draw a path
		//context.beginPath();
		//context.lineWidth= thickness;
		//context.moveTo(origin.x, origin.y);	// center of clock

		var minutesInADay= 60* 24;
		var minutesInHalfDay= 60* 12;
		var minutesInAHour= 60;
		var minutesFromMidnight= dtime.getHours()* 60+ dtime.getMinutes();
		var minutesFromMeridian= minutesFromMidnight % minutesInHalfDay;
		var minutesFromHour= minutesFromMidnight % 60;
		//var radiansAngle= Math.PI/180.0* 2* minutesInADay/minutesFromMidnight;
		var degreesAngle= minutesFromMidnight/minutesInADay* 360- 360- 90;//360* minutesFromMidnight/minutesInADay; //- 270;
		var dayRadiansAngle= astropackage.degToRad(degreesAngle);
		degreesAngle= minutesFromMeridian/minutesInADay* 360* 2- 360- 90;//360* minutesFromMidnight/minutesInADay; //- 270;
		var halfRadiansAngle= astropackage.degToRad(degreesAngle);
		degreesAngle= minutesFromHour/minutesInAHour* 360- 360- 90; //* 12- 360- 90;//360* minutesFromMidnight/minutesInADay; //- 270;
		var minutesRadiansAngle= astropackage.degToRad(degreesAngle);

		//console.log("degreesAngle: "+ degreesAngle);

		//context.lineTo(origin.x+ radius* Math.cos(radiansAngle), origin.y+ radius* Math.sin(radiansAngle));	//end of hour hand
		//context.closePath();

		var endOfDayHand= shapepackage.Point(origin.x+ radius/2.0* Math.cos(dayRadiansAngle), origin.y+ radius/2.0* Math.sin(dayRadiansAngle));
		var endOfHourHand= shapepackage.Point(origin.x+ radius*0.8 * Math.cos(halfRadiansAngle), origin.y+ radius*0.8 * Math.sin(halfRadiansAngle));

		//console.debug("minutesFromMidnight: "+ minutesFromMidnight);
		//console.debug("minutesFromMeridian: "+ minutesFromMeridian);
		//console.debug("minutesFromHour: "+ minutesFromHour);
		//console.debug("radiansAngle: "+ dayRadiansAngle);
		//console.debug("degreesAngle: "+ degreesAngle);
		//console.debug("endOfHand: "+ endOfDayHand.toString());

		//24-hour day
		var hand= shapepackage.Line(origin, endOfDayHand);
		hand.draw(context, thickness, "IndianRed");

		//hour
		hand= shapepackage.Line(origin, endOfHourHand);
		hand.draw(context, thickness, "CadetBlue");

		//minute
		if(drawMinuteHand)	{
			var endOfMinuteHand= shapepackage.Point(origin.x+ radius* Math.cos(minutesRadiansAngle), origin.y+ radius* Math.sin(minutesRadiansAngle));
			hand= shapepackage.Line(origin, endOfMinuteHand);
			hand.draw(context, thickness, "MediumOrchid");
		}

		//shadow
		//console.log("azAngle: "+ azAngle+" at "+ dtime);
		if(azAngle) {
			azAngle+= 180.0- 90.0;
			var endOfShadowHand= shapepackage.Point(origin.x+ radius* Math.cos(astropackage.degToRad(azAngle)), origin.y+ radius* Math.sin(astropackage.degToRad(azAngle)));
			hand= shapepackage.Line(origin, endOfShadowHand);
			hand.draw(context, thickness, "magenta");
		}

		// Fill the path
		//context.fillStyle = color;
		//context.fill();

		//draw Numbers
		/*context.fillText("6", origin.x+ radius+ 5, origin.y);
		context.fillText("18", origin.x- radius- 15, origin.y);
		context.fillText("24/00", origin.x- 12, origin.y- radius);
		context.fillText("12", origin.x, origin.y+ radius);
		context.fillText("X1X", origin.x+Math.cos(2*Math.PI*1.0/24.0)*radius, origin.y+Math.sin(2*Math.PI*1.0/24.0)*radius);
		context.fillText("X2X", origin.x+Math.cos(2*Math.PI*2.0/24.0)*radius, origin.y+Math.sin(2*Math.PI*2.0/24.0)*radius);
		context.fillText("X3X", origin.x+Math.cos(2*Math.PI*3.0/24.0)*radius, origin.y+Math.sin(2*Math.PI*3.0/24.0)*radius);

		context.fillText("X4X", origin.x+Math.cos(2*Math.PI*4.0/24.0)*radius, origin.y+Math.sin(2*Math.PI*4.0/24.0)*radius);

		context.fillText("X20X", origin.x+Math.cos(2*Math.PI*20.0/24.0)*radius, origin.y+Math.sin(2*Math.PI*20.0/24.0)*radius);
		context.fillText("X21X", origin.x+Math.cos(2*Math.PI*21.0/24.0)*radius, origin.y+Math.sin(2*Math.PI*21.0/24.0)*radius);
		context.fillText("X2X", origin.x+Math.cos(2*Math.PI*22.0/24.0)*radius, origin.y+Math.sin(2*Math.PI*22.0/24.0)*radius);*/
		context.fillStyle = "YellowGreen";
		context.strokeStyle = "YellowGreen";
		for(var c= 1; c <= 24; c++) {
	 		context.fillText(""+c, origin.x+Math.cos(2*Math.PI*c/24.0- Math.PI/2)*radius, origin.y+Math.sin(2*Math.PI*c/24.0- Math.PI/2)*radius);
		}
		context.fillStyle = "DarkGoldenRod";
		context.strokeStyle = "DarkGoldenRod";
		radius+= 7;
		for(var c= 1; c <= 12; c++) {
	 		context.fillText(""+c, origin.x+Math.cos(2*Math.PI*c/12.0- Math.PI/2)*radius, origin.y+Math.sin(2*Math.PI*c/12.0- Math.PI/2)*radius);
		}
};

/**866 723 0513, 800 717 6710
Place Class.
**/
shapepackage.Place= function(lat, lon, dtime, dialname) {
	var cthis= new Object();

	cthis.quadrant= "";
	cthis.latitude= lat;
	cthis.quadrant+= (lat > 0.0) ? "N" : "S";

	cthis.longitude= lon;
	cthis.quadrant+= (lon > 0.0) ? "E" : "W";

	cthis.sundialName= dialname;
	//console.log("dtime: "+ dtime.getTime());
	//cthis.time= dtime.clone();
	cthis.ticker= dtime.clone();
	//this.ticker.setSeconds(0);
	//this.ticker.roundTenMinutes();
	//this.ticker= new Date("2014-01-03T22:35Z");
	//console.log("ticker: "+ cthis.ticker);
	
	cthis.place= astropackage.createPlace(dialname, lat, lon);
	cthis.date= dtime.clone();
	
	/*cthis.setNavyAngles= function(a) {
		this.navyAngles= a;
	}

	cthis.setNavyData= function(d) {
		this.navyData= d;

		var dtPart= datepackage.dateStringConverter(d.ddate); //NavyAngles[n].ddate.replace(/\//g,'-');
		var tstr= datepackage.timeConverter(d.Time);
		var dstr= dtPart+"T"+tstr;
		//console.log("dstr: "+ dstr);
		this.ndate= new Date(dstr);
		//console.log();
	}*/
	
	cthis.toString= function() {
		return this.sundialName+": "+ latitude+", "+longitude+"; "+ place;
	};

	return cthis;
};

/**
Point Class
params: x,y: x,y coordinates of this Point
**/
shapepackage.Point= function(x,y) {
	var cthis= new Object();

	cthis.x= x;
	cthis.y= y;

	cthis.constructor= function(x, y) {
		this.x= x;
		this.y= y;
	};

	cthis.draw= function(context, thickness, color) {
		var pointLine= shapepackage.Line(this, shapepackage.Point(this.x+ thickness,this.y+ thickness));
		pointLine.draw(context, thickness, color);
	};

	cthis.copy= function() {
		var newPoint= shapepackage.Point(this.x,this.y);

		return newPoint;
	};

	cthis.move= function(x,y) {
		//console.log("pt: "+ new Point(this.x,this.y).toString());
		this.x+= x;
		this.y+= y;
		//console.log("ptm: "+ new Point(this.x,this.y).toString());
	};

	cthis.toString= function() {
		return "("+this.x+","+this.y+")";
	};

	return cthis;
};

/**
	Circle class.
**/
shapepackage.Circle= function(origin, radiusLength) {
	var cthis= new Object();

	cthis.origin= origin.copy();
	cthis.radiusLen= radiusLength;

	cthis.draw= function(context, thickness, color) {
		//console.log("circle: "+ this.toString());
		this.origin.draw(context, thickness, color);

		//draw each point on a 360-degree circle
		for(var ang= 0; ang <= 360; ang++) {
			var pointOnPerimeter= shapepackage.Point(this.origin.x+ Math.cos(astropackage.degToRad(ang))*this.radiusLen, this.origin.y+ Math.sin(astropackage.degToRad(ang))*this.radiusLen);
			//console.log("c-pt("+ang+"): "+ pointOnPerimeter.toString());
			//console.log("cos("+ang+"): "+ Math.cos(astropackage.degToRad(ang)));
			//console.log("sin("+ang+"): "+ Math.sin(astropackage.degToRad(ang)));

			pointOnPerimeter.draw(context, thickness, color);
		}
	};

	cthis.copy= function() {
		var newCircle= shapepackage.Circle(this.origin, this.radiusLen);

		return newCircle;
	};

	cthis.move= function(x,y) {
		this.origin.move(x,y);		
	};

	cthis.toString= function() {
		return this.origin.toString()+","+this.radiusLen;
	};

	return cthis;
};

/**
Line Class
params: p1, p2: Points defining a line
**/

shapepackage.Line = function(p1, p2) {
	var cthis= new Object();

	cthis.p1= p1.copy();
	cthis.p2= p2.copy();

	/* draws this Line. */
	cthis.draw= function(context, thickness, color) {
		context.beginPath();
		context.lineWidth= thickness;
		context.strokeStyle= color;

		context.moveTo(this.p1.x, this.p1.y);
		context.lineTo(this.p2.x, this.p2.y);
		context.stroke();
	};
	
	cthis.copy= function() {
		var newLine= shapepackage.Line(this.p1, this.p2);

		return newLine;
	};

	cthis.move= function(x,y) {
		//console.log("p2: "+this.p2.toString());
		this.p1.move(x,y);
		this.p2.move(x,y);		
		//console.log("p2m: "+this.p2.toString());
	};

	cthis.toString= function() {
		console.log("p1: "+ p1.toString());
		return this.p1.toString()+","+this.p2.toString();
	};

	return cthis;
};

/**
Triangle Class
params a,b,h: lines describing side, base, and hyponenuese.
**/
shapepackage.Square= function(a,b,c,d) {
	var cthis= new Object();

	cthis.a= a.copy();
	cthis.b= b.copy();
	cthis.c= c.copy();
	cthis.d= d.copy();

	cthis.create= function(a,b,c) {
		this.a= a.copy();
		this.b= b.copy();
		this.c= c.copy();
		this.d= shapepackage.Line(c.p2,a.p1);
	};

	/* draw this square. */
	cthis.draw= function(context, thickness, color) {
		this.a.draw(context, thickness, color);
		this.b.draw(context, thickness, color);
		this.c.draw(context, thickness, color);
		this.d.draw(context, thickness, color);
	};

	cthis.move= function(x,y) {
		//console.log("a: "+this.a.toString());
		this.a.move(x,y);
		this.b.move(x,y);
		this.c.move(x,y);
		this.d.move(x,y);
		//console.log("am: "+this.a.toString());
	};

	cthis.copy= function() {
		var newSquare= shapepackage.Square(this.a, this.b, this.c, this.d);

		return newSquare;
	};

	cthis.toString= function() {
		return this.a.toString()+","+this.b.toString()+","+this.c.toString()+","+this.d.toString();
	};

	return cthis;
};

/**
	Cube class.
**/
shapepackage.Cube= function(sq, depth) {
	var cthis= new Object();

	cthis.front= sq.copy();
	cthis.depth= depth;

	/* draw this cube. */
	cthis.draw= function(context, thickness, color, hAng, vAng) {
		var back= this.front.copy();

		//console.log("cos("+hAng+")="+ radToDeg(Math.cos(astropackage.degToRad(hAng))));
		//console.log("sin("+vAng+")="+ radToDeg(Math.sin(astropackage.degToRad(vAng))));

		var xMove= this.depth* Math.cos(astropackage.degToRad(hAng));
		var yMove= this.depth* Math.sin(astropackage.degToRad(vAng));
		back.move(xMove, yMove);
		this.front.draw(context, thickness, color);
		back.draw(context, thickness, color);
		shapepackage.Line(back.a.p1, this.front.a.p1).draw(context, thickness, color);
		shapepackage.Line(back.a.p2, this.front.a.p2).draw(context, thickness, color);
		shapepackage.Line(back.c.p1, this.front.c.p1).draw(context, thickness, color);
		shapepackage.Line(back.c.p2, this.front.c.p2).draw(context, thickness, color);
	};

	cthis.toString= function() {
		return this.front.toString()+","+this.depth;		
	};

	cthis.move= function(x,y) {
		this.front.move(x,y);
	};

	return cthis;
};

/**
Triangle Class
params a,b,h: lines describing side, base, and hyponenuese.
**/
shapepackage.Triangle= function(a,b,h) {
	var cthis= new Object();

	cthis.a= a.copy();
	cthis.b= b.copy();
	cthis.h= h.copy();

	cthis.createFromPoints= function(a,b,c) {
		this.a= shapepackage.Line(a,b);
		this.b= shapepackage.Line(b,c);
		this.c= shapepackage.Line(c,a);

		return this;
	};

	/**
		constructor.
		params: a= side Line
				bLen= base length
	**/
	cthis.create= function(a, bLen) {
		this.a= a.copy();
		var bP1= this.Point(this.a.p2.x, this.a.p2.y);
		var bP2= this.Point(this.a.p2.x+ bLen, this.a.p2.y);
		this.b= shapepackage.Line(bP1, bP2);
		this.h= shapepackage.Line(this.b.p2, this.a.p1);

		return this;
	};

	/**
		constructor.
		params: p2 - point where triangle's right angle is at
				bLen - length of base line
				degrees - degrees of opposite angle
				orient - -1 or 1 depending on which side the triangle should fall
	**/
	cthis.createFromAngle= function(p2, bLen, degrees, orient) {
		//console.log("createFromAngle("+p2+", "+bLen+", "+degrees+", "+orient+")");
		var bP1= p2.copy();
		var bP2= shapepackage.Point(p2.x+ bLen, p2.y);		
		this.b=  shapepackage.Line(bP1, bP2);

		//angle= 48.0;
		var radians= astropackage.degToRad(degrees);

		var tanLen= Math.tan(radians);

		this.a= shapepackage.Line(bP1, shapepackage.Point(p2.x, p2.y- orient* Math.abs(Math.tan(radians)* bLen)));

		//console.log("degrees: "+ degrees);
		//console.log("radians: "+ radians);
		//console.log("Tan: "+ Math.tan(radians));
		//console.log("Tan*length: "+ Math.abs(Math.tan(radians)* bLen));

		this.h= shapepackage.Line(this.b.p2, this.a.p1);

		return this;
	};

	/**
		constructor.
		params: p2 - point where triangle's right angle is at
				bLen - length of hyposenuese
				degrees - degrees of opposite angle
				orient - -1 or 1 depending on which side the triangle should fall
	**/
	cthis.createFromAngle2= function(p2, bLen, degrees, orient) {
		var radians= astropackage.degToRad(360- degrees+ 270); //degrees+ 180);
		if(-1 == orient)	radians= astropackage.degToRad(degrees+ 270);

		xC= sundialTwopackage.radius* Math.cos(radians) + p2.x;
		yC= sundialTwopackage.radius* Math.sin(radians) + p2.y;


		var bP1= p2.copy();
		var bP2= shapepackage.Point(xC, yC);		//+ (bLen*orient)
		this.a= shapepackage.Line(bP2, bP1);

		this.b= shapepackage.Line(bP2, shapepackage.Point(p2.x,p2.y-Math.abs(bLen))); //new Point(p2.x, p2.y- orient* Math.abs(Math.cos(radians)* bLen)));

		//console.log("degrees: "+ degrees);
		//console.log("radians: "+ radians);
		//console.log("Tan: "+ Math.tan(radians));
		//console.log("Tan*length: "+ Math.abs(Math.sin(radians)* bLen));

		this.h= shapepackage.Line(this.a.p2, this.b.p2);

		return this;
	};

	/**
		tilt top of triangle on x-axis
	**/
	cthis.tiltX= function(percent) {
		this.h.p1.x= this.h.p1.x- Math.abs(this.h.p1.x-this.h.p2.x)*(percent/100);
		this.b.p2.x= this.b.p2.x- Math.abs(this.b.p2.x-this.b.p1.x)*(percent/100);
		return this;
	};

	/* draw this triangle. */
	cthis.draw= function(context, thickness, color) {
		// Draw a path
		context.beginPath();
		context.fillStyle = color;
		context.lineWidth= thickness;
		context.moveTo(this.a.p1.x, this.a.p1.y);	// Top Corner
		context.lineTo(this.a.p2.x, this.a.p2.y);	// Bottom Right
		context.lineTo(this.b.p2.x, this.b.p2.y);	// Bottom Left
		context.closePath();

		// Fill the path

		context.fill();
	};

	cthis.copy= function() {
		var newTriangle= this.Triangle(this.a, this.b, this.h);

		return newTriangle;
	};

	cthis.move= function(x,y) {
		this.a.move(x,y);
		this.b.move(x,y);
		this.h.move(x,y);
	};

	cthis.toString= function() {
		return this.a.toString()+","+this.b.toString()+","+this.h.toString();
	};

	return cthis;
};

