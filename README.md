# Runaway-Infection

## Description

Runaway Infection is a simple web game which simulates the rapid spread of COVID through a population and how hard it can be to contain the spread once it is out of control. 

Play it here! - https://pages.git.generalassemb.ly/brianlimkc/Runaway-Reaction/


### Technical Used

- Javascript
- HTML Canvas

### Wireframes

### User Stories

Users are introduced to a playing area filled with different types of balls:

* Blue balls represent uninfected people
* Balls can can move around in a box and bounce off each other
* Green balls are COVID infected people, which can infect other balls on contact
* Red balls are medical staff, who form links with nearby medical staff
* When clicked on, linked Red balls explode and turn infected green balls back into uninfected blue balls
* Orange balls are people which you can recruit to turn into medical staff by clicking on them

As the game progresses, the number of balls and the speed at which they move increases. The infectiveness of the disease also increases significantly. The player may toggle several available options which simulates various measures which can be taken to control the spread:

* Mask Mandate - reduces the infectiousness of the disease
* Circuit Breaker - reduces the movementment speed of balls
* Close Borders - reduces randomly appearing infections

Through this simulation, the user can clearly see the effectiveness of control measures, and the importance of trying to contain the disease early, as it is nearly impossible to contain the disease without control measures once it has started to spread. 

## Planning and Development Process

 - I wanted to do a game which can simulate how fast COVID can spread and the effects of social control measures. 
 - I settled on using bouncing balls to simulate people and by using the bounces to simulate social contact between them
 - Next I came up with a mechanic for the player to clear the infections, by using explosions using linked balls, to make it more fun and interactive. 
 - The game difficulty was then tweaked to have stages with increasing difficulty.
- Finally, the toggles for the social control measures were coded in.

### Problem-Solving Strategy

- I broke down the game into smaller challenges and tackled it part by part.
- How to generate balls with random properties and get them to move on the canvas
- How to get them to bounce off each other
- How to simulate infections between an infected and non infected ball upon contact
- How to generate links between balls, getting balls to explode, and clearing exploded balls off canvas
- How to clear infections using explosions
- Creating levels and tweaking difficulty options per level 
- Implementing different social control measures

### Unsolved problems

- Increase the realism by implementing a cost to the social control measures, e.g. by simulating economic numbers such as stock market prices and unemployment numbers, and government approval rating which drop whenever social control measures are implemented, preventing the player from having them on all the time.
- Implement vaccination programmes, possibility of death once infected, post infection immunity etc.
- Implement random events in the game, such as development of new vaccines, rise of even more infectious variants, rise of anti vaxx movements

