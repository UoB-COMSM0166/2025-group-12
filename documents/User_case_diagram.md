https://www.plantuml.com/plantuml

@startuml
left to right direction

actor Player

rectangle "Green Renaissance" {
    usecase "Enter Game" as EnterGame
    usecase "New Game" as NewGame
    usecase "Load Game" as LoadGame
    usecase "Play" as Play
    usecase "End Turn" as EndTurn
    usecase "Activate Skills" as ActivateSkills
    usecase "Cultivate" as Cultivate
    usecase "Enemy Movements" as EnemyMovements
    usecase "Plants Attacked" as PlantsAttacked
    usecase "Base Attacked" as BaseAttacked
    usecase "Game Over" as GameOver
}

Player --> EnterGame
EnterGame --> (LoadGame) : «include»
EnterGame --> (NewGame) : «include»
NewGame --> Play
LoadGame --> Play
Play --> (EndTurn) : «include»
Play --> (ActivateSkills) : «include»
Play --> (Cultivate) : «include»

EnemyMovements --> EndTurn : «extend»
EnemyMovements --> Play
PlantsAttacked --> EnemyMovements : «extend»
BaseAttacked --> EnemyMovements : «extend»
BaseAttacked --> GameOver
@enduml