import BaseUI from "../../../../start/script/base/BaseUI";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { UIMgr } from "../../../../start/script/base/UIMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { ActivitySrv } from "../../../../start/script/system/ActivitySrv";
import { Helper } from "../../../../start/script/system/Helper";
import { UserSrv } from "../../../../start/script/system/UserSrv";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlyderAdventures extends BaseUI {
    btnOpen: cc.Node = null

    awardsContent: cc.Node = null
    itemNode: cc.Node = null
    countDownTip: cc.Node = null
    pointerLbl: cc.Node = null

    // spWheel: sp.Skeleton = null

    sptLights: cc.Node = null

    dataInfo = null
    // method: number[] = [] //0免费 1分享 2广告 默认2看广告
    onOpen() {
        Helper.reportEvent("广告点", "转盘", "打开")
        // console.log("SlyderAdventures onOpen", this.param)
        this.dataInfo = this.param.dataInfo
        this.dataInfo.receive_num = this.dataInfo.receive_num || 0
        this.countDownTip = cc.find("node/wheel/countDown/tip", this.node)
        this.countDownTip.getComponent(cc.Label).string = "您今日还有" + (this.dataInfo.day_times - this.dataInfo.receive_num) + "次机会"
        this.pointerLbl = cc.find("node/wheel/pointerNode/lbl", this.node)

        // this.setLabelValue("wheel/tips", "1.每观看一次视频可以进行1次抽奖，每日可抽取" + this.dataInfo.day_times + "次。\n2.抽取的奖品将立即获得。\n3.最终活动解释权归本公司所有")

        // this.method = AdSrv.getMethod(this.dataInfo.ad_aid)
        // console.log("SlyderAdventures this.method", this.method)

        this.initEvent()
        this.initData()
        this.initButton()
    }

    onLoad() {
        this.btnOpen = cc.find("node/btnOpen", this.node)
        this.setActive("node/btnClose", false)
        this.setActive("node/btnClose2", false)

        this.awardsContent = cc.find("node/wheel/awardsContent", this.node)
        // this.spWheel = cc.find("node/wheel/spWheel", this.node).getComponent(sp.Skeleton)
        this.itemNode = cc.find("node/wheel/awardsContent/item", this.node)
        this.itemNode.active = false

        this.sptLights = cc.find("sptLights", this.awardsContent)
    }

    initEvent() {

    }

    initButton() {
        if (cc.sys.BYTEDANCE_GAME != cc.sys.platform) {
            this.setButtonClick("node/btnOpen", this.onPressGetAward.bind(this))
        }
        this.setButtonClick("node/btnGetAward", this.onPressGetAward.bind(this))
        this.setButtonClick("node/btnOp", this.onPressGetAward.bind(this))
        this.setButtonClick("node/btnHelp", () => { this.setActive("node/btnHelpInfo", true) })
        this.setButtonClick("node/btnHelpInfo", () => { this.setActive("node/btnHelpInfo", false) })
        this.setButtonClick("node/btnClose", () => {
            Helper.reportEvent("广告点", "转盘", "关闭")
            this.param.checkQueue && EventMgr.dispatchEvent(Constants.EVENT_DEFINE.FIRST_OPEN_QUEUE)
            // this.close()
            this.closeAni()
        })
        this.setButtonClick("node/btnClose2", () => {
            Helper.reportEvent("广告点", "转盘", "关闭")
            this.param.checkQueue && EventMgr.dispatchEvent(Constants.EVENT_DEFINE.FIRST_OPEN_QUEUE)
            // this.close()
            this.closeAni()
        })

        // this.setActive("node/btnClose", true)
        // this.setActive("node/btnClose2", true)
        // cc.tween(this.node)
        //     .delay(0)
        //     .call(() => {
        //         this.setActive("node/btnClose", true)
        //         cc.tween(this.getNode("node/btnClose"))
        //             .set({ opacity: 0 })
        //             .to(.5, { opacity: 255 })
        //             .start()
        //     })
        //     .start()
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
            // let param = {
            //     activity_id: this.dataInfo.activity_id
            // }
            // let self = this
            // ActivitySrv.GetDelayReward(param, () => {
            UIMgr.OpenUI("lobby", "component/activity/turntable/TruntableAwardPop",
                {
                    param: { awards: res.award_item, autoOpenBox: true, dataInfo: this.dataInfo },
                },
                () => this.close())
            // this.setButtonInfo("node/btnClose", { interactable: true })
            // this.setButtonInfo("node/btnClose2", { interactable: true })
            // })

            this.dataInfo.receive_time = Date.now() / 1000
            this.refreshPointerLbl()
            this.setActive("blockUi", false)
        }, res)
    }

    initData() {
        this.setSpriteFrame("zhuanpan_bg_4", this.awardsContent, "component/activity/turntable/image/zhuanpan" + this.param.skinIndex)
        this.setActive("node/btnOp/Background/ndLayout/spt" + this.param.skinIndex, this.node, true)
        if (4 === this.param.skinIndex) {
            this.setSpriteFrame("node/wheel/zhuanpananniou", this.node, "component/activity/turntable/image/xuanzhuan2", true)
        }
        cc.tween(this.sptLights)
            .repeatForever(cc.tween()
                .set({ angle: -360 / 4 / 4 })
                .delay(0.5)
                .set({ angle: -360 / 4 / 4 * 2 })
                .delay(0.5)
                .set({ angle: -360 / 4 / 4 * 3 })
                .delay(0.5)
                .set({ angle: -360 / 4 / 4 * 4 })
                .delay(0.5))
            .start()

        let icons = new Map()
        icons.set(Constants.ITEM_INDEX.LOTTERY, "image/items/jiangquan_2")
        icons.set(Constants.ITEM_INDEX.CREDITS, "image/items/jifen_2")
        icons.set(Constants.ITEM_INDEX.TURNTABLE, "image/items/zhuanpanbi_2")
        icons.set(Constants.ITEM_INDEX.GOLD, "image/items/jinbi_2")

        let manyIcons = new Map()
        manyIcons.set(Constants.ITEM_INDEX.LOTTERY, "image/items/jiangquan_3")
        manyIcons.set(Constants.ITEM_INDEX.CREDITS, "image/items/jifen_3")
        manyIcons.set(Constants.ITEM_INDEX.TURNTABLE, "image/items/zhuanpanbi_3")
        manyIcons.set(Constants.ITEM_INDEX.GOLD, "image/items/jinbi_3")

        let weight = this.dataInfo.weight
        // this.dataInfo.receive_days = this.dataInfo.receive_days || 0
        // this.dataInfo.novice_days = this.dataInfo.novice_days || 0
        // if (this.dataInfo.receive_days <= this.dataInfo.novice_days) {
        //     weight = this.dataInfo.novice_weight
        // }
        for (let i = 0; i < weight.length; i++) {
            let awardInfo = weight[i].rewards[0]
            awardInfo.item_id = awardInfo.item_id || 0
            let itemNode = cc.instantiate(this.itemNode)
            itemNode.active = true
            itemNode.angle = i * (360 / weight.length)
            this.awardsContent.addChild(itemNode)

            // let icons = new Map();
            // icons.set(Constants.ITEM_INDEX.WCOIN, "image/icon/daoju-weibi")
            // icons.set(Constants.ITEM_INDEX.LOTTERY, "image/icon/daoju-jiangquan1")
            // icons.set(Constants.ITEM_INDEX.DIAMOND, "image/icon/daoju-zuanshi")

            // let manyIcons = new Map();
            // manyIcons.set(Constants.ITEM_INDEX.WCOIN, "image/icon/many_weibi")
            // manyIcons.set(Constants.ITEM_INDEX.LOTTERY, "image/icon/xuanchangjiangquan")
            // manyIcons.set(Constants.ITEM_INDEX.DIAMOND, "image/icon/many_zuanshi")

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
                this.setLabelValue("wcoin/name", itemNode, UserSrv.GetItemInfo(awardInfo.item_id).name)
            } else if (awardInfo.item_id === Constants.ITEM_INDEX.LOTTERY) {
                // this.setActive("lottery", itemNode, true)
                // this.setActive("lottery/icon", itemNode, true)                    
                this.setActive("lottery/num", itemNode, true)
                this.setLabelValue("lottery/num", itemNode, Helper.FormatNumWY(awardInfo.min_num))
                this.setActive("lottery/name", itemNode, true)
                this.setLabelValue("lottery/name", itemNode, UserSrv.GetItemInfo(awardInfo.item_id).name)
            } else if (awardInfo.item_id === Constants.ITEM_INDEX.GOLD) {
                // this.setActive("lottery", itemNode, true)
                // this.setActive("lottery/icon", itemNode, true)                    
                this.setActive("lottery/num", itemNode, true)
                this.setLabelValue("lottery/num", itemNode, Helper.FormatNumWY(awardInfo.min_num))
                this.setActive("lottery/name", itemNode, true)
                this.setLabelValue("lottery/name", itemNode, UserSrv.GetItemInfo(awardInfo.item_id).name)
            } else if (awardInfo.item_id === Constants.ITEM_INDEX.CREDITS) {
                // this.setActive("lottery", itemNode, true)
                // this.setActive("lottery/icon", itemNode, true)                    
                this.setActive("lottery/num", itemNode, true)
                this.setLabelValue("lottery/num", itemNode, Helper.FormatNumWY(awardInfo.min_num))
                this.setActive("lottery/name", itemNode, true)
                this.setLabelValue("lottery/name", itemNode, UserSrv.GetItemInfo(awardInfo.item_id).name)
            } else if (awardInfo.item_id === Constants.ITEM_INDEX.DIAMOND) {
                // this.setActive("diamond", itemNode, true)
                // this.setActive("diamond/icon", itemNode, true)
                this.setActive("diamond/num", itemNode, true)
                this.setLabelValue("diamond/num", itemNode, Helper.FormatNumPrice(awardInfo.min_num / 100))
                this.setActive("diamond/name", itemNode, true)
                this.setLabelValue("diamond/name", itemNode, UserSrv.GetItemInfo(awardInfo.item_id).name)
            }
            // }
        }

        this.refreshPointerLbl()
    }

    refreshPointerLbl() {
        let now = Date.now() / 1000
        if (-1 !== this.dataInfo.day_times && this.dataInfo.day_times - this.dataInfo.receive_num === 0) {
            this.setLabelValue(this.pointerLbl, "今日次\n数用完")
            this.btnOpen.active = false
            this.setButtonInfo("node/btnGetAward", { interactable: false })
            this.setButtonInfo("node/btnOp", { interactable: false })
        } else if (this.dataInfo.receive_time && now - this.dataInfo.receive_time < this.dataInfo.interval_time * 60) {
            this.btnOpen.active = false
            this.setButtonInfo("node/btnGetAward", { interactable: false })
            this.setButtonInfo("node/btnOp", { interactable: false })
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
            this.setButtonInfo("node/btnGetAward", { interactable: true })
            this.setButtonInfo("node/btnOp", { interactable: true })
            this.setLabelValue(this.pointerLbl, "看视频\n抽奖")


            // if(this.method[this.dataInfo.receive_num] === 0){  //0免费 1分享 2广告 默认2看广告
            console.log("methodmethod", 0)
            this.setActive("node/btnGetAward/Background/bofang", false)
            this.setActive("node/btnGetAward/Background/share", false)
            this.setNodePositionX("node/btnGetAward/Background/text", 0)
            // }else if(this.method[this.dataInfo.receive_num] === 1){
            //     this.setActive("node/btnGetAward/Background/bofang", false)
            //     this.setActive("node/btnGetAward/Background/share", true)
            //     this.setNodePositionX("node/btnGetAward/Background/text", 31)
            // }else{
            //     this.setActive("node/btnGetAward/Background/bofang", true)
            //     this.setActive("node/btnGetAward/Background/share", false)
            //     this.setNodePositionX("node/btnGetAward/Background/text", 31)
            // }
        }
    }

    startTurn(angle: number, callback: Function, res: any) {
        angle += 3600
        angle = -angle
        // this.spWheel.clearTracks()
        // this.spWheel.setAnimation(0, "xuanzhuan", true)
        cc.tween(this.awardsContent)
            .to(5, { angle: angle }, { easing: "cubicInOut" })
            .set({ angle: angle % 360 })
            .call(() => {
                // this.spWheel.clearTracks()
                // this.spWheel.setAnimation(0, "daiji", true)
                this.setActive("node/wheel/sptAward", this.node, true)
                this.setActive("node/wheel/sptAward/ndLayout/spt" + res.award_item[0].item_id, this.node, true)
                this.setLabelValue("node/wheel/sptAward/ndLayout/lblNum", this.node, res.award_item[0].item_num)
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
        Helper.reportEvent("广告点", "转盘", "点击领取")
        this.setButtonInfo("node/btnClose", { interactable: false })
        this.setButtonInfo("node/btnClose2", { interactable: false })
        this.btnOpen.getComponent(cc.Button).interactable = false
        this.setButtonInfo("node/btnOp", { interactable: false })
        cc.find("node/btnOp", this.node).getComponent(cc.Animation).enabled = false
        if (this.dataInfo.day_times && -1 !== this.dataInfo.day_times && this.dataInfo.receive_num && this.dataInfo.receive_num >= this.dataInfo.day_times) {
            // this.setButtonInfo("node/btnClose", { interactable: true })
            // this.setButtonInfo("node/btnClose2", { interactable: true })
            Helper.OpenTip("今日次数已用完！")
            return
        }
        if (this.dataInfo.ad_aid && this.dataInfo.ad_aid > 0) {
            // if(this.method[this.dataInfo.receive_num] === 0){  //0免费 1分享 2广告 默认2看广告
            this.getReward()
            // }else if(this.method[this.dataInfo.receive_num] === 1){
            //     Helper.shareInfo({sharePosition:this.dataInfo.ad_aid }, (res) => {
            //         if (res.ShareResultCode == ESocialResult.SHARERESULT_SUCCESS) {
            //             this.getReward()
            //         }else{
            //             this.setButtonInfo("node/btnClose", { interactable: true })
            //             this.setButtonInfo("node/btnClose2", { interactable: true })
            //         }
            //     })
            // }else {            
            //     AdSrv.createAdOrder(this.dataInfo.ad_aid, JSON.stringify(this.dataInfo), (res: IPlayAdCallBack) => {
            //         if (res && res.order_no && res.order_no.length > 0) {
            //             AdSrv.completeAdOrder((res) => {
            //                 if (res && res.code == "00000") {
            //                     ActivitySrv.GetActivityConfig(4)
            //                     // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REFRESH_ACTIVITY, {activityId : this.dataInfo.activity_id})
            //                     if (res.award_list) {
            //                         let res1 = Helper.ParseJson(res.award_list, "slyderAdventures")
            //                         if (res1 && res1.err_code == 1) {
            //                             res1.reward_index = res1.reward_index || 0
            //                             if (res1.reward_index) {
            //                                 this.startTurnAni(res1)
            //                             }
            //                         } else if (res1.err_msg) {
            //                             this.setButtonInfo("node/btnClose", { interactable: true })
            //                             this.setButtonInfo("node/btnClose2", { interactable: true })
            //                             Helper.OpenTip(res1.err_msg)
            //                         } else {
            //                             this.setButtonInfo("node/btnClose", { interactable: true })
            //                             this.setButtonInfo("node/btnClose2", { interactable: true })
            //                             Helper.OpenTip("未知错误")
            //                         }
            //                     }
            //                 }
            //             })
            //         } else {
            //             this.setButtonInfo("node/btnClose", { interactable: true })
            //             this.setButtonInfo("node/btnClose2", { interactable: true })
            //         }
            //     })
            // }
        } else {
            this.getReward()
        }
    }

    //不看视频直接领取奖励
    getReward() {
        let param = {
            activity_id: this.dataInfo.activity_id,
            delay_award: 1
        }
        ActivitySrv.GetRewardParam(param, (res) => {
            // this.setButtonInfo("node/btnClose", { interactable: true })
            // this.setButtonInfo("node/btnClose2", { interactable: true })
            if (res && res.err_code == 1) {
                // ActivitySrv.GetActivityConfig(4)
                ActivitySrv.GetActivityById(1013 + this.param.skinIndex - 1)
                // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REFRESH_ACTIVITY, {activityId : this.dataInfo.activity_id})
                this.startTurnAni(res)
            } else if (res.err_msg) {
                Helper.OpenTip(res.err_msg)
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
