import { Constants } from "../igsConstants";
import { DataMgr } from "../base/DataMgr";
import { Helper } from "../system/Helper";
import { EventMgr } from "../base/EventMgr";
import { PluginMgr } from "../base/PluginMgr";
import { MatchSvr } from "../system/MatchSvr";
import { UserSrv } from "../system/UserSrv";
import { ShopSvr } from "../system/ShopSvr";
import { igs } from "../../../../igs";
import { UIMgr } from "../base/UIMgr";
import { User } from "../data/User";
import { Util } from "./utilApi";

let _ready: boolean = false

const _hostname = {
    [Constants.ENV.ENV_SANDBOX]: "igaoshou.mcbeam.cc",
    [Constants.ENV.ENV_PRODUCTION]: "igaoshou.mcbeam.pro",
    [Constants.ENV.ENV_ABROAD]: "igaoshou.mcbeam.dev",
}

const PLATFORM_API = 'platformapi'

export namespace PlatformApi {

    export let isForeground = true

    export function Initialize() {
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.PLATFORM_INIT)
    }

    export function Launch() {
        Initialize()

        // cc.assetManager.loadBundle("lobby", () => {
            loadBase()
        // })
        
        let start = () => {
            if (User.Data.openId === "10000" || User.PlayGame === 0) {
                let abKey = PluginMgr.getABTestKey("expt_enter_test")
                console.log("abKey " + abKey)
                if (abKey === "1") {
                    enterGame()
                } else {
                    enterMatch()
                }
            } else {
                enterLobby()
            }
        }

        if (cc.sys.isNative) {
            EventMgr.once(Constants.EVENT_DEFINE.CONFIG_INIT, () => {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.PLUGIN_INIT)
            })
            EventMgr.once(Constants.EVENT_DEFINE.LOGIN_SUCCESS, () => {
                start()
            })
        } else {
            EventMgr.once(Constants.EVENT_DEFINE.PLUGIN_FINISH, () => {                
                cc.assetManager.loadBundle("lobby", () => {
                    start()
                })                
            })
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.PLUGIN_INIT)
        }
        loadConfig()
    }

    export function GameBack() {
        enterResult()
        Util.PlayBackgroundMusic()
    }

    export function GotoLobby(tab: string = null) {
        enterLobby(tab)
    }

    export function SDKVersion(): string {
        return Constants.version
    }

    function loadBase() {
        DataMgr.data.Config = igs.exports.config
        // DataMgr.data.Config = {
        //     "platId": 5,
        //     "pn": "com.gaoshou.billiard",
        //     "gameId": "7d6f4675-fef4-b226-4d13-e0970e2a5ab4",
        //     "gameName": "台球",
        //     "env": 1,
        //     "orientation": 0,
        //     "wxAPPID": "wx1fa2f9d9c35f0400",
        //     "wxMIDASID": "",
        //     "unPreload": true,
        //     "mid": 0,
        //     "hideMusic": false,
        //     "bootConfig": {
        //         "mainGameBundle": "billiard"
        //     },
        //     "hostname": _hostname[Constants.ENV.ENV_SANDBOX]
        // }
        // console.log("===loadBase")
        // console.log(JSON.stringify(DataMgr.data.Config))

        let env = Helper.GetURI("env")
        if (null !== env && undefined !== env) {
            DataMgr.data.Config.env = Number(env)
        }
        env = DataMgr.getData(Constants.DATA_DEFINE.IGS_ENV)
        if (null !== env && undefined !== env) {
            DataMgr.data.Config.env = Number(env)
        }

        DataMgr.data.Config.hostname = _hostname[DataMgr.data.Config.env]

        let gameId = Helper.GetURI("gameid")
        if (gameId ?? false) {
            DataMgr.data.Config.gameId = gameId
        }        
    }

    function loadConfig() {
        let lastGameId = DataMgr.getData<string>(Constants.DATA_DEFINE.LAST_GAME_ID) || DataMgr.data.Config.gameId
        if (DataMgr.data.Config.gameId !== lastGameId) {
            DataMgr.data.Config.gameId = lastGameId
            MatchSvr.LoadMatchConfig(lastGameId)
        } else if (!igs.exports.lobbyConfig.config || !igs.exports.lobbyConfig.config.match_detail) {
            MatchSvr.LoadMatchConfig(DataMgr.data.Config.gameId)
        } else {
            MatchSvr.initMatch(igs.exports.lobbyConfig.config.match_detail)
        }

        UserSrv.initItems()

        cc.assetManager.loadBundle("lobby", (err, asset) => {
            if (!err) {
                DataMgr.data.Bundle = asset
            }

            // ShopSvr.initShop(igs.exports.lobbyConfig.config)
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CONFIG_INIT)
        })

        Util.PlayBackgroundMusic()
    }

    function enterResult(callback?: Function) {
        console.log("====enterResult " + Date.now())
        cc.assetManager.getBundle("igaoshou").loadScene("result", (err, res) => {
            if (err) {
                Helper.reportEvent("load result scene", "err", err.message)
                return
            }
            console.log("===loadResult " + Date.now())
            cc.director.runSceneImmediate(res, null, () => {
                console.log("===runResult" + Date.now())
                callback?.()
            })
        })
    }

    function enterLobby(tab?: string, callback?: Function) {
        // Helper.reportEvent("平台加载", "大厅launch", "请求主界面")
        console.log("===enterLobby " + Date.now())
        cc.assetManager.getBundle("igaoshou").loadScene("lobby", (err, scene) => {
            if (err) {
                Helper.reportEvent("load lobby scene", "err", err.message)
                return
            }
            // Helper.reportEvent("平台加载", "大厅launch", "进入主界面")
            console.log("===loadLobby " + Date.now())
            cc.director.runSceneImmediate(scene, () => { }, () => {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BANNER)
                if (tab) {
                    setTimeout(() => {
                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.INIT_MAIN_TAB, { name: tab })
                    }, .1);
                }
                console.log("===runLobby " + Date.now())
                callback?.()
            })
        })
    }

    function enterMatch(callback?: Function) {
        // Helper.reportEvent("平台加载", "大厅launch", "请求匹配界面")
        console.log("===enterMatch " + Date.now())
        cc.assetManager.getBundle("igaoshou").loadScene("match", (err, scene) => {
            if (err) {
                Helper.reportEvent("load match scene", "err", err.message)
                return
            }
            MatchSvr.JoinSingleMatch()
            Helper.reportEvent("匹配-3.1、进入匹配界面")
            console.log("===loadMatch " + Date.now())
            cc.director.runSceneImmediate(scene, () => {
                console.log("===runMatch " + Date.now())
                callback?.()
            })
        })
    }

    function enterGame() {
        MatchSvr.JoinSingleMatch()
        MatchSvr.EnterSingleMatch()
        MatchSvr.StartGame()
    }
}

cc.game.on(cc.game.EVENT_SHOW, () => {
    console.log("==foreground==")
    PlatformApi.isForeground = true
    cc.audioEngine.resumeMusic()
    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.FOREGROUND)

    Helper.reportEvent("游戏操作", "切换至前台")
    PluginMgr.setHidePlugAds(false)
});

cc.game.on(cc.game.EVENT_HIDE, () => {
    console.log("==background==")
    PlatformApi.isForeground = false
    cc.audioEngine.pauseMusic()
    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.BACKGROUND)

    if (!PluginMgr.checkPlugAd()) {
        EventMgr.off(Constants.EVENT_DEFINE.FOREGROUND, PLATFORM_API)
        EventMgr.once(Constants.EVENT_DEFINE.FOREGROUND, () => {
            PluginMgr.showPluginAd()
        }, PLATFORM_API)
    }

    Helper.reportEvent("游戏操作", "切换至后台")
});

if (!CC_EDITOR) {
    let consoleError = window.console.error
    window.console.error = (...args: any[]) => {
        // console.log("=======>", JSON.stringify(args));
        consoleError && consoleError.apply(window, args);
        Helper.reportEvent(JSON.stringify(args))
    }
}