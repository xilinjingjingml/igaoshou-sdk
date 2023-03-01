import { Helper } from "./Helper"
import { DataMgr } from "../base/DataMgr"
import { HttpMgr } from "../base/HttpMgr";

export namespace AuthenticationSrv {

    const CHECK = "igaoshou-anti-addiction-srv/antiAddiction/check"
    const QUERY = "igaoshou-anti-addiction-srv/antiAddiction/query"

    export function check(userData:any, body: any, callback?: Function) {
        let host = DataMgr.data.Config.hostname
        // host = host.replace("igaoshou.", "mcbeam.")
        let head = {}
        if (userData && userData.token) {
            let authorization = Helper.sign(body, userData.token)
            head = {
                "User-Token": userData.token,
                "User-Authorization": authorization
            }
        }
        HttpMgr.post("https://" + host + "/" + CHECK, head, null, body, (res) => {        
            cc.log("CHECK", res)
            if (res) {
                callback && callback(res)
            }
        })
    }

    export function query(userData:any, body: any, callback?: Function) {
        let host = DataMgr.data.Config.hostname
        // host = host.replace("igaoshou.", "mcbeam.")
        let head = {}
        if (userData && userData.token) {
            let authorization = Helper.sign(body, userData.token)
            head = {
                "User-Token": userData.token,
                "User-Authorization": authorization
            }
        }
        HttpMgr.post("https://" + host + "/" + QUERY, head, null, body, (res) => {      
            cc.log("QUERY", res)
            if (res) {
                callback && callback(res)
            }
        })
    }
}
