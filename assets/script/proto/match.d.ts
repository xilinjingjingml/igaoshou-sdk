import * as $protobuf from "protobufjs";
/** Namespace match. */
export namespace match {

    /** Properties of a RoomInfo. */
    interface IRoomInfo {

        /** RoomInfo roomId */
        roomId?: (string|null);

        /** RoomInfo serverId */
        serverId?: (string|null);

        /** RoomInfo gameGid */
        gameGid?: (string|null);

        /** RoomInfo metadata */
        metadata?: (string|null);
    }

    /** Represents a RoomInfo. */
    class RoomInfo implements IRoomInfo {

        /**
         * Constructs a new RoomInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: match.IRoomInfo);

        /** RoomInfo roomId. */
        public roomId: string;

        /** RoomInfo serverId. */
        public serverId: string;

        /** RoomInfo gameGid. */
        public gameGid: string;

        /** RoomInfo metadata. */
        public metadata: string;

        /**
         * Creates a new RoomInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomInfo instance
         */
        public static create(properties?: match.IRoomInfo): match.RoomInfo;

        /**
         * Encodes the specified RoomInfo message. Does not implicitly {@link match.RoomInfo.verify|verify} messages.
         * @param message RoomInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: match.IRoomInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomInfo message, length delimited. Does not implicitly {@link match.RoomInfo.verify|verify} messages.
         * @param message RoomInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: match.IRoomInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): match.RoomInfo;

        /**
         * Decodes a RoomInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): match.RoomInfo;

        /**
         * Verifies a RoomInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomInfo
         */
        public static fromObject(object: { [k: string]: any }): match.RoomInfo;

        /**
         * Creates a plain object from a RoomInfo message. Also converts values to other types if specified.
         * @param message RoomInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: match.RoomInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a JoinMatchNot. */
    interface IJoinMatchNot {

        /** JoinMatchNot matchCid */
        matchCid?: (string|null);

        /** JoinMatchNot matchId */
        matchId?: (string|null);

        /** JoinMatchNot roundId */
        roundId?: (string|null);

        /** JoinMatchNot randSeed */
        randSeed?: (number|Long|null);

        /** JoinMatchNot opponentUid */
        opponentUid?: (string|null);

        /** JoinMatchNot roomInfo */
        roomInfo?: (match.IRoomInfo|null);
    }

    /** Represents a JoinMatchNot. */
    class JoinMatchNot implements IJoinMatchNot {

        /**
         * Constructs a new JoinMatchNot.
         * @param [properties] Properties to set
         */
        constructor(properties?: match.IJoinMatchNot);

        /** JoinMatchNot matchCid. */
        public matchCid: string;

        /** JoinMatchNot matchId. */
        public matchId: string;

        /** JoinMatchNot roundId. */
        public roundId: string;

        /** JoinMatchNot randSeed. */
        public randSeed: (number|Long);

        /** JoinMatchNot opponentUid. */
        public opponentUid: string;

        /** JoinMatchNot roomInfo. */
        public roomInfo?: (match.IRoomInfo|null);

        /**
         * Creates a new JoinMatchNot instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JoinMatchNot instance
         */
        public static create(properties?: match.IJoinMatchNot): match.JoinMatchNot;

        /**
         * Encodes the specified JoinMatchNot message. Does not implicitly {@link match.JoinMatchNot.verify|verify} messages.
         * @param message JoinMatchNot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: match.IJoinMatchNot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified JoinMatchNot message, length delimited. Does not implicitly {@link match.JoinMatchNot.verify|verify} messages.
         * @param message JoinMatchNot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: match.IJoinMatchNot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a JoinMatchNot message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JoinMatchNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): match.JoinMatchNot;

        /**
         * Decodes a JoinMatchNot message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns JoinMatchNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): match.JoinMatchNot;

        /**
         * Verifies a JoinMatchNot message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a JoinMatchNot message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns JoinMatchNot
         */
        public static fromObject(object: { [k: string]: any }): match.JoinMatchNot;

        /**
         * Creates a plain object from a JoinMatchNot message. Also converts values to other types if specified.
         * @param message JoinMatchNot
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: match.JoinMatchNot, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this JoinMatchNot to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MatchCandidatesNot. */
    interface IMatchCandidatesNot {

        /** MatchCandidatesNot matchCid */
        matchCid?: (string|null);

        /** MatchCandidatesNot uidList */
        uidList?: (string[]|null);
    }

    /** Represents a MatchCandidatesNot. */
    class MatchCandidatesNot implements IMatchCandidatesNot {

        /**
         * Constructs a new MatchCandidatesNot.
         * @param [properties] Properties to set
         */
        constructor(properties?: match.IMatchCandidatesNot);

        /** MatchCandidatesNot matchCid. */
        public matchCid: string;

        /** MatchCandidatesNot uidList. */
        public uidList: string[];

        /**
         * Creates a new MatchCandidatesNot instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MatchCandidatesNot instance
         */
        public static create(properties?: match.IMatchCandidatesNot): match.MatchCandidatesNot;

        /**
         * Encodes the specified MatchCandidatesNot message. Does not implicitly {@link match.MatchCandidatesNot.verify|verify} messages.
         * @param message MatchCandidatesNot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: match.IMatchCandidatesNot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MatchCandidatesNot message, length delimited. Does not implicitly {@link match.MatchCandidatesNot.verify|verify} messages.
         * @param message MatchCandidatesNot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: match.IMatchCandidatesNot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MatchCandidatesNot message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MatchCandidatesNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): match.MatchCandidatesNot;

        /**
         * Decodes a MatchCandidatesNot message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MatchCandidatesNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): match.MatchCandidatesNot;

        /**
         * Verifies a MatchCandidatesNot message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MatchCandidatesNot message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MatchCandidatesNot
         */
        public static fromObject(object: { [k: string]: any }): match.MatchCandidatesNot;

        /**
         * Creates a plain object from a MatchCandidatesNot message. Also converts values to other types if specified.
         * @param message MatchCandidatesNot
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: match.MatchCandidatesNot, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MatchCandidatesNot to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
