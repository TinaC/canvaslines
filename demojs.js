// by TINA

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

var dotscolor = '#ccc';
var dotsselected = '#8B8989';
var dotsradius = 3;
var scope = 6; // 点周围的范围

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
    ctx.fillStyle = dotscolor;
    ctx.arc(this.startX,this.startY,dotsradius,0,2*Math.PI);
    ctx.arc(this.toX,this.toY,dotsradius,0,2*Math.PI);
    ctx.arc((this.startX+this.toX)/2,(this.startY+this.toY)/2,dotsradius,0,2*Math.PI);
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
    console.log ((this.startX+this.toX)/2 + scope) ;

    return ( mx <= ((this.startX+this.toX)/2 + scope)) && ( mx >= ((this.startX+this.toX)/2 - scope)) &&
           ( my <= ((this.startY+this.toY)/2 + scope)) && ( my >= ((this.startY+this.toX)/2 - scope)) ;

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



  // **** Keep track of state! ****
    this.valid = false; // when set to true, the canvas will redraw everything
    this.lines = []; //the collection of things to be 
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
    for (var i = l-1; i >= 0; i--) {
        console.log(lines[i].contains(mx, my));
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
  
  canvas.addEventListener('mousemove', function(e) {
    if (myState.dragging){
      var mouse = myState.getMouse(e);
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      myState.selection.x = mouse.x - myState.dragoffx;
      myState.selection.y = mouse.y - myState.dragoffy;   
      myState.valid = false; // Something's dragging so we must redraw
    }
  }, true);

  this.selectionWidth = 2;  
  this.interval = 3000;
  setInterval(function() { myState.draw(); }, myState.interval);

}

CanvasState.prototype.addLine = function(line) {
    this.lines.push(line);
    this.valid = false;
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
  // if our state is invalid, redraw and validate!
  if (!this.valid) {
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
    if (this.selection != null) {
      ctx.strokeStyle = this.selectionColor;
      ctx.lineWidth = this.selectionWidth;
      var mySel = this.selection;
      ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
    }
    
    // ** Add stuff you want drawn on top all the time here **
    
    this.valid = true;
  }
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
  
  console.log("x: " + mx);
  console.log("y: " + my);
  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};
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

function init() {
    var state = new CanvasState(document.getElementById('canvas'));
    state.addLine(new StraightLine(20,20,60,60));

}
