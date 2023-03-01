import { Helper } from "../system/Helper"
import { DataMgr } from "./DataMgr"
import { HttpMgr } from "./HttpMgr"

let _localSetting = null
let _localCode = null

let _phoneCountry = null
let _phoneAreaCode = null


const GET_LANGUAGE_SETTINGS = ""

export namespace LocalMgr {

    export function SetLanguage(local: string) {
        _localCode = local
    }

    export function GetLanguage(): string {
        return _localCode
    }

    export function Init() {
        if (!CC_EDITOR) {
            DataMgr.Bundle.load("language", (err, res) => {
                formatData(res)
            })

            DataMgr.Bundle.load("phoneRegion", (err, res) => {
                formaDate_phoneRegion(res)
                // console.log("jin---_phoneRegionSetting1: ", _phoneRegionSetting)
            })

            // let nativeUrl = DataMgr.getData<string>(_localCode)
            // if (nativeUrl) {
            //     callback && callback(cc.assetManager.cacheManager.getCache(nativeUrl))
            //     return
            // }


            // Helper.GetHttp(GET_LANGUAGE_SETTINGS, { local: _localCode }, (res) => {
            //     if (res) {
            //         cc.assetManager.loadRemote(res.url, (err, settings) => {
            //             if (!err && settings) {
            //                 DataMgr.setData(_localCode, res.url, true)
            //                 formatData(settings)
            //                 callback && callback()
            //             }
            //         })
            //     }
            // })
        } else {
            cc.loader.load({ uuid: "4a492f04-490d-4e4b-9c8e-d3e6dd70f39f" }, (err, res) => {
                if (!err) {
                    formatData(res)
                }
            })

            cc.loader.load({ uuid: "67cee5fc-540d-405c-8678-6aa61908abaf" }, (err, res) => {
                if (!err) {
                    formaDate_phoneRegion(res)
                    // console.log("jin---_phoneRegionSetting2: ", _phoneRegionSetting)
                }
            })
        }
    }

    function formatData(data) {
        _localSetting = {}
        let list = Helper.CSVToArray(data, ",")
        for (let i = 1; i < list.length; i++) {
            _localSetting[list[i][0]] = list[i][1]
        }
    }

    export function GetMessage(msgId: string, param?: any[]) {
        let msg = _localSetting ? _localSetting[msgId] : ""
        let ret = /#([0-9]*)#/.exec(msg)
        while (ret) {
            msg = msg.replace("#" + ret[1] + "#", (param[Number(ret[1]) - 1] || ""))
            ret = /#([0-9]*)#/.exec(msg)
        }
        return msg
    }

    function formaDate_phoneRegion(data){
        _phoneCountry = {}
        _phoneAreaCode = {}
        let list = Helper.CSVToArray(data, ",")
        for (let i = 1; i < list.length; i++) {
            _phoneCountry[i-1] = [list[i][0], list[i][3]]
            // _phoneAreaCode[list[i][0]] = list[i][3]
        }
    }

    export function GetMessage_phoneRegion() {//msgId: string, param?: any[]
        // let phoneCountry= _phoneCountry ? _phoneCountry[msgId] : ""
        // let phoneAreaCode = _phoneAreaCode ? _phoneAreaCode[msgId] : ""
        // let ret = /#([0-9]*)#/.exec(msg)
        // while (ret) {
        //     msg = msg.replace("#" + ret[1] + "#", (param[Number(ret[1]) - 1] || ""))
        //     ret = /#([0-9]*)#/.exec(msg)
        // }
        return _phoneCountry
    }


}