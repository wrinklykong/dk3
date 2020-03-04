var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||         window.mozRequestAnimationFrame || function(callback) { window.setTimeout(callback,     1000/60) };
var canvas = document.createElement('canvas');
var width = 900;
var height = 600;
var virtX = 0
var virtY = 0
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

//sprites
dkSP = new Image();
dkSP.src = "./dk.png"

function Object(color,x,y,w,h) {
    this.color = color
    this.x = x
    this.y = y
    this.w = w
    this.h = h
}

function vWindow(x,y,w,h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
}

function Sprite(img,x,y,w,h) {
    this.img = img
    this.x = x
    this.y = y
    this.w = w
    this.h = h
}

Monkey.prototype.render = function() {
    //check collision
    this.move()
    dk.collision()
    virtWindow.x=dk.x-300 //do the shits here bro!!!
//    virtWindow.y=dk.y-300
    context.fillStyle = this.color
    background.render()
    context.fillRect(this.x-virtWindow.x, this.y-virtWindow.y, this.w, this.h);
    //move before checking the collision for ease
//    console.log(dk.speedArray[1])
//    console.log(dk.y)
}

Monkey.prototype.move = function() {
    if ( this.state == "nog" ) {
        this.speedArray[3] = -1
    }
    this.x+=this.speedArray[0]
    this.y+=this.speedArray[1]
    this.accelerate()
//    console.log(this.speedArray[0])
}

Monkey.prototype.collision = function() {
    //go through all objects
    if ( checkCollision(dk,ground) == "N" ) {
        dk.state = "nog"
    }
    for ( var temp in floors ) {
        var collision = checkCollision(dk,floors[temp])
            if ( collision == "L" || collision == "R" ) {
                dk.speedArray[0] = 0
                dk.speedArray[2] = 0
            }
            else if ( collision == "U" || collision == "D" ) {
                dk.speedArray[1] = 0
                dk.speedArray[3] = 0
                dk.state = "og"
//                console.log("hey")
            }
        }

    console.log(dk.state)
}

Monkey.prototype.accelerate = function() {
    if ( Math.abs(this.speedArray[0]+this.speedArray[2]) > Math.abs(this.speedArray[4]) ) {
        this.speedArray[0] = this.speedArray[4]*(Math.abs(this.speedArray[2])/this.speedArray[2])
    }
    else {
        this.speedArray[0]+=this.speedArray[2]
    }
    if ( Math.abs(this.speedArray[1]+this.speedArray[3]) <= Math.abs(this.speedArray[5]) ) {
//        this.speedArray[1] = this.speedArray[5]*(Math.abs(this.speedArray[3])/this.speedArray[3])
        this.speedArray[1]-=this.speedArray[3]
    }

    if ( (this.speedArray[2]-fricVec[0] < 0 && this.speedArray[0] > 0) || (this.speedArray[2]-fricVec[0] > 0 && this.speedArray[0] < 0) ) {
        this.speedArray[2] = 0
        fricVec[0] = 0
        this.speedArray[0] = 0
    }
    else {
        this.speedArray[2]-=fricVec[0]
        this.speedArray[3]-=fricVec[1]
    }

}

Object.prototype.render = function() {
//    context.fillStyle = this.color
//    if ( isInFrame(this) ) {
        context.drawImage(this.color, this.x-virtWindow.x, this.y-virtWindow.y-1, this.w, this.h)
//    }
}

Sprite.prototype.render = function() {
    context.drawImage(this.img, this.x-virtWindow.x, this.y-virtWindow.y, this.w, this.h)
}

var virtWindow = new vWindow(virtX,virtY,900,600)
var dk = new Monkey("#783283", 110, 50, 100, 100, [0,0,0,0,8,30], "nog")
var groundImg = new Image()
groundImg.src = "./floor.png"
var ground = new Object(groundImg, 100, 450, 1500, 100)
var obs1 = new Object(groundImg, 1000, 290, 200, 200)
var bgg = new Image()
bgg.src = "./bg.png"
var background = new Sprite(bgg, 0, 0,1500,600)

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
}

var step = function() {
    update();
    render();
    animate(step);
}

var keysDown = {};
var fricVec = [0,0]
var falling = false

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

var idleNum = 0;
var num = 0
var update = function() {
    for ( var key in keysDown ) {
        if ( key == 65 && dk.speedArray[2] > -5 ) {
            dk.speedArray[2] = -.7
            num+=1
        }
        if ( key == 68 && dk.speedArray[2] < 5 ) {
            dk.speedArray[2] = .7
            num+=1
        }
        if ( key == 32 && dk.state == "og" ) {
            dk.state = "nog"
            dk.y-=10
            dk.speedArray[1] = -20
//            dk.speedArray[3] = -5
        }
    }
    if ( num == 0 && dk.speedArray[0] != 0 ) {
        if ( Math.abs(dk.speedArray[0])-0.5 < 0 ) {
            dk.speedArray[0]+=
        }
    }
    else {
        fricVec[0] = 0
    }
    num = 0
}

var render = function() {
    context.fillStyle = "#123ab0";
//    context.fillRect(0,0,900,600);
    //if facing right (virtWindow.x=dk.x-300 or something)
    //if facing left (virtWindow.x=dk.x+200 or something) (maybe add a smooth transition of some sorts)
//    virtWindow.y+=1
    dk.render()
    for ( var i = 0; i < floors.length; i++ ) {
        var temp = floors[i]
        if ( isInFrame(temp) ) {
            floors[i].render()
        }
    }
//    ground.render()
    update()
}

function Monkey(color,x,y,w,h,speedArray,state) {
    this.color = color
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.speedArray = speedArray
    this.state = state
}
//speedArray is an array with four seperate values, 0: xPos change, 1: yPos change, 2: xPos Acceleration, 3: yPos Acceleration, 4: maxXVeloc, 5: maxYVeloc


var checkCollision = function(monkey, object) {
    var changeX = Math.abs((object.x+object.w/2)-(monkey.x+monkey.w/2+monkey.speedArray[0]))
    var changeY = Math.abs((object.y+object.h/2)-(monkey.y+monkey.h/2+monkey.speedArray[1]))
    if ( changeX <= monkey.w/2+object.w/2 && changeY <= monkey.h/2+object.h/2 ) {
        //left collision
        if ( monkey.state == "og" ) {
            if ( (monkey.x-monkey.speedArray[0]-monkey.speedArray[2]+monkey.w) <= object.x ) {
//                console.log(object + " L")
                return "L"
            }
            else if ( (monkey.x-monkey.speedArray[0]-monkey.speedArray[2]+monkey.w) >= object.x ) {
//                console.log(object + " R")
                return "R"
            }
        }
        if ( monkey.state == "nog" ) {
            if ( (monkey.y-monkey.speedArray[1]-monkey.speedArray[3]+monkey.h) <= object.y ) {
//                console.log(object + " U")
                return "U"
            }
            else if ( (monkey.y-monkey.speedArray[1]-monkey.speedArray[3]+monkey.h) >= object.y ) {
//                console.log(object + " D")
                return "D"
            }
        }
        //right collision
        //up collision
        //down collision
        return "N"
    }

    return "N"
}
//object must have .x, .y, .w, .h :)
//establish a collection of floors
var floors = [ground, obs1]


var isInFrame = function(object) {
    var changeX = Math.abs((object.x+object.w/2)-(virtWindow.x+virtWindow.w/2))
    var changeY = Math.abs((object.y+object.h/2)-(virtWindow.y+virtWindow.h/2))
    if ( changeX <= virtWindow.w/2+object.w/2 && changeY <= virtWindow.h/2+object.h/2 ) {
        return true
    }
    return false
}
