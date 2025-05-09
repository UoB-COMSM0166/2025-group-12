import {InteractionLogic} from "./InteractionLogic.js";
import {BanditLogic} from "./Bandit.js";

const banditStates = {
    ATTACK: 0,
    DYING: 1,
    HURT: 2,
    IDLE: 3,
    WALKING: 4,
}

class State {
    constructor(state, bandit){
        this.state = state;
        this.bandit = bandit;
    }
}

class Attacking extends State {
    constructor(bandit) {
        super("ATTACK", bandit);
    }

    static enter(bandit) {
        bandit.index = 0;
        bandit.maxFrame = 10;
        bandit.imageKey = "attacking";
    }

    static handleInput(playBoard, bandit) {
        //after playing attack animation, execute plantIsAttacked, then return to idle
        if(bandit.index === bandit.maxFrame){
            if(!bandit.nextCell) return;
            InteractionLogic.plantIsAttacked(playBoard, bandit.nextCell.plant !== null ? bandit.nextCell.plant : bandit.nextCell.seed, 1);
            this.hasMoved = true;
            bandit.nextCell = null;
            BanditLogic.setState(bandit, banditStates.IDLE);
        }
    }
}

class Idle extends State {
    constructor(bandit){
        super('IDLE', bandit);
    }
    static enter(bandit){
        bandit.index = 0;
        bandit.maxFrame = 11;
        bandit.imageKey = "idle";
    }
    static handleInput() {}
}

class Walking extends State {
    constructor(bandit){
        super('WALKING', bandit);
    }
    static enter(bandit){
        bandit.index = 0;
        bandit.maxFrame = 17;
        bandit.imageKey = "walking";
    }
    static handleInput() {

    }
}

class Hurt extends State {
    constructor(bandit){
        super('HURT', bandit);
    }
    static enter(bandit){
        bandit.index = 0;
        bandit.maxFrame = 11;
        bandit.imageKey = "hurt";
    }
    static handleInput(playBoard, bandit) {
        //after playing hurt animation, return to idle
        if(bandit.index === bandit.maxFrame){
            BanditLogic.setState(bandit, banditStates.IDLE);
        }
    }
}

class Dying extends State {
    constructor(bandit){
        super('DYING', bandit);
    }

    static enter(bandit){
        bandit.index = 0;
        bandit.maxFrame = 14;
        bandit.imageKey = "dying";
    }

    static handleInput(playBoard, bandit) {
        if(bandit.index === bandit.maxFrame){
            bandit.status = false;
            InteractionLogic.findMovableAndDelete(playBoard, bandit);
        }
    }
}
export {banditStates, Attacking, Dying, Hurt, Idle, Walking};

if (typeof module !== 'undefined') {
    module.exports = {banditStates, Attacking, Dying, Hurt, Idle, Walking};
}

