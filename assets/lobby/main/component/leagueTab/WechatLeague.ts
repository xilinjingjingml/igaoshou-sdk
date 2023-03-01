import { igs } from "../../../../igs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WechatLeague extends cc.Component {

    _init: boolean = false

    onLoad() {
        let widget = this.getComponent(cc.Widget)
        let self = this
        widget.updateAlignment()
        cc.director.once(cc.Director.EVENT_AFTER_UPDATE, () => {
            if (!self._init) {
                if (igs.odc.init) {
                    igs.odc.init(self.node)
                }
                igs.odc.showListData()
                self._init = true
            }        
        })
    }

    onEnable() {
        // if (!this._init) {
        //     return
        // }
        // if (cc.sys.platform === cc.sys.WECHAT_GAME && igs.odc) {
        //     console.log("===wechat league enable")
        //     igs.odc.showListData()
        // }
    }
}
