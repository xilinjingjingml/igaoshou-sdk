import * as $protobuf from "protobufjs";
/** Namespace gsbase. */
export namespace gsbase {

    /** Version enum. */
    enum Version {
        major = 0,
        minor = 1
    }

    /** Represents a GsBase */
    class GsBase extends $protobuf.rpc.Service {

        /**
         * Constructs a new GsBase service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new GsBase service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): GsBase;

        /**
         * Calls JoinRoom.
         * @param request JoinRoomReq message or plain object
         * @param callback Node-style callback called with the error, if any, and Empty
         */
        public joinRoom(request: gsbase.IJoinRoomReq, callback: gsbase.GsBase.JoinRoomCallback): void;

        /**
         * Calls JoinRoom.
         * @param request JoinRoomReq message or plain object
         * @returns Promise
         */
        public joinRoom(request: gsbase.IJoinRoomReq): Promise<gsbase.Empty>;

        /**
         * Calls LeaveRoom.
         * @param request LeaveRoomReq message or plain object
         * @param callback Node-style callback called with the error, if any, and Empty
         */
        public leaveRoom(request: gsbase.ILeaveRoomReq, callback: gsbase.GsBase.LeaveRoomCallback): void;

        /**
         * Calls LeaveRoom.
         * @param request LeaveRoomReq message or plain object
         * @returns Promise
         */
        public leaveRoom(request: gsbase.ILeaveRoomReq): Promise<gsbase.Empty>;

        /**
         * Calls Ping.
         * @param request GsbPing message or plain object
         * @param callback Node-style callback called with the error, if any, and Empty
         */
        public ping(request: gsbase.IGsbPing, callback: gsbase.GsBase.PingCallback): void;

        /**
         * Calls Ping.
         * @param request GsbPing message or plain object
         * @returns Promise
         */
        public ping(request: gsbase.IGsbPing): Promise<gsbase.Empty>;

        /**
         * Calls Chat.
         * @param request ChatReq message or plain object
         * @param callback Node-style callback called with the error, if any, and Empty
         */
        public chat(request: gsbase.IChatReq, callback: gsbase.GsBase.ChatCallback): void;

        /**
         * Calls Chat.
         * @param request ChatReq message or plain object
         * @returns Promise
         */
        public chat(request: gsbase.IChatReq): Promise<gsbase.Empty>;
    }

    namespace GsBase {

        /**
         * Callback as used by {@link gsbase.GsBase#joinRoom}.
         * @param error Error, if any
         * @param [response] Empty
         */
        type JoinRoomCallback = (error: (Error|null), response?: gsbase.Empty) => void;

        /**
         * Callback as used by {@link gsbase.GsBase#leaveRoom}.
         * @param error Error, if any
         * @param [response] Empty
         */
        type LeaveRoomCallback = (error: (Error|null), response?: gsbase.Empty) => void;

        /**
         * Callback as used by {@link gsbase.GsBase#ping}.
         * @param error Error, if any
         * @param [response] Empty
         */
        type PingCallback = (error: (Error|null), response?: gsbase.Empty) => void;

        /**
         * Callback as used by {@link gsbase.GsBase#chat}.
         * @param error Error, if any
         * @param [response] Empty
         */
        type ChatCallback = (error: (Error|null), response?: gsbase.Empty) => void;
    }

    /** Represents a GsRpc */
    class GsRpc extends $protobuf.rpc.Service {

        /**
         * Constructs a new GsRpc service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new GsRpc service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): GsRpc;

        /**
         * Calls CreateRoom.
         * @param request CreateRoomReq message or plain object
         * @param callback Node-style callback called with the error, if any, and CreateRoomRsp
         */
        public createRoom(request: gsbase.ICreateRoomReq, callback: gsbase.GsRpc.CreateRoomCallback): void;

        /**
         * Calls CreateRoom.
         * @param request CreateRoomReq message or plain object
         * @returns Promise
         */
        public createRoom(request: gsbase.ICreateRoomReq): Promise<gsbase.CreateRoomRsp>;

        /**
         * Calls DismissRoom.
         * @param request DismissRoomReq message or plain object
         * @param callback Node-style callback called with the error, if any, and DismissRoomRsp
         */
        public dismissRoom(request: gsbase.IDismissRoomReq, callback: gsbase.GsRpc.DismissRoomCallback): void;

        /**
         * Calls DismissRoom.
         * @param request DismissRoomReq message or plain object
         * @returns Promise
         */
        public dismissRoom(request: gsbase.IDismissRoomReq): Promise<gsbase.DismissRoomRsp>;

        /**
         * Calls CheckRoomStatus.
         * @param request CheckRoomStatusReq message or plain object
         * @param callback Node-style callback called with the error, if any, and CheckRoomStatusRsp
         */
        public checkRoomStatus(request: gsbase.ICheckRoomStatusReq, callback: gsbase.GsRpc.CheckRoomStatusCallback): void;

        /**
         * Calls CheckRoomStatus.
         * @param request CheckRoomStatusReq message or plain object
         * @returns Promise
         */
        public checkRoomStatus(request: gsbase.ICheckRoomStatusReq): Promise<gsbase.CheckRoomStatusRsp>;
    }

    namespace GsRpc {

        /**
         * Callback as used by {@link gsbase.GsRpc#createRoom}.
         * @param error Error, if any
         * @param [response] CreateRoomRsp
         */
        type CreateRoomCallback = (error: (Error|null), response?: gsbase.CreateRoomRsp) => void;

        /**
         * Callback as used by {@link gsbase.GsRpc#dismissRoom}.
         * @param error Error, if any
         * @param [response] DismissRoomRsp
         */
        type DismissRoomCallback = (error: (Error|null), response?: gsbase.DismissRoomRsp) => void;

        /**
         * Callback as used by {@link gsbase.GsRpc#checkRoomStatus}.
         * @param error Error, if any
         * @param [response] CheckRoomStatusRsp
         */
        type CheckRoomStatusCallback = (error: (Error|null), response?: gsbase.CheckRoomStatusRsp) => void;
    }

    /** Properties of an Empty. */
    interface IEmpty {
    }

    /** Represents an Empty. */
    class Empty implements IEmpty {

        /**
         * Constructs a new Empty.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IEmpty);

        /**
         * Creates a new Empty instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Empty instance
         */
        public static create(properties?: gsbase.IEmpty): gsbase.Empty;

        /**
         * Encodes the specified Empty message. Does not implicitly {@link gsbase.Empty.verify|verify} messages.
         * @param message Empty message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IEmpty, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Empty message, length delimited. Does not implicitly {@link gsbase.Empty.verify|verify} messages.
         * @param message Empty message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IEmpty, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Empty message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Empty
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.Empty;

        /**
         * Decodes an Empty message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Empty
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.Empty;

        /**
         * Verifies an Empty message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Empty message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Empty
         */
        public static fromObject(object: { [k: string]: any }): gsbase.Empty;

        /**
         * Creates a plain object from an Empty message. Also converts values to other types if specified.
         * @param message Empty
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.Empty, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Empty to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a JoinRoomReq. */
    interface IJoinRoomReq {

        /** JoinRoomReq roomId */
        roomId?: (string|null);
    }

    /** Represents a JoinRoomReq. */
    class JoinRoomReq implements IJoinRoomReq {

        /**
         * Constructs a new JoinRoomReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IJoinRoomReq);

        /** JoinRoomReq roomId. */
        public roomId: string;

        /**
         * Creates a new JoinRoomReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JoinRoomReq instance
         */
        public static create(properties?: gsbase.IJoinRoomReq): gsbase.JoinRoomReq;

        /**
         * Encodes the specified JoinRoomReq message. Does not implicitly {@link gsbase.JoinRoomReq.verify|verify} messages.
         * @param message JoinRoomReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IJoinRoomReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified JoinRoomReq message, length delimited. Does not implicitly {@link gsbase.JoinRoomReq.verify|verify} messages.
         * @param message JoinRoomReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IJoinRoomReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a JoinRoomReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JoinRoomReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.JoinRoomReq;

        /**
         * Decodes a JoinRoomReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns JoinRoomReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.JoinRoomReq;

        /**
         * Verifies a JoinRoomReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a JoinRoomReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns JoinRoomReq
         */
        public static fromObject(object: { [k: string]: any }): gsbase.JoinRoomReq;

        /**
         * Creates a plain object from a JoinRoomReq message. Also converts values to other types if specified.
         * @param message JoinRoomReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.JoinRoomReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this JoinRoomReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a JoinRoomRsp. */
    interface IJoinRoomRsp {

        /** JoinRoomRsp err */
        err?: (string|null);

        /** JoinRoomRsp room */
        room?: (gsbase.IRoomInfo|null);
    }

    /** Represents a JoinRoomRsp. */
    class JoinRoomRsp implements IJoinRoomRsp {

        /**
         * Constructs a new JoinRoomRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IJoinRoomRsp);

        /** JoinRoomRsp err. */
        public err: string;

        /** JoinRoomRsp room. */
        public room?: (gsbase.IRoomInfo|null);

        /**
         * Creates a new JoinRoomRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JoinRoomRsp instance
         */
        public static create(properties?: gsbase.IJoinRoomRsp): gsbase.JoinRoomRsp;

        /**
         * Encodes the specified JoinRoomRsp message. Does not implicitly {@link gsbase.JoinRoomRsp.verify|verify} messages.
         * @param message JoinRoomRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IJoinRoomRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified JoinRoomRsp message, length delimited. Does not implicitly {@link gsbase.JoinRoomRsp.verify|verify} messages.
         * @param message JoinRoomRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IJoinRoomRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a JoinRoomRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JoinRoomRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.JoinRoomRsp;

        /**
         * Decodes a JoinRoomRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns JoinRoomRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.JoinRoomRsp;

        /**
         * Verifies a JoinRoomRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a JoinRoomRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns JoinRoomRsp
         */
        public static fromObject(object: { [k: string]: any }): gsbase.JoinRoomRsp;

        /**
         * Creates a plain object from a JoinRoomRsp message. Also converts values to other types if specified.
         * @param message JoinRoomRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.JoinRoomRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this JoinRoomRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a JoinRoomNot. */
    interface IJoinRoomNot {

        /** JoinRoomNot openid */
        openid?: (string|null);

        /** JoinRoomNot room */
        room?: (gsbase.IRoomInfo|null);
    }

    /** Represents a JoinRoomNot. */
    class JoinRoomNot implements IJoinRoomNot {

        /**
         * Constructs a new JoinRoomNot.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IJoinRoomNot);

        /** JoinRoomNot openid. */
        public openid: string;

        /** JoinRoomNot room. */
        public room?: (gsbase.IRoomInfo|null);

        /**
         * Creates a new JoinRoomNot instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JoinRoomNot instance
         */
        public static create(properties?: gsbase.IJoinRoomNot): gsbase.JoinRoomNot;

        /**
         * Encodes the specified JoinRoomNot message. Does not implicitly {@link gsbase.JoinRoomNot.verify|verify} messages.
         * @param message JoinRoomNot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IJoinRoomNot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified JoinRoomNot message, length delimited. Does not implicitly {@link gsbase.JoinRoomNot.verify|verify} messages.
         * @param message JoinRoomNot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IJoinRoomNot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a JoinRoomNot message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JoinRoomNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.JoinRoomNot;

        /**
         * Decodes a JoinRoomNot message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns JoinRoomNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.JoinRoomNot;

        /**
         * Verifies a JoinRoomNot message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a JoinRoomNot message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns JoinRoomNot
         */
        public static fromObject(object: { [k: string]: any }): gsbase.JoinRoomNot;

        /**
         * Creates a plain object from a JoinRoomNot message. Also converts values to other types if specified.
         * @param message JoinRoomNot
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.JoinRoomNot, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this JoinRoomNot to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LeaveRoomReq. */
    interface ILeaveRoomReq {
    }

    /** Represents a LeaveRoomReq. */
    class LeaveRoomReq implements ILeaveRoomReq {

        /**
         * Constructs a new LeaveRoomReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.ILeaveRoomReq);

        /**
         * Creates a new LeaveRoomReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LeaveRoomReq instance
         */
        public static create(properties?: gsbase.ILeaveRoomReq): gsbase.LeaveRoomReq;

        /**
         * Encodes the specified LeaveRoomReq message. Does not implicitly {@link gsbase.LeaveRoomReq.verify|verify} messages.
         * @param message LeaveRoomReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.ILeaveRoomReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LeaveRoomReq message, length delimited. Does not implicitly {@link gsbase.LeaveRoomReq.verify|verify} messages.
         * @param message LeaveRoomReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.ILeaveRoomReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LeaveRoomReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LeaveRoomReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.LeaveRoomReq;

        /**
         * Decodes a LeaveRoomReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LeaveRoomReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.LeaveRoomReq;

        /**
         * Verifies a LeaveRoomReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LeaveRoomReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LeaveRoomReq
         */
        public static fromObject(object: { [k: string]: any }): gsbase.LeaveRoomReq;

        /**
         * Creates a plain object from a LeaveRoomReq message. Also converts values to other types if specified.
         * @param message LeaveRoomReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.LeaveRoomReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LeaveRoomReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LeaveRoomRsp. */
    interface ILeaveRoomRsp {

        /** LeaveRoomRsp err */
        err?: (string|null);

        /** LeaveRoomRsp openid */
        openid?: (string|null);
    }

    /** Represents a LeaveRoomRsp. */
    class LeaveRoomRsp implements ILeaveRoomRsp {

        /**
         * Constructs a new LeaveRoomRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.ILeaveRoomRsp);

        /** LeaveRoomRsp err. */
        public err: string;

        /** LeaveRoomRsp openid. */
        public openid: string;

        /**
         * Creates a new LeaveRoomRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LeaveRoomRsp instance
         */
        public static create(properties?: gsbase.ILeaveRoomRsp): gsbase.LeaveRoomRsp;

        /**
         * Encodes the specified LeaveRoomRsp message. Does not implicitly {@link gsbase.LeaveRoomRsp.verify|verify} messages.
         * @param message LeaveRoomRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.ILeaveRoomRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LeaveRoomRsp message, length delimited. Does not implicitly {@link gsbase.LeaveRoomRsp.verify|verify} messages.
         * @param message LeaveRoomRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.ILeaveRoomRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LeaveRoomRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LeaveRoomRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.LeaveRoomRsp;

        /**
         * Decodes a LeaveRoomRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LeaveRoomRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.LeaveRoomRsp;

        /**
         * Verifies a LeaveRoomRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LeaveRoomRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LeaveRoomRsp
         */
        public static fromObject(object: { [k: string]: any }): gsbase.LeaveRoomRsp;

        /**
         * Creates a plain object from a LeaveRoomRsp message. Also converts values to other types if specified.
         * @param message LeaveRoomRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.LeaveRoomRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LeaveRoomRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LeaveRoomNot. */
    interface ILeaveRoomNot {

        /** LeaveRoomNot plyId */
        plyId?: (string|null);
    }

    /** Represents a LeaveRoomNot. */
    class LeaveRoomNot implements ILeaveRoomNot {

        /**
         * Constructs a new LeaveRoomNot.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.ILeaveRoomNot);

        /** LeaveRoomNot plyId. */
        public plyId: string;

        /**
         * Creates a new LeaveRoomNot instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LeaveRoomNot instance
         */
        public static create(properties?: gsbase.ILeaveRoomNot): gsbase.LeaveRoomNot;

        /**
         * Encodes the specified LeaveRoomNot message. Does not implicitly {@link gsbase.LeaveRoomNot.verify|verify} messages.
         * @param message LeaveRoomNot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.ILeaveRoomNot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LeaveRoomNot message, length delimited. Does not implicitly {@link gsbase.LeaveRoomNot.verify|verify} messages.
         * @param message LeaveRoomNot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.ILeaveRoomNot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LeaveRoomNot message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LeaveRoomNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.LeaveRoomNot;

        /**
         * Decodes a LeaveRoomNot message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LeaveRoomNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.LeaveRoomNot;

        /**
         * Verifies a LeaveRoomNot message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LeaveRoomNot message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LeaveRoomNot
         */
        public static fromObject(object: { [k: string]: any }): gsbase.LeaveRoomNot;

        /**
         * Creates a plain object from a LeaveRoomNot message. Also converts values to other types if specified.
         * @param message LeaveRoomNot
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.LeaveRoomNot, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LeaveRoomNot to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DismissNot. */
    interface IDismissNot {

        /** DismissNot msg */
        msg?: (string|null);
    }

    /** Represents a DismissNot. */
    class DismissNot implements IDismissNot {

        /**
         * Constructs a new DismissNot.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IDismissNot);

        /** DismissNot msg. */
        public msg: string;

        /**
         * Creates a new DismissNot instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DismissNot instance
         */
        public static create(properties?: gsbase.IDismissNot): gsbase.DismissNot;

        /**
         * Encodes the specified DismissNot message. Does not implicitly {@link gsbase.DismissNot.verify|verify} messages.
         * @param message DismissNot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IDismissNot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DismissNot message, length delimited. Does not implicitly {@link gsbase.DismissNot.verify|verify} messages.
         * @param message DismissNot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IDismissNot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DismissNot message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DismissNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.DismissNot;

        /**
         * Decodes a DismissNot message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DismissNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.DismissNot;

        /**
         * Verifies a DismissNot message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DismissNot message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DismissNot
         */
        public static fromObject(object: { [k: string]: any }): gsbase.DismissNot;

        /**
         * Creates a plain object from a DismissNot message. Also converts values to other types if specified.
         * @param message DismissNot
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.DismissNot, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DismissNot to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GsbPing. */
    interface IGsbPing {

        /** GsbPing now */
        now?: (number|Long|null);
    }

    /** Represents a GsbPing. */
    class GsbPing implements IGsbPing {

        /**
         * Constructs a new GsbPing.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IGsbPing);

        /** GsbPing now. */
        public now: (number|Long);

        /**
         * Creates a new GsbPing instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GsbPing instance
         */
        public static create(properties?: gsbase.IGsbPing): gsbase.GsbPing;

        /**
         * Encodes the specified GsbPing message. Does not implicitly {@link gsbase.GsbPing.verify|verify} messages.
         * @param message GsbPing message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IGsbPing, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GsbPing message, length delimited. Does not implicitly {@link gsbase.GsbPing.verify|verify} messages.
         * @param message GsbPing message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IGsbPing, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GsbPing message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GsbPing
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.GsbPing;

        /**
         * Decodes a GsbPing message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GsbPing
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.GsbPing;

        /**
         * Verifies a GsbPing message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GsbPing message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GsbPing
         */
        public static fromObject(object: { [k: string]: any }): gsbase.GsbPing;

        /**
         * Creates a plain object from a GsbPing message. Also converts values to other types if specified.
         * @param message GsbPing
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.GsbPing, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GsbPing to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GsbPong. */
    interface IGsbPong {

        /** GsbPong err */
        err?: (string|null);

        /** GsbPong cliNow */
        cliNow?: (number|Long|null);

        /** GsbPong now */
        now?: (number|Long|null);
    }

    /** Represents a GsbPong. */
    class GsbPong implements IGsbPong {

        /**
         * Constructs a new GsbPong.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IGsbPong);

        /** GsbPong err. */
        public err: string;

        /** GsbPong cliNow. */
        public cliNow: (number|Long);

        /** GsbPong now. */
        public now: (number|Long);

        /**
         * Creates a new GsbPong instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GsbPong instance
         */
        public static create(properties?: gsbase.IGsbPong): gsbase.GsbPong;

        /**
         * Encodes the specified GsbPong message. Does not implicitly {@link gsbase.GsbPong.verify|verify} messages.
         * @param message GsbPong message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IGsbPong, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GsbPong message, length delimited. Does not implicitly {@link gsbase.GsbPong.verify|verify} messages.
         * @param message GsbPong message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IGsbPong, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GsbPong message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GsbPong
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.GsbPong;

        /**
         * Decodes a GsbPong message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GsbPong
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.GsbPong;

        /**
         * Verifies a GsbPong message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GsbPong message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GsbPong
         */
        public static fromObject(object: { [k: string]: any }): gsbase.GsbPong;

        /**
         * Creates a plain object from a GsbPong message. Also converts values to other types if specified.
         * @param message GsbPong
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.GsbPong, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GsbPong to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** ChatType enum. */
    enum ChatType {
        Text = 0,
        Emoji = 1
    }

    /** Properties of a ChatReq. */
    interface IChatReq {

        /** ChatReq type */
        type?: (gsbase.ChatType|null);

        /** ChatReq content */
        content?: (string|null);

        /** ChatReq to */
        to?: (string|null);
    }

    /** Represents a ChatReq. */
    class ChatReq implements IChatReq {

        /**
         * Constructs a new ChatReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IChatReq);

        /** ChatReq type. */
        public type: gsbase.ChatType;

        /** ChatReq content. */
        public content: string;

        /** ChatReq to. */
        public to: string;

        /**
         * Creates a new ChatReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatReq instance
         */
        public static create(properties?: gsbase.IChatReq): gsbase.ChatReq;

        /**
         * Encodes the specified ChatReq message. Does not implicitly {@link gsbase.ChatReq.verify|verify} messages.
         * @param message ChatReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IChatReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatReq message, length delimited. Does not implicitly {@link gsbase.ChatReq.verify|verify} messages.
         * @param message ChatReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IChatReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.ChatReq;

        /**
         * Decodes a ChatReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.ChatReq;

        /**
         * Verifies a ChatReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatReq
         */
        public static fromObject(object: { [k: string]: any }): gsbase.ChatReq;

        /**
         * Creates a plain object from a ChatReq message. Also converts values to other types if specified.
         * @param message ChatReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.ChatReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChatRsp. */
    interface IChatRsp {

        /** ChatRsp err */
        err?: (string|null);
    }

    /** Represents a ChatRsp. */
    class ChatRsp implements IChatRsp {

        /**
         * Constructs a new ChatRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IChatRsp);

        /** ChatRsp err. */
        public err: string;

        /**
         * Creates a new ChatRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatRsp instance
         */
        public static create(properties?: gsbase.IChatRsp): gsbase.ChatRsp;

        /**
         * Encodes the specified ChatRsp message. Does not implicitly {@link gsbase.ChatRsp.verify|verify} messages.
         * @param message ChatRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IChatRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatRsp message, length delimited. Does not implicitly {@link gsbase.ChatRsp.verify|verify} messages.
         * @param message ChatRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IChatRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.ChatRsp;

        /**
         * Decodes a ChatRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.ChatRsp;

        /**
         * Verifies a ChatRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatRsp
         */
        public static fromObject(object: { [k: string]: any }): gsbase.ChatRsp;

        /**
         * Creates a plain object from a ChatRsp message. Also converts values to other types if specified.
         * @param message ChatRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.ChatRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChatNot. */
    interface IChatNot {

        /** ChatNot from */
        from?: (string|null);

        /** ChatNot to */
        to?: (string|null);

        /** ChatNot type */
        type?: (gsbase.ChatType|null);

        /** ChatNot content */
        content?: (string|null);
    }

    /** Represents a ChatNot. */
    class ChatNot implements IChatNot {

        /**
         * Constructs a new ChatNot.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IChatNot);

        /** ChatNot from. */
        public from: string;

        /** ChatNot to. */
        public to: string;

        /** ChatNot type. */
        public type: gsbase.ChatType;

        /** ChatNot content. */
        public content: string;

        /**
         * Creates a new ChatNot instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatNot instance
         */
        public static create(properties?: gsbase.IChatNot): gsbase.ChatNot;

        /**
         * Encodes the specified ChatNot message. Does not implicitly {@link gsbase.ChatNot.verify|verify} messages.
         * @param message ChatNot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IChatNot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatNot message, length delimited. Does not implicitly {@link gsbase.ChatNot.verify|verify} messages.
         * @param message ChatNot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IChatNot, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatNot message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.ChatNot;

        /**
         * Decodes a ChatNot message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatNot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.ChatNot;

        /**
         * Verifies a ChatNot message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatNot message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatNot
         */
        public static fromObject(object: { [k: string]: any }): gsbase.ChatNot;

        /**
         * Creates a plain object from a ChatNot message. Also converts values to other types if specified.
         * @param message ChatNot
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.ChatNot, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatNot to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CreateRoomReq. */
    interface ICreateRoomReq {

        /** CreateRoomReq roomId */
        roomId?: (string|null);

        /** CreateRoomReq properties */
        properties?: (string|null);

        /** CreateRoomReq owner */
        owner?: (string|null);
    }

    /** Represents a CreateRoomReq. */
    class CreateRoomReq implements ICreateRoomReq {

        /**
         * Constructs a new CreateRoomReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.ICreateRoomReq);

        /** CreateRoomReq roomId. */
        public roomId: string;

        /** CreateRoomReq properties. */
        public properties: string;

        /** CreateRoomReq owner. */
        public owner: string;

        /**
         * Creates a new CreateRoomReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateRoomReq instance
         */
        public static create(properties?: gsbase.ICreateRoomReq): gsbase.CreateRoomReq;

        /**
         * Encodes the specified CreateRoomReq message. Does not implicitly {@link gsbase.CreateRoomReq.verify|verify} messages.
         * @param message CreateRoomReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.ICreateRoomReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreateRoomReq message, length delimited. Does not implicitly {@link gsbase.CreateRoomReq.verify|verify} messages.
         * @param message CreateRoomReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.ICreateRoomReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateRoomReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateRoomReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.CreateRoomReq;

        /**
         * Decodes a CreateRoomReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreateRoomReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.CreateRoomReq;

        /**
         * Verifies a CreateRoomReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreateRoomReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreateRoomReq
         */
        public static fromObject(object: { [k: string]: any }): gsbase.CreateRoomReq;

        /**
         * Creates a plain object from a CreateRoomReq message. Also converts values to other types if specified.
         * @param message CreateRoomReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.CreateRoomReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreateRoomReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CreateRoomRsp. */
    interface ICreateRoomRsp {

        /** CreateRoomRsp err */
        err?: (string|null);

        /** CreateRoomRsp serverId */
        serverId?: (string|null);
    }

    /** Represents a CreateRoomRsp. */
    class CreateRoomRsp implements ICreateRoomRsp {

        /**
         * Constructs a new CreateRoomRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.ICreateRoomRsp);

        /** CreateRoomRsp err. */
        public err: string;

        /** CreateRoomRsp serverId. */
        public serverId: string;

        /**
         * Creates a new CreateRoomRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateRoomRsp instance
         */
        public static create(properties?: gsbase.ICreateRoomRsp): gsbase.CreateRoomRsp;

        /**
         * Encodes the specified CreateRoomRsp message. Does not implicitly {@link gsbase.CreateRoomRsp.verify|verify} messages.
         * @param message CreateRoomRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.ICreateRoomRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreateRoomRsp message, length delimited. Does not implicitly {@link gsbase.CreateRoomRsp.verify|verify} messages.
         * @param message CreateRoomRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.ICreateRoomRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateRoomRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateRoomRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.CreateRoomRsp;

        /**
         * Decodes a CreateRoomRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreateRoomRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.CreateRoomRsp;

        /**
         * Verifies a CreateRoomRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreateRoomRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreateRoomRsp
         */
        public static fromObject(object: { [k: string]: any }): gsbase.CreateRoomRsp;

        /**
         * Creates a plain object from a CreateRoomRsp message. Also converts values to other types if specified.
         * @param message CreateRoomRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.CreateRoomRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreateRoomRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DismissRoomReq. */
    interface IDismissRoomReq {

        /** DismissRoomReq openid */
        openid?: (string|null);

        /** DismissRoomReq roomId */
        roomId?: (string|null);
    }

    /** Represents a DismissRoomReq. */
    class DismissRoomReq implements IDismissRoomReq {

        /**
         * Constructs a new DismissRoomReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IDismissRoomReq);

        /** DismissRoomReq openid. */
        public openid: string;

        /** DismissRoomReq roomId. */
        public roomId: string;

        /**
         * Creates a new DismissRoomReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DismissRoomReq instance
         */
        public static create(properties?: gsbase.IDismissRoomReq): gsbase.DismissRoomReq;

        /**
         * Encodes the specified DismissRoomReq message. Does not implicitly {@link gsbase.DismissRoomReq.verify|verify} messages.
         * @param message DismissRoomReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IDismissRoomReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DismissRoomReq message, length delimited. Does not implicitly {@link gsbase.DismissRoomReq.verify|verify} messages.
         * @param message DismissRoomReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IDismissRoomReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DismissRoomReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DismissRoomReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.DismissRoomReq;

        /**
         * Decodes a DismissRoomReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DismissRoomReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.DismissRoomReq;

        /**
         * Verifies a DismissRoomReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DismissRoomReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DismissRoomReq
         */
        public static fromObject(object: { [k: string]: any }): gsbase.DismissRoomReq;

        /**
         * Creates a plain object from a DismissRoomReq message. Also converts values to other types if specified.
         * @param message DismissRoomReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.DismissRoomReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DismissRoomReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DismissRoomRsp. */
    interface IDismissRoomRsp {

        /** DismissRoomRsp err */
        err?: (string|null);
    }

    /** Represents a DismissRoomRsp. */
    class DismissRoomRsp implements IDismissRoomRsp {

        /**
         * Constructs a new DismissRoomRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IDismissRoomRsp);

        /** DismissRoomRsp err. */
        public err: string;

        /**
         * Creates a new DismissRoomRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DismissRoomRsp instance
         */
        public static create(properties?: gsbase.IDismissRoomRsp): gsbase.DismissRoomRsp;

        /**
         * Encodes the specified DismissRoomRsp message. Does not implicitly {@link gsbase.DismissRoomRsp.verify|verify} messages.
         * @param message DismissRoomRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IDismissRoomRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DismissRoomRsp message, length delimited. Does not implicitly {@link gsbase.DismissRoomRsp.verify|verify} messages.
         * @param message DismissRoomRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IDismissRoomRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DismissRoomRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DismissRoomRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.DismissRoomRsp;

        /**
         * Decodes a DismissRoomRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DismissRoomRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.DismissRoomRsp;

        /**
         * Verifies a DismissRoomRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DismissRoomRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DismissRoomRsp
         */
        public static fromObject(object: { [k: string]: any }): gsbase.DismissRoomRsp;

        /**
         * Creates a plain object from a DismissRoomRsp message. Also converts values to other types if specified.
         * @param message DismissRoomRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.DismissRoomRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DismissRoomRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Player. */
    interface IPlayer {

        /** Player openid */
        openid?: (string|null);

        /** Player metadata */
        metadata?: ({ [k: string]: string }|null);
    }

    /** Represents a Player. */
    class Player implements IPlayer {

        /**
         * Constructs a new Player.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IPlayer);

        /** Player openid. */
        public openid: string;

        /** Player metadata. */
        public metadata: { [k: string]: string };

        /**
         * Creates a new Player instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Player instance
         */
        public static create(properties?: gsbase.IPlayer): gsbase.Player;

        /**
         * Encodes the specified Player message. Does not implicitly {@link gsbase.Player.verify|verify} messages.
         * @param message Player message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IPlayer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Player message, length delimited. Does not implicitly {@link gsbase.Player.verify|verify} messages.
         * @param message Player message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IPlayer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Player message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Player
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.Player;

        /**
         * Decodes a Player message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Player
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.Player;

        /**
         * Verifies a Player message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Player message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Player
         */
        public static fromObject(object: { [k: string]: any }): gsbase.Player;

        /**
         * Creates a plain object from a Player message. Also converts values to other types if specified.
         * @param message Player
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.Player, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Player to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomInfo. */
    interface IRoomInfo {

        /** RoomInfo roomId */
        roomId?: (string|null);

        /** RoomInfo matchCode */
        matchCode?: (string|null);

        /** RoomInfo metadata */
        metadata?: (string|null);

        /** RoomInfo players */
        players?: (gsbase.IPlayer[]|null);

        /** RoomInfo owner */
        owner?: (string|null);
    }

    /** Represents a RoomInfo. */
    class RoomInfo implements IRoomInfo {

        /**
         * Constructs a new RoomInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IRoomInfo);

        /** RoomInfo roomId. */
        public roomId: string;

        /** RoomInfo matchCode. */
        public matchCode: string;

        /** RoomInfo metadata. */
        public metadata: string;

        /** RoomInfo players. */
        public players: gsbase.IPlayer[];

        /** RoomInfo owner. */
        public owner: string;

        /**
         * Creates a new RoomInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomInfo instance
         */
        public static create(properties?: gsbase.IRoomInfo): gsbase.RoomInfo;

        /**
         * Encodes the specified RoomInfo message. Does not implicitly {@link gsbase.RoomInfo.verify|verify} messages.
         * @param message RoomInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IRoomInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomInfo message, length delimited. Does not implicitly {@link gsbase.RoomInfo.verify|verify} messages.
         * @param message RoomInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IRoomInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.RoomInfo;

        /**
         * Decodes a RoomInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.RoomInfo;

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
        public static fromObject(object: { [k: string]: any }): gsbase.RoomInfo;

        /**
         * Creates a plain object from a RoomInfo message. Also converts values to other types if specified.
         * @param message RoomInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.RoomInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CheckRoomStatusReq. */
    interface ICheckRoomStatusReq {

        /** CheckRoomStatusReq roomId */
        roomId?: (string|null);
    }

    /** Represents a CheckRoomStatusReq. */
    class CheckRoomStatusReq implements ICheckRoomStatusReq {

        /**
         * Constructs a new CheckRoomStatusReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.ICheckRoomStatusReq);

        /** CheckRoomStatusReq roomId. */
        public roomId: string;

        /**
         * Creates a new CheckRoomStatusReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CheckRoomStatusReq instance
         */
        public static create(properties?: gsbase.ICheckRoomStatusReq): gsbase.CheckRoomStatusReq;

        /**
         * Encodes the specified CheckRoomStatusReq message. Does not implicitly {@link gsbase.CheckRoomStatusReq.verify|verify} messages.
         * @param message CheckRoomStatusReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.ICheckRoomStatusReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CheckRoomStatusReq message, length delimited. Does not implicitly {@link gsbase.CheckRoomStatusReq.verify|verify} messages.
         * @param message CheckRoomStatusReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.ICheckRoomStatusReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CheckRoomStatusReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CheckRoomStatusReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.CheckRoomStatusReq;

        /**
         * Decodes a CheckRoomStatusReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CheckRoomStatusReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.CheckRoomStatusReq;

        /**
         * Verifies a CheckRoomStatusReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CheckRoomStatusReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CheckRoomStatusReq
         */
        public static fromObject(object: { [k: string]: any }): gsbase.CheckRoomStatusReq;

        /**
         * Creates a plain object from a CheckRoomStatusReq message. Also converts values to other types if specified.
         * @param message CheckRoomStatusReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.CheckRoomStatusReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CheckRoomStatusReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CheckRoomStatusRsp. */
    interface ICheckRoomStatusRsp {

        /** CheckRoomStatusRsp exists */
        exists?: (boolean|null);
    }

    /** Represents a CheckRoomStatusRsp. */
    class CheckRoomStatusRsp implements ICheckRoomStatusRsp {

        /**
         * Constructs a new CheckRoomStatusRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.ICheckRoomStatusRsp);

        /** CheckRoomStatusRsp exists. */
        public exists: boolean;

        /**
         * Creates a new CheckRoomStatusRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CheckRoomStatusRsp instance
         */
        public static create(properties?: gsbase.ICheckRoomStatusRsp): gsbase.CheckRoomStatusRsp;

        /**
         * Encodes the specified CheckRoomStatusRsp message. Does not implicitly {@link gsbase.CheckRoomStatusRsp.verify|verify} messages.
         * @param message CheckRoomStatusRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.ICheckRoomStatusRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CheckRoomStatusRsp message, length delimited. Does not implicitly {@link gsbase.CheckRoomStatusRsp.verify|verify} messages.
         * @param message CheckRoomStatusRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.ICheckRoomStatusRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CheckRoomStatusRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CheckRoomStatusRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.CheckRoomStatusRsp;

        /**
         * Decodes a CheckRoomStatusRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CheckRoomStatusRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.CheckRoomStatusRsp;

        /**
         * Verifies a CheckRoomStatusRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CheckRoomStatusRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CheckRoomStatusRsp
         */
        public static fromObject(object: { [k: string]: any }): gsbase.CheckRoomStatusRsp;

        /**
         * Creates a plain object from a CheckRoomStatusRsp message. Also converts values to other types if specified.
         * @param message CheckRoomStatusRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.CheckRoomStatusRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CheckRoomStatusRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetRoomInfoReq. */
    interface IGetRoomInfoReq {

        /** GetRoomInfoReq roomId */
        roomId?: (string|null);
    }

    /** Represents a GetRoomInfoReq. */
    class GetRoomInfoReq implements IGetRoomInfoReq {

        /**
         * Constructs a new GetRoomInfoReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IGetRoomInfoReq);

        /** GetRoomInfoReq roomId. */
        public roomId: string;

        /**
         * Creates a new GetRoomInfoReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetRoomInfoReq instance
         */
        public static create(properties?: gsbase.IGetRoomInfoReq): gsbase.GetRoomInfoReq;

        /**
         * Encodes the specified GetRoomInfoReq message. Does not implicitly {@link gsbase.GetRoomInfoReq.verify|verify} messages.
         * @param message GetRoomInfoReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IGetRoomInfoReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetRoomInfoReq message, length delimited. Does not implicitly {@link gsbase.GetRoomInfoReq.verify|verify} messages.
         * @param message GetRoomInfoReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IGetRoomInfoReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetRoomInfoReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetRoomInfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.GetRoomInfoReq;

        /**
         * Decodes a GetRoomInfoReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetRoomInfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.GetRoomInfoReq;

        /**
         * Verifies a GetRoomInfoReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetRoomInfoReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetRoomInfoReq
         */
        public static fromObject(object: { [k: string]: any }): gsbase.GetRoomInfoReq;

        /**
         * Creates a plain object from a GetRoomInfoReq message. Also converts values to other types if specified.
         * @param message GetRoomInfoReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.GetRoomInfoReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetRoomInfoReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetRoomInfoRsp. */
    interface IGetRoomInfoRsp {

        /** GetRoomInfoRsp room */
        room?: (gsbase.IRoomInfo|null);
    }

    /** Represents a GetRoomInfoRsp. */
    class GetRoomInfoRsp implements IGetRoomInfoRsp {

        /**
         * Constructs a new GetRoomInfoRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IGetRoomInfoRsp);

        /** GetRoomInfoRsp room. */
        public room?: (gsbase.IRoomInfo|null);

        /**
         * Creates a new GetRoomInfoRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetRoomInfoRsp instance
         */
        public static create(properties?: gsbase.IGetRoomInfoRsp): gsbase.GetRoomInfoRsp;

        /**
         * Encodes the specified GetRoomInfoRsp message. Does not implicitly {@link gsbase.GetRoomInfoRsp.verify|verify} messages.
         * @param message GetRoomInfoRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IGetRoomInfoRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetRoomInfoRsp message, length delimited. Does not implicitly {@link gsbase.GetRoomInfoRsp.verify|verify} messages.
         * @param message GetRoomInfoRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IGetRoomInfoRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetRoomInfoRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetRoomInfoRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.GetRoomInfoRsp;

        /**
         * Decodes a GetRoomInfoRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetRoomInfoRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.GetRoomInfoRsp;

        /**
         * Verifies a GetRoomInfoRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetRoomInfoRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetRoomInfoRsp
         */
        public static fromObject(object: { [k: string]: any }): gsbase.GetRoomInfoRsp;

        /**
         * Creates a plain object from a GetRoomInfoRsp message. Also converts values to other types if specified.
         * @param message GetRoomInfoRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.GetRoomInfoRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetRoomInfoRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an UpdateRoomInfoReq. */
    interface IUpdateRoomInfoReq {

        /** UpdateRoomInfoReq roomId */
        roomId?: (string|null);

        /** UpdateRoomInfoReq properties */
        properties?: ({ [k: string]: string }|null);
    }

    /** Represents an UpdateRoomInfoReq. */
    class UpdateRoomInfoReq implements IUpdateRoomInfoReq {

        /**
         * Constructs a new UpdateRoomInfoReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IUpdateRoomInfoReq);

        /** UpdateRoomInfoReq roomId. */
        public roomId: string;

        /** UpdateRoomInfoReq properties. */
        public properties: { [k: string]: string };

        /**
         * Creates a new UpdateRoomInfoReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UpdateRoomInfoReq instance
         */
        public static create(properties?: gsbase.IUpdateRoomInfoReq): gsbase.UpdateRoomInfoReq;

        /**
         * Encodes the specified UpdateRoomInfoReq message. Does not implicitly {@link gsbase.UpdateRoomInfoReq.verify|verify} messages.
         * @param message UpdateRoomInfoReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IUpdateRoomInfoReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UpdateRoomInfoReq message, length delimited. Does not implicitly {@link gsbase.UpdateRoomInfoReq.verify|verify} messages.
         * @param message UpdateRoomInfoReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IUpdateRoomInfoReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UpdateRoomInfoReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UpdateRoomInfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.UpdateRoomInfoReq;

        /**
         * Decodes an UpdateRoomInfoReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UpdateRoomInfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.UpdateRoomInfoReq;

        /**
         * Verifies an UpdateRoomInfoReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UpdateRoomInfoReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UpdateRoomInfoReq
         */
        public static fromObject(object: { [k: string]: any }): gsbase.UpdateRoomInfoReq;

        /**
         * Creates a plain object from an UpdateRoomInfoReq message. Also converts values to other types if specified.
         * @param message UpdateRoomInfoReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.UpdateRoomInfoReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UpdateRoomInfoReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an UpdateRoomInfoRsp. */
    interface IUpdateRoomInfoRsp {

        /** UpdateRoomInfoRsp err */
        err?: (string|null);
    }

    /** Represents an UpdateRoomInfoRsp. */
    class UpdateRoomInfoRsp implements IUpdateRoomInfoRsp {

        /**
         * Constructs a new UpdateRoomInfoRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.IUpdateRoomInfoRsp);

        /** UpdateRoomInfoRsp err. */
        public err: string;

        /**
         * Creates a new UpdateRoomInfoRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UpdateRoomInfoRsp instance
         */
        public static create(properties?: gsbase.IUpdateRoomInfoRsp): gsbase.UpdateRoomInfoRsp;

        /**
         * Encodes the specified UpdateRoomInfoRsp message. Does not implicitly {@link gsbase.UpdateRoomInfoRsp.verify|verify} messages.
         * @param message UpdateRoomInfoRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.IUpdateRoomInfoRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UpdateRoomInfoRsp message, length delimited. Does not implicitly {@link gsbase.UpdateRoomInfoRsp.verify|verify} messages.
         * @param message UpdateRoomInfoRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.IUpdateRoomInfoRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UpdateRoomInfoRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UpdateRoomInfoRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.UpdateRoomInfoRsp;

        /**
         * Decodes an UpdateRoomInfoRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UpdateRoomInfoRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.UpdateRoomInfoRsp;

        /**
         * Verifies an UpdateRoomInfoRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UpdateRoomInfoRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UpdateRoomInfoRsp
         */
        public static fromObject(object: { [k: string]: any }): gsbase.UpdateRoomInfoRsp;

        /**
         * Creates a plain object from an UpdateRoomInfoRsp message. Also converts values to other types if specified.
         * @param message UpdateRoomInfoRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.UpdateRoomInfoRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UpdateRoomInfoRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SystemMessage. */
    interface ISystemMessage {

        /** SystemMessage code */
        code?: (number|null);

        /** SystemMessage err */
        err?: (string|null);

        /** SystemMessage request */
        request?: (string|null);
    }

    /** Represents a SystemMessage. */
    class SystemMessage implements ISystemMessage {

        /**
         * Constructs a new SystemMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: gsbase.ISystemMessage);

        /** SystemMessage code. */
        public code: number;

        /** SystemMessage err. */
        public err: string;

        /** SystemMessage request. */
        public request: string;

        /**
         * Creates a new SystemMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SystemMessage instance
         */
        public static create(properties?: gsbase.ISystemMessage): gsbase.SystemMessage;

        /**
         * Encodes the specified SystemMessage message. Does not implicitly {@link gsbase.SystemMessage.verify|verify} messages.
         * @param message SystemMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gsbase.ISystemMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SystemMessage message, length delimited. Does not implicitly {@link gsbase.SystemMessage.verify|verify} messages.
         * @param message SystemMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gsbase.ISystemMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SystemMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SystemMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gsbase.SystemMessage;

        /**
         * Decodes a SystemMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SystemMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gsbase.SystemMessage;

        /**
         * Verifies a SystemMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SystemMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SystemMessage
         */
        public static fromObject(object: { [k: string]: any }): gsbase.SystemMessage;

        /**
         * Creates a plain object from a SystemMessage message. Also converts values to other types if specified.
         * @param message SystemMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gsbase.SystemMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SystemMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
