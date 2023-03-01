import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { Account } from "../../system/Account";
import { UIMgr } from "../../base/UIMgr";
import { Helper } from "../../system/Helper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginScene extends BaseUI {

    _loginPhone: boolean = false

    onOpen() {
        this.initEvent()
        this.initData()
    }

    initEvent() {
        this.setButtonClick("account/phone/input/btnGetCode", this.onPressGetCode.bind(this))

        this.setButtonClick("account/btnLogin", this.onPressLogin.bind(this))
        this.setButtonClick("account/btnSubmit", this.onPressSubmit.bind(this))
    }

    initData() {
        let type = (undefined === this.param.type || null === this.param.type) ? 0 : this.param.type
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        this._loginPhone = DataMgr.Config.platId !== 3
        this.node.children[0].children.forEach(i => i.active = false)
        if (type === 0) {
            this.setActive("account/phone", this._loginPhone)
            this.setActive("account/code", this._loginPhone)
            this.setActive("account/email", !this._loginPhone)            
            this.setActive("account/password", true)
            this.setActive("account/btnLogin", true)
        } else if (type === 1) {
            this.setActive("account/curPassword", true)
            this.setActive("account/newPassword", true)
            this.setActive("account/againPassword", true)
            this.setActive("account/btnSubmit", true)
        }

        this.updateCodeTime()
    }

    onPressGetCode() {
        let phone = this.getNodeComponent("account/phone/input", cc.EditBox).string
        if (!phone || phone.length != 11) {
            this.setLabelValue("account/phone/msg", "您的手机号码有误!")
            return
        }
        this.setLabelValue("account/phone/msg", "")
        Account.getPhoneCode(phone, () => this.updateCodeTime())
    }

    onPressLogin() {
        let pass = this.getNodeComponent("account/password/input", cc.EditBox).string
        if (!pass || pass.length < 6 || pass.length > 25) {
            this.setLabelValue("account/password/msg", "密码需要6-25位")
            return
        }

        let authType = {}
        if (this._loginPhone) {
            authType = {
                relogin: true,
                authType: Constants.LOGIN_TYPE.LOGIN_PHONE,
                phone: this.getNodeComponent("account/phone/input", cc.EditBox).string,
                code: this.getNodeComponent("account/code/input", cc.EditBox).string,
                password: pass,
            }
        } else {
            authType = {
                relogin: true,
                authType: Constants.LOGIN_TYPE.LOGIN_EMAIL,
                email: this.getNodeComponent("account/email/input", cc.EditBox).string,
                password: pass,
            }
        }

        Account.login(authType, () => {
            this.close()
            UIMgr.CloseUI("component/Personal/MyAccountEntry")
        })
    }

    onPressSubmit() {
        let newPass = this.getNodeComponent("account/newPassword/input", cc.EditBox).string
        if (!newPass || newPass.length < 6 || newPass.length > 25) {
            this.setLabelValue("account/newPassword/msg", "您的密码长度有误, 需要6-25位!")
            return
        }

        let againPass = this.getNodeComponent("account/againPassword/input", cc.EditBox).string
        if (newPass !== againPass) {
            this.setLabelValue("account/againPassword/msg", "您的两次密码不相同")
            return
        }

        // Account.login({
        //     authType: Constants.LOGIN_TYPE.LOGIN_PHONE,
        //     phone: this.getNodeComponent("account/phone/input", cc.EditBox).string,
        //     phone_code: this.getNodeComponent("account/code/input", cc.EditBox).string,
        //     password: newPass,
        // }, () => {
            this.close()
        // })
    }

    updateCodeTime() {
        let time = DataMgr.getData<number>(Constants.DATA_DEFINE.PHONE_CODE_TIME)
        if (time <= 0)
            return
            
        let label = this.getNodeComponent("account/phone/input/btnGetCode/Background/Label", cc.Label)
        cc.tween(label)
            .delay(1)
            .call(() => this.setButtonInfo("account/phone/input/btnGetCode", {interactable: false}))
            .repeat(Math.floor((time - Date.now()) / 1000),
                cc.tween()                    
                    .call(() => { label.string = "(" + Math.max(0, Math.floor((time - Date.now()) / 1000)) + ")" })
                    .delay(.5)
            )
            .call(() => {
                this.setLabelValue("account/phone/input/btnGetCode/Background/Label", "发送验证码")
                this.setButtonInfo("account/phone/input/btnGetCode", {interactable: true})
                DataMgr.setData(Constants.DATA_DEFINE.PHONE_CODE_TIME, 0)
            })
            .start()
        
    }

}
