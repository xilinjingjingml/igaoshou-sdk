"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Websocket = exports.WebsocketEvents = void 0;
var WebsocketEvents;
(function (WebsocketEvents) {
    WebsocketEvents["open"] = "open";
    WebsocketEvents["close"] = "close";
    WebsocketEvents["error"] = "error";
    WebsocketEvents["message"] = "message";
    WebsocketEvents["retry"] = "retry"; // A try to re-connect is made
})(WebsocketEvents = exports.WebsocketEvents || (exports.WebsocketEvents = {}));
var Websocket = /** @class */ (function () {
    Websocket.CONNECTING = Websocket.CONNECTING || 0
    Websocket.OPEN = Websocket.OPEN || 1
    Websocket.CLOSING = Websocket.CLOSING || 2
    Websocket.CLOSED = Websocket.CLOSED || 3

    function Websocket(url, protocols, buffer, backoff, pem) {
        var _this = this;
        this.eventListeners = { open: [], close: [], error: [], message: [], retry: [] };
        this.closedByUser = false;
        this.retries = 0;
        this.handleOpenEvent = function (ev) { return _this.handleEvent(WebsocketEvents.open, ev); };
        this.handleCloseEvent = function (ev) { return _this.handleEvent(WebsocketEvents.close, ev); };
        this.handleErrorEvent = function (ev) { return _this.handleEvent(WebsocketEvents.error, ev); };
        this.handleMessageEvent = function (ev) { return _this.handleEvent(WebsocketEvents.message, ev); };
        this.url = url;
        this.protocols = protocols;
        this.buffer = buffer;
        this.backoff = backoff;
        this.pem = pem
        this.tryConnect();
    }
    Object.defineProperty(Websocket.prototype, "underlyingWebsocket", {
        get: function () {
            return this.websocket;
        },
        enumerable: false,
        configurable: true
    });
    Websocket.prototype.send = function (data) {
        // console.log("====websocket prototype.send====")

        var _a;
        if (this.closedByUser)
            return;
        if (this.websocket === undefined || this.websocket.readyState !== Websocket.OPEN)
            (_a = this.buffer) === null || _a === void 0 ? void 0 : _a.write([data]);   
        else
            this.websocket.send(data);
    };
    Websocket.prototype.close = function (code, reason) {
        var _a;
        this.closedByUser = true;
        (_a = this.websocket) === null || _a === void 0 ? void 0 : _a.close(code, reason);
    };
    Websocket.prototype.addEventListener = function (type, listener, options) {
        var eventListener = { listener: listener, options: options };
        var eventListeners = this.eventListeners[type];
        eventListeners.push(eventListener);
    };
    Websocket.prototype.removeEventListener = function (type, listener, options) {
        this.eventListeners[type] =
            this.eventListeners[type]
                .filter(function (l) {
                return l.listener !== listener && (l.options === undefined || l.options !== options);
            });
    };
    Websocket.prototype.dispatchEvent = function (type, ev) {
        var _this = this;
        var listeners = this.eventListeners[type];
        var onceListeners = [];
        listeners.forEach(function (l) {
            l.listener(_this, ev); // call listener
            if (l.options !== undefined && l.options.once)
                onceListeners.push(l);
        });
        onceListeners.forEach(function (l) { return _this.removeEventListener(type, l.listener, l.options); }); // remove 'once'-listeners
    };
    Websocket.prototype.tryConnect = function () {
        console.log("===try connect===")
        console.log(this.websocket)
        if (this.websocket !== undefined) { // remove all event-listeners from broken socket
            // this.websocket.removeEventListener(WebsocketEvents.open, this.handleOpenEvent);
            // this.websocket.removeEventListener(WebsocketEvents.close, this.handleCloseEvent);
            // this.websocket.removeEventListener(WebsocketEvents.error, this.handleErrorEvent);
            // this.websocket.removeEventListener(WebsocketEvents.message, this.handleMessageEvent);
            this.websocket.onopen = null
            this.websocket.onclose = null
            this.websocket.onerror = null
            this.websocket.onmessage = null
            this.websocket.close();
            console.log("=== this.websocket.close===")            
        }
        console.log(this.websocket)
        this.websocket = this.pem ? new WebSocket(this.url, this.protocols, this.pem) : new WebSocket(this.url, this.protocols); // create new socket and attach handlers
        this.websocket.binaryType = "arraybuffer"
        // console.log(this.websocket)
        // this.websocket.addEventListener(WebsocketEvents.open, this.handleOpenEvent);
        // this.websocket.addEventListener(WebsocketEvents.close, this.handleCloseEvent);
        // this.websocket.addEventListener(WebsocketEvents.error, this.handleErrorEvent);
        // this.websocket.addEventListener(WebsocketEvents.message, this.handleMessageEvent);
        this.websocket.onopen = this.handleOpenEvent
        this.websocket.onclose = this.handleCloseEvent
        this.websocket.onerror = this.handleErrorEvent
        this.websocket.onmessage = this.handleMessageEvent
    };
    Websocket.prototype.handleEvent = function (type, ev) {
        var _a, _b, _c;
        switch (type) {
            case WebsocketEvents.close:
                if (!this.closedByUser) // failed to connect or connection lost, try to reconnect
                    this.reconnect();
                console.log(ev)
                break;
            case WebsocketEvents.open:
                this.retries = 0;
                (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.reset(); // reset backoff
                (_b = this.buffer) === null || _b === void 0 ? void 0 : _b.forEach(this.send.bind(this)); // send all buffered messages
                (_c = this.buffer) === null || _c === void 0 ? void 0 : _c.clear();
                console.log(ev)                
                break;
            case WebsocketEvents.error:
                if (!this.closedByUser && this.WebSocket?.readyState !== Websocket.OPEN) 
                    this.reconnect()
                break;
        }
        this.dispatchEvent(type, ev); // forward to all listeners
    };
    Websocket.prototype.reconnect = function () {
        var _this = this;
        if (this.backoff === undefined) // no backoff, we're done
            return;
        var backoff = this.backoff.next();
        setTimeout(function () {
            // _this.dispatchEvent(WebsocketEvents.retry, new CustomEvent(WebsocketEvents.retry, {
            //     detail: {
            //         retries: ++_this.retries,
            //         backoff: backoff
            //     }
            // }));
            _this.tryConnect();
        }, backoff);
    };
    Websocket.prototype.reset = function () {
        this.tryConnect()
    }
    Websocket.prototype.checkReady = function(){
        console.log("check net ready")
        if (this.websocket.readyState !== Websocket.OPEN) {
            this.reset()
        }
    }
    return Websocket;
}());
exports.Websocket = Websocket;
//# sourceMappingURL=websocket.js.map