import BaseUI from "../../../start/script/base/BaseUI";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePop extends BaseUI {

    onOpen() {
        this.initData()
    }

    onLoad(){
        this.node.zIndex = 999
    }
    
    setParam(param) {
        let msg = param.msg
        this.updateData(msg)
    }
     
    initData() {
        let msg = this.param.msg
        this.updateData(msg)
    }

    updateData(msg) {
        this.setLabelValue("msg", msg)
        this.runAction()
    }

    runAction() {
        this.stopTween(this.node)
        this.node.opacity = 255        
        cc.tween(this.node)
        .to(0.8, {y: 80})
        .delay(0.3)
        .to(0.5, {opacity: 0})
        .call(() => this.close())
        .start()
    }

}
