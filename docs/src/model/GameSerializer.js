export class GameSerializer {

    static saveDataID = "GreenRenaissanceSaveData";

    static setup(bundle) {
        /**  @type {function} */
        GameSerializer.inventoryStringifier = bundle.inventoryStringifier;
        /**  @type {function} */
        GameSerializer.playBoardStringifier = bundle.playBoardStringifier;
        /**  @type {function} */
        GameSerializer.inventoryParser = bundle.inventoryParser;
        /**  @type {function} */
        GameSerializer.playBoardParser = bundle.playBoardParser;
        GameSerializer.stateCode = bundle.stateCode;
    }

    // placeholder, injected in container
    static save() {
    }

    /**
     *
     * @param {Controller} controller
     */
    static saveGame(controller) {
        let state = {
            state: controller.gameState.state,
            currentStageGroup: controller.gameState.currentStageGroup,
            currentStage: controller.gameState.currentStage != null ? GameSerializer.playBoardStringifier(controller.gameState.currentStage) : null,
            inventory: controller.gameState.currentStage != null ? null : GameSerializer.inventoryStringifier(controller.gameState.inventory), // prevent double storage of inventory
            clearedStages: JSON.stringify(Array.from(controller.gameState.clearedStages.entries())),
            saveState: controller.saveState,
        }
        localStorage.setItem(GameSerializer.saveDataID, JSON.stringify(encrypt(JSON.stringify(state))));
        console.log('Game saved');
    }

    // placeholder, injected in container
    static load() {
    }

    /**
     *
     * @param p5
     * @param {Controller} controller
     */
    static loadGame(p5, controller) {
        let data = localStorage.getItem(GameSerializer.saveDataID);
        if (data) {
            let stateObject = JSON.parse(decrypt(JSON.parse(data)));
            let gameState = controller.gameState;
            gameState.state = stateObject.state;
            gameState.currentStageGroup = stateObject.currentStageGroup;
            gameState.inventory = stateObject.inventory ? GameSerializer.inventoryParser(stateObject.inventory, p5, gameState.inventory) : null;
            gameState.clearedStages = new Map(JSON.parse(stateObject.clearedStages));
            gameState.currentStage = stateObject.currentStage ? GameSerializer.playBoardParser(p5, gameState, stateObject.currentStage) : null;

            controller.menus[GameSerializer.stateCode.PLAY] = gameState.currentStage;
            controller.saveState = stateObject.saveState;
            controller.gameState = gameState;

            if (gameState.state === GameSerializer.stateCode.STANDBY) controller.menus[GameSerializer.stateCode.STANDBY].setup(p5);
            return true;
        } else {
            console.error('Save data not found!');
            return false;
        }
    }
}

function generateKey(timestamp, keySize) {
    let buffer = new ArrayBuffer(8);
    let view = new DataView(buffer);
    view.setBigInt64(0, BigInt(timestamp));

    let fullKey = new Uint8Array(buffer);
    return fullKey.slice(8 - keySize);
}

function encrypt(input) {
    const timestamp = Date.now();
    const keySize = 4;
    const key = Array.from(generateKey(timestamp, keySize));
    const inputBytes = Array.from(new TextEncoder().encode(input));
    const encrypted = inputBytes.map((byte, i) => byte ^ key[i % key.length]);
    return [...key, ...encrypted]; // simple number[]
}

function decrypt(encryptedArray) {
    const keySize = 4;
    const key = encryptedArray.slice(0, keySize);
    const encrypted = encryptedArray.slice(keySize);
    const decrypted = encrypted.map((byte, i) => byte ^ key[i % key.length]);
    return new TextDecoder().decode(new Uint8Array(decrypted));
}

