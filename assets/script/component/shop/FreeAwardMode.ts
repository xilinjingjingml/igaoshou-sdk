import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { DataMgr } from "../../base/DataMgr";
import { ITEM_STYLE } from "../Base/ItemMode";
import { ShopSvr } from "../../system/ShopSvr";
import { Helper } from "../../system/Helper";
import ShopScene from "../../scene/ShopScene"
import { ActivitySrv, SignSrv } from "../../system/ActivitySrv"
import { EventMgr } from "../../base/EventMgr";
import WxWrapper from "../../system/WeChatMini";
import { Account } from "../../system/Account";

const { ccclass, property } = cc._decorator;

const icons = [
    "image/shop/SC-icon-libao1",
    "image/shop/icon_freeweibi",
    "image/shop/SC-icon-kanguanggao1",
    "image/shop/zhuanpan",
    "image/shop/jiangquandui",
    "image/shop/jinbixiang",
    "image/shop/meiriqiandaotubiao",
    "image/shop/yinbixiang",
    "image/shop/meirirenwutubiao",
]

const btns = [
    "image/shop/mianfeilingqu",
    "image/shop/mianfeilingqu",
    "image/shop/mianfeilingqu",
    "image/shop/mianfeichoujiang",
    "image/shop/mianfeijiangquan",
    "image/shop/mianfeijinbi",
    "image/shop/mianfeilingqu",
    "image/shop/mianfeiyinbi",
    "image/shop/meirirenwu",
]

const icons_bg = [
    "image/shop/tankuangtiao2-1",
    "image/shop/tankuangtiao4-1",
    "image/shop/tankuangtiao2-1",
    "image/shop/tankuangtiao3-1",
    "image/shop/tankuangtiao2-1",
    "image/shop/tankuangtiao2-1",
    "image/shop/tankuangtiao3-1",
    "image/shop/tankuangtiao3-1"
]

@ccclass
export default class FreeAwardMode extends BaseUI {
    onLoad() {
        console.log("FreeAwardMode onLoad")
        this.initEvent()
        this.initButton()
    }

    setParam(data) {
        this.param = data
        this.initData(data)
    }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.REFRESH_ACTIVITY, this.refreshActivityData, this)
    }

    initButton() {
        if (this.param.activity_id === 1001) {
            return
        }
        this.setButtonClick("btn", () => {
            console.log("setButtonClick")
            ActivitySrv.OnClickActivity(this.param, (res) => {
                if (res.award_item) {
                    let icon = cc.find("icon", this.node)
                    let pos = icon.convertToWorldSpaceAR(cc.Vec2.ZERO)
                    cc.log("get pos " + pos)
                    this.starWcoinAni(res.award_item[0].item_num, pos)
                }
            })
        })
    }    

    refreshActivityData(param: any) {
        cc.log("===refresh activeity data " + param)
        if (this.param.activity_id == param.activityId) {
            // ActivitySrv.GetActivityConfig(param.activityId, (res: any[]) => {
            let activity = ActivitySrv.GetActivityById(param.activityId)
            if (activity) {
                this.updateAwardItem(activity)
            } else {
                this.node.active = false
            }
        }
    }

    initData(data: any) {
        if (icons[data.icon_type - 1]) {
            this.setSpriteFrame("icon", icons[data.icon_type - 1], true)
        }

        if (this.param.activity_id === 1001) {
            this.setSpriteFrame("icon", "image/shop/shangcheng-weixin1-1", true)
        }
        // if (icons_bg[data.icon_type - 1]) {
        //     this.setSpriteFrame("icon_bg", icons_bg[data.icon_type - 1], false)
        // }

        if (this.param.activity_id === 5) {
            this.setSpriteFrame("icon_bg", "image/shop/tankuangtiao5-1", false)
        }
        
        this.setLabelValue("name", data.name)
        this.setLabelValue("desc", data.desc || "")

        this.updateAwardItem(data)
    }

    updateAwardItem(data: any) {
        console.log("updateAwardItem", data)
        this.param = data
        let info = data
        let now = Date.now() / 1000        
        if (info.activity_id === 1001) {
            let self = this
            let func = () => {             
                Helper.createWxUserInfo(this.node, "activity", (sync) => {
                    if (sync) {
                        self.node.active = false
                    }
                }, (create) => {
                    if (!create) {
                        self.node.active = false
                    } else {
                        let shop = self.getNode("BaseScene/GameCenter/main/view/content", cc.Canvas.instance.node)
                        shop.on(cc.Node.EventType.POSITION_CHANGED, () => {
                            WxWrapper.setUserInfoButtonPos(self.node, "activity")
                        }, self)
                    }
                })
            }

            this.scheduleOnce(func, .1)
            this.setActive("btnGet", true)
            this.setLabelValue("btnGet/Background/Label", "领取")
        } else if (info.activity_id == 4) {//转盘抽奖
            this.setActive("btnGet", true)
        } else if (info.day_times && info.receive_num && info.receive_num >= info.day_times) {
            this.setButtonInfo("btn", { interactable: false })
            this.setActive("point", false)
            if (info.activity_id == 8) {
                this.setButtonInfo("btn", { interactable: true })
                this.setActive("btnGet", true)
                this.setLabelValue("btnGet/Background/Label", "今日已签到")
            } else {
                this.setActive("countDown", true)
                this.setLabelValue("countDown/Background/Label", "今日次数用完")
            }
        } else if (info.receive_time && now - info.receive_time < info.interval_time * 60) {
            this.setButtonInfo("btn", { interactable: false })
            this.setActive("point", false)

            let total = info.interval_time * 60
            let par = now - info.receive_time

            this.setActive("countDown", true)
            this.setLabelValue("countDown/Background/Label", Helper.FormatTimeString((total - par) * 1000, "hh:mm:ss") + "后可领")
            this.setActive("btnGet",false)
            let up = cc.tween()
                .call(() => {
                    let p = Math.floor(Date.now() / 1000 - info.receive_time)
                    if(total >= p){
                    this.setLabelValue("countDown/Background/Label", Helper.FormatTimeString((total - p) * 1000, "hh:mm:ss") + "后可领")
                    }else{
                        this.setLabelValue("desc", data.desc || "")
                        this.setButtonInfo("btn", { interactable: true })
                        this.setActive("btnGet", true)
                        cc.Tween.stopAllByTarget(this.node)
                    }
                })
                .delay(1)

            cc.tween(this.node)
                .repeat(Math.ceil(total - par), up)
                .call(() => this.updateAwardItem(data))
                .start()
        } else {
            this.setButtonInfo("btn", { interactable: true })
            this.setActive("point", false)
            // this.setActive("btnGet", info.icon_type >= 4 && info.icon_type <= 7)
            this.setActive("btnGet", true)
            if (info.icon_type > 5 && info.icon_type <= 7) {
                this.setLabelValue("btnGet/Background/Label", "查看")
            } else {
                this.setLabelValue("btnGet/Background/Label", "领取")
            }
        }
    }

    starWcoinAni(num: number, startPos: cc.Vec2) {
        num = num > 20 ? 20 : num
        for (let i = 0; i < num; i++) {
            let pos = cc.Vec2.ZERO
            pos.x = startPos.x + Math.random() * 100 - 50
            pos.y = startPos.y + Math.random() * 100 - 50
            let spt = new cc.Node()
            spt.addComponent(cc.Sprite)
            cc.director.getScene().addChild(spt)
            spt.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.TRIMMED
            this.setSpriteFrame(spt, "image/icon/daoju-weibi")
            spt.width = 39
            spt.height = 40

            spt.setPosition(pos)
            spt.setScale((Math.random() * 5) / 10 + 0.5)

            let x = Math.random() * 200 - 100
            let y = Math.random() * 200
            var bezier = [cc.v2(pos.x - x, pos.y + y), cc.v2(pos.x - x, pos.y + y), cc.v2(cc.winSize.width / 2 - 40, cc.winSize.height - 126)];
            var bezierTo = cc.bezierTo(0.8, bezier);
            cc.tween(spt)
                .delay(0.02 * i)
                .then(bezierTo)
                .to(0.2, { opacity: 0 })
                .call(() => {
                    spt.destroy()
                })
                .start()
        }
    }
}
