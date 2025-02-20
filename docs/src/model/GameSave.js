import {stageCode, stateCode} from "./GameState.js";

export class GameSave {
    static save(gameState) {
        const saveData = {
            stageCleared: [false, false, false, false, false],
            locked: [false, true, true, true, true],
            state: gameState.state,
            currentStage: gameState.currentStageCode,
            turn: gameState.currentStage.turn,
            inventory: Array.from(gameState.inventory.saveInventory()),
            board: null,
        };
        if(gameState.currentStage.boardObjects){
            saveData.board = gameState.currentStage.boardObjects.saveBoard();
        }
        localStorage.setItem("PnP", JSON.stringify(saveData));
        console.log('Game saved', saveData);

    }

    static load(gameState) {
        let data = localStorage.getItem("PnP");
        if (data) {
            let loadData = JSON.parse(data);
            /* first set loaded to true, load basic accordingly, then load saved data
               set gameState.loaded back to false;
             */
            gameState.loaded = true;
            gameState.setState(loadData.state);
            gameState.currentStageCode = loadData.currentStage;

            // currentStage has changed, but update is in next draw(), code followed needs to wait until it's done
            setTimeout(() => {
                let inventoryMap = new Map(loadData.inventory);
                gameState.inventory.loadInventory(inventoryMap);
                console.log('gameState CurrentBoard' + gameState.currentBoard);
                gameState.currentStage.boardObjects.loadBoard(loadData.board, gameState);
                gameState.currentStage.turn = loadData.turn;
                gameState.currentStage.buttons.find(button => button.text.startsWith("turn")).text = gameState.currentStage.getTurnButtonText();
                console.log('Game load');
            }, 50);
            gameState.loaded = false;

        } else {
            console.log('Save data not found!');
        }
    }

    static getData() {
        return JSON.parse(localStorage.getItem("PnP"));
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
    let timestamp = Date.now();
    let keySize = 4;
    let key = generateKey(timestamp, keySize);
    let inputBytes = new TextEncoder().encode(input);
    let encrypted = new Uint8Array(inputBytes.length);
    for (let i = 0; i < inputBytes.length; i++) {
        encrypted[i] = inputBytes[i] ^ key[i % key.length];
    }
    let result = new Uint8Array(key.length + encrypted.length);
    result.set(key, 0);
    result.set(encrypted, key.length);

    return result;
}

function decrypt(encryptedData) {
    let keySize = 4;
    let key = encryptedData.slice(0, keySize);
    let encryptedText = encryptedData.slice(keySize);
    let decrypted = new Uint8Array(encryptedText.length);
    for (let i = 0; i < encryptedText.length; i++) {
        decrypted[i] = encryptedText[i] ^ key[i % key.length];
    }

    return new TextDecoder().decode(decrypted);
}
