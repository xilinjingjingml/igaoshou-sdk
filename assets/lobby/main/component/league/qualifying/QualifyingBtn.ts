import BaseUI from "../../../../start/script/base/BaseUI";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { QualifyingSrv } from "../../../../start/script/system/QualifyingSrv";
import { UIMgr } from "../../../../start/script/base/UIMgr";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { Helper } from "../../../../start/script/system/Helper";
import { User } from "../../../../start/script/data/User";


const { ccclass, property } = cc._decorator;

@ccclass
export default class QualifyingBtn extends BaseUI {

    _data: any = null
    _init = false

    start() {

    }

    onOpen() {
        this.initEvent()
        this.initQualifyingData()
    }

    initEvent() {
        if (!this._init) {
            EventMgr.clearEvent(Constants.EVENT_DEFINE.CHECK_GRADE_UPGRADE)
            EventMgr.once(Constants.EVENT_DEFINE.CHECK_GRADE_UPGRADE, this.checkGradeUpgrade, this)
            this.setButtonClick("baoXing", this.onPressBaoXing.bind(this))
            this.setButtonClick(this.node, this.onPressQualifying.bind(this))
            this._init = true
        }
    }

    onPressBaoXing() {
        QualifyingSrv.ProtectStar((res) => {
            // this.qalifyingAnimationStart(res.grade.star)
        })
    }

    onPressQualifying() {
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BANNER)
        UIMgr.OpenUI("lobby", "component/league/qualifying/QualifyingMain", {})
    }

    initQualifyingData() {
        let data = this.param.data
        if (!data?.before) {
            return
        }

        if (this._data && this._data.before.maxStar === data.before.maxStar && this._data.before.star === data.before.star) {
            return
        }

        this._data = data

        this.setQualifyingStars(data.before.maxStar, data.before.star)

        this.setActive("baoXing", false)
        this.setSpriteFrame("name", "image/qualifyingIcons/name_lv" + (data.before.level >= 25 ? 25 : data.before.level))
        this.setSpriteFrame("iconNode/icon", "image/qualifyingIcons/major_icon_lv" + data.before.major)

        //有等级或这星星变化
        if (data.after && (data.after.level != data.before.level || data.after.star != data.before.star)) {
            let majorChange = true   //段位变化
            let upgrade = false      //是否升级
            if (data.after.level > data.before.level ||
                (data.after.level == data.before.level && data.after.star > data.before.star)) {
                upgrade = true
            }

            if (data.after.major == data.before.major && data.after.minor == data.before.minor) {
                majorChange = false
            }

            if (upgrade) {//升级加动画
                cc.tween(this.node)
                    .delay(0.5)
                    .call(() => {
                        if (majorChange) {
                            if (data.after.major != data.before.major) {//换ICON 
                                let iconNode = cc.find("iconNode", this.node)
                                let icon = cc.find("iconNode/icon", this.node)
                                cc.tween(iconNode)
                                    .to(0.2, { scaleX: 0 })
                                    .call(() => {
                                        this.setSpriteFrame("name", "image/qualifyingIcons/name_lv" + (data.after.level >= 25 ? 25 : data.after.level))
                                        this.setSpriteFrame("iconNode/icon", "image/qualifyingIcons/major_icon_lv" + data.after.major)
                                        cc.tween(icon)
                                            .to(0.2, { scale: 1.5 })
                                            .call(() => {

                                            })
                                            .to(0.2, { scale: 1 })
                                            .start()
                                    })
                                    .to(0.2, { scaleX: 1 })
                                    .start()
                            } else {
                                let name = cc.find("name", this.node)
                                this.setSpriteFrame("name", "image/qualifyingIcons/name_lv" + (data.after.level >= 25 ? 25 : data.after.level))
                                if (data.after.level <= 25) {
                                    cc.tween(name)
                                        .to(0.2, { scale: 1.2 })
                                        .to(0.2, { scale: 0.8 })
                                        .start()
                                }
                            }
                        }

                        if (majorChange) {
                            this.setQualifyingStars(data.after.maxStar, 0)
                        }
                        this.qalifyingAnimationStart(data.after.maxStar, data.after.star)

                        this.showGradeGuide()
                    })
                    .start()
            } else {
                cc.tween(this.node)
                    .delay(0.5)
                    .call(() => {
                        if (majorChange) {
                            if (data.after.major != data.before.major) {//换ICON 
                                let iconNode = cc.find("iconNode", this.node)
                                let icon = cc.find("iconNode/icon", this.node)
                                cc.tween(iconNode)
                                    .to(0.2, { scaleX: 0 })
                                    .call(() => {
                                        this.setSpriteFrame("name", "image/qualifyingIcons/name_lv" + (data.after.level >= 25 ? 25 : data.after.level))
                                        this.setSpriteFrame("iconNode/icon", "image/qualifyingIcons/major_icon_lv" + data.after.major)
                                        if (majorChange) {
                                            this.setQualifyingStars(data.after.maxStar, data.after.star)
                                        }
                                        this.qalifyingAnimationStart(data.after.maxStar, data.after.star)
                                    })
                                    .to(0.2, { scaleX: 1 })
                                    .start()
                            } else {
                                let name = cc.find("name", this.node)
                                this.setSpriteFrame("name", "image/qualifyingIcons/name_lv" + (data.after.level >= 25 ? 25 : data.after.level))
                                if (majorChange) {
                                    this.setQualifyingStars(data.after.maxStar, data.after.star)
                                }
                                this.qalifyingAnimationStart(data.after.maxStar, data.after.star)
                            }
                        } else {
                            if (majorChange) {
                                this.setQualifyingStars(data.after.maxStar, data.after.star)
                            }
                            this.qalifyingAnimationStart(data.after.maxStar, data.after.star)
                        }

                        this.showGradeGuide()
                    })
                    .start()
            }
        } else {
            this.showGradeGuide()
        }
    }

    setQualifyingStars(maxStar: number = 0, stars: number = 0) {
        if (maxStar > 5) {
            this.setActive("star1", false)
            this.setActive("star2", false)
            this.setActive("star3", false)
            this.setActive("star4", false)
            this.setActive("star5", false)
            this.setActive("totalStar", true)
            this.setLabelValue("totalStar/num", "x" + stars)
        } else {
            for (let i = 1; i <= 5; i++) {
                if (i <= maxStar) {
                    this.setActive("star" + i, true)
                } else {
                    this.setActive("star" + i, false)
                }

                if (i <= stars) {
                    this.setActive("star" + i + "/star", true)
                } else {
                    this.setActive("star" + i + "/star", false)
                }
            }
        }
    }

    qalifyingAnimationStart(maxStar: number, endStars: number) {
        if (maxStar > 5) {
            this.setLabelValue("totalStar/num", "x" + endStars)
            let totalStar = cc.find("totalStar", this.node)
            cc.tween(totalStar)
                .to(0.2, { scale: 1.5 })
                .to(0.2, { scale: 0.9 })
                .start()
        } else {
            for (let i = 1; i <= endStars; i++) {
                let star = this.getNode("star" + i + "/star")
                if (!star.active) {
                    cc.tween(star)
                        .delay(0.2 * i)
                        .set({ active: true, scale: 3 })
                        .to(0.2, { scale: 1 })
                        .start()
                }
            }

            for (let i = endStars + 1; i <= 5; i++) {
                let star = this.getNode("star" + i + "/star")
                if (star.active) {
                    cc.tween(star)
                        .delay(0.2 * (5 - i))
                        .to(0.2, { opacity: 0 })
                        .start()
                }
            }
        }
    }

    checkGradeUpgrade(param) {
        let data = this.param.data
        let qualifying = this.node
        if (qualifying.active && data) {
            let res = data
            let curSeason: any = DataMgr.getData(Constants.DATA_DEFINE.QUALIFYING_CUR_SEASON)
            if (curSeason) {
                if (res.grade.level > curSeason.grade.level) {
                    QualifyingSrv.GetListRewardStatus((status_list) => {
                        for (let v of status_list) {
                            if (v.major == res.grade.major && v.minor == res.grade.minor && v.status != 2) {   //status = 0条件不满足 1未领取 2已领取
                                let grade = Helper.ParseJson(JSON.stringify(res.grade), "qualifying")
                                UIMgr.OpenUI("lobby", "component/league/qualifying/QualifyingLevel",
                                    {
                                        param: { type: 2, data: { grade: curSeason.grade, finalGrade: grade } },
                                        closeCb: () => {
                                            param?.cb?.()
                                        }
                                    })
                            }
                        }
                    })
                } else {
                    param?.cb?.()
                }
            }

            DataMgr.setData(Constants.DATA_DEFINE.QUALIFYING_CUR_SEASON, res, true)
        } else {
            param?.cb?.()
        }
    }

    showGradeGuide() {
        let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
        if (User.PlayGame >= 6 && record[21] !== 1) {
            UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", {
                single: true, param: { index: 21, node: this.node },
            })
        }
    }
}