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
    context.fillStyle = this.color
    context.fillRect(this.x-virtWindow.x, this.y-virtWindow.y, this.w, this.h);
}

Monkey.prototype.move = function() {
    if ( this.state == "nog" ) {
        this.speedArray[3] = -1
    }
    this.x+=this.speedArray[0]
    this.y+=this.speedArray[1]
}

Monkey.prototype.collision = function() {
    //go through all objects
//    console.log(checkCollision(dk,ground))
    if ( checkCollision(dk,ground) == "U" ) { //if its U then set its Y to its Y
        dk.y = ground.y-ground.h-1
        dk.state = "og"
        dk.speedArray[1] = 0
        dk.speedArray[3] = 0
    }
    else {
        dk.state = "nog"
    }
    for ( var temp2 in floors ) {
        var temp = checkCollision(dk, floors[temp2])
        console.log(temp)
        if ( temp != "N" ) {
            if ( temp == "U" ) {
                this.y = floors[temp2].y-this.h
                this.state = "og"
                this.speedArray[1] = 0
                this.speedArray[3] = 0
            }
            else if ( temp == "D" ) {
                this.y = floors[temp2].y+floors[temp2].h
                this.speedArray[1] = 0
            }
            else if ( temp == "R" ) {
                this.x = floors[temp2].x+this.w+floors[temp2].w
                this.speedArray[0] = 0
                this.speedArray[2] = 0
            }
            else if ( temp == "L" ) {
                this.x = floors[temp2].x-this.w-1
                this.speedArray[0] = 0
                this.speedArray[2] = 0
            }
        }
    }
}

Monkey.prototype.accelerate = function() {
    if ( this.state == "nog" ) {
        this.speedArray[3] = 1
    }
    else {
        this.speedArray[3] = 0
        this.speedArray[1] = 0
    }
    if ( num == 0 && this.speedArray[0] != 0 ) {
        this.speedArray[2] = 0
        this.speedArray[0]+=((Math.abs(this.speedArray[0])/this.speedArray[0])*-1)*(0.5)
        if ( Math.abs(this.speedArray[0]) < .5 && this.speedArray[3] == 0 ) {
            this.speedArray[0] = 0
        }
    }
    var xSpeed = this.speedArray[0]
    var ySpeed = this.speedArray[1]
    var xAcc = this.speedArray[2]
    var yAcc = this.speedArray[3]
    var maxX = this.speedArray[4]
    var maxY = this.speedArray[5]
//    else {
        if ( Math.abs(xSpeed+xAcc) > Math.abs(maxX) && this.speedArray[0] != 0 ) {
            this.speedArray[0] = maxX*((this.speedArray[0])/Math.abs(this.speedArray[0]))
        }
        else {
            this.speedArray[0]+=this.speedArray[2]
        }
        if ( Math.abs(ySpeed+yAcc) > Math.abs(maxY) && this.speedArray[1] != 0 ) {
            this.speedArray[1] = maxY*((this.speedArray[1])/Math.abs(this.speedArray[1]))
        }
        else {
            this.speedArray[1]+=this.speedArray[3]
        }
//    }

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
    num = 0
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
}

var render = function() {
    //collective dk things
    dk.accelerate()
    dk.move()
    virtWindow.x = dk.x-300
    dk.collision()
    //end collective dk things
    background.render()
    for ( var temp in floors ) {
        if ( isInFrame(floors[temp]) ) {
            floors[temp].render()
        }
    }
    dk.render()
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
        if ( Math.abs((object.x+object.w/2)-(monkey.x+monkey.w/2)) >= monkey.w/2+object.w/2 ) {
            //that means its an x collision
            if ( monkey.x > object.x ) {
                if ( monkey.speedArray[0] > 0 ) {
                    return "R"
                }
//                else if ( monkey.x == monkey.x ) {
//                    return "TOUCH"
//                }
                else {
                    return "L"
                }
            }
            else if ( monkey.x < object.x ) {
                if ( monkey.speedArray[0] < 0 ) {
                    return "R"
                }
//                else if ( monkey.x == monkey.x ) {
//                    return "TOUCH"
//                }
                else {
                    return "L"
                }
            }
        }
        else if ( Math.abs((object.y+object.h/2)-(monkey.y+monkey.h/2)) >= monkey.h/2+object.h/2 ) {
//            console.log("help me homie")
            // that means its an y collision
            if ( monkey.y > object.y ) {
                if ( monkey.speedArray[1] < 0 ) {
                    return "U"
                }
//                else if ( monkey.y == monkey.y ) {
//                    return "TOUCH"
//                }
                else {
                    return "D"
                }
            }
            else if ( monkey.y < object.y ) {
                if ( monkey.speedArray[1] > 0 ) {
                    return "U"
                }
//                else if ( monkey.x == monkey.x ) {
//                    return "TOUCH"
//                }
                else {
                    return "D"
                }
            }
        }
//        return "O"
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
