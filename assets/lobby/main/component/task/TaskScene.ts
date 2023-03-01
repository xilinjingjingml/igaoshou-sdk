import BaseUI from "../../../start/script/base/BaseUI";
import { TaskSrv } from "../../../start/script/system/TaskSrv";
import { ActivitySrv, SignSrv } from "../../../start/script/system/ActivitySrv";
import { Constants } from "../../../start/script/igsConstants";
import { Helper } from "../../../start/script/system/Helper";
import { AdSrv } from "../../../start/script/system/AdSrv";
import { UserSrv } from "../../../start/script/system/UserSrv";
import { UIMgr } from "../../../start/script/base/UIMgr";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { ScribeSrv } from "../../../start/script/system/ScribeSrv";
import { User } from "../../../start/script/data/User";
import { PluginMgr } from "../../../start/script/base/PluginMgr";
import { EventMgr } from "../../../start/script/base/EventMgr";

const { ccclass, property } = cc._decorator;

const TaskType_Daily = 0 // 日常任务
const TaskType_Achievement = 1 // 成就任务
const TaskType_BoxTask = 2 // 宝箱任务

@ccclass
export default class TaskScene extends BaseUI {

    _dailyTaskMode: cc.Node = null

    _activityConfig: any = null

    _hotList: string[] = []

    onLoad() {
        this.initNode()
        this.initEvent()
        this.initData()
    }

    // onOpen() {
    //     this.initData()
    // }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.TURNTABLE_GET_AWARD, () => this.refreshAllTask(), this)
        EventMgr.on(Constants.EVENT_DEFINE.PHONE_BIND_SUCCESS, () => this.refreshAllTask(), this)
    }

    initNode() {
        let mode = this.getNode("task/view/content/hotTask/list/view/item")
        mode.active = false
        this.getNode("task/view/content/hotTask/list/view/content").children.forEach(i => i.active = false)
        this._dailyTaskMode = this.getNode("task/view/content/dailyTask/item")
        this._dailyTaskMode.active = false
        this.setActive("task/view/content/loopTask", false)

        this.setActive("task/view/content/hotTask", false)
        this.setActive("task/view/content/dailyTask", false)
    }

    initData() {
        this._activityConfig = ActivitySrv.GetActivityById(5) || {}
        this._activityConfig.ad_aid = this._activityConfig.ad_aid || 0
        if (cc.sys.BYTEDANCE_GAME === cc.sys.platform) {
            this._activityConfig.ad_aid = 0
        }

        this.refreshTaskData()
        this.refreshBoxTaskData()
    }

    refreshTaskData() {
        TaskSrv.GetTaskList((res) => {
            if (res.list) {
                this.updateHotTask(res.list)
                this.updateDailyTask(res.list)
            }
        })
    }

    updateHotTask(data) {
        let mode = this.getNode("task/view/content/hotTask/list/view/item")
        this.setActive("task/view/content/hotTask", true)
        data.sort((a, b) => {
            return a.status === 2 ? 1 :
                b.status === 2 ? -1 :
                    (a.order || 0) < (b.order || 0) ? -1 : 1
        })

        let idx = 0
        this._hotList = []
        this.getNode("task/view/content/hotTask/list/view/content").children.forEach(i => i.active = false)
        for (let i in data) {
            let task = data[i]
            if (task.type !== TaskType_Achievement && !!data.type) {
                continue
            }

            // task.client_param = Helper.ParseJson(task?.client_param) || {}
            if (task.client_param.show_round_num && task.client_param.show_round_num >= User.PlayGame) {
                continue
            }

            if (task.client_param?.hot !== true) {
                continue
            }

            if (task.client_param?.hide) {
                continue
            }

            if (task.client_param?.version < Constants.versionCode) {
                continue
            }

            if (task.cond_type === 11 || task.cond_type === 12) {
                if (Helper.checkRegionLimit()) {
                    continue
                }
            }

            task.cond_type = task.cond_type || 0
            task.status = task.status || 0

            let name = "item" + task.task_tid
            let item = this.getNode("task/view/content/hotTask/list/view/content/" + name)
            this._hotList.push(task.task_tid)
            if (!item.parent) {
                item = cc.instantiate(mode)
                item.name = name
                item.parent = this.getNode("task/view/content/hotTask/list/view/content")

                let img = ""
                if (task.cond_type === 0) {  // 比赛
                    if (Number(task.cond_param["match_type"]) === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                        img = "component/task/image/huodongsaitiaozhan-icon"
                    } else if (Number(task.cond_param["match_type"]) === Constants.MATCH_TYPE.BATTLE_MATCH) {
                        img = "component/task/image/gaojilianxisai-icon"
                    } else if (Number(task.cond_param["match_type"]) === Constants.MATCH_TYPE.MULTIPLAYER_MATCH) {
                        img = "component/task/image/canyduorenlianxisai-icon"
                    } else if (Number(task.cond_param["match_type"]) === Constants.MATCH_TYPE.PRACTICE_MATCH) {
                        img = "component/task/image/lianxisaiguanjuntiaozhan-icon"
                    } else if (Number(task.cond_param["match_type"]) === Constants.MATCH_TYPE.REALTIME_MATCH) {
                        img = "component/task/image/lianxisaiguanjuntiaozhan-icon"
                    } else if (Number(task.cond_param["match_type"]) === Constants.MATCH_TYPE.TOURNEY_MATCH) {
                        img = "component/task/image/lianxisaiguanjuntiaozhan-icon"
                    }
                    // } else if (task.cond_type === 1) {   
                } else if (task.cond_type === 2) {   // 观看广告
                    img = "component/task/image/guankanshiping-icon"
                    // } else if (task.cond_type === 3) {   
                } else if (task.cond_type === 4) {   // 局数奖励
                    if (Number(task.cond_param["match_type"]) === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                        img = "component/task/image/huodongsaitiaozhan-icon"
                    } else if (Number(task.cond_param["match_type"]) === Constants.MATCH_TYPE.BATTLE_MATCH) {
                        img = "component/task/image/gaojilianxisai-icon"
                    } else if (Number(task.cond_param["match_type"]) === Constants.MATCH_TYPE.MULTIPLAYER_MATCH) {
                        img = "component/task/image/canyduorenlianxisai-icon"
                    } else if (Number(task.cond_param["match_type"]) === Constants.MATCH_TYPE.PRACTICE_MATCH) {
                        img = "component/task/image/lianxisaiguanjuntiaozhan-icon"
                    } else if (Number(task.cond_param["match_type"]) === Constants.MATCH_TYPE.REALTIME_MATCH) {
                        img = "component/task/image/lianxisaiguanjuntiaozhan-icon"
                    } else if (Number(task.cond_param["match_type"]) === Constants.MATCH_TYPE.TOURNEY_MATCH) {
                        img = "component/task/image/lianxisaiguanjuntiaozhan-icon"
                    }
                    // } else if (task.cond_type === 5) {
                } else if (task.cond_type === 6) {   // 签到
                    img = "component/task/image/meiriqiandao-icon"
                } else if (task.cond_type === 7) {   // 抽奖
                    img = "component/task/image/kaiqibaoxiangjiangli-tubiao"
                } else if (task.cond_type === 8) {   // 绑定手机
                    img = "component/task/image/wanshangerenxinxi-icon"
                } else if (task.cond_type === 9) {   // 关注公众号
                    img = "component/task/image/guanzhukefu-icon"
                } else if (task.cond_type === 10) {  // 体验游戏
                    img = "component/task/image/tiyanbutongyouxi-icon"
                } else if (task.cond_type === 11) {  // 下载APP
                    img = "component/task/image/xiazaiapp-icon"
                } else if (task.cond_type === 12) {  // 邀请好友
                    img = "component/task/image/canyduorenlianxisai-icon"
                }

                this.setSpriteFrame("exhibit/icon", item, img)

                this.setLabelValue("name", item, task.name + "\n" +
                    ((task?.max_progress > 1) ? "(" + (task.progress || 0) + "/" + task.max_progress + ")" : ""))

                let bAward = false
                for (let v of task?.award_list || []) {
                    v.id = Number(v.id)
                    v.num = Number(v.num)
                    if (v.id === Constants.ITEM_INDEX.GOLD) {
                    } else if (v.id === Constants.ITEM_INDEX.LOTTERY) {
                        this.setLabelValue("exhibit/award/num", item, v.num >= 10000 ? Helper.FormatNumWY(v.num) : v.num)
                        bAward = true
                    } else if (v.id === Constants.ITEM_INDEX.CREDITS) {
                    }
                }
                this.setActive("exhibit/award", item, bAward)
                if (!bAward) {
                    this.setNodePositionY("exhibit/icon", item, 0)
                }


                if (task.status === 2) {
                    this.setButtonInfo("btnAward", item, { interactable: false })
                    this.setActive("exhibit/tag", item, true)
                } else if (task.status === 1) {
                    this.setButtonInfo("btnAward", item, { interactable: true })
                    this.setActive("exhibit/tag1", item, true)
                }

                this.setButtonClick("btnAward", item, () => {
                    if (task.status === 2) {
                    } else if (task.status === 1) {
                        this.getAward(task)
                    } else {
                        this.doTask(task)
                    }
                })
            }

            item.active = true
            idx++
            if (idx === 4) {
                break
            }
        }
    }

    updateDailyTask(data: any[]) {
        data.sort((a, b) => {
            return a.status === 1 ? -1 :
                a.status === 2 ? 1 :
                    b.status === 1 ? 1 :
                        b.status === 2 ? -1 :
                            (a.order || 0) < (b.order || 0) ? -1 : 1
        })

        this.setActive("task/view/content/dailyTask", true)
        let content = this.getNode("task/view/content/dailyTask/list")
        content.removeAllChildren(true)
        for (let i in data) {
            let task = data[i]
            // task.type = task.type || TaskType_Daily
            // if (task.type !== TaskType_Daily) {
            //     continue
            // }

            // task.client_param = Helper.ParseJson(task?.client_param) || {}
            if (task.client_param.show_round_num && task.client_param.show_round_num >= User.PlayGame) {
                continue
            }

            // if (task.client_param?.hot === true) {
            //     continue
            // }

            if (task.client_param?.hide) {
                continue
            }

            if (task.client_param?.version < Constants.versionCode) {
                continue
            }

            if (this._hotList.filter(i => i === task.task_tid).length > 0) {
                continue
            }

            if (task.cond_type === 11 || task.cond_type === 12) {
                if (Helper.checkRegionLimit()) {
                    continue
                }
            }

            task.cond_type = task.cond_type || 0
            task.cond_param = Helper.ParseJson(task.cond_param) || 0

            let item = cc.instantiate(this._dailyTaskMode)
            item.parent = content
            item.name = task.task_tid
            item.active = true

            this.setLabelValue("name", item, task.name || task.desc)
            this.setLabelValue("desc", item, task.desc +
                (task?.max_progress <= 1 ? "" : "(" + (task.progress || 0) + "/" + task.max_progress + ")"))

            for (let v of task?.award_list || []) {
                this.setActive("awards/gold", item, false)
                this.setActive("awards/lottery", item, false)
                this.setActive("awards/credits", item, false)
                if (v.id === Constants.ITEM_INDEX.GOLD) {
                    this.setActive("awards/gold", item, true)
                    this.setLabelValue("awards/gold/num", item, v.num >= 10000 ? Helper.FormatNumWY(v.num) : v.num)
                } else if (v.id === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("awards/lottery", item, true)
                    this.setLabelValue("awards/lottery/num", item, v.num >= 10000 ? Helper.FormatNumWY(v.num) : v.num)
                } else if (v.id === Constants.ITEM_INDEX.CREDITS) {
                    this.setActive("awards/credits", item, true)
                    this.setLabelValue("awards/credits/num", item, v.num >= 10000 ? Helper.FormatNumWY(v.num) : v.num)
                }
            }

            this.setActive("btnAward/goto", item, true)
            this.setActive("btnAward/finish", item, true)

            if (task.status === 2) {
                this.setActive("btnAward/goto", item, false)
                this.setActive("btnAward/finish/tubiao-bofang", item, false)
                this.setNodePositionX("btnAward/finish/Label", item, 0)
                this.setLabelValue("btnAward/finish/Label", item, "已完成")
                this.setButtonInfo("btnAward", item, { interactable: false })
            } else if (task.status === 1) {
                this.setActive("btnAward/goto", item, false)
                this.setLabelValue("btnAward/finish/Label", item, "领取")
                if (this._activityConfig.ad_aid === 0) {
                    this.setActive("btnAward/finish/tubiao-bofang", item, false)
                    this.setNodePositionX("btnAward/finish/Label", item, 0)
                }
            } else {
                // if (task.cond_type === 0 || task.cond_type === 6 || task.cond_type === 7) {
                this.setLabelValue("btnAward/goto/Label", item, "前往")
                // } else {
                //     this.setActive("btnAward", item, false)
                // }
                this.setActive("btnAward/finish", item, false)
            }

            this.setButtonClick("btnAward", item, () => {
                if (task.status === 2) {
                } else if (task.status === 1) {
                    if (this._activityConfig.ad_aid > 0) {
                        AdSrv.PlayAD(this._activityConfig.ad_aid, JSON.stringify(this._activityConfig))
                            .then(() => { this.getAward(task) })
                    } else {
                        this.getAward(task)
                    }
                } else {
                    this.doTask(task)
                }
            })
        }
    }

    getAward(info: any) {
        TaskSrv.GetAward(info.task_id, (res) => {
            this.refreshTaskData()
            for (let v of res.award_list) {
                v.item_id = v.id
                v.item_num = v.num
            }
            let self = this
            UserSrv.UpdateItem(() => {
                UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: res.award_list, autoOpenBox: true } })
                self.refreshTaskData()
            })
        })
    }

    refreshBoxTaskData() {
        TaskSrv.GetBoxTastList((res) => {
            this.updateLoopTask(res.list)
        })
    }

    updateLoopTask(data: any[]) {
        if (data.length <= 0) {
            return
        }

        data.sort((a, b) => {
            return a.status === 1 ? -1 :
                a.status === 2 ? 1 :
                    b.status === 1 ? 1 :
                        b.status === 2 ? -1 :
                            (a.order || 0) < (b.order || 0) ? -1 : 1
        })

        this.setActive("task/view/content/loopTask", true)

        data.filter(i => i.ext_param = Helper.ParseJson(i.ext_param) || {})

        let tasks = data.filter(i => i.ext_param.belong_to)
        for (let i in tasks) {
            let task = tasks[i]
            if (task.type !== TaskType_BoxTask) {
                continue
            }

            if (task.client_param?.hide) {
                continue
            }

            if (task.client_param?.version < Constants.versionCode) {
                continue
            }

            if (task.cond_type === 11 || task.cond_type === 12) {
                if (Helper.checkRegionLimit()) {
                    continue
                }
            }

            task.cond_type = task.cond_type || 0
            // task.cond_param = Helper.ParseJson(task.cond_param) || 0

            let item = this.getNode("task/view/content/loopTask/list/item" + i)

            this.setLabelValue("name", item, task.name)
            this.setLabelValue("desc", item, task.desc +
                (task?.max_progress <= 1 ? "" : "(" + (task.progress || 0) + "/" + task.max_progress + ")"))

            this.setActive("btnAward/goto", item, true)
            this.setActive("btnAward/finish", item, true)
            if (task.status === 2) {
                this.setActive("btnAward/finish/tubiao-bofang", item, false)
                this.setNodePositionX("btnAward/finish/Label", item, 0)
                this.setActive("btnAward/goto", item, false)
                this.setLabelValue("btnAward/finish/Label", item, "已完成")
                this.setButtonInfo("btnAward", item, { interactable: false })
            } else if (task.status === 1) {
                this.setActive("btnAward/finish/tubiao-bofang", item, false)
                this.setNodePositionX("btnAward/finish/Label", item, 0)
                this.setActive("btnAward/goto", item, false)
                this.setLabelValue("btnAward/finish/Label", item, "已完成")
                this.setButtonInfo("btnAward", item, { interactable: false })
            } else {
                // if (task.cond_type === 0 || task.cond_type === 6 || task.cond_type === 7 || task.cond_type === 10 ) {
                this.setLabelValue("btnAward/goto/Label", item, "前往")
                // } else {
                //     this.setActive("btnAward", item, false)
                // }
                this.setActive("btnAward/finish", item, false)
                this.setButtonInfo("btnAward", item, { interactable: true })
            }

            this.setButtonClick("btnAward", item, () => {
                if (task.status === 2) {
                } else if (task.status === 1) {
                } else {
                    this.doTask(task)
                }
            })

            if (Number(i) >= 3) break
        }

        let box = data.filter(i => !i.ext_param.belong_to)[0]
        if (box) {
            let min = 1000000000
            let max = 0
            box?.box_list[0]?.prob.forEach(i => (min > i.Min ? min = i.Min : min) && (max < i.Max ? max = i.Max : max))
            if (max > min) {
                this.setLabelValue("task/view/content/loopTask/baoxiang/num", (min > 10000 ? Helper.FormatNumWY(min) : min) + "-" + (max > 10000 ? Helper.FormatNumWY(max) : max))
            }

            if (box.expire_at) {
                this.stopTween("task/view/content/loopTask/baoxiang/time")
                let time = box.expire_at * 1000 - Date.now()
                let tween = cc.tween()
                    .repeat(Math.floor(time / 1000), cc.tween()
                        .call(() => { this.setLabelValue("task/view/content/loopTask/baoxiang/time", Helper.FormatTimeString(time -= 1000, "hh:mm:ss")) })
                        .delay(1)
                    )
                    .delay(10)
                // .call(() => { this.refreshBoxTaskData() })
                this.runTween("task/view/content/loopTask/baoxiang/time", tween)
            } else {
                this.setLabelValue("task/view/content/loopTask/baoxiang/time", "")
                this.stopTween("task/view/content/loopTask/baoxiang/time")
            }


            this.setProgressValue("task/view/content/loopTask/baoxiang/progress", (box.progress || 0) / box.max_progress)
            this.setLabelValue("task/view/content/loopTask/baoxiang/val", (box.progress || 0) + "/" + box.max_progress)

            if (box.status === 1) {
                this.setActive("task/view/content/loopTask/baoxiang/redPoint", true)
            } else {
                this.setActive("task/view/content/loopTask/baoxiang/redPoint", false)
            }

            this.setButtonInfo("task/view/content/loopTask/baoxiang/btnAward", { interactable: box.status === 1 })

            // this.setButtonClick("task/view/content/loopTask/baoxiang/btnAward", () => {
            //     if (box.status !== 1) {
            //         return
            //     }


            //     if (this._activityConfig.ad_aid > 0) {
            //         AdSrv.PlayAD(this._activityConfig.ad_aid, JSON.stringify(this._activityConfig))
            //             .then(() => { getAward() })
            //     } else {
            //         getAward()
            //     }
            // })
        }
    }

    getLoopAward() {
        let getAward = () => {
            TaskSrv.GetBoxTastAward((res) => {
                if (res.err) {
                    Helper.OpenTip("宝箱领取错误")
                    return
                }
                for (let v of res.award_list) {
                    v.item_id = v.id
                    v.item_num = v.num
                }
                UserSrv.UpdateItem(() => {
                    UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: res.award_list }, closeCb: () => this.onPressRefresh() })
                })
            })
        }

        if (this._activityConfig.ad_aid > 0) {
            AdSrv.PlayAD(this._activityConfig.ad_aid, JSON.stringify(this._activityConfig))
                .then(() => { getAward() })
        } else {
            getAward()
        }


        // TaskSrv.GetBoxTastAward((res) => {
        //     if (!res.err) {
        //         this.refreshBoxTaskData()
        //         for (let v of res.award_list) {
        //             v.item_id = v.id
        //             v.item_num = v.num
        //         }
        //         let self = this
        //         UserSrv.UpdateItem(() => {
        //             UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: res.award_list, autoOpenBox: true } })
        //             self.refreshBoxTaskData()
        //         })
        //     }

        // })
    }

    onPressRefresh() {
        TaskSrv.RefreshBoxTastList((res) => {
            // this.refreshBoxTaskData()
            this.updateLoopTask(res.list)
        })
    }

    refreshAllTask() {
        this.refreshTaskData()
        this.refreshBoxTaskData()
    }

    doTask(task) {
        if (task.cond_type === 0) {  // 比赛
            // MatchSvr.JoinMatchByCond(Number(task.cond_param["match_type"]), Number(task.cond_param["level"])) //match_type:1|level:1            
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "match" })
            this.close()
            // } else if (data[i].cond_type === 1) {   
        } else if (task.cond_type === 2) {   // 观看广告
            // } else if (data[i].cond_type === 3) {   
        } else if (task.cond_type === 4) {   // 局数奖励
            // MatchSvr.JoinMatchByCond(Number(task.cond_param["match_type"])) //match_type:1|level:1
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "match" })
            this.close()
            // } else if (data[i].cond_type === 5) {
        } else if (task.cond_type === 6) {   // 签到
            ScribeSrv.checkShowScribeWeChatMsg()
            SignSrv.GetConfig((config) => {
                let info = ActivitySrv.GetActivityById(8)
                UIMgr.OpenUI("lobby", "component/activity/sign/Sign", {
                    single: true,
                    param: { signConfig: config, activityConfig: info },
                    closeCb: () => this.refreshAllTask(),
                    index: 20
                })
            })
        } else if (task.cond_type === 7) {   // 抽奖
            UIMgr.OpenUI("lobby", "component/activity/turntable/MainTurntable", { single: true, param: {} })
        } else if (task.cond_type === 8) {   // 绑定手机
            UIMgr.OpenUI("lobby", "component/account/PhoneBind/PhoneBind", { single: true, param: {}, closeCb: () => this.refreshAllTask() })
        } else if (task.cond_type === 9) {   // 关注公众号
            let param = {
                single: true,
                buttons: 1,
                confirmName: "复制公众号",
                confirmUnclose: true,
                confirm: () => { Helper.copyToClipBoard("高手竞技") }
            }
            Helper.OpenPopUI("component/personal/KefuPop", "客服中心", null, param)
        } else if (task.cond_type === 10) {  // 体验游戏
            if (task.client_param.games) {
                let games = task.client_param.games.filter(i => i !== DataMgr.data.Config.gameId)
                let idx = Math.floor(Math.random() * 100 % games.length)
                let gameid = games[idx]

                let self = this
                let jumpGame = (data) => {
                    for (let v of data) {
                        if (v.promotion_game_gid === gameid) {
                            if (cc.sys.isBrowser) {
                                TaskSrv.UpdateTaskStatus(task.task_tid, 1, () => {
                                    self.refreshAllTask()
                                })
                            } else if (Helper.isNative()) {

                            } else {
                                PluginMgr.navigateToMiniGame(v.promotion_appid, {}, (succ: boolean) => {
                                    if (succ) {
                                        TaskSrv.UpdateTaskStatus(task.task_tid, 1, () => {
                                            self.refreshAllTask()
                                        })
                                    }
                                })
                            }
                            return
                        }
                    }
                }

                let promotionList = DataMgr.getData<any[]>(Constants.DATA_DEFINE.OTHER_GAME_PROMOTION)
                if (promotionList) {
                    jumpGame(promotionList)
                } else {
                    UserSrv.GetPromotion((res) => {
                        jumpGame(res)
                    })
                }
            } else {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "games" })
                this.close()
            }
        } else if (task.cond_type === 11) {  // 下载APP
            UIMgr.OpenUI("lobby", "component/task/DownloadApp", { single: true, param: { img: task.client_param.img } })
        } else if (task.cond_type === 12) {  // 邀请好友
            UIMgr.OpenUI("lobby", "component/promote/PromoteMain", { single: true, closeCb: () => this.refreshAllTask() })
        }
    }
}
