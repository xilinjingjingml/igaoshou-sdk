/*
 * @Description: 
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import { EventMgr } from "./EventMgr"

let _common: any = {}
const DATA_SAVE: string = "iGaoShouData"
const DATA_EVENT_NAME: string = "DATAEVENT_"

class Data {
    static _bundler: cc.AssetManager.Bundle = null
    static set Bundler(bundler: cc.AssetManager.Bundle) {
        this._bundler = bundler
    }

    static get Bundler(): cc.AssetManager.Bundle {
        return this._bundler
    }

    static _onlineParam: any = {}
    static set OnlineParam(onlineParam: any) {
        this._onlineParam = onlineParam
    }

    static get OnlineParam(): any {
        return this._onlineParam
    }

    static _config: IGameConfig = null
    static set Config(config: IGameConfig) {
        DataMgr.setData("onlineParam", config, true)
        this._config = config
    }
    static get Config(): IGameConfig {
        if (!this._config) {
            this._config = DataMgr.getData("onlineParam")
        }
        return this._config
    }

    static _pushMsg: IPushMsg[] = []
    static addPushMsg(msg: IPushMsg) {
        // if (!this._pushMsg) this._pushMsg = []
        Data._pushMsg.push(msg)
        if (Data._pushMsg.length > 10) {
            Data._pushMsg.shift()
        }
        cc.log("_pushMsg = " + Data._pushMsg.length)
    }

    static getPushMsg(): IPushMsg {
        cc.log("_pushMsg = " + Data._pushMsg.length)
        return Data._pushMsg.shift()
    }

    static pushMsgCount(): number {
        cc.log("pushmsg count = " + Data._pushMsg.length)
        return Data._pushMsg.length
    }
}

export namespace DataMgr {
    export function setData<T>(name: string | number, data: T, save: boolean = false) {
        let key = typeof name === "string" ? name : "" + name
        let names = key.split(".")
        let newData = data
        // key = name
        if (names.length === 1) {
            _common[name] = data
        } else if (names.length > 1) {
            key = names[0]
            newData = _common[names[0]]
            let tmp = newData
            for (let i = 1; tmp && i < names.length - 1; i++) {
                if (!tmp[names[i]]) {
                    tmp[names[i]] = {}
                }
                tmp = tmp[names[i]]
            }
            tmp[names[names.length - 1]] = data
        }

        if (save) {
            localStorage.setItem(DATA_SAVE + key, JSON.stringify(newData))
        }

        key = ""
        for (let n of names) {
            key = key + n
            EventMgr.dispatchEvent(DATA_EVENT_NAME + key, newData)
            key = key + "."
        }
    }

    function deepCopy<T extends unknown>(sourceData: T): T {
        if (typeof sourceData !== "object") {
            return sourceData
        }
        if (sourceData instanceof cc.Asset) {
            return sourceData
        }
        if (Array.isArray(sourceData)) {
            return sourceData.map(item => deepCopy(item)) as T;
        }
        const obj: T = {} as T;
        for (let key in sourceData) {
            if ((typeof sourceData[key] === 'object') && sourceData[key] !== null) {
                obj[key] = deepCopy(sourceData[key]);
            } else {
                obj[key] = sourceData[key];
            }
        }
        return obj;
    }

    export function getData<T>(name: string | number): T {
        let key = typeof name === "string" ? name : "" + name
        let names = key.split(".")
        key = names[0]
        // cc.log("===getData " + name)
        // cc.log(_common)
        if (names.length === 1 && null !== _common[name] && undefined !== _common[name]) {
            return deepCopy(_common[name])
        } else if (names.length > 1 && null !== _common[names[0]] && undefined !== _common[names[0]]) {
            let data = _common[names[0]]
            for (let i = 1; data && i < names.length; i++) {
                data = data[names[i]]
            }
            return deepCopy(data)
        }

        let item = localStorage.getItem(DATA_SAVE + key)
        if (item) {            
            return JSON.parse(item)
        }

        return null
    }

    export function feed(name: string | number, callback: Function, target?: any) {
        let key = typeof name === "string" ? name : "" + name
        let names = key.split(".")
        let eventName = DATA_EVENT_NAME + name
        let func = (msg) => {
            let data = msg
            for (let i = 1; i < names.length; i++) {
                data = data[names[i]]
            }
            callback && callback.call(target, data)
        }
        EventMgr.on(eventName, func, target)
    }

    export function unfeed(name: string | number, target: any) {
        let key = typeof name === "string" ? name : "" + name
        let names = key.split(".")
        let eventName = DATA_EVENT_NAME + name
        EventMgr.off(eventName, target)
    }

    export let Bundle = Data.Bundler
    export let OnlineParam = Data.OnlineParam
    export let Config = Data.Config
    export let addPushMsg = Data.addPushMsg
    export let getPushMsg = Data.getPushMsg
    export let PushMsgCount = Data.pushMsgCount
}