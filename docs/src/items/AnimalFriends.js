import {Movable} from "./Movable.js";

export class AnimalFriends extends Movable {
    constructor(p5, target) {
        super();
        this.target = target;
        this.x = 0;
        this.y = 0;

        this.img = p5.images.get(`panther`);
        this.cell = null;
        this.status = true;

        this.targetCell = null;
        this.isMoving = false;
        this.hasMoved = true;
        this.direction = [];
    }

    draw(p5) {

    }

    movements(p5, playBoard) {

    }

    stringify() {

        return "";
    }
}