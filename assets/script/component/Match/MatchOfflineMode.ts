import BaseUI from "../../base/BaseUI";
import { MatchSvr } from "../../system/MatchSvr";
import { Constants } from "../../constants";
import { DataMgr } from "../../base/DataMgr";
import { User } from "../../system/User";
import { Helper } from "../../system/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchOfflineMode extends BaseUI {

    onLoad() {
        this.node.children.forEach(i => i.active = false)
    }

    onOpen() {
        this.initEvent()
        this.initData()
    }

    setParam(param) {
        this.param = param
        this.initData()
    }

    initEvent() {
        this.setButtonClick("btnOpen", this.onPressGetAwards.bind(this))
    }

    initData() {
        let data: IMatchDetail = this.param.data
        if (!data) {
            this.setActive("bg", this.param.idx % 2 === 1)
            return
        }

        this.node.children.forEach(i => i.active = true)
        this.setActive("bg", this.param.idx % 2 === 1)

        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)

        if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            if (undefined !== data.rank && null !== data.rank && !isNaN(data.rank)) {
                this.setLabelValue("result", "第" + (data.rank + 1) + "名")

                let items = MatchSvr.GetAwards(data.matchId, data.rank + 1)
                this.setActive("awards/wcoin", false)
                this.setActive("awards/lottery", false)
                this.setActive("awards/diamond", false)
                for (let i in items) {
                    if (items[i].id === Constants.ITEM_INDEX.WCOIN) {
                        this.setActive("awards/wcoin", true)
                        this.setLabelValue("awards/wcoin/num", Helper.FormatNumWY(items[i].num))
                    } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                        this.setActive("awards/lottery", true)
                        this.setLabelValue("awards/lottery/num", Helper.FormatNumWY(items[i].num))
                    } else if (items[i].id === Constants.ITEM_INDEX.DIAMOND) {
                        this.setActive("awards/diamond", true)
                        this.setLabelValue("awards/diamond/num", items[i].num >= 10000 ? Helper.FormatNumWY(items[i].num) : Helper.FormatNumPrice(items[i].num / 100))
                    }
                }
            } else {
                this.setLabelValue("result", "未上榜")

                this.setActive("awards/wcoin", false)
                this.setActive("awards/lottery", false)
                this.setActive("awards/diamond", false)
            }

            // this.setNodePositionY("result", 20)
            this.setLabelValue("matchName", data.name)

            // this.setSpriteFrame("avatar", user.avatar)
            this.setSpriteFrame("avatar", "image/match/huodongsai", true)
            this.setActive("vs", false)
            this.setLabelValue("name", "")
        } else {
            for (let idx in data.players) {
                let p = data.players[idx]
                if (p.win) {
                    if (p.openid === user.userId) {
                        this.setLabelValue("result", "您赢了")
                    } else {
                        this.setLabelValue("result", "您输了")
                        User.GetPlyDetail(p.openid, (ply: IPlayerData) => {
                            this.setLabelValue("name", ply.userName)
                        })
                    }
                }
                if (p.openid === user.userId) {
                    let items = MatchSvr.GetAwards(data.matchId, p.rank)
                    // this.setChildParam("awards/ItemMode", {items: MatchSvr.GetAwards(data.matchId, p.rank)})
                    this.setActive("awards/wcoin", false)
                    this.setActive("awards/lottery", false)
                    this.setActive("awards/diamond", false)
                    let idx = 0
                    for (let i in items) {
                        if (items[i].id === Constants.ITEM_INDEX.WCOIN) {
                            this.setActive("awards/wcoin", true)
                            this.setLabelValue("awards/wcoin/num", Helper.FormatNumWY(items[i].num))
                        } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                            this.setActive("awards/lottery", true)
                            this.setLabelValue("awards/lottery/num", Helper.FormatNumWY(items[i].num))
                        } else if (items[i].id === Constants.ITEM_INDEX.DIAMOND) {
                            this.setActive("awards/diamond", true)
                            this.setLabelValue("awards/diamond/num", items[i].num >= 10000 ? Helper.FormatNumWY(items[i].num) : Helper.FormatNumPrice(items[i].num / 100))
                        }
                        idx++
                    }
                } else {
                    User.GetPlyDetail(p.openid, (ply: IPlayerData) => {
                        this.setLabelValue("name", ply.userName)
                        this.setSpriteFrame("avatar", ply.avatar)
                    })
                }
            }
        }

        if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_AWARD) {
            this.setActive("LXJS-lihetubiao", true)
            this.setActive("awards", false)
            this.setLabelValue("result", "比赛完成")
        } else {
            this.setActive("LXJS-lihetubiao", false)
            let awards = this.getNode("awards")
            cc.tween(awards)
                .set({ opacity: 0, active: true })
                .delay(.2)
                .to(.2, { opacity: 255 })
                .start()
        }
    }

    onPressGetAwards() {
        let data: IMatchDetail = this.param.data
        MatchSvr.GetMatchAward(data.matchUuid, () => {
            data.playerState = Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMEOVER
            this.param.data = data
            this.initData()
        })
    }
}
