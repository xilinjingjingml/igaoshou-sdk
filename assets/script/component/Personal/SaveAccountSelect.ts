import BaseUI from "../../base/BaseUI";
import { Helper } from "../../system/Helper";
import { PluginMgr } from "../../base/PluginMgr";
import { LocalMgr } from "../../base/LocalMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SaveAccountSelect extends BaseUI {

    onOpen() {
        this.initEvent()
        this.initData()
    }

    initEvent(){
        this.setButtonClick("btns/btn_email", this.onPressEmailView.bind(this))
        this.setButtonClick("btns/btn_phone", this.onPressPhoneView.bind(this))
        this.setButtonClick("btns/btn_facebook", this.onPressfacebook.bind(this))
        this.setButtonClick("btns/btn_apple", this.onPressApple.bind(this))
    }

    initData(){

    }

    onPressEmailView(){
        console.log("jin---1")
        Helper.OpenPageUI("component/Personal/BindAccountEntry", LocalMgr.GetMessage("Email_1001"), { type: 1 })
    }

    onPressPhoneView(){
        console.log("jin---2")
        Helper.OpenPageUI("component/Personal/BindAccountEntry", LocalMgr.GetMessage("Save_Account_1005"), { type: 3 })
    }

    onPressfacebook(){
        //TODO 接响应接口
        console.log("jin---3", PluginMgr.pluginConfig)
        for (const plugin of PluginMgr.pluginConfig.plugins) {
            if(plugin.type == "4"){
                PluginMgr.login({sessionType:plugin.name})
            }
            
        }
    }

    onPressApple(){
        //TODO 接响应接口
        console.log("jin---4", PluginMgr.pluginConfig.plugins)
        for (const plugin of PluginMgr.pluginConfig.plugins) {
            if(plugin.type == "3"){
                PluginMgr.login({sessionType:plugin.name})
            }
            
        }
    }

    closeMenu() {
        cc.tween(this.node)
        .delay(.5)
        .to(.2, {opacity: 0})
        .call(() => this.close())
        .start()
    }
}
