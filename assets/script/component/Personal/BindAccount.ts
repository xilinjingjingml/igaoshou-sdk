import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { Account } from "../../system/Account";
import { Helper } from "../../system/Helper";
import { UIMgr } from "../../base/UIMgr";
import { LocalMgr } from "../../base/LocalMgr";

const { ccclass, property } = cc._decorator;

/**
 * 界面状态：
 * 1.注册邮箱 66
 * 2.验证邮箱
 * 3.手机send code 666
 * 4.手机号、验证码提交后台 66
 * 5.换绑手机-向老手机发送验证码（只是提示文字不同）
 * 6.更换邮箱
 **/
//1.验证邮箱 2.忘记密码

enum viewState {
    LOGIN_EMAIL_VIEW = 1,
    VERIFY_EMAIL_VIEW,          //验证邮箱
    SEND_CODE_VIEW,             //绑定（注册）
    SUBMIT_CODE_VIEW,           //绑定（注册）
    CHANGE_PHONE_VIEW,          //其实就是 SEND_CODE_VIEW（改变了提示句）
    CHANGE_PHONE_SUBMIT_CODE_VIEW,
    CHANGE_EMAIL_VIEW,          //没有邮箱验证过得邮箱，可以直接替换
    LOGIN_IN_WITH_EMAIL,
    LOGIN_IN_WITH_PHONE,        //9
    RETRIEVE_PASSWORD,          //1.邮箱登陆忘记密码 2.主动修改密码
    LOGIN_IN_WITH_PHONE_CODE    //登陆 11
}

@ccclass
export default class BindAccount extends BaseUI {

    _bindPhone: boolean = false
    _foreign: boolean | null = null
    _PhonePreNumState: boolean | null = null
    _curPrePhoneNumIndex: number | null = null

    onOpen() {
        this.initEvent()
        this.initData()

        this.showPhonePreName(false)
    }

    initEvent() {
        this.setButtonClick("content/phone/input/btnGetCode", this.onPressGetCode.bind(this))
        this.setButtonClick("submit/btnSubmit", this.onPressBind.bind(this))

        //SEND AGAIN
        this.setButtonClick("foreign/node_sendAgain/btn_sendAgain", this.onPressSendAgainEmail.bind(this))
        //onPressPhonePreNum
        this.setButtonClick("foreign/phoneNum/btn_phonePreNum", this.onPressPhonePreNum.bind(this))
        this.setButtonClick("phonePreNum1/btn_cancel", this.cancelPhonePreNum.bind(this))
        this.setButtonClick("phonePreNum1/btn_Ok", this.changePhonePreNum.bind(this))
        this.setButtonClick("foreign/node_email_password/btn_signUpEmail", this.onPressSignUpEmail.bind(this))
        this.setButtonClick("foreign/node_email_password/btn_forgotPassword", this.onPressForgotPasswordView.bind(this))
        this.setButtonClick("foreign/node_login/btn_login", this.onPressLoginView.bind(this))

        //监听scrollView滑动
        let scrollView = this.getNode("phonePreNum1/scrollView")
        scrollView.on("scroll-ended", () => {
            console.log("jin---scroll-ended")
            this.setItemPos()
         })
    }

    initData() {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        this._foreign = DataMgr.Config.platId !== 3 //判断平台 TODOT
        if(this._foreign){
            //国外
            this.setViewState(this.param.type)
        }else{
            //国内
            this._bindPhone = this.param.type == 0
            if(!this._foreign){
                this._bindPhone = true
            }
            this.setActive("content/phone", this._bindPhone)
            this.setActive("content/code", this._bindPhone)
            this.setActive("content/email", !this._bindPhone)
            this.setActive("content/password", !this._bindPhone)
            this.setActive("content/againPassword", !this._bindPhone)

            this.updateCodeTime()
        }
        
    }

    onPressGetCode(curViewState: number) {
        console.log("jin---onPressGetCode")
        this.setLabelValue("foreign/phoneNum/msg", "")
        let phone = this.getNodeComponent("foreign/phoneNum/input", cc.EditBox).string
        let phone_preNum = this.getNodeComponent("foreign/phoneNum/btn_phonePreNum/Background/Label", cc.Label).string
        if (!phone || phone.length != 11) {
            Helper.OpenTip(LocalMgr.GetMessage("Phone_1005"))
            return
        }
        //1.发送验证码 2.变换界面:1.修改手机号 2.绑定手机号 3.手机号登陆
        if(curViewState == viewState.CHANGE_PHONE_VIEW){
            Account.getPhoneCode(phone, (sta) => {
                if(!sta){
                    return
                }
                this.setViewState(viewState.CHANGE_PHONE_SUBMIT_CODE_VIEW)
                }
            )
        }else if(curViewState == viewState.SEND_CODE_VIEW){
            // TODOT 倒计时
            // this.setViewState(viewState.SUBMIT_CODE_VIEW)

            Account.getPhoneCode(phone, (sta) => {
                if(!sta){
                    return
                }
                this.setViewState(viewState.SUBMIT_CODE_VIEW)

            })
        }else if(curViewState == viewState.LOGIN_IN_WITH_PHONE){
            Account.getPhoneCode(phone, (sta) => {
                if(!sta){
                    return
                }
                this.setViewState(viewState.LOGIN_IN_WITH_PHONE_CODE)
            })
        }

    }

    //1.注册（绑定）手机号 2.手机号登陆  公用一个接口
    onPressSubmitCode(curViewState: number){
        console.log("jin---onPressSubmitCode")
        let phoneNum = this.getNodeComponent("foreign/phoneNum/input", cc.EditBox).string
        let code = this.getNodeComponent("foreign/code/input", cc.EditBox).string
        let phonePreNum = this.getNodeComponent("foreign/phoneNum/btn_phonePreNum/Background/Label", cc.Label).string

        console.log("jin---phoneNum, code", phoneNum, code)
        if(code && code.length > 0 && phoneNum && phoneNum.length > 0){

            let authInfo = null
            if(curViewState == viewState.LOGIN_IN_WITH_PHONE_CODE){
                authInfo = {
                    authType: Constants.LOGIN_TYPE.LOGIN_PHONE,
                    phone: phoneNum,//TODOT phonePreNum + 
                    code: code,
                }
            }else if(curViewState == viewState.SUBMIT_CODE_VIEW){
                authInfo = {
                    authType: Constants.LOGIN_TYPE.BING_PHONE,
                    phone: phoneNum,//TODOT phonePreNum + 
                    code: code,
                }
            }
            Account.login(authInfo, () => {
                UIMgr.CloseUI("component/Personal/MyAccountEntry")
                Helper.OpenPageUI("component/Personal/MyAccountEntry", LocalMgr.GetMessage("Sidebar_1006"), () => {
                    this.close()
                    UIMgr.CloseUI("component/Personal/SelectLoginMode")
                    UIMgr.CloseUI("component/Personal/SaveAccountSelect")
                })
            })
        }
        
        // //1.请求接口 2.手机号保存本地（替代后从新保存）3.跳转到已保存数据界面
        // Helper.OpenPageUI("component/Personal/MyAccountEntry", "我的账号", () => this.close()) //TODOT
    }

    onPressBind() {
        console.log("jin---onPressBind")
        this.setLabelValue("foreign/EmailNum/msg", "")
        this.setLabelValue("foreign/Password/msg", "")
        this.setLabelValue("foreign/RepeatThePassword/msg", "")
        //邮箱格式验证
        let emailNum = this.getNodeComponent("foreign/EmailNum/input", cc.EditBox).string
        let pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        let flag = pattern.test(emailNum)
        if(!flag){
            console.log("jin---Email 格式不对")
            Helper.OpenTip(LocalMgr.GetMessage("Email_1008"))

            return
        }
        // 字母、数字、特殊符号(空格也不允许)
        let pass = this.getNodeComponent("foreign/Password/input", cc.EditBox).string
        let reg =/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{6,20}$/;
        let flag_1 = reg.test(pass)
        let flag_2 = (pass.indexOf(" ") != -1)
        if(!flag_1 || flag_2){
            Helper.OpenTip(LocalMgr.GetMessage("Email_1009"))
            return
        }

        let againPass = this.getNodeComponent("foreign/RepeatThePassword/input", cc.EditBox).string
        if (pass !== againPass) {
            Helper.OpenTip(LocalMgr.GetMessage("Email_1010"))
            return
        }

        let authInfo = {}
        authInfo = {
            authType: Constants.LOGIN_TYPE.BIND_EMAIL,
            email: emailNum,
            password: pass,
        }
        // 1.从新进入游戏 2.将Email注册信息保存到本地
        Account.login(authInfo, () => {
            UIMgr.CloseUI("component/Personal/MyAccountEntry")
            Helper.OpenPageUI("component/Personal/MyAccountEntry", LocalMgr.GetMessage("Sidebar_1006"), () => {
                this.close()
                UIMgr.CloseUI("component/Personal/SelectLoginMode")
                UIMgr.CloseUI("component/Personal/SaveAccountSelect")
            })
        })

        return

    }

    onPressEmailComfirmed(){
        console.log("jin---onPressEmailComfirmed")
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        let emailNum = user.metaData["email"]
        if(!emailNum){
            console.log("jin---验证邮箱：", emailNum)
            Helper.OpenTip(LocalMgr.GetMessage("Email_1017"))
        }
        let data = {
            email: emailNum,
            type: 1 //1:验证；2.重置密码
        }
        //getSendEmailCode
        Account.getSendEmailCode(data, (res) => {
            if(res && res.code && res.code === "00000"){
                Helper.OpenTip(LocalMgr.GetMessage("Login_1012"))
            }else{
                Helper.OpenTip(res.msg)
            }
        })
    }

    onPressSendAgainEmail(){
        console.log("jin---onPressSendAgainEmail")
        this.setLabelValue("foreign/EmailNum/msg", "")
        this.setLabelValue("foreign/NewEmailNum/msg", "")
        //old
        let emailNum = this.getNodeComponent("foreign/EmailNum/input", cc.EditBox).string
        let pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        let flag = pattern.test(emailNum)
        if(!flag){
            console.log("jin---Email 格式不对")
            Helper.OpenTip(LocalMgr.GetMessage("Email_1008"))
            return
        }
        //new
        let newEmailNum = this.getNodeComponent("foreign/NewEmailNum/input", cc.EditBox).string
        let pattern_1 = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        let flag_new = pattern_1.test(newEmailNum)
        if(!flag_new){
            console.log("jin---new Email 格式不对")
            Helper.OpenTip(LocalMgr.GetMessage("Email_1008"))
            return
        }
    }

    //Phone-preNum
    onPressPhonePreNum(){
        console.log("jin---onPressPhonePreNum")
        this.showPhonePreName(true)
    }

    //new SUBMIT_CODE_VIEW
    onPressSubmitOldCode(){
        console.log("jin---onPressSubmitOldCode")
        // 1.请求接口（成功后跳转手机号注册） 2.
        this.setViewState(viewState.SEND_CODE_VIEW)
    }

    onPressChangeEmail(){//TODOT
        console.log("jin---onPressChangeEmail")
        
    }

    onPressLoginView(){
        console.log("jin---onPressLoginView")
        this.setViewState(viewState.LOGIN_IN_WITH_EMAIL)

    }

    onPressLoginEmail(){
        let emailNum = this.getNodeComponent("foreign/EmailNum/input", cc.EditBox).string
        let pass = this.getNodeComponent("foreign/Password/input", cc.EditBox).string

        if(emailNum === "" || pass === ""){
            Helper.OpenTip(LocalMgr.GetMessage("Email_1007"))
            return
        }

        let pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        let flag = pattern.test(emailNum)
        if(!flag){
            console.log("jin---Email 格式不对")
            //Email_1008
            Helper.OpenTip(LocalMgr.GetMessage("Email_1008"))
            return
        }

        // 字母、数字、特殊符号
        let reg =/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{6,20}$/;
        let flag_1 = reg.test(pass)
        if(!flag_1){
            Helper.OpenTip(LocalMgr.GetMessage("Email_1009"))
            return
        }

        let authType = {
            relogin: true,
            authType: Constants.LOGIN_TYPE.LOGIN_EMAIL,
            email: emailNum,
            password: pass,
        }
        Account.login(authType, () => {
            this.close()
            UIMgr.CloseUI("component/Personal/ExistingAccountEntry")
            UIMgr.CloseUI("component/Personal/MyAccountEntry")
            UIMgr.CloseUI("component/Personal/SelectLoginMode")
        })
    }

    //电话登陆
    onPressLoginPhone(){
        console.log("jin---onPressSubmitCode")
        let phoneNum = this.getNodeComponent("foreign/phoneNum/input", cc.EditBox).string
        let code = this.getNodeComponent("foreign/code/input", cc.EditBox).string
        let phonePreNum = this.getNodeComponent("foreign/phoneNum/btn_phonePreNum/Background/Label", cc.Label).string

        console.log("jin---phoneNum, code", phoneNum, code)
        if(code && code.length > 0 && phoneNum && phoneNum.length > 0){

            let authInfo = {
                authType: Constants.LOGIN_TYPE.LOGIN_PHONE,
                phone: phoneNum,//TODOT phonePreNum + 
                code: code,
            }
            Account.login(authInfo, () => {
                this.close()
                UIMgr.CloseUI("component/Personal/SaveAccountSelect")
                
            })
        }
    }

    onPressForgotPasswordView(){
        let emailNum = this.getNodeComponent("foreign/EmailNum/input", cc.EditBox).string
        Helper.OpenPageUI("component/Personal/BindAccountEntry", LocalMgr.GetMessage("Login_1009"), { type: 10, email: emailNum})
    }

    onPressRetrievePassword(){
        let emailNum = this.getNodeComponent("foreign/EmailNum/input", cc.EditBox).string
        let pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        let flag = pattern.test(emailNum)
        if(!flag){
            console.log("jin---Email 格式不对")
            Helper.OpenTip(LocalMgr.GetMessage("Email_1008"))
            return
        }
        let data = {
            email: emailNum,
            type: 2 //1:验证；2.重置密码
        }
        //getSendEmailCode
        Account.getSendEmailCode(data, (res) => {
            if(res && res.code && res.code === "00000"){
                Helper.OpenTip(LocalMgr.GetMessage("Login_1012"))
            }else{
                Helper.OpenTip(res.msg)
            }
        })
    }


    //注册（绑定）邮箱
    onPressSignUpEmail(){
        this.setViewState(viewState.LOGIN_EMAIL_VIEW)
    }

    updateCodeTime(state?:number) {
        DataMgr.setData(Constants.DATA_DEFINE.PHONE_CODE_TIME, Date.now() + 60000) //TODOT
        let time = DataMgr.getData<number>(Constants.DATA_DEFINE.PHONE_CODE_TIME)
        console.log("jin---time: ", time, Math.floor((time - Date.now()) / 1000))
        if (time <= 0)
            return
        //foreign
        let label = null
        label = this.getNodeComponent("foreign/code/countDown/lbl_num", cc.Label)
        
        cc.tween(label)
            .repeat(Math.floor((time - Date.now()) / 1000),
                cc.tween()                    
                    .call(() => { 
                        console.log("jin---time1: ", Math.floor((time - Date.now()) / 1000))
                        label.string = Math.max(0, Math.floor((time - Date.now()) / 1000)) + "s" })
                    .delay(1)
                )
            .call(()=>{
                label.string = "0s" 
                DataMgr.setData(Constants.DATA_DEFINE.PHONE_CODE_TIME, 0)
                this.setActive("foreign/code/btn_reSendCode", true)
            })
            .start()

    }

    

    //设置当前view界面
    setViewState(type: number){
        //关闭所有node
        console.log("jin---this.foreign: ", this.getNodeComponent("foreign/node_btn/btn", cc.Button))

        for(let curNode of this.getNode("foreign").children){
            curNode.active = false
        }
        this.getNodeComponent("foreign/node_btn/btn", cc.Button).clickEvents = []

        if(type === viewState.LOGIN_EMAIL_VIEW){
            this.getNodeComponent("foreign/EmailNum/input", cc.EditBox).string = ""
            this.setActive("foreign/EmailNum", true)
            this.setActive("foreign/Password", true)
            this.setActive("foreign/RepeatThePassword", true)
            this.setActive("foreign/password_demand", true)
            this.setActive("foreign/node_btn", true)
            this.setLabelValue("foreign/node_btn/btn/lbl","Submit")
            this.setButtonClick("foreign/node_btn/btn", this.onPressBind.bind(this))
            
        }
        else if(type === viewState.VERIFY_EMAIL_VIEW){
            this.setActive("foreign/validation_email_describe", true)
            // this.setActive("foreign/validation_email_describe", true)
            this.setActive("foreign/node_btn", true)
            this.setLanguageId("foreign/node_btn/btn/lbl","Email_1013")
            this.setButtonClick("foreign/node_btn/btn", this.onPressEmailComfirmed.bind(this))
            this.setActive("foreign/node_sendAgain", true)
            this.setActive("foreign/validation_email_describe1", true)
        }
        else if(type === viewState.SEND_CODE_VIEW){
            this.setActive("foreign/login_phone_describe", true)
            this.setActive("foreign/phoneNum", true)
            this.setActive("foreign/node_btn", true)
            this.setLanguageId("foreign/node_btn/btn/lbl","Phone_1002")
            this.setButtonClick("foreign/node_btn/btn", this.onPressGetCode.bind(this, viewState.SEND_CODE_VIEW))
            this.setButtonClick("foreign/code/btn_reSendCode", this.onPressReSendCode.bind(this, viewState.SEND_CODE_VIEW))
            this.setItem_prePhoneNum()
        }
        else if(type === viewState.SUBMIT_CODE_VIEW){
            //TODO Phone 考虑在输入code转态下是无法修改的
            this.setActive("foreign/login_phone_describe", true)
            this.setActive("foreign/phoneNum", true)
            this.setActive("foreign/node_btn", true)
            this.setActive("foreign/code", true)
            this.setLanguageId("foreign/node_btn/btn/lbl","Phone_1008")
            this.updateCodeTime(viewState.SUBMIT_CODE_VIEW)
            this.setButtonClick("foreign/node_btn/btn", this.onPressSubmitCode.bind(this, viewState.SUBMIT_CODE_VIEW))

        }
        else if(type === viewState.CHANGE_PHONE_VIEW){
            this.setActive("foreign/login_phone_describe", true)
            this.setLanguageId("foreign/login_phone_describe/lbl","Phone_1013")
            // this.setLabelValue("foreign/login_phone_describe/lbl","Please select your region and enter the new phone \nnumber you wish to login.")
            this.setActive("foreign/phoneNum", true)
            this.setActive("foreign/node_btn", true)
            this.setLabelValue("foreign/node_btn/btn/lbl","Send Code")
            this.setButtonClick("foreign/node_btn/btn", this.onPressGetCode.bind(this, viewState.CHANGE_PHONE_VIEW))
            this.setButtonClick("foreign/code/btn_reSendCode", this.onPressReSendCode.bind(this, viewState.CHANGE_PHONE_VIEW))
            this.setItem_prePhoneNum()
        }
        else if(type === viewState.CHANGE_PHONE_SUBMIT_CODE_VIEW){
            this.setActive("foreign/login_phone_describe", true)
            this.setLanguageId("foreign/login_phone_describe/lbl","Phone_1012")
            // this.setLabelValue("foreign/login_phone_describe/lbl","Please enter the code of your phone number you \nwant to modify.")
            this.setActive("foreign/phoneNum", true)
            this.setActive("foreign/node_btn", true)
            this.setActive("foreign/code", true)
            this.setLabelValue("foreign/node_btn/btn/lbl","Submit")
            this.setButtonClick("foreign/node_btn/btn", this.onPressSubmitOldCode.bind(this))
        }
        else if(type === viewState.CHANGE_EMAIL_VIEW){
            this.setActive("foreign/validation_email_describe", true)
            this.setActive("foreign/EmailNum", true)
            this.setActive("foreign/NewEmailNum", true)
            this.setActive("foreign/node_btn", true)
            this.setLabelValue("foreign/node_btn/btn/lbl","Submit")
            this.setButtonClick("foreign/node_btn/btn", this.onPressSendAgainEmail.bind(this))
        }
        else if(type === viewState.LOGIN_IN_WITH_EMAIL){
            this.setActive("foreign/validation_email_describe", true)
            // this.setLabelValue("foreign/validation_email_describe/lbl","Please enter the registered email address and\n password")
            this.setLanguageId("foreign/validation_email_describe/lbl","Login_1002")
            this.setActive("foreign/EmailNum", true)
            if(this.param.email){
                this.getNodeComponent("foreign/EmailNum/input", cc.EditBox).string = this.param.email
            }
            this.setActive("foreign/Password", true)
            this.setActive("foreign/node_email_password", true)
            this.setActive("foreign/node_btn", true)
            // this.setLabelValue("foreign/node_btn/btn/lbl","Log in")
            this.setLanguageId("foreign/node_btn/btn/lbl","Login_1006")
            this.setButtonClick("foreign/node_btn/btn", this.onPressLoginEmail.bind(this))
        }
        else if(type === viewState.LOGIN_IN_WITH_PHONE){ //9
            this.setActive("foreign/login_phone_describe", true)
            this.param.phone && (this.getNodeComponent("foreign/phoneNum/input", cc.EditBox).string = this.param.phone)
            // this.setLabelValue("foreign/login_phone_describe/lbl","Please enter the registered email address and\n to verify")
            this.setActive("foreign/phoneNum", true)
            this.setActive("foreign/node_btn", true)
            this.setLabelValue("foreign/node_btn/btn/lbl","Send Code")
            this.setButtonClick("foreign/node_btn/btn", this.onPressGetCode.bind(this, viewState.LOGIN_IN_WITH_PHONE))
            this.setButtonClick("foreign/code/btn_reSendCode", this.onPressReSendCode.bind(this, viewState.LOGIN_IN_WITH_PHONE))
            this.setItem_prePhoneNum()
        }
        else if(type === viewState.LOGIN_IN_WITH_PHONE_CODE){ //11
            this.setActive("foreign/login_phone_describe", true)
            this.setActive("foreign/phoneNum", true)
            this.setActive("foreign/node_btn", true)
            this.setActive("foreign/code", true)
            this.setLabelValue("foreign/node_btn/btn/lbl","Submit")
            this.updateCodeTime(viewState.SUBMIT_CODE_VIEW)
            this.setButtonClick("foreign/node_btn/btn", this.onPressSubmitCode.bind(this, viewState.LOGIN_IN_WITH_PHONE_CODE))
        }
        else if(type === viewState.RETRIEVE_PASSWORD){ //10
            // this.setLabelValue("foreign/EmailNum/input",)
            this.setActive("foreign/validation_email_describe", true)
            this.setLanguageId("foreign/validation_email_describe/lbl","Login_1010")
            this.setActive("foreign/EmailNum", true)
            this.getNodeComponent("foreign/EmailNum/input", cc.EditBox).string = this.param.email
            this.setActive("foreign/node_btn", true)
            // this.setLabelValue("foreign/node_btn/btn/lbl","Send")
            this.setLanguageId("foreign/node_btn/btn/lbl","Login_1011")
            this.setButtonClick("foreign/node_btn/btn", this.onPressRetrievePassword.bind(this))
            this.setActive("foreign/node_login", true)
        }

    }

    cancelPhonePreNum(){
        //向下滑动，移除界面
        this.showPhonePreName(false)
    }

    changePhonePreNum(){
        let preNum = LocalMgr.GetMessage_phoneRegion()
        this.getNodeComponent("foreign/phoneNum/btn_phonePreNum/Background/Label", cc.Label).string = "+" + preNum[this._curPrePhoneNumIndex - 2][1]
        this.showPhonePreName(false)
    }

    showPhonePreName(state){//true:上 false：下
        if(this._PhonePreNumState === state){
            return
        }
        this._PhonePreNumState = state
        if(state){
            let phonePreNum = this.getNode("phonePreNum1").getPosition()
            this.setNodePositionY("phonePreNum1",phonePreNum.y + 402)
        }else{
            let phonePreNum = this.getNode("phonePreNum1").getPosition()
            this.setNodePositionY("phonePreNum1",phonePreNum.y - 402)
        }
        
    }

    onPressReSendCode(curViewState){
        console.log("jin---onPressReSendCode")
        
        //发送验证码
        let phone = this.getNodeComponent("foreign/phoneNum/input", cc.EditBox).string
        let phone_preNum = this.getNodeComponent("foreign/phoneNum/btn_phonePreNum/Background/Label", cc.Label).string
        if (!phone || phone.length != 11) {
            Helper.OpenTip("Oops! The number you entered is invalid. Please try again！")
            return
        }
        this.setActive("foreign/code/btn_reSendCode", false)
        this.updateCodeTime(curViewState)
        if(curViewState == viewState.CHANGE_PHONE_VIEW){
            Account.getPhoneCode(phone, (sta) => {
                if(!sta){
                    return
                }
                this.setActive("foreign/code/btn_reSendCode", false)
                this.updateCodeTime(curViewState)
            })
        }else if(curViewState == viewState.SEND_CODE_VIEW){
            Account.getPhoneCode(phone, (sta) => {
                if(!sta){
                    return
                }
                this.setActive("foreign/code/btn_reSendCode", false)
                this.updateCodeTime(curViewState)                
            })
        }else if(curViewState == viewState.LOGIN_IN_WITH_PHONE){
            Account.getPhoneCode(phone, (sta) => {
                if(!sta){
                    return
                }
                this.setActive("foreign/code/btn_reSendCode", false)
                this.updateCodeTime(curViewState)                
            })
        }
    }

    //PrePhoneNum pos_center:(0, 0)
    setItemPos(){
        let preNum = LocalMgr.GetMessage_phoneRegion()
        let layout = this.getNode("phonePreNum1/scrollView/view/content")
        let view = this.getNode("phonePreNum1/scrollView/view")
        for(let index in layout.children){
            // curItem
            let worldPos = layout.children[index].convertToWorldSpaceAR(cc.v2(0, 0))
            let nodePos = view.convertToNodeSpaceAR(worldPos)
            // console.log("jin---curItem: ", curItem.y, nodePos.y)
            let posx = nodePos.y
            if(Math.abs(posx) < 30){
                // console.log("jin---curItem1: ", layout.y)
                cc.tween(layout)
                    .to(0.05, {position: cc.v3(0, layout.y - posx, 0)})
                    .start()
                this._curPrePhoneNumIndex = Number(index) 
                this.getNodeComponent("phonePreNum1/country_name", cc.Label).string = preNum[Number(index) - 2][0]
                return
            }
        }
        
    }

    setItem_prePhoneNum(){
        let preNum = LocalMgr.GetMessage_phoneRegion()
        let item_num = this.getNode("phonePreNum1/page")
        let content = this.getNode("phonePreNum1/scrollView/view/content")
        for(let i in preNum){
            console.log("jin---setItem", i)
            let item = cc.instantiate(item_num)
            item.getComponentInChildren(cc.Label).string = preNum[i]
            // pageView.addPage(item)
            item.parent = content
        }
        for(let i = 0; i < 2; i++){
            let item = cc.instantiate(item_num)
            item.parent = content
        }
        this.getNodeComponent("phonePreNum1/country_name", cc.Label).string = preNum[0][0]
    }
}
