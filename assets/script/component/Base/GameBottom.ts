import BaseUI from "../../base/BaseUI";
import { UIMgr } from "../../base/UIMgr";
import { Constants } from "../../constants";
import { EventMgr } from "../../base/EventMgr";
import { DataMgr } from "../../base/DataMgr";
import { MatchSvr } from "../../system/MatchSvr";
import { Helper } from "../../system/Helper";
import { ActivitySrv, SignSrv } from "../../system/ActivitySrv";
import { TaskSrv } from "../../system/TaskSrv";

const RESULT_CHECK = "resultCheck"
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameBottom extends BaseUI {

    _curTab: string = "tab/match"
    _dirTab: string = ""
    _lastCheckTime: number = 0
    _lastResultTime: number = 0

    _normalWidth: number = 0
    _selectWidth: number = 0

    onLoad() {
        this._normalWidth = this.node.width / (this.getNode("tab").childrenCount + .8)
        this._selectWidth = this.node.width - this._normalWidth * (this.getNode("tab").childrenCount - 1)

        if (DataMgr.Config.platId === 3) {
            this._normalWidth = this.node.width / (this.getNode("tab").childrenCount - 2)
            this._selectWidth = this.node.width - this._normalWidth * (this.getNode("tab").childrenCount - 3)
            
            this.setActive("tab/exchange", false)
            // this.setActive("tab/shop", false)
            this.setActive("tab/games", false)

            this.getNode("tab/main")["_localZOrder"] = 1
            this.getNode("tab/match")["_localZOrder"] = 2
            this.getNode("tab/shop")["_localZOrder"] = 3
            this.getNode("tab/league")["_localZOrder"] = 4
        }
    }

    onOpen() {
        this.initEvent()
        this.initData()

        this.getNode("tab").children.forEach(i => i.width = this._normalWidth)
        this.setNodeWidth(this._curTab, this._selectWidth)
        this.setNodeWidth("silder", this._selectWidth)
        this.setNodePositionX("silder", this.getNode(this._curTab).x)
    }

    initEvent() {
        this.setButtonClick("tab/main", () => this.onPressMain(), 0)
        this.setButtonClick("tab/exchange", () => this.onPressExchange(), 0)
        this.setButtonClick("tab/match", () => this.onPressMatch(), 0)
        this.setButtonClick("tab/shop", () => this.onPressShop(), 0)
        this.setButtonClick("tab/league", () => this.onPressLeague(), 0)
        this.setButtonClick("tab/games", () => this.onPressGames(), 0)

        // EventMgr.on(Constants.EVENT_DEFINE.ENTER_MATCH_SCEME, () => this.onPressMatch(), this)
        EventMgr.on(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, this.onClickTab, this)
    }

    initData() {
        let opened = DataMgr.getData<boolean>("firstOpen")
        if (opened) {
            let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
            if (user.histroy.platGame > 3) {
                this.checkActivity(true)
            } else {
                this.checkActivity(false)
            }
        } else {
            DataMgr.setData("firstOpen", true)
            this.checkActivity(false)
        }

        this.setToggleCheck(this._curTab)
    }

    onClickTab(msg) {
        this.setToggleCheck("tab/" + msg.name)
        // this.checkActivity()
        // this.updateTabStyle()
    }

    onPressMain() {
        this._dirTab = "tab/main"
        UIMgr.OpenUI("scene/MainScene",
            { parent: "BaseScene/GameCenter/main/view/content", tabPage: true })
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_TAB, { tab: "main" })
        this.getMatchResult()
        this.updateTabStyle()
    }

    onPressExchange() {
        this._dirTab = "tab/exchange"
        UIMgr.OpenUI("scene/ExchangeScene",
            { parent: "BaseScene/GameCenter/main/view/content", tabPage: true })
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_TAB, { tab: "exchange" })
        this.getMatchResult()
        this.updateTabStyle()
    }

    onPressMatch() {
        this._dirTab = "tab/match"
        UIMgr.OpenUI("scene/MatchScene",
            { parent: "BaseScene/GameCenter/main/view/content", tabPage: true })
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_TAB, { tab: "match" })
        // let opened = DataMgr.getData<boolean>("firstOpen")
        // if (opened) {
        this.getMatchResult()
        this.checkActivity()
        this.updateTabStyle()
    }

    onPressShop() {
        this._dirTab = "tab/shop"
        UIMgr.OpenUI("scene/ShopScene",
            { parent: "BaseScene/GameCenter/main/view/content", tabPage: true })
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_TAB, { tab: "shop" })
        this.setActive("tab/shop/shopRedpoint", false)
        this.getMatchResult()
        this.updateTabStyle()
    }

    onPressLeague(param = null) {
        let open = () => {
            UIMgr.OpenUI("scene/LeagueScene",
                { parent: "BaseScene/GameCenter/main/view/content", tabPage: true, param: param })

            this._dirTab = "tab/league"
            this.setToggleCheck("tab/league", false)
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_TAB, { tab: "league" })

            this.updateTabStyle()
        }

        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (user.histroy.allGame >= Constants.PROFESSION_LEAGUE_COUNT) {
            open()
        } else {
            this.scheduleOnce(() => this.setToggleCheck(this._curTab, false), .0)
            let param = {
                buttons: 1,
                cancelName: "确定",
            }
            Helper.OpenPopUI("component/League/LeagueConditionEntry", "联赛排行", param)
        }
    }

    onPressGames() {
        this._dirTab = "tab/games"
        UIMgr.OpenUI("scene/GamesScene",
            { parent: "BaseScene/GameCenter/main/view/content", tabPage: true })
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_TAB, { tab: "games" })
        this.getMatchResult()
        this.updateTabStyle()
    }

    updateTabStyle() {
        // this.getNode("tab").children.forEach(i => i.width = this._normalWidth)
        // this.getNode(this._curTab).width = this._selectWidth
        this.stopTween(this._curTab)
        this.stopTween(this._dirTab)
        this.runTween(this._curTab, cc.tween().to(.2, { width: this._normalWidth }))
        this.runTween(this._dirTab, cc.tween().to(.2, { width: this._selectWidth }))
        this._curTab = this._dirTab
        let x = (this.getNode(this._dirTab)["_localZOrder"] - 1) * this._normalWidth + this._selectWidth * .5 - this.node.width / 2
        this.runTween("silder", cc.tween().to(.2, { x: x }))
    }

    checkActivity(showPop: boolean = false) {
        if (Date.now() - this._lastCheckTime <= 30000) {
            return
        }

        this._lastCheckTime = Date.now()
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        ActivitySrv.GetActivityConfig(0, (res) => {
            let now = Date.now() / 1000
            let popSign = false
            let SignFinish = false
            this.setActive("tab/shop/shopRedpoint", false)
            res = res || []
            for (let info of res) {
                let data = info
                // if (undefined === data.shop_place) {
                //     continue
                // }
                if (data.activity_id === 1002 && data.receive_num === 1) {
                    continue
                }

                if (info.day_times && info.receive_num && info.receive_num >= info.day_times) {
                    if (info.activity_id === 8) { // 签到已完成
                        SignFinish = true
                    }
                } else if (info.receive_time && now - info.receive_time < info.interval_time * 60) {
                } else {
                    if (info.activity_id === 8 && showPop) { // 签到
                        let lastGames = DataMgr.getData<number>("signGameCount") || 0
                        SignSrv.GetConfig((config) => {
                            if (config) {
                                if (user.histroy.allGame >= 2 && user.histroy.allGame >= lastGames + 2) {
                                    for (let i = 0; i < config.list.length; i++) {
                                        let index = i + 1
                                        if (index === config.DayIndex) {
                                            if (config.Receive !== 1 && DataMgr.OnlineParam.daily_sign_dialog_box === 1) {
                                                UIMgr.OpenUI("component/Activity/Sign", { param: { signConfig: config, activityConfig: info }, index: 20 })
                                                DataMgr.setData("signGameCount", user.histroy.allGame)
                                                popSign = true
                                                break
                                            }
                                        }
                                    }
                                }

                                if (!popSign && user.histroy.allGame > 3) {
                                    for (let info of res) {
                                        let data = info
                                        if (undefined === data.shop_place) {
                                            continue
                                        }
                                        if (data.activity_id === 1002 && data.receive_num === 1) {
                                            continue
                                        }

                                        if (info.day_times && info.receive_num && info.receive_num >= info.day_times) {
                                        } else if (info.receive_time && now - info.receive_time < info.interval_time * 60) {
                                        } else {
                                            if (info.activity_id === 4 && DataMgr.OnlineParam.free_luck_draw_dialog_box === 1 && Math.random() >= .7) {
                                                //Helper.OpenPageUI("component/Activity/SlyderAdventures", "免费抽奖", null, { dataInfo: info })
                                                UIMgr.OpenUI("component/Activity/SlyderAdventures", { param: { dataInfo: info } })
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    } else if (info.activity_id === 4) {
                        if (user.histroy.allGame > 3) {
                            if (SignFinish && showPop && DataMgr.OnlineParam.free_luck_draw_dialog_box === 1 && Math.random() >= .7) {
                                // Helper.OpenPageUI("component/Activity/SlyderAdventures", "免费抽奖", null, { dataInfo: info })
                                UIMgr.OpenUI("component/Activity/SlyderAdventures", { param: { dataInfo: info } })
                            }
                        }
                    } else {
                        if (info.activity_id !== 1001 && info.activity_id !== 5) {
                            this.setActive("tab/shop/shopRedpoint", true)
                        }

                        if (info.activity_id === 5) {
                            TaskSrv.GetTaskList((res) => {
                                if (res.list) {
                                    for (let i = 0; i < res.list.length; i++) {
                                        let info = res.list[i]
                                        if (info.status === 2) {
                                            this.setActive("tab/shop/shopRedpoint", true)
                                            break
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            }
        })
    }

    getMatchResult(callback?: Function) {
        if (Date.now() - this._lastResultTime <= 30000) {
            return
        }

        this._lastResultTime = Date.now()

        let bCheck = DataMgr.getData<boolean>(RESULT_CHECK)
        MatchSvr.GetInProgressList()
        MatchSvr.GeCompletedList(() => {
            let data = DataMgr.getData<TResults>(Constants.DATA_DEFINE.MATCH_COMPLETED)
            if (!data) {
                callback && callback()
                return
            }

            let results: TResults = data.filter(item => item.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_AWARD)
            if (results.length > 0) {
                if (!bCheck) {
                    UIMgr.OpenUI("component/Match/MatchOfflineEntry", { param: results, closeCb: () => { callback && callback() } })
                } else {
                    let activitys = results.filter(i => i.type === Constants.MATCH_TYPE.ACTIVITY_MATCH)
                    results = results.filter(i => i.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH)
                    if (results.length > 0) {
                        UIMgr.OpenUI("component/Match/MatchResultPush", { param: results, closeCb: () => { callback && callback() } })
                    } else if (activitys.length > 0) {
                        MatchSvr.GetActivityMatch(activitys[0].matchUuid, (res) => {
                            if (!res || !res.matchId) {
                                return
                            }

                            let param = {
                                confirmName: "分享",
                                cancelName: "知道了",
                                confirmIcon: "image/button/common-lvanniou",
                                confirm: () => { Helper.shareInfo() },
                                closeCb: () => {
                                    MatchSvr.GetMatchAward(activitys[0].matchUuid)
                                },
                                param: { data: res }
                            }
                            Helper.OpenPopUI("component/Match/ActivityMatchSettlement", activitys[0].name, null, param)
                        })
                    }
                }
            }
        })
        DataMgr.setData(RESULT_CHECK, true)
    }
}
