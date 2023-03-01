/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = protobuf//require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.gsbase = (function() {

    /**
     * Namespace gsbase.
     * @exports gsbase
     * @namespace
     */
     var gsbase = {};

     /**
      * Version enum.
      * @name gsbase.Version
      * @enum {number}
      * @property {number} major=0 major value
      * @property {number} minor=1 minor value
      */
     gsbase.Version = (function() {
         var valuesById = {}, values = Object.create(valuesById);
         values[valuesById[0] = "major"] = 0;
         values[valuesById[1] = "minor"] = 1;
         return values;
     })();
 
     gsbase.GsBase = (function() {
 
         /**
          * Constructs a new GsBase service.
          * @memberof gsbase
          * @classdesc Represents a GsBase
          * @extends $protobuf.rpc.Service
          * @constructor
          * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
          * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
          * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
          */
         function GsBase(rpcImpl, requestDelimited, responseDelimited) {
             $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
         }
 
         (GsBase.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = GsBase;
 
         /**
          * Creates new GsBase service using the specified rpc implementation.
          * @function create
          * @memberof gsbase.GsBase
          * @static
          * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
          * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
          * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
          * @returns {GsBase} RPC service. Useful where requests and/or responses are streamed.
          */
         GsBase.create = function create(rpcImpl, requestDelimited, responseDelimited) {
             return new this(rpcImpl, requestDelimited, responseDelimited);
         };
 
         /**
          * Callback as used by {@link gsbase.GsBase#joinRoom}.
          * @memberof gsbase.GsBase
          * @typedef JoinRoomCallback
          * @type {function}
          * @param {Error|null} error Error, if any
          * @param {gsbase.Empty} [response] Empty
          */
 
         /**
          * Calls JoinRoom.
          * @function joinRoom
          * @memberof gsbase.GsBase
          * @instance
          * @param {gsbase.IJoinRoomReq} request JoinRoomReq message or plain object
          * @param {gsbase.GsBase.JoinRoomCallback} callback Node-style callback called with the error, if any, and Empty
          * @returns {undefined}
          * @variation 1
          */
         Object.defineProperty(GsBase.prototype.joinRoom = function joinRoom(request, callback) {
             return this.rpcCall(joinRoom, $root.gsbase.JoinRoomReq, $root.gsbase.Empty, request, callback);
         }, "name", { value: "JoinRoom" });
 
         /**
          * Calls JoinRoom.
          * @function joinRoom
          * @memberof gsbase.GsBase
          * @instance
          * @param {gsbase.IJoinRoomReq} request JoinRoomReq message or plain object
          * @returns {Promise<gsbase.Empty>} Promise
          * @variation 2
          */
 
         /**
          * Callback as used by {@link gsbase.GsBase#leaveRoom}.
          * @memberof gsbase.GsBase
          * @typedef LeaveRoomCallback
          * @type {function}
          * @param {Error|null} error Error, if any
          * @param {gsbase.Empty} [response] Empty
          */
 
         /**
          * Calls LeaveRoom.
          * @function leaveRoom
          * @memberof gsbase.GsBase
          * @instance
          * @param {gsbase.ILeaveRoomReq} request LeaveRoomReq message or plain object
          * @param {gsbase.GsBase.LeaveRoomCallback} callback Node-style callback called with the error, if any, and Empty
          * @returns {undefined}
          * @variation 1
          */
         Object.defineProperty(GsBase.prototype.leaveRoom = function leaveRoom(request, callback) {
             return this.rpcCall(leaveRoom, $root.gsbase.LeaveRoomReq, $root.gsbase.Empty, request, callback);
         }, "name", { value: "LeaveRoom" });
 
         /**
          * Calls LeaveRoom.
          * @function leaveRoom
          * @memberof gsbase.GsBase
          * @instance
          * @param {gsbase.ILeaveRoomReq} request LeaveRoomReq message or plain object
          * @returns {Promise<gsbase.Empty>} Promise
          * @variation 2
          */
 
         /**
          * Callback as used by {@link gsbase.GsBase#ping}.
          * @memberof gsbase.GsBase
          * @typedef PingCallback
          * @type {function}
          * @param {Error|null} error Error, if any
          * @param {gsbase.Empty} [response] Empty
          */
 
         /**
          * Calls Ping.
          * @function ping
          * @memberof gsbase.GsBase
          * @instance
          * @param {gsbase.IGsbPing} request GsbPing message or plain object
          * @param {gsbase.GsBase.PingCallback} callback Node-style callback called with the error, if any, and Empty
          * @returns {undefined}
          * @variation 1
          */
         Object.defineProperty(GsBase.prototype.ping = function ping(request, callback) {
             return this.rpcCall(ping, $root.gsbase.GsbPing, $root.gsbase.Empty, request, callback);
         }, "name", { value: "Ping" });
 
         /**
          * Calls Ping.
          * @function ping
          * @memberof gsbase.GsBase
          * @instance
          * @param {gsbase.IGsbPing} request GsbPing message or plain object
          * @returns {Promise<gsbase.Empty>} Promise
          * @variation 2
          */
 
         /**
          * Callback as used by {@link gsbase.GsBase#chat}.
          * @memberof gsbase.GsBase
          * @typedef ChatCallback
          * @type {function}
          * @param {Error|null} error Error, if any
          * @param {gsbase.Empty} [response] Empty
          */
 
         /**
          * Calls Chat.
          * @function chat
          * @memberof gsbase.GsBase
          * @instance
          * @param {gsbase.IChatReq} request ChatReq message or plain object
          * @param {gsbase.GsBase.ChatCallback} callback Node-style callback called with the error, if any, and Empty
          * @returns {undefined}
          * @variation 1
          */
         Object.defineProperty(GsBase.prototype.chat = function chat(request, callback) {
             return this.rpcCall(chat, $root.gsbase.ChatReq, $root.gsbase.Empty, request, callback);
         }, "name", { value: "Chat" });
 
         /**
          * Calls Chat.
          * @function chat
          * @memberof gsbase.GsBase
          * @instance
          * @param {gsbase.IChatReq} request ChatReq message or plain object
          * @returns {Promise<gsbase.Empty>} Promise
          * @variation 2
          */
 
         return GsBase;
     })();
 
     gsbase.GsRpc = (function() {
 
         /**
          * Constructs a new GsRpc service.
          * @memberof gsbase
          * @classdesc Represents a GsRpc
          * @extends $protobuf.rpc.Service
          * @constructor
          * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
          * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
          * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
          */
         function GsRpc(rpcImpl, requestDelimited, responseDelimited) {
             $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
         }
 
         (GsRpc.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = GsRpc;
 
         /**
          * Creates new GsRpc service using the specified rpc implementation.
          * @function create
          * @memberof gsbase.GsRpc
          * @static
          * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
          * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
          * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
          * @returns {GsRpc} RPC service. Useful where requests and/or responses are streamed.
          */
         GsRpc.create = function create(rpcImpl, requestDelimited, responseDelimited) {
             return new this(rpcImpl, requestDelimited, responseDelimited);
         };
 
         /**
          * Callback as used by {@link gsbase.GsRpc#createRoom}.
          * @memberof gsbase.GsRpc
          * @typedef CreateRoomCallback
          * @type {function}
          * @param {Error|null} error Error, if any
          * @param {gsbase.CreateRoomRsp} [response] CreateRoomRsp
          */
 
         /**
          * Calls CreateRoom.
          * @function createRoom
          * @memberof gsbase.GsRpc
          * @instance
          * @param {gsbase.ICreateRoomReq} request CreateRoomReq message or plain object
          * @param {gsbase.GsRpc.CreateRoomCallback} callback Node-style callback called with the error, if any, and CreateRoomRsp
          * @returns {undefined}
          * @variation 1
          */
         Object.defineProperty(GsRpc.prototype.createRoom = function createRoom(request, callback) {
             return this.rpcCall(createRoom, $root.gsbase.CreateRoomReq, $root.gsbase.CreateRoomRsp, request, callback);
         }, "name", { value: "CreateRoom" });
 
         /**
          * Calls CreateRoom.
          * @function createRoom
          * @memberof gsbase.GsRpc
          * @instance
          * @param {gsbase.ICreateRoomReq} request CreateRoomReq message or plain object
          * @returns {Promise<gsbase.CreateRoomRsp>} Promise
          * @variation 2
          */
 
         /**
          * Callback as used by {@link gsbase.GsRpc#dismissRoom}.
          * @memberof gsbase.GsRpc
          * @typedef DismissRoomCallback
          * @type {function}
          * @param {Error|null} error Error, if any
          * @param {gsbase.DismissRoomRsp} [response] DismissRoomRsp
          */
 
         /**
          * Calls DismissRoom.
          * @function dismissRoom
          * @memberof gsbase.GsRpc
          * @instance
          * @param {gsbase.IDismissRoomReq} request DismissRoomReq message or plain object
          * @param {gsbase.GsRpc.DismissRoomCallback} callback Node-style callback called with the error, if any, and DismissRoomRsp
          * @returns {undefined}
          * @variation 1
          */
         Object.defineProperty(GsRpc.prototype.dismissRoom = function dismissRoom(request, callback) {
             return this.rpcCall(dismissRoom, $root.gsbase.DismissRoomReq, $root.gsbase.DismissRoomRsp, request, callback);
         }, "name", { value: "DismissRoom" });
 
         /**
          * Calls DismissRoom.
          * @function dismissRoom
          * @memberof gsbase.GsRpc
          * @instance
          * @param {gsbase.IDismissRoomReq} request DismissRoomReq message or plain object
          * @returns {Promise<gsbase.DismissRoomRsp>} Promise
          * @variation 2
          */
 
         /**
          * Callback as used by {@link gsbase.GsRpc#checkRoomStatus}.
          * @memberof gsbase.GsRpc
          * @typedef CheckRoomStatusCallback
          * @type {function}
          * @param {Error|null} error Error, if any
          * @param {gsbase.CheckRoomStatusRsp} [response] CheckRoomStatusRsp
          */
 
         /**
          * Calls CheckRoomStatus.
          * @function checkRoomStatus
          * @memberof gsbase.GsRpc
          * @instance
          * @param {gsbase.ICheckRoomStatusReq} request CheckRoomStatusReq message or plain object
          * @param {gsbase.GsRpc.CheckRoomStatusCallback} callback Node-style callback called with the error, if any, and CheckRoomStatusRsp
          * @returns {undefined}
          * @variation 1
          */
         Object.defineProperty(GsRpc.prototype.checkRoomStatus = function checkRoomStatus(request, callback) {
             return this.rpcCall(checkRoomStatus, $root.gsbase.CheckRoomStatusReq, $root.gsbase.CheckRoomStatusRsp, request, callback);
         }, "name", { value: "CheckRoomStatus" });
 
         /**
          * Calls CheckRoomStatus.
          * @function checkRoomStatus
          * @memberof gsbase.GsRpc
          * @instance
          * @param {gsbase.ICheckRoomStatusReq} request CheckRoomStatusReq message or plain object
          * @returns {Promise<gsbase.CheckRoomStatusRsp>} Promise
          * @variation 2
          */
 
         return GsRpc;
     })();
 
     gsbase.Empty = (function() {
 
         /**
          * Properties of an Empty.
          * @memberof gsbase
          * @interface IEmpty
          */
 
         /**
          * Constructs a new Empty.
          * @memberof gsbase
          * @classdesc Represents an Empty.
          * @implements IEmpty
          * @constructor
          * @param {gsbase.IEmpty=} [properties] Properties to set
          */
         function Empty(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * Creates a new Empty instance using the specified properties.
          * @function create
          * @memberof gsbase.Empty
          * @static
          * @param {gsbase.IEmpty=} [properties] Properties to set
          * @returns {gsbase.Empty} Empty instance
          */
         Empty.create = function create(properties) {
             return new Empty(properties);
         };
 
         /**
          * Encodes the specified Empty message. Does not implicitly {@link gsbase.Empty.verify|verify} messages.
          * @function encode
          * @memberof gsbase.Empty
          * @static
          * @param {gsbase.IEmpty} message Empty message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         Empty.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             return writer;
         };
 
         /**
          * Encodes the specified Empty message, length delimited. Does not implicitly {@link gsbase.Empty.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.Empty
          * @static
          * @param {gsbase.IEmpty} message Empty message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         Empty.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes an Empty message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.Empty
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.Empty} Empty
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         Empty.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.Empty();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes an Empty message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.Empty
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.Empty} Empty
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         Empty.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies an Empty message.
          * @function verify
          * @memberof gsbase.Empty
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         Empty.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             return null;
         };
 
         /**
          * Creates an Empty message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.Empty
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.Empty} Empty
          */
         Empty.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.Empty)
                 return object;
             return new $root.gsbase.Empty();
         };
 
         /**
          * Creates a plain object from an Empty message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.Empty
          * @static
          * @param {gsbase.Empty} message Empty
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         Empty.toObject = function toObject() {
             return {};
         };
 
         /**
          * Converts this Empty to JSON.
          * @function toJSON
          * @memberof gsbase.Empty
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         Empty.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return Empty;
     })();
 
     gsbase.JoinRoomReq = (function() {
 
         /**
          * Properties of a JoinRoomReq.
          * @memberof gsbase
          * @interface IJoinRoomReq
          * @property {string|null} [roomId] JoinRoomReq roomId
          */
 
         /**
          * Constructs a new JoinRoomReq.
          * @memberof gsbase
          * @classdesc Represents a JoinRoomReq.
          * @implements IJoinRoomReq
          * @constructor
          * @param {gsbase.IJoinRoomReq=} [properties] Properties to set
          */
         function JoinRoomReq(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * JoinRoomReq roomId.
          * @member {string} roomId
          * @memberof gsbase.JoinRoomReq
          * @instance
          */
         JoinRoomReq.prototype.roomId = "";
 
         /**
          * Creates a new JoinRoomReq instance using the specified properties.
          * @function create
          * @memberof gsbase.JoinRoomReq
          * @static
          * @param {gsbase.IJoinRoomReq=} [properties] Properties to set
          * @returns {gsbase.JoinRoomReq} JoinRoomReq instance
          */
         JoinRoomReq.create = function create(properties) {
             return new JoinRoomReq(properties);
         };
 
         /**
          * Encodes the specified JoinRoomReq message. Does not implicitly {@link gsbase.JoinRoomReq.verify|verify} messages.
          * @function encode
          * @memberof gsbase.JoinRoomReq
          * @static
          * @param {gsbase.IJoinRoomReq} message JoinRoomReq message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         JoinRoomReq.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomId);
             return writer;
         };
 
         /**
          * Encodes the specified JoinRoomReq message, length delimited. Does not implicitly {@link gsbase.JoinRoomReq.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.JoinRoomReq
          * @static
          * @param {gsbase.IJoinRoomReq} message JoinRoomReq message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         JoinRoomReq.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a JoinRoomReq message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.JoinRoomReq
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.JoinRoomReq} JoinRoomReq
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         JoinRoomReq.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.JoinRoomReq();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.roomId = reader.string();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a JoinRoomReq message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.JoinRoomReq
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.JoinRoomReq} JoinRoomReq
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         JoinRoomReq.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a JoinRoomReq message.
          * @function verify
          * @memberof gsbase.JoinRoomReq
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         JoinRoomReq.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.roomId != null && message.hasOwnProperty("roomId"))
                 if (!$util.isString(message.roomId))
                     return "roomId: string expected";
             return null;
         };
 
         /**
          * Creates a JoinRoomReq message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.JoinRoomReq
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.JoinRoomReq} JoinRoomReq
          */
         JoinRoomReq.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.JoinRoomReq)
                 return object;
             var message = new $root.gsbase.JoinRoomReq();
             if (object.roomId != null)
                 message.roomId = String(object.roomId);
             return message;
         };
 
         /**
          * Creates a plain object from a JoinRoomReq message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.JoinRoomReq
          * @static
          * @param {gsbase.JoinRoomReq} message JoinRoomReq
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         JoinRoomReq.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults)
                 object.roomId = "";
             if (message.roomId != null && message.hasOwnProperty("roomId"))
                 object.roomId = message.roomId;
             return object;
         };
 
         /**
          * Converts this JoinRoomReq to JSON.
          * @function toJSON
          * @memberof gsbase.JoinRoomReq
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         JoinRoomReq.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return JoinRoomReq;
     })();
 
     gsbase.JoinRoomRsp = (function() {
 
         /**
          * Properties of a JoinRoomRsp.
          * @memberof gsbase
          * @interface IJoinRoomRsp
          * @property {string|null} [err] JoinRoomRsp err
          * @property {gsbase.IRoomInfo|null} [room] JoinRoomRsp room
          */
 
         /**
          * Constructs a new JoinRoomRsp.
          * @memberof gsbase
          * @classdesc Represents a JoinRoomRsp.
          * @implements IJoinRoomRsp
          * @constructor
          * @param {gsbase.IJoinRoomRsp=} [properties] Properties to set
          */
         function JoinRoomRsp(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * JoinRoomRsp err.
          * @member {string} err
          * @memberof gsbase.JoinRoomRsp
          * @instance
          */
         JoinRoomRsp.prototype.err = "";
 
         /**
          * JoinRoomRsp room.
          * @member {gsbase.IRoomInfo|null|undefined} room
          * @memberof gsbase.JoinRoomRsp
          * @instance
          */
         JoinRoomRsp.prototype.room = null;
 
         /**
          * Creates a new JoinRoomRsp instance using the specified properties.
          * @function create
          * @memberof gsbase.JoinRoomRsp
          * @static
          * @param {gsbase.IJoinRoomRsp=} [properties] Properties to set
          * @returns {gsbase.JoinRoomRsp} JoinRoomRsp instance
          */
         JoinRoomRsp.create = function create(properties) {
             return new JoinRoomRsp(properties);
         };
 
         /**
          * Encodes the specified JoinRoomRsp message. Does not implicitly {@link gsbase.JoinRoomRsp.verify|verify} messages.
          * @function encode
          * @memberof gsbase.JoinRoomRsp
          * @static
          * @param {gsbase.IJoinRoomRsp} message JoinRoomRsp message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         JoinRoomRsp.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.err != null && Object.hasOwnProperty.call(message, "err"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.err);
             if (message.room != null && Object.hasOwnProperty.call(message, "room"))
                 $root.gsbase.RoomInfo.encode(message.room, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
             return writer;
         };
 
         /**
          * Encodes the specified JoinRoomRsp message, length delimited. Does not implicitly {@link gsbase.JoinRoomRsp.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.JoinRoomRsp
          * @static
          * @param {gsbase.IJoinRoomRsp} message JoinRoomRsp message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         JoinRoomRsp.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a JoinRoomRsp message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.JoinRoomRsp
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.JoinRoomRsp} JoinRoomRsp
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         JoinRoomRsp.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.JoinRoomRsp();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.err = reader.string();
                     break;
                 case 2:
                     message.room = $root.gsbase.RoomInfo.decode(reader, reader.uint32());
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a JoinRoomRsp message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.JoinRoomRsp
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.JoinRoomRsp} JoinRoomRsp
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         JoinRoomRsp.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a JoinRoomRsp message.
          * @function verify
          * @memberof gsbase.JoinRoomRsp
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         JoinRoomRsp.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.err != null && message.hasOwnProperty("err"))
                 if (!$util.isString(message.err))
                     return "err: string expected";
             if (message.room != null && message.hasOwnProperty("room")) {
                 var error = $root.gsbase.RoomInfo.verify(message.room);
                 if (error)
                     return "room." + error;
             }
             return null;
         };
 
         /**
          * Creates a JoinRoomRsp message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.JoinRoomRsp
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.JoinRoomRsp} JoinRoomRsp
          */
         JoinRoomRsp.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.JoinRoomRsp)
                 return object;
             var message = new $root.gsbase.JoinRoomRsp();
             if (object.err != null)
                 message.err = String(object.err);
             if (object.room != null) {
                 if (typeof object.room !== "object")
                     throw TypeError(".gsbase.JoinRoomRsp.room: object expected");
                 message.room = $root.gsbase.RoomInfo.fromObject(object.room);
             }
             return message;
         };
 
         /**
          * Creates a plain object from a JoinRoomRsp message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.JoinRoomRsp
          * @static
          * @param {gsbase.JoinRoomRsp} message JoinRoomRsp
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         JoinRoomRsp.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults) {
                 object.err = "";
                 object.room = null;
             }
             if (message.err != null && message.hasOwnProperty("err"))
                 object.err = message.err;
             if (message.room != null && message.hasOwnProperty("room"))
                 object.room = $root.gsbase.RoomInfo.toObject(message.room, options);
             return object;
         };
 
         /**
          * Converts this JoinRoomRsp to JSON.
          * @function toJSON
          * @memberof gsbase.JoinRoomRsp
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         JoinRoomRsp.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return JoinRoomRsp;
     })();
 
     gsbase.JoinRoomNot = (function() {
 
         /**
          * Properties of a JoinRoomNot.
          * @memberof gsbase
          * @interface IJoinRoomNot
          * @property {string|null} [openid] JoinRoomNot openid
          * @property {gsbase.IRoomInfo|null} [room] JoinRoomNot room
          */
 
         /**
          * Constructs a new JoinRoomNot.
          * @memberof gsbase
          * @classdesc Represents a JoinRoomNot.
          * @implements IJoinRoomNot
          * @constructor
          * @param {gsbase.IJoinRoomNot=} [properties] Properties to set
          */
         function JoinRoomNot(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * JoinRoomNot openid.
          * @member {string} openid
          * @memberof gsbase.JoinRoomNot
          * @instance
          */
         JoinRoomNot.prototype.openid = "";
 
         /**
          * JoinRoomNot room.
          * @member {gsbase.IRoomInfo|null|undefined} room
          * @memberof gsbase.JoinRoomNot
          * @instance
          */
         JoinRoomNot.prototype.room = null;
 
         /**
          * Creates a new JoinRoomNot instance using the specified properties.
          * @function create
          * @memberof gsbase.JoinRoomNot
          * @static
          * @param {gsbase.IJoinRoomNot=} [properties] Properties to set
          * @returns {gsbase.JoinRoomNot} JoinRoomNot instance
          */
         JoinRoomNot.create = function create(properties) {
             return new JoinRoomNot(properties);
         };
 
         /**
          * Encodes the specified JoinRoomNot message. Does not implicitly {@link gsbase.JoinRoomNot.verify|verify} messages.
          * @function encode
          * @memberof gsbase.JoinRoomNot
          * @static
          * @param {gsbase.IJoinRoomNot} message JoinRoomNot message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         JoinRoomNot.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.openid != null && Object.hasOwnProperty.call(message, "openid"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.openid);
             if (message.room != null && Object.hasOwnProperty.call(message, "room"))
                 $root.gsbase.RoomInfo.encode(message.room, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
             return writer;
         };
 
         /**
          * Encodes the specified JoinRoomNot message, length delimited. Does not implicitly {@link gsbase.JoinRoomNot.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.JoinRoomNot
          * @static
          * @param {gsbase.IJoinRoomNot} message JoinRoomNot message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         JoinRoomNot.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a JoinRoomNot message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.JoinRoomNot
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.JoinRoomNot} JoinRoomNot
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         JoinRoomNot.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.JoinRoomNot();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.openid = reader.string();
                     break;
                 case 2:
                     message.room = $root.gsbase.RoomInfo.decode(reader, reader.uint32());
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a JoinRoomNot message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.JoinRoomNot
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.JoinRoomNot} JoinRoomNot
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         JoinRoomNot.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a JoinRoomNot message.
          * @function verify
          * @memberof gsbase.JoinRoomNot
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         JoinRoomNot.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.openid != null && message.hasOwnProperty("openid"))
                 if (!$util.isString(message.openid))
                     return "openid: string expected";
             if (message.room != null && message.hasOwnProperty("room")) {
                 var error = $root.gsbase.RoomInfo.verify(message.room);
                 if (error)
                     return "room." + error;
             }
             return null;
         };
 
         /**
          * Creates a JoinRoomNot message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.JoinRoomNot
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.JoinRoomNot} JoinRoomNot
          */
         JoinRoomNot.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.JoinRoomNot)
                 return object;
             var message = new $root.gsbase.JoinRoomNot();
             if (object.openid != null)
                 message.openid = String(object.openid);
             if (object.room != null) {
                 if (typeof object.room !== "object")
                     throw TypeError(".gsbase.JoinRoomNot.room: object expected");
                 message.room = $root.gsbase.RoomInfo.fromObject(object.room);
             }
             return message;
         };
 
         /**
          * Creates a plain object from a JoinRoomNot message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.JoinRoomNot
          * @static
          * @param {gsbase.JoinRoomNot} message JoinRoomNot
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         JoinRoomNot.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults) {
                 object.openid = "";
                 object.room = null;
             }
             if (message.openid != null && message.hasOwnProperty("openid"))
                 object.openid = message.openid;
             if (message.room != null && message.hasOwnProperty("room"))
                 object.room = $root.gsbase.RoomInfo.toObject(message.room, options);
             return object;
         };
 
         /**
          * Converts this JoinRoomNot to JSON.
          * @function toJSON
          * @memberof gsbase.JoinRoomNot
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         JoinRoomNot.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return JoinRoomNot;
     })();
 
     gsbase.LeaveRoomReq = (function() {
 
         /**
          * Properties of a LeaveRoomReq.
          * @memberof gsbase
          * @interface ILeaveRoomReq
          */
 
         /**
          * Constructs a new LeaveRoomReq.
          * @memberof gsbase
          * @classdesc Represents a LeaveRoomReq.
          * @implements ILeaveRoomReq
          * @constructor
          * @param {gsbase.ILeaveRoomReq=} [properties] Properties to set
          */
         function LeaveRoomReq(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * Creates a new LeaveRoomReq instance using the specified properties.
          * @function create
          * @memberof gsbase.LeaveRoomReq
          * @static
          * @param {gsbase.ILeaveRoomReq=} [properties] Properties to set
          * @returns {gsbase.LeaveRoomReq} LeaveRoomReq instance
          */
         LeaveRoomReq.create = function create(properties) {
             return new LeaveRoomReq(properties);
         };
 
         /**
          * Encodes the specified LeaveRoomReq message. Does not implicitly {@link gsbase.LeaveRoomReq.verify|verify} messages.
          * @function encode
          * @memberof gsbase.LeaveRoomReq
          * @static
          * @param {gsbase.ILeaveRoomReq} message LeaveRoomReq message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         LeaveRoomReq.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             return writer;
         };
 
         /**
          * Encodes the specified LeaveRoomReq message, length delimited. Does not implicitly {@link gsbase.LeaveRoomReq.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.LeaveRoomReq
          * @static
          * @param {gsbase.ILeaveRoomReq} message LeaveRoomReq message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         LeaveRoomReq.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a LeaveRoomReq message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.LeaveRoomReq
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.LeaveRoomReq} LeaveRoomReq
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         LeaveRoomReq.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.LeaveRoomReq();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a LeaveRoomReq message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.LeaveRoomReq
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.LeaveRoomReq} LeaveRoomReq
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         LeaveRoomReq.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a LeaveRoomReq message.
          * @function verify
          * @memberof gsbase.LeaveRoomReq
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         LeaveRoomReq.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             return null;
         };
 
         /**
          * Creates a LeaveRoomReq message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.LeaveRoomReq
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.LeaveRoomReq} LeaveRoomReq
          */
         LeaveRoomReq.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.LeaveRoomReq)
                 return object;
             return new $root.gsbase.LeaveRoomReq();
         };
 
         /**
          * Creates a plain object from a LeaveRoomReq message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.LeaveRoomReq
          * @static
          * @param {gsbase.LeaveRoomReq} message LeaveRoomReq
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         LeaveRoomReq.toObject = function toObject() {
             return {};
         };
 
         /**
          * Converts this LeaveRoomReq to JSON.
          * @function toJSON
          * @memberof gsbase.LeaveRoomReq
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         LeaveRoomReq.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return LeaveRoomReq;
     })();
 
     gsbase.LeaveRoomRsp = (function() {
 
         /**
          * Properties of a LeaveRoomRsp.
          * @memberof gsbase
          * @interface ILeaveRoomRsp
          * @property {string|null} [err] LeaveRoomRsp err
          * @property {string|null} [openid] LeaveRoomRsp openid
          */
 
         /**
          * Constructs a new LeaveRoomRsp.
          * @memberof gsbase
          * @classdesc Represents a LeaveRoomRsp.
          * @implements ILeaveRoomRsp
          * @constructor
          * @param {gsbase.ILeaveRoomRsp=} [properties] Properties to set
          */
         function LeaveRoomRsp(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * LeaveRoomRsp err.
          * @member {string} err
          * @memberof gsbase.LeaveRoomRsp
          * @instance
          */
         LeaveRoomRsp.prototype.err = "";
 
         /**
          * LeaveRoomRsp openid.
          * @member {string} openid
          * @memberof gsbase.LeaveRoomRsp
          * @instance
          */
         LeaveRoomRsp.prototype.openid = "";
 
         /**
          * Creates a new LeaveRoomRsp instance using the specified properties.
          * @function create
          * @memberof gsbase.LeaveRoomRsp
          * @static
          * @param {gsbase.ILeaveRoomRsp=} [properties] Properties to set
          * @returns {gsbase.LeaveRoomRsp} LeaveRoomRsp instance
          */
         LeaveRoomRsp.create = function create(properties) {
             return new LeaveRoomRsp(properties);
         };
 
         /**
          * Encodes the specified LeaveRoomRsp message. Does not implicitly {@link gsbase.LeaveRoomRsp.verify|verify} messages.
          * @function encode
          * @memberof gsbase.LeaveRoomRsp
          * @static
          * @param {gsbase.ILeaveRoomRsp} message LeaveRoomRsp message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         LeaveRoomRsp.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.err != null && Object.hasOwnProperty.call(message, "err"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.err);
             if (message.openid != null && Object.hasOwnProperty.call(message, "openid"))
                 writer.uint32(/* id 2, wireType 2 =*/18).string(message.openid);
             return writer;
         };
 
         /**
          * Encodes the specified LeaveRoomRsp message, length delimited. Does not implicitly {@link gsbase.LeaveRoomRsp.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.LeaveRoomRsp
          * @static
          * @param {gsbase.ILeaveRoomRsp} message LeaveRoomRsp message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         LeaveRoomRsp.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a LeaveRoomRsp message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.LeaveRoomRsp
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.LeaveRoomRsp} LeaveRoomRsp
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         LeaveRoomRsp.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.LeaveRoomRsp();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.err = reader.string();
                     break;
                 case 2:
                     message.openid = reader.string();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a LeaveRoomRsp message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.LeaveRoomRsp
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.LeaveRoomRsp} LeaveRoomRsp
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         LeaveRoomRsp.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a LeaveRoomRsp message.
          * @function verify
          * @memberof gsbase.LeaveRoomRsp
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         LeaveRoomRsp.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.err != null && message.hasOwnProperty("err"))
                 if (!$util.isString(message.err))
                     return "err: string expected";
             if (message.openid != null && message.hasOwnProperty("openid"))
                 if (!$util.isString(message.openid))
                     return "openid: string expected";
             return null;
         };
 
         /**
          * Creates a LeaveRoomRsp message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.LeaveRoomRsp
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.LeaveRoomRsp} LeaveRoomRsp
          */
         LeaveRoomRsp.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.LeaveRoomRsp)
                 return object;
             var message = new $root.gsbase.LeaveRoomRsp();
             if (object.err != null)
                 message.err = String(object.err);
             if (object.openid != null)
                 message.openid = String(object.openid);
             return message;
         };
 
         /**
          * Creates a plain object from a LeaveRoomRsp message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.LeaveRoomRsp
          * @static
          * @param {gsbase.LeaveRoomRsp} message LeaveRoomRsp
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         LeaveRoomRsp.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults) {
                 object.err = "";
                 object.openid = "";
             }
             if (message.err != null && message.hasOwnProperty("err"))
                 object.err = message.err;
             if (message.openid != null && message.hasOwnProperty("openid"))
                 object.openid = message.openid;
             return object;
         };
 
         /**
          * Converts this LeaveRoomRsp to JSON.
          * @function toJSON
          * @memberof gsbase.LeaveRoomRsp
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         LeaveRoomRsp.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return LeaveRoomRsp;
     })();
 
     gsbase.LeaveRoomNot = (function() {
 
         /**
          * Properties of a LeaveRoomNot.
          * @memberof gsbase
          * @interface ILeaveRoomNot
          * @property {string|null} [plyId] LeaveRoomNot plyId
          */
 
         /**
          * Constructs a new LeaveRoomNot.
          * @memberof gsbase
          * @classdesc Represents a LeaveRoomNot.
          * @implements ILeaveRoomNot
          * @constructor
          * @param {gsbase.ILeaveRoomNot=} [properties] Properties to set
          */
         function LeaveRoomNot(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * LeaveRoomNot plyId.
          * @member {string} plyId
          * @memberof gsbase.LeaveRoomNot
          * @instance
          */
         LeaveRoomNot.prototype.plyId = "";
 
         /**
          * Creates a new LeaveRoomNot instance using the specified properties.
          * @function create
          * @memberof gsbase.LeaveRoomNot
          * @static
          * @param {gsbase.ILeaveRoomNot=} [properties] Properties to set
          * @returns {gsbase.LeaveRoomNot} LeaveRoomNot instance
          */
         LeaveRoomNot.create = function create(properties) {
             return new LeaveRoomNot(properties);
         };
 
         /**
          * Encodes the specified LeaveRoomNot message. Does not implicitly {@link gsbase.LeaveRoomNot.verify|verify} messages.
          * @function encode
          * @memberof gsbase.LeaveRoomNot
          * @static
          * @param {gsbase.ILeaveRoomNot} message LeaveRoomNot message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         LeaveRoomNot.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.plyId != null && Object.hasOwnProperty.call(message, "plyId"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.plyId);
             return writer;
         };
 
         /**
          * Encodes the specified LeaveRoomNot message, length delimited. Does not implicitly {@link gsbase.LeaveRoomNot.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.LeaveRoomNot
          * @static
          * @param {gsbase.ILeaveRoomNot} message LeaveRoomNot message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         LeaveRoomNot.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a LeaveRoomNot message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.LeaveRoomNot
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.LeaveRoomNot} LeaveRoomNot
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         LeaveRoomNot.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.LeaveRoomNot();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.plyId = reader.string();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a LeaveRoomNot message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.LeaveRoomNot
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.LeaveRoomNot} LeaveRoomNot
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         LeaveRoomNot.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a LeaveRoomNot message.
          * @function verify
          * @memberof gsbase.LeaveRoomNot
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         LeaveRoomNot.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.plyId != null && message.hasOwnProperty("plyId"))
                 if (!$util.isString(message.plyId))
                     return "plyId: string expected";
             return null;
         };
 
         /**
          * Creates a LeaveRoomNot message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.LeaveRoomNot
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.LeaveRoomNot} LeaveRoomNot
          */
         LeaveRoomNot.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.LeaveRoomNot)
                 return object;
             var message = new $root.gsbase.LeaveRoomNot();
             if (object.plyId != null)
                 message.plyId = String(object.plyId);
             return message;
         };
 
         /**
          * Creates a plain object from a LeaveRoomNot message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.LeaveRoomNot
          * @static
          * @param {gsbase.LeaveRoomNot} message LeaveRoomNot
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         LeaveRoomNot.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults)
                 object.plyId = "";
             if (message.plyId != null && message.hasOwnProperty("plyId"))
                 object.plyId = message.plyId;
             return object;
         };
 
         /**
          * Converts this LeaveRoomNot to JSON.
          * @function toJSON
          * @memberof gsbase.LeaveRoomNot
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         LeaveRoomNot.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return LeaveRoomNot;
     })();
 
     gsbase.DismissNot = (function() {
 
         /**
          * Properties of a DismissNot.
          * @memberof gsbase
          * @interface IDismissNot
          * @property {string|null} [msg] DismissNot msg
          */
 
         /**
          * Constructs a new DismissNot.
          * @memberof gsbase
          * @classdesc Represents a DismissNot.
          * @implements IDismissNot
          * @constructor
          * @param {gsbase.IDismissNot=} [properties] Properties to set
          */
         function DismissNot(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * DismissNot msg.
          * @member {string} msg
          * @memberof gsbase.DismissNot
          * @instance
          */
         DismissNot.prototype.msg = "";
 
         /**
          * Creates a new DismissNot instance using the specified properties.
          * @function create
          * @memberof gsbase.DismissNot
          * @static
          * @param {gsbase.IDismissNot=} [properties] Properties to set
          * @returns {gsbase.DismissNot} DismissNot instance
          */
         DismissNot.create = function create(properties) {
             return new DismissNot(properties);
         };
 
         /**
          * Encodes the specified DismissNot message. Does not implicitly {@link gsbase.DismissNot.verify|verify} messages.
          * @function encode
          * @memberof gsbase.DismissNot
          * @static
          * @param {gsbase.IDismissNot} message DismissNot message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         DismissNot.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.msg);
             return writer;
         };
 
         /**
          * Encodes the specified DismissNot message, length delimited. Does not implicitly {@link gsbase.DismissNot.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.DismissNot
          * @static
          * @param {gsbase.IDismissNot} message DismissNot message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         DismissNot.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a DismissNot message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.DismissNot
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.DismissNot} DismissNot
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         DismissNot.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.DismissNot();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.msg = reader.string();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a DismissNot message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.DismissNot
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.DismissNot} DismissNot
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         DismissNot.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a DismissNot message.
          * @function verify
          * @memberof gsbase.DismissNot
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         DismissNot.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.msg != null && message.hasOwnProperty("msg"))
                 if (!$util.isString(message.msg))
                     return "msg: string expected";
             return null;
         };
 
         /**
          * Creates a DismissNot message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.DismissNot
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.DismissNot} DismissNot
          */
         DismissNot.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.DismissNot)
                 return object;
             var message = new $root.gsbase.DismissNot();
             if (object.msg != null)
                 message.msg = String(object.msg);
             return message;
         };
 
         /**
          * Creates a plain object from a DismissNot message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.DismissNot
          * @static
          * @param {gsbase.DismissNot} message DismissNot
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         DismissNot.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults)
                 object.msg = "";
             if (message.msg != null && message.hasOwnProperty("msg"))
                 object.msg = message.msg;
             return object;
         };
 
         /**
          * Converts this DismissNot to JSON.
          * @function toJSON
          * @memberof gsbase.DismissNot
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         DismissNot.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return DismissNot;
     })();
 
     gsbase.GsbPing = (function() {
 
         /**
          * Properties of a GsbPing.
          * @memberof gsbase
          * @interface IGsbPing
          * @property {number|Long|null} [now] GsbPing now
          */
 
         /**
          * Constructs a new GsbPing.
          * @memberof gsbase
          * @classdesc Represents a GsbPing.
          * @implements IGsbPing
          * @constructor
          * @param {gsbase.IGsbPing=} [properties] Properties to set
          */
         function GsbPing(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * GsbPing now.
          * @member {number|Long} now
          * @memberof gsbase.GsbPing
          * @instance
          */
         GsbPing.prototype.now = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
 
         /**
          * Creates a new GsbPing instance using the specified properties.
          * @function create
          * @memberof gsbase.GsbPing
          * @static
          * @param {gsbase.IGsbPing=} [properties] Properties to set
          * @returns {gsbase.GsbPing} GsbPing instance
          */
         GsbPing.create = function create(properties) {
             return new GsbPing(properties);
         };
 
         /**
          * Encodes the specified GsbPing message. Does not implicitly {@link gsbase.GsbPing.verify|verify} messages.
          * @function encode
          * @memberof gsbase.GsbPing
          * @static
          * @param {gsbase.IGsbPing} message GsbPing message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         GsbPing.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.now != null && Object.hasOwnProperty.call(message, "now"))
                 writer.uint32(/* id 1, wireType 0 =*/8).int64(message.now);
             return writer;
         };
 
         /**
          * Encodes the specified GsbPing message, length delimited. Does not implicitly {@link gsbase.GsbPing.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.GsbPing
          * @static
          * @param {gsbase.IGsbPing} message GsbPing message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         GsbPing.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a GsbPing message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.GsbPing
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.GsbPing} GsbPing
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         GsbPing.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.GsbPing();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.now = reader.int64();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a GsbPing message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.GsbPing
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.GsbPing} GsbPing
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         GsbPing.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a GsbPing message.
          * @function verify
          * @memberof gsbase.GsbPing
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         GsbPing.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.now != null && message.hasOwnProperty("now"))
                 if (!$util.isInteger(message.now) && !(message.now && $util.isInteger(message.now.low) && $util.isInteger(message.now.high)))
                     return "now: integer|Long expected";
             return null;
         };
 
         /**
          * Creates a GsbPing message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.GsbPing
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.GsbPing} GsbPing
          */
         GsbPing.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.GsbPing)
                 return object;
             var message = new $root.gsbase.GsbPing();
             if (object.now != null)
                 if ($util.Long)
                     (message.now = $util.Long.fromValue(object.now)).unsigned = false;
                 else if (typeof object.now === "string")
                     message.now = parseInt(object.now, 10);
                 else if (typeof object.now === "number")
                     message.now = object.now;
                 else if (typeof object.now === "object")
                     message.now = new $util.LongBits(object.now.low >>> 0, object.now.high >>> 0).toNumber();
             return message;
         };
 
         /**
          * Creates a plain object from a GsbPing message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.GsbPing
          * @static
          * @param {gsbase.GsbPing} message GsbPing
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         GsbPing.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults)
                 if ($util.Long) {
                     var long = new $util.Long(0, 0, false);
                     object.now = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                 } else
                     object.now = options.longs === String ? "0" : 0;
             if (message.now != null && message.hasOwnProperty("now"))
                 if (typeof message.now === "number")
                     object.now = options.longs === String ? String(message.now) : message.now;
                 else
                     object.now = options.longs === String ? $util.Long.prototype.toString.call(message.now) : options.longs === Number ? new $util.LongBits(message.now.low >>> 0, message.now.high >>> 0).toNumber() : message.now;
             return object;
         };
 
         /**
          * Converts this GsbPing to JSON.
          * @function toJSON
          * @memberof gsbase.GsbPing
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         GsbPing.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return GsbPing;
     })();
 
     gsbase.GsbPong = (function() {
 
         /**
          * Properties of a GsbPong.
          * @memberof gsbase
          * @interface IGsbPong
          * @property {string|null} [err] GsbPong err
          * @property {number|Long|null} [cliNow] GsbPong cliNow
          * @property {number|Long|null} [now] GsbPong now
          */
 
         /**
          * Constructs a new GsbPong.
          * @memberof gsbase
          * @classdesc Represents a GsbPong.
          * @implements IGsbPong
          * @constructor
          * @param {gsbase.IGsbPong=} [properties] Properties to set
          */
         function GsbPong(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * GsbPong err.
          * @member {string} err
          * @memberof gsbase.GsbPong
          * @instance
          */
         GsbPong.prototype.err = "";
 
         /**
          * GsbPong cliNow.
          * @member {number|Long} cliNow
          * @memberof gsbase.GsbPong
          * @instance
          */
         GsbPong.prototype.cliNow = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
 
         /**
          * GsbPong now.
          * @member {number|Long} now
          * @memberof gsbase.GsbPong
          * @instance
          */
         GsbPong.prototype.now = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
 
         /**
          * Creates a new GsbPong instance using the specified properties.
          * @function create
          * @memberof gsbase.GsbPong
          * @static
          * @param {gsbase.IGsbPong=} [properties] Properties to set
          * @returns {gsbase.GsbPong} GsbPong instance
          */
         GsbPong.create = function create(properties) {
             return new GsbPong(properties);
         };
 
         /**
          * Encodes the specified GsbPong message. Does not implicitly {@link gsbase.GsbPong.verify|verify} messages.
          * @function encode
          * @memberof gsbase.GsbPong
          * @static
          * @param {gsbase.IGsbPong} message GsbPong message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         GsbPong.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.err != null && Object.hasOwnProperty.call(message, "err"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.err);
             if (message.cliNow != null && Object.hasOwnProperty.call(message, "cliNow"))
                 writer.uint32(/* id 2, wireType 0 =*/16).int64(message.cliNow);
             if (message.now != null && Object.hasOwnProperty.call(message, "now"))
                 writer.uint32(/* id 3, wireType 0 =*/24).int64(message.now);
             return writer;
         };
 
         /**
          * Encodes the specified GsbPong message, length delimited. Does not implicitly {@link gsbase.GsbPong.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.GsbPong
          * @static
          * @param {gsbase.IGsbPong} message GsbPong message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         GsbPong.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a GsbPong message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.GsbPong
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.GsbPong} GsbPong
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         GsbPong.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.GsbPong();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.err = reader.string();
                     break;
                 case 2:
                     message.cliNow = reader.int64();
                     break;
                 case 3:
                     message.now = reader.int64();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a GsbPong message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.GsbPong
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.GsbPong} GsbPong
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         GsbPong.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a GsbPong message.
          * @function verify
          * @memberof gsbase.GsbPong
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         GsbPong.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.err != null && message.hasOwnProperty("err"))
                 if (!$util.isString(message.err))
                     return "err: string expected";
             if (message.cliNow != null && message.hasOwnProperty("cliNow"))
                 if (!$util.isInteger(message.cliNow) && !(message.cliNow && $util.isInteger(message.cliNow.low) && $util.isInteger(message.cliNow.high)))
                     return "cliNow: integer|Long expected";
             if (message.now != null && message.hasOwnProperty("now"))
                 if (!$util.isInteger(message.now) && !(message.now && $util.isInteger(message.now.low) && $util.isInteger(message.now.high)))
                     return "now: integer|Long expected";
             return null;
         };
 
         /**
          * Creates a GsbPong message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.GsbPong
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.GsbPong} GsbPong
          */
         GsbPong.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.GsbPong)
                 return object;
             var message = new $root.gsbase.GsbPong();
             if (object.err != null)
                 message.err = String(object.err);
             if (object.cliNow != null)
                 if ($util.Long)
                     (message.cliNow = $util.Long.fromValue(object.cliNow)).unsigned = false;
                 else if (typeof object.cliNow === "string")
                     message.cliNow = parseInt(object.cliNow, 10);
                 else if (typeof object.cliNow === "number")
                     message.cliNow = object.cliNow;
                 else if (typeof object.cliNow === "object")
                     message.cliNow = new $util.LongBits(object.cliNow.low >>> 0, object.cliNow.high >>> 0).toNumber();
             if (object.now != null)
                 if ($util.Long)
                     (message.now = $util.Long.fromValue(object.now)).unsigned = false;
                 else if (typeof object.now === "string")
                     message.now = parseInt(object.now, 10);
                 else if (typeof object.now === "number")
                     message.now = object.now;
                 else if (typeof object.now === "object")
                     message.now = new $util.LongBits(object.now.low >>> 0, object.now.high >>> 0).toNumber();
             return message;
         };
 
         /**
          * Creates a plain object from a GsbPong message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.GsbPong
          * @static
          * @param {gsbase.GsbPong} message GsbPong
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         GsbPong.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults) {
                 object.err = "";
                 if ($util.Long) {
                     var long = new $util.Long(0, 0, false);
                     object.cliNow = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                 } else
                     object.cliNow = options.longs === String ? "0" : 0;
                 if ($util.Long) {
                     var long = new $util.Long(0, 0, false);
                     object.now = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                 } else
                     object.now = options.longs === String ? "0" : 0;
             }
             if (message.err != null && message.hasOwnProperty("err"))
                 object.err = message.err;
             if (message.cliNow != null && message.hasOwnProperty("cliNow"))
                 if (typeof message.cliNow === "number")
                     object.cliNow = options.longs === String ? String(message.cliNow) : message.cliNow;
                 else
                     object.cliNow = options.longs === String ? $util.Long.prototype.toString.call(message.cliNow) : options.longs === Number ? new $util.LongBits(message.cliNow.low >>> 0, message.cliNow.high >>> 0).toNumber() : message.cliNow;
             if (message.now != null && message.hasOwnProperty("now"))
                 if (typeof message.now === "number")
                     object.now = options.longs === String ? String(message.now) : message.now;
                 else
                     object.now = options.longs === String ? $util.Long.prototype.toString.call(message.now) : options.longs === Number ? new $util.LongBits(message.now.low >>> 0, message.now.high >>> 0).toNumber() : message.now;
             return object;
         };
 
         /**
          * Converts this GsbPong to JSON.
          * @function toJSON
          * @memberof gsbase.GsbPong
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         GsbPong.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return GsbPong;
     })();
 
     /**
      * ChatType enum.
      * @name gsbase.ChatType
      * @enum {number}
      * @property {number} Text=0 Text value
      * @property {number} Emoji=1 Emoji value
      */
     gsbase.ChatType = (function() {
         var valuesById = {}, values = Object.create(valuesById);
         values[valuesById[0] = "Text"] = 0;
         values[valuesById[1] = "Emoji"] = 1;
         return values;
     })();
 
     gsbase.ChatReq = (function() {
 
         /**
          * Properties of a ChatReq.
          * @memberof gsbase
          * @interface IChatReq
          * @property {gsbase.ChatType|null} [type] ChatReq type
          * @property {string|null} [content] ChatReq content
          * @property {string|null} [to] ChatReq to
          */
 
         /**
          * Constructs a new ChatReq.
          * @memberof gsbase
          * @classdesc Represents a ChatReq.
          * @implements IChatReq
          * @constructor
          * @param {gsbase.IChatReq=} [properties] Properties to set
          */
         function ChatReq(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * ChatReq type.
          * @member {gsbase.ChatType} type
          * @memberof gsbase.ChatReq
          * @instance
          */
         ChatReq.prototype.type = 0;
 
         /**
          * ChatReq content.
          * @member {string} content
          * @memberof gsbase.ChatReq
          * @instance
          */
         ChatReq.prototype.content = "";
 
         /**
          * ChatReq to.
          * @member {string} to
          * @memberof gsbase.ChatReq
          * @instance
          */
         ChatReq.prototype.to = "";
 
         /**
          * Creates a new ChatReq instance using the specified properties.
          * @function create
          * @memberof gsbase.ChatReq
          * @static
          * @param {gsbase.IChatReq=} [properties] Properties to set
          * @returns {gsbase.ChatReq} ChatReq instance
          */
         ChatReq.create = function create(properties) {
             return new ChatReq(properties);
         };
 
         /**
          * Encodes the specified ChatReq message. Does not implicitly {@link gsbase.ChatReq.verify|verify} messages.
          * @function encode
          * @memberof gsbase.ChatReq
          * @static
          * @param {gsbase.IChatReq} message ChatReq message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         ChatReq.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                 writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
             if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                 writer.uint32(/* id 2, wireType 2 =*/18).string(message.content);
             if (message.to != null && Object.hasOwnProperty.call(message, "to"))
                 writer.uint32(/* id 3, wireType 2 =*/26).string(message.to);
             return writer;
         };
 
         /**
          * Encodes the specified ChatReq message, length delimited. Does not implicitly {@link gsbase.ChatReq.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.ChatReq
          * @static
          * @param {gsbase.IChatReq} message ChatReq message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         ChatReq.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a ChatReq message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.ChatReq
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.ChatReq} ChatReq
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         ChatReq.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.ChatReq();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.type = reader.int32();
                     break;
                 case 2:
                     message.content = reader.string();
                     break;
                 case 3:
                     message.to = reader.string();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a ChatReq message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.ChatReq
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.ChatReq} ChatReq
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         ChatReq.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a ChatReq message.
          * @function verify
          * @memberof gsbase.ChatReq
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         ChatReq.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.type != null && message.hasOwnProperty("type"))
                 switch (message.type) {
                 default:
                     return "type: enum value expected";
                 case 0:
                 case 1:
                     break;
                 }
             if (message.content != null && message.hasOwnProperty("content"))
                 if (!$util.isString(message.content))
                     return "content: string expected";
             if (message.to != null && message.hasOwnProperty("to"))
                 if (!$util.isString(message.to))
                     return "to: string expected";
             return null;
         };
 
         /**
          * Creates a ChatReq message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.ChatReq
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.ChatReq} ChatReq
          */
         ChatReq.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.ChatReq)
                 return object;
             var message = new $root.gsbase.ChatReq();
             switch (object.type) {
             case "Text":
             case 0:
                 message.type = 0;
                 break;
             case "Emoji":
             case 1:
                 message.type = 1;
                 break;
             }
             if (object.content != null)
                 message.content = String(object.content);
             if (object.to != null)
                 message.to = String(object.to);
             return message;
         };
 
         /**
          * Creates a plain object from a ChatReq message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.ChatReq
          * @static
          * @param {gsbase.ChatReq} message ChatReq
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         ChatReq.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults) {
                 object.type = options.enums === String ? "Text" : 0;
                 object.content = "";
                 object.to = "";
             }
             if (message.type != null && message.hasOwnProperty("type"))
                 object.type = options.enums === String ? $root.gsbase.ChatType[message.type] : message.type;
             if (message.content != null && message.hasOwnProperty("content"))
                 object.content = message.content;
             if (message.to != null && message.hasOwnProperty("to"))
                 object.to = message.to;
             return object;
         };
 
         /**
          * Converts this ChatReq to JSON.
          * @function toJSON
          * @memberof gsbase.ChatReq
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         ChatReq.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return ChatReq;
     })();
 
     gsbase.ChatRsp = (function() {
 
         /**
          * Properties of a ChatRsp.
          * @memberof gsbase
          * @interface IChatRsp
          * @property {string|null} [err] ChatRsp err
          */
 
         /**
          * Constructs a new ChatRsp.
          * @memberof gsbase
          * @classdesc Represents a ChatRsp.
          * @implements IChatRsp
          * @constructor
          * @param {gsbase.IChatRsp=} [properties] Properties to set
          */
         function ChatRsp(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * ChatRsp err.
          * @member {string} err
          * @memberof gsbase.ChatRsp
          * @instance
          */
         ChatRsp.prototype.err = "";
 
         /**
          * Creates a new ChatRsp instance using the specified properties.
          * @function create
          * @memberof gsbase.ChatRsp
          * @static
          * @param {gsbase.IChatRsp=} [properties] Properties to set
          * @returns {gsbase.ChatRsp} ChatRsp instance
          */
         ChatRsp.create = function create(properties) {
             return new ChatRsp(properties);
         };
 
         /**
          * Encodes the specified ChatRsp message. Does not implicitly {@link gsbase.ChatRsp.verify|verify} messages.
          * @function encode
          * @memberof gsbase.ChatRsp
          * @static
          * @param {gsbase.IChatRsp} message ChatRsp message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         ChatRsp.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.err != null && Object.hasOwnProperty.call(message, "err"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.err);
             return writer;
         };
 
         /**
          * Encodes the specified ChatRsp message, length delimited. Does not implicitly {@link gsbase.ChatRsp.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.ChatRsp
          * @static
          * @param {gsbase.IChatRsp} message ChatRsp message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         ChatRsp.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a ChatRsp message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.ChatRsp
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.ChatRsp} ChatRsp
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         ChatRsp.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.ChatRsp();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.err = reader.string();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a ChatRsp message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.ChatRsp
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.ChatRsp} ChatRsp
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         ChatRsp.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a ChatRsp message.
          * @function verify
          * @memberof gsbase.ChatRsp
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         ChatRsp.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.err != null && message.hasOwnProperty("err"))
                 if (!$util.isString(message.err))
                     return "err: string expected";
             return null;
         };
 
         /**
          * Creates a ChatRsp message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.ChatRsp
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.ChatRsp} ChatRsp
          */
         ChatRsp.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.ChatRsp)
                 return object;
             var message = new $root.gsbase.ChatRsp();
             if (object.err != null)
                 message.err = String(object.err);
             return message;
         };
 
         /**
          * Creates a plain object from a ChatRsp message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.ChatRsp
          * @static
          * @param {gsbase.ChatRsp} message ChatRsp
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         ChatRsp.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults)
                 object.err = "";
             if (message.err != null && message.hasOwnProperty("err"))
                 object.err = message.err;
             return object;
         };
 
         /**
          * Converts this ChatRsp to JSON.
          * @function toJSON
          * @memberof gsbase.ChatRsp
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         ChatRsp.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return ChatRsp;
     })();
 
     gsbase.ChatNot = (function() {
 
         /**
          * Properties of a ChatNot.
          * @memberof gsbase
          * @interface IChatNot
          * @property {string|null} [from] ChatNot from
          * @property {string|null} [to] ChatNot to
          * @property {gsbase.ChatType|null} [type] ChatNot type
          * @property {string|null} [content] ChatNot content
          */
 
         /**
          * Constructs a new ChatNot.
          * @memberof gsbase
          * @classdesc Represents a ChatNot.
          * @implements IChatNot
          * @constructor
          * @param {gsbase.IChatNot=} [properties] Properties to set
          */
         function ChatNot(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * ChatNot from.
          * @member {string} from
          * @memberof gsbase.ChatNot
          * @instance
          */
         ChatNot.prototype.from = "";
 
         /**
          * ChatNot to.
          * @member {string} to
          * @memberof gsbase.ChatNot
          * @instance
          */
         ChatNot.prototype.to = "";
 
         /**
          * ChatNot type.
          * @member {gsbase.ChatType} type
          * @memberof gsbase.ChatNot
          * @instance
          */
         ChatNot.prototype.type = 0;
 
         /**
          * ChatNot content.
          * @member {string} content
          * @memberof gsbase.ChatNot
          * @instance
          */
         ChatNot.prototype.content = "";
 
         /**
          * Creates a new ChatNot instance using the specified properties.
          * @function create
          * @memberof gsbase.ChatNot
          * @static
          * @param {gsbase.IChatNot=} [properties] Properties to set
          * @returns {gsbase.ChatNot} ChatNot instance
          */
         ChatNot.create = function create(properties) {
             return new ChatNot(properties);
         };
 
         /**
          * Encodes the specified ChatNot message. Does not implicitly {@link gsbase.ChatNot.verify|verify} messages.
          * @function encode
          * @memberof gsbase.ChatNot
          * @static
          * @param {gsbase.IChatNot} message ChatNot message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         ChatNot.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.from != null && Object.hasOwnProperty.call(message, "from"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.from);
             if (message.to != null && Object.hasOwnProperty.call(message, "to"))
                 writer.uint32(/* id 2, wireType 2 =*/18).string(message.to);
             if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                 writer.uint32(/* id 3, wireType 0 =*/24).int32(message.type);
             if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                 writer.uint32(/* id 4, wireType 2 =*/34).string(message.content);
             return writer;
         };
 
         /**
          * Encodes the specified ChatNot message, length delimited. Does not implicitly {@link gsbase.ChatNot.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.ChatNot
          * @static
          * @param {gsbase.IChatNot} message ChatNot message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         ChatNot.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a ChatNot message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.ChatNot
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.ChatNot} ChatNot
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         ChatNot.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.ChatNot();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.from = reader.string();
                     break;
                 case 2:
                     message.to = reader.string();
                     break;
                 case 3:
                     message.type = reader.int32();
                     break;
                 case 4:
                     message.content = reader.string();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a ChatNot message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.ChatNot
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.ChatNot} ChatNot
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         ChatNot.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a ChatNot message.
          * @function verify
          * @memberof gsbase.ChatNot
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         ChatNot.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.from != null && message.hasOwnProperty("from"))
                 if (!$util.isString(message.from))
                     return "from: string expected";
             if (message.to != null && message.hasOwnProperty("to"))
                 if (!$util.isString(message.to))
                     return "to: string expected";
             if (message.type != null && message.hasOwnProperty("type"))
                 switch (message.type) {
                 default:
                     return "type: enum value expected";
                 case 0:
                 case 1:
                     break;
                 }
             if (message.content != null && message.hasOwnProperty("content"))
                 if (!$util.isString(message.content))
                     return "content: string expected";
             return null;
         };
 
         /**
          * Creates a ChatNot message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.ChatNot
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.ChatNot} ChatNot
          */
         ChatNot.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.ChatNot)
                 return object;
             var message = new $root.gsbase.ChatNot();
             if (object.from != null)
                 message.from = String(object.from);
             if (object.to != null)
                 message.to = String(object.to);
             switch (object.type) {
             case "Text":
             case 0:
                 message.type = 0;
                 break;
             case "Emoji":
             case 1:
                 message.type = 1;
                 break;
             }
             if (object.content != null)
                 message.content = String(object.content);
             return message;
         };
 
         /**
          * Creates a plain object from a ChatNot message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.ChatNot
          * @static
          * @param {gsbase.ChatNot} message ChatNot
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         ChatNot.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults) {
                 object.from = "";
                 object.to = "";
                 object.type = options.enums === String ? "Text" : 0;
                 object.content = "";
             }
             if (message.from != null && message.hasOwnProperty("from"))
                 object.from = message.from;
             if (message.to != null && message.hasOwnProperty("to"))
                 object.to = message.to;
             if (message.type != null && message.hasOwnProperty("type"))
                 object.type = options.enums === String ? $root.gsbase.ChatType[message.type] : message.type;
             if (message.content != null && message.hasOwnProperty("content"))
                 object.content = message.content;
             return object;
         };
 
         /**
          * Converts this ChatNot to JSON.
          * @function toJSON
          * @memberof gsbase.ChatNot
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         ChatNot.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return ChatNot;
     })();
 
     gsbase.CreateRoomReq = (function() {
 
         /**
          * Properties of a CreateRoomReq.
          * @memberof gsbase
          * @interface ICreateRoomReq
          * @property {string|null} [roomId] CreateRoomReq roomId
          * @property {string|null} [properties] CreateRoomReq properties
          * @property {string|null} [owner] CreateRoomReq owner
          */
 
         /**
          * Constructs a new CreateRoomReq.
          * @memberof gsbase
          * @classdesc Represents a CreateRoomReq.
          * @implements ICreateRoomReq
          * @constructor
          * @param {gsbase.ICreateRoomReq=} [properties] Properties to set
          */
         function CreateRoomReq(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * CreateRoomReq roomId.
          * @member {string} roomId
          * @memberof gsbase.CreateRoomReq
          * @instance
          */
         CreateRoomReq.prototype.roomId = "";
 
         /**
          * CreateRoomReq properties.
          * @member {string} properties
          * @memberof gsbase.CreateRoomReq
          * @instance
          */
         CreateRoomReq.prototype.properties = "";
 
         /**
          * CreateRoomReq owner.
          * @member {string} owner
          * @memberof gsbase.CreateRoomReq
          * @instance
          */
         CreateRoomReq.prototype.owner = "";
 
         /**
          * Creates a new CreateRoomReq instance using the specified properties.
          * @function create
          * @memberof gsbase.CreateRoomReq
          * @static
          * @param {gsbase.ICreateRoomReq=} [properties] Properties to set
          * @returns {gsbase.CreateRoomReq} CreateRoomReq instance
          */
         CreateRoomReq.create = function create(properties) {
             return new CreateRoomReq(properties);
         };
 
         /**
          * Encodes the specified CreateRoomReq message. Does not implicitly {@link gsbase.CreateRoomReq.verify|verify} messages.
          * @function encode
          * @memberof gsbase.CreateRoomReq
          * @static
          * @param {gsbase.ICreateRoomReq} message CreateRoomReq message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         CreateRoomReq.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomId);
             if (message.properties != null && Object.hasOwnProperty.call(message, "properties"))
                 writer.uint32(/* id 2, wireType 2 =*/18).string(message.properties);
             if (message.owner != null && Object.hasOwnProperty.call(message, "owner"))
                 writer.uint32(/* id 3, wireType 2 =*/26).string(message.owner);
             return writer;
         };
 
         /**
          * Encodes the specified CreateRoomReq message, length delimited. Does not implicitly {@link gsbase.CreateRoomReq.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.CreateRoomReq
          * @static
          * @param {gsbase.ICreateRoomReq} message CreateRoomReq message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         CreateRoomReq.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a CreateRoomReq message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.CreateRoomReq
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.CreateRoomReq} CreateRoomReq
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         CreateRoomReq.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.CreateRoomReq();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.roomId = reader.string();
                     break;
                 case 2:
                     message.properties = reader.string();
                     break;
                 case 3:
                     message.owner = reader.string();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a CreateRoomReq message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.CreateRoomReq
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.CreateRoomReq} CreateRoomReq
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         CreateRoomReq.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a CreateRoomReq message.
          * @function verify
          * @memberof gsbase.CreateRoomReq
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         CreateRoomReq.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.roomId != null && message.hasOwnProperty("roomId"))
                 if (!$util.isString(message.roomId))
                     return "roomId: string expected";
             if (message.properties != null && message.hasOwnProperty("properties"))
                 if (!$util.isString(message.properties))
                     return "properties: string expected";
             if (message.owner != null && message.hasOwnProperty("owner"))
                 if (!$util.isString(message.owner))
                     return "owner: string expected";
             return null;
         };
 
         /**
          * Creates a CreateRoomReq message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.CreateRoomReq
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.CreateRoomReq} CreateRoomReq
          */
         CreateRoomReq.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.CreateRoomReq)
                 return object;
             var message = new $root.gsbase.CreateRoomReq();
             if (object.roomId != null)
                 message.roomId = String(object.roomId);
             if (object.properties != null)
                 message.properties = String(object.properties);
             if (object.owner != null)
                 message.owner = String(object.owner);
             return message;
         };
 
         /**
          * Creates a plain object from a CreateRoomReq message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.CreateRoomReq
          * @static
          * @param {gsbase.CreateRoomReq} message CreateRoomReq
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         CreateRoomReq.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults) {
                 object.roomId = "";
                 object.properties = "";
                 object.owner = "";
             }
             if (message.roomId != null && message.hasOwnProperty("roomId"))
                 object.roomId = message.roomId;
             if (message.properties != null && message.hasOwnProperty("properties"))
                 object.properties = message.properties;
             if (message.owner != null && message.hasOwnProperty("owner"))
                 object.owner = message.owner;
             return object;
         };
 
         /**
          * Converts this CreateRoomReq to JSON.
          * @function toJSON
          * @memberof gsbase.CreateRoomReq
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         CreateRoomReq.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return CreateRoomReq;
     })();
 
     gsbase.CreateRoomRsp = (function() {
 
         /**
          * Properties of a CreateRoomRsp.
          * @memberof gsbase
          * @interface ICreateRoomRsp
          * @property {string|null} [err] CreateRoomRsp err
          * @property {string|null} [serverId] CreateRoomRsp serverId
          */
 
         /**
          * Constructs a new CreateRoomRsp.
          * @memberof gsbase
          * @classdesc Represents a CreateRoomRsp.
          * @implements ICreateRoomRsp
          * @constructor
          * @param {gsbase.ICreateRoomRsp=} [properties] Properties to set
          */
         function CreateRoomRsp(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * CreateRoomRsp err.
          * @member {string} err
          * @memberof gsbase.CreateRoomRsp
          * @instance
          */
         CreateRoomRsp.prototype.err = "";
 
         /**
          * CreateRoomRsp serverId.
          * @member {string} serverId
          * @memberof gsbase.CreateRoomRsp
          * @instance
          */
         CreateRoomRsp.prototype.serverId = "";
 
         /**
          * Creates a new CreateRoomRsp instance using the specified properties.
          * @function create
          * @memberof gsbase.CreateRoomRsp
          * @static
          * @param {gsbase.ICreateRoomRsp=} [properties] Properties to set
          * @returns {gsbase.CreateRoomRsp} CreateRoomRsp instance
          */
         CreateRoomRsp.create = function create(properties) {
             return new CreateRoomRsp(properties);
         };
 
         /**
          * Encodes the specified CreateRoomRsp message. Does not implicitly {@link gsbase.CreateRoomRsp.verify|verify} messages.
          * @function encode
          * @memberof gsbase.CreateRoomRsp
          * @static
          * @param {gsbase.ICreateRoomRsp} message CreateRoomRsp message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         CreateRoomRsp.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.err != null && Object.hasOwnProperty.call(message, "err"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.err);
             if (message.serverId != null && Object.hasOwnProperty.call(message, "serverId"))
                 writer.uint32(/* id 2, wireType 2 =*/18).string(message.serverId);
             return writer;
         };
 
         /**
          * Encodes the specified CreateRoomRsp message, length delimited. Does not implicitly {@link gsbase.CreateRoomRsp.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.CreateRoomRsp
          * @static
          * @param {gsbase.ICreateRoomRsp} message CreateRoomRsp message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         CreateRoomRsp.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a CreateRoomRsp message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.CreateRoomRsp
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.CreateRoomRsp} CreateRoomRsp
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         CreateRoomRsp.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.CreateRoomRsp();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.err = reader.string();
                     break;
                 case 2:
                     message.serverId = reader.string();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a CreateRoomRsp message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.CreateRoomRsp
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.CreateRoomRsp} CreateRoomRsp
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         CreateRoomRsp.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a CreateRoomRsp message.
          * @function verify
          * @memberof gsbase.CreateRoomRsp
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         CreateRoomRsp.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.err != null && message.hasOwnProperty("err"))
                 if (!$util.isString(message.err))
                     return "err: string expected";
             if (message.serverId != null && message.hasOwnProperty("serverId"))
                 if (!$util.isString(message.serverId))
                     return "serverId: string expected";
             return null;
         };
 
         /**
          * Creates a CreateRoomRsp message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.CreateRoomRsp
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.CreateRoomRsp} CreateRoomRsp
          */
         CreateRoomRsp.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.CreateRoomRsp)
                 return object;
             var message = new $root.gsbase.CreateRoomRsp();
             if (object.err != null)
                 message.err = String(object.err);
             if (object.serverId != null)
                 message.serverId = String(object.serverId);
             return message;
         };
 
         /**
          * Creates a plain object from a CreateRoomRsp message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.CreateRoomRsp
          * @static
          * @param {gsbase.CreateRoomRsp} message CreateRoomRsp
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         CreateRoomRsp.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults) {
                 object.err = "";
                 object.serverId = "";
             }
             if (message.err != null && message.hasOwnProperty("err"))
                 object.err = message.err;
             if (message.serverId != null && message.hasOwnProperty("serverId"))
                 object.serverId = message.serverId;
             return object;
         };
 
         /**
          * Converts this CreateRoomRsp to JSON.
          * @function toJSON
          * @memberof gsbase.CreateRoomRsp
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         CreateRoomRsp.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return CreateRoomRsp;
     })();
 
     gsbase.DismissRoomReq = (function() {
 
         /**
          * Properties of a DismissRoomReq.
          * @memberof gsbase
          * @interface IDismissRoomReq
          * @property {string|null} [openid] DismissRoomReq openid
          * @property {string|null} [roomId] DismissRoomReq roomId
          */
 
         /**
          * Constructs a new DismissRoomReq.
          * @memberof gsbase
          * @classdesc Represents a DismissRoomReq.
          * @implements IDismissRoomReq
          * @constructor
          * @param {gsbase.IDismissRoomReq=} [properties] Properties to set
          */
         function DismissRoomReq(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * DismissRoomReq openid.
          * @member {string} openid
          * @memberof gsbase.DismissRoomReq
          * @instance
          */
         DismissRoomReq.prototype.openid = "";
 
         /**
          * DismissRoomReq roomId.
          * @member {string} roomId
          * @memberof gsbase.DismissRoomReq
          * @instance
          */
         DismissRoomReq.prototype.roomId = "";
 
         /**
          * Creates a new DismissRoomReq instance using the specified properties.
          * @function create
          * @memberof gsbase.DismissRoomReq
          * @static
          * @param {gsbase.IDismissRoomReq=} [properties] Properties to set
          * @returns {gsbase.DismissRoomReq} DismissRoomReq instance
          */
         DismissRoomReq.create = function create(properties) {
             return new DismissRoomReq(properties);
         };
 
         /**
          * Encodes the specified DismissRoomReq message. Does not implicitly {@link gsbase.DismissRoomReq.verify|verify} messages.
          * @function encode
          * @memberof gsbase.DismissRoomReq
          * @static
          * @param {gsbase.IDismissRoomReq} message DismissRoomReq message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         DismissRoomReq.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.openid != null && Object.hasOwnProperty.call(message, "openid"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.openid);
             if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                 writer.uint32(/* id 2, wireType 2 =*/18).string(message.roomId);
             return writer;
         };
 
         /**
          * Encodes the specified DismissRoomReq message, length delimited. Does not implicitly {@link gsbase.DismissRoomReq.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.DismissRoomReq
          * @static
          * @param {gsbase.IDismissRoomReq} message DismissRoomReq message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         DismissRoomReq.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a DismissRoomReq message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.DismissRoomReq
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.DismissRoomReq} DismissRoomReq
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         DismissRoomReq.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.DismissRoomReq();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.openid = reader.string();
                     break;
                 case 2:
                     message.roomId = reader.string();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a DismissRoomReq message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.DismissRoomReq
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.DismissRoomReq} DismissRoomReq
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         DismissRoomReq.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a DismissRoomReq message.
          * @function verify
          * @memberof gsbase.DismissRoomReq
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         DismissRoomReq.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.openid != null && message.hasOwnProperty("openid"))
                 if (!$util.isString(message.openid))
                     return "openid: string expected";
             if (message.roomId != null && message.hasOwnProperty("roomId"))
                 if (!$util.isString(message.roomId))
                     return "roomId: string expected";
             return null;
         };
 
         /**
          * Creates a DismissRoomReq message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.DismissRoomReq
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.DismissRoomReq} DismissRoomReq
          */
         DismissRoomReq.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.DismissRoomReq)
                 return object;
             var message = new $root.gsbase.DismissRoomReq();
             if (object.openid != null)
                 message.openid = String(object.openid);
             if (object.roomId != null)
                 message.roomId = String(object.roomId);
             return message;
         };
 
         /**
          * Creates a plain object from a DismissRoomReq message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.DismissRoomReq
          * @static
          * @param {gsbase.DismissRoomReq} message DismissRoomReq
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         DismissRoomReq.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults) {
                 object.openid = "";
                 object.roomId = "";
             }
             if (message.openid != null && message.hasOwnProperty("openid"))
                 object.openid = message.openid;
             if (message.roomId != null && message.hasOwnProperty("roomId"))
                 object.roomId = message.roomId;
             return object;
         };
 
         /**
          * Converts this DismissRoomReq to JSON.
          * @function toJSON
          * @memberof gsbase.DismissRoomReq
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         DismissRoomReq.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return DismissRoomReq;
     })();
 
     gsbase.DismissRoomRsp = (function() {
 
         /**
          * Properties of a DismissRoomRsp.
          * @memberof gsbase
          * @interface IDismissRoomRsp
          * @property {string|null} [err] DismissRoomRsp err
          */
 
         /**
          * Constructs a new DismissRoomRsp.
          * @memberof gsbase
          * @classdesc Represents a DismissRoomRsp.
          * @implements IDismissRoomRsp
          * @constructor
          * @param {gsbase.IDismissRoomRsp=} [properties] Properties to set
          */
         function DismissRoomRsp(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * DismissRoomRsp err.
          * @member {string} err
          * @memberof gsbase.DismissRoomRsp
          * @instance
          */
         DismissRoomRsp.prototype.err = "";
 
         /**
          * Creates a new DismissRoomRsp instance using the specified properties.
          * @function create
          * @memberof gsbase.DismissRoomRsp
          * @static
          * @param {gsbase.IDismissRoomRsp=} [properties] Properties to set
          * @returns {gsbase.DismissRoomRsp} DismissRoomRsp instance
          */
         DismissRoomRsp.create = function create(properties) {
             return new DismissRoomRsp(properties);
         };
 
         /**
          * Encodes the specified DismissRoomRsp message. Does not implicitly {@link gsbase.DismissRoomRsp.verify|verify} messages.
          * @function encode
          * @memberof gsbase.DismissRoomRsp
          * @static
          * @param {gsbase.IDismissRoomRsp} message DismissRoomRsp message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         DismissRoomRsp.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.err != null && Object.hasOwnProperty.call(message, "err"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.err);
             return writer;
         };
 
         /**
          * Encodes the specified DismissRoomRsp message, length delimited. Does not implicitly {@link gsbase.DismissRoomRsp.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.DismissRoomRsp
          * @static
          * @param {gsbase.IDismissRoomRsp} message DismissRoomRsp message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         DismissRoomRsp.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a DismissRoomRsp message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.DismissRoomRsp
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.DismissRoomRsp} DismissRoomRsp
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         DismissRoomRsp.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.DismissRoomRsp();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.err = reader.string();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a DismissRoomRsp message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.DismissRoomRsp
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.DismissRoomRsp} DismissRoomRsp
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         DismissRoomRsp.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a DismissRoomRsp message.
          * @function verify
          * @memberof gsbase.DismissRoomRsp
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         DismissRoomRsp.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.err != null && message.hasOwnProperty("err"))
                 if (!$util.isString(message.err))
                     return "err: string expected";
             return null;
         };
 
         /**
          * Creates a DismissRoomRsp message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.DismissRoomRsp
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.DismissRoomRsp} DismissRoomRsp
          */
         DismissRoomRsp.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.DismissRoomRsp)
                 return object;
             var message = new $root.gsbase.DismissRoomRsp();
             if (object.err != null)
                 message.err = String(object.err);
             return message;
         };
 
         /**
          * Creates a plain object from a DismissRoomRsp message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.DismissRoomRsp
          * @static
          * @param {gsbase.DismissRoomRsp} message DismissRoomRsp
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         DismissRoomRsp.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults)
                 object.err = "";
             if (message.err != null && message.hasOwnProperty("err"))
                 object.err = message.err;
             return object;
         };
 
         /**
          * Converts this DismissRoomRsp to JSON.
          * @function toJSON
          * @memberof gsbase.DismissRoomRsp
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         DismissRoomRsp.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return DismissRoomRsp;
     })();
 
     gsbase.Player = (function() {
 
         /**
          * Properties of a Player.
          * @memberof gsbase
          * @interface IPlayer
          * @property {string|null} [openid] Player openid
          * @property {Object.<string,string>|null} [metadata] Player metadata
          */
 
         /**
          * Constructs a new Player.
          * @memberof gsbase
          * @classdesc Represents a Player.
          * @implements IPlayer
          * @constructor
          * @param {gsbase.IPlayer=} [properties] Properties to set
          */
         function Player(properties) {
             this.metadata = {};
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * Player openid.
          * @member {string} openid
          * @memberof gsbase.Player
          * @instance
          */
         Player.prototype.openid = "";
 
         /**
          * Player metadata.
          * @member {Object.<string,string>} metadata
          * @memberof gsbase.Player
          * @instance
          */
         Player.prototype.metadata = $util.emptyObject;
 
         /**
          * Creates a new Player instance using the specified properties.
          * @function create
          * @memberof gsbase.Player
          * @static
          * @param {gsbase.IPlayer=} [properties] Properties to set
          * @returns {gsbase.Player} Player instance
          */
         Player.create = function create(properties) {
             return new Player(properties);
         };
 
         /**
          * Encodes the specified Player message. Does not implicitly {@link gsbase.Player.verify|verify} messages.
          * @function encode
          * @memberof gsbase.Player
          * @static
          * @param {gsbase.IPlayer} message Player message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         Player.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.openid != null && Object.hasOwnProperty.call(message, "openid"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.openid);
             if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                 for (var keys = Object.keys(message.metadata), i = 0; i < keys.length; ++i)
                     writer.uint32(/* id 2, wireType 2 =*/18).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.metadata[keys[i]]).ldelim();
             return writer;
         };
 
         /**
          * Encodes the specified Player message, length delimited. Does not implicitly {@link gsbase.Player.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.Player
          * @static
          * @param {gsbase.IPlayer} message Player message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         Player.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a Player message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.Player
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.Player} Player
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         Player.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.Player(), key, value;
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.openid = reader.string();
                     break;
                 case 2:
                     if (message.metadata === $util.emptyObject)
                         message.metadata = {};
                     var end2 = reader.uint32() + reader.pos;
                     key = "";
                     value = "";
                     while (reader.pos < end2) {
                         var tag2 = reader.uint32();
                         switch (tag2 >>> 3) {
                         case 1:
                             key = reader.string();
                             break;
                         case 2:
                             value = reader.string();
                             break;
                         default:
                             reader.skipType(tag2 & 7);
                             break;
                         }
                     }
                     message.metadata[key] = value;
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a Player message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.Player
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.Player} Player
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         Player.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a Player message.
          * @function verify
          * @memberof gsbase.Player
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         Player.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.openid != null && message.hasOwnProperty("openid"))
                 if (!$util.isString(message.openid))
                     return "openid: string expected";
             if (message.metadata != null && message.hasOwnProperty("metadata")) {
                 if (!$util.isObject(message.metadata))
                     return "metadata: object expected";
                 var key = Object.keys(message.metadata);
                 for (var i = 0; i < key.length; ++i)
                     if (!$util.isString(message.metadata[key[i]]))
                         return "metadata: string{k:string} expected";
             }
             return null;
         };
 
         /**
          * Creates a Player message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.Player
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.Player} Player
          */
         Player.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.Player)
                 return object;
             var message = new $root.gsbase.Player();
             if (object.openid != null)
                 message.openid = String(object.openid);
             if (object.metadata) {
                 if (typeof object.metadata !== "object")
                     throw TypeError(".gsbase.Player.metadata: object expected");
                 message.metadata = {};
                 for (var keys = Object.keys(object.metadata), i = 0; i < keys.length; ++i)
                     message.metadata[keys[i]] = String(object.metadata[keys[i]]);
             }
             return message;
         };
 
         /**
          * Creates a plain object from a Player message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.Player
          * @static
          * @param {gsbase.Player} message Player
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         Player.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.objects || options.defaults)
                 object.metadata = {};
             if (options.defaults)
                 object.openid = "";
             if (message.openid != null && message.hasOwnProperty("openid"))
                 object.openid = message.openid;
             var keys2;
             if (message.metadata && (keys2 = Object.keys(message.metadata)).length) {
                 object.metadata = {};
                 for (var j = 0; j < keys2.length; ++j)
                     object.metadata[keys2[j]] = message.metadata[keys2[j]];
             }
             return object;
         };
 
         /**
          * Converts this Player to JSON.
          * @function toJSON
          * @memberof gsbase.Player
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         Player.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return Player;
     })();
 
     gsbase.RoomInfo = (function() {
 
         /**
          * Properties of a RoomInfo.
          * @memberof gsbase
          * @interface IRoomInfo
          * @property {string|null} [roomId] RoomInfo roomId
          * @property {string|null} [matchCode] RoomInfo matchCode
          * @property {string|null} [metadata] RoomInfo metadata
          * @property {Array.<gsbase.IPlayer>|null} [players] RoomInfo players
          * @property {string|null} [owner] RoomInfo owner
          */
 
         /**
          * Constructs a new RoomInfo.
          * @memberof gsbase
          * @classdesc Represents a RoomInfo.
          * @implements IRoomInfo
          * @constructor
          * @param {gsbase.IRoomInfo=} [properties] Properties to set
          */
         function RoomInfo(properties) {
             this.players = [];
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * RoomInfo roomId.
          * @member {string} roomId
          * @memberof gsbase.RoomInfo
          * @instance
          */
         RoomInfo.prototype.roomId = "";
 
         /**
          * RoomInfo matchCode.
          * @member {string} matchCode
          * @memberof gsbase.RoomInfo
          * @instance
          */
         RoomInfo.prototype.matchCode = "";
 
         /**
          * RoomInfo metadata.
          * @member {string} metadata
          * @memberof gsbase.RoomInfo
          * @instance
          */
         RoomInfo.prototype.metadata = "";
 
         /**
          * RoomInfo players.
          * @member {Array.<gsbase.IPlayer>} players
          * @memberof gsbase.RoomInfo
          * @instance
          */
         RoomInfo.prototype.players = $util.emptyArray;
 
         /**
          * RoomInfo owner.
          * @member {string} owner
          * @memberof gsbase.RoomInfo
          * @instance
          */
         RoomInfo.prototype.owner = "";
 
         /**
          * Creates a new RoomInfo instance using the specified properties.
          * @function create
          * @memberof gsbase.RoomInfo
          * @static
          * @param {gsbase.IRoomInfo=} [properties] Properties to set
          * @returns {gsbase.RoomInfo} RoomInfo instance
          */
         RoomInfo.create = function create(properties) {
             return new RoomInfo(properties);
         };
 
         /**
          * Encodes the specified RoomInfo message. Does not implicitly {@link gsbase.RoomInfo.verify|verify} messages.
          * @function encode
          * @memberof gsbase.RoomInfo
          * @static
          * @param {gsbase.IRoomInfo} message RoomInfo message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         RoomInfo.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomId);
             if (message.matchCode != null && Object.hasOwnProperty.call(message, "matchCode"))
                 writer.uint32(/* id 2, wireType 2 =*/18).string(message.matchCode);
             if (message.metadata != null && Object.hasOwnProperty.call(message, "metadata"))
                 writer.uint32(/* id 3, wireType 2 =*/26).string(message.metadata);
             if (message.players != null && message.players.length)
                 for (var i = 0; i < message.players.length; ++i)
                     $root.gsbase.Player.encode(message.players[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
             if (message.owner != null && Object.hasOwnProperty.call(message, "owner"))
                 writer.uint32(/* id 5, wireType 2 =*/42).string(message.owner);
             return writer;
         };
 
         /**
          * Encodes the specified RoomInfo message, length delimited. Does not implicitly {@link gsbase.RoomInfo.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.RoomInfo
          * @static
          * @param {gsbase.IRoomInfo} message RoomInfo message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         RoomInfo.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a RoomInfo message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.RoomInfo
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.RoomInfo} RoomInfo
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         RoomInfo.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.RoomInfo();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.roomId = reader.string();
                     break;
                 case 2:
                     message.matchCode = reader.string();
                     break;
                 case 3:
                     message.metadata = reader.string();
                     break;
                 case 4:
                     if (!(message.players && message.players.length))
                         message.players = [];
                     message.players.push($root.gsbase.Player.decode(reader, reader.uint32()));
                     break;
                 case 5:
                     message.owner = reader.string();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a RoomInfo message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.RoomInfo
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.RoomInfo} RoomInfo
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         RoomInfo.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a RoomInfo message.
          * @function verify
          * @memberof gsbase.RoomInfo
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         RoomInfo.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.roomId != null && message.hasOwnProperty("roomId"))
                 if (!$util.isString(message.roomId))
                     return "roomId: string expected";
             if (message.matchCode != null && message.hasOwnProperty("matchCode"))
                 if (!$util.isString(message.matchCode))
                     return "matchCode: string expected";
             if (message.metadata != null && message.hasOwnProperty("metadata"))
                 if (!$util.isString(message.metadata))
                     return "metadata: string expected";
             if (message.players != null && message.hasOwnProperty("players")) {
                 if (!Array.isArray(message.players))
                     return "players: array expected";
                 for (var i = 0; i < message.players.length; ++i) {
                     var error = $root.gsbase.Player.verify(message.players[i]);
                     if (error)
                         return "players." + error;
                 }
             }
             if (message.owner != null && message.hasOwnProperty("owner"))
                 if (!$util.isString(message.owner))
                     return "owner: string expected";
             return null;
         };
 
         /**
          * Creates a RoomInfo message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.RoomInfo
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.RoomInfo} RoomInfo
          */
         RoomInfo.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.RoomInfo)
                 return object;
             var message = new $root.gsbase.RoomInfo();
             if (object.roomId != null)
                 message.roomId = String(object.roomId);
             if (object.matchCode != null)
                 message.matchCode = String(object.matchCode);
             if (object.metadata != null)
                 message.metadata = String(object.metadata);
             if (object.players) {
                 if (!Array.isArray(object.players))
                     throw TypeError(".gsbase.RoomInfo.players: array expected");
                 message.players = [];
                 for (var i = 0; i < object.players.length; ++i) {
                     if (typeof object.players[i] !== "object")
                         throw TypeError(".gsbase.RoomInfo.players: object expected");
                     message.players[i] = $root.gsbase.Player.fromObject(object.players[i]);
                 }
             }
             if (object.owner != null)
                 message.owner = String(object.owner);
             return message;
         };
 
         /**
          * Creates a plain object from a RoomInfo message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.RoomInfo
          * @static
          * @param {gsbase.RoomInfo} message RoomInfo
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         RoomInfo.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.arrays || options.defaults)
                 object.players = [];
             if (options.defaults) {
                 object.roomId = "";
                 object.matchCode = "";
                 object.metadata = "";
                 object.owner = "";
             }
             if (message.roomId != null && message.hasOwnProperty("roomId"))
                 object.roomId = message.roomId;
             if (message.matchCode != null && message.hasOwnProperty("matchCode"))
                 object.matchCode = message.matchCode;
             if (message.metadata != null && message.hasOwnProperty("metadata"))
                 object.metadata = message.metadata;
             if (message.players && message.players.length) {
                 object.players = [];
                 for (var j = 0; j < message.players.length; ++j)
                     object.players[j] = $root.gsbase.Player.toObject(message.players[j], options);
             }
             if (message.owner != null && message.hasOwnProperty("owner"))
                 object.owner = message.owner;
             return object;
         };
 
         /**
          * Converts this RoomInfo to JSON.
          * @function toJSON
          * @memberof gsbase.RoomInfo
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         RoomInfo.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return RoomInfo;
     })();
 
     gsbase.CheckRoomStatusReq = (function() {
 
         /**
          * Properties of a CheckRoomStatusReq.
          * @memberof gsbase
          * @interface ICheckRoomStatusReq
          * @property {string|null} [roomId] CheckRoomStatusReq roomId
          */
 
         /**
          * Constructs a new CheckRoomStatusReq.
          * @memberof gsbase
          * @classdesc Represents a CheckRoomStatusReq.
          * @implements ICheckRoomStatusReq
          * @constructor
          * @param {gsbase.ICheckRoomStatusReq=} [properties] Properties to set
          */
         function CheckRoomStatusReq(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * CheckRoomStatusReq roomId.
          * @member {string} roomId
          * @memberof gsbase.CheckRoomStatusReq
          * @instance
          */
         CheckRoomStatusReq.prototype.roomId = "";
 
         /**
          * Creates a new CheckRoomStatusReq instance using the specified properties.
          * @function create
          * @memberof gsbase.CheckRoomStatusReq
          * @static
          * @param {gsbase.ICheckRoomStatusReq=} [properties] Properties to set
          * @returns {gsbase.CheckRoomStatusReq} CheckRoomStatusReq instance
          */
         CheckRoomStatusReq.create = function create(properties) {
             return new CheckRoomStatusReq(properties);
         };
 
         /**
          * Encodes the specified CheckRoomStatusReq message. Does not implicitly {@link gsbase.CheckRoomStatusReq.verify|verify} messages.
          * @function encode
          * @memberof gsbase.CheckRoomStatusReq
          * @static
          * @param {gsbase.ICheckRoomStatusReq} message CheckRoomStatusReq message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         CheckRoomStatusReq.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomId);
             return writer;
         };
 
         /**
          * Encodes the specified CheckRoomStatusReq message, length delimited. Does not implicitly {@link gsbase.CheckRoomStatusReq.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.CheckRoomStatusReq
          * @static
          * @param {gsbase.ICheckRoomStatusReq} message CheckRoomStatusReq message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         CheckRoomStatusReq.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a CheckRoomStatusReq message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.CheckRoomStatusReq
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.CheckRoomStatusReq} CheckRoomStatusReq
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         CheckRoomStatusReq.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.CheckRoomStatusReq();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.roomId = reader.string();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a CheckRoomStatusReq message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.CheckRoomStatusReq
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.CheckRoomStatusReq} CheckRoomStatusReq
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         CheckRoomStatusReq.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a CheckRoomStatusReq message.
          * @function verify
          * @memberof gsbase.CheckRoomStatusReq
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         CheckRoomStatusReq.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.roomId != null && message.hasOwnProperty("roomId"))
                 if (!$util.isString(message.roomId))
                     return "roomId: string expected";
             return null;
         };
 
         /**
          * Creates a CheckRoomStatusReq message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.CheckRoomStatusReq
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.CheckRoomStatusReq} CheckRoomStatusReq
          */
         CheckRoomStatusReq.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.CheckRoomStatusReq)
                 return object;
             var message = new $root.gsbase.CheckRoomStatusReq();
             if (object.roomId != null)
                 message.roomId = String(object.roomId);
             return message;
         };
 
         /**
          * Creates a plain object from a CheckRoomStatusReq message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.CheckRoomStatusReq
          * @static
          * @param {gsbase.CheckRoomStatusReq} message CheckRoomStatusReq
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         CheckRoomStatusReq.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults)
                 object.roomId = "";
             if (message.roomId != null && message.hasOwnProperty("roomId"))
                 object.roomId = message.roomId;
             return object;
         };
 
         /**
          * Converts this CheckRoomStatusReq to JSON.
          * @function toJSON
          * @memberof gsbase.CheckRoomStatusReq
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         CheckRoomStatusReq.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return CheckRoomStatusReq;
     })();
 
     gsbase.CheckRoomStatusRsp = (function() {
 
         /**
          * Properties of a CheckRoomStatusRsp.
          * @memberof gsbase
          * @interface ICheckRoomStatusRsp
          * @property {boolean|null} [exists] CheckRoomStatusRsp exists
          */
 
         /**
          * Constructs a new CheckRoomStatusRsp.
          * @memberof gsbase
          * @classdesc Represents a CheckRoomStatusRsp.
          * @implements ICheckRoomStatusRsp
          * @constructor
          * @param {gsbase.ICheckRoomStatusRsp=} [properties] Properties to set
          */
         function CheckRoomStatusRsp(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * CheckRoomStatusRsp exists.
          * @member {boolean} exists
          * @memberof gsbase.CheckRoomStatusRsp
          * @instance
          */
         CheckRoomStatusRsp.prototype.exists = false;
 
         /**
          * Creates a new CheckRoomStatusRsp instance using the specified properties.
          * @function create
          * @memberof gsbase.CheckRoomStatusRsp
          * @static
          * @param {gsbase.ICheckRoomStatusRsp=} [properties] Properties to set
          * @returns {gsbase.CheckRoomStatusRsp} CheckRoomStatusRsp instance
          */
         CheckRoomStatusRsp.create = function create(properties) {
             return new CheckRoomStatusRsp(properties);
         };
 
         /**
          * Encodes the specified CheckRoomStatusRsp message. Does not implicitly {@link gsbase.CheckRoomStatusRsp.verify|verify} messages.
          * @function encode
          * @memberof gsbase.CheckRoomStatusRsp
          * @static
          * @param {gsbase.ICheckRoomStatusRsp} message CheckRoomStatusRsp message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         CheckRoomStatusRsp.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.exists != null && Object.hasOwnProperty.call(message, "exists"))
                 writer.uint32(/* id 1, wireType 0 =*/8).bool(message.exists);
             return writer;
         };
 
         /**
          * Encodes the specified CheckRoomStatusRsp message, length delimited. Does not implicitly {@link gsbase.CheckRoomStatusRsp.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.CheckRoomStatusRsp
          * @static
          * @param {gsbase.ICheckRoomStatusRsp} message CheckRoomStatusRsp message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         CheckRoomStatusRsp.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a CheckRoomStatusRsp message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.CheckRoomStatusRsp
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.CheckRoomStatusRsp} CheckRoomStatusRsp
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         CheckRoomStatusRsp.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.CheckRoomStatusRsp();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.exists = reader.bool();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a CheckRoomStatusRsp message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.CheckRoomStatusRsp
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.CheckRoomStatusRsp} CheckRoomStatusRsp
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         CheckRoomStatusRsp.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a CheckRoomStatusRsp message.
          * @function verify
          * @memberof gsbase.CheckRoomStatusRsp
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         CheckRoomStatusRsp.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.exists != null && message.hasOwnProperty("exists"))
                 if (typeof message.exists !== "boolean")
                     return "exists: boolean expected";
             return null;
         };
 
         /**
          * Creates a CheckRoomStatusRsp message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.CheckRoomStatusRsp
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.CheckRoomStatusRsp} CheckRoomStatusRsp
          */
         CheckRoomStatusRsp.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.CheckRoomStatusRsp)
                 return object;
             var message = new $root.gsbase.CheckRoomStatusRsp();
             if (object.exists != null)
                 message.exists = Boolean(object.exists);
             return message;
         };
 
         /**
          * Creates a plain object from a CheckRoomStatusRsp message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.CheckRoomStatusRsp
          * @static
          * @param {gsbase.CheckRoomStatusRsp} message CheckRoomStatusRsp
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         CheckRoomStatusRsp.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults)
                 object.exists = false;
             if (message.exists != null && message.hasOwnProperty("exists"))
                 object.exists = message.exists;
             return object;
         };
 
         /**
          * Converts this CheckRoomStatusRsp to JSON.
          * @function toJSON
          * @memberof gsbase.CheckRoomStatusRsp
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         CheckRoomStatusRsp.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return CheckRoomStatusRsp;
     })();
 
     gsbase.GetRoomInfoReq = (function() {
 
         /**
          * Properties of a GetRoomInfoReq.
          * @memberof gsbase
          * @interface IGetRoomInfoReq
          * @property {string|null} [roomId] GetRoomInfoReq roomId
          */
 
         /**
          * Constructs a new GetRoomInfoReq.
          * @memberof gsbase
          * @classdesc Represents a GetRoomInfoReq.
          * @implements IGetRoomInfoReq
          * @constructor
          * @param {gsbase.IGetRoomInfoReq=} [properties] Properties to set
          */
         function GetRoomInfoReq(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * GetRoomInfoReq roomId.
          * @member {string} roomId
          * @memberof gsbase.GetRoomInfoReq
          * @instance
          */
         GetRoomInfoReq.prototype.roomId = "";
 
         /**
          * Creates a new GetRoomInfoReq instance using the specified properties.
          * @function create
          * @memberof gsbase.GetRoomInfoReq
          * @static
          * @param {gsbase.IGetRoomInfoReq=} [properties] Properties to set
          * @returns {gsbase.GetRoomInfoReq} GetRoomInfoReq instance
          */
         GetRoomInfoReq.create = function create(properties) {
             return new GetRoomInfoReq(properties);
         };
 
         /**
          * Encodes the specified GetRoomInfoReq message. Does not implicitly {@link gsbase.GetRoomInfoReq.verify|verify} messages.
          * @function encode
          * @memberof gsbase.GetRoomInfoReq
          * @static
          * @param {gsbase.IGetRoomInfoReq} message GetRoomInfoReq message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         GetRoomInfoReq.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomId);
             return writer;
         };
 
         /**
          * Encodes the specified GetRoomInfoReq message, length delimited. Does not implicitly {@link gsbase.GetRoomInfoReq.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.GetRoomInfoReq
          * @static
          * @param {gsbase.IGetRoomInfoReq} message GetRoomInfoReq message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         GetRoomInfoReq.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a GetRoomInfoReq message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.GetRoomInfoReq
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.GetRoomInfoReq} GetRoomInfoReq
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         GetRoomInfoReq.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.GetRoomInfoReq();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.roomId = reader.string();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a GetRoomInfoReq message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.GetRoomInfoReq
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.GetRoomInfoReq} GetRoomInfoReq
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         GetRoomInfoReq.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a GetRoomInfoReq message.
          * @function verify
          * @memberof gsbase.GetRoomInfoReq
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         GetRoomInfoReq.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.roomId != null && message.hasOwnProperty("roomId"))
                 if (!$util.isString(message.roomId))
                     return "roomId: string expected";
             return null;
         };
 
         /**
          * Creates a GetRoomInfoReq message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.GetRoomInfoReq
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.GetRoomInfoReq} GetRoomInfoReq
          */
         GetRoomInfoReq.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.GetRoomInfoReq)
                 return object;
             var message = new $root.gsbase.GetRoomInfoReq();
             if (object.roomId != null)
                 message.roomId = String(object.roomId);
             return message;
         };
 
         /**
          * Creates a plain object from a GetRoomInfoReq message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.GetRoomInfoReq
          * @static
          * @param {gsbase.GetRoomInfoReq} message GetRoomInfoReq
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         GetRoomInfoReq.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults)
                 object.roomId = "";
             if (message.roomId != null && message.hasOwnProperty("roomId"))
                 object.roomId = message.roomId;
             return object;
         };
 
         /**
          * Converts this GetRoomInfoReq to JSON.
          * @function toJSON
          * @memberof gsbase.GetRoomInfoReq
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         GetRoomInfoReq.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return GetRoomInfoReq;
     })();
 
     gsbase.GetRoomInfoRsp = (function() {
 
         /**
          * Properties of a GetRoomInfoRsp.
          * @memberof gsbase
          * @interface IGetRoomInfoRsp
          * @property {gsbase.IRoomInfo|null} [room] GetRoomInfoRsp room
          */
 
         /**
          * Constructs a new GetRoomInfoRsp.
          * @memberof gsbase
          * @classdesc Represents a GetRoomInfoRsp.
          * @implements IGetRoomInfoRsp
          * @constructor
          * @param {gsbase.IGetRoomInfoRsp=} [properties] Properties to set
          */
         function GetRoomInfoRsp(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * GetRoomInfoRsp room.
          * @member {gsbase.IRoomInfo|null|undefined} room
          * @memberof gsbase.GetRoomInfoRsp
          * @instance
          */
         GetRoomInfoRsp.prototype.room = null;
 
         /**
          * Creates a new GetRoomInfoRsp instance using the specified properties.
          * @function create
          * @memberof gsbase.GetRoomInfoRsp
          * @static
          * @param {gsbase.IGetRoomInfoRsp=} [properties] Properties to set
          * @returns {gsbase.GetRoomInfoRsp} GetRoomInfoRsp instance
          */
         GetRoomInfoRsp.create = function create(properties) {
             return new GetRoomInfoRsp(properties);
         };
 
         /**
          * Encodes the specified GetRoomInfoRsp message. Does not implicitly {@link gsbase.GetRoomInfoRsp.verify|verify} messages.
          * @function encode
          * @memberof gsbase.GetRoomInfoRsp
          * @static
          * @param {gsbase.IGetRoomInfoRsp} message GetRoomInfoRsp message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         GetRoomInfoRsp.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.room != null && Object.hasOwnProperty.call(message, "room"))
                 $root.gsbase.RoomInfo.encode(message.room, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
             return writer;
         };
 
         /**
          * Encodes the specified GetRoomInfoRsp message, length delimited. Does not implicitly {@link gsbase.GetRoomInfoRsp.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.GetRoomInfoRsp
          * @static
          * @param {gsbase.IGetRoomInfoRsp} message GetRoomInfoRsp message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         GetRoomInfoRsp.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a GetRoomInfoRsp message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.GetRoomInfoRsp
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.GetRoomInfoRsp} GetRoomInfoRsp
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         GetRoomInfoRsp.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.GetRoomInfoRsp();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.room = $root.gsbase.RoomInfo.decode(reader, reader.uint32());
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a GetRoomInfoRsp message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.GetRoomInfoRsp
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.GetRoomInfoRsp} GetRoomInfoRsp
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         GetRoomInfoRsp.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a GetRoomInfoRsp message.
          * @function verify
          * @memberof gsbase.GetRoomInfoRsp
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         GetRoomInfoRsp.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.room != null && message.hasOwnProperty("room")) {
                 var error = $root.gsbase.RoomInfo.verify(message.room);
                 if (error)
                     return "room." + error;
             }
             return null;
         };
 
         /**
          * Creates a GetRoomInfoRsp message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.GetRoomInfoRsp
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.GetRoomInfoRsp} GetRoomInfoRsp
          */
         GetRoomInfoRsp.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.GetRoomInfoRsp)
                 return object;
             var message = new $root.gsbase.GetRoomInfoRsp();
             if (object.room != null) {
                 if (typeof object.room !== "object")
                     throw TypeError(".gsbase.GetRoomInfoRsp.room: object expected");
                 message.room = $root.gsbase.RoomInfo.fromObject(object.room);
             }
             return message;
         };
 
         /**
          * Creates a plain object from a GetRoomInfoRsp message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.GetRoomInfoRsp
          * @static
          * @param {gsbase.GetRoomInfoRsp} message GetRoomInfoRsp
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         GetRoomInfoRsp.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults)
                 object.room = null;
             if (message.room != null && message.hasOwnProperty("room"))
                 object.room = $root.gsbase.RoomInfo.toObject(message.room, options);
             return object;
         };
 
         /**
          * Converts this GetRoomInfoRsp to JSON.
          * @function toJSON
          * @memberof gsbase.GetRoomInfoRsp
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         GetRoomInfoRsp.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return GetRoomInfoRsp;
     })();
 
     gsbase.UpdateRoomInfoReq = (function() {
 
         /**
          * Properties of an UpdateRoomInfoReq.
          * @memberof gsbase
          * @interface IUpdateRoomInfoReq
          * @property {string|null} [roomId] UpdateRoomInfoReq roomId
          * @property {Object.<string,string>|null} [properties] UpdateRoomInfoReq properties
          */
 
         /**
          * Constructs a new UpdateRoomInfoReq.
          * @memberof gsbase
          * @classdesc Represents an UpdateRoomInfoReq.
          * @implements IUpdateRoomInfoReq
          * @constructor
          * @param {gsbase.IUpdateRoomInfoReq=} [properties] Properties to set
          */
         function UpdateRoomInfoReq(properties) {
             this.properties = {};
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * UpdateRoomInfoReq roomId.
          * @member {string} roomId
          * @memberof gsbase.UpdateRoomInfoReq
          * @instance
          */
         UpdateRoomInfoReq.prototype.roomId = "";
 
         /**
          * UpdateRoomInfoReq properties.
          * @member {Object.<string,string>} properties
          * @memberof gsbase.UpdateRoomInfoReq
          * @instance
          */
         UpdateRoomInfoReq.prototype.properties = $util.emptyObject;
 
         /**
          * Creates a new UpdateRoomInfoReq instance using the specified properties.
          * @function create
          * @memberof gsbase.UpdateRoomInfoReq
          * @static
          * @param {gsbase.IUpdateRoomInfoReq=} [properties] Properties to set
          * @returns {gsbase.UpdateRoomInfoReq} UpdateRoomInfoReq instance
          */
         UpdateRoomInfoReq.create = function create(properties) {
             return new UpdateRoomInfoReq(properties);
         };
 
         /**
          * Encodes the specified UpdateRoomInfoReq message. Does not implicitly {@link gsbase.UpdateRoomInfoReq.verify|verify} messages.
          * @function encode
          * @memberof gsbase.UpdateRoomInfoReq
          * @static
          * @param {gsbase.IUpdateRoomInfoReq} message UpdateRoomInfoReq message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         UpdateRoomInfoReq.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomId);
             if (message.properties != null && Object.hasOwnProperty.call(message, "properties"))
                 for (var keys = Object.keys(message.properties), i = 0; i < keys.length; ++i)
                     writer.uint32(/* id 2, wireType 2 =*/18).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.properties[keys[i]]).ldelim();
             return writer;
         };
 
         /**
          * Encodes the specified UpdateRoomInfoReq message, length delimited. Does not implicitly {@link gsbase.UpdateRoomInfoReq.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.UpdateRoomInfoReq
          * @static
          * @param {gsbase.IUpdateRoomInfoReq} message UpdateRoomInfoReq message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         UpdateRoomInfoReq.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes an UpdateRoomInfoReq message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.UpdateRoomInfoReq
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.UpdateRoomInfoReq} UpdateRoomInfoReq
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         UpdateRoomInfoReq.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.UpdateRoomInfoReq(), key, value;
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.roomId = reader.string();
                     break;
                 case 2:
                     if (message.properties === $util.emptyObject)
                         message.properties = {};
                     var end2 = reader.uint32() + reader.pos;
                     key = "";
                     value = "";
                     while (reader.pos < end2) {
                         var tag2 = reader.uint32();
                         switch (tag2 >>> 3) {
                         case 1:
                             key = reader.string();
                             break;
                         case 2:
                             value = reader.string();
                             break;
                         default:
                             reader.skipType(tag2 & 7);
                             break;
                         }
                     }
                     message.properties[key] = value;
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes an UpdateRoomInfoReq message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.UpdateRoomInfoReq
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.UpdateRoomInfoReq} UpdateRoomInfoReq
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         UpdateRoomInfoReq.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies an UpdateRoomInfoReq message.
          * @function verify
          * @memberof gsbase.UpdateRoomInfoReq
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         UpdateRoomInfoReq.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.roomId != null && message.hasOwnProperty("roomId"))
                 if (!$util.isString(message.roomId))
                     return "roomId: string expected";
             if (message.properties != null && message.hasOwnProperty("properties")) {
                 if (!$util.isObject(message.properties))
                     return "properties: object expected";
                 var key = Object.keys(message.properties);
                 for (var i = 0; i < key.length; ++i)
                     if (!$util.isString(message.properties[key[i]]))
                         return "properties: string{k:string} expected";
             }
             return null;
         };
 
         /**
          * Creates an UpdateRoomInfoReq message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.UpdateRoomInfoReq
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.UpdateRoomInfoReq} UpdateRoomInfoReq
          */
         UpdateRoomInfoReq.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.UpdateRoomInfoReq)
                 return object;
             var message = new $root.gsbase.UpdateRoomInfoReq();
             if (object.roomId != null)
                 message.roomId = String(object.roomId);
             if (object.properties) {
                 if (typeof object.properties !== "object")
                     throw TypeError(".gsbase.UpdateRoomInfoReq.properties: object expected");
                 message.properties = {};
                 for (var keys = Object.keys(object.properties), i = 0; i < keys.length; ++i)
                     message.properties[keys[i]] = String(object.properties[keys[i]]);
             }
             return message;
         };
 
         /**
          * Creates a plain object from an UpdateRoomInfoReq message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.UpdateRoomInfoReq
          * @static
          * @param {gsbase.UpdateRoomInfoReq} message UpdateRoomInfoReq
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         UpdateRoomInfoReq.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.objects || options.defaults)
                 object.properties = {};
             if (options.defaults)
                 object.roomId = "";
             if (message.roomId != null && message.hasOwnProperty("roomId"))
                 object.roomId = message.roomId;
             var keys2;
             if (message.properties && (keys2 = Object.keys(message.properties)).length) {
                 object.properties = {};
                 for (var j = 0; j < keys2.length; ++j)
                     object.properties[keys2[j]] = message.properties[keys2[j]];
             }
             return object;
         };
 
         /**
          * Converts this UpdateRoomInfoReq to JSON.
          * @function toJSON
          * @memberof gsbase.UpdateRoomInfoReq
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         UpdateRoomInfoReq.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return UpdateRoomInfoReq;
     })();
 
     gsbase.UpdateRoomInfoRsp = (function() {
 
         /**
          * Properties of an UpdateRoomInfoRsp.
          * @memberof gsbase
          * @interface IUpdateRoomInfoRsp
          * @property {string|null} [err] UpdateRoomInfoRsp err
          */
 
         /**
          * Constructs a new UpdateRoomInfoRsp.
          * @memberof gsbase
          * @classdesc Represents an UpdateRoomInfoRsp.
          * @implements IUpdateRoomInfoRsp
          * @constructor
          * @param {gsbase.IUpdateRoomInfoRsp=} [properties] Properties to set
          */
         function UpdateRoomInfoRsp(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * UpdateRoomInfoRsp err.
          * @member {string} err
          * @memberof gsbase.UpdateRoomInfoRsp
          * @instance
          */
         UpdateRoomInfoRsp.prototype.err = "";
 
         /**
          * Creates a new UpdateRoomInfoRsp instance using the specified properties.
          * @function create
          * @memberof gsbase.UpdateRoomInfoRsp
          * @static
          * @param {gsbase.IUpdateRoomInfoRsp=} [properties] Properties to set
          * @returns {gsbase.UpdateRoomInfoRsp} UpdateRoomInfoRsp instance
          */
         UpdateRoomInfoRsp.create = function create(properties) {
             return new UpdateRoomInfoRsp(properties);
         };
 
         /**
          * Encodes the specified UpdateRoomInfoRsp message. Does not implicitly {@link gsbase.UpdateRoomInfoRsp.verify|verify} messages.
          * @function encode
          * @memberof gsbase.UpdateRoomInfoRsp
          * @static
          * @param {gsbase.IUpdateRoomInfoRsp} message UpdateRoomInfoRsp message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         UpdateRoomInfoRsp.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.err != null && Object.hasOwnProperty.call(message, "err"))
                 writer.uint32(/* id 1, wireType 2 =*/10).string(message.err);
             return writer;
         };
 
         /**
          * Encodes the specified UpdateRoomInfoRsp message, length delimited. Does not implicitly {@link gsbase.UpdateRoomInfoRsp.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.UpdateRoomInfoRsp
          * @static
          * @param {gsbase.IUpdateRoomInfoRsp} message UpdateRoomInfoRsp message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         UpdateRoomInfoRsp.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes an UpdateRoomInfoRsp message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.UpdateRoomInfoRsp
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.UpdateRoomInfoRsp} UpdateRoomInfoRsp
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         UpdateRoomInfoRsp.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.UpdateRoomInfoRsp();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.err = reader.string();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes an UpdateRoomInfoRsp message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.UpdateRoomInfoRsp
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.UpdateRoomInfoRsp} UpdateRoomInfoRsp
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         UpdateRoomInfoRsp.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies an UpdateRoomInfoRsp message.
          * @function verify
          * @memberof gsbase.UpdateRoomInfoRsp
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         UpdateRoomInfoRsp.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.err != null && message.hasOwnProperty("err"))
                 if (!$util.isString(message.err))
                     return "err: string expected";
             return null;
         };
 
         /**
          * Creates an UpdateRoomInfoRsp message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.UpdateRoomInfoRsp
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.UpdateRoomInfoRsp} UpdateRoomInfoRsp
          */
         UpdateRoomInfoRsp.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.UpdateRoomInfoRsp)
                 return object;
             var message = new $root.gsbase.UpdateRoomInfoRsp();
             if (object.err != null)
                 message.err = String(object.err);
             return message;
         };
 
         /**
          * Creates a plain object from an UpdateRoomInfoRsp message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.UpdateRoomInfoRsp
          * @static
          * @param {gsbase.UpdateRoomInfoRsp} message UpdateRoomInfoRsp
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         UpdateRoomInfoRsp.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults)
                 object.err = "";
             if (message.err != null && message.hasOwnProperty("err"))
                 object.err = message.err;
             return object;
         };
 
         /**
          * Converts this UpdateRoomInfoRsp to JSON.
          * @function toJSON
          * @memberof gsbase.UpdateRoomInfoRsp
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         UpdateRoomInfoRsp.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return UpdateRoomInfoRsp;
     })();
 
     gsbase.SystemMessage = (function() {
 
         /**
          * Properties of a SystemMessage.
          * @memberof gsbase
          * @interface ISystemMessage
          * @property {number|null} [code] SystemMessage code
          * @property {string|null} [err] SystemMessage err
          * @property {string|null} [request] SystemMessage request
          */
 
         /**
          * Constructs a new SystemMessage.
          * @memberof gsbase
          * @classdesc Represents a SystemMessage.
          * @implements ISystemMessage
          * @constructor
          * @param {gsbase.ISystemMessage=} [properties] Properties to set
          */
         function SystemMessage(properties) {
             if (properties)
                 for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                     if (properties[keys[i]] != null)
                         this[keys[i]] = properties[keys[i]];
         }
 
         /**
          * SystemMessage code.
          * @member {number} code
          * @memberof gsbase.SystemMessage
          * @instance
          */
         SystemMessage.prototype.code = 0;
 
         /**
          * SystemMessage err.
          * @member {string} err
          * @memberof gsbase.SystemMessage
          * @instance
          */
         SystemMessage.prototype.err = "";
 
         /**
          * SystemMessage request.
          * @member {string} request
          * @memberof gsbase.SystemMessage
          * @instance
          */
         SystemMessage.prototype.request = "";
 
         /**
          * Creates a new SystemMessage instance using the specified properties.
          * @function create
          * @memberof gsbase.SystemMessage
          * @static
          * @param {gsbase.ISystemMessage=} [properties] Properties to set
          * @returns {gsbase.SystemMessage} SystemMessage instance
          */
         SystemMessage.create = function create(properties) {
             return new SystemMessage(properties);
         };
 
         /**
          * Encodes the specified SystemMessage message. Does not implicitly {@link gsbase.SystemMessage.verify|verify} messages.
          * @function encode
          * @memberof gsbase.SystemMessage
          * @static
          * @param {gsbase.ISystemMessage} message SystemMessage message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         SystemMessage.encode = function encode(message, writer) {
             if (!writer)
                 writer = $Writer.create();
             if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                 writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
             if (message.err != null && Object.hasOwnProperty.call(message, "err"))
                 writer.uint32(/* id 2, wireType 2 =*/18).string(message.err);
             if (message.request != null && Object.hasOwnProperty.call(message, "request"))
                 writer.uint32(/* id 3, wireType 2 =*/26).string(message.request);
             return writer;
         };
 
         /**
          * Encodes the specified SystemMessage message, length delimited. Does not implicitly {@link gsbase.SystemMessage.verify|verify} messages.
          * @function encodeDelimited
          * @memberof gsbase.SystemMessage
          * @static
          * @param {gsbase.ISystemMessage} message SystemMessage message or plain object to encode
          * @param {$protobuf.Writer} [writer] Writer to encode to
          * @returns {$protobuf.Writer} Writer
          */
         SystemMessage.encodeDelimited = function encodeDelimited(message, writer) {
             return this.encode(message, writer).ldelim();
         };
 
         /**
          * Decodes a SystemMessage message from the specified reader or buffer.
          * @function decode
          * @memberof gsbase.SystemMessage
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @param {number} [length] Message length if known beforehand
          * @returns {gsbase.SystemMessage} SystemMessage
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         SystemMessage.decode = function decode(reader, length) {
             if (!(reader instanceof $Reader))
                 reader = $Reader.create(reader);
             var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gsbase.SystemMessage();
             while (reader.pos < end) {
                 var tag = reader.uint32();
                 switch (tag >>> 3) {
                 case 1:
                     message.code = reader.int32();
                     break;
                 case 2:
                     message.err = reader.string();
                     break;
                 case 3:
                     message.request = reader.string();
                     break;
                 default:
                     reader.skipType(tag & 7);
                     break;
                 }
             }
             return message;
         };
 
         /**
          * Decodes a SystemMessage message from the specified reader or buffer, length delimited.
          * @function decodeDelimited
          * @memberof gsbase.SystemMessage
          * @static
          * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
          * @returns {gsbase.SystemMessage} SystemMessage
          * @throws {Error} If the payload is not a reader or valid buffer
          * @throws {$protobuf.util.ProtocolError} If required fields are missing
          */
         SystemMessage.decodeDelimited = function decodeDelimited(reader) {
             if (!(reader instanceof $Reader))
                 reader = new $Reader(reader);
             return this.decode(reader, reader.uint32());
         };
 
         /**
          * Verifies a SystemMessage message.
          * @function verify
          * @memberof gsbase.SystemMessage
          * @static
          * @param {Object.<string,*>} message Plain object to verify
          * @returns {string|null} `null` if valid, otherwise the reason why it is not
          */
         SystemMessage.verify = function verify(message) {
             if (typeof message !== "object" || message === null)
                 return "object expected";
             if (message.code != null && message.hasOwnProperty("code"))
                 if (!$util.isInteger(message.code))
                     return "code: integer expected";
             if (message.err != null && message.hasOwnProperty("err"))
                 if (!$util.isString(message.err))
                     return "err: string expected";
             if (message.request != null && message.hasOwnProperty("request"))
                 if (!$util.isString(message.request))
                     return "request: string expected";
             return null;
         };
 
         /**
          * Creates a SystemMessage message from a plain object. Also converts values to their respective internal types.
          * @function fromObject
          * @memberof gsbase.SystemMessage
          * @static
          * @param {Object.<string,*>} object Plain object
          * @returns {gsbase.SystemMessage} SystemMessage
          */
         SystemMessage.fromObject = function fromObject(object) {
             if (object instanceof $root.gsbase.SystemMessage)
                 return object;
             var message = new $root.gsbase.SystemMessage();
             if (object.code != null)
                 message.code = object.code | 0;
             if (object.err != null)
                 message.err = String(object.err);
             if (object.request != null)
                 message.request = String(object.request);
             return message;
         };
 
         /**
          * Creates a plain object from a SystemMessage message. Also converts values to other types if specified.
          * @function toObject
          * @memberof gsbase.SystemMessage
          * @static
          * @param {gsbase.SystemMessage} message SystemMessage
          * @param {$protobuf.IConversionOptions} [options] Conversion options
          * @returns {Object.<string,*>} Plain object
          */
         SystemMessage.toObject = function toObject(message, options) {
             if (!options)
                 options = {};
             var object = {};
             if (options.defaults) {
                 object.code = 0;
                 object.err = "";
                 object.request = "";
             }
             if (message.code != null && message.hasOwnProperty("code"))
                 object.code = message.code;
             if (message.err != null && message.hasOwnProperty("err"))
                 object.err = message.err;
             if (message.request != null && message.hasOwnProperty("request"))
                 object.request = message.request;
             return object;
         };
 
         /**
          * Converts this SystemMessage to JSON.
          * @function toJSON
          * @memberof gsbase.SystemMessage
          * @instance
          * @returns {Object.<string,*>} JSON object
          */
         SystemMessage.prototype.toJSON = function toJSON() {
             return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
         };
 
         return SystemMessage;
     })();
 
     return gsbase;
})();

module.exports = $root.gsbase;
