/*
 * @Description: 加载界面
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import BaseUI from "../base/BaseUI";
import { UIMgr } from "../base/UIMgr";
import { Constants } from "../constants";
import { LoadMgr } from "../base/LoadMgr";
import { Account } from "../system/Account";
import { User } from "../system/User";
import { DataMgr } from "../base/DataMgr";
import { AdSrv } from "../system/AdSrv";
import { LeagueSvr } from "../system/LeagueSvr";
import { MatchSvr } from "../system/MatchSvr";
import { EventMgr } from "../base/EventMgr"
import { PluginMgr } from "../base/PluginMgr";
import { Helper } from "../system/Helper";

const { ccclass, property } = cc._decorator;

// const GAME_STATE = "game_state"

@ccclass
export default class LoadScene extends BaseUI {

    // _state: Constants.GAME_STATE = Constants.GAME_STATE.NONE

    _bExcess: boolean = false
    
    _progressVal: number = 0
    _progressUp: number = 0

    textTip:string[] = [
        "我们将会为您匹配一个实力相当的对手",
        "奖券可以兑换实物、话费等各种奖品",
        "参与对战赛可获得大量的奖券奖励",
        "奖券可以兑换实物、话费等各种奖品",
        "在高等级的练习赛中获胜能获得更多奖券！",
        "奖券可以兑换实物、话费等各种奖品",
        "点击头像可以查看比赛战绩和最近十局的战况",
        "奖券可以兑换实物、话费等各种奖品",
        "在比赛中赢得勋章，可以在联赛中进行排名并瓜分丰厚奖励",
        "奖券可以兑换实物、话费等各种奖品",
        "在主页内可以查看您参与的所有比赛哦",
        "奖券可以兑换实物、话费等各种奖品",
        "在商城可以免费获得金币、银币、奖券等各种奖励！",
    ]

    onOpen() {
        let image = DataMgr.getData<cc.SpriteFrame>(Constants.DATA_DEFINE.BACK_GROUND_IMAGE)
        if (image) {
            this.setSpriteFrame("BG", image)
        }

        this._progressVal = 0


        this.setLabelValue("version", "version:" + Constants.version)

        this.setProgressLength("progress", cc.winSize.width - 100)
        this.setProgressValue("progress", this._progressVal)
        this.setLabelValue("value", this._progressVal + "%")   
        
        let state = DataMgr.getData<Constants.GAME_STATE>(Constants.DATA_DEFINE.GAME_STATE)
        if (state === Constants.GAME_STATE.LOAD_FINISH) {
            this._startMainScene()
        } else {
            this._updateState()
        }

        this.setLabelValue("textTip", this.textTip[Math.floor(Math.random() * this.textTip.length)])
    }

    onEnterEnd() {
        // this._startLoading()
        // if (this._bExcess)
        //     return
            
        // this._updateState()
    }

    _updateProgress(progress) {
        if (this._bExcess) {
            return
        }
        // this._progressUp = progress
        // this._progressUp = (progress - this._progressVal) /// .05
        // cc.log("update Progress = " + this._progressUp)
        // this._progressVal = progress
        progress = Math.min(1, progress)
        let progressBar = this.getNodeComponent("progress", cc.ProgressBar)        
        cc.tween(progressBar).stop()
        cc.tween(progressBar)
        .to(progress - progressBar.progress, {progress: progress})
        .call(() => {
            if (progress >= 1) {
                Helper.reportEvent("平台初始化", "请求平台加载", "完成进度条动画")
                // this._startGame()
            }
        })
        .start()
    }

    update(dt) {
        let progressBar = this.getNodeComponent("progress", cc.ProgressBar)
        this.setLabelValue("value", Math.floor(progressBar.progress * 100) + "%")
    }

    // update(dt) {
    //     if (this._progressUp - this._progressVal <= 0) 
    //         return

        

    //     cc.log(" val = " + (this._progressUp - this._progressVal) + " speed = " + (this._progressUp - this._progressVal) * 100 * dt)

    //     this._progressVal += (this._progressUp - this._progressVal) * 100 * dt
    //     if (this._progressVal <= this._progressUp)
    //         this._progressVal = this._progressUp
            
    //     this.setProgressValue("progress", this._progressVal)
    //     this.setLabelValue("value", Math.floor(this._progressVal * 100) + "%")
    // }
    
    _updateState() {
        let state = DataMgr.getData<Constants.GAME_STATE>(Constants.DATA_DEFINE.GAME_STATE)
        // cc.log("_updateState" + state)
        if (!state) {
            this._startLoading()
        } else if (state === Constants.GAME_STATE.LOAD_ONLINE_PARAM) {
            this.setLabelValue("msg", Constants.STRING_LIST.LOAD_ONLINE_PARAM)
        } else if (state === Constants.GAME_STATE.LOAD_HOT_UPDATE) {
            this.setLabelValue("msg", Constants.STRING_LIST.LOAD_HOT_UPDATE)
        } else if (state === Constants.GAME_STATE.LOAD_RESOURCE) {
            this.setLabelValue("msg", Constants.STRING_LIST.LOAD_RESOURCE)
        } else if (state === Constants.GAME_STATE.ACCOUNT_LOGIN) {
            this.setLabelValue("msg", Constants.STRING_LIST.ACCOUNT_LOGIN)
            // this._accountLogin()
        } else if (state === Constants.GAME_STATE.GET_CONFIG) {
            this.setLabelValue("msg", Constants.STRING_LIST.GET_CONFIG)
            // this._updateProgress(.99)
            // this._loadConfig()
        } else if (state === Constants.GAME_STATE.LOAD_FINISH) {
            this.setLabelValue("msg", Constants.STRING_LIST.LOAD_FINISH)
            // this._updateProgress(1)
            // this._startGame()
            // this.scheduleOnce(this._startMainScene.bind(this), .3)
        }
    }

    _startLoading() {
        Helper.reportEvent("平台初始化", "请求平台加载", "加载") 
        LoadMgr.startLoading((err, state: Constants.GAME_STATE, progress) => {
            if (err) {
                cc.warn(" Loading err: " + err)
                this.setLabelValue("msg", err)
                return
            }

            // progress *= .90
            // cc.log(progress)
            this._updateProgress(progress)
            // this._state = state            
            // if (state === Constants.GAME_STATE.ACCOUNT_LOGIN) {
            //     Helper.reportEvent("平台初始化", "请求平台加载", "加载完成")
            // }
            // DataMgr.setData(GAME_STATE, state)
            this._updateState()            
        })
    }

    // _accountLogin() {
    //     Helper.reportEvent("平台初始化", "用户登录", "登录")
    //     Account.login((res) => {
    //         this._updateProgress(.95)
    //         // this._state = Constants.GAME_STATE.GET_CONFIG
    //         Helper.reportEvent("平台初始化", "用户登录", "登录完成")
    //         DataMgr.setData(GAME_STATE, Constants.GAME_STATE.GET_CONFIG)            
    //         this._updateState()
    //     })
    // }

    // _loadConfig() {
    //     Helper.reportEvent("平台初始化", "请求平台加载", "读取配置")
    //     User.LoadConfig(() => {
    //         // this._updateProgress(1)
    //         // this._state = Constants.GAME_STATE.LOAD_FINISH
    //         Helper.reportEvent("平台初始化", "请求平台加载", "读取完成")
    //         DataMgr.setData(GAME_STATE, Constants.GAME_STATE.LOAD_FINISH)            
    //         this._updateState()
    //     })
    //     User.GetShareInfo()
    //     AdSrv.init()
    //     LeagueSvr.GetLeagueAwardConfig(Constants.LEAGUE_TYPE.PROFESSION_LEAGUE)
    //     LeagueSvr.GetLeagueAwardConfig(Constants.LEAGUE_TYPE.PRACTICE_LEAGUE)
    // }

    // _startGame() {
    //     this._bExcess = true
    //     let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
    //     if (user.histroy.platGame === 0 && user.newbie === true) {
    //         Helper.reportEvent("平台初始化", "请求平台加载", "第一局游戏匹配")
    //         this._startFirstGame()
    //     } else {
    //         if (!(DataMgr.getData<boolean>("firstStart") || false)) {
    //             if (user.newbie === false) {
    //                 Helper.reportEvent("平台初始化", "请求平台加载", "进入主界面0")
    //             } else if(user.histroy.platGame > 0) {
    //                 Helper.reportEvent("平台初始化", "请求平台加载", "进入主界面1")
    //             }
    //             DataMgr.setData("firstStart", true)
    //         } else {
    //             Helper.reportEvent("平台初始化", "请求平台加载", "进入主界面2")
    //         }
    //         this._startMainScene()
    //     }
    // }

    _startMainScene() {        
        this._updateProgress(1)        
        UIMgr.OpenUI("scene/BaseScene", {single: true, enterAni: Constants.PAGE_ANI.FADE_IN}, () => {
            this.close() 
        })
    }

    // _startFirstGame() {
    //     let firstMatch = this.getFirstMatch(Constants.MATCH_TYPE.BATTLE_MATCH)
    //     // 奖券场 新手第一场是练习赛
    //     if (DataMgr.Config.platId === 5) {
    //         firstMatch = this.getFirstMatch(Constants.MATCH_TYPE.PRACTICE_MATCH)
    //     }
    //     if (firstMatch && MatchSvr.checkGateMoney(firstMatch.matchId)) {
    //         Helper.reportEvent("平台初始化", "匹配界面", "开始匹配")
    //         MatchSvr.JoinMatch(firstMatch.matchId, null, () => {Helper.reportEvent("平台初始化", "匹配界面", "匹配成功"); this.close()})
    //     } else {
    //         Helper.reportEvent("平台初始化", "找不到比赛或者游戏币不足", "进入主界面")
    //         this._startMainScene()
    //     }
    // }

    // getFirstMatch(type: Constants.MATCH_TYPE) {
    //     let data: Constants.Matchs = DataMgr.getData<Constants.Matchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
    //     if (!data) {
    //         return null
    //     }
    //     let find: Constants.MatchInfo = null
    //     let key: string = null
    //     for (let i in data) {
    //         if (data[i].type === type && !data[i].freeAd) {
    //             if (!find || find.gateMoney[0].num > data[i].gateMoney[0].num) {
    //                 find = data[i]
    //                 key = i
    //             }
    //         }
    //     }

    //     return find
    // }
}
