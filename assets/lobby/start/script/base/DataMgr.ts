/*
 * @Description: 
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import { EventMgr } from "./EventMgr"
import { igs } from "../../../../igs"
import { Constants } from "../igsConstants"

let _common: any = {}
const DATA_SAVE: string = "iGaoShouData"
const DATA_EVENT_NAME: string = "DATAEVENT_"

class Data {
    static _bundle: cc.AssetManager.Bundle = null
    static set Bundle(bundle: cc.AssetManager.Bundle) {
        this._bundle = bundle
    }

    static get Bundle(): cc.AssetManager.Bundle {
        return this._bundle
    }

    static _onlineParam: any = null
    static set OnlineParam(onlineParam: any) {
        this._onlineParam = onlineParam
        DataMgr.setData(Constants.DATA_DEFINE.ONLINE_PARAM, this._onlineParam, true)
    }

    static get OnlineParam(): any {
        if (!this._onlineParam && igs.exports.onlineParam) {
            this._onlineParam = igs.exports.onlineParam
            DataMgr.setData(Constants.DATA_DEFINE.ONLINE_PARAM, this._onlineParam, true)
        }
        return this._onlineParam || DataMgr.getData(Constants.DATA_DEFINE.ONLINE_PARAM) || {}
    }

    static _config: IGameConfig = null
    static set Config(config: IGameConfig) {
        DataMgr.setData("igs", config, true)
        this._config = config
    }
    static get Config(): IGameConfig {
        if (!this._config) {
            this._config = DataMgr.getData("igs")
        }
        return this._config
    }

    static saveConfig(config: IGameConfig) {
        this._config = config
        DataMgr.setData("igs", config, true)
    }

    static _pushMsg: IPushMsg[] = []
    static addPushMsg(msg: IPushMsg) {
        if (!msg.msg) {
            return
        }
        // if (!this._pushMsg) this._pushMsg = []
        Data._pushMsg.push(msg)
        if (Data._pushMsg.length > 10) {
            Data._pushMsg.shift()
        }
        // cc.log("_pushMsg = " + Data._pushMsg.length)
    }

    static getPushMsg(): IPushMsg {
        // cc.log("_pushMsg = " + Data._pushMsg.length)
        return Data._pushMsg.shift()
    }

    static pushMsgCount(): number {
        // cc.log("pushmsg count = " + Data._pushMsg.length)
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
            try {
            return JSON.parse(item)
            } catch {
                return null
            }
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

    // export let Bundle = Data.Bundler
    // export let OnlineParam = Data.OnlineParam
    // export let Config = Data.Config
    // export let saveConfig = Data.saveConfig
    // export let addPushMsg = Data.addPushMsg
    // export let getPushMsg = Data.getPushMsg
    // export let PushMsgCount = Data.pushMsgCount
    export let data = Data
}