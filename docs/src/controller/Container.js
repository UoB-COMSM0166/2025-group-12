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
import {TreeModel, TreeLogic, TreeRenderer, TreeSerializer} from "../items/Tree.js";
import {TreeSeedModel, TreeSeedLogic, TreeSeedRenderer, TreeSeedSerializer} from "../items/Tree.js";
import {BushModel, BushLogic, BushRenderer, BushSerializer} from "../items/Bush.js";
import {BushSeedModel, BushSeedLogic, BushSeedRenderer, BushSeedSerializer} from "../items/Bush.js";
import {OrchidModel, OrchidLogic, OrchidRenderer, OrchidSerializer} from "../items/Orchid.js";
import {OrchidSeedModel, OrchidSeedLogic, OrchidSeedRenderer, OrchidSeedSerializer} from "../items/Orchid.js";
import {FireHerbModel, FireHerbLogic, FireHerbRenderer, FireHerbSerializer} from "../items/FireHerb.js";
import {FireHerbSeedModel, FireHerbSeedLogic, FireHerbSeedRenderer, FireHerbSeedSerializer} from "../items/FireHerb.js";
import {BambooModel, BambooRenderer, BambooLogic, BambooSerializer} from "../items/Bamboo.js";
import {BambooSeedModel, BambooSeedRenderer, BambooSeedLogic, BambooSeedSerializer} from "../items/Bamboo.js";
import {PlumModel, PlumLogic, PlumRenderer, PlumSerializer} from "../items/Plum.js";
import {PlumSeedModel, PlumSeedLogic, PlumSeedRenderer, PlumSeedSerializer} from "../items/Plum.js";
import {KikuModel, KikuLogic, KikuRenderer, KikuSerializer} from "../items/Kiku.js";
import {KikuSeedModel, KikuSeedLogic, KikuSeedRenderer, KikuSeedSerializer} from "../items/Kiku.js";
import {PalmModel, PalmLogic, PalmRenderer, PalmSerializer} from "../items/Palm.js";
import {PalmSeedModel, PalmSeedLogic, PalmSeedRenderer, PalmSeedSerializer} from "../items/Palm.js";

import {TerrainModel, TerrainLogic, TerrainRenderer, TerrainSerializer} from "../items/Terrain.js";
import {PlayerBaseModel, PlayerBaseLogic, PlayerBaseRenderer, PlayerBaseSerializer} from "../items/PlayerBase.js";
import {MountainModel, MountainLogic, MountainRenderer, MountainSerializer} from "../items/Mountain.js";
import {SteppeModel, SteppeLogic, SteppeRenderer, SteppeSerializer} from "../items/Steppe.js";
import {LumberingModel, LumberingLogic, LumberingRenderer, LumberingSerializer} from "../items/Lumbering.js";
import {VolcanoModel, VolcanoLogic, VolcanoRenderer, VolcanoSerializer} from "../items/Volcano.js";
import {LavaModel, LavaLogic, LavaRenderer, LavaSerializer} from "../items/Lava.js";
import {HillModel, HillLogic, HillRenderer, HillSerializer} from "../items/Hill.js";
import {LandslideModel, LandslideLogic, LandslideRenderer, LandslideSerializer} from "../items/Landslide.js";
import {SnowfieldModel, SnowfieldLogic, SnowfieldRenderer, SnowfieldSerializer} from "../items/Snowfield.js";
import {SeaModel, SeaLogic, SeaRenderer, SeaSerializer} from "../items/Sea.js";

import {itemTypes, plantTypes, seedTypes, terrainTypes, movableTypes, baseType} from "../items/ItemTypes.js";

import {InteractionLogic} from "../items/InteractionLogic.js";


// to achieve loosely coupling we use lazy dependency injection
export class Container {
    constructor(p5) {

        // ----------------------
        /* importing utilities */
        // ----------------------

        this.renderer = Renderer.render; // invoke it in main loop by container.render(this) where this refers to p5

        this.CanvasSize = CanvasSize; // no setup
        this.FloatingWindow = FloatingWindow; // no setup

        this.utilityClass = myUtil;
        this.utilityClass.setup({CanvasSize: this.CanvasSize, FloatingWindow: this.FloatingWindow});

        this.IPQ = IndexPriorityQueue; // no setup

        this.UF = UnionFind; // no setup

        this.DijkstraAlgorithm = DijkstraSP;
        this.DijkstraAlgorithm.setup(this.IPQ);

        // --------------------------------------
        /* importing game state and game menus */
        // --------------------------------------

        this.gameState = gameState;
        this.stateCode = stateCode;

        this.menus = {
            [this.stateCode.MENU]: new StartMenu(this.gameState),
            [this.stateCode.STANDBY]: new StandbyMenu(this.gameState),
            [this.stateCode.PLAY]: null
        };

        this.pauseMenu = new PauseMenu(this.gameState);
        this.options = new Options(this);
        // key input
        this.input = new InputHandler(this.gameState, this.stateCode);
        this.saveState = this.stateCode.MENU; // default

        this.inputHandler = InputHandler; // no setup

        p5.controller = new Controller(this);

        // -----------------------------------
        /* importing game entities - plants */
        // -----------------------------------

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

        this.plantModules = [
            entityObject("Tree", TreeLogic, TreeRenderer, TreeSerializer),
            entityObject("Bush", BushLogic, BushRenderer, BushSerializer),
            entityObject("Orchid", OrchidLogic, OrchidRenderer, OrchidSerializer),
            entityObject("FireHerb", FireHerbLogic, FireHerbRenderer, FireHerbSerializer),
            entityObject("Bamboo", BambooLogic, BambooRenderer, BambooSerializer),
            entityObject("Plum", PlumLogic, PlumRenderer, PlumSerializer),
            entityObject("Kiku", KikuLogic, KikuRenderer, KikuSerializer),
            entityObject("Palm", PalmLogic, PalmRenderer, PalmSerializer),
        ];

        // general bundle of utilities
        let bundle = {
            utilityClass: this.utilityClass,
            itemTypes: itemTypes,
            plantTypes: plantTypes,
            seedTypes: seedTypes,
            terrainTypes: terrainTypes,
            movableTypes: movableTypes,
            baseType: baseType,
            PlantModel: PlantModel,
            SeedModel: SeedModel,
            interaction: InteractionLogic,
        };

        for (let plantModule of this.plantModules) {
            let {name, logic, renderer, serializer} = plantModule;
            // setup plant logics
            if (logic.setup) logic.setup(bundle);
            // assign plant serializers
            serializer.stringify = PlantSerializer.stringify;
            serializer.parse = (json, p5) => PlantSerializer.parse(json, p5, this.plantFactory.get(name)());

            // check implementation and inheritance of methods
            PlantLogic.assertImplementation(assertInterface, logic);
            PlantRenderer.assertImplementation(assertInterface, renderer);
            PlantSerializer.assertImplementation(assertInterface, serializer);
        }

        // ----------------------------------
        /* importing game entities - seeds */
        // ----------------------------------

        this.seedModules = [
            entityObject("TreeSeed", TreeSeedLogic, TreeSeedRenderer, TreeSeedSerializer),
            entityObject("BushSeed", BushSeedLogic, BushSeedRenderer, BushSeedSerializer),
            entityObject("OrchidSeed", OrchidSeedLogic, OrchidSeedRenderer, OrchidSeedSerializer),
            entityObject("FireHerbSeed", FireHerbSeedLogic, FireHerbSeedRenderer, FireHerbSeedSerializer),
            entityObject("BambooSeed", BambooSeedLogic, BambooSeedRenderer, BambooSeedSerializer),
            entityObject("PlumSeed", PlumSeedLogic, PlumSeedRenderer, PlumSeedSerializer),
            entityObject("KikuSeed", KikuSeedLogic, KikuSeedRenderer, KikuSeedSerializer),
            entityObject("PalmSeed", PalmSeedLogic, PalmSeedRenderer, PalmSeedSerializer),
        ];

        // set seed common methods
        for (let seedModule of this.seedModules) {
            let {name, logic, renderer, serializer} = seedModule;
            // assign seed logics
            logic.grow = (p5, seedInstance) => SeedLogic.grow(p5, seedInstance, this.plantFactory.get(name)());
            // assign seed serializers
            serializer.stringify = SeedSerializer.stringify;
            serializer.parse = (json, p5) => SeedSerializer.parse(json, p5, this.plantFactory.get(name)());

            // check implementation and inheritance of methods
            SeedLogic.assertImplementation(assertInterface, logic);
            SeedRenderer.assertImplementation(assertInterface, renderer);
            SeedSerializer.assertImplementation(assertInterface, serializer);
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
            entityObject("PlayerBase", PlayerBaseLogic, PlayerBaseRenderer, PlayerBaseSerializer),
            entityObject("Mountain", MountainLogic, MountainRenderer, MountainSerializer),
            entityObject("Steppe", SteppeLogic, SteppeRenderer, SteppeSerializer),
            entityObject("Lumbering", LumberingLogic, LumberingRenderer, LumberingSerializer),
            entityObject("Volcano", VolcanoLogic, VolcanoRenderer, VolcanoSerializer),
            entityObject("Lava", LavaLogic, LavaRenderer, LavaSerializer),
            entityObject("Hill", HillLogic, HillRenderer, HillSerializer),
            entityObject("Landslide", LandslideLogic, LandslideRenderer, LandslideSerializer),
            entityObject("Snowfield", SnowfieldLogic, SnowfieldRenderer, SnowfieldSerializer),
            entityObject("Sea", SeaLogic, SeaRenderer, SeaSerializer),
        ];

        for (let terrainModule of terrainModules) {
            let {name, logic, renderer, serializer} = terrainModule;
            // assign serializers
            serializer.stringify = (terrainInstance) => TerrainSerializer.stringify(terrainInstance, terrainTypes);
            serializer.parse = (json, p5) => TerrainSerializer.parse(json, p5, this.terrainFactory.get(name)(), this.plantFactory, terrainTypes);

            // check implementation and inheritance of methods
            TerrainRenderer.assertImplementation(assertInterface, renderer);
            TerrainLogic.assertImplementation(assertInterface, logic);
            TerrainSerializer.assertImplementation(assertInterface, serializer);
        }

        this.interactionLogic = InteractionLogic;
        this.interactionLogic.setup({
            utilityClass: this.utilityClass,
            FloatingWindow: this.FloatingWindow,
            movableTypes: movableTypes,
            itemTypes: itemTypes,
            plantTypes: plantTypes
        });

        bundle.plantFactory = this.plantFactory;
    }
}

function entityObject(name, logic, renderer, serializer) {
    return {name: name, logic: logic, renderer: renderer, serializer: serializer};
}