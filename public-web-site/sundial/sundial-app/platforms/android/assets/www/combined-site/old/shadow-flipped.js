/*  Show a pyramid with five differently colored sides using Three.js.
 *  The pyramid geometry is constructed directly.
 *  The cube can be rotated using the arrow keys.  The home key
 *  or the return key will reset the rotation to zero.  WebGL
 *  will be used if available.  If not, the program will attempt
 *  to use the canvas 2D API.
 */

sundialShadowpackage.star= null;

sundialShadowpackage.renderer= null;
// A three.js WebGL or Canvas renderer.
sundialShadowpackage.scene= null;
// The 3D scene that will be rendered, containing the cube.
sundialShadowpackage.camera= null;
// The camera that takes the picture of the scene.
sundialShadowpackage.light= null;

sundialShadowpackage.pyramid= null;
// The three.js object that represents the pyramid.

sundialShadowpackage.rotateX = 0.4;
// rotation of cube about the x-axis
sundialShadowpackage.rotateY = -.1;
// rotation of cube about the y-axis

sundialShadowpackage.SCREEN_WIDTH = window.innerWidth - 100;
sundialShadowpackage.SCREEN_HEIGHT = window.innerHeight - 100;

sundialShadowpackage.container= null;
sundialShadowpackage.mesh= null;
sundialShadowpackage.geometry= null; 
sundialShadowpackage.plane= null;

sundialShadowpackage.windowHalfX = window.innerWidth / 2;
sundialShadowpackage.windowHalfY = window.innerHeight / 2;

sundialShadowpackage.earthRadius= 108;	//360
sundialShadowpackage.lightDistantance= 1000;

sundialShadowpackage.eee = new Object();
sundialShadowpackage.eee.keyCode = 37;
//document.getElementById('cnvs').addEventListener("click", doKey, false);

sundialShadowpackage.onWindowResize= function() {
	this.windowHalfX = window.innerWidth / 2;
	this.windowHalfY = window.innerHeight / 2;

	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();

	webglRenderer.setSize(window.innerWidth, window.innerHeight);
};

sundialShadowpackage.go= true;
sundialShadowpackage.animate= function() {
	var timer = Date.now() * 0.0002;
	console.log("timer: "+ timer);
	sundialShadowpackage.camera.position.x = Math.cos(timer) * sundialShadowpackage.lightDistantance;
	sundialShadowpackage.camera.position.z = Math.sin(timer) * sundialShadowpackage.lightDistantance;
	//star.position.x = star.position.x + 1;
	console.debug("x: " + sundialShadowpackage.star.position.x + ", y: " + sundialShadowpackage.star.position.y + ", z: " + sundialShadowpackage.star.position.z);
	//light.position.z= light.position.z+ 2;
	//light.position.x+= 2;
	console.log("camera x="+ sundialShadowpackage.camera.position.x+", y="+ sundialShadowpackage.camera.position.y+", z="+ sundialShadowpackage.camera.position.z);

	requestAnimationFrame(sundialShadowpackage.animate);
	sundialShadowpackage.render();
};

sundialShadowpackage.reRenderTest= function() {
	var lt= 30.0;
	//for(var lt= 30.0; lt < 40.0; lt+=1.0) 
	{
		for(var ln= -160.0; ln < -150.0; ln+=1.0) 
		{
			console.log("lt: "+ lt+ ", ln: "+ ln);
			this.reRender2(lt,ln);
		}
	}
};

sundialShadowpackage.reRender2= function(lat, lon) {
	
	var alt= this.earthRadius;
	var x = alt * Math.cos(astropackage.degToRad(lat)) * Math.sin(astropackage.degToRad(lon));
	var y = alt * Math.sin(astropackage.degToRad(lat));
	var z = alt * Math.cos(astropackage.degToRad(lat)) * Math.cos(astropackage.degToRad(lon));
	
	//console.log("star x="+star.position.x+", y="+star.position.y+", z="+ star.position.z);
	star.position.x = x;
	star.position.y = y;
	star.position.z = z;
	console.log("star x="+ this.star.position.x+", y="+ this.star.position.y+", z="+ this.star.position.z);
	
	alt= this.lightDistantance;
	x = alt * Math.cos(astropackage.degToRad(lat)) * Math.sin(astropackage.degToRad(lon));
	y = alt * Math.sin(astropackage.degToRad(lat));
	z = alt * Math.cos(astropackage.degToRad(lat)) * Math.cos(astropackage.degToRad(lon));
	camera.position.x = x;
	camera.position.y = y;
	camera.position.z = z;
	
	this.render();
};

sundialShadowpackage.reRender= function() {
	var lat= Number(document.getElementById('lat').value);
	var lon= Number(document.getElementById('lon').value);
	
	var alt= this.earthRadius;
	var x = alt * Math.cos(astropackage.degToRad(lat)) * Math.sin(astropackage.degToRad(lon));
	var y = alt * Math.sin(astropackage.degToRad(lat));
	var z = alt * Math.cos(astropackage.degToRad(lat)) * Math.cos(astropackage.degToRad(lon));
	
	//console.log("star x="+star.position.x+", y="+star.position.y+", z="+ star.position.z);
	this.star.position.x = x;
	this.star.position.y = y;
	this.star.position.z = z;
	console.log("star x="+ this.star.position.x+", y="+ this.star.position.y+", z="+ this.star.position.z);
	
	//camera.position.x = Math.cos(astropackage.degToRad(lat)) * lightDistantance;
	//camera.position.z = Math.sin(astropackage.degToRad(lon)) * lightDistantance;

	
	this.render();
};

sundialShadowpackage.reRender3= function(place) {

	
	/*var r= this.lightDistantance* 2/3;
	
	
	var etsc= 90.0- el; //Math.acos(lightDistantance/earthRadius);
	console.log("etsc="+etsc);
	
	var x = r * Math.sin(astropackage.degToRad(etsc)) * Math.cos(astropackage.degToRad(az));
	var y = r * Math.sin(astropackage.degToRad(etsc)) * Math.sin(astropackage.degToRad(az));
	var z = r * Math.sin(astropackage.degToRad(el));	//=Math.cos(astropackage.degToRad(etsc));
	
	x = r *Math.cos(astropackage.degToRad(el))* Math.sin(astropackage.degToRad(az));
	y = r *Math.cos(astropackage.degToRad(el))* Math.cos(astropackage.degToRad(az));
	z = r *Math.sin(astropackage.degToRad(el));
	
	x = r *Math.sin(astropackage.degToRad(el))* Math.cos(astropackage.degToRad(az));
	y = r *Math.sin(astropackage.degToRad(el))* Math.sin(astropackage.degToRad(az));
	z = r *Math.cos(astropackage.degToRad(el));
	
	var radec= aatorad(az, el, new observatory(place.place, place.ticker));
	var RA= radec[0];
	var Decl= radec[1];
	
	console.log("RA: "+ RA+", DEC: "+ Decl);
	
	x = r * Math.cos(astropackage.degToRad(RA)) * Math.cos(astropackage.degToRad(Decl));
    y = r * Math.sin(astropackage.degToRad(RA)) * Math.cos(astropackage.degToRad(Decl));
    z = r * Math.sin(astropackage.degToRad(Decl));
	
	//console.log("star x="+star.position.x+", y="+star.position.y+", z="+ star.position.z);
	this.light.position.x = x;
	this.light.position.y = y;
	this.light.position.z = z;
	var liteDesc= "x="+ Math.round(this.light.position.x)+", y="+ Math.round(this.light.position.y)+", z="+ Math.round(this.light.position.z);
	console.log("light "+ liteDesc);
	document.getElementById('placeName').value= liteDesc;
	*/
	var az= place.tickData.az;
	var el= place.tickData.el;
	console.log("az: "+ az+", el: "+ el);
	var lon= 360.0- az;
//	var lon= az;
	var lat= 90.0- el;
	
	var alt= this.lightDistantance* 2/3;
	
	var x = alt * Math.cos(astropackage.degToRad(lat)) * Math.sin(astropackage.degToRad(lon));
	var y = alt * Math.sin(astropackage.degToRad(lat));
	var z = alt * Math.cos(astropackage.degToRad(lat)) * Math.cos(astropackage.degToRad(lon));
	
	this.light.position.x = x;
	this.light.position.y = y;
	this.light.position.z = z;
	
	this.render();
};

sundialShadowpackage.doMove= function() {
	var x= Number(document.getElementById("xxc").value);
	var y= Number(document.getElementById("yyc").value);
	var z= Number(document.getElementById("zzc").value);
	
	//console.log("camera x="+ this.camera.position.x+", y="+ this.camera.position.y+", z="+ this.camera.position.z);
	this.star.position.x=x;
	this.star.position.y=y;
	this.star.position.z=z;
	
	//console.log("camera x="+ this.camera.position.x+", y="+ this.camera.position.y+", z="+ this.camera.position.z);
	
	this.render();
};

sundialShadowpackage.doCamera= function() {
	var x= Number(document.getElementById("xc").value);
	var y= Number(document.getElementById("yc").value);
	var z= Number(document.getElementById("zc").value);
	
	console.log("camera x="+ this.camera.position.x+", y="+ this.camera.position.y+", z="+ this.camera.position.z);
	this.camera.position.x=x;
	this.camera.position.y=y;
	this.camera.position.z=z;
	
	console.log("camera x="+ this.camera.position.x+", y="+ this.camera.position.y+", z="+ this.camera.position.z);
	
	this.render();
};

sundialShadowpackage.doAz= function(place) {
	var az= Number(document.getElementById('lat').value);
	var el= Number(document.getElementById('lon').value);
	console.log("doLatLon(): ");
	
	this.reRender3(place);
};


/*  This function is called by the init() method.  Its purpose is
 *  to add objects to the scene.  The scene, camera, and renderer
 *  objects have already been created.
 */
sundialShadowpackage.createWorld= function() {
	//	console.debug();

	this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100000);
	this.camera.position.x = 1200;
	this.camera.position.y = 1000;
	this.camera.lookAt({
		x : 0,
		y : 0,
		z : -50
	});

	this.scene = new THREE.Scene();

	var groundMaterial = new THREE.MeshPhongMaterial({
		color : 0x6C6C6C
	});
	
	if(false) {
		this.plane = new THREE.Mesh(new THREE.PlaneGeometry(sundialTwopackage.canvasWidth, sundialTwopackage.canvasHeight), groundMaterial);
		this.plane.rotation.x = -Math.PI / 2;
		this.plane.receiveShadow = true;
		
		this.scene.add(this.plane);
	} else {

		var loader = new THREE.TextureLoader();
		//textures/land_ocean_ice_cloud_2048.jpg
		//./img/sundial3.png
		//'./img/249.png'
		loader.load('./img/sundial4.jpg', function(texture) {

			var geometry = new THREE.PlaneGeometry(500, 500);

			var material = new THREE.MeshBasicMaterial({
				map : texture,
				overdraw : true
			});
			sundialShadowpackage.plane = new THREE.Mesh(geometry, material);
			//group.add( mesh );
			//earth.castShadow = true;
			sundialShadowpackage.plane.receiveShadow = true;
			//earth.overdraw = true;
			sundialShadowpackage.plane.rotation.x =  Math.PI* 1.5;//-Math.PI / 2;
			
			sundialShadowpackage.scene.add(sundialShadowpackage.plane);
		});
	}
	
	

	// LIGHTS
	//this.scene.add(new THREE.AmbientLight(0x666666));

	this.light = new THREE.DirectionalLight(0xdfebff, 1.75);
	this.light.position.set(300, 400, 50);
	this.light.position.multiplyScalar(1.3);

	this.light.castShadow = true;
	this.light.shadowCameraVisible = true;

	this.light.shadowMapWidth = 512;
	this.light.shadowMapHeight = 512;

	var d = 200;
	this.light.shadowCameraLeft = -d;
	this.light.shadowCameraRight = d;
	this.light.shadowCameraTop = d;
	this.light.shadowCameraBottom = -d;

	this.light.shadowCameraFar = 1000;
	this.light.shadowDarkness = 0.2;

	this.scene.add(this.light);

	// earth-start

	var loader = new THREE.TextureLoader();
	//textures/land_ocean_ice_cloud_2048.jpg
	loader.load('./img/249.png', function(texture) {

		var geometry = new THREE.SphereGeometry(sundialShadowpackage.earthRadius, 20, 20);

		var material = new THREE.MeshBasicMaterial({
			map : texture,
			overdraw : true
		});
		var earth = new THREE.Mesh(geometry, material);
		//group.add( mesh );
		earth.castShadow = true;
		earth.receiveShadow = true;
		earth.overdraw = true;
//		sundialShadowpackage.scene.add(earth);
	});
	//earth-end
	// sphere - start
	// the first argument of THREE.SphereGeometry is the radius, the second argument is
	// the segmentsWidth, and the third argument is the segmentsHeight.  Increasing the
	// segmentsWidth and segmentsHeight will yield a more perfect circle, but will degrade
	// rendering performance
	/* var sphere = new THREE.Mesh(new THREE.SphereGeometry(100, 80, 80), new THREE.MeshNormalMaterial());
	sphere.castShadow = true;
	sphere.receiveShadow = true;
	sphere.overdraw = true;
	scene.add(sphere)*/
	//sphere- end
	//star - start
	var starPoints = [];

	var xexpand= 4;
	var yexpand= 2;
	var zexpand= 1;

//			starPoints.push(new THREE.Vector3(0, 50, 1));
	//top of star, 50->70 goes higher
	//starPoints.push( new THREE.Vector2 (  10,  10 ) );
	//starPoints.push( new THREE.Vector2 (  40,  10 ) );
	//starPoints.push( new THREE.Vector2 (  20, -10 ) );
	//starPoints.push( new THREE.Vector2 (  30, -50 ) );
//			starPoints.push(new THREE.Vector3(10, -40, 1));
	//bottom of star leg, -20->-40 goes lower
	//starPoints.push( new THREE.Vector2 ( -30, -50 ) );
	//starPoints.push( new THREE.Vector2 ( -20, -10 ) );
	//starPoints.push( new THREE.Vector2 ( -40,  10 ) );
//			starPoints.push(new THREE.Vector3(-10, -40, 1));
starPoints.push(new THREE.Vector3(-10*xexpand, -40*yexpand, 1));
starPoints.push(new THREE.Vector3(70*xexpand, 40*yexpand, 1));
starPoints.push(new THREE.Vector3(75*xexpand, 40*yexpand, 1));
starPoints.push(new THREE.Vector3(40*xexpand, -20*yexpand, 1));
starPoints.push(new THREE.Vector3(40*xexpand, -40*yexpand, 1));
starPoints.push(new THREE.Vector3(-10*xexpand, -40*yexpand, 1));
/*starPoints.push(new THREE.Vector3(-10, -40, 10));
starPoints.push(new THREE.Vector3(20, -40, 10));
starPoints.push(new THREE.Vector3(20, -20, 10));
starPoints.push(new THREE.Vector3(55, 40, 10));
starPoints.push(new THREE.Vector3(50, 40, 10));
starPoints.push(new THREE.Vector3(-10, -40, 10));
*/

	var starShape = new THREE.Shape(starPoints);

	var extrusionSettings = {
		size : 30,
		height : 4,
		curveSegments : 3,
		bevelThickness : 1,
		bevelSize : 2,
		bevelEnabled : true,
		material : 0,
		extrudeMaterial : 1,
		amount: 10
	};

	var starGeometry = new THREE.ExtrudeGeometry(starShape, extrusionSettings);

	var materialFront = new THREE.MeshLambertMaterial({
		color : 0xffff00
	});
	var materialSide = new THREE.MeshLambertMaterial({
		color : 0xff8800
	});
	var materialArray = [materialFront, materialSide];
	var starMaterial = new THREE.MeshLambertMaterial(materialArray);

	this.star = new THREE.Mesh(starGeometry, starMaterial);
	this.star.position.set(0, 10, -53);

	this.star.castShadow = true;
	this.star.receiveShadow = true;
	this.star.overdraw = true;
	this.scene.add(this.star);
	//star - end
};

/**
 *  The render fucntion creates an image of the scene from the point of view
 *  of the camera and displays it in the canvas.  This is called at the end of
 *  init() to produce the initial view of the cube, and it is called each time
 *  the user presses an arrow key, return, or home.
 */
sundialShadowpackage.render= function() {
	//renderer.render(scene, camera);
	this.camera.lookAt(this.scene.position);
	this.renderer.render(this.scene, this.camera);
};

/**
 *  An event listener for the keydown event.  It is installed by the init() function.
 */
sundialShadowpackage.doKey= function(evt) {
	var rotationChanged = true;
	switch (evt.keyCode) {
		case 37:
			rotateY -= 0.05;
			break;
		// left arrow
		case 39:
			rotateY += 0.05;
			break;
		// right arrow
		case 38:
			rotateX -= 0.05;
			break;
		// up arrow
		case 40:
			rotateX += 0.05;
			break;
		// down arrow
		case 13:
			rotateX = rotateY = 0;
			break;
		// return
		case 36:
			rotateX = rotateY = 0;
			break;
		// home
		default:
			rotationChanged = false;
	}
	if (rotationChanged) {
		this.pyramid.rotation.set(rotateX, rotateY, 0);
		this.render();
		evt.preventDefault();
	}
};

sundialShadowpackage.rotate= function() {
	this.star.position.x= -2;
	this.star.position.y= 68;
	this.star.position.z= 196;
	this.star.rotation.set(0, Math.PI * 0.5, 0);

	this.star.castShadow = true;
	this.star.receiveShadow = true;
	this.star.overdraw = true;
	
	this.plane.receiveShadow = true;
	
	this.render();
};

sundialShadowpackage.createFromCanvas= function() {
	try {
		var theCanvas = document.getElementById("cnvs");
		if (!theCanvas || !theCanvas.getContext) {
			document.getElementById("message").innerHTML = "Sorry, your browser doesn't support canvas graphics.";
			return;
		}
		try {// try to create a WebGLRenderer
			if (window.WebGLRenderingContext) {
				this.renderer = new THREE.WebGLRenderer({
					canvas : theCanvas,
					antialias : true
				});
				this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
				this.renderer.domElement.style.position = "relative";
				this.renderer.shadowMapEnabled = true;
				this.renderer.shadowMapSoft = true;
			}
		} catch (e) {
		}
		if (!this.renderer) {// If the WebGLRenderer couldn't be created, try a CanvasRenderer.
			this.renderer = new THREE.CanvasRenderer({
				canvas : theCanvas
			});
			this.renderer.setSize(theCanvas.width, theCanvas.height);
			document.getElementById("message").innerHTML = "WebGL not available; falling back to CanvasRenderer.";
		}
		this.renderer.setClearColor(0x220033);
		// dark violet background
		this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
		this.renderer.domElement.style.position = "relative";
		this.renderer.shadowMapEnabled = true;
		this.renderer.shadowMapSoft = true;
		//        *scene = new THREE.Scene();
		//        camera = new THREE.PerspectiveCamera(45, theCanvas.width/theCanvas.height, 0.1, 100);
		//        camera.position.z = 4;*
		this.createWorld();
		this.render();
		document.addEventListener("keydown", this.doKey, false);
	} catch (e) {
		document.getElementById("message").innerHTML = "Sorry, an error occurred: " + e;
	}
};

sundialShadowpackage.createWebGl= function() {
	if (false) {
		try {

			// RENDERER
			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
			this.renderer.domElement.style.position = "relative";
			this.renderer.shadowMapEnabled = true;
			this.renderer.shadowMapSoft = true;

			this.container = document.createElement('div');
			document.body.appendChild(container);

			this.container.appendChild(this.renderer.domElement);
			window.addEventListener('resize', this.onWindowResize, false);

		} catch (e) {
			document.getElementById("message").innerHTML = "Sorry, an error occurred on second renderer: " + e;
		}
	}
	this.createWorld();
};

/**
 *  This function is called by the onload event so it will run after the
 *  page has loaded.  It creates the renderer, canvas, and scene objects,
 *  calls createWorld() to add objects to the scene, and renders the
 *  initial view of the scene.  If an error occurs, it is reported.
 */
sundialShadowpackage.init= function() {

	this.createFromCanvas();

	this.createWebGl();
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
