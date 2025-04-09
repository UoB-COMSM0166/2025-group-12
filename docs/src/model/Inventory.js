import {Tree, TreeSeed} from "../items/Tree.js";
import {Bush, BushSeed} from "../items/Bush.js";
import {Orchid, OrchidSeed} from "../items/Orchid.js";
import {CanvasSize} from "../CanvasSize.js";
import {myutil} from "../../lib/myutil.js"
import {itemTypes, plantTypes, seedTypes} from "../items/ItemTypes.js";
import {FireHerb, FireHerbSeed} from "../items/FireHerb.js";
import {Bamboo, BambooSeed} from "../items/Bamboo.js";
import {Plum, PlumSeed} from "../items/Blizzard.js";
import {Kiku, KikuSeed} from "../items/Kiku.js";

export class Inventory {
    constructor(p5) {
        this.items = new Map(); // <String name, int count>
        this.selectedItem = null; // a String
        this.scrollIndex = 0;
        this.maxVisibleItems = 6;
        this.status = [false, false, false, false, false, false];
        this.index = 0;

        // for fast lookup when creating item
        this.itemPrototypes = this.initPrototypes(p5); // Map<String name, Plant/Seed instance>

        // inventory and item parameters
        [this.padding, this.itemHeight] = myutil.relative2absolute(0.01, 0.06);
        [this.inventoryWidth, this.inventoryY] = myutil.relative2absolute(0.1, 0.03);
        this.itemInter = myutil.relative2absolute(0.01, 0.01)[1];
        this.inventoryHeight = Math.min(this.items.size, this.maxVisibleItems) * this.itemHeight + this.padding * 2;
        this.inventoryX = CanvasSize.getSize()[0] - this.inventoryWidth - this.padding;
        this.itemX = this.inventoryX + this.padding;
        this.itemWidth = this.inventoryWidth - this.padding * 4;
    }

    // with prototypes, we can find seed or plant type given a name,
    // while name is a concrete String rather than a reference
    // so we can create it multiple times.
    initPrototypes(p5) {
        return new Map([
            ["Tree", new Tree(p5)],
            ["Bush", new Bush(p5)],
            ["Orchid", new Orchid(p5)],
            ["FireHerb", new FireHerb(p5)],
            ["Bamboo", new Bamboo(p5)],
            ["Plum", new Plum(p5)],
            ["Kiku", new Kiku(p5)],
            ["TreeSeed", new TreeSeed(p5)],
            ["BushSeed", new BushSeed(p5)],
            ["OrchidSeed", new OrchidSeed(p5)],
            ["FireHerbSeed", new FireHerbSeed(p5)],
            ["BambooSeed", new BambooSeed(p5)],
            ["PlumSeed", new PlumSeed(p5)],
            ["KikuSeed", new KikuSeed(p5)],
        ]);
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
        let visibleItems = Array.from(this.items.entries()).slice(this.scrollIndex, this.scrollIndex + this.maxVisibleItems);
        let index = 0;
        for (let i = 0; i < visibleItems.length; i++) {
            let key = visibleItems[i][0];
            let value = visibleItems[i][1];
            let itemY = this.inventoryY + this.padding * 2 + index * this.itemHeight;
            let itemInstance = this.itemPrototypes.get(key);
            if (this.index === i) {
                p5.stroke(255, 0, 0);
                p5.strokeWeight(4);
            } else {
                p5.stroke(255, 255, 255);
            }
            p5.fill(itemInstance.color);
            p5.rect(this.itemX, itemY, this.itemWidth, this.itemHeight - this.itemInter, this.itemInter);
            p5.fill(0);
            p5.textSize(14);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text(itemInstance.name, this.inventoryX + this.itemWidth / 2 + this.padding, itemY + (this.itemHeight - this.itemInter) / 2);
            p5.text(value, this.inventoryX + this.inventoryWidth - (this.inventoryWidth - (this.itemWidth + this.padding)) / 2, itemY + (this.itemHeight - this.itemInter) / 2);
            index++;
        }
    }

    handleScroll(event) {
        let maxIndex = Math.max(0, this.items.size - this.maxVisibleItems);
        if (event.deltaY > 0) {
            this.scrollIndex = Math.min(this.scrollIndex + 1, maxIndex);
        } else if (event.deltaY < 0) {
            this.scrollIndex = Math.max(this.scrollIndex - 1, 0);
        }
    }

    handleClick(p5) {
        // clear item when clicked somewhere else
        this.selectedItem = null;

        let visibleItems = Array.from(this.items.entries()).slice(this.scrollIndex, this.scrollIndex + this.maxVisibleItems);
        // record when an inventory item is clicked
        let index = 0;
        for (let [key, value] of visibleItems) {
            let itemY = this.inventoryY + this.padding * 2 + index * this.itemHeight;
            if (p5.mouseX >= this.itemX && p5.mouseX <= this.itemX + this.itemWidth &&
                p5.mouseY >= itemY && p5.mouseY <= itemY + (this.itemHeight - this.itemInter)) {
                this.selectedItem = key;
                return;
            }
            index++;
        }
    }

    // invoke this function when an item from inventory is placed to playing board
    itemDecrement() {
        if (this.selectedItem === null || !this.items.has(this.selectedItem)) {
            return;
        }

        // update data
        let value = this.items.get(this.selectedItem) - 1;
        if (value === 0) {
            this.items.delete(this.selectedItem);
        } else {
            this.items.set(this.selectedItem, value);
        }
        this.selectedItem = null;

        // update inventory height after decreasing
        this.updateInventoryHeight();
    }

    // return a new item according to its name.
    // use prototypes for type lookup and creation
    createItem(p5, name) {
        // fetch an instance from item prototypes
        let item = this.itemPrototypes.get(name);
        if (item === null) {
            console.error("input of createItem is unknown?");
            return null;
        }

        return new item.constructor(p5);
    }

    // add item into the inventory.
    pushItem2Inventory(p5, name, quantity) {
        // if the item is already in inventory:
        if (this.items.has(name)) {
            this.items.set(name, this.items.get(name) + quantity);
            return;
        }
        // if the item is not in inventory:
        if (this.createItem(p5, name) !== null) {
            this.items.set(name, quantity);
        }
        // if the item is invalid:
        // do nothing. createItem has printed error info.

        // update inventory height after pushing:
        this.updateInventoryHeight();
    }

    // to set item to a specific number.
    setItemOfInventory(p5, name, quantity) {
        this.items.set(name, quantity);
        this.updateInventoryHeight();
    }

    // store inventory items so next method can load it
    saveInventory() {
        let tmpItems = new Map();
        for (let [key, value] of this.items.entries()) {
            tmpItems.set(key, value);
        }
        return tmpItems;
    }

    // load saved inventory items when quit a stage
    loadInventory(tmpItems) {
        this.items = new Map();
        for (let [key, value] of tmpItems.entries()) {
            this.items.set(key, value);
        }
        this.updateInventoryHeight();
    }

    // update inventory height after insertion or delete
    // and secretly sort items by type. may want to refactor
    updateInventoryHeight() {
        this.inventoryHeight = Math.min(this.items.size, this.maxVisibleItems) * this.itemHeight + this.padding * 2;

        this.items = new Map([...this.items].sort(([key1], [key2]) => {
            let instance1 = this.itemPrototypes.get(key1);
            let instance2 = this.itemPrototypes.get(key2);
            const type1 = "plantType" in instance1 ? instance1.plantType : instance1.seedType;
            const type2 = "plantType" in instance2 ? instance2.plantType : instance2.seedType;
            return type1 - type2;
        }))
    }

    // when a stage is cleared, remove all seeds and bamboo from inventory.
    removeAllSeedsAndBamboo() {
        for (let [name, instance] of this.itemPrototypes.entries()) {
            if (instance.type === itemTypes.SEED) {
                this.items.delete(name);
            }
            if (instance.type === itemTypes.PLANT && instance.plantType === plantTypes.BAMBOO) {
                this.items.delete(name);
            }
        }
        this.updateInventoryHeight();
    }

    stringify() {
        const object = {
            items: Array.from(this.items.entries())
        }
        return JSON.stringify(object);
    }

    static parse(json, p5) {
        const object = JSON.parse(json);
        let inv = new Inventory(p5);
        inv.items = new Map(object.items);
        inv.updateInventoryHeight();
        return inv;
    }
}