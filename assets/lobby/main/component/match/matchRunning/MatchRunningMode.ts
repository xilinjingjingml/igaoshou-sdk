import BaseUI from "../../../../start/script/base/BaseUI";
import { Constants } from "../../../../start/script/igsConstants";
import { MatchSvr } from "../../../../start/script/system/MatchSvr";
import { Helper } from "../../../../start/script/system/Helper";
import { User } from "../../../../start/script/data/User";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { QualifyingSrv } from "../../../../start/script/system/QualifyingSrv";
import { UIMgr } from "../../../../start/script/base/UIMgr";

const { ccclass, property } = cc._decorator;

const CLICK_LIST = "running_click_list"

@ccclass
export default class MatchRunningMode extends BaseUI {

    _bInit: boolean = false
    _type: number = -1

    onOpen() {
        this.initEvent()
        this.initData()

        this._bInit = true
    }

    onLoad(): void {
        this.setActive("top/player/avatar/avatarFrame", false)
        this.setActive("top/player/avatar/avatarFrameMember", false)
    }

    start() {
        this.initEvent()
    }

    initEvent() {
    }

    setParam(param) {
        this.param = param
        this.initData()
    }

    initData() {
        let param: IMatchDetail = this.param.data
        if (!param) {
            return
        }

        param.time = Number(param.time)

        if (param.matchState === Constants.MATCH_STATE.COMPLETE || param.matchState === Constants.MATCH_STATE.ABORT) {
            this._finished(param)
        } else if (param.battleState < Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SETTLE) {
            this._matching(param)
        } else if (param.battleState >= Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SETTLE) {
            this._waiting(param)
        }
    }

    _matching(result: IMatchDetail) {
        this.setActive("top/player/point", false)

        this.setLabelValue("top/player/matchName", result.name)

        if (result.type === Constants.MATCH_TYPE.ACTIVITY_MATCH || result.playerNum > 2) {
            this.setActive("top/player/state", true)
            this.setActive("top/player/matchResult", false)
            this.setActive("top/player/score", true)
            if (undefined !== result.score && null !== result.score && !isNaN(result.score)) {
                this.setLabelValue("top/player/score/num", result.score)
            } else {
                this.setLabelValue("top/player/score/num", "已中止")
            }

            this.setActive("top/player/opponent", false)
            this.setActive("top/player/time", false)
            this.setActive("top/btnToGo", false)
            let match = MatchSvr.GetMatchInfo(result.matchId)
            let exTime = Math.ceil(match.endTime - Date.now() / 1000)
            if (exTime <= 0) {
                exTime = 0
                this.setLabelValue("top/player/state", "比赛已结束")
            } else {
                let label = this.getNodeComponent("top/player/state", cc.Label)
                label.node.stopAllActions()
                label.string = exTime > 86400 ? Helper.FormatTimeString(exTime * 1000, "结束倒计时: d天 hh:mm:ss") : Helper.FormatTimeString(exTime * 1000, "结束倒计时: hh:mm:ss")
                this.node.stopAllActions()
                cc.tween(label.node)
                    .repeatForever(
                        cc.tween()
                            .delay(1)
                            .call(() => {
                                let exTime = Math.ceil(match.endTime - Date.now() / 1000)
                                label.string = exTime > 86400 ? Helper.FormatTimeString(exTime * 1000, "结束倒计时: d天 hh:mm:ss") : Helper.FormatTimeString(exTime * 1000, "结束倒计时: hh:mm:ss")
                                if (exTime <= 0) {
                                    label.string = "比赛已结束"
                                    this.node.stopAllActions()
                                }
                            })
                    )
                    .start()
            }
            this.setActive("btm", false)
        } else {
            this.setLabelValue("top/player/state", "您有新的比赛回合")
            this.setActive("top/player/matchResult", false)
            this.setActive("top/player/score", false)
            this.setActive("top/player/opponent", false)
            this.setActive("top/player/time", false)
            this.setActive("top/btnToGo", true)

            let exTime = Math.ceil(result.expireTime - Date.now() / 1000)
            if (exTime) {
                let label = this.getNodeComponent("btm/time", cc.Label)
                label.node.stopAllActions()
                cc.tween(label.node)
                    .repeatForever(
                        cc.tween()
                            .delay(1)
                            .call(() => {
                                let exTime = Math.ceil(result.expireTime - Date.now() / 1000)
                                label.string = exTime > 86400 ? Helper.FormatTimeString(exTime * 1000, "hh:mm:ss") : Helper.FormatTimeString(exTime * 1000, "mm:ss")
                                if (exTime <= 0) {
                                    this.setLabelValue("btm/time", "比赛已结束")
                                    label.node.stopAllActions()
                                }
                            })
                    )
                    .start()
            }
            this.setActive("btm/gateMoney", false)
            this.setActive("btm", true)
            this.setLabelValue("btm/tip", "剩余时间:")
        }
        this.setActive("top/awards", false)

        if (result.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.setSpriteFrame("top/player/avatar", "component/match/image/tubiao-huodongsai", true)
        } else if (result.playerNum > 2) {
            this.setSpriteFrame("top/player/avatar", "component/match/image/tubiao-tuandui", true)
        } else {
            let haveOpponent = false
            for (let p of result.players) {
                if (p.openid && p.openid !== User.OpenID) {
                    this.setLabelValue("top/player/opponent/opponent", p.userName)
                    this.setSpriteFrame("top/player/avatar", p.avatar, true)
                    haveOpponent = true
                    if (DataMgr.data.OnlineParam.golden_card && DataMgr.data.OnlineParam.golden_card == 1) {
                        if (p.props && Helper.isMember(p.props[Constants.ITEM_INDEX.MemberCard])) {
                            this.setMemberFaceFrame(true)
                        } else {
                            this.setMemberFaceFrame(false)
                        }
                    }
                }
            }

            if (!haveOpponent) {
                this.setSpriteFrame("top/player/avatar", User.Avatar, true)
                if (DataMgr.data.OnlineParam.golden_card && DataMgr.data.OnlineParam.golden_card == 1) {
                    let isMember: boolean = DataMgr.getData(User.OpenID + Constants.DATA_DEFINE.IS_MEMBER)
                    this.setMemberFaceFrame(isMember)
                }
            }
        }
    }

    _waiting(result: IMatchDetail) {
        this.setActive("top/player/point", false)

        this.setLabelValue("top/player/matchName", result.name)
        if (result.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            this.setLabelValue("top/player/state", "等待锦标赛结束")
            this.setActive("top/player/score", false)
        } else {
            this.setLabelValue("top/player/state", "等待其他玩家完成比赛")
            this.setActive("top/player/score", true)
        }

        this.setLabelValue("top/player/score/num", result.score)

        this.setActive("top/player/matchResult", false)

        this.setActive("top/player/opponent", false)
        this.setActive("top/player/time", false)
        this.setActive("top/awards", false)
        this.setActive("top/btnToGo", false)
        this.setActive("btm", false)

        if (result.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.setSpriteFrame("top/player/avatar", "component/match/image/tubiao-huodongsai", true)
        } else if (result.playerNum > 2) {
            this.setSpriteFrame("top/player/avatar", "component/match/image/tubiao-tuandui", true)
        } else {
            let haveOpponent = false
            for (let p of result.players) {
                if (p.openid && p.openid !== User.OpenID) {
                    this.setActive("top/player/opponent", true)
                    this.setActive("top/player/score", false)
                    this.setLabelValue("top/player/opponent/opponent", p.userName)
                    this.setSpriteFrame("top/player/avatar", p.avatar, true)
                    haveOpponent = true
                    if (DataMgr.data.OnlineParam.golden_card && DataMgr.data.OnlineParam.golden_card == 1) {
                        if (p.props && Helper.isMember(p.props[Constants.ITEM_INDEX.MemberCard])) {
                            this.setMemberFaceFrame(true)
                        } else {
                            this.setMemberFaceFrame(false)
                        }
                    }
                }
            }

            if (!haveOpponent) {
                this.setLabelValue("top/player/state", "正在匹配对手")
                this.setActive("top/player/opponent", false)
                this.setSpriteFrame("top/player/avatar", User.Avatar, true)
                if (DataMgr.data.OnlineParam.golden_card && DataMgr.data.OnlineParam.golden_card == 1) {
                    let isMember: boolean = DataMgr.getData(User.OpenID + Constants.DATA_DEFINE.IS_MEMBER)
                    this.setMemberFaceFrame(isMember)
                }
            }
        }
    }

    _finished(result: IMatchDetail) {
        this.setActive("top/player/point", false)
        this.setActive("top/awards", false)

        if (result.gradeDate && result.gradeDate.after_grade) {
            QualifyingSrv.resetGradeData(result.gradeDate.before_grade)
            QualifyingSrv.resetGradeData(result.gradeDate.after_grade)
            let after = result.gradeDate.after_grade
            if (after) {
                this.setActive("btm/grade", result.playerNum <= 2)
                this.setSpriteFrame("btm/grade/major", "image/qualifyingIcons/major_icon_lv" + after.major)
                this.setSpriteFrame("btm/grade/minor", "image/qualifyingIcons/name_lv" + (after.level >= 25 ? 25 : after.level))
                this.setLabelValue("btm/grade/grade_lv_label", after.name)
                if (after.maxStar > 5) {
                    this.setActive("btm/grade/star1", false)
                    this.setActive("btm/grade/star2", false)
                    this.setActive("btm/grade/star3", false)
                    this.setActive("btm/grade/star4", false)
                    this.setActive("btm/grade/star5", false)
                    this.setActive("btm/grade/totalStar", true)
                    this.setLabelValue("btm/grade/totalStar/num", "x" + after.star)
                } else {
                    for (let i = 1; i <= 5; i++) {
                        if (i <= after.maxStar) {
                            this.setActive("btm/grade/star" + i, true)
                        } else {
                            this.setActive("btm/grade/star" + i, false)
                        }

                        if (i <= after.star) {
                            this.setActive("btm/grade/star" + i + "/star", true)
                        } else {
                            this.setActive("btm/grade/star" + i + "/star", false)
                        }
                    }
                }
            }
        }

        if (result.matchState === Constants.MATCH_STATE.ABORT) {
            this.setLabelValue("top/player/matchResult", "已中止")
            let haveOpponent = false
            for (let p of result.players) {
                if (p.openid && p.openid !== User.OpenID) {
                    this.setActive("top/player/rank", false)
                    this.setActive("top/player/opponent", true)
                    this.setLabelValue("top/player/opponent/opponent", p.userName)
                    this.setSpriteFrame("top/player/avatar", p.avatar, true)
                    haveOpponent = true
                    if (DataMgr.data.OnlineParam.golden_card && DataMgr.data.OnlineParam.golden_card == 1) {
                        if (p.props && Helper.isMember(p.props[Constants.ITEM_INDEX.MemberCard])) {
                            this.setMemberFaceFrame(true)
                        } else {
                            this.setMemberFaceFrame(false)
                        }
                    }
                    break
                }
            }

            if (!haveOpponent) {
                this.setLabelValue("top/player/rank", "未匹配到对手")
                this.setActive("top/player/opponent", false)
                this.setSpriteFrame("top/player/avatar", User.Avatar, true)
                if (DataMgr.data.OnlineParam.golden_card && DataMgr.data.OnlineParam.golden_card == 1) {
                    let isMember: boolean = DataMgr.getData(User.OpenID + Constants.DATA_DEFINE.IS_MEMBER)
                    this.setMemberFaceFrame(isMember)
                }
            }
        } else if (result.type === Constants.MATCH_TYPE.ACTIVITY_MATCH || result.playerNum > 2) {
            if (undefined !== result.rank && null !== result.rank && !isNaN(result.rank)) {
                this.setLabelValue("top/player/matchResult", "第" + (result.rank + 1) + "名")
                let awards = MatchSvr.GetAwards(result.matchId, result.rank + 1)
                let showAwards = awards.filter(i => i.id === result.gateMoney[0].id)
                if (showAwards.length === 0)
                    showAwards = awards.filter(i => i.id === Constants.ITEM_INDEX.LOTTERY)
                if (showAwards.length === 0)
                    showAwards = awards.filter(i => i.id === Constants.ITEM_INDEX.DIAMOND)
                this.setItems("top/awards", showAwards)
                this.setActive("top/awards", true)
            } else {
                this.setLabelValue("top/player/matchResult", "未上榜")
                this.setActive("top/awards", false)
            }

            this.setActive("top/player/opponent", false)
            if (result.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                this.setSpriteFrame("top/player/avatar", "component/match/image/tubiao-huodongsai", true)
            } else if (result.playerNum > 2) {
                this.setSpriteFrame("top/player/avatar", "component/match/image/tubiao-tuandui", true)
            }
        } else {
            for (let p of result.players) {
                if (p.openid === User.OpenID) {
                    if (p.win) {
                        // this.setSpriteFrame("top/player/avatar", userInfo.avatar)
                        this.setLabelValue("top/player/matchResult", "您赢了")
                        if (result.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
                            this.setLabelValue("top/player/rank", "冠军 共" + result.playerNum + "玩家")
                        }

                        let awards = MatchSvr.GetAwards(result.matchId, p.win ? 1 : 2)
                        let showAwards = awards.filter(i => i.id === result.gateMoney[0].id)
                        if (showAwards.length === 0)
                            showAwards = awards.filter(i => i.id === Constants.ITEM_INDEX.LOTTERY)
                        if (showAwards.length === 0)
                            showAwards = awards.filter(i => i.id === Constants.ITEM_INDEX.DIAMOND)
                        this.setItems("top/awards", showAwards)
                        this.setActive("top/awards", true)
                    } else if (result.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
                        this.setLabelValue("top/player/matchResult", "您排在")
                        this.setLabelValue("top/player/rank", "前" + p.rank + "名, 共" + result.playerNum + "玩家")
                    } else {
                        this.setLabelValue("top/player/matchResult", "您输了")
                    }
                } else if (p.openid && p.openid !== User.OpenID) {
                    this.setLabelValue("top/player/opponent/opponent", p.userName)
                    this.setSpriteFrame("top/player/avatar", p.avatar, true)
                    if (DataMgr.data.OnlineParam.golden_card && DataMgr.data.OnlineParam.golden_card == 1) {
                        if (p.props && Helper.isMember(p.props[Constants.ITEM_INDEX.MemberCard])) {
                            this.setMemberFaceFrame(true)
                        } else {
                            this.setMemberFaceFrame(false)
                        }
                    }
                }
            }
        }

        this.setLabelValue("btm/tip", "时间:")
        let now = Date.now() / 1000
        let count = now - result.time
        if (count < 60 * 60) {
            let t = Math.floor(count / 60)
            this.setLabelValue("btm/time", (t > 0 ? t : 1) + "分钟前")
        } else if (count < 24 * 60 * 60) {
            let t = Math.floor(count / (60 * 60))
            this.setLabelValue("btm/time", (t > 0 ? t : 1) + "小时前")
        } else {
            let t = Math.floor(count / (24 * 60 * 60))
            this.setLabelValue("btm/time", (t > 0 ? t : 1) + "天前")
        }

        let matchInfo = MatchSvr.GetMatchInfo(result.matchId)
        let free = true
        result.gateMoney.forEach(i => i.num > 0 ? free = false : "")
        if ((matchInfo && matchInfo.freeAd) || free) {
            this.setLabelValue("btm/gateMoney/tip", "免费入场")
            this.setActive("btm/gateMoney/gold", false)
            this.setActive("btm/gateMoney/lottery", false)
            this.setActive("btm/gateMoney/credits", false)
        } else {
            this.setItems("btm/gateMoney", result.gateMoney)
        }
        this.setActive("top/player/matchName", false)
        this.setActive("top/player/state", false)
        this.setActive("top/player/score", false)
        this.setActive("top/player/time", false)
        this.setActive("top/btnToGo", false)
        this.setActive("btm", true)
    }

    onPressMatch() {
        let data: IMatchDetail = this.param.data
        if (!data) {
            return
        }

        this.setActive("top/player/point", false)

        if ((data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) &&
            (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING ||
                data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_GAMING) &&
            (data.type !== Constants.MATCH_TYPE.TOURNEY_MATCH)) {
            if (data.realTime) {
                MatchSvr.EnterRealTimeMatch(data.matchId, data.matchUuid, data.roundId, () => { MatchSvr.StartGame() })
            } else {
                MatchSvr.EnterMatch(data.matchId, data.matchUuid, () => { MatchSvr.StartGame()/*; this.close()*/ })
            }
        } else if ((data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) &&
            (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH) &&
            (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING ||
                data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_GAMING)) {
            // 比赛中 竞标赛 等待开始游戏
            MatchSvr.GetMatch(data.matchId, data.matchUuid, data.roundId, (result) => {
                Helper.OpenPageUI("component/match/tourneyMatch/MatchTree", data.name, "", { data: result })
            })
        } else if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING &&
            data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            MatchSvr.GetActivityMatch(data.matchUuid, (result) => {
                if (result)
                    UIMgr.OpenUI("lobby", "component/match/activityMatch/ActivityMatchList", { param: { data: result } })
            })
        } else if (data.playerState < 0) {
            Helper.OpenTip("比赛状态错误")
        } else {
            // 等待对手
            if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                MatchSvr.GetActivityMatch(data.matchUuid, (result) => {
                    if (result)
                        UIMgr.OpenUI("lobby", "component/match/activityMatch/ActivityMatchList", { param: { data: result } })
                })
            } else {
                UIMgr.OpenUI("igaoshou", "component/matchDetail/MatchDetail", { param: { result: data } })
            }
        }
    }

    setItems(name, items: TItems) {
        this.setActive(name + "/gold", false)
        this.setActive(name + "/lottery", false)
        this.setActive(name + "/credits", false)
        let idx = 0
        for (let i in items) {
            if (items[i].id === Constants.ITEM_INDEX.GOLD) {
                this.setActive(name + "/gold", true)
                this.setLabelValue(name + "/gold/num", Helper.FormatNumWYCN(items[i].num))
            } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive(name + "/lottery", true)
                this.setLabelValue(name + "/lottery/num", Helper.FormatNumWYCN(items[i].num))
                this.setActive(name + "/lottery/add", idx > 0)
            } else if (items[i].id === Constants.ITEM_INDEX.CREDITS) {
                this.setActive(name + "/credits", true)
                this.setLabelValue(name + "/credits/num", Helper.FormatNumWYCN(items[i].num))
                this.setActive(name + "/credits/add", idx > 0)
            } else {
                continue
            }
            idx++
        }
    }

    setMemberFaceFrame(isMember: boolean) {
        this.setActive("top/player/avatar/avatarFrame", !isMember)
        this.setActive("top/player/avatar/avatarFrameMember", isMember)
    }
}
