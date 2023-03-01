import BaseUI from "../../../start/script/base/BaseUI";
import { User } from "../../../start/script/data/User";
import { Helper } from "../../../start/script/system/Helper";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PromoteShare extends BaseUI {
    onOpen() {
        this.param = this.param || {}
        console.log("PromoteShare onOpen", this.param)
        this.initEvent()
        this.initButton()
        this.initData()
    }

    onLoad() {
    }

    onClose() {
    }

    initButton() {
    }

    initEvent() {

    }

    initData() {
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            this.setActive("content/share1", true)
        } else {
            this.setActive("content/share2", true)
            this.setLabelValue("content/share2/nickName", User.UserName)
            this.setSpriteFrame("content/share2/sptHead", User.Avatar, true)
            // this.setLabelValue("content/share2/lblCode", "邀请码：")
            // this.setSpriteFrame("content/share2/sptCode", User.Avatar, true)

            // if (this.param && this.param.promoteInfo && this.param.promoteInfo.promote_code) {
                this.setLabelValue("content/share2/lblCode", "邀请码：" + User.InvitationCode)
            // }
        }

        let self = this
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            let canvas: any = Helper.CaptureNode(this.node)
            if (canvas) {
            Helper.DelayFun(() => {
                var width = this.node.width;
                var height = this.node.height;
                canvas.toTempFilePath({
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    destWidth: 300,
                    destHeight: 240,
                    success(res) {
                        console.log("success")
                            Helper.shareInfo({ share_pic: res.tempFilePath, skip: true }, self.param.callback)
                    },
                    fail(res) {
                        console.log(res)
                    }
                })
                this.close()
            }, 0.1)
            } else {
                Helper.shareInfo({ skip: true }, this.param.callback)
            }
        } else if (Helper.isNative()) {
            let path = Helper.CaptureNodeInNative(this.getNode("content/share2"))
            if (path.length > 0) {
                Helper.shareInfo({ share_pic: path, skip: true }, this.param.callback)
            }
            this.close()
        } else {
            Helper.shareInfo({ skip: true }, this.param.callback)
            this.close()
        }
    }
}
