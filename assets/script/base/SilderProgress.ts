
const {ccclass, property} = cc._decorator;

@ccclass
export default class SilderProgress extends cc.Component {

    @property({
        type: cc.Node
    })
    progressFill: cc.Node = new cc.Node()

    @property({
        type: cc.Label
    })
    progressValue:cc.Label = new cc.Label()

    _silder: cc.Slider = null

    start() {
        this.addEvent()
    }

    addEvent() {
        this._silder = this.node.getComponent(cc.Slider)
        if (!this._silder || !this.progressFill) {
            return
        }

        this._silder.handle.node.on(cc.Node.EventType.POSITION_CHANGED, this.updateSlider, this, true)
    }

    updateSlider(event) {
        cc.log("update slider")
        if (!this._silder) {
            return
        }
        this.progressFill.width = this.node.width * this._silder.progress
        this.progressValue.string = Math.floor(this._silder.progress * 100) + ""
    }

}
