import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { DataMgr } from "../../base/DataMgr";
import { Helper } from "../../system/Helper";
import { User } from "../../system/User";
import { MatchSvr } from "../../system/MatchSvr";
import { UIMgr } from "../../base/UIMgr";


const { ccclass, property } = cc._decorator;

const CLICK_LIST = "running_click_list"

@ccclass
export default class RunningEntry extends BaseUI {

    _bInit: boolean = false
    _type: number = -1

    onOpen() {
        this.initEvent()
        this.initData()

        this._bInit = true
    }

    start() {
        this.initEvent()
    }

    initEvent() {
        this.setButtonClick(this.node, this.onGoToMatch.bind(this))
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

        if (result.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
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
                    // .call(() => {
                    //     this.setLabelValue("btm/time", "比赛已结束")
                    // })
                    .start()
            }
            this.setActive("btm/gateMoney", false)
            this.setActive("btm", true)
            this.setLabelValue("btm/tip", "剩余时间:")
        }
        this.setActive("top/awards", false)

        let userInfo = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)

        if (result.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.setSpriteFrame("top/player/avatar", "image/match/huodongsai", true)
        } else {
            let haveOpponent = false
            for (let p of result.players) {
                if (p.openid && p.openid !== userInfo.userId) {
                    // User.GetPlyDetail(p.openid, (ply: IPlayerData) => {
                        this.setLabelValue("top/player/opponent/opponent", p.userName)
                        this.setSpriteFrame("top/player/avatar", p.avatar, true)
                    // })
                    haveOpponent = true
                }
            }

            if (!haveOpponent) {
                this.setSpriteFrame("top/player/avatar", userInfo.avatar, true)
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
        let userInfo = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        //this.setSpriteFrame("top/player/avatar", userInfo.avatar)

        if (result.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.setSpriteFrame("top/player/avatar", "image/match/huodongsai", true)
        } else {
            let haveOpponent = false
            for (let p of result.players) {
                if (p.openid && p.openid !== userInfo.userId) {
                    // User.GetPlyDetail(p.openid, (ply: IPlayerData) => {
                        this.setActive("top/player/opponent", true)
                        this.setActive("top/player/score", false)
                        this.setLabelValue("top/player/opponent/opponent", p.userName)
                        this.setSpriteFrame("top/player/avatar", p.avatar, true)
                    // })
                    haveOpponent = true
                }
            }

            if (!haveOpponent) {
                this.setLabelValue("top/player/state", "正在匹配对手")
                this.setActive("top/player/opponent", false)
                this.setSpriteFrame("top/player/avatar", userInfo.avatar, true)
            }
        }
    }

    _finished(result: IMatchDetail) {
        this.setActive("top/player/point", false)
        this.setActive("top/awards", false)

        let userInfo = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)

        if (result.matchState === Constants.MATCH_STATE.ABORT) {
            this.setLabelValue("top/player/matchResult", "已中止")
            let haveOpponent = false
            for (let p of result.players) {
                if (p.openid && p.openid !== userInfo.openId) {
                    // User.GetPlyDetail(i.openid, (ply: IPlayerData) => {
                        this.setActive("top/player/rank", false)
                        this.setActive("top/player/opponent", true)
                        this.setLabelValue("top/player/opponent/opponent", p.userName)
                        this.setSpriteFrame("top/player/avatar", p.avatar, true)
                    // })
                    haveOpponent = true
                    break
                }
            }

            if (!haveOpponent) {
                this.setLabelValue("top/player/rank", "未匹配到对手")
                this.setActive("top/player/opponent", false)
                this.setSpriteFrame("top/player/avatar", userInfo.avatar, true)
            }
        } else if (result.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
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
            this.setSpriteFrame("top/player/avatar", "image/match/huodongsai", true)
        } else {
            let userInfo = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
            for (let p of result.players) {
                if (p.openid === userInfo.userId) {
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
                        // this.setChildParam("top/awards/ItemMode", {items: showAwards, style: ITEM_STYLE.STYLE_SOLID})
                        this.setItems("top/awards", showAwards)
                        this.setActive("top/awards", true)
                    } else if (result.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
                        this.setLabelValue("top/player/matchResult", "您排在")
                        this.setLabelValue("top/player/rank", "前" + p.rank + "名, 共" + result.playerNum + "玩家")
                    } else {
                        this.setLabelValue("top/player/matchResult", "您输了")
                    }
                } else if (p.openid && p.openid !== userInfo.userId) {
                    // User.GetPlyDetail(p.openid, (ply: IPlayerData) => {
                        this.setLabelValue("top/player/opponent/opponent", p.userName)
                        this.setSpriteFrame("top/player/avatar", p.avatar, true)
                    // })
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
            this.setActive("btm/gateMoney/wcoin", false)
            this.setActive("btm/gateMoney/lottery", false)
            this.setActive("btm/gateMoney/diamond", false)
        } else {
            this.setItems("btm/gateMoney", result.gateMoney)
        }
        this.setActive("top/player/matchName", false)
        this.setActive("top/player/state", false)
        this.setActive("top/player/score", false)
        this.setActive("top/player/time", false)
        // this.setActive("top/player/opponent", result.type !== Constants.MATCH_TYPE.TOURNEY_MATCH)
        this.setActive("top/btnToGo", false)
        this.setActive("btm", true)
    }

    onGoToMatch() {
        // this.setButtonClickDelay(this.node, 2)
        let data: IMatchDetail = this.param.data
        if (!data) {
            return
        }

        // let oldList = DataMgr.getData<string[]>(CLICK_LIST + this._type) || []
        // oldList.push(data.matchUuid)
        // DataMgr.setData(CLICK_LIST + this._type, oldList)
        this.setActive("top/player/point", false)

        if ((data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) &&
            (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING ||
                data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_GAMING) &&
            (data.type !== Constants.MATCH_TYPE.TOURNEY_MATCH)) {
            MatchSvr.EnterMatch(data.matchId, data.matchUuid, () => { MatchSvr.StartGame(); this.close() })
        } else if ((data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) &&
            (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH) &&
            (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING ||
                data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_GAMING)) {
            // 比赛中 竞标赛 等待开始游戏
            MatchSvr.GetMatch(data.matchId, data.matchUuid, data.roundId, (result) => {
                Helper.OpenPageUI("component/Match/MatchTreeEntry", data.name, "", { data: result })
            })
        } else if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING &&
            data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            MatchSvr.GetActivityMatch(data.matchUuid, (result) => {
                if (result)
                    UIMgr.OpenUI("component/Match/ActivityMatchList", { param: { data: result } })
            })
        } else {
            // 等待对手
            if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                MatchSvr.GetActivityMatch(data.matchUuid, (result) => {
                    if (result)
                        UIMgr.OpenUI("component/Match/ActivityMatchList", { param: { data: result } })
                })
            } else {
                Helper.OpenPageUI("component/Match/MatchDetailEntry", "", null, { result: data })
            }
        }
    }

    setItems(name, items: TItems) {
        this.setActive(name + "/wcoin", false)
        this.setActive(name + "/lottery", false)
        this.setActive(name + "/diamond", false)
        let idx = 0
        for (let i in items) {
            if (items[i].id === Constants.ITEM_INDEX.WCOIN) {
                this.setActive(name + "/wcoin", true)
                this.setLabelValue(name + "/wcoin/num", Helper.FormatNumWY(items[i].num))
            } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive(name + "/lottery", true)
                this.setLabelValue(name + "/lottery/num", Helper.FormatNumWY(items[i].num))
                this.setActive(name + "/lottery/add", idx > 0)
            } else if (items[i].id === Constants.ITEM_INDEX.DIAMOND) {
                this.setActive(name + "/diamond", true)
                this.setLabelValue(name + "/diamond/num", items[i].num >= 10000 ? Helper.FormatNumWY(items[i].num) : Helper.FormatNumPrice(items[i].num / 100))
                this.setActive(name + "/diamond/add", idx > 0)
            } else {
                continue
            }
            idx++
        }
    }
}