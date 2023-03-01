import { Helper } from "./Helper"
import { Constants } from "../igsConstants"
import { DataMgr } from "../base/DataMgr"
import { UIMgr } from "../base/UIMgr";
import { EventMgr } from "../base/EventMgr";

const LOAD_NOTICE = "api/mcbeam-version-api/config/loadNotice"

export namespace NoticeSrv {
    let noticeData = null
    export function getNotice(param:any, callback?: Function) {
        if(noticeData){
            callback && callback(noticeData)
            return
        }

        Helper.PostHttp(LOAD_NOTICE, null, param, (res) => {
            console.log("LOAD_NOTICE", res)
            if (res && res.code == "00000" && res.notice) {
                res.notice = Helper.ParseJson(res.notice, "getNotice")
                noticeData = res
            }            
            callback && callback(noticeData)
        })
    }
}