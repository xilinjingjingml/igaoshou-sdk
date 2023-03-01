import BaseUI from "../../../start/script/base/BaseUI";
import { UserSrv } from "../../../start/script/system/UserSrv";
import { ActivitySrv } from "../../../start/script/system/ActivitySrv"
import { DataMgr } from "../../../start/script/base/DataMgr";
import { WxProxyWrapper } from "../../../start/script/pulgin/WxProxyWrapper";
import { UIMgr } from "../../../start/script/base/UIMgr";
import { EventMgr } from "../../../start/script/base/EventMgr";
import { Constants } from "../../../start/script/igsConstants";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Subscirbe extends BaseUI {

    onOpen() {
        this.initEvent()
        this.initData()
    }

    initEvent() {

    }

    initData() {
        UserSrv.GetGameInfo(DataMgr.data.Config.gameId, (res) => {
            this.setLabelValue("node/page2/gamename1", res.game_name)
            this.setLabelValue("node/page2/gamename2", res.game_name)
        })

        this.setSpriteFrame("node/page2/gamemask/icon", "https://download.mcbeam.cc/Image/" + DataMgr.data.Config.gameId + "_icon.png", true)
        this.setSpriteFrame("node/page2/gamemask2/icon", "https://download.mcbeam.cc/Image/" + DataMgr.data.Config.gameId + "_icon.png", true)
        this.setSpriteFrame("node/page2/xitongzuomian/gamemask/icon", "https://download.mcbeam.cc/Image/" + DataMgr.data.Config.gameId + "_icon.png", true)

        this.runTween("topArrow/jiantou1", cc.tween().repeatForever(cc.tween().by(.5, {x: 10}).delay(.1).by(.2, {x: -10})))

        if(cc.sys.WECHAT_GAME === cc.sys.platform){
            let id = WxProxyWrapper.getLaunchOptionsSync()        

            WxProxyWrapper.getPhonePlatform((system) => {
                if (system.indexOf("Android") > -1 || system.indexOf("android") > -1) {
                    this.setActive("node/page1/tjxcx", false)
                    this.setActive("node/page1/tjzm", true)
                    this.setActive("node/page2/tuozhan", false)
                    this.setActive("node/page2/xitongzuomian", true)
                    this.setActive("node/page2/title", false)
                    this.setActive("node/page2/gamemask", false)
                    this.setActive("node/page2/gamemask2", true)
        
                    if (id === 1023) {
                        this.setButtonInfo("node/btnGetaward", { interactable: true })
                    } else {
                        this.setButtonInfo("node/btnGetaward", { interactable: false })
                    }
                } else {
                    this.setActive("node/page1/tjxcx", true)
                    this.setActive("node/page1/tjzm", false)
                    this.setActive("node/page2/tuozhan", true)
                    this.setActive("node/page2/xitongzuomian", false)
                    this.setActive("node/page2/title", true)
                    this.setActive("node/page2/gamemask", true)
                    this.setActive("node/page2/gamemask2", false)
        
                    if (id === 1001 || id === 1089 || id === 1103 || id === 1104) {
                        this.setButtonInfo("node/btnGetaward", { interactable: true })
                    } else {
                        this.setButtonInfo("node/btnGetaward", { interactable: false })
                    }
                }
            })
        }
        
        if(!(cc.sys.WECHAT_GAME === cc.sys.platform && cc.sys.os == cc.sys.OS_IOS)){
            this.setLabelValue("topArrow/label", "添加到桌面")
            this.setLabelValue("node/page1/lbl2", "2.点击添加到桌面")
            this.setLabelValue("node/page1/tip", "按步骤添加到桌面，获丰厚奖励")
            this.setLabelValue("node/page2/lbl1", "3.回到桌面")
            this.setLabelValue("node/page2/lbl2", "4.点击进入我的小程序")
            this.setLabelValue("node/page2/tip", "按步骤添加到桌面，获丰厚奖励")
            // this.setLabelValue("node/bottom/tip", "添加到桌面成功后重新进入游戏即可领取奖励")
        }
    }

    onPressClose() {
        this.closeAni()
    }

    onPressNext() {
        this.setActive("node/page1", false)
        this.setActive("topArrow", false)
        this.setActive("node/page2", true)
        if(cc.sys.WECHAT_GAME !== cc.sys.platform){
            this.setButtonInfo("node/btnGetaward", { interactable: true })
        }
    }

    onPressPrev() {
        this.setActive("node/page1", true)
        this.setActive("topArrow", true)
        this.setActive("node/page2", false)
    }

    onPressGetAward() {
        ActivitySrv.GetReward(1012, (res) => {
            UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res.award_item } })
            this.close()
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SUBSCRIBE_UPDATE)
        })
    }

    closeAni() {
        let btn: cc.Node = this.param.btn
        if (btn) {
            let pos = this.node.convertToNodeSpaceAR(btn.convertToWorldSpaceAR(cc.Vec3.ZERO))
            this.setActive("topArrow", false)
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
