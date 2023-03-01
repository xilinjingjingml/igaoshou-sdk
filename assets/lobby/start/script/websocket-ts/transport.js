/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

// var $protobuf = require("protobufjs/minimal");
var $protobuf = protobuf
// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.transport = (function() {

    /**
     * Namespace transport.
     * @exports transport
     * @namespace
     */
    var transport = {};

    transport.Message = (function() {

        /**
         * Properties of a Message.
         * @memberof transport
         * @interface IMessage
         * @property {Object.<string,string>|null} [header] Message header
         * @property {Uint8Array|null} [body] Message body
         */

        /**
         * Constructs a new Message.
         * @memberof transport
         * @classdesc Represents a Message.
         * @implements IMessage
         * @constructor
         * @param {transport.IMessage=} [properties] Properties to set
         */
        function Message(properties) {
            this.header = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Message header.
         * @member {Object.<string,string>} header
         * @memberof transport.Message
         * @instance
         */
        Message.prototype.header = $util.emptyObject;

        /**
         * Message body.
         * @member {Uint8Array} body
         * @memberof transport.Message
         * @instance
         */
        Message.prototype.body = $util.newBuffer([]);

        /**
         * Creates a new Message instance using the specified properties.
         * @function create
         * @memberof transport.Message
         * @static
         * @param {transport.IMessage=} [properties] Properties to set
         * @returns {transport.Message} Message instance
         */
        Message.create = function create(properties) {
            return new Message(properties);
        };

        /**
         * Encodes the specified Message message. Does not implicitly {@link transport.Message.verify|verify} messages.
         * @function encode
         * @memberof transport.Message
         * @static
         * @param {transport.IMessage} message Message message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.header != null && Object.hasOwnProperty.call(message, "header"))
                for (var keys = Object.keys(message.header), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.header[keys[i]]).ldelim();
            if (message.body != null && Object.hasOwnProperty.call(message, "body"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.body);
            return writer;
        };

        /**
         * Encodes the specified Message message, length delimited. Does not implicitly {@link transport.Message.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transport.Message
         * @static
         * @param {transport.IMessage} message Message message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Message.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Message message from the specified reader or buffer.
         * @function decode
         * @memberof transport.Message
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transport.Message} Message
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.transport.Message(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (message.header === $util.emptyObject)
                        message.header = {};
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
                    message.header[key] = value;
                    break;
                case 2:
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
         * Decodes a Message message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transport.Message
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transport.Message} Message
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Message.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Message message.
         * @function verify
         * @memberof transport.Message
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Message.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.header != null && message.hasOwnProperty("header")) {
                if (!$util.isObject(message.header))
                    return "header: object expected";
                var key = Object.keys(message.header);
                for (var i = 0; i < key.length; ++i)
                    if (!$util.isString(message.header[key[i]]))
                        return "header: string{k:string} expected";
            }
            if (message.body != null && message.hasOwnProperty("body"))
                if (!(message.body && typeof message.body.length === "number" || $util.isString(message.body)))
                    return "body: buffer expected";
            return null;
        };

        /**
         * Creates a Message message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transport.Message
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transport.Message} Message
         */
        Message.fromObject = function fromObject(object) {
            if (object instanceof $root.transport.Message)
                return object;
            var message = new $root.transport.Message();
            if (object.header) {
                if (typeof object.header !== "object")
                    throw TypeError(".transport.Message.header: object expected");
                message.header = {};
                for (var keys = Object.keys(object.header), i = 0; i < keys.length; ++i)
                    message.header[keys[i]] = String(object.header[keys[i]]);
            }
            if (object.body != null)
                if (typeof object.body === "string")
                    $util.base64.decode(object.body, message.body = $util.newBuffer($util.base64.length(object.body)), 0);
                else if (object.body.length)
                    message.body = object.body;
            return message;
        };

        /**
         * Creates a plain object from a Message message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transport.Message
         * @static
         * @param {transport.Message} message Message
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Message.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.objects || options.defaults)
                object.header = {};
            if (options.defaults)
                if (options.bytes === String)
                    object.body = "";
                else {
                    object.body = [];
                    if (options.bytes !== Array)
                        object.body = $util.newBuffer(object.body);
                }
            var keys2;
            if (message.header && (keys2 = Object.keys(message.header)).length) {
                object.header = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.header[keys2[j]] = message.header[keys2[j]];
            }
            if (message.body != null && message.hasOwnProperty("body"))
                object.body = options.bytes === String ? $util.base64.encode(message.body, 0, message.body.length) : options.bytes === Array ? Array.prototype.slice.call(message.body) : message.body;
            return object;
        };

        /**
         * Converts this Message to JSON.
         * @function toJSON
         * @memberof transport.Message
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Message.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Message;
    })();

    return transport;
})();

module.exports = $root;
