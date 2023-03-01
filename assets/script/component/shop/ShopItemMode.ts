import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { ShopSvr } from "../../system/ShopSvr";
import { ITEM_STYLE } from "../Base/ItemMode";
import { Helper } from "../../system/Helper";
import { DataMgr } from "../../base/DataMgr";

const {ccclass, property} = cc._decorator;

//196 212

@ccclass
export default class ShopItemMode extends BaseUI {

    onOpen() {
        this.initEvent()
        // this.initData()
    }

    setParam(param) {
        this.param = param
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

        // this.setSpriteFrame("icon/box", data.pic)
        let mark = "¥"
        if(DataMgr.Config.env === 2){
            mark = "$"
        }
        this.setLabelValue("price/num", mark + data.price / 100)
        let items = []
        data.items.forEach(i => items.push({id: i.id, num: i.num , expireAt: i.expireAt}))
        // this.setChildParam("worth/ItemMode", {items: items, style: ITEM_STYLE.STYLE_WHITE, fontSize:70, unFormatNum:true})

        this.setActive("worth/wcoin", false)
        this.setActive("worth/lottery", false)
        this.setActive("worth/diamond", false)
        for (let i in items) {
            if (items[i].id === Constants.ITEM_INDEX.WCOIN) {
                this.setActive("worth/wcoin", true)
                this.setLabelValue("worth/wcoin/num",  Helper.FormatNumWY(items[i].num))
            } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive("worth/lottery", true)
                this.setLabelValue("worth/lottery/num", Helper.FormatNumWY(items[i].num))
            } else if (items[i].id === Constants.ITEM_INDEX.DIAMOND) {
                this.setActive("worth/diamond", true)
                this.setLabelValue("worth/diamond/num", items[i].num >= 10000 ? Helper.FormatNumWY(items[i].num) : Helper.FormatNumPrice(items[i].num / 100))
            }
        }
        
        // let bigItem: boolean= this.param.bigItem
        // if(bigItem){
        //     this.node.width = 296
        // }
        let width = this.param.width - 1
        this.node.width = width || this.node.width
    }

    onPressBuy() {
        // Helper.OpenPopUI("component/Shop/ShopPayResultEntry", "支付结果")
        let data: IShopInfo = this.param.data
        if (!data) {
            return
        }

        ShopSvr.PayOrder(data)
        // ShopSvr.AliPay(data.boxId, 0)
    }

}
