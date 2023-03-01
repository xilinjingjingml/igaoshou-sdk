import BaseUI from "../../../../start/script/base/BaseUI";
import ExchangePriceMode from "./ExchangePriceMode";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ExchangePriceMix extends BaseUI {
    pri:cc.Node = null   //价格
    vipPri:cc.Node = null   //会员价
    present:cc.Node = null   //赠送
    onOpen(){
        console.log("ExchangePriceMix onOpen", this.param)
    }

    onLoad(){
        console.log("ExchangePriceMix onLoad")
        this.pri = cc.find("pri", this.node)
        this.vipPri = cc.find("vipPri", this.node)
        this.present = cc.find("present", this.node)

        this.pri.active = false
        this.vipPri.active = false
        this.present.active = false
    }

    start () {
        console.log("ExchangePriceMix start")
    }

    setPriMix(prisOne:any){
        console.log("setPriMix", prisOne)
        if(prisOne.pri){
            this.pri.active = true
            let priPriceMode = cc.find("ExchangePriceMode", this.pri)
            priPriceMode.getComponent(ExchangePriceMode).setPri(prisOne.pri)
        }else{
            this.pri.active = false
        }

        if(prisOne.vip_pri){
            this.vipPri.active = true
            let priPriceMode = cc.find("ExchangePriceMode", this.vipPri)
            priPriceMode.getComponent(ExchangePriceMode).setPri(prisOne.vip_pri)
        }else{
            this.vipPri.active = false
        }

        if(prisOne.ticketz > 0){
            this.present.active = true
            let lblNum = cc.find("token/num", this.present)
            lblNum.getComponent(cc.Label).string = prisOne.ticketz
        }else{
            this.present.active = false
        }

        //没有折扣价时，原价文字不显示
        if(this.pri.active && !this.vipPri.active){
            let name = cc.find("name", this.pri)
            name.getComponent(cc.Label).string = "    "
        }else{
            let name = cc.find("name", this.pri)
            name.getComponent(cc.Label).string = "    原价:"
        }
    }
}
