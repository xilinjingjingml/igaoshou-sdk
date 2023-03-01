import { Constants } from "../constants";
import { DataMgr } from "../base/DataMgr";
import { UIMgr } from "../base/UIMgr";
import { Helper } from "../system/Helper";
import { MatchSvr } from "../system/MatchSvr";
import { EventMgr } from "../base/EventMgr";
import { SettingMgr } from "../base/SettingMgr";
import WxWrapper from "../system/WeChatMini";
import { Account } from "../system/Account";
import { PluginMgr } from "../base/PluginMgr";
import { LoadMgr } from "../base/LoadMgr";
import ByteDanceWrapper from "../system/ByteDanceMini";

let _ready: boolean = false

export namespace PlatformApi {

    export let isForeground = true

    export function Initialize(callback?: Function) {
        Helper.reportEvent("平台初始化", "大厅bundle加载", "[LYM]")
        WxWrapper.init()
        ByteDanceWrapper.init()
        Helper.reportEvent("平台初始化", "平台 API 初始化", "")
        Helper.LoadBundle("igaoshou", (bundle) => {
            Helper.reportEvent("平台初始化", "大厅bundle", "加载完成")
            console.log("loadBundle = " + Date.now())
            if (!bundle) {
                cc.error("not found bundle with name iGaoShou")
                Helper.reportEvent("平台初始化", "大厅bundle", "加载失败")
                return
            }

            DataMgr.Bundle = bundle
            _loadBaseConfig(() => {
                PluginMgr.onInit(callback)
            })
        })
    }

    export function LaunchPlatform(progress?: (val: number, tip: string) => void) {
        Helper.reportEvent("平台初始化", "大厅launch", "加载")
        console.log("luachPlatform = " + Date.now())
        if (!DataMgr.Bundle) {
            Initialize(LaunchPlatform)
            return
        }
        // DataMgr.Bundle.loadScene("iGaoShou", (err, scene) => {
        //     if (err) {
        //         cc.error("not found scene with name iGaoShou")
        //         Helper.reportEvent("平台初始化", "大厅launch", "not found scene with name iGaoShou")
        //         return
        //     }
        //     Helper.reportEvent("平台初始化", "大厅launch", "加载完成")
        UIMgr.clear()
        EventMgr.clearTargets()
        // cc.director.runScene(scene, null, () => {    
        //     Helper.reportEvent("平台初始化", "平台加载界面初始化", "加载完成")
        let round = DataMgr.getData<IMatchRound>(Constants.DATA_DEFINE.MATCH_RESULT)
        if (round && round.matchCid && round.matchId) {
            _matchRoundDetail()
        } else {
            _startLoading(progress)
        }
        // })
        Helper.reportEvent("平台初始化", "平台加载完成", "[LYM]")
        // })
    }

    export function SDKVersion(): string {
        return Constants.version
    }

    function _loadBaseConfig(callback?: Function) {
        console.log("loadBaseConfig = " + Date.now())
        let bundle = DataMgr.Bundle
        if (bundle) {
            bundle.load("igs", cc.JsonAsset, (err, data: cc.JsonAsset) => {
                console.log("igs finish = " + Date.now())
                if (err) {
                    cc.warn("please set game setting!")
                    return
                }
                if (data) {
                    let config = data.json as IGameConfig
                    console.log(config)
                    let env = Helper.GetURI("env")
                    if (cc.sys.isBrowser && undefined !== env && null !== env) {
                        config.env = Number(env)
                    }
                    // DataMgr.setData(Constants.DATA_DEFINE.IGS_CONFIG, config)
                    DataMgr.Config = config

                    _loadSetting(callback)
                }
            })
        }
    }

    function _loadSetting(callback?: Function) {
        console.log("loadSetting = " + Date.now())
        let bundle = DataMgr.Bundle
        bundle.load("setting", cc.JsonAsset, (err, data: cc.JsonAsset) => {
            console.log("setting finish = " + Date.now())
            if (err) {
                cc.warn("please set game setting!")
                return
            }
            if (data) {
                SettingMgr.init(data)
                callback && callback()
                _ready = true
            }
        })
    }

    function _startLoading(progress?: (val: number, tip: string) => void) { //newScene: boolean = true) {
        if (progress) {
            Helper.reportEvent("平台初始化", "加载回调", "加载")
            LoadMgr.startLoading((err, state: Constants.GAME_STATE, val) => {
                let str = ""
                if (state === Constants.GAME_STATE.LOAD_ONLINE_PARAM) {
                    str = Constants.STRING_LIST.LOAD_ONLINE_PARAM
                } else if (state === Constants.GAME_STATE.LOAD_HOT_UPDATE) {
                    str = Constants.STRING_LIST.LOAD_HOT_UPDATE
                } else if (state === Constants.GAME_STATE.LOAD_RESOURCE) {
                    str = Constants.STRING_LIST.LOAD_RESOURCE
                } else if (state === Constants.GAME_STATE.ACCOUNT_LOGIN) {
                    str = Constants.STRING_LIST.ACCOUNT_LOGIN
                } else if (state === Constants.GAME_STATE.GET_CONFIG) {
                    str = Constants.STRING_LIST.GET_CONFIG
                } else if (state === Constants.GAME_STATE.LOAD_FINISH) {
                    str = Constants.STRING_LIST.LOAD_FINISH
                }
                progress(val, str)
            })
        } else {
            DataMgr.Bundle.loadScene("iGaoShou", (err, scene) => {
                if (err) {
                    cc.error("not found scene with name iGaoShou")
                    Helper.reportEvent("平台加载", "大厅launch", "not found scene with name iGaoShou")
                    return
                }
                Helper.reportEvent("平台加载", "大厅launch", "大厅")
                cc.director.runScene(scene, null, () => {
                    Helper.reportEvent("平台初始化", "加载loadScene", "加载")
                    UIMgr.OpenUI(DataMgr.Bundle, "scene/LoadScene", {
                        enterAni: Constants.PAGE_ANI.FADE_IN, closeCb: () => {
                            console.log("loadScene Finish = " + Date.now())
                            let code = DataMgr.getData<number>(Constants.DATA_DEFINE.SUBMIT_ERR)
                            if (code === 4002) {
                                let pop = () => {
                                    let param = {
                                        buttons: 1,
                                        cancelName: "确定",
                                        param: { msg: "由于本次比赛已结束, 您本次\n的提交分数无效，您的入场费\n已经返还。" }
                                    }
                                    Helper.OpenPopUI("component/Base/MsgEntry", "提示", param)
                                }
                                Helper.DelayFun(pop, 2)
                            }
                            DataMgr.setData(Constants.DATA_DEFINE.SUBMIT_ERR, null)
                        }
                    })
                })
            })
        }
    }

    function _matchRoundDetail() {
        let round = DataMgr.getData<IMatchRound>(Constants.DATA_DEFINE.MATCH_RESULT)
        if (round) {
            DataMgr.Bundle.loadScene("iGaoShou", (err, scene) => {
                if (err) {
                    cc.error("not found scene with name iGaoShou")
                    Helper.reportEvent("平台加载", "大厅launch", "not found scene with name iGaoShou")
                    return
                }
                Helper.reportEvent("平台加载", "大厅launch", "结算界面")
                cc.director.runScene(scene, null, () => {
                    Helper.reportEvent("平台初始化", "加载matchDetail", "加载")
                    MatchSvr.OpenMatchDetail(round.matchCid, round.matchId, round.roundId, _startLoading)
                })
            })
            DataMgr.setData(Constants.DATA_DEFINE.MATCH_RESULT, null)
        }
    }
}

cc.game.on(cc.game.EVENT_SHOW, () => {
    console.log("==foreground==")
    PlatformApi.isForeground = true
    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.FOREGROUND)
    Account.Online()
});

cc.game.on(cc.game.EVENT_HIDE, () => {
    console.log("==background==")
    PlatformApi.isForeground = false
    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.BACKGROUND)
    // Account.Offline()
});
