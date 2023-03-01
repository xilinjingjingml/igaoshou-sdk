import BaseUI from "../../../../start/script/base/BaseUI";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { PluginMgr } from "../../../../start/script/base/PluginMgr";
import { Helper } from "../../../../start/script/system/Helper";
import { UIMgr } from "../../../../start/script/base/UIMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class SessionPop extends BaseUI {
    btnPrefab: cc.Node = null

    otherLoginContent: cc.Node = null

    onOpen() {
        this.initData()
        this.initEvent()
        this.node.scale = cc.winSize.width / 720
    }

    onLoad() {
        // this.btnPrefab = cc.find("otherLoginMode/node/item", this.node)
        // this.btnPrefab.active = false

        // this.otherLoginContent = cc.find("otherLoginMode/node", this.node)
        // this.setActive("otherLoginMode/lbl_other", false)
    }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.LOGIN_SUCCESS, () => {
            this.close()
        })

        this.setActive("btnClose", this.param?.changeAccount === true)
    }

    initData() {
        cc.log("===SessionPop initData===");

        let bCheckShanYan = false

        this.setActive("node/otherLogin/btnOtherPhoneLogin", true)

        if (PluginMgr.pluginConfig && PluginMgr.pluginConfig.plugins) {
            for (const plugin of PluginMgr.pluginConfig.plugins) {
                if (plugin.type == "5") {
                    cc.log("===plugins name " + plugin.name)
                    if (plugin.name == "SessionShanYan" && Helper.isIosAudit()) {
                        this.setActive("node/btnOneKeyLogin", false)
                        this.setActive("node/btnPhoneLogin", true)
                        this.setActive("node/otherLogin/btnOtherPhoneLogin", false)
                        continue
                    }

                    if ("SessionShanYan" === plugin.name) {
                        if (PluginMgr.getSimState()) {
                            this.setActive("node/btnOneKeyLogin", true)
                            this.setActive("node/otherLogin/btnOtherPhoneLogin", true)
                        } else {
                            this.setActive("node/btnPhoneLogin", true)
                            this.setActive("node/otherLogin/btnOtherPhoneLogin", false)
                        }
                    } else {
                        if (plugin.name == "SessionWeiXin" && Helper.isIosAudit()) {

                        } else {
                            this.setActive("node/otherLogin/" + plugin.name, true)
                        }

                    }
                }
            }
        }
    }

    onPressOneKeyPhoneLogin() {
        console.log("jin---onPressOneKeyPhoneLogin")
        PluginMgr.login({ sessionType: "SessionShanYan" })
    }

    onPressOtherPhoneLogin() {
        console.log("jin---onPressOtherPhoneLoain")
        UIMgr.OpenUI("lobby", "component/account/PhoneLogin/PhoneLogin")
    }
    onPressAppleLogin() {
        console.log("jin---onPressAppleLogin")
        PluginMgr.login({ sessionType: "SessionAppleSign" })
    }
    onPressWechatLogin() {
        console.log("jin---onPressWechatLogin")
        PluginMgr.login({ sessionType: "SessionWeiXin" })
    }

}
