import { Helper } from "./Helper"
import { Constants } from "../igsConstants"
import { DataMgr } from "../base/DataMgr"
import { UIMgr } from "../base/UIMgr";
import { AdSrv } from "./AdSrv";
import { EventMgr } from "../base/EventMgr";
import { UserSrv } from "./UserSrv";
import { ScribeSrv } from "./ScribeSrv";
import { ESocialResult } from "../pulgin/IPluginProxy";

let _activity = null
let _init: boolean = false

const ACTIVITY_CONFIG =
    [{ "activity_id": 6, "name": "免费金币", "desc": "最高10金币", "icon_type": 6, "interval_time": 3, "novice_days": 4, "day_times": 5, "ad_aid": 6, "weight": [{ "rewards": [{ "item_id": 2, "min_num": 4, "max_num": 7 }], "weight": 180 }, { "rewards": [{ "item_id": 2, "min_num": 7, "max_num": 12 }], "weight": 100 }, { "rewards": [{ "item_id": 2, "min_num": 12, "max_num": 15 }], "weight": 10 }], "novice_weight": [{ "rewards": [{ "item_id": 2, "min_num": 5, "max_num": 8 }], "weight": 100 }, { "rewards": [{ "item_id": 2, "min_num": 8, "max_num": 12 }], "weight": 180 }, { "rewards": [{ "item_id": 2, "min_num": 12, "max_num": 18 }], "weight": 25 }], "param": { "shop_place": 1, "sort_id": 6, "broke_place": 3 }, "shop_place": 1, "sort_id": 6, "broke_place": 3 },
    { "activity_id": 3, "name": "免费奖券", "desc": "最高1080奖券", "icon_type": 5, "interval_time": 3, "novice_days": 4, "day_times": 5, "ad_aid": 7, "weight": [{ "rewards": [{ "item_id": 1, "min_num": 240, "max_num": 400 }], "weight": 180 }, { "rewards": [{ "item_id": 1, "min_num": 400, "max_num": 700 }], "weight": 100 }, { "rewards": [{ "item_id": 1, "min_num": 700, "max_num": 900 }], "weight": 10 }], "novice_weight": [{ "rewards": [{ "item_id": 1, "min_num": 300, "max_num": 420 }], "weight": 100 }, { "rewards": [{ "item_id": 1, "min_num": 420, "max_num": 720 }], "weight": 180 }, { "rewards": [{ "item_id": 1, "min_num": 720, "max_num": 1080 }], "weight": 25 }], "param": { "shop_place": 1, "sort_id": 7, "broke_place": 2 }, "shop_place": 1, "sort_id": 7, "broke_place": 2 },
    { "activity_id": 1001, "name": "同步微信头像", "desc": "进行微信授权，立得大量银币", "weight": [{ "rewards": [{ "item_id": 1, "min_num": 100, "max_num": 100 }], "weight": 210 }], "param": { "sort_id": 100 }, "sort_id": 100, "broke_place": 0 },
    { "activity_id": 8, "name": "每日签到", "desc": "领取大量奖品", "icon_type": 7, "day_times": 1, "ad_aid": 8, "param": { "shop_place": 1, "sort_id": 101 }, "shop_place": 1, "sort_id": 101, "broke_place": 0 },
    { "activity_id": 4, "name": "免费抽奖", "desc": "最高10000奖券", "icon_type": 4, "interval_time": 3, "novice_days": 4, "day_times": 5, "ad_aid": 5, "weight": [{ "rewards": [{ "item_id": 1, "min_num": 10000, "max_num": 10000 }], "weight": 1 }, { "rewards": [{ "item_id": 1, "min_num": 1000, "max_num": 1000 }], "weight": 60 }, { "rewards": [{ "item_id": 1, "min_num": 2000, "max_num": 2000 }], "weight": 35 }, { "rewards": [{ "item_id": 1, "min_num": 500, "max_num": 500 }], "weight": 240 }, { "rewards": [{ "item_id": 1, "min_num": 8000, "max_num": 8000 }], "weight": 1 }, { "rewards": [{ "item_id": 1, "min_num": 800, "max_num": 800 }], "weight": 80 }, { "rewards": [{ "item_id": 1, "min_num": 5000, "max_num": 5000 }], "weight": 12 }, { "rewards": [{ "item_id": 1, "min_num": 200, "max_num": 200 }], "weight": 240 }], "novice_weight": [{ "rewards": [{ "item_id": 1, "min_num": 10000, "max_num": 10000 }], "weight": 4 }, { "rewards": [{ "item_id": 1, "min_num": 1000, "max_num": 1000 }], "weight": 100 }, { "rewards": [{ "item_id": 1, "min_num": 2000, "max_num": 2000 }], "weight": 40 }, { "rewards": [{ "item_id": 1, "min_num": 500, "max_num": 500 }], "weight": 230 }, { "rewards": [{ "item_id": 1, "min_num": 8000, "max_num": 8000 }], "weight": 4 }, { "rewards": [{ "item_id": 1, "min_num": 800, "max_num": 800 }], "weight": 100 }, { "rewards": [{ "item_id": 1, "min_num": 5000, "max_num": 5000 }], "weight": 18 }, { "rewards": [{ "item_id": 1, "min_num": 200, "max_num": 200 }], "weight": 230 }], "param": { "shop_place": 1, "sort_id": 102, "broke_place": 1 }, "shop_place": 1, "sort_id": 102, "broke_place": 1 },
    { "activity_id": 5, "name": "玩游戏领奖励", "desc": "完成任务，领取大量奖券", "icon_type": 9, "ad_aid": 4, "param": { "shop_place": 2, "sort_id": 103 }, "shop_place": 2, "sort_id": 103, "broke_place": 0 },
    { "activity_id": 1002, "name": "完成新手引导", "icon_type": 3, "ad_aid": 12, "weight": [{ "rewards": [{}, { "item_id": 1, "min_num": 6000, "max_num": 6000, "multiple_min_num": 30000, "multiple_max_num": 30000 }, { "item_id": 2, "min_num": 100, "max_num": 100, "multiple_min_num": 200, "multiple_max_num": 200 }], "weight": 1 }] },
    { "activity_id": 1003, "name": "结算广告点-获取更多奖券", "icon_type": 4, "day_times": 5, "ad_aid": 3, "weight": [{ "rewards": [{ "item_id": 1, "min_num": 240, "max_num": 420 }], "weight": 60 }, { "rewards": [{ "item_id": 1, "min_num": 420, "max_num": 700 }], "weight": 110 }, { "rewards": [{ "item_id": 1, "min_num": 700, "max_num": 900 }], "weight": 10 }, { "rewards": [{ "item_id": 1, "min_num": 600, "max_num": 1000 }], "weight": 110 }, { "rewards": [{ "item_id": 1, "min_num": 1000, "max_num": 1500 }], "weight": 15 }], "novice_weight": [{ "rewards": [{ "item_id": 1, "min_num": 300, "max_num": 500 }], "weight": 60 }, { "rewards": [{ "item_id": 1, "min_num": 600, "max_num": 800 }], "weight": 110 }, { "rewards": [{ "item_id": 1, "min_num": 800, "max_num": 1080 }], "weight": 10 }, { "rewards": [{ "item_id": 1, "min_num": 600, "max_num": 1200 }], "weight": 110 }, { "rewards": [{ "item_id": 1, "min_num": 1200, "max_num": 2000 }], "weight": 20 }] },
    { "activity_id": 1006, "name": "兑换金币", "desc": "使用奖券兑换金币", "icon_type": 6, "param": { "sort_id": 109, "broke_place": 3 }, "sort_id": 109, "broke_place": 3 },
    { "activity_id": 1007, "name": "对局免输", "icon_type": 3, "day_times": 3, "ad_aid": 9 },
    { "activity_id": 1008, "name": "赢分加倍", "icon_type": 3, "day_times": 3, "ad_aid": 10 },
    { "activity_id": 1009, "name": "打满5局奖励", "icon_type": 3, "novice_days": 4, "day_times": 5, "ad_aid": 11 },
    { "activity_id": 1009, "name": "打满5局奖励", "icon_type": 3, "novice_days": 4, "day_times": 5, "ad_aid": 11 },
    { "activity_id": 1010, "name": "免费对战赛", "desc": "看广告报名比赛，每天参与次数30次", "icon_type": 7, "day_times": 30, "ad_aid": 1 }
    ]

export namespace ActivitySrv {

    const GET_CONFIG_URI = "igaoshou-activity-srv/activity/GetActivityConfig"
    const GET_REWARD = "igaoshou-activity-srv/activity/GetReward"
    const GET_DELAY_REWARD = "igaoshou-activity-srv/activity/GetDelayReward"
    const COPY_ACTIVITY_CONFIG = "igaoshou-activity-srv/activity/CopyActivityConfig"

    export function init(callback?: Function) {
        if (!_init) {
            _activity = DataMgr.getData(Constants.DATA_DEFINE.ACTIVITY_DATA) || ACTIVITY_CONFIG
            GetActivityConfig(0, callback)
            _init = true
            return
        }

        callback?.()
    }

    export function CopyActivityConfig(plat_aid: number | string, to_plat_aid: number | string) {
        let param = {
            plat_aid: plat_aid,
            to_plat_aid: to_plat_aid
        }
        Helper.PostHttp(COPY_ACTIVITY_CONFIG, null, param, (res) => {
            cc.log("COPY_ACTIVITY_CONFIG", res)
        })
    }

    export function GetActivityConfig(activity_id: number, matchId?: string | Function, callback?: Function) {
        if (!callback && typeof matchId === "function") {
            callback = matchId
            matchId = null
        }

        // 在线参数
        if (activity_id) {
            if (activity_id === 1003 && DataMgr.data.OnlineParam.luck_award_dialog_box !== 1) { // 幸运奖励
                callback && callback(null)
                return
            } else if (activity_id === 1004 && DataMgr.data.OnlineParam.return_entry_fee_dialog_box !== 1) { // 更多报名费
                callback && callback(null)
                return
            } else if (activity_id === 1007 && DataMgr.data.OnlineParam.return_entry_fee_dialog_box !== 1) { // 返回报名费
                callback && callback(null)
                return
            } else if (activity_id === 1008 && DataMgr.data.OnlineParam.double_award_dialog_box !== 1) { // 赢分加倍
                callback && callback(null)
                return
            }

            // if (cc.sys.OPPO_GAME === cc.sys.platform || cc.sys.VIVO_GAME === cc.sys.platform || cc.sys.BYTEDANCE_GAME === cc.sys.platform) {
            //     if(activity_id === 1003 || activity_id === 1004 || activity_id === 1007 || activity_id === 1008){
            //         callback && callback(null)
            //         return
            //     }
            // }
        }

        let param = {
            activity_id: activity_id,
            match_id: matchId,
            version:1
        }
        Helper.PostHttp(GET_CONFIG_URI, null, param, (res) => {
            if (res && res.err_code == 1 && res.configs) {
                if (!_activity || !activity_id) {
                    _activity = res.configs
                } else if (!!activity_id) {
                    for (let i in _activity) {
                        if (_activity[i].activity_id === activity_id) {
                            _activity[i] = res.configs[0]
                            break
                        }
                    }
                }

                _activity.forEach(i => {
                    try {
                        if (typeof i.param === "string") {
                            i.param = Helper.ParseJson(i.param, "getActivityConfig");
                        }
                        i.shop_place = i.param.shop_place
                        i.sort_id = i.param.sort_id || 0
                        i.broke_place = i.param.broke_place || 0
                    } catch { }
                })
                _activity = _activity.sort((a, b) => {
                    return a.sort_id < b.sort_id ? -1 :
                        a.sort_id > b.sort_id ? 1 :
                            a.activity_id < b.activity_id ? -1 : 1
                })

                DataMgr.setData(Constants.DATA_DEFINE.ACTIVITY_DATA, _activity, true)

                if (!!activity_id) {
                    callback && callback(res.configs[0])
                } else {
                    callback && callback(_activity)
                }
            } else {
                callback && callback(null)
            }

            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REFRESH_ACTIVITY, { activityId: activity_id })
        })
    }

    export function GetReward(activity_id: number, stage?: number | Function, callback?: Function) {
        if (!callback && typeof stage === "function") {
            callback = stage
            stage = null
        }
        let param = {
            activity_id: activity_id,
            stage: stage
        }
        Helper.PostHttp(GET_REWARD, null, param, (res) => {
            cc.log("GET_REWARD", res)
            if (res) {
                if (callback) {
                    callback(res)
                } else if (activity_id === 1001) {
                } else if (res && res.err_code == 1 && res.award_item) {
                    UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: res.award_item } })
                }

                GetActivityConfig(activity_id)
                // if (res && res.err_code == 1) {
                // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REFRESH_ACTIVITY, { activityId: activity_id })
                // }
            }
        })
    }

    export function GetRewardParam(param: any, callback?: Function) {
        Helper.PostHttp(GET_REWARD, null, param, (res) => {
            cc.log("GET_REWARD", res)
            if (res) {
                if (callback) {
                    UserSrv.UpdateItem(() => callback(res))
                } else if (res && res.err_code == 1 && res.award_item) {
                    UserSrv.UpdateItem(() => UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: res.award_item } }))
                }
            }
        })
    }

    export function GetDelayReward(param: any, callback?: Function) {
        Helper.PostHttp(GET_DELAY_REWARD, null, param, (res) => {
            cc.log("GET_DELAY_REWARD", res)
            if (res) {
                if (callback) {
                    UserSrv.UpdateItem(() => callback(res))
                } else if (res && res.err_code == 1 && res.award_item) {
                    UserSrv.UpdateItem(() => UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: res.award_item } }))
                }
            }
        })
    }

    export function OnClickActivity(activityInfo: any, callback?: Function) {
        console.log("OnClickActivity", activityInfo)
        let info = activityInfo
        if (info.activity_id == 1005 || info.activity_id == 1006) {//兑换G币或钻石
            // Helper.OpenPageUI("component/Exchange/ExchangeTokenEntry", "兑换游戏币", null, {})
        } else if (info.activity_id == 8) {//每日签到
            ScribeSrv.checkShowScribeWeChatMsg()
            SignSrv.GetConfig((config) => {
                UIMgr.OpenUI("lobby", "component/activity/sign/Sign", { param: { signConfig: config, activityConfig: info }, index: 20 })
            })
        } else if (info.day_times && info.receive_num && info.receive_num >= info.day_times) {
            Helper.OpenTip("今日领取已达上限！")
        } else if (info.activity_id == 4) {//转盘抽奖
            UIMgr.OpenUI("lobby", "component/activity/turntable/MainTurntable", { single: true, param: { dataInfo: info } })
        } else if (info.activity_id == 5) {//玩比赛得奖品
            // Helper.OpenPageUI("component/Activity/Task", "玩比赛得奖品", null, { activityConfig: info })
            Helper.OpenPageUI("component/task/TaskScene", "玩比赛得奖品", null, { single: true })
        } else if (info.activity_id == 7) {//玩游戏得钻石

        } else if (info.activity_id == 6 && DataMgr.data.OnlineParam.free_gold === 1) {//免费金币
            UIMgr.OpenUI("lobby", "component/activity/free/FreeGoldCoins", { param: { dataInfo: info } })
        } else if (info.activity_id == 3 && DataMgr.data.OnlineParam.free_ticket === 1) {//免费奖券
            UIMgr.OpenUI("lobby", "component/activity/free/FreeLotteryticket", { param: { dataInfo: info } })
        } else if (info.ad_aid && info.ad_aid > 0) {
            let method = AdSrv.getMethod(info.ad_aid)
            info.receive_num = info.receive_num || 0
            if (method[info.receive_num] === 0) {  //0免费 1分享 2广告 默认2看广告
                ActivitySrv.GetReward(Number(info.activity_id))
            } else if (method[info.receive_num] === 1) {
                Helper.shareInfo({ sharePosition: info.ad_aid }, (res) => {
                    if (res.ShareResultCode == ESocialResult.SHARERESULT_SUCCESS) {
                        ActivitySrv.GetReward(Number(info.activity_id))
                    }
                })
            } else {
                AdSrv.createAdOrder(info.ad_aid, JSON.stringify(info), (res: IPlayAdCallBack) => {
                    if (res && res.order_no && res.order_no.length > 0) {
                        AdSrv.completeAdOrder((res) => {
                            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REFRESH_ACTIVITY, { activityId: info.activity_id })
                            if (res && res.code == "00000") {
                                if (res.award_list) {
                                    let res1 = Helper.ParseJson(res.award_list, "clickActivity")
                                    if (res1 && res1.err_code == 1) {
                                        UserSrv.UpdateItem(() => UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: res1.award_item } }))
                                    }
                                }
                                GetActivityConfig(info.activity_id)
                            }
                        })
                    }
                })
            }
        } else {
            ActivitySrv.GetReward(Number(info.activity_id), (res) => {
                if (res && res.err_code == 1) {
                    // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REFRESH_ACTIVITY, { activityId: info.activity_id })
                    if (info.activity_id == 2) {
                        callback && callback(res)
                    } else if (info.activity_id == 1002) {//新手引导
                        // UIMgr.OpenUI("lobby", "component/Activity/Guide", { param: { awards: res.award_item } })
                    } else if (res.award_item) {
                        UserSrv.UpdateItem(() => UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: res.award_item } }))
                    }
                }
            })
        }
    }

    export function GetActivityById(activity_id: number | string) {
        // 在线参数
        if (activity_id) {
            if (activity_id === 1003 && DataMgr.data.OnlineParam.luck_award_dialog_box !== 1) { // 幸运奖励
                // callback && callback(null)
                return null
            } else if (activity_id === 1004 && DataMgr.data.OnlineParam.return_entry_fee_dialog_box !== 1) { // 更多报名费
                // callback && callback(null)
                return null
            } else if (activity_id === 1007 && DataMgr.data.OnlineParam.return_entry_fee_dialog_box !== 1) { // 返回报名费
                // callback && callback(null)
                return null
            } else if (activity_id === 1008 && DataMgr.data.OnlineParam.double_award_dialog_box !== 1) { // 赢分加倍
                // callback && callback(null)
                return null
            }

            // if (cc.sys.BYTEDANCE_GAME === cc.sys.platform) {
            //     if(activity_id === 1003 || activity_id === 1004 || activity_id === 1007 || activity_id === 1008){
            //         // callback && callback(null)
            //         return null
            //     }
            // }
        }


        for (let i in _activity) {
            if (_activity[i].activity_id === activity_id) {
                return _activity[i]
            }
        }

        return null
    }

    export function CleanActivityDataById(activity_id: number | string) {
        for (let i = 0; i < _activity.length; i++) {
            if (_activity[i].activity_id === activity_id) {
                _activity.splice(i, 1)
                break
            }
        }
        DataMgr.setData(Constants.DATA_DEFINE.ACTIVITY_DATA, _activity, true)
    }

    export function GetActivityConfigPromise(activity_id: number) {
        return new Promise((rlv, rjt) => {
            GetActivityConfig(activity_id, (res) => {
                if (res) {
                    rlv(res)
                } else {
                    rjt()
                }
            })
        })
    }
}

let _signConfig = null
export namespace SignSrv {

    const GET_CONFIG_URI = "igaoshou-activity-srv/sign/GetSignConfig"
    const GET_REWARD = "igaoshou-activity-srv/sign/GetSignReward"

    export function GetConfig(reLoad: boolean | Function, callback?: Function) {
        if (!callback && typeof reLoad === "function") {
            callback = reLoad
            reLoad = false
        }

        if (_signConfig && !reLoad) {
            callback(_signConfig)
            return
        }
        Helper.PostHttp(GET_CONFIG_URI, null, null, (res) => {
            cc.log("SignSrv GetConfig", res)
            if (res && res.err_code == 1 && res.config) {
                _signConfig = res.config
                callback && callback(res.config)
            }
        })
    }

    export function GetReward(day_index: string, double_reward: boolean, callback?: Function) {
        let param = {
            day_index: day_index,
            double_reward: double_reward ? 1 : 0,
        }
        Helper.PostHttp(GET_REWARD, null, param, (res) => {
            cc.log("GET_REWARD", res)
            if (res) {
                if (callback) {
                    callback(res)
                } else if (res && res.err_code == 1) {
                    UserSrv.UpdateItem(() => UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: res.award_item } }))
                }

                GetConfig(true)
            }
        })
    }
}

EventMgr.once(Constants.EVENT_DEFINE.LOGIN_SUCCESS, ActivitySrv.init)