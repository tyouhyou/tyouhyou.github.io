"use strict";

/* global $ Bricks Direction KPad */

Game.gameboardClass = "gameboard";
Game.playgroundClass = "playground";
Game.scoreboardClass = "scoreboard";
Game.boardClass = "board";

function Game(arg) {
    if (!(this instanceof Game)) {
        return Game(arg);
    }
    
    if (!arg.gameboard || !arg.playground || !arg.scoreboard) {
        throw new Error("Game board is not properly set.");
    }
    
    this.gameboard = $(arg.gameboard).addClass(Game.gameboardClass);
    this.playground = new Playground(arg.playground);
    this.scoreboard = new Scoreboard(arg.scoreboard);
    
    this.exports = {
        init: this.init.bind(this),
        start: this.start.bind(this),
        size: this.size.bind(this),
        onKey: this.onKey.bind(this),
    };
    
    return this.exports;
}

Game.prototype = {
    cols: 11,
    rows: 19,
    
    onKey: function(key) {
        switch (key) {
        case KPad.Key.UP:
            this.currentBrick.tryRotate(this.board);
            break;
        case KPad.Key.DOWN:
            while (this.currentBrick.tryMoveTo(Direction.down, this.board)){}
            break;
        case KPad.Key.LEFT:
            this.currentBrick.tryMoveTo(Direction.left, this.board);
            break;
        case KPad.Key.RIGHT:
            this.currentBrick.tryMoveTo(Direction.right, this.board);
            break;
        default:
            // do nothing
            break;
        }
    }
    ,
    init: function() {
        // TODO: take arguments, such as level, drawboardornot, cols/rows ...
        this.playground.init({"cols":this.cols,"rows":this.rows});
        this.scoreboard.init();
    }
    ,
    clear: function() {
        this.playground.clear();
        this.currentBrick = null;
        this.nextBrick = null;
        if (!!this.board && !!this.board.cells) {
            this.board.cells.forEach(function(cell){
                cell = null;
            });
            this.board.cells = new Array(this.cols * this.rows);
        } else {
            this.board = {
                "cols": this.cols,
                "rows": this.rows,
                "cells": new Array(this.cols * this.rows),
            };
        }
        
        if (this.looper) {
            clearInterval(this.looper);
            this.looper = null;
        }
    }
    ,
    start: function() {
        this.clear();
        
        if (!this.takeABrickOut()) {
            // TODO: messagebox
            alert ("Cannot restart.");
            clearInterval(this.looper);
            return;
        }
        
        this.looper = setInterval(this.moveit.bind(this), 1000);
    }
    ,
    moveit: function() {
        if (!this.currentBrick.tryMoveTo(Direction.down, this.board)) {
            this.layBrick(this.currentBrick);
            this.currentBrick = null;
            if (!this.takeABrickOut()) {
                // TODO: messagebox
                clearInterval(this.looper);
                if (confirm ("You lost. Try again?")) {
                    this.start();
                }
            }
        }
    }
    ,
    size: function(width, height) {
        var ret  = this;
        if (0 >= arguments.length) {
            ret = this.gameboard(["width", "height"]);
        } else if (null == width) {
            var body = $("body"),
                s;
            width = body.width(),
            height = body.height(),
            s = (width > height ? height : width) + "px;" ;
            this.gameboard.css({"width":s, "height":s});
        } else {
            if ("number" === typeof width) width += "px";
            if ("number" === typeof height) height += "px";
            this.gameboard.css({"width":width, "height":height});
        }
        
        return ret;
    }
    ,
    makeBrick: function() {
        var idx = Math.floor(Math.random() * Bricks.length);
        var template = Bricks[idx];
        return template({"context": this.playground.getContext(), "minoWidthInPx": this.playground.cellSize});
    }
    ,
    takeABrickOut: function() {
        var ret = false;

        if (!!this.currentBrick && !!this.nextBrick) {
            return ret;
        }
        
        this.scoreboard.clearNext(this.nextBrick);
        if (this.nextBrick) {
            this.currentBrick = this.nextBrick;
        } else {
            this.currentBrick = this.makeBrick();
        }

        var row = 0, col = 0;
        col = Math.round((this.board.cols - this.currentBrick.getVector()) / 2);
        ret = this.currentBrick.tryMoveTo([row, col], this.board);
        
        if (ret) {
            this.nextBrick = this.makeBrick();
            this.scoreboard.drawNext(this.nextBrick);
        }

        return ret;
    }
    ,
    layBrick: function(brick) {
        var ms = brick.getMinos(),
            row = brick.getAnchor().row,
            col = brick.getAnchor().col;
        
        ms.forEach(function(m){
            this.board.cells[(row + m[0]) * this.board.cols + col + m[1]] = m.mino;
        }, this);
        
        this.scanBoard();
    }
    ,
    scanBoard: function() {
        var row, col;
        var rowsReady = [];
        var occupied = 0;
        var topEmptyRow = -1;
        var curcell = 0;
        
        for(row = this.rows - 1; row >= 0; row --) {
            occupied = 0;
            for(col = this.cols - 1; col >= 0; col --) {
                if (this.board.cells[row * this.cols + col]) {
                    occupied ++;
                }
            }
            if (this.cols === occupied) {
                rowsReady.push(row);
            } else if (0 === occupied) {
                topEmptyRow = row;
                break;
            }
        }
        
        var dn=0, cpycell;
        if (0 < rowsReady.length) {
            
            //TODO: flash the occupied rows
            
            for (row = rowsReady[0]; row > topEmptyRow; row --) {
                if (rowsReady.indexOf(row) >= 0) {
                    for(col = 0; col < this.cols; col++) {
                        curcell = row * this.cols + col;
                        this.board.cells[curcell].clear();
                        this.board.cells[curcell] = null;
                    }
                    dn++;
                } else {
                    for(col = 0; col < this.cols; col ++) {
                        curcell = row * this.cols + col;
                        cpycell = (row+dn)*this.cols + col;
                        this.board.cells[cpycell] = this.board.cells[curcell];
                        if (this.board.cells[cpycell]) {
                            this.board.cells[cpycell].translate(0, dn * this.playground.cellSize, true);
                        }
                        this.board.cells[curcell] = null;
                    }
                }
            }
        }
    }
};

function Playground(arg) {
    if (!(this instanceof Playground)) {
        return new Playground(arg);
    }
    
    var g;
    if ("string" === typeof arg) {
        g = arg;
    } else {
        g = arg.ground;
    }
    this.board = $(g).addClass([Game.playgroundClass, Game.boardClass]);
    this.canvas = $("canvas", this.board);
    this.context = this.canvas[0].getContext("2d");
}

Playground.prototype = {
    init: function(arg) {
        if (arg) {
            this.cols = arg.cols;
            this.rows = arg.rows;
        }
        
        var w = this.board.width() - 2;
        var h = this.board.height() - 2;
        
        var cellWidth = w / this.cols,
            cellHeight = h / this.rows,
            cellSize = cellWidth < cellHeight ? cellWidth : cellHeight,
            canvasTop,
            canvasLeft;
            
        this.cellSize = cellSize;
        this.setCanvasSize(cellSize * this.cols, cellSize * this.rows);
        
        canvasTop = (h - this.canvas.height()) / 2;
        canvasLeft = (w - this.canvas.width()) / 2;
        this.canvas.top(canvasTop);
        this.canvas.left(canvasLeft);
    }
    ,
    getContext: function() {
        return this.context;
    }
    ,
    setCanvasSize: function(width, height) {
        this.canvas[0].width = width;
        this.canvas[0].height = height;
        this.canvas.width(width);
        this.canvas.height(height);
    }
    ,
    drawGrid: function() {
        var i, xs, ys, xe, ye;
        this.context.save();
        this.context.strokeStyle = "#BFC7C9";
        this.context.lineWidth = 1;
        this.context.beginPath();
        xs = 0;
        xe = this.cellSize * this.cols;
        for(i=0; i<=this.rows; i++) {
            ys = this.cellSize * i;
            this.context.moveTo(xs, ys);
            this.context.lineTo(xe, ys);
        }
        ys = 0;
        ye = this.cellSize * this.rows;
        for(i=0; i<=this.cols; i++) {
            xs = this.cellSize * i;
            this.context.moveTo(xs, ys);
            this.context.lineTo(xs, ye);
        }
        this.context.stroke();
        this.context.restore();
    }
    ,
    clear: function() {
        this.context.clearRect(0, 0, this.board.width(), this.board.height());
    }
};

function Scoreboard(arg) {
    if (!(this instanceof Scoreboard)) {
        return new Scoreboard(arg);
    }
    
    var g;
    if ("string" === typeof arg) {
        g = arg;
    } else {
        g = arg.ground;
    }

    this.board = $(g).addClass([Game.scoreboardClass, Game.boardClass]);
    this.next = $("canvas", this.board);
    this.context = this.next[0].getContext("2d");
}

Scoreboard.prototype = {
    init: function() {      
        var w = this.board.width() - 2;
        this.setSizeOfNext(w, w);
    }
    ,
    drawNext: function(brick) {
        if (!brick) return;

        var ports = brick.getMinos();
        var pt = this.getStartPtX(brick);

        ports.forEach(function(port) {
            port.mino.translate(pt, pt, false);
            port.mino.draw(this.context);
            port.mino.translate(-pt, -pt, false);
        }, this);
    }
    ,
    clearNext: function(brick) {
        if (!brick) return;
        var ports = brick.getMinos();
        var pt = this.getStartPtX(brick);

        ports.forEach(function(port){
            port.mino.translate(pt, pt, false);
            port.mino.clear(this.context);
            port.mino.translate(-pt, -pt, false);            
        }, this);
    }
    ,
    getStartPtX: function(brick) {
        var cellsize = brick.getMinoWidth();
        return (((this.next.width() / cellsize) - brick.getVector()) / 2 ) * cellsize;
    }
    ,
    setSizeOfNext: function(w, h) {
        this.next.width(w);
        this.next.height(h);
        this.next[0].width = w;
        this.next[0].height = h;
    }
};