import {GameState, stageGroup, stateCode} from "./GameState.js";
import {Inventory} from "./Inventory.js";
import {PlayBoard} from "./Play.js";

export class GameSave {

    static saveDataID = "GreenRenaissanceSaveData";

    static save(p5) {
        let gameState = p5.controller.gameState;
        let state = {
            state: gameState.state,
            currentStageGroup: gameState.currentStageGroup,
            currentStage: gameState.currentStage != null ? gameState.currentStage.saveGame() : null,
            inventory: gameState.currentStage != null ? null : gameState.inventory.stringify(), // prevent double storage of inventory
            clearedStages: JSON.stringify(Array.from(gameState.clearedStages.entries())),
            saveState: p5.controller.saveState,
        }
        localStorage.setItem(GameSave.saveDataID, JSON.stringify(encrypt(JSON.stringify(state))));
        console.log('Game saved');
    }

    static load(p5) {
        let data = localStorage.getItem(GameSave.saveDataID);
        if (data) {
            let stateObject = JSON.parse(decrypt(JSON.parse(data)));
            let gameState = p5.controller.gameState;
            gameState.state = stateObject.state;
            gameState.currentStageGroup = stateObject.currentStageGroup;
            gameState.inventory = stateObject.inventory ? Inventory.parse(stateObject.inventory, p5) : null;
            gameState.clearedStages = new Map(JSON.parse(stateObject.clearedStages));
            gameState.currentStage = stateObject.currentStage ? PlayBoard.loadGame(p5, gameState, stateObject.currentStage) : null;

            p5.controller.menus[stateCode.PLAY] = gameState.currentStage;
            p5.controller.saveState = stateObject.saveState;
            p5.controller.gameState = gameState;

            if (gameState.state === stateCode.STANDBY) p5.controller.menus[stateCode.STANDBY].setup(p5);
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

