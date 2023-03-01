import BaseUI from "../../../start/script/base/BaseUI";
import { UIMgr } from "../../../start/script/base/UIMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PromoteQuickGetAward extends BaseUI {
    onOpen() {
        this.initButton()
    }

    initNode() {

    }

    onLoad() {
    }

    initButton() {
        this.setButtonClick("node/btnOk", this.node, () => {
            cc.log("on click btnAdd")
            this.close()
        })

        this.setButtonClick("node/btnShare", this.node, () => {
            UIMgr.OpenUI("lobby", "component/promote/PromoteShare", { single: true })
            this.close()
        })
    }

    initData() {
    }
}
