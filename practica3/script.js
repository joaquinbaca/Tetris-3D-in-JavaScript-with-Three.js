
renderer = null; 
scene = null;
GUIcontrols = null;
stats = null;

/// Función que se llama para dibujar cada frame
function render() {
  stats.update();
  if(!gameOver){
    requestAnimationFrame(render);
  }else document.getElementById("reiniciar").style.visibility='visible';
  scene.getCameraControls().update ();
  renderer.render(scene, scene.getCamera());
  scene.animate(GUIcontrols);
  TWEEN.update();
}

/// Se construye el renderer basado en WebGL
function createRenderer () {
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
  renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.physicallyCorrectLights = true;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
  return renderer;  
}

/// El  DOM  que muestra estadística
function initStats() {
  var stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms
  // Alineación top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  $("#Stats-output").append( stats.domElement );

  return stats;
}

/// Se crea la GUI
function createGUI (withStats) {
  /// Se crea la interfaz y se le añaden controles
  var gui = new dat.GUI();
  GUIcontrols = new function() {
    this.lightIntensity = 0.5;
  }
  gui.add(GUIcontrols, 'lightIntensity', 0, 1.0);
  if (withStats)
    stats = initStats();
}

/// Función encargada de procesar un cambio de tamaño de la ventana
function onWindowResize () {
  scene.setCameraAspect (window.innerWidth / window.innerHeight);
  renderer.setSize (window.innerWidth, window.innerHeight);
}

$(function () {
    document.getElementById("iniciar").addEventListener('click', function (event) {
        event.preventDefault();


  renderer = createRenderer();
  $("#WebGL-output").append(renderer.domElement);
  window.addEventListener ("resize", onWindowResize);
  scene = new TheScene (renderer.domElement);
  createGUI(true);
  render(); });
});
 
 
 
 