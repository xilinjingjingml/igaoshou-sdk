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

let _external: string[] = []

const GAME_MGR = "gate_mgr"

export namespace GateMgr {

    let starx = window["starx"]

    let _host: string = ""
    let _port: number = 0
    let _path: string = ""
    let _ready: boolean = false
    let _registered: boolean = false

    let _proto: { [name: string]: any[] } = {}

    function _registe() {
        starx.off('io-error')
        starx.on('io-error', function (event) {
            // izxFW.error('#########io-error#########', event)
            cc.log('#########io-error#########', event);
        })

        starx.off('reconnect')
        starx.on('reconnect', function () {
            cc.log('#########reconnect#########')
            EventMgr.dispatchEvent("SOCKET_RECONNECT")
        })

        starx.off('close')
        starx.on('close', function (event) {
            cc.log('#########close#########', event)
            // EventMgr.dispatchEvent("SOCKET_CLOSE")

            _ready = false
        })

        starx.off('disconnect')
        starx.on('disconnect', function (event) {
            cc.log('#########disconnect#########', event)
            EventMgr.dispatchEvent("SOCKET_DISCONNECT")

            _ready = false
        })

        starx.off('heartbeat timeout')
        starx.on('heartbeat timeout', function () {
            cc.log('#########heartbeat timeout#########')
            EventMgr.dispatchEvent("SOCKET_CLOSE")
            _ready = false
        })

        starx.off('error')
        starx.on('error', function (msg) {
            cc.log('#########error#########', msg)
        })

        starx.off('onKick')
        starx.on('onKick', function (data) {
            cc.log('#########error#########', data)
            EventMgr.dispatchEvent("SOCKET_CLOSE")
            _ready = false
        })

        starx.off('onData')
        starx.on("onData", function (data) {
            if (data) {
                cc.log(data.route)
                let body = _decodePacket(data.route, data.body)
                cc.log(body)
                
                let find = _external.filter(i => i === body.module)
                if (find.length > 0) {
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.ON_DATA, body)
                } else {
                    EventMgr.dispatchEvent(data.route, body)
                }
            }
        })
    }

    function _initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.FOREGROUND, ready, GAME_MGR)
    }

    export function login(host: string, port?: number, path?: string, sender?: Function) {
        if(!_registered){
            _registered = true
            _registe()
            _initEvent()
        }
        
        starx.disconnect()
        let connent = (pem) => {
            _host = host || _host
            _port = port || _port
            _path = path || _path
            let sockPromise = new Promise((resolve, reject) => {
                starx.init({
                    host: host, //"192.168.0.126",
                    port: port, //3333
                    reconnect: true,
                    path: path,
                    pem: pem
                }, function (socket) {
                    cc.log("connected", socket)
                    if (socket === null) {
                        reject("failed")
                    } else {
                        resolve("success")
                        _ready = true
                        EventMgr.dispatchEvent("SOCKET_CONNECT")
                        cc.log("=====login _ready = true")
                        if (sender && typeof sender === "function") {
                            // cc.Camera.main.scheduleOnce(() => sender, 0.1)
                            sender()
                        }
                    }
                })
            })
            sockPromise.then((msg) => { }).catch((msg) => { })
        }

        let bundle = DataMgr.data.Bundle
        if (bundle && cc.sys.platform === cc.sys.ANDROID) {
            bundle.load("cacert", (err, pem) => {
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

        let setDefault = function (packet: object): object {
            let propertys = Reflect.getPrototypeOf(packet)
            for (let key in propertys) {
                if (typeof propertys[key] === "function")
                    continue;

                if (typeof propertys[key] === "object" && propertys[key]) {
                    if (packet[key] instanceof Array) {
                        for (let idx in packet[key]) {
                            if (typeof packet[key][idx] === "object")
                                packet[key][idx] = setDefault(packet[key][idx])
                        }
                    }
                    else {
                        packet[key] = setDefault(propertys[key])
                    }
                }
                else if (false === propertys.hasOwnProperty.call(packet, key)) {
                    packet[key] = propertys[key]
                }
            }

            return packet
        }

        packet = setDefault(packet)

        return { module: p.module, name: name, packet: packet }
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

    export function request(route, reqName, reqBody, resName, cb) {
        let func = () => {
            try {
                cc.log(route, reqName)
                cc.log(reqBody)
                starx.request(route, _encodePacket(reqName, reqBody), function (data) {
                    let msg = _decodePacket(resName, data)
                    cb = cb || function () { }
                    cb(msg)
                })
            } catch (e) {
                cc.log(e)
            }
        }
        checkReady(func)
    }

    export function notify(route, reqName, reqBody = null) {
        let func = () => {
            if (null == reqBody)
                reqBody = {}

            cc.log(route, reqName)
            cc.log(reqBody)

            starx.notify(route, _encodePacket(reqName, reqBody))
        }
        checkReady(func)
    }

    export function close() {
        starx.disconnect()
    }

    export function ready() {
        if (!_ready) {
            login(_host, _port)
            return false
        }

        return true
    }
}