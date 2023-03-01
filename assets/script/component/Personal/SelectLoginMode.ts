/*
 * @Author: Jin
 * @Date: 2021-09-24 15:34:51
 * @LastEditTime: 2021-10-14 13:44:59
 * @LastEditors: Jin
 * @Description: In User Settings Edit
 * @FilePath: \igaoshou-sdk\assets\script\component\Personal\SelectLoginMode.ts
 */
import BaseUI from "../../base/BaseUI";
import { Helper } from "../../system/Helper";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { PluginMgr } from "../../base/PluginMgr";
import { LocalMgr } from "../../base/LocalMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SelectLoginMode extends BaseUI {

    onOpen() {
        this.initEvent()
        this.initData()
    }

    initEvent(){
        this.setButtonClick("btn_existingAccount", this.onpressExistingAccount.bind(this))
        this.setButtonClick("btn_EmailLogin", this.onpressEmailLogin.bind(this))
        this.setButtonClick("node_OtherLoginMode/btn_loginApple", this.onpressLoginApple.bind(this))
        this.setButtonClick("node_OtherLoginMode/btn_loginPhone", this.onpressLoginPhone.bind(this))
        this.setButtonClick("node_OtherLoginMode/btn_loginFacebook", this.onpressLoginFacebook.bind(this))
    }

    initData(){
        //判断有没有本地账号
        let histroyAccount = DataMgr.getData<IHISTROY_ACCOUNT_INFO>(Constants.DATA_DEFINE.HISTROY_ACCOUNT)
        console.log("jin---histroyAccount: ", histroyAccount)
                
        let tmpSta = ((histroyAccount && histroyAccount.history_account.length > 1) ? true : false)
        this.setActive("btn_existingAccount", tmpSta)
    }

    onpressExistingAccount(){
        Helper.OpenPageUI("component/Personal/ExistingAccountEntry", "Existing Account", {})
    }
    onpressEmailLogin(){
        Helper.OpenPageUI("component/Personal/BindAccountEntry", LocalMgr.GetMessage("Login_1001"), {type: 8})
    }
    onpressLoginApple(){
        console.log("jin---4", PluginMgr.pluginConfig.plugins)
        for (const plugin of PluginMgr.pluginConfig.plugins) {
            if(plugin.type == "3"){
                PluginMgr.login({sessionType: plugin.name})
            }
            
        }
    }
    onpressLoginPhone(){
        Helper.OpenPageUI("component/Personal/BindAccountEntry", "Log in with phone", {type: 9})
        
    }
    onpressLoginFacebook(){
        console.log("jin---3", PluginMgr.pluginConfig)
        for (const plugin of PluginMgr.pluginConfig.plugins) {
            if(plugin.type == "4"){
                PluginMgr.login({sessionType: plugin.name})
            }
            
        }
    }
}
