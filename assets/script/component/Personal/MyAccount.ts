import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { Helper } from "../../system/Helper";
import { LocalMgr } from "../../base/LocalMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MyAccount extends BaseUI {

    _phone: string | null = null
    _email: string | null = null
    onOpen() {
        this.initEvent()
        this.initData()
    }

    initEvent() {
        DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, this.updateData, this)
        this.setButtonClick("account/avatar/btnOpen", this.onPressAccount.bind(this))
        this.setButtonClick("account/name/btnOpen", this.onPressAccount.bind(this))
        this.setButtonClick("account/email/btnOpen", this.onPressSaveAccount.bind(this, 1))
        this.setButtonClick("account/phone/btnOpen", this.onPressSaveAccount.bind(this, 0))

        this.setButtonClick("btns/btnChangePassword", this.onPressChangePassword.bind(this))
        this.setButtonClick("btns/btnChangeAccount", this.onPressLogin.bind(this))
        this.setButtonClick("btns/btnExitAccount", this.onPressExitAccount.bind(this))
        this.setButtonClick("btns/btnSaveAccount", this.onPressSaveAccount.bind(this))
        this.setButtonClick("btns/btnLogin", this.onPressLogin.bind(this))

        //foreign
        this.setButtonClick("foreign/personal/btn_copyUID", this.onPressCopy.bind(this))
        this.setButtonClick("foreign/personal/btn_changeName", this.onPressChangeUserInfo.bind(this))
        this.setButtonClick("foreign/phone", this.onPressPhone.bind(this))
        this.setButtonClick("foreign/email", this.onPressEmail.bind(this))
        this.setButtonClick("foreign/facebook/switch", this.onPressBindFacebook.bind(this))
        this.setButtonClick("foreign/apple/switch", this.onPressBindApple.bind(this))
        this.setButtonClick("foreign/switchAccounts/btn", this.onPressSwitchAccounts.bind(this))
        this.setButtonClick("foreign/btn_SaveAccount", this.onPressSaveAccount.bind(this))
        this.setButtonClick("foreign/btn_login", this.onPressLogin.bind(this))

        DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, this.initData, this)
    }

    initData() {
        this.updateData()
    }

    updateData(){
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        this._phone = user.metaData["phone"]
        this._email = user.metaData["email"]
        console.log("jin---metaData: ", user, user.metaData, this._phone, this._email ,DataMgr.Config.platId)

        //TODO 根据DataMgr.Config.platId区分样式
        if(DataMgr.Config.platId !== 5){ //TODOT 3
            this.setActive("account", true)
            this.setActive("btns", true)
            if (this._phone || this._email) {
                this.setSpriteFrame("account/avatar/icon", user.avatar)
                this.setLabelValue("account/name/value", user.userName)
                this.setLabelValue("account/phone/value", this._phone)
                this.setLabelValue("account/email/value", this._email)

                this.setActive("account/email", DataMgr.Config.platId === 3)
                this.setActive("account/phone", DataMgr.Config.platId !== 3)

                this.setActive("btns/btnChangePassword", true)
                this.setActive("btns/btnChangeAccount", true)
                this.setActive("btns/btnSaveAccount", false)
                this.setActive("btns/btnLogin", false)
            } else {
                this.setActive("account", false)

                this.setActive("btns/btnChangePassword", false)
                this.setActive("btns/btnChangeAccount", false)
                this.setActive("btns/btnSaveAccount", true)
                this.setActive("btns/btnLogin", true)
            }

            this.setActive("account/avatar/btnOpen", false)
            this.setActive("account/name/btnOpen", false)
            this.setActive("account/email/btnOpen", false)
            this.setActive("account/phone/btnOpen", false)

            this.setActive("btns/btnExitAccount", false)
        }else{
            this.setActive("foreign", true)
            if (this._phone || this._email) {
                this.setActive("foreign/btn_SaveAccount", false)
                this.setActive("foreign/btn_login", false)
                //node_avater
                let IPlayerData = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
                this.setLabelValue("foreign/personal/name", IPlayerData.userName)
                this.setSpriteFrame("foreign/personal/node_avater/avater", IPlayerData.avatar)
                //uid
                this.setLabelValue("foreign/personal/UID", "UID: " + IPlayerData.userId)
                //nationalFlag
                // this.setSpriteFrame("foreign/personal/nationalFlag", IPlayerData.avatar)
                //TODO phoneNumber Email
                if(this._phone && this._phone.length > 0){
                    this.setLabelValue("foreign/phone/lbl_Link", this._phone)
                }else{
                    this.setLanguageId("foreign/phone/lbl_Link","Account_1005")
                }
                if(this._email && this._email.length > 0){
                    this.setLabelValue("foreign/email/lbl_Link", this._email)
                }else{
                    this.setLanguageId("foreign/email/lbl_Link","Account_1005")
                }
                //TODO facebook apple 绑定需要填数据

                this.setActive("foreign/facebook/switch/guan", false)
                this.setActive("foreign/apple/switch/guan", false)
            }else{
                this.setActive("foreign/personal", false)
                this.setActive("foreign/phone", false)
                this.setActive("foreign/email", false)
                this.setActive("foreign/node_lbl", false)
                this.setActive("foreign/facebook", false)
                this.setActive("foreign/apple", false)
                this.setActive("foreign/switchAccounts", false)
            }
            
        }
    }

    onPressAccount() {

    }

    onPressChangePassword() {
        Helper.OpenPageUI("component/Personal/LoginEntry", "修改账号", { type: 1 })
    }

    onPressExitAccount() {

    }

    onPressSaveAccount(type: number = null) {
        Helper.OpenPageUI("component/Personal/SaveAccountSelect", LocalMgr.GetMessage("Account_1008"), {})
    }

    onPressLogin() {
        Helper.OpenPageUI("component/Personal/SelectLoginMode", "", {})
    }

    onPressCopy() {
        console.log("jin---onPressCopy")
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (user)
            Helper.copyToClipBoard(user.userId)
    }

    //TODO 修改头像昵称(与个人主页用一个)
    onPressChangeUserInfo(){
        console.log("jin---onPressChangeUserInfo")
        Helper.OpenPageUI("component/Personal/ChangeNameAvatar", "", {})
    }

    onPressPhone(){
        //TODO 是否已有信息 1.有信息 2.没有信息
        if(this._phone && this._phone.length > 0){
            //TODO 修改手机号
            Helper.OpenPageUI("component/Personal/BindAccountEntry", LocalMgr.GetMessage("Email_1011"), { type: 5 })
        }else{
            Helper.OpenPageUI("component/Personal/BindAccountEntry", LocalMgr.GetMessage("Save_Account_1005"), { type: 3 })//TODOT 3
        }
        
    }

    onPressEmail(){
        if(this._email && this._email.length > 0){
            //TODO 修改邮箱
            Helper.OpenPageUI("component/Personal/BindAccountEntry", LocalMgr.GetMessage("Email_1011"), { type: 7 })
        }else{
            Helper.OpenPageUI("component/Personal/BindAccountEntry", LocalMgr.GetMessage("Email_1001"), { type: 1 }) //TODOT 1
        }
    }
    //TODO 
    onPressBindFacebook(){
        console.log("jin---onPressBindFacebook")
    }
    //TODO 
    onPressBindApple(){
        console.log("jin---onPressBindApple")
    }
    //TODO 切换账号
    onPressSwitchAccounts(){
        console.log("jin---onPressSwitchAccounts")
        Helper.OpenPageUI("component/Personal/SelectLoginMode", "", {})
    }
}
