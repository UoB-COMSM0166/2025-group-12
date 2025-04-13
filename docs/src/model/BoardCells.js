class BoardModel {
    static setup(bundle) {
    }

    constructor(size) {
        this.size = size;
        // initially the array is empty since we have to
        // manually set terrain for every cell
        this.boardObjects = Array.from({length: this.size},
            () => Array.from({length: this.size}, () => null));
    }
}

class BoardRenderer {
    static setup(bundle) {
        /** @type {typeof myUtil} */
        BoardRenderer.utilityClass = bundle.utilityClass;
        BoardRenderer.terrainTypes = bundle.terrainTypes;
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     */
    static draw(p5, playBoard) {
        // keep the order of these renderers:
        // terrain - lowest layer
        // volcano layer
        // plants - highest layer
        BoardRenderer.drawTerrain(p5, playBoard, playBoard.boardObjects);
        BoardRenderer.drawVolcanoLayer(p5, playBoard, playBoard.boardObjects);
        BoardRenderer.drawPlants(p5, playBoard, playBoard.boardObjects);
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {BoardModel} board
     */
    static drawTerrain(p5, playBoard, board) {
        for (let i = 0; i < board.size; i++) {
            for (let j = 0; j < board.size; j++) {
                CellRenderer.drawTerrain(p5, playBoard, BoardLogic.getCell(i, j, board));

            }
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {BoardModel} board
     */
    static drawVolcanoLayer(p5, playBoard, board) {
        if (BoardLogic.getCell(2, 2, board).terrain.terrainType === BoardRenderer.terrainTypes.VOLCANO) {
            let [x1, y1] = BoardRenderer.utilityClass.cellIndex2Pos(p5, playBoard, 2, 2, p5.CORNERS);
            p5.image(p5.images.get("VolcanoLayer"), x1 - playBoard.cellWidth * 3 / 2, y1 - playBoard.cellHeight * 3 + playBoard.cellHeight / 2 + 1, playBoard.cellWidth * 3, playBoard.cellHeight * 3);
        }
    }

    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param {BoardModel} board
     */
    static drawPlants(p5, playBoard, board) {
        for (let i = 0; i < board.size; i++) {
            for (let j = 0; j < board.size; j++) {
                CellRenderer.drawPlants(p5, playBoard, BoardLogic.getCell(i, j, board));
            }
        }
    }

    // return a descriptive string
    /**
     *
     * @param i
     * @param j
     * @param {BoardModel} board
     */
    static getCellString(i, j, board) {
        if (BoardLogic.getCell(i, j, board) === null) {
            return `cell at (${i},${j}) is null!`
        }

        let t = BoardLogic.getCell(i, j, board).terrain;
        let p = BoardLogic.getCell(i, j, board).plant;
        let s = BoardLogic.getCell(i, j, board).seed;
        let e = BoardLogic.getCell(i, j, board).enemy;

        if (t === null) {
            return `cell at (${i},${j}) is missing terrain!`;
        }

        if (p === null && s === null && e === null) {
            return `terrain ${t.name}`;
        }

        if (e !== null) {
            return `terrain ${t.name} and has a ${e.name} of health ${e.health}.`;
        }

        if (s !== null) {
            return `terrain ${t.name} and has a ${s.name} which grows up in ${s.countdown} turns.`;
        }

        return `terrain ${t.name} and has a plant ${p.name} of health ${p.health}.`;
    }
}

class BoardLogic {
    static setup(bundle) {
        BoardLogic.itemTypes = bundle.itemTypes;
        BoardLogic.plantTypes = bundle.plantTypes;
        BoardLogic.seedTypes = bundle.seedTypes;
        BoardLogic.terrainTypes = bundle.terrainTypes;
        BoardLogic.terrainFactory = bundle.terrainFactory;
        BoardLogic.baseType = bundle.baseType;
        /** @type {typeof UnionFind} */
        BoardLogic.UnionFind = bundle.UnionFind;
        /** @type {typeof PlantLogic} */
        BoardLogic.PlantLogic = bundle.PlantLogic;
    }

    /**
     *
     * @param i
     * @param j
     * @param {BoardModel} board
     * @return {CellModel}
     */
    static getCell(i, j, board) {
        if (i < 0 || i >= board.size || j < 0 || j >= board.size) {
            return null;
        }
        return board.boardObjects[i][j];
    }

    /**
     *
     * @param i
     * @param j
     * @param terrain
     * @param {BoardModel} board
     */
    // to set terrain, invoke this function
    static setCell(i, j, terrain, board) {
        board.boardObjects[i][j] = new CellModel(i, j, terrain);
    }

    // plant on a cell
    /**
     *
     * @param p5
     * @param {PlayBoardLike} playBoard
     * @param i
     * @param j
     * @param item
     */
    static plantCell(p5, playBoard, i, j, item) {
        let cell = BoardLogic.getCell(i, j, playBoard.boardObjects);

        if (item.type !== BoardLogic.itemTypes.PLANT && item.type !== BoardLogic.itemTypes.SEED) {
            console.error("plantCell received invalid input.");
            return false;
        }

        if (!CellLogic.isCompatible(playBoard, item, cell)) {
            return false;
        }

        // the implementation of ecosystem skill: grow faster
        if (item.type === BoardLogic.itemTypes.SEED) {
            cell.seed = item;
            if (cell.ecosystem !== null && cell.ecosystem.growFaster) {
                cell.seed.countdown = cell.seed.countdown - 1 < 1 ? 1 : cell.seed.countdown - 1;
            }
            if (cell.terrain.terrainType === BoardLogic.terrainTypes.LAVA) {
                cell.seed.countdown = 1;
            }

            return true;
        }

        cell.plant = item;

        // reconstruct ecosystem for every transplanting
        BoardLogic.setEcosystem(playBoard.boardObjects);

        // plums dissolve snowfield
        if (item.plantType === BoardLogic.plantTypes.PLUM) {
            for (let nCell of BoardLogic.getNearbyCells(cell.i, cell.j, BoardLogic.PlantLogic.plumRange, playBoard.boardObjects)) {
                if (nCell.terrain.terrainType === BoardLogic.terrainTypes.SNOWFIELD) {
                    nCell.terrain = BoardLogic.terrainFactory.get(BoardLogic.terrainTypes.STEPPE)();
                }
            }
        }
        return true;
    }

    /**
     *
     * @param i
     * @param j
     * @param {BoardModel} board
     */
    static removePlant(i, j, board) {
        BoardLogic.getCell(i, j, board).removePlant();
        BoardLogic.setEcosystem(board);
    }

    /**
     *
     * @param {BoardModel} board
     * @return {Array<CellModel>}
     */
    static getAllCellsWithPlant(board) {
        let cells = [];
        for (let i = 0; i < board.size; i++) {
            for (let j = 0; j < board.size; j++) {
                if (BoardLogic.getCell(i, j, board).plant !== null) {
                    cells.push(BoardLogic.getCell(i, j, board));
                }
            }
        }
        return cells;
    }

    /**
     *
     * @param {BoardModel} board
     * @return {Array<CellModel>}
     */
    static getAllCellsWithSeed(board) {
        let cells = [];
        for (let i = 0; i < board.size; i++) {
            for (let j = 0; j < board.size; j++) {
                if (BoardLogic.getCell(i, j, board).seed !== null) {
                    cells.push(BoardLogic.getCell(i, j, board));
                }
            }
        }
        return cells;
    }

    /**
     *
     * @param {BoardModel} board
     * @return {Array<CellModel>}
     */
    static getAllCellsWithEnemy(board) {
        let cells = [];
        for (let i = 0; i < board.size; i++) {
            for (let j = 0; j < board.size; j++) {
                if (BoardLogic.getCell(i, j, board).enemy !== null) {
                    cells.push(BoardLogic.getCell(i, j, board));
                }
            }
        }
        return cells;
    }

    /**
     *
     * @param i
     * @param j
     * @param {BoardModel} board
     * @return {Array<CellModel>}
     */
    static getAdjacent8Cells(i, j, board) {
        let cells = [];
        for (let k = -1; k <= 1; k++) {
            for (let l = -1; l <= 1; l++) {
                if (k === 0 && l === 0) {
                    continue;
                }
                if (0 <= i + k && i + k < board.size && 0 <= j + l && j + l < board.size) {
                    cells.push(BoardLogic.getCell(i + k, j + l, board));
                }
            }
        }
        return cells;
    }

    /**
     *
     * @param i
     * @param j
     * @param {BoardModel} board
     * @return {Array<CellModel>}
     */
    static getAdjacent4Cells(i, j, board) {
        let cells = [];
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (let [k, l] of directions) {
            if (0 <= i + k && i + k < board.size && 0 <= j + l && j + l < board.size) {
                cells.push(BoardLogic.getCell(i + k, j + l, board));
            }
        }
        return cells;
    }

    /**
     *
     * @param i
     * @param j
     * @param {function} range
     * @param {BoardModel} board
     * @return {Array<CellModel>}
     */
    static getNearbyCells(i, j, range, board) {
        let cells = [];
        for (let k = 0; k < board.size; k++) {
            for (let l = 0; l < board.size; l++) {
                if (range(i, j, k, l)) {
                    cells.push(BoardLogic.getCell(k, l, board));
                }
            }
        }
        return cells;
    }

    /**
     *
     * @param {BoardModel} board
     */
    static setEcosystem(board) {
        let allPlants = BoardLogic.getAllCellsWithPlant(board);
        let uf = new BoardLogic.UnionFind(allPlants.length);

        let cellIndexMap = new Map(); // the variables of UF data structure are integers
        allPlants.forEach((c, index) => cellIndexMap.set(c, index));

        // step1: construct UF. if one plant is in adjacent 8 of another, they are connected.
        for (let i = 0; i < allPlants.length; i++) {
            for (let j = i + 1; j < allPlants.length; j++) {
                let cell1 = allPlants[i];
                let cell2 = allPlants[j];
                if (Math.abs(cell1.i - cell2.j) <= 1 && Math.abs(cell1.i - cell2.j) <= 1) {
                    uf.union(i, j);
                }
            }
        }

        // step2: get all connected components.
        let connectedComponents = new Map(); // <RootID, componentArray>
        for (let i = 0; i < allPlants.length; i++) {
            let root = uf.find(i);
            if (connectedComponents.has(root)) continue;
            connectedComponents.set(root, uf.getComponent(i).map(index => allPlants[index]));
        }

        // step3: Determine which components qualify for an ecosystem
        let ecosystemQualification = new Map();

        for (let [root, component] of connectedComponents.entries()) {

            // 1. loop through all plants
            for (let /** @type {CellModel} */ cell of component) {
                let plantTypesSet = new Set();
                plantTypesSet.add(BoardLogic.baseType(cell.plant));
                // 2. loop through 4 adjacent cells
                for (let adCell of BoardLogic.getAdjacent4Cells(cell.i, cell.j, board)) {
                    if (adCell.plant === null) continue;
                    plantTypesSet.add(BoardLogic.baseType(adCell.plant));
                    // 3. further loop through 4 adjacent cells
                    for (let adAdCell of BoardLogic.getAdjacent4Cells(adCell.i, adCell.j, board)) {
                        if (adAdCell.plant === null) continue;
                        plantTypesSet.add(BoardLogic.baseType(adAdCell.plant));
                    }
                }
                // If 3 different plant types exist, mark as ecosystem
                if (plantTypesSet.size >= 3) {
                    ecosystemQualification.set(root, true);
                    break;
                }
            }
        }

        // step4: create and assign ecosystem.
        for (let [root, component] of connectedComponents.entries()) {
            if (!ecosystemQualification.get(root)) continue;

            let ecosystem = BoardLogic.createEcosystem(component);
            for (let /** @type {CellModel} */ cell of component) {
                cell.ecosystem = ecosystem;
                for (let adCell of BoardLogic.getAdjacent8Cells(cell.i, cell.j, board)) {
                    // tiebreaker: when two ecosystems are overlapped but not connected
                    if (adCell.ecosystem !== null && adCell.ecosystem !== ecosystem && adCell.ecosystem.countPlants >= ecosystem.countPlants) {
                        continue;
                    }
                    adCell.ecosystem = ecosystem;
                }
            }
        }
    }

    static createEcosystem(component) {
        let ecosystem = new Ecosystem(component.length);

        // Assign special abilities
        for (let cell of component) {
            if (cell.plant.plantType === BoardLogic.plantTypes.FIRE_HERB && component.length >= 10) {
                ecosystem.rejectLava = true;
                ecosystem.withstandSnow = true;
            }
        }
        return ecosystem;
    }
}

class BoardSerializer {
    static setup(bundle) {
    }

    /**
     *
     * @param {BoardModel} board
     */
    static stringify(board) {
        const object = {
            size: board.size,
            boardObjects: Array.from({length: board.size},
                () => Array.from({length: board.size}, () => null))
        }
        for (let i = 0; i < object.boardObjects.length; i++) {
            for (let j = 0; j < object.boardObjects[i].length; j++) {
                object.boardObjects[i][j] = CellSerializer.stringify(BoardLogic.getCell(i, j, board));
            }
        }
        return JSON.stringify(object);
    }

    static parse(json, p5) {
        const object = JSON.parse(json);
        let board = new BoardModel(object.size);
        for (let i = 0; i < object.size; i++) {
            for (let j = 0; j < object.size; j++) {
                board.boardObjects[i][j] = CellSerializer.parse(object.boardObjects[i][j], i, j, p5);
            }
        }
        return board;
    }
}

class CellModel {
    static setup(bundle) {
        CellModel.itemTypes = bundle.itemTypes;
    }

    // constructor only involves terrain since
    // we will manually set terrain for all stages
    // but the right to plant is handed over to player.
    constructor(i, j, terrain) {
        /** @type {number} */
        this.i = i;
        /** @type {number} */
        this.j = j;
        this._terrain = null;
        this.terrain = terrain;
        this._plant = null;
        this._seed = null;
        this._enemy = null;
        /** @type {Ecosystem} */
        this._ecosystem = null;
    }

    set terrain(terrain) {
        if (terrain.type !== CellModel.itemTypes.TERRAIN) {
            console.error(`failed to set cell at (${this.i},${this.j}) since the input is not terrain.`);
            return;
        }
        this._terrain = terrain;
    }

    get terrain() {
        return this._terrain;
    }

    // to remove a plant from a cell, use removePlant below.
    set plant(plant) {
        if (plant.type !== CellModel.itemTypes.PLANT) {
            console.error(`failed to set cell at (${this.i},${this.j}) since the input is not plant.`);
            return;
        }
        this._plant = plant;
    }

    get plant() {
        return this._plant;
    }

    removePlant() {
        this._plant = null;
    }

    set seed(seed) {
        if (seed.type !== CellModel.itemTypes.SEED) {
            console.error(`failed to set cell at (${this.i},${this.j}) since the input is not seed.`);
            return;
        }
        this._seed = seed;
    }

    get seed() {
        return this._seed;
    }

    removeSeed() {
        this._seed = null;
    }

    set enemy(enemy) {
        this._enemy = enemy;
    }

    get enemy() {
        return this._enemy;
    }

    set ecosystem(ecosystem) {
        if (!(ecosystem instanceof Ecosystem)) {
            console.error(`failed to set cell at (${this.i},${this.j}) since the input is not ecosystem.`);
            return;
        }
        this._ecosystem = ecosystem;
    }

    get ecosystem() {
        return this._ecosystem;
    }
}

class CellRenderer {
    static setup(bundle) {
        CellRenderer.utilityClass = bundle.utilityClass;
    }

    /**
     *
     * @param p5
     * @param playBoard
     * @param {CellModel} cell
     */
    static drawTerrain(p5, playBoard, cell) {
        let [x1, y1, x2, y2, x3, y3, x4, y4] = CellRenderer.utilityClass.cellIndex2Pos(p5, playBoard, cell.i, cell.j, p5.CORNERS);
        p5.image(cell.terrain.img, x1 - playBoard.cellWidth / 2, y1, playBoard.cellWidth, playBoard.cellHeight);

        if (cell.ecosystem !== null && playBoard.ecoDisplay) {
            p5.fill('rgba(0%, 0%, 100%, 0.5)');
        } else {
            p5.fill(0, 0, 0, 0);
        }
        p5.stroke(0);
        p5.strokeWeight(2);
        p5.quad(x1, y1, x2, y2, x3, y3, x4, y4);
    }

    /**
     *
     * @param p5
     * @param playBoard
     * @param {CellModel} cell
     */
    static drawPlants(p5, playBoard, cell) {
        if (cell.plant !== null) {
            let [avgX, avgY] = CellRenderer.utilityClass.cellIndex2Pos(p5, playBoard, cell.i, cell.j, p5.CENTER);
            let imgSize = CellRenderer.utilityClass.relative2absolute(1 / 32, 0)[0];
            p5.image(cell.plant.img, avgX - imgSize / 2, avgY - 3 * imgSize / 4, imgSize, imgSize);
            CellRenderer.utilityClass.drawHealthBar(p5, cell.plant, avgX - 21, avgY - 42, 40, 5);
        }
        if (cell.seed !== null) {
            let [avgX, avgY] = CellRenderer.utilityClass.cellIndex2Pos(p5, playBoard, cell.i, cell.j, p5.CENTER);
            let imgSize = CellRenderer.utilityClass.relative2absolute(1 / 32, 0)[0];
            p5.image(cell.seed.img, avgX - imgSize / 2, avgY - 3 * imgSize / 4, imgSize, imgSize);
        }
    }

    /**
     *
     * @param playBoardStageGroup
     * @param {CellModel} cell
     */
    static getEcoString(playBoardStageGroup, cell) {
        if (cell.ecosystem === null) {
            return "The cell is not in an ecosystem.";
        }
        return cell.ecosystem.getEcoString(playBoardStageGroup);
    }
}

class CellLogic {
    static setup(bundle) {
        CellLogic.FloatingWindow = bundle.FloatingWindow;
        CellLogic.itemTypes = bundle.itemTypes;
        CellLogic.plantTypes = bundle.plantTypes;
        CellLogic.seedTypes = bundle.seedTypes;
        CellLogic.terrainTypes = bundle.terrainTypes;
    }

    // check if plant or seed is compatible with the terrain, or if the cell is occupied by another plant.
    /**
     *
     * @param playBoard
     * @param item
     * @param {CellModel} cell
     * @returns {boolean}
     */
    static isCompatible(playBoard, item, cell) {
        if (cell.enemy !== null) {
            playBoard.floatingWindow = CellLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("010"));
            return false;
        }

        if (cell.seed !== null || cell.plant !== null) {
            playBoard.floatingWindow = CellLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("011"));
            return false;
        }

        // bamboo
        if (item?.plantType === CellLogic.plantTypes.BAMBOO) {
            if (cell.terrain.terrainType === CellLogic.terrainTypes.STEPPE || cell.terrain.terrainType === CellLogic.terrainTypes.HILL || cell.terrain.terrainType === CellLogic.terrainTypes.LANDSLIDE) {
                return true;
            } else {
                playBoard.floatingWindow = CellLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("012"));
                return false;
            }
        }

        // plum
        if (item?.plantType === CellLogic.plantTypes.PLUM) {
            if (cell.terrain.terrainType === CellLogic.terrainTypes.STEPPE || cell.terrain.terrainType === CellLogic.terrainTypes.HILL || cell.terrain.terrainType === CellLogic.terrainTypes.SNOWFIELD) {
                return true;
            } else {
                playBoard.floatingWindow = CellLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("012"));
                return false;
            }
        }

        // other plants
        if (cell.terrain.terrainType === CellLogic.terrainTypes.MOUNTAIN || cell.terrain.terrainType === CellLogic.terrainTypes.BASE
            || cell.terrain.terrainType === CellLogic.terrainTypes.LUMBERING || cell.terrain.terrainType === CellLogic.terrainTypes.VOLCANO
            || (cell.terrain.terrainType === CellLogic.terrainTypes.LAVA && cell.terrain.name === "Lava")
            || cell.terrain.terrainType === CellLogic.terrainTypes.LANDSLIDE || cell.terrain.terrainType === CellLogic.terrainTypes.SNOWFIELD) {
            playBoard.floatingWindow = CellLogic.FloatingWindow.copyOf(playBoard.allFloatingWindows.get("012"));
            return false;
        }
        return true;
    }

}

class CellSerializer {
    static setup(bundle) {
        /** @type {typeof PlantSerializer} */
        CellSerializer.PlantSerializer = bundle.PlantSerializer;
        /** @type {typeof SeedSerializer} */
        CellSerializer.SeedSerializer = bundle.SeedSerializer;
        /** @type {typeof TerrainSerializer} */
        CellSerializer.TerrainSerializer = bundle.TerrainSerializer;
        /** @type {typeof MovableSerializer} */
        CellSerializer.MovableSerializer = bundle.MovableSerializer;

        CellSerializer.terrainTypes = bundle.terrainTypes;

        CellSerializer.plantFactory = bundle.plantFactory;
        CellSerializer.terrainFactory = bundle.terrainFactory;
    }

    /**
     *
     * @param {CellModel} cell
     */
    static stringify(cell) {
        let object = {
            terrain: null,
            plant: null,
            seed: null,
            enemy: null,
        }
        if (cell.plant) {
            object.plant = CellSerializer.PlantSerializer.stringify(cell.plant);
        }
        if (cell.seed) {
            object.seed = CellSerializer.SeedSerializer.stringify(cell.seed);
        }
        if (cell.terrain) {
            object.terrain = CellSerializer.TerrainSerializer.stringify(cell.terrain);
        }
        if (cell.enemy) {
            object.enemy = CellSerializer.MovableSerializer.stringify(cell.enemy);
        }
        return JSON.stringify(object);
    }

    static parse(json, i, j, p5) {
        let object = JSON.parse(json);
        let plant, terrain, seed;
        if (object.plant) {
            plant = JSON.parse(object.plant);
            plant = CellSerializer.PlantSerializer.parse(object.plant, p5, CellSerializer.plantFactory.get(plant.name)());
        }
        if (object.seed) {
            seed = JSON.parse(object.seed);
            seed = CellSerializer.SeedSerializer.parse(object.seed, p5, CellSerializer.plantFactory.get(seed.name)());
        }
        if (object.terrain) {
            terrain = JSON.parse(object.terrain);
            terrain = CellSerializer.TerrainSerializer.parse(object.terrain, p5, CellSerializer.terrainFactory.get(terrain.name)(), CellSerializer.plantFactory, CellSerializer.terrainTypes);
        }
        let cell = new CellModel(i, j, terrain);
        if (plant) cell.plant = plant;
        if (seed) cell.seed = seed;
        return cell;
    }
}

class Ecosystem {
    static setup(bundle) {
        Ecosystem.stageGroup = bundle.stageGroup;
    }

    constructor(countPlants) {
        this.countPlants = countPlants;
        this.growFaster = true;
        this.rejectLava = false;
        this.strengthenOrchid = false;
        this.withstandSnow = false;
    }

    getEcoString(playBoardStageGroup) {
        let str = "";
        // str += `${this.countPlants} plants in this ecosystem. `;
        if (this.growFaster) {
            str += "Seeds sowed here will grow faster. "
        }
        if (this.rejectLava && (playBoardStageGroup === Ecosystem.stageGroup.VOLCANO || playBoardStageGroup === Ecosystem.stageGroup.TSUNAMI)) {
            str += "Lava expanded here will stop. "
        }
        if (this.strengthenOrchid) {
            str += "Orchid deals more damage to bandits. "
        }
        if (this.withstandSnow && (playBoardStageGroup === Ecosystem.stageGroup.VOLCANO || playBoardStageGroup === Ecosystem.stageGroup.TSUNAMI)) {
            str += "Withstand blizzard. "
        }
        return str;
    }
}

export {BoardModel, BoardRenderer, BoardLogic, BoardSerializer, CellModel, CellLogic, CellRenderer, CellSerializer};

if (typeof module !== 'undefined') {
    module.exports = {
        BoardModel,
        BoardRenderer,
        BoardLogic,
        BoardSerializer,
        CellModel,
        CellLogic,
        CellRenderer,
        CellSerializer
    };
}