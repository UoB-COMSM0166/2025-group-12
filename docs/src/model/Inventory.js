import { Tree } from "../items/Tree.js";
import { Bush } from "../items/Bush.js";
import { Grass } from "../items/Grass.js";
import {CanvasSize} from "../CanvasSize.js";

export class Inventory {
    constructor() {
        this.items = new Map();
        this.items.set(new Tree(),1);
        this.items.set(new Bush(),1);
        this.items.set(new Grass(),1);
        this.selectedItem = null;

        // inventory and item parameters
        this.padding = 10;
        this.itemHeight = 40;
        this.inventoryWidth = 120;
        this.inventoryHeight = this.items.size * this.itemHeight + this.padding * 2;
        this.inventoryX = CanvasSize.getSize()[0] - this.inventoryWidth - this.padding;
        this.inventoryY = 20;
        this.itemX = this.inventoryX + this.padding;
        this.itemWidth = this.inventoryWidth - this.padding * 2;
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
        for (let [item] of this.items) {
            let itemY = this.inventoryY + this.padding * 2 + index * this.itemHeight;

            // draw an item of inventory
            p5.fill(item.color);
            p5.rect(this.itemX, itemY, this.itemWidth, this.itemHeight - 5, 5);
            p5.fill(0);
            p5.textSize(14);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text(item.name, this.inventoryX + this.inventoryWidth / 2, itemY + (this.itemHeight - 5) / 2);

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
        for (let [item] of this.items) {
            let itemY = this.inventoryY + this.padding * 2 + index * this.itemHeight;
            if (p5.mouseX >= this.itemX && p5.mouseX <= this.itemX + this.itemWidth &&
                p5.mouseY >= itemY && p5.mouseY <= itemY + (this.itemHeight - 5)) {
                console.log(`selected item ${index}`);
                this.selectedItem = item;
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
    }
}
