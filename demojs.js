// by TINA

//issues:
//1. 鼠标移动速度太快的时候会出错，需要mouseout的时候去判断

var checkbox = 0;

function initialize() {
    var config = {};
    config.canvasele = document.getElementById('canvas');
    config.dotscolor = '#ccc';
    config.dotsradius = 3;
    config.dotscolor2 = 'orange';
    config.dotsradius2 = 4;
    config.scope = 6; // 点周围的范围
    return config;
}

function StraightLine(startX, startY, toX, toY) {
    this.color = $('#selColor').val();
    this.width = $('#selWidth').val();
    this.startX = startX;
    this.startY = startY;
    this.toX = toX;
    this.toY = toY;
}

StraightLine.prototype.draw = function (ctx,position) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.toX, this.toY);
    ctx.stroke();

// draw three dots
    ctx.beginPath();
    ctx.fillStyle = Config.dotscolor;
    ctx.arc(this.startX, this.startY, Config.dotsradius, 0, 2 * Math.PI);
    ctx.arc(this.toX, this.toY, Config.dotsradius, 0, 2 * Math.PI);
    ctx.arc((this.startX + this.toX) / 2, (this.startY + this.toY) / 2, Config.dotsradius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    if(position != -1) {
        ctx.beginPath();
        ctx.fillStyle = Config.dotscolor2;
        if (position == 0) {
            ctx.arc(this.startX, this.startY, Config.dotsradius2, 0, 2 * Math.PI);
        }
        else if (position == 1) {
            ctx.arc((this.startX + this.toX) / 2, (this.startY + this.toY) / 2, Config.dotsradius2, 0, 2 * Math.PI);
        }
        else if (position == 2) {
            ctx.arc(this.toX, this.toY, Config.dotsradius2, 0, 2 * Math.PI);
        }
        ctx.fill();
        ctx.closePath();
    }
}

StraightLine.prototype.contains = function (mx, my) {
    return ( mx <= ((this.startX + this.toX) / 2 + Config.scope)) && ( mx >= ((this.startX + this.toX) / 2 - Config.scope)) &&
        ( my <= ((this.startY + this.toY) / 2 + Config.scope)) && ( my >= ((this.startY + this.toY) / 2 - Config.scope));

}

function TrendLine(startX, startY, toX, toY) {
    this.color = $('#selColor').val();
    this.width = $('#selWidth').val();
    this.startX = startX;
    this.startY = startY;
    this.toX = toX;
    this.toY = toY;
}

TrendLine.prototype.draw = function (ctx,position) {
    var dx = this.toX - this.startX;
    var dy = this.toY - this.startY;
    var scope = dy / dx;

    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.moveTo(this.startX, this.startY);

    if (dx == 0) {
        if (dy > 0) {
            ctx.lineTo(this.startX, Config.canvasele.height);
        } else {
            ctx.lineTo(this.startX, 0);
        }
    }
    else if (dx > 0) {
        var newx = Config.canvasele.width;
        ctx.lineTo(newx, scope * (newx - this.startX) + this.startY);
    }
    else {
        ctx.lineTo(0, -scope * this.startX + this.startY);
    }
    ctx.stroke();

    // draw three dots
    ctx.beginPath();
    ctx.fillStyle = Config.dotscolor;
    ctx.arc(this.startX, this.startY, Config.dotsradius, 0, 2 * Math.PI);
    ctx.arc(this.toX, this.toY, Config.dotsradius, 0, 2 * Math.PI);
    ctx.arc((this.startX + this.toX) / 2, (this.startY + this.toY) / 2, Config.dotsradius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    if(position != -1) {
        ctx.beginPath();
        ctx.fillStyle = Config.dotscolor2;
        if (position == 0) {
            ctx.arc(this.startX, this.startY, Config.dotsradius2, 0, 2 * Math.PI);
        }
        else if (position == 1) {
            ctx.arc((this.startX + this.toX) / 2, (this.startY + this.toY) / 2, Config.dotsradius2, 0, 2 * Math.PI);
        }
        else if (position == 2) {
            ctx.arc(this.toX, this.toY, Config.dotsradius2, 0, 2 * Math.PI);
        }
        ctx.fill();
        ctx.closePath();
    }
}

TrendLine.prototype.contains = function (mx, my) {
    return ( mx <= ((this.startX + this.toX) / 2 + Config.scope)) && ( mx >= ((this.startX + this.toX) / 2 - Config.scope)) &&
        ( my <= ((this.startY + this.toY) / 2 + Config.scope)) && ( my >= ((this.startY + this.toY) / 2 - Config.scope));
}

function HorizontalLine(X, Y) {
    this.color = $('#selColor').val();
    this.width = $('#selWidth').val();
    this.X = X;
    this.Y = Y;
}

HorizontalLine.prototype.draw = function (ctx,position) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.moveTo(0, this.Y);
    ctx.lineTo(Config.canvasele.width, this.Y);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = Config.dotscolor;
    ctx.arc(this.X, this.Y, Config.dotsradius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    if(position == 1) {
        ctx.beginPath();
        ctx.fillStyle = Config.dotscolor2;
        ctx.arc(this.X, this.Y, Config.dotsradius2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

HorizontalLine.prototype.contains = function (mx, my) {
    return ( mx <= (this.X + Config.scope)) && ( mx >= (this.X - Config.scope)) &&
        ( my <= (this.Y + Config.scope)) && ( my >= (this.Y - Config.scope));

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
        this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0;
        this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0;
        this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
        this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10) || 0;
    }
    // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
    // They will mess up mouse coordinates and this fixes that
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;

    // **** Keep track of state! ****
    this.lines = []; //the collection of things to be

    this.drawing = false;
    this.drawingobj = null;
    this.drawx1 = 0;
    this.drawy1 = 0;
    this.drawx2 = 0;
    this.drawy2 = 0;

    this.dragging = false;// keep track of when we are dragging
    this.dragobj = null;
    this.dragstartx = 0;
    this.dragstarty = 0;

    var myState = this;

    canvas.addEventListener('mousedown', function (e) {
        var mouse = myState.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        var lines = myState.lines;
        var l = lines.length;

        //命中测试
        for (var i = l - 1; i >= 0; i--) {
            console.log(lines[i].contains(mx, my));
            if (lines[i].contains(mx, my)) {
                var line = lines[i];
                myState.dragging = true;
                myState.dragobj = line;
                myState.drawing = false;
                if(line instanceof StraightLine){
                    myState.dragstartx = mx;
                    myState.dragstarty = my;
                    return;
                }
                else if(line instanceof TrendLine){
                    myState.dragstartx = mx;
                    myState.dragstarty = my;
                    return;
                }
                else if(line instanceof HorizontalLine) {
                    myState.dragstartx = mx;
                    myState.dragstarty = my;
                    return;
                }
            }
        }

        if(!myState.dragging) {
            if (checkbox == 0) {
                myState.drawingobj = new StraightLine(mx, my, mx, my);
                myState.drawing = true;
                myState.draw();
            } else if (checkbox == 1) {
                myState.drawingobj = new TrendLine(mx, my, mx, my);
                myState.drawing = true;
            }
            else if (checkbox == 2) {
                //等mouseup的时候再画
                return;
            }
        }

        myState.draw();

    }, true);  // The event handler is executed in the capturing phase

    canvas.addEventListener('mousemove', function (e) {
        var mouse = myState.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;

        if (myState.dragging) {
            if (myState.dragobj instanceof HorizontalLine) {
                myState.dragobj.X += mouse.x - myState.dragstartx;
                myState.dragobj.Y += mouse.y - myState.dragstarty;
            } else {
                myState.dragobj.startX +=  mouse.x - myState.dragstartx;
                myState.dragobj.startY +=  mouse.y - myState.dragstarty;
                myState.dragobj.toX += mouse.x - myState.dragstartx;
                myState.dragobj.toY += mouse.y - myState.dragstarty;
            }
            myState.dragstartx = mouse.x;
            myState.dragstarty = mouse.y;
        }

        if(myState.drawing){
            if (checkbox == 0 || checkbox == 1) {
                myState.drawingobj.toX = mx;
                myState.drawingobj.toY = my;
            }
            else if (checkbox == 2) {
                myState.drawingobj = new HorizontalLine(mx, my);
            }
            myState.draw();
            return;
        }

        //draw new line
        else if (myState.drawing && ((checkbox == 0) || (checkbox == 1))) {
            myState.drawingobj.toX = mouse.x;
            myState.drawingobj.toY = mouse.y;

        }
        //horizion line的指示线
        else if (checkbox == 2) {
            myState.drawing = true;
            myState.drawingobj = new HorizontalLine(mouse.x, mouse.y);
        }
        myState.draw();
    }, true);

    canvas.addEventListener('mouseup', function (e) {
        if (myState.dragging) {
            myState.dragging = false;
            if(myState.drawingobj instanceof  HorizontalLine) {
                //要加入进Lines栈，否则remove last会有Bug
                myState.addLine(myState.drawingobj);
                myState.drawing = true;
            }
        }
        else if (myState.drawing) {
            myState.addLine(myState.drawingobj);
            myState.drawingobj = null;
            myState.drawing = false;
        }
    }, true);


}

CanvasState.prototype.addLine = function (line) {
    this.lines.push(line);
}

CanvasState.prototype.removeLast = function () {
    console.log(this.lines);
    return this.lines.pop();
    //this.draw();
    //console.log(this.lines);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function () {
    var ctx = this.ctx;
    var lines = this.lines;
    var l = lines.length;
    this.clear();

    //console.log(lines);

    for (var i = 0; i < l; i++) {
        var line = lines[i];
        // We can skip the drawing of elements that have moved off the screen:
        if (line.x > this.width || line.y > this.height ||
            line.x + line.w < 0 || line.y + line.h < 0) continue;
        lines[i].draw(ctx,-1);
    }

    // draw dragobj
    // right now this is just a stroke along the edge of the selected Shape
    //画选中的水平线
    if (this.dragging){
        //暂时只考虑拖动中点
        this.dragobj.draw(ctx,1);
    } else {
        //画移动中的的straightline, trendline, horizontalline
        if (this.drawing) {
            if(this.drawingobj instanceof HorizontalLine) {
                this.drawingobj.draw(ctx,1);
            }
            else
                this.drawingobj.draw(ctx,2);
        }
    }
}

CanvasState.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
}

CanvasState.prototype.getMouse = function (e) {
    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    return {x: mx, y: my};
}

$(document).ready(function () {

    $("input:radio[value=straight]").click(function () {
        checkbox = 0;
        console.log(checkbox);
    });

    $("input:radio[value=trend]").click(function () {
        checkbox = 1;
        console.log(checkbox);
    });

    $("input:radio[value=horizontal]").click(function () {
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
    state.addLine(new TrendLine(200, 20, 100, 30));


    $("#removelast").click(function () {
        state.removeLast();
        state.draw();
    });

})