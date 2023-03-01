import BaseUI from "../../base/BaseUI";
import { UIMgr } from "../../base/UIMgr";
import { Constants } from "../../constants";
import { Helper } from "../../system/Helper";
import {PluginMgr} from "../../base/PluginMgr"
import { EPluginType} from "../../pulgin/IPluginProxy"
import { DataMgr } from "../../base/DataMgr";
import { LocalMgr } from "../../base/LocalMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMenu extends BaseUI {

    onOpen() {
        this.initEvent()
    }

    initEvent() {
        this.setButtonClick("menus/personal", this.onPressFace.bind(this))
        this.setButtonClick("menus/exchange", this.onPressExchange.bind(this))
        this.setButtonClick("menus/achievement", this.onPressAchievement.bind(this))
        this.setButtonClick("menus/account", this.onPressAccount.bind(this))
        this.setButtonClick("menus/setting", this.onPressSet.bind(this))
        this.setButtonClick("menus/help", this.onPressHelp.bind(this))
        this.setButtonClick("menus/exit", this.onPressExit.bind(this))

        if(DataMgr.Config.platId === 3){
            this.setActive("menus/exchange", false)
            this.setActive("menus/account", false)
        }
    }

    closeMenu() {
        cc.tween(this.node)
        .delay(.5)
        .to(.2, {opacity: 0})
        .call(() => this.close())
        .start()
    }

    onPressFace() {
        Helper.OpenPageUI("scene/PersonalScene", "个人中心", () => this.closeMenu())
    }

    onPressExchange() {
        Helper.OpenPageUI("scene/ExchangeScene", "", () => this.closeMenu())
    }

    onPressAchievement() {
        this.close()
    }

    onPressAccount() {
        Helper.OpenPageUI("component/Personal/MyAccountEntry", LocalMgr.GetMessage("Sidebar_1006"), () => this.closeMenu())
    }

    onPressSet() {
        Helper.OpenPageUI("component/Personal/SettingEntry", "设置", () => this.closeMenu())
    }

    onPressHelp() {
        Helper.OpenPageUI("component/Personal/FAQEntry", LocalMgr.GetMessage("FAQ_1001"), () => this.closeMenu())
    }

    onPressExit() {
        let extendPlugin = false
        if (Helper.isNative()) {  
            if(PluginMgr.pluginConfig && PluginMgr.pluginConfig.plugins){          
                for (const plugin of PluginMgr.pluginConfig.plugins) {
                    if(plugin.type == EPluginType.kPluginExend.toString()){
                        extendPlugin = true
                    }
                }
            }
        }
        
        if(extendPlugin){
            PluginMgr._jump2ExtendMethod(7)
        }else{
            cc.game.end()
        }
    }

}
