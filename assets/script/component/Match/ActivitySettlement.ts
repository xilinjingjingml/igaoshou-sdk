import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { Helper } from "../../system/Helper";
import { MatchSvr } from "../../system/MatchSvr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ActivitySettlement extends BaseUI {

    _content: cc.Node = null
    _mode: cc.Node = null

    _matchId: string = ""

    onLoad() {
        this._content = this.getNode("content/list/view/content")
        this._mode = this.getNode("content/list/view/ActivityMatchListMode")
        this._mode.active = false
    }

    onOpen() {
        this.initEvent()
        this.initData()
    }

    onClose() {
    }

    initEvent() {

    }

    initData() {
        let top = this.getNode("top", this.node.parent.parent.parent)
        top.children.forEach(i => i.active = false)

        let data: IMatchDetail = this.param.data
        this._matchId = data.matchId

        this.setLabelValue("content/time/value", Helper.FormatTimeString(data.expireTime * 1000, "结束时间: yyyy年MM月dd日 hh:mm"))

        MatchSvr.GetActivityMatchRankList(data.matchUuid, 0, 2, (res) => {
            this.updateRankList(res)
            this.updateSelf(res)
        })
    }

    updateRankList(data) {
        for (let i = 0; i < 3; i++) {
            let row: IActivityMatchRankRow = data.rows[i]
            if (row) {
                let item = cc.instantiate(this._mode)
                item.name = row.rank + ""
                item.parent = this._content
                item.active = true
                this.setChildParam(item, { matchId: this._matchId, data: row })
            }
        }
    }

    updateSelf(data) {
        let row: IActivityMatchRankRow = data.self
        if (row && row.rank >= 3) {
            let item = cc.instantiate(this._mode)
            item.name = row.rank + ""
            item.parent = this._content
            item.active = true
            this.setChildParam(item, { matchId: this._matchId, data: row })
        }

        if (row && undefined !== row.rank && null !== row.rank && !isNaN(row.rank)) {
            this.setLabelValue("content/info/leagueNum", row.rank + 1)
            let awards = MatchSvr.GetAwards(this._matchId, row.rank + 1)
            if (awards && awards.length > 0) {
                this.setActive("content/info/awards", true)
                this.setActive("content/info/awardVal", false)
                this.setActive("content/info/awards/wcoin", false)
                this.setActive("content/info/awards/lottery", false)
                this.setActive("content/info/awards/diamond", false)
                let idx = 0
                for (let i in awards) {
                    if (awards[i].id === Constants.ITEM_INDEX.WCOIN) {
                        this.setActive("content/info/awards/wcoin", true)
                        this.setLabelValue("content/info/awards/wcoin/num",  Helper.FormatNumWY(awards[i].num))
                    } else if (awards[i].id === Constants.ITEM_INDEX.LOTTERY) {
                        this.setActive("content/info/awards/lottery", true)
                        this.setLabelValue("content/info/awards/lottery/num", Helper.FormatNumWY(awards[i].num))
                        this.setActive("content/info/awards/lottery/add", idx > 0)
                    } else if (awards[i].id === Constants.ITEM_INDEX.DIAMOND) {
                        this.setActive("content/info/awards/diamond", true)
                        this.setLabelValue("content/info/awards/diamond/num", awards[i].num >= 10000 ? Helper.FormatNumWY(awards[i].num) : Helper.FormatNumPrice(awards[i].num / 100))
                        this.setActive("content/info/awards/diamond/add", idx > 0)
                    }
                    idx ++
                }
            } else {
                this.setActive("content/info/awards", false)
                this.setActive("content/info/awardVal", true)
            }  
        } else {
            this.setLabelValue("content/info/leagueNum", "未上榜")
            this.setActive("content/info/awards", false)
                this.setActive("content/info/awardVal", true)
        }         
    }
}
