function projection() {
	console.log("in projection()");
	drawCube("twoDimensionalCanvas");
	console.log("out projection()");
}

function levelLine() {
	console.log("in projection()");
	drawLiquid("twoDimensionalCanvas");
	console.log("out projection()");
}

function drawLiquidXYZ(canvasName, x, y, z) {
	console.log("in drawCube()"+ new Date());

	console.log("atan: "+ astropackage.radToDeg(Math.atan(y/x)));

	var rise= y;
	var run= x;
	if(run === 0.0)	{
		run= 0.01;	//avoid divide by zero error
	}
	var riseOverRun= run/rise;
	console.log("riseOverRun: "+ riseOverRun);
	var hAng= astropackage.radToDeg(Math.atan2(y, x));
	var vAng= astropackage.radToDeg(Math.atan2(x, y));
	var depth= 40.0- (Math.abs(z)* 4.0);
	console.log("hAng, v: "+ hAng+","+vAng);

	var cvs=document.getElementById(canvasName);
	var ctx=cvs.getContext("2d");

	hAng= 360.0- astropackage.radToDeg(Math.atan(y/x))+ 90.0;

	//clear bkgnd
	ctx.beginPath();
	ctx.rect(0, 0, 400, 400);
	ctx.fillStyle = 'white';
	ctx.fill();
	ctx.lineWidth = 7;
	ctx.strokeStyle = 'black';
	ctx.stroke();
	ctx=cvs.getContext("2d");

	//draw level-line
	var center= new shapepackage.Point(200,200);
	var radius= 100.0;
	/*console.log("rad: hAng, v: "+ astropackage.degToRad(hAng)+","+astropackage.degToRad(vAng));
	console.log("cos,sin: x, y: "+ ((Math.cos(astropackage.degToRad(hAng))))+","+((Math.sin(astropackage.degToRad(vAng)))));

	console.log("x, y: "+ (center.x- (radius* Math.cos(astropackage.degToRad(hAng))))+","+(center.y- (radius* Math.sin(astropackage.degToRad(vAng)))));
	var lower= new shapepackage.Point(center.x- (radius* Math.cos(astropackage.degToRad(hAng))), center.y- (radius* Math.sin(astropackage.degToRad(vAng))));
	var upper= new shapepackage.Point(center.x+ (radius* Math.cos(astropackage.degToRad(hAng))), center.y+ (radius* Math.sin(astropackage.degToRad(vAng))));
	var x= center.x+ radius;
	var ysin= riseOverRun*x;
	var y= center.y+ ysin;
	var lower= new shapepackage.Point(x,y);
	x= center.x- radius;
	//var ysin= riseOverRun*x;
	var y= center.y- ysin;
	var upper= new shapepackage.Point(x,y);
	console.log("lower: "+ lower.toString());
	console.log("upper: "+ upper.toString());*/
	var lower= new shapepackage.Point(center.x- (radius* Math.cos(astropackage.degToRad(hAng))), center.y- (radius* Math.sin(astropackage.degToRad(hAng))));
	var upper= new shapepackage.Point(center.x+ (radius* Math.cos(astropackage.degToRad(hAng))), center.y+ (radius* Math.sin(astropackage.degToRad(hAng))));

	var levelLine= new shapepackage.Line(lower, upper);
	levelLine.draw(ctx, 2, "black");

	var circle= new shapepackage.Circle(center, depth);
	circle.draw(ctx, 2, "green");
}


function drawLiquid(canvasName) {
	var x= Number(document.getElementById('level-x').value);
	var y= Number(document.getElementById('level-y').value);
	var z= Number(document.getElementById('level-z').value);

	drawLiquidXYZ(canvasName, x, y, z);
}

function drawCube(canvasName) {
	var x= Number(document.getElementById('level-x').value);
	var y= Number(document.getElementById('level-y').value);
	var z= Number(document.getElementById('level-z').value);

	drawCubeXYZ(canvasName, x, y, z);
}

/** draws a cube. **/
function drawCubeXYZ(canvasName, x, y, z) {
	console.log("in drawCube()"+ new Date());

	var hAng= astropackage.radToDeg(Math.atan2(y, x));
	var vAng= astropackage.radToDeg(Math.atan2(x, y));
	var depth= Math.abs(z)* 20.0;
	console.log("hAng, v: "+ hAng+","+vAng);

	var cvs=document.getElementById(canvasName);
	var ctx=cvs.getContext("2d");
	  ctx.beginPath();
      ctx.rect(0, 0, 400, 400);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.lineWidth = 7;
      ctx.strokeStyle = 'black';
      ctx.stroke();
	ctx=cvs.getContext("2d");

	var corner1= new shapepackage.Point(5,5);
	var corner2= new shapepackage.Point(5,100);
	var corner3= new shapepackage.Point(100,100);
	var corner4= new shapepackage.Point(100,5);

	var cube= new shapepackage.Square( new shapepackage.Line(corner1, corner2), 
					new shapepackage.Line(corner2, corner3),
					new shapepackage.Line(corner3, corner4),
					new shapepackage.Line(corner4, corner1)
		);

	cube.draw(ctx, 2, "#ff00ff");

	var cubeTwo= new shapepackage.Cube(cube, depth);
	cubeTwo.move(50,40);
	cubeTwo.draw(ctx, 2, "#ff00ff", hAng, vAng);

	var circle= new shapepackage.Circle(shapepackage.Point(50,50), depth);
	circle.move(20,20);
	circle.draw(ctx, 2, "#cccccc");
	var radis= new shapepackage.Line(circle.origin, new shapepackage.Point(circle.origin.x+(depth*Math.cos(astropackage.degToRad(hAng))), circle.origin.y+(depth*Math.cos(astropackage.degToRad(vAng)))));
	console.log("radis: "+ radis.toString());
	radis.draw(ctx, 2, "#cccccc");

	console.log("out drawCube()"+ new Date());
}

