# Floater Ball

A physics-based collection game where you control a white ball that floats around a canvas with momentum-based movement. Collect as many squares as possible within the time limit while navigating through increasingly challenging levels. Don't eat the red squares!

**Version:** 0.3.1  
**Author:** Drew D. Lenhart, SnowyWorks  
**Website:** [snowyworks.com/games](https://snowyworks.com/games)  
**Source:** [github.com/dlenhart/floaterball](https://github.com/dlenhart/floaterball)

## How to Play

### Controls

| Key | Action |
|-----|--------|
| Arrow Keys | Move the ball |
| Shift | Brake / stop all movement |
| Spacebar | Continue to next level (after completing a level) |
| P | Pause / resume the game |
| Esc | Exit to main menu |

### Scoring

| Item | Points | Details |
|------|--------|---------|
| Gray Square | 1 point | Standard collectible, always present |
| Green Square | 5 points | 1–3 spawn randomly per level (Level 2+) |
| Purple Square | 10 points | Bonus food that appears after 5 seconds (Level 2+) |
| Orange Square | Power-up | Doubles ball size temporarily (no points) |
| Red Square | **Game Over!** | Forbidden fruit — appears on even-numbered levels (Level 2+) |

### Obstacles

Black obstacles start appearing at Level 2. The number increases with each level. Your ball bounces off them — use them strategically!

## Progression

- **50 levels** total
- Starting time: **20 seconds** per level
- Every 3 levels, the time limit decreases by 1 second (minimum 5 seconds)
- Obstacles increase each level (starting at Level 2: 3 obstacles, +1 per level)

### Win Condition

Complete a level by collecting at least one square before time runs out.

### Lose Conditions

- Run out of time with zero points collected
- Touch a red square (instant game over)

## Features

- Momentum-based physics
- Ball trail effect
- Score pop-ups on collection
- High score saved locally (localStorage)
- Auto-pause when switching tabs or losing window focus
- Wall and obstacle bouncing

## Install

1. Download or clone the repository.
2. Open `index.html` in a browser.

No build tools or server required.


```

## License

MIT License

Copyright (c) 2025 Drew D. Lenhart, SnowyWorks

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.