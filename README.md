# CS 174A Final Project - Spirited Away Train
## Team Members
* Eugene Lo (905108982)
* Jody Lin (705091157)
* Shreya Raman (004923456)
* Shirly Fang (804938473) 

## Design and Implementation
Our project shows a train travelling alongside an ocean. The interior of the train consists of multiple seats, doors, and windows. The exterior consists of cement pillars, an ocean, a sandy ground, and a cobblestone wall. 

The train can be started with key n and stopped with key m. The acceleration causes the handlebars to swing as the train speeds up and slows down. 
The keys w,a,s,d can be used to move the camera up, left, down, and right, respectively. Pressing key g will move the camera view to the length of the train. Keys a and d will continue to move the camera left and right, and keys i and k will move the camera forward and backwards. Pressing key t will move the camera back to the original position facing the window. 
Pressing key c will change the color palette. Pressing ctrl+p will play and pause the song, and pressing key ctrl+s will change the song. 

## Advanced Features
### Physics-based Simulation

**Dolphin**: Physics Kinematic equations were used to simulate realistic dolphin motion. The y position was determined by the kinematic equation `y = vt + 0.5at^2`. Then the x position of the dolphin maintained a constant velocity that moved the dolphin forward. The angle of rotation also was timed to follow the y motion of the dolphin. 


**Handlebars**: Newton’s Laws of Motion were used to simulate the swinging of the handlebars when the train starts and stops. The angle of the handlebars was determined by the equation `angle=tan-1(a/g)` which was derived from applying Newton’s Second Law. When the train is stopped or at its coasting velocity, the handlebars no longer swing because acceleration is 0. The handlebars swing in the opposite directions during train start and stop because the accelerations are opposite.  

**Pillars/Sand/Wall**: To simulate train movement, we utilized kinematics in order to translate the exterior’s pillar, sandy ground, and cobblestone wall. During train start and stop, we gradually increased acceleration, decreased acceleration, and determined these three objects’ position by using the equations `x = vt` and `v = at`. 

### Bump/Normal Mapping
Both the sand ground and cobblestone wall outside of the train implement normal mapping in order to make them look more 3-dimensional and realistic. Along with the regular image for the texture, another normal mapped image is passed in as an additional texture, where each pixel's color corresponds to the normal vector at that location. This normal vector is then used for lighting calculations, so that light bounces off depending on the underlying texture's composition. We implemented normal mapping by calculating the normals in tangent space, so that no matter what the orientation of the object, the light will bounce off in a consistent way. As a result of the normal maps, the sand texture of the ground looks grainier and more sparkly, and the cobblestone looks as if it is coming out of the plane.

### Perlin Noise
In order to make the water of the ocean more realistic, we decided to use the [Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise) effect with added turbulence. This turbulence moved around the Perlin noise texture as a function of time. We applied the same effect to both the color and height of the plane. The result is a dynamic simulation of the random waviness and the color changes you would normally see in the ocean when waves move up and down and crash into each other. On top of the Perlin noise texture, we also added Phong lighting, so that the lighting changes depending on how you look at it.

## References
* Perlin noise: https://medium.com/neosavvy-labs/webgl-with-perlin-noise-part-1-a87b56bbc9fb 
* Physics:  https://www.youphysics.education/newtons-laws/newtons-laws-problems/newtons-laws-problem-8/
* Normal mapping: https://learnopengl.com/Advanced-Lighting/Normal-Mapping 


