﻿// by TINA

// var mousePressed = false;
// var lastX, lastY;
// var ctx;
// // ctxTemp;

// var canvasOffset;
// var startX;
// var startY;
// var isDown = false;

// var offsetX;
// var offsetY;

var checkbox = 0;

function initialize() {
    var config = {};
    config.canvasele = document.getElementById('canvas');
    config.dotscolor = '#ccc';
    config.dotsselected = '#8B8989';
    config.dotsradius = 3;
    config.scope = 6; // 点周围的范围

    return config;
}

function StraightLine(startX,startY,toX,toY) {
    this.color = $('#selColor').val();
    this.width = $('#selWidth').val();
    this.startX = startX;
    this.startY = startY;
    this.toX = toX;
    this.toY = toY;
}

StraightLine.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.toX, this.toY);
    ctx.stroke();  

// draw three dots
    ctx.beginPath();
    ctx.fillStyle = Config.dotscolor;
    ctx.arc(this.startX,this.startY,Config.dotsradius,0,2*Math.PI);
    ctx.arc(this.toX,this.toY,Config.dotsradius,0,2*Math.PI);
    ctx.arc((this.startX+this.toX)/2,(this.startY+this.toY)/2,Config.dotsradius,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();

    // 选中的线圆圈变掉
    if (this.selection != null) {
        ctx.beginPath();
        ctx.strokeStyle = dotsselected;
        ctx.arc((startX+toX)/2,(startY+toY)/2,3,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

StraightLine.prototype.contains = function(mx, my) {
    console.log (mx);
    console.log ((this.startX+this.toX)/2 + Config.scope) ;

    return ( mx <= ((this.startX+this.toX)/2 + Config.scope)) && ( mx >= ((this.startX+this.toX)/2 - Config.scope)) &&
           ( my <= ((this.startY+this.toY)/2 + Config.scope)) && ( my >= ((this.startY+this.toX)/2 - Config.scope)) ;

}

function TrendLine(startX,startY,toX,toY) {
    this.color = $('#selColor').val();
    this.width = $('#selWidth').val();
    this.startX = startX;
    this.startY = startY;
    this.toX = toX;
    this.toY = toY;
    this.dx = this.toX - this.startX;
    this.dy = this.toY - this.startY;
    this.scope = this.dy/this.dx;
}

TrendLine.prototype.draw = function(ctx) {

    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.moveTo(this.startX, this.startY);

    if(this.dx == 0) {
        if(this.dy>0){
            ctx.lineTo(this.startX, Config.canvasele.height);
        }else{
            ctx.lineTo(this.startX, 0);
        }
    }
    else if(this.dx > 0) {
        var newx = Config.canvasele.width;
        ctx.lineTo(newx, this.scope*(newx-this.startX)+this.startY);
    }
    else{
        console.log(-this.scope*this.startX);
        ctx.lineTo(0, -this.scope*this.startX + this.startY);
    }
    ctx.stroke();

    // draw three dots
    ctx.beginPath();
    ctx.fillStyle = Config.dotscolor;
    ctx.arc(this.startX,this.startY,Config.dotsradius,0,2*Math.PI);
    ctx.arc(this.toX,this.toY,Config.dotsradius,0,2*Math.PI);
    ctx.arc((this.startX+this.toX)/2,(this.startY+this.toY)/2,Config.dotsradius,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
}

TrendLine.prototype.contains = function(mx,my) {

}

function HorizontalLine(X,Y) {
    this.color = $('#selColor').val();
    this.width = $('#selWidth').val();
    this.X = X;
    this.Y = Y;
}

HorizontalLine.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.moveTo(0, this.Y);
    ctx.lineTo(Config.canvasele.width,this.Y);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = Config.dotscolor;
    ctx.arc(this.X,this.Y,Config.dotsradius,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();

}

HorizontalLine.prototype.contains = function(mx, my) {
    return ( mx <= (this.X + Config.scope)) && ( mx >= (this.X - Config.scope)) &&
        ( my <= (this.Y + Config.scope)) && ( my >= (this.Y - Config.scope)) ;

}

// hold all of the state 
function CanvasState(canvas) {

    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');


    // This complicates things a little but but fixes mouse co-ordinate problems
    // when there's a border or padding. See getMouse for more detail
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
    }
    // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
    // They will mess up mouse coordinates and this fixes that
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;


  // **** Keep track of state! ****
    this.valid = false; // when set to true, the canvas will redraw everything
    this.lines = []; //the collection of things to be

    this.drawing = false; //记录是否在画线（straight/trend）,
    this.drawingobj = null;
    this.drawx1 = 0;
    this.drawy1 = 0;
    this.drawx2 = 0;
    this.drawy2 = 0;

    this.dragging = false;// keep track of when we are dragging
    // the current selected object. In the future we could turn this into an array for multiple selection
    this.selection = null;
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;

  // **** Then events! ****
  
  // This is an example of a closure!
  // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
  // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
  // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
  // This is our reference!
  var myState = this;
  
  // //fixes a problem where double clicking causes text to get selected on the canvas
  // canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
  
  // Up, down, and move are for dragging
  canvas.addEventListener('mousedown', function(e) {
    var mouse = myState.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var lines = myState.lines;
    var l = lines.length;
    var isline = false; //是否点到线上的点(false: 增加线，true: 移动线)

    for (var i = l-1; i >= 0; i--) {
        console.log(lines[i].contains(mx, my));
        if (lines[i].contains(mx, my)) {
            isline = true;
            var mySel = lines[i];
            if (mySel instanceof HorizontalLine) {
                myState.dragoffx = mx - mySel.X;
                myState.dragoffy = my - mySel.Y;
                myState.dragging = true;
                myState.selection = mySel;
                //myState.valid = false;
                return;
            }
        }
    }

      // havent returned means we have failed to select anything.
      // If there was an object selected, we deselect it
      if (myState.selection) {
          myState.selection = null;
      }

      if(!isline) {
          if (checkbox == 0) {

          } else if (checkbox == 1) {
              myState.drawingobj = new TrendLine(mx,my,mx,my);
              myState.drawing = true;
              myState.drawx1 = mx;
              myState.drawy1 = my;
              myState.drawx2 = mx;
              myState.drawy2 = my;
              return;
          }
          else if(checkbox == 2){
                  myState.addLine(new HorizontalLine(mx, my));
                  myState.draw();  //重画
                   return;
              }
      }
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    if (myState.selection) {
      myState.selection = null;
      myState.valid = false; // Need to clear the old selection border
    }
      myState.draw();  //重画
  }, true);  // The event handler is executed in the capturing phase
  
  canvas.addEventListener('mousemove', function(e) {
      var mouse = myState.getMouse(e);
    if (myState.dragging){
        if(myState.selection instanceof HorizontalLine) {
            console.log(mouse.x);
            console.log(myState.dragoffx);
            myState.selection.X = mouse.x - myState.dragoffx;
            myState.selection.Y = mouse.y - myState.dragoffx;
            console.log("new x, y " + myState.selection.X + ", " + myState.selection.Y);
        }
            //myState.draw();
        }
    //画新的trend line
    else if(checkbox == 1 && myState.drawing) {
        myState.drawx2 = mouse.x;
        myState.drawy2 = mouse.y;
        myState.drawingobj = new TrendLine(myState.drawx1,myState.drawy1,myState.drawx2,myState.drawy2);
    }
      //horizion line的指示线
      else if (checkbox == 2) {
        //myState.selection = myState.removeLast();
        //console.log("mouse x" + mouse.x);
        //myState.selection.X = mouse.x || 0;
        //myState.selection.Y = mouse.y || 0;

        myState.removeLast();
        myState.addLine(new HorizontalLine(mouse.x, mouse.y));
    }
      myState.draw();
      //// We don't want to drag the object by its top-left corner, we want to drag it
      //// from where we clicked. Thats why we saved the offset and use it here
      //myState.selection.x = mouse.x - myState.dragoffx;
      //myState.selection.y = mouse.y - myState.dragoffy;
      //myState.valid = false; // Something's dragging so we must redraw
      //myState.draw();  //重画

  }, true);

    canvas.addEventListener('mouseup', function(e) {
        if(myState.dragging){
            //myState.addLine(myState.drawingobj);
            myState.dragging = false;
        }
        if(myState.drawing) {
            myState.addLine(myState.drawingobj);
            myState.drawing = false;
        }
    }, true);

    canvas.addEventListener('mouseenter',function(e){
        if(checkbox == 2) {
            var mouse = myState.getMouse(e);
            myState.addLine(new HorizontalLine(mouse.x, mouse.y));
        }
    });

    canvas.addEventListener('mouseout',function(e){
        if(checkbox == 2) {
            myState.removeLast();
        }
    });

  //this.selectionWidth = 2;
  //this.interval = 3000;
  //setInterval(function() { myState.draw(); }, myState.interval);

}

CanvasState.prototype.addLine = function(line) {
    this.lines.push(line);
}

CanvasState.prototype.removeLast = function() {
    console.log(this.lines);
    return this.lines.pop();
    //this.draw();
    //console.log(this.lines);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
    var ctx = this.ctx;
    var lines = this.lines;
    this.clear();
    
    // ** Add stuff you want drawn in the background all the time here **
    
    // draw all shapes
    var l = lines.length;
    for (var i = 0; i < l; i++) {
      var line = lines[i];
      // We can skip the drawing of elements that have moved off the screen:
      if (line.x > this.width || line.y > this.height ||
          line.x + line.w < 0 || line.y + line.h < 0) continue;
      lines[i].draw(ctx);
    }
    
    // draw selection
    // right now this is just a stroke along the edge of the selected Shape
    //画选中的水平线
    if (this.selection != null && this.selection instanceof HorizontalLine) {
        console.log("hori selection!");
        var hori = this.selection;
        ctx.beginPath();
        ctx.strokeStyle = hori.color;
        ctx.lineWidth = hori.width;
        ctx.moveTo(0, hori.Y);
        ctx.lineTo(Config.canvasele.width,hori.Y);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = Config.dotsselected;
        ctx.arc(hori.X,hori.Y,Config.dotsradius,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
    } else if(this.drawingobj != null && this.drawingobj instanceof TrendLine ) {
        this.drawingobj.startX = this.drawx1;
        this.drawingobj.startY = this.drawy1;
        this.drawingobj.toX = this.drawx2;
        this.drawingobj.toY = this.drawy2;
        this.drawingobj.draw(ctx);
    }
    
    // ** Add stuff you want drawn on top all the time here **

}

CanvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  
  // Compute the total offset 循环计算canvas和所有父类之间的offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
  
  //console.log("x: " + mx);
  //console.log("y: " + my);
  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};
}

$(document).ready(function(){

    $("input:radio[value=straight]").click(function() {
        checkbox = 0;
        console.log(checkbox);
    });

    $("input:radio[value=trend]").click(function() {
        checkbox = 1;
        console.log(checkbox);
    });

    $("input:radio[value=horizontal]").click(function() {
        checkbox = 2;
        console.log(checkbox);
    });



    Config = initialize();

    var parent = $(Config.canvasele).parent();
    Config.canvasele.width = parent.width();
    Config.canvasele.height = parent.height();

    var state = new CanvasState(Config.canvasele);
    console.log(state);
    //state.addLine(new StraightLine(20,20,60,60));
    //state.addLine(new StraightLine(60,20,60,60));
    //state.addLine(new HorizontalLine(50,100));
    //state.addLine(new TrendLine(50,100,80,30));
    state.addLine(new TrendLine(200,20,100,30));


    $("#removelast").click(function() {
        state.removeLast();
        state.draw();
    });

})