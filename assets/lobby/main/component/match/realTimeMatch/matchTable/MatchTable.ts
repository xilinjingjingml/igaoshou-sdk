import BaseUI from "../../../../../start/script/base/BaseUI";
import { DataMgr } from "../../../../../start/script/base/DataMgr";
import { Constants } from "../../../../../start/script/igsConstants";
import { EventMgr } from "../../../../../start/script/base/EventMgr";
import { Helper } from "../../../../../start/script/system/Helper";
import { UserSrv } from "../../../../../start/script/system/UserSrv";
import { User } from "../../../../../start/script/data/User";
import { MatchSvr } from "../../../../../start/script/system/MatchSvr";
import { UIMgr } from "../../../../../start/script/base/UIMgr";

const { ccclass, property } = cc._decorator;

enum BUTTON_STATE {
    SELECT_ALL = 0,
    UNSELECT_ALL,
}

@ccclass
export default class MatchTable extends BaseUI {

    _line: cc.Node = null
    _matchMode: cc.Node = null
    _buttonMode: cc.Node = null

    _cancelBtn: cc.Node = null
    _buttonState: BUTTON_STATE = BUTTON_STATE.SELECT_ALL

    _list: IMatchInfo[] = []
    _maxSelectNum: number = 0

    _lineIns: [] = []

    onOpen() {

    }

    setParam(param) {
        this.param = param

        this._line = this.getNode("line")
        this._line.active = false

        this._matchMode = this.getNode("match")
        this._matchMode.active = false

        this.initEvent()
        this.initData()
    }

    initEvent() {
    }

    initData() {
        this._list = this.param.list || []

        let reqList = DataMgr.getData<string[]>(Constants.DATA_DEFINE.REAL_TIME_LIST) || []

        reqList = reqList.filter(i => this._list.filter(j => j.matchId === i).length > 0)
        DataMgr.setData(Constants.DATA_DEFINE.REAL_TIME_LIST, reqList)

        let bSel = DataMgr.getData<boolean>(Constants.DATA_DEFINE.REAL_TIME_SELECT)
        this.node.removeAllChildren(true)
        this._line.parent = this.node
        this._matchMode.parent = this.node

        let newbieMatch: string = ""
        if (this.param.isNewbie) {
            let mGold: string = null
            let mLottery: string = null
            for (let m of this._list) {
                if (!mGold && m.gateMoney[0].id === Constants.ITEM_INDEX.GOLD && m.gateMoney[0].num <= User.Gold) {
                    mGold = m.matchId
                } else if (!mLottery && m.gateMoney[0].id === Constants.ITEM_INDEX.LOTTERY && m.gateMoney[0].num <= User.Lottery) {
                    mLottery = m.matchId
                }
            }

            newbieMatch = mLottery || mGold
        }

        EventMgr.off(Constants.EVENT_DEFINE.REALTIME_MATCH_TABLE_STATE, this)
        for (let i = 0; i < Math.ceil(this._list.length / 3); i++) {
            let lItem = cc.instantiate(this._line)
            lItem.parent = this.node
            lItem.active = true
            for (let j = 0; j < 3 && this._list[i * 3 + j]; j++) {
                let match = this._list[i * 3 + j]
                let item = cc.instantiate(this._matchMode)
                item.parent = lItem
                item.active = true
                item.name = match.matchId
                let awards = match.awards[0]?.items.filter(i => (i.id === Constants.ITEM_INDEX.GOLD || i.id === Constants.ITEM_INDEX.LOTTERY) && i.num > 0)
                if (awards[0].id === Constants.ITEM_INDEX.GOLD) {
                    this.setActive("unselect/gold", item, true)
                    this.setActive("unselect/lottery", item, false)
                    this.setLabelValue("unselect/num", item, Helper.FormatNumWYCN(awards[0].num))
                } else if (awards[0].id === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("unselect/gold", item, false)
                    this.setActive("unselect/lottery", item, true)
                    this.setLabelValue("unselect/num", item, Helper.FormatNumWYCN(awards[0].num))
                }

                if (match.gateMoney[0]?.id === Constants.ITEM_INDEX.GOLD && match.gateMoney[0]?.num > 0) {
                    this.setActive("select/di/gatemoney/gold", item, true)
                    this.setActive("select/di/gatemoney/lottery", item, false)
                    this.setActive("unselect/di/gatemoney/gold", item, true)
                    this.setActive("unselect/di/gatemoney/lottery", item, false)
                    this.setLabelValue("select/di/gatemoney/num", item, Helper.FormatNumWYCN(match.gateMoney[0].num))
                    this.setLabelValue("unselect/di/gatemoney/num", item, Helper.FormatNumWYCN(match.gateMoney[0].num))
                } else if (match.gateMoney[0]?.id === Constants.ITEM_INDEX.LOTTERY && match.gateMoney[0]?.num > 0) {
                    this.setActive("select/di/gatemoney/gold", item, false)
                    this.setActive("select/di/gatemoney/lottery", item, true)
                    this.setActive("unselect/di/gatemoney/gold", item, false)
                    this.setActive("unselect/di/gatemoney/lottery", item, true)
                    this.setLabelValue("select/di/gatemoney/num", item, Helper.FormatNumWYCN(match.gateMoney[0].num))
                    this.setLabelValue("unselect/di/gatemoney/num", item, Helper.FormatNumWYCN(match.gateMoney[0].num))
                } else {
                    this.setActive("select/di/gatemoney/gold", item, false)
                    this.setActive("select/di/gatemoney/lottery", item, false)
                    this.setActive("select/di/gatemoney/tip", item, false)
                    this.setLabelValue("select/di/gatemoney/num", item, "免费入场")

                    this.setActive("unselect/di/gatemoney/gold", item, false)
                    this.setActive("unselect/di/gatemoney/lottery", item, false)
                    this.setActive("unselect/di/gatemoney/tip", item, false)
                    this.setLabelValue("unselect/di/gatemoney/num", item, "免费入场")
                }

                let checkItem = UserSrv.CheckItem(match.gateMoney)
                item["_select"] = false
                if (reqList.filter(t => t === match.matchId).length > 0) {
                    item["_select"] = checkItem && true
                } else if (this.param.isNewbie) {
                    if (match.matchId === newbieMatch) {
                        item["_select"] = true
                    }
                } else if (checkItem && !bSel) {
                    if (match.gateMoney[0].id === Constants.ITEM_INDEX.GOLD) {
                        item["_select"] = match.gateMoney[0].num <= User.Gold
                    } else if (match.gateMoney[0].id === Constants.ITEM_INDEX.LOTTERY) {
                        item["_select"] = match.gateMoney[0].num <= User.Lottery
                    }
                }

                // let list = DataMgr.getData<string[]>(Constants.DATA_DEFINE.REAL_TIME_LIST) || []
                // list = list.filter(t => t !== match.matchId)
                // if (item["_select"]) {
                //     list.push(match.matchId)
                // }
                let list = [match.matchId]
                DataMgr.setData(Constants.DATA_DEFINE.REAL_TIME_LIST, list)

                if (item["_select"]) {
                    this.resetAll()
                    item["_select"] = true
                }   
                this.setActive("select", item, item["_select"])             

                this._maxSelectNum++
                this.setButtonClick(item, () => {
                    if (!UserSrv.CheckItem(match.gateMoney)) {
                        MatchSvr.unenoughtPop(match, () => UIMgr.CloseUI("component/match/realTimeMatch/matchStart/RealTimeMatchStart"))
                        return
                    }

                    this.resetAll()

                    item["_select"] = !item["_select"]
                    this.setActive("select", item, item["_select"])

                    // let list = DataMgr.getData<string[]>(Constants.DATA_DEFINE.REAL_TIME_LIST) || []
                    // if (item["_select"]) {
                    //     list.push(match.matchId)
                    // } else {
                    //     list = list.filter(t => t !== match.matchId)
                    // }

                    let list = [match.matchId]
                    DataMgr.setData(Constants.DATA_DEFINE.REAL_TIME_LIST, list)
                    DataMgr.setData(Constants.DATA_DEFINE.REAL_TIME_SELECT, true)
                }, 0)
            }
            // }

            EventMgr.on(Constants.EVENT_DEFINE.REALTIME_MATCH_TABLE_STATE, (msg) => this.updateButtonState(msg, lItem), this)
        }
    }

    resetAll() {
        this.node.children.forEach(i => {
            i.children.forEach(j => {
                if (j["_select"]) {
                    j["_select"] = false
                    this.setActive("select", j, false)
                }
            })
        })
    }

    updateButtonState(msg: any, lItem: cc.Node) {
        lItem.children.forEach(i => {
            this.setButtonInfo(i, { interactable: msg.state === 0 })
        })
    }
}
