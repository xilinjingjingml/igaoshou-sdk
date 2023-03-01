import BaseUI from "../../../../start/script/base/BaseUI";
import { Constants } from "../../../../start/script/igsConstants";
import { UIMgr } from "../../../../start/script/base/UIMgr";
import { MatchSvr } from "../../../../start/script/system/MatchSvr";
import { Helper } from "../../../../start/script/system/Helper";
import { DataMgr } from "../../../../start/script/base/DataMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchTree extends BaseUI {

    _content: cc.Node = null

    _turnNum: number = 0
    _maxTurn: number = 0

    _bMoveAni: boolean = false
    _bPauseMoveEvent: boolean = false

    onOpen() {
        this.initNode()
        this.initEvent()
        this.initData()
    }

    initNode() {
        this._content = this.getNode("tree/view/content")
    }

    initEvent() {
        this.setButtonClick("round/direct/btnPrev", this.onPressPrev.bind(this))
        this.setButtonClick("round/direct/btnNext", this.onPressNext.bind(this))

        this.setButtonClick("btm/start/btnDetail", this.onPressDetail.bind(this))
        this.setButtonClick("btm/start/btnStart", this.onPressStart.bind(this))
        this.setButtonClick("btm/btnNewTurn", this.onPressNewTurn.bind(this))
        this.setButtonClick("btm/btnBack", this.onPressBack.bind(this))

        this.setScrollViewEvent("tree", this.onContentMove.bind(this))
    }

    initData() {
        let data: IMatchDetail = this.param.data
        if (!data) {
            return
        }

        // 填充普通页
        this._content.width = cc.winSize.width * (data.totalStage + 1)
        this._maxTurn = data.totalStage
        this._turnNum = data.curStage
        if (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SETTLE && data.roundState === Constants.MATCH_ROUND_STATE.ROUND_STATE_GAMEOVER) {
            this._turnNum++
        } else if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMEOVER && data.matchState === Constants.MATCH_STATE.COMPLETE) {
            this._turnNum++
        }
        let idx = 0
        for (let i in data.stages) {
            let node = new cc.Node()
            node.name = "round_" + idx
            node.width = this.node.width
            node.anchorY = 1
            node.parent = this._content

            node.addComponent(cc.Layout)
            this.setLayoutInfo(node, { vertical: true, resizeMode: cc.Layout.ResizeMode.CONTAINER })
            node.on(cc.Node.EventType.SIZE_CHANGED, () => this._content.height = Math.max(this._content.height, node.height))

            let j = 0
            cc.tween(node)
                .repeat(data.stages[i].length,
                    cc.tween()
                        .delay(.1 * (idx + 1))
                        .call(() => {
                            UIMgr.OpenUI("lobby", "component/match/tourney/MatchTreeMode",
                                {
                                    parent: node,
                                    position: cc.v3(cc.winSize.width / 2),
                                    name: "group_" + j,
                                    param: { data: data, roundId: data.stages[i][j], round: i, group: j, finals: idx === data.stages.length - 1 }
                                })
                            j++
                        }))
                .start()
            idx++
        }

        // 填充冠军页
        let node = new cc.Node()
        node.name = "round_" + idx
        node.width = this.node.width
        node.anchorY = 1
        node.parent = this._content

        let widget = node.addComponent(cc.Widget)
        widget.isAlignTop = true
        widget.isAlignBottom = true
        widget.top = 0
        widget.bottom = 0
        widget.alignMode = cc.Widget.AlignMode.ALWAYS

        cc.tween(node)
            .delay(.1 * (idx + 1))
            .call(() => {
                UIMgr.OpenUI("lobby", "component/match/tourney/MatchTreeChapMode",
                    {
                        parent: node,
                        position: cc.v3(cc.winSize.width / 2),
                        name: "group_0",
                        param: { data: data, roundId: data.stages[data.stages.length - 1][0] }
                    })
            })
            .start()

        // 更新页面信息
        this.updateContentPos()
        this.updateRound()
        this.setChildParam("tip/award", { items: data.awards })
        this.setLabelValue("tip/state", data.curStage === this._maxTurn ? "开始决赛" : "开始第" + (data.curStage + 1) + "轮比赛")
        let awards = MatchSvr.GetAwards(data.matchId, Math.pow(2, (this._maxTurn - data.curStage)))
        awards = awards.filter(i => i.id !== Constants.ITEM_INDEX.GoldenMedal && i.id !== Constants.ITEM_INDEX.SilverMedal && i.id !== Constants.ITEM_INDEX.Exp)
        // this.setChildParam("tip/award/ItemMode", { items: awards })
        this.setActive("tip/award/gold", false)
        this.setActive("tip/award/lottery", false)
        this.setActive("tip/award/credits", false)
        let k = 0
        for (let i in awards) {
            if (awards[i].id === Constants.ITEM_INDEX.GOLD) {
                this.setActive("tip/award/gold", true)
                this.setLabelValue("tip/award/gold/num", Helper.FormatNumWYCN(awards[i].num))
            } else if (awards[i].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive("tip/award/lottery", true)
                this.setLabelValue("tip/award/lottery/num", Helper.FormatNumWYCN(awards[i].num))
                this.setActive("tip/award/lottery/add", k > 0)
            } else if (awards[i].id === Constants.ITEM_INDEX.CREDITS) {
                this.setActive("tip/award/credits", true)
                this.setLabelValue("tip/award/credits/num", Helper.FormatNumWYCN(awards[i].num))
                this.setActive("tip/award/credits/add", k > 0)
            }
            k++
        }

        // 更新按钮状态
        this.setActive("tip", false)
        this.setActive("btm/start", false)
        this.setActive("btm/btnNewTurn", false)
        this.setActive("btm/btnBack", false)

        if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMING) {
            if (data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING ||
                data.battleState === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_REBATTLE) {
                this.setActive("tip", true)
                this.setActive("btm/start", true)
            } else {
                this.setNodeHeight("tree", this.node.height - 100 - this.getNode("btm/btnBack").height - 20)
                this.setActive("btm/btnBack", true)
            }
        } else if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMEOVER) {
            this.setActive("btm/btnNewTurn", true)
            this.setActive("btm/btnBack", true)
            this.setNodeHeight("tree", this.node.height - 100 - this.getNode("btm/btnNewTurn").height - this.getNode("btm/btnBack").height - 30)
        } else {
            this.setActive("btm/btnBack", true)
            this.setNodeHeight("tree", this.node.height - 100 - this.getNode("btm/btnBack").height - 20)
        }
    }

    updateRound() {
        let data: IMatchRoundInfo = this.param.data
        if (!data) {
            return
        }

        let pageName = (num) => {
            return num > this._maxTurn ? "冠军" : num === this._maxTurn ? "决赛" : "第" + num + "轮"
        }

        this.setLabelValue("round/count/num", pageName(this._turnNum + 1))

        // this.setChildParam("round/award", { items: data && data.roundAwards && data.roundAwards[this._turnNum] })
        this.setActive("round/award/gold", false)
        this.setActive("round/award/lottery", false)
        this.setActive("round/award/credits", false)
        // if (data && data.roundAwards) {
        let items = MatchSvr.GetAwards(data.matchId, Math.pow(2, this._maxTurn - this._turnNum))
        let idx = 0
        for (let i in items) {
            if (items[i].id === Constants.ITEM_INDEX.GOLD) {
                this.setActive("round/award/gold", true)
                this.setLabelValue("round/award/gold/num", Helper.FormatNumWYCN(items[i].num))
            } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive("round/award/lottery", true)
                this.setLabelValue("round/award/lottery/num", Helper.FormatNumWYCN(items[i].num))
                this.setActive("round/award/lottery/add", idx > 0)
            } else if (items[i].id === Constants.ITEM_INDEX.CREDITS) {
                this.setActive("round/award/credits", true)
                this.setLabelValue("round/award/credits/num", Helper.FormatNumWYCN(items[i].num))
                this.setActive("round/award/credits/add", idx > 0)
            }
            idx++
        }
        // }

        this.setLabelValue("round/direct/btnPrev/name", pageName(this._turnNum))
        this.setLabelValue("round/direct/btnNext/name", pageName(this._turnNum + 2))

        this.setActive("round/direct/btnPrev", this._turnNum > 0)
        this.setActive("round/direct/btnNext", this._turnNum < this._maxTurn)

        let awards = MatchSvr.GetAwards(data.matchId, Math.pow(2, (this._maxTurn - this._turnNum)))
        awards = awards.filter(i => i.id !== Constants.ITEM_INDEX.GoldenMedal && i.id !== Constants.ITEM_INDEX.SilverMedal && i.id !== Constants.ITEM_INDEX.Exp)
        this.setChildParam("round/award/ItemMode", { items: awards })
    }

    updateContentPos() {
        this.stopTween(this._content)
        cc.tween(this._content)
            .to(0.2, { position: cc.v3(cc.winSize.width * -this._turnNum - cc.winSize.width / 2, this._content.position.y) })
            .start()
    }

    onContentMove(sender, eventType, customEventData) {
        // if (eventType === cc.ScrollView.EventType.SCROLL_ENDED) {
        let x = -this._content.position.x
        let n = (x - cc.winSize.width / 2) / cc.winSize.width
        if (n % 1 > .7) {
            this._turnNum = Math.ceil(n)
        } else if (n % 1 < .3) {
            this._turnNum = Math.floor(n)
        }
        this._turnNum = this._turnNum < 0 ? 0 : this._turnNum
        this._turnNum = this._turnNum >= this._maxTurn + 1 ? this._maxTurn : this._turnNum
        // this.updateContentPos()
        this.updateRound()
        // }
    }

    onPressPrev() {
        if (this._bMoveAni)
            return

        this._turnNum--
        this.updateContentPos()
        this.updateRound()
    }

    onPressNext() {
        if (this._bMoveAni)
            return

        this._turnNum++
        this.updateContentPos()
        this.updateRound()
    }

    onPressDetail() {
        let data: IMatchDetail = this.param.data
        if (!data) {
            return
        }

        let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        if (!matchs || !matchs[data.matchId]) {
            this.close()
            return
        }

        UIMgr.OpenUI("igaoshou", "component/matchDetail/MatchDetail", { param: { match: matchs[data.matchId] } }, () => this.close())
    }

    onPressNewTurn() {
        let data: IMatchDetail = this.param.data
        if (!data) {
            return
        }

        let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        if (!matchs || !matchs[data.matchId]) {
            this.close()
            return
        }

        UIMgr.OpenUI("igaoshou", "component/matchDetail/MatchDetail", { param: { match: matchs[data.matchId] } }, () => this.close())
        // MatchSvr.JoinMatch(data.matchId)
    }

    onPressStart() {
        let data: IMatchDetail = this.param.data
        if (!data) {
            return
        }

        // MatchSvr.EnterMatch(data.matchUuid)
        MatchSvr.EnterMatch(data.matchId, data.matchUuid, () => { MatchSvr.StartGame(); this.close() })
    }

    onPressBack() {
        UIMgr.CloseUI("component/matchDetail/MatchDetail")
        this.close()
    }
}
