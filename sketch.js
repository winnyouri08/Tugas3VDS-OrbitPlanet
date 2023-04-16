let img;
let planets = []
let sun
let numPlanets = 4
let G = 120
let destabilise = 0.15


function preload(){
  sun_ = loadImage("smilesun.png")
  earth_ = loadImage("earth.jpg")
  mars_ = loadImage("mars.png")
  jupyter_ = loadImage("jupyter.png")
  neptunus_= loadImage("neptunus.png")
  img = loadImage("universenight.jpg")
  return planetimage = [earth_, mars_, jupyter_, neptunus_]
}

function setup() {
  createCanvas(windowWidth,windowHeight)
  sun = new Body(50,createVector(0,0),createVector(0,0))
  b=15
  mass_=[15,25,27,17]
  for (let i = 0; i < numPlanets; i++) {
    let mass = mass_[i]
    let radius = sun.d+b
    let angle = PI
    let planetPos = createVector(radius * cos(angle), radius * sin(angle))
    b+=75
    let planetVel = planetPos.copy()
    if (random(1) < 0.1) planetVel.rotate(-HALF_PI)
    else planetVel.rotate(HALF_PI)
    planetVel.normalize()
    planetVel.mult( sqrt((G * sun.mass)/(radius)) ) 
    planetVel.mult( random( 1-destabilise, 1+destabilise) ) 
    planets.push( new Body(mass, planetPos, planetVel) )
  }
}

function windowResized() {
 resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background('grey')
  let name = ['Earth', 'Mars', 'Jupyter', 'Neptunus']
  image(img,0,0,width,height)
  translate(width/2, height/2)
  for (let i = numPlanets-1; i >= 0; i--) {
    sun.attract(planets[i])
    planets[i].move()
    planets[i].show(planetimage[i])
    text(String(name[i]),planets[i].pos.x,planets[i].pos.y)
  }
  translate(-sun.mass, -sun.mass)
  sun.show(sun_)
  text('Sun',sun.pos.x,sun.pos.y)
  textSize(30)
}


function Body(_mass, _pos, _vel){
  this.mass = _mass
  this.pos = _pos
  this.vel = _vel
  this.d = this.mass*2
  this.path = []
  this.pathLen = Infinity

  this.show = function(pic) {
    stroke(0,50)
    for (let i = 0; i < this.path.length-2; i++) {
      
      line(this.path[i].x, this.path[i].y, this.path[i+1].x, this.path[i+1].y,)
      stroke("white")
    }
    fill('white'); noStroke()
    image(pic,this.pos.x, this.pos.y, this.d, this.d)
  }


  this.move = function() {
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.path.push(createVector(this.pos.x,this.pos.y))
    if (this.path.length > 200) this.path.splice(0,1)
  }

  this.applyForce = function(f) {
    this.vel.x += f.x / this.mass
    this.vel.y += f.y / this.mass
  }

  this.attract = function(child) {
    let r = dist(this.pos.x, this.pos.y, child.pos.x, child.pos.y)
    let f = (this.pos.copy()).sub(child.pos)
    f.setMag( (G * this.mass * child.mass)/(r * r) )
    child.applyForce(f)
  }
}
