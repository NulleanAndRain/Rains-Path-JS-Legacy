var __collisionStops = true;

class TileCollider {
    constructor(tileMatrix) {
        this.tiles = new TileResolver(tileMatrix);
    }

    checkX(entity, camera) {
        let x = 0;
        if (entity.vel.x > 0) {
            x += entity.pos.x + entity.spritesheet.width - entity.offset.right;
        } else if (entity.vel.x < 0) {
            x += entity.pos.x + entity.offset.left;
        } else {
            x += entity.pos.x + entity.spritesheet.width - entity.offset.right;
        }

        if(_collDebug){
            _ctx.beginPath();
            _ctx.strokeStyle = "green";
            _ctx.rect(
                entity.pos.x-camera.pos.x,
                entity.pos.y-camera.pos.y, 
                entity.spritesheet.width,
                entity.spritesheet.height);
            _ctx.stroke();
            _ctx.closePath();

            _ctx.beginPath();
            _ctx.strokeStyle = "blue";
            _ctx.rect(
                entity.pos.x-camera.pos.x + entity.offset.left,
                entity.pos.y-camera.pos.y+entity.offset.top, 
                entity.spritesheet.width-entity.offsetHor,
                entity.spritesheet.height-entity.offsetVert);
            _ctx.stroke();
            _ctx.closePath();
        }

        const matches = this.tiles.searchByRange(
            x, x,
            entity.pos.y + entity.offset.top, entity.pos.y + entity.spritesheet.height -entity.offset.bottom);

        matches.forEach(match => {

            if (match.tile.type != 'solid') {
                return;
            }

           if(_collDebug){
                _ctx.beginPath();
                _ctx.strokeStyle = "red";
                _ctx.rect(
                    match.x1-camera.pos.x,
                    match.y1-camera.pos.y,
                    match.x2-match.x1,
                    match.y2-match.y1);
                _ctx.stroke();
                _ctx.closePath();
            }
            
            if (entity.vel.x > 0) {
                if (entity.pos.x + entity.spritesheet.width > match.x1) {
                    entity.pos.x = match.x1 - entity.spritesheet.width + entity.offset.right;
                    if(__collisionStops)
                        entity.stopMoving();
                    // entity.vel.y+=entity.gravity/60;
                }
            } else if (entity.vel.x < 0) {
                if (entity.pos.x < match.x2) {
                    entity.pos.x = match.x2 - entity.offset.left;
                    if(__collisionStops)
                        entity.stopMoving();
                    // entity.vel.y+=entity.gravity/60;
                }
            }
        });
    }

    checkY(entity, camera) {
        let y = 0;
        if (entity.vel.y > 0) {
            y += entity.pos.y + entity.spritesheet.height - entity.offset.bottom;
        } else if (entity.vel.y < 0) {
            y += entity.pos.y + entity.offset.top;
        } else {
            y += entity.pos.y + entity.spritesheet.height - entity.offset.bottom;
        }

        const matches = this.tiles.searchByRange(
            entity.pos.x + entity.offset.left, entity.pos.x + entity.spritesheet.width - entity.offset.right,
            y, y);
        if(matches.length==0){
            entity.onGround = false;
            // return;
        }

        matches.forEach(match => {
            // console.log(match);

            if (match.tile.type != 'solid' || match.tile.type == undefined) {
                return;
            }

            
            if(_collDebug){
                _ctx.beginPath();
                _ctx.strokeStyle = "red";
                _ctx.rect(
                    match.x1-camera.pos.x,
                    match.y1-camera.pos.y, 
                    match.x2-match.x1,
                    match.y2-match.y1);
                _ctx.stroke();
                _ctx.closePath();
            }

            if (entity.vel.y > 0) {
                if (entity.pos.y + entity.spritesheet.height - entity.offset.bottom> match.y1) {
                    entity.land(match.y1-entity.spritesheet.height+entity.offset.bottom);
                }
            } else if (entity.vel.y < 0) {
                if (entity.pos.y < match.y2 - entity.offset.top) {
                    entity.pos.y = match.y2 - entity.offset.top;
                    entity.vel.y = 0;
                }
            }
        });
    }
}
