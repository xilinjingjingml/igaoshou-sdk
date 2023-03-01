import BaseUI from "../../../../start/script/base/BaseUI";
import { QualifyingSrv } from "../../../../start/script/system/QualifyingSrv";
import { Helper } from "../../../../start/script/system/Helper";


const { ccclass, property } = cc._decorator;

@ccclass
export default class QualifyingHistory extends BaseUI {

    _content: cc.Node = null
    _itemPrefab: cc.Node = null
    onOpen() {
        this.initEvent()
        this.initButton()

        QualifyingSrv.GetGradeRecord({start:0, end:3}, (res)=>{
            this.initData(res.records)
        })
    }

    onLoad(){
        this._content = cc.find("scrollView/view/content", this.node)
        this._itemPrefab = cc.find("item", this._content)
        this._itemPrefab.active = false
    }

    onClose() {
    }

    initEvent() {

    }

    initButton() {
        this.setButtonClick("top/btnBack", this.node, () => {
            cc.log("on click btnBack")
            this.close()
        })
    }

    initData(list:any[]) {
        for(let i=0; i<list.length; i++){
            let item = cc.instantiate(this._itemPrefab)
            item.active = true
            item.parent = this._content

            this.setItemData(item, list[i])

            if(i == 0){
                this.setActive("title/slevel/cur", item, true)       
                this.setActive("content/btnOpen", item, false)
                this.setActive("content/btnClose", item, true)
                this.openItemDetails(item)
            }
        }
    }

    setItemData(item:cc.Node, data:any){        
        this.setLabelValue("title/slevel/lv", item, data.season_id)
        this.setLabelValue("title/time", item, Helper.FormatTimeString(data.start_time*1000, "yyyy/MM/dd") + "-" + Helper.FormatTimeString(data.stop_time*1000, "yyyy/MM/dd"))

        let config = QualifyingSrv.GetQualifyingByMinor(data.grade.major, data.grade.minor)

        this.setLabelValue("dataNode/games/num", item, data.total_cnt)
        data.total_cnt = data.total_cnt > 0?data.total_cnt:1
        this.setLabelValue("dataNode/win/num", item, Math.floor(data.win_cnt/data.total_cnt*100)+"%")
        this.setLabelValue("dataNode/winningStreak/num", item, data.max_win_streak_cnt)
        this.setLabelValue("dataNode/ranking/num", item, config?config.name:"")

        this.setButtonClick("content/btnOpen", item, () => {
            cc.log("on click btnOpen")
            this.setActive("content/btnOpen", item, false)
            this.setActive("content/btnClose", item, true)
            this.openItemDetails(item)
        })

        this.setButtonClick("content/btnClose", item, () => {
            cc.log("on click btnClose")
            this.setActive("content/btnOpen", item, true)
            this.setActive("content/btnClose", item, false)
            this.closeItemDetails(item)
        })

        this.setChildParam("content/qualifying/QualifyingLevelMode", item, {grade: data.grade})
    }

    openItemDetails(item:cc.Node, data?:any){
        let content = cc.find("content", item)
        this.setActive("blockInput", item, true)

        cc.tween(content)
            .by(0.2, { position: cc.v3(-170, 0)})            
            .start()

        this.setActive("dataNode", item, true)
        let bg = cc.find("dataNode/bg", item)
        let games = cc.find("dataNode/games", item)
        let win = cc.find("dataNode/win", item)
        let winningStreak = cc.find("dataNode/winningStreak", item)
        let ranking = cc.find("dataNode/ranking", item)

        games.opacity = 0
        win.opacity = 0
        winningStreak.opacity = 0
        ranking.opacity = 0

        cc.tween(bg)
            .set({ opacity: 0 })
            .delay(0.2)
            .to(0.2, { opacity: 255 })
            .call(()=>{
                cc.tween(games)
                    .to(0.5, { opacity: 255 })
                    .start()
            })
            .delay(0.7)
            .call(()=>{
                cc.tween(win)
                    .to(0.5, { opacity: 255 })
                    .start()
            })
            .delay(0.7)
            .call(()=>{
                cc.tween(winningStreak)
                    .to(0.5, { opacity: 255 })
                    .start()
            })
            .delay(0.7)
            .call(()=>{
                cc.tween(ranking)
                    .to(0.5, { opacity: 255 })
                    .start()
            })
            .delay(0.7)
            .call(()=>{
                this.setActive("blockInput", item, false)
            })
            .start()
    }

    closeItemDetails(item:cc.Node, data?:any){
        let content = cc.find("content", item)
        this.setActive("blockInput", item, true)
        cc.tween(content)
            .by(0.2, { position: cc.v3(170, 0)})
            .call(()=>{
                this.setActive("blockInput", item, false)
            })
            .start()
        
        this.setActive("dataNode", item, false)
    }
}
