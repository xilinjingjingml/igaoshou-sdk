import BaseUI from "../../script/base/BaseUI";
import { DataMgr } from "../../script/base/DataMgr";
import { Helper } from "../../script/system/Helper";
import { PluginMgr } from "../../script/base/PluginMgr";
import { User } from "../../script/data/User";
import { Constants } from "../../script/igsConstants";
import { QualifyingSrv } from "../../script/system/QualifyingSrv";
import { EventMgr } from "../../script/base/EventMgr";
import { WxProxyWrapper } from "../../script/pulgin/WxProxyWrapper";
import { PlatformApi } from "../../script/api/platformApi";
import { MatchSvr } from "../../script/system/MatchSvr";
import { UserSrv } from "../../script/system/UserSrv";
import { UIMgr } from "../../script/base/UIMgr";
import { ExchangeSrv } from "../../script/system/ExchangeSrv";
import { AdSrv } from "../../script/system/AdSrv";
import { ActivitySrv } from "../../script/system/ActivitySrv";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchDetail extends BaseUI {

    _curAwardIdx: number = -1
    _checkActivityPop: boolean = false

    _init: boolean = false

    _curSeasonData: any = null

    _bShowBanner: boolean = false

    onLoad() {
        this.node.opacity = 0

        // if (cc.director.getScene().name === "result")
        if (this.node.name === "node") {
            this.onOpen()
        }
    }

    onOpen() {
        if (!this.node || !this.node.isValid) {
            return
        }

        this.initEvent()
        this.initData()
        this.scheduleOnce(() => this.node.opacity = 255, .1)

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.initWxSync()
        }

        if ((DataMgr.data.Config.platId == 3)
            || (!Helper.isNative() && (cc.sys.OPPO_GAME == cc.sys.platform || cc.sys.VIVO_GAME == cc.sys.platform))
            || (cc.sys.BYTEDANCE_GAME === cc.sys.platform)
            || PluginMgr.isH52345Game()) {
            this.setActive("main/view/content/MatchDetail/btnShare", false)
        }

        if (User.PlayGame === 1 || this.param.games === -1) {
            this.asyncCheckGuide()
        } else {
            this.setActive("main/view/content/MatchDetail/guide/huafei/btnHuafei", true)
            let data = this.param.match || this.param.result
            if (data && data.type === Constants.MATCH_TYPE.PRACTICE_MATCH) {
                if (this.param?.match?.roundPlayer > 2 || this.param?.result?.playerNum > 2) {
                    return
                }
                QualifyingSrv.GetCurSeason((res) => {
                    res.before = res.grade
                    res.after = res.grade
                    let curSeason: any = DataMgr.getData(Constants.DATA_DEFINE.QUALIFYING_CUR_SEASON)
                    if (curSeason) {
                        res.before = curSeason.grade
                    }

                    this.asyncCheckGuide(res)
                }, () => {
                    this.asyncCheckGuide()
                })
            } else {
                this.asyncCheckGuide()
            }
        }
    }

    onClose() {
        WxProxyWrapper.hideUserInfoButton("btnNext")
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BANNER)
    }

    onDestroy() {
        WxProxyWrapper.hideUserInfoButton("btnNext")
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BANNER)
    }

    initEvent() {
        if (!this._init) {
            this.setButtonClick("top/btnBack", this.onPressBack.bind(this))
            this.setButtonClick("main/view/content/MatchDetail/btns/content/btnBack", this.onPressBack.bind(this))
            this.setButtonClick("main/view/content/MatchDetail/btns/content/btnDetail", this.onPressDetail.bind(this))
            this.setButtonClick("main/view/content/MatchDetail/btns/content/btnNext", this.onPressNext.bind(this), 3)
            this.setButtonClick("main/view/content/MatchDetail/btns/content/btnStart", this.onPressStart.bind(this))
            this.setButtonClick("main/view/content/MatchDetail/btns/content/btnMore", this.onPressBack.bind(this))

            this.setButtonClick("main/view/content/MatchDetail/btm/btns/btnStart", this.onPressStart.bind(this))
            this.setButtonClick("main/view/content/MatchDetail/btm/info/btnCopy", this.onPressCopy.bind(this))

            this.setButtonClick("main/view/content/MatchDetail/guide/bg/btnHuafei", this.onPressHuafei.bind(this))
            this.setButtonClick("main/view/content/MatchDetail/guide/huafei/btnHuafei", this.onPressHuafei.bind(this))

            EventMgr.on(Constants.EVENT_DEFINE.SHOW_GAME_GUIDANCE, this.showGameGuidance, this)
            EventMgr.on(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, this.onClickTab, this)
            EventMgr.on(Constants.EVENT_DEFINE.WX_SYNC_CALLBACK, this.onPressNext, this)
            this.setButtonClick("main/view/content/MatchDetail/btnShare", () => {
                console.log("==btnShare click")
                Helper.shareInfo()
            })

            EventMgr.on(Constants.EVENT_DEFINE.CHECK_GRADE_UPGRADE, this.checkHonorTime, this)

            this._init = true

            // cc.Canvas.instance.node.on(cc.Node.EventType.CHILD_ADDED, this.onChildChange.bind(this))
            // cc.Canvas.instance.node.on(cc.Node.EventType.CHILD_REMOVED, this.onChildChange.bind(this))

            let self = this
            let updateBannerHeight = () => {
                let height = (DataMgr.getData<number>(Constants.DATA_DEFINE.BANNER_HEIGHT) || 0)
                height = self.node.height - 90 - (height / cc.view.getFrameSize().height * self.node.height)

                this.setNodeHeight("main/view/content", height)
                this.setNodeHeight("main/view/content/MatchDetail", height)


            }

            EventMgr.on("PluginAdsCallBack", (msg) => {
            }, this)

            EventMgr.on(Constants.EVENT_DEFINE.BANNER_HEIGHT, (msg) => {
                updateBannerHeight()
            }, this)
        }
    }

    onClickTab(msg) {
        if (msg.name == "match" || msg.name == "league" || msg.name === "wait") {
            if (this.node.name === "node") {
                this.param.bResult && PlatformApi.GotoLobby(msg.name)
            } else {
                this.close()
            }
        }
    }

    initData() {
        // 隐藏信息节点
        this.setActive("main/view/content/MatchDetail/detail/view/content/round", false)
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement", false)
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/award", false)
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/growth", false)
        this.setActive("main/view/content/MatchDetail/detail/view/content/1v1", false)
        this.setActive("main/view/content/MatchDetail/detail/view/content/multiplayer", false)
        this.setActive("main/view/content/MatchDetail/detail/view/content/scoreRecord", false)
        // this.setActive("main/view/content/MatchDetail/guide", false)
        this.setActive("main/view/content/MatchDetail/btm/btns/btnStart", false)
        this.getNode("main/view/content/MatchDetail/detail/view/content/state/info/content/league").children.forEach(i => i.active = false)
        this.getNode("main/view/content/MatchDetail/btns/content").children.forEach(i => i.active = false)

        this.setActive("main/view/content/MatchDetail/btnGames", false)

        // if (this.param.submit) {
        //     this.initSubmit()
        // } else 
        if (this.param.match) {
            this.initMatchs()
        } else if (this.param.result) {
            this.initResults()
        } else {
            let round = DataMgr.getData<IMatchRound>(Constants.DATA_DEFINE.MATCH_RESULT)
            if (round) {
                this.param = {
                    submit: round,
                    showLuckyRedPacket: true,
                    isSettle: false,
                    bResult: true,
                }
                this.initSubmit()

                DataMgr.setData(Constants.DATA_DEFINE.MATCH_RESULT, null)
            } else {
                PlatformApi.GotoLobby()
            }
        }

        let data = this.param.match || this.param.result
        if (data) {
            let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
            if (matchs) {
                let matchData = matchs[data.matchId]
                if (matchData && matchData.freeAd) {
                    if (Helper.isOpenShare() && matchData.type === Constants.MATCH_TYPE.ACTIVITY_MATCH && (!matchData.curTimes || matchData.curTimes == 0)) {
                        this.setActive("main/view/content/MatchDetail/btns/content/btnStart/share", true)
                        this.setActive("main/view/content/MatchDetail/btns/content/btnNext/share", true)
                    } else {
                        this.setActive("main/view/content/MatchDetail/btns/content/btnStart/bofang", true)
                        this.setActive("main/view/content/MatchDetail/btns/content/btnNext/bofang", true)
                    }
                    if (cc.sys.BYTEDANCE_GAME === cc.sys.platform) {
                        this.setActive("main/view/content/MatchDetail/btns/content/btnBack", true)
                        this.setOpacity("main/view/content/MatchDetail/btns/content/btnNext/shou1", 0)
                    }
                }
            }
        }

        // this.node.getComponentsInChildren(cc.Layout).forEach(i => i.updateLayout())

        this.initHuafei()
    }

    initWxSync() {
        if (User.AllGame < 6 || this.param.match) {
            return
        }
        let btn = this.getNode("main/view/content/MatchDetail/btns/content/btnNext")
        let self = this
        Helper.createWxUserInfo(btn, btn.name, (sync) => {
            if (!sync) {
                console.log("===wx user info not sync")
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.WX_SYNC_CALLBACK)
                // self.onPressNext()
            } else {
                EventMgr.once(Constants.EVENT_DEFINE.LOGIN_SUCCESS, () => {
                    console.log("===wx user info sync")
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.WX_SYNC_CALLBACK)
                    // self.onPressNext()
                })
                EventMgr.once(Constants.EVENT_DEFINE.LOGIN_FAILED, () => {
                    console.log("===wx user info sync failed")
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.WX_SYNC_CALLBACK)
                    // self.onPressNext()
                })
            }
            WxProxyWrapper.hideUserInfoButton(btn.name)
        }, (create) => {
            if (!this.node || !this.isValid || !btn.active) {
                WxProxyWrapper.hideUserInfoButton(btn.name)
            }
        })
    }

    initSubmit() {
        let submit = this.param.submit

        let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        let match = MatchSvr.isSingleMatch(submit.matchCid) ? MatchSvr.getSingleMatch() : (matchs && matchs[submit.matchCid])
        if (!match) {
            return
        }

        let players: IMatchPlayer[] = []
        players.push({
            openid: User.OpenID,
            avatar: User.Avatar,
            userName: User.UserName,
            region: User.Region,
            score: submit.score,
            state: Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SUBMIT,
        })

        if (Array.isArray(submit.opponent)) {
            for (let i = 0; i < match.roundPlayer; i++) {
                let op = submit.opponent[i]
                if (op) {
                    if (op.openid !== User.OpenID) {
                        players.push({
                            openid: op.openid,
                            avatar: op.headimage,
                            userName: op.nickname,
                            region: op.area_info,
                            score: 0,
                            state: Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING,
                        })
                    }
                } else {
                    players.push({
                        openid: undefined,
                        avatar: "",
                        userName: "",
                        region: "",
                        score: 0,
                        state: Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING,
                    })
                }
            }
        } else if (typeof submit.opponent === "string") {
            UserSrv.GetPlyDetail(typeof submit.opponent, (ply: IPlayerBase) => {
                players.push({
                    openid: ply.openId,
                    avatar: ply.avatar,
                    userName: ply.userName,
                    region: ply.region,
                    score: 0,
                    state: Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING,
                })
            })
        } else {
            players.push({
                openid: submit.opponent ? submit.opponent.openId : undefined,
                avatar: submit.opponent ? submit.opponent.avatar : "",
                userName: submit.opponent ? submit.opponent.userName : "",
                region: submit.opponent ? submit.opponent.region : "",
                score: 0,
                state: Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING,
            })
        }

        let data: IMatchDetail = {
            name: match.name,
            type: match.type,
            playerNum: match.maxPlayer,
            matchId: submit.matchCid,
            gateMoney: match.gateMoney,
            createTime: 0,
            matchUuid: submit.matchId,
            curStage: match.curTimes,
            stages: [],
            playerState: 0,
            battleState: 0,
            expireTime: match.endTime,
            score: submit.score,
            players: players
        }

        let self = this
        let upResult = (res) => {
            self.setActive("lock", false)
            let games = User.AllGame
            if (MatchSvr.isSingleMatch(data.matchId)) {
                if (res) {
                    MatchSvr.GetMatch(data.matchId, res, null, (res) => {
                        if (!res) {
                            return
                        }
                        self.param = self.param || {}
                        self.param.submit = null
                        self.param.result = res
                        self.param.isSettle = true
                        self.param.games = games
                        self.onOpen()
                    })
                } else {
                    this.scheduleOnce(() => {
                        data.playerState = Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMEOVER
                        for (let i in data.players) {
                            if (data.players[i].openid === User.OpenID) {
                                data.players[i].rank = 1
                            } else {
                                data.players[i].score = Math.max(0, submit.score - Math.floor(Math.random() * 100 % 5) - 2)
                                data.players[i].state = Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SUBMIT
                                data.players[i].rank = 2
                            }
                        }

                        data.isWin = true
                        data.createTime = Math.floor(Date.now() / 1000)

                        self.param = self.param || {}
                        self.param.submit = null
                        self.param.result = data
                        self.param.isSettle = true
                        self.param.games = -1
                        self.onOpen()
                    }, .0)
                }
            } else if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                MatchSvr.GetActivityMatch(data.matchUuid, (res) => {
                    if (!res) {
                        return
                    }
                    self.param = self.param || {}
                    self.param.submit = null
                    self.param.result = res
                    self.param.isSettle = true
                    self.param.games = games
                    self.onOpen()
                })
            } else {
                MatchSvr.GetMatch(data.matchId, data.matchUuid, submit.roundId, (res) => {
                    if (!res) {
                        return
                    }
                    self.param = self.param || {}
                    self.param.submit = null
                    self.param.result = res
                    self.param.isSettle = true
                    self.param.games = games
                    self.onOpen()
                })
            }
        }

        this.setLabelValue("top/title", match.name)

        this.setActive("main/view/content/MatchDetail/btnShare", false)

        // 图标        
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/wait", true)

        this.initPlayer(data)

        this.initBottom(data)

        // 状态提示
        this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/state/matchState", "正在提交分数")

        // 显示状态
        if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.initCounttime(data)
            this.setLabelValue("main/view/content/MatchDetail/btns/content/btnNext/num", "剩余" + (match.maxTimes - match.curTimes) + "次")
        } else {
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement", data.playerNum <= 2)
        }

        // 功能按钮
        this.setActive("main/view/content/MatchDetail/btns/content/btnNext", true)
        this.setActive("main/view/content/MatchDetail/btns/content/btnBack", false)

        this.runTween("main/view/content/MatchDetail/lock/loading", cc.tween().repeatForever(cc.tween().to(1.5, { angle: -180 }).to(1.5, { angle: -360 }).set({ angle: 0 })))

        // MatchSvr.SubmitScore(submit.matchId, 0, submit.score, () => {
        let submitState = MatchSvr.GetSubmitState()
        if (!submitState.finish) {
            upResult(submitState.matchId)
        } else {
            this.setActive("lock", true)
            EventMgr.once(Constants.EVENT_DEFINE.MATCH_SUBMIT_FINISH, (res) => {
                upResult(res?.matchId)
            }, this)
        }

        if (match && match.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH && !this._bShowBanner) {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_BANNER)
            this._bShowBanner = true
        }
    }

    initMatchs() {
        let match: IMatchInfo = this.param.match
        if (!match) {
            return
        }

        // 轮数显示
        this.setLabelValue("top/title", match.name)
        this.setActive("main/view/content/MatchDetail/detail/view/content/round", match.type === Constants.MATCH_TYPE.TOURNEY_MATCH)
        if (match.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            this.setLabelValue("main/view/content/MatchDetail/detail/view/content/round", "第1轮")
        }

        this.setActive("main/view/content/MatchDetail/btnShare", false)

        // 图标        
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/cup", true)

        this.initList(match)

        this.setNodeHeight("main/view/content/MatchDetail/detail", this.node.height - 110)

        let data: IMatchDetail = this.param.result
        if (data) {
            this.setActive("main/view/content/MatchDetail/btns/content/btnDetail", true)
            this.setActive("main/view/content/MatchDetail/btns/content/btnBack", true)
            this.initBottom(data)
        } else if (match) {
            // this.setActive("main/view/content/MatchDetail/btm/btns", true)
            // this.setActive("main/view/content/MatchDetail/btm/btns/btnStart", true)
            this.setActive("main/view/content/MatchDetail/btm", false)
            if (match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                this.setActive("main/view/content/MatchDetail/btns/content/btnStart", match.maxTimes > match.curTimes)
                let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
                if (record[32] !== 1) {
                    this.setActive("main/view/content/MatchDetail/btns/content/btnStart/shou1", true)
                    record[32] = 1
                    DataMgr.setData(Constants.DATA_DEFINE.NEWBIE_LIST, record, true)
                }
            } else {
                this.setActive("main/view/content/MatchDetail/btns/content/btnStart", true)
            }

            this.setLabelValue("main/view/content/MatchDetail/btns/content/btnStart/name", "开始比赛")
        }
    }

    initList(match: IMatchInfo) {
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/state", false)
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list", true)

        if (match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH || match.roundPlayer > 2) {
            this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/list/matchName/value", "")
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/matchName/awards", true)
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
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/matchName/awards/gold", false)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/matchName/awards/lottery", false)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/matchName/awards/credits", false)
            for (let i in awards) {
                if (awards[i].id === Constants.ITEM_INDEX.GOLD) {
                    this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/matchName/awards/gold", true)
                    this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/list/matchName/awards/gold/num", Helper.FormatNumWYCN(awards[i].num))
                    idx++
                } else if (awards[i].id === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/matchName/awards/lottery", true)
                    this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/list/matchName/awards/lottery/num", Helper.FormatNumWYCN(awards[i].num))
                    this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/matchName/awards/lottery/add", idx > 0)
                    idx++
                } else if (awards[i].id === Constants.ITEM_INDEX.CREDITS) {
                    this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/matchName/awards/credits", true)
                    this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/list/matchName/awards/credits/num", Helper.FormatNumWYCN(awards[i].num))
                    this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/matchName/awards/credits/add", idx > 0)
                    idx++
                }
            }
        } else {
            this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/list/matchName/value", match.name)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/matchName/awards", false)
        }

        let mode = this.getNode("main/view/content/MatchDetail/detail/view/content/state/info/content/list/scrollView/view/itemNode")
        mode.active = false

        let content = this.getNode("main/view/content/MatchDetail/detail/view/content/state/info/content/list/scrollView/view/content")
        let rank = 1

        let self = this
        let setRank = function (rank, start) {
            let awards = MatchSvr.GetAwards(match.matchId, rank)
            awards = awards.filter(i => i.id < Constants.ITEM_INDEX.Exp)
            if (awards.length <= 0) {
                return
            }
            let item = cc.instantiate(mode)
            item.parent = content
            item.active = true
            if (null !== start) {
                self.setLabelValue("rank/rankName", item, start !== rank ? "第" + start + "-" + rank + "名" : "第" + rank + "名")
            } else {
                self.setLabelValue("rank/rankName", item, rank === 1 ? "冠军" : rank === 2 ? "亚军" : rank === 3 ? "季军" : "前" + rank + "名")
            }
            self.setActive("awards/gold", item, false)
            self.setActive("awards/lottery", item, false)
            self.setActive("awards/credits", item, false)
            self.setActive("awards/null", item, false)
            let idx = 0
            for (let i in awards) {
                if (awards[i].id === Constants.ITEM_INDEX.GOLD) {
                    self.setActive("awards/gold", item, true)
                    self.setLabelValue("awards/gold/num", item, Helper.FormatNumWYCN(awards[i].num))
                    idx++
                } else if (awards[i].id === Constants.ITEM_INDEX.LOTTERY) {
                    self.setActive("awards/lottery", item, true)
                    self.setLabelValue("awards/lottery/num", item, Helper.FormatNumWYCN(awards[i].num))
                    self.setActive("awards/lottery/add", item, idx > 0)
                    idx++
                } else if (awards[i].id === Constants.ITEM_INDEX.CREDITS) {
                    self.setActive("awards/credits", item, true)
                    self.setLabelValue("awards/credits/num", item, Helper.FormatNumWYCN(awards[i].num))
                    self.setActive("awards/credits/add", item, idx > 0)
                    idx++
                }
            }
            self.setActive("awards/null", item, idx === 0)
            // self.setActive("bg", item, content.childrenCount % 2 === 0)
        }

        if (match.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            while (rank < match.maxPlayer) {
                setRank(rank, null)
                rank *= 2
            }

            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/tip", true)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/tip2", false)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/value0", false)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/value1", true)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/value2", false)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/time", false)
        } else if (match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            for (let l in match.awards) {
                setRank(match.awards[l].end, match.awards[l].start)
            }

            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/tip", true)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/tip2", false)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/value0", true)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/value1", false)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/value2", false)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/time", true)

            this.setNodeComponentEnabled("main/view/content/MatchDetail/detail/view/content/state/info/content", cc.Sprite, true)

            if (match.gateMoney[0].num > 0) {
                this.setActive("main/view/content/MatchDetail/btns/content/btnStart/gateMoney", true)
                if (match.gateMoney[0].id === Constants.ITEM_INDEX.GOLD) {
                    this.setActive("main/view/content/MatchDetail/btns/content/btnStart/gateMoney/lottery", false)
                } else if (match.gateMoney[0].id === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("main/view/content/MatchDetail/btns/content/btnStart/gateMoney/gold", false)
                }
                this.setLabelValue("main/view/content/MatchDetail/btns/content/btnStart/gateMoney/num", match.gateMoney[0].num)
            }
        } else if (match.roundPlayer > 2) {
            for (let l in match.awards) {
                setRank(match.awards[l].end, match.awards[l].start)
            }

            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/tip", false)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/tip2", true)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/value0", false)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/value1", false)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/value2", true)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/time", false)

            this.setNodeComponentEnabled("main/view/content/MatchDetail/detail/view/content/state/info/content", cc.Sprite, true)

            if (match.gateMoney[0].num > 0) {
                this.setActive("main/view/content/MatchDetail/btns/content/btnStart/gateMoney", true)
                if (match.gateMoney[0].id === Constants.ITEM_INDEX.GOLD) {
                    this.setActive("main/view/content/MatchDetail/btns/content/btnStart/gateMoney/lottery", false)
                } else if (match.gateMoney[0].id === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("main/view/content/MatchDetail/btns/content/btnStart/gateMoney/gold", false)
                }
                this.setLabelValue("main/view/content/MatchDetail/btns/content/btnStart/gateMoney/num", match.gateMoney[0].num)
            }
        }

        let num = content.childrenCount
        if (num > 5) {
            num = 5.5
        }

        let height = num * mode.height + num * 5 + 95 + 190
        height = Math.min(height, cc.winSize.height * .60 - 300)

        this.setNodeHeight("main/view/content/MatchDetail/detail/view/content/state/info/content/list/scrollView", height - 95 - 190)
        this.setNodeHeight("main/view/content/MatchDetail/detail/view/content/state/info/content/list", height - 190)

        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/value0", false)
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/value1", false)
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/times", false)

        if (match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/value0", true)
            this.setRichTextValue("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/value0", "可参与<color=#ff784e><size=32><bold=true> " + match.maxTimes + " </b></c>次，按照您的最高得分进行排名，比赛\n倒计时结束后提交的分数无效")
            let now = Date.now() / 1000
            if (match.endTime > now) {
                let time = Math.ceil(match.endTime - Date.now() / 1000)
                let label = this.getNodeComponent("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/times", cc.Label)
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
                this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/times", "比赛已结束")
            }
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/times", true)
        } else if (match.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/value1", true)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list/tip/times", true)
        }
    }

    initResults() {
        let data: IMatchDetail = this.param.result
        if (!data) {
            return
        }

        this.setActive("main/view/content/MatchDetail/btnShare", data.playerNum <= 2)


        this.setLabelValue("top/title", data.name)
        // 轮数显示
        // this.setLabelValue("main/view/content/MatchDetail/detail/view/content/value", data.matchName)
        this.setLabelValue("main/view/content/MatchDetail/detail/view/content/round", data.totalStage > 1 ? "第" + (data.curStage + 1) + "轮" : "")

        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/state", true)
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/list", false)


        // if (data.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH) {
        this.initPlayer(data)
        // }

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

            this.updateMatchState()

        } else if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_AWARD) {
            // 领奖
            if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                this.initActiviyMatch(data)
            } else {
                this.initGetAward(data)
                MatchSvr.GetMatchAward(data.matchUuid)
            }
        } else if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMEOVER) {
            // 比赛结束
            if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                this.initActiviyMatch(data)
            } else {
                this.initGameOver(data)
            }
        }

        if (data && data.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH && !this._bShowBanner) {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_BANNER)
            this._bShowBanner = true
        }
    }

    initActiviyMatch(data: IMatchDetail) {
        if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) {
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/wait", true)
        } else {
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/1", data.rank === 0)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/2", data.rank === 1)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/3", data.rank === 2)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/n", data.rank > 2)
            this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/league/n/value", data.rank + 1)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/n/qian", true)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/n/di", false)
        }
        this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/state/matchState", "")

        this.initCounttime(data)

        this.setLabelValue("main/view/content/MatchDetail/btns/content/btnNext/num", "剩余" + (data.totalStage - data.curStage) + "次")
        // this.setActive("main/view/content/MatchDetail/btns/content/btnNext", data.totalStage > data.curStage && data.expireTime && data.expireTime * 1000 > Date.now())
        this.setActive("main/view/content/MatchDetail/btns/content/btnBack", false)
        this.setActive("main/view/content/MatchDetail/btns/content/btnDetail", true)
    }

    initCounttime(data: IMatchDetail) {
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/time", true)
        if (data.expireTime) {
            if (data.expireTime * 1000 > Date.now()) {
                let time = (data.expireTime * 1000) - Date.now()
                let label = this.getNodeComponent("main/view/content/MatchDetail/detail/view/content/state/info/content/time/node/counttime", cc.Label)
                let now = Date.now()
                label.string = data.expireTime - now > 86400 ? Helper.FormatTimeString((data.expireTime * 1000) - now, "d天 hh:mm:ss") : Helper.FormatTimeString((data.expireTime * 1000) - now, "hh:mm:ss")
                cc.tween(label)
                    .repeat(Math.floor(time / 1000),
                        cc.tween()
                            .delay(1)
                            .call(() => {
                                let now = Date.now()
                                label.string = data.expireTime - now > 86400 ? Helper.FormatTimeString((data.expireTime * 1000) - now, "d天 hh:mm:ss") : Helper.FormatTimeString((data.expireTime * 1000) - now, "hh:mm:ss")
                            })
                    )
                    .call(() => {
                        label.string = "比赛已结束"
                        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/time/node/label", false)
                        this.setActive("main/view/content/MatchDetail/btns/content/btnNext", false)
                    })
                    .start()

                this.setActive("main/view/content/MatchDetail/btns/content/btnNext", data.totalStage > data.curStage)
            } else {
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/time/node/label", false)
                this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/time/node/counttime", "比赛已结束")

                this.setActive("main/view/content/MatchDetail/btns/content/btnNext", false)
                // this.setActive("main/view/content/MatchDetail/btns/content/btnDetail", true)
            }
        }
    }

    initPlayer(data: IMatchDetail) {
        if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.setActive("main/view/content/MatchDetail/detail/view/content/scoreRecord", true)

            this.setLabelValue("main/view/content/MatchDetail/detail/view/content/scoreRecord/opponent", User.UserName)
            this.setLabelValue("main/view/content/MatchDetail/detail/view/content/scoreRecord/areaInfo", User.Region)
            this.setSpriteFrame("main/view/content/MatchDetail/detail/view/content/scoreRecord/icon", User.Avatar, true)

            // 填充分数
            this.setLabelValue("main/view/content/MatchDetail/detail/view/content/scoreRecord/curScore/score", data.score)
            this.setLabelValue("main/view/content/MatchDetail/detail/view/content/scoreRecord/bestScore/score", data.topScore || data.score)
        } else {
            // 填充玩家
            let players = data.players
            if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) {
                if (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_REBATTLE) {
                    for (let p of players) {
                        if (p.openid !== User.OpenID) {
                            p.state = Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_REBATTLE
                        }
                    }
                } else if (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING ||
                    data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_GAMING) {
                    for (let p of players) {
                        if (p.openid !== User.OpenID) {
                            p.score = NaN
                        }
                    }
                } else if (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SETTLE &&
                    data.playerNum <= 2) {
                    for (let p of players) {
                        if (p.openid !== User.OpenID) {
                            p.state = Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING
                        }
                    }
                }
            }

            if (data.playerNum > 2) {
                this.setActive("main/view/content/MatchDetail/detail/view/content/multiplayer", true)
                this.setChildParam("main/view/content/MatchDetail/detail/view/content/multiplayer", { match: data })
            } else {
                this.setActive("main/view/content/MatchDetail/detail/view/content/1v1", true)
                this.setChildParam("main/view/content/MatchDetail/detail/view/content/1v1", { match: data })
            }
        }

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
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/state", true)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/award", true)
            this.setItems("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/award/left", [normal[0]])
            if (normal[1]) {
                this.setItems("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/award/right", [normal[1]])
            } else {
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/award/common-fengexian", false)
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/award/right", false)
                this.removeNodeComponent("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/award/left", cc.Widget)
                this.setNodePositionX("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/award/left", 0)
            }
        } else {
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/award", false)
        }

        if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) {
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/growth", false)
        } else {
            let silver = awards.filter(i => i.id === Constants.ITEM_INDEX.SilverMedal)
            let gold = awards.filter(i => i.id === Constants.ITEM_INDEX.GoldenMedal)
            if (silver && silver.length > 0 && silver[0].num > 0) {
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/growth/left/silverMedalIcon", true)
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/growth/left/goldMedalIcon", false)
                this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/growth/left/medalVal", silver[0].num || 0)
            } else if (gold && gold.length > 0 && gold[0].num > 0) {
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/growth/left/silverMedalIcon", false)
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/growth/left/goldMedalIcon", true)
                this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/growth/left/medalVal", gold[0].num || 0)
            } else {
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/growth/left", false)
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/growth/common-fengexian", false)
                this.removeNodeComponent("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/growth/right", cc.Widget)
                this.setNodePositionX("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/growth/right", 0)
            }

            let exp = awards.filter(i => i.id === Constants.ITEM_INDEX.Exp)
            this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/growth/right/expVal", (exp[0] && exp[0].num) || 0)

            if (silver.length === 0 && gold.length === 0 && exp.length === 0) {
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/growth", false)
            }

            let self = data.players.filter(p => p.openid === User.OpenID)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement", data.playerNum <= 2)
            if (self && self[0]) {
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/growth", self[0].rank !== 1)
            }
        }
    }

    initBottom(data: IMatchDetail) {
        this.setActive("main/view/content/MatchDetail/btm/info", true)

        // 填充底部信息
        this.setLabelValue("main/view/content/MatchDetail/btm/info/name", "比赛名称:" + data.name)
        // this.setChildParam("main/view/content/MatchDetail/btm/info/gatemoney/items/ItemMode", { items: data.gateMoney, style: ITEM_STYLE.STYLE_WHITE})
        let matchInfo = MatchSvr.GetMatchInfo(data.matchId)
        let free = true
        data.gateMoney.forEach(i => i.num > 0 ? free = false : "")
        if ((matchInfo && matchInfo.freeAd) || free) {
            this.setLabelValue("main/view/content/MatchDetail/btm/info/gatemoney", "免费入场")
            this.setActive("main/view/content/MatchDetail/btm/info/gatemoney/items", false)
        } else {
            // this.setItems("main/view/content/MatchDetail/btm/info/gatemoney/items", data.gateMoney)
            if (data.gateMoney[0].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive("main/view/content/MatchDetail/btm/info/gatemoney/items/list/lottery", true)
                this.setActive("main/view/content/MatchDetail/btm/info/gatemoney/items/list/gold", false)
                this.setLabelValue("main/view/content/MatchDetail/btm/info/gatemoney/items/list/num", data.gateMoney[0].num)
            } else if (data.gateMoney[0].id === Constants.ITEM_INDEX.GOLD) {
                this.setActive("main/view/content/MatchDetail/btm/info/gatemoney/items/list/lottery", false)
                this.setActive("main/view/content/MatchDetail/btm/info/gatemoney/items/list/gold", true)
                this.setLabelValue("main/view/content/MatchDetail/btm/info/gatemoney/items/list/num", data.gateMoney[0].num)
            }
        }

        this.setLabelValue("main/view/content/MatchDetail/btm/info/date", "日期:" + Helper.FormatTimeString(Number(data.createTime) * 1000, "MM-dd hh:mm"))
        if (MatchSvr.isSingleMatch(data.matchId)) {
            this.setLabelValue("main/view/content/MatchDetail/btm/info/id", "比赛ID:" + Helper.UUID().substr(0, 8))
        } else {
            if (data.matchUuid) {
                this.setLabelValue("main/view/content/MatchDetail/btm/info/id", "比赛ID:" + data.matchUuid.substr(0, 8))
            }
        }
    }

    initRebattle(data: IMatchDetail) {
        // 图标        
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/battle", true)

        // 显示状态
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/time", true)

        // 状态提示
        this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/state/matchState", "决胜局")
        this.setLabelInfo("main/view/content/MatchDetail/detail/view/content/state/info/content/state/matchState", { fontSize: 60 })
        if (data.expireTime) {
            let time = (data.expireTime * 1000) - Date.now()
            let label = this.getNodeComponent("main/view/content/MatchDetail/detail/view/content/state/info/content/time/node/counttime", cc.Label)
            cc.tween(label)
                .repeat(Math.floor(time / 1000),
                    cc.tween()
                        .delay(1)
                        .call(() => { label.string = Helper.FormatTimeString((data.expireTime * 1000) - Date.now(), "hh:mm:ss") })
                )
                .start()
        }

        // 功能按钮
        this.setActive("main/view/content/MatchDetail/btns/content/btnStart", true)
        this.setActive("main/view/content/MatchDetail/btns/content/btnBack", true)
        // this.setActive("main/view/content/MatchDetail/btns/content/btnNext", true)
    }

    initGaming(data: IMatchDetail) {
        // 图标        
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/battle", true)

        // 显示状态
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/time", true)

        // 状态提示
        if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            if (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SETTLE) {
                this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/state/matchState", "进行" + (data.curStage < data.totalStage ? "第" + (data.curStage) + "轮" : "决赛"))
            } else {
                this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/state/matchState", "等待提交分数, 您已完成比赛")
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement", false)
            }
        } else {
            this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/state/matchState", "等待提交分数")
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement", false)
        }
        if (data.expireTime) {
            let time = (data.expireTime * 1000) - Date.now()
            let label = this.getNodeComponent("main/view/content/MatchDetail/detail/view/content/state/info/content/time/node/counttime", cc.Label)
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
            this.setActive("main/view/content/MatchDetail/btns/content/btnDetail", true)
        } else if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.setActive("main/view/content/MatchDetail/btns/content/btnDetail", true)
            this.setActive("main/view/content/MatchDetail/btns/content/btnStart", true)
        } else {
            this.setActive("main/view/content/MatchDetail/btns/content/btnStart", true)
        }

        // let enought = MatchSvr.checkGateMoney(data.matchId) && data.type !== Constants.MATCH_TYPE.TOURNEY_MATCH
        // this.setActive("main/view/content/MatchDetail/btns/content/btnNext", enought)
        this.setActive("main/view/content/MatchDetail/btns/content/btnBack", true)
    }

    initGetAward(data: IMatchDetail) {
        // 图标        
        if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH || data.playerNum > 2) {
            if (data.matchState !== Constants.MATCH_STATE.COMPLETE) {
                if (data.isWin) {
                    this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/win", true)
                } else {
                    this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/lost", true)
                }
            } else {
                let self = data.players.filter(p => p.openid === User.OpenID || p.openid === "10000")
                this.setActive("main/view/content/MatchDetail/particle", self[0].rank === 1)
                if (this._curAwardIdx === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("main/view/content/MatchDetail/particle/lottery", true)
                } else if (this._curAwardIdx === Constants.ITEM_INDEX.GOLD) {
                    this.setActive("main/view/content/MatchDetail/particle/gold", true)
                }
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/1", self[0].rank === 1)
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/2", self[0].rank === 2)
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/3", self[0].rank === 3)
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/n", self[0].rank > 3)
                this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/league/n/value", self[0].rank)
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/n/qian", false)
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/n/di", true)
            }
        } else {
            if (data.isWin) {
                this.setActive("main/view/content/MatchDetail/particle", true)
                if (this._curAwardIdx === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("main/view/content/MatchDetail/particle/lottery", true)
                } else if (this._curAwardIdx === Constants.ITEM_INDEX.GOLD) {
                    this.setActive("main/view/content/MatchDetail/particle/gold", true)
                }
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/1", true)
            } else {
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/2", true)
            }
        }

        // 显示状态
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/headSpace", data.playerNum <= 2)
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/state", false)
        // let spt = this.getNodeComponent("main/view/content/MatchDetail/detail/view/content/state/info/content", cc.Sprite)
        // if (spt) spt.enabled = false

        // 状态提示

        // 功能按钮
        let enought = MatchSvr.checkGateMoney(data.matchId) && data.type !== Constants.MATCH_TYPE.TOURNEY_MATCH
        this.setActive("main/view/content/MatchDetail/btns/content/btnBack", !enought)
        this.setActive("main/view/content/MatchDetail/btns/content/btnNext", enought)
    }

    initWaitOpponent(data: IMatchDetail) {
        // 图标       
        if (data.matchState === Constants.MATCH_STATE.ABORT) {
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/abort", true)
            // 状态提示
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/headSpace", data.playerNum <= 2)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/state", false)
        } else {
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/wait", true)
            // 状态提示
            if (data.playerNum <= 2) {
                this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/state/matchState", "提交分数成功, 胜利将获得")
            } else {
                this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/state/matchState", "提交分数成功, 等待完成比赛")
            }

            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/time", false)
        }

        // 显示状态
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement", data.playerNum <= 2)

        // 功能按钮
        if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH && data.totalStage > 1 && data.totalStage > data.curStage) {
            if (data.curStage + 1 === data.totalStage) {
                this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/state/matchState", "决赛即将开始, 第" + (data.curStage + 2) + "轮即将开始")
            }
            this.setActive("main/view/content/MatchDetail/btns/content/btnDetail", true)
        } else {
            let enought = MatchSvr.checkGateMoney(data.matchId) && data.type !== Constants.MATCH_TYPE.TOURNEY_MATCH
            this.setActive("main/view/content/MatchDetail/btns/content/btnBack", !enought)
            this.setActive("main/view/content/MatchDetail/btns/content/btnNext", enought)
        }
    }

    initGameOver(data: IMatchDetail) {
        // 图标       
        if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH || data.playerNum > 2) {
            if (data.matchState !== Constants.MATCH_STATE.COMPLETE) {
                if (data.isWin) {
                    this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/win", true)
                } else {
                    this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/n", true)
                    this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/league/n/value", data.playerNum / Math.pow(2, (data.curStage + 1)))
                    this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/n/qian", true)
                    this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/n/di", false)
                }
            } else {
                let self = data.players.filter(p => p.openid === User.OpenID)
                this.setActive("main/view/content/MatchDetail/particle", self[0].rank === 1)
                if (this._curAwardIdx === Constants.ITEM_INDEX.GOLD) {
                    this.setActive("main/view/content/MatchDetail/particle/gold", true)
                } else if (this._curAwardIdx === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("main/view/content/MatchDetail/particle/lottery", true)
                }
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/1", self[0].rank === 1)
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/2", self[0].rank === 2)
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/3", self[0].rank === 3)
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/n", self[0].rank > 3)
                this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/league/n/value", self[0].rank)
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/n/qian", false)
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/n/di", true)
            }
        } else {
            if (data.isWin) {
                this.setActive("main/view/content/MatchDetail/particle", true)
                if (this._curAwardIdx === Constants.ITEM_INDEX.GOLD) {
                    this.setActive("main/view/content/MatchDetail/particle/gold", true)
                } else if (this._curAwardIdx === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("main/view/content/MatchDetail/particle/lottery", true)
                }
                // this.setParticleSpriteFrame("image/icon/big_zuanshi")
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/1", true)
            } else {
                this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/2", true)
            }
        }

        // 显示状态
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/headSpace", data.playerNum <= 2)
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/state", false)
        // let spt = this.getNodeComponent("main/view/content/MatchDetail/detail/view/content/state/info/content", cc.Sprite)
        // if (spt) spt.enabled = false

        // // 状态提示        
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/time", false)

        // 功能按钮
        if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH && data.totalStage > 1 && data.totalStage > data.curStage) {
            this.setActive("main/view/content/MatchDetail/btns/content/btnDetail", true)
        }

        let enought = MatchSvr.checkGateMoney(data.matchId) && data.type !== Constants.MATCH_TYPE.TOURNEY_MATCH

        this.setActive("main/view/content/MatchDetail/btns/content/btnNext", enought)
        this.setActive("main/view/content/MatchDetail/btns/content/btnBack", !enought)
    }

    initAbort(data: IMatchDetail) {
        // 图标       
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/abort", true)

        if (data.type === Constants.MATCH_TYPE.REALTIME_MATCH) {
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/abort/jiesuan-pingju", true)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/abort/jiesuan-zhongzhi", false)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/growth", false)
            this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/state/matchState", "本场比赛未分出胜负，报名费已退还")

            this.setActive("main/view/content/MatchDetail/btns/content/btnNext", true)
        } else {
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/abort/jiesuan-pingju", false)
            this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/league/abort/jiesuan-zhongzhi", true)
            this.setLabelValue("main/view/content/MatchDetail/detail/view/content/state/info/content/state/matchState", "比赛已终止, 报名费已返回")

            this.setActive("main/view/content/MatchDetail/btns/content/btnBack", true)
        }

        // 显示状态
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/state", true)

        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/time", false)

        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement", data.playerNum <= 2)
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/award", true)
        this.setItems("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/award/left", data.gateMoney)
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/award/common-fengexian", false)
        this.setActive("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/award/right", false)
        this.removeNodeComponent("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/award/left", cc.Widget)
        this.setNodePositionX("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement/bg/award/left", 0)
    }

    onPressBack() {
        // if (cc.director.getScene().name === "result") {
        if (this.node.name === "node") {
            PlatformApi.GotoLobby()
        } else {
            this.close()
        }
    }

    onPressDetail() {
        let data: IMatchDetail = this.param.result
        if (!data) {
            return
        }

        if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            UIMgr.OpenUI("lobby", "component/match/activityMatch/ActivityMatchList", { param: { data: data }, closeCb: () => { this.close() } })
        } else if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            if (data.totalStage > 1 && data.rounds) {
                MatchSvr.GetMatch(data.matchId, data.matchUuid, undefined, (detail) => {
                    Helper.OpenPageUI("component/match/tourneyMatch/MatchTree", data.name, "", { data: detail })//, () => this.close())
                })
            } else if (data.totalStage > 1) {
                UIMgr.OpenUI("lobby", "component/match/tourneyMatch/MatchTree", { /*closeCb: () => { this.close() },*/ parent: this.node.parent, param: { data: data } }, () => {
                    this.node.active = false
                })
            }
        }
    }

    onPressNext() {
        if (User.OpenID === "10000") {
            EventMgr.once(Constants.EVENT_DEFINE.LOGIN_SUCCESS, () => {
                this.onPressNext()
            }, this)
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.ACCOUNT_LOGIN, { needTip: true })
            return
        }

        let data = this.param.result
        if (!data) {
            if (this.param.submit) {
                data = MatchSvr.GetMatchInfo(this.param.submit.matchCid)
            }
        }

        if (!data) {
            return
        }

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BANNER)
        if (DataMgr.data.OnlineParam.guideRealTime === 2 && MatchSvr.isSingleMatch(data.matchId) && User.PlayGame === 1) {
            let matchs = MatchSvr.GetMatchsByGame(DataMgr.data.Config.gameId)
            let idx = 0
            for (let i in matchs) {
                idx++
            }

            if (idx <= 3) {
                MatchSvr.LoadMatchConfig(DataMgr.data.Config.gameId, () => {
                    UIMgr.OpenUI("lobby", "component/match/realTimeMatch/matchStart/RealTimeMatchStart", { single: true, param: { isAd: false } })
                })
            } else {
                UIMgr.OpenUI("lobby", "component/match/realTimeMatch/matchStart/RealTimeMatchStart", { single: true, param: { isAd: false } })
            }
        } else if (data.realTime) {
            let matchInfo = MatchSvr.GetMatchInfo(data.matchId)
            UIMgr.OpenUI("lobby", "component/match/realTimeMatch/matchStart/RealTimeMatchStart", { single: true, param: { start: true, isAd: matchInfo?.freeAd } }, () => {
                if (this.node.name !== "node") {
                    this.close()
                }
            })
        } else {
            MatchSvr.JoinMatch(data.matchId, undefined)
        }
    }

    onPressStart() {
        let match: IMatchInfo = this.param.match
        if (match) {
            if (match.realTime) {
                UIMgr.OpenUI("igaoshou", "component/matchStart/MatchStart", { single: true, param: { matchId: match.matchId } })
            } else if (match.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
                if (!DataMgr.getData<boolean>("tourneyMatchTip")) {
                    let param = {
                        buttons: 1,
                        cancelName: "我知道了",
                        closeCb: () => {
                            MatchSvr.JoinMatch(match.matchId, undefined, () => this.close())
                        }
                    }
                    Helper.OpenPopUI("component/match/tourney/TourneyMatchTip", "提示", param)
                } else {
                    MatchSvr.JoinMatch(match.matchId, undefined, () => this.close())
                }
                return
            } else if (match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                // MatchSvr.EnterMatch(match.matchId, null, (res) => res && MatchSvr.StartGame())
                MatchSvr.JoinMatch(match.matchId, undefined, () => this.close())
            } else if (match.roundPlayer > 2) {
                MatchSvr.JoinMatch(match.matchId, undefined, () => this.close())
            }
        }

        let data: IMatchDetail = this.param.result
        if (data) {
            MatchSvr.EnterMatch(data.matchId, data.matchUuid, () => { MatchSvr.StartGame() })
            return
        }
    }

    onPressCopy() {
        let data: IMatchDetail = this.param.result
        let msg = "openid：" + User.OpenID + "\n"
        msg += "match_id：" + data.matchUuid

        Helper.copyToClipBoard(msg)
    }

    initHuafei() {
        this.setActive("main/view/content/MatchDetail/guide", false)
        if (!Helper.checkExchange()) {
            return
        }

        if (this.param.match) {
            return
        }

        if (this.param.result && (this.param.result.type === Constants.MATCH_TYPE.ACTIVITY_MATCH)) {
            return
        }

        let progress = Math.min(User.Lottery / 200000, 1)
        this.setProgressValue("main/view/content/MatchDetail/guide/huafei/progress", progress < 0.3 ? 0.3 : progress)
        this.setLabelValue("main/view/content/MatchDetail/guide/huafei/progress/value", (progress * 100).toFixed(2) + "%")

        let updateLottery = () => {
            ExchangeSrv.getExchangeTemplateInfo({ typeId: 2 }, (res) => {
                if (res && res.code == "0000") {
                    if (res.result && res.result.length > 0) {
                        let data = res.result[0]
                        let progress = Math.min(User.Lottery / data.consume_list[0].item_num, 1)

                        this.setProgressValue("main/view/content/MatchDetail/guide/huafei/progress", progress < 0.3 ? 0.3 : progress)
                        this.setLabelValue("main/view/content/MatchDetail/guide/huafei/progress/value", (progress * 100).toFixed(2) + "%")
                        let lottery = data.consume_list[0].item_num
                        let lotteryStr: string = lottery >= 10000 ? Helper.FormatNumWYCN(lottery) : lottery
                        // lotteryStr = lotteryStr.replace("e", "亿")
                        // lotteryStr = lotteryStr.replace("w", "万")
                    }
                }
            })
        }


        if (!this.isOpenHuaFei()) {
            this.setActive("main/view/content/MatchDetail/guide", false)
        } else if (this.param && this.param.submit) {
            let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
            if (!matchs || !matchs[this.param.submit.matchCid]) {
                return
            }
            let match = matchs[this.param.submit.matchCid]
            this.setActive("main/view/content/MatchDetail/guide", match.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH)
        } else {
            this.setActive("main/view/content/MatchDetail/guide", !this.param.match && ((this.param.result && this.param.result.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH)))
        }

        if (cc.find("main/view/content/MatchDetail/guide", this.node).active) {
            DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, updateLottery, this)
            updateLottery()
        }

        if (this.param.result) {
            let data: IMatchDetail = this.param.result
            let self = this
            this.scheduleOnce(() => {
                if (data.playerNum > 2) {
                    self.removeNodeComponent("main/view/content/MatchDetail/guide", cc.Widget)
                    self.setNodePositionY("main/view/content/MatchDetail/guide", -100)
                }
                // else {
                //     self.setNodePositionY("main/view/content/MatchDetail/guide", this.getNode("main/view/content/MatchDetail/qualifying").y)
                // }
            }, .1)
        }
    }

    isOpenHuaFei() {
        return Helper.checkExchange()
    }

    onPressHuafei() {
        UIMgr.OpenUI("lobby", "component/exchange/huafei/ExchangeLottery", {})
    }

    onPressFree() {
        let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        if (matchs) {
            for (let i in matchs) {
                if (matchs[i].gameId !== DataMgr.data.Config.gameId) {
                    continue
                }
                if (matchs[i].freeAd) {
                    MatchSvr.JoinMatch(matchs[i].matchId)
                    return
                }
            }
        }
    }

    // checkGradeUpgrade(cb?: Function) {
    //     let qualifying = cc.find("main/view/content/MatchDetail/qualifying", this.node)
    //     if (qualifying.active && this._curSeasonData) {
    //         let res = this._curSeasonData
    //         let curSeason: any = DataMgr.getData(Constants.DATA_DEFINE.QUALIFYING_CUR_SEASON)
    //         if (curSeason) {
    //             if (res.grade.level > curSeason.grade.level) {
    //                 QualifyingSrv.GetListRewardStatus((status_list) => {
    //                     for (let v of status_list) {
    //                         if (v.major == res.grade.major && v.minor == res.grade.minor && v.status != 2) {   //status = 0条件不满足 1未领取 2已领取
    //                             let grade = JSON.parse(JSON.stringify(res.grade))
    //                             UIMgr.OpenUI("component/League/QualifyingLevel",
    //                                 {
    //                                     param: { type: 2, data: { grade: curSeason.grade, finalGrade: grade } },
    //                                     closeCb: () => {
    //                                         cb && cb()
    //                                     }
    //                                 })
    //                         }
    //                     }
    //                 })
    //             } else {
    //                 cb && cb()
    //             }
    //         }

    //         DataMgr.setData(Constants.DATA_DEFINE.QUALIFYING_CUR_SEASON, res, true)
    //     } else {
    //         cb && cb()
    //     }
    // }

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
            if (!AdSrv.canPlayAd()) {
                return
            }

            if (User.Lottery >= 150000) {
                return
            }

            if (User.PlayGame >= 3) {
                let data = this.param.result
                if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_AWARD
                    || data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) {
                    if (data.gateMoney && data.gateMoney[0]) {
                        let rnum = Math.random()
                        let activity_id = 0
                        let match_id = null
                        let task_id = 0

                        if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) {
                            if (data.gateMoney[0].id == Constants.ITEM_INDEX.LOTTERY) { //G币场 结算广告点-获取更多G币
                            }
                        } else if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_AWARD) {
                            if (data.gateMoney[0].id === Constants.ITEM_INDEX.LOTTERY) {
                                if (data.isWin) { //TODOT && rnum > .4
                                    activity_id = 1008 // 赢分加倍
                                    match_id = data.matchUuid
                                } else if (!data.isWin) {
                                    activity_id = 1007 // 返回报名费
                                    match_id = data.matchUuid
                                }
                            }
                        }
                        if (activity_id === 0) {
                            activity_id = 1003
                        }

                        if (activity_id > 0) {
                            let config = ActivitySrv.GetActivityById(activity_id)
                            if (config) {
                                config.day_times = config.day_times || 0
                                config.receive_num = config.receive_num || 0
                                if (config.receive_num < config.day_times) {
                                    ActivitySrv.GetActivityConfig(activity_id, match_id, (res: any) => {
                                        console.log("GetActivityConfig", res)
                                        if (res) {
                                            if (res.day_times && res.receive_num && res.receive_num >= res.day_times) {
                                            } else {
                                                UIMgr.OpenUI("lobby", "component/activity/free/LuckyRedPacket", {
                                                    param: res, closeCb: () => {
                                                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHECK_GRADE_UPGRADE, { cb: () => this.checkHonorTime() })
                                                    }
                                                })
                                                return
                                            }
                                        }

                                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHECK_GRADE_UPGRADE, { cb: () => this.checkHonorTime() })
                                    })

                                    return
                                }
                            }
                        } else if (task_id > 0) {
                        }
                    }
                }
            }
        }

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHECK_GRADE_UPGRADE, { cb: () => this.checkHonorTime() })
    }

    setParticleSpriteFrame(img_path: string) {
        let bundle = DataMgr.data.Bundle
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

    asyncCheckGuide(res: any = null) {
        if (!this.param.result) {
            return
        }

        if (this.param && this.param.isSettle && DataMgr.data.Config.platId != 3) {
            this.scheduleOnce(() => this.checkGuide(res), .0)
        }

        this.scheduleOnce(() => this.checkTip(), .0)
    }

    checkGuide(res: any = null) {
        if (!this || !this.node || !this.node.isValid) {
            return
        }

        let data: IMatchDetail = this.param.result
        let match = MatchSvr.GetMatchInfo(data.matchId)
        if (!data || data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH || match.isMultiplayer) {
            return
        }

        let autoShowNewBie = DataMgr.getData(Constants.DATA_DEFINE.AUTO_SHOW_NEW_BIE_AWARD)
        let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
        if (User.PlayGame === 1 && !autoShowNewBie) {
            DataMgr.setData(Constants.DATA_DEFINE.AUTO_SHOW_NEW_BIE_AWARD, true, true)
            this.setActive("main/view/content/MatchDetail/btns/content/btnNext", true)
            if (cc.sys.BYTEDANCE_GAME === cc.sys.platform) {
                this.setActive("main/view/content/MatchDetail/btns/content/btnBack", true)
            } else {
                this.setActive("main/view/content/MatchDetail/btns/content/btnBack", false)
            }
            this.setActive("main/view/content/MatchDetail/btns/content/btnMore", false)
            if (!this.isOpenHuaFei()) {
                this.setActive("main/view/content/MatchDetail/guide", false)
            } else {
                this.setActive("main/view/content/MatchDetail/guide", true)
            }

            if (DataMgr.data.OnlineParam.guideRealTime === 2) {
                this.setLabelValue("main/view/content/MatchDetail/btns/content/btnNext/name", "前往实时赛")                
            }

            let step2 = () => {
                if (cc.find("main/view/content/MatchDetail/guide", this.node).active) {
                    let awards = MatchSvr.GetAwards(data.matchId, 1)
                    let nodes = [
                        this.getNode("main/view/content/MatchDetail/guide")
                    ]
                    this.setActive("main/view/content/MatchDetail/guide/huafei/btnHuafei", false)
                    UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", {
                        single: true, param: { index: 18, nodes: nodes, awards: awards },
                        closeCb: () => {
                            this.setActive("main/view/content/MatchDetail/guide/huafei/btnHuafei", true)
                            this.showGameGuidance({ index: 3 })
                        },
                    })
                    Helper.reportEvent("首局结算-5.2.1、红包兑换指引")
                } else {
                    this.showGameGuidance({ index: 3 })
                    // this.showGameGuidance({ index: 19 })
                }
            }
            if (data.isWin) {
                let nodes = [
                    this.getNode("main/view/content/MatchDetail/detail/view/content/state/info/content/settlement"),
                    this.getNode("main/view/content/MatchDetail/detail/view/content/1v1"),
                ]
                UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", {
                    single: true, param: { index: 6, nodes: nodes },
                    closeCb: () => step2(),
                })
            } else {
                step2()
            }
        } else if (User.PlayGame === 2) {
            if (data.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                this.setActive("main/view/content/MatchDetail/btns/content/btnNext", true)
                if (cc.sys.BYTEDANCE_GAME === cc.sys.platform) {
                    this.setActive("main/view/content/MatchDetail/btns/content/btnBack", true)
                } else {
                    this.setActive("main/view/content/MatchDetail/btns/content/btnBack", false)
                }
                this.setActive("main/view/content/MatchDetail/btns/content/btnMore", false)
            }

            this.setActive("main/view/content/MatchDetail/btns/content/btnNext/shou1", true)
        } else if (User.PlayGame === 3 && DataMgr.data.OnlineParam.guideRealTime !== 2) {
            if (DataMgr.data.OnlineParam.guideRealTime === 1 && record[2] !== 1) {
                this.setLabelValue("main/view/content/MatchDetail/btns/content/btnMore/name", "前往实时赛")
            } else if (DataMgr.data.OnlineParam.guideBattle === 1 && record[2] !== 1) {
                this.setLabelValue("main/view/content/MatchDetail/btns/content/btnMore/name", "前往专业赛")
            } else {
                return
            }

            this.setActive("main/view/content/MatchDetail/btns/content/btnNext", false)
            this.setActive("main/view/content/MatchDetail/btns/content/btnMore", true)

            UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", {
                single: true, param: { index: 2, node: this.getNode("main/view/content/MatchDetail/btns/content/btnMore") },
            })
            // } else if (User.AllGame >= 5 && record[28] !== 1) {
            //     UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", {
            //         single: true, param: {
            //             index: 28,
            //             confirm: () => this.onPressBack()
            //         }
            //     })
            // } else if (User.AllGame >= 6 && record[27] !== 1) {
            //     UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", {
            //         single: true, param: {
            //             index: 27,
            //             confirm: () => {
            //                 UIMgr.OpenUI("lobby", "component/league/qualifying/QualifyingMain", {})
            //             },
            //             cancel: () => {
            //                 if (res) {
            //                     EventMgr.dispatchEvent(Constants.EVENT_DEFINE.QUALIFYING_BTN, { parent: this.getNode("main/view/content/MatchDetail/qualifying"), param: { data: res } })
            //                 }
            //             }
            //         }
            //     })
        } else if (User.PlayGame === 6 && res) {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.QUALIFYING_BTN, { parent: this.getNode("main/view/content/MatchDetail/qualifying"), param: { data: res } })
        } else {
            this.setActive("main/view/content/MatchDetail/btns/content/btnNext/shou1", true)

            if (User.PlayGame >= 6 && res) {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.QUALIFYING_BTN, { parent: this.getNode("main/view/content/MatchDetail/qualifying"), param: { data: res } })
            }

            let data: IMatchDetail = this.param.result
            // let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
            if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) {
                if (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SETTLE) {
                    for (let i in data.players) {
                        let p = data.players[i]
                        if (p.openid !== User.OpenID) {
                            if (undefined === p.openid) {
                                if (record[5] !== 1) {
                                    // 等待对手
                                    UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", {
                                        single: true, param: {
                                            index: 5,
                                            node: this.getNode("main/view/content/MatchDetail/detail/view/content/1v1"),
                                        }, closeCb: () => {
                                        }
                                    })
                                    return
                                }
                            } else {
                                if (p.state === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING || p.state === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_GAMING) {
                                    if (record[4] !== 1) {
                                        // 等待进入比赛
                                        UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", {
                                            single: true, param: {
                                                index: 4,
                                                node: this.getNode("main/view/content/MatchDetail/detail/view/content/1v1"),
                                            }, closeCb: () => {
                                            }
                                        })
                                        return
                                    }
                                }
                            }
                        }

                    }
                }
            } else if (data.matchState === Constants.MATCH_STATE.ABORT && record[31] !== 1) {
                UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", {
                    single: true, param: {
                        index: 31,
                        nodes: [
                            this.getNode("main/view/content/MatchDetail/detail/view/content/1v1"),
                            this.getNode("main/view/content/MatchDetail/detail/view/content/state"),
                        ]
                    }, closeCb: () => {
                    }
                })
                return
            }

            this.checkActivityPop(null)
        }
    }

    showGameGuidance(param) {
        if (param.index === 3) {
            ActivitySrv.GetActivityConfig(1002, (res) => {
                console.log("ActivitySrv.GetActivityById(1002)", res)
                if (res) {
                    Helper.reportEvent("首局结算-5.3、请求新人礼包")
                    UIMgr.OpenUI("lobby", "component/activity/newbie/NewbieAward", { param: { activityInfo: res }, closeCb: () => this.showGameGuidance({ index: 19 }) })
                } else {
                    this.showGameGuidance({ index: 19 })
                }
            })
        } else if (param.index == 19) {
            // this.scheduleOnce(() => {
            //     // let btnMore = cc.find("main/view/content/MatchDetail/btns/content/btnMore", this.node)
            //     let btnNext = cc.find("main/view/content/MatchDetail/btns/content/btnNext", this.node)
            //     UIMgr.OpenUI("component/Base/GameGuidance", { single: true, param: { index: 19, node: btnNext } })
            // }, .1)
            this.setActive("main/view/content/MatchDetail/btns/content/btnNext/shou1", true)
            if (DataMgr.data.OnlineParam.guideRealTime === 2) {
                UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", {
                    single: true, param: { index: 2, node: this.getNode("main/view/content/MatchDetail/btns/content/btnNext") },
                })
            }
        }
    }

    updateMatchState() {
        if (!this.param.result) {
            return
        }

        let data: IMatchDetail = this.param.result
        let self = this
        let games = User.AllGame
        this.scheduleOnce(() => {
            MatchSvr.GetMatch(data.matchId, data.matchUuid, data.roundId, (res) => {
                if (!res) {
                    return
                }
                self.param = self.param || {}
                self.param.submit = null
                self.param.result = res
                self.param.isSettle = true
                self.param.games = games
                self.onOpen()
            })
        }, 3)
    }

    _honorType: number = 0
    checkHonorTime() {
        if (!this.node || !this.node.isValid) {
            return
        }

        if (cc.sys.OPPO_GAME === cc.sys.platform) {
            return
        }

        console.log("===checkHonor time")
        if (User.AllGame <= 3) {
            return
        }

        if (!this.param.result) {
            return
        }

        let data: IMatchDetail = this.param.result

        if (this._honorType === 0) {
            if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_AWARD ||
                data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMEOVER) {
                console.log("===checkHonor type 0")
                let winCount = DataMgr.getData<number>("continue_win_count")
                if (winCount >= 3) {
                    UIMgr.OpenUI("lobby", "component/honorTime/HonorTime", { single: true, param: { type: this._honorType++, score: winCount }, closeCb: () => this.checkHonorTime() })
                    DataMgr.setData<number>("continue_win_count", null)
                    return
                }
            }

            this._honorType++
            this.checkHonorTime()
        } else if (this._honorType === 1) {
            console.log("===checkHonor type 1")
            let maxScore = DataMgr.getData<number>("max_score")
            if (data.score > 0 && data.score === maxScore) {
                UIMgr.OpenUI("lobby", "component/honorTime/HonorTime", {
                    single: true, param: { type: this._honorType, score: maxScore },
                })
                DataMgr.setData<number>("max_score", null)
            }
            this._honorType++
        }
    }

    onChildChange() {
        // if (cc.Canvas.instance.node.childrenCount > 3) {
        //     EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BANNER)
        // } else if (this.node.active && !this.param.match) {
        //     EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_BANNER)
        // }
    }

    checkTip() {
        if (!this || !this.node || !this.node.isValid) {
            return
        }

        let data: IMatchDetail = this.param.result
        let match = MatchSvr.GetMatchInfo(data.matchId)
        if (!data || data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH || match.isMultiplayer) {
            return
        }

        let msg = null
        // if (User.PlayGame < 6) {
        //     msg = "<color=#2a5585><b>再打</c><color=#ff6000><b>" + (6 - User.PlayGame) + "</color><color=#2a5585><b>局解锁</c><color=#ff6000><b>段位</color>"
        // }
        if (User.PlayGame < 5) {
            msg = "<color=#2a5585><b>再打</c><color=#ff6000><b>" + (5 - User.PlayGame) + "</color><color=#2a5585><b>局解锁</c><color=#ff6000><b>活动赛</color>"
        }
        if (User.PlayGame === 1) {
            if (DataMgr.data.OnlineParam.guideRealTime === 2) {
                // msg = "再打" + (3 - User.AllGame) + "局解锁实时赛"
                msg = null
            } 
        }
        if (msg) {
            this.setRichTextValue("main/view/content/MatchDetail/btns/content/tip/msg", msg)
            this.setActive("main/view/content/MatchDetail/btns/content/tip", true)

            // let node = this.getNode("main/view/content/MatchDetail/btns")
            // this.setNodePositionY("main/view/content/MatchDetail/tip", node.position.y + node.height / 2)
        }
    }
}