if ( ! Detector.webgl ) Detector.addGetWebGLMessage()
  
var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight

var renderer, stats, container

var camera, scene, cameraTarget

var bounds = { height: SCREEN_HEIGHT, width: SCREEN_WIDTH, depth: 1000,
               near: 0.1, far: -1000, left: -SCREEN_WIDTH / 2, right: SCREEN_WIDTH / 2, top: SCREEN_HEIGHT, bottom: 0,
               mid: new THREE.Vector3( 0, SCREEN_HEIGHT / 2, -500 ) }

var directionalLight, pointLight
var lightVal = 0, lightDir = 1

var terrain

var textMesh1

init()
animate()

function init() {
  
  container = document.getElementById( 'container' )
  
  // CAMERA
  camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, bounds.near, bounds.far * 2 )
  camera.position.set( bounds.mid.x , bounds.mid.y, 600 )
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
  

  var planeMaterial = new THREE.MeshBasicMaterial( { wireframe: true } )
  var segments = 20;
  
  
  // ground
  var ground = new THREE.Mesh( new THREE.PlaneGeometry( bounds.width, bounds.depth, segments, segments ), planeMaterial )
  ground.rotation.x = THREE.Math.degToRad( 90 )
  ground.position.set( bounds.mid.x, bounds.bottom, bounds.mid.z )
  walls.add( ground )
  
  // back
  var back = new THREE.Mesh( new THREE.PlaneGeometry( bounds.width, bounds.height, segments, segments ), planeMaterial )
  back.position.set( bounds.mid.x, bounds.mid.y, bounds.far )
  walls.add( back )
  
  // top
  var top = new THREE.Mesh( new THREE.PlaneGeometry( bounds.width, bounds.depth, segments, segments ), planeMaterial )
  top.rotation.x = THREE.Math.degToRad( 90 )
  top.position.set( bounds.mid.x, bounds.top, bounds.mid.z )
  walls.add( top )
  
  
  // right
  var right = new THREE.Mesh( new THREE.PlaneGeometry( bounds.depth, bounds.height, segments, segments ), planeMaterial )
  right.rotation.y = THREE.Math.degToRad( 90 )
  right.position.set( bounds.right, bounds.mid.y, bounds.mid.z )
  walls.add( right )
  
  // left
  var left = new THREE.Mesh( new THREE.PlaneGeometry( bounds.depth, bounds.height, segments, segments ), planeMaterial )
  left.rotation.y = THREE.Math.degToRad( -90 )
  left.position.set( bounds.left, bounds.mid.y, bounds.mid.z )
  walls.add( left )
  
  //var orb = new THREE.Mesh( new THREE.SphereGeometry( bounds.width, segments, segments ) , planeMaterial)
  //orb.position = bounds.mid
  //scene.add ( orb )
  
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
  
  scene.getObjectByName( "hello" ).rotation.y += .01;
    window.requestAnimationFrame( animate )
    render()
}