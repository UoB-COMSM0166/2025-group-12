### Project Structure
```
/ index.html
 |- / assets
     |- images
 |- / lib
 |- / src
     |- Main.js
     |- / controller
         |- Controller.js
     |- / model
         |- GameState.js
         |- Menu.js
         |- Standby.js
         |- Play.js
         |- BoardCells.js
     |- / items
```

### Data Flow

`Main.js` provides main entrance and couples view and controller components.

`controller/Controller.js` manages logic and combines all rendering. It stores all menus and invoke all action listeners.

1. `setup`: Load all interactive items such as buttons. Only invoked once during main setup.
2. `clickListener` & `scrollListener`: Invoke action listeners.
3. `view`: Rendering unit.
4. `setData`: The central controlling unit. Manage data transferring at menu switching, also handles movable animations.

`/model/Menu.js`: starting menu. A good template to understand how all menus work.

1. `setup`: Will be called by controller's `setup`. Creates all buttons in this menu, define their functionality, and store them in an array.
2. `handleClick`: Will be called by controller's `clickListener`.  It simply invokes all button's `mouseClick`.
3. `draw`: Will be called by controller's `view`. It draws all buttons and other polishing components.

These 3 methods are core. Since all game responses are invoked via clicking, other methods can be considered as helper methods.

`/model/Standby.js`: Select game map. Same structure as starting menu.

`/model/GameState.js`: Stores the current game state. Controller and all menus have access to it to shift game state. The only instance is created in controller's constructor. A game stage factory is used. Since games stages are divided into groups, all class files are preloaded and stored in a 2D array, each row corresponding to a group. To store information on saved stages, a Map is used.

`/model/Play.js`: All concrete game stages inherit `Play.js`. Similar to other menus but this also draws and handles bottom-left corner info box, center grid cells and left edge inventory. Inventory is created as a static variable, which means all game stages access one universal inventory instance. No need to understand all methods, by browsing through the 3 parts: setup, action listener and rendering, you can grasp the gist of the data flow.


`/model/BoardCells.js`: Stores current play board (2D array) and cells (entry of 2D array), handles all relevant logic. Complex core methods: `plantCell`, `removePlant`, `setEcosystem`. Other methods are short and easy to understand.

Other helper classes: `Srceen.js` : Template abstract class for menus. `FloatingWindow.js`, `InfoBox.js`, `Inventory.js` are UI units.