import BaseUI from "../../../../start/script/base/BaseUI";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { AccountSrv } from "../../../../start/script/system/AccountSrv";
import { Helper } from "../../../../start/script/system/Helper";
import { DataMgr } from "../../../../start/script/base/DataMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PhoneLogin extends BaseUI {

    onOpen() {        
        this.initEvent()
        this.node.scale = cc.winSize.width / 720
    }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.LOGIN_FAILED, this.onLoginError, this)
        EventMgr.once(Constants.EVENT_DEFINE.LOGIN_SUCCESS, this.close, this)
    }

    onPressBack() {
        this.close()
    }

    onPressGetCode() {
        let phone = this.getNodeComponent("node/editPhone", cc.EditBox).string
        if (!this.checkPhoneNumber(phone)) {
            this.setLabelValue("node/msg", "您的手机号码有误")
            return
        }

        this.setLabelValue("node/msg", "")
        AccountSrv.getPhoneCode(phone, () => this.updateCodeTime())
    }

    onPressLogin() {
        let phone = this.getNodeComponent("node/editPhone", cc.EditBox).string
        if (!this.checkPhoneNumber(phone)) {
            this.setLabelValue("node/msg", "您的手机号码有误")
            return
        }

        let code = this.getNodeComponent("node/editCode", cc.EditBox).string
        if (code.length !== 6) {
            this.setLabelValue("node/msg", "验证码错误")
            return 
        }

        let authInfo = {
            relogin: true,
            authType: Constants.LOGIN_TYPE.LOGIN_PHONE,
            phone: phone,
            code: code,
        }

        this.setButtonInfo("node/btnLogin", { interactable: false })
        this.setButtonInfo("node/btnBack", { interactable: false })
        AccountSrv._loginPhone(authInfo)
    }

    onLoginError(msg) {
        this.setLabelValue("node/msg", "手机登录错误")

        if (msg?.errMsg) {
            let err = Helper.ParseJson(msg.errMsg)
            if (err.code === 500) {
                if (err.detail === "code expire") {
                    this.setLabelValue("node/msg", "验证码错误")
                }
            } else {
                this.setLabelValue("node/msg", msg.errMsg)
            }
        }

        this.setButtonInfo("node/btnLogin", { interactable: true })
        this.setButtonInfo("node/btnBack", { interactable: true })
    }

    checkPhoneNumber(phone: string) {
        if (DataMgr.data.Config.env === 2) {
            if (!phone || phone.length == 0) {
                return false
            }
        } else {
            if (!phone || phone.length != 11) {
                return false
            }
        }

        return true
    }

    updateCodeTime() {
        let time = DataMgr.getData<number>(Constants.DATA_DEFINE.PHONE_CODE_TIME)
        if (time <= 0)
            return

        let label = this.getNodeComponent("node/btnGetCode/label", cc.Label)
        cc.tween(label)
            .delay(1)
            .call(() => this.setButtonInfo("node/btnGetCode", { interactable: false }))
            .repeat(Math.floor((time - Date.now()) / 1000),
                cc.tween()
                    .call(() => { label.string = Math.max(0, Math.floor((time - Date.now()) / 1000)) + "s后可重发" })
                    .delay(1)
            )
            .call(() => {
                label.string = "发送验证码"
                this.setButtonInfo("node/btnGetCode", { interactable: true })
                DataMgr.setData(Constants.DATA_DEFINE.PHONE_CODE_TIME, 0)
            })
            .start()
    }

}
