import BaseUI from "../../base/BaseUI";
import { EventMgr } from "../../base/EventMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchRunningList extends BaseUI {

    onOpen() {
        // this.initNode()
        this.initEvent()
        // this.initData()        
    }

    setParam(param) {
        this.param = param
        this.initData()
    }

    onClose() {
        // let scroll = this.getNodeComponent(this.node.parent.parent.parent, cc.ScrollView)
        // scroll.enabled = true
    }

    initNode() {
        // let scroll = this.getNodeComponent(this.node.parent.parent.parent, cc.ScrollView)
        // scroll.enabled = false
        // if (scroll) {
        //     scroll.scrollToTop()
        // }
    }

    initEvent() {
        this.setButtonClick("top/btnClose", () => {
            this.node.parent.active = false
            EventMgr.dispatchEvent("POP_HIDE")
        })
    }

    initData() {
        this.setLabelValue("top/name", this.param.title)
        this.setChildParam("Running/view", this.param)
    }
}
