import BaseUI from "../../../../start/script/base/BaseUI";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { UIMgr } from "../../../../start/script/base/UIMgr";
import { User } from "../../../../start/script/data/User";
import { Constants } from "../../../../start/script/igsConstants";
import { ActivitySrv } from "../../../../start/script/system/ActivitySrv";
import { AdSrv } from "../../../../start/script/system/AdSrv";
import { Helper } from "../../../../start/script/system/Helper";
import { UserSrv } from "../../../../start/script/system/UserSrv";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainTurntable extends BaseUI {
    content: cc.Node = null
    wheel: cc.Node = null

    dataInfo = []

    onOpen() {
        Helper.reportEvent("广告点", "转盘", "打开")

        for (let i = 0; i < 4; i++) {
            let info = ActivitySrv.GetActivityById(1013 + i)
            if (info) {
                info.receive_time = info.receive_time || 1
                info.receive_num = info.receive_num || 0
                if (info.day_times) {
                    if (info.receive_num < info.day_times) {
                    } else {
                        info.receive_num = info.day_times
                    }
                }
                this.dataInfo[i] = info
            }
        }
        console.log("onOpen ", this.dataInfo)

        this.initEvent()
        this.initData()
        this.initButton()
    }

    onLoad() {
        this.setActive("node/btnClose", false)

        this.content = cc.find("node/scrollView/view/content", this.node)
        this.wheel = cc.find("node/scrollView/view/content/wheel", this.node)
        this.wheel.active = false
    }

    initEvent() {

    }

    initButton() {
        this.setButtonClick("node/btnHelp", () => { this.setActive("node/btnHelpInfo", true) })
        this.setButtonClick("node/btnHelpInfo", () => { this.setActive("node/btnHelpInfo", false) })
        this.setButtonClick("node/btnClose", () => {
            Helper.reportEvent("广告点", "转盘", "关闭")
            this.param.checkQueue && EventMgr.dispatchEvent(Constants.EVENT_DEFINE.FIRST_OPEN_QUEUE)
            // this.close()
            this.closeAni()
        })
        this.setActive("node/btnClose", true)
    }

    initData() {
        this.setLabelValue("node/ndZhuanPanBi/lblNum", this.node, User.TurnTable)

        let icons = new Map()
        icons.set(Constants.ITEM_INDEX.LOTTERY, "image/items/jiangquan_2")
        icons.set(Constants.ITEM_INDEX.CREDITS, "image/items/jifen_2")
        // icons.set(Constants.ITEM_INDEX.TURNTABLE, "component/activity/turntable/image/zhuanpan/zhuanpanbi_2")
        icons.set(Constants.ITEM_INDEX.GOLD, "image/items/jinbi_2")

        let manyIcons = new Map()
        manyIcons.set(Constants.ITEM_INDEX.LOTTERY, "image/items/jiangquan_3")
        manyIcons.set(Constants.ITEM_INDEX.CREDITS, "image/items/jifen_3")
        // manyIcons.set(Constants.ITEM_INDEX.TURNTABLE, "component/activity/turntable/image/zhuanpan/zhuanpanbi_3")
        manyIcons.set(Constants.ITEM_INDEX.GOLD, "image/items/jinbi_3")

        this.dataInfo.forEach((v, i) => {
            let wheel = cc.instantiate(this.wheel)
            wheel.parent = this.content
            wheel.active = true
            this.setSpriteFrame("awardsContent/zhuanpan_bg_4", wheel, "component/activity/turntable/image/zhuanpan" + (i + 1), true)
            if (3 === i) {
                this.setSpriteFrame("zhuanpananniou", wheel, "component/activity/turntable/image/xuanzhuan2", true)
            }
            this.setLabelValue("SptTitleBg/lblLevel", wheel, v.name)
            this.setLabelValue("op/lblAward", wheel, v.desc)
            if (0 === i) {
                this.setActive("op/btnOp/Background/ndLayout/spt" + i, wheel, true)
                this.setLabelValue("op/btnOp/Background/ndLayout/lblDescShadow", wheel, "免费")
                this.setLabelValue("op/btnOp/Background/ndLayout/lblDescShadow/lblDesc", wheel, "免费")
            } else {
                this.setActive("op/btnOp/Background/ndLayout/spt" + v.cost_item.item_id, wheel, true)
                this.setLabelValue("op/btnOp/Background/ndLayout/lblDescShadow", wheel, v.cost_item.item_num)
                this.setLabelValue("op/btnOp/Background/ndLayout/lblDescShadow/lblDesc", wheel, v.cost_item.item_num)
            }

            let awardsContent = cc.find("awardsContent", wheel)
            let item = cc.find("awardsContent/item", wheel)
            item.active = false
            let pointerLbl = cc.find("op/lblTip", wheel)
            let btnOp = cc.find("op/btnOp", wheel)

            this.setButtonClick(btnOp, wheel, () => {
                if (0 === i) {
                    AdSrv.createAdOrder(v.ad_aid, "", (res: IPlayAdCallBack) => {
                        if (res && res.order_no && res.order_no.length > 0) {
                            AdSrv.completeAdOrder((res) => {
                                if (res && res.code == "00000") {
                                    UIMgr.OpenUI("lobby", "component/activity/turntable/SlyderAdventures", { single: true, param: { dataInfo: v, skinIndex: i + 1 } }, () => { this.close() })
                                }
                            })
                        }
                    })
                    return
                }

                UIMgr.OpenUI("lobby", "component/activity/turntable/SlyderAdventures", { single: true, param: { dataInfo: v, skinIndex: i + 1 } }, () => { this.close() })
            })

            let refresh = () => {
                if (-1 === v.day_times) {
                    if ((1 === i && User.TurnTable >= 0 && User.TurnTable < v.cost_item.item_num)
                        || (2 === i && User.Lottery >= 0 && User.Lottery < v.cost_item.item_num)
                        || (3 === i && User.Gold >= 0 && User.Gold < v.cost_item.item_num)) {
                        this.setButtonInfo(btnOp, { interactable: false })
                        this.setLabelInfo("op/btnOp/Background/ndLayout/lblDescShadow", wheel, { color: new cc.Color(255, 0, 0, 255) })
                        this.setLabelInfo("op/btnOp/Background/ndLayout/lblDescShadow/lblDesc", wheel, { color: new cc.Color(255, 0, 0, 255) })
                    } else {
                        this.setActive(pointerLbl, false)
                        this.setButtonInfo(btnOp, { interactable: true })
                        this.setLabelInfo("op/btnOp/Background/ndLayout/lblDescShadow", wheel, { color: new cc.Color(255, 255, 255, 255) })
                        this.setLabelInfo("op/btnOp/Background/ndLayout/lblDescShadow/lblDesc", wheel, { color: new cc.Color(255, 255, 255, 255) })
                    }
                } else {
                    if (v.day_times - v.receive_num === 0) {
                        this.setButtonInfo(btnOp, { interactable: false })
                        this.setLabelValue(pointerLbl, "今日次数不足")
                        this.setActive(pointerLbl, true)
                    } else {
                        this.setActive(pointerLbl, false)
                        this.setButtonInfo(btnOp, { interactable: true })
                    }
                }
            }

            let now = Date.now() / 1000
            if (0 === i && v.day_times - v.receive_num === 0) {
                this.setButtonInfo(btnOp, { interactable: false })
                this.setLabelValue(pointerLbl, "今日次数不足")
                this.setActive(pointerLbl, true)
            } else if (v.receive_time && now - v.receive_time < v.interval_time * 60) {
                this.setActive(pointerLbl, true)
                this.setButtonInfo(btnOp, { interactable: false })

                let total = v.interval_time * 60
                let par = now - v.receive_time

                let up = cc.tween()
                    .call(() => {
                        let p = Math.floor(Date.now() / 1000 - v.receive_time)
                        this.setLabelValue(pointerLbl, Helper.FormatTimeString((total - p) * 1000, "mm:ss" + "后可抽"))
                    })
                    .delay(1)

                cc.tween(pointerLbl)
                    .repeat(Math.ceil(total - par), up)
                    .call(() => refresh())
                    .start()
            } else {
                refresh()
            }

            let weight = v.weight
            for (let i = 0; i < weight.length; i++) {
                let awardInfo = weight[i].rewards[0]
                awardInfo.item_id = awardInfo.item_id || 0
                let itemNode = cc.instantiate(item)
                itemNode.active = true
                itemNode.angle = i * (360 / weight.length)
                awardsContent.addChild(itemNode)

                if (awardInfo.min_num > 10) {
                    if (manyIcons.get(awardInfo.item_id)) {
                        this.setSpriteFrame("icon", itemNode, manyIcons.get(awardInfo.item_id), true)
                    }
                } else {
                    if (icons.get(awardInfo.item_id)) {
                        this.setSpriteFrame("icon", itemNode, icons.get(awardInfo.item_id), true)
                    }
                }

                this.setActive("num", itemNode, true)
                this.setLabelValue("num", itemNode, Helper.FormatNumWY(awardInfo.min_num))
                this.setActive("name", itemNode, true)
                this.setLabelValue("name", itemNode, UserSrv.GetItemInfo(awardInfo.item_id).name)
            }
        })
    }

    closeAni() {
        // let pos = cc.v3(-40, cc.winSize.height / 2 - 40)
        let btn: cc.Node = this.param.btn
        if (btn) {
            let pos = this.node.convertToNodeSpaceAR(btn.convertToWorldSpaceAR(cc.Vec3.ZERO))
            this.runTween("node",
                cc.tween()
                    .to(.3, { position: pos, scale: .05 })
                    .delay(0)
                    .call(() => this.close())
            )
        } else {
            this.close()
        }
    }
}
