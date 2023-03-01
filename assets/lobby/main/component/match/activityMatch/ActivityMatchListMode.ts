import BaseUI from "../../../../start/script/base/BaseUI";
import { User } from "../../../../start/script/data/User";
import { MatchSvr } from "../../../../start/script/system/MatchSvr";
import { Constants } from "../../../../start/script/igsConstants";
import { Helper } from "../../../../start/script/system/Helper";


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
        this.setActive("bg", User.OpenID === data.user.openId)
        this.setActive("rank/1", data.rank === 0)
        this.setActive("rank/2", data.rank === 1)
        this.setActive("rank/3", data.rank === 2)
        this.setActive("rank/num", data.rank > 2)
        this.setLabelValue("rank/num", (data.rank + 1))
        this.setLabelValue("userName", data.user.userName)
        this.setSpriteFrame("avatar", data.user.avatar)
        this.setLabelValue("score", "得分:" + (data.score || 0))

        let awards = MatchSvr.GetAwards(this.param.matchId, data.rank + 1)
        this.setActive("award/gold", false)
        this.setActive("award/lottery", false)
        this.setActive("award/credits", false)
        this.setActive("award/null", false)
        let idx = 0
        if (awards && awards.length > 0) {
            for (let i in awards) {
                if (awards[i].id === Constants.ITEM_INDEX.GOLD) {
                    this.setActive("award/gold", true)
                    this.setLabelValue("award/gold/num", Helper.FormatNumWYCN(awards[i].num))
                    idx++
                } else if (awards[i].id === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("award/lottery", true)
                    this.setLabelValue("award/lottery/num", Helper.FormatNumWYCN(awards[i].num))
                    this.setActive("award/lottery/add", idx > 0)
                    idx++
                } else if (awards[i].id === Constants.ITEM_INDEX.CREDITS) {
                    this.setActive("award/credits", true)
                    this.setLabelValue("award/credits/num", Helper.FormatNumWYCN(awards[i].num))
                    this.setActive("award/credits/add", idx > 0)
                    idx++
                }
            }
        }

        this.setActive("award/null", idx === 0)
    }
}
