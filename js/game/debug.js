function setupMouseControl(canvas, entity, camera) {
    let lastEvent;

    ['mousedown', 'mousemove'].forEach(eventName => {
        canvas.addEventListener(eventName, event => {
            if (event.buttons === 1) {
                const x = (event.offsetX/2 + camera.pos.x - entity.pos.x);
                const y = (event.offsetY/2 + camera.pos.y - entity.pos.y);
                const mod = Math.sqrt(x*x+y*y);
                const cos = x/mod;
                const sin = y/mod;
                entity.vel.set(0, 0);
                entity.addVel(
                    10*cos,
                    10*sin);
                entity.facing = 'none';
                entity.onGround = false;
            }
            // } else if (event.buttons === 2
            //     && lastEvent && lastEvent.buttons === 2
            //     && lastEvent.type === 'mousemove') {
            //     camera.pos.x -= event.offsetX - lastEvent.offsetX;
            //     if(camera.pos.x<0) camera.pos.x =0;
            // }
            // lastEvent = event;
        });
    });

    canvas.addEventListener('contextmenu', event => {
        event.preventDefault();
    });
}
