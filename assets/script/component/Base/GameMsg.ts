import BaseUI from "../../base/BaseUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMsg extends BaseUI {

    onOpen() {
        this.initData()
    }

    initData() {
        let msg: string = this.param.msg
        if (msg) {
            // if (msg.indexOf("<c") === -1) {
            //     msg = "<color=#323232>" + msg + "</c>"
            // }
            this.setRichTextValue("msg", msg)
        }
    }

}
