import BaseUI from "../../../../start/script/base/BaseUI";
import { Helper } from "../../../../start/script/system/Helper";
import { Constants } from "../../../../start/script/igsConstants";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { ActivitySrv } from "../../../../start/script/system/ActivitySrv";
import { User } from "../../../../start/script/data/User";
import { UIMgr } from "../../../../start/script/base/UIMgr";
import { DataMgr } from "../../../../start/script/base/DataMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Poker extends BaseUI {
    ndPoker: dragonBones.ArmatureDisplay = null
    sptPoker: cc.Node = null
    sptPoker2: cc.Node = null
    sptPokerValue: cc.Node = null
    curGuess: number = 1
    curReward: any = null

    onOpen() {
        console.log("Poker onOpen", this.param)

        this.initButton()
        this.initData()
    }

    onLoad() {
        this.ndPoker = cc.find("node/ndAni/ndPoker", this.node).getComponent(dragonBones.ArmatureDisplay)
        this.sptPoker = cc.find("node/ndAni/sptPoker", this.node)
        this.sptPokerValue = cc.find("node/ndAni/sptPoker2/sptNum", this.node)
        this.sptPoker2 = cc.find("node/ndAni/sptPoker2", this.node)
    }

    onClose() {
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.TURNTABLE_GET_AWARD)
    }

    initEvent() {
    }

    initButton() {
        this.setButtonClick("node/ndBottom1/btnSmall", this.node, () => {
            this.setActive("node/ndBottom1", false)
            this.curGuess = 1
            this.pokerCrap({ activity_id: this.param.dataInfo.activity_id, guess: this.curGuess }, this.result.bind(this))
        })
        this.setButtonClick("node/ndBottom1/btnBig", this.node, () => {
            this.setActive("node/ndBottom1", false)
            this.curGuess = 8
            this.pokerCrap({ activity_id: this.param.dataInfo.activity_id, guess: this.curGuess }, this.result.bind(this))
        })
        this.setButtonClick("node/ndBottom1/btnGet", this.getReward.bind(this))

        this.setButtonClick("node/ndBottom2/btnGet", this.getReward.bind(this))
        this.setButtonClick("node/ndBottom2/btnDouble", this.node, () => {
            this.init()
        })
        this.setButtonClick("node/ndBottom2/btnShare", this.node, () => { Helper.shareInfo() })

        this.setButtonClick("node/ndBottom3/btnGet", this.getReward.bind(this))
        this.setButtonClick("node/ndBottom3/btnShare", this.node, () => { Helper.shareInfo() })

        this.setButtonClick("node/ndBottom4/btnExit", this.node, () => {
            console.log("btnExit")
            let param = {
                activity_id: this.param.dataInfo.activity_id
            }
            ActivitySrv.GetDelayReward(param, () => {
                UIMgr.OpenUI("lobby", "component/activity/turntable/MainTurntable", { single: true, param: {} }, () => { this.close() })
            })
        })

        this.setButtonClick("btnBack", this.node, this.getReward.bind(this))
    }

    initData() {
        this.ndPoker.playAnimation("newAnimation", 1)
        if (this.param.member) {
            cc.find("node/membertip", this.node).active = true
        }

        let awards = this.param.awardInfo
        if (!awards) {
            this.close()
        }
        this.curReward = awards

        for (let i in awards) {
            let a = awards[i]
            this.setActive("node/ndNormal/ndNow/ndLayout/spt" + a.item_id, this.node, true)
            this.setLabelValue("node/ndNormal/ndNow/ndLayout/lblNum", this.node, Helper.FormatNumWY(a.item_num))

            this.setActive("node/ndNormal/ndAfter/ndLayout/spt" + a.item_id, this.node, true)
            this.setLabelValue("node/ndNormal/ndAfter/ndLayout/lblNum", this.node, Helper.FormatNumWY(a.item_num * 2))

            this.setActive("node/ndInfo/spt" + a.item_id, this.node, true)
            this.setLabelValue("node/ndInfo/lblNum", this.node, Helper.FormatNumWY(a.item_num))
        }
    }

    init() {
        this.setActive("node/ndBottom2", false)
        this.setActive("node/ndBottom1", true)

        this.setActive("node/ndNormal", this.node, true)
        this.setActive("node/ndWin", this.node, false)

        this.setActive(this.sptPoker2, false)
        this.sptPoker.x = -160

        this.ndPoker.playAnimation("newAnimation", 1)
    }

    result(res) {
        this.setSpriteFrame(this.sptPokerValue, "component/activity/poker/image/" + res.result)
        this.setActive(this.sptPoker, true)
        cc.tween(this.sptPoker).to(1, { x: 160 }).delay(0.1).call(() => {
            this.setActive(this.sptPoker, false)
            this.setActive(this.sptPoker2, true)

            if (res.award_item) {
                this.curReward = res.award_item
                if (res.cur_times < res.max_times) {
                    this.setLabelValue("node/ndTop/lblDesc", this.node, "恭喜，您的奖励翻倍。\n如果继续猜对，你还可以翻倍" + (res.max_times - res.cur_times) + "次！")
                    this.setActive("node/ndBottom2", true)
                } else {
                    this.setLabelValue("node/ndTop/lblDesc", this.node, "你的翻倍次数用完了。\n你的奖励已经翻了16倍。")
                    this.setActive("node/ndBottom3", true)
                }

                for (let i in res.award_item) {
                    let a = res.award_item[i]
                    this.setActive("node/ndNormal/ndNow/ndLayout/spt" + a.item_id, this.node, true)
                    this.setLabelValue("node/ndNormal/ndNow/ndLayout/lblNum", this.node, Helper.FormatNumWY(a.item_num))

                    this.setActive("node/ndNormal/ndAfter/ndLayout/spt" + a.item_id, this.node, true)
                    this.setLabelValue("node/ndNormal/ndAfter/ndLayout/lblNum", this.node, Helper.FormatNumWY(a.item_num * 2))

                    this.setActive("node/ndWin/ndLayout/spt" + a.item_id, this.node, true)
                    this.setLabelValue("node/ndWin/ndLayout/lblNum", this.node, Helper.FormatNumWY(a.item_num))
                }

                this.setActive("node/ndNormal", this.node, false)
                this.setActive("node/ndWin", this.node, true)
            } else {
                this.curReward = null
                this.setActive("node/ndNormal", this.node, false)
                this.setLabelValue("node/ndTop/lblDesc", this.node, "很抱歉，您猜错了，\n祝您下次好运！")
                this.setActive("node/ndBottom4", true)
            }
        }).start()
    }

    pokerCrap(param, callback) {
        Helper.PostHttp("igaoshou-activity-srv/activity/PokerCrap", null, param, (res) => {
            console.log("PokerCrap", res)
            if (res) {
                if (res.err_code == 1) {
                    callback && callback(res)
                } else if (res.err_msg) {
                    Helper.OpenTip(res.err_msg)
                }
            }
        })
    }

    getReward() {
        let param = {
            activity_id: this.param.dataInfo.activity_id
        }
        ActivitySrv.GetDelayReward(param, () => {
            if (!this.curReward){
                UIMgr.OpenUI("lobby", "component/activity/turntable/MainTurntable", { single: true, param: {} }, () => { this.close() })
                return
            }
            for (let i in this.curReward) {
                let a = this.curReward[i]
                if (a.item_id === Constants.ITEM_INDEX.LOTTERY) {
                    if (!this.param.noShowAni) {
                        User.Lottery -= Number(a.item_num)
                    }
                } else if (a.item_id === Constants.ITEM_INDEX.GOLD) {
                    if (!this.param.noShowAni) {
                        User.Gold -= Number(a.item_num)
                    }
                } else if (a.item_id === Constants.ITEM_INDEX.CREDITS) {
                    if (!this.param.noShowAni) {
                        User.Credits -= Number(a.item_num)
                    }
                }
            }
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_USER_ITEM)

            this.node.children.forEach(i => i.active = false)
            for (let i in this.curReward) {
                let a = this.curReward[i]
                let n = this.getNode("item" + a.item_id)
                let pos = this.node.convertToWorldSpaceAR(n.position)

                this.createAni(a.item_id, Number(a.item_num), pos)
            }
        })
    }

    createAni(id: number, num: number, startPos: cc.Vec3) {
        let dirs = DataMgr.getData<cc.Vec2[]>(Constants.DATA_DEFINE.MAIN_SCENE_TOKEN_POS)
        let src = num
        num = Math.max(10, num > 20 ? 20 : num)
        for (let i = 0; i < num; i++) {
            let pos = cc.Vec2.ZERO
            pos.x = startPos.x + Math.random() * 100 - 50
            pos.y = startPos.y + Math.random() * -20
            let spt = new cc.Node()
            spt.addComponent(cc.Sprite)
            cc.director.getScene().addChild(spt)
            spt.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.TRIMMED
            let tPos = this.node.convertToNodeSpace(dirs[id] || cc.Vec2.ZERO)//cc.Vec2.ZERO
            if (id === Constants.ITEM_INDEX.LOTTERY) {
                this.setSpriteFrame(spt, "image/items/jiangquan_2")
                // tPos = this.node.convertToNodeSpace(cc.v2(445, cc.winSize.height - 90))
            } else if (id === Constants.ITEM_INDEX.GOLD) {
                this.setSpriteFrame(spt, "image/items/jinbi_2")
                // tPos = this.node.convertToNodeSpace(cc.v2(155, cc.winSize.height - 90))
            } else if (id === Constants.ITEM_INDEX.CREDITS) {
                this.setSpriteFrame(spt, "image/items/jifen_2")
                // tPos = this.node.convertToNodeSpace(cc.v2(305, cc.winSize.height - 90))
            }

            spt.width = 39
            spt.height = 40

            spt.setPosition(startPos)
            spt.setScale(1)

            let x = Math.random() * 200 - 100
            let y = Math.random() * 200

            var born = [cc.v2(startPos.x, startPos.y), cc.v2(startPos.x + (pos.x - startPos.x) / 2, startPos.y + Math.random() * 80), pos]
            var bezier = [cc.v2(pos.x - x, pos.y + y), cc.v2(pos.x - x, pos.y + y), tPos]//cc.v2(cc.winSize.width / 2 - 40, cc.winSize.height - 126)];
            var bezierTo = cc.bezierTo(.8, bezier);
            let t = null
            if (i === num - 1) {
                t = cc.tween()
                    .call(() => {
                        if (id === Constants.ITEM_INDEX.LOTTERY) {
                            User.Lottery += src
                        } else if (id === Constants.ITEM_INDEX.GOLD) {
                            User.Gold += src
                        } else if (id === Constants.ITEM_INDEX.CREDITS) {
                            User.Credits += src
                        } 
                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_USER_ITEM, { bAni: true })
                        this.close()

                        let param = {
                            activity_id: this.param.dataInfo.activity_id
                        }
                        ActivitySrv.GetRewardParam(param, () => {
                        })

                        UIMgr.OpenUI("lobby", "component/activity/turntable/MainTurntable", { single: true, param: {} })
                    })
            } else {
                t = cc.tween().delay(0)
            }

            cc.tween(spt)
                .delay(0.02 * i)
                .parallel(
                    cc.tween()
                        .delay(.1)
                        .to(.1, { position: cc.v3(born[1]) })
                        .to(.15, { position: cc.v3(born[2]) }),
                    cc.tween()
                        .to(.2, { scale: 1.5 })
                )
                .delay(.3)
                .parallel(
                    cc.tween().then(bezierTo),
                    cc.tween().to(.8, { scale: 1 })
                )
                .to(0.2, { opacity: 0 })
                .then(t)
                .call(() => {
                    spt.destroy()
                })
                .start()
        }
    }
}
