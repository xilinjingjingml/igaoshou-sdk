import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { SignSrv, ActivitySrv } from "../../system/ActivitySrv"
import { UIMgr } from "../../base/UIMgr";
import { AdSrv } from "../../system/AdSrv";
import { EventMgr } from "../../base/EventMgr";
import { Helper } from "../../system/Helper";
import { User } from "../../system/User";

const { ccclass, property } = cc._decorator;

interface AwardItem {
    awardPrefab: cc.Node
    rewardInfo: any
    showNum: number
}

let manyIcons = []
manyIcons[Constants.ITEM_INDEX.WCOIN] = "image/icon/many_weibi"
manyIcons[Constants.ITEM_INDEX.LOTTERY] = "image/icon/dianquan1"
manyIcons[Constants.ITEM_INDEX.DIAMOND] = "image/icon/G6"

let litterIcons = []
litterIcons[Constants.ITEM_INDEX.WCOIN] = "image/icon/big_weibi"
litterIcons[Constants.ITEM_INDEX.LOTTERY] = "image/icon/big-jiangquan"
litterIcons[Constants.ITEM_INDEX.DIAMOND] = "image/icon/many_zuanshi"

@ccclass
export default class Sign extends BaseUI {
    content: cc.Node = null
    itemNode: cc.Node = null
    itemLastNode: cc.Node = null
    itemEmptyNode: cc.Node = null

    awardPrefab: cc.Node = null
    jiahaoPrefab: cc.Node = null
    curItemNode: cc.Node = null
    awardItemList: AwardItem[] = new Array()

    btnBeReceive: cc.Node = null
    btnReceive: cc.Node = null

    doubleToggle: cc.Node = null
    doubleTipNode: cc.Node = null
    isDouble = true
    onOpen() {
        Helper.reportEvent("大厅", "签到", "打开界面")
        console.log("Sign onOpen", this.param)

        this.param.activityConfig.ad_aid = this.param.activityConfig.ad_aid || 0
        if (this.param.activityConfig.ad_aid == 0) {
            this.doubleToggle.active = false
            this.isDouble = false
        }

        if (this.param.signConfig) {
            this.initData(this.param.signConfig)
        }

        this.initButton()

        this.setRichTextValue("node/tip", "<color=#ffffff>恭喜获得第</c><color=#fff66b> " + this.param.signConfig.DayIndex + " </color><color=#ffffff>天签到奖励，明天会有更多奖励！</c>")
    }

    onClose() {
        Helper.reportEvent("大厅", "签到", "关闭界面")
    }

    onLoad() {
        this.content = cc.find("node/content", this.node)
        this.itemNode = cc.find("item", this.content)
        this.itemNode.active = false
        this.itemLastNode = this.getNode("itemLast", this.content)
        this.itemLastNode.active = false
        this.itemEmptyNode = cc.find("itemEmpty", this.content)
        this.itemEmptyNode.active = false

        this.awardPrefab = cc.find("award", this.node)
        this.jiahaoPrefab = cc.find("jiahao", this.node)
        this.awardPrefab.active = false
        this.jiahaoPrefab.active = false

        this.doubleToggle = cc.find("node/doubleToggle", this.node)
        this.doubleToggle.getComponent(cc.Toggle).isChecked = this.isDouble
        this.btnBeReceive = cc.find("node/btnBeReceive", this.node)
        this.btnReceive = cc.find("node/btnReceive", this.node)

        this.doubleTipNode = cc.find("doubleTipNode", this.node)
        this.doubleTipNode.active = false
    }

    initEvent() {

    }

    initButton() {
        this.setButtonClick("node/btnClose", this.node, () => {
            this.close()
        })

        this.setToggleClick("node/doubleToggle", this.node, () => {
            console.log("doubleToggle on click", this.doubleToggle.getComponent(cc.Toggle).isChecked)
            this.isDouble = this.doubleToggle.getComponent(cc.Toggle).isChecked
            this.setDoubleAward()
        })

        this.setButtonClick(this.btnReceive, () => {
            // UIMgr.OpenUI("component/Activity/getAwardPop", { param: {awards:[{item_id:0, item_num:2}]}})
            if (this.param.activityConfig.ad_aid) {
                if (this.isDouble) {
                    this.setBeReceive(true)
                    this.createAdOrder()
                } else {
                    this.doubleTipNode.active = true
                }
            } else {
                this.setBeReceive(true)
                this.getAward(false)
            }
        })

        this.setButtonClick("doubleTipNode/node/btnSingle", this.node, () => {
            this.doubleTipNode.active = false
            this.setBeReceive(true)
            this.getAward(false)
        })

        this.setButtonClick("doubleTipNode/node/btnDouble", this.node, () => {
            this.doubleTipNode.active = false
            this.setBeReceive(true)
            this.createAdOrder()
        })
    }

    setBeReceive(isReceive: boolean) {
        this.btnBeReceive.active = isReceive
        this.btnReceive.active = !isReceive
        if (this.param.activityConfig.ad_aid > 0) {
            this.doubleToggle.active = !isReceive
        }
        // this.doubleToggle.getComponent(cc.Toggle).interactable = this.btnReceive.active
    }

    getAward(isDouble) {
        Helper.reportEvent("大厅", "签到", isDouble ? "多倍签到" : "单倍签到")
        SignSrv.GetReward(this.param.signConfig.DayIndex, isDouble, (res) => {
            if (res && res.err_code == 1) {
                ActivitySrv.GetActivityConfig(8)
                // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REFRESH_ACTIVITY, {activityId : this.param.activityConfig.activity_id})
                //UIMgr.OpenUI("component/Activity/getAwardPop", { param: { awards: res.award_item } })
                User.UpdateItem(() => UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res.award_item } }))
                // this.close()
                if (this.curItemNode) {
                    let finish = cc.find("finish", this.curItemNode)
                    finish.active = true
                }
            }
        })
    }

    createAdOrder() {
        AdSrv.createAdOrder(this.param.activityConfig.ad_aid, JSON.stringify(this.param.activityConfig), (order_no: string) => {
            if (order_no && order_no.length > 0) {
                AdSrv.completeAdOrder((res) => {
                    if (res && res.code == "00000") {
                        this.getAward(true)
                    }
                })
            } else {
                this.setBeReceive(false)
            }
        })
    }

    initData(signConfig: any) {
        signConfig.Receive = signConfig.Receive || 0
        for (let i = 0; i < signConfig.list.length; i++) {
            // if (i == 4) {
            //     let itemEmptyNode = cc.instantiate(this.itemEmptyNode)
            //     itemEmptyNode.active = true
            //     this.content.addChild(itemEmptyNode)
            // }

            let index = i + 1
            let info = signConfig.list[i]
            let itemNode = null
            if (i < 6) {
                itemNode = cc.instantiate(this.itemNode)
            } else {
                itemNode = cc.instantiate(this.itemLastNode)
            }
            itemNode.active = true
            this.content.addChild(itemNode)

            let title = cc.find("title", itemNode)
            title.getComponent(cc.Label).string = "第" + (index) + "天"


            let finish = cc.find("finish", itemNode)
            let cur = cc.find("cur", itemNode)
            if (index < signConfig.DayIndex) {
                finish.active = true
            } else if (index == signConfig.DayIndex) {
                cur.active = true
                finish.active = signConfig.Receive == 1
                if (signConfig.Receive == 1) {
                    this.setBeReceive(true)
                } else {
                    this.setBeReceive(false)
                }
            }


            let rwardNode = cc.find("rwardNode", itemNode)
            let rewardList = info.reward_list
            if (signConfig.Novice == 1) {
                rewardList = info.novice_reward_list
            }

            let jiahao: cc.Node = null
            if (i === 6) {
                continue
            }
            for (let i = 0; i < 1; i++) {
                let reward = rewardList[i]
                reward.item_id = reward.item_id || 0
                let award = cc.instantiate(this.awardPrefab)
                award.active = true
                rwardNode.addChild(award)
                if (manyIcons[reward.item_id]) {
                    this.setSpriteFrame("icon", award, manyIcons[reward.item_id], true)
                    if (index == signConfig.DayIndex) {
                        this.setSpriteFrame("node/curAwardIcon", manyIcons[reward.item_id], true)
                    }
                }
                // let num = cc.find("num", award)

                this.setActive("wcoin", award, false)
                this.setActive("lottery", award, false)
                this.setActive("diamond", award, false)

                // if (reward.item_id === Constants.ITEM_INDEX.WCOIN) {
                //     this.setActive("wcoin", award, true)
                //     this.setLabelValue("wcoin", award, this.isDouble ? reward.multiple_num : reward.item_num)
                // } else if (reward.item_id === Constants.ITEM_INDEX.LOTTERY) {
                //     this.setActive("lottery", award, true)
                //     this.setLabelValue("lottery", award, this.isDouble ? reward.multiple_num : reward.item_num)
                // } else if (reward.item_id === Constants.ITEM_INDEX.DIAMOND) {
                //     this.setActive("diamond", award, true)
                //     this.setLabelValue("diamond", award, Helper.FormatNumPrice(this.isDouble ? reward.multiple_num / 100: reward.item_num / 100))
                // }

                if (reward.item_id === Constants.ITEM_INDEX.DIAMOND) {
                    this.setLabelValue("num", award, Helper.FormatNumPrice(this.isDouble ? reward.multiple_num / 100 : reward.item_num / 100))
                } else {
                    this.setLabelValue("num", award, this.isDouble ? reward.multiple_num : reward.item_num)
                }

                let num = cc.find("num", award)
                if (cur.active) {
                    num.color = cc.color(151, 76, 38)
                } else {
                    num.color = cc.color(54, 85, 165)
                }

                // num.getComponent(cc.Label).string = reward.item_num
                // if(this.isDouble){
                //     num.getComponent(cc.Label).string = reward.multiple_num
                // }

                if (index === signConfig.DayIndex) {
                    this.curItemNode = itemNode
                }

                if (index >= signConfig.DayIndex) {
                    let awardItem: AwardItem = {
                        awardPrefab: award,
                        rewardInfo: reward,
                        showNum: reward.item_num
                    }
                    if (this.isDouble) {
                        awardItem.showNum = reward.multiple_num
                    }
                    this.awardItemList.push(awardItem)
                }

                // if(i < rewardList.length - 1){
                //     jiahao = cc.instantiate(this.jiahaoPrefab)
                //     jiahao.active = true
                //     rwardNode.addChild(jiahao)
                // }
            }
        }
    }

    setDoubleAward() {
        for (let v of this.awardItemList) {
            let end = v.rewardInfo.item_num
            if (this.isDouble) {
                end = v.rewardInfo.multiple_num
                this.setSpriteFrame("icon", v.awardPrefab, manyIcons[v.rewardInfo.item_id])
                this.setSpriteFrame("node/curAwardIcon", manyIcons[v.rewardInfo.item_id], true)
            } else {
                this.setSpriteFrame("icon", v.awardPrefab, litterIcons[v.rewardInfo.item_id])
                this.setSpriteFrame("node/curAwardIcon", litterIcons[v.rewardInfo.item_id], true)
            }

            let num = null
            num = cc.find("num", v.awardPrefab)
            this.stopTween(num)
            this.runTween(num, Helper.TokenAni(v.showNum, end, .4, (src) => {
                v.showNum = src
                if (v.rewardInfo.item_id === Constants.ITEM_INDEX.DIAMOND) {
                    src = src / 100
                    num.getComponent(cc.Label).string = Helper.FormatNumPrice(src)
                } else {
                    num.getComponent(cc.Label).string = src
                }
            }))
        }
    }

    showAni(src: number, dst: number, callback: Function): cc.Tween {
        let val = src - dst
        let interval = 3.0 / Math.abs(val)
        if (Math.abs(val) < 1) {
            interval = 3.0 / Math.abs(val * 100)
        }
        let cb = cc.tween().delay(interval).call(() => {
            if (Math.abs(val) < 1) {
                src += (src > dst) ? -.01 : .01
            } else {
                src += (src > dst) ? -1 : 1
            }

            callback(src)
        })
        return cc.tween().repeat(Math.abs(val) < 1 ? Math.abs(Math.floor(val * 100)) : Math.abs(val), cb)
    }
}
