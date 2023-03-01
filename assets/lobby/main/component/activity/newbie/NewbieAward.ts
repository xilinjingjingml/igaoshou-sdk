import BaseUI from "../../../../start/script/base/BaseUI";
import { Constants } from "../../../../start/script/igsConstants";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { Helper } from "../../../../start/script/system/Helper";
import { AdSrv } from "../../../../start/script/system/AdSrv";
import { ActivitySrv } from "../../../../start/script/system/ActivitySrv";
import { DataMgr } from "../../../../start/script/base/DataMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewbieAward extends BaseUI {
    received = false
    onOpen() {
        this.initData()
        this.initEvent()

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_BANNER)
    }

    onDisable() {
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BANNER)
    }

    initData() {
        // this.param.activityInfo.ad_aid = this.param.activityInfo.ad_aid || 0
        // let awards = this.param.activityInfo.weight[0].rewards.filter(i => i.item_id && i.item_id !== Constants.ITEM_INDEX.WCOIN)
        // let multiple = true
        // let _lottery = 0
        // let lottery = 0
        // let _diamond = 0
        // let diamond = 0

        // // let manyIcons = []
        // // manyIcons[Constants.ITEM_INDEX.LOTTERY] = "image/icon/jiangquandui"
        // // manyIcons[Constants.ITEM_INDEX.DIAMOND] = "image/icon/many_zuanshi"

        // // let litterIcons = []
        // // litterIcons[Constants.ITEM_INDEX.LOTTERY] = "image/icon/daoju-jiangquan1"
        // // litterIcons[Constants.ITEM_INDEX.DIAMOND] = "image/icon/big_zuanshi"

        // for (let v of awards) {
        //     v.multiple_min_num = v.multiple_min_num || v.min_num
        //     if (v.item_id == Constants.ITEM_INDEX.LOTTERY) {
        //         lottery = v.multiple_min_num
        //         //         this.setSpriteFrame("Step3/daoju-jiangquan", manyIcons[Constants.ITEM_INDEX.LOTTERY])

        //     } else if (v.item_id == Constants.ITEM_INDEX.DIAMOND) {
        //         diamond = v.multiple_min_num
        //         //         this.setSpriteFrame("Step3/many_zuanshi", manyIcons[Constants.ITEM_INDEX.DIAMOND])
        //     }
        // }

        // if (_lottery == 0) {
        //     _lottery = lottery
        // }
        // this.stopTween("Step3/awards/lottery/lottery")
        // this.runTween("Step3/awards/lottery/lottery", Helper.TokenAni(_lottery, lottery, 0.4, (src) => {
        //     this.setLabelValue("Step3/awards/lottery/lottery", src)
        //     _lottery = src
        // }))

        // if (_diamond === 0) {
        //     _diamond = diamond
        // }
        // this.stopTween("Step3/awards/diamond/diamond")
        // this.runTween("Step3/awards/diamond/diamond", Helper.TokenAni(_diamond, diamond, 0.4, (src) => {
        //     this.setLabelValue("Step3/awards/diamond/diamond", Helper.FormatNumPrice(src / 100))
        //     _diamond = src
        // }))

        // this.setActive("Step3/awards/diamond", diamond > 0)
        // this.setActive("Step3/awards/lottery", lottery > 0)
        // this.setActive("Step3/awards/lottery/jiahao", diamond > 0 && lottery > 0)


        // let close = this.getNode("Step3/btnClose")
        // let pos = close.position
        // cc.tween(close).set({ opacity: 0, position: cc.v3(-20000, -20000) }).delay(0).set({ position: pos }).to(.5, { opacity: 255 }).start()

        // let tween = cc.tween().set({opacity: 0}).delay(2).to(.5, {opacity: 255})
        // this.runTween("Step3/btnNext/shou1", tween)

        // if(cc.sys.BYTEDANCE_GAME != cc.sys.platform){
        //     let tween = cc.tween().repeatForever(cc.tween().to(0.4, {scale:1.1}).to(0.4, {scale:1.0}))
        //     this.runTween("Step3/btnNext", tween)
        // }

        //Helper.reportEvent("大厅引导3", "新手奖励", "")
    }

    initEvent() {
        this.setButtonClick("Step3/btnNext", this.onPressGetAward.bind(this))
        this.setButtonClick("Step3/btnClose", () => {
            this.param.checkQueue && EventMgr.dispatchEvent(Constants.EVENT_DEFINE.FIRST_OPEN_QUEUE)
            Helper.reportEvent("首局结算-5.3.4、关闭新人礼包界面")
            this.closeAni()
        })
    }

    onPressGetAward() {
        if (this.received) {
            return
        }
        Helper.reportEvent("首局结算-5.3.1、观看新人礼包视频")
        let self = this
        AdSrv.PlayAD(this.param.activityInfo.ad_aid, null/*JSON.stringify(this.param.activityInfo)*/)
            .then(() => {
                console.log("NewbieAward.onPressGetAward")
                Helper.reportEvent("首局结算-5.3.2、观看视频完成")
                let param = {
                    activity_id: this.param.activityInfo.activity_id,
                    multiple: 1
                }
                ActivitySrv.GetRewardParam(param, (res) => {
                    console.log("adsvr.getRewardParam", JSON.stringify(res))
                    if (res && res.err_code == 1) {
                        this.received = true
                        ActivitySrv.CleanActivityDataById(this.param.activityInfo.activity_id)
                        Helper.reportEvent("首局结算-5.3.3、获得新人礼包奖励")
                        this.setButtonInfo("Step3/btnNext", { instantiate: false })
                        this.setButtonInfo("Step3/btnClose", { instantiate: false })
                        let jh = this.getNode("Step3/awards")
                        let pos = jh.parent.convertToWorldSpaceAR(jh.position)
                        this.starAwardAni(pos, 0, () => {
                            // self.param.checkQueue && EventMgr.dispatchEvent(Constants.EVENT_DEFINE.FIRST_OPEN_QUEUE)
                            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.NEWBIE_AWARD_UPDATE)
                            this.close()
                        })

                        //Helper.reportEvent("大厅引导3", "新手奖励关闭", "")
                    } else if (res.err_msg) {
                        Helper.OpenTip(res.err_msg)
                    }
                })
            })
            .catch((res) => {
                console.log("NewbieAward.onPressGetAward catch" + res)
            })
    }

    starAwardAni(startPos: cc.Vec3, type: number, callback?: Function) {
        let dirs = DataMgr.getData<cc.Vec2[]>(Constants.DATA_DEFINE.MAIN_SCENE_TOKEN_POS) || {
            [Constants.ITEM_INDEX.LOTTERY]: cc.v2(cc.winSize.width / 2 + (Math.random() * 80) - 40, cc.winSize.height - 120)
        }
        let num = 30
        for (let i = 0; i < num; i++) {
            let pos = cc.Vec2.ZERO
            pos.x = startPos.x + Math.random() * 100 - 50
            pos.y = startPos.y + Math.random() * 100 - 50
            // let pos = dirs[Constants.ITEM_INDEX.LOTTERY] || cc.Vec2.ZERO
            let spt = new cc.Node()
            spt.addComponent(cc.Sprite)
            cc.director.getScene().addChild(spt)
            spt.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.TRIMMED
            this.setSpriteFrame(spt, this.getNodeComponent("icon", cc.Sprite)?.spriteFrame)
            // if (type === 0) {
            //     if (Math.random() > .5) {
            //         this.setSpriteFrame(spt, "image/icon/daoju-jiangquan1")
            //     } else {
            //         this.setSpriteFrame(spt, "image/icon/big_zuanshi")
            //     }
            // } else {
            //     this.setSpriteFrame(spt, "image/icon/big_weibi")
            // }

            spt.width = 39
            spt.height = 40

            spt.setPosition(pos)
            spt.setScale((Math.random() * 5) / 10 + 0.5)

            let x = Math.random() * 200 - 100
            let y = Math.random() * 200            
            let tPos = dirs[Constants.ITEM_INDEX.LOTTERY] || cc.Vec2.ZERO
            var bezier = [cc.v2(pos.x - x, pos.y + y), cc.v2(pos.x - x, pos.y + y), tPos];
            var bezierTo = cc.bezierTo(0.8, bezier);
            cc.tween(spt)
                .delay(0.02 * i)
                .then(bezierTo)
                .to(0.2, { opacity: 0 })
                .call(() => {
                    spt.destroy()
                    if (i === num - 1) {
                        callback && callback()
                    }
                })
                .start()
        }
    }

    closeAni() {
        let pos = cc.v3(-40, cc.winSize.height / 2 - 40)
        let btn: cc.Node = this.param.btn
        if (btn) {
            pos = this.node.convertToNodeSpaceAR(btn.convertToWorldSpaceAR(cc.Vec3.ZERO))
        }
        this.runTween("Step3",
            cc.tween()
                .to(.3, { position: pos, scale: .05 })
                .delay(0)
                .call(() => this.close())
        )
    }
}
