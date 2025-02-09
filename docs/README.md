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

`Controller.js` stores all clickable items and invoke their `mouseClick` functions.
