/* global $U Path2D CanvasRenderingContext2D */

var C = $U.create(Unit, {
    "vector": 3,
    "ports": [[1, 0], [0, 1], [1, 1], [1, 2], [2, 1]],
    "color": "#C2A7D9",
    "tryRotate": function () { },
}, true);

var S = $U.create(Unit, {
    "vector": 4,
    "ports": [[2, 0], [2, 1], [2, 2], [1, 2], [1, 3]],
    "color": "#C4BFDB",
}, true);

var Z = $U.create(Unit, {
    "vector": 4,
    "ports": [[1, 0], [1, 1], [2, 1], [2, 2], [2, 3]],
    "color": "#B0D6CD",
}, true);

var JJ = $U.create(Unit, {
    "vector": 4,
    "ports": [[1, 1], [1, 2], [2, 1], [2, 2], [2, 3]],
    "color": "#0FBD91",
}, true);

var LL = $U.create(Unit, {
    "vector": 4,
    "ports": [[0, 1], [1, 1], [1, 2], [2, 1], [2, 2]],
    "color": "#2FD119",
}, true);

var L = $U.create(Unit, {
    "vector": 2,
    "ports": [[0, 0], [1, 0], [1, 1]],
    "color": "#6ea378",
}, true);

var J = $U.create(Unit, {
    "vector": 4,
    "ports": [[0, 1], [0, 2], [1, 2], [2, 2], [3, 2]],
    "color": "#335650",
}, true);

var T = $U.create(Unit, {
    "vector": 3,
    "ports": [[0, 1], [1, 1], [2, 0], [2, 1], [2, 2]],
    "color": "#5c4260",
}, true);

var SL = $U.create(Unit, {
    "vector": 3,
    "ports": [[2, 0], [2, 1], [2, 2], [1, 2], [0, 2]],
    "color": "#a42aba",
}, true);

var U = $U.create(Unit, {
    "vector": 3,
    "ports": [[1, 0], [1, 2], [2, 0], [2, 1], [2, 2]],
    "color": "#C0E391",
}, true);

var ZZ = $U.create(Unit, {
    "vector": 5,
    "ports": [[1, 0], [1, 1], [2, 2], [2, 3], [2, 4]],
    "color": "#F5F105",
}, true);

var SS = $U.create(Unit, {
    "vector": 5,
    "ports": [[2, 0], [2, 1], [2, 2], [1, 3], [1, 4]],
    "color": "#F5B753",
}, true);

var I = $U.create(Unit, {
    "vector": 5,
    "ports": [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]],
    "color": "#ED8F66",
}, true);

var D = $U.create(Unit, {
    "vector": 1,
    "ports": [[0, 0]],
    "color": "#ED66D2",
    "tryRotate": function () { },
}, true);

var TH = $U.create(Unit, {
    "vector": 4,
    "ports": [[1, 0], [1, 1], [1, 2], [1, 3]],
    "color": "#319186",
}, true);

var TO = $U.create(Unit, {
    "vector": 2,
    "ports": [[0, 0], [0, 1], [1, 0], [1, 1]],
    "color": "#d6d59a",
    "tryRotate": function () { },
}, true);

var TM = $U.create(Unit, {
    "vector": 3,
    "ports": [[0, 1], [1, 0], [1, 1], [1, 2]],
    "color": "#37522a",
}, true);

var TL = $U.create(Unit, {
    "vector": 3,
    "ports": [[0, 0], [1, 0], [1, 1], [1, 2]],
    "color": "#2d4d66",
}, true);

var TLC = $U.create(Unit, {
    "vector": 3,
    "ports": [[0, 2], [1, 0], [1, 1], [1, 2]],
    "color": "#563bd1",
}, true);

var TS = $U.create(Unit, {
    "vector": 3,
    "ports": [[0, 1], [0, 2], [1, 0], [1, 1]],
    "color": "#c84fd1",
}, true);

var TSC = $U.create(Unit, {
    "vector": 3,
    "ports": [[0, 0], [0, 1], [1, 1], [1, 2]],
    "color": "#632740",
}, true);

// var Bricks = [C, S, Z, J, L, T, SL, JJ, LL, U, ZZ, SS, I, D];
var Bricks = [TO, TM, TH, TL, TLC, TS, TSC];
Object.freeze(Bricks);

function Mino(arg) {
    if (!(this instanceof Mino)) {
        return new Mino(arg);
    }
    this.initMino(arg);
    return this.export();
}

Mino.prototype = {
    export: function () {
        return {
            svgMino: this.svgMino,
            moveTo: this.moveTo.bind(this),
            translate: this.translate.bind(this),
            scale: this.scale.bind(this),
            clear: this.clear.bind(this),
            draw: this.draw.bind(this)
        };
    }
    ,
    initMino: function (arg) {
        if (!arg || !arg.ctx) {
            throw "Insuffient arguments for Mino.";
        }

        this.ctx = arg.ctx;

        if (undefined != arg.size && null != arg.size) {
            if ("number" === typeof arg.size) {
                this.resize(arg.size, arg.size, false);
            } else {
                this.resize(arg.size.width, arg.size.height, false);
            }
        } else if (this.svgMino) {
            /**
             * It is preferred to use SVG path to create Path2D.
             * However, ms Edge and IE do not support it. Just put
             * the svg path aside temporarily, and use the folloing function.
             */

            //this.path = new Path2D(this.svgMino);
        }

        if (arg.anchor) {
            this.anchor = arg.anchor;
        } else {
            this.anchor = { x: 0, y: 0 };
        }

        if (arg.style) {
            this.style = arg.style;
        }

        if (!this.ratio) {
            this.ratio = 1;
        }
    }
    ,
    resize: function (width, height, redraw) {
        this.width = width;
        this.height = height;
        this.svgMino = "M1 1 h " + (this.width - 1) + " v " + (this.height - 1) + " h -" + (this.width - 1) + " Z";

        if (redraw) {
            this.moveTo(this.anchor.x, this.anchor.y, redraw);
        }
    }
    ,
    moveTo: function (x, y, redraw) {
        if (undefined == redraw) {
            redraw = true;
        }

        if (redraw) {
            this.clear();
            this.anchor = { "x": x, "y": y };
            this.draw();
        } else {
            this.anchor = { "x": x, "y": y };
        }
    }
    ,
    translate: function (dx, dy, redraw) {
        if (!this.anchor) return;

        var x = this.anchor.x + dx,
            y = this.anchor.y + dy;

        this.moveTo(x, y, redraw);
    }
    ,
    scale: function (ratio, redraw) {
        if (undefined == redraw) {
            redraw = true;
        }
        this.ratio *= ratio;
        if (!redraw) {
            this.clear();
            this.draw();
        }
    }
    ,
    draw: function (context) {
        var ctx = this.ctx;
        if (context) {
            ctx = context;
        }

        ctx.save();
        if (this.style.fillStyle) {
            ctx.fillStyle = this.style.fillStyle;
        }

        var scale = 0.95;       // canvas draw at 0.5 px
        var offset = 0.5;
        var path = new Path2D();

        path.moveTo(1, 1);
        path.lineTo(this.width - 1, 1);
        path.lineTo(this.width - 1, this.height - 1);
        path.lineTo(1, this.height - 1);
        path.closePath();

        ctx.transform(this.ratio * scale, 0, 0, this.ratio * scale, this.anchor.x + offset, this.anchor.y + offset);
        ctx.fill(path);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.restore();
    }
    ,
    clear: function (context) {
        var ctx = this.ctx;
        if (this.anchor) {
            if (context) {
                ctx = context;
            }
            ctx.translate(this.anchor.x, this.anchor.y);
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
};

function Unit(arg) {
    if (!(this instanceof Unit) && !(this.isPrototypeOf(Unit))) {
        return new Unit(arg);
    }
    this.init(arg);
    return this.export();
}

Unit.prototype = {
    context: null,
    vector: 0,
    minos: [],
    color: "#000",
    anchor: {
        "row": 0,
        "col": 0
    }
    ,
    export: function () {
        return {
            tryMoveTo: this.tryMoveTo.bind(this),
            tryRotate: this.tryRotate.bind(this),
            getMinos: function () { return this.ports; }.bind(this),
            getVector: function () { return this.vector; }.bind(this),
            getAnchor: function () { return this.anchor; }.bind(this),
            getMinoWidth: function () { return this.minoWidthInPx; }.bind(this)
        };
    }
    ,
    init: function (arg) {
        if (arg) {
            if (arg instanceof CanvasRenderingContext2D) {
                this.context = arg;
            } else {
                this.context = arg.context ? arg.context : this.context;
                this.vector = arg.vector ? arg.vector : this.vector;
                this.minoWidthInPx = arg.minoWidthInPx ? arg.minoWidthInPx : this.minoWidthInPx;
                this.ports = arg.ports ? arg.ports : this.ports;
                this.color = arg.color ? arg.color : this.color;
            }
        }

        if (!this.strMino) {
            this.strMino = "M1 1 h " + (this.minoWidthInPx - 1) + " v " + (this.minoWidthInPx - 1) + " h -" + (this.minoWidthInPx - 1) + " Z";
        }
        var mino = $U.create(Mino,
            {
                "width": this.minoWidthInPx,
                "height": this.minoWidthInPx,
                "style": (this.color ? { "fillStyle": this.color } : this.style),
                "svgMino": this.strMino,
            },
            true);

        var minoIdx = 0;
        this.ports.forEach(function (cell) {
            var m = new mino({ "ctx": this.context, "anchor": { x: this.minoWidthInPx * cell[MinoRCIdx.col], y: this.minoWidthInPx * cell[MinoRCIdx.row] } });
            this.minos[minoIdx++] = m;
            cell.mino = m;
        }, this);
    }
    ,
    tryMoveTo: function (directionOrAnchor, board) {
        if (undefined == directionOrAnchor || null == directionOrAnchor) {
            throw "I need something to decide where and how to go.";
        }

        var col = this.anchor.col, row = this.anchor.row, toclear = false;

        if ("number" == typeof directionOrAnchor) {
            switch (directionOrAnchor) {
                case Direction.left:
                    col = this.anchor.col - 1;
                    break;
                case Direction.right:
                    col = this.anchor.col + 1;
                    break;
                case Direction.down:
                    row = this.anchor.row + 1;
                    break;
                default:
                    break;
            }
            toclear = true;   // clear minos and then move to new location
        } else if (Array.isArray(directionOrAnchor)) {
            row = directionOrAnchor[MinoRCIdx.row];
            col = directionOrAnchor[MinoRCIdx.col];
        } else {
            col = directionOrAnchor.col;
            row = directionOrAnchor.row;
        }

        var checkBoard;
        if (board) {
            checkBoard = true;
            this.ports.forEach(function (port) {
                var mr = row + port[MinoRCIdx.row];
                var mc = col + port[MinoRCIdx.col];

                if (mr < 0 || mc < 0 || mc >= board.cols || mr >= board.rows) {
                    checkBoard = false;
                }

                var cell = board.cols * mr + mc;
                if (null != board.cells[cell] && undefined != board.cells[cell]) {
                    checkBoard = false;
                }
            }.bind(this));
            if (!checkBoard) return false;
        }

        if (toclear) this.clear();

        this.minos.forEach(function (mino) {
            mino.translate((col - this.anchor.col) * this.minoWidthInPx, (row - this.anchor.row) * this.minoWidthInPx, false);
            mino.draw();
        }, this);

        this.anchor.row = row;
        this.anchor.col = col;

        return true;
    }
    ,
    /**
     * @description counter-clockwise rotate by 90 degree.
     * @return true: can rotate; false: cannot rotate
     */
    tryRotate: function (board) {
        var ms = [];

        for (var i = 0; i < this.ports.length; i++) {
            var y = this.vector - this.ports[i][MinoRCIdx.col] - 1,
                x = this.ports[i][MinoRCIdx.row];
            ms.push({ row: y, col: x, port: this.ports[i] });
        }

        if (board) {
            var checkBoard = true;
            ms.forEach(function (port) {
                var mr = port.row + this.anchor.row;
                var mc = port.col + this.anchor.col;

                if (mr < 0 || mc < 0 || mc >= board.cols || mr >= board.rows) {
                    checkBoard = false;
                }

                var cell = board.cols * mr + mc;
                if (null != board.cells[cell] && undefined != board.cells[cell]) {
                    checkBoard = false;
                }
            }.bind(this));
            if (!checkBoard) return false;
        }

        this.clear();

        ms.forEach(function (port) {
            var dx = port.row - port.port[MinoRCIdx.row],
                dy = port.col - port.port[MinoRCIdx.col];

            port.port[MinoRCIdx.row] = port.row;
            port.port[MinoRCIdx.col] = port.col;

            port.port.mino.translate(dy * this.minoWidthInPx, dx * this.minoWidthInPx, false);
            port.port.mino.draw();
        }.bind(this));

        return true;
    }
    ,
    clear: function () {
        this.minos.forEach(function (mino) {
            mino.clear();
        }.bind(this));
    }
};

var Direction = {
    up: 0,
    right: 1,
    left: 2,
    down: 3,
};
Object.freeze(Direction);

var MinoRCIdx = {
    row: 0,
    col: 1
};
Object.freeze(MinoRCIdx);
