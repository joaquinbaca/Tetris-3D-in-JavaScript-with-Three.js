/**
 * Created by joaqu on 24/05/2017.
 */
Colision = {};

Colision.COLLISION = {NADA:0, PARED:1, SUELO:2};
Object.freeze(Colision.COLLISION);

Colision.MODO = {VACIO:0, ACTIVE:1, USADO:2 , PINTAR:3};
Object.freeze(Colision.MODO);

Colision.modos = [];

Colision.iniciar = function (_x, _y, _z) {
    for (var x = 0; x < _x; x++) {
        Colision.modos[x] = [];
        for (var y = 0; y < _y; y++) {
            Colision.modos[x][y] = [];
            for (var z = 0; z < _z; z++) {
                Colision.modos[x][y][z] = Colision.MODO.VACIO;
            }
        }
    }
};

Colision.comprobarColision = function (comprobacion) {
    var x, y, z, i;

    var campos = Colision.modos;
    var posx = Bloque.position.x, posy = Bloque.position.y, posz = Bloque.position.z, forma = Bloque.shape;

    for (i = 0; i < forma.length; i++) {
        if ((forma[i].x + posx) < 0 || (forma[i].y + posy) < 0 || (forma[i].x + posx) >= campos.length || (forma[i].y + posy) >= campos[0].length) {
            return Colision.COLLISION.PARED;
        }

        if (campos[forma[i].x + posx][forma[i].y + posy][forma[i].z + posz] === Colision.MODO.USADO) {
            return comprobacion ? Colision.COLLISION.SUELO : Colision.COLLISION.PARED;
        }

        if((forma[i].y + posy) <= 0) {
            return Colision.COLLISION.SUELO;
        }
        for(var h=0;h<10;h++){
        if((campos[h][17][0] === Colision.MODO.USADO)){
            juegoTerminado();
        }}
    }
};

Colision.lineaCompletada = function() {

    var x,y,z,x2,y2,z2,x4,y4,x8,y8, campos2 = Colision.modos;
    var rebuild = false;

    var sum=0, expected = 10, bonus = 0;

        for(y = 0; y < 20; y++) {
            sum=0;
            for(x = 0; x < 10; x++) {
                if(campos2[x][y][0] === Colision.MODO.USADO){
                    sum++;
                }
            }
        if(sum == expected) {
                score=score+100;
            document.getElementById("sco").innerHTML = score;
            for(y8 = y; y8 < 20; y8++) {
                for(x8 = 0; x8 < 10; x8++) {
                    campos2[x8][y8][0]=Colision.MODO.VACIO;
                    }
                }

            for(x2=0;x2<10;x2++){
                   scene.remove(staticBlocks[x2][y-1]);
                    Colision.modos[x2][y][0]=Colision.MODO.VACIO;

                }

            for(x2=0;x2<10;x2++){
                for(y2=y;y2<20;y2++){
                    if( Colision.modos[x2][y2][0]===Colision.MODO.VACIO){
                        scene.remove(staticBlocks[x2][y2]);
                    }
                }
            }


        }
    }


};