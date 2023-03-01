import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { Account } from "../../system/Account";
import { UIMgr } from "../../base/UIMgr";
import { Helper } from "../../system/Helper";
import { Util } from "../../api/utilApi";
import { EventMgr } from "../../base/EventMgr";
import { PluginMgr } from "../../base/PluginMgr";

const {ccclass, property} = cc._decorator;

interface PhoneRegion {
    country:string
    areaCode:string
}

@ccclass
export default class PhoneLoginScene extends BaseUI {
    @property(cc.Asset)
    phoneRegionCSV:cc.Asset = null

    phoneRegionScrollViewPosX = 0
    phoneRegionScrollView:cc.Node = null
    phoneRegionScrollViewContent:cc.Node = null
    phoneRegionScrollViewPrefab:cc.Node = null

    phoneRegionAll:PhoneRegion[] = new Array()
    curPhoneRegion:PhoneRegion = {country:"中国大陆" , areaCode:"86"}
    
    _loginPhone: boolean = false
    onOpen() {
        this._loginPhone = (undefined === this.param.loginPhone || null === this.param.loginPhone) ? false : this.param.loginPhone
         
        this.phoneRegionScrollView = cc.find("account/phoneRegionScrollView", this.node)
        this.phoneRegionScrollViewContent = cc.find("account/phoneRegionScrollView/view/content", this.node)
        this.phoneRegionScrollViewPrefab = cc.find("account/phoneRegionScrollView/view/content/item", this.node)
        this.phoneRegionScrollViewPrefab.active = false
        this.phoneRegionScrollViewPosX = this.phoneRegionScrollView.x

        if(DataMgr.Config.env === 2 && this._loginPhone){
            let phoneRegion = Helper.CSVToArray(this.phoneRegionCSV, ",")
            for(let i=1;i<phoneRegion.length;i++){
                let region:PhoneRegion = {
                    country:phoneRegion[i][1],
                    areaCode:phoneRegion[i][3],
                }
                this.phoneRegionAll.push(region)
                this.curPhoneRegion = region
            }

            for(let v of this.phoneRegionAll){
                let itemNode = cc.instantiate(this.phoneRegionScrollViewPrefab)
                itemNode.active = true
                this.phoneRegionScrollViewContent && (itemNode.parent = this.phoneRegionScrollViewContent)
                this.setLabelValue("name", itemNode , v.country + " +" + v.areaCode)

                this.setButtonClick("btn",itemNode, () => {         
                    console.log(v.country + " +" + v.areaCode)                
                    this.setCurPhoneRegion(v)
                    this.showPhoneRegion(false)
                })
            }
            this.showPhoneRegion(true)
        }else{
            this.showPhoneRegion(false)
        }

        this.setCurPhoneRegion(this.curPhoneRegion)

        this.initEvent()
        this.initData()
    }

    onLoad(){
    }

    initEvent() {
        this.setButtonClick("account/tab/tab0", this.onTabSelect.bind(this, 0))
        this.setButtonClick("account/tab/tab1", this.onTabSelect.bind(this, 1))
        this.setButtonClick("account/code/btnGetCode", this.onPressGetCode.bind(this))
        this.setButtonClick("account/btnLogin", this.onPressLogin.bind(this))


        this.setButtonClick("account/btnRegister", ()=>{
            Helper.OpenPageUI("component/Personal/PhoneLoginEntry", "注册", { type: 1, loginPhone: this._loginPhone})
        })
        this.setButtonClick("account/btnResetPassword", ()=>{
            Helper.OpenPageUI("component/Personal/PhoneLoginEntry", "注册", { type: 1, loginPhone: this._loginPhone})
        })


        this.setButtonClick("account/phone/btnPhoneRegion", ()=>{
            if(DataMgr.Config.env === 2){
                this.showPhoneRegion(true)
            }
        })
        this.setButtonClick("btnClosePhoneRegion", ()=>{
            this.showPhoneRegion(false)
        })
        this.setButtonClick("account/btnClosePhoneRegion", ()=>{
            this.showPhoneRegion(false)
        })

        EventMgr.on(Constants.EVENT_DEFINE.LOGIN_SUCCESS, ()=>{
            this.close()
            UIMgr.CloseUI("component/Personal/MyAccountEntry")
        })
    }

    initData() {
        //type == 1 注册
        let type = (undefined === this.param.type || null === this.param.type) ? 0 : this.param.type

        if(this._loginPhone){
            if(type == 1){
                this.setActive("account/bg", false)
                this.setActive("account/tab", false)
                this.setActive("account/btnRegister", false)
                this.setActive("account/btnResetPassword", false)

                this.setActive("account/code", true)
                this.setNodePositionY("account/password", cc.find("account/password", this.node).y - 119)
                cc.find("account/phone/bg", this.node).color = cc.color(255,255,255)
                cc.find("account/password/bg", this.node).color = cc.color(255,255,255)
                cc.find("account/code/bg", this.node).color = cc.color(255,255,255)
                this.setNodePositionY("account/btnLogin", cc.find("account/btnLogin", this.node).y - 50)
                this.setLabelValue("account/btnLogin/Background/Label", "注册并登录")
            }
        }else{            
            this.setActive("account/bg", false)
            this.setActive("account/tab", false)
            this.setActive("account/phone", false)
            this.setActive("account/email", true)

            if(type == 1){                
                this.setActive("account/btnRegister", false)
                this.setActive("account/btnResetPassword", false)
                this.setActive("account/code", true)
                this.setActive("account/email/tip", true)
                
                this.setActive("account/code", true)
                this.setNodePositionY("account/password", cc.find("account/password", this.node).y - 119)
                cc.find("account/phone/bg", this.node).color = cc.color(255,255,255)
                cc.find("account/password/bg", this.node).color = cc.color(255,255,255)
                cc.find("account/code/bg", this.node).color = cc.color(255,255,255)
                this.setNodePositionY("account/btnLogin", cc.find("account/btnLogin", this.node).y - 50)
                this.setLabelValue("account/btnLogin/Background/Label", "注册并登录")
            }
        }

        this.updateCodeTime()
    }

    setCurPhoneRegion(region:PhoneRegion){  
        this.curPhoneRegion = region
        this.setLabelValue("account/phone/btnPhoneRegion/Background/Label", "+" + this.curPhoneRegion.areaCode)
    }

    showPhoneRegion(show:boolean){        
        if(show){
            this.phoneRegionScrollView.x = this.phoneRegionScrollViewPosX
        }else{
            this.phoneRegionScrollView.x = cc.winSize.width
        }
        // this.setActive("account/phoneRegionScrollView", show)
        this.setActive("btnClosePhoneRegion", show)
        this.setActive("account/btnClosePhoneRegion", show)
    }

    onPressGetCode() {
        if(this._loginPhone){
            let phone = this.getNodeComponent("account/phone", cc.EditBox).string
            if(!this.checkPhoneNumber(phone)){
                Helper.OpenTip("您的手机号码有误")
                return
            }
            this.setLabelValue("account/phone/msg", "")
            if(DataMgr.Config.env === 2){
                phone = "+" + this.curPhoneRegion.areaCode + phone
            }
            Account.getPhoneCode(phone, () => this.updateCodeTime())
        }
    }

    onPressLogin() {         
        let code = ""
        if(cc.find("account/code", this.node).active){
            code = this.getNodeComponent("account/code", cc.EditBox).string
            if (!code || code.length == 0 ) {
                Helper.OpenTip("请输入验证码")
                return
            }   
        } 

        let pass = ""
        if(cc.find("account/password", this.node).active){
            pass = this.getNodeComponent("account/password", cc.EditBox).string
            if (!pass || pass.length < 6 || pass.length > 25) {
                Helper.OpenTip("密码需要6-25位")
                return
            }   
        } 

        let authType = {}
        if(this._loginPhone){
            let phone = this.getNodeComponent("account/phone", cc.EditBox).string
            if(!this.checkPhoneNumber(phone)){
                Helper.OpenTip("您的手机号码有误")
                return
            }
        
            authType = {
                relogin: true,
                authType: Constants.LOGIN_TYPE.LOGIN_PHONE,
                phone: this.getNodeComponent("account/phone", cc.EditBox).string,
                code: this.getNodeComponent("account/code", cc.EditBox).string,
                password: pass
            }

            if(DataMgr.Config.env === 2){
                authType["phone"] = "+" + this.curPhoneRegion.areaCode + authType["phone"]
            }
        }else{
            let email = this.getNodeComponent("account/email", cc.EditBox).string
            if(email.length == 0){
                Helper.OpenTip("您的邮箱有误")
                return
            }
            authType = {
                relogin: true,
                authType: Constants.LOGIN_TYPE.LOGIN_EMAIL,
                email: this.getNodeComponent("account/email", cc.EditBox).string,
                password: pass,
            }
        }
        
        let md5 = window["md5"]
        if(md5 && authType["password"].length > 0){
            authType["password"] = md5(authType["password"])
        }
        
        console.log("authType",authType)
        if(this._loginPhone){
            Account._loginPhone(authType)
        }else{
            // Account._loginEmail(authType)
        }
    }

    updateCodeTime() {
        let time = DataMgr.getData<number>(Constants.DATA_DEFINE.PHONE_CODE_TIME)
        if (time <= 0)
            return
            
        let label = this.getNodeComponent("account/code/btnGetCode/Background/Label", cc.Label)
        cc.tween(label)
            .delay(1)
            .call(() => this.setButtonInfo("account/code/btnGetCode", {interactable: false}))
            .repeat(Math.floor((time - Date.now()) / 1000),
                cc.tween()                    
                    .call(() => { label.string = "(" + Math.max(0, Math.floor((time - Date.now()) / 1000)) + ")" })
                    .delay(.5)
            )
            .call(() => {
                this.setLabelValue("account/code/btnGetCode/Background/Label", "发送验证码")
                this.setButtonInfo("account/code/btnGetCode", {interactable: true})
                DataMgr.setData(Constants.DATA_DEFINE.PHONE_CODE_TIME, 0)
            })
            .start()
        
    }

    onTabSelect(idx: number) {
        this.setActive("account/password", idx === 0)
        this.setActive("account/code", idx === 1)
    }   

    checkPhoneNumber(phone:string){
        if(DataMgr.Config.env === 2){
            if (!phone || phone.length == 0) {
                return false
            }
        }else{
            if (!phone || phone.length != 11) {
                return false
            }
        }

        return true
    }
}
