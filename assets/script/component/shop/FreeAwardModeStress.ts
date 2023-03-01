import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { Helper } from "../../system/Helper";
import { ActivitySrv, SignSrv } from "../../system/ActivitySrv"
import { EventMgr } from "../../base/EventMgr";

const { ccclass, property } = cc._decorator;

const icons = [
    "image/shop/SC-libaotubiao1",
    "image/shop/icon_freeweibi",
    "image/shop/SC-icon-kanguanggao1",
    "image/shop/zhuanpan",
    "image/shop/jiangquandui",
    "image/shop/jinbixiang",
    "image/shop/meiriqiandao",
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
    "image/shop/mianfeiqiandao",
    "image/shop/mianfeiyinbi",
    "image/shop/meirirenwu",
]

const icons_bg = [
    "image/shop/beijingkuang1",
    "image/shop/beijingkuang1",
    "image/shop/beijingkuang1",
    "image/shop/beijingkuang2",
    "image/shop/beijingkuang1",
    "image/shop/beijingkuang1",
    "image/shop/beijingkuang2",
    "image/shop/beijingkuang1",
]

@ccclass
export default class FreeAwardModeStress extends BaseUI {
    onLoad() {
        console.log("FreeAwardModeStress onLoad")
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
        this.setButtonClick("btn", () => {
            ActivitySrv.OnClickActivity(this.param)
        })
    }

    refreshActivityData(param: any) {
        if (this.param.activity_id == param.activityId) {
            // ActivitySrv.GetActivityConfig(param.activityId, (res: any[]) => {                
            //     console.log("FreeAwardModeStress GetActivityConfig", res)
            //    if(res && res[0]){
            //        this.updateAwardItem(res[0])
            //    }
            // })
            let activity = ActivitySrv.GetActivityById(param.activityId)
            if (activity) {
                this.updateAwardItem(activity)
            } else {
                this.node.active = false
            }
        }
    }

    initData(data: any) {
        this.setLabelValue("name", data.desc)
        // this.setLabelValue("desc", data.desc)
        // this.setActive("ad", data.ad_aid || false)
        if (icons_bg[data.icon_type - 1]) {
            this.setSpriteFrame(this.node, icons_bg[data.icon_type - 1], true)
        }

        if (icons[data.icon_type - 1]) {
            this.setSpriteFrame("icon", icons[data.icon_type - 1], true)
        }

        if (btns[data.icon_type - 1]) {
            this.setSpriteFrame("btn/Background/label", btns[data.icon_type - 1], true)
        }

        this.setLabelValue("btn/Background/name", data.name)
        

        if (data.icon_type === 4) {
            this.setActive("icon", false)
            this.setActive("zhuanpantubiao2", true)
        } else if (data.icon_type === 6) {
            this.setActive("icon", false)
            this.setActive("baoxiangtubiao2", true)
        }

        this.updateAwardItem(data)
    }

    updateAwardItem(data: any) {
        console.log("updateAwardItem", data)
        let info = data
        let now = Date.now() / 1000
        if (info.day_times && info.receive_num && info.receive_num >= info.day_times) {
            if (info.activity_id == 8) {
                this.setLabelValue("countdown", "今日已签到")
            } else {
                this.setLabelValue("countdown", "今日次数用完")
            }
            // this.setLabelValue("countdown", "今日次数用完")
            this.setActive("btn", false)
            this.setActive("countdown", true)
            this.setAni(false)
            let countdown = cc.find("countdown", this.node)
            countdown.color = cc.color(59, 83, 110)  
            this.setSpriteFrame(this.node, icons_bg[data.icon_type - 1] + "_yl", true)
        } else if (info.receive_time && now - info.receive_time < info.interval_time * 60) {
            // this.setButtonInfo("btn", { interactable: false })
            this.setActive("btn", false)
            this.setActive("countdown", true)
            this.setAni(false)
            let total = info.interval_time * 60
            let par = now - info.receive_time
            this.setLabelValue("countdown", Helper.FormatTimeString((total - par) * 1000, "hh:mm:ss") + "后可领")
            let countdown = cc.find("countdown", this.node)
            countdown.color = cc.color(255, 255, 255)            
            this.setSpriteFrame(this.node, icons_bg[data.icon_type - 1] + "_yl", true)

            let up = cc.tween()
                .call(() => {
                    let p = Math.floor(Date.now() / 1000 - info.receive_time)
                    if (total >= p) {
                        this.setLabelValue("countdown", Helper.FormatTimeString((total - p) * 1000, "hh:mm:ss") + "后可领")
                    } else {
                        this.setLabelValue("countdown", "")
                        this.setActive("countdown", false)
                        // this.setButtonInfo("btn", { interactable: true })
                        this.setActive("btn", true)
                        cc.Tween.stopAllByTarget(this.node)
                        this.setAni(true)
                    }
                })
                .delay(1)

            cc.tween(this.node)
                .repeat(Math.ceil(total - par), up)
                .call(() => this.updateAwardItem(data))
                .start()
        } else {            
            this.setSpriteFrame(this.node, icons_bg[data.icon_type - 1], true)
            this.setLabelValue("countdown", "")
            this.setActive("countdown", false)
            // this.setButtonInfo("btn", { interactable: true })
            this.setActive("btn", true)
            this.setAni(true)
        }
    }

    setAni(bRun: boolean) {
        let aniName = null
        if (this.param.icon_type === 4) {
            aniName = "zhuanpantubiao2"
        } else if (this.param.icon_type === 6) {
            aniName = "baoxiangtubiao2"
        } else {
            return
        }

        this.setSpineAni(aniName, bRun ? "xunhuan" : "ting", true)

        // let spine = this.getNodeComponent(aniName, sp.Skeleton)
        // Helper.DelayFun(() => {
        //     if (spine && spine.isValid) {
        //         spine.clearTracks()
        //         if (bRun) {
        //             spine.setAnimation(0, "xunhuan", true)
        //         } else {
        //             spine.setAnimation(0, "ting", true)
        //         }
        //     }
        // }, 1)

    }
}
