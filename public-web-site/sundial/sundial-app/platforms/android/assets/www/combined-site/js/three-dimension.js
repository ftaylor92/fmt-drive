twoDpackage.projection= function() {
	console.log("in projection()");
	drawCube("twoDimensionalCanvas");
	console.log("out projection()");
}

/** draws a cube. **/
twoDpackage.drawCube= function(canvasName) {
	console.log("in drawCube()"+ new Date());

	var hAng= Number(document.getElementById('hangle').value);
	var vAng= Number(document.getElementById('vangle').value);
	var depth= Number(document.getElementById('depth').value);

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

	var corner1= new Point(5,5);
	var corner2= new Point(5,100);
	var corner3= new Point(100,100);
	var corner4= new Point(100,5);

	var cube= new Square( new Line(corner1, corner2), 
					new Line(corner2, corner3),
					new Line(corner3, corner4),
					new Line(corner4, corner1)
		);

	cube.draw(ctx, 2, "#ff00ff");

	var cubeTwo= new Cube(cube, depth);
	cubeTwo.move(50,40);
	cubeTwo.draw(ctx, 2, "#ff00ff", hAng, vAng);

	var circle= new Circle(new Point(50,50), 20);
	circle.move(20,20);
	circle.draw(ctx, 2, "#cccccc");

	console.log("out drawCube()"+ new Date());
}

