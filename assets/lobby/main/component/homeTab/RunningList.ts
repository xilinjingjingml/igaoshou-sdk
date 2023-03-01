import BaseUI from "../../../start/script/base/BaseUI";
import { Constants } from "../../../start/script/igsConstants";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { EventMgr } from "../../../start/script/base/EventMgr";

const { ccclass, property } = cc._decorator;

let RUNNING_LIST_TYPE = cc.Enum({
    YOUR_TURN: 0,
    GAMING: 1,
    FINISHED: 2,
})

@ccclass
export default class RunningList extends BaseUI {

    @property({
        type: cc.Enum(RUNNING_LIST_TYPE)
    })
    type = RUNNING_LIST_TYPE.FINISHED

    _showAllList: boolean = false

    _content: cc.Node = null
    _mode: cc.Node = null

    _init: boolean = false

    start() {
        // this.initParam()
        this.initNode()
        this.initEvent()
        this.initData()

        this._init = true
    }

    setParam(param) {
        this.param = param
        this.type = this.param.type || this.type
        this._showAllList = this.param.showAllList || this._showAllList

        if (!this._init)
            return

        // this.initNode()
        this.initEvent()
        this.initData()
    }

    initParam() {
        // this.type = this.param.type || this.type
        // this._showAllList = this.param.showAllList || this._showAllList
    }

    initNode() {
        this._content = this.getNode("list")
        this._mode = this.getNode("RunningMode")
        this._mode.active = false

        this.setButtonClick("btm/btnDetail", this.onPressDetail.bind(this))
    }

    initEvent() {
        DataMgr.unfeed(Constants.DATA_DEFINE.MATCH_COMPLETED, this)
        DataMgr.unfeed(Constants.DATA_DEFINE.MATCH_PROGRESS, this)

        // cc.log("RunningList initEvent")
        if (this.type === RUNNING_LIST_TYPE.FINISHED) {
            DataMgr.feed(Constants.DATA_DEFINE.MATCH_COMPLETED, this.initData, this)
        } else {
            DataMgr.feed(Constants.DATA_DEFINE.MATCH_PROGRESS, this.initData, this)
        }
    }

    initData() {
        let data: TResults = null//DataMgr.getData<Constants.Results>(Constants.DATA_DEFINE.MATCH_RESULT)
        let firstTime = 0
        if (this.type === RUNNING_LIST_TYPE.FINISHED) {
            data = DataMgr.getData<TResults>(Constants.DATA_DEFINE.MATCH_COMPLETED)
            firstTime = DataMgr.getData<number>(Constants.DATA_DEFINE.COMPLETED_FIRST_TIME)
        } else {
            data = DataMgr.getData<TResults>(Constants.DATA_DEFINE.MATCH_PROGRESS)
            firstTime = DataMgr.getData<number>(Constants.DATA_DEFINE.PROGRESS_FIRST_TIME)
        }
        firstTime /= 1000
        if (!data) {
            this.node.children.forEach(item => item.active = false)
            return
        }

        this._content.children.forEach(item => item.active = false)

        data = data.sort((a, b) => {
            return a.time > b.time ? -1 : 1
        })

        let length = 0
        for (let idx in data) {
            let d = data[idx]
            if (this.type === RUNNING_LIST_TYPE.YOUR_TURN) {
                if (d.battleState >= Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SETTLE || d.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                    continue
                }
            } else if (this.type === RUNNING_LIST_TYPE.GAMING) {
                if ((d.battleState < Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SETTLE && d.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH) ||
                    (d.type === Constants.MATCH_TYPE.ACTIVITY_MATCH && d.matchState === Constants.MATCH_STATE.COMPLETE)) {
                    continue
                }
            } else if (this.type === RUNNING_LIST_TYPE.FINISHED) {
            }

            if (length < 5 || this._showAllList) {
                let item: cc.Node = this._content.getChildByName("RunningMode" + d.matchUuid)
                if (!item) {
                    item = cc.instantiate(this._mode)
                    item.parent = this._content
                    item.name = "RunningMode" + d.matchUuid
                }
                item.active = true
                item.setSiblingIndex(length)
                this.setChildParam(item, { data: d, firstTime: firstTime })

                length = item.active ? length + 1 : length
            } else {
                length ++
            }
        }
        this._content.children.forEach(item => !item.active && item.removeFromParent(true))
        this.node.children.forEach(item => item.name !== "RunningMode" && (item.active = length > 0))
        this.setActive("btm", length > 5)
        this.setLayoutInfo(this.node, { spacingY: length === 0 ? 0 : 8, bottom: length === 0 ? 0 : 8 })
    }

    onPressDetail() {
        this.setChildParam("popInfo/MatchRunningList", this.node.parent.parent, { type: this.type, showAllList: true, title: this.getNodeComponent("title/name", cc.Label)?.string || "" })
        this.setActive("popInfo", this.node.parent.parent, true)
        EventMgr.dispatchEvent("POP_SHOW")
        // UIMgr.OpenUI("component/Match/MatchRunningListEntry", 
        // { parent: "BaseScene/GameCenter/main/view/content/MainEntry/popInfo", param: {type: this.type, showAllList: true, title: title ? title.titleName : ""}})
    }
}
