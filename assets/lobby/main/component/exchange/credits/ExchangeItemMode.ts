import BaseUI from "../../../../start/script/base/BaseUI";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { Helper } from "../../../../start/script/system/Helper";
import ExchangePriceMode from "./ExchangePriceMode";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ExchangeItemMode extends BaseUI {
    @property({ type: cc.SpriteFrame })
    first: cc.SpriteFrame = new cc.SpriteFrame()

    @property({ type: cc.SpriteFrame })
    second: cc.SpriteFrame = new cc.SpriteFrame()

    info: any = null
    prisGid: string = ""
    onLoad() {
        this.initButton()
    }

    start() {
    }


    // update (dt) {}

    initButton() {
        let btnDetails = cc.find("btnDetails", this.node)
        this.setButtonClick(btnDetails, () => {
            if (this.info) {
                DataMgr.setData("ExchangeSubstanceEntryGoodsInfo", this.info)
                Helper.OpenPageUI("component/exchange/credits/ExchangeSubstance", "实物详情", null, { goodsInfo: this.info, pris_gid: this.prisGid })
            }
        })
    }

    setData(info: any, pris_gid: string = "") {
        this.info = info
        this.prisGid = pris_gid
        // let lblName = cc.find("lblName", this.node)
        // lblName.getComponent(cc.Label).string = info.product_name.toString().length > 22 ? info.product_name.substr(0, 21) + "..." : info.product_name

        // this.setActive("buhuozhong", info.product_name === "10元充值卡")

        // let productImages = cc.find("mask/icon", this.node)

        this.setLabelValue("lblName", info.product_name)
        this.setSpriteFrame("icon", info.product_images)

        // if (this.node.name === "item0") {
        //     this.setSpriteFrame(productImages, this.first, true)
        // } else if (this.node.name === "item1") {
        //     this.setSpriteFrame(productImages, this.second, true)
        // }

        // let loadIcon = () => {            
        //     this.setSpriteFrame(productImages, info.product_images)
        // }
        // cc.tween(productImages).delay(.5).call(() => loadIcon()).start()

        this.setLabelValue("price/num", Helper.FormatNumWYCN(info.pris[0].pri[0].pri_value))

        // let priceMode = cc.find("priceNode/ExchangePriceMode", this.node)
        // priceMode.getComponent(ExchangePriceMode).setPri(info.pris[0].pri)
    }
}
