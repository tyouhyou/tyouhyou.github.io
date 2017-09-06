"use strict";

/* global CanvasRenderingContext2D navigator */

(function( global ) {

    if (typeof global.KeyCode == "undefined") {
        global.KeyCode = {
            KEY_CANCEL: 3,
            KEY_HELP: 6,
            KEY_BACK_SPACE: 8,
            KEY_TAB: 9,
            KEY_CLEAR: 12,
            KEY_RETURN: 13,
            KEY_ENTER: 14,
            KEY_SHIFT: 16,
            KEY_CONTROL: 17,
            KEY_ALT: 18,
            KEY_PAUSE: 19,
            KEY_CAPS_LOCK: 20,
            KEY_ESCAPE: 27,
            KEY_SPACE: 32,
            KEY_PAGE_UP: 33,
            KEY_PAGE_DOWN: 34,
            KEY_END: 35,
            KEY_HOME: 36,
            KEY_LEFT: 37,
            KEY_UP: 38,
            KEY_RIGHT: 39,
            KEY_DOWN: 40,
            KEY_PRINTSCREEN: 44,
            KEY_INSERT: 45,
            KEY_DELETE: 46,
            KEY_0: 48,
            KEY_1: 49,
            KEY_2: 50,
            KEY_3: 51,
            KEY_4: 52,
            KEY_5: 53,
            KEY_6: 54,
            KEY_7: 55,
            KEY_8: 56,
            KEY_9: 57,
            KEY_SEMICOLON: 59,
            KEY_EQUALS: 61,
            KEY_A: 65,
            KEY_B: 66,
            KEY_C: 67,
            KEY_D: 68,
            KEY_E: 69,
            KEY_F: 70,
            KEY_G: 71,
            KEY_H: 72,
            KEY_I: 73,
            KEY_J: 74,
            KEY_K: 75,
            KEY_L: 76,
            KEY_M: 77,
            KEY_N: 78,
            KEY_O: 79,
            KEY_P: 80,
            KEY_Q: 81,
            KEY_R: 82,
            KEY_S: 83,
            KEY_T: 84,
            KEY_U: 85,
            KEY_V: 86,
            KEY_W: 87,
            KEY_X: 88,
            KEY_Y: 89,
            KEY_Z: 90,
            KEY_CONTEXT_MENU: 93,
            KEY_NUMPAD0: 96,
            KEY_NUMPAD1: 97,
            KEY_NUMPAD2: 98,
            KEY_NUMPAD3: 99,
            KEY_NUMPAD4: 100,
            KEY_NUMPAD5: 101,
            KEY_NUMPAD6: 102,
            KEY_NUMPAD7: 103,
            KEY_NUMPAD8: 104,
            KEY_NUMPAD9: 105,
            KEY_MULTIPLY: 106,
            KEY_ADD: 107,
            KEY_SEPARATOR: 108,
            KEY_SUBTRACT: 109,
            KEY_DECIMAL: 110,
            KEY_DIVIDE: 111,
            KEY_F1: 112,
            KEY_F2: 113,
            KEY_F3: 114,
            KEY_F4: 115,
            KEY_F5: 116,
            KEY_F6: 117,
            KEY_F7: 118,
            KEY_F8: 119,
            KEY_F9: 120,
            KEY_F10: 121,
            KEY_F11: 122,
            KEY_F12: 123,
            KEY_F13: 124,
            KEY_F14: 125,
            KEY_F15: 126,
            KEY_F16: 127,
            KEY_F17: 128,
            KEY_F18: 129,
            KEY_F19: 130,
            KEY_F20: 131,
            KEY_F21: 132,
            KEY_F22: 133,
            KEY_F23: 134,
            KEY_F24: 135,
            KEY_NUM_LOCK: 144,
            KEY_SCROLL_LOCK: 145,
            KEY_COMMA: 188,
            KEY_PERIOD: 190,
            KEY_SLASH: 191,
            KEY_BACK_QUOTE: 192,
            KEY_OPEN_BRACKET: 219,
            KEY_BACK_SLASH: 220,
            KEY_CLOSE_BRACKET: 221,
            KEY_QUOTE: 222,
            KEY_META: 224
        };
    }
    
    /** 
     * polyfills 
     */
    
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith#Polyfill
    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function(searchString, position) {
            var subjectString = this.toString();
            if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.lastIndexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        };
    }
    
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(searchString, position) {
            position = position || 0;
            return this.substr(position, searchString.length) === searchString;
        };
    }
    
    /**
     * @description Utilities
     */
    var Util = {
        /**
         * @description To check if a object is the "window" in browser.
         */    
        isWindow : function(obj) {
            return !!obj && obj === obj.window;
        }
        ,
        /**
         * NOTE: the arguments other than plain object would be wrapped into an object.
         */
        shallowClone : function(obj) {
            var rst = obj;
            if (null === obj || undefined === obj) {
                rst = this;
            }
            if (typeof obj === "function") {
                rst = obj;
            } else if (obj !== null && obj !== undefined && obj instanceof Object) {
                for (var nextKey in obj) {
                    if (obj.hasOwnProperty(nextKey)) {
                        rst[nextKey] = obj[nextKey];
                    }
                }
            }
            return rst;
        }
        ,
        /**
         * description
         * refer to [https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm]
         */
        deepClone : function(obj) {
            var rst = obj,
                Constructor;

            if (null === obj && undefined === obj) {
                obj = this;
            }
            
            if (!Util) Util = this;
            if (obj instanceof Object) {
                var copy = true;
                Constructor = obj.constructor;
                switch (Constructor) {
                    case CanvasRenderingContext2D:
                        copy = false;   // for those special objects, do not need copy them
                    case Function:
                        rst = obj;
                        break;
                    case RegExp:
                    case String:
                    case Number:
                        rst = new Constructor(obj);
                        break;
                    case Date:
                        rst = new Constructor(obj.getTime());
                        break;
                    default:
                        rst = new Constructor();
                        break;
                }
                
                if (copy)
                for (var prop in obj) {
                    rst[prop] = Util.deepClone(obj[prop]);
                }
            }
            
            return rst;
        }
        ,
        /**
         * @description perform shallow or deep cloning.
         * @param {boolean} [ifDeep=false]
         * @param {object} obj
         */
        clone : function(deep, obj) {
            var
            idx = 0,
            _deep = false,
            _obj;

            if (!Util) Util = this;
            
            if (typeof arguments[idx] === "boolean") {
                _deep = arguments[idx++];
            }
            
            _obj = arguments[idx];
            if (undefined === _obj || null === obj) {
                _obj = this;
            }
            
            if (!_deep) {
                return Util.shallowClone(_obj);
            } else {
                return Util.deepClone(_obj);
            }
        }
        ,
        /**
         * 
         */
        extend : function(deep, target, obj) {
            var
            idx = 0,
            _deep = false,
            _target = this;

            if (!Util) Util = this;
            
            if (arguments.length <= 0) {
                return _target;
            }
            
            // deep
            if (typeof arguments[idx] === "boolean") {
                _deep = arguments[idx++];
            }
            
            // target
            if (idx >= arguments.length || !arguments[idx]) {
                return _target;
            }
            
            // set target
            _target = arguments[idx++];
            
            // extends all objects to targets.
            for (; idx < arguments.length; idx++) {
                var o = arguments[idx];
                if (o == null || o == undefined) continue;

                for (var prop in o) {
                    _target[prop] = Util.clone(_deep, o[prop]);
                }

            }

            return _target;
        }
        ,
        /**
         * Create a new function which inherits from parent, and with new properties against parent.
         */
        create : function(parent, newProperties, independant) {
            if (undefined == parent) return null;
            if (!newProperties) return parent;
            
            var T = function(){};
            if (!independant) {
                T.prototype = Util.shallowClone(parent.prototype);
                Util.extend(false, T.prototype, newProperties);
            }
            return function() {
                if (independant) {
                    T.prototype = Util.deepClone(parent.prototype);
                    Util.extend(true, T.prototype, newProperties);
                }
                var t = new T();
                var p = parent.prototype;
                parent.prototype = t;
                var F = parent.apply(t, arguments);
                parent.prototype = p;
                return F;
            };
        }
        ,
        inherit : function(parent, newProperties, child) {
            var _child = this, 
                _parent, 
                _properties,
                _arg,
                idx = 0
                ;
                
            if (!Util) Util = this;

            _arg = arguments[idx++];
            if (null !== _arg && undefined !== _arg) {
                _parent = _arg;
            }
            else{
                return null;
            }

            _arg = arguments[idx++];
            if (null !== _arg && undefined !== _arg) {
                _properties = _arg;
            }

            _arg = arguments[idx++];
            if (null !== _arg && undefined !== _arg) {
                _child = _arg;
            }

            // TODO: check null / undefined properties argument
            var proPar = Util.create(_parent, _properties);
            Util.extend(proPar.prototype, _child.prototype);
            _child.prototype = new proPar();
            _child.prototype.constructor = _child;

            return _child;
        }
        ,
        /** arguments: ([arraylikeobj], callback) */
        forEach : function(obj, callback, isToBreak) {
            var _obj = this,
                _callback,
                _breakSwitch = false;
            
            switch(arguments.length) {
                case 1:
                    _callback = arguments[0];
                    break;
                case 2:
                    if (typeof arguments[0] === "function")
                    {
                        _callback = arguments[0];
                        _breakSwitch = arguments[1];
                    } else {
                        _obj = arguments[0];
                        _callback = arguments[1];
                    }
                    break;
                default:
                    _obj = arguments[0];
                    _callback = arguments[1];
                    _breakSwitch = isToBreak;
                    break;
            }
            
            if (!Util) Util = this;
            if (typeof _obj === "object")
            if( Util.isIterable(_obj) ) {
                for (var i = 0; i < _obj.length; i++) {
                    if (_callback.call(_obj[i], i, _obj[i]) === _breakSwitch) {
                        break;
                    }
                }
            } else {
                for (var prop in _obj) {
                    if (_callback.call(_obj[prop], prop, _obj[prop]) === _breakSwitch) {
                        break;
                    }
                }
            }
            
            return obj;
        }
        ,
        /**
         * @description The objects which can apply forEach() to, but not enumerable (which means an object here.)
         *
         */
        isIterable : function(obj) {
            var rst = false;
            var strType = Object.prototype.toString.call( obj );
            
            if (strType === '[object Array]'                                                        // if Array, true
            ||  ((typeof obj === 'object' && 'length' in obj && typeof obj.length === 'number')     // having length property
            &&   (/^\[object (HTMLCollection|NodeList)\]$/.test(strType)                            // html collection
            ||    'splice' in obj)))                                                                // array like object
            {
                rst = true;
            }
                
            return rst;
        }
        ,
        /**
         * @description Merge two arrays.
         * TODO: distinct?
         */
        merge : function(arr1, arr2) {
            var
            _arr1 = arr1,
            _arr2 = arr2,
            _start;
            
            if (2 > arguments.length) {
                _arr1 = this;
                _arr2 = arr1;
            }
            
            _start = _arr1.length;
    
            for(var i = 0; i < _arr2.length; i++) {
                _arr1[i + _start] = _arr2[i];
            }
            
            _arr1.length = _arr1.length + _arr2.length;
            
            return _arr1;
        }
    }
    ;

    /** 
     * constructor1: (css_selector)
     * constructor2: (html_element)
     * constructor3: (html_element_Array)
     * constructor4: (css_selector, context) : context is html elements or DOM object.
     * TODO: parseHtml?
    */
    var DOM = function(selector, context) {
        if (!(this instanceof DOM)) {
            return new DOM(selector, context);
        }
        
        this.init();
        
        return this.query(selector, context);
    }
    ;
    
    DOM.prototype = {
        length: 0,
        slice: [].slice,
        splice: [].splice,
        push: [].push,
        indexOf: [].indexOf,
        toString: {}.toString,
        
        init: function() {
            Emitter.apply(this);
        }
        ,
        // TODO: querySelectorAll is slower? make it "live"?
        // TODO: to make it live, implement the querySelectorAll in the prototype.
        query: function(selector, context, firstonly) {
            if (!selector) {
                return this;
            }
            
            var ret = this,
                contextElement;
            
            if (!!context) {
                contextElement = context;
            } else {
                contextElement = document;
            }
    
            if (typeof selector == "string") {
                var match = null;
                if (null != (match = this.parseHtml(selector))) {
                    if (Array.isArray(match)) {
                        throw "Only the html snippets with one root element are supported.";
                    }
                    var ele = document.createElement(match["tag"]);
                    
                    match["attributes"].forEach(function(a) {
                        ele.setAttribute(a.attrName, a.attrValue);
                    });
                    
                    ele.innerHTML = match["innerHTML"];
                    this.push(ele);
                } else if (contextElement === document || this.isElement(contextElement)) {
                    if (firstonly) {
                        this.merge(contextElement.querySelector(selector));
                    } else {
                        this.merge(contextElement.querySelectorAll(selector));
                    }
                } else if (contextElement instanceof DOM) {
                    contextElement.forEach(function(index, element){
                        if (firstonly) {
                            this.merge(element.querySelector(selector));
                        } else {
                            this.merge(element.querySelectorAll(selector));
                        }
                    }.bind(this));
                }
            } else if (Array.isArray(selector)) {
                this.merge(selector);
            } else if (this.isElement(selector)) {
                this.push(selector);
            } else if (selector instanceof DOM) {
                ret = selector;
            }
            
            this.__eventList = {};
            
            // TODO: return closure:
            //       1. when no selector or invalid selector, closure contains methods 
            //          which have nothing to do with elements (such as util), which is a singletone object
            //       2. when valid selector presents, closure return this instance, excluding the "_x" or "__x" objects
            //          eg. return {html: html.bind(this)}
            
            return ret;
        }
        ,
        viewportSize: function() {
            var h = window.innerHeight 
                  || document.documentElement.clientWidth 
                  || document.getElementsByTagName("body")[0].clientWidth
                  ,
                w = window.innerWidth
                  || document.documentElement.clientHeight
                  || document.getElementsByTagName("body")[0].clientHeight
                  ;
            
            return {width: w, height: h};
        }
        ,
        /**
         * @description Do not perform the callback until Dom is ready.
         *              If the Dom has been ready, it will be performed immediately.
         *              It binds [this] to this object in case [this] context is
         *              desired in the callback.
         *
         */
         // TODO: buggy. maybe use this.on()?
        performIfReady: function(callback) {
            // TODO: add callback in list
            window.__listener_on_ready__ = function() {
                if (document.readyState == "interactive" || document.readyState == "complete") {
                    callback.bind(this)();
                    this.__listener_on_ready__ = null;
                }
            }.bind(this);
            
            switch (document.readyState) {
                case "loading":
                    //document.removeEventListener("onreadystatechange", window.__listener_on_ready__, false);
                    document.addEventListener("onreadystatechange", window.__listener_on_ready__, false);
                    break;
                case "interactive":
                case "complete":
                    window.__listener_on_ready__();
                    break;
                default:
                    break;
            }
            
            return this;
        }
        ,
        // TODO: buggy. maybe use this.on()?
        performIfLoaded: function(callback) {
            // TODO: add callback in list
            if (!window.__listener_on_loaded__)
            {
                window.__listener_on_loaded__ = function() {
                    if (document.readyState == "complete") {
                        callback.bind(this)();
                        window.__listener_on_loaded__ = null;
                    }
                }.bind(this);
            }
            
            switch (document.readyState) {
                case "loading":
                case "interactive":
                    // TODO: review
                    //document.removeEventListener("onreadystatechange", window.__listener_on_loaded__, false);
                    document.addEventListener("onreadystatechange", window.__listener_on_loaded__, true);
                    break;
                case "complete":
                default:
                    window.__listener_on_loaded__();
                    break;
            }
            
            return this;
        }
        ,
        html: function(value) {
            var ret = this;
            if (this.isHtml(value)) {
                // regex test value?
                this.forEach(function(index, element) {
                    if (this.isElement(element)) {
                        element.innerHTML = value;
                    }
                }.bind(this));
            } else {
                ret = "";
                this.forEach(function(index, element) {
                    if (this.isElement(element)) {
                        ret += element.innerHTML;
                    }
                }.bind(this));
            }
            return ret;
        }
        ,
        isHtml: function(value) {
            var regexx = /^\s*<.*>\s*$/,
                regex1 = /\s*<([A-Za-z][A-Za-z0-9]+)\s*([^<>]*)\s*>(.*)<\/([A-Za-z][A-Za-z0-9]+)\s*>\s*/g,
                regex2 = /\s*<([A-Za-z][A-Za-z0-9]+)\s*([^<>\/]*)\s*\/{0,1}>\s*/g
                ;
            return regexx.test(value) && (regex1.test(value) | regex2.test(value));
        }
        ,
        /**
         * description  parse "tag" "attributes" "innerHtml" from html (like) string.
         * 
         * TODO: the behavor should be like as follows. At the being, only one root element html snippet is supported.
         * If the string has only one "root" element, the return value is a object has tag/attributes/innerHtml key-value pair.
         * If the string has multi cousin element without "root" element, then the return value is an array contains key-value paires.
         *
         */
        parseHtml: function(html) {
            // TODO: /\s*((?:regex1)|(?:regex2))\s*/gm, (no ^ $), and parse to multiple cousin elements
            var regex1 = /^\s*<([A-Za-z][A-Za-z0-9]+)\s*([^<>]*)\s*>(.*)<\/([A-Za-z][A-Za-z0-9]+)\s*>\s*$/,
                regex2 = /^\s*<([A-Za-z][A-Za-z0-9]+)\s*([^<>\/]*)\s*\/{0,1}>\s*$/,
                result = null,
                match = null;
                
                
            if (typeof html == "string") {
                var arrAttr =[];
                    if (null != (match = regex1.exec(html))) {
                        if (match[1] === match[4]) {
                            arrAttr = this.parseAttrStr(match[2]);
                            result = {
                                tag: match[1],
                                attributes: arrAttr,
                                innerHTML: match[3]
                            };
                        } else {
                            throw "The open tag does not match close tag";
                        }
                    } else if (null != (match = regex2.exec(html))) {
                        arrAttr = this.parseAttrStr(match[2]);
                        result = {
                            tag: match[1],
                            attributes: arrAttr,
                            innerHTML: ""
                        };
                    }
            }
            
            return result;
        }
        ,
        parseAttrStr: function(attrStr) {
            var arrAttr = [];
            if (!!attrStr && !/^\s+$/.test(attrStr)) {
                var a = attrStr.match(/(?:[^\s"']+|["'][^"']*["'])+/g) ;
                a.forEach(function(s) {
                    if (!/^\s+$/.test(s)) {
                        var kv = s.split("=");
                        if (2 < kv.length) {
                            throw "Invalid html attribute format!";
                        }
                        var key = kv[0].trim();
                        var val = null;
                        if (2 == kv.length) {
                            val = kv[1].trim().replace(/^["']/, '').replace(/["']$/, '');
                        }
                        arrAttr.push({attrName: key, attrValue: val});
                    }
                });
            }
            return arrAttr;
        }
        ,
        /* global HTMLElement */
        isElement: function(obj) {
            return typeof HTMLElement === "object" 
                    ? obj instanceof HTMLElement
                    : obj && typeof obj === "object" && obj.nodeType === 1 && typeof obj.nodeName === "string"
                    ;
        }
        ,
        /* global Node */
        isNode: function(obj) {
            return typeof Node === "object"
                    ? obj instanceof Node
                    : obj && typeof obj === "object" && typeof obj.nodeType === "number" && typeof obj.nodeName === "string"
                    ;
        }
        ,
        hasClass: function(className) {
            var
            ret = false,
            regClass = new RegExp("(^|\\s)" + className + "(\\s|$)");
            
            this.forEach(function(index, element) {
                if (this.isElement(element) && regClass.test(element.className)) {
                    ret = true;
                    return false;   // break from each.
                }
            }.bind(this));
            
            return ret;
        }
        ,
        _addClass: function(element, classValue) {
            var cls = element.className.trim(),
                arr = Array.isArray(classValue) 
                    ? classValue
                    : typeof classValue === "string"
                    ? classValue.split(" ")
                    : undefined
                    ;
            
            arr.forEach(function(cur, idx) {
                cur = cur.trim();
                if (!cls) {
                    cls = cur;
                } else if(0 > cls.split(" ").indexOf(cur)) { // case sensitive
                    cls += " " + cur;
                }
                cls = cls.replace(/ {2,}/g, " ");
            });
            
            element.className = cls;
        }
        ,
        addClass: function(value) {
            if (typeof value === "function") {
                /* A function returning one or more space-separated class names to be added to the existing class name(s).
                 * Within the function, this refers to the current element in the set
                 */
                this.forEach(function(index, element) {
                    var rst = value.call(element, index, element.className);
                    if (!!rst) {
                        this._addClass(element, rst);
                    }
                }.bind(this));
            } else {
                this.forEach(function(index, element) {
                    if (this.isElement(element)) {
                        this._addClass(element, value);
                    }
                }.bind(this));
            }
            
            return this;
        }
        ,
        _removeClass: function(element, classValue) {
            var cls = element.className,
                arr = Array.isArray(classValue) 
                    ? classValue
                    : typeof classValue === "string"
                    ? classValue.split(" ")
                    : undefined
                    ;
            
            if (!!cls) {
                arr.forEach(function(cur) {
                    cls = cls.replace(new RegExp("(^|\\s)" + cur + "(\\s|$)", "g") ," ");
                });
                cls.replace(/ {2,}/g, " ");
            }
            element.className = cls;
        }
        ,
        removeClass: function(value) {
            if (typeof value === "function") {
                /* A function returning one or more space-separated class names to be removed to the existing class name(s).
                 * Within the function, this refers to the current element in the set
                 */
                this.forEach(function(index, element) {
                    var rst = value.call(element, index, element);
                    if (!!rst) {
                        element.className = this._removeClass(element, rst);
                    }
                });
            } else {
                this.forEach(function(index, element) {
                    if (this.isElement(element)) {
                        this._removeClass(element, value);
                    }
                }.bind(this));
            }
            
            return this;
        }
        ,
        /** Better performance than removeClass->addClass  */
        replaceClass: function(oldclass, newclass) {
            var classes;
            if (typeof oldclass === "string") {
                if (undefined != newclass) {
                    classes = {};
                    classes.oldclass = newclass;
                }
            } else if (typeof oldclass === "object") {
                classes = oldclass;
            }
            
            if (undefined == classes) {
                throw new Error("replaceClass(): Invalid paramter.");
            }
            
            this.forEach(function(index, element) {
                var cls = element.className;
                cls.split(" ").forEach(function(cur, idx, arr) {
                    if (classes.hasOwnProperty(cur)) {
                        cls = cls.replace(new RegExp("(^|\\s)" + cur + "(\\s|$)"), " " + classes[cur] + " ");
                    }
                });
                element.className = cls.replace(/ {2,}/g, " ");
            });
        }
        ,
        attr: function (attrName, value) {
            if (undefined == value) {
                return this[0].getAttribute(attrName);
            } else {
                this.forEach(function(index, element) {
                    if (this.isElement(element)) {
                        element.setAttribute(attrName, value);
                    }
                }.bind(this));
            }
            
            return this;
        }
        ,
        // TODO: (property [, value])
        css: function(prop, value) {
            var ret = this;
            if (undefined != value) {
                this.forEach(function(index, element) {
                    element.style[prop] = value;
                });
            } else {
                if ("string" === typeof prop) {
                    ret = this[0].style[prop];
                } else if (Array.isArray(prop)) {
                    if (0 < prop.length) {
                        ret = {};
                        prop.forEach(function(p) {
                            ret[p] = this[0].style[p];
                        }.bind(this));
                    }
                } else if ("object" === typeof prop ) {
                    var cssText = "";
                    for (var key in prop) {
                        if (prop.hasOwnProperty(key)) {
                            cssText += key + ":" + prop[key] + ";";
                        }
                    }
                    this.cssText(cssText);
                }
            }
            return ret;
        }
        ,
        cssText: function(csstext) {
            if (!!csstext && typeof(csstext) == "string") {
                var csst = csstext.trim();
                csst = csst.replace(/(\r\n|\n|\r)/gm,"");
                if (!csst.endsWith(";")) {
                    csst += ";"; 
                }
                
                var pattern = /\s*([^;|^:]+):[^;]*;/g;
                var props = [];
                var match;
                while (null != (match = pattern.exec(csst))) {
                    props.push(match[1]);
                }
                
                this.forEach(function(index, element) {
                    var oriStyle = element.style.cssText;
                    if (!oriStyle.endsWith(";")) {
                        oriStyle = oriStyle + ";";
                    }
                    
                    props.forEach(function(prop) {
                       oriStyle = oriStyle.replace(new RegExp("\\s*" + prop + "\\s*:[^;]*;\\s*", "gi"), "");
                    });
                    
                    var delim = oriStyle.endsWith(";") ? "" : ";";
                    element.style.cssText = oriStyle + delim + csst;
                });
                
                return this;
            } else {
                return this[0].cssText;
            }
        }
        ,
        val: function(value) {
            return this.attr("value", value);
        }
        ,
        text: function(text) {
            var ret = this;
            
            if (undefined != text) {
                this.forEach(function(index, element) {
                    element.innerHTML = text;
                });
            } else {
                ret = "";
                this.forEach(function(index, element) {
                    ret += element.innerHTML + " ";
                });
            }
            
            return ret;
        }
        ,
        
        // TODO: make getComputedStyle returned value a sington one.
        // in regard to the returned value of getComputedStyle, it reads
        // "returned style is a live CSSStyleDeclaration object, which updates itself automatically 
        //  when the element's style is changed."
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
        
        /**
         * Set or get the element width value in px (but the "px" will not be presented in the returned value.)
         * If value with unit (such as px, vm, %) is desired, use css() method instead.
         **/
        width: function(w) {
            var ret = this;
            
            if (undefined != w) {
                if (typeof(w) === "number") {
                    w += "px";
                }
                this.forEach(function(index, element) {
                    element.style.width = w;
                });
            } else {
                ret = parseFloat(window.getComputedStyle(this[0], null).width);
            }
            
            return ret;
        }
        ,
        /**
         * Set or get the element width value in px (but the "px" will not be presented in the returned value.)
         * If value with unit (such as px, vm, %) is desired, use css() method instead.
         **/
        height: function(h) {
            var ret = this;
            if (undefined != h) {
                if (typeof(h) === "number") {
                    h += "px";
                }
                this.forEach(function(index, element) {
                    element.style.height = h;
                });
            } else {
                ret = parseFloat(window.getComputedStyle(this[0], null).height);
            }
            
            return ret;
        }
        ,
        /**
         * Set or get the element top value in px (but the "px" will not be presented in the returned value.)
         * If value with unit (such as px, vm, %) is desired, use css() method instead.
         **/
        top: function(t) {
            var ret = this;
            
            if (undefined != t) {
                if (typeof(t) === "number") {
                    t += "px";
                }
                this.forEach(function(index, element) {
                    element.style.top = t;
                });
            } else {
                ret = parseFloat(window.getComputedStyle(this[0], null)).top;
            }
            
            return ret;
        }
        ,
        /**
         * Set or get the element left value in px (but the "px" will not be presented in the returned value.)
         * If value with unit (such as px, vm, %) is desired, use css() method instead.
         **/
        left: function(l) {
            var ret = this;
            
            if (undefined != l) {
                if (typeof(l) === "number") {
                    l += "px";
                }
                this.forEach(function(index, element) {
                    element.style.left = l;
                });
            } else {
                ret = parseFloat(window.getComputedStyle(this[0], null)).left;
            }
            
            return ret;
        }
        ,
        show: function() {
            this.forEach(function(index, element){
                element.style.display = "";
            });
            
            return this;
        }
        ,
        hide: function() {
            this.forEach(function(index, element){
                element.style.display = "none";
            });
            
            return this;
        }
        ,
        visible: function(bvisible) {
            this.forEach(function(index, element){
                element.style.visibility = bvisible ? "visible" : "hidden";
            });
            
            return this;
        }
        ,
        // TODO: (events [, selector] [, data] , handler)
        on: function(events, handler) {
            this._perfomOnOff.bind(this)('on', events, handler);
            return this;
        }
        ,
        // TODO: (events [, selector] [, handler])
        off: function(events, handler) {
            this._perfomOnOff.bind(this)('off', events, handler);
            return this;
        }
        ,
        // TODO: useCapture?
        _perfomOnOff : function(type, events, handler) {
            if (!!events) {
                if ('on' == type && (undefined == handler || null == handler)) {
                    return;
                }
                var eventArr = events.split(" ");
                eventArr.forEach(function(event) {
                    event = event.trim();
                    if (!!event) {
                        this.forEach(function(index, element) {
                            switch (type) {
                                case 'on':
                                    if (0 > Object.keys(this.__eventList).indexOf(event)) {
                                        this.__eventList[event] = [];
                                    }
                                    if (0 > this.__eventList[event].indexOf(handler)) {
                                        this.__eventList[event].push(handler);
                                    }
                                    element.addEventListener(event, handler);
                                    break;
                                case 'off':
                                    if (0 > Object.keys(this.__eventList).indexOf(event)) {
                                        var hds = this.__eventList[event];
                                        if (!!handler) {
                                            var idx = hds.indexOf(handler, 0);
                                            if (0 <= idx) {
                                                hds.splice(idx, 1);
                                            }
                                            // todo review: move removeevent to the above if block?
                                            element.removeEventListener(event, handler);
                                        } else if (!!hds) {
                                            hds.forEach(function(curhd) {
                                                element.removeEventListener(event, curhd);
                                            });
                                        }
                                    }
                                    
                                    break;
                                default:
                                    return;
                            }
                        }.bind(this));
                    }
                }, this);
            }
        }
        ,
        ready: function(func) {
            // TODO
        }
        ,
        onOrientationChanged: function(listener) {
            var mqlPortrait = !!window.matchMedia ? window.matchMedia("(orientation: portrait)") : null;
            if (!!mqlPortrait) {
                mqlPortrait.addListener(function(mql) {
                    listener(mqlPortrait.matches);
                });
            } else {
                window.addEventListener("resize", function() {
                    listener(window.innerHeight > window.innerWidth); // windows.innerHeight / innerWidth would cause reflow
                });
            }
        }
        ,
        append: function(content) {
            if (this.isElement(content)) {
                this.forEach(function(index, element) {
                    element.appendChild(content);
                });
            } else if (this.isHtml(content)) {
                this.append.call(this, new DOM(content)[0]);
            } else if (content instanceof DOM) {
                this.append.call(this, content[0]);
            }

            return this;
        }
        ,
        appendTo: function(owner) {
            if (undefined != owner) {
                this.forEach(function(index, element) {
                    new DOM(owner).append(element);
                });
            }
            
            return this;
        }
    }
    ;
    
    function Emitter() {
        if (!(this instanceof Emitter) && !(Emitter.isPrototypeOf(this))) {
            return new Emitter();
        }
        
        this.emitter_event_list = {};
    }
    
    Emitter.prototype = {
        pub : function(event, args) {
            if (event in this.emitter_event_list) {
                this.emitter_event_list[event].forEach(function(handler){
                    handler(event, args);
                }, this);
            }
        }
        ,
        sub : function(events, handler) {
            var eventArr = events.split(" ");
            eventArr.forEach(function(event) {
                event = !!event ? event.trim() : null;
                if (!event) return;
                
                if (event in this.emitter_event_list) {
                    if (this.emitter_event_list[event].indexOf(handler) < 0) {
                        this.emitter_event_list[event].push(handler);
                    } 
                }else {
                    this.emitter_event_list[event] = [];
                    this.emitter_event_list[event].push(handler);
                }
            }, this);
        }
        ,
        unsub : function(event, handler) {
            if (event in this.emitter_event_list) {
                var idx = -1;
                if ((idx = this.emitter_event_list[event][handler].indexOf(handler)) >= 0) {
                    this.emitter_event_list[event].splice(idx, 1);
                }
            }
        }
    };
    
    /* expose to outside */
    
    global.$U = global.Util = Util;
    global.$E = global.Emitter = Emitter;
    
    if (Util.isWindow(global)) {
        Util.extend(false, DOM.prototype, Util);
        if (!window.document.documentMode || window.document.documentMode >= 11) {
            DOM.prototype.__proto__ = Emitter.prototype;
            global.$ = global.$D = DOM;
        } else {
            global.$ = global.$D = DOM = Util.inherit(Emitter, null, DOM);
        }
    }

})( undefined === window ? this : window );