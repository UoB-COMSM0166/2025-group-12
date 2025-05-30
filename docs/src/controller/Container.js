import {assertInterface} from "../../lib/assertInterface.js";

import {DijkstraSP, DirectedEdge, EdgeWeightedDigraph} from "../../lib/GraphSP.js";
import {IndexPriorityQueue} from "../../lib/PriorityQueue.js";
import {UnionFind} from "../../lib/UnionFind.js";
import {myUtil} from "../../lib/myUtil.js";

import {Controller} from "./Controller.js";
import {Renderer} from "./Renderer.js";
import {KeyboardHandler} from "./KeyboardHandler.js";
import {MouseIdleDetector} from "./MouseIdleDetector.js";

import {CanvasSize, resolutions} from "../CanvasSize.js";
import {FloatingWindow} from "../model/FloatingWindow.js";

import {PlantModel, PlantLogic, PlantRenderer, PlantSerializer} from "../items/Plant.js";
import {SeedModel, SeedLogic, SeedRenderer, SeedSerializer} from "../items/Seed.js";
import {PineModel, PineLogic, PineRenderer} from "../items/Pine.js";
import {PineSeedModel, PineSeedLogic, PineSeedRenderer} from "../items/Pine.js";
import {CornModel, CornLogic, CornRenderer} from "../items/Corn.js";
import {CornSeedModel, CornSeedLogic, CornSeedRenderer} from "../items/Corn.js";
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
import {DesertModel, DesertLogic, DesertRenderer} from "../items/Desert.js";
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
import {TsunamiModel, TsunamiLogic, TsunamiRenderer} from "../items/TsunamiAnimation.js";
import {VolcanicBombModel, VolcanicBombLogic, VolcanicBombRenderer} from "../items/VolcanicBomb.js";
import {BlizzardModel, BlizzardLogic, BlizzardRenderer} from "../items/Blizzard.js";
import {TornadoModel, TornadoLogic, TornadoRenderer} from "../items/Tornado.js";
import {BanditModel, BanditLogic, BanditRenderer} from "../items/Bandit.js";

import {Tornado1PlayBoard} from "../model/stages/Tor1.js";
import {Tornado2PlayBoard} from "../model/stages/Tor2.js";
import {Tornado3PlayBoard} from "../model/stages/Tor3.js";
import {Tornado4PlayBoard} from "../model/stages/Tor4.js";
import {Volcano1PlayBoard} from "../model/stages/Vol1.js";
import {Earthquake1PlayBoard} from "../model/stages/Ear1.js";
import {Earthquake2PlayBoard} from "../model/stages/Ear2.js";
import {Earthquake3PlayBoard} from "../model/stages/Ear3.js";
import {Blizzard1PlayBoard} from "../model/stages/Bli1.js";
import {Blizzard2PlayBoard} from "../model/stages/Bli2.js";
import {Tsunami1PlayBoard} from "../model/stages/Tsu1.js";

import {GameSerializer} from "../model/GameSerializer.js";
import {MenuItem} from "../items/MenuItem.js";
import {MapButton} from "../items/MapButton.js";
import {Button} from "../items/Button.js";
import {InventoryModel, InventoryLogic, InventoryRenderer, InventorySerializer} from "../model/Inventory.js";
import {GameState, stageGroup, stateCode} from "../model/GameState.js";

import {ScreenLogic, ScreenRenderer} from "../model/Screen.js";
import {StartMenuModel, StartMenuLogic, StartMenuRenderer} from "../model/StartMenu.js";
import {GameMapModel, GameMapLogic, GameMapRenderer} from "../model/GameMap.js";
import {InfoBoxModel, InfoBoxLogic, InfoBoxRenderer} from "../model/InfoBox.js";
import {PauseMenuModel, PauseMenuLogic, PauseMenuRenderer} from "../model/PauseMenu.js";
import {CellModel, CellLogic, CellRenderer, CellSerializer, Ecosystem} from "../model/BoardCells.js";
import {BoardModel, BoardLogic, BoardRenderer, BoardSerializer} from "../model/BoardCells.js";
import {PlayBoardModel, PlayBoardLogic, PlayBoardRenderer, PlayBoardSerializer} from "../model/PlayBoard.js";
import {OptionsLogic, OptionsModel, OptionsRenderer} from "../model/Options.js";
import {Dropdown} from "../items/Dropdown.js";
import {vibrate} from "./GamepadHandler.js";
import {Attacking, BanditState, banditStates, Dying, Hurt, Idle, Walking} from "../items/BanditState.js";


// to achieve loosely coupling we use lazy dependency injection
class Container {
    constructor(p5) {

        // ----------------------
        /* importing utilities */
        // ----------------------

        this.CanvasSize = CanvasSize; // no setup
        this.resolutions = resolutions;
        this.FloatingWindow = FloatingWindow;
        this.FloatingWindow.setup({CanvasSize: this.CanvasSize});
        this.utilityClass = myUtil;
        this.utilityClass.setup({CanvasSize: this.CanvasSize, FloatingWindow: this.FloatingWindow});

        this.IndexPriorityQueue = IndexPriorityQueue; // no setup

        this.UnionFind = UnionFind; // no setup

        this.DijkstraSP = DijkstraSP;
        this.DijkstraSP.setup({IPQ: this.IndexPriorityQueue});

        this.EdgeWeightedDigraph = EdgeWeightedDigraph;
        this.DirectedEdge = DirectedEdge;

        this.stateCode = stateCode;

        // -----------------------------------
        /* importing game entities - plants */
        // -----------------------------------

        let entityBundle = {
            p5: p5,
            utilityClass: this.utilityClass,
            itemTypes: itemTypes,
            plantTypes: plantTypes,
            seedTypes: seedTypes,
            terrainTypes: terrainTypes,
            movableTypes: movableTypes,
            baseType: baseType,
            PlantModel: PlantModel,
            InteractionLogic: InteractionLogic,
            BoardLogic: BoardLogic,
        };

        this.plantModules = [
            entityObject("Pine", PineModel, PineLogic, PineRenderer, null),
            entityObject("Corn", CornModel, CornLogic, CornRenderer, null),
            entityObject("Orchid", OrchidModel, OrchidLogic, OrchidRenderer, null),
            entityObject("FireHerb", FireHerbModel, FireHerbLogic, FireHerbRenderer, null),
            entityObject("Bamboo", BambooModel, BambooLogic, BambooRenderer, null),
            entityObject("Plum", PlumModel, PlumLogic, PlumRenderer, null),
            entityObject("Kiku", KikuModel, KikuLogic, KikuRenderer, null),
            entityObject("Palm", PalmModel, PalmLogic, PalmRenderer, null),
        ];

        // injection
        for (let plantModule of this.plantModules) {
            let {model, logic, renderer} = plantModule;
            if (model.setup) model.setup(entityBundle);
            if (logic.setup) logic.setup(entityBundle);
            if (renderer.setup) renderer.setup(entityBundle);

            entityBundle[model.name] = model;
            entityBundle[logic.name] = logic;
            entityBundle[renderer.name] = renderer;
        }

        // ----------------------------------
        /* importing game entities - seeds */
        // ----------------------------------

        this.seedModules = [
            entityObject("Pine", PineSeedModel, PineSeedLogic, PineSeedRenderer, null),
            entityObject("Corn", CornSeedModel, CornSeedLogic, CornSeedRenderer, null),
            entityObject("Orchid", OrchidSeedModel, OrchidSeedLogic, OrchidSeedRenderer, null),
            entityObject("FireHerb", FireHerbSeedModel, FireHerbSeedLogic, FireHerbSeedRenderer, null),
            entityObject("Bamboo", BambooSeedModel, BambooSeedLogic, BambooSeedRenderer, null),
            entityObject("Plum", PlumSeedModel, PlumSeedLogic, PlumSeedRenderer, null),
            entityObject("Kiku", KikuSeedModel, KikuSeedLogic, KikuSeedRenderer, null),
            entityObject("Palm", PalmSeedModel, PalmSeedLogic, PalmSeedRenderer, null),
        ];

        // injection
        for (let seedModule of this.seedModules) {
            let {model, renderer, logic} = seedModule;
            if (model.setup) model.setup(entityBundle);
            if (logic.setup) logic.setup(entityBundle);
            if (renderer.setup) renderer.setup(entityBundle);

            entityBundle[model.name] = model;
            entityBundle[logic.name] = logic;
            entityBundle[renderer.name] = renderer;
        }

        this.plantFactory = new Map([
            [plantTypes.PINE, () => new PineModel(p5, PlantModel, itemTypes, plantTypes)],
            [plantTypes.CORN, () => new CornModel(p5, PlantModel, itemTypes, plantTypes)],
            [plantTypes.ORCHID, () => new OrchidModel(p5, PlantModel, itemTypes, plantTypes)],
            [plantTypes.FIRE_HERB, () => new FireHerbModel(p5, PlantModel, itemTypes, plantTypes)],
            [plantTypes.BAMBOO, () => new BambooModel(p5, PlantModel, itemTypes, plantTypes)],
            [plantTypes.PLUM, () => new PlumModel(p5, PlantModel, itemTypes, plantTypes)],
            [plantTypes.KIKU, () => new KikuModel(p5, PlantModel, itemTypes, plantTypes)],
            [plantTypes.PALM, () => new PalmModel(p5, PlantModel, itemTypes, plantTypes)],
            [seedTypes.PINE, () => new PineSeedModel(p5, SeedModel, itemTypes, seedTypes)],
            [seedTypes.CORN, () => new CornSeedModel(p5, SeedModel, itemTypes, seedTypes)],
            [seedTypes.ORCHID, () => new OrchidSeedModel(p5, SeedModel, itemTypes, seedTypes)],
            [seedTypes.FIRE_HERB, () => new FireHerbSeedModel(p5, SeedModel, itemTypes, seedTypes)],
            [seedTypes.BAMBOO, () => new BambooSeedModel(p5, SeedModel, itemTypes, seedTypes)],
            [seedTypes.PLUM, () => new PlumSeedModel(p5, SeedModel, itemTypes, seedTypes)],
            [seedTypes.KIKU, () => new KikuSeedModel(p5, SeedModel, itemTypes, seedTypes)],
            [seedTypes.PALM, () => new PalmSeedModel(p5, SeedModel, itemTypes, seedTypes)],
        ]);
        entityBundle.plantFactory = this.plantFactory;

        PlantRenderer.setup(entityBundle);
        PlantLogic.setup(entityBundle);
        PlantSerializer.setup(entityBundle);

        SeedRenderer.setup(entityBundle);
        SeedLogic.setup(entityBundle);
        SeedSerializer.setup(entityBundle);

        // ------------------------------------
        /* importing game entities - terrain */
        // ------------------------------------

        let terrainModules = [
            entityObject("PlayerBase", PlayerBaseModel, PlayerBaseLogic, PlayerBaseRenderer, null),
            entityObject("Mountain", MountainModel, MountainLogic, MountainRenderer, null),
            entityObject("Desert", DesertModel, DesertLogic, DesertRenderer, null),
            entityObject("Lumbering", LumberingModel, LumberingLogic, LumberingRenderer, null),
            entityObject("Volcano", VolcanoModel, VolcanoLogic, VolcanoRenderer, null),
            entityObject("Lava", LavaModel, LavaLogic, LavaRenderer, null),
            entityObject("Hill", HillModel, HillLogic, HillRenderer, null),
            entityObject("Landslide", LandslideModel, LandslideLogic, LandslideRenderer, null),
            entityObject("Snowfield", SnowfieldModel, SnowfieldLogic, SnowfieldRenderer, null),
            entityObject("Sea", SeaModel, SeaLogic, SeaRenderer, null),
        ];

        // injection
        for (let terrainModule of terrainModules) {
            let {model, logic, renderer} = terrainModule;
            if (model.setup) model.setup(entityBundle);
            if (logic.setup) logic.setup(entityBundle);
            if (renderer.setup) renderer.setup(entityBundle);

            entityBundle[model.name] = model;
            entityBundle[logic.name] = logic;
            entityBundle[renderer.name] = renderer;
        }

        this.terrainFactory = new Map([
            [terrainTypes.BASE, () => new PlayerBaseModel(p5, TerrainModel, itemTypes, terrainTypes)],
            [terrainTypes.MOUNTAIN, () => new MountainModel(p5, TerrainModel, itemTypes, terrainTypes)],
            [terrainTypes.DESERT, () => new DesertModel(p5, TerrainModel, itemTypes, terrainTypes)],
            [terrainTypes.LUMBERING, () => new LumberingModel(p5, TerrainModel, itemTypes, terrainTypes)],
            [terrainTypes.VOLCANO, () => new VolcanoModel(p5, TerrainModel, itemTypes, terrainTypes)],
            [terrainTypes.LAVA, () => new LavaModel(p5, TerrainModel, itemTypes, terrainTypes)],
            [terrainTypes.HILL, () => new HillModel(p5, TerrainModel, itemTypes, terrainTypes)],
            [terrainTypes.LANDSLIDE, () => new LandslideModel(p5, TerrainModel, itemTypes, terrainTypes)],
            [terrainTypes.SNOWFIELD, () => new SnowfieldModel(p5, TerrainModel, itemTypes, terrainTypes)],
            [terrainTypes.SEA, () => new SeaModel(p5, TerrainModel, itemTypes, terrainTypes)],
        ]);
        entityBundle.terrainFactory = this.terrainFactory;

        TerrainLogic.setup(entityBundle);
        TerrainRenderer.setup(entityBundle);
        TerrainSerializer.setup(entityBundle);

        // -----------------------------------------------------
        /* importing game entities - movables and interaction */
        // -----------------------------------------------------

        this.interactionLogic = InteractionLogic;
        this.interactionLogic.setup({
            utilityClass: this.utilityClass,
            FloatingWindow: this.FloatingWindow,
            movableTypes: movableTypes,
            itemTypes: itemTypes,
            plantTypes: plantTypes,
            BoardLogic: BoardLogic,
            banditStates: banditStates,
            BanditLogic: BanditLogic,
        });

        let movableBundle = {
            p5: p5,
            utilityClass: this.utilityClass,
            itemTypes: itemTypes,
            baseType: baseType,
            plantTypes: plantTypes,
            terrainTypes: terrainTypes,
            terrainFactory: this.terrainFactory,
            movableTypes: movableTypes,
            movableFactory: this.movableFactory,
            BoardLogic: BoardLogic,
            InteractionLogic: InteractionLogic,
            DijkstraSP: DijkstraSP,
            EdgeWeightedDigraph: EdgeWeightedDigraph,
            DirectedEdge: DirectedEdge,
            vibrate: vibrate,
            banditStates: banditStates,
            Attacking: Attacking,
            Dying: Dying,
            Hurt: Hurt,
            Idle: Idle,
            Walking: Walking,
            BanditLogic: BanditLogic,
        };

        let movableModules = [
            entityObject("Earthquake", EarthquakeModel, EarthquakeLogic, EarthquakeRenderer, null),
            entityObject("SlideAnimation", SlideModel, SlideLogic, SlideRenderer, null),
            entityObject("TsunamiAnimation", TsunamiModel, TsunamiLogic, TsunamiRenderer, null),
            entityObject("VolcanicBomb", VolcanicBombModel, VolcanicBombLogic, VolcanicBombRenderer, null),
            entityObject("Blizzard", BlizzardModel, BlizzardLogic, BlizzardRenderer, null),
            entityObject("Tornado", TornadoModel, TornadoLogic, TornadoRenderer, null),
            entityObject("Bandit", BanditModel, BanditLogic, BanditRenderer, null),
        ]

        for (let movableModule of movableModules) {
            let {model, logic, renderer} = movableModule;
            if (model.setup) model.setup(movableBundle);
            if (logic.setup) logic.setup(movableBundle);
            if (renderer.setup) renderer.setup(movableBundle);

            movableBundle[model.name] = model;
            movableBundle[logic.name] = logic;
            movableBundle[renderer.name] = renderer;
        }

        this.movableFactory = new Map([
            [movableTypes.EARTHQUAKE, (playBoard) => EarthquakeModel.create(p5, playBoard, MovableModel)],
            [movableTypes.SLIDE, (playBoard, start_i, start_j, dest_i, dest_j) => SlideModel.create(p5, playBoard, MovableModel, start_i, start_j, dest_i, dest_j)],
            [movableTypes.TSUNAMI, (playBoard, startCol, startRow, range, blockerLimit) => TsunamiModel.create(p5, playBoard, MovableModel, startCol, startRow, range, blockerLimit)],
            [movableTypes.BOMB, (playBoard, i1, j1, i2, j2, x1, y1, x2, y2, countdown) => VolcanicBombModel.create(p5, MovableModel, playBoard, i1, j1, i2, j2, x1, y1, x2, y2, countdown)],
            [movableTypes.BLIZZARD, (playBoard, i, j, countdown) => BlizzardModel.create(p5, playBoard, MovableModel, i, j, countdown)],
            [movableTypes.TORNADO, (playBoard, i, j, direction, countdown) => TornadoModel.create(p5, playBoard, MovableModel, i, j, direction, countdown)],
            [movableTypes.BANDIT, (playBoard, i, j) => BanditModel.create(p5, playBoard, MovableModel, i, j)]
        ]);
        movableBundle.movableFactory = this.movableFactory;

        MovableLogic.setup(movableBundle);
        MovableRenderer.setup(movableBundle);
        MovableSerializer.setup(movableBundle);

        this.BanditState = BanditState;
        this.BanditState.setup(movableBundle);

        // --------------------------------------
        /* importing game state and game menus */
        // --------------------------------------

        this.MenuItem = MenuItem;
        this.MenuItem.setup({CanvasSize: this.CanvasSize});
        this.Button = Button;
        this.Button.setup({CanvasSize: this.CanvasSize});
        this.MapButton = MapButton;
        this.MapButton.setup({CanvasSize: this.CanvasSize});
        this.Dropdown = Dropdown;
        this.Dropdown.setup({CanvasSize: this.CanvasSize});

        // initialize serializer
        this.GameSerializer = GameSerializer;
        this.GameSerializer.setup({
            InventorySerializer: InventorySerializer,
            PlayBoardSerializer: PlayBoardSerializer,
            stateCode: stateCode
        });

        let menuBundle = {
            p5: p5,
            utilityClass: this.utilityClass,
            MenuItem: this.MenuItem,
            Button: this.Button,
            MapButton: this.MapButton,
            Dropdown: this.Dropdown,
            stateCode: stateCode,
            stageGroup: stageGroup,
            GameSerializer: this.GameSerializer,
            plantFactory: this.plantFactory,

            FloatingWindow: FloatingWindow,

            ScreenRenderer: ScreenRenderer,
            ScreenLogic: ScreenLogic,

            InventoryLogic: InventoryLogic,
            InventoryRenderer: InventoryRenderer,
            InventorySerializer: InventorySerializer,
            InfoBoxModel: InfoBoxModel,
            InfoBoxLogic: InfoBoxLogic,
            BoardModel: BoardModel,
            BoardLogic: BoardLogic,
            BoardRenderer: BoardRenderer,
            CellRenderer: CellRenderer,
            PlayBoardLogic: PlayBoardLogic,

            activatePlantSkill: PlayBoardLogic.activatePlantSkill,
        }

        ScreenRenderer.setup(menuBundle);
        ScreenLogic.setup(menuBundle);

        this.gameStageFactory = new GameStageFactory();

        // initialize inventory
        InventoryModel.setup(menuBundle);
        InventoryLogic.setup(entityBundle);
        InventoryRenderer.setup(menuBundle);
        this.inventory = new InventoryModel();

        this.gameState = new GameState(p5, this.gameStageFactory, this.inventory);
        this.gameState.mouseIdleDetector = new MouseIdleDetector(p5);

        menuBundle.gameState = this.gameState;

        this.menuModules = [
            entityObject("StartMenu", StartMenuModel, StartMenuLogic, StartMenuRenderer, null),
            entityObject("GameMap", GameMapModel, GameMapLogic, GameMapRenderer, null),
            entityObject("PlayBoard", PlayBoardModel, PlayBoardLogic, PlayBoardRenderer, PlayBoardSerializer),
            entityObject("InfoBox", InfoBoxModel, InfoBoxLogic, InfoBoxRenderer, null),
            entityObject("PauseMenu", PauseMenuModel, PauseMenuLogic, PauseMenuRenderer, null),
            entityObject("options", OptionsModel, OptionsLogic, OptionsRenderer, null),
        ]

        for (let menuModule of this.menuModules) {
            let {model, logic, renderer, serializer} = menuModule;
            if (model.setup) model.setup(menuBundle);
            if (logic.setup) logic.setup(menuBundle);
            if (renderer.setup) renderer.setup(menuBundle);
            if (serializer && serializer.setup) serializer.setup(menuBundle);
        }

        // main menus
        this.startMenu = new StartMenuModel(this.gameState);
        this.gameMap = new GameMapModel(this.gameState);
        // helper menus
        this.pauseMenu = new PauseMenuModel(this.gameState);
        this.optionsMenu = new OptionsModel(this.gameState);
        KeyboardHandler.setup(menuBundle);
        this.keyboardHandler = new KeyboardHandler(this.gameState);
        this.initialState = stateCode.MENU; // default

        this.menus = {
            [stateCode.MENU]: this.startMenu,
            [stateCode.STANDBY]: this.gameMap,
            [stateCode.PLAY]: null
        };

        this.controller = new Controller({
            gameState: this.gameState,
            menus: this.menus,
            stateCode: stateCode,
            pauseMenu: this.pauseMenu,
            optionsMenu: this.optionsMenu,
            keyboardHandler: this.keyboardHandler,
            initialState: this.initialState,

            ScreenLogic: ScreenLogic,
            StartMenuLogic: StartMenuLogic,
            GameMapLogic: GameMapLogic,
            PlayBoardModel: PlayBoardModel,
            PlayBoardLogic: PlayBoardLogic,
            PauseMenuLogic: PauseMenuLogic,
            OptionsLogic: OptionsLogic,
            InventoryLogic: InventoryLogic,
            MovableLogic: MovableLogic,
        });

        this.GameSerializer.save = () => this.GameSerializer.saveGame(this.controller);
        this.GameSerializer.load = () => this.GameSerializer.loadGame(p5, this.controller);

        this.renderer = new Renderer(
            {
                gameState: this.gameState,
                menus: this.menus,
                stateCode: stateCode,
                pauseMenu: this.pauseMenu,
                optionsMenu: this.optionsMenu,
                StartMenuRenderer: StartMenuRenderer,
                GameMapRenderer: GameMapRenderer,
                PlayBoardRenderer: PlayBoardRenderer,
                PauseMenuRenderer: PauseMenuRenderer,
                OptionsRenderer: OptionsRenderer,
            }
        )

        let playBundle = {
            utilityClass: this.utilityClass,
            Button: this.Button,
            UnionFind: this.UnionFind,

            PlantLogic: PlantLogic,
            PlantRenderer: PlantRenderer,
            PlantSerializer: PlantSerializer,
            SeedLogic: SeedLogic,
            SeedRenderer: SeedRenderer,
            SeedSerializer: SeedSerializer,
            TerrainLogic: TerrainLogic,
            TerrainRenderer: TerrainRenderer,
            TerrainSerializer: TerrainSerializer,
            MovableLogic: MovableLogic,
            MovableRenderer: MovableRenderer,
            MovableSerializer: MovableSerializer,

            FloatingWindow: FloatingWindow,
            stateCode: stateCode,
            stageGroup: stageGroup,
            itemTypes: itemTypes,
            baseType: baseType,
            plantTypes: plantTypes,
            seedTypes: seedTypes,
            terrainTypes: terrainTypes,
            movableTypes: movableTypes,

            InteractionLogic: InteractionLogic,

            plantFactory: this.plantFactory,
            terrainFactory: this.terrainFactory,
            movableFactory: this.movableFactory,

            ScreenLogic: ScreenLogic,
            ScreenRenderer: ScreenRenderer,

            BoardModel: BoardModel,
            BoardLogic: BoardLogic,
            BoardRenderer: BoardRenderer,
            BoardSerializer: BoardSerializer,

            InfoBoxModel: InfoBoxModel,
            InfoBoxLogic: InfoBoxLogic,
            InfoBoxRenderer: InfoBoxRenderer,

            InventoryLogic: InventoryLogic,
            InventoryRenderer: InventoryRenderer,
            InventorySerializer: InventorySerializer,
        }

        Ecosystem.setup({stageGroup: stageGroup});

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

        // play board
        PlayBoardModel.setup(playBundle);
        PlayBoardRenderer.setup(playBundle);
        PlayBoardLogic.setup(playBundle);
        PlayBoardSerializer.setup(playBundle);

        let modelMethods = [
            "concreteBoardInit",
            "setStageInventory",
            "setStageTerrain",
            "initAllFloatingWindows"
        ];

        let logicMethods = [
            "nextTurnItems",
            "modifyBoard",
            "setFloatingWindow",
        ];

        for (let i = 0; i < this.gameStageFactory.stageClasses.length; i++) {
            let group = this.gameStageFactory.stageClasses[i];
            for (let j = 0; j < group.length; j++) {
                let stage = group[j];

                assertInterface({
                    name: stage.name || `Stage_${i}_${j}`,
                    impl: stage,
                    methods: modelMethods
                });
                assertInterface({
                    name: stage.name || `Stage_${i}_${j}`,
                    impl: stage,
                    methods: logicMethods
                });

                stage.setup(PlayBoardModel, PlayBoardLogic)
            }
        }
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

        this.stageClasses[stageGroup.VOLCANO].push(Volcano1PlayBoard);

        this.stageClasses[stageGroup.EARTHQUAKE].push(Earthquake1PlayBoard);
        this.stageClasses[stageGroup.EARTHQUAKE].push(Earthquake2PlayBoard);
        this.stageClasses[stageGroup.EARTHQUAKE].push(Earthquake3PlayBoard);

        this.stageClasses[stageGroup.BLIZZARD].push(Blizzard1PlayBoard);
        this.stageClasses[stageGroup.BLIZZARD].push(Blizzard2PlayBoard);

        this.stageClasses[stageGroup.TSUNAMI].push(Tsunami1PlayBoard);
    }

    // allocate game stage dynamically
    /**
     *
     * @param newStage
     * @param {GameState} gameState
     */
    newGameStage(newStage, gameState) {
        let StageClasses = this.stageClasses[gameState.currentStageGroup];
        let index = gameState.clearedStages.get(gameState.currentStageGroup);
        return StageClasses[index != null ? index : 0];
    }

    /**
     *
     * @param stagePackage
     * @param {typeof PlayBoardModel} PlayBoardModelClass
     * @param {typeof PlayBoardLogic} PlayBoardLogicClass
     */
    wiringUp(stagePackage, PlayBoardModelClass, PlayBoardLogicClass) {
        PlayBoardModelClass.concreteBoardInit = stagePackage.concreteBoardInit.bind(stagePackage);
        PlayBoardModelClass.setStageInventory = stagePackage.setStageInventory.bind(stagePackage);
        PlayBoardModelClass.setStageTerrain = stagePackage.setStageTerrain.bind(stagePackage);
        PlayBoardModelClass.initAllFloatingWindows = stagePackage.initAllFloatingWindows.bind(stagePackage);
        PlayBoardLogicClass.nextTurnItems = stagePackage.nextTurnItems.bind(stagePackage);
        PlayBoardLogicClass.modifyBoard = stagePackage.modifyBoard.bind(stagePackage);
        PlayBoardLogicClass.setFloatingWindow = stagePackage.setFloatingWindow.bind(stagePackage);
    }
}

export {Container};

if (typeof module !== 'undefined') {
    module.exports = {Container};
}