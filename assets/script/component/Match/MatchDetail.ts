import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { Helper } from "../../system/Helper";
import { DataMgr } from "../../base/DataMgr";
import { MatchSvr } from "../../system/MatchSvr";
import { UIMgr } from "../../base/UIMgr";
import { ActivitySrv, SignSrv } from "../../system/ActivitySrv"
import WxWrapper from "../../system/WeChatMini";
import { TaskSrv } from "../../system/TaskSrv";
import { EventMgr } from "../../base/EventMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchDetail extends BaseUI {

    _curAwardIdx: number = -1
    _checkActivityPop: boolean = false

    onOpen() {
        this.initEvent()
        this.initData()
    }

    onClose() {
        WxWrapper.hideUserInfoButton("btnNext")
    }

    onEnterEnd() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.initWxSync()
        }

        if (this.param.isSettle && DataMgr.Config.platId != 3) {
            this.checkGuide()
        }

        if (DataMgr.Config.platId == 3) {
            this.setActive("btnShare", false)
        }
    }

    initEvent() {
        this.setButtonClick("btns/content/btnBack", this.onPressBack.bind(this))
        this.setButtonClick("btns/content/btnDetail", this.onPressDetail.bind(this))
        this.setButtonClick("btns/content/btnNext", this.onPressNext.bind(this), 3)
        this.setButtonClick("btns/content/btnStart", this.onPressStart.bind(this))
        this.setButtonClick("btns/content/btnMore", this.onPressBack.bind(this))

        this.setButtonClick("btm/btns/btnStart", this.onPressStart.bind(this))
        this.setButtonClick("btm/info/btnCopy", this.onPressCopy.bind(this))

        // this.setButtonClick("guide/tishikuang/btnHuafei", this.onPressHuafei.bind(this))
        // this.setButtonClick("guide/huafei/btnHuafei", this.onPressHuafei.bind(this))
        this.setButtonClick("guide/btnHuafei", this.onPressHuafei.bind(this))
        EventMgr.on(Constants.EVENT_DEFINE.TASK_UPDATE, this.updateGamesTask, this)

        this.setButtonClick("btnShare", () => Helper.shareInfo())
    }

    initData() {
        // 隐藏信息节点
        this.setActive("detail/view/content/round", false)
        this.setActive("detail/view/content/state/info/content/settlement", false)
        this.setActive("detail/view/content/state/info/content/settlement/bg/award", false)
        this.setActive("detail/view/content/state/info/content/settlement/bg/growth", false)
        this.setActive("detail/view/content/hearten", false)
        this.setActive("detail/view/content/MatchPlayerList", false)
        this.setActive("detail/view/content/scoreRecord", false)
        // this.setActive("guide", false)
        this.setActive("btm/btns/btnStart", false)
        this.setActive("tip", false)
        this.getNode("detail/view/content/state/info/content/league").children.forEach(i => i.active = false)
        this.getNode("btns/content").children.forEach(i => i.active = false)

        this.setActive("btnHuafei", false)
        this.setActive("btnGames", false)
        this.setActive("guide/btnHuafei", false)

        this.initHuafei()
        this.initGamesTask()

        if (this.param.match) {
            this.initMatchs()
            // this.setActive("detail/view/content/huafei", false)
        } else if (this.param.result) {
            this.initResults()
            // this.setActive("detail/view/content/huafei", true)            
        }
    }

    initWxSync() {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        console.log("allGame = " + user.histroy.allGame)
        let self = this
        if (!user.histroy.allGame || user.histroy.allGame < 3) {
            return
        }
        let btn = this.getNode("btns/content/btnNext")
        // btns.children.forEach(btn => {
        // if (!btn.active) return
        Helper.createWxUserInfo(btn, btn.name, (sync) => {
            WxWrapper.hideUserInfoButton(btn.name)
            let fn = "onPress" + btn.name.substr(3)
            self[fn] && self[fn]()
        }, (create) => {
            if (!this.node || !this.isValid || !btn.active) {
                WxWrapper.hideUserInfoButton(btn.name)
            }
        })
    }

    initMatchs() {
        let match: IMatchInfo = this.param.match
        if (!match) {
            return
        }

        // 轮数显示
        this.setLabelValue("top/title", this.node.parent.parent.parent.parent, match.name)
        this.setActive("detail/view/content/round", match.type === Constants.MATCH_TYPE.TOURNEY_MATCH)
        if (match.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            this.setLabelValue("detail/view/content/round", "第1轮")
        }

        this.setActive("btnShare", false)

        // 图标        
        this.setActive("detail/view/content/state/info/content/league/cup", true)
        this.setActive("detail/view/content/hearten", false)

        this.initList(match)

        this.setNodeHeight("detail", this.node.height - 110)

        let data: IMatchDetail = this.param.result
        if (data) {
            this.setActive("btns/content/btnDetail", true)
            this.setActive("btns/content/btnBack", true)
            this.initBottom(data)
        } else if (match) {
            // this.setActive("btm/btns", true)
            // this.setActive("btm/btns/btnStart", true)
            this.setActive("btm", false)
            if (match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                this.setActive("btns/content/btnStart", match.maxTimes > match.curTimes)
            } else {
                this.setActive("btns/content/btnStart", true)
            }

            this.setLabelValue("btns/content/btnStart/name", "开始比赛")
        }
    }

    initList(match: IMatchInfo) {
        this.setActive("detail/view/content/state/info/content/state", false)
        this.setActive("detail/view/content/state/info/content/list", true)

        if (match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.setLabelValue("detail/view/content/state/info/content/list/matchName/value", "")
            this.setActive("detail/view/content/state/info/content/list/matchName/awards", true)
            let awards = []
            for (let i in match.awards) {
                for (let j of match.awards[i].items) {
                    if (awards[j.id]) {
                        awards[j.id].num += j.num * (match.awards[i].end - match.awards[i].start + 1)
                    } else {
                        awards[j.id] = { id: j.id, num: j.num * (match.awards[i].end - match.awards[i].start + 1) }
                    }
                }
            }
            let idx = 0
            this.setActive("detail/view/content/state/info/content/list/matchName/awards/wcoin", false)
            this.setActive("detail/view/content/state/info/content/list/matchName/awards/lottery", false)
            this.setActive("detail/view/content/state/info/content/list/matchName/awards/diamond", false)
            for (let i in awards) {
                if (awards[i].id === Constants.ITEM_INDEX.WCOIN) {
                    this.setActive("detail/view/content/state/info/content/list/matchName/awards/wcoin", true)
                    this.setLabelValue("detail/view/content/state/info/content/list/matchName/awards/wcoin", Helper.FormatNumWY(awards[i].num))
                    idx++
                } else if (awards[i].id === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("detail/view/content/state/info/content/list/matchName/awards/lottery", true)
                    this.setLabelValue("detail/view/content/state/info/content/list/matchName/awards/lottery/num", Helper.FormatNumWY(awards[i].num))
                    this.setActive("detail/view/content/state/info/content/list/matchName/awards/lottery/add", idx > 0)
                    idx++
                } else if (awards[i].id === Constants.ITEM_INDEX.DIAMOND) {
                    this.setActive("detail/view/content/state/info/content/list/matchName/awards/diamond", true)
                    this.setLabelValue("detail/view/content/state/info/content/list/matchName/awards/diamond/num", Helper.FormatNumWY(awards[i].num))
                    this.setActive("detail/view/content/state/info/content/list/matchName/awards/diamond/add", idx > 0)
                    idx++
                }
            }
        } else {
            this.setLabelValue("detail/view/content/state/info/content/list/matchName/value", match.name)
            this.setActive("detail/view/content/state/info/content/list/matchName/awards", false)
        }

        let mode = this.getNode("detail/view/content/state/info/content/list/scrollView/view/itemNode")
        mode.active = false

        let content = this.getNode("detail/view/content/state/info/content/list/scrollView/view/content")
        let rank = 1

        let self = this
        let setRank = function (rank, start) {
            let awards = MatchSvr.GetAwards(match.matchId, rank)
            let item = cc.instantiate(mode)
            item.parent = content
            item.active = true
            if (null !== start) {
                self.setLabelValue("rank/rankName", item, start !== rank ? "第" + start + "-" + rank + "名" : "第" + rank + "名")
            } else {
                self.setLabelValue("rank/rankName", item, rank === 1 ? "冠军" : rank === 2 ? "亚军" : rank === 3 ? "季军" : "前" + rank + "名")
            }
            self.setActive("awards/wcoin", item, false)
            self.setActive("awards/lottery", item, false)
            self.setActive("awards/diamond", item, false)
            self.setActive("awards/null", item, false)
            let idx = 0
            for (let i in awards) {
                if (awards[i].id === Constants.ITEM_INDEX.WCOIN) {
                    self.setActive("awards/wcoin", item, true)
                    self.setLabelValue("awards/wcoin/num", item, Helper.FormatNumWY(awards[i].num))
                    idx++
                } else if (awards[i].id === Constants.ITEM_INDEX.LOTTERY) {
                    self.setActive("awards/lottery", item, true)
                    self.setLabelValue("awards/lottery/num", item, Helper.FormatNumWY(awards[i].num))
                    self.setActive("awards/lottery/add", item, idx > 0)
                    idx++
                } else if (awards[i].id === Constants.ITEM_INDEX.DIAMOND) {
                    self.setActive("awards/diamond", item, true)
                    self.setLabelValue("awards/diamond/num", item, Helper.FormatNumWY(awards[i].num))
                    self.setActive("awards/diamond/add", item, idx > 0)
                    idx++
                }
            }
            self.setActive("awards/null", item, idx === 0)
            self.setActive("bg", item, content.childrenCount % 2 === 0)
        }

        if (match.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            while (rank < match.maxPlayer) {
                setRank(rank, null)
                rank *= 2
                // idx++
            }
        } else if (match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            for (let l in match.awards) {
                setRank(match.awards[l].end, match.awards[l].start)
            }

            // let end = 1
            // match.awards.map(i => i.end > end ? end = i.end : end = end)
            // for (let i = 1; i <= end; i++) {
            //     setRank(i)
            // }

            this.setNodeComponentEnabled("detail/view/content/state/info/content", cc.Sprite, false)
        }

        this.setActive("detail/view/content/state/info/content/list/tip/value0", false)
        this.setActive("detail/view/content/state/info/content/list/tip/value1", false)
        this.setActive("detail/view/content/state/info/content/list/tip/times", false)

        if (match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.setActive("detail/view/content/state/info/content/list/tip/value0", true)
            this.setRichTextValue("detail/view/content/state/info/content/list/tip/value0", "可参与<color=#ff784e><size=32><bold=true> " + match.maxTimes + " </b></c>次，按照您的最高得分进行排名，比赛倒计时\n结束后提交的分数无效")
            let now = Date.now() / 1000
            if (match.endTime > now) {
                let time = Math.ceil(match.endTime - Date.now() / 1000)
                let label = this.getNodeComponent("detail/view/content/state/info/content/list/tip/times", cc.Label)
                label.string = "结束倒计时:" + (time > 86400 ? Helper.FormatTimeString(time * 1000, "d天 hh:mm:ss") : Helper.FormatTimeString(time * 1000, "hh:mm:ss"))
                label.node.stopAllActions()
                cc.tween(label.node)
                    .repeatForever(
                        cc.tween()
                            .delay(1)
                            .call(() => {
                                let time = Math.ceil(match.endTime - Date.now() / 1000)
                                label.string = "结束倒计时:" + (time > 86400 ? Helper.FormatTimeString(time * 1000, "d天 hh:mm:ss") : Helper.FormatTimeString(time * 1000, "hh:mm:ss"))
                                if (time <= 0) {
                                    label.string = "比赛已结束"
                                    label.node.stopAllActions()
                                }
                            })
                    )
                    .start()
            } else {
                this.setLabelValue("detail/view/content/state/info/content/list/tip/times", "比赛已结束")
            }
            this.setActive("detail/view/content/state/info/content/list/tip/times", true)
        } else if (match.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            this.setActive("detail/view/content/state/info/content/list/tip/value1", true)
            this.setActive("detail/view/content/state/info/content/list/tip/times", true)
        }

    }

    initResults() {
        let data: IMatchDetail = this.param.result
        if (!data) {
            return
        }

        this.setLabelValue("top/title", this.node.parent.parent.parent.parent, data.name)
        // 轮数显示
        // this.setLabelValue("detail/view/content/value", data.matchName)
        this.setLabelValue("detail/view/content/round", data.totalStage > 1 ? "第" + (data.curStage + 1) + "轮" : "")

        this.setActive("detail/view/content/state/info/content/state", true)
        this.setActive("detail/view/content/state/info/content/list", false)


        if (data.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.initPlayer(data)
        }

        this.initBottom(data)

        if (data.matchState === Constants.MATCH_STATE.ABORT) {
            this.initAbort(data)
        } else if (data.matchState === Constants.MATCH_STATE.COMPLETE && data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.initActiviyMatch(data)
        } else if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) {
            if (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_REBATTLE) {
                // 平局
                this.initRebattle(data)
            } else if (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING ||
                data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_GAMING) {
                // 等待进入比赛
                this.initGaming(data)
            } else if (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SETTLE) {
                // 等待对手
                this.initWaitOpponent(data)
            } else if (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_ABORTED) {
                this.initWaitOpponent(data)
                // this.initAbort(data)
            } else if (data.battleState === Constants.PLAYER_BATTLE_STATE.NONE && data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                this.initActiviyMatch(data)
            }
        } else if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_AWARD) {
            // 领奖
            if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                this.initActiviyMatch(data)
            } else {
                this.initGetAward(data)
            }
        } else if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMEOVER) {
            // 比赛结束
            if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                this.initActiviyMatch(data)
            } else {
                this.initGameOver(data)
            }
        }
    }

    initActiviyMatch(data: IMatchDetail) {
        if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) {
            this.setActive("detail/view/content/state/info/content/league/wait", true)
        } else {
            this.setActive("detail/view/content/state/info/content/league/1", data.rank === 0)
            this.setActive("detail/view/content/state/info/content/league/2", data.rank === 1)
            this.setActive("detail/view/content/state/info/content/league/3", data.rank === 2)
            this.setActive("detail/view/content/state/info/content/league/n", data.rank > 2)
            this.setLabelValue("detail/view/content/state/info/content/league/n/value", data.rank + 1)
        }
        this.setLabelValue("detail/view/content/state/info/content/state/matchState", "")
        this.setActive("detail/view/content/scoreRecord", true)

        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        this.setLabelValue("detail/view/content/scoreRecord/opponent", user.userName)
        this.setLabelValue("detail/view/content/scoreRecord/areaInfo", user.region)
        this.setSpriteFrame("detail/view/content/scoreRecord/icon", user.avatar, true)

        // 填充分数
        this.setLabelValue("detail/view/content/scoreRecord/curScore/score", data.score)
        this.setLabelValue("detail/view/content/scoreRecord/bestScore/score", data.topScore || data.score)

        if (data.expireTime) {
            if (data.expireTime * 1000 > Date.now()) {
                let time = (data.expireTime * 1000) - Date.now()
                let label = this.getNodeComponent("detail/view/content/state/info/content/state/time/node/counttime", cc.Label)
                let now = Date.now()
                label.string = data.expireTime - now > 86400 ? Helper.FormatTimeString((data.expireTime * 1000) - now, "hh:mm:ss") : Helper.FormatTimeString((data.expireTime * 1000) - now, "mm:ss")
                cc.tween(label)
                    .repeat(Math.floor(time / 1000),
                        cc.tween()
                            .delay(1)
                            .call(() => {
                                let now = Date.now()
                                label.string = data.expireTime - now > 86400 ? Helper.FormatTimeString((data.expireTime * 1000) - now, "hh:mm:ss") : Helper.FormatTimeString((data.expireTime * 1000) - now, "mm:ss")
                            })
                    )
                    .call(() => {
                        label.string = "比赛已结束"
                        this.setActive("detail/view/content/state/info/content/state/time/node/label", false)
                        this.setActive("btns/content/btnNext", false)
                    })
                    .start()

                this.setActive("btns/content/btnNext", data.totalStage > data.curStage)
            } else {
                this.setActive("detail/view/content/state/info/content/state/time/node/label", false)
                this.setLabelValue("detail/view/content/state/info/content/state/time/node/counttime", "比赛已结束")

                this.setActive("btns/content/btnNext", false)
                // this.setActive("btns/content/btnDetail", true)
            }
        }

        this.setLabelValue("btns/content/btnNext/num", "剩余" + (data.totalStage - data.curStage) + "次")
        // this.setActive("btns/content/btnNext", data.totalStage > data.curStage && data.expireTime && data.expireTime * 1000 > Date.now())
        this.setActive("btns/content/btnBack", false)
        this.setActive("btns/content/btnDetail", true)
    }

    initPlayer(data: IMatchDetail) {
        this.setActive("detail/view/content/MatchPlayerList", true)

        // 填充玩家
        let players = data.players
        if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) {
            if (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING ||
                data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_GAMING) {
                let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
                for (let p of players) {
                    if (p.openid !== user.openId) {
                        p.score = NaN
                    }
                }
            }
        }
        this.setChildParam("detail/view/content/MatchPlayerList", { type: data.type, players: data.players, num: data.players.length })

        let awards = []
        if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            if (data.isWin) {
                awards = MatchSvr.GetAwards(data.matchId, Math.pow(2, data.totalStage - data.curStage - 1))
            } else {
                awards = MatchSvr.GetAwards(data.matchId, Math.pow(2, data.totalStage - data.curStage))
            }
        } else if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) {
            awards = MatchSvr.GetAwards(data.matchId, 1)
        } else {
            awards = MatchSvr.GetAwards(data.matchId, data.isWin ? 1 : 2)
        }

        let normal = awards.filter(i => i.id !== Constants.ITEM_INDEX.GoldenMedal && i.id !== Constants.ITEM_INDEX.SilverMedal && i.id !== Constants.ITEM_INDEX.Exp)
        if (normal && normal.length > 0) {
            this._curAwardIdx = normal[0].id
            this.setActive("detail/view/content/state/info/content/state/", true)
            this.setActive("detail/view/content/state/info/content/settlement/bg/award", true)
            this.setItems("detail/view/content/state/info/content/settlement/bg/award/left", [normal[0]])
            if (normal[1]) {
                this.setItems("detail/view/content/state/info/content/settlement/bg/award/right", [normal[1]])
            } else {
                this.setActive("detail/view/content/state/info/content/settlement/bg/award/common-fengexian", false)
                this.setActive("detail/view/content/state/info/content/settlement/bg/award/right", false)
                this.removeNodeComponent("detail/view/content/state/info/content/settlement/bg/award/left", cc.Widget)
                this.setNodePositionX("detail/view/content/state/info/content/settlement/bg/award/left", 0)
            }
        } else {
            this.setActive("detail/view/content/state/info/content/settlement/bg/award", false)
        }

        if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) {
            this.setActive("detail/view/content/state/info/content/settlement/bg/growth", false)
        } else {
            let silver = awards.filter(i => i.id === Constants.ITEM_INDEX.SilverMedal)
            let gold = awards.filter(i => i.id === Constants.ITEM_INDEX.GoldenMedal)
            if (silver && silver.length > 0 && silver[0].num > 0) {
                this.setActive("detail/view/content/state/info/content/settlement/bg/growth/left/silverMedalIcon", true)
                this.setActive("detail/view/content/state/info/content/settlement/bg/growth/left/goldMedalIcon", false)
                this.setLabelValue("detail/view/content/state/info/content/settlement/bg/growth/left/medalVal", silver[0].num || 0)
            } else if (gold && gold.length > 0 && gold[0].num > 0) {
                this.setActive("detail/view/content/state/info/content/settlement/bg/growth/left/silverMedalIcon", false)
                this.setActive("detail/view/content/state/info/content/settlement/bg/growth/left/goldMedalIcon", true)
                this.setLabelValue("detail/view/content/state/info/content/settlement/bg/growth/left/medalVal", gold[0].num || 0)
            } else {
                this.setActive("detail/view/content/state/info/content/settlement/bg/growth/left", false)
                this.setActive("detail/view/content/state/info/content/settlement/bg/growth/common-fengexian", false)
                this.removeNodeComponent("detail/view/content/state/info/content/settlement/bg/growth/right", cc.Widget)
                this.setNodePositionX("detail/view/content/state/info/content/settlement/bg/growth/right", 0)
            }

            let exp = awards.filter(i => i.id === Constants.ITEM_INDEX.Exp)
            this.setLabelValue("detail/view/content/state/info/content/settlement/bg/growth/right/expVal", (exp[0] && exp[0].num) || 0)

            if (silver.length === 0 && gold.length === 0 && exp.length === 0) {
                this.setActive("detail/view/content/state/info/content/settlement/bg/growth", false)
            } else {
                let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
                let self = data.players.filter(p => p.openid === user.userId)
                this.setActive("detail/view/content/state/info/content/settlement", true)
                this.setActive("detail/view/content/state/info/content/settlement/bg/growth", self[0].rank !== 1)
            }
        }
    }

    initBottom(data: IMatchDetail) {
        this.setActive("btm/info", true)

        // 填充底部信息
        this.setLabelValue("btm/info/name", "比赛名称:" + data.name)
        // this.setChildParam("btm/info/gatemoney/items/ItemMode", { items: data.gateMoney, style: ITEM_STYLE.STYLE_WHITE})
        let matchInfo = MatchSvr.GetMatchInfo(data.matchId)
        let free = true
        data.gateMoney.forEach(i => i.num > 0 ? free = false : "")
        if ((matchInfo && matchInfo.freeAd) || free) {
            this.setLabelValue("btm/info/gatemoney", "免费入场")
            this.setActive("btm/info/gatemoney/items", false)
        } else {
            this.setItems("btm/info/gatemoney/items", data.gateMoney)
        }

        this.setLabelValue("btm/info/date", "日期:" + Helper.FormatTimeString(Number(data.createTime) * 1000, "yyyy-MM-dd hh:mm"))
        this.setLabelValue("btm/info/id", "比赛ID:" + data.matchUuid.substr(0, 8))
    }

    initRebattle(data: IMatchDetail) {
        // 图标        
        this.setActive("detail/view/content/state/info/content/league/battle", true)

        // 显示状态
        this.setActive("detail/view/content/state/info/content/state/time", true)

        // 状态提示
        this.setLabelValue("detail/view/content/state/info/content/state/matchState", "决胜局")
        this.setLabelInfo("detail/view/content/state/info/content/state/matchState", { fontSize: 60 })
        if (data.expireTime) {
            let time = (data.expireTime * 1000) - Date.now()
            let label = this.getNodeComponent("detail/view/content/state/info/content/state/time/node/counttime", cc.Label)
            cc.tween(label)
                .repeat(Math.floor(time / 1000),
                    cc.tween()
                        .delay(1)
                        .call(() => { label.string = Helper.FormatTimeString((data.expireTime * 1000) - Date.now(), "hh:mm:ss") })
                )
                .start()
        }

        // 功能按钮
        this.setActive("btns/content/btnStart", true)
        this.setActive("btns/content/btnBack", true)
        // this.setActive("btns/content/btnNext", true)
    }

    initGaming(data: IMatchDetail) {
        // 图标        
        this.setActive("detail/view/content/state/info/content/league/battle", true)

        // 显示状态
        this.setActive("detail/view/content/state/info/content/state/time", true)

        // 状态提示
        if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            if (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SETTLE) {
                this.setLabelValue("detail/view/content/state/info/content/state/matchState", "进行" + (data.curStage < data.totalStage ? "第" + (data.curStage) + "轮" : "决赛"))
            } else {
                this.setLabelValue("detail/view/content/state/info/content/state/matchState", "等待提交分数, 您已完成比赛")
                this.setActive("detail/view/content/state/info/content/settlement", false)
            }
        } else {
            this.setLabelValue("detail/view/content/state/info/content/state/matchState", "等待提交分数")
            this.setActive("detail/view/content/state/info/content/settlement", false)
        }
        if (data.expireTime) {
            let time = (data.expireTime * 1000) - Date.now()
            let label = this.getNodeComponent("detail/view/content/state/info/content/state/time/node/counttime", cc.Label)
            cc.tween(label)
                .repeat(Math.floor(time / 1000),
                    cc.tween()
                        .delay(1)
                        .call(() => { label.string = "倒计时:" + Helper.FormatTimeString((data.expireTime * 1000) - Date.now(), "hh:mm:ss") })
                )
                .start()
        }

        // 功能按钮
        if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH && data.totalStage > 1 && data.totalStage > data.curStage) {
            this.setActive("btns/content/btnDetail", true)
        } else if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.setActive("btns/content/btnDetail", true)
            this.setActive("btns/content/btnStart", true)
        } else {
            this.setActive("btns/content/btnStart", true)
        }

        // let enought = MatchSvr.checkGateMoney(data.matchId) && data.type !== Constants.MATCH_TYPE.TOURNEY_MATCH
        // this.setActive("btns/content/btnNext", enought)
        this.setActive("btns/content/btnBack", true)
    }

    initGetAward(data: IMatchDetail) {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        // 图标        
        if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            if (data.matchState !== Constants.MATCH_STATE.COMPLETE) {
                if (data.isWin) {
                    this.setActive("detail/view/content/state/info/content/league/win", true)
                } else {
                    this.setActive("detail/view/content/state/info/content/league/lost", true)
                }
            } else {
                let self = data.players.filter(p => p.openid === user.userId)
                this.setActive("particle", self[0].rank === 1)
                if (this._curAwardIdx === Constants.ITEM_INDEX.WCOIN) {
                    this.setActive("particle/wcoin", true)
                } else if (this._curAwardIdx === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("particle/lottery", true)
                } else if (this._curAwardIdx === Constants.ITEM_INDEX.DIAMOND) {
                    this.setActive("particle/diamond", true)
                }
                this.setActive("detail/view/content/state/info/content/league/1", self[0].rank === 1)
                this.setActive("detail/view/content/state/info/content/league/2", self[0].rank === 2)
                this.setActive("detail/view/content/state/info/content/league/3", self[0].rank === 3)
                this.setActive("detail/view/content/state/info/content/league/n", self[0].rank > 3)
                this.setLabelValue("detail/view/content/state/info/content/league/n/value", self[0].rank)
            }
        } else {
            if (data.isWin) {
                this.setActive("particle", true)
                if (this._curAwardIdx === Constants.ITEM_INDEX.WCOIN) {
                    this.setActive("particle/wcoin", true)
                } else if (this._curAwardIdx === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("particle/lottery", true)
                } else if (this._curAwardIdx === Constants.ITEM_INDEX.DIAMOND) {
                    this.setActive("particle/diamond", true)
                }
                this.setActive("detail/view/content/state/info/content/league/1", true)
            } else {
                this.setActive("detail/view/content/state/info/content/league/2", true)
            }
        }

        // 显示状态
        this.setActive("detail/view/content/state/info/content/headSpace", true)
        this.setActive("detail/view/content/state/info/content/state", false)
        // let spt = this.getNodeComponent("detail/view/content/state/info/content", cc.Sprite)
        // if (spt) spt.enabled = false

        // 状态提示

        // 功能按钮
        let enought = MatchSvr.checkGateMoney(data.matchId) && data.type !== Constants.MATCH_TYPE.TOURNEY_MATCH
        this.setActive("btns/content/btnNext", enought)
        this.setActive("btns/content/btnBack", true)
    }

    initWaitOpponent(data: IMatchDetail) {
        // 图标       
        if (data.matchState === Constants.MATCH_STATE.ABORT) {
            this.setActive("detail/view/content/state/info/content/league/abort", true)
            // 状态提示
            this.setActive("detail/view/content/state/info/content/headSpace", true)
            this.setActive("detail/view/content/state/info/content/state", false)
        } else {
            this.setActive("detail/view/content/state/info/content/league/wait", true)
            // 状态提示
            this.setLabelValue("detail/view/content/state/info/content/state/matchState", "提交分数成功, 胜利将获得")
            this.setActive("detail/view/content/state/info/content/state/time", false)
        }

        // 显示状态
        this.setActive("detail/view/content/state/info/content/settlement", true)

        // 功能按钮
        if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH && data.totalStage > 1 && data.totalStage > data.curStage) {
            if (data.curStage + 1 === data.totalStage) {
                this.setLabelValue("detail/view/content/state/info/content/state/matchState", "决赛即将开始, 第" + (data.curStage + 2) + "轮即将开始")
            }
            this.setActive("btns/content/btnDetail", true)
        } else {
            let enought = MatchSvr.checkGateMoney(data.matchId) && data.type !== Constants.MATCH_TYPE.TOURNEY_MATCH
            this.setActive("btns/content/btnNext", enought)
            this.setActive("btns/content/btnBack", true)
        }
    }

    initGameOver(data: IMatchDetail) {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        // 图标       
        if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            if (data.matchState !== Constants.MATCH_STATE.COMPLETE) {
                if (data.isWin) {
                    this.setActive("detail/view/content/state/info/content/league/win", true)
                } else {
                    this.setActive("detail/view/content/state/info/content/league/rank", true)
                    this.setLabelValue("detail/view/content/state/info/content/league/rank/value", data.playerNum / Math.pow(2, (data.curStage + 1)))
                }
            } else {
                let self = data.players.filter(p => p.openid === user.userId)
                this.setActive("particle", self[0].rank === 1)
                if (this._curAwardIdx === Constants.ITEM_INDEX.WCOIN) {
                    this.setActive("particle/wcoin", true)
                } else if (this._curAwardIdx === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("particle/lottery", true)
                } else if (this._curAwardIdx === Constants.ITEM_INDEX.DIAMOND) {
                    this.setActive("particle/diamond", true)
                }
                this.setActive("detail/view/content/state/info/content/league/1", self[0].rank === 1)
                this.setActive("detail/view/content/state/info/content/league/2", self[0].rank === 2)
                this.setActive("detail/view/content/state/info/content/league/3", self[0].rank === 3)
                this.setActive("detail/view/content/state/info/content/league/n", self[0].rank > 3)
                this.setLabelValue("detail/view/content/state/info/content/league/n/value", self[0].rank)
            }
        } else {
            if (data.isWin) {
                this.setActive("particle", true)
                if (this._curAwardIdx === Constants.ITEM_INDEX.WCOIN) {
                    this.setActive("particle/wcoin", true)
                } else if (this._curAwardIdx === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("particle/lottery", true)
                } else if (this._curAwardIdx === Constants.ITEM_INDEX.DIAMOND) {
                    this.setActive("particle/diamond", true)
                }
                // this.setParticleSpriteFrame("image/icon/big_zuanshi")
                this.setActive("detail/view/content/state/info/content/league/1", true)
            } else {
                this.setActive("detail/view/content/state/info/content/league/2", true)
            }
        }

        // 显示状态
        this.setActive("detail/view/content/state/info/content/headSpace", true)
        this.setActive("detail/view/content/state/info/content/state", false)
        // let spt = this.getNodeComponent("detail/view/content/state/info/content", cc.Sprite)
        // if (spt) spt.enabled = false

        // // 状态提示        
        this.setActive("detail/view/content/state/info/content/state/time", false)

        // 功能按钮
        if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH && data.totalStage > 1 && data.totalStage > data.curStage) {
            this.setActive("btns/content/btnDetail", true)
        }

        let enought = MatchSvr.checkGateMoney(data.matchId) && data.type !== Constants.MATCH_TYPE.TOURNEY_MATCH && (!this.param.isSettle && user.histroy.allGame !== 0)
        this.setActive("btns/content/btnNext", enought)
        this.setActive("btns/content/btnBack", true)
    }

    initAbort(data: IMatchDetail) {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        // 图标       
        this.setActive("detail/view/content/state/info/content/league/abort", true)

        // 显示状态
        this.setActive("detail/view/content/state/info/content/state", true)
        this.setLabelValue("detail/view/content/state/info/content/state/matchState", "比赛已终止, 报名费已返回")
        this.setActive("detail/view/content/state/info/content/state/time", false)

        this.setActive("detail/view/content/state/info/content/settlement", true)
        this.setActive("detail/view/content/state/info/content/settlement/bg/award", true)
        this.setItems("detail/view/content/state/info/content/settlement/bg/award/left", data.gateMoney)
        this.setActive("detail/view/content/state/info/content/settlement/bg/award/common-fengexian", false)
        this.setActive("detail/view/content/state/info/content/settlement/bg/award/right", false)
        this.removeNodeComponent("detail/view/content/state/info/content/settlement/bg/award/left", cc.Widget)
        this.setNodePositionX("detail/view/content/state/info/content/settlement/bg/award/left", 0)

        this.setActive("btns/content/btnBack", true)
    }

    onPressBack() {
        this.close()
    }

    onPressDetail() {
        let data: IMatchDetail = this.param.result
        if (!data) {
            return
        }

        if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            UIMgr.OpenUI("component/Match/ActivityMatchList", { param: { data: data }, closeCb: () => this.close() })
        } else if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            if (data.totalStage > 1 && data.rounds) {
                MatchSvr.GetMatch(data.matchId, data.matchUuid, undefined, (detail) => {
                    Helper.OpenPageUI("component/Match/MatchTreeEntry", data.name, "", { data: detail })//, () => this.close())
                })
            } else if (data.totalStage > 1) {
                UIMgr.OpenUI("component/Match/MatchTreeEntry", { /*closeCb: () => { this.close() },*/ parent: this.node.parent, param: { data: data } }, () => {
                    this.node.active = false
                })
            }
        }
    }

    onPressNext() {
        let data: IMatchDetail = this.param.result
        if (!data) {
            return
        }

        MatchSvr.JoinMatch(data.matchId, undefined, () => !this.param.isSettle && this.close())
    }

    onPressStart() {
        let match: IMatchInfo = this.param.match
        if (match) {
            if (match.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
                if (!DataMgr.getData<boolean>("tourneyMatchTip")) {
                    let param = {
                        buttons: 1,
                        cancelName: "我知道了",
                        closeCb: () => {
                            MatchSvr.JoinMatch(match.matchId, undefined, () => this.close())
                        }
                    }
                    Helper.OpenPopUI("component/Match/TourneyMatchTip", "提示", param)
                } else {
                    MatchSvr.JoinMatch(match.matchId, undefined, () => this.close())
                }
                return
            } else if (match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                // MatchSvr.EnterMatch(match.matchId, null, (res) => res && MatchSvr.StartGame())
                MatchSvr.JoinMatch(match.matchId, undefined, () => this.close())
            }
        }

        let data: IMatchDetail = this.param.result
        if (data) {
            MatchSvr.EnterMatch(data.matchId, data.matchUuid, () => { MatchSvr.StartGame(); this.close() })
            return
        }
    }

    onPressCopy() {
        let data: IMatchDetail = this.param.result
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        let msg = "openid：" + user.userId + "\n"
        msg += "match_id：" + data.matchUuid

        Helper.copyToClipBoard(msg)
    }

    initHuafei() {
        if (this.param.match || this.param.result.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            return
        }

        let updateLottery = () => {
            let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
            let progress = Math.min(user.items[Constants.ITEM_INDEX.LOTTERY].num / 100000, 1)
            this.setProgressValue("guide/progress", progress)
            this.setLabelValue("guide/progress/value", (progress * 100).toFixed(2) + "%")

            if (user.items[Constants.ITEM_INDEX.LOTTERY].num >= 100000) {
                this.setActive("guide/btnHuafei", true)
                this.setSpineAni("guide/huafei", "huafei", true)
            } else {
                this.setActive("guide/btnHuafei", false)
                this.setSpineAni("guide/huafei", "tingzhi", true)
            }
        }

        DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, updateLottery, this)
        updateLottery()

        this.setActive("guide", !this.param.match && this.param.result.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH)

        // this.setProgressValue("detail/view/content/huafei/progress", Math.min(lottery / 100000, 1))
        // this.setLabelValue("detail/view/content/huafei/progress/value", (Math.min(lottery / 100000, 1) * 100).toFixed(2) + "%")

        // this.setLabelValue("detail/view/content/huafei/curLottery", "当前奖券:" + lottery)
    }

    initGamesTask() {
        let tween = cc.tween()
            .set({ opacity: 255 })
            .delay(5)
            .to(2, { opacity: 0 })
        this.runTween("btnGames/helpPop", tween)
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        // this.setButtonInfo("btnGames", { interactable: false })
        this.setActive("btnGames", false)
        TaskSrv.GetNextTask(user.userLife <= 4 ? "1005" : "1006")
    }

    updateGamesTask(res) {
        if (this.param.match) {
            return
        }

        cc.log(res)
        if (res && res.data) {
            res.data.max = res.max
            res.data.cur = res.cur || 0
            let max = Number(res.data.max_progress) || 0
            let cur = Number(res.data.progress) || 0
            res.data.finish = max === cur
            this.setProgressValue("btnGames/progress", cur / max)
            this.setLabelValue("btnGames/progress/value", cur + "/" + max)

            let btn = this.getNodeComponent("btnGames", cc.Button)
            btn.clickEvents = []
            if (res.data.finish) {
                // this.setButtonInfo("btnGames", { interactable: true })
                this.setButtonClick("btnGames", this.onPressGamesTask.bind(this, res.data))
            } else {
                // this.setButtonInfo("btnGames", { interactable: false })
                this.setButtonClick("btnGames", this.onPressGamesTask.bind(this, null))
            }

            this.setActive("btnGames", !(DataMgr.OnlineParam.full_round_dialog_box === 0))

        }

        this.checkActivityPop(res ? res.data : null)
    }

    onPressHuafei() {
        UIMgr.OpenUI("component/Activity/HuafeiPop")
        // let user = DataMgr.getData<Constants.IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        // let lottery = user.items[Constants.ITEM_INDEX.LOTTERY].num
        // if (lottery >= 200000) {
        //     // Helper.OpenPageUI("component/Exchange/ExchangeGoods", "兑换话费", null, { exchangeType: Constants.EXCHANGE_GOODS_TYPE.PHONE })
        // } else {
        //     // Helper.OpenTip("奖券不足, 满20万可兑换")
        // }
    }

    onPressGamesTask(res) {
        if (!res) {
            this.stopTween("btnGames/helpPop")
            let tween = cc.tween()
                .set({ opacity: 255 })
                .delay(5)
                .to(2, { opacity: 0 })
            this.runTween("btnGames/helpPop", tween)
        } else {
            UIMgr.OpenUI("component/Activity/LuckyRedPacket", { param: res })
        }
    }

    checkActivityPop(gamesTask: any) {
        if (this._checkActivityPop) {
            return
        }
        if (!this.param.result) {
            return
        }
        this._checkActivityPop = true
        //结算广告点
        if (this.param.showLuckyRedPacket) {
            let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
            if (user.histroy.allGame >= 3) {
                let data = this.param.result
                if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_AWARD
                    || data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) {
                    if (data.gateMoney && data.gateMoney[0]) {
                        let rnum = Math.random()
                        let activity_id = 0
                        let match_id = null
                        let task_id = 0

                        if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) {
                            if (data.gateMoney[0].id == Constants.ITEM_INDEX.WCOIN) { //G币场 结算广告点-获取更多G币
                                if (rnum >= 0.4) { // 60%的概率触发
                                    activity_id = 1004 // 更多报名费
                                }
                            }
                        } else if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_AWARD) {
                            if (data.gateMoney[0].id === Constants.ITEM_INDEX.WCOIN) {
                                if (data.isWin && rnum > .4) {
                                    activity_id = 1008 // 赢分加倍
                                    match_id = data.matchUuid
                                } else if (!data.isWin) {
                                    activity_id = 1007 // 返回报名费
                                    match_id = data.matchUuid
                                }
                            }
                        }

                        if (activity_id === 0 && gamesTask && gamesTask.finish && DataMgr.OnlineParam.round_award_tips === 1) { // 5局判断
                            task_id = user.userLife <= 4 ? 1005 : 1006 // 5局奖励
                        } else if (activity_id === 0) {
                            // if (data.gateMoney[0].id === Constants.ITEM_INDEX.DIAMOND) {//钻石场 结算广告点-获取更多奖券
                            if (rnum >= 0.2) {// 80%触发
                                activity_id = 1003 // 幸运奖励
                            }
                            // }                                 
                        }

                        if (activity_id > 0) {
                            ActivitySrv.GetActivityConfig(activity_id, match_id, (res: any) => {
                                console.log("GetActivityConfig", res)
                                if (res) {
                                    if (res.day_times && res.receive_num && res.receive_num >= res.day_times) {
                                    } else {
                                        UIMgr.OpenUI("component/Activity/LuckyRedPacket", {
                                            param: res, closeCb: () => {
                                                if (gamesTask && gamesTask.finish) { // 5局判断
                                                    // task_id = user.userLife <= 4 ? 1005 : 1006 // 5局奖励
                                                    Helper.DelayFun(() => {
                                                        // 弹出5局奖励
                                                        UIMgr.OpenUI("component/Activity/LuckyRedPacket", { param: gamesTask })
                                                    }, 0.5)
                                                }
                                            }
                                        })
                                        return
                                    }

                                    if (gamesTask && gamesTask.finish) { // 5局判断
                                        UIMgr.OpenUI("component/Activity/LuckyRedPacket", { param: gamesTask })
                                    }
                                }
                            })
                        } else if (task_id > 0) {
                            UIMgr.OpenUI("component/Activity/LuckyRedPacket", { param: gamesTask })
                        }
                    }
                }
            }
        }
    }

    setParticleSpriteFrame(img_path: string) {
        let bundle = DataMgr.Bundle
        if (bundle) {
            bundle.load(img_path, cc.SpriteFrame, (err, res: cc.SpriteFrame) => {
                if (err) {
                    cc.warn("BaseUI.setSpriteFrame sprite " + img_path + " err: " + err)
                    return
                }
                let particle = cc.find("particle", this.node)
                particle.getComponent(cc.ParticleSystem).spriteFrame = res
            })
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

    checkGuide() {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        let data: IMatchDetail = this.param.result
        if (user.histroy.platGame === 1) {
            Helper.reportEvent("大厅引导1", "第一局结束", "[LYM]")
            this.setActive("btns/content/btnNext", false)
            this.setActive("btns/content/btnBack", false)
            this.setActive("btns/content/btnMore", true)
            this.setLabelValue("btns/content/btnMore/name", "赢取更多奖券")
            // this.setLabelValue("guide/tishikuang/msg", "我们为你准备了第一份奖品，\n继续游戏赢取更多的奖券吧！")
            // this.setLabelValue("guide/tishikuang/msg", "累积10万奖券即可兑换10元\n话费！")
            this.setActive("guide", false)
            // this.setActive("guide/btnHuafei", true)
            // UIMgr.OpenUI("component/Activity/HuafeiPop")            
            let awards = MatchSvr.GetAwards(data.matchId, 1)
            let nodes = [
                this.getNode("detail/view/content/state/info/content/settlement"),
                this.getNode("detail/view/content/MatchPlayerList")
            ]
            UIMgr.OpenUI("component/Base/GameGuidance", {
                single: true, param: { index: 6, nodes: nodes, awards: awards },
                closeCb: () => this.setActive("guide", true)
            })
            Helper.reportEvent("大厅引导2", "20元话费", "[LYM]")
        } else if (user.histroy.platGame === 2) {
            Helper.reportEvent("大厅引导2", "第二局结束", "[LYM]")
            if (data.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                this.setActive("btns/content/btnNext", false)
                this.setActive("btns/content/btnBack", false)
                this.setActive("btns/content/btnMore", true)
            }
            // this.setLabelValue("btns/content/btnBack/name", "赢取更多奖券")
            // this.setActive("guide", true)
            // this.setActive("guide/tishikuang", true)
            // this.setLabelValue("guide/tishikuang/msg", "累积10万奖券即可兑换10元\n话费！")
            // this.setActive("guide/btnHuafei", true)

            let showButtonTip = () => {
                this.setActive("tip", true)
                let btn = this.getNode("btns/content/btnBack")
                let pos = this.node.convertToNodeSpaceAR(btn.parent.convertToWorldSpaceAR(btn.position))
                this.setNodePositionY("tip", pos.y)//- btn.height / 2 + 10)
            }

            Helper.reportEvent("大厅引导2", "第二局结束", "请求新手奖励活动配置")
            ActivitySrv.GetActivityConfig(1002, (res) => {
                console.log("ActivitySrv.GetActivityById(1002)", res)
                if (res) {
                    UIMgr.OpenUI("component/Base/GameGuidance", {
                        single: true,
                        param: { index: 3, activityInfo: res },
                        closeCb: () => {
                            let info = ActivitySrv.GetActivityById(8)
                            if (!info) {
                                return
                            }

                            Helper.reportEvent("大厅引导2", "第二局结束", "请求签到")
                            SignSrv.GetConfig((config) => {
                                if (config) {
                                    UIMgr.OpenUI("component/Activity/Sign",
                                        {
                                            param: { signConfig: config, activityConfig: info },
                                            closeCb: showButtonTip,
                                            index: 20
                                        })
                                }
                                Helper.reportEvent("第二局结束", "[LYM]", "")
                            })
                        }
                    })
                }
            })
        } else {
            // this.setActive("guide", true)
            // this.setActive("guide/tishikuang", true)
            // this.setActive("guide/btnHuafei", true)
            // this.setLabelValue("guide/tishikuang/msg", "累积10万奖券即可兑换10元\n话费！")
            let data: IMatchDetail = this.param.result
            let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
            if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) {
                if (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SETTLE) {
                    for (let i in data.players) {
                        let p = data.players[i]
                        if (p.openid !== user.openId) {
                            if (undefined === p.openid) {
                                if (record[5] !== 1) {
                                    // 等待对手
                                    UIMgr.OpenUI("component/Base/GameGuidance", { single: true, param: { index: 5, node: this.getNode("detail/view/content/MatchPlayerList") } })
                                    return
                                }
                            } else {
                                if (p.state === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING || p.state === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_GAMING) {
                                    if (record[4] !== 1) {
                                        // 等待进入比赛
                                        UIMgr.OpenUI("component/Base/GameGuidance", { single: true, param: { index: 4, node: this.getNode("detail/view/content/MatchPlayerList") } })
                                        return
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
    }
}