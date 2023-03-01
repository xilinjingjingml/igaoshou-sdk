import BaseUI from "../../../start/script/base/BaseUI";


const {ccclass, property} = cc._decorator;

@ccclass
export default class AdConfirm extends BaseUI {
    onOpen() {
        this.node.scale = cc.winSize.width / 720
    }
    onLoad(){
        this.node.zIndex = 999
    }

    onPressCancel() {
        this.param?.cancel?.()
        this.close()
    }

    onPressPlay() {
        this.param?.play?.()
        this.close()
    }
}
