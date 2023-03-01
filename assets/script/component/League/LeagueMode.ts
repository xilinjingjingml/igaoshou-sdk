import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { DataMgr } from "../../base/DataMgr";
import { Helper } from "../../system/Helper";
import { User } from "../../system/User";
import { LeagueSvr } from "../../system/LeagueSvr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LeagueMode extends BaseUI {

    onOpen() {

    }

    initNode() {

    }

    initData() {
        let data: ILeagueRow = this.param.data
        if (!data) {
            return
        }

        let leagueId = this.param.leagueId

        let league = this.getNode("league")
        league.children.forEach(item => item.active = false)
        data.rank = Number(data.rank) || 0

        if (data.rank === 0) {
            this.setActive("league/1", true)
        } else if (data.rank === 1) {
            this.setActive("league/2", true)
        } else if (data.rank === 2) {
            this.setActive("league/3", true)
        } else if (data.rank) {
            this.setActive("league/n", true)
            this.setLabelValue("league/n/num", "" + (data.rank + 1))
        }

        if (data.user) {
            let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
            this.setActive("bg", data.user.userId === user.userId)
            // if (data.user.userId === user.userId) {
            //     this.setLabelValue("userName", user.userName)
            //     this.setSpriteFrame("avatar", user.avatar)
            //     this.setSpriteFrame("country", Helper.GetContry(user.region))
            // } else {
                this.setLabelValue("userName", data.user.userName || "未知用户")
                this.setSpriteFrame("avatar", data.user.avatar)
                this.setSpriteFrame("country", Helper.GetContry(user.region))
            // }
        }

        if (data.medal) {
            let medalId = data.type === Constants.LEAGUE_TYPE.PROFESSION_LEAGUE ? Constants.ITEM_INDEX.GoldenMedal : Constants.ITEM_INDEX.SilverMedal
            this.setActive("medal/silver", false)
            this.setActive("medal/gold", false)
            let idx = 0
            if (medalId === Constants.ITEM_INDEX.GoldenMedal) {
                this.setActive("medal/gold", true)
                this.setLabelValue("medal/gold/num", Helper.FormatNumWY(data.medal))
            } else if (medalId === Constants.ITEM_INDEX.SilverMedal) {
                this.setActive("medal/silver", true)
                this.setLabelValue("medal/silver/num", Helper.FormatNumWY(data.medal))
            } else {
                this.setActive("medal", false)
            }

            LeagueSvr.GetLeagueAwardConfigByRank(data.type, data.rank + 1, leagueId, (awards) => {
                if (awards && awards.length > 0) {                   
                    this.setActive("award/null", false)
                    this.setActive("award/wcoin", false)
                    this.setActive("award/lottery", false)
                    this.setActive("award/diamond", false)
                    for (let i in awards) {
                        if (awards[i].id === Constants.ITEM_INDEX.WCOIN) {
                            this.setActive("award/wcoin", true)
                            this.setLabelValue("award/wcoin/num", Helper.FormatNumWY(awards[i].num))
                        } else if (awards[i].id === Constants.ITEM_INDEX.LOTTERY) {
                            this.setActive("award/lottery", true)
                            this.setLabelValue("award/lottery/num", Helper.FormatNumWY(awards[i].num))
                            this.setActive("award/lottery/add", idx > 0)
                        } else if (awards[i].id === Constants.ITEM_INDEX.DIAMOND) {
                            this.setActive("award/diamond", true)
                            this.setLabelValue("award/diamond/num", awards[i].num >= 10000 ? Helper.FormatNumWY(awards[i].num) : Helper.FormatNumPrice(awards[i].num / 100))
                            this.setActive("award/diamond/add", idx > 0)
                        }
                    }
                } else {
                    this.setActive("award/wcoin", false)
                    this.setActive("award/lottery", false)
                    this.setActive("award/diamond", false)
                    this.setActive("award/null", true)
                }
            })

            this.setActive("self", !!this.param.self)
        }
    }

    setParam(param) {
        this.param = param
        this.initData()
    }
}
