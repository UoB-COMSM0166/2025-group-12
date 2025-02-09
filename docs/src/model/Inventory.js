import { Tree } from "../items/Tree.js";
import { Bush } from "../items/Bush.js";
import { Grass } from "../items/Grass.js";

export class Inventory {
    constructor() {
        this.items = new Map();
        this.items.set(new Tree(),1);
        this.items.set(new Bush(),1);
        this.items.set(new Grass(),1);
        this.selectedItem = null;
    }

    draw(p5, canvasX, canvasY) {
        let padding = 10;

        let itemHeight = 40;

        let inventoryWidth = 120;
        let inventoryHeight = this.items.size * itemHeight + padding * 2;
        let inventoryX = canvasX - inventoryWidth - padding;
        let inventoryY = 20;

        let itemX = inventoryX + padding;
        let itemWidth = inventoryWidth - padding * 2;

        // Inventory background
        p5.fill(100);
        p5.rect(inventoryX, inventoryY, inventoryWidth, inventoryHeight, 10);

        // Inventory title text
        p5.fill(255);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text("Inventory", inventoryX + inventoryWidth / 2, inventoryY + padding);

        let index = 0;
        for (let [item] of this.items) {
            let itemY = inventoryY + padding * 2 + index * itemHeight;

            // Item's background block
            p5.fill(item.color);
            p5.rect(itemX, itemY, itemWidth, itemHeight - 5, 5);

            // Draw item name
            p5.fill(0);
            p5.textSize(14);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text(item.name, inventoryX + inventoryWidth / 2, itemY + (itemHeight - 5) / 2);

            index++;
        }
    }

    handleClick(p5, canvasX, canvasY) {
        let inventoryX = canvasX - 120;
        let inventoryY = 50;
        let itemHeight = 40;

        for (let i = 0; i < this.items.length; i++) {
            let itemY = inventoryY + 20 + i * itemHeight;
            if (p5.mouseX >= inventoryX + 10 && p5.mouseX <= inventoryX + 90 &&
                p5.mouseY >= itemY && p5.mouseY <= itemY + 30) {
                this.selectedItem = this.items[i];
                return;
            }
        }

        this.selectedItem = null;
    }
}
