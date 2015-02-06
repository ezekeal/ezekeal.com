if ( ! Detector.webgl ) Detector.addGetWebGLMessage()
  
var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight

var renderer, stats, container

var camera, scene, cameraTarget

var bounds = Boundaries( SCREEN_WIDTH, SCREEN_HEIGHT, 1000 )

var directionalLight, pointLight
var lightVal = 0, lightDir = 1

var terrain

var textMesh1

init()
animate()

function init() {
  
  container = document.getElementById( 'container' )
  
  // CAMERA
  var cameraDistance = 600;
  camera = new THREE.PerspectiveCamera( THREE.Math.radToDeg( 2 * Math.atan( ( SCREEN_HEIGHT / 2 )  / cameraDistance ) ), 
                                        SCREEN_WIDTH / SCREEN_HEIGHT, 
                                        bounds.near, bounds.far * 2 )
  camera.position.set( bounds.mid.x , bounds.mid.y, cameraDistance )
  
  // SCENE
  scene = new THREE.Scene()

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
  
  // WALLS
  var segments = 1;
  var geometry = new THREE.BoxGeometry( bounds.width, bounds.height, bounds.depth , segments, segments, segments);
  var materials = {
    basic: new THREE.MeshBasicMaterial( { color: 0x888888 } ),
    lambert: new THREE.MeshLambertMaterial( { color: 0x888888 } ),
    phong: new THREE.MeshPhongMaterial( { color: 0x888888 , specular: 0x111111 , shininess: 20 } ),
    wireFrame: new THREE.MeshBasicMaterial( { color: 0x888888, wireframe: true } ),
    transparent: new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.0 } ),
    depth: new THREE.MeshDepthMaterial( { side: THREE.BackSide } )
  }
  
  // container for walls
  var box = new THREE.Object3D()
  box.name = 'walls'
  
  // attributes
  var boxMaterial = materials.phong;
  
  var planeGeo, plane
  
  // back
  planeGeo = new THREE.PlaneGeometry(bounds.width, bounds.height, segments, segments)
  plane = new THREE.Mesh( planeGeo, boxMaterial )
  plane.name = 'back';
  plane.position.set( bounds.mid.x, bounds.mid.y, bounds.far )
  box.add( plane )
  
  // ground
  planeGeo = new THREE.PlaneGeometry(bounds.width, bounds.depth, segments, segments)
  plane = new THREE.Mesh( planeGeo, boxMaterial )
  plane.name = 'ground';
  plane.rotation.x = -Math.PI / 2
  plane.position.set( bounds.mid.x, bounds.bottom, bounds.mid.z )
  box.add( plane )
  
  // top
  plane = plane.clone()
  plane.name = 'top'
  plane.rotation.x += Math.PI
  plane.position.y = bounds.top
  box.add( plane )
  
  // left
  planeGeo = new THREE.PlaneGeometry( bounds.depth, bounds.height, segments, segments )
  plane = new THREE.Mesh( planeGeo, boxMaterial )
  plane.name = 'left'
  plane.rotation.y = Math.PI / 2
  plane.position.set( -bounds.width / 2, bounds.mid.y, bounds.mid.z )
  box.add( plane )
  
  // right
  plane = plane.clone()
  plane.name = 'right'
  plane.rotation.y +=Math.PI
  plane.position.x = bounds.width / 2
  box.add( plane )
  
  scene.add( box )


  // RENDERER
  renderer = new THREE.WebGLRenderer( { antialias: true } )
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  container.appendChild( renderer.domElement );


  // TEXT
  
  // default
  var material = new THREE.MeshPhongMaterial( {
        color: 0xdddddd
    } )
  
  var textGeo = new THREE.TextGeometry( 'ezekeal.com', { font: 'droid sans mono' } )
  
  var textMesh = new THREE.Mesh( textGeo, material )

  textGeo.computeBoundingBox()
  var textWidth = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x;

  textMesh.position.set( bounds.mid.x - textWidth / 2, bounds.height * (2/3), bounds.mid.z );
  scene.add( textMesh );
  
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
  scene.add( textPivot )

  // EVENTS
  
  onWindowResize()

  window.addEventListener('resize', onWindowResize, false)

}

function onWindowResize( event ) {
  
  var walls = scene.getObjectByName( 'walls' );
  walls.scale.y *= window.innerHeight / SCREEN_HEIGHT
  walls.scale.x *= window.innerWidth / SCREEN_WIDTH

  SCREEN_WIDTH = window.innerWidth
  SCREEN_HEIGHT = window.innerHeight

  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT )
  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT
  camera.fov = THREE.Math.radToDeg( 2 * Math.atan( ( SCREEN_HEIGHT / 2)  / camera.position.z ) )
  console.log(camera.fov)
  camera.updateProjectionMatrix()

}

function render() {
    renderer.render( scene, camera )
}

function animate() {
  
  // rotate the text
  scene.getObjectByName( "hello" ).rotation.y += .01;
  
  // animate the light
  scene.getObjectByName( 'sceneLight' ).intensity = Math.sin(scene.getObjectByName( "hello" ).rotation.y) / 3 + 1.0
  
    window.requestAnimationFrame( animate )
    render()
}


function Boundaries(width, height, depth) 
{
  return { 
    height: height, width: width, depth: depth,
    near: 0.1, far: -depth, 
    left: -width / 2, right: width / 2, top: height, bottom: 0,
    mid: new THREE.Vector3( 0, height / 2, -depth / 2 ) 
  }
}