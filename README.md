```mermaid
---
config:
  theme: mc
  look: classic
---
%%{init: { "theme":"mc", "look": "classic", "flowchart":{"htmlLabels": false } } }%%
flowchart TD
  Player([Player])
  EnterGame((Enter Game))
  NewGame((New Game))
  LoadGame((Load Game))
  Play((Play))
  EndTurn((End Turn))
  ActivateSkills((Activate Skills))
  Cultivate((Cultivate))
  EnemyMovements((Enemy Movements))
  PlantsAttacked((Plants Attacked))
  BaseAttacked((Base Attacked))
  GameOver((Game Over))

  Player --> EnterGame
  EnterGame -. "«include»" .-> NewGame
  EnterGame -. "«include»" .-> LoadGame
  NewGame --> Play
  LoadGame --> Play
  Play -. "«include»" .-> EndTurn
  Play -. "«include»" .-> ActivateSkills
  Play -. "«include»" .-> Cultivate
  EndTurn -. "«extend»" .-> EnemyMovements
  EnemyMovements --> Play
  EnemyMovements -. "«extend»" .-> PlantsAttacked
  EnemyMovements -. "«extend»" .-> BaseAttacked
  BaseAttacked --> GameOver
