import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { LeagueSvr } from "../../system/LeagueSvr";
import { Helper } from "../../system/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LeagueSettlement extends BaseUI {

    onOpen() {
        this.initEvent()
        this.initData()
    }

    onClose() {
        let data = DataMgr.getData(Constants.DATA_DEFINE.LEAGUE_RESULT)
        LeagueSvr.GetLeagueAward(data["league_id"])
        DataMgr.setData(Constants.DATA_DEFINE.LEAGUE_RESULT, null)
    }

    initEvent() {

    }

    initData() {
        let data = DataMgr.getData(Constants.DATA_DEFINE.LEAGUE_RESULT)
        if (!data) {
            this.close()
            return
        }

        let rank = Number(data["rank"]) || 0
        this.setLabelValue("content/info/leagueNum",  rank >= 0 ? (rank + 1) : "--")
        this.setLabelValue("content/info/awardVal", "")
        if (data["award_list"] && data["award_list"].length > 0) {
            let items = data["award_list"].map(i => i = { id: i.id || 0, num: i.num })
            // this.setChildParam("content/info/awards/ItemMode", { items: items })
            this.setActive("content/info/awards/wcoin", false)
            this.setActive("content/info/awards/lottery", false)
            this.setActive("content/info/awards/diamond", false)
            let idx = 0
            for (let i in items) {
                if (items[i].id === Constants.ITEM_INDEX.WCOIN) {
                    this.setActive("content/info/awards/wcoin", true)
                    this.setLabelValue("content/info/awards/wcoin/num",  Helper.FormatNumWY(items[i].num))
                } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("content/info/awards/lottery", true)
                    this.setLabelValue("content/info/awards/lottery/num", Helper.FormatNumWY(items[i].num))
                    this.setActive("content/info/awards/lottery/add", idx > 0)
                } else if (items[i].id === Constants.ITEM_INDEX.DIAMOND) {
                    this.setActive("content/info/awards/diamond", true)
                    this.setLabelValue("content/info/awards/diamond/num", items[i].num >= 10000 ? Helper.FormatNumWY(items[i].num) : Helper.FormatNumPrice(items[i].num / 100))
                    this.setActive("content/info/awards/diamond/add", idx > 0)
                }
                idx ++
            }
            this.setActive("content/info/awardVal", false)
        } else {
            this.setLabelValue("content/info/awardVal", "----")
            this.setActive("content/info/awards", false)
        }

        this.setLabelValue("content/time/value", Helper.FormatTimeString((data["end_time"] * 1000), "结束时间: yyyy年MM月dd日"))

        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)

        LeagueSvr.GetLeagueByLeagueId(data["league_id"], 0, 2, (res) => {
            if (res && res.rank_list && this.node && this.node.isValid) {
                let content = this.getNode("content/list/view/content")
                let mode = this.getNode("content/list/view/LeagueMode")
                if (!content || !mode) {
                    return
                }
                mode.active = false
                for (let i in res.rank_list) {
                    let l = res.rank_list[i]
                    let item = cc.instantiate(mode)
                    item.parent = content
                    item.name = "" + l.rank
                    item.active = true
                    item.scale = .9
                    let info: ILeagueRow = {
                        type: data["type"],
                        rank: Number(l.rank) || 0,
                        medal: Number(l.medal_num) || 0,
                        awards: [], 
                        user: {
                            userName: l.nickname,
                            userId: l.openid,
                            avatar: l.head_image,
                            region: l.area_info,
                        }
                    }
                    this.setChildParam(item, { data: info, leagueId: data["league_id"]})
                }

                // if ((rank < 0 || rank >= 3) && res.rank_list) {
                if (user.league[data["type"]].rank > 0) {  
                    let item = cc.instantiate(mode)
                    item.parent = content
                    item.name = rank >= 0 ? "" + rank : "--"
                    item.active = true
                    item.scale = .9
                    let info: ILeagueRow = {
                        type: data["type"],
                        rank: user.league[data["type"]].rank,
                        medal: user.league[data["type"]].medal || 0,
                        awards: [],
                        user: {
                            userName: user.userName,
                            userId: user.userId,
                            avatar: user.avatar,
                            region: user.region,
                        }
                    }
                    this.setChildParam(item, { data: info, leagueId: data["league_id"], self: true })
                }
            }
        })
    }
}
