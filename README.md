# 2025-group-12

[PLAY HERE](https://uob-comsm0166.github.io/2025-group-12/)

![Group Photo](documents/week01-research/images/Group_photo.JPG)


Chin Wei Liu, rq24239@bristol.ac.uk, Chin-pro, manager

Xiaoyu Wu, ni24070@bristol.ac.uk, wendywuxiaoyu

Fan Meng, xa24801@bristol.ac.uk, p1umage

Xiaobai Zheng, iu24160@bristol.ac.uk, wheeinside

Rui Zhang, xs24368@bristol.ac.uk, redial17

Zhenghao Yang, kj24716@bristol.ac.uk, saquantum


# Project Report

## Introduction

The Green Renaissance is a turn-based tactics chessboard game, emphasising the flexibility and diversity of gameplay strategies, as well as the intricacies of resource management. The elements of the game are introduced progressively, making it easy to comprehend and learn while escalating challenges as the game progresses, reflecting the interconnected nature of these elements. Thus, players are encouraged to create a thoughtful strategy that will help them succeed in the game. 

The background story of our game invites you to explore a world being rebuilt after the devastation caused by natural disasters. Various plants, which develop from seeds after several turns of being cultivated, are employed as our chess soldiers in the struggle against disasters. Although these plants cannot move after cultivation, they can acquire different skills and enhance their ability when cultivated in close proximity, forming an ecosystem. After each game stage, all surviving plants are moved to the player's inventory for use in later stages. It would be challenging if a player consumes too many or grows too few resources, requiring players to think carefully before making their moves.

We are not looking for a conventional Mario-genre 2D side-scrolling platform game, but rather something innovative. Our initial game idea is inspired by a similar tactics game, <em>Into the Breach</em>, where players control a group of mecha warriors on a grid battlefield, and a tower defence game, <em>Carrot Fantasy</em>, where players cultivate plants that fire ballistae, similar to <em>Plants vs. Zombies</em>. Both games focus on planning and strategy. Evolved from these games, our game stands out for its uniqueness (as far as our knowledge) in gameplay and mechanics, making it enchanting to players .



## Requirements 

  ### Ideation process & Early-stage designs
To decide what to develop, we first raised our initial requirements for the game during the first team discussion session, including:

  - A board game, whether grid-based or not.
    
  - First easy, but gradually becomes difficult.
    
  - Challenging to manage resources.
    
  - Two game phases: farming and combat.
  
  - With a suitable and magnificent art style and background story.
   
  - The game should be novel.
    

 Our scrum master then collects all the requirements, guiding us to a consensus. Team members are then assigned tasks to explore relevant game ideas. We kept a backlog and a short version on the kanban to remind ourselves. This process was repeated over several meetings, focusing on the game mechanism. During week 3’s workshop, we made two paper prototypes, which were later denied due to dissatisfaction with our requirements. However, they played important roles in integrating the final idea of the game mechanism by evaluating the pros and cons of the two prototypes. 

[insert video – paper prototype]

The paper prototype introduces the fundamental concept of our gameplay: cultivate different plants on the grid play board to form an ecosystem and strengthen the plants to defend against natural disasters.

Through in-depth discussions, the early-stage game framework is maintained until the final version. We utilised pair programming to develop a working prototype in the first sprint, and all team members tested it and contributed ideas for later refinement.

[insert video – early-stage working prototype]

### Identify stakeholders & user stories
We identified stakeholders and visualised their roles using an onion model diagram to represent their impact on our game. Concrete end users placed in the inner rings act as active surrogates, embodying different player personas to help shape and clarify our gameplay requirements.

![Onion Model](/documents/onion.svg?)

<p align="center">
The onion model diagram.
</p>


The requirements and acceptance criteria raised by our team as user stories are presented below.

  - As the developer, I want to balance time and effort so that the game project is submitted on time and with high-quality coding and art. Given the timeline and task list, when tasks are assigned during a sprint, then each team member should have a manageable workload.

  - As the unit lecturer, I want the game to demonstrate challenges and be fun and engaging so that the students contribute enough work to the project. Given the team’s report and code base, when the game is demonstrated, then it should reflect both technical and creative effort.

- As a first-time player, I want the game to be easy to start with so that I can understand the game mechanism quickly. Given that I have no previous strategy game experience, when playing the first several stages, then I can get used to both the mouse controls and the game mechanics.

- As a casual player, I don’t want any time or space limitations present in the game so that I can enjoy the game anytime. Given that I want to play anytime, when I want to quit the game but not lose progress, then I can save the game and load it later.

- As a hardcore player, I want the game to be joyful and challenging so that I can enjoy the game. Given that I have experience on other games, when I want some extra challenge, then the game provides an infinite mode.

- As a player with art requirements, I want to understand how artistic concepts are projected into games so that I can enjoy the game better. Given a game that uses stylised art themes, when I progress through scenes, then the visual and audio elements should reflect the intended artistic concept to improve immersion.

- As a natural plant lover, I want a plant-centred game that provides in-depth and rich plant knowledge, as well as some of the actual plant functions, so that the game has a complete and detailed illustration function. Given extra plant illustrations, when players click each picture, then it shows the plant prototype, family, genus, species, suitable planting environment, growth cycle, medicinal value and economic value.

- As an environmental enthusiast, I want the game to simulate real-life planting experiences with diverse environments and climate systems, so that it emphasises the importance of protecting green lives. Given the natural disasters from the game, when I’m playing the game, then they should behave like real-life counterparts.

### Reflection on epics, user stories and acceptance criteria

Requirements-driven engineering defines clear boundaries for the final product and specifies one direction for development. One of the user stories states that the game should be easy to learn. It is then broken down into manageable tasks for us to accomplish, including adding floating windows for hints, designing the game board and enemies carefully, introducing the undo feature to improve tolerance for mistakes, designing user-friendly UI, etc. By pre-defining all tasks on the kanban, we establish a clear path and priority for implementing these features, greatly enhancing our efficiency.

Epics and user stories vaguely outline boundaries for the product on different scales, while acceptance criteria shape them to become more precise. “Adding floating windows” is indeed helpful, but what kind of floating windows? In the acceptance criterion for it, we must define clear constraints on all the elements: positioning, sizing, font size, colour, text wrapping, text wording… Once the criterion is met, we can confidently tick the task off the kanban.
 
Requirements themselves alter during agile engineering. When coding our game, the five game stages (Tornado, Volcano, Earthquake, Blizzard, Tsunami) did not suddenly appear out of nowhere. Initially, we only decided the first stage would focus on tornadoes since all core game features are involved, and it is not too hard to realise. After implementing and testing the functionalities thoroughly, we then moved on to discussions on designing later stages, where new requirements arise, and even potential modifications to existing requirements. Our game iterates and evolves from a mere working prototype into a complete game through filling in and refining the requirements.

### Use case diagram & Use case specification
To illustrate the flow of player actions to guide us in programming and visualise the game process, we have drawn the following use case diagram.

![Use Case Diagram](/documents/UseCaseDiagram.png)

<p align="center">
The use case diagram.
</p>


These use cases are detailed as follows:
  - Enter Game: The player enters the game and is located at the main start menu.

  - New Game: Start the game from the first game stage by clicking the ‘New Game’ button at the main menu.
  
  - Load Game: Load save data to continue playing by clicking the ‘Load Game’ button at the main menu.
  
  - Play: Click the next stage from the game map menu, then the player goes into the play board. Includes several actions the player can perform, or choose to do nothing and stay at this stage.
  
  - Cultivate: Click an item from the inventory, then click a grid cell to cultivate it.
  
  - Activate Skills: Click the activate button, then click a target from the board to activate skills of the plants.
  
  - End Turn: Click the turn button to go to the next turn.
  
  - Enemy Movements: After the turn button is clicked, if there are enemies on the board, they start to move and attack. Automatically goes to the next turn once all enemies have moved, or clears the current stage if the win condition is satisfied.
  
  - Plants Attacked: Plants only get hit when enemies are moving.
  
  - Base Attacked: Game Over if an enemy attacks the player's base.
  
  - Game Over: The player is thrown back to the game map menu and can retry the game stage.



## Design

- 15% ~750 words 
- System architecture. Class diagrams, behavioural diagrams. 


```mermaid
---
config:
  theme: neo
  layout: elk
  look: classic

---

classDiagram
direction TB
    class Plant {
	    + itemTypes type
	    + reevaluateSkills() void
	    + spreadBamboo() void
	    + plumRange() boolean
	    + stringify() string
	    + parse() Plant
    }
    class Bamboo {
	    + plantTypes plantType
	    + seedTypes seedType
	    + spreadBamboo() void
    }
    class Pine {
	    + plantTypes plantType
	    + seedTypes seedType
	    + reevaluateSkills() void
    }
    class Corn {
	    + plantTypes plantType
	    + seedTypes seedType
    }
    class Orchid {
	    + plantTypes plantType
	    + seedTypes seedType
	    + reevaluateSkills() void
    }
    class FireHerb {
	    + plantTypes plantType
	    + seedTypes seedType
    }
    class Plum {
	    + plantTypes plantType
	    + seedTypes seedType
	    + plumRange() boolean
    }
    class Palm {
	    + plantTypes plantType
	    + seedTypes seedType
    }
    class Kiku {
	    + plantTypes plantType
	    + seedTypes seedType
    }
    class Seed {
	    + itemTypes type
	    + grow() Plant|Seed
	    + stringify() string
	    + parse() Seed
    }
	<<abstract>> Plant
	<<abstract>> Seed
    Plant <|-- Bamboo
    Plant <|-- Pine
    Plant <|-- Corn
    Plant <|-- Orchid
    Plant <|-- FireHerb
    Plant <|-- Plum
    Plant <|-- Palm
    Plant <|-- Kiku
    Seed <|-- Bamboo
    Seed <|-- Pine
    Seed <|-- Corn
    Seed <|-- Orchid
    Seed <|-- FireHerb
    Seed <|-- Plum
    Seed <|-- Palm
    Seed <|-- Kiku
```

<p align="center">
The class diagram for plants and seeds.
</p>


```mermaid
---
config:
  theme: neo
  layout: dagre
  look: classic
---
classDiagram
direction TB
    class Terrain {
	    + itemTypes type
	    + storeSeed()
	    + solidify()
	    + stringify()
	    + parse()
    }
    class Lava {
	    + terrainTypes terrainType
      + getWeight() number
	    + storeSeed() void
	    + solidify() void
    }
    class PlayerBase {
	    + terrainTypes terrainType
      + getWeight() number
    }
    class Mountain {
	    + terrainTypes terrainType
      + getWeight() number
    }
    class Steppe {
	    + terrainTypes terrainType
      + getWeight() number
    }
    class Lumbering {
	    + terrainTypes terrainType
      + getWeight() number
    }
    class Volcano {
	    + terrainTypes terrainType
      + getWeight() number
    }
    class Hill {
	    + terrainTypes terrainType
      + boolean canSlide
      + getWeight() number
      + setCanSlide() void
    }
    class Landslide {
	    + terrainTypes terrainType
      + getWeight() number
    }
    class Snowfield {
	    + terrainTypes terrainType
      + getWeight() number
    }
    class Sea {
	    + terrainTypes terrainType
      + getWeight() number
    }
	<<abstract>> Terrain
    Terrain <|-- Lava
    Terrain <|-- PlayerBase
    Terrain <|-- Mountain
    Terrain <|-- Steppe
    Terrain <|-- Lumbering
    Terrain <|-- Volcano
    Terrain <|-- Hill
    Terrain <|-- Landslide
    Terrain <|-- Snowfield
    Terrain <|-- Sea
```

<p align="center">
The class diagram for terrain.
</p>


```mermaid
---
config:
  theme: neo
  layout: dagre
  look: classic
---
classDiagram
direction TB
    class Movable {
	    + itemTypes type
        + boolean isMoving
        + boolean hasMoved
        + draw() void
        + drawDirection() void
	    + movements() boolean
	    + generateSlide() void
	    + stringify() string
	    + parse() Movable
    }
    class Earthquake {
	    + movableTypes movableType
        - boolean isShaking
        - number shakeDuration
        - number startFrame
        + create() Earthquake
	    + draw() void
	    + movements() boolean
        - shake() void
        - hit() void
    }
    class Slide {
	   + movableTypes movableType
        - Cell cell
        - Cell finalCell
        - number accumulate
        + create() Slide
	    + draw() void
	    + movements() boolean
        + generateSlide() void
        - move() void
        - slide() void
    }
    class Tsunami {
	    + movableTypes movableType
        - number startCol
        - number startRow
        - Array range
        - Array movedLength
        - number blockerLimit
        - Array blocker
        - Array isMovingArray
        - number accumulate
        + create() Tsunami
	    + draw() void
	    + movements() boolean
        - checkIsMoving() boolean
        - move() void
        - slide() void
    }
    class VolcanicBomb {
	    + movableTypes movableType
        + number countdown
        - number moveSpeed
        - number initPos
        - number finalPos
        + create() VolcanicBomb
	    + draw() void
	    + movements() boolean
        - move() void
        - hit() void
        - reached() boolean
        - integrate() number
        - reparametrization() number
    }
    class Tornado {
	    + movableTypes movableType
        + number countdown
        + number health
        + number maxHealth
        - Cell cell
        - Array direction
        - number moveSpeed
        + create() Tornado
	    + draw() void
        + drawDirection() void
	    + movements() boolean
        - moveAndInvokeTornado() void
    }
    class Blizzard {
	   + movableTypes movableType
        + number countdown
        - Cell cell
        - Array direction
        - number moveSpeed
        - number playAnimation
        + create() Blizzard
	    + draw() void
	    + movements() boolean
        - hit() void
    }
    class Bandit {
	    + movableTypes movableType
        + number health
        + number maxHealth
        - Cell cell
        - Cell targetCell
        - Array direction
        - number moveSpeed
        + create() Bandit
	    + draw() void
	    + movements() boolean
        - move() void
        - setTarget() void
        - pickLuckyPlant() Array
        - graph() EdgeWeightedDigraph
    }

    class EdgeWeightedDigraph{
        + number vertices
        + number edges
        + Array adjacency
        + addEdge() void
        + edges() Array
        + setWeight() void
    }

    class DirectedEdge {
        + number v
        + number w
        + number weight
        + from() number
        + to() number
    }

    class DijkstraSP{
        - EdgeWeightedDigraph Graph
        - IndexPriorityQueue pq
        - Array distTo
        - Array edgeTo
        + hasPathTo() boolean 
        + pathTo() Array 
        + minWeightTo() Array
        - relax() void
    }

	
    class IndexPriorityQueue{
        - function compareTo
        - Map indices
        - Array queue
        + insert() void
        + pollIndex() number
        + change() void
    }

	<<abstract>> Movable
    Movable <|-- Earthquake
    Movable <|-- Slide
    Movable <|-- Tsunami
    Movable <|-- VolcanicBomb
    Movable <|-- Tornado
    Movable <|-- Blizzard
    Movable <|-- Bandit
    Bandit -- DijkstraSP
    Bandit -- EdgeWeightedDigraph
    DijkstraSP *-- EdgeWeightedDigraph
    DijkstraSP *-- IndexPriorityQueue
    EdgeWeightedDigraph *-- DirectedEdge
```
<p align="center">
The class diagram for movables.
</p>

```mermaid
---
config:
  theme: neo
  layout: dagre
  look: classic
---
classDiagram
direction LR
    class Board {
	    + Array boardObjects
        + draw() void
        - drawTerrain() void
        - drawLayer() void
        - drawPlants() void
        + getCell() Cell
        + setCell() void
        + plantCell() boolean
        + getAllCellsWithPlant() Array
        + getAllCellsWithSeed() Array
        + getAllCellsWithEnemy() Array
        + getAdjacent4Cells() Array
        + getAdjacent8Cells() Array
        + getNearbyCells() Array
        + setEcosystem() void
        - createEcosystem() Ecosystem
        + stringify() string
        + parse() Board
    }

    class Cell{
        + number i
        + number j
        + Terrain terrain
        + Plant plant
        + Seed seed
        + Movable enemy
        + drawTerrain() void
        + drawPlants() void
        + isCompatible() boolean
        + stringify() string
        + parse() Cell
    }

    class Ecosystem{
        + number countPlants
        + boolean growFaster
        + boolean rejectLava
        + boolean strengthenOrchid
        + boolean withstandSnow
    }

    class UnionFind{
        - Array id
        - Array size
        - number count
        + getComponent() Array
        + find() number
        + union() void
    }

    Board "1" *-- "*" Cell
    Cell *-- UnionFind
    Ecosystem "1" -- "3.." Cell
    Board "1" *-- "0.." Ecosystem
    Cell "1" *-- "0..1" Plant
    Cell "1" *-- "0..1" Seed
    Cell "1" *-- "0..1" Movable
    Cell "1" *-- "1" Terrain
```

<p align="center">
The class diagram for boards and cells. Refer to previous class diagrams to examine plants, seeds, terrains and movables.
</p>


```mermaid
---
config:
  theme: neo
  layout: dagre
  look: classic
---
classDiagram
direction TB
    class Screen {
        + GameState gameState
        + Array buttons
        + FloatingWindow floatingWindow
        + Map allFloatingWindows
        + drawFloatingWindow() void
        + draw() void
        + handleClick() void
        + handleFloatingWindow() boolean
        + handleScroll() void
        + setFloatingWindow() void
        + copyFloatingWindow() void
        + playFadeInAnimation() void
        + playFadeOutAnimation() void
        + stateTransitionAtFading() void
    }

    class FloatingWindow{
        - string text
        - number position
        + draw() void
        + copyOf() FloatingWindow
    }

    class StartMenu{
        - init() void
        - initAllFloatingWindows() void
    }

    class PauseMenu{
        - init() void
        - initAllFloatingWindows() void
    }

    class GameMap{
        - init() void
        - initAllFloatingWindows() void
        - createStageButton() MapButton
        + drawStageInfo() void
        + clickedStageButton() void
    }

    class PlayBoard{
        + stageGroups stageGroup
        + number stageNumbering
        + number gridSize
        - number cellWidth
        - number cellHeight
        + Array movables
        + Board boardObjects
        - InfoBox infoBox
        + number turn
        + number maxTurn
        + number actionPoints
        + number maxActionPoints
        - boolean awaitCell
        - Array undoStack
        - concreteBoardInit() void
        - initPlayBoard() void
        - setStageInventory() void
        - setStageTerrain() void
        - initAllFloatingWindows() void
        - setupActionListeners() void
        + draw() void
        - drawGrid() void
        - drawMovables() void
        - drawActionPoints() void
        - setCursorStyle() void
        + handleClick() void
        + handleScroll() void
        - clickedCell() void
        - handlePlanting() void
        - handleActiveSkills() void
        + endTurnActivity() void
        - stageClearSettings() void
        - setSeedCountdown() void
        - reevaluatePlantSkills() void
        - activatePlantSkill() void
        - nextTurnItems() void
        - modifyBoard() void
        + stringify() string
        + saveGame() string
        + undo() void
        + loadGame() PlayBoard
    }

    class InfoBox{
        + Button activateButton
        + Button displayButton
        + draw() void
        + updateInfoBox() void
        - setActivateButton() void
        - deleteActivateButton() void
        - setEcoDisplayButton() void
        - deleteDisplayButton() void
    }

    class Inventory{
        + Map items
        + plantTypes selectedItem
        + number scrollIndex
        + number maxVisibleItems
        + draw() void
        + handleClick() void
        + handleScroll() void
        + itemDecrement() void
        + createItem() Plant|Seed
        + pushItem2Inventory() void
        + setItemOfInventory() void
        + saveInventory() void
        + loadInventory() void
        - updateInventoryHeight() void
        + stringify() string
        + parse() Inventory
    }

    class GameSerializer{
        + save() void
        + load() boolean
        - saveGame() void
        - loadGame() boolean
    }

    <<abstract>> Screen

Screen <|-- StartMenu
Screen <|-- GameMap
Screen <|-- PlayBoard
GameMap o-- PauseMenu
PlayBoard o-- PauseMenu
StartMenu o-- FloatingWindow
GameMap o-- FloatingWindow
PlayBoard o-- FloatingWindow
PauseMenu o-- FloatingWindow
PlayBoard o-- InfoBox
GameMap o-- Inventory
PlayBoard o-- Inventory
StartMenu o-- GameSerializer
PauseMenu o-- GameSerializer
```


<p align="center">
The class diagram for game screens.
</p>

<p align="center">
The class diagram for the game state and wiring.
</p>

## Implementation

- 15% ~750 words

- Describe implementation of your game, in particular highlighting the three areas of challenge in developing your game.

## Evaluation

- 15% ~750 words

- One qualitative evaluation (your choice) 

  The heuristic evaluation of the game project identified several critical issues affecting usability, gameplay intuitiveness, and strategic clarity. The most severe issues (Severity ≥ 3.67) include **unclear core mechanics**, where players struggle to grasp fundamental gameplay concepts, requiring improved tutorials and visual guidance. Additionally, **the stamina bar only becomes visible in the second level’s second round**, which can disrupt strategic planning; this should be addressed by introducing it earlier. Another major concern is **unclear disaster and enemy movement logic**, which hinders strategic decision-making and could be resolved through better visual indicators. Furthermore, **resource values lack explicit meaning (Magic Number issue)**, requiring clearer numerical representations. Lastly, **the steep difficulty gap between the tutorial and the first level** makes it difficult for new players to transition smoothly.  

  For medium-priority issues (Severity 3.00 - 3.33), improvements should be made in **diversifying victory conditions**, separating **hints from annotations for better readability**, and allowing **players to change plant selections** after clicking. Additionally, **bugs causing automatic turn skips** and the **lack of an undo function** significantly impact gameplay flow and should be resolved. Implementing these changes will enhance game accessibility, improve strategic depth, and create a smoother onboarding experience for new players.

- One quantitative evaluation (of your choice) 


- Description of how code was tested. 

## Process 

- 15% ~750 words

- Teamwork. How did you work together, what tools did you use. Did you have team roles? Reflection on how you worked together. 

## Conclusion

- 10% ~500 words

- Reflect on project as a whole. Lessons learned. Reflect on challenges. Future work. 

## Contribution Statement

- Provide a table of everyone's contribution, which may be used to weight individual grades. We expect that the contribution will be split evenly across team-members in most cases. Let us know as soon as possible if there are any issues with teamwork as soon as they are apparent. 

## Additional Marks

You can delete this section in your own repo, it's just here for information. in addition to the marks above, we will be marking you on the following two points:

- **Quality** of report writing, presentation, use of figures and visual material (5%) 
  - Please write in a clear concise manner suitable for an interested layperson. Write as if this repo was publicly available.

- **Documentation** of code (5%)

  - Is your repo clearly organised? 
  - Is code well commented throughout?
