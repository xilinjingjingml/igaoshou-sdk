import BaseUI from "../../../start/script/base/BaseUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PromoteHelp extends BaseUI {
    onOpen() {
        console.log("PromoteHelp onOpen", this.param)
       
        this.initButton()
        this.initData()
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

    initData(){
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            this.setActive("node/lblDesc1", true)
        } else {
            this.setActive("node/lblDesc2", true)
        }
    }
}
