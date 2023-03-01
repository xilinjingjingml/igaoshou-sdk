import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TourneyMatchTip extends BaseUI {
    onOpen() {
        this.initEvent()
        DataMgr.setData("tourneyMatchTip", true, true)
    }

    initEvent() {
        let check = this.getNodeComponent("check", cc.Toggle)
        this.setButtonClick(check.node, () => {
            DataMgr.setData("tourneyMatchTip", check.isChecked, true)
        })
    }

}