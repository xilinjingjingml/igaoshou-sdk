import BaseUI from "../../../../start/script/base/BaseUI";
import { Constants } from "../../../../start/script/igsConstants";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { SignSrv, ActivitySrv } from "../../../../start/script/system/ActivitySrv";
import { UserSrv } from "../../../../start/script/system/UserSrv";
import { UIMgr } from "../../../../start/script/base/UIMgr";
import { AdSrv } from "../../../../start/script/system/AdSrv";
import { Helper } from "../../../../start/script/system/Helper";

const { ccclass, property } = cc._decorator;

interface AwardItem {
    awardPrefab: cc.Node
    rewardInfo: any
    showNum: number
}

let manyIcons = []
manyIcons[Constants.ITEM_INDEX.GOLD] = "image/icon/many_weibi"
manyIcons[Constants.ITEM_INDEX.LOTTERY] = "image/shop/jiangquandui"
manyIcons[Constants.ITEM_INDEX.CREDITS] = "image/icon/G6"

let litterIcons = []
litterIcons[Constants.ITEM_INDEX.GOLD] = "image/icon/big_weibi"
litterIcons[Constants.ITEM_INDEX.LOTTERY] = "image/icon/big-jiangquan"
litterIcons[Constants.ITEM_INDEX.CREDITS] = "image/icon/many_zuanshi"

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


    btnFreeReceive: cc.Node = null
    btnReceive: cc.Node = null
    btnClose2: cc.Node = null

    isDouble = true

    onOpen() {
        this.param.activityConfig.ad_aid = this.param.activityConfig.ad_aid || 0

        if (cc.sys.BYTEDANCE_GAME === cc.sys.platform) {
            this.param.activityConfig.ad_aid = 0
        }

        if (this.param.activityConfig.ad_aid == 0) {
            this.isDouble = false
            this.btnFreeReceive.active = true
            this.btnReceive.active = false
            this.btnClose2.active = false
        } else {
            this.isDouble = true
            this.btnFreeReceive.active = false
            this.btnReceive.active = true
            this.btnClose2.active = true
        }

        if (this.param.signConfig) {
            this.initData(this.param.signConfig)
        }

        this.initButton()

        this.setRichTextValue("node/tip", "<color=#ffffff>恭喜获得第</c><color=#fff66b> " + this.param.signConfig.DayIndex + " </color><color=#ffffff>天签到奖励，明天会有更多奖励！</c>")
    }

    onClose() {
        // Helper.reportEvent("大厅", "签到", "关闭界面")        
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

        this.btnFreeReceive = cc.find("node/btnFreeReceive", this.node)
        this.btnReceive = cc.find("node/btnReceive", this.node)
        this.btnClose2 = cc.find("node/btnClose2", this.node)
        this.btnFreeReceive.active = false
        this.btnReceive.active = false
        this.btnClose2.active = false
    }

    initEvent() {

    }

    initButton() {
        this.setButtonClick("node/btnClose", this.node, () => {
            this.param.checkQueue && EventMgr.dispatchEvent(Constants.EVENT_DEFINE.FIRST_OPEN_QUEUE)
            this.closeAni()
        })

        this.setButtonClick(this.btnClose2, this.node, () => {
            this.param.checkQueue && EventMgr.dispatchEvent(Constants.EVENT_DEFINE.FIRST_OPEN_QUEUE)
            this.closeAni()
        })

        this.setButtonClick(this.btnFreeReceive, this.node, () => {
            this.onReceive()
        })

        this.setButtonClick(this.btnReceive, this.node, () => {
            this.onReceive()
        })

    }

    setBeReceive(isReceive: boolean) {
        if (this.param.activityConfig.ad_aid == 0) {
            this.btnFreeReceive.active = !isReceive
        } else {
            this.btnReceive.active = !isReceive
            this.btnClose2.active = !isReceive
        }
    }

    onReceive() {
        if (this.param.activityConfig.ad_aid && this.isDouble) {
            this.setBeReceive(true)
            this.createAdOrder()
        } else {
            this.setBeReceive(true)
            this.getAward(false)
        }
    }

    getAward(isDouble) {
        SignSrv.GetReward(this.param.signConfig.DayIndex, isDouble, (res) => {
            if (res && res.err_code == 1) {
                ActivitySrv.GetActivityConfig(8)
                UserSrv.UpdateItem(() => UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: res.award_item }, }, () => this.close()))
                // this.close()
                if (this.curItemNode) {
                    let finish = cc.find("finish", this.curItemNode)
                    finish.active = true
                }

                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SIGN_AWARD_UPDATE)
            }
        })
    }

    createAdOrder() {
        AdSrv.createAdOrder(this.param.activityConfig.ad_aid, JSON.stringify(this.param.activityConfig), (res: IPlayAdCallBack) => {
            if (res && res.order_no && res.order_no.length > 0) {
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

                let name = ""
                if (reward.item_id === Constants.ITEM_INDEX.GOLD) {
                    name = "golds"
                } else if (reward.item_id === Constants.ITEM_INDEX.LOTTERY) {
                    name = "lotterys"
                } else if (reward.item_id === Constants.ITEM_INDEX.CREDITS) {
                    name = "creditses"
                }

                this.setActive(name, award, true)
                this.setSpriteFrame("node/curAwardIcon", this.getNodeComponent(name, award, cc.Sprite)?.spriteFrame, true)

                // if (manyIcons[reward.item_id]) {
                //     this.setSpriteFrame("icon", award, manyIcons[reward.item_id], true)
                //     if (index == signConfig.DayIndex) {
                //         this.setSpriteFrame("node/curAwardIcon", manyIcons[reward.item_id], true)
                //     }
                // }

                this.setLabelValue("num", award, this.isDouble ? reward.multiple_num : reward.item_num)

                let num = cc.find("num", award)
                if (cur.active) {
                    num.color = cc.color(151, 76, 38)
                } else {
                    num.color = cc.color(54, 85, 165)
                }

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

            }
        }
    }

    setDoubleAward() {
        for (let v of this.awardItemList) {
            let end = v.rewardInfo.item_num
            if (this.isDouble) {
                end = v.rewardInfo.multiple_num
                let name = ""
                if (v.rewardInfo.item_id === Constants.ITEM_INDEX.GOLD) {
                    name = "golds"
                } else if (v.rewardInfo.item_id === Constants.ITEM_INDEX.LOTTERY) {
                    name = "lotterys"
                } else if (v.rewardInfo.item_id === Constants.ITEM_INDEX.CREDITS) {
                    name = "creditses"
                }

                this.setActive(name, v.awardPrefab, true)
                this.setSpriteFrame("node/curAwardIcon", this.getNodeComponent(name, cc.Sprite)?.spriteFrame, true)

            } else {
                let name = ""
                if (v.rewardInfo.item_id === Constants.ITEM_INDEX.GOLD) {
                    name = "golds"
                } else if (v.rewardInfo.item_id === Constants.ITEM_INDEX.LOTTERY) {
                    name = "lotterys"
                } else if (v.rewardInfo.item_id === Constants.ITEM_INDEX.CREDITS) {
                    name = "creditses"
                }

                this.setActive(name, v.awardPrefab, true)
                this.setSpriteFrame("node/curAwardIcon", this.getNodeComponent(name, cc.Sprite)?.spriteFrame, true)
            }

            let num = null
            num = cc.find("num", v.awardPrefab)
            this.stopTween(num)
            this.runTween(num, Helper.TokenAni(v.showNum, end, .4, (src) => {
                v.showNum = src
                num.getComponent(cc.Label).string = src
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

    closeAni() {
        let pos = cc.v3(-40, cc.winSize.height / 2 - 40)
        let btn: cc.Node = this.param.btn
        if (btn) {
            pos = this.node.convertToNodeSpaceAR(btn.convertToWorldSpaceAR(cc.Vec3.ZERO))
        }
        this.runTween("node",
            cc.tween()
                .to(.3, { position: pos, scale: .05 })
                .delay(0)
                .call(() => this.close())
        )
    }
}
