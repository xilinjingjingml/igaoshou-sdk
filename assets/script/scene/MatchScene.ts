import BaseUI from "../base/BaseUI";
import { MatchSvr } from "../system/MatchSvr";
import { Helper } from "../system/Helper";
import { EventMgr } from "../base/EventMgr";
import { Constants } from "../constants";
import { DataMgr } from "../base/DataMgr";
import { UIMgr } from "../base/UIMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchScene extends BaseUI {

    _list: cc.Node = null

    onLoad() {
        this._list = this.getNode("list")
        this._list.children.forEach(i => i.active = false)

        let ad = this.getNode("adNode")
        this._list.on(cc.Node.EventType.SIZE_CHANGED, () => {
            if (this._list.height + ad.height + 50 + 50 > this.node.parent.parent.height) {
                ad.position = cc.v3(ad.position.x, -this._list.height - 50)
                this.node.height = this._list.height + ad.height + 50 + 50
            } else {
                this.node.height = this.node.parent.parent.height
                ad.position = cc.v3(ad.position.x, -this.node.height + 50 + ad.height)
            }
        }, this, true)

        // EventMgr.on(Constants.EVENT_DEFINE.MATCH_HIGH_LIGHT_DIRECT, (msg) => {
        //     let target:cc.Node = msg.target
        //     let pos = this.node.convertToNodeSpaceAR(target.parent.convertToWorldSpaceAR(target.position))

        //     this.setActive("directNode", true)
        //     this.setNodePositionY("directNode", pos.y - target.height / 2)
        // }, this)

        this.setActive("directNode", false)
    }

    onOpen() {
        Helper.reportEvent("大厅", "主界面", "打开界面")
        this.initEvent()
        this.initData()
    }

    initEvent() {
        
    }

    initData() {
        let i = 0
        cc.tween(this._list)
        .repeat(this._list.childrenCount, cc.tween().delay(.0).call(() => this._list.children[i++].active = true))
        .start()

        // this.runTween("directNode", cc.tween().repeatForever(cc.tween().to(.6, { opacity: 100 }).to(.6, { opacity: 255 })))
    }       
}
