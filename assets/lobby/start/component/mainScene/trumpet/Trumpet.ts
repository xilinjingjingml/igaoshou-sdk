import BaseUI from "../../../script/base/BaseUI";
import { EventMgr } from "../../../script/base/EventMgr";
import { Constants } from "../../../script/igsConstants";
import { Helper } from "../../../script/system/Helper";
import { PluginMgr } from "../../../script/base/PluginMgr";
import { DataMgr } from "../../../script/base/DataMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TrumpetEntry extends BaseUI {

    _msgNode: cc.Node = null
    _showTrumpet: boolean = false
    _showAni: boolean = false
    _showMsg: boolean = false

    start() {
        this.initNode()
        this.initEvent()
        this.updateMsg()

        // console.log("===TrumpetEntry onOpen==")
    }

    onClose() {

    }

    onDisable() {
        cc.log("================trumpet disable")
    }

    onEnable() {
        cc.log("=================trumpet enable")
    }

    initNode() {
        this._msgNode = this.getNode("item")
        this._msgNode.active = false

        this.node.position = cc.v3(0, 131)
        this.node.opacity = 0
    }

    initEvent() {
            EventMgr.on(Constants.EVENT_DEFINE.MSG_PUSH_NOT, this.updateMsg, this)
        }

    updateMsg() {        
        if (!Helper.isNative() && (cc.sys.OPPO_GAME == cc.sys.platform || cc.sys.VIVO_GAME == cc.sys.platform)) {
            console.log("updateMsg return ")
            return
        } else if (cc.sys.BYTEDANCE_GAME === cc.sys.platform || PluginMgr.isH52345Game()) {
            return
        } else if (Helper.isIosAudit()){
            return
        } 
        // console.log("===TrumpetEntry updateMsg==")
        if (DataMgr.data.pushMsgCount() <= 0) {
            if (this._showTrumpet) {
                this.trumpetHideAni()
            }
            return
        }

        let showMsg = () => {
            let msg = DataMgr.data.getPushMsg()
            if (msg) {
                this.msgAni(msg)
            }
        }

        if (!this._showAni && !this._showTrumpet) {
            this.trumpetShowAni(showMsg)
        } else if (!this._showMsg) {
            showMsg()
        }
    }

    trumpetShowAni(callback: Function) {
        // console.log("===TrumpetEntry trumpetShowAni==")
        if (this._showTrumpet) {
            callback()
            return
        }

        if (!this._showAni) {
            this._showAni = true
            cc.tween(this.node)
                .to(.3, { opacity: 255, position: cc.v3(0, 188) })
                .call(() => {
                    this._showAni = false
                    this._showTrumpet = true
                    callback()
                })
                .start()
        }
    }

    trumpetHideAni() {
        // console.log("===TrumpetEntry trumpetHideAni==")
        if (!this._showAni) {
            this._showAni = true
            cc.tween(this.node)
                .to(.3, { opacity: 0, position: cc.v3(0, 181) })
                .call(() => {
                    this._showAni = false
                    this._showTrumpet = false
                })
                .start()
        }
    }

    msgAni(msg: IPushMsg) {
        // console.log("===TrumpetEntry msgAni==")
        if (this._showMsg) {
            return
        }
        this._showMsg = true

        let newNode = cc.instantiate(this._msgNode)
        let str = "<color=#ffffff>" + msg.msg.substring(0, 4) + "</c> "
        if (msg.msg.indexOf("成功兑换") != -1) {
            let idx = msg.msg.indexOf("成功兑换")
            str += "<b><color=#ffd801>" + msg.msg.substring(4, idx) + "</c></b> "
            str += "<color=#ffffff>" + msg.msg.substring(idx, idx + 4) + "</c> "
            str += "<b><color=#ffd801>" + msg.msg.substring(idx + 4) + "</c></b> "
        } else if (msg.msg.indexOf("观看免费") != -1) {
            let idx = msg.msg.indexOf("观看免费")
            str += "<b><color=#ffd801>" + msg.msg.substring(4, idx) + "</c></b> "
            str += "<color=#ffffff>" + msg.msg.substring(idx, idx + 6) + "</c> "
            str += "<b><color=#ffd801>" + msg.msg.substring(idx + 6) + "</c></b> "
        } else if (msg.msg.indexOf("在免费抽奖") != -1) {
            let idx = msg.msg.indexOf("在免费抽奖")
            str += "<b><color=#ffd801>" + msg.msg.substring(4, idx) + "</c></b> "
            str += "<color=#ffffff>" + msg.msg.substring(idx, idx + 5) + "</c> "
            str += "<b><color=#ffd801>" + msg.msg.substring(idx + 5) + "</c></b> "
        }
        // str += "长度测试长度测试长度测试长度测试长度测试长度测试长度测试长度测试长度测试长度测试长度测试长度测试长度测试"
        this.setRichTextValue("msg", newNode, str)
        newNode.parent = this.node
        // newNode.position = cc.v3(cc.winSize.width / 2 - 25, -this.node.height + 2)
        newNode.opacity = 0
        newNode.active = true

        Helper.DelayFun(() => {
            if (newNode.width >= cc.winSize.width - 50) {
                cc.tween(newNode)
                    .set({ position: cc.v3(-cc.winSize.width / 2 + 25, -this.node.height * 1.5) })
                    .to(.5, { opacity: 255, position: cc.v3(-cc.winSize.width / 2 + 25, -this.node.height / 2) })
                    .delay(3)
                    .to(newNode.width / 200, { position: cc.v3(-cc.winSize.width / 2 - newNode.width, -this.node.height / 2) })
                    .to(.2, { opacity: 2 })
                    .call(() => Helper.DelayFun(() => newNode.removeFromParent(true), .1))
                    .call(() => {
                        this._showMsg = false
                        this.updateMsg()
                    })
                    .start()
            } else {
                cc.tween(newNode)
                    .set({ position: cc.v3(-newNode.width / 2, -this.node.height * 1.5) })
                    .to(.5, { opacity: 255, position: cc.v3(-newNode.width / 2, -this.node.height / 2) })
                    .delay(3)
                    .to(newNode.width / 200, { position: cc.v3(-cc.winSize.width / 2 - newNode.width, -this.node.height / 2) })
                    .to(.2, { opacity: 2 })
                    .call(() => Helper.DelayFun(() => newNode.removeFromParent(true), .1))
                    .call(() => {
                        this._showMsg = false
                        this.updateMsg()
                    })
                    .start()
            }
        }, 0.1)
    }
}
