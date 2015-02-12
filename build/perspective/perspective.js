(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if ( ! Detector.webgl ) Detector.addGetWebGLMessage()
  
var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight

var renderer, container, scene, camera

var videoTexture

var bounds = Boundaries( SCREEN_WIDTH, SCREEN_HEIGHT, 1000 )

// set up the variables
init()

//start the loop
animate()

function init() {
  
  container = document.getElementById( 'container' )
  
  // SCENE
  scene = new THREE.Scene()
  
  // CAMERA
  var cameraDistance = 600;
  camera = new THREE.PerspectiveCamera( THREE.Math.radToDeg( 2 * Math.atan( ( SCREEN_HEIGHT / 2 )  / cameraDistance ) ), 
                                        SCREEN_WIDTH / SCREEN_HEIGHT, 
                                        bounds.near, bounds.far * 2 )
  camera.position.set( bounds.mid.x , bounds.mid.y, cameraDistance )
  camera.name = 'boxCamera'
  
  scene.add( camera )
  
  // LIGHTS
  var lights = {
    ambient: new THREE.AmbientLight( 0x222222 ),
    directional: new THREE.DirectionalLight( 0xffffff, 1.15 ),
    point: new THREE.PointLight( 0xffffff, 2 ),
    spot: new THREE.SpotLight( 0xffffff, 6, 1200 )
  }
  
  var ambientLight = lights.ambient
  scene.add( ambientLight )
  
  var sceneLight =  lights.point
  sceneLight.position.set( bounds.mid.x, bounds.mid.y, bounds.near-1 )
  sceneLight.name = "sceneLight"

  scene.add( sceneLight )
  
  // Texture
  
  var grassTexture = THREE.ImageUtils.loadTexture( "../assets/perspective/grass.jpg" )
  grassTexture.wrapS = THREE.RepeatWrapping
  grassTexture.wrapT = THREE.RepeatWrapping
  grassTexture.repeat = new THREE.Vector2( 3, 3 );
  
  // Video Texture
  
  videoTexture = new THREEx.VideoTexture( "../assets/perspective/videos/storm480.mp4" )
	var video	= videoTexture.video
  
  // Materials

  var materials = {
    basic: new THREE.MeshBasicMaterial( { color: 0x888888 } ),
    lambert: new THREE.MeshLambertMaterial( { color: 0x888888 } ),
    phong: new THREE.MeshPhongMaterial( { color: 0x888888 , specular: 0x111111 , shininess: 20 } ),
    wireFrame: new THREE.MeshBasicMaterial( { color: 0x888888, wireframe: true } ),
    transparent: new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.0 } ),
    depth: new THREE.MeshDepthMaterial( { side: THREE.BackSide } ),
    grass: new THREE.MeshLambertMaterial( { map: grassTexture } ),
    sky: new THREE.MeshBasicMaterial( { map: videoTexture.texture } )
  }
  
  
  // create the view box
  var viewBox = ViewBox( bounds, materials.phong )
  
  var groundPlane = viewBox.getObjectByName( 'ground' )
  groundPlane.material = materials.grass
  
  var topPlane = viewBox.getObjectByName( 'top' )
  topPlane.material = materials.sky
  
  viewBox.name = 'viewBox'
  
  scene.add( viewBox )


  // RENDERER
  renderer = new THREE.WebGLRenderer( { antialias: true } )
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  container.appendChild( renderer.domElement );


  // TEXT
  
  var textBlock = TextBlock()
  textBlock.name = 'textBlock'
  
  viewBox.add( textBlock )

  // EVENTS
  
  onWindowResize()

  window.addEventListener('resize', onWindowResize, false)

}

function onWindowResize( event ) {
  
  var viewBox = scene.getObjectByName( 'viewBox' )
  viewBox.scale.y *= window.innerHeight / SCREEN_HEIGHT
  viewBox.scale.x *= window.innerWidth / SCREEN_WIDTH

  SCREEN_WIDTH = window.innerWidth
  SCREEN_HEIGHT = window.innerHeight

  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT )
  
  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT
  camera.fov = THREE.Math.radToDeg( 2 * Math.atan( ( SCREEN_HEIGHT / 2)  / camera.position.z ) )
  camera.position.y = SCREEN_HEIGHT / 2
  scene.getObjectByName( 'sceneLight' ).position.y = SCREEN_HEIGHT / 2
  console.log(camera.fov)
  camera.updateProjectionMatrix()

}

function render() {
    renderer.render( scene, camera )
}

var lastTimeMsec= null
function animate(nowMsec) {
  
  // rotate the text
  scene.getObjectByName( "hello" ).rotation.y += .01;
  
  // animate the light
  scene.getObjectByName( 'sceneLight' ).intensity = Math.sin( scene.getObjectByName( "hello" ).rotation.y ) / 3 + 1.1
  
    window.requestAnimationFrame( animate )
    // measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// update video
		videoTexture.update(deltaMsec/1000, nowMsec/1000)
    render()
}

function Boundaries(width, height, depth) {
  return { 
    height: height, width: width, depth: depth,
    near: 0.1, far: -depth, 
    left: -width / 2, right: width / 2, top: height, bottom: 0,
    mid: new THREE.Vector3( 0, height / 2, -depth / 2 ) 
  }
}

function ViewBox(boundaries, material) {
  
  // container for walls
  var box = new THREE.Object3D()
  
  var planeGeo, plane
  
  // back
  planeGeo = new THREE.PlaneGeometry( boundaries.width, boundaries.height )
  plane = new THREE.Mesh( planeGeo, material )
  plane.name = 'back';
  plane.position.set( boundaries.mid.x, boundaries.mid.y, boundaries.far )
  box.add( plane )
  
  // ground
  planeGeo = new THREE.PlaneGeometry(boundaries.width, boundaries.depth )
  plane = new THREE.Mesh( planeGeo, material )
  plane.name = 'ground';
  plane.rotation.x = -Math.PI / 2
  plane.position.set( boundaries.mid.x, boundaries.bottom, boundaries.mid.z )
  box.add( plane )
  
  // top
  plane = plane.clone()
  plane.name = 'top'
  plane.rotation.x += Math.PI
  plane.position.y = boundaries.top
  box.add( plane )
  
  // left
  planeGeo = new THREE.PlaneGeometry( boundaries.depth, boundaries.height )
  plane = new THREE.Mesh( planeGeo, material )
  plane.name = 'left'
  plane.rotation.y = Math.PI / 2
  plane.position.set( -boundaries.width / 2, boundaries.mid.y, boundaries.mid.z )
  box.add( plane )
  
  // right
  plane = plane.clone()
  plane.name = 'right'
  plane.rotation.y +=Math.PI
  plane.position.x = boundaries.width / 2
  box.add( plane )
  
  return box
}

function TextBlock() {
  var textBlock = new THREE.Object3D
  
  // default
  var material = new THREE.MeshPhongMaterial( {
        color: 0xdddddd
    } )
  
  var textGeo = new THREE.TextGeometry( 'ezekeal.com', { font: 'droid sans mono' } )
  
  var textMesh = new THREE.Mesh( textGeo, material )

  textGeo.computeBoundingBox()
  var textWidth = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x;

  textMesh.position.set( bounds.mid.x - textWidth / 2, bounds.height * (2/3), bounds.mid.z );
  textBlock.add( textMesh );
  
  // beveled and sized
  var material2 = new THREE.MeshPhongMaterial({
    color: 0x00ff00
  });
  var textGeom2 = new THREE.TextGeometry( 'Hello, World!', {
    font: 'droid sans mono', size: 60, height: 20, curveSegments: 3,
    bevelThickness: 3, bevelSize: 3, bevelEnabled: true
  });
  var textMesh2 = new THREE.Mesh( textGeom2, material2 );

  textGeom2.computeBoundingBox();
  var textWidth2 = textGeom2.boundingBox.max.x - textGeom2.boundingBox.min.x;

  textMesh2.position.set( - textWidth2 / 2, 0, 0);
  var textPivot = new THREE.Object3D()
  textPivot.position.x = bounds.mid.x
  textPivot.position.y = bounds.height / 3
  textPivot.position.z = bounds.mid.z
  textPivot.name = "hello"
  textPivot.add( textMesh2 )
  textBlock.add( textPivot )
  
  return textBlock
}
},{}]},{},[1]);
