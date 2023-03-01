﻿import { Backoff } from "./backoff/backoff";
import { Buffer } from "./buffer/buffer";
export declare enum WebsocketEvents {
    open = "open",
    close = "close",
    error = "error",
    message = "message",
    retry = "retry"
}
interface CustomEvent<T = any> extends Event {
    /**
     * Returns any custom data event was created with. Typically used for synthetic events.
     */
    readonly detail: T;
    initCustomEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, detailArg: T): void;
}
interface WebsocketEventMap {
    close: CloseEvent;
    error: Event;
    message: MessageEvent;
    open: Event;
    retry: CustomEvent<RetryEventDetails>;
}
export interface RetryEventDetails {
    readonly retries: number;
    readonly backoff: number;
}
declare type WebsocketBuffer = Buffer<string | ArrayBufferLike | Blob | ArrayBufferView>;
export declare class Websocket {
    private readonly url;
    private readonly protocols?;
    private readonly buffer?;
    private readonly backoff?;
    private readonly pem?;
    private readonly eventListeners;
    private closedByUser;
    private websocket?;
    private retries;
    constructor(url: string, protocols?: string | string[], buffer?: WebsocketBuffer, backoff?: Backoff, pem: any);
    get underlyingWebsocket(): WebSocket | undefined;
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
    close(code?: number, reason?: string): void;    
    reset(): void;
    checkReady(): void;
    addEventListener<K extends WebsocketEvents>(type: K, listener: (instance: Websocket, ev: WebsocketEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends WebsocketEvents>(type: K, listener: (instance: Websocket, ev: WebsocketEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    private dispatchEvent;
    private tryConnect;
    private handleOpenEvent;
    private handleCloseEvent;
    private handleErrorEvent;
    private handleMessageEvent;
    private handleEvent;
    private reconnect;
}
export {};
//# sourceMappingURL=websocket.d.ts.map