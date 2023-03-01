

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopAni extends cc.Component {

    _srcScaleX: number = 1
    _srcScaleY: number = 1

    start() {
        let size = this.node.getContentSize()
        console.log(size)
        this._srcScaleX = this.node.scaleX
        this._srcScaleY = this.node.scaleY

        let x = this._srcScaleX > 0 ? 1 : -1
        let y = this._srcScaleY > 0 ? 1 : -1

        cc.tween(this.node)
            .set({ opacity: 0 })
            .delay(.1)
            .set({ scale: 0.1 })
            .set({ opacity: 255 })
            .to(.20, { scaleX: this._srcScaleX + .08 * x, scaleY: this._srcScaleY + .08 * y })
            .to(.02, { scaleX: this._srcScaleX + .04 * x, scaleY: this._srcScaleY + .04 * y })
            .to(.02, { scaleX: this._srcScaleX + .03 * x, scaleY: this._srcScaleY + .03 * y })
            .to(.01, { scaleX: this._srcScaleX + .02 * x, scaleY: this._srcScaleY + .02 * y })
            .to(.01, { scaleX: this._srcScaleX, scaleY: this._srcScaleY })
            // .call(() => {                
            //     this.node.setContentSize(size)
            //     console.log(this.node.getContentSize())
            // })
            .start()
    }

}
