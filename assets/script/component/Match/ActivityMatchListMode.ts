import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { MatchSvr } from "../../system/MatchSvr";
import { Helper } from "../../system/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ActivityMatchListMode extends BaseUI {

    onOpen() {

    }

    setParam(param) {
        this.param = param
        this.initData()
    }

    initData() {
        let data: IActivityMatchRankRow = this.param.data
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        this.setActive("bg", user.userId === data.user.userId)
        this.setActive("rank/1", data.rank === 0)
        this.setActive("rank/2", data.rank === 1)
        this.setActive("rank/3", data.rank === 2)
        this.setActive("rank/num", data.rank > 2)
        this.setLabelValue("rank/num", (data.rank + 1))
        this.setLabelValue("userName", data.user.userName)
        this.setSpriteFrame("avatar", data.user.avatar)
        this.setLabelValue("score", "得分:" + (data.score || 0))

        let awards = MatchSvr.GetAwards(this.param.matchId, data.rank + 1)
        this.setActive("award/wcoin", false)
        this.setActive("award/lottery", false)
        this.setActive("award/diamond", false)
        this.setActive("award/null", false)
        let idx = 0
        if (awards && awards.length > 0) {
            for (let i in awards) {
                if (awards[i].id === Constants.ITEM_INDEX.WCOIN) {
                    this.setActive("award/wcoin", true)
                    this.setLabelValue("award/wcoin/num", Helper.FormatNumWY(awards[i].num))
                    idx++
                } else if (awards[i].id === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("award/lottery", true)
                    this.setLabelValue("award/lottery/num", Helper.FormatNumWY(awards[i].num))
                    this.setActive("award/lottery/add", idx > 0)
                    idx++
                } else if (awards[i].id === Constants.ITEM_INDEX.DIAMOND) {
                    this.setActive("award/diamond", true)
                    this.setLabelValue("award/diamond/num", awards[i].num >= 10000 ? Helper.FormatNumWY(awards[i].num) : Helper.FormatNumPrice(awards[i].num / 100))
                    this.setActive("award/diamond/add", idx > 0)
                    idx++
                }
            }
        }

        this.setActive("award/null", idx === 0)
    }
}
