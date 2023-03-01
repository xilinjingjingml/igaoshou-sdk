/*
 * @Description: 
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import { Constants } from "../constants"
import { DataMgr } from "./DataMgr"
import { HttpMgr } from "./HttpMgr"
import { HotUpdate } from "./HotUpdate"
import { UIMgr } from "./UIMgr"
import { SettingMgr } from "./SettingMgr"
import { Helper } from "../system/Helper"
import { LeagueSvr } from "../system/LeagueSvr"
import { AdSrv } from "../system/AdSrv"
import { User } from "../system/User"
import { Account } from "../system/Account"
import { MatchSvr } from "../system/MatchSvr"
import { LocalMgr } from "./LocalMgr"

const ONLINE_PARAM_WEIGHT = 10
const HOTUPDATE_WEIGHT = 40
const PRELOAD_RESOURCE_WEIGHT = 50
const PRELOAD_SCENE_WEIGHT = 50

const _hostname = {
    [Constants.ENV.ENV_SANDBOX]: "igaoshou.mcbeam.cc",
    [Constants.ENV.ENV_PRODUCTION]: "igaoshou.mcbeam.pro",
    [Constants.ENV.ENV_ABROAD]: "igaoshou.mcbeam.dev",
}

const ONLINE_PARAM_URI = "api/mcbeam-version-api/config/getOnlineParam"

let _download_host = "download.mcbeam.cc"

let _progress: number = 0
let _passProgress: number = 0

export namespace LoadMgr {
    export function startLoading(callback?: (err, state, progress) => void) {
        if (!DataMgr.Config) {
            cc.warn("loadMgr config is null")
            return
        }

        _progress = ONLINE_PARAM_WEIGHT + PRELOAD_RESOURCE_WEIGHT// + PRELOAD_SCENE_WEIGHT
        _passProgress = 0
        _loadOnlineParam(callback)
    }

    // 拉取在线参数
    function _loadOnlineParam(callback?: (err, state, progress) => void) {
        Helper.reportEvent("平台初始化", "读取在线参数", "读取")
        let host = _hostname[DataMgr.Config.env]
        host = host.replace("igaoshou.", "mcbeam.")
        let param = {
            game_gid: DataMgr.Config.gameId,
            plat_aid: DataMgr.Config.platId,
            ns: "igaoshou",
        }
        HttpMgr.post("https://" + host + "/" + ONLINE_PARAM_URI, null, null, param, (res, event) => {
            cc.log(res)
            if (!res && event && event.type === "progress") {
                callback(null, Constants.GAME_STATE.LOAD_ONLINE_PARAM, (event.loaded / event.total * ONLINE_PARAM_WEIGHT) / _progress)
            } else if (res && res.online_param) {
                DataMgr.OnlineParam = Helper.ParseJson(res.online_param)
                DataMgr.OnlineParam = (DataMgr.OnlineParam === "null" || !DataMgr.OnlineParam) ? {} : DataMgr.OnlineParam
                _passProgress += ONLINE_PARAM_WEIGHT
                DataMgr.setData(Constants.DATA_DEFINE.GAME_STATE, Constants.GAME_STATE.LOAD_ONLINE_PARAM)
                callback(null, Constants.GAME_STATE.LOAD_ONLINE_PARAM, (_passProgress) / _progress)
                DataMgr.Config.hostname = res.hostname || _hostname[DataMgr.Config.env]
                DataMgr.Config.gameVersion = res.gameVersion || {}
                _download_host = res.downloadHost || (DataMgr.OnlineParam && DataMgr.OnlineParam.downloadHost) || _download_host
                Helper.reportEvent("平台初始化", "读取在线参数", "读取完成")
                // 获取完成 判断热更新
                _hotUpdate(callback)
            } else {
                // 没有拉到配置 直接加载本地
                DataMgr.Config.hostname = _hostname[DataMgr.Config.env]
                // DataMgr.OnlineParam = {}
                _download_host = _download_host
                DataMgr.setData(Constants.DATA_DEFINE.GAME_STATE, Constants.GAME_STATE.LOAD_RESOURCE)
                callback(null, Constants.GAME_STATE.LOAD_RESOURCE, (_passProgress / _progress) * .9)
                Helper.reportEvent("平台初始化", "读取在线参数", "读取完成")
                _loadSetting(callback)
            }

        })
    }


    // 版本热更新
    function _hotUpdate(callback?: (err, state, progress) => void) {
        Helper.reportEvent("平台初始化", "热更新", "更新")
        if (CC_JSB && DataMgr.Config.gameVersion) {
            let ver = Helper.CallStaticMethod("org/cocos2dx/javascript/Luaj", "getVersionCode", "()I")
            if (ver < DataMgr.Config.gameVersion) {

                let up = () => {
                    _progress += HOTUPDATE_WEIGHT
                    HotUpdate.update(DataMgr.Config.pn, ("https://" + _download_host + "/" + DataMgr.Config.pn + "/" + DataMgr.Config.gameVersion.verCode + "/"),
                        (value) => {
                            DataMgr.setData(Constants.DATA_DEFINE.GAME_STATE, Constants.GAME_STATE.LOAD_HOT_UPDATE)
                            callback(null, Constants.GAME_STATE.LOAD_HOT_UPDATE, (value * HOTUPDATE_WEIGHT + ONLINE_PARAM_WEIGHT) / _progress)
                        },
                        (value) => {
                            _passProgress += HOTUPDATE_WEIGHT
                            DataMgr.setData(Constants.DATA_DEFINE.GAME_STATE, Constants.GAME_STATE.LOAD_RESOURCE)
                            callback(null, Constants.GAME_STATE.LOAD_RESOURCE, (_passProgress / _progress))


                            // 更新完成 预加载资源
                            _loadSetting(callback)
                        }
                    )
                }

                let param = {
                    confirmName: "立即更新",
                    cancelName: "暂不更新",
                    cancel: () => {
                        if (DataMgr.Config.enforceUpdate) {
                            cc.game.end()
                        } else {
                            _loadSetting(callback)
                        }
                    },
                    confirm: () => {
                        if (cc.sys.os == cc.sys.OS_ANDROID) {
                            cc.log("[UpdateScene.checkAppVersion] confirmFunc")
                            const params = [
                                DataMgr.Config.updateUrl,
                                "下载中",
                                "正在更新游戏资源",
                                window["md5"](DataMgr.Config.updateUrl) + ".apk",
                                () => { }
                            ]
                            Helper.CallStaticMethod("com/izhangxin/utils/luaj", "showUpgradeDialog", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V", params)
                        } else if (cc.sys.os == cc.sys.OS_IOS) {
                            cc.log("[UpdateScene.checkAppVersion] confirmFunc")
                            cc.sys.openURL(DataMgr.Config.updateUrl)
                        } else {
                            up()
                        }
                    },
                    param: { msg: "发现新版本" }
                }
                Helper.OpenPopUI("component/Base/MsgEntry", "登录失败", param)
            }
        } else {
        // 预加载资源
            DataMgr.setData(Constants.DATA_DEFINE.GAME_STATE, Constants.GAME_STATE.LOAD_RESOURCE)
        callback(null, Constants.GAME_STATE.LOAD_RESOURCE, (_passProgress / _progress) * .9)
        _loadSetting(callback)
        }
    }

    function _loadSetting(callback?: (err, state, progress) => void) {
        if (DataMgr.Config.unPreload) {
            _accountLogin(callback)
        } else {
            _loadResource(callback)
        }
    }

    // 预加载资源
    function _loadResource(callback?: (err, state, progress) => void) {
        Helper.reportEvent("平台初始化", "加载大厅prefab", "加载")
        UIMgr.PreLoadUI("component", (err, finish, total) => {
            if (err) {
                cc.warn("===_loadResource err: " + err)
                Helper.reportEvent("平台初始化", "加载大厅prefab", "加载失败")
                callback(err, err, null)
                return
            }
            // cc.log("_loadResource " + finish + " total " + total + " " + Date.now())
            if (finish < total) {
                let value = finish / total
                callback(null, Constants.GAME_STATE.LOAD_RESOURCE, (value * PRELOAD_RESOURCE_WEIGHT + _passProgress) / _progress * .9)
            } else if (finish === -1) {
                Helper.reportEvent("平台初始化", "加载大厅prefab", "加载完成")
                _passProgress += PRELOAD_RESOURCE_WEIGHT
                DataMgr.setData(Constants.DATA_DEFINE.GAME_STATE, Constants.GAME_STATE.ACCOUNT_LOGIN)
                // if (Helper.isNative() && cc.sys.os == cc.sys.OS_IOS) {
                //     callback(null, Constants.GAME_STATE.ACCOUNT_LOGIN, 1)
                // }else{
                    callback(null, Constants.GAME_STATE.ACCOUNT_LOGIN, (_passProgress / _progress) * .9)
                // }
                _accountLogin(callback)
            }
        })
    }

    function _accountLogin(callback?: (err, state, progress) => void) {
        if (Helper.isNative() && cc.sys.os === cc.sys.OS_IOS) {
            callback(null, Constants.GAME_STATE.GET_CONFIG, 1)
        }
        Helper.reportEvent("平台初始化", "用户登录", "登录")
        Account.login((res) => {
            Helper.reportEvent("平台初始化", "用户登录", "登录完成")
            DataMgr.setData(Constants.DATA_DEFINE.GAME_STATE, Constants.GAME_STATE.GET_CONFIG)
            // if (Helper.isNative() && cc.sys.os == cc.sys.OS_IOS) {
            //     callback(null, Constants.GAME_STATE.GET_CONFIG, 1)
            // }else{
                callback(null, Constants.GAME_STATE.GET_CONFIG, .95)
            // }
            _loadConfig(callback)
        })
    }

    function _loadConfig(callback?: (err, state, progress) => void) {
        Helper.reportEvent("平台初始化", "请求平台加载", "读取配置")
        User.LoadConfig(() => {
            // this._updateProgress(1)
            // this._state = Constants.GAME_STATE.LOAD_FINISH
            Helper.reportEvent("平台初始化", "请求平台加载", "读取完成")
            DataMgr.setData(Constants.DATA_DEFINE.GAME_STATE, Constants.GAME_STATE.LOAD_FINISH)
            callback(null, Constants.GAME_STATE.LOAD_FINISH, 1)
            _startGame()
        })
        User.GetShareInfo()
        AdSrv.init()
        LocalMgr.Init()
        LeagueSvr.GetLeagueAwardConfig(Constants.LEAGUE_TYPE.PROFESSION_LEAGUE)
        LeagueSvr.GetLeagueAwardConfig(Constants.LEAGUE_TYPE.PRACTICE_LEAGUE)
    }

    function _startGame() {
        // this._bExcess = true
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (user.histroy.platGame === 0 && user.newbie === true) {
            Helper.reportEvent("平台初始化", "请求平台加载", "第一局游戏匹配")
            _startFirstGame()
        } else {
            if (!(DataMgr.getData<boolean>("firstStart") || false)) {
                if (user.newbie === false) {
                    Helper.reportEvent("平台初始化", "请求平台加载", "进入主界面0")
                } else if (user.histroy.platGame > 0) {
                    Helper.reportEvent("平台初始化", "请求平台加载", "进入主界面1")
                }
                DataMgr.setData("firstStart", true)
            } else {
                Helper.reportEvent("平台初始化", "请求平台加载", "进入主界面2")
            }
            _startMainScene()
        }
    }

    function _startMainScene() {
        DataMgr.Bundle.loadScene("iGaoShou", (err, scene) => {
            if (err) {
                cc.error("not found scene with name iGaoShou")
                Helper.reportEvent("平台加载", "大厅launch", "not found scene with name iGaoShou")
                return
            }
            Helper.reportEvent("平台加载", "大厅launch", "Loading界面")
            cc.director.runScene(scene, null, () => {
                Helper.reportEvent("平台初始化", "平台加载界面初始化", "加载完成")
                UIMgr.OpenUI("scene/BaseScene", { single: true, enterAni: Constants.PAGE_ANI.FADE_IN })
            })
        })
    }

    function _startFirstGame() {
        let firstMatch = getFirstMatch(Constants.MATCH_TYPE.BATTLE_MATCH)
        // 奖券场 新手第一场是练习赛
        if (DataMgr.Config.platId === 5) {
            firstMatch = getFirstMatch(Constants.MATCH_TYPE.PRACTICE_MATCH)
        }

        DataMgr.Bundle.loadScene("iGaoShou", (err, scene) => {
            if (err) {
                cc.error("not found scene with name iGaoShou")
                Helper.reportEvent("平台加载", "大厅launch", "not found scene with name iGaoShou")
                return
            }
            cc.director.runScene(scene, null, () => {
                if (firstMatch && MatchSvr.checkGateMoney(firstMatch.matchId)) {
                    Helper.reportEvent("平台初始化", "匹配界面", "开始匹配")
                    MatchSvr.JoinMatch(firstMatch.matchId, null,
                        () => { Helper.reportEvent("平台初始化", "匹配界面", "匹配成功") },
                        () => { _startMainScene() })
                } else {
                    Helper.reportEvent("平台初始化", "找不到比赛或者游戏币不足", "进入主界面")
                    _startMainScene()
                }
            })
        })
    }

    function getFirstMatch(type: Constants.MATCH_TYPE) {
        let data: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
        if (!data) {
            return null
        }
        let find: IMatchInfo = null
        let key: string = null
        for (let i in data) {
            if (data[i].type === type && !data[i].freeAd) {
                if (!find || find.gateMoney[0].num > data[i].gateMoney[0].num) {
                    find = data[i]
                    key = i
                }
            }
        }

        return find
    }
}