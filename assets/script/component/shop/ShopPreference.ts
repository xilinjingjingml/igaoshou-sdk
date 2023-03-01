import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { ITEM_STYLE } from "../Base/ItemMode";
import { ShopSvr } from "../../system/ShopSvr";
import { Helper } from "../../system/Helper";
import { DataMgr } from "../../base/DataMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopPreference extends BaseUI {

    onOpen() {
        this.initEvent()
        this.initData()
    }

    setParam(data) {
        this.param = data
        this.initData()
    }

    initEvent() {
        this.setButtonClick("btnBuy", this.onPressBuy.bind(this))
    }

    initData() {
        let data: IShopInfo = this.param.data
        if (!data) {
            return
        }

        let items = []
        data.items.forEach(i => items.push({id: i.id, num: i.num , expireAt: i.expireAt}))
        let addition = []
        data.addition.forEach(i => addition.push({id: i.id, num: i.num , expireAt: i.expireAt}))
       
        // this.setChildParam("original/worth/ItemMode", {items: items, style: ITEM_STYLE.STYLE_WHITE})
        // this.setChildParam("gift/worth/ItemMode", {items: addition, style: ITEM_STYLE.STYLE_WHITE})
        this.setItems("original/worth", items)
        this.setItems("gift/worth", addition)
        let mark = "¥"
        if(DataMgr.Config.env === 2){
            mark = "$"
        }
        this.setLabelValue("now/num", mark + data.price / 100)
    }

    onPressBuy() {
        let data: IShopInfo = this.param.data
        if (!data) {
            return
        }

        ShopSvr.PayOrder(data)
        // ShopSvr.AliPay(data.boxId, 0)
    }

    setItems(name, items: TItems) {
        this.setActive(name + "/wcoin", false)
        this.setActive(name + "/lottery", false)
        this.setActive(name + "/diamond", false)
        for (let i in items) {
            if (items[i].id === Constants.ITEM_INDEX.WCOIN) {
                this.setActive(name + "/wcoin", true)
                this.setLabelValue(name + "/wcoin/num",  Helper.FormatNumWY(items[i].num))
            } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive(name + "/lottery", true)
                this.setLabelValue(name + "/lottery/num", Helper.FormatNumWY(items[i].num))
            } else if (items[i].id === Constants.ITEM_INDEX.DIAMOND) {
                this.setActive(name + "/diamond", true)
                this.setLabelValue(name + "/diamond/num", items[i].num >= 10000 ? Helper.FormatNumWY(items[i].num) : Helper.FormatNumPrice(items[i].num / 100))
            }
        }
    }
}
