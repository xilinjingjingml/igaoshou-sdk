import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { DataMgr } from "../../base/DataMgr";
import { MatchSvr } from "../../system/MatchSvr";
import { User } from "../../system/User";
import { Helper } from "../../system/Helper";
import { EventMgr } from "../../base/EventMgr";
import { Match } from "../../api/matchApi";
import { UIMgr } from "../../base/UIMgr";
import { ActivitySrv } from "../../system/ActivitySrv";

const { ccclass, property } = cc._decorator;

const COUNT_DOWN_TIME = 4

@ccclass
export default class MatchStart extends BaseUI {

    _bStart: boolean = false
    _match: IMatchInfo = null

    _opponents: string[] = []
    _opponentIdx: number = 0

    _reflushTime: number = 0

    _startTime: number = 0

    _bPause: boolean = false
    _bOnJoin: boolean = false

    _opponenetSize: cc.Size = null

    textTip: string[] = [
        "我们将会为您匹配一个实力相当的对手",
        "你和对手的初始游戏场景将会完全一致",
        "你的金币和奖券可以在所有游戏中通用"
    ]

    onOpen() {
        this.initEvent()
        this.initData()

        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (user.histroy.platGame === 0) {
            Helper.reportEvent("大厅引导1", "进入第一局", "[LYM]")
            UIMgr.OpenUI("component/Base/GameGuidance", { single: true, param: { index: 0 }, closeCb: () => this.onResume() }, () => this.onPause())
        } else if (user.histroy.platGame === 1) {
            Helper.reportEvent("大厅引导2", "进入第二局", "[LYM]")
            UIMgr.OpenUI("component/Base/GameGuidance", { single: true, param: { index: 2 }, closeCb: () => this.onResume() }, () => this.onPause())
        }

        this._opponenetSize = cc.size(230, 230)//this.getNode("content/battle/opponent/avatar").getContentSize()
    }

    onClose() {
    }

    onEnterEnd() {
        this.initNode()
    }

    initNode() {
        let btnBack = this.getNode("top/btnBack", this.node.parent.parent.parent.parent)
        if (btnBack) {
            btnBack.active = false

            let userInfo: IPlayerData = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
            if (userInfo.histroy.allGame > 1) {
                let newBtn = cc.instantiate(btnBack)
                newBtn.active = true
                newBtn.parent = btnBack.parent
                newBtn.getComponent(cc.Button).clickEvents = []
                this.setButtonClick(newBtn, this.onPressCancel.bind(this))
            }
        }
    }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.UPDATE_OPPONENT, this.updateOpponent, this)
        EventMgr.on(Constants.EVENT_DEFINE.SET_OPPONENT, this.setOpponent, this)
        EventMgr.on("SOCKET_CLOSE", this.close, this)
        this.setButtonClick("content/btm/btnStart", this.onPressStart.bind(this))
        this.setButtonClick("content/btm/btnStart2", this.onPressStart.bind(this))
        this.setButtonClick("content/btm/btnDetail", this.onPressDetail.bind(this))

        EventMgr.on("pause_match", this.onPause, this)
        EventMgr.on("resume_match", this.onResume, this)
    }

    initData() {
        let matchId = this.param.matchId

        let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        if (!matchs || !matchs[matchId]) {
            this.close()
            return
        }

        this._match = matchs[matchId]
        this.setLabelValue("top/title", this.node.parent.parent.parent.parent, this._match.name)
        cc.tween(this.node).delay(.1).call(() => {
            let title = this.getNode("top/title", this.node.parent.parent.parent.parent)
            if (title) {
                this.setNodePositionX("top/icon", this.node.parent.parent.parent.parent, -title.width - 50)
            }
        })

        // 自己的信息
        let userInfo: IPlayerData = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (userInfo) {
            if (-1 !== userInfo.userName.indexOf("微信") || -1 !== userInfo.userName.indexOf("游客")) {
                this.setLabelValue("content/battle/self/userName", "我")
            } else {
                this.setLabelValue("content/battle/self/userName", userInfo.userName)
            }

            this.setSpriteFrame("content/battle/self/avatar", userInfo.avatar)
            this.setSpriteFrame("content/battle/self/country", Helper.GetContry(userInfo.region))

            if (DataMgr.Config.env != 2) {
                this.setActive("content/battle/self/country", false)
                this.setActive("content/battle/self/areaInfo", true)
                this.setLabelValue("content/battle/self/areaInfo/Label", userInfo.region)
            }
        }

        // 对手信息
        if (this._match.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.setLabelValue("content/battle/opponent/userName", this._match.name)
            this.setActive("content/battle/opponent/areaInfo", false)
            this.setActive("content/battle/opponent/countdown", true)
            if (this._match.startTime > Date.now() / 1000) {
                this.setActive("content/battle/opponent/countdown/tip", false)
                this.setLabelValue("content/battle/opponent/countdown/times", "比赛未开始")
            } else if (this._match.endTime > Date.now() / 1000) {
                let t = Math.ceil(this._match.endTime - Date.now() / 1000)
                let tween = cc.tween()
                    .repeat(t, cc.tween()
                        .call(() => this.setLabelValue("content/battle/opponent/countdown/times",
                            t > 86400 ? Helper.FormatTimeString(t-- * 1000, "h小时:m分:s秒") : Helper.FormatTimeString(t-- * 1000, "m分:s秒")))
                        .delay(1))
                    .call(() => {
                        this.setActive("content/battle/opponent/countdown/tip", false)
                        this.setLabelValue("content/battle/opponent/countdown/times", "比赛已结束")
                    })
                this.runTween("content/battle/opponent/countdown/times", tween)
            } else {
                this.setActive("content/battle/opponent/countdown/tip", false)
                this.setLabelValue("content/battle/opponent/countdown/times", "比赛已结束")
            }

            this.setActive("content/btm/btnStart", false)
            this.setActive("content/btm/btnStart2", true)
            this.setActive("content/btm/btnDetail", true)

            this.countdown(COUNT_DOWN_TIME)

            // 底部信息
            let awards = []
            for (let i in this._match.awards) {
                for (let j of this._match.awards[i].items) {
                    if (awards[j.id]) {
                        awards[j.id].num += j.num * (this._match.awards[i].end - this._match.awards[i].start + 1)
                    } else {
                        awards[j.id] = { id: j.id, num: j.num * (this._match.awards[i].end - this._match.awards[i].start + 1) }
                    }
                }
            }

            this.setLabelValue("content/btm/matchInfo/detail/tip", "比赛\n奖励")
            this.setItems("content/btm/matchInfo/detail/awards", awards)

            this.setSpriteFrame("content/battle/opponent/avatar", "image/match/huodongsai", true)
        } else {
            this.setLabelValue("content/battle/opponent/userName", "正在匹配对手")
            this.setActive("content/battle/opponent/areaInfo", true)
            this.setActive("content/battle/opponent/countdown", false)
            this._reflushTime = .8
            this.updateOpponent(this.param.opponents)
            this.reflushOpponent()

            this.setActive("content/btm/btnStart", true)
            this.setActive("content/btm/btnStart2", false)
            this.setActive("content/btm/btnDetail", false)

            // 倒计时处理
            let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
            if (user.histroy.allGame <= 1) {
                this.countdown(2)
            } else {
                this.countdown(COUNT_DOWN_TIME)
            }

            // 底部信息
            if (this._match.awards && this._match.awards[0]) {
                this.setItems("content/btm/matchInfo/detail/awards", MatchSvr.GetAwards(this._match.matchId, 1))
            }
        }

        let free = true
        this._match.gateMoney.forEach(i => i.num > 0 ? free = false : "")
        if (this._match.freeAd || free) {
            this.setLabelValue("content/btm/matchInfo/gateMoney/tip", "免费入场")
            this.setActive("content/btm/matchInfo/gateMoney/wcoin", false)
            this.setActive("content/btm/matchInfo/gateMoney/lottery", false)
            this.setActive("content/btm/matchInfo/gateMoney/diamond", false)
        } else {
            this.setItems("content/btm/matchInfo/gateMoney", this._match.gateMoney)
        }

        this.setLabelValue("content/btm/matchInfo/players/name", this._match.maxPlayer + " 玩家")
    }

    updateOpponent(data) {
        if (data) {
            let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
            data.forEach(item => (item !== user.userId) && this._opponents.push(item))
        }
    }

    setOpponent(msg) {
        if (msg) {
            this.stopTween("content/battle/opponent/avatar")
            User.GetPlyDetail(msg, (ply: IPlayerBase) => {
                this.setLabelValue("content/battle/opponent/userName", ply.userName)
                this.setSpriteFrame("content/battle/opponent/avatar", ply.avatar)
                this.setSpriteFrame("content/battle/opponent/country", Helper.GetContry(ply.region))

                if (DataMgr.Config.env != 2) {
                    this.setActive("content/battle/opponent/country", false)
                    this.setActive("content/battle/opponent/areaInfo", true)
                    this.setLabelValue("content/battle/opponent/areaInfo/Label", ply.region)
                }
            })
        }
    }

    countdown(num) {
        this.setLabelValue("content/btm/matchInfo/countdown/num", num)
        this.stopTween("content/btm/matchInfo/countdown/num")
        let tween = cc.tween()
            .repeat(num - 1, cc.tween()
                .delay(1)
                .call(() => { this.setLabelValue("content/btm/matchInfo/countdown/num", --num) })
            )
            .call(() => this.onPressStart())
            .repeat(1, cc.tween()
                .delay(1)
                .call(() => { this.setLabelValue("content/btm/matchInfo/countdown/num", --num) })
            )

        this.runTween("content/btm/matchInfo/countdown/num", tween)
    }

    reflushOpponent() {
        let tween = cc.tween()
            .call(() => {
                let openid = this._opponents[this._opponentIdx]
                if (openid) {
                    this._opponentIdx = (this._opponentIdx + 1) % this._opponents.length
                    User.GetPlyDetail(openid, (ply: IPlayerBase) => {
                        this.setLabelValue("content/battle/opponent/userName", "正在匹配对手")//ply.userName)
                        this.setSpriteFrame("content/battle/opponent/avatar", ply.avatar)
                        this.setSpriteFrame("content/battle/opponent/country", Helper.GetContry(ply.region))
                        this.setNodeSize("content/battle/opponent/avatar", this._opponenetSize)

                        if (DataMgr.Config.env != 2) {
                            this.setActive("content/battle/opponent/country", false)
                            this.setActive("content/battle/opponent/areaInfo", true)
                            this.setLabelValue("content/battle/opponent/areaInfo/Label", ply.region)
                        }
                    })
                }
            })
            .delay(this._reflushTime)
            .call(() => !this._bStart && this.reflushOpponent())
        this._reflushTime = this._reflushTime >= .5 ? this._reflushTime - .1 : this._reflushTime
        this.runTween("content/battle/opponent/avatar", tween)
    }

    onPressStart() {
        if (this._bStart)
            return

        let now = Date.now() / 1000
        if (this._match.startTime > 0 && this._match.startTime >= now) {
            let param = {
                buttons: 1,
                confirmName: "确定",
                confirmIconSize: { width: 300 },
                param: { msg: "\n 比赛未开始, 请稍后再试！\n" }
            }
            Helper.OpenPopUI("component/Base/MsgEntry", "提示", param)
            this._bStart = true
            return
        } else if (this._match.endTime > 0 && this._match.endTime < now) {
            let param = {
                buttons: 1,
                confirmName: "确定",
                confirmIconSize: { width: 300 },
                param: { msg: "\n 比赛已结束！\n" }
            }
            Helper.OpenPopUI("component/Base/MsgEntry", "提示", param)
            this._bStart = true
            return
        }

        this._startTime = Date.now() + 2000
        this.setButtonInfo("content/btm/btnStart", { interactable: false })
        this.setButtonInfo("content/btm/btnStart2", { interactable: false })
        this.setActive("GamePage/top/btnBack", cc.Canvas.instance.node, false)
        MatchSvr.EnterMatch(this._match.matchId, null, (res) => {
            if (!res) {
                this.setButtonInfo("content/btm/btnStart", { interactable: true })
                this.setButtonInfo("content/btm/btnStart2", { interactable: true })
                this.setActive("GamePage/top/btnBack", cc.Canvas.instance.node, true)
                return
            }

            this._bStart = true
            let delay = Math.max(0, (this._startTime - Date.now()) / 1000)

            this.scheduleOnce(() => {
                this.stopTween("content/battle/opponent/avatar")
                if (res.opponent_uid) {
                    User.GetPlyDetail(res.opponent_uid, (ply: IPlayerBase) => {
                        this.setLabelValue("content/battle/opponent/userName", ply.userName)
                        this.setSpriteFrame("content/battle/opponent/avatar", ply.avatar)
                        this.setSpriteFrame("content/battle/opponent/country", "image/common/common-country")//Helper.GetContry(ply.region))
                        this.setNodeSize("content/battle/opponent/avatar", this._opponenetSize)

                        if (DataMgr.Config.env != 2) {
                            this.setActive("content/battle/opponent/country", false)
                            this.setActive("content/battle/opponent/areaInfo", true)
                            this.setLabelValue("content/battle/opponent/areaInfo/Label", ply.region)
                        }
                    })
                } else if (this._match.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                    this.setLabelValue("content/battle/opponent/userName", "比赛现在开始\n对手继续匹配中")
                    this.setSpriteFrame("content/battle/opponent/avatar", "image/common/common-wenhao")
                }
            }, delay - .5)
            this.scheduleOnce(() => this.onJoinMatch(), delay)
        })
    }

    onPressCancel() {
        if (!this._bStart) {
            MatchSvr.CancelMatch((err) => {
                if (err) {
                    cc.log(err)
                    return
                }

                this.stopTween("content/btm/matchInfo/countdown/num")
                let page = this.node.parent.parent.parent.parent
                if (page) {
                    let baseUi = page.getComponent(BaseUI)
                    baseUi.close()
                }
            })
        }
    }

    onPressDetail() {
        Helper.OpenPageUI("component/Match/MatchDetailEntry", "", null, { match: this._match })
    }

    onJoinMatch() {
        if (this._bPause) {
            this._bOnJoin = true
            return
        }

        MatchSvr.StartGame()
        this.close()
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

    onPause() {
        this._bPause = true
        this.getNode("content/btm/matchInfo/countdown/num").pauseAllActions()
        this.getNode("content/battle/opponent/avatar").pauseAllActions()
        MatchSvr.PauseJoin()
    }

    onResume() {
        this._bPause = false
        this.getNode("content/btm/matchInfo/countdown/num").resumeAllActions()
        this.getNode("content/battle/opponent/avatar").resumeAllActions()
        MatchSvr.ResumeJoin()
        if (this._bOnJoin) {
            this.onJoinMatch()
        }
    }

}
