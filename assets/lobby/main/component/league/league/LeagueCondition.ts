import BaseUI from "../../../../start/script/base/BaseUI";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { User } from "../../../../start/script/data/User";
import { Constants } from "../../../../start/script/igsConstants";
import { Helper } from "../../../../start/script/system/Helper";


const {ccclass, property} = cc._decorator;

@ccclass
export default class LeagueCondition extends BaseUI {

    onOpen() {
        this.initData()
    }

    initData() {
        this.drawProgress(User.AllGame / Constants.PROFESSION_LEAGUE_COUNT)
        this.setRichTextValue("condition/value", "<color=#515151>再玩</c><color=#2aa300>" + (Constants.PROFESSION_LEAGUE_COUNT - User.AllGame + 1) + "局</c><color=#363636>可解锁</c>")
        let practice = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE)
        let prefession = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PROFESSION)
        
        // if (practice || prefession) {
        //     // this.setChildParam("info/awards/ItemMode", { items: data.totalBouns, style: ITEM_STYLE.STYLE_SOLID })    
            
        // }
        if (practice) {
            this.showAwards(practice)
        } else if (prefession) {
            this.showAwards(prefession)
        } else {
            this.close()
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

    showAwards(league) {
        this.setActive("info/awards/gold", false)
        this.setActive("info/awards/lottery", false)
        this.setActive("info/awards/credits", false)
        let idx = 0
        let items: TItems = []
        for (let i in league?.totalBouns) {
            let it = league.totalBouns[i]
            items[it.id] = it
        }
        
        for (let i in items) {
            if (items[i].id === Constants.ITEM_INDEX.GOLD) {
                this.setActive("info/awards/gold", true)
                this.setLabelValue("info/awards/gold/num",  Helper.FormatNumWYCN(items[i].num))
            } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive("info/awards/lottery", true)
                this.setLabelValue("info/awards/lottery/num", Helper.FormatNumWYCN(items[i].num))
                this.setActive("info/awards/lottery/add", idx > 0)
            } else if (items[i].id === Constants.ITEM_INDEX.CREDITS) {
                this.setActive("info/awards/credits", true)
                this.setLabelValue("info/awards/credits/num", Helper.FormatNumWYCN(items[i].num))
                this.setActive("info/awards/credits/add", idx > 0)
            }
            idx ++
        }
        
        let time = (league.time * 1000) - Date.now()
        let label = this.getNodeComponent("time/value", cc.Label)
        cc.tween(label)
            .repeat(Math.floor(time / 1000),
                cc.tween()
                    .call(() => { label.string = Helper.FormatTimeString((league.time * 1000) - Date.now(), "结算剩余时间: dd天hh小时mm分钟ss秒") })
                    .delay(1)
            )
        .start()
    }

}
