import BaseUI from "../../../start/script/base/BaseUI";
import { Helper } from "../../../start/script/system/Helper";
import { UserSrv } from "../../../start/script/system/UserSrv";
import { EventMgr } from "../../../start/script/base/EventMgr";
import { Constants } from "../../../start/script/igsConstants";
import { UIMgr } from "../../../start/script/base/UIMgr";
import { PromoteSrv } from "../../../start/script/system/PromoteSrv";
import { User } from "../../../start/script/data/User";
import { ExchangeSrv } from "../../../start/script/system/ExchangeSrv";


const { ccclass, property } = cc._decorator;

const CASH_CONFIG =
    [{ "id": "61d3c0700568a54318831716", "plat_aid": 5, "consume_list": [{ "item_id": 10004, "item_num": "30", "item_name": "推广红包" }], "output_list": [{ "item_id": 3, "item_num": "30", "item_name": "红包" }], "type_id": 3, "daily_limit": 1, "total_limit": 1, "inventory_num": 10000000, "exchange_conditions": "0.3元红包" }, { "id": "61d3c0ac0568a54318831717", "plat_aid": 5, "consume_list": [{ "item_id": 10004, "item_num": "2000", "item_name": "推广红包" }], "output_list": [{ "item_id": 3, "item_num": "2000", "item_name": "红包" }], "type_id": 3, "daily_limit": 1, "total_limit": 1, "inventory_num": 10000000, "exchange_conditions": "20元红包" }, { "id": "61d3c0cb0568a54318831718", "plat_aid": 5, "consume_list": [{ "item_id": 10004, "item_num": "5000", "item_name": "推广红包" }], "output_list": [{ "item_id": 3, "item_num": "5000", "item_name": "红包" }], "type_id": 3, "daily_limit": 1, "total_limit": 1, "inventory_num": 10000000, "exchange_conditions": "50元红包" }, { "id": "61d3c0f90568a54318831719", "plat_aid": 5, "consume_list": [{ "item_id": 10004, "item_num": "10000", "item_name": "推广红包" }], "output_list": [{ "item_id": 3, "item_num": "10000", "item_name": "红包" }], "type_id": 3, "daily_limit": 1, "total_limit": 1, "inventory_num": 10000000, "exchange_conditions": "100元红包" }, { "id": "61d3c12e0568a5431883171a", "plat_aid": 5, "consume_list": [{ "item_id": 10004, "item_num": "20000", "item_name": "推广红包" }], "output_list": [{ "item_id": 3, "item_num": "20000", "item_name": "红包" }], "type_id": 3, "daily_limit": 1, "total_limit": 1, "inventory_num": 10000000, "exchange_conditions": "200元红包" }, { "id": "61d3c1530568a5431883171b", "plat_aid": 5, "consume_list": [{ "item_id": 10004, "item_num": "50000", "item_name": "推广红包" }], "output_list": [{ "item_id": 3, "item_num": "50000", "item_name": "红包" }], "type_id": 3, "daily_limit": 1, "total_limit": 1, "inventory_num": 10000000, "exchange_conditions": "500元红包" }]

@ccclass
export default class PromoteMain extends BaseUI {
    _promRedPacket: number = 0
    typeId: number = 3
    _promoteInfo = null
    _exchangeList = null
    _taskList = null
    _totalAward = 0

    onOpen() {
        console.log("PromoteMain onOpen", this.param)
        this.initEvent()
        this.initButton()
        this.initData()

        Helper.reportEvent("匹配-10.1、进入师徒界面")
    }

    onLoad() {
    }

    onClose() {
        UserSrv.UpdateItem()
    }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.UPDATE_PROMOTE_MEMBER, this.getMemberList, this)
        EventMgr.on(Constants.EVENT_DEFINE.UPDATE_PROMOTE_CASH, this.initExchangeList, this)
        this.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            console.log(this.node.name + " " + event.type)
            UIMgr.CloseUI("component/Promote/PromoteDiscipleDetail")
        })
    }

    initButton() {
        this.setButtonClick("top/btnBack", this.node, () => {
            cc.log("on click btnBack")
            this.close()
        })

        this.setButtonClick("top/btnHelp", this.node, () => {
            cc.log("on click btnHelp")
            UIMgr.OpenUI("lobby", "component/promote/PromoteHelp", { single: true, param: {} })
        })

        this.setButtonClick("node/ndMenu/btnMaster", this.node, () => {
            cc.log("on click btnMaster")
            UIMgr.OpenUI("lobby", "component/promote/PromoteMaster", { single: true, param: { promoteInfo: this._promoteInfo } })
        })

        this.setButtonClick("node/ndMenu/btnIncome", this.node, () => {
            cc.log("on click btnIncome")
            UIMgr.OpenUI("lobby", "component/promote/PromoteIncome", { single: true })
        })

        this.setButtonClick("node/ndMenu/btnContribute", this.node, () => {
            cc.log("on click btnContribute")
            UIMgr.OpenUI("lobby", "component/promote/PromoteContribute", { single: true })
        })

        this.setButtonClick("node/ndMenu/btnShare", this.node, () => {
            cc.log("on click btnShare")
            UIMgr.OpenUI("lobby", "component/promote/PromoteShare", { single: true })
        })

        // 招募徒弟
        this.setButtonClick("node/btnRecruitDisciple", this.node, () => {
            cc.log("on click btnRecruitDisciple")
            UIMgr.OpenUI("lobby", "component/promote/PromoteRecruit", { single: true, param: { promoteInfo: this._promoteInfo, taskInfo: this._taskList }, closeCb: () => { this.getTaskList() } })
        })

        // 一键领取
        this.setButtonClick("node/btnOneClickCollection", this.node, () => {
            cc.log("on click btnOneClickCollection")
            PromoteSrv.GetReward({}, (res) => {
                this.setActive("node/btnOneClickCollection", false)
                this.setActive("node/sptBgTip", true)
                this.showAni()

                this.getPromoteInfo()

                // User.PromRedPacket += Number(res.award_item.item_num)

                UserSrv.UpdateItem(() => {
                    this.initExchangeList()
                })
            })
        })

        // 更多亲传弟子
        this.setButtonClick("node/ndThunder1/btnDirectDisciple", this.node, () => {
            cc.log("on click btnDirectDisciple")
            UIMgr.CloseUI("component/promote/PromoteDiscipleDetail")
            UIMgr.OpenUI("lobby", "component/promote/PromoteMoreDisciple", { single: true, param: { discipleType: 1, promoteInfo: this._promoteInfo } })
        })

        // 更多再传弟子
        this.setButtonClick("node/ndThunder2/btnIndirectDisciple", this.node, () => {
            cc.log("on click btnIndirectDisciple")
            UIMgr.CloseUI("component/promote/PromoteDiscipleDetail")
            UIMgr.OpenUI("lobby", "component/promote/PromoteMoreDisciple", { single: true, param: { discipleType: 2, promoteInfo: this._promoteInfo } })
        })

        // 提现
        this.setButtonClick("node/ProgressBar/btnCash", this.node, () => {
            cc.log("on click btnCash")
            UIMgr.OpenUI("lobby", "component/promote/PromoteCash", { single: true, param: { exchangeList: this._exchangeList } })
        })
    }

    initData() {
        if (cc.sys.WECHAT_GAME === cc.sys.platform || Helper.isNative()) {
            this.setActive("node/ndMenu/btnShare", true)
        } else {
            this.setActive("node/ndMenu/btnShare", false)
        }

        this.setSpriteFrame("node/ndSelf/headbg/head", User.Avatar, true)

        for (let i = 0; i < 3; i++) {
            let disciple = cc.find("node/ndThunder1/ndDirectDisciple" + (i + 1), this.node)
            if (disciple) {
                cc.tween(disciple).repeatForever(cc.tween().delay(Math.random()).to(1, { position: cc.v3(disciple.x, disciple.y + 5, 0) }).to(1, { position: cc.v3(disciple.x, disciple.y - 5, 0) })).start()
            }
        }
        for (let i = 0; i < 6; i++) {
            let disciple = cc.find("node/ndThunder2/ndIndirectDisciple" + (i + 1), this.node)
            if (disciple) {
                cc.tween(disciple).repeatForever(cc.tween().delay(Math.random()).to(1, { position: cc.v3(disciple.x, disciple.y + 3, 0) }).to(1, { position: cc.v3(disciple.x, disciple.y - 3, 0) })).start()
            }
        }

        this.getPromoteInfo()
        this.getMemberList()
        this.getExchangeTemplateInfo()
        this.getTaskList()

        // 读取记录
        let activeTime = 0
        let activeStr = cc.sys.localStorage.getItem("promoteQuickGetAwardDate")
        console.log("activeStr = ", activeStr)
        if (activeStr && activeStr.length > 0) {
            activeTime = JSON.parse(activeStr)
        }
        if (!Helper.isToday(activeTime)) {
            UIMgr.OpenUI("lobby", "component/promote/PromoteQuickGetAward", { single: true })
            activeTime = new Date().getTime()
            console.log("new active = ", activeTime)
            cc.sys.localStorage.setItem("promoteQuickGetAwardDate", JSON.stringify(activeTime))
        }
    }

    getPromoteInfo() {
        PromoteSrv.GetPromoteInfo((res) => {
            this._promoteInfo = res

            res.member_num = res.member_num || 0
            this.setRichTextValue("node/ndThunder1/sptDirectDisciple/lblDesc", "<outline color=#000000><color=#fdffe5>亲传弟子（" + res.member_num + "人）</color></outline>")

            res.second_member_num = res.second_member_num || 0
            this.setRichTextValue("node/ndThunder2/sptIndirectDisciple/lblDesc", "<outline color=#000000><color=#fdffe5>再传弟子（" + res.second_member_num + "人）</color></outline>")

            if (res.member_num > 3) {
                this.setActive("node/ndThunder1/btnDirectDisciple", this.node, true)
            }

            if (res.second_member_num > 0) {
                this.setActive("node/ndThunder2/btnIndirectDisciple", this.node, true)
            }

            res.total_award.item_num = res.total_award.item_num || 0
            this._totalAward = res.total_award.item_num
            this.setRichTextValue("node/ndSelf/sptBgTotalIncome/lblMoney", "<outline color=#000000><color=#ffffff>" + (res.total_award.item_num / 100) + "元</color></outline>")

            res.today_award.item_num = res.today_award.item_num || 0
            let mayReward = 1.3 * res.member_num + 0.35 * res.second_member_num
            if (mayReward > 0) {
                let totalReward = res.today_award.item_num / 100
                let highScale = 114 * totalReward / mayReward
                if (totalReward >= mayReward) {
                    highScale = 114
                }
                console.log("totalReward, mayReward", totalReward, mayReward, highScale)

                let sptWaterDark1 = cc.find("node/ndSelf/sptBgTotalIncome/sptMask/sptWaterDark1", this.node)
                let sptWaterDark2 = cc.find("node/ndSelf/sptBgTotalIncome/sptMask/sptWaterDark2", this.node)
                let sptWaterBright1 = cc.find("node/ndSelf/sptBgTotalIncome/sptMask/sptWaterBright1", this.node)
                let sptWaterBright2 = cc.find("node/ndSelf/sptBgTotalIncome/sptMask/sptWaterBright2", this.node)
                sptWaterDark1.y = -114 + highScale
                sptWaterDark2.y = -114 + highScale
                sptWaterBright1.y = -114 + highScale
                sptWaterBright2.y = -114 + highScale
            }
        })
    }

    getMemberList() {
        PromoteSrv.GetMemberList({ start: 0, size: 3, member_openid: "", generation: 1 }, (res) => {
            let addStartIndex = 0
            if (res && res.member_list) {
                addStartIndex = res.member_list.length
                let len = res.member_list.length
                if (len > 3) {
                    len = 3
                }
                for (let i = 0; i < len; i++) {
                    let memberData = res.member_list[i]
                    let disciple = cc.find("node/ndThunder1/ndDirectDisciple" + (i + 1), this.node)
                    if (disciple) {
                        this.setChildParam(disciple, { data: memberData, pos: disciple.position, discipleType: 1 })
                    }

                    if (memberData.pool_award && memberData.pool_award.item_num && memberData.pool_award.item_num > 0) {
                        this.setActive("node/sptBgTip", false)
                        this.setActive("node/btnOneClickCollection", true)
                    }

                    PromoteSrv.GetMemberList({ start: 0, size: 2, member_openid: memberData.openid, member_game_id: memberData.game_id, generation: 2 }, (res2) => {
                        this.getMember2List(res2, i)
                    })
                }
            }

            for (let i = addStartIndex; i < 3; i++) {
                let disciple = cc.find("node/ndThunder1/ndDirectDisciple" + (i + 1), this.node)
                if (disciple) {
                    this.setChildParam(disciple, { pos: disciple.position })
                }
            }
        })
    }

    getMember2List(data: any, index) {
        let addStartIndex = 0
        if (data && data.member_list) {
            addStartIndex = data.member_list.length
            for (let i = 0; i < data.member_list.length; i++) {
                let memberData = data.member_list[i]
                let indisciple = cc.find("node/ndThunder2/ndIndirectDisciple" + (index * 2 + i + 1), this.node)
                if (indisciple) {
                    this.setChildParam(indisciple, { data: memberData, pos: indisciple.position, discipleType: 2 })
                }

                if (memberData.pool_award.item_num) {
                    this.setActive("node/sptBgTip", false)
                    this.setActive("node/btnOneClickCollection", true)
                }
            }
        }

        for (let i = addStartIndex; i < 2; i++) {
            let disciple = cc.find("node/ndThunder2/ndIndirectDisciple" + (index * 2 + i + 1), this.node)
            if (disciple) {
                this.setChildParam(disciple, { pos: disciple.position })
            }
        }
    }

    getExchangeTemplateInfo() {
        //获取商品列表
        ExchangeSrv.getExchangeTemplateInfo({
            typeId: this.typeId
        }, (res) => {
            cc.log("getExchangeTemplateInfo", res)
            this._exchangeList = CASH_CONFIG
            if (res && res.code == "0000") {
                if (res.result) {
                    console.log("getExchangeTemplateInfo res = ", res)
                    this._exchangeList = res.result
                }
            }

            //兑换记录
            let param = {
                page_code: 1,
                page_size: 30
            }
            console.log("exchangeLogList param = ", param)
            Helper.PostHttp("igaoshou-shop-srv/exchange/exchangeLogList", null, param, (res, event) => {
                console.log("exchangeLogList res = ", res)
                if (res && res.code == "0000") {
                    if (res.result) {
                        for (let i = 0; i < res.result.length; i++) {
                            let result = res.result[i]
                            if (result.consume_list[0].item_id == Constants.ITEM_INDEX.PROM_REDPACKET) {
                                for (let m = this._exchangeList.length - 1; m >= 0; m--) {
                                    let config = this._exchangeList[m]
                                    if (1 == config.total_limit && result.consume_list[0].item_num == config.consume_list[0].item_num) {
                                        this._exchangeList.splice(m, 1)
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
                this.initExchangeList()
            })
        })
    }

    initExchangeList(purchased?: any) {
        // cc.log(JSON.stringify(exchangeData))
        if (purchased) {
            for (let m = this._exchangeList.length - 1; m >= 0; m--) {
                let config = this._exchangeList[m]
                if (1 == config.total_limit && purchased.consume_list[0].item_num == config.consume_list[0].item_num) {
                    this._exchangeList.splice(m, 1)
                    break
                }
            }
        }
        let awardIndex = 0
        for (let i = this._exchangeList.length - 1; i >= 0; i--) {
            let v = this._exchangeList[i]
            if (v && v.consume_list && Constants.ITEM_INDEX.PROM_REDPACKET == v.consume_list[0].item_id && User.PromRedPacket >= v.consume_list[0].item_num) {
                awardIndex = i
                break
            }
        }

        let v = this._exchangeList[awardIndex]
        if (v && v.consume_list && v.consume_list[0] && Constants.ITEM_INDEX.PROM_REDPACKET == v.consume_list[0].item_id) {
            if (User.PromRedPacket >= v.consume_list[0].item_num) {
                this.setProgressValue("node/ProgressBar", 1)
                this.setRichTextValue("node/ProgressBar/lblProgress", "<outline color=#551e87><color=#ffffff>100%</color></outline>")
                this.setRichTextValue("node/ProgressBar/lblDesc", "<outline color=#551e87><color=#ffffff>可提现到微信</color></outline>")
            } else {
                this.setProgressValue("node/ProgressBar", User.PromRedPacket / v.consume_list[0].item_num)
                this.setRichTextValue("node/ProgressBar/lblProgress", "<outline color=#551e87><color=#ffffff>" + ((User.PromRedPacket / v.consume_list[0].item_num) * 100).toFixed(2) + "%</color></outline>")

                this.setRichTextValue("node/ProgressBar/lblDesc", "<outline color=#551e87><color=#ffffff>差</color><color=#ffc400>" + (v.consume_list[0].item_num - User.PromRedPacket) / 100 + "元</c><color=#ffffff>即可提现到微信</color></outline>")
            }
        }
    }

    getTaskList() {
        PromoteSrv.GetTask({}, (res) => {
            this._taskList = res
            if (res && res.list) {
                for (let i = 0; i < res.list.length; i++) {
                    let itemData = res.list[i]
                    if (1 == itemData.state || "Finish" == itemData.state) {
                        this.setActive("node/btnRecruitDisciple/sptWarn", true)
                        return
                    }
                }
                this.setActive("node/btnRecruitDisciple/sptWarn", false)
            } else {

                this.setActive("node/btnRecruitDisciple/sptWarn", false)
            }
        })
    }

    tokenAni(msg) {
        if (msg && msg.bAni) {
            if (null !== this._promRedPacket && this._promRedPacket !== this._totalAward) {
                this.stopTween("node/ndSelf/sptBgTotalIncome/lblMoney")
                this.runTween("node/ndSelf/sptBgTotalIncome/lblMoney", Helper.TokenAni(this._promRedPacket, this._totalAward, .5, (src) => {
                    this.setRichTextValue("node/ndSelf/sptBgTotalIncome/lblMoney", "<outline color=#000000><color=#ffffff>" + (src / 100) + "元</color></outline>")
                    this._promRedPacket = src
                }))
            } else {
                this.setRichTextValue("node/ndSelf/sptBgTotalIncome/lblMoney", "<outline color=#000000><color=#ffffff>" + (this._totalAward / 100) + "元</color></outline>")
                this._promRedPacket = this._totalAward
            }
        } else {
            this.setRichTextValue("node/ndSelf/sptBgTotalIncome/lblMoney", "<outline color=#000000><color=#ffffff>" + (this._totalAward / 100) + "元</color></outline>")
            this._promRedPacket = this._totalAward
        }
    }

    showAni() {
        let target = <any>cc.find("node/ndSelf", this.node)
        for (let i = 1; i <= 3; i++) {
            let item = <any>cc.find("node/ndThunder1/ndDirectDisciple" + i + "/headbg/sptBgBubble", this.node)
            if (item && item.active) {
                if (!item.srcScale) {
                    item.srcScale = item.scale
                    item.srcParent = item.parent
                    item.srcPosition = item.position
                    let wpos = item.parent.convertToWorldSpaceAR(item.position)
                    let lpos = target.convertToNodeSpaceAR(wpos)
                    item.newpos = lpos
                }
                item.parent = target
                item.position = item.newpos

                cc.tween(item)
                    .delay(0.02 * i)
                    .to(0.65, { position: cc.v3(0, 0, 0), scale: 0.5 })
                    .to(0.2, { opacity: 0 })
                    .call(() => {
                        item.active = false
                        item.scale = item.srcScale
                        item.parent = item.srcParent
                        item.position = item.srcPosition
                        item.opacity = 255
                    })
                    .start()
            }
        }

        for (let i = 1; i <= 6; i++) {
            let item = <any>cc.find("node/ndThunder2/ndIndirectDisciple" + i + "/headbg/sptBgBubble", this.node)
            if (item && item.active) {
                if (!item.srcScale) {
                    item.srcScale = item.scale
                    item.srcParent = item.parent
                    item.srcPosition = item.position
                    let wpos = item.parent.convertToWorldSpaceAR(item.position)
                    let lpos = target.convertToNodeSpaceAR(wpos)
                    item.newpos = lpos
                }
                item.parent = target
                item.position = item.newpos

                cc.tween(item)
                    .delay(0.02 * i)
                    .to(0.65, { position: cc.v3(0, 0, 0), scale: 0.5 })
                    .to(0.2, { opacity: 0 })
                    .call(() => {
                        item.active = false
                        item.scale = item.srcScale
                        item.parent = item.srcParent
                        item.position = item.srcPosition
                        item.opacity = 255
                    })
                    .start()
            }
        }

        this.scheduleOnce(() => {
            this.getMemberList()
            this.tokenAni(true)
        }, 1)
    }

    update(dt: number) {
        let sptWaterDark1 = cc.find("node/ndSelf/sptBgTotalIncome/sptMask/sptWaterDark1", this.node)
        let sptWaterDark2 = cc.find("node/ndSelf/sptBgTotalIncome/sptMask/sptWaterDark2", this.node)
        let sptWaterBright1 = cc.find("node/ndSelf/sptBgTotalIncome/sptMask/sptWaterBright1", this.node)
        let sptWaterBright2 = cc.find("node/ndSelf/sptBgTotalIncome/sptMask/sptWaterBright2", this.node)

        let speed = 2
        sptWaterDark1.x -= speed
        if (sptWaterDark1.x <= -114) {
            sptWaterDark1.x = 114
        }
        sptWaterDark2.x -= speed
        if (sptWaterDark2.x <= -114) {
            sptWaterDark2.x = 114
        }
        sptWaterBright1.x += speed
        if (sptWaterBright1.x >= 114) {
            sptWaterBright1.x = -114
        }
        sptWaterBright2.x += speed
        if (sptWaterBright2.x >= 114) {
            sptWaterBright2.x = -114
        }
    }
}
