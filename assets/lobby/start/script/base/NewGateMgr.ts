/*
 * @Description: 
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */
// import { starx } from "../lib/starx-wsclient.js"

import { EventMgr } from "./EventMgr"
import { DataMgr } from "./DataMgr"
import { Constants } from "../igsConstants"
import { WebsocketBuilder, ExponentialBackoff, Websocket } from "../websocket-ts"
import { transport } from "../websocket-ts/transport"
import { igs } from "../../../../igs"



let _external: string[] = []

const GAME_MGR = "gate_mgr"

interface CallbackFunc {
    (error: string, data: ArrayBuffer): any
}
// interface EventFunc {
//     (i: Websocket, ev: Event): any
// }
// interface ErrorFunc {
//     (error: string): any
// }

export namespace NewGateMgr {

    let _host: string = ""
    let _port: number = 0
    let _path: string = ""
    let _ready: boolean = false

    let _registered: boolean = false

    let _proto: { [name: string]: any[] } = {}

    let _websocket: Websocket = null

    let heartbeat_timer: any
    let health_timeout: number = 8000
    let last_health: number = -1

    let callbacks: Map<string, CallbackFunc> = new Map()

    let _sender: Function = null

    let _reconnect: boolean = false

    function _initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.FOREGROUND, ready, GAME_MGR)
    }

    export function login(host: string, port?: number, path?: string, sender?: Function) {
        if (!_registered) {
            _registered = true
            //     _registe()
            _initEvent()
        }

        _host = host || _host
        _port = port || _port
        _path = path || _path

        var url = 'wss://' + _host;
        if (window.location.protocol === "https:") {
            url = "wss://" + _host
        }

        if (port) {
            url += ':' + _port;
        }

        if (path) {
            url += _path;
        }

        console.log(url)

        let connent = (pem) => {
            if (!_websocket) {
                _websocket = new WebsocketBuilder(url)
                    .withBackoff(new ExponentialBackoff(500, 5))
                    .withPem(pem)
                    .onOpen(onOpen)
                    .onClose(onClose)
                    .onError(onError)
                    .onMessage(onMessage)
                    .build()
                _websocket.underlyingWebsocket.binaryType = 'arraybuffer'
            }

            _sender = sender
        }

        let bundle = DataMgr.data.Bundle
        if (bundle && cc.sys.platform === cc.sys.ANDROID) {
            bundle.load("cacert", (err, pem) => {
                console.log(pem)
                if (err) {
                    cc.error(err)
                    connent(null)
                } else {
                    connent(pem.nativeUrl)
                }
            })
        } else {
            connent(null)
        }
    }

    export function setProto(name, proto, external = false) {
        if (_proto[name])
            delete _proto[name]

        _proto[name] = proto
        if (external) {
            _external.push(name)
        }
    }

    export function unsetProto(name) {
        if (_proto[name])
            delete _proto[name]

        _external = _external.filter(i => i !== name)
    }

    function _findProto(name) {
        for (let key in _proto) {
            if (_proto[key][name])
                return { module: key, proto: _proto[key][name] }
        }

        return null
    }

    function _encodePacket(name, packet) {
        // cc.log("====_encodePacter111================")
        let p = _findProto(name)//proto[name]
        if (!p || !p.proto) {
            cc.error('encode Packet : Unknown Packet = ' + name)
            // throw new ReferenceError('encode Packet : Unknown Packet = ' + name)
            return
        }

        let buf = p.proto.create(packet)
        buf = p.proto.encode(buf).finish()
        // cc.log("== ==_encodePacter2=============")
        return buf
    }

    function _decodePacket(name, data) {
        let p = _findProto(name)//proto[name]
        if (!p || !p.proto) {
            cc.error('Decode Packet : Unknown Proto = ' + name)
            // throw new ReferenceError('Decode Packet : Unknown Proto = ' + name)
            return
        }

        let packet = null
        try {
            packet = p.proto.decode(data)
        } catch {
            packet = {}
        }

        // let setDefault = function (packet: object): object {
        //     let propertys = Reflect.getPrototypeOf(packet)
        //     for (let key in propertys) {
        //         if (typeof propertys[key] === "function")
        //             continue;

        //         if (typeof propertys[key] === "object" && propertys[key]) {
        //             if (packet[key] instanceof Array) {
        //                 for (let idx in packet[key]) {
        //                     if (typeof packet[key][idx] === "object")
        //                         packet[key][idx] = setDefault(packet[key][idx])
        //                 }
        //             }
        //             else {
        //                 packet[key] = setDefault(propertys[key])
        //             }
        //         }
        //         else if (false === propertys.hasOwnProperty.call(packet, key)) {
        //             packet[key] = propertys[key]
        //         }
        //     }

        //     return packet
        // }

        // packet = setDefault(packet)

        return { module: p.module, name: name, packet: packet }
    }

    function keepalive() {        
        // let time = new Date()
        if (last_health != -1 && (Date.now() - last_health > health_timeout)) {
            last_health = -1
            _websocket && _websocket.reset()
            //console.log('gateMgr timeout' + Date.now())
        } else {
            let bytes = transport.Message.encode({}).finish()
            _websocket.send(bytes.slice().buffer)
            // console.log('ping')
        }

    }

    function onOpen(i, e) {
        console.log("===on socket open " + Date.now())
        callbacks.clear()
        heartbeat_timer && clearInterval(heartbeat_timer)
        heartbeat_timer = setInterval(() => {
            keepalive()
        }, 2000)

        _ready = true
        if (!_reconnect) {
            EventMgr.dispatchEvent("SOCKET_CONNECT")
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.ON_DATA, { name: "SocketState", packet: { msg: "SOCKET_CONNECT" } })
        } else {
            EventMgr.dispatchEvent("SOCKET_RECONNECT")
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.ON_DATA, { name: "SocketState", packet: { msg: "SOCKET_RECONNECT" } })
        }
        _reconnect = true

        _sender && _sender()
    }

    function onClose(i, e) {
        console.log("===on socket close " + Date.now())
        heartbeat_timer && clearInterval(heartbeat_timer)

        _ready = false
        EventMgr.dispatchEvent("SOCKET_CLOSE")
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.ON_DATA, { name: "SocketState", packet: { msg: "SOCKET_CLOSE" } })
    }

    // function onFailed(i, e) {
    //     console.log("===on socket fail")
    //     _ready = false

    //     EventMgr.dispatchEvent("SOCKET_FAIL")
    //     EventMgr.dispatchEvent(Constants.EVENT_DEFINE.ON_DATA, { name: "SocketState", packet: { msg: "SOCKET_FAIL" } })
    // }

    function onError(error) {
        console.log("===on socket error")
        console.log(error)

        _ready = false
        EventMgr.dispatchEvent("SOCKET_ERROR")
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.ON_DATA, { name: "SocketState", packet: { msg: "SOCKET_ERROR" } })
    }

    function onMessage(i, e) {        
        // let time = new Date()
        last_health = Date.now()//time.getTime()
        //console.log("===on Message" + last_health)
        let dataAsArray = new Uint8Array(e.data)
        let msg = transport.Message.decode(dataAsArray)
        // console.log("===msg ", msg)
        let route = msg.header["Micro-Route"]
        let error = msg.header['Micro-Error']
        let id = msg.header['Micro-Id']
        if (id && callbacks[id]) {
            callbacks[id](error, msg.body)
            callbacks.delete(id)
            return
        }
        if (error) {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SOCKET_MSG_ERROR)
            return
        }
        if (!route) {
            // console.log('pong')
            return
        }

        // let setDefault = function (packet: object): object {
        //     let propertys = Reflect.getPrototypeOf(packet)
        //     for (let key in propertys) {
        //         if (typeof propertys[key] === "function")
        //             continue;

        //         if (typeof propertys[key] === "object" && propertys[key]) {
        //             if (packet[key] instanceof Array) {
        //                 for (let idx in packet[key]) {
        //                     if (typeof packet[key][idx] === "object")
        //                         packet[key][idx] = setDefault(packet[key][idx])
        //                 }
        //             }
        //             else {
        //                 packet[key] = setDefault(propertys[key])
        //             }
        //         }
        //         else if (false === propertys.hasOwnProperty.call(packet, key)) {
        //             packet[key] = propertys[key]
        //         }
        //     }

        //     return packet
        // } 

        cc.log("route: " + route)
        let data = _decodePacket(route, msg.body)
        // data.packet = setDefault(data.packet)

        let find = _external.filter(i => i === data.module)
        if (find.length > 0) {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.ON_DATA, data)
        } else {
            EventMgr.dispatchEvent(route, data)
            igs.emit(route, data)
        }
    }

    export function request(route: string, reqName, reqBody, resName, cb, matedata?: Map<string, string>) {
        let sender = () => {
            let parts = route.split('.')
            let header = {}
            if (parts.length >= 4) {
                header['Micro-ServiceID'] = parts[0]
                header['Micro-Service'] = parts[1]
                header['Micro-Endpoint'] = [parts[2], parts[3]].join('.')
            } else {
                header['Micro-Service'] = parts[0]
                header['Micro-Endpoint'] = [parts[1], parts[2]].join('.')
            }
            header['Micro-Id'] = String(++this.reqID)
            if (cb) {
                this.callbacks[String(this.reqID)] = cb
            }
            if (matedata) {
                matedata.forEach((v, k) => {
                    header[k] = v
                })
            }

            let data = _encodePacket(reqName, reqBody)
            let bytes = transport.Message.encode({ header: header, body: data }).finish()

            _websocket.send(bytes.slice().buffer)

            console.log("==== on request " + route)
        }
        sender()
        // checkReady(sender)
    }

    export function notify(route: string, reqName, reqBody, matedata?: Map<string, string>) {
        let sender = () => {
            let parts = route.split('.')
            let header = {}
            if (parts.length >= 4) {
                header['Micro-ServiceID'] = parts[0]
                header['Micro-Service'] = parts[1]
                header['Micro-Endpoint'] = [parts[2], parts[3]].join('.')
            } else {
                header['Micro-Service'] = parts[0]
                header['Micro-Endpoint'] = [parts[1], parts[2]].join('.')
            }
            if (matedata) {
                matedata.forEach((v, k) => {
                    header[k] = v
                })
            }
            let data = _encodePacket(reqName, reqBody)
            let bytes = transport.Message.encode({ header: header, body: data }).finish()

            _websocket.send(bytes.slice().buffer)

            cc.log("==== on notfiy " + route)
            cc.log(reqBody)
        }
        sender()
        // checkReady(sender)
    }

    function checkReady(sender: Function) {
        if (!sender && typeof sender !== "function") {
            return
        }
        // cc.log("=====ready _ready = " + _ready)
        if (_ready) {
            sender()
        } else {
            login(_host, _port, _path, sender)
        }
    }

    export function close() {
        _websocket.close()
    }

    export function ready() {
        // if (!_ready) {
        //     login(_host, _port)
        //     return false
        // }
        _websocket && _websocket.checkReady()

        // return true
    }
}