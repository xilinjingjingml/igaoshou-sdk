import BaseUI from "../../../../start/script/base/BaseUI";
import { UserSrv } from "../../../../start/script/system/UserSrv";
import { User } from "../../../../start/script/data/User";
import { MatchSvr } from "../../../../start/script/system/MatchSvr";
import { Constants } from "../../../../start/script/igsConstants";
import { Helper } from "../../../../start/script/system/Helper";
import { UIMgr } from "../../../../start/script/base/UIMgr";
import { QualifyingSrv } from "../../../../start/script/system/QualifyingSrv";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchResultPush extends BaseUI {

    // _itemMode: cc.Node = null

    onOpen() {
        this.initData()
        this.initEvent()
    }

    onClose(): void {
        UserSrv.UpdateItem()
    }

    initData() {
        let itemMode = this.getNode("results/scroll/view/content/item")
        let content = this.getNode("results/scroll/view/content")

        let data: TResults = this.param
        let height = itemMode.height
        height *= data.length >= 4 ? 4 : data.length

        this.setNodeHeight("results/scroll", height)
        this.setLabelValue("results/title/val", "您有" + data.length + "场比赛已经结束：")

        for (let idx in data) {
            let node = cc.instantiate(itemMode)            
            node.parent = content
            let d = data[idx]

            let match = MatchSvr.GetMatchInfo(d.matchId)

            for (let idx in d.players) {
                let p = d.players[idx]
                if (p.win && d.playerNum <= 2) {
                    if (p.openid === User.OpenID) {                        
                        this.setLabelValue("result", node, "您赢了")                        
                    } else {
                        this.setLabelValue("result", node, "您输了")
                    }
                }
                if (p.openid === User.OpenID) {
                    let items = MatchSvr.GetAwards(d.matchId, p.rank)
                    this.setActive("awards/gold", node, false)
                    this.setActive("awards/lottery", node, false)
                    this.setActive("awards/credits", node, false)
                    let idx = 0
                    for (let i in items) {
                        if (items[i].id === Constants.ITEM_INDEX.GOLD) {
                            this.setActive("awards/gold", node, true)
                            this.setLabelValue("awards/gold/num", node, Helper.FormatNumWYCN(items[i].num))
                            idx++
                        } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                            this.setActive("awards/lottery", node, true)
                            this.setActive("awards/lottery/add", node, idx > 0)
                            this.setLabelValue("awards/lottery/num", node, Helper.FormatNumWYCN(items[i].num))
                            idx++
                        } else if (items[i].id === Constants.ITEM_INDEX.CREDITS) {
                            this.setActive("awards/credits", node, true)
                            this.setActive("awards/credits/add", node, idx > 0)
                            this.setLabelValue("awards/credits/num", node, Helper.FormatNumWYCN(items[i].num))
                            idx++
                        }
                    }

                    // if (d.playerNum > 2) {
                    //     this.setLabelValue("result", node, "第" + (p.rank + 1) + "名")
                    // }

                    if (d.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                        this.setLabelValue("result", node, "第" + (p.rank + 1) + "名")
                    } else if (match.isMultiplayer) {
                        this.setLabelValue("result", node, "第" + (p.rank + 1) + "名")
                    }

                } else if (d.playerNum <= 2) {
                    this.setActive("tuandui", node, false)
                    UserSrv.GetPlyDetail(p.openid, (ply: IPlayerData) => {
                        this.setSpriteFrame("face", node, ply.avatar)
                        this.setLabelValue("opponent", node, ply.userName)
                    })
                }
            }

            if (d.playerNum > 2) {
                this.setActive("tuandui", node, true)
                this.setLabelValue("vs", node, d.name)
                this.setLabelValue("opponent", node, "")
            }

            let matchInfo = MatchSvr.GetMatchInfo(d.matchId)
            this.setActive("gateMoney/gold", node, false)
            this.setActive("gateMoney/lottery", node, false)
            this.setActive("gateMoney/credits", node, false)
            if (matchInfo && matchInfo.freeAd) {
                this.setLabelValue("gateMoney/tip", node, "免费入场")
            } else {
                for (let i in d.gateMoney) {
                    if (d.gateMoney[i].id === Constants.ITEM_INDEX.GOLD) {
                        this.setActive("gateMoney/gold", node, true)
                        this.setLabelValue("gateMoney/gold/num", node, Helper.FormatNumWYCN(d.gateMoney[i].num))
                    } else if (d.gateMoney[i].id === Constants.ITEM_INDEX.LOTTERY) {
                        this.setActive("gateMoney/lottery", node, true)
                        this.setLabelValue("gateMoney/lottery/num", node, Helper.FormatNumWYCN(d.gateMoney[i].num))
                    } else if (d.gateMoney[i].id === Constants.ITEM_INDEX.CREDITS) {
                        this.setActive("gateMoney/credits", node, true)
                        this.setLabelValue("gateMoney/credits/num", node, Helper.FormatNumWYCN(d.gateMoney[i].num))
                    }
                }
            }

            this.setButtonClick("btnDetail", node, () => {
                UIMgr.OpenUI("igaoshou", "component/matchDetail/MatchDetail", { param: { result: d } }, () => this.close())
            })

            MatchSvr.GetMatchAward(d.matchUuid)

            let now = Date.now() / 1000
            let count = now - d.time
            if (count < 60 * 60) {
                let t = Math.floor(count / 60)
                this.setLabelValue("time", node, (t > 0 ? t : 1) + "分钟前")
            } else if (count < 24 * 60 * 60) {
                let t = Math.floor(count / (60 * 60))
                this.setLabelValue("time", node, (t > 0 ? t : 1) + "小时前")
            } else {
                let t = Math.floor(count / (24 * 60 * 60))
                this.setLabelValue("time", node, (t > 0 ? t : 1) + "天前")
            }

            if (d.gradeDate && d.gradeDate.after_grade) {
                QualifyingSrv.resetGradeData(d.gradeDate.before_grade)
                QualifyingSrv.resetGradeData(d.gradeDate.after_grade)
                let after = d.gradeDate.after_grade
                if (after) {
                    this.setActive("grade", node, true)
                    this.setSpriteFrame("grade/major", node, "image/qualifyingIcons/major_icon_lv" + after.major)
                    this.setSpriteFrame("grade/minor", node, "image/qualifyingIcons/name_lv" + (after.level >= 25 ? 25 : after.level))
                    this.setLabelValue("grade/grade_lv_label", node, after.name)
                    if (after.maxStar > 5) {
                        this.setActive("grade/star1", node, false)
                        this.setActive("grade/star2", node, false)
                        this.setActive("grade/star3", node, false)
                        this.setActive("grade/star4", node, false)
                        this.setActive("grade/star5", node, false)
                        this.setActive("grade/totalStar", node, true)
                        this.setLabelValue("grade/totalStar/num", node, "x" + after.star)
                    } else {
                        for (let i = 1; i <= 5; i++) {
                            if (i <= after.maxStar) {
                                this.setActive("grade/star" + i, node, true)
                            } else {
                                this.setActive("grade/star" + i, node, false)
                            }

                            if (i <= after.star) {
                                this.setActive("grade/star" + i + "/star", node, true)
                            } else {
                                this.setActive("grade/star" + i + "/star", node, false)
                            }
                        }
                    }
                }
            }
        }

        itemMode.active = false
    }

    initEvent() {
        this.setButtonClick("bg", () => this.close())
    }
}
