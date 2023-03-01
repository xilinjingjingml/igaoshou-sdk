import BaseUI from "../../../start/script/base/BaseUI";
import { User } from "../../../start/script/data/User";
import { Helper } from "../../../start/script/system/Helper";
import { QualifyingSrv } from "../../../start/script/system/QualifyingSrv";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HonorTime extends BaseUI {

    onOpen() {
        this.initData()
    }

    initEvent() {

    }

    initData() {
        if (this.param.type === 0) {
            this.setActive("node/info/cjdc", true)
            this.setLabelValue("node/info/msg", this.param.score + "l")
        } else {
            this.setActive("node/info/xjl", true)
            this.setLabelValue("node/info/msg", this.param.score + "f")
        }

        this.setLabelValue("node/info/username", User.UserName)
        this.setSpriteFrame("node/info/icon", User.Avatar, true)

        QualifyingSrv.GetCurSeason((res) => {
            if (res) {
                this.setActive("node/info/name_lv" + (res.grade.level >= 25 ? 25 : res.grade.level), true)
                this.setActive("node/info/major_icon_lv" + res.grade.major, true)
            }
        })
    }

    onPressClose() {
        this.close()
    }

    onPressShare() {
        let node = this.getNode("node/info")
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            let canvas: any = Helper.CaptureNode(node)
            if (canvas) {
            Helper.DelayFun(() => {
                var width = node.width;
                var height = node.height;
                canvas.toTempFilePath({
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    destWidth: 400,
                    destHeight: 311,
                    success(res) {
                        console.log("success")
                        Helper.shareInfo({ share_pic: res.tempFilePath })
                    },
                    fail(res) {
                        console.log(res)
                    }
                })
                this.close()
            }, 0.1)
            } else {
                Helper.shareInfo()
            }            
        } else if (Helper.isNative()) {
            let path = Helper.CaptureNodeInNative(node)
            if (path.length > 0) {
                Helper.shareInfo({ share_pic: path })
                this.close()
            }
        } else {
            Helper.shareInfo()
            this.close()
        }
    }
}
