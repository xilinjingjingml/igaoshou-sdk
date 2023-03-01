import BaseUI from "../../../../start/script/base/BaseUI";
import { User } from "../../../../start/script/data/User";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HuafeiPop extends BaseUI {

    onOpen() {
        this.initData()
        this.initEvent()
    }

    initData() {
        let lottery = User.Lottery
        this.setProgressValue("node/progress", Math.min(lottery / 100000, 1))
        this.setLabelValue("node/progress/value", (Math.min(lottery / 100000, 1) * 100).toFixed(2) + "%")

        let msg = "您已赢得" + lottery + "奖券，满10万奖券即可兑换10元话费。"
        this.setLabelValue("node/msg", msg)

        if (lottery < 100000) {
            this.setLabelValue("node/btnShowMore/Background/label", "继续赢奖券")
        } else {
            this.setLabelValue("node/btnShowMore/Background/label", "领取")
        }
    }

    initEvent() {
        this.setButtonClick("node/btnShowMore", () => {
            this.close()
        })

        this.setButtonClick("node/btnClose", () => this.close())
    }
}
