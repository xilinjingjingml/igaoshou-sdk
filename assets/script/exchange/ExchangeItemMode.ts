import BaseUI from "../base/BaseUI";
import { Helper } from "../system/Helper";
import ExchangePriceMode from "./ExchangePriceMode"
import { DataMgr } from "../base/DataMgr";

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
                Helper.OpenPageUI("component/Exchange/ExchangeSubstanceEntry", "实物详情", null, { goodsInfo: this.info, pris_gid: this.prisGid })
            }
        })
    }

    setData(info: any, pris_gid: string = "") {
        this.info = info
        this.prisGid = pris_gid
        let lblName = cc.find("lblName", this.node)
        lblName.getComponent(cc.Label).string = info.product_name.toString().length > 22 ? info.product_name.substr(0, 21) + "..." : info.product_name

        // this.setActive("buhuozhong", info.product_name === "10元充值卡")

        let productImages = cc.find("mask/icon", this.node)

        if (this.node.name === "item0") {
            this.setSpriteFrame(productImages, this.first)
        } else if (this.node.name === "item1") {
            this.setSpriteFrame(productImages, this.second)
        }

        let loadIcon = () => {            
            this.setSpriteFrame(productImages, info.product_images)
        }
        cc.tween(productImages).delay(.5).call(() => loadIcon()).start()

        let priceMode = cc.find("priceNode/ExchangePriceMode", this.node)
        priceMode.getComponent(ExchangePriceMode).setPri(info.pris[0].pri)
    }
}
