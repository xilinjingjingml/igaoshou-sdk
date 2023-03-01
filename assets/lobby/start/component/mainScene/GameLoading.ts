import BaseUI from "../../script/base/BaseUI";
import { EventMgr } from "../../script/base/EventMgr";
import { Constants } from "../../script/igsConstants";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GameLoading extends BaseUI {

    _blockInput: cc.BlockInputEvents = null

    start() {
        this.initNode()
        this.initEvent()
    }

    initNode() {
        this._blockInput = this.node.getComponent(cc.BlockInputEvents)
        cc.tween(this.getNode("loading")).repeatForever(cc.tween().to(1.5, { angle: -180 }).to(1.5, { angle: -360 }).set({ angle: 0 })).start()

        this.hideLoading()
    }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.SHOW_BASE_SCENE_LOADING, this.showLoading, this)
        EventMgr.on(Constants.EVENT_DEFINE.HIDE_BASE_SCENE_LOADING, this.hideLoading, this)
    }

    showLoading() {
        this._blockInput && (this._blockInput.enabled = true)
        this.setActive("loading", true)
    }

    hideLoading() {
        this._blockInput && (this._blockInput.enabled = false)
        this.setActive("loading", false)
    }

}
