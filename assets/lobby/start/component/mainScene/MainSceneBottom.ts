import BaseUI from "../../script/base/BaseUI";
import { DataMgr } from "../../script/base/DataMgr";
import { Constants } from "../../script/igsConstants";
import { Helper } from "../../script/system/Helper";
import { PluginMgr } from "../../script/base/PluginMgr";
import { EventMgr } from "../../script/base/EventMgr";
import { IgsBundles } from "../../script/data/IgsBundles";
import { ActivitySrv } from "../../script/system/ActivitySrv";
import { MatchSvr } from "../../script/system/MatchSvr";
import { UIMgr } from "../../script/base/UIMgr";
import { QualifyingSrv } from "../../script/system/QualifyingSrv";
import { User } from "../../script/data/User";

const RESULT_CHECK = "resultCheck"
const { ccclass, property } = cc._decorator;

@ccclass
export default class MainSceneBottom extends BaseUI {

    _curTab: string = "tab/match"
    _dirTab: string = "tab/match"
    _lastCheckTime: number = 0
    _lastResultTime: number = 0

    _normalWidth: number = 0
    _selectWidth: number = 0

    _content: cc.Node = null

    _gamesTab: cc.Node = null
    _homeTab: cc.Node = null
    _matchTab: cc.Node = null
    _shopTab: cc.Node = null
    _leagueTab: cc.Node = null

    _curNode: cc.Node = null

    _bgSpriteFrame: cc.SpriteFrame = null

    onLoad() {
        let bg = cc.find("Canvas/BG")
        bg && (this._bgSpriteFrame = bg.getComponent(cc.Sprite).spriteFrame)

        this._normalWidth = this.node.width / (this.getNode("tab").childrenCount + .8)
        this._selectWidth = this.node.width - this._normalWidth * (this.getNode("tab").childrenCount - 1)

        let hideGameBtn = false
        if (DataMgr.data.Config.platId === 3 || cc.sys.platform === Constants.sys.WECHAT_GAME_QQ) {
            hideGameBtn = true
        } else if (!Helper.isNative() && (cc.sys.OPPO_GAME == cc.sys.platform || cc.sys.VIVO_GAME == cc.sys.platform)) {
            hideGameBtn = true
        } else if (cc.sys.BYTEDANCE_GAME === cc.sys.platform || PluginMgr.isH52345Game()) {
            hideGameBtn = true
        } else if (cc.sys.OS_IOS == cc.sys.os && Helper.isIosAudit()) {
            hideGameBtn = true
        }

        if (hideGameBtn) {
            this._normalWidth = this.node.width / (this.getNode("tab").childrenCount - 1)
            this._selectWidth = this.node.width - this._normalWidth * (this.getNode("tab").childrenCount - 2)

            this.setActive("tab/games", false)

            this.getNode("tab/home")["_localZOrder"] = 1
            this.getNode("tab/match")["_localZOrder"] = 2
            this.getNode("tab/shop")["_localZOrder"] = 3
            this.getNode("tab/league")["_localZOrder"] = 4
        }

        this._content = this.getNode("center/main/view/content", this.node.parent)
        this._matchTab = this.getNode("center/main/view/content/matchTab", this.node.parent)
        this._curNode = this._matchTab

        this.initEvent()

        this.getNode("tab").children.forEach(i => i.width = this._normalWidth)
        this.setNodeWidth(this._curTab, this._selectWidth)
        this.setNodeWidth("silder", this._selectWidth)
        this.setNodePositionX("silder", this.getNode(this._curTab).x)

        cc.director.once(cc.Director.EVENT_AFTER_DRAW, () => {
            this.initData()
        })

        if (Helper.isIosAudit()) {
            this.setLabelValue("tab/home/name", "主页")
            this.setLabelValue("tab/shop/name", "任务")
            this.setLabelValue("tab/league/name", "段位")
        }
    }

    initEvent() {
        EventMgr.once(Constants.EVENT_DEFINE.INIT_MAIN_TAB, this.onClickTab, this)
        EventMgr.on(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, this.onClickTab, this)
        EventMgr.on(Constants.EVENT_DEFINE.CHANGE_GAME_ID, this.onChangeGame, this)
    }

    initData() {
        this.updateTabStyle()

        this.getMatchResult()

        this.scheduleOnce(() => {
            IgsBundles.Preload("lobby", "component/gamesTab/GamesTab")
            IgsBundles.Preload("lobby", "component/homeTab/HomeTab")
            IgsBundles.Preload("lobby", "component/shopTab/ShopTab")
            IgsBundles.Preload("lobby", "component/leagueTab/LeagueTab")
        }, .0)

        this.onChangeGame()
    }

    onClickTab(msg) {
        this.setToggleCheck("tab/" + msg.name)
    }

    onPressHome() {
        if (Helper.isIosAudit()) {
            Helper.OpenPageUI("component/personal/PersonalScene", "个人中心")
        } else {
            cc.log("====" + Date.now() + " gameBottom onPressHome")
            this._dirTab = "tab/home"
            this._curNode && (this._curNode.active = false)
            if (!this._homeTab) {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_BASE_SCENE_LOADING)
                let self = this
                IgsBundles.LoadPrefab("lobby", "component/homeTab/HomeTab", (scene: cc.Prefab) => {
                    if (scene) {
                        self._homeTab = cc.instantiate(scene)
                        self._homeTab.parent = self._content
                        self._homeTab.x = 0
                        self._homeTab.active = true
                        self._curNode = self._homeTab
                        // self._loadingNode.active = false
                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BASE_SCENE_LOADING)
                    }
                })
            } else {
                this._homeTab.active = true
                this._curNode = this._homeTab
            }
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_TAB, { tab: "main" })
            this.updateTabStyle()
        }
    }

    onPressMatch() {
        this._dirTab = "tab/match"
        this._curNode && (this._curNode.active = false)
        this._matchTab.active = true
        this._curNode = this._matchTab
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_TAB, { tab: "match" })
        this.getMatchResult()
        this.updateTabStyle()
    }

    onPressShop() {
        if (Helper.isIosAudit()) {
            let activityConfig = ActivitySrv.GetActivityById(5)
            // Helper.OpenPageUI("component/Activity/Task", "玩比赛得奖品", null, { activityConfig: activityConfig })
            Helper.OpenPageUI("component/task/TaskScene", "玩比赛得奖品", null, { single: true })
        } else {
            this._dirTab = "tab/shop"
            this._curNode && (this._curNode.active = false)
            if (!this._shopTab) {
                let self = this
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_BASE_SCENE_LOADING)
                IgsBundles.LoadPrefab("lobby", "component/shopTab/ShopTab", (scene: cc.Prefab) => {
                    if (scene) {
                        self._shopTab = cc.instantiate(scene)
                        self._shopTab.parent = self._content
                        self._shopTab.x = 0
                        self._shopTab.active = true
                        self._curNode = self._shopTab
                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BASE_SCENE_LOADING)
                    }
                })
            } else {
                this._shopTab.active = true
                this._curNode = this._shopTab
            }
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_TAB, { tab: "shop" })
            this.setActive("tab/shop/shopRedpoint", false)
            this.getMatchResult()
            this.updateTabStyle()
        }
    }

    onPressLeague(param = null) {
        let self = this
        let open = () => {
            self._curNode && (self._curNode.active = false)
            if (!self._leagueTab) {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_BASE_SCENE_LOADING)
                IgsBundles.LoadPrefab("lobby", "component/leagueTab/LeagueTab", (scene: cc.Prefab) => {
                    if (scene) {
                        self._leagueTab = cc.instantiate(scene)
                        self._leagueTab.parent = self._content
                        self._leagueTab.position = cc.Vec3.ZERO
                        self._leagueTab.active = true
                        self._curNode = self._leagueTab
                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BASE_SCENE_LOADING)
                    }
                })
            } else {
                self._leagueTab.active = true
                self._curNode = self._leagueTab
            }
            self._dirTab = "tab/league"
            self.setToggleCheck("tab/league", false)
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_TAB, { tab: "league" })

            self.updateTabStyle()
        }

        if (User.AllGame > Constants.PROFESSION_LEAGUE_COUNT) {
            open()
        } else {
            this.scheduleOnce(() => this.setToggleCheck(this._curTab, false), .0)
            let param = {
                buttons: 1,
                cancelName: "确定",
            }
            Helper.OpenPopUI("component/league/league/LeagueCondition", "联赛排行", param)
        }
    }

    onPressGames() {
        this._dirTab = "tab/games"
        this._curNode && (this._curNode.active = false)
        if (!this._gamesTab) {
            let self = this
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_BASE_SCENE_LOADING)
            IgsBundles.LoadPrefab("lobby", "component/gamesTab/GamesTab", (scene: cc.Prefab) => {
                if (scene) {
                    self._gamesTab = cc.instantiate(scene)
                    self._gamesTab.parent = self._content
                    self._gamesTab.x = 0
                    self._gamesTab.active = true
                    self._curNode = self._gamesTab
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BASE_SCENE_LOADING)
                }
            })
        } else {
            this._gamesTab.active = true
            this._curNode = this._gamesTab
        }
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_TAB, { tab: "games" })
        this.getMatchResult()
        this.updateTabStyle()
    }

    onChangeGame() {
        this.setSpriteFrame("tab/match/icon", "https://download.mcbeam.cc/Image/" + DataMgr.data.Config.gameId + "_icon.png")
        this.setSpriteFrame("tab/match/checkmark/icon", "https://download.mcbeam.cc/Image/" + DataMgr.data.Config.gameId + "_icon.png")
    }

    updateTabStyle() {
        this.stopTween(this._curTab)
        this.stopTween(this._dirTab)
        this.runTween(this._curTab, cc.tween().to(.2, { width: this._normalWidth }))
        this.runTween(this._dirTab, cc.tween().to(.2, { width: this._selectWidth }))
        this._curTab = this._dirTab
        let x = (this.getNode(this._dirTab)["_localZOrder"] - 1) * this._normalWidth + this._selectWidth * .5 - this.node.width / 2
        this.runTween("silder", cc.tween().to(.2, { x: x }))

        if (this._curTab == "tab/match") {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_SKIN, { skin: 1 })
        } else if (this._bgSpriteFrame) {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_SKIN, { skin: 0 })
        }
    }

    getMatchResult(callback?: Function) {
        let show = DataMgr.getData<boolean>("showMatchResultPush")
        if (!show) {
            DataMgr.setData<boolean>("showMatchResultPush", true)
            return
        }

        if (Date.now() - this._lastResultTime <= 30000) {
            return
        }

        this._lastResultTime = Date.now()

        let bCheck = DataMgr.getData<boolean>(RESULT_CHECK)
        MatchSvr.GeCompletedList(() => {
            let data = DataMgr.getData<TResults>(Constants.DATA_DEFINE.MATCH_COMPLETED)
            if (!data) {
                callback && callback()
                return
            }

            let results: TResults = data.filter(item => item.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_AWARD)
            if (results.length > 0) {

                let activitys = results.filter(i => i.type === Constants.MATCH_TYPE.ACTIVITY_MATCH)
                results = results.filter(i => i.type !== Constants.MATCH_TYPE.ACTIVITY_MATCH)
                if (results.length > 0) {
                    UIMgr.OpenUI("lobby", "component/match/matchResult/MatchResultPush", { param: results, closeCb: () => { this.checkGradeUpdate(callback) } })
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
                        Helper.OpenPopUI("component/match/activityMatch/ActivityMatchSettlement", activitys[0].name, null, param)
                    })
                }
                // }
            }
        })
        DataMgr.setData(RESULT_CHECK, true)
    }

    checkGradeUpdate(callback?: Function) {
        QualifyingSrv.GetCurSeason((res) => {
            //上一赛赛季结算信息
            if (res.last_settle) {
                UIMgr.OpenUI("lobby", "component/League/QualifyingLevel", { param: { type: 1, data: res }, closeCb: () => { callback && callback() } })
            } else {
                let curSeason: any = DataMgr.getData(Constants.DATA_DEFINE.QUALIFYING_CUR_SEASON)
                if (curSeason) {
                    if (res.grade.level > curSeason.grade.level) {
                        QualifyingSrv.GetListRewardStatus((status_list) => {
                            for (let v of status_list) {
                                if (v.major == res.grade.major && v.minor == res.grade.minor && v.status != 2) {   //status = 0条件不满足 1未领取 2已领取
                                    UIMgr.OpenUI("lobby", "component/League/QualifyingLevel", { param: { type: 2, data: { grade: curSeason.grade, finalGrade: res.grade } }, closeCb: () => { callback && callback() } })
                                }
                            }
                        })
                    }
                }
            }

            DataMgr.setData(Constants.DATA_DEFINE.QUALIFYING_CUR_SEASON, res, true)
        })
    }
}
