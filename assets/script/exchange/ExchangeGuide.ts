import BaseUI from "../base/BaseUI";
import { Helper } from "../system/Helper";
import ExchangePriceMode from "./ExchangePriceMode"
import { ShopSvr } from "../system/ShopSvr";
import { Constants } from "../constants";
import { EventMgr } from "../base/EventMgr";
import { UIMgr } from "../base/UIMgr";

const {ccclass, property} = cc._decorator;


@ccclass
export default class ExchangeGuide extends BaseUI {
    
    onOpen(){
        // console.log("ExchangeGuide onOpen", this.param)
        this.initButton()
    }

    onLoad(){
        // console.log("ExchangeGuide onLoad", this.param)
    }

    start () {
        // console.log("ExchangeGuide start")
    }

    initButton(){
        this.setButtonClick("scrollView/view/content/item1/btnMatch", () => {
            // console.log("btnMatch on click")
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, {name: "match"})
            UIMgr.CloseUI("scene/ExchangeScene")
            this.close()
        })
        
        this.setButtonClick("scrollView/view/content/item3/btnChange", () => {
            // console.log("btnChange on click")
            this.close()
        })
    }
}
