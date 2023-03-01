import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { User } from "../../system/User";
import { MatchSvr } from "../../system/MatchSvr";
import { Helper } from "../../system/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchTreeChapMode extends BaseUI {

    onOpen() {
        this.initData()
    }

    initData() {
        let roundId = this.param.roundId
        let data: IMatchDetail = this.param.data
        let round = data.rounds[roundId]
        this.setActive("link0/fill", false)
        for (let p of round) {
            if (p.openid && p.win) {
                User.GetPlyDetail(p.openid, (ply: IPlayerData) => {
                    this.setLabelValue("champion/player/userName", ply.userName)
                    this.setSpriteFrame("champion/player/avatar", ply.avatar)
                })
                this.setActive("link0/fill", true)
                break
            }
        }

        let awards = MatchSvr.GetAwards(data.matchId, 1)
        awards = awards.filter(i => i.id !== Constants.ITEM_INDEX.GoldenMedal && i.id !== Constants.ITEM_INDEX.SilverMedal)
        // this.setChildParam("champion/award/ItemMode", {items: awards})
        this.setActive("champion/award/wcoin", false)
        this.setActive("champion/award/lottery", false)
        this.setActive("champion/award/diamond", false)
        let idx = 0
        for (let i in awards) {
            if (awards[i].id === Constants.ITEM_INDEX.WCOIN) {
                this.setActive("champion/award/wcoin", true)
                this.setLabelValue("champion/award/wcoin/num", Helper.FormatNumWY(awards[i].num))
            } else if (awards[i].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive("champion/award/lottery", true)
                this.setLabelValue("champion/award/lottery/num", Helper.FormatNumWY(awards[i].num))
                this.setActive("champion/award/lottery/add", idx > 0)
            } else if (awards[i].id === Constants.ITEM_INDEX.DIAMOND) {
                this.setActive("champion/award/diamond", true)
                this.setLabelValue("champion/award/diamond/num", awards[i].num >= 10000 ? Helper.FormatNumWY(awards[i].num) : Helper.FormatNumPrice(awards[i].num / 100))
                this.setActive("champion/award/diamond/add", idx > 0)
            }
            idx++
        }
    }
}
