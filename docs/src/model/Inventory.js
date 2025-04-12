export class InventoryModel {
    static setup(bundle) {
        InventoryModel.utilityClass = bundle.utilityClass;
        /** @type {Map} */
        InventoryModel.plantFactory = bundle.plantFactory;
    }

    constructor() {
        this.items = new Map(); // <String name, int count>
        this.selectedItem = null; // a String
        this.scrollIndex = 0;
        this.maxVisibleItems = 6;

        // for fast lookup when creating item
        this.itemPrototypes = InventoryModel.plantFactory; // Map<String name, Function create>

        // inventory and item parameters
        this.padding = InventoryModel.utilityClass.relative2absolute(0.01, 0.06)[0];
        this.itemHeight = InventoryModel.utilityClass.relative2absolute(0.01, 0.06)[1];
        this.inventoryWidth = InventoryModel.utilityClass.relative2absolute(0.1, 0.03)[0];
        this.inventoryY = InventoryModel.utilityClass.relative2absolute(0.1, 0.03)[1];
        this.itemInter = InventoryModel.utilityClass.relative2absolute(0.01, 0.01)[1];
        this.inventoryHeight = Math.min(this.items.size, this.maxVisibleItems) * this.itemHeight + this.padding * 2;
        this.inventoryX = InventoryModel.utilityClass.relative2absolute(1, 1)[0] - this.inventoryWidth - this.padding;
        this.itemX = this.inventoryX + this.padding;
        this.itemWidth = this.inventoryWidth - this.padding * 4;
    }
}

export class InventoryRenderer {
    static setup(bundle) {
        InventoryRenderer.Button = bundle.Button;
    }

    /**
     *
     * @param p5
     * @param {InventoryModel} inventory
     */
    static draw(p5, inventory) {
        p5.noStroke();
        // Inventory background
        p5.fill(100, 100, 100, 200);
        p5.rect(inventory.inventoryX, inventory.inventoryY, inventory.inventoryWidth, inventory.inventoryHeight, 10);

        // Inventory title text
        p5.fill(255);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(14);
        p5.text("Inventory", inventory.inventoryX + inventory.inventoryWidth / 2, inventory.inventoryY + inventory.padding);

        // loop inventory items
        let visibleItems = Array.from(inventory.items.entries()).slice(inventory.scrollIndex, inventory.scrollIndex + inventory.maxVisibleItems);
        let index = 0;
        for (let [key, value] of visibleItems) {
            let itemY = inventory.inventoryY + inventory.padding * 2 + index * inventory.itemHeight;
            let itemInstance = inventory.itemPrototypes.get(key)();
            p5.fill(itemInstance.color);
            p5.rect(inventory.itemX, itemY, inventory.itemWidth, inventory.itemHeight - inventory.itemInter, inventory.itemInter);
            p5.fill(0);
            p5.textSize(14);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text(itemInstance.name, inventory.inventoryX + inventory.itemWidth / 2 + inventory.padding, itemY + (inventory.itemHeight - inventory.itemInter) / 2);
            p5.text(value, inventory.inventoryX + inventory.inventoryWidth - (inventory.inventoryWidth - (inventory.itemWidth + inventory.padding)) / 2, itemY + (inventory.itemHeight - inventory.itemInter) / 2);
            index++;
        }
    }
}

export class InventoryLogic {
    static setup(bundle) {
        InventoryLogic.plantTypes = bundle.plantTypes;
        InventoryLogic.seedTypes = bundle.seedTypes;
        InventoryLogic.itemTypes = bundle.itemTypes;
    }

    /**
     *
     * @param event
     * @param {InventoryModel} inventory
     */
    static handleScroll(event, inventory) {
        let maxIndex = Math.max(0, inventory.items.size - inventory.maxVisibleItems);
        if (event.deltaY > 0) {
            inventory.scrollIndex = Math.min(inventory.scrollIndex + 1, maxIndex);
        } else if (event.deltaY < 0) {
            inventory.scrollIndex = Math.max(inventory.scrollIndex - 1, 0);
        }
    }

    /**
     *
     * @param p5
     * @param {InventoryModel} inventory
     */
    static handleClick(p5, inventory) {
        // clear item when clicked somewhere else
        inventory.selectedItem = null;

        let visibleItems = Array.from(inventory.items.entries()).slice(inventory.scrollIndex, inventory.scrollIndex + inventory.maxVisibleItems);
        // record when an inventory item is clicked
        let index = 0;
        for (let [key, _] of visibleItems) {
            let itemY = inventory.inventoryY + inventory.padding * 2 + index * inventory.itemHeight;
            if (p5.mouseX >= inventory.itemX && p5.mouseX <= inventory.itemX + inventory.itemWidth &&
                p5.mouseY >= itemY && p5.mouseY <= itemY + (inventory.itemHeight - inventory.itemInter)) {
                inventory.selectedItem = key;
                return;
            }
            index++;
        }
    }

    // invoke this function when an item from inventory is placed to playing board
    /**
     *
     * @param {InventoryModel} inventory
     */
    static itemDecrement(inventory) {
        if (inventory.selectedItem === null || !inventory.items.has(inventory.selectedItem)) {
            return;
        }

        // update data
        let value = inventory.items.get(inventory.selectedItem) - 1;
        if (value === 0) {
            inventory.items.delete(inventory.selectedItem);
        } else {
            inventory.items.set(inventory.selectedItem, value);
        }
        inventory.selectedItem = null;

        // update inventory height after decreasing
        InventoryLogic.updateInventoryHeight(inventory);
    }

    // return a new item according to its name.
    // use prototypes for type lookup and creation
    /**
     *
     * @param p5
     * @param name
     * @param {InventoryModel} inventory
     */
    static createItem(p5, name, inventory) {
        // fetch an instance from item prototypes
        let item = inventory.itemPrototypes.get(name)();
        if (!item) {
            console.error("input of createItem is unknown?");
            return null;
        }
        return item;
    }

    // add item into the inventory.
    /**
     *
     * @param p5
     * @param name
     * @param quantity
     * @param {InventoryModel} inventory
     */
    static pushItem2Inventory(p5, name, quantity, inventory) {
        // if the item is already in inventory:
        if (inventory.items.has(name)) {
            inventory.items.set(name, inventory.items.get(name) + quantity);
            return;
        }
        // if the item is not in inventory:
        if (InventoryLogic.createItem(p5, name, inventory) !== null) {
            inventory.items.set(name, quantity);
        }
        // if the item is invalid:
        // do nothing. createItem has printed error info.

        // update inventory height after pushing:
        InventoryLogic.updateInventoryHeight(inventory);
    }

    // to set item to a specific number.
    /**
     *
     * @param p5
     * @param name
     * @param quantity
     * @param {InventoryModel} inventory
     */
    static setItemOfInventory(p5, name, quantity, inventory) {
        inventory.items.set(name, quantity);
        InventoryLogic.updateInventoryHeight(inventory);
    }

    // store inventory items so next method can load it
    /**
     *
     * @param {InventoryModel} inventory
     */
    static saveInventory(inventory) {
        let tmpItems = new Map();
        for (let [key, value] of inventory.items.entries()) {
            tmpItems.set(key, value);
        }
        return tmpItems;
    }

    /**
     *
     * @param {Map} savedItems
     * @param {InventoryModel} inventory
     */
    // load saved inventory items when quit a stage
    static loadInventory(savedItems, inventory) {
        inventory.items = new Map();
        for (let [key, value] of savedItems.entries()) {
            inventory.items.set(key, value);
        }
        InventoryLogic.updateInventoryHeight(inventory);
    }

    // update inventory height after insertion or delete
    // and secretly sort items by type. may want to refactor
    /**
     *
     * @param {InventoryModel} inventory
     */
    static updateInventoryHeight(inventory) {
        inventory.inventoryHeight = Math.min(inventory.items.size, inventory.maxVisibleItems) * inventory.itemHeight + inventory.padding * 2;

        inventory.items = new Map([...inventory.items].sort(([key1], [key2]) => {
            let instance1 = inventory.itemPrototypes.get(key1)();
            let instance2 = inventory.itemPrototypes.get(key2)();
            const type1 = "plantType" in instance1 ? instance1.plantType : instance1.seedType;
            const type2 = "plantType" in instance2 ? instance2.plantType : instance2.seedType;
            return type1 - type2;
        }))
    }

    // when a stage is cleared, remove all seeds and bamboo from inventory.
    /**
     *
     * @param {InventoryModel} inventory
     */
    static removeAllSeedsAndBamboo(inventory) {
        for (let [name, instanceConstructor] of inventory.itemPrototypes.entries()) {
            let instance = instanceConstructor();
            if (instance.type === InventoryLogic.itemTypes.SEED) {
                inventory.items.delete(name);
            }
            if (instance.type === InventoryLogic.itemTypes.PLANT && instance.plantType === InventoryLogic.plantTypes.BAMBOO) {
                inventory.items.delete(name);
            }
        }
        InventoryLogic.updateInventoryHeight(inventory);
    }
}

export class InventorySerializer {
    /**
     *
     * @param {InventoryModel} inventory
     */
    static stringify(inventory) {
        const object = {
            items: Array.from(inventory.items.entries())
        }
        return JSON.stringify(object);
    }

    /**
     *
     * @param json
     * @param p5
     * @param {InventoryModel} inventoryInstance
     */
    static parse(json, p5, inventoryInstance) {
        const object = JSON.parse(json);
        InventoryLogic.loadInventory(new Map(object.items), inventoryInstance);
        return inventoryInstance;
    }
}
