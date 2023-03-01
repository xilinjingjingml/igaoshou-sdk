import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { UIMgr } from "../../base/UIMgr";
import { Helper } from "../../system/Helper";
import { EventMgr } from "../../base/EventMgr";
import WxWrapper from "../../system/WeChatMini";
import { Account } from "../../system/Account";
import { ActivitySrv } from "../../system/ActivitySrv";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameTop extends BaseUI {

    onOpen() {
        this.initEvent()
        this.initData()
    }

    onClose() {
        WxWrapper.hideUserInfoButton("head")
    }

    onEnable() {
        WxWrapper.showUserInfoButton(null, "head")
    }

    onDisable() {
        WxWrapper.hideUserInfoButton("head")
    }

    initEvent() {
        DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, this.updateData, this)

        EventMgr.on(Constants.EVENT_DEFINE.CHANGE_TAB, this.onChangeTab, this)

        this.setButtonClick("playerInfo/player/btnPersoanl", this.onPressFace.bind(this))
        this.setButtonClick("playerInfo/corp/btnCart", this.onPressCart.bind(this))
        this.setButtonClick("playerInfo/corp/btnBill", this.onPressBill.bind(this))
        this.setButtonClick("playerInfo/corp/btnKefu", this.onPressKefu.bind(this))
        this.setButtonClick("playerInfo/corp/btnSideMenu", this.onPressMenu.bind(this))

        this.setActive("playerInfo/corp/btnCart", false)
        this.setActive("playerInfo/corp/btnBill", false)
        this.setActive("playerInfo/corp/btnSideMenu", cc.sys.platform !== cc.sys.WECHAT_GAME)

        this.addWxUserInfoBtn()

        if(DataMgr.Config.platId === 3){
            this.setActive("playerInfo/corp/btnKefu", false)
        }
    }

    initData() {
        this.updateData()
    }

    updateData() {
        let data = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (!data) {
            return
        }

        this.setLabelValue("playerInfo/player/userName", data.userName)
        this.setSpriteFrame("playerInfo/player/avatar", data.avatar)
        this.setSpriteFrame("playerInfo/player/country", Helper.GetContry(data.region))

        if(DataMgr.Config.env != 2){
            this.setActive("playerInfo/player/country", false)
            this.setActive("playerInfo/player/areaInfo", true)   
            this.setLabelValue("playerInfo/player/areaInfo/Label", data.region)         
        }
    }

    onChangeTab(msg) {
        if (msg && msg.tab === "exchange") {
            if (!this.getNode("playerInfo/corp/btnCart").active) {
                let tween = cc.tween().set({ active: true, opacity: 0 }).to(.3, { opacity: 255 })
                this.runTween("playerInfo/corp/btnCart", tween.clone())
                this.runTween("playerInfo/corp/btnBill", tween)
            }
        } else {
            let tween = cc.tween().to(.3, { opacity: 0 }).set({ active: false })
            this.runTween("playerInfo/corp/btnCart", tween.clone())
            this.runTween("playerInfo/corp/btnBill", tween)
        }
    }

    onPressFace() {
        Helper.OpenPageUI("scene/PersonalScene", "个人中心")
    }

    onPressCart() {
        Helper.OpenPageUI("component/Exchange/ExchangeCart", "", null, {})
    }

    onPressBill() {
        Helper.OpenPageUI("component/Exchange/ExchangeBill", "我的订单", null, {})
    }

    onPressKefu() {
        let param = {
            buttons: 1,
            confirmName: "复制公众号",
            confirmUnclose: true,
            confirm: () => {Helper.copyToClipBoard("高手竞技")}
            // param: { msg: msg }
        }
        Helper.OpenPopUI("component/Personal/KefuEntry", "客服中心", null, param)
    }

    onPressMenu() {
        UIMgr.OpenUI("component/Base/GameMenu", { enterAni: Constants.PAGE_ANI.RIGHT_IN, leaveAni: Constants.PAGE_ANI.RIGHT_OUT, mask: true, maskClose: true, })
    }

    addWxUserInfoBtn() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let self = this
            let btnWeixin = this.getNode("playerInfo/player/btnPersoanl")
            Helper.createWxUserInfo(btnWeixin, "head", (sync) => {
                Helper.OpenPageUI("scene/PersonalScene", "个人中心")
            }, (create) => {
                if (!create) return
                let top = cc.Canvas.instance.node
                let base = top.getChildByName("BaseScene")

                let switchUserInfo = () => {
                    if (base.getSiblingIndex() === top.childrenCount - 1 && base.active) {
                        WxWrapper.showUserInfoButton(null, "head")
                    } else {
                        WxWrapper.hideUserInfoButton("head")
                    }
                }
                top.on(cc.Node.EventType.CHILD_ADDED, switchUserInfo, self)
                top.on(cc.Node.EventType.CHILD_REMOVED, switchUserInfo, self)

                switchUserInfo()
            })      
        }
    }

}
