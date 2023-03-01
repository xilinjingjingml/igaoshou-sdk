import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { SignSrv } from "../../system/ActivitySrv"
import { UIMgr } from "../../base/UIMgr";
import { AdSrv } from "../../system/AdSrv";
import { Helper } from "../../system/Helper";
import { User } from "../../system/User";

const { ccclass, property } = cc._decorator;


@ccclass
export default class Guide extends BaseUI {

    onOpen() {
        console.log("Guide onOpen", this.param)
        this.initButton()

        this.setActive("body/item0", false)
        this.setActive("body/item1", false)
        this.setActive("body/item2", false)

        for (let v of this.param.awards) {
            v.item_id = v.item_id || 0
            let ic = User.GetItemInfo(v.item_id)
            if (v.item_id == Constants.ITEM_INDEX.WCOIN) {
                let num = cc.find("body/item0/num", this.node)
                this.setActive("body/item0", true)
                num.getComponent(cc.Label).string = ic.name + "X" + (v.item_num !== undefined ? v.item_num : v.num)
                this.setActive("particle/wcoin", true)
            } else if (v.item_id == Constants.ITEM_INDEX.LOTTERY) {
                let num = cc.find("body/item1/num", this.node)
                this.setActive("body/item1", true)
                num.getComponent(cc.Label).string = ic.name + "X" + v.item_num
            } else if (v.item_id == Constants.ITEM_INDEX.DIAMOND) {
                let num = cc.find("body/item2/num", this.node)
                this.setActive("body/item2", true)
                num.getComponent(cc.Label).string = ic.name + "X" + Helper.FormatNumPrice(v.item_num / 100)

                this.setActive("particle/diamond", true)
            }
        }

        let tween = cc.tween().repeatForever(cc.tween().to(.6, { scale: .8 }).delay(.1).to(.6, { scale: 1 }))
        this.runTween("body/btnGetAward", tween)
    }

    onLoad() {

    }

    initEvent() {

    }

    initButton() {
        this.setButtonClick("btnClose", this.node, () => {
            this.close()
        })
    }
}
