import {DijkstraSP} from "../../lib/GraphSP.js";
import {IndexPriorityQueue} from "../../lib/PriorityQueue.js";
import {UnionFind} from "../../lib/UnionFind.js";
import {myUtil} from "../../lib/myUtil.js";

import {Controller} from "./Controller.js";
import {Renderer} from "./Renderer.js";
import {InputHandler} from "./InputHandler.js";

import {CanvasSize} from "../CanvasSize.js";
import {FloatingWindow} from "../model/FloatingWindow.js";

import {assertInterface} from "../../lib/assertInterface.js";

import {PlantModel, PlantLogic, PlantRenderer, PlantSerializer} from "../items/Plant.js";
import {SeedModel, SeedLogic, SeedRenderer, SeedSerializer} from "../items/Seed.js";
import {TreeModel, TreeLogic, TreeRenderer} from "../items/Tree.js";
import {TreeSeedModel, TreeSeedLogic, TreeSeedRenderer} from "../items/Tree.js";
import {BushModel, BushLogic, BushRenderer} from "../items/Bush.js";
import {BushSeedModel, BushSeedLogic, BushSeedRenderer} from "../items/Bush.js";
import {OrchidModel, OrchidLogic, OrchidRenderer} from "../items/Orchid.js";
import {OrchidSeedModel, OrchidSeedLogic, OrchidSeedRenderer} from "../items/Orchid.js";
import {FireHerbModel, FireHerbLogic, FireHerbRenderer} from "../items/FireHerb.js";
import {FireHerbSeedModel, FireHerbSeedLogic, FireHerbSeedRenderer} from "../items/FireHerb.js";
import {BambooModel, BambooRenderer, BambooLogic} from "../items/Bamboo.js";
import {BambooSeedModel, BambooSeedRenderer, BambooSeedLogic} from "../items/Bamboo.js";
import {PlumModel, PlumLogic, PlumRenderer} from "../items/Plum.js";
import {PlumSeedModel, PlumSeedLogic, PlumSeedRenderer} from "../items/Plum.js";
import {KikuModel, KikuLogic, KikuRenderer} from "../items/Kiku.js";
import {KikuSeedModel, KikuSeedLogic, KikuSeedRenderer} from "../items/Kiku.js";
import {PalmModel, PalmLogic, PalmRenderer} from "../items/Palm.js";
import {PalmSeedModel, PalmSeedLogic, PalmSeedRenderer} from "../items/Palm.js";

import {TerrainModel, TerrainLogic, TerrainRenderer, TerrainSerializer} from "../items/Terrain.js";
import {PlayerBaseModel, PlayerBaseLogic, PlayerBaseRenderer} from "../items/PlayerBase.js";
import {MountainModel, MountainLogic, MountainRenderer} from "../items/Mountain.js";
import {SteppeModel, SteppeLogic, SteppeRenderer} from "../items/Steppe.js";
import {LumberingModel, LumberingLogic, LumberingRenderer} from "../items/Lumbering.js";
import {VolcanoModel, VolcanoLogic, VolcanoRenderer} from "../items/Volcano.js";
import {LavaModel, LavaLogic, LavaRenderer} from "../items/Lava.js";
import {HillModel, HillLogic, HillRenderer} from "../items/Hill.js";
import {LandslideModel, LandslideLogic, LandslideRenderer} from "../items/Landslide.js";
import {SnowfieldModel, SnowfieldLogic, SnowfieldRenderer} from "../items/Snowfield.js";
import {SeaModel, SeaLogic, SeaRenderer} from "../items/Sea.js";

import {itemTypes, plantTypes, seedTypes, terrainTypes, movableTypes, baseType} from "../items/ItemTypes.js";

import {InteractionLogic} from "../items/InteractionLogic.js";
import {MovableModel, MovableLogic, MovableRenderer, MovableSerializer} from "../items/Movable.js";
import {EarthquakeModel, EarthquakeLogic, EarthquakeRenderer} from "../items/Earthquake.js";
import {SlideModel, SlideLogic, SlideRenderer} from "../items/SlideAnimation.js";


import {Tornado1PlayBoard} from "../model/stages/Tor1.js";
import {Tornado2PlayBoard} from "../model/stages/Tor2.js";
import {Tornado3PlayBoard} from "../model/stages/Tor3.js";
import {Tornado4PlayBoard} from "../model/stages/Tor4.js";
import {Tornado5PlayBoard} from "../model/stages/Tor5.js";
import {Volcano1PlayBoard} from "../model/stages/Vol1.js";
import {Earthquake1PlayBoard} from "../model/stages/Ear1.js";
import {Blizzard1PlayBoard} from "../model/stages/Bli1.js";
import {Tsunami1PlayBoard} from "../model/stages/Tsu1.js";

import {GameSerializer} from "../model/GameSerializer.js";
import {MenuItem} from "../items/MenuItem.js";
import {MapButton} from "../items/MapButton.js";
import {Button} from "../items/Button.js";
import {InventoryModel, InventoryLogic, InventoryRenderer, InventorySerializer} from "../model/Inventory.js";
import {GameState, stageGroup, stateCode} from "../model/GameState.js";

import {ScreenModel, ScreenLogic, ScreenRenderer} from "../model/Screen.js";
import {StartMenuModel, StartMenuLogic, StartMenuRenderer} from "../model/StartMenu.js";
import {GameMapModel, GameMapLogic, GameMapRenderer} from "../model/GameMap.js";
import {InfoBoxModel, InfoBoxLogic, InfoBoxRenderer} from "../model/InfoBox.js";
import {PauseMenuModel, PauseMenuLogic, PauseMenuRenderer} from "../model/PauseMenu.js";
import {CellModel, CellLogic, CellRenderer, CellSerializer} from "../model/BoardCells.js";
import {BoardModel, BoardLogic, BoardRenderer, BoardSerializer} from "../model/BoardCells.js";
import {PlayBoardModel, PlayBoardLogic, PlayBoardRenderer, PlayBoardSerializer} from "../model/PlayBoard.js";
import {loadImages} from "../Preloader.js";


// to achieve loosely coupling we use lazy dependency injection
export class Container {
    constructor(p5) {

        // ----------------------
        /* importing utilities */
        // ----------------------

        this.CanvasSize = CanvasSize; // no setup
        this.FloatingWindow = FloatingWindow; // no setup

        this.utilityClass = myUtil;
        this.utilityClass.setup({CanvasSize: this.CanvasSize, FloatingWindow: this.FloatingWindow});

        this.IPQ = IndexPriorityQueue; // no setup

        this.UnionFind = UnionFind; // no setup

        this.DijkstraAlgorithm = DijkstraSP;
        this.DijkstraAlgorithm.setup(this.IPQ);

        // -----------------------------------
        /* importing game entities - plants */
        // -----------------------------------

        let entityBundle = {
            utilityClass: this.utilityClass,
            itemTypes: itemTypes,
            plantTypes: plantTypes,
            seedTypes: seedTypes,
            terrainTypes: terrainTypes,
            movableTypes: movableTypes,
            baseType: baseType,
            PlantModel: PlantModel,
            SeedModel: SeedModel,
            InteractionLogic: InteractionLogic,
        };

        this.plantModules = [
            entityObject("Tree", TreeModel, TreeLogic, TreeRenderer, null),
            entityObject("Bush", BushModel, BushLogic, BushRenderer, null),
            entityObject("Orchid", OrchidModel, OrchidLogic, OrchidRenderer, null),
            entityObject("FireHerb", FireHerbModel, FireHerbLogic, FireHerbRenderer, null),
            entityObject("Bamboo", BambooModel, BambooLogic, BambooRenderer, null),
            entityObject("Plum", PlumModel, PlumLogic, PlumRenderer, null),
            entityObject("Kiku", KikuModel, KikuLogic, KikuRenderer, null),
            entityObject("Palm", PalmModel, PalmLogic, PalmRenderer, null),
        ];

        // injection and check implementation
        for (let plantModule of this.plantModules) {
            let {model, logic, renderer} = plantModule;

            if (model.setup) model.setup(entityBundle);
            if (logic.setup) logic.setup(entityBundle);
            if (renderer.setup) renderer.setup(entityBundle);

            // check implementation and inheritance of methods
            PlantLogic.assertImplementation(assertInterface, logic);
            PlantRenderer.assertImplementation(assertInterface, renderer);
        }

        // could use name as the key, it will not be slow since it is a hash map.
        // using plantTypes requires importing it - extra effort
        this.plantFactory = new Map([
            ["Tree", () => new TreeModel(p5, PlantModel, itemTypes, plantTypes)],
            ["Bush", () => new BushModel(p5, PlantModel, itemTypes, plantTypes)],
            ["Orchid", () => new OrchidModel(p5, PlantModel, itemTypes, plantTypes)],
            ["FireHerb", () => new FireHerbModel(p5, PlantModel, itemTypes, plantTypes)],
            ["Bamboo", () => new BambooModel(p5, PlantModel, itemTypes, plantTypes)],
            ["Plum", () => new PlumModel(p5, PlantModel, itemTypes, plantTypes)],
            ["Kiku", () => new KikuModel(p5, PlantModel, itemTypes, plantTypes)],
            ["Palm", () => new PalmModel(p5, PlantModel, itemTypes, plantTypes)],
            ["TreeSeed", () => new TreeSeedModel(p5, SeedModel, itemTypes, seedTypes)],
            ["BushSeed", () => new BushSeedModel(p5, SeedModel, itemTypes, seedTypes)],
            ["OrchidSeed", () => new OrchidSeedModel(p5, SeedModel, itemTypes, seedTypes)],
            ["FireHerbSeed", () => new FireHerbSeedModel(p5, SeedModel, itemTypes, seedTypes)],
            ["BambooSeed", () => new BambooSeedModel(p5, SeedModel, itemTypes, seedTypes)],
            ["PlumSeed", () => new PlumSeedModel(p5, SeedModel, itemTypes, seedTypes)],
            ["KikuSeed", () => new KikuSeedModel(p5, SeedModel, itemTypes, seedTypes)],
            ["PalmSeed", () => new PalmSeedModel(p5, SeedModel, itemTypes, seedTypes)],
        ]);

        // ----------------------------------
        /* importing game entities - seeds */
        // ----------------------------------

        this.seedModules = [
            entityObject("Tree", TreeSeedModel, TreeSeedLogic, TreeSeedRenderer, null),
            entityObject("Bush", BushSeedModel, BushSeedLogic, BushSeedRenderer, null),
            entityObject("Orchid", OrchidSeedModel, OrchidSeedLogic, OrchidSeedRenderer, null),
            entityObject("FireHerb", FireHerbSeedModel, FireHerbSeedLogic, FireHerbSeedRenderer, null),
            entityObject("Bamboo", BambooSeedModel, BambooSeedLogic, BambooSeedRenderer, null),
            entityObject("Plum", PlumSeedModel, PlumSeedLogic, PlumSeedRenderer, null),
            entityObject("Kiku", KikuSeedModel, KikuSeedLogic, KikuSeedRenderer, null),
            entityObject("Palm", PalmSeedModel, PalmSeedLogic, PalmSeedRenderer, null),
        ];

        // set seed common methods
        for (let seedModule of this.seedModules) {
            let {name, logic, renderer} = seedModule;
            // assign seed logics
            logic.grow = (p5, seedInstance) => SeedLogic.grow(p5, seedInstance, this.plantFactory.get(name)());

            // check implementation and inheritance of methods
            SeedLogic.assertImplementation(assertInterface, logic);
            SeedRenderer.assertImplementation(assertInterface, renderer);
        }

        // ------------------------------------
        /* importing game entities - terrain */
        // ------------------------------------

        this.terrainFactory = new Map([
            ["PlayerBase", () => new PlayerBaseModel(p5, TerrainModel, itemTypes, terrainTypes)],
            ["Mountain", () => new MountainModel(p5, TerrainModel, itemTypes, terrainTypes)],
            ["Steppe", () => new SteppeModel(p5, TerrainModel, itemTypes, terrainTypes)],
            ["Lumbering", () => new LumberingModel(p5, TerrainModel, itemTypes, terrainTypes)],
            ["Volcano", () => new VolcanoModel(p5, TerrainModel, itemTypes, terrainTypes)],
            ["Lava", () => new LavaModel(p5, TerrainModel, itemTypes, terrainTypes)],
            ["Hill", () => new HillModel(p5, TerrainModel, itemTypes, terrainTypes)],
            ["Landslide", () => new LandslideModel(p5, TerrainModel, itemTypes, terrainTypes)],
            ["Snowfield", () => new SnowfieldModel(p5, TerrainModel, itemTypes, terrainTypes)],
            ["Sea", () => new SeaModel(p5, TerrainModel, itemTypes, terrainTypes)],
        ])

        let terrainModules = [
            entityObject("PlayerBase", PlayerBaseModel, PlayerBaseLogic, PlayerBaseRenderer, null),
            entityObject("Mountain", MountainModel, MountainLogic, MountainRenderer, null),
            entityObject("Steppe", SteppeModel, SteppeLogic, SteppeRenderer, null),
            entityObject("Lumbering", LumberingModel, LumberingLogic, LumberingRenderer, null),
            entityObject("Volcano", VolcanoModel, VolcanoLogic, VolcanoRenderer, null),
            entityObject("Lava", LavaModel, LavaLogic, LavaRenderer, null),
            entityObject("Hill", HillModel, HillLogic, HillRenderer, null),
            entityObject("Landslide", LandslideModel, LandslideLogic, LandslideRenderer, null),
            entityObject("Snowfield", SnowfieldModel, SnowfieldLogic, SnowfieldRenderer, null),
            entityObject("Sea", SeaModel, SeaLogic, SeaRenderer, null),
        ];

        for (let terrainModule of terrainModules) {
            let {model, logic, renderer} = terrainModule;
            if (model.setup) model.setup(entityBundle);
            if (logic.setup) logic.setup(entityBundle);
            if (renderer.setup) renderer.setup(entityBundle);

            // check implementation and inheritance of methods
            TerrainRenderer.assertImplementation(assertInterface, renderer);
            TerrainLogic.assertImplementation(assertInterface, logic);
        }

        this.interactionLogic = InteractionLogic;
        this.interactionLogic.setup({
            utilityClass: this.utilityClass,
            FloatingWindow: this.FloatingWindow,
            movableTypes: movableTypes,
            itemTypes: itemTypes,
            plantTypes: plantTypes
        });

        let movableModules = []

        this.movableFactory = new Map([
            ["Earthquake", (p5, playBoard) => EarthquakeModel.create(p5, playBoard, MovableModel)],
            ["SlideAnimation", (p5, playBoard, dest_i, dest_j) => SlideModel.create(p5, playBoard, MovableModel, dest_i, dest_j)],
        ]);

        let movableBundle = {};

        MovableSerializer.setup(movableBundle);

        // --------------------------------------
        /* importing game state and game menus */
        // --------------------------------------

        this.MenuItem = MenuItem;
        this.Button = Button;
        this.MapButton = MapButton;

        // initialize serializer
        this.gameSerializer = GameSerializer;
        this.gameSerializer.setup({
            inventoryParser: InventorySerializer.parse,
            playBoardParser: null,
            stateCode: stateCode
        });

        let menuBundle = {
            p5: p5,
            utilityClass: this.utilityClass,
            MenuItem: this.MenuItem,
            Button: this.Button,
            MapButton: this.MapButton,
            stateCode: stateCode,
            stageGroup: stageGroup,
            gameSerializer: this.gameSerializer,
            plantFactory: this.plantFactory,
            inventoryLogicLayer: InventoryLogic,
            inventoryRendererLayer: InventoryRenderer,
            inventorySerializerLayer: InventorySerializer,
            InfoBoxModel: InfoBoxModel,
        }

        ScreenLogic.setup(menuBundle);

        this.gameStageFactory = new GameStageFactory();

        // initialize inventory
        this.inventoryModel = InventoryModel;
        InventoryModel.setup(menuBundle);
        InventoryLogic.setup(entityBundle);
        InventoryRenderer.setup(menuBundle);

        this.gameState = new GameState(p5, this.gameStageFactory, new this.inventoryModel(p5));

        menuBundle.gameState = this.gameState;

        this.menuModules = [
            entityObject("StartMenu", StartMenuModel, StartMenuLogic, StartMenuRenderer, null),
            entityObject("GameMap", GameMapModel, GameMapLogic, GameMapRenderer, null),
            entityObject("PlayBoard", PlayBoardModel, PlayBoardLogic, PlayBoardRenderer, PlayBoardSerializer),
            entityObject("InfoBox", InfoBoxModel, InfoBoxLogic, InfoBoxRenderer, null),
            entityObject("PauseMenu", PauseMenuModel, PauseMenuLogic, PauseMenuRenderer, null),
        ]

        for (let menuModule of this.menuModules) {
            let {model, logic, renderer, serializer} = menuModule;
            if (model.setup) model.setup(menuBundle);

            if (logic.setup) logic.setup(menuBundle);
            logic.handleFloatingWindow = ScreenLogic.handleFloatingWindow;
            logic.handleScroll = ScreenLogic.handleScroll;

            if (renderer.setup) renderer.setup(menuBundle);
            renderer.drawFloatingWindow = (p5, screen) => ScreenRenderer.drawFloatingWindow(p5, screen, logic.setFloatingWindow);

            if (serializer && serializer.setup) serializer.setup(menuBundle);

            if (model.isScreen) {
                ScreenModel.assertImplementation(assertInterface, model);
                ScreenLogic.assertImplementation(assertInterface, logic);
                ScreenRenderer.assertImplementation(assertInterface, renderer);
            }
        }

        // create main menus
        this.startMenu = new StartMenuModel(this.gameState);
        this.startMenu.init(menuBundle);
        this.gameMap = new GameMapModel(this.gameState, stageGroup);
        this.gameMap.init(menuBundle);

        this.menus = {
            [stateCode.MENU]: this.startMenu,
            [stateCode.STANDBY]: this.gameMap,
            [stateCode.PLAY]: null
        };

        // create helper menus
        this.pauseMenu = new PauseMenuModel(this.gameState);
        this.pauseMenu.init(menuBundle);
        this.inputHandler = new InputHandler(this.gameState, stateCode);
        this.initialState = stateCode.MENU; // default

        this.controller = new Controller({
            gameState: this.gameState,
            menus: this.menus,
            stateCode: stateCode,
            pauseMenu: this.pauseMenu,
            inputHandler: this.inputHandler,
            initialState: this.initialState,
            StartMenuLogic: StartMenuLogic,
            InventoryLogic: InventoryLogic,
        });

        this.gameSerializer.save = () => this.gameSerializer.saveGame(this.controller);
        this.gameSerializer.load = () => this.gameSerializer.loadGame(p5, this.controller);

        Renderer.draw = (p5) => Renderer.render(p5, this.menus, this.gameState, this.pauseMenu);
        this.renderer = Renderer.draw; // invoke it in main loop by container.renderer(p)
        this.preloader = (p5) => p5.images = loadImages(p5);

        let playBundle = {
            UnionFind: this.UnionFind,

            PlantSerializer: PlantSerializer,
            SeedSerializer: SeedSerializer,
            TerrainSerializer: TerrainSerializer,
            MovableSerializer: MovableSerializer,

            FloatingWindow: FloatingWindow,
            itemTypes: itemTypes,
            plantTypes: plantTypes,
            seedTypes: seedTypes,
            terrainTypes: terrainTypes,
            baseType: baseType,

            plantFactory: this.plantFactory,
            terrainFactory: this.terrainFactory,

            dissolveSnowBaseTerrain: this.terrainFactory.get("Steppe"),
            dissolveSnowRange: PlumLogic.plumRange,
        }

        // cell
        CellModel.setup(playBundle);
        CellLogic.setup(playBundle);
        CellRenderer.setup(playBundle);
        CellSerializer.setup(playBundle);

        // board
        BoardModel.setup(playBundle);
        BoardLogic.setup(playBundle);
        BoardRenderer.setup(playBundle);
        BoardSerializer.setup(playBundle);
    }
}

/**
 *
 * @param name
 * @param model
 * @param logic
 * @param renderer
 * @param serializer
 * @returns {{name, model, logic, renderer, serializer}}
 */
function entityObject(name, model, logic, renderer, serializer) {
    return {name: name, model: model, logic: logic, renderer: renderer, serializer: serializer};
}

class GameStageFactory {
    constructor() {
        this.stageClasses = Array.from({length: 20}, () => []);

        this.stageClasses[stageGroup.TORNADO].push(Tornado1PlayBoard);
        this.stageClasses[stageGroup.TORNADO].push(Tornado2PlayBoard);
        this.stageClasses[stageGroup.TORNADO].push(Tornado3PlayBoard);
        this.stageClasses[stageGroup.TORNADO].push(Tornado4PlayBoard);
        this.stageClasses[stageGroup.TORNADO].push(Tornado5PlayBoard);

        this.stageClasses[stageGroup.VOLCANO].push(Volcano1PlayBoard);

        this.stageClasses[stageGroup.EARTHQUAKE].push(Earthquake1PlayBoard);

        this.stageClasses[stageGroup.BLIZZARD].push(Blizzard1PlayBoard);

        this.stageClasses[stageGroup.TSUNAMI].push(Tsunami1PlayBoard);
    }

    // allocate game stage dynamically
    newGameStage(newStage, gameState) {
        let StageClasses = this.stageClasses[gameState.currentStageGroup];
        let index = gameState.clearedStages.get(gameState.currentStageGroup);
        let StageClass = StageClasses[index != null ? index : 0];
        return StageClass ? new StageClass(gameState) : null;
    }
}