import BaseUI from "../../base/BaseUI";
import { EventMgr } from "../../base/EventMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameItemTitle extends BaseUI {

    @property({
        type: cc.SpriteFrame
    })
    titleIcon = new cc.SpriteFrame()

    @property()
    titleName: string = ""

    @property({
        type: cc.SpriteFrame
    })
    titleButtonNoraml = new cc.SpriteFrame()

    @property({
        type: cc.SpriteFrame
    })
    titleButtonDisable = new cc.SpriteFrame()

    @property()
    titleButtonName: string = ""

    @property()
    titleButtonEventName: string = ""

    onOpen() {
        this.setSpriteFrame("GameItemTitle/icon", this.titleIcon, false)
        this.setLabelValue("GameItemTitle/name", this.titleName)

        this.setActive("GameItemTitle/btn", !!this.titleButtonNoraml)

        if (this.titleButtonEventName)
            this.setButtonClick("GameItemTitle/btn", () => {EventMgr.dispatchEvent(this.titleButtonEventName)})

        if (this.titleButtonNoraml) {
            this.setButtonInfo("GameItemTitle/btn", {
                size: this.titleButtonNoraml.getOriginalSize(),        
                normalSprite: this.titleButtonNoraml
            })  
            let node = this.getNode("GameItemTitle/btn")          
            node.position = cc.Vec3.ZERO
        } else {
            this.setActive("GameItemTitle/btn", false)
        }

        // this.setLabelValue("GameItemTitle/btn/name", this.titleButtonName || "")

        if (this.titleButtonDisable) {
            this.setButtonInfo("GameItemTitle/btn", {
                size: this.titleButtonNoraml.getOriginalSize(),
                transition: cc.Button.Transition.SPRITE, 
                pressedSprite: this.titleButtonDisable,
                disabledSprite: this.titleButtonDisable})
        }
    }

}
