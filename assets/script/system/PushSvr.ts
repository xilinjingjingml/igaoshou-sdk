import push = require("../proto/push")
import { GateMgr } from "../base/GateMgr"
import { DataMgr } from "../base/DataMgr"
import { Constants } from "../constants"
import { EventMgr } from "../base/EventMgr"
import { User } from "./User"
import { Helper } from "./Helper"

const PUSH_SVR = "push_svr"

let _init = false

export namespace PushSvr {
    
    export function Register() {
        if (!this._init) {
            GateMgr.setProto("pushsvr", push)
            EventMgr.on("RegisterRsp", RegisterRspHandler, PUSH_SVR)
            EventMgr.on("UpdateItemNot", UpdateItemNotHandler, PUSH_SVR)
            EventMgr.on("MsgPushNot", MsgPushNotHandler, PUSH_SVR)

            EventMgr.on("SOCKET_CLOSE", _pushSvrLogin, PUSH_SVR)
            this._init = true
        }

        _pushSvrLogin()
    }

    function _pushSvrLogin() {
        if (DataMgr.Config) {
            GateMgr.login(DataMgr.Config.hostname, null, "/websocket", _RegisterReq)
        }        
    }

    function _RegisterReq() {
        let openid = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey())
        GateMgr.notify("igaoshou-push-srv.Push.Register", "RegisterReq", {
           openid: openid.openid,
           token: openid.token,
           cliVer: Constants.versionCode,
        })
    }

    export function RegisterRspHandler(msg) {
        cc.log(msg)
    }

    export function UpdateItemNotHandler(msg) {
        User.GetPlyDetail()
        User.UpdateItem()
    }

    export function MsgPushNotHandler(msg) {
        msg = msg.packet
        // console.log(msg)
            
        let data: IPushMsg = {
            type: msg.showType,
            openUri: msg.openUri,
            msg: msg.msg
        }
        DataMgr.addPushMsg(data)
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.MSG_PUSH_NOT, msg)
    }

    function Ping() {
        GateMgr.notify("igaoshou-push-srv.Push.Heartbeat", "Ping", {
            now: Date.now()
        })
    }

    function PongHandle(msg) {
        msg = msg.packet 
        cc.log(msg)
    }

    // message Ping {
    //     int64 now = 1; // 客户端发送时间
    //   }
      
    //   message Pong {
    //     int64 now = 1; // 客户端发送时间
    //     int64 send = 2; // 服务端发送时间
    //   }
}