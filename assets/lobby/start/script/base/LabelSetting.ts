import { SettingMgr } from "./SettingMgr";
import { DataMgr } from "./DataMgr";
// import FontColor from "../component/Shader/FontColor";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LabelSetting extends cc.Component {

    @property()
    settingName: string = ""

    start() {
        // this.setting()
    }

    setting() {
        let label = this.node.getComponent(cc.Label)
        if (!label) {
            return
        }

        if (label.string === "Label")
            label.string = ""

        let setting = SettingMgr.getConfig(this.settingName)
        if (!setting) {
            return
        }

        if (typeof setting === "string") {
            label.node.color = new cc.Color().fromHEX(setting)
        } else if (setting.font && typeof setting.font === "string") {
            let bundle = DataMgr.data.Bundle
            if (bundle) {
                bundle.load("image/font/" + setting.font, cc.Font, (err, res) => {
                    if (err) {
                        return
                    }

                    label.font = res
                    if (setting.color) {
                        // let comp = label.addComponent(FontColor)
                        // comp.Color = setting.color ? new cc.Color().fromHEX(setting.color) : label.node.color
                    }                    
                    label.fontSize = setting.size || label.fontSize
                    label.lineHeight = label.fontSize + 2
                })
            }
        } else {
            label.node.color = setting.color ? new cc.Color().fromHEX(setting.color) : label.node.color
            label.fontSize = setting.size || label.fontSize
            label.lineHeight = label.fontSize + 2
            this.node.height = label.fontSize + 2
            label.enableBold = setting.bold || label.enableBold

            if (setting.outline) {
                let outline = this.node.getComponent(cc.LabelOutline)
                if (!outline) {
                    outline = this.node.addComponent(cc.LabelOutline)            
                }
                outline.color = new cc.Color().fromHEX(setting.outline)
                outline.width = Number(setting.lineWidth) || .5
            } 
        }
    }
}
