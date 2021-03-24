// import Compositor from './Compositor.js';
// import TileCollider from './TileCollider.js';
// import {Matrix} from './math.js';

class Level {
    constructor() {
        this.gravity = 1;

        this.comp = new Compositor();
        this.entities = new Set();
        this.tiles = new Matrix();
        this.backing = new Matrix();
        this.bg = new Matrix();
        this.tileSize = _TILESIZE;

        this.animations = {};

        this.globalTime = 0;

        this.tileCollider = new TileCollider(this.tiles);
    }

    width(){
        return _TILESIZE*this.tiles.grid.length;
    }

    heightAt(posx){
        posx+=_TILESIZE/2;
        let posX = (posx-posx%_TILESIZE)/_TILESIZE; 
        return _TILESIZE*this.tiles.grid[posX].length;
    }

    update(deltaTime, camera) {
        this.globalTime += deltaTime;
        this.comp.draw(camera, _ctx);
        this.entities.forEach(entity => {
            entity.update(deltaTime, this.tileCollider, camera, this.gravity);

            if(entity.pos.y>this.heightAt(entity.pos.x)){
                if(!entity.respTimed){
                    entity.respTimed = true;
                    setTimeout(() => {
                        if(entity.type=='player')
                            console.log(`Rain выпала из мира`);
                        entity.pos.x=128;
                        entity.pos.y-0;
                        entity.stopMoving();
                        entity.land(0);
                        camera.pos.x=0;
                        camera.underMap=false;
                        entity.respTimed = false
                    }, 1000);
                }
            }

            entityCollision(entity, this.entities);

            entity.draw(camera);
        });
    }
}


let entityCollision = (subject, entities) =>{
    entities.forEach(target => {
        if(target == subject) return;
        if((subject.pos.x+subject.spritesheet.width-subject.offset.right)<(target.pos.x+target.offset.left)
            ||(target.pos.x+target.spritesheet.width-target.offset.right)<(subject.pos.x+subject.offset.left)
            ||(subject.pos.y+subject.spritesheet.height-subject.offset.bottom)<(target.pos.y+target.offset.top)
            ||(target.pos.y+target.spritesheet.height-target.offset.bottom)<(subject.pos.y+subject.offset.top)
            ) return;


            if(target.type=='box'){
            // console.log('collides');
                if(subject.vel.y>target.vel.y && subject.pos.y+subject.spritesheet.height-subject.offset.bottom>=target.pos.y+target.offset.top){
                    subject.land(target.pos.y + target.offset.top - subject.spritesheet.height);
                    subject.addVel(target.vel.x, target.vel.y);
                } else if (subject.onMove){
                    if(subject.vel.x>0){
                        target.pos.x = subject.pos.x - target.offset.left
                           + subject.spritesheet.width - subject.offset.right+1;
                    } else {
                        target.pos.x = subject.pos.x + subject.offset.left
                           - target.spritesheet.width - target.offset.right-1;
                    }
                    // subject.stopMoving();
                }
            }

    });
}