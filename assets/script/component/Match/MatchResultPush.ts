import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { User } from "../../system/User";
import { MatchSvr } from "../../system/MatchSvr";
import { Helper } from "../../system/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchResultPush extends BaseUI {

    // _itemMode: cc.Node = null

    onOpen() {
        this.initData()
        this.initEvent()
    }

    initData() {
        let itemMode = this.getNode("results/scroll/view/content/item")
        let content = this.getNode("results/scroll/view/content")

        let data: TResults = this.param
        // data = data.filter(i => i.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH)
        let height = itemMode.height
        height *= data.length >= 4 ? 4 : data.length
        
        this.setNodeHeight("results/scroll", height)
        this.setLabelValue("results/title/val", "您有" + data.length + "场比赛已经结束：")

        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)

        for (let idx in data) {
            let node = cc.instantiate(itemMode)
            node.parent = content
            let d = data[idx]

            for (let idx in d.players) {
                let p = d.players[idx]
                if (p.win) {
                    if (p.openid === user.userId) {
                        this.setLabelValue("result", node, "您赢了")
                    } else {
                        this.setLabelValue("result", node, "您输了")                        
                    }
                }
                if (p.openid === user.userId) {
                    let items = MatchSvr.GetAwards(d.matchId, p.rank)
                    this.setActive("awards/wcoin", node, false)
                    this.setActive("awards/lottery", node, false)
                    this.setActive("awards/diamond", node, false)
                    let idx = 0
                    for (let i in items) {
                        if (items[i].id === Constants.ITEM_INDEX.WCOIN) {
                            this.setActive("awards/wcoin", node, true)
                            this.setActive("awards/wcoin/add", node, idx > 0)
                            this.setLabelValue("awards/wcoin/num", node, Helper.FormatNumWY(items[i].num))
                            idx++
                        } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                            this.setActive("awards/lottery", node, true)
                            this.setActive("awards/lottery/add", node, idx > 0)
                            this.setLabelValue("awards/lottery/num", node, Helper.FormatNumWY(items[i].num))
                            idx++
                        } else if (items[i].id === Constants.ITEM_INDEX.DIAMOND) {
                            this.setActive("awards/diamond", node, true)
                            this.setActive("awards/diamond/add", node, idx > 0)
                            this.setLabelValue("awards/diamond/num", node, items[i].num >= 10000 ? 
                                Helper.FormatNumWY(items[i].num) : Helper.FormatNumPrice(items[i].num / 100))
                            idx++
                        }
                        
                    }
                } else {
                    User.GetPlyDetail(p.openid, (ply: IPlayerData) => {
                        this.setSpriteFrame("face", node, ply.avatar)
                        this.setLabelValue("opponent", node, ply.userName)
                    })
                }
            }

            let matchInfo = MatchSvr.GetMatchInfo(d.matchId)    
            this.setActive("gateMoney/wcoin", node, false)
            this.setActive("gateMoney/lottery", node, false)
            this.setActive("gateMoney/diamond", node, false)        
            if (matchInfo && matchInfo.freeAd) {
                this.setLabelValue("gateMoney/tip", node, "免费入场")
            } else {
                for (let i in d.gateMoney) {
                    if (d.gateMoney[i].id === Constants.ITEM_INDEX.WCOIN) {
                        this.setActive("gateMoney/wcoin", node, true)
                        this.setLabelValue("gateMoney/wcoin/num", node, Helper.FormatNumWY(d.gateMoney[i].num))
                    } else if (d.gateMoney[i].id === Constants.ITEM_INDEX.LOTTERY) {
                        this.setActive("gateMoney/lottery", node, true)
                        this.setLabelValue("gateMoney/lottery/num", node, Helper.FormatNumWY(d.gateMoney[i].num))
                    } else if (d.gateMoney[i].id === Constants.ITEM_INDEX.DIAMOND) {
                        this.setActive("gateMoney/diamond", node, true)
                        this.setLabelValue("gateMoney/diamond/num", node, d.gateMoney[i].num >= 10000 ?
                            Helper.FormatNumWY(d.gateMoney[i].num) : Helper.FormatNumPrice(d.gateMoney[i].num / 100))
                    }
                }
            }

            this.setButtonClick("btnDetail", node, () => {
                Helper.OpenPageUI("component/Match/MatchDetailEntry", "", null, { result: d }, () => this.close())
            })

            MatchSvr.GetMatchAward(d.matchUuid)
        }

        itemMode.active = false
    }

    initEvent() {
        this.setButtonClick("bg", () => this.close())
    }
}
