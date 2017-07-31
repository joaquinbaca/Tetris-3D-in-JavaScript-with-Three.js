/**
 * Created by joaqu on 24/05/2017.
 */

Vectores = {};

Vectores.clonar = function (v) {
    return {x:v.x, y:v.y, z:v.z};
};


Bloque = {};
Bloque.formas = [
    [
        {x:0, y:0, z:0},
        {x:1, y:0, z:0},
        {x:1, y:1, z:0},
        {x:1, y:2, z:0}
    ],
    [
        {x:0, y:0, z:0},
        {x:0, y:1, z:0},
        {x:0, y:2, z:0},
    ],
    [
        {x:0, y:0, z:0},
        {x:0, y:1, z:0},
        {x:1, y:0, z:0},
        {x:1, y:1, z:0}
    ],
    [
        {x:0, y:0, z:0},
        {x:0, y:1, z:0},
        {x:0, y:2, z:0},
        {x:1, y:1, z:0}
    ],
    [
        {x:0, y:0, z:0},
        {x:0, y:1, z:0},
        {x:1, y:1, z:0},
        {x:1, y:2, z:0}
    ]
];

Bloque.position = {};

Bloque.generarBloque = function () {
    var geometry, tmpGeometry, i;
    var type = Math.floor(Math.random() * (Bloque.formas.length));
    this.blockType = type;

    Bloque.shape = [];
    for (i = 0; i < Bloque.formas[type].length; i++) {
        Bloque.shape[i] = Vectores.clonar(Bloque.formas[type][i]);
    }

    geometry = new THREE.CubeGeometry(tamañoBloque, tamañoBloque, tamañoBloque);
    for (i = 1; i < Bloque.shape.length; i++) {
        tmpGeometry = new THREE.Mesh(new THREE.CubeGeometry(tamañoBloque, tamañoBloque, tamañoBloque));
        tmpGeometry.position.x = tamañoBloque * Bloque.shape[i].x;
        tmpGeometry.position.y = tamañoBloque * Bloque.shape[i].y;
        THREE.GeometryUtils.merge(geometry, tmpGeometry);
    }

    Bloque.mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [
        new THREE.MeshBasicMaterial({color: 0x000000, wireframe:true, transparent:true}),
        new THREE.MeshStandardMaterial({color:0xff0000,roughness: 0.5, metalness: 1})
    ]);

    Bloque.position = {x:Math.floor(tableroColision.divisionesX / 2) - 1, y:17, z:0};

    if (Colision.comprobarColision(true) === Colision.COLLISION.SUELO) {
        gameOver = true;
    }

    Bloque.mesh.position.x = (Bloque.position.x - tableroColision.divisionesX / 2) * tamañoBloque / 2;
    Bloque.mesh.position.y = (Bloque.position.y - tableroColision.divisionesY / 2) * tamañoBloque +( tamañoBloque / 2);
    Bloque.mesh.position.z = 0;
    Bloque.mesh.rotation = {x:0, y:0, z:0};
    Bloque.mesh.overdraw = true;

    scene.add( Bloque.mesh);
};



Bloque.mover = function (x, y, z) {
    Bloque.mesh.position.x += x * tamañoBloque;
    Bloque.position.x += x;

    Bloque.mesh.position.y += y * tamañoBloque;
    Bloque.position.y += y;

    Bloque.mesh.position.z += z * tamañoBloque;
    Bloque.position.z += z;

    var colision = Colision.comprobarColision((y != 0));

    if (colision === Colision.COLLISION.PARED) {
        Bloque.mover(-x, -y, 0);
    }
    if (colision === Colision.COLLISION.SUELO) {
        Bloque.contacto();
    }
};


Bloque.sustituir = function () {
    var forma = Bloque.shape;
    for (var i = 0; i < forma.length; i++) {
        añadirBloqueSustitucion(Bloque.position.x + forma[i].x, Bloque.position.y + forma[i].y, Bloque.position.z + forma[i].z);
        Colision.modos[Bloque.position.x + forma[i].x][Bloque.position.y+1 + forma[i].y][Bloque.position.z + forma[i].z] = Colision.MODO.USADO;
    }
};

Bloque.contacto = function () {
    Bloque.sustituir();
    scene.remove(Bloque.mesh);
    Colision.lineaCompletada();
    Bloque.generarBloque();
};
