const banditStates = {
    ATTACK: 0,
    DYING: 1,
    HURT: 2,
    IDLE: 3,
    WALKING: 4,
}

class BanditState {
    static setup(bundle){
        BanditState.InteractionLogic = bundle.InteractionLogic;
        BanditState.BanditLogic = bundle.BanditLogic;
    }
    constructor(state, bandit){
        this.state = state;
        this.bandit = bandit;
    }
}

class Attacking extends BanditState {
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
            if(!bandit.nextCell.plant && !bandit.nextCell.seed){
            }else{
                BanditState.InteractionLogic.plantIsAttacked(playBoard, bandit.nextCell.plant !== null ? bandit.nextCell.plant : bandit.nextCell.seed, 1);
            }
            bandit.isMoving = false;
            bandit.hasMoved = true;
            bandit.nextCell = null;
            bandit.isAttacking = false;
            BanditState.BanditLogic.setState(bandit, banditStates.IDLE);
        }
    }
}

class Idle extends BanditState {
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

class Walking extends BanditState {
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

class Hurt extends BanditState {
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
            BanditState.BanditLogic.setState(bandit, banditStates.IDLE);
        }
    }
}

class Dying extends BanditState {
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
            BanditState.InteractionLogic.findMovableAndDelete(playBoard, bandit);
        }
    }
}
export {banditStates, BanditState, Attacking, Dying, Hurt, Idle, Walking};

if (typeof module !== 'undefined') {
    module.exports = {banditStates, BanditState, Attacking, Dying, Hurt, Idle, Walking};
}

