

Suelo = function () {
    THREE.Object3D.call (this);

    var init = function (self) {

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
        self.add(skyBox);



       /* var textureLoader = new THREE.TextureLoader();

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
        self.add(environmentMesh);*/
//////////////////////////////////////////////
        floorMat = new THREE.MeshStandardMaterial( {
            roughness: 0.8,
            color: 0xffffff,
            metalness: 0.2,
            bumpScale: 0.0005
        });

        var textureLoader = new THREE.TextureLoader();
        textureLoader.load( "imgs/hardwood2_diffuse.jpg", function( map ) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set( 10, 24 );
            floorMat.map = map;
            floorMat.needsUpdate = true;
        } );

        textureLoader.load( "imgs/hardwood2_bump.jpg", function( map ) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set( 10, 24 );
            floorMat.bumpMap = map;
            floorMat.needsUpdate = true;
        } );

        textureLoader.load( "imgs/hardwood2_roughness.jpg", function( map ) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set( 10, 24 );
            floorMat.roughnessMap = map;
            floorMat.needsUpdate = true;
        } );

        var floorGeometry = new THREE.PlaneBufferGeometry( 150, 150 );
        var floorMesh = new THREE.Mesh( floorGeometry, floorMat );
        floorMesh.receiveShadow = true;
        floorMesh.rotation.x = -Math.PI / 2.0;
        floorMesh.position.set(0,-11,0);
        self.add(floorMesh );

    }

    init (this);
}

Suelo.prototype = Object.create (THREE.Object3D.prototype);
Suelo.prototype.constructor = Suelo;

