import BaseUI from "../../../../start/script/base/BaseUI";
import { User } from "../../../../start/script/data/User";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { MatchSvr } from "../../../../start/script/system/MatchSvr";
import { Helper } from "../../../../start/script/system/Helper";

const { ccclass, property } = cc._decorator;

const COUNT_DOWN_TIME = 3
const SEARCH_TIP = "正在寻找对手..."

@ccclass
export default class MultiplayerMatchStart extends BaseUI {

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
    }

    onClose() {
        this.onPressCancel()
    }

    onEnterEnd() {
        this.initNode()
    }

    initNode() {
        let btnBack = this.getNode("top/btnBack", this.node.parent.parent.parent.parent)
        if (btnBack) {
            btnBack.active = false

            if (User.AllGame > 1) {
                let newBtn = cc.instantiate(btnBack)
                newBtn.active = true
                newBtn.parent = btnBack.parent
                newBtn.getComponent(cc.Button).clickEvents = []
                this.setButtonClick(newBtn, this.onPressCancel.bind(this))
            }
        }
    }

    initEvent() {
        this.setButtonClick("content/btm/btnStart", this.onPressStart.bind(this))

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

        // 对手信息
        let mode = this.getNode("content/battle/players/view/content/player")
        for (let i = 0; i < this._match.roundPlayer - 1; i++) {
            let item = cc.instantiate(mode)
            item.name = i + ""
            item.parent = this.getNode("content/battle/players/view/content")
            this.setActive("self", item, false)
            this.setActive("state", item, true)
            this.setActive("userName", item, false)
            this.setActive("country", item, false)
            this.setActive("areaInfo", item, false)

            let idx = 0
            this.runTween("state", item, cc.tween().repeatForever(cc.tween()
            .delay(.5).call(() => {
                    this.setLabelValue("state", item, SEARCH_TIP.substring(0, 6 + (idx++ % 4)))
            })))
        }

        this.setActive("self", mode, true)
        this.setActive("state", mode, false)
        this.setLabelValue("userName", mode, User.UserName)
        this.setSpriteFrame("face/avatar", mode, User.Avatar)

        if (DataMgr.data.Config.env != 2) {
            this.setActive("country", mode, false)
            this.setActive("areaInfo", mode, true)
            this.setLabelValue("areaInfo/Label", mode, User.Region)
        } else {
            this.setActive("country", mode, true)
            this.setActive("areaInfo", mode, false)
        }

        let num = 0
        if (this._match.roundPlayer <= 5) {
            num = this._match.roundPlayer
        } if (this._match.roundPlayer > 5) {
            num = 5.5
        }
        this.setNodeHeight("content/battle/players", mode.height * num + 28 + (num - 1) * 15)

            this.countdown(COUNT_DOWN_TIME)

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

        // 底部信息
        if (awards) {
            this.setItems("content/btm/matchInfo/detail/awards", awards)
        }

        let free = true
        this._match.gateMoney.forEach(i => i.num > 0 ? free = false : "")
        if (this._match.freeAd || free) {
            this.setLabelValue("content/btm/matchInfo/gateMoney/tip", "免费入场")
            this.setActive("content/btm/matchInfo/gateMoney/gold", false)
            this.setActive("content/btm/matchInfo/gateMoney/lottery", false)
        } else {
            this.setItems("content/btm/matchInfo/gateMoney", this._match.gateMoney)
        }

        this.setLabelValue("content/btm/matchInfo/players/name", this._match.maxPlayer + " 玩家")
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

    updateOpponents(opponents: any[]) {
        let content = this.getNode("content/battle/players/view/content")
        for (let i = 0; i < opponents.length; i++) {
            if (opponents[i].openid === User.OpenID)
                continue

            this.setActive(i + "/userName", content, true)
            this.setLabelValue(i + "/userName", content, opponents[i].nickname)
            this.setSpriteFrame(i + "/face/avatar", content, opponents[i].headimage, true)
            this.setActive(i + "/state", content, false)

            if (DataMgr.data.Config.env != 2) {
                let region = "上海市"
                if (opponents[i].area_info) {
                    let s = opponents[i].area_info.split("|")
                    region = s[1] || s[0]
                }
                this.setActive(i + "/country", content, false)
                this.setActive(i + "/areaInfo", content, true)
                this.setLabelValue(i + "/areaInfo/Label", content, region)
            } else {
                this.setActive(i + "/country", content, true)
                this.setActive(i + "/areaInfo", content, false)
            }
        }
    }

    onPressStart() {
        if (this._bStart)
            return

        this._startTime = Date.now() + 2000
        this.setButtonInfo("content/btm/btnStart", { interactable: false })
        this.setActive("GamePage/top/btnBack", cc.Canvas.instance.node, false)
        MatchSvr.EnterMatch(this._match.matchId, null, (res) => {
            if (!res) {
                this.setButtonInfo("content/btm/btnStart", { interactable: true })
                this.setActive("GamePage/top/btnBack", cc.Canvas.instance.node, true)
                return
            }

            this._bStart = true
            let delay = Math.max(0, (this._startTime - Date.now()) / 1000)

            if (res && res.opponent_list) {
                this.updateOpponents(res.opponent_list)
            }

            this.scheduleOnce(() => this.onJoinMatch(), delay + .5)
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
                // this.close()
            })
        }
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

    onPause() {
        this._bPause = true
        this.getNode("content/btm/matchInfo/countdown/num").pauseAllActions()
        MatchSvr.PauseJoin()
    }

    onResume() {
        this._bPause = false
        this.getNode("content/btm/matchInfo/countdown/num").resumeAllActions()
        MatchSvr.ResumeJoin()
        if (this._bOnJoin) {
            this.onJoinMatch()
        }
    }

}
