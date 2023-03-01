import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { MatchSvr } from "../../system/MatchSvr";
import { PluginMgr } from "../../base/PluginMgr";
import { Helper } from "../../system/Helper";
import { Account } from "../../system/Account";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SessionPop extends BaseUI {
    btnPrefab:cc.Node = null

    onOpen() {        
        this.initData()
    }

    onLoad(){
        this.btnPrefab = cc.find("item", this.node)
        this.btnPrefab.active = false
    }

    initEvent() {
    }

    initData() {
        if(PluginMgr.pluginConfig && PluginMgr.pluginConfig.plugins){
            for (const plugin of PluginMgr.pluginConfig.plugins) {
                if(plugin.type == "5"){
                    let bundle = DataMgr.Bundle
                    if (bundle) {
                        bundle.load("thirdparty/" + plugin.name, cc.SpriteFrame, (err, res: cc.SpriteFrame) => {
                            if (err) {
                                cc.warn("BaseUI.setSpriteFrame sprite " + "thirdparty/" + plugin.name + " err: " + err)                                
                            }else{                       
                                let itemNode = cc.instantiate(this.btnPrefab)
                                itemNode.active = true
                                this.node && this.node.addChild(itemNode)
                                this.setButtonClick(itemNode, () => {         
                                    if(plugin.name == "SessionPhone"){
                                            Helper.OpenPageUI("component/Personal/PhoneLoginEntry", "登录账号", { type: 0, loginPhone: true })
                                        }else if(plugin.name == "SessionEmail"){
                                            Helper.OpenPageUI("component/Personal/PhoneLoginEntry", "登录账号", { type: 0, loginPhone: false })
                                        }else if(plugin.name == "SessionGuest"){                                                
                                            Account._loginGuest({})
                                    }else{
                                    PluginMgr.login({sessionType:plugin.name})
                                    }
                                })

                                this.setSpriteFrame("Background", itemNode, res)                                    
                                    itemNode.width = res.getRect().width
                                    itemNode.height = res.getRect().height                                
                            }     
                        })
                    }
                }
            }
        }
    }
    
}
