import BaseUI from "../../../start/script/base/BaseUI";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { Constants } from "../../../start/script/igsConstants";
import { Helper } from "../../../start/script/system/Helper";
import { ShopSvr } from "../../../start/script/system/ShopSvr";
import { UserSrv } from "../../../start/script/system/UserSrv";
import { UIMgr } from "../../../start/script/base/UIMgr";
import { SignSrv, ActivitySrv } from "../../../start/script/system/ActivitySrv";
import { User } from "../../../start/script/data/User";
import { AdSrv } from "../../../start/script/system/AdSrv";
import { EventMgr } from "../../../start/script/base/EventMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopTab extends BaseUI {

    _boxItem: cc.Node = null

    onLoad() {
        this.initNode()
        this.initEvent()
        this.initData()
    }

    initNode() {
        this._boxItem = this.getNode("boxes/goods/item")
        this._boxItem.active = false

        this.setActive("boxes", false)
        this.setActive("boxes/first", false)
        this.setActive("boxes/gift", false)
        this.setActive("boxes/goods", false)
    }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.REFRESH_ACTIVITY, (msg) => {
            if (msg.activityId) {
                if (msg.activityId === 3) {
                    this.initFreeItem(ActivitySrv.GetActivityById(msg.activityId))
                }
            }
        }, this)
    }

    initData() {
        this.initBoxes()

        if (Helper.checkExchangeCredits()) {
            this.setActive("awards/exchange", false)
        }
    }

    updateActivity() {
        ActivitySrv.GetActivityConfig(0, (res: any[]) => {
            if (!res)
                return

            this.initFreeData(res)
        })
    }

    onEnable() {
        this.updateActivity()
    }

    onDisable() {

    }

    initBoxes() {
        if (cc.sys.os !== cc.sys.OS_IOS) {
            if (DataMgr.data.OnlineParam.shop_android === 1) {
                return
            }
            this.setActive("boxes", true)

            let boxes = DataMgr.getData<TShopBoxes>(Constants.DATA_DEFINE.SHOP_BOXES)

            if (!DataMgr.getData<boolean>(Constants.DATA_DEFINE.FIRST_BUY)) {
                for (let i in boxes[Constants.SHOP_TYPE.FIRST_PAY] || {}) {
                    if (!boxes[Constants.SHOP_TYPE.FIRST_PAY][i].isBuy) {
                        this.setfirst(boxes[Constants.SHOP_TYPE.FIRST_PAY][i])
                        break;
                    }
                }
            } else if (!DataMgr.getData<boolean>(Constants.DATA_DEFINE.LIMIT_BUY)) {
                let cfg = DataMgr.getData(Constants.DATA_DEFINE.PREFERENCE_BOX_RANDOM)
                let b = boxes[Constants.SHOP_TYPE.PREFERENCE][cfg["id"]]
                if (b) {
                    b.time = cfg["time"]
                    this.setGift(b)
                }
            }

            // boxes = DataMgr.getData<TShopBoxes>(Constants.DATA_DEFINE.SHOP_BOXES)
            let idx = 0
            for (let i in boxes[Constants.SHOP_TYPE.NORMAL] || {}) {
                this.setNormal(boxes[Constants.SHOP_TYPE.NORMAL][i], 3 <= idx++)
            }
            if (idx <= 0) {
                this.setActive("boxes/goods", false)
            }
        }
        else {
            if (undefined === DataMgr.data.OnlineParam.shop_rounds || DataMgr.data.OnlineParam.shop_rounds > User.PlayGame) {
                return
            }

            if (Helper.checkRegionLimit()) {
                return
            }

            this.setActive("boxes", true)

            let boxes = DataMgr.getData<TShopBoxes>(Constants.DATA_DEFINE.SHOP_BOXES)

            if (!DataMgr.getData<boolean>(Constants.DATA_DEFINE.FIRST_BUY)) {
                for (let i in boxes[Constants.SHOP_TYPE.FIRST_PAY] || {}) {
                    if (!boxes[Constants.SHOP_TYPE.FIRST_PAY][i].isBuy) {
                        this.setfirst(boxes[Constants.SHOP_TYPE.FIRST_PAY][i])
                        break;
                    }
                }
            } else if (!DataMgr.getData<boolean>(Constants.DATA_DEFINE.LIMIT_BUY)) {
                let cfg = DataMgr.getData(Constants.DATA_DEFINE.PREFERENCE_BOX_RANDOM)
                let b = boxes[Constants.SHOP_TYPE.PREFERENCE][cfg["id"]]
                if (b) {
                    b.time = cfg["time"]
                    this.setGift(b)
                }
            }

            // boxes = DataMgr.getData<TShopBoxes>(Constants.DATA_DEFINE.SHOP_BOXES)
            let idx = 0
            for (let i in boxes[Constants.SHOP_TYPE.NORMAL] || {}) {
                this.setNormal(boxes[Constants.SHOP_TYPE.NORMAL][i], 3 <= idx++)
            }
            if (idx <= 0) {
                this.setActive("boxes/goods", false)
            }
        }


    }

    setfirst(box: IShopInfo) {
        this.setActive("boxes/first", true)

        this.setLabelValue("boxes/first/worth/gold/num", box.items[Constants.ITEM_INDEX.GOLD]?.num || 0)
        this.setLabelValue("boxes/first/worth/lottery/num", box.items[Constants.ITEM_INDEX.LOTTERY]?.num || 0)
        this.setLabelValue("boxes/first/anniu/price", (box.price / 100) + "元购买")

        let origin = (box.items[Constants.ITEM_INDEX.GOLD]?.num || 0) / 1 + (box.items[Constants.ITEM_INDEX.LOTTERY]?.num || 0) / 100
        this.setLabelValue("boxes/first/anniu/origin", (origin / 100) + "元购买")

        this.setButtonClick("boxes/first/btnBuy", this.onPressBuy.bind(this, box))
    }

    setGift(box: IShopInfo) {
        this.setActive("boxes/gift", true)

        this.setLabelValue("boxes/gift/worth/gold/num", box.items[Constants.ITEM_INDEX.GOLD]?.num || 0)
        this.setLabelValue("boxes/gift/worth/lottery/num", box.items[Constants.ITEM_INDEX.LOTTERY]?.num || 0)
        this.setLabelValue("boxes/gift/anniu/price", (box.price / 100) + "元购买")

        if (box.time) {
            let num = box.time - Date.now()
            this.stopTween("boxes/gift/daojishi")
            let tween = cc.tween()
                .repeat(Math.floor(num / 1000), cc.tween()
                    .call(() => { this.setLabelValue("boxes/gift/daojishi/time", Helper.FormatTimeString(num -= 1000, "hh:mm:ss")) })
                    .delay(1)
                )
                .call(() => {
                    this.setActive("boxes/gift", false)
                })
            this.runTween("boxes/gift/daojishi", tween)
        } else {
            this.setActive("boxes/gift/daojishi", false)
        }

        this.setButtonClick("boxes/gift/btnBuy", this.onPressBuy.bind(this, box))
    }

    setNormal(box: IShopInfo, bBroad: boolean = false) {
        this.setActive("boxes/goods", true)

        let item = cc.instantiate(this._boxItem)
        this.setNodeWidth(item, bBroad ? 317.5 : 204)
        item.parent = this._boxItem.parent
        this.setLabelValue("worth", item, box.items[Constants.ITEM_INDEX.GOLD]?.num || 0)
        this.setLabelValue("price", item, (box.price / 100) + "元")

        this.setButtonClick("btnBuy", item, this.onPressBuy.bind(this, box))
        item.active = true
    }

    onPressBuy(box: IShopInfo) {
        // if (cc.sys.isBrowser) {
        //     UserSrv.UpdateItem(() => UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: box.items }, }))
        //     if (box.type !== Constants.SHOP_TYPE.NORMAL) {
        //         this.setActive("boxes/gift", false)
        //     }
        // } else {
            // DataMgr.setData(Constants.DATA_DEFINE.LAST_PAY_GOODS, box.boxId)
            ShopSvr.Pay(box)
            // ShopSvr.WechatPay(box, (succ: boolean) => {
            //     if (!succ) {
            //         return
            //     }

            //     UserSrv.UpdateItem(() => UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: box.items }, }))
            //     if (box.type !== Constants.SHOP_TYPE.NORMAL && box.type !== Constants.SHOP_TYPE.PREFERENCE) {
            //         this.setActive("boxes/gift", false)
            //     }
            // })
        // }
    }

    initFreeData(res) {
        this.setActive("awards/lottery", false)

        for (let i in res) {
            let info = res[i]
            if (info.activity_id === 3) {
                this.initFreeItem(info)
            }
        }
    }

    initFreeItem(info) {
        this.setActive("awards/lottery", true)

        let index = info.receive_num || 0
        if (index >= info.day_times) {
            this.setActive("awards/lottery/time", true)
            this.setLabelValue("awards/lottery/time", "今日次数\n已用完")
            this.setActive("awards/lottery/bofang", false)
            this.setActive("awards/lottery/share", false)
            this.setActive("awards/lottery/lbl", false)
            this.setActive("awards/lottery/redPoint", false)
            this.setButtonInfo("awards/lottery/btnLotttery", { interactable: false })
        } else if (!info.receive_time || Date.now() / 1000 - info.receive_time > info.interval_time * 60) {
            this.setActive("awards/lottery/redPoint", true)
            this.setActive("awards/lottery/lbl", true)
            this.setActive("awards/lottery/time", false)
            this.setButtonInfo("awards/lottery/btnLotttery", { interactable: true })

            let method = AdSrv.getMethod(info.ad_aid)
            //签到一天只有一次，按总次数算
            if (method[index] === 0) {  //0免费 1分享 2广告 默认2看广告                    
                this.setActive("awards/lottery/bofang", false)
                this.setActive("awards/lottery/share", false)
                this.setNodePositionX("awards/lottery/lbl", 240)
            } else if (method[index] === 1) {
                this.setActive("awards/lottery/bofang", false)
                this.setActive("awards/lottery/share", true)
                this.setNodePositionX("awards/lottery/lbl", 270)
            } else {
                this.setActive("awards/lottery/bofang", true)
                this.setActive("awards/lottery/share", false)
                this.setNodePositionX("awards/lottery/lbl", 270)
            }
        } else {
            this.setActive("awards/lottery/bofang", false)
            this.setActive("awards/lottery/share", false)
            this.setActive("awards/lottery/redPoint", false)
            this.setActive("awards/lottery/lbl", false)
            this.setActive("awards/lottery/time", true)
            this.setButtonInfo("awards/lottery/btnLotttery", { interactable: false })
            let num = Math.floor(info.interval_time * 60 - (Date.now() / 1000 - info.receive_time))
            this.setLabelValue("awards/lottery/time", Helper.FormatTimeString(num * 1000, "mm:ss"))
            this.stopTween("awards/lottery")
            this.runTween("awards/lottery", cc.tween()
                .repeat(num, cc.tween()
                    .delay(1)
                    .call(() => { this.setLabelValue("awards/lottery/time", Helper.FormatTimeString(num-- * 1000, "mm:ss")) }))
                .delay(3)
                .call(() => this.initFreeItem(info)))
        }
    }

    onPressTask() {
        Helper.OpenPageUI("component/task/TaskScene", "玩比赛得奖品", null, { single: true })
    }

    onPressExchange() {
        UIMgr.OpenUI("lobby", "component/exchange/credits/ExchangeCredits", { single: true })
    }

    onPressLottery() {
        let info = ActivitySrv.GetActivityById(3)
        if (info.receive_time && Date.now() / 1000 - info.receive_time < info.interval_time * 60) {
            return
        }

        ActivitySrv.OnClickActivity(info)
    }

    onPressLucky() {

    }

    onPressTurntable() {
        UIMgr.OpenUI("lobby", "component/activity/turntable/MainTurntable", { single: true, param: {} })
    }

    onPressSign() {
        SignSrv.GetConfig((config) => {
            let info = ActivitySrv.GetActivityById(8)
            UIMgr.OpenUI("lobby", "component/activity/sign/Sign", { single: true, param: { signConfig: config, activityConfig: info }, index: 20 })
        })
    }
}
