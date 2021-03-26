# top

```
model
view
controller
```
## controller
```
map keyboard input
handle and send network events
implicit state
state transition logic
```
## model
```
table (balls[], cue)
players turn
score
```
## physics
```
constants
geometry of table and pockets
collision methods
ball rolling and sliding methods
```

## view
```
scene
 ball meshes
 cue mesh
 room+table mesh
camera
chat
```

playbreak and playback


?shots=[{a:2.1,s:0.1,h0.0,p=0.5,t=12},{},{},...]
&init=[{x:,y:,z:},{},{},...]

set up at init
while shot
 animate to aim
 animate power
 animate shot

halt

state machine

initplayback
animate to