/*
 * @Description: 主界面
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import BaseUI from "../../script/base/BaseUI";
import { EventMgr } from "../../script/base/EventMgr";
import { Constants } from "../../script/igsConstants";
import { Helper } from "../../script/system/Helper";
import { UserSrv } from "../../script/system/UserSrv";
import { ActivitySrv, SignSrv } from "../../script/system/ActivitySrv";
import { DataMgr } from "../../script/base/DataMgr";
import { QualifyingSrv } from "../../script/system/QualifyingSrv";
import { UIMgr } from "../../script/base/UIMgr";
import { User } from "../../script/data/User";
import { Match } from "../../script/api/matchApi";
import { LeagueSvr } from "../../script/system/LeagueSvr";
import { MatchSvr } from "../../script/system/MatchSvr";
import { NoticeSrv } from "../../script/system/NoticeSrv";
import { IgsBundles } from "../../script/data/IgsBundles";
import { ShopSvr } from "../../script/system/ShopSvr";


let igs = window["igs"]

const { ccclass, property } = cc._decorator;

// const RESULT_CHECK = "resultCheck"

@ccclass
export default class MainScene extends BaseUI {

    _queue = [
        // this.checkRealTimeMatchReback.bind(this),
        this.checkNewbiw.bind(this),
        // this.checkSign.bind(this),
        // this.checkSylder,
        this.checkLeague.bind(this),
        this.checkOfflineResult.bind(this),
        this.checkGradeUpdate.bind(this),
        this.checkNotice.bind(this)
    ]

    _idx = 0;

    onLoad() {
        this.initEvent()
    }

    start() {
        this.initData()
    }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.CHANGE_GAME_ID, this.onChangeGame, this)
        EventMgr.on(Constants.EVENT_DEFINE.FIRST_OPEN_QUEUE, this.checkQueue, this)

        EventMgr.on(Constants.EVENT_DEFINE.SHOW_BASE_SCENE_LOADING, this.showLoading, this)
        EventMgr.on(Constants.EVENT_DEFINE.HIDE_BASE_SCENE_LOADING, this.hideLoading, this)

        EventMgr.on(Constants.EVENT_DEFINE.CHANGE_SKIN, (res) => {
            if (!Helper.isIosAudit()) {
                this.setActive("BG", res.skin === 1)
            }
        }, this)

        EventMgr.on(Constants.EVENT_DEFINE.FOREGROUND, this.checkShopBox, this)
    }

    initData() {
        UserSrv.GetPromotion()
        // this.checkQueue()
        let self = this
        this.checkRealTimeMatchReback((next) => {
            if (false === next) return
            let opened = DataMgr.getData<boolean>("firstOpen")
            if (!opened) {
                ActivitySrv.init(() => {
                    self.checkQueue()
                })
                // QualifyingSrv.GetQualifyingConfig()
                QualifyingSrv.init()
                DataMgr.setData("firstOpen", true)
            }
        })

        cc.tween(this.getNode("loading/loading")).repeatForever(cc.tween().to(1.5, { angle: -180 }).to(1.5, { angle: -360 }).set({ angle: 0 })).start()
        this.setActive("loading", false)

        cc.director.once(cc.Director.EVENT_AFTER_DRAW, () => {
            DataMgr.setData(Constants.DATA_DEFINE.BASE_CONTENT_HEIGHT, this.getNode("center/main").height)

            IgsBundles.Preload("lobby", "component/base/LockPop")
        })

        UserSrv.UpdateItem()
    }

    onChangeGame(msg) {
        console.log("====onChangeGame == " + JSON.stringify(msg))
        if (!msg) {
            return
        }

        let gameId = msg.gameId
        if (!gameId) {
            return
        }

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_BASE_SCENE_LOADING)

        EventMgr.once(Constants.EVENT_DEFINE.LOGIN_SUCCESS, () => {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "match" })
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BASE_SCENE_LOADING)
            Match.SetCurGame(gameId)
            DataMgr.setData(Constants.DATA_DEFINE.GAME_BUNDLE, msg.bundle, true)
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_MATCH_LIST)
        }, this)
        DataMgr.data.Config.gameId = gameId
        DataMgr.setData<string>(Constants.DATA_DEFINE.LAST_GAME_ID, gameId, true)
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.ACCOUNT_LOGIN, { relogin: true })
    }

    checkQueue() {
        if (User.PlayGame > 6 && this._queue.length > this._idx) {
            this._queue[this._idx++]()
        }
    }

    checkNewbiw() {
        let info = ActivitySrv.GetActivityById(1002)
        let node = this.getNode("center/main/view/content/MatchScene/logo/btnNewbie")
        if (info) {
            UIMgr.OpenUI("lobby", "component/activity/newbie/NewbieAward", { param: { activityInfo: info, checkQueue: true, btn: node } })
            return
        }

        this.checkSign()
    }

    checkSign() {
        let self = this
        let node = this.getNode("center/main/view/content/MatchScene/logo/btnSign")
        SignSrv.GetConfig((config) => {
            if (config) {
                for (let i = 0; i < config.list.length; i++) {
                    let index = i + 1
                    if (index === config.DayIndex) {
                        if (config.Receive !== 1) {
                            let info = ActivitySrv.GetActivityById(8)
                            if (info) {
                                info.receive_num = info.receive_num || 0
                                if (info.day_times && info.receive_num < info.day_times) {
                                    UIMgr.OpenUI("lobby", "component/activity/sign/Sign", { param: { signConfig: config, activityConfig: info, checkQueue: true, btn: node } })
                                    return
                                }
                            }
                        }
                    }
                }
            }

            self.checkSylder()
        })
    }

    checkSylder() {
        let info = ActivitySrv.GetActivityById(4)
        if (info) {
            info.receive_time = info.receive_time || 1
            info.receive_num = info.receive_num || 0
            if (info.day_times && info.receive_num < info.day_times) {
                if (info.receive_time && Date.now() / 1000 - info.receive_time >= info.interval_time * 60) {
                    UIMgr.OpenUI("lobby", "component/activity/turntable/MainTurntable", { single: true, param: { dataInfo: info, checkQueue: true } })
                    return
                }
            }
        }

        this.checkQueue()
    }

    checkLeague() {
        let self = this
        LeagueSvr.GetCurLeague(Constants.LEAGUE_TYPE.PRACTICE_LEAGUE, (res) => {
            if (res && res.league_id) {
                LeagueSvr.GetLeagueAwardConfig(Constants.LEAGUE_TYPE.PRACTICE_LEAGUE, res.league_id, () => {
                    let data = DataMgr.getData<any>(Constants.DATA_DEFINE.LEAGUE_RESULT)
                    if (data) {
                        let param = {
                            confirmName: "分享",
                            cancelName: "知道了",
                            confirmIcon: "image/button/common-lvanniou",
                            confirm: () => { Helper.shareInfo() },
                            type: Constants.LEAGUE_TYPE.PRACTICE_LEAGUE,
                        }
                        Helper.OpenPopUI("component/league/league/LeagueSettlement", "联赛结算", param)
                        return
                    }

                    self.checkQueue()
                })
                return
            }
            self.checkQueue()
        })
    }

    checkOfflineResult() {
        let self = this
        MatchSvr.GeCompletedList(() => {
            let data = DataMgr.getData<TResults>(Constants.DATA_DEFINE.MATCH_COMPLETED)
            if (data) {
                let results: TResults = data.filter(item => item.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_AWARD)
                if (results.length > 0) {
                    UIMgr.OpenUI("lobby", "component/match/offlineResult/MatchOffline", { param: results, index: 10 })
                    return
                }
            }

            self.checkQueue()
        })
    }

    checkGradeUpdate() {
        let self = this
        QualifyingSrv.GetCurSeason((res) => {
            //上一赛赛季结算信息
            if (res.last_settle) {
                UIMgr.OpenUI("lobby", "component/league/qualifying/QualifyingLevel", { param: { type: 1, data: res } })
                return
            } else {
                let curSeason: any = DataMgr.getData(Constants.DATA_DEFINE.QUALIFYING_CUR_SEASON)
                if (curSeason) {
                    if (res.grade.level > curSeason.grade.level) {
                        QualifyingSrv.GetListRewardStatus((status_list) => {
                            for (let v of status_list) {
                                if (v.major == res.grade.major && v.minor == res.grade.minor && v.status != 2) {   //status = 0条件不满足 1未领取 2已领取
                                    UIMgr.OpenUI("lobby", "component/league/qualifying/QualifyingLevel", { param: { type: 2, data: { grade: curSeason.grade, finalGrade: res.grade } } })
                                    DataMgr.setData(Constants.DATA_DEFINE.QUALIFYING_CUR_SEASON, res, true)
                                    return
                                }
                            }
                        })
                    }
                }
            }
            DataMgr.setData(Constants.DATA_DEFINE.QUALIFYING_CUR_SEASON, res, true)
            self.checkQueue()
        })
    }

    checkNotice(checkNext: boolean = true) {
        let self = this
        let param = {
            plat_aid: DataMgr.data.Config.platId,
            game_gid: DataMgr.data.Config.gameId,
            pn: DataMgr.data.Config.pn,
            ns: "igaoshou",
        }
        NoticeSrv.getNotice(param, (res) => {
            if (res && res.code == "00000" && res.notice) {
                for (let v of res.notice) {
                    let openPop = false
                    let readTime: number = DataMgr.getData(Constants.DATA_DEFINE.NOTICE_READ_DATA + v._id)
                    let readDay = new Date(readTime).getDate()
                    let today = new Date().getDate()
                    let now = new Date().getTime() / 1000
                    if (now > v.begin_time && now < v.end_time && readDay != today) {
                        if (v.skip == "1" || v.skip == "5") {
                            if (cc.sys.WECHAT_GAME === cc.sys.platform) {
                                openPop = true
                            }
                        } else if (v.skip == "6" && DataMgr.data.OnlineParam.promote_system == 1) {
                            openPop = true
                        } else {
                            openPop = true
                        }
                        if (openPop) {
                            UIMgr.OpenUI("lobby", "component/notice/Notice", { param: v })
                            return
                        }
                    }
                }
            }

            if (checkNext) {
                self.checkQueue()
            }
        })
    }

    checkRealTimeMatchReback(callback?: Function) {
        MatchSvr.checkRealTimeMatch(callback)
    }

    checkShopBox() {
        console.log("===checkShopBox====")
        let boxId = DataMgr.getData<string>(Constants.DATA_DEFINE.LAST_PAY_GOODS)
        if (boxId) {
            ShopSvr.getPayOrder((res) => {
                if (res && res.goods_gid === boxId && res.order_status !== 1) {
                    DataMgr.setData<string>(Constants.DATA_DEFINE.LAST_PAY_GOODS, null)
                    let box = ShopSvr.getBoxById(boxId)
                    if (box) {
                        UserSrv.UpdateItem(() => UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: box.items }, }))
                        if (box.type === Constants.SHOP_TYPE.FIRST_PAY) {
                            DataMgr.setData(Constants.DATA_DEFINE.FIRST_BUY, true)
                        } else if (box.type === Constants.SHOP_TYPE.PREFERENCE) {
                            DataMgr.setData(Constants.DATA_DEFINE.PREFERENCE_BOX_RANDOM, null)
                            DataMgr.setData(Constants.DATA_DEFINE.LIMIT_BUY, true)
                        }
                    }
                }
            })
        }
    }

    showLoading() {
        this.setActive("loading", true)
    }

    hideLoading() {
        this.setActive("loading", false)
    }
}
