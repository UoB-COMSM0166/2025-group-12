### Project Structure
```
/ index.html
 |- / assets
     |- images
 |- / lib
 |- / src
     |- Controller.js
 |- / src
     |- Main.js
     |- / controller
         |- Controller.js
     |- model
         |- GameState.js
     |- view
         |- View.js
     |- items
```

### Data Flow

`Main.js` provides main entrance and couples view and controller components.



`controller/Controller.js` manages logic and combines all rendering. It stores all menus and invoke action listeners.

	1. `setup` : load all interactive items such as buttons.
 	2. `clickListener` & `scrollListener` : invoke action listeners.
 	3. `view` : a temporary rendering unit. May want a separate `View.js` later.



`/model/GameState.js` : stores the current game state. Controller and all menus have access to it to shift game state. The only instance is created in controller's constructor.



`/model/Menu.js` : starting menu. A good template to understand how all menus work.

	1. `setup`: this function will be called by controller's `setup`. Creates all buttons in this menu, define their functionality, and store them in an array.
 	2. `handleClick` : this function will be called by controller's `clickListener`.  It simply invokes all button's `mouseClick`.
 	3. `draw` : this function will be called by controller's `view`. It draws all buttons and other polishing components.



`/model/Standby.js`: select game map. Same structure as starting menu.



`/model/Play.js`: This will later be a template to all game stages. Similar to other menus but this also draws and handles bottom-left corner info box, center grid cells and left edge inventory. Inventory is created as a static variable, which means all other game stages will inherit `PlayBoard` and modify the universal inventory instance.

