export default class TileView {
    constructor(p5, tile) {
        this.p5 = p5;
        this.tile = tile;
    }

    draw() {
        const { p5, tile } = this;
        p5.push();
        p5.fill(tile.color);
        p5.image(p5.img, tile.x, tile.y, tile.width, tile.height, 0, 0, tile.spriteWidth, tile.spriteHeight);
        p5.pop();
    }

    highlight() {
        this.tile.setColor('yellow');
    }

    resetColor() {
        this.tile.setColor('white');
    }

    
}
