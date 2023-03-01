import BaseUI from "../../../../start/script/base/BaseUI";
import { UserSrv } from "../../../../start/script/system/UserSrv";
import { MatchSvr } from "../../../../start/script/system/MatchSvr";
import { Constants } from "../../../../start/script/igsConstants";
import { Helper } from "../../../../start/script/system/Helper";

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
                UserSrv.GetPlyDetail(p.openid, (ply: IPlayerData) => {
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
        this.setActive("champion/award/gold", false)
        this.setActive("champion/award/lottery", false)
        this.setActive("champion/award/credits", false)
        let idx = 0
        for (let i in awards) {
            if (awards[i].id === Constants.ITEM_INDEX.GOLD) {
                this.setActive("champion/award/gold", true)
                this.setLabelValue("champion/award/gold/num", Helper.FormatNumWYCN(awards[i].num))
            } else if (awards[i].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive("champion/award/lottery", true)
                this.setLabelValue("champion/award/lottery/num", Helper.FormatNumWYCN(awards[i].num))
                this.setActive("champion/award/lottery/add", idx > 0)
            } else if (awards[i].id === Constants.ITEM_INDEX.CREDITS) {
                this.setActive("champion/award/credits", true)
                this.setLabelValue("champion/award/credits/num", Helper.FormatNumWYCN(awards[i].num))
                this.setActive("champion/award/credits/add", idx > 0)
            }
            idx++
        }
    }
}
