import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { Helper } from "../../system/Helper";
import { User } from "../../system/User";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Coin2Ticket extends BaseUI {
    onOpen() {
        console.log("Coin2Ticket onOpen", this.param)
       
        this.setLabelValue("node/lottery/num", this.param.wcoin)
        this.initButton()
    }

    onLoad(){
    }

    initEvent() {
        
    }

    initButton(){
        this.setButtonClick("node/btnOk", this.node, ()=>{            
            User.Coin2Ticket((res)=>{
                if(res.err && res.err.length > 0){
                    Helper.OpenTip(res.err)
                }
                this.close()
            })
        })
    }

    initData(signConfig:any){
        
    }
}
