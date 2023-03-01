
import BaseUI from "../../base/BaseUI";
import { UIMgr } from "../../base/UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePop extends BaseUI {

    onOpen() {
        this.initEvent()
        this.initData()
    }

    initEvent() {
        this.setButtonClick("top/btnBack", () => this.close())
        this.setButtonClick("main/single/btnOK", this.onPressConfirm.bind(this))
        this.setButtonClick("main/two/btnYES", this.onPressConfirm.bind(this))
        this.setButtonClick("main/two/btnNO", this.onPressCancel.bind(this))
    }

    initData() {
        if (this.param != null) {
            if (this.param.title != null) {
                this.setLabelValue("top/title", this.param.title)
            }

            if (!!this.param.icon) {
                this.setSpriteFrame("top/icon", this.param.icon)
                this.setActive("top/icon", true)
                let title = this.getNode("top/title")
                if (title) {
                    this.setNodePositionX("top/icon", -title.width - 50)
                }
            } else {
                this.setActive("top/icon", false)
            }

            if (this.param.buttons === 1) {
                this.setActive("main/single", true)
                this.setActive("main/two", false)
                if (this.param.confirmName && typeof this.param.confirmName === "string") {
                    this.setLabelValue("main/single/btnOK/name", this.param.confirmName)
                } 
                
                if (this.param.confirmIcon) {
                    this.setSpriteFrame("main/single/btnOK/icon", this.param.confirmIcon)
                    if (!this.param.confirmName) {
                        this.setLabelValue("main/single/btnOK/name", "")
                    }
                }
                if(this.param.confirmIconSize){
                    if(this.param.confirmIconSize.width){
                        this.setNodeWidth("main/single/btnOK/icon", this.param.confirmIconSize.width)
                    }
                }
                if(this.param.functionIcon){
                    this.setSpriteFrame("main/single/btnOK/functionIcon", this.param.functionIcon)
                }

                
            } else {
                this.setActive("main/single", false)
                this.setActive("main/two", true)

                if (this.param.confirmName && typeof this.param.confirmName === "string") {
                    this.setLabelValue("main/two/btnYES/name", this.param.confirmName)
                } 
                
                if (this.param.confirmIcon) {
                    this.setSpriteFrame("main/two/btnYES/icon", this.param.confirmIcon)
                    if (!this.param.confirmName) {
                        this.setLabelValue("main/two/btnYES/name", "")
                    }
                }

                if (this.param.cancelName && typeof this.param.cancelName === "string") {
                    this.setLabelValue("main/two/btnNO/name", this.param.cancelName)
                } 
                
                if (this.param.cancelIcon) {
                    this.setSpriteFrame("main/two/btnNO/icon", this.param.cancelIcon)
                    if (!this.param.cancelName) {
                        this.setLabelValue("main/two/btnNO/name", "")
                    }
                }
            }

            if (this.param.page != null) {
                UIMgr.OpenUI(this.param.page, { parent: this.getNode("main/view/content"), param: this.param.param, closeCb: () => this.close() })
            }
        }
    }

    onPressConfirm() {
        if (this.param && this.param.confirm && typeof this.param.confirm === "function") {
            this.param.confirm()
        }
        if (this.param.confirmUnclose === true) {
            return
        }
        this.close()
    }

    onPressCancel() {
        if (this.param && this.param.cancel && typeof this.param.cancel === "function") {
            this.param.cancel()
        }
        if (this.param.cancelUnclose === true) {
            return
        }
        this.close()
    }
}
