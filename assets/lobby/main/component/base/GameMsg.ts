import BaseUI from "../../../start/script/base/BaseUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMsg extends BaseUI {

    onOpen() {
        this.initData()
    }

    initData() {
        let msg: string = this.param.msg
        if (msg) {
            this.setRichTextValue("msg", msg)
        }
    }

}
