/*  Show a pyramid with five differently colored sides using Three.js.
 *  The pyramid geometry is constructed directly.
 *  The cube can be rotated using the arrow keys.  The home key
 *  or the return key will reset the rotation to zero.  WebGL
 *  will be used if available.  If not, the program will attempt
 *  to use the canvas 2D API.
 */
 
sundialLocationpackage.star= null;
sundialLocationpackage.earth= null;

sundialLocationpackage.renderer= null;
// A three.js WebGL or Canvas renderer.
sundialLocationpackage.scene= null;
// The 3D scene that will be rendered, containing the cube.
sundialLocationpackage.camera= null;
// The camera that takes the picture of the scene.
sundialLocationpackage.light= null;

sundialLocationpackage.pyramid= null;
// The three.js object that represents the pyramid.

sundialLocationpackage.rotateX = 0.4;
// rotation of cube about the x-axis
sundialLocationpackage.rotateY = -.1;
// rotation of cube about the y-axis

sundialLocationpackage.SCREEN_WIDTH = window.innerWidth - 100;
sundialLocationpackage.SCREEN_HEIGHT = window.innerHeight - 100;

sundialLocationpackage.container= null;
sundialLocationpackage.mesh= null;
sundialLocationpackage.geometry= null;
sundialLocationpackage.plane= null;

sundialLocationpackage.windowHalfX = window.innerWidth / 2;
sundialLocationpackage.windowHalfY = window.innerHeight / 2;

sundialLocationpackage.earthRadius = 108;
//360
sundialLocationpackage.lightDistantance = 1000;

sundialLocationpackage.eee = new Object();
sundialLocationpackage.eee.keyCode = 37;
//document.getElementById('cnvs').addEventListener("click", doKey, false);

sundialLocationpackage.interval;

sundialLocationpackage.onWindowResize= function() {
	this.windowHalfX = window.innerWidth / 2;
	this.windowHalfY = window.innerHeight / 2;

	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();

	webglRenderer.setSize(window.innerWidth, window.innerHeight);
};

sundialLocationpackage.go = false;
sundialLocationpackage.animate= function() {
	//this.go= !this.go;
	if(sundialLocationpackage.go) {
		var timer = Date.now() * 0.0002;
		console.log("timer: " + timer);
		sundialLocationpackage.camera.position.x = Math.cos(timer) * sundialLocationpackage.lightDistantance;
		sundialLocationpackage.camera.position.z = Math.sin(timer) * sundialLocationpackage.lightDistantance;
		//star.position.x = star.position.x + 1;
		console.debug("x: " + sundialLocationpackage.star.position.x + ", y: " + sundialLocationpackage.star.position.y + ", z: " + sundialLocationpackage.star.position.z);
		//light.position.z= light.position.z+ 2;
		//light.position.x+= 2;
		console.log("camera x=" + sundialLocationpackage.camera.position.x + ", y=" + sundialLocationpackage.camera.position.y + ", z=" + sundialLocationpackage.camera.position.z);
	
		this.interval= requestAnimationFrame(sundialLocationpackage.animate);
		sundialLocationpackage.render();
	} else {
		console.log("cancel animate");
		cancelAnimationFrame(this.interval);
	}
};

sundialLocationpackage.reRenderTest= function() {
	var lt = 30.0;
	//for(var lt= 30.0; lt < 40.0; lt+=1.0)
	{
		for (var ln = -160.0; ln < -150.0; ln += 1.0) {
			console.log("lt: " + lt + ", ln: " + ln);
			this.reRender2(lt, ln);
		}
	}
};

sundialLocationpackage.reRender2= function(lat, lon) {

	var alt = this.earthRadius;
	var x = alt * Math.cos(astropackage.degToRad(lat)) * Math.sin(astropackage.degToRad(lon));
	var y = alt * Math.sin(astropackage.degToRad(lat));
	var z = alt * Math.cos(astropackage.degToRad(lat)) * Math.cos(astropackage.degToRad(lon));

	//console.log("star x="+star.position.x+", y="+star.position.y+", z="+ star.position.z);
	this.star.position.x = x;
	this.star.position.y = y;
	this.star.position.z = z;
	console.log("star x=" + this.star.position.x + ", y=" + this.star.position.y + ", z=" + this.star.position.z);

	alt = this.lightDistantance;
	x = alt * Math.cos(astropackage.degToRad(lat)) * Math.sin(astropackage.degToRad(lon));
	y = alt * Math.sin(astropackage.degToRad(lat));
	z = alt * Math.cos(astropackage.degToRad(lat)) * Math.cos(astropackage.degToRad(lon));
	this.camera.position.x = x;
	this.camera.position.y = y;
	this.camera.position.z = z;

	this.render();
};

sundialLocationpackage.xyzRotate= function(xx,yy,zz) {
	this.earth.rotation.set(xx, yy, zz);
}

sundialLocationpackage.xyzRender= function(xx,yy,zz) {

	var alt = this.earthRadius;
	var x= (xx* -alt)/10.0; //= alt * Math.cos(astropackage.degToRad(lat)) * Math.sin(astropackage.degToRad(lon));
	var y= (yy* -alt)/10.0; // = alt * Math.sin(astropackage.degToRad(lat));
	var z= (zz* -alt)/10.0; // = alt * Math.cos(astropackage.degToRad(lat)) * Math.cos(astropackage.degToRad(lon));

	//console.log("star x="+star.position.x+", y="+star.position.y+", z="+ star.position.z);
	this.star.position.x = x;
	this.star.position.y = y;
	this.star.position.z = z;
	console.log("star x=" + this.star.position.x + ", y=" + this.star.position.y + ", z=" + this.star.position.z);

	alt = this.lightDistantance;
	x= (xx* -alt)/10.0; // = alt * Math.cos(astropackage.degToRad(lat)) * Math.sin(astropackage.degToRad(lon));
	y= (yy* -alt)/10.0; // = alt * Math.sin(astropackage.degToRad(lat));
	z= (zz* -alt)/10.0; // = alt * Math.cos(astropackage.degToRad(lat)) * Math.cos(astropackage.degToRad(lon));
	this.camera.position.x = x;
	this.camera.position.y = y;
	this.camera.position.z = z;

	this.render();
};

sundialLocationpackage.reRender= function() {
	var lat = Number(document.getElementById('lat').value);
	var lon = Number(document.getElementById('lon').value);

	var alt = this.earthRadius;
	var x = alt * Math.cos(astropackage.degToRad(lat)) * Math.sin(astropackage.degToRad(lon));
	var y = alt * Math.sin(astropackage.degToRad(lat));
	var z = alt * Math.cos(astropackage.degToRad(lat)) * Math.cos(astropackage.degToRad(lon));

	//console.log("star x="+star.position.x+", y="+star.position.y+", z="+ star.position.z);
	this.star.position.x = x;
	this.star.position.y = y;
	this.star.position.z = z;
	console.log("star x=" + this.star.position.x + ", y=" + this.star.position.y + ", z=" + this.star.position.z);

	//camera.position.x = Math.cos(astropackage.degToRad(lat)) * lightDistantance;
	//camera.position.z = Math.sin(astropackage.degToRad(lon)) * lightDistantance;

	this.render();
};

sundialLocationpackage.doCamera= function() {
	var x = Number(document.getElementById("xc").value);
	var y = Number(document.getElementById("yc").value);
	var z = Number(document.getElementById("zc").value);

	console.log("camera x=" + this.camera.position.x + ", y=" + this.camera.position.y + ", z=" + this.camera.position.z);
	this.camera.position.x = x * 4;
	this.camera.position.y = y * 4;
	this.camera.position.z = z * 4;

	console.log("camera x=" + this.camera.position.x + ", y=" + this.camera.position.y + ", z=" + this.camera.position.z);

	this.render();
};

sundialLocationpackage.doLatLon= function() {
	this.go =false;
	var lat = Number(document.getElementById('lat').value);
	var lon = Number(document.getElementById('lon').value);
	console.log("doLatLon(): ");

	this.reRender2(lat, lon);
	
	this.broadcast();
};

/*  This function is called by the init() method.  Its purpose is
 *  to add objects to the scene.  The scene, camera, and renderer
 *  objects have already been created.
 */
sundialLocationpackage.createWorld= function() {
	//	console.debug();

	this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100000);
	this.camera.position.x = 1200;
	this.camera.position.y = 1000;
	this.camera.lookAt({
		x : 0,
		y : 0,
		z : 0
	});

	this.scene = new THREE.Scene();
	console.debug("this.scene defined: "+ this.scene);

	var groundMaterial = new THREE.MeshPhongMaterial({
		color : 0x6C6C6C
	});
	this.plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), groundMaterial);
	this.plane.rotation.x = -Math.PI / 2;
	this.plane.receiveShadow = true;

	//this.scene.add(this.plane);

	// LIGHTS
	this.scene.add(new THREE.AmbientLight(0x666666));

	this.light = new THREE.DirectionalLight(0xdfebff, 1.75);
	this.light.position.set(300, 400, 50);
	this.light.position.multiplyScalar(1.3);

	this.light.castShadow = true;
	this.light.shadowCameraVisible = false;	//lines around camera

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

	var boxgeometry = new THREE.CubeGeometry(100, 100, 100);
	var boxmaterial = new THREE.MeshLambertMaterial({
		color : 0x0aeedf
	});
	var cube = new THREE.Mesh(boxgeometry, boxmaterial);
	cube.castShadow = true;
	cube.position.x = 0;
	cube.position.y = 100;
	cube.position.z = 0;

	//this.scene.add(cube);

	// earth-start

	var loader = new THREE.TextureLoader();
	//textures/land_ocean_ice_cloud_2048.jpg
	loader.load('./img/249.png', function(texture) {

		var geometry = new THREE.SphereGeometry(sundialLocationpackage.earthRadius, 20, 20);

		var material = new THREE.MeshBasicMaterial({
			map : texture,
			overdraw : true
		});
		sundialLocationpackage.earth = new THREE.Mesh(geometry, material);
		//group.add( mesh );
		sundialLocationpackage.earth.castShadow = true;
		sundialLocationpackage.earth.receiveShadow = true;
		sundialLocationpackage.earth.overdraw = true;
		sundialLocationpackage.scene.add(sundialLocationpackage.earth);
	});
	//earth-end

	//show-start
	this.star = new THREE.Mesh(new THREE.SphereGeometry(6, 80, 80), new THREE.MeshNormalMaterial());
	this.star.castShadow = true;
	this.star.receiveShadow = true;
	this.star.overdraw = true;
	this.scene.add(this.star);
	//show-end

	// sphere - start
	// the first argument of THREE.SphereGeometry is the radius, the second argument is
	// the segmentsWidth, and the third argument is the segmentsHeight.  Increasing the
	// segmentsWidth and segmentsHeight will yield a more perfect circle, but will degrade
	// rendering performance
	/* var sphere = new THREE.Mesh(new THREE.SphereGeometry(100, 80, 80), new THREE.MeshNormalMaterial());
	sphere.castShadow = true;
	sphere.receiveShadow = true;
	sphere.overdraw = true;
	scene.add(sphere);*/
	//sphere- end
	
	
	/*star - start
	var starPoints = [];

	var expand = 1.0;

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
	starPoints.push(new THREE.Vector3(-10, -40, 1));
	starPoints.push(new THREE.Vector3(70, 40, 1));
	starPoints.push(new THREE.Vector3(75, 40, 1));
	starPoints.push(new THREE.Vector3(40, -20, 1));
	starPoints.push(new THREE.Vector3(40, -40, 1));
	starPoints.push(new THREE.Vector3(-10, -40, 1));
	*starPoints.push(new THREE.Vector3(-10, -40, 10));
	 starPoints.push(new THREE.Vector3(20, -40, 10));
	 starPoints.push(new THREE.Vector3(20, -20, 10));
	 starPoints.push(new THREE.Vector3(55, 40, 10));
	 starPoints.push(new THREE.Vector3(50, 40, 10));
	 starPoints.push(new THREE.Vector3(-10, -40, 10));
	 *

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
		amount : 10
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

	star = new THREE.Mesh(starGeometry, starMaterial);
	star.position.set(0, 50, 0);

	star.castShadow = true;
	star.receiveShadow = true;
	star.overdraw = true;
	scene.add(star);*/
	//star - end
};

/**
 *  The render fucntion creates an image of the scene from the point of view
 *  of the camera and displays it in the canvas.  This is called at the end of
 *  init() to produce the initial view of the cube, and it is called each time
 *  the user presses an arrow key, return, or home.
 */
sundialLocationpackage.render= function() {
	//renderer.render(scene, camera);
	this.camera.lookAt(this.scene.position);
	this.renderer.render(this.scene, this.camera);
};

/**
 *  An event listener for the keydown event.  It is installed by the init() function.
 */
sundialLocationpackage.doKey= function(evt) {
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
		this.earth.rotation.set(rotateX, rotateY, 0);
		this.render();
		evt.preventDefault();
	}
};

sundialLocationpackage.createFromCanvas= function() {
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

sundialLocationpackage.createWebGl= function() {
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
sundialLocationpackage.init= function() {

	this.createFromCanvas();

	this.createWebGl();
};

sundialLocationpackage.doLocationName= function(lat, lon) {
	//if(Math.round(position.coords.latitude*100) != 4251 && Math.round(position.coords.longitude*100) != -7104) {
	var geoUrl = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&sensor=true";
	console.log("geoURL: " + geoUrl);
	$.get(geoUrl, function(data, txtstatus, xbr) {

		var placeName = "Here";
		if(data.results.length > 0) {
			data.results[0].address_components.forEach(function(entry) {
				//console.debug(entry);
				if (entry.types[0] == "locality" && entry.types[1] == "political") {
					placeName = entry.short_name;
				}
			});
		}
		/*risesetpackage.here.name= placeName;
		 risesetpackage.setPlaceTxt(risesetpackage.here);*/
		document.getElementById("placeName").value = placeName;

	});
	//}
};

sundialLocationpackage.significantPlaces= function() {
	atlas.push( new place("GB:Stonehange","51:10:44",0,"01:49:34",0,0,"3:5:0","10:5:0") );
	/*
	atlas.push( new place("GB:aGreenwich","51:28:38",0,"00:00:00",0,0,"3:5:0","10:5:0") );
	atlas.push( new place("GB:bGreenwich","51:28:38",0,"00:00:00",0,0,"3:5:0","10:5:0") );
	atlas.push( new place("GB:cGreenwich","51:28:38",0,"00:00:00",0,0,"3:5:0","10:5:0") );
	atlas.push( new place("GB:dGreenwich","51:28:38",0,"00:00:00",0,0,"3:5:0","10:5:0") );
	atlas.push( new place("GB:eGreenwich","51:28:38",0,"00:00:00",0,0,"3:5:0","10:5:0") );
	*/
};

sundialLocationpackage.stepAcc= function(type, val) {
	var slider= null;
	var txt= null;
	if("lon" === type) {
		slider= document.getElementById("longitude-slider");
		txt= document.getElementById("lon");
	} else {
		slider= document.getElementById("latitude-slider");
		txt= document.getElementById("lat");		
	}
	
	var value= Number(txt.value);
	value+= val;
	slider.value= value;
	txt.value= value;
	this.doLatLon();
};

sundialLocationpackage.step= function(type, val) {
	var slider= null;
	var txt= null;
	if("lon" === type) {
		slider= document.getElementById("longitude-slider");
		txt= document.getElementById("lon");
	} else {
		slider= document.getElementById("latitude-slider");
		txt= document.getElementById("lat");		
	}
	
	var value= Number(txt.value);
	value+= val;
	slider.value= value;
	txt.value= value;
	this.doLatLon();
};


sundialLocationpackage.broadcast= function() {
	var lat = Number(document.getElementById('lat').value);
	var lon = Number(document.getElementById('lon').value);
	
	utilpackage.log("broadcast: "+ lat+", "+ lon);
};

sundialLocationpackage.setInitial= function() {
	utilpackage.log("setInitial: "+ lat+", "+ lon);
};

sundialLocationpackage.setAll= function(lat, lon) {
	utilpackage.log("setAll: "+ lat+", "+ lon);
};

sundialLocationpackage.getValue= function(dtime) {
	utilpackage.log("getValue: "+ lat+", "+ lon);
};
