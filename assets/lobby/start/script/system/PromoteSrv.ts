import { Constants } from "../igsConstants"
import { DataMgr } from "../base/DataMgr"
import { Helper } from "./Helper"
import { User } from "../data/User"
import { EventMgr } from "../base/EventMgr"
import { WxProxyWrapper } from "../pulgin/WxProxyWrapper"

// 获取个人信息
const GET_PROMOTE_INFO = "promote-system-srv/promote/GetPromoteInfo"
// 绑定推广
const BIND_PROMOTE = "promote-system-srv/promote/BindPromote"
// 获取奖励
const GET_REWARD = "promote-system-srv/promote/GetReward"
// 获取成员列表
const GET_MEMBER_LIST = "promote-system-srv/promote/GetMemberList"
// 贡献记录
const GET_BILL_LIST = "promote-system-srv/promote/GetBillList"
// 招募徒弟任务
const GET_TASK = "promote-system-srv/promote/GetTask"
// 招募徒弟奖励
const GET_TASK_REWARD = "promote-system-srv/promote/GetTaskReward"


export namespace PromoteSrv {
    export function init() {
    }

    export function GetPromoteInfo(callback?: Function) {
        let param = { need_promote_code: 0 }
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
        } else {
            param.need_promote_code = 1
        }
        Helper.PostHttp(GET_PROMOTE_INFO, null, param, (res) => {
            console.log("GET_PROMOTE_INFO", res)
            if (res) {
                if (res.err && res.err.code == 200) {
                    if (!res.total_award) {
                        res.total_award = { item_id: Constants.ITEM_INDEX.PROM_REDPACKET, item_num: 0 }
                    } else {
                        res.total_award.item_num = res.total_award.item_num || 0
                    }
                    if (!res.today_award) {
                        res.today_award = { item_id: Constants.ITEM_INDEX.PROM_REDPACKET, item_num: 0 }
                    } else {
                        res.today_award.item_num = res.today_award.item_num || 0
                    }
                    callback && callback(res)
                } else if (res.err && res.err.msg) {
                    Helper.OpenTip(res.err_msg)
                }
            }
        })
    }


    export function BindPromote(param, callback?: Function) {
        if (!param) {
            if (cc.sys.WECHAT_GAME === cc.sys.platform) {
                let option = WxProxyWrapper.getWxLaunchOptionsSync()
                let query = option && (typeof option == "object") ? option : {}
                console.log("BindPromote query = ", query)
                if (query.shareOpenId) {
                    param = { promote_openid: query.shareOpenId, promote_code: "" }
                } else {
                    return
                }
            } else {
                return
            }
        }
        Helper.PostHttp(BIND_PROMOTE, null, param, (res) => {
            console.log("BIND_PROMOTE", res)
            if (res) {
                callback && callback(res)
            }
        })
    }

    export function GetReward(param, callback?: Function) {
        Helper.PostHttp(GET_REWARD, null, param, (res) => {
            console.log("GET_REWARD", res)
            if (res) {
                if (res.err && res.err.code == 200) {
                    if (!res.award_item) {
                        res.award_item = { item_id: Constants.ITEM_INDEX.PROM_REDPACKET, item_num: 0 }
                    } else {
                        res.award_item.item_num = res.award_item.item_num || 0
                    }
                    callback && callback(res)
                } else if (res.err && res.err.msg) {
                    Helper.OpenTip(res.err_msg)
                }
            }
        })
    }

    export function GetMemberList(param, callback?: Function) {
        Helper.PostHttp(GET_MEMBER_LIST, null, param, (res) => {
            console.log("GET_MEMBER_LIST", res)
            if (res) {
                if (res.err && res.err.code == 200) {
                    if (res.member_list) {
                        res.member_list.forEach((v) => {
                            if (!v.member_num) {
                                v.member_num = 0
                            } else {
                                v.member_num = v.member_num || 0
                            }

                            if (!v.promote_uuid) {
                                v.promote_uuid = ""
                            } else {
                                v.promote_uuid = v.promote_uuid || ""
                            }

                            if (!v.pool_award) {
                                v.pool_award = { item_id: Constants.ITEM_INDEX.PROM_REDPACKET, item_num: 0 }
                            } else {
                                v.pool_award.item_num = v.pool_award.item_num || 0
                            }

                            if (!v.yesterday_award) {
                                v.yesterday_award = { item_id: Constants.ITEM_INDEX.PROM_REDPACKET, item_num: 0 }
                            } else {
                                v.yesterday_award.item_num = v.yesterday_award.item_num || 0
                            }

                            if (!v.today_award) {
                                v.today_award = { item_id: Constants.ITEM_INDEX.PROM_REDPACKET, item_num: 0 }
                            } else {
                                v.today_award.item_num = v.today_award.item_num || 0
                            }

                            if (!v.total_award) {
                                v.total_award = { item_id: Constants.ITEM_INDEX.PROM_REDPACKET, item_num: 0 }
                            } else {
                                v.total_award.item_num = v.total_award.item_num || 0
                            }
                        })
                    }
                    callback && callback(res)
                } else if (res.err && res.err.msg) {
                    Helper.OpenTip(res.err_msg)
                }
            }
        })
    }

    export function GetBillList(param, callback?: Function) {
        Helper.PostHttp(GET_BILL_LIST, null, param, (res) => {
            console.log("GET_BILL_LIST", res)
            if (res) {
                if (res.err && res.err.code == 200) {
                    if (res.list) {
                        res.list.forEach((v) => {
                            if (!v.award_item) {
                                v.award_item = { item_id: Constants.ITEM_INDEX.PROM_REDPACKET, item_num: 0 }
                            } else {
                                v.award_item.item_num = v.award_item.item_num || 0
                            }

                            if (!v.second_award) {
                                v.second_award = { item_id: Constants.ITEM_INDEX.PROM_REDPACKET, item_num: 0 }
                            } else {
                                v.second_award.item_num = v.second_award.item_num || 0
                            }
                        })
                    }
                    callback && callback(res)
                } else if (res.err && res.err.msg) {
                    Helper.OpenTip(res.err_msg)
                }
            }
        })
    }

    export function GetTask(param, callback?: Function) {
        Helper.PostHttp(GET_TASK, null, param, (res) => {
            console.log("GET_TASK", res)
            if (res) {
                if (res.err && res.err.code == 200) {
                    if (res.list) {
                        res.list.forEach((v) => {
                            if (!v.award_item) {
                                v.award_item = { item_id: Constants.ITEM_INDEX.PROM_REDPACKET, item_num: 0 }
                            } else {
                                v.award_item.item_num = v.award_item.item_num || 0
                            }
                        })
                    }
                    callback && callback(res)
                } else if (res.err && res.err.msg) {
                    Helper.OpenTip(res.err_msg)
                }
            }
        })
    }

    export function GetTaskReward(param, callback?: Function) {
        Helper.PostHttp(GET_TASK_REWARD, null, param, (res) => {
            console.log("GET_TASK_REWARD", res)
            if (res) {
                if (res.err && res.err.code == 200) {
                    if (!res.award_item) {
                        res.award_item = { item_id: Constants.ITEM_INDEX.PROM_REDPACKET, item_num: 0 }
                    } else {
                        res.award_item.item_num = res.award_item.item_num || 0
                    }
                    callback && callback(res)
                } else if (res.err && res.err.msg) {
                    Helper.OpenTip(res.err_msg)
                }
            }
        })
    }
}

PromoteSrv.init()
// console.log("PromoteSrv init", DataMgr.data.OnlineParam.promote_system)
// if (DataMgr.data.OnlineParam.promote_system === 1) {
//     console.log("PromoteSrv once")
EventMgr.once(Constants.EVENT_DEFINE.BIND_PROMOTE, PromoteSrv.BindPromote)
// }