import { SettingMgr } from "./SettingMgr";
import { DataMgr } from "./DataMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class IconSetting extends cc.Component {

    @property()
    settingName: string = ""

    start() {
        // this.setting()
    }

    setting() {
        let sprite = this.node.getComponent(cc.Sprite)
        if (!sprite) {
            return
        }

        let setting = SettingMgr.getConfig(this.settingName)
        if (!setting) {
            return
        }

        let updateFrame = (src) => {
            if (sprite && sprite.node.isValid) {
                sprite.spriteFrame = src                

                // let size: cc.Size = sprite.node.getContentSize()
                // let newSize: cc.Size = cc.Size.ZERO
                // if (src instanceof cc.SpriteFrame) {
                //     newSize = src.getOriginalSize()
                //     sprite.spriteFrame = src
                // } else if (src instanceof cc.Texture2D) {
                //     newSize = cc.size(src.width, src.height)
                //     sprite && sprite.node && sprite.node.isValid && (sprite.spriteFrame = new cc.SpriteFrame(src))          
                // }

                // let scale = Math.min(size.width / newSize.width, size.height / newSize.height)
                // newSize.width *= scale
                // newSize.height *= scale                 
                // this.node.scale = scale  
                // sprite.node.setContentSize(newSize)  

                if (setting.scale) {
                    this.node.scale = setting.scale
                }

                if (setting.size) {
                    let content = sprite.node.getContentSize()
                    let scale = (setting.size + 2) / content.height
                    sprite.node.setContentSize(content.width * scale, content.height * scale)
                }
            }
        }

        let icon = typeof setting === "string" ? setting : setting.icon

        if (typeof icon === "string") {
            if (-1 !== icon.indexOf("http://") || -1 !== icon.indexOf("https://")) {
                if (-1 !== icon.indexOf("qlogo.cn")) {
                    icon = sprite + "?aa=aa.jpg"
                }
                cc.assetManager.loadRemote(icon, cc.SpriteFrame, (err, src: cc.SpriteFrame) => {
                    if (err) {
                        cc.warn("BaseUI.setSpriteFrame sprite " + sprite + " err: " + err)
                        return
                    }

                    updateFrame(src)
                })
            } else {
                let bundle = DataMgr.data.Bundle
                if (bundle) {
                    bundle.load("image/" + icon, cc.SpriteFrame, (err, src: cc.SpriteFrame) => {
                        if (err) {
                            cc.warn("BaseUI.setSpriteFrame sprite " + sprite + " err: " + err)
                            return
                        }
                        updateFrame(src)
                    })
                }
            }
        } 

        if (setting.size) {
            let content = sprite.node.getContentSize()
            let scale = (setting.size + 2) / content.height
            sprite.node.setContentSize(content.width * scale, content.height * scale)
        }
    }
}
