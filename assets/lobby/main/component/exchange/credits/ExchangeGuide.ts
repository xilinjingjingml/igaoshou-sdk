import BaseUI from "../../../../start/script/base/BaseUI";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { UIMgr } from "../../../../start/script/base/UIMgr";

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
