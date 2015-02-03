if ( ! Detector.webgl ) Detector.addGetWebGLMessage()
  
var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight

var renderer, stats, container

var camera, scene, cameraTarget

var bounds = { height: 1000, width: 1000, depth: 1000,
               near: 0.1, far: 1000, left: -500, right: 500, top: 1000, bottom: 0,
               midX: 0, midY: 500, midZ: -500 }

var directionalLight, pointLight
var lightVal = 0, lightDir = 1

var terrain

var textMesh1

init()
animate()

function init() {
  
  container = document.getElementById( 'container' )
  
  // CAMERA
  camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, bounds.near, bounds.far )
  camera.position.set( bounds.midX , bounds.midY, 500 )
  //cameraTarget = new THREE.Vector3( 0, 0, -1 )
  //camera.lookAt( cameraTarget )
  
  // SCENE
  scene = new THREE.Scene()

  // LIGHTS
  scene.add( new THREE.AmbientLight( 0x111111 ) )
  directionalLight = new THREE.DirectionalLight( 0xffffff, 1.15 )
  directionalLight.position.set( 500, 2000, 0 )
  scene.add( directionalLight )
  pointLight = new THREE.PointLight( 0xff4400, 1.5 )
  pointLight.position.set( 0, 0, 0 )
  scene.add( pointLight );
  
  // Walls
  var walls = new THREE.Object3D();
  
  
  var planeGeometry = new THREE.PlaneGeometry( bounds.width, bounds.height, 10, 10 )
  var planeMaterial = new THREE.MeshBasicMaterial( { wireframe: true } )
  
  
  // ground
  plane = new THREE.Mesh( planeGeometry, planeMaterial )
  plane.rotation.x = THREE.Math.degToRad( 90 )
  plane.position.set( bounds.midX, bounds.bottom, bounds.midZ )
  walls.add( plane )
  
  // back
  plane = new THREE.Mesh( planeGeometry, planeMaterial )
  plane.position.set( bounds.midX, bounds.midY, bounds.midZ )
  walls.add( plane )
  
  // top
  plane = new THREE.Mesh( planeGeometry, planeMaterial )
  plane.rotation.x = THREE.Math.degToRad( 90 )
  plane.position.set( bounds.midX, bounds.top, bounds.midZ )
  walls.add( plane )
  
  
  // right
  plane = new THREE.Mesh( planeGeometry, planeMaterial )
  plane.rotation.y = THREE.Math.degToRad( 90 )
  plane.position.set( bounds.right, bounds.midY, bounds.midZ )
  walls.add( plane )
  
  // lseft
  plane = new THREE.Mesh( planeGeometry, planeMaterial )
  plane.rotation.y = THREE.Math.degToRad( -90 )
  plane.position.set( bounds.left, bounds.midY, bounds.midZ )
  walls.add( plane )
  
  scene.add ( walls )

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

  textMesh.position.set( bounds.midX - textWidth / 2, bounds.height * (2/3), bounds.midZ );
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

  textMesh2.position.set( bounds.midX - textWidth2 / 2, bounds.height * (1/3), bounds.midZ );
  scene.add( textMesh2 );

  // STATS

  stats = new Stats()
  stats.domElement.style.position = 'absolute'
  stats.domElement.style.top = '0px'

  // EVENTS
  
  onWindowResize()

  window.addEventListener('resize', onWindowResize, false)

}

function onWindowResize( event ) {

  SCREEN_WIDTH = window.innerWidth
  SCREEN_HEIGHT = window.innerHeight

  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT )
  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT
  camera.updateProjectionMatrix()

}

function render() {
    renderer.render( scene, camera )
}

function animate() {
    window.requestAnimationFrame( animate )
    render()
}