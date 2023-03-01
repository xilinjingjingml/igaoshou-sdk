import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { AdSrv } from "../../system/AdSrv";
import { UIMgr } from "../../base/UIMgr";
import { Helper } from "../../system/Helper";
import { ActivitySrv } from "../../system/ActivitySrv"
import { User } from "../../system/User";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlyderAdventures extends BaseUI {
    btnOpen: cc.Node = null

    awardsContent: cc.Node = null
    itemNode: cc.Node = null
    countDownTip: cc.Node = null
    pointerLbl: cc.Node = null

    spWheel: sp.Skeleton = null

    dataInfo = null
    onOpen() {
        console.log("SlyderAdventures onOpen", this.param)
        this.dataInfo = this.param.dataInfo
        this.dataInfo.receive_num = this.dataInfo.receive_num || 0
        this.countDownTip = cc.find("wheel/countDown/tip", this.node)
        this.countDownTip.getComponent(cc.Label).string = "您今日还有" + (this.dataInfo.day_times - this.dataInfo.receive_num) + "次机会"
        this.pointerLbl = cc.find("wheel/pointerNode/lbl", this.node)

        // this.setLabelValue("wheel/tips", "1.每观看一次视频可以进行1次抽奖，每日可抽取" + this.dataInfo.day_times + "次。\n2.抽取的奖品将立即获得。\n3.最终活动解释权归本公司所有")

        this.initEvent()
        this.initData()
        this.initButton()
    }

    onLoad() {
        this.btnOpen = cc.find("btnOpen", this.node)
        this.setActive("btnClose", false)

        this.awardsContent = cc.find("wheel/awardsContent", this.node)
        this.spWheel = cc.find("wheel/spWheel", this.node).getComponent(sp.Skeleton)
        this.itemNode = cc.find("wheel/awardsContent/item", this.node)
        this.itemNode.active = false
    }

    initEvent() {

    }

    initButton() {
        this.setButtonClick("btnOpen", this.onPressGetAward.bind(this))
        this.setButtonClick("btnGetAward", this.onPressGetAward.bind(this))
        this.setButtonClick("btnHelp", () => { this.setActive("btnHelpInfo", true) })
        this.setButtonClick("btnHelpInfo", () => { this.setActive("btnHelpInfo", false) })
        this.setButtonClick("btnClose", () => this.close())

        this.setActive("btnClose", false)
        cc.tween(this.node)
            .delay(2)
            .call(() => {
                this.setActive("btnClose", true)
                cc.tween(this.getNode("btnClose"))
                    .set({ opacity: 0 })
                    .to(1, { opacity: 255 })
                    .start()
            })
            .start()

        cc.tween(this.getNode("btnGetAward"))
            .repeatForever(cc.tween(this.getNode("btnGetAward"))
                .to(.8, { scale: 1.1 })
                // .delay(.2)
                .to(.8, { scale: .9 })
            )
            .start()
    }

    startTurnAni(res: any) {
        this.setActive("blockUi", true)
        this.startTurn(res.reward_index * (360 / this.dataInfo.weight.length), () => {
            this.dataInfo.receive_num++
            if (this.dataInfo.day_times - this.dataInfo.receive_num === 0) {
                this.countDownTip.getComponent(cc.Label).string = "今日次数已用完"
            } else {
                this.countDownTip.getComponent(cc.Label).string = "您今日还有" + (this.dataInfo.day_times - this.dataInfo.receive_num) + "次机会"
            }
            let param = {
                activity_id: this.dataInfo.activity_id
            }
            ActivitySrv.GetDelayReward(param, () => {
                UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res.award_item, autoOpenBox: true } })
                this.setButtonInfo("btnClose", { interactable: true })
            })

            this.dataInfo.receive_time = Date.now() / 1000
            this.refreshPointerLbl()
            this.setActive("blockUi", false)
        })
    }

    initData() {
        let weight = this.dataInfo.weight
        this.dataInfo.receive_days = this.dataInfo.receive_days || 0
        this.dataInfo.novice_days = this.dataInfo.novice_days || 0
        if (this.dataInfo.receive_days <= this.dataInfo.novice_days) {
            weight = this.dataInfo.novice_weight
        }
        for (let i = 0; i < weight.length; i++) {
            let awardInfo = weight[i].rewards[0]
            awardInfo.item_id = awardInfo.item_id || 0
            let itemNode = cc.instantiate(this.itemNode)
            itemNode.active = true
            itemNode.angle = i * (360 / weight.length)
            this.awardsContent.addChild(itemNode)

            let icons = new Map();
            icons.set(Constants.ITEM_INDEX.WCOIN, "image/icon/daoju-weibi")
            icons.set(Constants.ITEM_INDEX.LOTTERY, "image/icon/daoju-jiangquan1")
            icons.set(Constants.ITEM_INDEX.DIAMOND, "image/icon/daoju-zuanshi")

            let manyIcons = new Map();
            manyIcons.set(Constants.ITEM_INDEX.WCOIN, "image/icon/many_weibi")
            manyIcons.set(Constants.ITEM_INDEX.LOTTERY, "image/icon/many_jiangjuan")
            manyIcons.set(Constants.ITEM_INDEX.DIAMOND, "image/icon/many_zuanshi")
            if (awardInfo.min_num > 10) {
                if (manyIcons.get(awardInfo.item_id)) {
                    this.setSpriteFrame("icon", itemNode, manyIcons.get(awardInfo.item_id), true)
                    // cc.find("icon", itemNode).scale = 0.8
                }
            } else {
                if (icons.get(awardInfo.item_id)) {
                    this.setSpriteFrame("icon", itemNode, icons.get(awardInfo.item_id), true)
                }
            }

            // this.setChildParam("ItemMode", itemNode, {items: [{id:awardInfo.item_id, num: awardInfo.min_num}]})
            // let items = [{id:awardInfo.item_id, num: awardInfo.min_num}]
            // this.setActive("wcoin", itemNode, false)
            // this.setActive("lottery", itemNode, false)
            // this.setActive("diamond", itemNode, false)
            // for (let i in items) {
            if (awardInfo.item_id === Constants.ITEM_INDEX.WCOIN) {
                // this.setActive("wcoin", itemNode, true)
                // this.setActive("wcoin/icon", itemNode, true)
                this.setActive("wcoin/num", itemNode, true)
                this.setLabelValue("wcoin/num", itemNode, Helper.FormatNumWY(awardInfo.min_num))
                this.setActive("wcoin/name", itemNode, true)
                this.setLabelValue("wcoin/name", itemNode, User.GetItemInfo(awardInfo.item_id).name)
            } else if (awardInfo.item_id === Constants.ITEM_INDEX.LOTTERY) {
                // this.setActive("lottery", itemNode, true)
                // this.setActive("lottery/icon", itemNode, true)                    
                this.setActive("lottery/num", itemNode, true)
                this.setLabelValue("lottery/num", itemNode, Helper.FormatNumWY(awardInfo.min_num))
                this.setActive("lottery/name", itemNode, true)
                this.setLabelValue("lottery/name", itemNode, User.GetItemInfo(awardInfo.item_id).name)
            } else if (awardInfo.item_id === Constants.ITEM_INDEX.DIAMOND) {
                // this.setActive("diamond", itemNode, true)
                // this.setActive("diamond/icon", itemNode, true)
                this.setActive("diamond/num", itemNode, true)
                this.setLabelValue("diamond/num", itemNode, Helper.FormatNumPrice(awardInfo.min_num / 100))
                this.setActive("diamond/name", itemNode, true)
                this.setLabelValue("diamond/name", itemNode, User.GetItemInfo(awardInfo.item_id).name)
            }
            // }
        }

        this.refreshPointerLbl()
    }

    refreshPointerLbl() {
        let now = Date.now() / 1000
        if (this.dataInfo.day_times - this.dataInfo.receive_num === 0) {
            this.setLabelValue(this.pointerLbl, "今日次\n数用完")
            this.btnOpen.active = false
            this.setButtonInfo("btnGetAward", { interactable: false })
        } else if (this.dataInfo.receive_time && now - this.dataInfo.receive_time < this.dataInfo.interval_time * 60) {
            this.btnOpen.active = false
            this.setButtonInfo("btnGetAward", { interactable: false })
            let total = this.dataInfo.interval_time * 60
            let par = now - this.dataInfo.receive_time

            let up = cc.tween()
                .call(() => {
                    let p = Math.floor(Date.now() / 1000 - this.dataInfo.receive_time)
                    this.setLabelValue(this.pointerLbl, Helper.FormatTimeString((total - p) * 1000, "mm:ss" + "后\n可抽"))
                })
                .delay(1)

            cc.tween(this.pointerLbl)
                .repeat(Math.ceil(total - par), up)
                .call(() => this.refreshPointerLbl())
                .start()
        } else {
            this.btnOpen.active = true
            this.setButtonInfo("btnGetAward", { interactable: true })
            this.setLabelValue(this.pointerLbl, "看视频\n抽奖")
        }
    }

    startTurn(angle: number, callback: Function) {
        angle += 3600
        angle = -angle
        this.spWheel.clearTracks()
        this.spWheel.setAnimation(0, "xuanzhuan", true)
        cc.tween(this.awardsContent)
            .to(5, { angle: angle }, { easing: "cubicInOut" })
            .set({ angle: angle % 360 })
            .call(() => {
                this.spWheel.clearTracks()
                this.spWheel.setAnimation(0, "daiji", true)
            })
            .delay(.2)
            .call(() => {
                callback && callback()
            })
            .delay(1.0)
            .call(() => {
                // this.close()
            })
            .start()
    }

    onPressGetAward() {
        this.setButtonInfo("btnClose", { interactable: false })
        this.btnOpen.getComponent(cc.Button).interactable = false
        if (this.dataInfo.day_times && this.dataInfo.receive_num && this.dataInfo.receive_num >= this.dataInfo.day_times) {
            this.setButtonInfo("btnClose", { interactable: true })
            Helper.OpenTip("今日次数已用完！")
            return
        }
        if (this.dataInfo.ad_aid && this.dataInfo.ad_aid > 0) {
            AdSrv.createAdOrder(this.dataInfo.ad_aid, JSON.stringify(this.dataInfo), (order_no: string) => {
                if (order_no && order_no.length > 0) {
                    AdSrv.completeAdOrder((res) => {
                        if (res && res.code == "00000") {
                            ActivitySrv.GetActivityConfig(4)
                            // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REFRESH_ACTIVITY, {activityId : this.dataInfo.activity_id})
                            if (res.award_list) {
                                let res1 = JSON.parse(res.award_list)
                                if (res1 && res1.err_code == 1) {
                                    res1.reward_index = res1.reward_index || 0
                                    if (res1.reward_index) {
                                        this.startTurnAni(res1)
                                    }
                                } else if (res1.err_msg) {
                                    this.setButtonInfo("btnClose", { interactable: true })
                                    Helper.OpenTip(res1.err_msg)
                                } else {
                                    this.setButtonInfo("btnClose", { interactable: true })
                                    Helper.OpenTip("未知错误")
                                }
                            }
                        }
                    })
                } else {
                    this.setButtonInfo("btnClose", { interactable: true })
                }
            })
        } else {
            let param = {
                activity_id: this.dataInfo.activity_id,
                delay_award: 1
            }
            ActivitySrv.GetRewardParam(param, (res) => {
                this.setButtonInfo("btnClose", { interactable: true })
                if (res && res.err_code == 1) {
                    ActivitySrv.GetActivityConfig(4)
                    // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REFRESH_ACTIVITY, {activityId : this.dataInfo.activity_id})
                    this.startTurnAni(res)
                } else if (res.err_msg) {
                    Helper.OpenTip(res.err_msg)
                }
            })
        }
    }
}
