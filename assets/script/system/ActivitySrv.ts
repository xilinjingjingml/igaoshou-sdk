import { Helper } from "./Helper"
import { Constants } from "../constants"
import { DataMgr } from "../base/DataMgr"
import { UIMgr } from "../base/UIMgr";
import { AdSrv } from "./AdSrv";
import { EventMgr } from "../base/EventMgr";
import { User } from "./User";

let _activity = null

export namespace ActivitySrv {

    const GET_CONFIG_URI = "igaoshou-activity-srv/activity/GetActivityConfig"
    const GET_REWARD = "igaoshou-activity-srv/activity/GetReward"
    const GET_DELAY_REWARD = "igaoshou-activity-srv/activity/GetDelayReward"
    const COPY_ACTIVITY_CONFIG = "igaoshou-activity-srv/activity/CopyActivityConfig"

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

        // if (!activity_id && _activity) {
        //     callback && callback(_activity)
        //     return
        // }

        // 在线参数
        if (activity_id) {
            if (activity_id === 1003 && DataMgr.OnlineParam.luck_award_dialog_box !== 1) { // 幸运奖励
                callback && callback(null)
                return
            } else if (activity_id === 1004 && DataMgr.OnlineParam.return_entry_fee_dialog_box !== 1) { // 更多报名费
                callback && callback(null)
                return
            } else if (activity_id === 1007 && DataMgr.OnlineParam.return_entry_fee_dialog_box !== 1) { // 返回报名费
                callback && callback(null)
                return
            } else if (activity_id === 1008 && DataMgr.OnlineParam.double_award_dialog_box !== 1) { // 赢分加倍
                callback && callback(null)
                return
            }
        }

        let param = {
            activity_id: activity_id,
            match_id: matchId
        }
        Helper.PostHttp(GET_CONFIG_URI, null, param, (res) => {
            console.log("GetActivityConfig", res)
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

                console.log(_activity)

                _activity.forEach(i => {
                    try {
                        i.param = JSON.parse(i.param);
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
                    UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res.award_item } })
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
                    callback(res)
                } else if (res && res.err_code == 1 && res.award_item) {
                    UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res.award_item } })
                }
            }
        })
    }

    export function GetDelayReward(param: any, callback?: Function) {
        Helper.PostHttp(GET_DELAY_REWARD, null, param, (res) => {
            cc.log("GET_DELAY_REWARD", res)
            if (res) {
                if (callback) {
                    User.UpdateItem(() => callback(res))
                } else if (res && res.err_code == 1 && res.award_item) {
                    User.UpdateItem(() => UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res.award_item } }))
                }
            }
        })
    }

    export function OnClickActivity(activityInfo: any, callback?: Function) {
        console.log("OnClickActivity", activityInfo)
        let info = activityInfo
        if (info.activity_id == 1005 || info.activity_id == 1006) {//兑换G币或钻石
            Helper.OpenPageUI("component/Exchange/ExchangeTokenEntry", "兑换游戏币", null, {})
        } else if (info.activity_id == 8) {//每日签到
            SignSrv.GetConfig((config) => {
                UIMgr.OpenUI("component/Activity/Sign", { param: { signConfig: config, activityConfig: info }, index: 20 })
            })
        } else if (info.day_times && info.receive_num && info.receive_num >= info.day_times) {
            Helper.OpenTip("今日领取已达上限！")
        } else if (info.activity_id == 4) {//转盘抽奖
            // Helper.OpenPageUI("component/Activity/SlyderAdventures", "免费抽奖", null, { dataInfo: info })
            UIMgr.OpenUI("component/Activity/SlyderAdventures", { param: { dataInfo: info } })
        } else if (info.activity_id == 5) {//玩比赛得奖品
            Helper.OpenPageUI("component/Activity/Task", "玩比赛得奖品", null, { activityConfig: info })
        } else if (info.activity_id == 7) {//玩游戏得钻石

        }else if (info.activity_id == 6 && DataMgr.OnlineParam.free_gold === 1){//免费金币
            UIMgr.OpenUI("component/Activity/FreeGoldCoins", { param: { dataInfo: info } })
        }else if (info.activity_id == 3 && DataMgr.OnlineParam.free_ticket === 1){//免费奖券
            UIMgr.OpenUI("component/Activity/FreeLotteryticket", { param: { dataInfo: info } })
        } else if (info.ad_aid && info.ad_aid > 0) {
            AdSrv.createAdOrder(info.ad_aid, JSON.stringify(info), (order_no: string) => {
                if (order_no && order_no.length > 0) {
                    AdSrv.completeAdOrder((res) => {
                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REFRESH_ACTIVITY, { activityId: info.activity_id })
                        if (res && res.code == "00000") {
                            if (res.award_list) {
                                let res1 = JSON.parse(res.award_list)
                                if (res1 && res1.err_code == 1) {
                                    User.UpdateItem(() => UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res1.award_item } }))
                                }
                            }

                            GetActivityConfig(info.activity_id)
                        }
                    })
                }
            })
        } else {
            ActivitySrv.GetReward(Number(info.activity_id), (res) => {
                if (res && res.err_code == 1) {
                    // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.REFRESH_ACTIVITY, { activityId: info.activity_id })
                    if (info.activity_id == 2) {
                        callback && callback(res)
                    } else if (info.activity_id == 1002) {//新手引导
                        UIMgr.OpenUI("component/Activity/Guide", { param: { awards: res.award_item } })
                    } else if (res.award_item) {
                        User.UpdateItem(() => UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res.award_item } }))
                    }
                }
            })
        }
    }

    export function GetActivityById(activityId: number | string) {
        for (let i in _activity) {
            if (_activity[i].activity_id === activityId) {
                return _activity[i]
            }
        }

        return null
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
                    User.UpdateItem(() => UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: res.award_item } }))
                }

                GetConfig(true)
            }
        })
    }
}