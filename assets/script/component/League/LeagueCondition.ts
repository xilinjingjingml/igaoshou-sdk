import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { ITEM_STYLE } from "../Base/ItemMode";
import { Helper } from "../../system/Helper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LeagueCondition extends BaseUI {

    onOpen() {
        this.initData()
    }

    initData() {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)

        this.drawProgress(user.histroy.allGame / Constants.PROFESSION_LEAGUE_COUNT)
        this.setRichTextValue("condition/value", "<color=#515151>再玩</c><color=#2aa300>" + (Constants.PROFESSION_LEAGUE_COUNT - user.histroy.allGame) + "局</c><color=#363636>可解锁</c>")
        let practice = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE)
        let prefession = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PROFESSION)
        
        if (practice || prefession) {
            // this.setChildParam("info/awards/ItemMode", { items: data.totalBouns, style: ITEM_STYLE.STYLE_SOLID })    
            this.setActive("info/awards/wcoin", false)
            this.setActive("info/awards/lottery", false)
            this.setActive("info/awards/diamond", false)
            let idx = 0
            let items: TItems = []
            for (let i in prefession.totalBouns) {
                let it = prefession.totalBouns[i]
                items[it.id] = it
            }
            for (let i in practice.totalBouns) {
                let it = practice.totalBouns[i]
                if (items[it.id]) {
                    items[it.id].num += it.num
                } else {
                    items[it.id] = it
                }
            }
            
            for (let i in items) {
                if (items[i].id === Constants.ITEM_INDEX.WCOIN) {
                    this.setActive("info/awards/wcoin", true)
                    this.setLabelValue("info/awards/wcoin/num",  Helper.FormatNumWY(items[i].num))
                } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("info/awards/lottery", true)
                    this.setLabelValue("info/awards/lottery/num", Helper.FormatNumWY(items[i].num))
                    this.setActive("info/awards/lottery/add", idx > 0)
                } else if (items[i].id === Constants.ITEM_INDEX.DIAMOND) {
                    this.setActive("info/awards/diamond", true)
                    this.setLabelValue("info/awards/diamond/num", items[i].num >= 10000 ? Helper.FormatNumWY(items[i].num) : Helper.FormatNumPrice(items[i].num / 100))
                    this.setActive("info/awards/diamond/add", idx > 0)
                }
                idx ++
            }
            
            let time = (prefession.time * 1000) - Date.now()
            let label = this.getNodeComponent("time/value", cc.Label)
            cc.tween(label)
                .repeat(Math.floor(time / 1000),
                    cc.tween()
                        .call(() => { label.string = Helper.FormatTimeString((prefession.time * 1000) - Date.now(), "结算剩余时间: dd天hh小时mm分钟ss秒") })
                        .delay(1)
                )
            .start()
        }
    }

    drawProgress(value: number) {
        let sprite = this.getNodeComponent("info/icon/bar", cc.Sprite)
        if (!sprite) {
            return 
        }

        cc.tween(sprite)
        .to(1.5, {fillRange: value}, {easing: "backIn"})
        .start()
    }

}
