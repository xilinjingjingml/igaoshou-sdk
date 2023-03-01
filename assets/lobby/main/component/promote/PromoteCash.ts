import BaseUI from "../../../start/script/base/BaseUI";
import { UIMgr } from "../../../start/script/base/UIMgr";
import { User } from "../../../start/script/data/User";
import { Helper } from "../../../start/script/system/Helper";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { WxProxyWrapper } from "../../../start/script/pulgin/WxProxyWrapper";
import { PluginMgr } from "../../../start/script/base/PluginMgr";
import { ExchangeSrv } from "../../../start/script/system/ExchangeSrv";
import { Constants } from "../../../start/script/igsConstants";
import { UserSrv } from "../../../start/script/system/UserSrv";
import { EventMgr } from "../../../start/script/base/EventMgr";

const { ccclass, property } = cc._decorator;
const CASH_CONFIG =
    [{ "id": "61d3c0700568a54318831716", "plat_aid": 5, "consume_list": [{ "item_id": 10004, "item_num": "30", "item_name": "推广红包" }], "output_list": [{ "item_id": 3, "item_num": "30", "item_name": "红包" }], "type_id": 3, "daily_limit": 1, "total_limit": 1, "inventory_num": 10000000, "exchange_conditions": "0.3元红包" }, { "id": "61d3c0ac0568a54318831717", "plat_aid": 5, "consume_list": [{ "item_id": 10004, "item_num": "2000", "item_name": "推广红包" }], "output_list": [{ "item_id": 3, "item_num": "2000", "item_name": "红包" }], "type_id": 3, "daily_limit": 1, "total_limit": 1, "inventory_num": 10000000, "exchange_conditions": "20元红包" }, { "id": "61d3c0cb0568a54318831718", "plat_aid": 5, "consume_list": [{ "item_id": 10004, "item_num": "5000", "item_name": "推广红包" }], "output_list": [{ "item_id": 3, "item_num": "5000", "item_name": "红包" }], "type_id": 3, "daily_limit": 1, "total_limit": 1, "inventory_num": 10000000, "exchange_conditions": "50元红包" }, { "id": "61d3c0f90568a54318831719", "plat_aid": 5, "consume_list": [{ "item_id": 10004, "item_num": "10000", "item_name": "推广红包" }], "output_list": [{ "item_id": 3, "item_num": "10000", "item_name": "红包" }], "type_id": 3, "daily_limit": 1, "total_limit": 1, "inventory_num": 10000000, "exchange_conditions": "100元红包" }, { "id": "61d3c12e0568a5431883171a", "plat_aid": 5, "consume_list": [{ "item_id": 10004, "item_num": "20000", "item_name": "推广红包" }], "output_list": [{ "item_id": 3, "item_num": "20000", "item_name": "红包" }], "type_id": 3, "daily_limit": 1, "total_limit": 1, "inventory_num": 10000000, "exchange_conditions": "200元红包" }, { "id": "61d3c1530568a5431883171b", "plat_aid": 5, "consume_list": [{ "item_id": 10004, "item_num": "50000", "item_name": "推广红包" }], "output_list": [{ "item_id": 3, "item_num": "50000", "item_name": "红包" }], "type_id": 3, "daily_limit": 1, "total_limit": 1, "inventory_num": 10000000, "exchange_conditions": "500元红包" }]

@ccclass
export default class PromoteCash extends BaseUI {
    _content: cc.Node = null
    _itemPrefab: cc.Node = null
    _cashIndex: number = 0

    confirmNode: cc.Node = null
    autoClose: boolean = true
    typeId: number = 3
    guidance: boolean = false
    _exchangeList = null
    _curChooseNode = null
    onOpen() {
        console.log("PromoteCash onOpen", this.param)
        if (this.param && this.param.exchangeList) {
            this._exchangeList = this.param.exchangeList
        }

        this.initButton()
        this.initData()
    }

    onLoad() {
        this._content = cc.find("sptBgMoney/scrollView/view/content", this.node)
        this._itemPrefab = cc.find("item", this._content)
        this._itemPrefab.active = false

        this.confirmNode = cc.find("confirmNode", this.node)
        this.confirmNode.active = false
    }

    initEvent() {
    }

    initButton() {
        this.setButtonClick("top/btnBack", this.node, () => {
            this.close()
        })

        this.setButtonClick("detail/btnCashRecord", this.node, () => {
            UIMgr.OpenUI("lobby", "component/promote/PromoteCashRecord", {single: true, param: {} })
        })

        this.setButtonClick("sptBgMoney/btnCash", this.node, () => {
            console.log("btnCash")
            let v = this._exchangeList[this._cashIndex]
            if (User.PromRedPacket < Number(v.consume_list[0].item_num)) {
                Helper.OpenTip("红包余额不足！")
            } else {
                if (cc.sys.WECHAT_GAME === cc.sys.platform) {
                    let weChatSession: any = DataMgr.getData("WeChatSession")
                    let systemInfo: any = WxProxyWrapper.getSystemInfoSync()
                    let param = {
                        id: v.id,
                        appid: DataMgr.data.Config.wxAPPID,
                        openid: weChatSession ? weChatSession.openid : null,
                        device_id: User.OpenID,
                        device_type: systemInfo ? systemInfo.model : "unknow",
                        address: User.Region,
                    }
                    console.log("param", param)
                    this.exchangeTemplateInfo(param, v)
                } else {
                    let param = {
                        id: v.id,
                        device_id: User.OpenID,
                        device_type: PluginMgr.getDeviceName(),
                        address: User.Region,
                    }
                    console.log("param", param)
                    this.exchangeTemplateInfo(param, v)
                }
            }
        })
    }

    initData() {
        this.setLabelValue("detail/lblMoney", (User.PromRedPacket / 100).toFixed(2) + "元")

        if (this._exchangeList) {
            this.initExchangeList()
        } else {
            this.getExchangeTemplateInfo()
        }
    }

    getExchangeTemplateInfo() {
        //获取商品列表
        let param = {
            typeId: this.typeId
        }

        ExchangeSrv.getExchangeTemplateInfo(param, (res) => {
            cc.log("getExchangeTemplateInfo", res)
            this._exchangeList = CASH_CONFIG
            if (res && res.code == "0000") {
                if (res.result) {
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

    initExchangeList() {
        this._content.removeAllChildren(true)
        for (let i = 0; i < this._exchangeList.length; i++) {
            let v = this._exchangeList[i]
            let itemNode = cc.instantiate(this._itemPrefab)
            itemNode.active = true
            this._content.addChild(itemNode)

            this.setLabelValue("sptBgMoney/lblMoney", itemNode, (v.output_list[0].item_num / 100) + "元")
            // this.setLabelValue("sptTip/lblStatus", itemNode, "已提完")

            let onClick = (sender, data) => {
                console.log("btnBuy on click")
                if (this._curChooseNode) {
                    this.setActive("sptChoose", this._curChooseNode, false)
                }
                this.setActive("sptChoose", itemNode, true)
                this._cashIndex = i
                this._curChooseNode = itemNode
            }

            this.setButtonClick("btnChoose", itemNode, onClick)
        }
    }

    exchangeTemplateInfo(param: any, v: any) {
        ExchangeSrv.exchangeTemplateInfo(param, (res, event) => {
            console.log("exchangeInfo", res)
            if (res && res.code == "0000") {
                //Helper.reportEvent("红包兑换", "成功", v.output_list[0].item_num / 100 + "元")
                this.confirmNode.active = true
                this.setLabelValue("confirmNode/node/content/lblNum", v.output_list[0].item_num / 100)
                DataMgr.data.Bundle.load("sound/dhhb", cc.AudioClip, (err, res: cc.AudioClip) => {
                    if (err) {
                        return
                    }
                    cc.audioEngine.playEffect(res, false)
                })
                DataMgr.setData(Constants.DATA_DEFINE.EXCHANGE_DATA + this.typeId, null)

                this.setButtonClick("confirmNode/node/btnOk", this.node, () => {
                    this.confirmNode.active = false
                })

                // User.PromRedPacket -= Number(v.consume_list[0].item_num)

                for (let m = this._exchangeList.length - 1; m >= 0; m--) {
                    let config = this._exchangeList[m]
                    if (1 == config.total_limit && v.consume_list[0].item_num == config.consume_list[0].item_num) {
                        this._exchangeList.splice(m, 1)
                        break
                    }
                }

                UserSrv.UpdateItem(() => {
                    this.initData()

                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_PROMOTE_CASH, v)
                })
            } else if (res && res.code == "10001") {
                PluginMgr.setIsBind(1)
                PluginMgr.login({ sessionType: "SessionWeiXin" })
            } else {
                if (res && res.msg) {
                    Helper.OpenTip(res.msg)
                } else {
                    Helper.OpenTip("操作失败，请稍后再试！")
                }
                if (this.guidance) {
                    this.scheduleOnce(() => {
                        let btnClose = cc.find("node/btnClose", this.node)
                        UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", { single: true, param: { index: 17, node: btnClose } })
                    }, 1.0)
                }
            }
        })
    }
}
