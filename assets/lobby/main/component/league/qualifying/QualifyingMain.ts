import BaseUI from "../../../../start/script/base/BaseUI";
import { QualifyingSrv } from "../../../../start/script/system/QualifyingSrv";
import { Helper } from "../../../../start/script/system/Helper";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { UIMgr } from "../../../../start/script/base/UIMgr";
import { DataMgr } from "../../../../start/script/base/DataMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class QualifyingMain extends BaseUI {

    _rankIngContent: cc.Node = null
    _rankIngItemPrefab: cc.Node = null

    _gradeData: IGradeData = null
    onOpen() {
        this.initEvent()
        this.initButton()

        QualifyingSrv.GetCurSeason((res) => {
            this.initData(res)

            QualifyingSrv.GetRankList({ season_id: res.cur_season_id, start: 0, end: 9 }, (res) => {
                this.initRankList(res)
            })
        })

        if (cc.sys.BYTEDANCE_GAME === cc.sys.platform || cc.sys.WECHAT_GAME === cc.sys.platform || Helper.isNative()) {
            this.setActive("node/btnShare", true)
        } else {
            this.setActive("node/btnShare", false)
        }
    }

    onLoad() {
        this._rankIngContent = cc.find("node/ranking/scrollView/view/content", this.node)
        this._rankIngItemPrefab = cc.find("item", this._rankIngContent)
        this._rankIngItemPrefab.active = false
    }

    onClose() {
    }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, this.onClickTab, this)
    }

    onClickTab(msg) {
        if (msg.name == "match") {
            this.close()
        }
    }

    initButton() {
        this.setButtonClick("top/btnBack", this.node, () => {
            cc.log("on click btnBack")
            this.close()
        })

        this.setButtonClick("top/btnHelp", this.node, () => {
            cc.log("on click btnBack")
            UIMgr.OpenUI("lobby", "component/league/qualifying/QualifyingHelp", { param: {} })
        })

        this.setButtonClick("node/btnRongYaoZhiLv", this.node, () => {
            cc.log("on click btnRongYaoZhiLv")
            UIMgr.OpenUI("lobby", "component/league/qualifying/QualifyingHistory", {})
        })

        this.setButtonClick("node/btnDuanWeiPaiHang", this.node, () => {
            cc.log("on click btnDuanWeiPaiHang")
            UIMgr.OpenUI("lobby", "component/league/qualifying/QualifyingReward", {})
        })

        this.setButtonClick("node/ranking/btnMore", this.node, () => {
            cc.log("on click btnMore")
            this.close()
            DataMgr.setData(Constants.DATA_DEFINE.LEAGUE_TAB, 0)
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "league", param: { type: Constants.LEAGUE_TYPE.QUALIFYING } })
        })

        this.setButtonClick("nodeBottom/btnStart", this.node, () => {
            cc.log("on click btnStart")
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "match" })
        })

        this.setButtonClick("node/btnShare", this.node, () => {
            cc.log("on click btnShare")
            let curSeason: any = DataMgr.getData(Constants.DATA_DEFINE.QUALIFYING_CUR_SEASON)
            if (curSeason && cc.sys.WECHAT_GAME === cc.sys.platform) {
                UIMgr.OpenUI("lobby", "component/league/qualifying/QualifyingShare", { param: { grade: this._gradeData } })
            } else {
                Helper.shareInfo()
            }
        })
    }

    initData(data: any) {
        this._gradeData = data.grade
        this.setLabelValue("node/title/slevel/lv", data.cur_season_id)
        this.setLabelValue("node/title/time", Helper.FormatTimeString(data.begin_time * 1000, "yyyy/MM/dd") + "-" + Helper.FormatTimeString(data.stop_time * 1000, "yyyy/MM/dd"))

        let tip = ""
        if (data.rank_max > 0 && data.rank >= 0) {
            let rank = Math.floor((data.rank_max - data.rank) / data.rank_max * 100)
            tip = "超过全国" + rank + "%的玩家"
        }
        this.setChildParam("node/center/QualifyingLevelMode", { grade: data.grade, tip: tip })

        this.checkGuide()
    }

    initRankList(data: any) {
        for (let i = 0; i < data.list.length; i++) {
            let item = cc.instantiate(this._rankIngItemPrefab)
            item.active = true
            item.parent = this._rankIngContent

            let rank = i + 1
            if (rank >= 1 && rank <= 3) {
                this.setSpriteFrame("img_lv", item, "image/jiesuan-mingci" + rank + "icon", true)
            } else {
                this.setActive("img_lv", item, false)
                this.setActive("lv", item, true)
                this.setLabelValue("lv", item, rank)
            }

            this.setSpriteFrame("headbg/head", item, data.list[i].head_image)
        }
    }

    checkGuide() {
        let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
        if (record[23] !== 1) {
            let nodes = [
                this.getNode("node/title"),
                this.getNode("node/center"),
                this.getNode("node/ranking"),
                this.getNode("node/btnDuanWeiPaiHang"),
            ]

            UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", { single: true, param: { index: 23, nodes: nodes } })
        }
    }
}
