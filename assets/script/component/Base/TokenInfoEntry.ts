﻿import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { Helper } from "../../system/Helper";
import { EventMgr } from "../../base/EventMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TokenInfoEntry extends BaseUI {

    _lottery: number = null
    _wcoin: number = null
    _diamond: number = null

    _delay: number = 0

    onOpen() {
        this.initButton()
        this.initEvent()
        this.initData()
    }

    // update(dt) {
    //     this._delay += dt
    //     if (this._delay >= 10) {
    //         let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
    //         // user.items.forEach(i => i.num += 500)
    //         user.items[Constants.ITEM_INDEX.DIAMOND].num += 100
    //         DataMgr.setData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO, user)
    //         this._delay = 0
    //     }
    // }

    initEvent() {
        // DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, this.updateData, this)
        EventMgr.on(Constants.EVENT_DEFINE.UPDATE_USER_ITEM, this.updateData, this)
    }

    initData() {
        this.updateData()
    }

    initButton() {
        // let btnExchange = cc.find("lottery", this.node)
        this.setButtonClick("lottery", (sender, data) => {
            console.log("btnExchange on click")
            // Helper.OpenPageUI("scene/ExchangeScene", "", null, {param: {enterAni: Constants.PAGE_ANI.IDLE}})
            if (DataMgr.Config.platId !== 3) {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "exchange" })
            }
        })
        this.setButtonClick("wcoin", (sender, data) => {
            console.log("btnExchange on click")
            // Helper.OpenPageUI("scene/ExchangeScene", "奖券", null, {param: {enterAni: Constants.PAGE_ANI.IDLE}})
            if (DataMgr.Config.platId !== 3) {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "shop" })
            }
        })
        this.setButtonClick("diamond", (sender, data) => {
            console.log("btnExchange on click")
            // Helper.OpenPageUI("scene/ExchangeScene", "奖券", null, {param: {enterAni: Constants.PAGE_ANI.IDLE}})
            if (DataMgr.Config.platId !== 3) {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "shop" })
            }
        })
    }

    updateData(msg?:any) {
        let data = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (!data) {
            return
        }

        if ((data.histroy.allGame < 3 && data.newbie) || DataMgr.Config.platId == 5 || DataMgr.Config.platId == 3) {
            this.setActive("wcoin", false)
            this.removeNodeComponent("lottery", cc.Widget)
            this.removeNodeComponent("diamond", cc.Widget)
            this.setNodeWidth("lottery", this.node.width / 2)
            this.setNodeWidth("diamond", this.node.width / 2)
            this.setNodePosition("lottery", cc.Vec2.ZERO)
            this.setNodePosition("diamond", cc.Vec2.ZERO)
        }

        let lottery = data.lottery || 0
        let wcoin = data.wcoin || 0
        let diamond = data.diamond || 0
        for (let idx in data.items) {
            let i = data.items[idx]
            if (i.id === Constants.ITEM_INDEX.LOTTERY) {
                lottery += i.num
            } else if (i.id === Constants.ITEM_INDEX.WCOIN) {
                wcoin += i.num
            } else if (i.id === Constants.ITEM_INDEX.DIAMOND) {
                diamond += i.num
            }
        }

        cc.log("===TokenInfo ", msg)

        if (msg && msg.bAni) {
            if (null !== this._lottery && this._lottery !== lottery) {
                this.stopTween("lottery/item/num")
                this.runTween("lottery/item/num", Helper.TokenAni(this._lottery, lottery, .5, (src) => {
                    this.setLabelValue("lottery/item/num", src >= 10000 ? Helper.FormatNumWY(src) : src)
                    this._lottery = src
                }))
            } else {
                this.setLabelValue("lottery/item/num", lottery >= 10000 ? Helper.FormatNumWY(lottery) : lottery)
                this._lottery = lottery
            }

            if (null !== this._wcoin && this._wcoin !== wcoin) {
                this.stopTween("wcoin/item/num")
                this.runTween("wcoin/item/num", Helper.TokenAni(this._wcoin, wcoin, .5, (src) => {
                    this.setLabelValue("wcoin/item/num", src >= 10000 ? Helper.FormatNumWY(src) : src)
                    this._wcoin = src
                }))
            } else {
                this.setLabelValue("wcoin/item/num", wcoin >= 10000 ? Helper.FormatNumWY(wcoin) : wcoin)
                this._wcoin = wcoin
            }

            if (null !== this._diamond && this._diamond !== diamond) {
                this.stopTween("diamond/item/num")
                this.runTween("diamond/item/num", Helper.TokenAni(this._diamond, diamond, .5, () => {
                    let src = this.getNode("diamond/item/num")["_tokenNum"]
                    this.setLabelValue("diamond/item/num", Helper.FormatNumPrice(src / 100))
                    this._diamond = src
                }))
            } else {
                this.setLabelValue("diamond/item/num", Helper.FormatNumPrice(diamond / 100))
                this._diamond = diamond
            }
        } else {
            this._wcoin = wcoin
            this._lottery = lottery
            this._diamond = diamond
            this.setLabelValue("wcoin/item/num", wcoin >= 10000 ? Helper.FormatNumWY(wcoin) : wcoin)
            this.setLabelValue("lottery/item/num", lottery >= 10000 ? Helper.FormatNumWY(lottery) : lottery)
            this.setLabelValue("diamond/item/num", Helper.FormatNumPrice(diamond / 100))
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
