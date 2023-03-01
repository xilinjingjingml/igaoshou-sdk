import BaseUI from "../../../../start/script/base/BaseUI";
import { Constants } from "../../../../start/script/igsConstants";


const { ccclass, property } = cc._decorator;

export interface Payment {
    pri_gid: string
    pri_type: number
    pri_value: number
    pri_currency: string
}

@ccclass
export default class ExchangePriceMode extends BaseUI {

    start() {
    }


    setPri(pri: Payment[]) {
        let icon = cc.find("icon", this.node)
        let lblPrice = cc.find("lblPrice", this.node)
        icon.active = false
        if (pri.length > 0) {
            let pris_string = ""
            for (let v of pri) {
                v.pri_type = v.pri_type ? v.pri_type : 0
                v.pri_value = v.pri_value ? v.pri_value : 0
                pris_string = pris_string + this.calcPrice(v.pri_value, v.pri_type)
                if (Constants.EXCHANGE_PRI_TYPE.TICKET == v.pri_type) {//奖券
                    icon.active = true
                } else {//人民币
                    pris_string = pris_string + "y"
                }
                pris_string = pris_string + "+"
            }
            pris_string = pris_string.substr(0, pris_string.length - 1)
            lblPrice.getComponent(cc.Label).string = pris_string
        } else {
            lblPrice.getComponent(cc.Label).string = "0y"
        }
    }

    calcPrice(pri: number, type: number) {
        if (Constants.EXCHANGE_PRI_TYPE.TICKET == type && pri > 0) {
            if (pri >= Math.pow(10, 4)) {
                let text = ""
                let company = ""
                if (pri >= Math.pow(10, 8)) {
                    text = (pri / Math.pow(10, 8)).toString()
                    company = "e"
                } else if (pri >= Math.pow(10, 4)) {
                    text = (pri / Math.pow(10, 4)).toString()
                    company = "w"
                }
                text = text.substr(0, 5)
                if (text[text.length - 1] == '.') {
                    text = text.substr(0, text.length - 1)
                }
                return text + company
            } else {
                return pri
            }
        } else {
            pri = pri / 100
        }
        return pri
    }
}
