
Tablero = function () {
    THREE.Object3D.call (this);

    var init = function (self) {

        var map = THREE.ImageUtils.loadTexture("imgs/marmol.JPG");
        var material = new THREE.MeshPhongMaterial({ map: map,
            color: 0xffffff });
        var geometry = new THREE.CubeGeometry(20, 1, 1);
        var lateral1 = new THREE.Mesh(geometry, material);
        var lateral2 = new THREE.Mesh(geometry, material);
        lateral1.rotation.set(0,0,1.5708);
        lateral1.position.set(-5.5,0,0);
        self.add (lateral1);
        lateral2.rotation.set(0,0,1.5708);
        lateral2.position.set(5.5,0,0);
        self.add (lateral2);

        var geometry2 = new THREE.CubeGeometry(12, 1, 1);
        var base = new THREE.Mesh(geometry2, material);
        base.rotation.set(0,0,1.5708+1.5708);
        base.position.set(0,-10.5,0);
        self.add (base);

        var boundingBoxConfig = {
            width: 10,
            height: 20,
            depth: 1,
            splitX: 10,
            splitY: 20,
            splitZ: 1
        };


        tamañoBloque = tableroColision.ancho/tableroColision.divisionesX;

        var boundingBox = new THREE.Mesh(
            new THREE.CubeGeometry(
                tableroColision.ancho, tableroColision.alto, tableroColision.profundidad,
                tableroColision.divisionesX, tableroColision.divisionesY, tableroColision.divisionesZ),
            new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true,  } )
        );
        self.add(boundingBox);
    }

    init (this);
}

Tablero.prototype = Object.create (THREE.Object3D.prototype);
Tablero.prototype.constructor = Tablero;