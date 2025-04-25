Our heuristic evaluation of the turn-based ecology strategy prototype used Nielsen’s ten heuristics. Twenty-four issues were discovered and most of them are related to the games’s UI/UX and gameplay interface. Each issue was rated 0-4 for frequency, impact, and persistence. Furthermore, the average of these ratings formed a severity score guiding priority. To triangulate the purely expert-driven findings with players perception, we administered the System Usability Scale (SUS) and the NASA Task Load Index (NASA-TLX) to twelve participants who completed both “easy” and a “hard” scenario. In our tests, we identified the most severe issues affecting users’ experiences, analyzed the potential root causes and propose targeted interventions to address these issues.

1. Opaque core loop
    - Problem Description: New players struggle to intuit the game’s objectives and flow.
    - Root Cause: The prototype presumes familiarity with board-style, turn-based mechanics common to veteran players, leaving novices with insufficient context for key actions, such as planting, resource management and defences.
    - Proposed Solution: Extend the tutorial into a multi-step guided sequence that visually links each mechanic. Use contextual, step-by-step hints—such as animated arrows or highlighted UI elements—that explicitly demonstrate how planting consumes resources to build defences and how these defences mitigate incoming threats.
2. Hidden stamina bar
    - Problem Description: The stamina does not appear until Level 2, disrupting early strategic planning.
    - Root Cause: The tutorial skips the introduction to stamina mechanics, therefore, players lack awareness of this fundamental constraint during their decision-making procedure.
    - Proposed Solution: Integrate a dedicated stamina segment into the tutorial and increase the brief explanation of how the stamina mechanism work, including how each actions depletes stamina and resets between turns.
3. Unpredictable disasters and attacks
    - Problem Description: Natural disasters and enemy materialized without warning, reducing perceived player agency.
    - Root Cause:  Under the design in the prototype, disaster and enemy spawn are randomized each turn with no telegraphed indicators, forcing players into reactive rather than strategic play.
    - Proposed Solution: Implement a one-turn advance warning system. For example display directional icons or a brief animation on affected grid cells at the end of the preceding turn, allowing players to rearrange defences or adjust planting accordingly.
4. Magic numbers in resources
    - Problem Description: Resource values are presented as bare integers, requiring players to memorize abstract “magic numbers” with no descriptive context.
    - Root Cause: The prototype’s resource display lacks affordances—such as icons, units, or color cues—that communicate meaning.
    - Proposed Solution: Augment the resource panel with self-describing labels, color-coded gauges to help player notify the meaning of the number, and incorporate a concise demo in the tutorial.
5. Difficulty spike after tutorial
    - Problem Description: The transition from tutorial to Level 1 is abrupt, causing novice players to feel overwhelmed.
    - Root Cause: Difficulty tuning has prioritized experienced fans of turn-based tactics, neglecting skill acquisition for the players with few experiences.
    - Proposed Solution: Redesign the early progression as a graduated ramp. Spilt the tutorial into multiple mini-challenges of increasing complexity, ensuring each new mechanics is introduced in isolation before laying additional challenges.
6. Round-skip bug and missing undo
    - Problem Description: Player cannot revert a mistaken action, eroding confidence in turn control.
    - Root Cause: Undo mechanism were not yet implemented in the prototype iteration.
    - Proposed Solution: Develop and place an “Undo” button in the obvious area. Ensure the turn logic remains integral to avoid inconsistency between states.

In the latest version of the game, we have solved or mitigated the problems collected from the test, including enhanced tutorials, clearer feedback loops, and improved control mechanisms. We believed, the improvement can strike a better balance between learning curve and robust strategic depth. 

### NASA-TLX Results: Cognitive & Physical Load

| Sub-scale (0–20) | Easy mean | Hard mean |
| --- | --- | --- |
| Mental Demand | 8.17 | 13.17 |
| Physical Demand | 3.83 | 5.58 |
| Temporal Demand | 3.75 | 4.92 |
| Performance | 5.50 | 9.25 |
| Effort | 6.67 | 12.83 |
| Frustration | 6.58 | 9.33 |
| **Raw TLX** | **5.75** | **9.18** |

Nevertheless, the turn-based strategic game endow a relative high threshold to entry and the players we aimed to attract might not the new players with few experiences, therefore, the game still cause a relative high burdens on player according to the test result from NASA Task Load Index. Mental demand, effort and frustration nearly double from easy to hard mode, reflecting the difficulty spike and lack of anticipatory feedback. Even in the easy mode, mental demand and effort received relative high score in the test, indicating that novices struggle with core concepts early on. To address the learning burden, we introduced multiple self-descriptive icons to ensure players understand each next step and to reduce their frustration.
