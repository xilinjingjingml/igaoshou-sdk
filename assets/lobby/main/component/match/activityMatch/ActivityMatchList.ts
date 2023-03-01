import BaseUI from "../../../../start/script/base/BaseUI";
import { Helper } from "../../../../start/script/system/Helper";
import { PluginMgr } from "../../../../start/script/base/PluginMgr";
import { MatchSvr } from "../../../../start/script/system/MatchSvr";
import { Constants } from "../../../../start/script/igsConstants";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { UIMgr } from "../../../../start/script/base/UIMgr";
import { PlatformApi } from "../../../../start/script/api/platformApi";
import { User } from "../../../../start/script/data/User";


const { ccclass, property } = cc._decorator;

const PAGE_NUM = 30

@ccclass
export default class ActivityMatchList extends BaseUI {
    _content: cc.Node = null
    _mode: cc.Node = null

    _matchId: string = ""
    _matchUuid: string = ""

    _start: number = 0

    onLoad() {
        this._content = this.getNode("main/view/content")
        this._mode = this.getNode("main/view/ActivityMatchListMode")
        this._mode.active = false

        if ((!Helper.isNative() && (cc.sys.OPPO_GAME == cc.sys.platform || cc.sys.VIVO_GAME == cc.sys.platform))
            || (cc.sys.BYTEDANCE_GAME === cc.sys.platform || PluginMgr.isH52345Game())) {
            this.setActive("btns/btnShare", false)
            let btnBack = cc.find("btns/btnBack", this.node)
            let Background = cc.find("btns/btnBack/Background", this.node)
            let btnPlay = cc.find("btns/btnPlay", this.node)
            btnBack.width = btnPlay.width
            Background.width = btnPlay.width
            btnBack.x = btnPlay.x
        }
    }

    onOpen() {
        this.initEvent()
        this.initData()
    }

    onClose() {
        cc.log("activity match list close")
    }

    initEvent() {
        this.setButtonClick("detail/btnDetail", this.onPressDetail.bind(this))
        this.setButtonClick("detail/btnCopy", this.onPressCopy.bind(this))
        this.setButtonClick("btns/btnPlay", this.onPressPlay.bind(this))
        this.setButtonClick("btns/btnBack", this.onPressBack.bind(this))
        this.setButtonClick("btns/btnShare", this.onPressShare.bind(this))

        this.setScrollViewEvent("main", (sender, event, data) => {
            if (event === cc.ScrollView.EventType.SCROLL_TO_BOTTOM) {
                let data: IMatchDetail = this.param.data
                MatchSvr.GetActivityMatchRankList(data.matchUuid, this._start, this._start + PAGE_NUM - 1, (res) => {
                    this.updateRankList(res)
                })
            }
        })
    }

    initData() {
        let data: IMatchDetail = this.param.data
        let match = MatchSvr.GetMatchInfo(data.matchId)

        this.setLabelValue("top/title", data.name)

        if (data.expireTime > Date.now() / 1000) {
            let time = Math.ceil(data.expireTime - Date.now() / 1000)
            let label = this.getNodeComponent("top/countdwon/times", cc.Label)
            label.node.stopAllActions()
            cc.tween(label.node)
                .repeatForever(
                    cc.tween()
                        .delay(1)
                        .call(() => {
                            let time = Math.ceil(data.expireTime - Date.now() / 1000)
                            label.string = Helper.FormatTimeString(time-- * 1000, "hh:mm:ss")
                            if (time <= 0) {
                                this.setLabelValue("top/countdwon/tip", "")
                                label.string = "比赛已结束"
                                label.node.stopAllActions()
                            }
                        })
                )
                .start()
        } else {
            this.setLabelValue("top/countdwon/tip", "")
            this.setLabelValue("top/countdwon/times", "比赛已结束")
        }

        // let awards = MatchSvr.GetAwards(match.matchId, 1)
        // let showAwards = awards.filter(i => i.id === match.gateMoney[0].id)
        // if (showAwards.length === 0)
        //     showAwards = awards.filter(i => i.id === Constants.ITEM_INDEX.LOTTERY)
        // if (showAwards.length === 0)
        //     showAwards = awards.filter(i => i.id === Constants.ITEM_INDEX.DIAMOND)
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
        this.setActive("detail/award/gold", false)
        this.setActive("detail/award/lottery", false)
        this.setActive("detail/award/credits", false)
        for (let i in awards) {
            if (awards[i].id === Constants.ITEM_INDEX.GOLD) {
                this.setActive("detail/award/gold", true)
                this.setLabelValue("detail/award/gold/num", Helper.FormatNumWYCN(awards[i].num))
            } else if (awards[i].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive("detail/award/lottery", true)
                this.setLabelValue("detail/award/lottery/num", Helper.FormatNumWYCN(awards[i].num))
                this.setActive("detail/award/lottery/add", idx > 0)
            } else if (awards[i].id === Constants.ITEM_INDEX.CREDITS) {
                this.setActive("detail/award/credits", true)
                this.setLabelValue("detail/award/credits/num", Helper.FormatNumWYCN(awards[i].num))
                this.setActive("detail/award/credits/add", idx > 0)
            } else {
                continue
            }
            idx++
        }

        this.setLabelValue("detail/matchId", "比赛ID:" + data.matchUuid.substr(0, 8))

        this._matchId = data.matchId
        this._matchUuid = data.matchUuid
        this.setActive("btns/btnPlay", data.totalStage > data.curStage && data.expireTime > Date.now() / 1000)
        MatchSvr.GetActivityMatchRankList(data.matchUuid, this._start, this._start + PAGE_NUM - 1, (res) => {
            this.updateRankList(res)
        })

        this.setLabelValue("btns/btnPlay/num", "剩余" + (data.totalStage - data.curStage) + "次")

        let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        let matchData = matchs[this._matchId]
        if (matchData.freeAd) {
            this.setActive("btns/btnPlay/Background/bofang", true)
        }
    }

    updateRankList(data) {
        for (let i = this._start; i < this._start + PAGE_NUM; i++) {
            let row: IActivityMatchRankRow = data.rows[i]
            if (row) {
                let item = cc.instantiate(this._mode)
                item.name = row.rank + ""
                item.parent = this._content
                item.active = true
                this.setChildParam(item, { matchId: this._matchId, data: row })
            }
        }

        this._start += PAGE_NUM

        this.updateSelfRank(data)
    }

    updateSelfRank(data) {
        let row: IActivityMatchRankRow = data.self
        if (row) {
            let item = this.getNode("myRank", this._content.parent)
            if (!item || item.name === "New Node") {
                item = cc.instantiate(this._mode)
                item.name = "myRank"
                item.parent = this._content.parent
                // item.position = cc.Vec3.ZERO
                // item.active = true

                let setItemPos = () => {
                    if (this._content.position.y / this._mode.height > row.rank) {
                        item.active = true
                        item.position = cc.v3(0, 0 - this._mode.height / 2)
                    } else if ((this._content.position.y + this._content.parent.height - this._mode.height) / this._mode.height < row.rank) {
                        item.active = true
                        item.position = cc.v3(0, -this._content.parent.height + this._mode.height / 2)
                    } else {
                        item.active = false
                    }
                }

                this._content.on(cc.Node.EventType.POSITION_CHANGED, () => {
                    setItemPos()
                }, this, true)

                setItemPos()
            }

            this.setChildParam(item, { matchId: this._matchId, data: row })
        }
    }

    onPressDetail() {
        // let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        // if (matchs && matchs[this._matchId]) {
        let data = this.param.data
        MatchSvr.GetActivityMatch(data.matchUuid, (result) => {
            if (result) {
                let matchs: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
                if (matchs[data.matchId]) {
                    matchs[data.matchId].curTimes = result.curStage || 0
                    DataMgr.setData(Constants.DATA_DEFINE.MATCH_CONFIG, matchs)
                }

                // if (!result.curStage) {
                data.maxTimes = data.totalStage
                data.endTime = data.expireTime
                UIMgr.OpenUI("igaoshou", "component/matchDetail/MatchDetail", { param: { match: data } })
            }
        })
        // }
    }

    onPressPlay() {
        let data: IMatchDetail = this.param.data
        if (data.totalStage > data.curStage) {
            // MatchSvr.EnterMatch(this._matchId, this._matchUuid, () => MatchSvr.StartGame())
            MatchSvr.JoinMatch(this._matchId, this._matchUuid, () => this.close())
        }
    }

    onPressShare() {
        Helper.shareInfo()
    }

    onPressBack() {
        if (cc.director.getScene().name === "result") {
            PlatformApi.GotoLobby()
        } else {
            this.close()
        }
    }

    onPressCopy() {
        let data: IMatchDetail = this.param.data
        let msg = "openid：" + User.OpenID + "\n"
        msg += "match_id：" + data.matchUuid

        Helper.copyToClipBoard(msg)
    }

}
