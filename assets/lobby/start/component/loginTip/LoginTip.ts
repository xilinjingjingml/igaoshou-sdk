import BaseUI from "../../script/base/BaseUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginTip extends BaseUI {

    onOpen() {
        this.setButtonClick("main/two/btnYES", this.onPressOK.bind(this))
        this.setButtonClick("main/two/btnNO", this.onPressCancel.bind(this))

        this.setLabelValue("main/view/content/msg", this.param.msg ?? "未知的错误")
        this.setLabelValue("main/two/btnYES/name", this.param.confirmName ?? "确定")
        this.setLabelValue("main/two/btnNO/name", this.param.cancelName ?? "取消")
    }

    onPressOK() {
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
        }
    }

    onPressCancel() {
        this.param.cancel?.()
        this.close()
    }

}
