import { Tree } from "../items/Tree.js";
import { Bush } from "../items/Bush.js";
import { Grass } from "../items/Grass.js";
import {CanvasSize} from "../CanvasSize.js";

export class Inventory {
    constructor() {
        this.items = new Map(); // <String name, int count>
        this.selectedItem = null; // a String

        // inventory and item parameters
        this.padding = 10;
        this.itemHeight = 40;
        this.inventoryWidth = 120;
        this.inventoryHeight = this.items.size * this.itemHeight + this.padding * 2;
        this.inventoryX = CanvasSize.getSize()[0] - this.inventoryWidth - this.padding;
        this.inventoryY = 20;
        this.itemX = this.inventoryX + this.padding;
        this.itemWidth = this.inventoryWidth - this.padding * 4;
    }

    draw(p5) {
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
            let tmpItem = this.createItem(key);
            // draw an item of inventory
            p5.fill(tmpItem.color);
            p5.rect(this.itemX, itemY, this.itemWidth, this.itemHeight - 5, 5);
            p5.fill(0);
            p5.textSize(14);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text(tmpItem.name, this.inventoryX + this.itemWidth / 2 + this.padding, itemY + (this.itemHeight - 5) / 2);
            p5.text(value, this.inventoryX + this.inventoryWidth - (this.inventoryWidth - (this.itemWidth + this.padding) ) / 2, itemY + (this.itemHeight - 5) / 2);
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
                p5.mouseY >= itemY && p5.mouseY <= itemY + (this.itemHeight - 5)) {
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
    createItem(name){
        if(!name instanceof String){
            console.log("input of createItem is not a String?");
            return null;
        }
        if(name === "Tree"){
            return new Tree();
        }else if(name === "Bush"){
            return new Bush();
        }else if (name === "Grass"){
            return new Grass();
        }else{
            console.log("input of createItem is not a unknown?");
            return null;
        }
    }

    pushItem2Inventory(name, number){
        // if the item is already in inventory:
        if(this.items.has(name)){
            this.items.set(name, this.items.get(name) + number);
        }
        // if the item is not in inventory:
        if(this.createItem(name) !== null){
            this.items.set(name, number);
        }
        // if the item is invalid:
        // do nothing. createItem has printed error info.
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
}
