"use strict";

/* global $  */

/* ************  messagebox  ************** */

var MessageBox = function(arg) {
    if (!(this instanceof MessageBox)) {
        return new MessageBox(arg);
    }
    
    this.init(arg);
    
    return this.exports = this.export();
};

MessageBox.prototype = {
    export: function () {
        return {
            show: this.show.bind(this),
            close: this.close.bind(this),
            title: this.title.bind(this),
            contents: this.contents.bind(this),
            buttons: this.buttons,
            onclose: null,
        };
    }
    ,
    init: function(arg) {
        var _selector = !!arg && !!arg.owner ? arg.owner : "body",
            _html = '<div class="messagebox-box">'
                  +     '<div class="messagebox-header">'
                  +         '<div class="messagebox-header-item messagebox-title"></div>'
                  +         '<div class="messagebox-header-item messagebox-menu-bar"></div>'
                  +         '<div class="messagebox-header-item messagebox-close-button-wrap">'
                  +            '<div class="messagebox-close-button"></div>'
                  +         '</div>'
                  +     '</div>'
                  +     '<div class="messagebox-contents-box">'
                  +         '<p class="messagebox-contents"></p>'
                  +     '</div>'
                  +     '<div class="messagebox-footer">'
                  +     '</div>'
                  + '</div>'
                  ;
                  
                  //'<div class="messagebox-container">'
        
        if (!!arg.owner) {
            this.owner = $(arg.owner);
            this.owner.addClass("messagebox-container");
        } else {
            this.owner = $('<div class="messagebox-container"></div>');
            this.owner.appendTo("body");
        }
        //this.owner = $(_selector);
        this.owner.append($(_html));
        
        this.container = $(".messagebox-container");
        this.message = $(".messagebox-box");
        this.caption = $(".messagebox-title", this.owner[0]);
        this.contentsarea = $(".messagebox-contents");
        this.footbar = $(".messagebox-footer");
        
        if (!arg || !arg.buttons) {
            this.buttons = new MessageBox.MButtons();
        }
        else {
            // Note: it returns a z's instance.
            this.buttons = $(arg.buttons);
        }
        
        if (!!this.buttons) {
            this.footbar.append(this.buttons);
        }
        
        this.btnclose = $(".messagebox-close-button");
        this.btnclose.on("click", this.close.bind(this));
    }
    ,
    title: function(title) {
        if (undefined == title || null == title) {
            return this.caption.text();
        }
        
        if ($().isHtml(title)) {
            this.caption.html(title);
        } else {
            this.caption.text(title);
        }
    }
    ,
    contents: function(contents) {
        if (undefined == contents || null == contents) {
            return !!this.contentsarea.innerText ? this.contentsarea.innerText
                                                 : this.contentsarea.innerHtml;
        }
        
        if ($().isHtml(contents)) {
            this.contentsarea.html(contents);
        } else {
            this.contentsarea.text(contents);
        }
    }
    ,
    show: function(msg, title, buttons) {
        this.contents(msg || "");
        this.title(title || "");
        this.container.css("display", "block");
    }
    ,
    close: function() {
        this.btnclose.off("click", this.close);
        this.container.css("display", "none");
        if (!!this.exports.onclose) {
            this.exports.onclose();
        }
    }
};

MessageBox.MButtons = function(buttons) {
    if (!(this instanceof MessageBox.MButtons)) {
        return new MessageBox.MButtons(buttons);
    }
    
    this.init(buttons);
    this.exports = this.buttons;
    this.exports.onselect = function(){};   // in case not set onselect
    this.exports.setButtons = this.setButtons.bind(this);
    
    return this.exports;
};

MessageBox.MButtons.prototype = {
    _html: '<div class="messagebox-buttons">'
          +     '<div class="messagebox-button msgbox-btn-cancel"><div>Cancel</div></div>'
          +     '<div class="messagebox-button msgbox-btn-ok"><div>OK</div></div>'
          +     '<div class="messagebox-button msgbox-btn-retry"><div>Retry</div></div>'
          +     '<div class="messagebox-button msgbox-btn-no"><div>No</div></div>'
          +     '<div class="messagebox-button msgbox-btn-yes"><div>Yes</div></div>'
          +     '<div class="messagebox-button msgbox-btn-abort"><div>Abort</div></div>'
          +     '<div class="messagebox-button msgbox-btn-ignore"><div>Ignore</div></div>'
          + '</div>'
          ,
    init : function(buttons) {
        this.buttons = $(this._html);
        
        this.OK = $(".msgbox-btn-ok", this.buttons).hide();
        this.Cancel = $(".msgbox-btn-cancel", this.buttons).hide();
        this.Retry = $(".msgbox-btn-retry", this.buttons).hide();
        this.No = $(".msgbox-btn-no", this.buttons).hide();
        this.Yes = $(".msgbox-btn-yes", this.buttons).hide();
        this.Abort = $(".msgbox-btn-abort", this.buttons).hide();
        this.Ignore = $(".msgbox-btn-ignore", this.buttons).hide();
        
        this.setButtons(buttons);
    }
    ,
    setButtons : function(buttons) {
        if (!buttons) return;
        
        if (MessageBox.Button.OK == (MessageBox.Button.OK & buttons)) {
            this.OK.show();
            this.OK.off("click");
            this.OK.on("click", function(btn){this.clickBtn(MessageBox.Button.Ok)}.bind(this));
        } else {
            this.OK.hide();
        }
        
        if (MessageBox.Button.Cancel == (MessageBox.Button.Cancel & buttons)) {
            this.Cancel.show();
            this.Cancel.off("click");
            this.Cancel.on("click", function(btn){this.clickBtn(MessageBox.Button.Cancel)}.bind(this));
        } else {
            this.Cancel.hide();
        }
        
        
        if (MessageBox.Button.Retry == (MessageBox.Button.Retry & buttons)) {
            this.Retry.show();
            this.Retry.off("click");
            this.Retry.on("click", function(btn){this.clickBtn(MessageBox.Button.Retry)}.bind(this));
        } else {
            this.Retry.hide();
        }
        
        if (MessageBox.Button.No == (MessageBox.Button.No & buttons)) {
            this.No.show();
            this.No.off("click");
            this.No.on("click", function(btn){this.clickBtn(MessageBox.Button.No)}.bind(this));
        } else {
            this.No.hide();
        }
        
        if (MessageBox.Button.Yes == (MessageBox.Button.Yes & buttons)) {
            this.Yes.show();
            this.Yes.off("click");
            this.Yes.on("click", function(btn){this.clickBtn(MessageBox.Button.Yes)}.bind(this));
        } else {
            this.Yes.hide();
        }
        
        if (MessageBox.Button.Abort == (MessageBox.Button.Abort & buttons)) {
            this.Abort.show();
            this.Abort.off("click");
            this.Abort.on("click", function(btn){this.clickBtn(MessageBox.Button.Abort)}.bind(this));
        } else {
            this.Abort.hide();
        }
        
        if (MessageBox.Button.Ignore == (MessageBox.Button.Ignore & buttons)) {
            this.Ignore.show();
            this.Ignore.off("click");
            this.Ignore.on("click", function(btn){this.clickBtn(MessageBox.Button.Ignore)}.bind(this));
        } else {
            this.Ignore.hide();
        }
    }
    ,
    clickBtn: function(btn) {
        if (!!this.exports.onselect) {
            this.exports.onselect(btn);
        }
    }
};

MessageBox.Button = {
    OK : 1 << 0,
    Yes : 1 << 1,
    No : 1 << 2,
    Retry : 1 << 3,
    Cancel : 1 << 4,
    Abort : 1 << 5,
    Ignore : 1<< 6,
};

/* ************  dpad   ************** */

/* global $ KeyCode */

function DPad(argObj) {
    if (!(this instanceof DPad)) {
        return new DPad(argObj);
    }

    return this._init(argObj);
}

DPad.prototype = {
    _init : function(argObj) {
        var owner,          // parent element of this dpad, not need?
            size;

        if (undefined != argObj && null != argObj) {
            if ("string" == typeof argObj) {
                owner = argObj;
            }
            else {
                owner = argObj.owner;
                size = argObj.size;
            }
        }

        var _html = '<div class="dpad-container">'
                  +   '<div class="dpad-key-left dpad-key"><span>&#9664;</span></div>'
                  +   '<div class="dpad-key-up dpad-key"><span>&#9650;</span></div>'
                  +   '<div class="dpad-key-right dpad-key"><span>&#9654;</span></div>'
                  +   '<div class="dpad-key-down dpad-key"><span>&#9660;</span></div>'
                  +   '<div class="dpad-key-center dpad-key"><span>&#9632;</span></div>'
                  + '</div>'
                  ;
        this._pad = $(_html);
        
        this._keyup = this._setPressEvent($(".dpad-key-up", this._pad), KeyCode.KEY_UP);
        this._keydown = this._setPressEvent($(".dpad-key-down", this._pad), KeyCode.KEY_DOWN);
        this._keyleft = this._setPressEvent($(".dpad-key-left", this._pad), KeyCode.KEY_LEFT);
        this._keyright = this._setPressEvent($(".dpad-key-right", this._pad), KeyCode.KEY_RIGHT);
        this._keycenter = this._setPressEvent($(".dpad-key-center", this._pad), KeyCode.KEY_ENTER);
        
        //set keys properties: width, height, location etc.
        
        //TODO: complete stylesheet as follows
        /**
        var stylesheetID = "dpadstylesheet";
        var style = $("#" + stylesheetID);
        if (0 < style.length) {
            this._style = style;
        } else {
            // TODO: use $ after refine the DOM constructor to make element from html directly.
            this._style = $(document.createElement("style"));
            this._style.attr("id", stylesheetID);
        }
        //this._style.innerHTML = "";     // TODO: style sheet string to define at other place.
        */
        
        this._pad.hide();
        if (!!owner) {
            this._owner = $(owner).addClass("dpad-panel");
            this._owner.append(this._pad);
            if (!size) {
                size = {width: this._owner.width(), height: this._owner.height()};
            }
        } else {
            this._owner = $("<div />").addClass("dpad-panel");
            this._owner.append(this._pad);
            this._owner.appendTo($("body"));
        }
        
        if (!!size) {
            this.size(size);
        }
        
        return this;
    }
    ,
    // TODO: parameter->time showup animation
    showup : function() {
        var ret = this;
        
        // TODO: should this condition checking be removed?
        if (undefined == this._owner) {
            return ret;
        }
        
        /*
        $().performIfLoaded(function(){
            if (!!this._size) {
                this.size(this._size);
            } else {
                if (!!this._owner) {
                    this.size({width : this._owner.width(), height : this._owner.height()});
                }
            }
            
            if (!!this._anchor) {
                this.locate(this._anchor);
            } else if (!!this._owner) {
                this.locate({top : this._owner.top(), left : this._owner.left()});
            }
            
            this._pad.show();
        }.bind(this));
        */
        
        this._pad.show();
        return this;
    }
    ,
    // TODO: parameter->time fadeout animation
    fadeout: function() {
        this._pad.hide();
        return this;
    }
    ,
    size: function(size) {
        // TODO:
        // var keyrid = (size.width > size.height ? size.height : size.width) * 0.2;
        
        // this._keyleft.width(keyrid);
        // this._keyleft.height(keyrid);
        // this._keyleft.top(keyrid + "px");
        // this._keyleft.left("0px");
        
        this._owner.width(size.width);
        this._owner.height(size.height);
        return this;
    }
    ,
    locate: function(location) {
        // TODO
        // this._pad.top(location.top);
        // this._pad.left(location.left);
        return this;
    }
    ,
    // TODO: note: alert will block pressup event.
    onpressdown: function(keycode) {
        // This is a delegate. Usage: dpad_instance.onpressdown = function(){}
        console.log("pressdown: " + keycode);
    }
    ,
    onpressup: function(keycode) {
        // This is a delegate. Usage: dpad_instance.onpressup = function(){}
        console.log("pressup: " + keycode);
    }
    ,
    listen: function(event, handler) {
        // TODO: sub handler to event. multiple handler is ok
        return this;
    }
    ,
    _setPressEvent: function(objDom, keycode) {
        objDom.on("mousedown touchstart", function (e) {
            e.preventDefault();
            this.onpressdown(keycode);
        }.bind(this))
        .on("mouseup touchend", function(e){
            e.preventDefault();
            this.onpressup(keycode);
        }.bind(this))
        ;
        return objDom;
    }
};
/* ************  tpanel  ************** */

/* global Emitter $ */

/* *
 * description  a transparent and touchable (mimic) panel
 * */
 
function TPanel(arg) {
    if (!(this instanceof TPanel)) {
        return new TPanel(arg);
    }
    this.init(arg);
    return this.exports = this.export();
}

TPanel.html = "<div class='tpanel' />";

TPanel.prototype = {
    /* public members */
    export: function() {
        return {
            reset: this.reset.bind(this),
            emerge: this.emerge.bind(this),
            sink: this.sink.bind(this),
            listen: this.listen.bind(this),
            unlisten: this.unlisten.bind(this),
            css: this.tpanel.css.bind(this.tpanel),
            onclick: null,
            onpress: null,
            onmove: null,
            ondirect: null,
        };
    },
    
    /* private members */
    
    init: function(arg) {
        this.touchIntervalMin = 20,  // 20 ms, the minimum touchmove event process interval.
        this.touchMoveMin = 16,       // 16 px, only when touch move distance is greater than this value, touch move event would be recognized.
        this.isTouched = false;
        this.emitter = new Emitter();
        
        
        if (!!arg ) {
            if (!!arg.owner) {
                this.owner = $(arg.owner);
            }
            
            if (!!arg.intervalMin && 0 < arg.intervalMin) {
                this.touchIntervalMin = arg.intervalMin;
            }
            
            if (!!arg.moveMin && 0 < arg.moveMin) {
                this.touchMoveMin = arg.moveMin;
            }
        }
        
        if (!this.owner) {
            this.owner = $("body");
        }
        this.tpanel = $(TPanel.html);
        this.owner.append(this.tpanel);
        
        this.registerEventHandlers();
    },
    registerEventHandlers: function() {
        // TODO: since offsetX/Y are not supported by all browsers, use pageX/Y - e.target.offsetLeft to achieve is?
        
        // TODO: remove click. raise it when press up
        // this.tpanel.on("click", function(e){
        //     if (!!this.exports.onclick) {
        //         this.exports.onclick({x:e.pageX, y:e.pageY});
        //     }
        // }.bind(this));
        
        this.tpanel.on("touchstart mousedown touchenter", function(e){
            e.preventDefault();
            
            this.touchStarthandler(e);
            if (!!this.exports.onpress) {
                this.exports.onpress("down", {x:e.pageX, y:e.pageY});
            }
        }.bind(this));
        
        this.tpanel.on("touchend mouseup touchleave", function(e){
            this.touchEndHandler(e);
            
            if (!!this.exports.onpress) {
                this.exports.onpress("up", {x:e.pageX, y:e.pageY});
            }
            
            if (this.touchStartPoint.x == e.pageX && this.touchStartPoint.y == e.pageY)
            {
                if (!!this.exports.onclick) {
                    this.exports.onclick({x:e.pageX, y:e.pageY});
                }
            }
        }.bind(this));
        
        this.tpanel.on("touchmove mousemove", function(e){
            this.touchMoveHandler(e);
        }.bind(this));
        
        this.emitter.sub("move", function(event, obj){
            if (!!this.exports.onmove) {
                this.exports.onmove(obj);
            }
        }.bind(this));
        
        this.emitter.sub("direct", function(event, obj){
            if (!!this.exports.ondirect) {
                this.exports.ondirect(obj);
            }
        }.bind(this));
    },
    touchStarthandler: function(e) {
        this.moveStartPoint = {x:e.pageX, y:e.pageY};
        this.touchStartPoint = {x:e.pageX, y:e.pageY};
        this.touchStartTime = Date.now();
        
        this.touchMoveTimer = setInterval(function(){
            this.isTouched = true;
        }.bind(this), this.touchIntervalMin);
    },
    touchEndHandler: function(e) {
        this.isTouched = false;
        
        if (!!this.touchMoveTimer) {
            clearInterval(this.touchMoveTimer);
            this.touchMoveTimer = null;
        }

        var moveEndPoint = {x:e.pageX, y:e.pageY};
        
        this.raiseMove(moveEndPoint);
        this.raiseDirect(moveEndPoint);
        this.touchStartTime = null;
    },
    touchMoveHandler: function(e) {
        if (!this.isTouched) {
                return;
            }
        this.raiseMove({x:e.pageX, y:e.pageY});
    },
    raiseMove: function(moveEndPoint) {
        if (!this.exports.onmove) {
            return;
        }
        
        if (Math.abs(this.moveStartPoint.x - moveEndPoint.x) < this.touchMoveMin &&
            Math.abs(this.moveStartPoint.y - moveEndPoint.y) < this.touchMoveMin) {
                return;
            }
            
        var mx = moveEndPoint.x - this.moveStartPoint.x,
            my = moveEndPoint.y - this.moveStartPoint.y,
            dir = Math.abs(mx) > Math.abs(my)
                ? mx > 0 ? "right" : "left"
                : my > 0 ? "down" : "up"
                ;
        this.emitter.pub("move",{ moveX: mx,
                                  moveY: my,
                                  direct: dir,
                                  startPoint: {x: this.moveStartPoint.x, y: this.moveStartPoint.y}, // unreferred
                                  endPoint: {x: moveEndPoint.x, y: moveEndPoint.y}
                                });
                                
        this.moveStartPoint = moveEndPoint;
    },
    raiseDirect: function(endPoint) {
        if (!this.exports.ondirect) {
            return;
        }
        
        if (Math.abs(this.touchStartPoint.x - endPoint.x) < this.touchMoveMin &&
            Math.abs(this.touchStartPoint.y - endPoint.y) < this.touchMoveMin) {
                return;
            }
            
        var mx = endPoint.x - this.touchStartPoint.x,
            my = endPoint.y - this.touchStartPoint.y,
            dir = Math.abs(mx) > Math.abs(my)
                ? mx > 0 ? "right" : "left"
                : my > 0 ? "down" : "up"
                ;
        this.emitter.pub("direct",{ moveX: mx,
                                    moveY: my,
                                    elapse: Date.now() - this.touchStartTime,
                                    direct: dir,
                                    startPoint: {x: this.touchStartPoint.x, y: this.touchStartPoint.y}, // unreferred
                                    endPoint: {x: endPoint.x, y: endPoint.y}
                                  });
    },
    reset: function(arg) {
        var csstext = "";
        if (!!arg.size) {
            csstext += undefined == arg.size.width ? "" : "width:" + arg.size.width + ";";
            csstext += undefined == arg.size.height ? "" : "height:" + arg.size.height + ";";
        }
        if (!!arg.anchor) {
            csstext += undefined == arg.anchor.x ? "" : "left:" + arg.anchor.x + ";";
            csstext += undefined == arg.anchor.y ? "" : "top:" + arg.anchor.y + ";";
        }
        if (undefined != arg.opacity) {
            csstext += "opacity:" + arg.opacity + ";";
        }
        this.tpanel.cssText(csstext);
    },
    emerge: function() {
        this.tpanel.css("visibility", "visible");
    },
    sink: function() {
        this.tpanel.css("visibility", "hidden");
    },
    listen: function(eventtype, handler) {
        // TODO: 
        // if eventtype is in self-defined events, emitter.sub, else on()
        // this.emitter.sub(eventtype, handler);
        this.tpanel.on(eventtype, handler);
    },
    unlisten: function(eventtype, handler) {
        // TODO: 
        // if eventtype is in self-defined events, emitter.sub, else on()
        // this.emitter.sub(eventtype, handler);
        this.tpanel.off(eventtype, handler);
    },
};
"use strict";

/* global $ Emitter KeyCode */

function KPad (arg) {
    if (!(this instanceof KPad)) {
        return new KPad(arg);
    }
    
    this.init(arg);
    this.exports = this.export();
    return this.exports;
}

KPad.prototype = {
    export : function() {
        return {
            hide: this.hide.bind(this),
            show: this.show.bind(this),
            size: this.size.bind(this),
            anchor: this.anchor.bind(this),
            onClick: null,
            onPress: null,
            onRelease: null,
        };
    }
    ,
    kpadClass: "kpad"
    ,
    keysHtml : "<div class='kkey kkey-up'><div class='icon icon-up'></div></div>"
             + "<div class='kkey kkey-down'><div class='icon icon-down'></div></div>"
             + "<div class='kkey kkey-left'><div class='icon icon-left'></div></div>"
             + "<div class='kkey kkey-right'><div class='icon icon-right'></div></div>"
    ,
    init: function(arg) {
        if ("string" === typeof arg) {
            this.owner = $(arg).addClass(this.kpadClass);
        } else if (!!arg && !!arg.owner) {
            this.owner = $(arg.owner).addClass(this.kpadClass);
        }
        
        if (!this.owner) {
            this.owner = $("<div class='" + this.kpadClass + "' />", true);
        }
        
        this.owner.hide();
        this.owner.html(this.keysHtml);
        this.keyup = $(".kkey-up", this.owner[0]);
        this.keydown = $(".kkey-down", this.owner[0]);
        this.keyleft = $(".kkey-left", this.owner[0]);
        this.keyright = $(".kkey-right", this.owner[0]);
        
        if ("string" !== typeof arg) {
            if (!!arg.size) {
                this.size(arg.size.width, arg.size.height);
            }
            if (!!arg.anchor) {
                this.anchor(arg.anchor.top, arg.anchor.left);
            }
            if (!!arg.cssText) {
                this.owner.cssText(arg.cssText);
            }
        }
        
        this.emitter = new Emitter();
        
        // this.keyup.on("click", function(){
        //     !!this.exports.onClick || this.exports.onClick(KPad.Key.UP);
        // }.bind(this));
        // this.keydown.on("click", function(){
        //     !!this.exports.onClick || this.exports.onClick(KPad.Key.DOWN);
        // }.bind(this));
        // this.keyleft.on("click", function(){
        //     !!this.exports.onClick || this.exports.onClick(KPad.Key.LEFT);
        // }.bind(this));
        // this.keyright.on("click", function(){
        //     !!this.exports.onClick || this.exports.onClick(KPad.Key.RIGHT);
        // }.bind(this));
        
        // this.sub("press release", this.onKey.bind(this));
        // this.sub("click", function() {if(this.exports.onClick) this.exports.onClick()}.bind(this));
        
        this.listen();
    }
    ,
    listen: function() {
        this.emitter.sub("press release click mousedown touchstart mouseup touchend", this.onKey.bind(this));
        
        window.addEventListener("keyup", this.onKeyBoard.bind(this));
        window.addEventListener("keydown", this.onKeyBoard.bind(this));
        
        this.keyup.on("click mousedown touchstart mouseup touchend", function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.emitter.pub(e.type, KPad.Key.UP);
        }.bind(this));
        this.keydown.on("click mousedown touchstart mouseup touchend", function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.emitter.pub(e.type, KPad.Key.DOWN);
        }.bind(this));
        this.keyleft.on("click mousedown touchstart mouseup touchend", function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.emitter.pub(e.type, KPad.Key.LEFT);
        }.bind(this));
        this.keyright.on("click mousedown touchstart mouseup touchend", function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.emitter.pub(e.type, KPad.Key.RIGHT);
        }.bind(this));
    }
    ,
    onKey: function(event, key) {
        var eleKey;
        switch(key) {
            case KPad.Key.UP:
                eleKey = this.keyup;
                break;
            case KPad.Key.DOWN:
                eleKey = this.keydown;
                break;
            case KPad.Key.LEFT:
                eleKey = this.keyleft;
                break;
            case KPad.Key.RIGHT:
                eleKey = this.keyright;
                break;
            default:
                break;
        }
        
        switch (event) {
            case 'mousedown':
            case 'touchstart':
            case 'press':
                eleKey.css("background-color", "#4D7C8C");
                !!this.exports.onPress && this.exports.onPress(key);
                break;
                
            case 'mouseup':
            case 'touchend':
            case 'release':
                eleKey.css("background-color", "");
                !!this.exports.onRelease && this.exports.onRelease(key);
                break;
                
            case 'click':
                !!this.exports.onClick && this.exports.onClick(key);
                break;
            
            default:
                // code
        }
    }
    ,
    onKeyBoard : function(e) {
        var key, event;
        
        if ("keyup" === e.type) {
            event = "release";
        } else if ("keydown" === e.type) {
            event = "press";
        }
        
        key = e.keyCode === KeyCode.KEY_UP
            ? key = KPad.Key.UP
            : e.keyCode === KeyCode.KEY_DOWN
            ? key = KPad.Key.DOWN
            : e.keyCode === KeyCode.KEY_LEFT
            ? key = KPad.Key.LEFT
            : e.keyCode === KeyCode.KEY_RIGHT
            ? KPad.Key.RIGHT
            : null;
        
        this.emitter.pub(event, key);
    }
    ,
    setKeys: function() {
        var width = this.owner.width(),
            height = this.owner.height(),
            size = width >= height ? width : height,
            keysize = size / 3,
            lrkeywidth = width / 2 > keysize ? keysize : width / 2,
            udkeyheight = height / 2 > keysize ? keysize : height / 2;
        
        this.keyup.width(keysize).height(udkeyheight).left((width - keysize)/2).top(0);
        this.keydown.width(keysize).height(udkeyheight).left((width - keysize)/2).css("bottom", 0);
        this.keyleft.width(lrkeywidth).height(keysize).top((height - keysize)/2).left(0);
        this.keyright.width(lrkeywidth).height(keysize).top((height - keysize)/2).css("right", 0);
    }
    ,
    show: function() {
        this.owner.show();
    }
    ,
    hide: function() {
        this.owner.hide();
    }
    ,
    size: function(width, height) {
        if ("number" === typeof width) width += "px";
        if ("number" === typeof height) height += "px";
        this.owner.css({"width": width, "height": height});
        this.setKeys();
    }
    ,
    anchor: function(top, left) {
        this.owner.css({"top": top, "left": left});
    }
};

KPad.Key = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
};
Object.freeze(KPad.Key);