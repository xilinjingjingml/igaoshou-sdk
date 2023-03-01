import BaseUI from "../../../../start/script/base/BaseUI";
import { Helper } from "../../../../start/script/system/Helper";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { User } from "../../../../start/script/data/User";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { AccountSrv } from "../../../../start/script/system/AccountSrv";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PhoneBind extends BaseUI {
    _phone:string = ""
    _timeLabel:cc.Node = null
    onOpen() {
        this._timeLabel = this.getNode("node/bind/btnGetCode/Background/Label")
        this.initData()
        this.initButton()     
        this.initEvent()

        
        Helper.reportEvent("匹配-11.1、进入手机绑定界面")
    }

    initData(){
        let phone:string = DataMgr.getData(Constants.DATA_DEFINE.BIND_PHONE + User.OpenID) || ""
        if(!phone || phone.length == 0){
            phone = User.Data.metaData["phone"]
        }
        if(phone && phone.length > 0){
            this.setActive("node/bind", false)
            this.setActive("node/bindSuccess", true)
            this.setLabelValue("node/bindSuccess/phoneNum", phone.substring(0, 3) + "****" + phone.substring(phone.length-4, phone.length))
        }
    }

    initButton(){
        this.setButtonClick("node/title/btnClose", ()=>{
            this.closeAni()
        })

        this.setButtonClick("node/bind/btnBind", ()=>{
            this.onPressBind()
        })

        this.setButtonClick("node/bind/btnGetCode", ()=>{
            this.onPressGetCode()
        })

        this.setButtonClick("node/bindSuccess/btn", ()=>{
            this.close()
        })

        this.setButtonClick("node/msg/btn", ()=>{
            this.closeAni()
        })
    }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.PHONE_BIND_SUCCESS, ()=>{
            this.param.btn = null
            DataMgr.setData(Constants.DATA_DEFINE.BIND_PHONE + User.OpenID, this._phone, true)
            this.initData()
        }, this)
        EventMgr.on(Constants.EVENT_DEFINE.PHONE_BIND_FAILED, this.onLoginError, this)
    }

    onPressGetCode() {
        let phone = this.getNodeComponent("node/bind/phone", cc.EditBox).string
        if (!Helper.checkPhoneNum(phone)) {
            Helper.OpenTip("您的手机号码有误")
            return
        }

        AccountSrv.getPhoneCode(phone, () => this.updateCodeTime())
    }

    onPressBind() {
        let phone = this.getNodeComponent("node/bind/phone", cc.EditBox).string
        if (!Helper.checkPhoneNum(phone)) {
            Helper.OpenTip("您的手机号码有误")
            return
        }

        let code = this.getNodeComponent("node/bind/password", cc.EditBox).string
        if (code.length !== 6) {
            Helper.OpenTip("验证码错误")
            return 
        }


        // let authInfo = {
        //     phone: phone,
        //     code: code,
        // }

        let authInfo = {
            relogin: true,
            authType: Constants.LOGIN_TYPE.BING_PHONE,
            phone: phone,
            code: code,
            password: ""
        }

        this.setButtonInfo("node/bind/btnBind", { interactable: false })
        this.setButtonInfo("node/bind/btnGetCode", { interactable: false })
        
        this._phone = phone
        AccountSrv._bindPhone(authInfo)
    }

    onLoginError(msg) {
        if (msg?.errMsg) {
            let err = Helper.ParseJson(msg.errMsg)            
            if (err.detail === "code expire") {
                Helper.OpenTip("验证码错误")
            } else if (err.detail === "account is exists") {
                this.setMsgContent("该手机号已绑定其它帐号")
            } else{
                Helper.OpenTip(err.detail)
            }
        }

        this.setButtonInfo("node/bind/btnBind", { interactable: true })
        this.setButtonInfo("node/bind/btnGetCode", { interactable: true })
        cc.Tween.stopAllByTarget(this._timeLabel)
        this._timeLabel.getComponent(cc.Label).string = "发送验证码"
    }

    updateCodeTime() {
        let time = DataMgr.getData<number>(Constants.DATA_DEFINE.PHONE_CODE_TIME)
        if (time <= 0)
            return

        this.setButtonInfo("node/bind/btnGetCode", { interactable: false })
        cc.tween(this._timeLabel)
            .delay(1)
            .repeat(Math.floor((time - Date.now()) / 1000),
                cc.tween()
                    .call(() => { this._timeLabel.getComponent(cc.Label).string = Math.max(0, Math.floor((time - Date.now()) / 1000)) + "s后可重发" })
                    .delay(1)
            )
            .call(() => {
                this._timeLabel.getComponent(cc.Label).string = "发送验证码"
                this.setButtonInfo("node/bind/btnGetCode", { interactable: true })
                DataMgr.setData(Constants.DATA_DEFINE.PHONE_CODE_TIME, 0)
            })
            .start()
    }

    closeAni() {
        let btn: cc.Node = this.param.btn
        if (btn) {
            let pos = this.node.convertToNodeSpaceAR(btn.convertToWorldSpaceAR(cc.Vec3.ZERO))
            this.runTween("node",
                cc.tween()
                    .to(.3, { position: pos, scale: .05 })
                    .delay(0)
                    .call(() => this.close())
            )
        } else {
            this.close()
        }

    }

    setMsgContent(text:string){
        this.setLabelValue("node/title/title", "提示")
        this.setActive("node/title/btnClose", false)
        this.setActive("node/bind", false)
        this.setActive("node/bindSuccess", false)
        this.setActive("node/msg", true)
        this.setLabelValue("node/msg/text", text)
    }
}
