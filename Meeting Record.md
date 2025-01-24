# Meeting Record January 14, 2025

The discussion's primary focus was on team members' past gaming experiences and the game elements they hope to incorporate. The proposed elements are as follows:

1. Developing the game with an RPG framework as the core.
2. Reference games include:
    - **Pokemon** (monster mechanics),
    - **Rusty Lake** (puzzle-solving and escape room elements),
    - **Stardew Valley** (farming, market economy, and more complex economic models).
3. Additional elements under consideration:
    - Chinese-style horror,
    - Romance.

The **prototype** is expected to be presented during the midterm evaluation, which is scheduled for one month from now. The current approach uses **Stardew Valley** as the foundational layer, with plans to gradually integrate other elements later.

Currently, the primary focus is on game programming, particularly learning **`p5.js`**, implementing in-game interactions, and managing function calls between different modules. Additional features, such as battles, romance, and puzzles, will be refined and integrated during the storyline development phase.

---

# Meeting Record January 16, 2025

### Discussion Summary

This meeting focused on assigning team members to select their preferred game options (based on the options listed in the presentation) for research. Each member is tasked with compiling their research findings and personal reflections into a **report**. These reports will serve as the basis for deciding the theme, game type, and game elements for development.

**Deadline:** Please upload your report to **Github** by Sunday.

### Development Strategy

The current idea is to build upon the mechanics of existing games, then add new elements and features. This approach aims to streamline the development process and avoid unnecessary complexity.

Additionally, all members are encouraged to explore the limitations of using **p5.js** for game development. It is recommended to visit [**p5play**](https://p5play.org/play/) to review examples of games developed with p5.js and gain inspiration from others' projects.

---

# Meeting Record January 21, 2025

## **Meeting Agenda**

1. Determine the direction of the project and narrow down game types.
2. Discuss potential challenges for different game types.
3. Plan next steps.

## Discussion Summary

1. **Game Type Selection**:
    - The team decided to narrow the project scope to **three game types**:
        1. Construction Simulation
        2. Narrative
        3. Puzzle
2. **Discussion on Innovation vs. Remake**:
    - The idea of choosing between a remake or an innovative approach was brought up.
    - **Decision**: This discussion will be postponed for now.
3. **Challenges for Each Game Type**:
    - **Construction Simulation**:
        - Potential difficulty: Heavy backend computations required for implementation may be unrealistic with current resources.
    - **Narrative (or Puzzle)**:
        - Key challenge: Writing and planning the storyboarding and scripting.
        - It was noted that this type would require team members with relevant experience or strong interest to lead this effort.
4. **Next Steps**:
    - Before the next discussion, all participants are to **review the project results** of other teams from the past two years (2023 & 2024).
    - Analyze those projects to identify **feasible outcomes** for reference.

---

# Meeting Record January 23, 2025

## **Meeting Agenda**

1. Discuss and finalize game ideas for the project.
2. Define the tone and core gameplay mechanics for game development.
3. Explore feasible implementation methods based on current resources.

## Discussion Summary

1. **Introduction of Game Ideas**:
    - Two potential game ideas were proposed and discussed during the meeting.
    - A team member demonstrated their prior experience in developing a simple game called "[Crow Hitting](https://redial17.github.io/jspractice/)," following this [tutorial](https://www.youtube.com/watch?v=GFO_txvwK_c).
        - This example served as a concrete reference for understanding the game development process.
2. **Inspiration from Stardew Valley**:
    - Building upon ideas discussed in the previous meeting (January 14, 2025), the team explored implementing concepts inspired by *Stardew Valley*.
    - **Implementation Suggestion**: Focus on recreating specific scenes or mechanics instead of the entire game.
        - Given the capabilities of **p5.js**, dynamic backgrounds and scene transitions could be implemented using techniques such as scene switching or moving background images.
3. **Proposed Game Ideas**:
    - **Game Idea 1: Mole Manor (Simulation Game)**
        - **Concept**: A simulation game combining multiple mini-games, such as resource gathering, combat, and management, with the goal of upgrading a farm estate to Level 10.
        - **Core Gameplay**:
            - Players can pursue three branching paths:
                1. **Haunted House**: Catch ghosts in a cemetery using special tools and solve puzzles to capture powerful ghosts. (Risk: Debuffs from curses.)
                2. **Tourism**: Build a cozy estate for visitors.
                3. **Farming**: Plant crops, sell produce, and purchase materials to repair and upgrade the estate. (Risk: Debuffs from exhaustion.)
            - **Endgame Conditions**:
                - Bankruptcy, illness, or being caught by a ghost.
    - **Game Idea 2: Tower Defense + Survival (Story Game)**
        - **Concept**: A hybrid game inspired by *Plants vs. Zombies* and a fantastical creature collection theme.
        - **Core Gameplay**:
            - Incorporates tower defense mechanics with survival elements and features a collectible creature or resource guidebook.

---