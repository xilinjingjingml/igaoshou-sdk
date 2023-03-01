﻿import BaseUI from "../../../start/script/base/BaseUI";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { Constants } from "../../../start/script/igsConstants";
import { Helper } from "../../../start/script/system/Helper";
import { PluginMgr } from "../../../start/script/base/PluginMgr";
import { EventMgr } from "../../../start/script/base/EventMgr";
import { UIMgr } from "../../../start/script/base/UIMgr";
import { User } from "../../../start/script/data/User";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TokenInfoEntry extends BaseUI {

    _gold: number = null
    _lottery: number = null
    _credits: number = null

    _delay: number = 0

    onLoad() {
        if (DataMgr.data.Config.platId === 3 || Constants.sys.WECHAT_GAME_QQ === cc.sys.platform) {
            this.setActive("lottery/item/exchange", false)
            cc.find("lottery", this.node).getComponent(cc.Button).interactable = false
        } else if (!Helper.isNative() && (cc.sys.OPPO_GAME == cc.sys.platform || cc.sys.VIVO_GAME == cc.sys.platform)) {
            this.setActive("lottery/item/exchange", false)
            cc.find("lottery", this.node).getComponent(cc.Button).interactable = false
        } else if (cc.sys.BYTEDANCE_GAME === cc.sys.platform || PluginMgr.isH52345Game()) {
            this.setActive("lottery/item/exchange", false)
            cc.find("lottery", this.node).getComponent(cc.Button).interactable = false
        }
    }

    onDestroy() {
        EventMgr.offByTag(this)
    }

    start() {
        if (DataMgr.data.Config.platId === 3 || Constants.sys.WECHAT_GAME_QQ === cc.sys.platform || !Helper.checkExchange()) {
            this.setActive("lottery/item/exchange", false)
        }

        this.initButton()
        this.initEvent()
        cc.director.once(cc.Director.EVENT_AFTER_DRAW, () => {
            this.initData()
        })
    }

    initEvent() {
        DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, this.updateData, this)
        EventMgr.on(Constants.EVENT_DEFINE.UPDATE_USER_ITEM, this.updateData, this)
    }

    initData() {
        this.updateData()
    }

    initButton() {
        this.setButtonClick("lottery", (sender, data) => {
            console.log("btnExchange on click")
            if (Helper.checkExchange()) {
                UIMgr.OpenUI("lobby", "component/exchange/huafei/ExchangeLottery", {})
            }
        })
        this.setButtonClick("diamond", (sender, data) => {
            console.log("btnExchange on click")
            if (DataMgr.data.Config.platId !== 3) {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "shop" })
            }
        })
    }

    updateData(msg?: any) {
        cc.log("===TokenInfo ", msg)

        if (msg && msg.bAni) {
            if (null !== this._gold && this._gold !== User.Gold) {
                this.stopTween("gold/item/num")
                this.runTween("gold/item/num", Helper.TokenAni(this._gold, User.Gold, .5, () => {
                    let src = this.getNode("gold/item/num")["_tokenNum"]
                    this.setLabelValue("gold/item/num", src >= 10000 ? Helper.FormatNumWYCN(src) : src)
                    this._gold = src
                }))
            } else {
                this.setLabelValue("gold/item/num", User.Gold >= 10000 ? Helper.FormatNumWYCN(User.Gold) : User.Gold)
                this._gold = User.Gold
            }

            if (null !== this._lottery && this._lottery !== User.Lottery) {
                this.stopTween("lottery/item/num")
                this.runTween("lottery/item/num", Helper.TokenAni(this._lottery, User.Lottery, .5, (src) => {
                    this.setLabelValue("lottery/item/num", src >= 10000 ? Helper.FormatNumWYCN(src) : src)
                    this._lottery = src
                }))
            } else {
                this.setLabelValue("lottery/item/num", User.Lottery >= 10000 ? Helper.FormatNumWYCN(User.Lottery) : User.Lottery)
                this._lottery = User.Lottery
            }

            if (null !== this._credits && this._credits !== User.Credits) {
                this.stopTween("credits/item/num")
                this.runTween("credits/item/num", Helper.TokenAni(this._credits, User.Credits, .5, (src) => {
                    this.setLabelValue("credits/item/num", src >= 10000 ? Helper.FormatNumWYCN(src) : src)
                    this._credits = src
                }))
            } else {
                this.setLabelValue("credits/item/num", User.Credits >= 10000 ? Helper.FormatNumWYCN(User.Credits) : User.Credits)
                this._credits = User.Credits
            }
        } else {
            this._gold = User.Gold
            this._lottery = User.Lottery
            this._credits = User.Credits

            this.setLabelValue("gold/item/num", User.Gold >= 10000 ? Helper.FormatNumWYCN(User.Gold) : User.Gold)
            this.setLabelValue("lottery/item/num", User.Lottery >= 10000 ? Helper.FormatNumWYCN(User.Lottery) : User.Lottery)
            this.setLabelValue("credits/item/num", User.Credits >= 10000 ? Helper.FormatNumWYCN(User.Credits) : User.Credits)
        }
    }
}
