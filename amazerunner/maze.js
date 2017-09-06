function Maze(canvasElementId, numOfRows, numOfCols) {
	if (!(this instanceof Maze)) {
		return new Maze(canvasElementId, numOfRows, numOfCols);
	}
	this._init();
	this.reset(canvasElementId, numOfRows, numOfCols);
}

Maze.prototype = {
	_init: function() {
		this._ = {
			rows		: 0,
			cols		: 0,
			canvasCtx	: null,
			cells		: null,
			exit 		: null,
			enterance	: null,
			runner		: null,
			cellWidth	: null,
			cellHeight	: null,
			curCell		: null
		};
	},
	reset: function(canvasElementId, numOfRows, numOfCols) {
		this._set({
			canvasId: canvasElementId,
			rows: numOfRows,
			cols: numOfCols
		});

		var context = this._.canvasCtx;
		var canvas = context.canvas;
		context.clearRect(0, 0, canvas.width, canvas.height);

		this._makeMaze();
	},
	paint: function() {
		if (!this._.canvasCtx) {
			alert("No canvas object found!");
			return;
		}

		var context = this._.canvasCtx;

		var cell;
		for (var idx = 0; idx < this._.cells.length; idx++) {
			cell = this._.cells[idx];
			cell.paint(context)
		}
		
		this._.runner.paint();
	},
	onPointerDown: function(evt) {
		evt.preventDefault();
		var pos = this._getPointerPosition(evt);
		this._.runner.onTouchDown(pos.x, pos.y);
		return true;
	}
	,
	onPointerUp: function(evt) {
		this._.runner.onMoveOut();
		return true;
	}
	,
	onPointerMove: function(evt) {
		evt.preventDefault();
		
		if (!this._.curCell) return false;
		
		var pos = this._getPointerPosition(evt),
			col = Math.floor(pos.x / this._.cellWidth),
			row = Math.floor(pos.y / this._.cellHeight),
			curcell = this._.curCell;
			
		if ((curcell.row - row < 0 && !curcell.walls[Wall.S()]) ||
			(curcell.row - row > 0 && !curcell.walls[Wall.N()]) ||
			(curcell.col - col < 0 && !curcell.walls[Wall.E()]) ||
			(curcell.col - col > 0 && !curcell.walls[Wall.W()])) {
				return false;	
			}
		
		this._.runner.onMove(pos.x, pos.y);
		this._.curCell = this._getCell(row, col);
		
		return true;
	}
	,
	onPointerOut: function(evt) {
		this._.runner.onMoveOut();
		return true;
	}
	,
	_set: function(args) {
		var
			rows = this._.rows,
			cols = this._.cols,
			exit, enterance, canvas, cellwidth, cellheight;

		if (args) {
			if (args.canvasId) {
				canvas = document.getElementById(args.canvasId);
				if (canvas.getContext) {
					this._.canvasCtx = canvas.getContext("2d");
				} else {
					alert("Canvas is not supported.");
					return;
				}
			}
			if (args.rows) {
				rows = args.rows;
			}
			if (args.cols) {
				cols = args.cols;
			}
			if (args.enterance) {
				enterance = args.enterance;
				// TODO: adjust to be an edge cell.
			}
			if (args.exit) {
				exit = args.exit;
				// TODO: adjust to be an edge cell.
			}
		}

		if (!enterance) enterance = {row: 0, col: 0};
		if (!exit) exit = {row: rows-1,col: cols-1};
		
		canvas = this._.canvasCtx.canvas;
		cellwidth = canvas.width / cols;
		cellheight = canvas.height / rows;
		
		if (this._.cells) {
			delete this._.cells;
		}
		
		this._.cells = [];
		for (var row = 0; row < rows; row++) {
			for (var col = 0; col < cols; col++) {
				this._.cells.push(Cell(row, col, cellwidth, cellheight));
			}
		}
		
		this._.cells[enterance.row * cols + enterance.col].entexit = true;
		this._.cells[exit.row * cols + exit.col].entexit = true;

		this._.rows = rows;
		this._.cols = cols;
		this._.enterance = enterance;
		this._.exit = exit;
		this._.cellWidth = cellwidth;
		this._.cellHeight = cellheight;
		this._.curCell = this._getCell(enterance.row, enterance.col);
		this._.runner = new Runner(this._.canvasCtx, 
									{x: enterance.row + cellwidth/2, y: enterance.col + cellheight/2}, 
									{width: cellwidth/2 < 10 ? 10 : cellwidth/2, height: cellheight/2 < 10 ? 10 : cellheight/2});
	},
	_makeMaze: function() {
		var
			cells = this._.cells.slice(),
			curCell = this._getCell(this._.enterance.row, this._.enterance.col),
			nextCell = null,
			visited = [];

		while (cells.length > 0 || visited.length > 0) {
			curCell.visited = true;
			cells.splice(cells.indexOf(curCell), 1);

			nextCell = this._visitNext(curCell);
			if (!nextCell) {
				if (visited.length > 0) {
					curCell = visited.pop();
				} else {
					curCell = cells[Math.floor(Math.random() * cells.length) % cells.length];
				}
				continue;
			}
			visited.push(curCell);
			curCell = nextCell;
		}
	},
	_visitNext: function(curCell) {
		var
			dirs = Wall.getWalls(),
			dir, nextRow, nextCol, nextCell, curWall, nextWall;

		while (dirs.length > 0) {
			nextRow = curCell.row,
				nextCol = curCell.col,
				dir = Math.round(Math.random() * 10) % dirs.length;
			switch (dirs[dir]) {
				case Wall.NS():
					nextRow -= 1;
					curWall = Wall.N();
					nextWall = Wall.S();
					break;
				case Wall.SS():
					nextRow += 1;
					curWall = Wall.S();
					nextWall = Wall.N();
					break;
				case Wall.WS():
					nextCol -= 1;
					curWall = Wall.W();
					nextWall = Wall.E();
					break;
				case Wall.ES():
					nextCol += 1;
					curWall = Wall.E();
					nextWall = Wall.W();
					break;
			}

			if (this._.rows > nextRow && nextRow >= 0 && this._.cols > nextCol && nextCol >= 0) {
				nextCell = this._getCell(nextRow, nextCol);
			}

			if (!nextCell || nextCell.visited) {
				nextCell = null;
				dirs.splice(dir, 1);
				continue;
			}

			curCell.walls[curWall] = 1;
			nextCell.walls[nextWall] = 1;

			break;
		}
		return nextCell;
	},
	_getCell: function(row, col) {
		return this._.cells[row * this._.cols + col];
	},
	_getPointerPosition: function(evt) {
		var x = evt.clientX,
		    y = evt.clientY,
			box = this._.canvasCtx.canvas.getBoundingClientRect();
			
		switch (evt.type) {
			case "touchstart":
			case "touchmove":
				x = evt.touches[0].clientX;
				y = evt.touches[0].clientY;
				break;
			default:
				break;
		}
		
		return {x: x - box.left * (this._.canvasCtx.canvas.width  / box.width),
				y: y - box.top  * (this._.canvasCtx.canvas.height / box.height)};
	}
}

function Cell(row, col, width, height) {
	if (!(this instanceof Cell)) {
		return new Cell(row, col, width, height);
	}

	this._init(row, col, width, height);
}
;
/**
 * Functions for Cell
 */
Cell.prototype = {
	_init: function(cx, cy, cw, ch) {
		this.row = cx;
		this.col = cy;
		this.width = cw;
		this.height = ch;
		this.entexit = false;
		this.visited = false;
		this.walls = [0, 0, 0, 0]; // values for wall. 0: closed, 1: opened. wall order: east, west, south, north
	}
	,
	paint: function(context) {
		var wall;
		if (this.entexit) {
			context.fillStyle ="#33FF33";
			context.fillRect(this.col * this.width, this.row * this.height, this.width, this.height);
		}
		
		for (var widx = 0; widx < this.walls.length; widx++) {
			wall = this.walls[widx];
			context.beginPath();
			if (wall === 0) {
				switch (widx) {
					case Wall.N():
						context.moveTo(this.col * this.width, this.row * this.height);
						context.lineTo((this.col + 1) * this.width, this.row * this.height);
						break;
					case Wall.S():
						context.moveTo(this.col * this.width, (this.row + 1) * this.height);
						context.lineTo((this.col + 1) * this.width, (this.row + 1) * this.height);
						break;
					case Wall.E():
						context.moveTo((this.col + 1) * this.width, this.row * this.height);
						context.lineTo((this.col + 1) * this.width, (this.row + 1) * this.height);
						break;
					case Wall.W():
						context.moveTo(this.col * this.width, this.row * this.height);
						context.lineTo(this.col * this.width, (this.row + 1) * this.height);
						break;
				}
				context.stroke();
			}
		};
	}
}

function Runner(context, centerPoint, size) {
	if (!(this instanceof Runner)) {
		return new Runner(context, centerPoint, size);
	}
	
	this._init(context, centerPoint, size);
}

Runner.prototype = {
	_init : function(context, centerPoint, size) {
		if (!context) {
			alert ("No context specified.");
		}
		this.centerPoint = centerPoint;
		this.size = size;
		this.footprint = new Path2D();
		this.canvasCtx = context;
		this.backBoard = null;
		this.active = false;
		this.pointerLoc = null;
		this.canvasImageData = null;
		
		this.footprint.moveTo(this.centerPoint.x, this.centerPoint.y);
	}
	,
	paint : function() {
		var ctx = this.canvasCtx,
			cpt = this.centerPoint,
			radius = this.size.height / 2 > this.size.width / 2 ? this.size.width / 2 : this.size.height / 2;
			
		if (!this.canvasImageData) {
			this.canvasImageData = this.canvasCtx.getImageData(0, 0, this.canvasCtx.canvas.width, this.canvasCtx.canvas.height);
		}
		
		ctx.beginPath();
		ctx.arc(cpt.x, cpt.y, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = "rgba(0,0,200,0.4)";
		ctx.fill();
	}
	,
	onTouchDown : function(px, py) {
		if (!this._isTouched(px, py)) {
			return false;
		}
		
		this.active = true;
		this.previousPointerX = px;
		this.previousPointerY = py;
		return true;
	}
	,
	onTouchUp : function(px, py) {
		if (!this._isTouched(px, py)) 
			return false;
			
		this.onMove(px, py);
		this.active = false;
		return true;
	}
	,
	onMoveOut: function() {
		this.active = false;
		return true;
	}
	,
	onMove : function(px, py) {
		if (!this.active || !this._isTouched(px, py)) {
			return false;
		}
			
		var offsetX = px - this.previousPointerX,
			offsetY = py - this.previousPointerY,
			tmpCenterPoint = {x: this.centerPoint.x + offsetX, y: this.centerPoint.y + offsetY};
			
		if (this._isOnPlayground(tmpCenterPoint, {x:0, y:0, width: this.canvasCtx.canvas.width, height: this.canvasCtx.canvas.height})) {
			this.centerPoint = tmpCenterPoint;
			this.canvasCtx.putImageData(this.canvasImageData, 0, 0);
			this.paint();
			
			this.footprint.lineTo(this.centerPoint.x, this.centerPoint.y);
			this.footprint.moveTo(this.centerPoint.x, this.centerPoint.y);
			this.canvasCtx.stroke(this.footprint);
		} else {
			this.active = false;
		}
		
		this.previousPointerX = px;
		this.previousPointerY = py;
		
		return true;
	}
	,
	_isTouched : function(x, y) {
		/*
		var rst = false;
		if (x > (this.centerPoint.x - this.size.width/2) &&
			x < (this.centerPoint.x + this.size.width/2) &&
			y > (this.centerPoint.y - this.size.height/2) &&
			y < (this.centerPoint.y + this.size.height/2)) {
				rst = true;
		}
		return rst;
		*/
		return this.canvasCtx.isPointInPath(x, y);
	}
	,
	_isOnPlayground : function(centerPoint, playground) {
		var ret = true;
		
		if (centerPoint.x > playground.width) {
			if (this.centerPoint.x >= playground.width) {
				ret = false;
			} else {
				this.centerPoint.x = playground.width;
			}
		} else if (centerPoint.x < playground.x) {
			if (this.centerPoint.x <= playground.x) {
				ret = false;
			} else {
				this.centerPoint.x = playground.x
			}
		} else if (centerPoint.y > playground.height) {
			if (this.centerPoint.y >= playground.height) {
				ret = false;
			} else {
				this.centerPoint.y = playground.height;
			}
		} else if (centerPoint.y < playground.y) {
			if (this.centerPoint.y <= playground.y) {
				ret = false;
			} else {
				this.centerPoint.y = playground.y;
			}
		}
		return ret;
	}
}

var Wall = (function(){
	var 
	_DIRS = ["north", "south", "east", "west"]
	,
	_Wall = {
		getWalls : function(){
			return _DIRS.slice(0);
		}
		,
		E : function() {
			return _DIRS.indexOf("east");
		}
		,
		ES : function() {
			return "east";
		}
		,
		W : function() {
			return _DIRS.indexOf("west");
		}
		,
		WS : function() {
			return "west";
		}
		,
		N : function() {
			return _DIRS.indexOf("north");
		}
		,
		NS : function() {
			return "north";
		}
		,
		S : function() {
			return _DIRS.indexOf("south");
		}
		,
		SS : function() {
			return "south";
		}
	}
	;
	return _Wall;
})();
