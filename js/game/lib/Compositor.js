class Compositor {
    constructor() {
        this.layers = [];
    }

    draw(camera, ctx=_ctx) {
        this.layers.forEach(layer => {
            layer(camera, ctx);
        });
    }
}
