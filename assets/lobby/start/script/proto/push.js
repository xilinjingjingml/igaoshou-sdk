/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = protobuf;

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.push = (function() {

    /**
     * Namespace push.
     * @exports push
     * @namespace
     */
    var push = {};

    push.Push = (function() {

        /**
         * Constructs a new Push service.
         * @memberof push
         * @classdesc Represents a Push
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function Push(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (Push.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Push;

        /**
         * Creates new Push service using the specified rpc implementation.
         * @function create
         * @memberof push.Push
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {Push} RPC service. Useful where requests and/or responses are streamed.
         */
        Push.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link push.Push#register}.
         * @memberof push.Push
         * @typedef RegisterCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {push.Empty} [response] Empty
         */

        /**
         * Calls Register.
         * @function register
         * @memberof push.Push
         * @instance
         * @param {push.IRegisterReq} request RegisterReq message or plain object
         * @param {push.Push.RegisterCallback} callback Node-style callback called with the error, if any, and Empty
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Push.prototype.register = function register(request, callback) {
            return this.rpcCall(register, $root.push.RegisterReq, $root.push.Empty, request, callback);
        }, "name", { value: "Register" });

        /**
         * Calls Register.
         * @function register
         * @memberof push.Push
         * @instance
         * @param {push.IRegisterReq} request RegisterReq message or plain object
         * @returns {Promise<push.Empty>} Promise
         * @variation 2
         */

        return Push;
    })();

    push.Empty = (function() {

        /**
         * Properties of an Empty.
         * @memberof push
         * @interface IEmpty
         */

        /**
         * Constructs a new Empty.
         * @memberof push
         * @classdesc Represents an Empty.
         * @implements IEmpty
         * @constructor
         * @param {push.IEmpty=} [properties] Properties to set
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
         * @memberof push.Empty
         * @static
         * @param {push.IEmpty=} [properties] Properties to set
         * @returns {push.Empty} Empty instance
         */
        Empty.create = function create(properties) {
            return new Empty(properties);
        };

        /**
         * Encodes the specified Empty message. Does not implicitly {@link push.Empty.verify|verify} messages.
         * @function encode
         * @memberof push.Empty
         * @static
         * @param {push.IEmpty} message Empty message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Empty.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified Empty message, length delimited. Does not implicitly {@link push.Empty.verify|verify} messages.
         * @function encodeDelimited
         * @memberof push.Empty
         * @static
         * @param {push.IEmpty} message Empty message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Empty.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Empty message from the specified reader or buffer.
         * @function decode
         * @memberof push.Empty
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {push.Empty} Empty
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Empty.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push.Empty();
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
         * @memberof push.Empty
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {push.Empty} Empty
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
         * @memberof push.Empty
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
         * @memberof push.Empty
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {push.Empty} Empty
         */
        Empty.fromObject = function fromObject(object) {
            if (object instanceof $root.push.Empty)
                return object;
            return new $root.push.Empty();
        };

        /**
         * Creates a plain object from an Empty message. Also converts values to other types if specified.
         * @function toObject
         * @memberof push.Empty
         * @static
         * @param {push.Empty} message Empty
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Empty.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this Empty to JSON.
         * @function toJSON
         * @memberof push.Empty
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Empty.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Empty;
    })();

    push.SysError = (function() {

        /**
         * Properties of a SysError.
         * @memberof push
         * @interface ISysError
         * @property {string|null} [id] SysError id
         * @property {number|null} [code] SysError code
         * @property {string|null} [detail] SysError detail
         * @property {string|null} [status] SysError status
         */

        /**
         * Constructs a new SysError.
         * @memberof push
         * @classdesc Represents a SysError.
         * @implements ISysError
         * @constructor
         * @param {push.ISysError=} [properties] Properties to set
         */
        function SysError(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SysError id.
         * @member {string} id
         * @memberof push.SysError
         * @instance
         */
        SysError.prototype.id = "";

        /**
         * SysError code.
         * @member {number} code
         * @memberof push.SysError
         * @instance
         */
        SysError.prototype.code = 0;

        /**
         * SysError detail.
         * @member {string} detail
         * @memberof push.SysError
         * @instance
         */
        SysError.prototype.detail = "";

        /**
         * SysError status.
         * @member {string} status
         * @memberof push.SysError
         * @instance
         */
        SysError.prototype.status = "";

        /**
         * Creates a new SysError instance using the specified properties.
         * @function create
         * @memberof push.SysError
         * @static
         * @param {push.ISysError=} [properties] Properties to set
         * @returns {push.SysError} SysError instance
         */
        SysError.create = function create(properties) {
            return new SysError(properties);
        };

        /**
         * Encodes the specified SysError message. Does not implicitly {@link push.SysError.verify|verify} messages.
         * @function encode
         * @memberof push.SysError
         * @static
         * @param {push.ISysError} message SysError message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SysError.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && message.hasOwnProperty("id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.code != null && message.hasOwnProperty("code"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.code);
            if (message.detail != null && message.hasOwnProperty("detail"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.detail);
            if (message.status != null && message.hasOwnProperty("status"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.status);
            return writer;
        };

        /**
         * Encodes the specified SysError message, length delimited. Does not implicitly {@link push.SysError.verify|verify} messages.
         * @function encodeDelimited
         * @memberof push.SysError
         * @static
         * @param {push.ISysError} message SysError message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SysError.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SysError message from the specified reader or buffer.
         * @function decode
         * @memberof push.SysError
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {push.SysError} SysError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SysError.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push.SysError();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.code = reader.int32();
                    break;
                case 3:
                    message.detail = reader.string();
                    break;
                case 4:
                    message.status = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SysError message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof push.SysError
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {push.SysError} SysError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SysError.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SysError message.
         * @function verify
         * @memberof push.SysError
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SysError.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.detail != null && message.hasOwnProperty("detail"))
                if (!$util.isString(message.detail))
                    return "detail: string expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isString(message.status))
                    return "status: string expected";
            return null;
        };

        /**
         * Creates a SysError message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof push.SysError
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {push.SysError} SysError
         */
        SysError.fromObject = function fromObject(object) {
            if (object instanceof $root.push.SysError)
                return object;
            var message = new $root.push.SysError();
            if (object.id != null)
                message.id = String(object.id);
            if (object.code != null)
                message.code = object.code | 0;
            if (object.detail != null)
                message.detail = String(object.detail);
            if (object.status != null)
                message.status = String(object.status);
            return message;
        };

        /**
         * Creates a plain object from a SysError message. Also converts values to other types if specified.
         * @function toObject
         * @memberof push.SysError
         * @static
         * @param {push.SysError} message SysError
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SysError.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = "";
                object.code = 0;
                object.detail = "";
                object.status = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.detail != null && message.hasOwnProperty("detail"))
                object.detail = message.detail;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            return object;
        };

        /**
         * Converts this SysError to JSON.
         * @function toJSON
         * @memberof push.SysError
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SysError.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SysError;
    })();

    push.RegisterReq = (function() {

        /**
         * Properties of a RegisterReq.
         * @memberof push
         * @interface IRegisterReq
         * @property {string|null} [openid] RegisterReq openid
         * @property {string|null} [token] RegisterReq token
         * @property {number|Long|null} [cliVer] RegisterReq cliVer
         */

        /**
         * Constructs a new RegisterReq.
         * @memberof push
         * @classdesc Represents a RegisterReq.
         * @implements IRegisterReq
         * @constructor
         * @param {push.IRegisterReq=} [properties] Properties to set
         */
        function RegisterReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RegisterReq openid.
         * @member {string} openid
         * @memberof push.RegisterReq
         * @instance
         */
        RegisterReq.prototype.openid = "";

        /**
         * RegisterReq token.
         * @member {string} token
         * @memberof push.RegisterReq
         * @instance
         */
        RegisterReq.prototype.token = "";

        /**
         * RegisterReq cliVer.
         * @member {number|Long} cliVer
         * @memberof push.RegisterReq
         * @instance
         */
        RegisterReq.prototype.cliVer = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new RegisterReq instance using the specified properties.
         * @function create
         * @memberof push.RegisterReq
         * @static
         * @param {push.IRegisterReq=} [properties] Properties to set
         * @returns {push.RegisterReq} RegisterReq instance
         */
        RegisterReq.create = function create(properties) {
            return new RegisterReq(properties);
        };

        /**
         * Encodes the specified RegisterReq message. Does not implicitly {@link push.RegisterReq.verify|verify} messages.
         * @function encode
         * @memberof push.RegisterReq
         * @static
         * @param {push.IRegisterReq} message RegisterReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegisterReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.openid != null && message.hasOwnProperty("openid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.openid);
            if (message.token != null && message.hasOwnProperty("token"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.token);
            if (message.cliVer != null && message.hasOwnProperty("cliVer"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.cliVer);
            return writer;
        };

        /**
         * Encodes the specified RegisterReq message, length delimited. Does not implicitly {@link push.RegisterReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof push.RegisterReq
         * @static
         * @param {push.IRegisterReq} message RegisterReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegisterReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RegisterReq message from the specified reader or buffer.
         * @function decode
         * @memberof push.RegisterReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {push.RegisterReq} RegisterReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegisterReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push.RegisterReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.openid = reader.string();
                    break;
                case 2:
                    message.token = reader.string();
                    break;
                case 3:
                    message.cliVer = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RegisterReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof push.RegisterReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {push.RegisterReq} RegisterReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegisterReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RegisterReq message.
         * @function verify
         * @memberof push.RegisterReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RegisterReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.openid != null && message.hasOwnProperty("openid"))
                if (!$util.isString(message.openid))
                    return "openid: string expected";
            if (message.token != null && message.hasOwnProperty("token"))
                if (!$util.isString(message.token))
                    return "token: string expected";
            if (message.cliVer != null && message.hasOwnProperty("cliVer"))
                if (!$util.isInteger(message.cliVer) && !(message.cliVer && $util.isInteger(message.cliVer.low) && $util.isInteger(message.cliVer.high)))
                    return "cliVer: integer|Long expected";
            return null;
        };

        /**
         * Creates a RegisterReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof push.RegisterReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {push.RegisterReq} RegisterReq
         */
        RegisterReq.fromObject = function fromObject(object) {
            if (object instanceof $root.push.RegisterReq)
                return object;
            var message = new $root.push.RegisterReq();
            if (object.openid != null)
                message.openid = String(object.openid);
            if (object.token != null)
                message.token = String(object.token);
            if (object.cliVer != null)
                if ($util.Long)
                    (message.cliVer = $util.Long.fromValue(object.cliVer)).unsigned = false;
                else if (typeof object.cliVer === "string")
                    message.cliVer = parseInt(object.cliVer, 10);
                else if (typeof object.cliVer === "number")
                    message.cliVer = object.cliVer;
                else if (typeof object.cliVer === "object")
                    message.cliVer = new $util.LongBits(object.cliVer.low >>> 0, object.cliVer.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a RegisterReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof push.RegisterReq
         * @static
         * @param {push.RegisterReq} message RegisterReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RegisterReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.openid = "";
                object.token = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.cliVer = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.cliVer = options.longs === String ? "0" : 0;
            }
            if (message.openid != null && message.hasOwnProperty("openid"))
                object.openid = message.openid;
            if (message.token != null && message.hasOwnProperty("token"))
                object.token = message.token;
            if (message.cliVer != null && message.hasOwnProperty("cliVer"))
                if (typeof message.cliVer === "number")
                    object.cliVer = options.longs === String ? String(message.cliVer) : message.cliVer;
                else
                    object.cliVer = options.longs === String ? $util.Long.prototype.toString.call(message.cliVer) : options.longs === Number ? new $util.LongBits(message.cliVer.low >>> 0, message.cliVer.high >>> 0).toNumber() : message.cliVer;
            return object;
        };

        /**
         * Converts this RegisterReq to JSON.
         * @function toJSON
         * @memberof push.RegisterReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RegisterReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RegisterReq;
    })();

    push.RegisterRsp = (function() {

        /**
         * Properties of a RegisterRsp.
         * @memberof push
         * @interface IRegisterRsp
         */

        /**
         * Constructs a new RegisterRsp.
         * @memberof push
         * @classdesc Represents a RegisterRsp.
         * @implements IRegisterRsp
         * @constructor
         * @param {push.IRegisterRsp=} [properties] Properties to set
         */
        function RegisterRsp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new RegisterRsp instance using the specified properties.
         * @function create
         * @memberof push.RegisterRsp
         * @static
         * @param {push.IRegisterRsp=} [properties] Properties to set
         * @returns {push.RegisterRsp} RegisterRsp instance
         */
        RegisterRsp.create = function create(properties) {
            return new RegisterRsp(properties);
        };

        /**
         * Encodes the specified RegisterRsp message. Does not implicitly {@link push.RegisterRsp.verify|verify} messages.
         * @function encode
         * @memberof push.RegisterRsp
         * @static
         * @param {push.IRegisterRsp} message RegisterRsp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegisterRsp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified RegisterRsp message, length delimited. Does not implicitly {@link push.RegisterRsp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof push.RegisterRsp
         * @static
         * @param {push.IRegisterRsp} message RegisterRsp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegisterRsp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RegisterRsp message from the specified reader or buffer.
         * @function decode
         * @memberof push.RegisterRsp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {push.RegisterRsp} RegisterRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegisterRsp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push.RegisterRsp();
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
         * Decodes a RegisterRsp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof push.RegisterRsp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {push.RegisterRsp} RegisterRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegisterRsp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RegisterRsp message.
         * @function verify
         * @memberof push.RegisterRsp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RegisterRsp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a RegisterRsp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof push.RegisterRsp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {push.RegisterRsp} RegisterRsp
         */
        RegisterRsp.fromObject = function fromObject(object) {
            if (object instanceof $root.push.RegisterRsp)
                return object;
            return new $root.push.RegisterRsp();
        };

        /**
         * Creates a plain object from a RegisterRsp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof push.RegisterRsp
         * @static
         * @param {push.RegisterRsp} message RegisterRsp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RegisterRsp.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this RegisterRsp to JSON.
         * @function toJSON
         * @memberof push.RegisterRsp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RegisterRsp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RegisterRsp;
    })();

    push.PushReq = (function() {

        /**
         * Properties of a PushReq.
         * @memberof push
         * @interface IPushReq
         * @property {string|null} [openid] PushReq openid
         * @property {string|null} [route] PushReq route
         * @property {Uint8Array|null} [body] PushReq body
         */

        /**
         * Constructs a new PushReq.
         * @memberof push
         * @classdesc Represents a PushReq.
         * @implements IPushReq
         * @constructor
         * @param {push.IPushReq=} [properties] Properties to set
         */
        function PushReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PushReq openid.
         * @member {string} openid
         * @memberof push.PushReq
         * @instance
         */
        PushReq.prototype.openid = "";

        /**
         * PushReq route.
         * @member {string} route
         * @memberof push.PushReq
         * @instance
         */
        PushReq.prototype.route = "";

        /**
         * PushReq body.
         * @member {Uint8Array} body
         * @memberof push.PushReq
         * @instance
         */
        PushReq.prototype.body = $util.newBuffer([]);

        /**
         * Creates a new PushReq instance using the specified properties.
         * @function create
         * @memberof push.PushReq
         * @static
         * @param {push.IPushReq=} [properties] Properties to set
         * @returns {push.PushReq} PushReq instance
         */
        PushReq.create = function create(properties) {
            return new PushReq(properties);
        };

        /**
         * Encodes the specified PushReq message. Does not implicitly {@link push.PushReq.verify|verify} messages.
         * @function encode
         * @memberof push.PushReq
         * @static
         * @param {push.IPushReq} message PushReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PushReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.openid != null && message.hasOwnProperty("openid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.openid);
            if (message.route != null && message.hasOwnProperty("route"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.route);
            if (message.body != null && message.hasOwnProperty("body"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.body);
            return writer;
        };

        /**
         * Encodes the specified PushReq message, length delimited. Does not implicitly {@link push.PushReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof push.PushReq
         * @static
         * @param {push.IPushReq} message PushReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PushReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PushReq message from the specified reader or buffer.
         * @function decode
         * @memberof push.PushReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {push.PushReq} PushReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PushReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push.PushReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.openid = reader.string();
                    break;
                case 2:
                    message.route = reader.string();
                    break;
                case 3:
                    message.body = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PushReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof push.PushReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {push.PushReq} PushReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PushReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PushReq message.
         * @function verify
         * @memberof push.PushReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PushReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.openid != null && message.hasOwnProperty("openid"))
                if (!$util.isString(message.openid))
                    return "openid: string expected";
            if (message.route != null && message.hasOwnProperty("route"))
                if (!$util.isString(message.route))
                    return "route: string expected";
            if (message.body != null && message.hasOwnProperty("body"))
                if (!(message.body && typeof message.body.length === "number" || $util.isString(message.body)))
                    return "body: buffer expected";
            return null;
        };

        /**
         * Creates a PushReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof push.PushReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {push.PushReq} PushReq
         */
        PushReq.fromObject = function fromObject(object) {
            if (object instanceof $root.push.PushReq)
                return object;
            var message = new $root.push.PushReq();
            if (object.openid != null)
                message.openid = String(object.openid);
            if (object.route != null)
                message.route = String(object.route);
            if (object.body != null)
                if (typeof object.body === "string")
                    $util.base64.decode(object.body, message.body = $util.newBuffer($util.base64.length(object.body)), 0);
                else if (object.body.length)
                    message.body = object.body;
            return message;
        };

        /**
         * Creates a plain object from a PushReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof push.PushReq
         * @static
         * @param {push.PushReq} message PushReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PushReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.openid = "";
                object.route = "";
                if (options.bytes === String)
                    object.body = "";
                else {
                    object.body = [];
                    if (options.bytes !== Array)
                        object.body = $util.newBuffer(object.body);
                }
            }
            if (message.openid != null && message.hasOwnProperty("openid"))
                object.openid = message.openid;
            if (message.route != null && message.hasOwnProperty("route"))
                object.route = message.route;
            if (message.body != null && message.hasOwnProperty("body"))
                object.body = options.bytes === String ? $util.base64.encode(message.body, 0, message.body.length) : options.bytes === Array ? Array.prototype.slice.call(message.body) : message.body;
            return object;
        };

        /**
         * Converts this PushReq to JSON.
         * @function toJSON
         * @memberof push.PushReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PushReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PushReq;
    })();

    push.PushRsp = (function() {

        /**
         * Properties of a PushRsp.
         * @memberof push
         * @interface IPushRsp
         */

        /**
         * Constructs a new PushRsp.
         * @memberof push
         * @classdesc Represents a PushRsp.
         * @implements IPushRsp
         * @constructor
         * @param {push.IPushRsp=} [properties] Properties to set
         */
        function PushRsp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new PushRsp instance using the specified properties.
         * @function create
         * @memberof push.PushRsp
         * @static
         * @param {push.IPushRsp=} [properties] Properties to set
         * @returns {push.PushRsp} PushRsp instance
         */
        PushRsp.create = function create(properties) {
            return new PushRsp(properties);
        };

        /**
         * Encodes the specified PushRsp message. Does not implicitly {@link push.PushRsp.verify|verify} messages.
         * @function encode
         * @memberof push.PushRsp
         * @static
         * @param {push.IPushRsp} message PushRsp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PushRsp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified PushRsp message, length delimited. Does not implicitly {@link push.PushRsp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof push.PushRsp
         * @static
         * @param {push.IPushRsp} message PushRsp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PushRsp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PushRsp message from the specified reader or buffer.
         * @function decode
         * @memberof push.PushRsp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {push.PushRsp} PushRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PushRsp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push.PushRsp();
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
         * Decodes a PushRsp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof push.PushRsp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {push.PushRsp} PushRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PushRsp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PushRsp message.
         * @function verify
         * @memberof push.PushRsp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PushRsp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a PushRsp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof push.PushRsp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {push.PushRsp} PushRsp
         */
        PushRsp.fromObject = function fromObject(object) {
            if (object instanceof $root.push.PushRsp)
                return object;
            return new $root.push.PushRsp();
        };

        /**
         * Creates a plain object from a PushRsp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof push.PushRsp
         * @static
         * @param {push.PushRsp} message PushRsp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PushRsp.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this PushRsp to JSON.
         * @function toJSON
         * @memberof push.PushRsp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PushRsp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PushRsp;
    })();

    push.Ping = (function() {

        /**
         * Properties of a Ping.
         * @memberof push
         * @interface IPing
         * @property {number|Long|null} [now] Ping now
         * @property {string|null} [openid] Ping openid
         */

        /**
         * Constructs a new Ping.
         * @memberof push
         * @classdesc Represents a Ping.
         * @implements IPing
         * @constructor
         * @param {push.IPing=} [properties] Properties to set
         */
        function Ping(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Ping now.
         * @member {number|Long} now
         * @memberof push.Ping
         * @instance
         */
        Ping.prototype.now = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Ping openid.
         * @member {string} openid
         * @memberof push.Ping
         * @instance
         */
        Ping.prototype.openid = "";

        /**
         * Creates a new Ping instance using the specified properties.
         * @function create
         * @memberof push.Ping
         * @static
         * @param {push.IPing=} [properties] Properties to set
         * @returns {push.Ping} Ping instance
         */
        Ping.create = function create(properties) {
            return new Ping(properties);
        };

        /**
         * Encodes the specified Ping message. Does not implicitly {@link push.Ping.verify|verify} messages.
         * @function encode
         * @memberof push.Ping
         * @static
         * @param {push.IPing} message Ping message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Ping.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.now != null && message.hasOwnProperty("now"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.now);
            if (message.openid != null && message.hasOwnProperty("openid"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.openid);
            return writer;
        };

        /**
         * Encodes the specified Ping message, length delimited. Does not implicitly {@link push.Ping.verify|verify} messages.
         * @function encodeDelimited
         * @memberof push.Ping
         * @static
         * @param {push.IPing} message Ping message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Ping.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Ping message from the specified reader or buffer.
         * @function decode
         * @memberof push.Ping
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {push.Ping} Ping
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Ping.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push.Ping();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.now = reader.int64();
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
         * Decodes a Ping message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof push.Ping
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {push.Ping} Ping
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Ping.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Ping message.
         * @function verify
         * @memberof push.Ping
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Ping.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.now != null && message.hasOwnProperty("now"))
                if (!$util.isInteger(message.now) && !(message.now && $util.isInteger(message.now.low) && $util.isInteger(message.now.high)))
                    return "now: integer|Long expected";
            if (message.openid != null && message.hasOwnProperty("openid"))
                if (!$util.isString(message.openid))
                    return "openid: string expected";
            return null;
        };

        /**
         * Creates a Ping message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof push.Ping
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {push.Ping} Ping
         */
        Ping.fromObject = function fromObject(object) {
            if (object instanceof $root.push.Ping)
                return object;
            var message = new $root.push.Ping();
            if (object.now != null)
                if ($util.Long)
                    (message.now = $util.Long.fromValue(object.now)).unsigned = false;
                else if (typeof object.now === "string")
                    message.now = parseInt(object.now, 10);
                else if (typeof object.now === "number")
                    message.now = object.now;
                else if (typeof object.now === "object")
                    message.now = new $util.LongBits(object.now.low >>> 0, object.now.high >>> 0).toNumber();
            if (object.openid != null)
                message.openid = String(object.openid);
            return message;
        };

        /**
         * Creates a plain object from a Ping message. Also converts values to other types if specified.
         * @function toObject
         * @memberof push.Ping
         * @static
         * @param {push.Ping} message Ping
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Ping.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.now = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.now = options.longs === String ? "0" : 0;
                object.openid = "";
            }
            if (message.now != null && message.hasOwnProperty("now"))
                if (typeof message.now === "number")
                    object.now = options.longs === String ? String(message.now) : message.now;
                else
                    object.now = options.longs === String ? $util.Long.prototype.toString.call(message.now) : options.longs === Number ? new $util.LongBits(message.now.low >>> 0, message.now.high >>> 0).toNumber() : message.now;
            if (message.openid != null && message.hasOwnProperty("openid"))
                object.openid = message.openid;
            return object;
        };

        /**
         * Converts this Ping to JSON.
         * @function toJSON
         * @memberof push.Ping
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Ping.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Ping;
    })();

    push.Pong = (function() {

        /**
         * Properties of a Pong.
         * @memberof push
         * @interface IPong
         * @property {number|Long|null} [now] Pong now
         * @property {number|Long|null} [send] Pong send
         */

        /**
         * Constructs a new Pong.
         * @memberof push
         * @classdesc Represents a Pong.
         * @implements IPong
         * @constructor
         * @param {push.IPong=} [properties] Properties to set
         */
        function Pong(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Pong now.
         * @member {number|Long} now
         * @memberof push.Pong
         * @instance
         */
        Pong.prototype.now = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Pong send.
         * @member {number|Long} send
         * @memberof push.Pong
         * @instance
         */
        Pong.prototype.send = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new Pong instance using the specified properties.
         * @function create
         * @memberof push.Pong
         * @static
         * @param {push.IPong=} [properties] Properties to set
         * @returns {push.Pong} Pong instance
         */
        Pong.create = function create(properties) {
            return new Pong(properties);
        };

        /**
         * Encodes the specified Pong message. Does not implicitly {@link push.Pong.verify|verify} messages.
         * @function encode
         * @memberof push.Pong
         * @static
         * @param {push.IPong} message Pong message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Pong.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.now != null && message.hasOwnProperty("now"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.now);
            if (message.send != null && message.hasOwnProperty("send"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.send);
            return writer;
        };

        /**
         * Encodes the specified Pong message, length delimited. Does not implicitly {@link push.Pong.verify|verify} messages.
         * @function encodeDelimited
         * @memberof push.Pong
         * @static
         * @param {push.IPong} message Pong message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Pong.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Pong message from the specified reader or buffer.
         * @function decode
         * @memberof push.Pong
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {push.Pong} Pong
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Pong.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push.Pong();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.now = reader.int64();
                    break;
                case 2:
                    message.send = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Pong message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof push.Pong
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {push.Pong} Pong
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Pong.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Pong message.
         * @function verify
         * @memberof push.Pong
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Pong.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.now != null && message.hasOwnProperty("now"))
                if (!$util.isInteger(message.now) && !(message.now && $util.isInteger(message.now.low) && $util.isInteger(message.now.high)))
                    return "now: integer|Long expected";
            if (message.send != null && message.hasOwnProperty("send"))
                if (!$util.isInteger(message.send) && !(message.send && $util.isInteger(message.send.low) && $util.isInteger(message.send.high)))
                    return "send: integer|Long expected";
            return null;
        };

        /**
         * Creates a Pong message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof push.Pong
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {push.Pong} Pong
         */
        Pong.fromObject = function fromObject(object) {
            if (object instanceof $root.push.Pong)
                return object;
            var message = new $root.push.Pong();
            if (object.now != null)
                if ($util.Long)
                    (message.now = $util.Long.fromValue(object.now)).unsigned = false;
                else if (typeof object.now === "string")
                    message.now = parseInt(object.now, 10);
                else if (typeof object.now === "number")
                    message.now = object.now;
                else if (typeof object.now === "object")
                    message.now = new $util.LongBits(object.now.low >>> 0, object.now.high >>> 0).toNumber();
            if (object.send != null)
                if ($util.Long)
                    (message.send = $util.Long.fromValue(object.send)).unsigned = false;
                else if (typeof object.send === "string")
                    message.send = parseInt(object.send, 10);
                else if (typeof object.send === "number")
                    message.send = object.send;
                else if (typeof object.send === "object")
                    message.send = new $util.LongBits(object.send.low >>> 0, object.send.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a Pong message. Also converts values to other types if specified.
         * @function toObject
         * @memberof push.Pong
         * @static
         * @param {push.Pong} message Pong
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Pong.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.now = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.now = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.send = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.send = options.longs === String ? "0" : 0;
            }
            if (message.now != null && message.hasOwnProperty("now"))
                if (typeof message.now === "number")
                    object.now = options.longs === String ? String(message.now) : message.now;
                else
                    object.now = options.longs === String ? $util.Long.prototype.toString.call(message.now) : options.longs === Number ? new $util.LongBits(message.now.low >>> 0, message.now.high >>> 0).toNumber() : message.now;
            if (message.send != null && message.hasOwnProperty("send"))
                if (typeof message.send === "number")
                    object.send = options.longs === String ? String(message.send) : message.send;
                else
                    object.send = options.longs === String ? $util.Long.prototype.toString.call(message.send) : options.longs === Number ? new $util.LongBits(message.send.low >>> 0, message.send.high >>> 0).toNumber() : message.send;
            return object;
        };

        /**
         * Converts this Pong to JSON.
         * @function toJSON
         * @memberof push.Pong
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Pong.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Pong;
    })();

    push.UpdateItemNot = (function() {

        /**
         * Properties of an UpdateItemNot.
         * @memberof push
         * @interface IUpdateItemNot
         */

        /**
         * Constructs a new UpdateItemNot.
         * @memberof push
         * @classdesc Represents an UpdateItemNot.
         * @implements IUpdateItemNot
         * @constructor
         * @param {push.IUpdateItemNot=} [properties] Properties to set
         */
        function UpdateItemNot(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new UpdateItemNot instance using the specified properties.
         * @function create
         * @memberof push.UpdateItemNot
         * @static
         * @param {push.IUpdateItemNot=} [properties] Properties to set
         * @returns {push.UpdateItemNot} UpdateItemNot instance
         */
        UpdateItemNot.create = function create(properties) {
            return new UpdateItemNot(properties);
        };

        /**
         * Encodes the specified UpdateItemNot message. Does not implicitly {@link push.UpdateItemNot.verify|verify} messages.
         * @function encode
         * @memberof push.UpdateItemNot
         * @static
         * @param {push.IUpdateItemNot} message UpdateItemNot message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateItemNot.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified UpdateItemNot message, length delimited. Does not implicitly {@link push.UpdateItemNot.verify|verify} messages.
         * @function encodeDelimited
         * @memberof push.UpdateItemNot
         * @static
         * @param {push.IUpdateItemNot} message UpdateItemNot message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateItemNot.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an UpdateItemNot message from the specified reader or buffer.
         * @function decode
         * @memberof push.UpdateItemNot
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {push.UpdateItemNot} UpdateItemNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateItemNot.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push.UpdateItemNot();
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
         * Decodes an UpdateItemNot message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof push.UpdateItemNot
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {push.UpdateItemNot} UpdateItemNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateItemNot.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an UpdateItemNot message.
         * @function verify
         * @memberof push.UpdateItemNot
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateItemNot.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates an UpdateItemNot message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof push.UpdateItemNot
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {push.UpdateItemNot} UpdateItemNot
         */
        UpdateItemNot.fromObject = function fromObject(object) {
            if (object instanceof $root.push.UpdateItemNot)
                return object;
            return new $root.push.UpdateItemNot();
        };

        /**
         * Creates a plain object from an UpdateItemNot message. Also converts values to other types if specified.
         * @function toObject
         * @memberof push.UpdateItemNot
         * @static
         * @param {push.UpdateItemNot} message UpdateItemNot
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateItemNot.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this UpdateItemNot to JSON.
         * @function toJSON
         * @memberof push.UpdateItemNot
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateItemNot.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateItemNot;
    })();

    push.MsgPushNot = (function() {

        /**
         * Properties of a MsgPushNot.
         * @memberof push
         * @interface IMsgPushNot
         * @property {number|null} [showType] MsgPushNot showType
         * @property {string|null} [openUri] MsgPushNot openUri
         * @property {string|null} [msg] MsgPushNot msg
         */

        /**
         * Constructs a new MsgPushNot.
         * @memberof push
         * @classdesc Represents a MsgPushNot.
         * @implements IMsgPushNot
         * @constructor
         * @param {push.IMsgPushNot=} [properties] Properties to set
         */
        function MsgPushNot(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MsgPushNot showType.
         * @member {number} showType
         * @memberof push.MsgPushNot
         * @instance
         */
        MsgPushNot.prototype.showType = 0;

        /**
         * MsgPushNot openUri.
         * @member {string} openUri
         * @memberof push.MsgPushNot
         * @instance
         */
        MsgPushNot.prototype.openUri = "";

        /**
         * MsgPushNot msg.
         * @member {string} msg
         * @memberof push.MsgPushNot
         * @instance
         */
        MsgPushNot.prototype.msg = "";

        /**
         * Creates a new MsgPushNot instance using the specified properties.
         * @function create
         * @memberof push.MsgPushNot
         * @static
         * @param {push.IMsgPushNot=} [properties] Properties to set
         * @returns {push.MsgPushNot} MsgPushNot instance
         */
        MsgPushNot.create = function create(properties) {
            return new MsgPushNot(properties);
        };

        /**
         * Encodes the specified MsgPushNot message. Does not implicitly {@link push.MsgPushNot.verify|verify} messages.
         * @function encode
         * @memberof push.MsgPushNot
         * @static
         * @param {push.IMsgPushNot} message MsgPushNot message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MsgPushNot.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.showType != null && message.hasOwnProperty("showType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.showType);
            if (message.openUri != null && message.hasOwnProperty("openUri"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.openUri);
            if (message.msg != null && message.hasOwnProperty("msg"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.msg);
            return writer;
        };

        /**
         * Encodes the specified MsgPushNot message, length delimited. Does not implicitly {@link push.MsgPushNot.verify|verify} messages.
         * @function encodeDelimited
         * @memberof push.MsgPushNot
         * @static
         * @param {push.IMsgPushNot} message MsgPushNot message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MsgPushNot.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MsgPushNot message from the specified reader or buffer.
         * @function decode
         * @memberof push.MsgPushNot
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {push.MsgPushNot} MsgPushNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MsgPushNot.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push.MsgPushNot();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.showType = reader.int32();
                    break;
                case 2:
                    message.openUri = reader.string();
                    break;
                case 3:
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
         * Decodes a MsgPushNot message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof push.MsgPushNot
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {push.MsgPushNot} MsgPushNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MsgPushNot.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MsgPushNot message.
         * @function verify
         * @memberof push.MsgPushNot
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MsgPushNot.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.showType != null && message.hasOwnProperty("showType"))
                if (!$util.isInteger(message.showType))
                    return "showType: integer expected";
            if (message.openUri != null && message.hasOwnProperty("openUri"))
                if (!$util.isString(message.openUri))
                    return "openUri: string expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            return null;
        };

        /**
         * Creates a MsgPushNot message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof push.MsgPushNot
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {push.MsgPushNot} MsgPushNot
         */
        MsgPushNot.fromObject = function fromObject(object) {
            if (object instanceof $root.push.MsgPushNot)
                return object;
            var message = new $root.push.MsgPushNot();
            if (object.showType != null)
                message.showType = object.showType | 0;
            if (object.openUri != null)
                message.openUri = String(object.openUri);
            if (object.msg != null)
                message.msg = String(object.msg);
            return message;
        };

        /**
         * Creates a plain object from a MsgPushNot message. Also converts values to other types if specified.
         * @function toObject
         * @memberof push.MsgPushNot
         * @static
         * @param {push.MsgPushNot} message MsgPushNot
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MsgPushNot.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.showType = 0;
                object.openUri = "";
                object.msg = "";
            }
            if (message.showType != null && message.hasOwnProperty("showType"))
                object.showType = message.showType;
            if (message.openUri != null && message.hasOwnProperty("openUri"))
                object.openUri = message.openUri;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            return object;
        };

        /**
         * Converts this MsgPushNot to JSON.
         * @function toJSON
         * @memberof push.MsgPushNot
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MsgPushNot.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return MsgPushNot;
    })();

    push.GsbPing = (function() {

        /**
         * Properties of a GsbPing.
         * @memberof push
         * @interface IGsbPing
         * @property {number|Long|null} [now] GsbPing now
         */

        /**
         * Constructs a new GsbPing.
         * @memberof push
         * @classdesc Represents a GsbPing.
         * @implements IGsbPing
         * @constructor
         * @param {push.IGsbPing=} [properties] Properties to set
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
         * @memberof push.GsbPing
         * @instance
         */
        GsbPing.prototype.now = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new GsbPing instance using the specified properties.
         * @function create
         * @memberof push.GsbPing
         * @static
         * @param {push.IGsbPing=} [properties] Properties to set
         * @returns {push.GsbPing} GsbPing instance
         */
        GsbPing.create = function create(properties) {
            return new GsbPing(properties);
        };

        /**
         * Encodes the specified GsbPing message. Does not implicitly {@link push.GsbPing.verify|verify} messages.
         * @function encode
         * @memberof push.GsbPing
         * @static
         * @param {push.IGsbPing} message GsbPing message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GsbPing.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.now != null && message.hasOwnProperty("now"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.now);
            return writer;
        };

        /**
         * Encodes the specified GsbPing message, length delimited. Does not implicitly {@link push.GsbPing.verify|verify} messages.
         * @function encodeDelimited
         * @memberof push.GsbPing
         * @static
         * @param {push.IGsbPing} message GsbPing message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GsbPing.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GsbPing message from the specified reader or buffer.
         * @function decode
         * @memberof push.GsbPing
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {push.GsbPing} GsbPing
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GsbPing.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push.GsbPing();
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
         * @memberof push.GsbPing
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {push.GsbPing} GsbPing
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
         * @memberof push.GsbPing
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
         * @memberof push.GsbPing
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {push.GsbPing} GsbPing
         */
        GsbPing.fromObject = function fromObject(object) {
            if (object instanceof $root.push.GsbPing)
                return object;
            var message = new $root.push.GsbPing();
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
         * @memberof push.GsbPing
         * @static
         * @param {push.GsbPing} message GsbPing
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
         * @memberof push.GsbPing
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GsbPing.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GsbPing;
    })();

    push.GsbPong = (function() {

        /**
         * Properties of a GsbPong.
         * @memberof push
         * @interface IGsbPong
         * @property {string|null} [err] GsbPong err
         * @property {number|Long|null} [cliNow] GsbPong cliNow
         * @property {number|Long|null} [now] GsbPong now
         */

        /**
         * Constructs a new GsbPong.
         * @memberof push
         * @classdesc Represents a GsbPong.
         * @implements IGsbPong
         * @constructor
         * @param {push.IGsbPong=} [properties] Properties to set
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
         * @memberof push.GsbPong
         * @instance
         */
        GsbPong.prototype.err = "";

        /**
         * GsbPong cliNow.
         * @member {number|Long} cliNow
         * @memberof push.GsbPong
         * @instance
         */
        GsbPong.prototype.cliNow = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * GsbPong now.
         * @member {number|Long} now
         * @memberof push.GsbPong
         * @instance
         */
        GsbPong.prototype.now = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new GsbPong instance using the specified properties.
         * @function create
         * @memberof push.GsbPong
         * @static
         * @param {push.IGsbPong=} [properties] Properties to set
         * @returns {push.GsbPong} GsbPong instance
         */
        GsbPong.create = function create(properties) {
            return new GsbPong(properties);
        };

        /**
         * Encodes the specified GsbPong message. Does not implicitly {@link push.GsbPong.verify|verify} messages.
         * @function encode
         * @memberof push.GsbPong
         * @static
         * @param {push.IGsbPong} message GsbPong message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GsbPong.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.err != null && message.hasOwnProperty("err"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.err);
            if (message.cliNow != null && message.hasOwnProperty("cliNow"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.cliNow);
            if (message.now != null && message.hasOwnProperty("now"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.now);
            return writer;
        };

        /**
         * Encodes the specified GsbPong message, length delimited. Does not implicitly {@link push.GsbPong.verify|verify} messages.
         * @function encodeDelimited
         * @memberof push.GsbPong
         * @static
         * @param {push.IGsbPong} message GsbPong message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GsbPong.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GsbPong message from the specified reader or buffer.
         * @function decode
         * @memberof push.GsbPong
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {push.GsbPong} GsbPong
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GsbPong.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push.GsbPong();
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
         * @memberof push.GsbPong
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {push.GsbPong} GsbPong
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
         * @memberof push.GsbPong
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
         * @memberof push.GsbPong
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {push.GsbPong} GsbPong
         */
        GsbPong.fromObject = function fromObject(object) {
            if (object instanceof $root.push.GsbPong)
                return object;
            var message = new $root.push.GsbPong();
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
         * @memberof push.GsbPong
         * @static
         * @param {push.GsbPong} message GsbPong
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
         * @memberof push.GsbPong
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GsbPong.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GsbPong;
    })();

    push.SystemMessage = (function() {

        /**
         * Properties of a SystemMessage.
         * @memberof push
         * @interface ISystemMessage
         * @property {number|null} [code] SystemMessage code
         * @property {string|null} [err] SystemMessage err
         * @property {string|null} [request] SystemMessage request
         */

        /**
         * Constructs a new SystemMessage.
         * @memberof push
         * @classdesc Represents a SystemMessage.
         * @implements ISystemMessage
         * @constructor
         * @param {push.ISystemMessage=} [properties] Properties to set
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
         * @memberof push.SystemMessage
         * @instance
         */
        SystemMessage.prototype.code = 0;

        /**
         * SystemMessage err.
         * @member {string} err
         * @memberof push.SystemMessage
         * @instance
         */
        SystemMessage.prototype.err = "";

        /**
         * SystemMessage request.
         * @member {string} request
         * @memberof push.SystemMessage
         * @instance
         */
        SystemMessage.prototype.request = "";

        /**
         * Creates a new SystemMessage instance using the specified properties.
         * @function create
         * @memberof push.SystemMessage
         * @static
         * @param {push.ISystemMessage=} [properties] Properties to set
         * @returns {push.SystemMessage} SystemMessage instance
         */
        SystemMessage.create = function create(properties) {
            return new SystemMessage(properties);
        };

        /**
         * Encodes the specified SystemMessage message. Does not implicitly {@link push.SystemMessage.verify|verify} messages.
         * @function encode
         * @memberof push.SystemMessage
         * @static
         * @param {push.ISystemMessage} message SystemMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && message.hasOwnProperty("code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.err != null && message.hasOwnProperty("err"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.err);
            if (message.request != null && message.hasOwnProperty("request"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.request);
            return writer;
        };

        /**
         * Encodes the specified SystemMessage message, length delimited. Does not implicitly {@link push.SystemMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof push.SystemMessage
         * @static
         * @param {push.ISystemMessage} message SystemMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SystemMessage message from the specified reader or buffer.
         * @function decode
         * @memberof push.SystemMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {push.SystemMessage} SystemMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SystemMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.push.SystemMessage();
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
         * @memberof push.SystemMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {push.SystemMessage} SystemMessage
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
         * @memberof push.SystemMessage
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
         * @memberof push.SystemMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {push.SystemMessage} SystemMessage
         */
        SystemMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.push.SystemMessage)
                return object;
            var message = new $root.push.SystemMessage();
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
         * @memberof push.SystemMessage
         * @static
         * @param {push.SystemMessage} message SystemMessage
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
         * @memberof push.SystemMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SystemMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SystemMessage;
    })();

    return push;
})();

module.exports = $root.push;
