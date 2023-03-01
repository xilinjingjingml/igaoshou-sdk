import BaseUI from "../../../../start/script/base/BaseUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ExplainPop extends BaseUI {
    onOpen() {
        console.log("ExplainPop onOpen", this.param)
       
        this.initButton()
    }

    onLoad(){
    }

    initEvent() {
        
    }

    initButton(){
        this.setButtonClick("node/btnOk", this.node, ()=>{            
            this.close()
        })
    }

    initData(signConfig:any){
        
    }
}
