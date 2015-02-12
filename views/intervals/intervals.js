var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;

var renderer = PIXI.autoDetectRenderer( SCREEN_WIDTH, SCREEN_HEIGHT );
document.body.appendChild(renderer.view);

var stage = new PIXI.Stage(0xace455);

var octaveTexture = PIXI.Texture.fromImage( "../assets/intervals/octave.jpg" );
var octave = new PIXI.Sprite(octaveTexture);

stage.addChild( octave );

animate();

function animate() {

  requestAnimFrame( animate );

  // render the stage
  renderer.render(stage);
}