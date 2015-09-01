// by Chtiwi Malek on CODICODE.COM

var mousePressed = false;
var lastX, lastY;
var ctx;
// ctxTemp;

var canvasOffset;
var startX;
var startY;
var isDown = false;

var offsetX;
var offsetY;

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
    context.moveTo(this.startX, this.startY);
    context.lineTo(this.toX, this.toY);
    context.stroke();  
}

// Determine if a point is inside the shape's bounds
// 还没改 需要换成线的中点
StraightLine.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the shape's X and (X + Width) and its Y and (Y + Height)
  return  (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
}

function HorizontalLine() {

}

function TrendLine() {

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


    this.valid = false; // when set to true, the canvas will redraw everything
    this.lines = []; //the collection of things to be 
    this.dragging = false;// keep track of when we are dragging

    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;

    // **** Then events! ****

    // This is an example of a closure!
    // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
    // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
    // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
    // This is our reference!
    var myState = this;

    // Up, down, and move are for dragging
    canvas.addEventListener('mousedown', function(e) {
      var mouse = myState.getMouse(e);
      var mx = mouse.x;
      var my = mouse.y;
      var lines = myState.lines;
      var l = lines.length;
      for (var i = l-1; i >= 0; i--) {
        if (lines[i].contains(mx, my)) {
          var mySel = lines[i];
          // Keep track of where in the object we clicked
          // so we can move it smoothly (see mousemove)
          myState.dragoffx = mx - mySel.x;
          myState.dragoffy = my - mySel.y;
          myState.dragging = true;
          myState.selection = mySel;
          myState.valid = false;
          return;
        }
      }
      // havent returned means we have failed to select anything.
      // If there was an object selected, we deselect it
      if (myState.selection) {
        myState.selection = null;
        myState.valid = false; // Need to clear the old selection border
      }
    }, true);  // The event handler is executed in the capturing phase
}

CanvasState.prototype.addLine = function(line) {
    this.lines.push(line);
    this.valid = false;
}


function drawLine(toX, toY, context) {
    // context.restore();
    context.beginPath();
    context.strokeStyle = $('#selColor').val();
    context.lineWidth = $('#selWidth').val();
    context.moveTo(startX, startY);
    context.lineTo(toX, toY);
    context.stroke();
    // context.save();
}


// Move the temp canvas exactly on top of the regular canvas
// Save the starting drag XY
// Set a flag indicating that dragging has started
function handleMouseDown(e) {
    // ctx.restore();
    e.preventDefault();
    mouseX = parseInt(e.clientX - offsetX);
    console.log(mouseX);
    mouseY = parseInt(e.clientY - offsetY);
    console.log(mouseY);

    // save drag-startXY, 
    // move temp canvas over main canvas,
    // set dragging flag
    startX = mouseX;
    startY = mouseY;

    // ctxTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);
    // $("#canvasTemp").css({
    //     left: 0,
    //     top: 0
    // });
    isDown = true;
}

function handleMouseUp(e) {
    e.preventDefault();
    if (!isDown) {
        return;
    }
    // clear dragging flag
    // move temp canvas offscreen
    // draw the user's line on the main canvas
    isDown = false;
    //鼠标的位置 - offset =  在框中的位置
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);
    // $("#canvasTemp").css({
    //     left: -500,
    //     top: 0
    // });
    drawLine(mouseX, mouseY, ctx);
    ctx.save();

}

function handleMouseMove(e) {
    e.preventDefault();
    if (!isDown) {
        return;
    }
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);
    // clear the temp canvas
    // on temp canvas draw a line from drag-start to mouseXY
    // ctxTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);
    // drawLine(mouseX, mouseY, ctxTemp);

     // ctx.clearRect(0, 0, canvasTemp.width, canvasTemp.height);
    drawLine(mouseX, mouseY, ctx);
}



function init() {
    var state = new CanvasState(document.getElementById('canvas'));
    state.addLine(new StraightLine(20,20,60,60));

}



function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}