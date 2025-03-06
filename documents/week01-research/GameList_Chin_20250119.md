# Gaming List

## Stardew Valley

### Introduction

- **Genre**: Simulation, RPG
- Centered on agricultural management, combined with RPG elements, social interactions, exploration, and adventure.
- The core gameplay (farm management) dominates, while other features (e.g., mining exploration, marriage system) play a supporting role.
- **Success Factors**:
    1. Engaging core gameplay design, with social and exploratory elements adding depth to the game.
    2. Delivers a healing and freedom-oriented gaming experience.

### Core Gameplay

- **Farm Management**: Players grow crops and raise livestock, influenced by seasonal changes.
- **Social Interaction**: Build relationships with NPCs to unlock storylines.
- **Exploration and Adventure**: Includes mining exploration and combat elements.
- **Resource Management**: Balance money, materials, and time effectively.

### Potential Challenges

- **Map Management**: The multi-region map of Stardew Valley requires dynamic scene switching and rendering a large number of objects, potentially affecting performance.
- **NPC AI**: Designing an event system for NPC behaviors (e.g., schedules and dialogue triggers) must account for the native capabilities of p5.js.

### Feasible Implementation Scope

- Focus on **farm management** and **social interaction**, while omitting or simplifying adventure elements (e.g., combat).
    - Farm Management
    - Basic Social Activities

---

## Cities: Skylines

### Introduction

- **Genre**: Simulation
- A city-building simulation game focusing on modern urban planning, resource management, and transportation systems.
- Traffic flow optimization and infrastructure development are core design elements.
- **Success Factors**:
    1. High degree of freedom and realism, with modding support enhancing engagement.
    2. Provides in-depth city simulation, appealing to players who enjoy complex strategies and planning.

### Core Gameplay

- **City Construction and Management**: Players allocate zones (residential, commercial, industrial) and build infrastructure (roads, power).
- **Traffic System Simulation**: Simulates traffic flow and congestion.
- **Economic System**: Balances taxation and expenditures, influencing citizen satisfaction and urban development.

### Potential Challenges

- **Traffic System**: The complex traffic flow simulation in Cities: Skylines requires implementing road network data structures and vehicle pathfinding algorithms.
- **Large-Scale Map Rendering**: Dynamically rendering large cityscapes can create performance bottlenecks.

### Feasible Implementation Scope

- Focus on **resource management** and **building planning**, while simplifying detailed traffic flow simulation.
    - Resource Management
    - Building Planning

---

## Anno Series

### Introduction

- **Genre**: Simulation
- A strategy simulation game based on multi-layered resource management, economic systems, and trade networks.
- Involves city-building, economic simulation, and trade diplomacy.
- **Success Factors**:
    1. Comprehensive economic and trade simulation meets the depth expectations of strategy players.
    2. Exceptional art style and historical/futuristic themes enhance immersion.

### Core Gameplay

- **Resource Management and Production Chains**: Multi-tiered industry chains.
    - **Resource Chain Computation Load**: Multi-layered resource management requires frequent state updates and data computation, challenging p5.js performance.
    - **Dynamic Market Simulation**: Requires implementing a supply-demand fluctuation and price adjustment system with relatively complex logic.
- **Building and Urban Planning**: Construct factories, ports, and other buildings on the map, optimizing layouts for efficiency.
- **Trade and Diplomacy**: Players trade with NPCs or other players, adjusting market prices based on supply and demand.

### Feasible Implementation Scope

- Focus on **resource production** and **building systems**, while reducing emphasis on diplomacy and advanced market simulations.
    - Multi-layered Resource Management
    - Simplified Building Systems

---