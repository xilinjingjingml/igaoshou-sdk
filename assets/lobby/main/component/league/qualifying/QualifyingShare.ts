import BaseUI from "../../../../start/script/base/BaseUI";
import { QualifyingSrv } from "../../../../start/script/system/QualifyingSrv";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { User } from "../../../../start/script/data/User";
import { Helper } from "../../../../start/script/system/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class QualifyingShare extends BaseUI {

    onOpen() {
        console.log("QualifyingShare onOpen", this.param)
        this.initEvent()
        this.initButton()
        
        let self = this
        QualifyingSrv.GetGradeRecord({ start: 0, end: 3 }, (res) => {
            let curSeason: any = DataMgr.getData(Constants.DATA_DEFINE.QUALIFYING_CUR_SEASON)
            for (let v of res.records) {
                if (curSeason && curSeason.cur_season_id == v.season_id) {
                    self.initData(v)
                    break
                }
            }
        })

        this.node.position = cc.v3(-20000, -20000)
    }

    onLoad() {
        this.setLabelValue("content/share/lv", "12345")        
    }

    onClose() {
    }

    initEvent() {

    }

    initButton() {
    }

    initData(data: any) {
        this.param.grade.star = 0
        this.param.grade.maxStar = 0
        this.setChildParam("content/qualifying/QualifyingLevelMode", { grade: this.param.grade })

        this.setLabelValue("content/share/games", "场次：" + data.total_cnt)
        this.setLabelValue("content/share/win", "胜率：" + Math.floor(data.win_cnt / data.total_cnt * 100) + "%")
        this.setLabelValue("content/share/winningStreak", "最高连胜：" + data.max_win_streak_cnt)

        this.setLabelValue("content/share/nickName", User.UserName)
        this.setSpriteFrame("content/share/sptHead", User.Avatar)

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
                        destWidth: width,
                        destHeight: height,
                    success(res) {
                        console.log("success: " + res.tempFilePath)
                        Helper.shareInfo({ share_pic: res.tempFilePath })
                    },
                    fail(res) {
                        console.log(res)
                    }
                })
            }, 0.1)
            } else {
                Helper.shareInfo()
            }
            this.close()
        } else if (cc.sys.isNative) {
            let path = Helper.CaptureNodeInNative(this.node)
            if (path.length > 0) {
                Helper.shareInfo({ share_pic: path })
            }
            this.close()
        } else {
            Helper.shareInfo()
            this.close()
        }
    }
}
