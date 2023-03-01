
import BaseUI from "../../base/BaseUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePop extends BaseUI {

    onOpen() {
        this.initData()
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
        .delay(3)
        .to(2, {opacity: 0})
        .call(() => this.close())
        .start()
    }

}
