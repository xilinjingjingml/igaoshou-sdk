import BaseUI from "../../../start/script/base/BaseUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DownloadApp extends BaseUI {

    onOpen() {
        this.initData()
    }

    initData() {
        let img = this.param.img
        if (!img) {
            this.close()
        }

        let node =this.getNode("node")
        cc.assetManager.loadRemote(img, cc.SpriteFrame, (err, res: cc.Texture2D) => {
            if (err) {
                return
            }

            let scale = node.width / res.width
            let spt = node.getComponent(cc.Sprite)
            if (spt) {
                spt.spriteFrame = new cc.SpriteFrame(res)
            }
            node.height = scale * res.height
        })
    }

}
