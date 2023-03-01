/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = protobuf;

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.match = (function() {

    /**
     * Namespace match.
     * @exports match
     * @namespace
     */
    var match = {};

    match.RoomInfo = (function() {

        /**
         * Properties of a RoomInfo.
         * @memberof match
         * @interface IRoomInfo
         * @property {string|null} [roomId] RoomInfo roomId
         * @property {string|null} [serverId] RoomInfo serverId
         * @property {string|null} [gameGid] RoomInfo gameGid
         * @property {string|null} [metadata] RoomInfo metadata
         */

        /**
         * Constructs a new RoomInfo.
         * @memberof match
         * @classdesc Represents a RoomInfo.
         * @implements IRoomInfo
         * @constructor
         * @param {match.IRoomInfo=} [properties] Properties to set
         */
        function RoomInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomInfo roomId.
         * @member {string} roomId
         * @memberof match.RoomInfo
         * @instance
         */
        RoomInfo.prototype.roomId = "";

        /**
         * RoomInfo serverId.
         * @member {string} serverId
         * @memberof match.RoomInfo
         * @instance
         */
        RoomInfo.prototype.serverId = "";

        /**
         * RoomInfo gameGid.
         * @member {string} gameGid
         * @memberof match.RoomInfo
         * @instance
         */
        RoomInfo.prototype.gameGid = "";

        /**
         * RoomInfo metadata.
         * @member {string} metadata
         * @memberof match.RoomInfo
         * @instance
         */
        RoomInfo.prototype.metadata = "";

        /**
         * Creates a new RoomInfo instance using the specified properties.
         * @function create
         * @memberof match.RoomInfo
         * @static
         * @param {match.IRoomInfo=} [properties] Properties to set
         * @returns {match.RoomInfo} RoomInfo instance
         */
        RoomInfo.create = function create(properties) {
            return new RoomInfo(properties);
        };

        /**
         * Encodes the specified RoomInfo message. Does not implicitly {@link match.RoomInfo.verify|verify} messages.
         * @function encode
         * @memberof match.RoomInfo
         * @static
         * @param {match.IRoomInfo} message RoomInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomId);
            if (message.serverId != null && message.hasOwnProperty("serverId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.serverId);
            if (message.gameGid != null && message.hasOwnProperty("gameGid"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.gameGid);
            if (message.metadata != null && message.hasOwnProperty("metadata"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.metadata);
            return writer;
        };

        /**
         * Encodes the specified RoomInfo message, length delimited. Does not implicitly {@link match.RoomInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof match.RoomInfo
         * @static
         * @param {match.IRoomInfo} message RoomInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomInfo message from the specified reader or buffer.
         * @function decode
         * @memberof match.RoomInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {match.RoomInfo} RoomInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.match.RoomInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomId = reader.string();
                    break;
                case 2:
                    message.serverId = reader.string();
                    break;
                case 3:
                    message.gameGid = reader.string();
                    break;
                case 4:
                    message.metadata = reader.string();
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
         * @memberof match.RoomInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {match.RoomInfo} RoomInfo
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
         * @memberof match.RoomInfo
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
            if (message.serverId != null && message.hasOwnProperty("serverId"))
                if (!$util.isString(message.serverId))
                    return "serverId: string expected";
            if (message.gameGid != null && message.hasOwnProperty("gameGid"))
                if (!$util.isString(message.gameGid))
                    return "gameGid: string expected";
            if (message.metadata != null && message.hasOwnProperty("metadata"))
                if (!$util.isString(message.metadata))
                    return "metadata: string expected";
            return null;
        };

        /**
         * Creates a RoomInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof match.RoomInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {match.RoomInfo} RoomInfo
         */
        RoomInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.match.RoomInfo)
                return object;
            var message = new $root.match.RoomInfo();
            if (object.roomId != null)
                message.roomId = String(object.roomId);
            if (object.serverId != null)
                message.serverId = String(object.serverId);
            if (object.gameGid != null)
                message.gameGid = String(object.gameGid);
            if (object.metadata != null)
                message.metadata = String(object.metadata);
            return message;
        };

        /**
         * Creates a plain object from a RoomInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof match.RoomInfo
         * @static
         * @param {match.RoomInfo} message RoomInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.roomId = "";
                object.serverId = "";
                object.gameGid = "";
                object.metadata = "";
            }
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                object.roomId = message.roomId;
            if (message.serverId != null && message.hasOwnProperty("serverId"))
                object.serverId = message.serverId;
            if (message.gameGid != null && message.hasOwnProperty("gameGid"))
                object.gameGid = message.gameGid;
            if (message.metadata != null && message.hasOwnProperty("metadata"))
                object.metadata = message.metadata;
            return object;
        };

        /**
         * Converts this RoomInfo to JSON.
         * @function toJSON
         * @memberof match.RoomInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomInfo;
    })();

    match.JoinMatchNot = (function() {

        /**
         * Properties of a JoinMatchNot.
         * @memberof match
         * @interface IJoinMatchNot
         * @property {string|null} [matchCid] JoinMatchNot matchCid
         * @property {string|null} [matchId] JoinMatchNot matchId
         * @property {string|null} [roundId] JoinMatchNot roundId
         * @property {number|Long|null} [randSeed] JoinMatchNot randSeed
         * @property {string|null} [opponentUid] JoinMatchNot opponentUid
         * @property {match.IRoomInfo|null} [roomInfo] JoinMatchNot roomInfo
         */

        /**
         * Constructs a new JoinMatchNot.
         * @memberof match
         * @classdesc Represents a JoinMatchNot.
         * @implements IJoinMatchNot
         * @constructor
         * @param {match.IJoinMatchNot=} [properties] Properties to set
         */
        function JoinMatchNot(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * JoinMatchNot matchCid.
         * @member {string} matchCid
         * @memberof match.JoinMatchNot
         * @instance
         */
        JoinMatchNot.prototype.matchCid = "";

        /**
         * JoinMatchNot matchId.
         * @member {string} matchId
         * @memberof match.JoinMatchNot
         * @instance
         */
        JoinMatchNot.prototype.matchId = "";

        /**
         * JoinMatchNot roundId.
         * @member {string} roundId
         * @memberof match.JoinMatchNot
         * @instance
         */
        JoinMatchNot.prototype.roundId = "";

        /**
         * JoinMatchNot randSeed.
         * @member {number|Long} randSeed
         * @memberof match.JoinMatchNot
         * @instance
         */
        JoinMatchNot.prototype.randSeed = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * JoinMatchNot opponentUid.
         * @member {string} opponentUid
         * @memberof match.JoinMatchNot
         * @instance
         */
        JoinMatchNot.prototype.opponentUid = "";

        /**
         * JoinMatchNot roomInfo.
         * @member {match.IRoomInfo|null|undefined} roomInfo
         * @memberof match.JoinMatchNot
         * @instance
         */
        JoinMatchNot.prototype.roomInfo = null;

        /**
         * Creates a new JoinMatchNot instance using the specified properties.
         * @function create
         * @memberof match.JoinMatchNot
         * @static
         * @param {match.IJoinMatchNot=} [properties] Properties to set
         * @returns {match.JoinMatchNot} JoinMatchNot instance
         */
        JoinMatchNot.create = function create(properties) {
            return new JoinMatchNot(properties);
        };

        /**
         * Encodes the specified JoinMatchNot message. Does not implicitly {@link match.JoinMatchNot.verify|verify} messages.
         * @function encode
         * @memberof match.JoinMatchNot
         * @static
         * @param {match.IJoinMatchNot} message JoinMatchNot message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JoinMatchNot.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.matchCid != null && message.hasOwnProperty("matchCid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.matchCid);
            if (message.matchId != null && message.hasOwnProperty("matchId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.matchId);
            if (message.roundId != null && message.hasOwnProperty("roundId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.roundId);
            if (message.randSeed != null && message.hasOwnProperty("randSeed"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.randSeed);
            if (message.opponentUid != null && message.hasOwnProperty("opponentUid"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.opponentUid);
            if (message.roomInfo != null && message.hasOwnProperty("roomInfo"))
                $root.match.RoomInfo.encode(message.roomInfo, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified JoinMatchNot message, length delimited. Does not implicitly {@link match.JoinMatchNot.verify|verify} messages.
         * @function encodeDelimited
         * @memberof match.JoinMatchNot
         * @static
         * @param {match.IJoinMatchNot} message JoinMatchNot message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JoinMatchNot.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a JoinMatchNot message from the specified reader or buffer.
         * @function decode
         * @memberof match.JoinMatchNot
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {match.JoinMatchNot} JoinMatchNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JoinMatchNot.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.match.JoinMatchNot();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.matchCid = reader.string();
                    break;
                case 2:
                    message.matchId = reader.string();
                    break;
                case 3:
                    message.roundId = reader.string();
                    break;
                case 4:
                    message.randSeed = reader.int64();
                    break;
                case 5:
                    message.opponentUid = reader.string();
                    break;
                case 6:
                    message.roomInfo = $root.match.RoomInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a JoinMatchNot message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof match.JoinMatchNot
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {match.JoinMatchNot} JoinMatchNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JoinMatchNot.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a JoinMatchNot message.
         * @function verify
         * @memberof match.JoinMatchNot
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        JoinMatchNot.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.matchCid != null && message.hasOwnProperty("matchCid"))
                if (!$util.isString(message.matchCid))
                    return "matchCid: string expected";
            if (message.matchId != null && message.hasOwnProperty("matchId"))
                if (!$util.isString(message.matchId))
                    return "matchId: string expected";
            if (message.roundId != null && message.hasOwnProperty("roundId"))
                if (!$util.isString(message.roundId))
                    return "roundId: string expected";
            if (message.randSeed != null && message.hasOwnProperty("randSeed"))
                if (!$util.isInteger(message.randSeed) && !(message.randSeed && $util.isInteger(message.randSeed.low) && $util.isInteger(message.randSeed.high)))
                    return "randSeed: integer|Long expected";
            if (message.opponentUid != null && message.hasOwnProperty("opponentUid"))
                if (!$util.isString(message.opponentUid))
                    return "opponentUid: string expected";
            if (message.roomInfo != null && message.hasOwnProperty("roomInfo")) {
                var error = $root.match.RoomInfo.verify(message.roomInfo);
                if (error)
                    return "roomInfo." + error;
            }
            return null;
        };

        /**
         * Creates a JoinMatchNot message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof match.JoinMatchNot
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {match.JoinMatchNot} JoinMatchNot
         */
        JoinMatchNot.fromObject = function fromObject(object) {
            if (object instanceof $root.match.JoinMatchNot)
                return object;
            var message = new $root.match.JoinMatchNot();
            if (object.matchCid != null)
                message.matchCid = String(object.matchCid);
            if (object.matchId != null)
                message.matchId = String(object.matchId);
            if (object.roundId != null)
                message.roundId = String(object.roundId);
            if (object.randSeed != null)
                if ($util.Long)
                    (message.randSeed = $util.Long.fromValue(object.randSeed)).unsigned = false;
                else if (typeof object.randSeed === "string")
                    message.randSeed = parseInt(object.randSeed, 10);
                else if (typeof object.randSeed === "number")
                    message.randSeed = object.randSeed;
                else if (typeof object.randSeed === "object")
                    message.randSeed = new $util.LongBits(object.randSeed.low >>> 0, object.randSeed.high >>> 0).toNumber();
            if (object.opponentUid != null)
                message.opponentUid = String(object.opponentUid);
            if (object.roomInfo != null) {
                if (typeof object.roomInfo !== "object")
                    throw TypeError(".match.JoinMatchNot.roomInfo: object expected");
                message.roomInfo = $root.match.RoomInfo.fromObject(object.roomInfo);
            }
            return message;
        };

        /**
         * Creates a plain object from a JoinMatchNot message. Also converts values to other types if specified.
         * @function toObject
         * @memberof match.JoinMatchNot
         * @static
         * @param {match.JoinMatchNot} message JoinMatchNot
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        JoinMatchNot.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.matchCid = "";
                object.matchId = "";
                object.roundId = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.randSeed = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.randSeed = options.longs === String ? "0" : 0;
                object.opponentUid = "";
                object.roomInfo = null;
            }
            if (message.matchCid != null && message.hasOwnProperty("matchCid"))
                object.matchCid = message.matchCid;
            if (message.matchId != null && message.hasOwnProperty("matchId"))
                object.matchId = message.matchId;
            if (message.roundId != null && message.hasOwnProperty("roundId"))
                object.roundId = message.roundId;
            if (message.randSeed != null && message.hasOwnProperty("randSeed"))
                if (typeof message.randSeed === "number")
                    object.randSeed = options.longs === String ? String(message.randSeed) : message.randSeed;
                else
                    object.randSeed = options.longs === String ? $util.Long.prototype.toString.call(message.randSeed) : options.longs === Number ? new $util.LongBits(message.randSeed.low >>> 0, message.randSeed.high >>> 0).toNumber() : message.randSeed;
            if (message.opponentUid != null && message.hasOwnProperty("opponentUid"))
                object.opponentUid = message.opponentUid;
            if (message.roomInfo != null && message.hasOwnProperty("roomInfo"))
                object.roomInfo = $root.match.RoomInfo.toObject(message.roomInfo, options);
            return object;
        };

        /**
         * Converts this JoinMatchNot to JSON.
         * @function toJSON
         * @memberof match.JoinMatchNot
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        JoinMatchNot.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return JoinMatchNot;
    })();

    match.MatchCandidatesNot = (function() {

        /**
         * Properties of a MatchCandidatesNot.
         * @memberof match
         * @interface IMatchCandidatesNot
         * @property {string|null} [matchCid] MatchCandidatesNot matchCid
         * @property {Array.<string>|null} [uidList] MatchCandidatesNot uidList
         */

        /**
         * Constructs a new MatchCandidatesNot.
         * @memberof match
         * @classdesc Represents a MatchCandidatesNot.
         * @implements IMatchCandidatesNot
         * @constructor
         * @param {match.IMatchCandidatesNot=} [properties] Properties to set
         */
        function MatchCandidatesNot(properties) {
            this.uidList = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MatchCandidatesNot matchCid.
         * @member {string} matchCid
         * @memberof match.MatchCandidatesNot
         * @instance
         */
        MatchCandidatesNot.prototype.matchCid = "";

        /**
         * MatchCandidatesNot uidList.
         * @member {Array.<string>} uidList
         * @memberof match.MatchCandidatesNot
         * @instance
         */
        MatchCandidatesNot.prototype.uidList = $util.emptyArray;

        /**
         * Creates a new MatchCandidatesNot instance using the specified properties.
         * @function create
         * @memberof match.MatchCandidatesNot
         * @static
         * @param {match.IMatchCandidatesNot=} [properties] Properties to set
         * @returns {match.MatchCandidatesNot} MatchCandidatesNot instance
         */
        MatchCandidatesNot.create = function create(properties) {
            return new MatchCandidatesNot(properties);
        };

        /**
         * Encodes the specified MatchCandidatesNot message. Does not implicitly {@link match.MatchCandidatesNot.verify|verify} messages.
         * @function encode
         * @memberof match.MatchCandidatesNot
         * @static
         * @param {match.IMatchCandidatesNot} message MatchCandidatesNot message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MatchCandidatesNot.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.matchCid != null && message.hasOwnProperty("matchCid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.matchCid);
            if (message.uidList != null && message.uidList.length)
                for (var i = 0; i < message.uidList.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.uidList[i]);
            return writer;
        };

        /**
         * Encodes the specified MatchCandidatesNot message, length delimited. Does not implicitly {@link match.MatchCandidatesNot.verify|verify} messages.
         * @function encodeDelimited
         * @memberof match.MatchCandidatesNot
         * @static
         * @param {match.IMatchCandidatesNot} message MatchCandidatesNot message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MatchCandidatesNot.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MatchCandidatesNot message from the specified reader or buffer.
         * @function decode
         * @memberof match.MatchCandidatesNot
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {match.MatchCandidatesNot} MatchCandidatesNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MatchCandidatesNot.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.match.MatchCandidatesNot();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.matchCid = reader.string();
                    break;
                case 2:
                    if (!(message.uidList && message.uidList.length))
                        message.uidList = [];
                    message.uidList.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MatchCandidatesNot message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof match.MatchCandidatesNot
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {match.MatchCandidatesNot} MatchCandidatesNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MatchCandidatesNot.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MatchCandidatesNot message.
         * @function verify
         * @memberof match.MatchCandidatesNot
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MatchCandidatesNot.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.matchCid != null && message.hasOwnProperty("matchCid"))
                if (!$util.isString(message.matchCid))
                    return "matchCid: string expected";
            if (message.uidList != null && message.hasOwnProperty("uidList")) {
                if (!Array.isArray(message.uidList))
                    return "uidList: array expected";
                for (var i = 0; i < message.uidList.length; ++i)
                    if (!$util.isString(message.uidList[i]))
                        return "uidList: string[] expected";
            }
            return null;
        };

        /**
         * Creates a MatchCandidatesNot message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof match.MatchCandidatesNot
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {match.MatchCandidatesNot} MatchCandidatesNot
         */
        MatchCandidatesNot.fromObject = function fromObject(object) {
            if (object instanceof $root.match.MatchCandidatesNot)
                return object;
            var message = new $root.match.MatchCandidatesNot();
            if (object.matchCid != null)
                message.matchCid = String(object.matchCid);
            if (object.uidList) {
                if (!Array.isArray(object.uidList))
                    throw TypeError(".match.MatchCandidatesNot.uidList: array expected");
                message.uidList = [];
                for (var i = 0; i < object.uidList.length; ++i)
                    message.uidList[i] = String(object.uidList[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a MatchCandidatesNot message. Also converts values to other types if specified.
         * @function toObject
         * @memberof match.MatchCandidatesNot
         * @static
         * @param {match.MatchCandidatesNot} message MatchCandidatesNot
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MatchCandidatesNot.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.uidList = [];
            if (options.defaults)
                object.matchCid = "";
            if (message.matchCid != null && message.hasOwnProperty("matchCid"))
                object.matchCid = message.matchCid;
            if (message.uidList && message.uidList.length) {
                object.uidList = [];
                for (var j = 0; j < message.uidList.length; ++j)
                    object.uidList[j] = message.uidList[j];
            }
            return object;
        };

        /**
         * Converts this MatchCandidatesNot to JSON.
         * @function toJSON
         * @memberof match.MatchCandidatesNot
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MatchCandidatesNot.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return MatchCandidatesNot;
    })();

    return match;
})();

module.exports = $root.match;
