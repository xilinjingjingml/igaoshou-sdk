import BaseUI from "../../../../start/script/base/BaseUI";
import { EventMgr } from "../../../../start/script/base/EventMgr";


const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchRunningList extends BaseUI {

    start() {
        this.initEvent()
    }

    setParam(param) {
        this.param = param
        this.initData()
    }

    onClose() {
    }

    initNode() {
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
