if ( !window.requestAnimationFrame ) {
    window.requestAnimationFrame = ( function() {
        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
                window.setTimeout( callback, 1000 / 60 );
            };
    })();
}
TheScene = function (renderer) {

    THREE.Scene.call (this);
    scene=this;
    staticBlocks = [];
    tableroColision = {
        ancho: 10,
        alto: 20,
        profundidad: 1,
        divisionesX: 10,
        divisionesY: 20,
        divisionesZ: 1
    };

    tamañoBloque = tableroColision.ancho/tableroColision.divisionesX;

    var Bien=null;
    var ambientLight = null;
    var spotLight = null;
    var camera = null;
    var trackballControls = null;
    var clock = new THREE.Clock();
    var posicion=15.5;

    gameStepTime = 1000;
    Colision.iniciar(tableroColision.divisionesX, tableroColision.divisionesY, tableroColision.divisionesZ);
    frameTime = 0; // ms
    cumulatedFrameTime = 0; // ms
    _lastFrameTime = Date.now(); // timestamp
    gameOver = false;
    score=0;


  var createCamera = function (self, renderer) {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.position.set (0, 0, 30);
    var look = new THREE.Vector3 (0,0,0);
    camera.lookAt(look);

    trackballControls = new THREE.TrackballControls (camera, renderer);
    trackballControls.rotateSpeed = 5;
    trackballControls.zoomSpeed = -2;
    trackballControls.panSpeed = 0.5;
    trackballControls.target = look;
  }

  var createLights = function (self) {

    ambientLight = new THREE.AmbientLight(0x0c0c0c,5);
    self.add (ambientLight);

    spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 0, 10, 0 );
    scene.add (spotLight);

      light1 = new THREE.PointLight( 0xffffff, 0.8, 100, 2.0 );
      light1.position.set( 0, 0, 50 );
      scene.add( light1 );

  }



  var init = function (self, renderer) {
    createLights (self);
    createCamera (self, renderer);

    tablero = new Tablero();
    self.add(tablero);
    suelo= new Suelo();
    self.add(suelo);
    Bloque.generarBloque();

  }

  this.animate = function (controls) {
      var time = Date.now();
      frameTime = time - _lastFrameTime;
      _lastFrameTime = time;
      cumulatedFrameTime += frameTime;

      while(cumulatedFrameTime > gameStepTime) {
          cumulatedFrameTime -= gameStepTime;
          Bloque.mover(0,-1,0);

      }
      spotLight.intensity = controls.lightIntensity;

     if(!gameOver) window.requestAnimationFrame(animate);

  }

  /////////////------------------------------------////////////////////////////////////////
    cambiarDificultad = function (valor) {
        gameStepTime = valor;
    }
    añadirBloqueSustitucion = function(x, y, z) {

        if(staticBlocks[x] === undefined) staticBlocks[x] = [];
       if(staticBlocks[x][y] === undefined) staticBlocks[x][y] = [];

       var mesh = THREE.SceneUtils.createMultiMaterialObject(new THREE.CubeGeometry( tamañoBloque, tamañoBloque, tamañoBloque), [
           new THREE.MeshBasicMaterial({color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true}),
           new THREE.MeshStandardMaterial({color: 0x6666ff})
       ] );

        mesh.position.x = (x - tableroColision.divisionesX/2)*tamañoBloque + tamañoBloque/2;
       mesh.position.y = (y - tableroColision.divisionesY/2)*tamañoBloque + tamañoBloque/2;
       mesh.position.z = 0;
        mesh.overdraw = true;

        staticBlocks[x][y] = mesh;
        scene.add(mesh);
    };

    juegoTerminado = function () {
        gameOver = true;
    }

    cambiarPaisaje=function (opcion) {
        if(opcion==1){
            var cubeMap = new THREE.CubeTexture( [] );
            cubeMap.format = THREE.RGBFormat;
            var loader = new THREE.ImageLoader();
            loader.load( 'imgs/skyboxsun25degtest.png', function ( image ) {
                var getSide = function ( x, y ) {
                    var size = 1024;
                    var canvas = document.createElement( 'canvas' );
                    canvas.width = size;
                    canvas.height = size;
                    var context = canvas.getContext( '2d' );
                    context.drawImage( image, - x * size, - y * size );
                    return canvas;
                };
                cubeMap.images[ 0 ] = getSide( 2, 1 ); // px
                cubeMap.images[ 1 ] = getSide( 0, 1 ); // nx
                cubeMap.images[ 2 ] = getSide( 1, 0 ); // py
                cubeMap.images[ 3 ] = getSide( 1, 2 ); // ny
                cubeMap.images[ 4 ] = getSide( 1, 1 ); // pz
                cubeMap.images[ 5 ] = getSide( 3, 1 ); // nz
                cubeMap.needsUpdate = true;
            } );
            var cubeShader = THREE.ShaderLib[ 'cube' ];
            cubeShader.uniforms[ 'tCube' ].value = cubeMap;
            var skyBoxMaterial = new THREE.ShaderMaterial( {
                fragmentShader: cubeShader.fragmentShader,
                vertexShader: cubeShader.vertexShader,
                uniforms: cubeShader.uniforms,
                depthWrite: false,
                side: THREE.BackSide
            } );
            var skyBox = new THREE.Mesh(
                new THREE.BoxGeometry( 1000, 1000, 1000 ),
                skyBoxMaterial
            );
            scene.add(skyBox);
        }else{
            var textureLoader = new THREE.TextureLoader();

            var path = "imgs/cube/";
            var format = '.jpg' +
                '' +
                '';
            var urls = [
                path + 'posx' + format, path + 'negx' + format ,
                path + 'posy' + format, path + 'negy' + format ,
                path + 'posz' + format, path + 'negz' + format
            ];

            var textureCube = new THREE.CubeTextureLoader().load(urls);

            var shader = THREE.ShaderLib["cube"];
            shader.uniforms["tCube"].value = textureCube;

            var material= new THREE.ShaderMaterial({
                fragmentShader : shader.fragmentShader ,
                vertexShader : shader.vertexShader ,
                uniforms : shader.uniforms ,
                depthWrite : false ,
                side : THREE.BackSide
            });
            environmentMesh = new THREE.Mesh (new THREE.BoxGeometry( 1000 , 1000 , 1000 ) ,material) ;
            scene.add(environmentMesh);
        }
    }

    window.addEventListener('keydown', function (event) {
        var key = event.which ? event.which : event.keyCode;

        switch(key) {
            case 38: // up (arrow)
                Bloque.mover(0, 0, 0);
                break;
            case 40: // down (arrow)
                Bloque.mover(0, -1, 0);
                break;
            case 37: // left(arrow)
                Bloque.mover(-1, 0, 0);
                break;
            case 39: // right (arrow)
                Bloque.mover(1, 0, 0);
                break;
        }
    }, false);
    // ///////--------------------------------------///////////////////////////////
  this.getCamera = function () {
    return camera;
  }



    this.getCameraControls = function () {
    return trackballControls;
  }
  

  this.setCameraAspect = function (anAspectRatio) {
    camera.aspect = anAspectRatio;
    camera.updateProjectionMatrix();
  }

  
  init (this, renderer);
}

TheScene.prototype = Object.create (THREE.Scene.prototype);
TheScene.prototype.constructor = TheScene;

