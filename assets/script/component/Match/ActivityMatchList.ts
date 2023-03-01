import BaseUI from "../../base/BaseUI";
import { Helper } from "../../system/Helper";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { MatchSvr } from "../../system/MatchSvr";

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
                MatchSvr.GetActivityMatchRankList(data.matchId, this._start, this._start + PAGE_NUM - 1, (res) => {
                    this.updateRankList(data)
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
                    awards[j.id] = {id: j.id, num: j.num * (match.awards[i].end - match.awards[i].start + 1)}
                }
            }
        }

        let idx =0
        this.setActive("detail/award/wcoin", false)
        this.setActive("detail/award/lottery", false)
        this.setActive("detail/award/diamond", false)
        for (let i in awards) {
            if (awards[i].id === Constants.ITEM_INDEX.WCOIN) {
                this.setActive("detail/award/wcoin", true)
                this.setLabelValue("detail/award/wcoin/num", Helper.FormatNumWY(awards[i].num))
            } else if (awards[i].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive("detail/award/lottery", true)
                this.setLabelValue("detail/award/lottery/num", Helper.FormatNumWY(awards[i].num))
                this.setActive("detail/award/lottery/add", idx > 0)
            } else if (awards[i].id === Constants.ITEM_INDEX.DIAMOND) {
                this.setActive("detail/award/diamond", true)
                this.setLabelValue("detail/award/diamond/num", awards[i].num >= 10000 ? Helper.FormatNumWY(awards[i].num) : Helper.FormatNumPrice(awards[i].num / 100))
                this.setActive("detail/award/diamond/add", idx > 0)
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
    }

    onPressDetail() {
        // let matchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        // if (matchs && matchs[this._matchId]) {
            let data = this.param.data
            // Helper.OpenPageUI("component/Match/MatchDetailEntry", "", null, { match: matchs[this._matchId] })
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
                        Helper.OpenPageUI("component/Match/MatchDetailEntry", "", null, { match: data })
                    // } else {
                    //     UIMgr.OpenUI("component/Match/ActivityMatchList", { param: { data: result } })
                    // }
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
        this.close()
    }

    onPressCopy() {
        let data: IMatchDetail = this.param.data
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        let msg = "openid：" + user.userId + "\n"
        msg += "match_id：" + data.matchUuid

        Helper.copyToClipBoard(msg)
    }

}
