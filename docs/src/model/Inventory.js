import { Tree, TreeSeed } from "../items/Tree.js";
import { Bush, BushSeed } from "../items/Bush.js";
import { Grass, GrassSeed } from "../items/Grass.js";
import { CanvasSize } from "../CanvasSize.js";
import { myutil } from "../../lib/myutil.js"
import { itemTypes, plantTypes, seedTypes} from "../items/ItemTypes.js";

export class Inventory {
    constructor(p5) {
        this.items = new Map(); // <String name, int count>
        this.selectedItem = null; // a String

        // for fast lookup when creating item
        this.itemPrototypes = this.initPrototypes(p5); // Map<String name, Plant/Seed instance>

        // inventory and item parameters
        [this.padding, this.itemHeight] = myutil.relative2absolute(0.01, 0.06);
        [this.inventoryWidth, this.inventoryY] = myutil.relative2absolute(0.1, 0.03);
        this.itemInter = myutil.relative2absolute(0.01, 0.01)[1];
        this.inventoryHeight = this.items.size * this.itemHeight + this.padding * 2;
        this.inventoryX = CanvasSize.getSize()[0] - this.inventoryWidth - this.padding;
        this.itemX = this.inventoryX + this.padding;
        this.itemWidth = this.inventoryWidth - this.padding * 4;
    }

    draw(p5) {
        p5.noStroke();
        // Inventory background
        p5.fill(100);
        p5.rect(this.inventoryX, this.inventoryY, this.inventoryWidth, this.inventoryHeight, 10);

        // Inventory title text
        p5.fill(255);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(14);
        p5.text("Inventory", this.inventoryX + this.inventoryWidth / 2, this.inventoryY + this.padding);

        // loop inventory items
        let index = 0;
        for (let [key, value] of this.items.entries()) {
            let itemY = this.inventoryY + this.padding * 2 + index * this.itemHeight;
            let tmpItem = this.createItem(p5, key);
            // draw an item of inventory
            p5.fill(tmpItem.color);
            p5.rect(this.itemX, itemY, this.itemWidth, this.itemHeight - this.itemInter, this.itemInter);
            p5.fill(0);
            p5.textSize(14);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text(tmpItem.name, this.inventoryX + this.itemWidth / 2 + this.padding, itemY + (this.itemHeight - this.itemInter) / 2);
            p5.text(value, this.inventoryX + this.inventoryWidth - (this.inventoryWidth - (this.itemWidth + this.padding) ) / 2, itemY + (this.itemHeight - this.itemInter) / 2);
            index++;
        }
    }

    handleScroll(event) {
        // placeholder
    }

    handleClick(p5) {
        // clear item when clicked somewhere else
        this.selectedItem = null;

        // record when an inventory item is clicked
        let index = 0;
        for (let [key, value] of this.items.entries()) {
            let itemY = this.inventoryY + this.padding * 2 + index * this.itemHeight;
            if (p5.mouseX >= this.itemX && p5.mouseX <= this.itemX + this.itemWidth &&
                p5.mouseY >= itemY && p5.mouseY <= itemY + (this.itemHeight - this.itemInter)) {
                console.log(`selected item ${index}`);
                this.selectedItem = key;
                return;
            }
            index++;
        }
        console.log("cleared item");
    }

    // invoke this function when an item from inventory is placed to playing board
    itemDecrement(){
        if(this.selectedItem === null || !this.items.has(this.selectedItem)){
            return;
        }
        
        // update data
        let value  = this.items.get(this.selectedItem) - 1;
        if(value === 0){
            this.items.delete(this.selectedItem);    
        }else{
            this.items.set(this.selectedItem, value);
        }
        this.selectedItem = null;
    }

    // return a new item according to name
    createItem(p5, name){
        // fetch an instance from item prototypes
        let item = this.itemPrototypes.get(name);
        if(item === null){
            console.log("input of createItem is unknown?");
            return null;
        }

        // item is either a plant or seed
        if(item.type === itemTypes.PLANT){
            if(item.plantType === plantTypes.TREE){
                return new Tree(p5);
            }else if(item.plantType === plantTypes.BUSH){
                return new Bush(p5);
            }else if(item.plantType === plantTypes.GRASS){
                return new Grass(p5);
            }
        }else if(item.type === itemTypes.SEED){
            if(item.seedType === seedTypes.TREE){
                return new TreeSeed(p5);
            }else if(item.seedType === seedTypes.BUSH){
                return new BushSeed(p5);
            }else if(item.seedType === seedTypes.GRASS){
                return new GrassSeed(p5);
            }
        }else{
            console.log("input of createItem is not a unknown?");
            return null;
        }
    }

    pushItem2Inventory(p5, name, number){
        // if the item is already in inventory:
        if(this.items.has(name)){
            this.items.set(name, this.items.get(name) + number);
            return;
        }
        // if the item is not in inventory:
        if(this.createItem(p5, name) !== null){
            this.items.set(name, number);
        }
        // if the item is invalid:
        // do nothing. createItem has printed error info.
    }

    initPrototypes(p5){
        return  new Map([
            ["Tree", new Tree(p5)],
            ["Bush", new Bush(p5)],
            ["Grass", new Grass(p5)],
            ["TreeSeed", new TreeSeed(p5)],
            ["BushSeed", new BushSeed(p5)],
            ["GrassSeed", new GrassSeed(p5)]
        ]);
    }

    // store inventory items
    saveInventory(){
        let tmpItems = new Map();
        for (let [key, value] of this.items.entries()) {
            tmpItems.set(key, value);
        }
        return tmpItems;
    }

    // load saved inventory items
    loadInventory(tmpItems){
        this.items = new Map();
        for (let [key, value] of tmpItems.entries()) {
            this.items.set(key, value);
        }
        this.updateInventoryHeight();
    }

    // update inventory height
    updateInventoryHeight(){
        this.inventoryHeight = this.items.size * this.itemHeight + this.padding * 2;
    }

    // when a stage is cleared, remove all seeds from inventory.
    removeAllSeeds(){
        for (let [name, instance] of this.itemPrototypes.entries()) {
            if(instance.type === itemTypes.SEED){
                this.items.delete(name);
            }
        }
    }
}
