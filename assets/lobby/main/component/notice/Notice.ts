import BaseUI from "../../../start/script/base/BaseUI";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { Constants } from "../../../start/script/igsConstants";
import { EventMgr } from "../../../start/script/base/EventMgr";
import { Helper } from "../../../start/script/system/Helper";
import { PluginMgr } from "../../../start/script/base/PluginMgr";
import { UIMgr } from "../../../start/script/base/UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Notice extends BaseUI {
    onOpen() {
        console.log("Notice onOpen", this.param)
        this.initEvent()
        this.initButton()

        this.setSpriteFrame("popAni/node/content", this.param.image)

        let content = cc.find("popAni/node/content", this.node)
        content.on(cc.Node.EventType.SIZE_CHANGED, () => {
            let btnClose = this.getNode("popAni/node/btnClose")
            btnClose.x = content.width / 2
            btnClose.y = content.height / 2
        })


        let node = cc.find("popAni/node", this.node)
        node.scale = 0.9
    }

    onClose() {
        DataMgr.setData(Constants.DATA_DEFINE.NOTICE_READ_DATA + this.param._id, new Date().getTime(), true)
    }

    setParam(data) {
        this.param = data
        this.initData(data)
    }

    initEvent() {

    }

    initButton() {
        this.setButtonClick("popAni/node/btnClose", this.node, () => {
            this.close()
        })

        this.setButtonClick("popAni/node/btnConfirm", this.node, () => {
            this.close()
            let param = null
            switch (this.param.skip) {
                case "1":
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "games" })
                    break
                case "2": 
                    param = Helper.ParseJson(this.param.param, "notice")
                    if (param && param.match_cid)
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.NOTICE_TASK_EVENT, { match_cid: param.match_cid })
                    break                
                case "3":
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "shop" })
                    break
                case "4":
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "league" })
                    break
                case "5": 
                    param = Helper.ParseJson(this.param.param, "notice")
                    if (param && param.appid)                        
                        PluginMgr.navigateToMiniGame(param.appid)
                    break                              
                case "6":
                    UIMgr.OpenUI("lobby", "component/promote/PromoteMain", {single: true})
                    break
            }
        })
    }

    initData(data: any) {

    }
}
