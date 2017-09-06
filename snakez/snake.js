/* global $ KeyCode Emitter MessageBox */

function SnakeGame(arg) {
    if (!(this instanceof SnakeGame)) {
        return new SnakeGame(arg);
    }
    
    this.init(arg);
}

SnakeGame.prototype = {
    init: function(arg) {
        this.canvas = document.getElementById(arg.playgroundId);
        this.canvas.width = arg.width;
        this.canvas.height = arg.height;

        this.context = this.canvas.getContext("2d");
        
        this.cols = arg.cols;
        this.rows = arg.rows;
        this.cells = Array.apply(null, {length: this.cols * this.rows}).map(Number.call, Number);
        
        this.snake = new Snake();
        this.apple = null;
        this.painter = new Painter({"canvas": this.canvas,
                                    "cols": this.cols,
                                    "rows": this.rows});
        
        this.draw = this.painter.draw.bind(this.painter);
        
        this.snake.on("snakemove", this.onSnakeMove.bind(this));
        
        addEventListener("keydown", function(event) {
            this.keydownHandler.call(this, event.keyCode);
        }.bind(this));
        
        /* global TPanel */
        //var panelid = (!!arg && !!arg.touchpanelId) ? arg.touchpanelId : null;
        if (!!arg.touchpanel) {
            this.tpanel = arg.touchpanel;
        } else {
            this.tpanel = new TPanel();
        }
        
        this.tpanel.onmove = this.onTouchMove.bind(this);
        
        if (!!arg.messagebox) {
            this.messagebox = arg.messagebox;
        } else {
            this.messagebox = new MessageBox();
        }
        
        var msgbtns = this.messagebox.buttons;
        msgbtns.setButtons(MessageBox.Button.Yes | MessageBox.Button.No);
        msgbtns.onselect = this.onDialogSelected.bind(this);
    }
    ,
    onSnakeMove: function(){
        var stop = this.snake.stop.bind(this.snake);
        var bit = this.snake.bite(this.apple);
        if (1 == bit) {
            this.putApple();
        } else if (2 == bit) {
            this.message("Oh, no, I bit myself !!! <br> One more time?");
            stop();
            return;
        } else if (!this.isInPlayground(this.snake.bones[0])) {
            this.message("Hey, it's wall !!! <br> One more time?");
            stop();
            return;
        }
        
        this.draw(this.snake, this.apple);
        this.turning = false;
    }
    ,
    onTouchMove: function(obj) {
        var kcode;
        switch (obj.direct) {
            case "up":
                kcode = KeyCode.KEY_UP;
                break;
            case "down":
                kcode = KeyCode.KEY_DOWN;
                break;
            case "left":
                kcode = KeyCode.KEY_LEFT;
                break;
            case "right":
                kcode = KeyCode.KEY_RIGHT;
        }
        this.keydownHandler(kcode);
    }
    ,
    onDialogSelected: function(btn) {
        switch (btn) {
            case MessageBox.Button.No :
                this.messagebox.close();
                break;
            case MessageBox.Button.Yes :
                this.messagebox.close();
                this.restart();
                break;
            default: 
                break;
        }
    }
    ,
    keydownHandler: function(keycode) {
        if (this.turning) return;
        
        this.turning = true;
        switch (keycode) {
            case KeyCode.KEY_UP:
                this.snake.turn.call(this.snake, Orientation.UP);
                break;
            
            case KeyCode.KEY_DOWN:
                this.snake.turn.call(this.snake, Orientation.DOWN);
                break;
                
            case KeyCode.KEY_LEFT:
                this.snake.turn.call(this.snake, Orientation.LEFT);
                break;
                
            case KeyCode.KEY_RIGHT:
                this.snake.turn.call(this.snake, Orientation.RIGHT);
                break;
            
            default:
                this.turning = false;
                break;
                // code
        }
    }
    ,
    start : function() {
        this.putApple();
        this.snake.start();
        this.draw(this.snake, this.apple);
    }
    ,
    restart : function () {
        this.snake.init();      // TODO: init(arg);
        this.snake.on("snakemove", this.onSnakeMove.bind(this));
        this.start();
    }
    ,
    putApple : function() {
        var leftcells = this.cells.filter(function(value, index, array) {
            var cl = value % this.cols,
                rw = (value - cl) / this.rows;
            
            var idx = 0, inc = true;
            for(idx; idx < this.snake.bones.length; idx++) {
                if (this.snake.bones[idx].col == cl && this.snake.bones[idx].row == rw) {
                    inc = false;
                    break;
                }
            }
            
            return inc;
        }, this);
        
        if (leftcells.length == 0) {
            this.message("YOU WIN!");
            return;
        }
        
        var a = leftcells[Math.floor(Math.random() * leftcells.length)];
        var c = a % this.cols;
        var r = (a - c) / this.rows;
        
        this.apple = new Cell(r, c);
    }
    ,
    isInPlayground : function(cell) {
        var ret = true;
        if (cell.row < 0 || cell.row >= this.rows ||
            cell.col < 0 || cell.col >= this.cols) 
        {
            ret = false;
        }
        
        return ret;
    }
    ,
    message : function(msg, title, buttons) {
        this.messagebox.show(msg, title, buttons);
    }
}
;

function Snake(arg) {
    if (!(this instanceof Snake)) {
        return new Snake(arg);
    }
    
    this.init(arg);
}

Snake.prototype = {
    init: function (arg) {
        this.timer = null;
        this.bones = [Cell(0, 0)];
        this.speed = 2; // moving interval = 0.5 / speed 秒
        this.heading = Orientation.DOWN;
        this.emitter = new Emitter();
        this.started = false;
        
        if (arg) {
            this.speed = arg.speed || this.speed;
            this.heading = arg.heading || this.heading;
            this.bones = arg.bones || this.bones;
        }
        
        //this.startHeading = this.heading;
        //TOOD: put bones 
    }
    ,
    start : function() {
        this.timer = setInterval(this.move.bind(this), 0.5 / this.speed * 1000);
        this.started = true;
    }
    ,
    stop : function() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.started = false;
        //this.heading = this.startHeading;
    }
    ,
    move : function() {
        this.emitter.pub("snakemove");
    }
    ,
    bite : function (apple) {
        var ret = 0,
            next = this.bones[0].getNeighbor(this.heading);
        
        if (apple.col == next.col && apple.row == next.row) {   // bited apple
            ret = 1;
            this.bones.unshift(apple);
        } else if(this.biteSelf(next)) {
            ret = 2;
        }
        
        next = this.bones[0].getNeighbor(this.heading);
        this.bones.pop();
        this.bones.unshift(next);
        
        return ret;
    }
    ,
    turn : function(orientation) {
        if (!this.started) return;  // TODO remove event listener
        
        if (0 == this.heading + orientation) return;
            
        this.heading = orientation;
    }
    ,
    on : function(event, handler) {
        this.emitter.sub(event, handler);
    }
    ,
    biteSelf : function(next) {
        for (var idx = 1; idx < this.bones.length; idx++) {
            if (next.col === this.bones[idx].col && next.row === this.bones[idx].row) {
                return true;
            }
        }
        return false;
    }
}
;

function Painter(arg) {
    if (!(this instanceof Painter)) {
        return new Painter(arg);
    }
    
    this.init(arg);
}

Painter.prototype = {
    init : function(arg) {
        this.canvas = arg.canvas;
        this.context = this.canvas.getContext("2d");
        
        this.rows = arg.rows;
        this.cols = arg.cols;
        
        this.height = this.canvas.height;
        this.width = this.canvas.width;
        
        this.rowHeight = this.canvas.height / this.rows;
        this.colWidth = this.canvas.width / this.cols;
    }
    ,
    draw : function(snake, apple) {
        this.drawPlayground();
        this.drawApple(apple);
        this.drawSnake(snake);
    }
    ,
    drawSnake : function(snake) {
        snake.bones.forEach(function(bone){
            this.context.save();
            
            this.context.fillStyle = "#213141";
            this.context.fillRect(bone.col * this.colWidth + 1,
                                  bone.row * this.rowHeight + 1, 
                                  this.colWidth - 2, 
                                  this.rowHeight - 2);
            
            this.context.restore();
        }, this);
    }
    ,
    drawApple : function(apple) {
        this.context.save();
        
        this.context.fillStyle = "#55AA22";
        this.context.fillRect(apple.col * this.colWidth + 1, 
                              apple.row * this.rowHeight + 1, 
                              this.colWidth - 2, 
                              this.rowHeight - 2);
        
        this.context.restore();
    }
    ,
    drawPlayground : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
;

var Orientation = {
    UP: 1,
    DOWN: -1,
    LEFT: 2,
    RIGHT: -2,
};

function Cell(row, col) {
    if (!(this instanceof Cell)) {
        return new Cell(row, col);
    }
    this.row = row;
    this.col = col;
}

Cell.prototype = {
    getNeighbor : function(orientation) {
        var neighbor;
        switch (orientation) {
            case Orientation.RIGHT:
                neighbor = Cell(this.row, this.col + 1);
                break;
            case Orientation.DOWN:
                neighbor = Cell(this.row + 1, this.col);
                break;
            case Orientation.LEFT:
                neighbor = Cell(this.row, this.col - 1);
                break;
            case Orientation.UP:
                neighbor = Cell(this.row - 1, this.col);
                break;
            default:
                break;
        }
        return neighbor;
    }
}
;