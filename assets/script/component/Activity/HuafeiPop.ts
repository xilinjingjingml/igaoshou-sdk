import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import BaseUI from "../../base/BaseUI";
import { Helper } from "../../system/Helper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HuafeiPop extends BaseUI {

    onOpen() {
        this.initData()
        this.initEvent()
    }

    initData() {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        let lottery = user.items[Constants.ITEM_INDEX.LOTTERY].num
        this.setProgressValue("node/progress", Math.min(lottery / 100000, 1))
        this.setLabelValue("node/progress/value", (Math.min(lottery / 100000, 1) * 100).toFixed(2) + "%")
        // let msg = "<color=#ffffff>当前奖券: " + lottery + "，</c>"
        // if (lottery < 200000) {
        //     msg += "<color=#ffffff>差</c><color=#ffff3b>" + (200000 - lottery) + "</c>"
        // }
        // msg += "<color=#ffffff>可兑换20元话费</c>"

        // this.setRichTextValue("node/msg", msg)
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
            let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
            let lottery = user.items[Constants.ITEM_INDEX.LOTTERY].num

            if (lottery >= 100000) {
                Helper.OpenPageUI("component/Exchange/ExchangeGoods", "兑换话费", null, {exchangeType:Constants.EXCHANGE_GOODS_TYPE.PHONE})
            }
            
            this.close()
        })

        this.setButtonClick("node/btnClose", () => this.close())
    }
}
