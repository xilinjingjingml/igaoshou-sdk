import BaseUI from "../../../../start/script/base/BaseUI";
import { ExchangeSrv } from "../../../../start/script/system/ExchangeSrv";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { Helper } from "../../../../start/script/system/Helper";
import { User } from "../../../../start/script/data/User";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { WxProxyWrapper } from "../../../../start/script/pulgin/WxProxyWrapper";
import { PluginMgr } from "../../../../start/script/base/PluginMgr";
import { UserSrv } from "../../../../start/script/system/UserSrv";
import { UIMgr } from "../../../../start/script/base/UIMgr";

const { ccclass, property } = cc._decorator;

const EXCHANGE_CONFIG = 
    [
        {"id":"61360516cf456a98c9ff3627","plat_aid":5,"exchange_img":"https://default1.png","consume_list":[{"item_id":1,"item_num":"200000","item_name":"奖券"}],"output_list":[{"item_id":3,"item_num":"2000","item_name":"红包券"}],"type_id":2,"daily_limit":1,"total_limit":1,"inventory_num":-1},
        {"id":"61360534cf456a98c9ff6dd2","plat_aid":5,"exchange_img":"https://default1.png","consume_list":[{"item_id":1,"item_num":"500000","item_name":"奖券"}],"output_list":[{"item_id":3,"item_num":"5000","item_name":"红包券"}],"type_id":2,"daily_limit":1,"total_limit":1,"inventory_num":-1},
        {"id":"6136054acf456a98c9ff93bd","plat_aid":5,"exchange_img":"https://default1.png","consume_list":[{"item_id":1,"item_num":"1000000","item_name":"奖券"}],"output_list":[{"item_id":3,"item_num":"10000","item_name":"红包券"}],"type_id":2,"daily_limit":1,"total_limit":1,"inventory_num":-1},
        {"id":"61360561cf456a98c9ffb46e","plat_aid":5,"exchange_img":"https://default1.png","consume_list":[{"item_id":1,"item_num":"2000000","item_name":"奖券"}],"output_list":[{"item_id":3,"item_num":"20000","item_name":"红包券"}],"type_id":2,"daily_limit":1,"total_limit":1,"inventory_num":-1}
    ]

@ccclass
export default class ExchangeLotteryEntry extends BaseUI {

    listContent: cc.Node = null
    itemPrefab: cc.Node = null

    confirmNode: cc.Node = null
    autoClose: boolean = true
    typeId: number = 2
    guidance: boolean = false
    onOpen() {
        console.log("ExchangeLotteryEntry onOpen", this.param)

        this.initEvent()
        this.initButton()
        this.initData()

        //获取商品列表
        let param = {
            typeId: this.typeId
        }
        
        ExchangeSrv.getExchangeTemplateInfo(param, (res) => {
            cc.log("getExchangeTemplateInfo", res)
            let data = EXCHANGE_CONFIG
            if (res && res.code == "0000") {                
                if (res.result) {
                    data = res.result                    
                }
            } 
            this.initExchangeList(data)
        })
    }

    onLoad() {
        this.confirmNode = cc.find("confirmNode", this.node)
        this.confirmNode.active = false

        this.listContent = cc.find("node/list/view/content", this.node)
        this.itemPrefab = cc.find("node/list/view/content/item", this.node)
        this.itemPrefab.active = false
    }

    onClose() {
        console.log("ExchangeLotteryEntry onClose")
        if (this.guidance) {
            // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_GAME_GUIDANCE, { index: 3 })
        }
    }

    start() {
        console.log("ExchangeLotteryEntry start")
    }

    initEvent() {
        EventMgr.on(Constants.EVENT_DEFINE.UPDATE_USER_ITEM, this.initData, this)
    }

    // update (dt) {}

    initButton() {
        this.setButtonClick("node/btnClose", () => {
            console.log("btnClose on click")
            this.close()
        })

        this.setButtonClick("node/myLottery/btnRecord", () => {
            console.log("btnFRecord on click")
            Helper.OpenPageUI("component/exchange/ExchangeRecordEntry", "兑换记录", null, {})
        })

        this.setButtonClick("confirmNode/node/btnClose", () => {
            console.log("confirmNode/btnClose on click")
            this.confirmNode.active = false
            if (this.autoClose) {
                this.close()
            }
        })

        this.setButtonClick("confirmNode/node/btnOk", () => {
            console.log("confirmNode/btnOk on click")
            this.confirmNode.active = false
            if (this.autoClose) {
                this.close()
            }
        })
    }

    initData() {
        this.setLabelValue("node/myLottery/lottery", Helper.FormatNumPrice(User.Lottery / 10000))
        // let value = lottery / 10000
        // let n = value.toFixed(2 + 1)
        // let b = n.slice(0, n.length - 1);
        this.setLabelValue("node/myLottery/value", Helper.FormatNumWYCN(User.Lottery))
        this.setLabelValue("node/myLottery/value2", "≈" + Helper.FormatNumPrice(User.Lottery / 10000) + "元")
    }

    initExchangeList(exchangeData: any[]) {
        cc.log(JSON.stringify(exchangeData))
        for (let i = 0; i < exchangeData.length; i++) {
            let v = exchangeData[i]
            let itemNode = cc.instantiate(this.itemPrefab)
            itemNode.active = true
            this.listContent.addChild(itemNode)

            this.setLabelValue("output/num", itemNode, v.output_list[0].item_num / 100)
            let lottery = Number(v.consume_list[0].item_num)
            let lotteryStr: string = lottery >= 10000 ? Helper.FormatNumWYCN(lottery) : "" + lottery
            lotteryStr = lotteryStr.replace("e", "亿")
            lotteryStr = lotteryStr.replace("w", "万")
            this.setLabelValue("expend/num", itemNode, lotteryStr)

            let onClick = (sender, data) => {
                console.log("btnBuy on click")
                if (User.Lottery < Number(v.consume_list[0].item_num)) {
                    Helper.OpenTip("奖券数量不足")
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
            }

            this.setButtonClick(itemNode, onClick)
            this.setButtonClick("btnBuy", itemNode, onClick)
        }
    }

    exchangeTemplateInfo(param: any, v: any) {
        ExchangeSrv.exchangeTemplateInfo(param, (res, event) => {
            console.log("exchangeInfo", res)
            if (res && res.code == "0000") {
                //Helper.reportEvent("红包兑换", "成功", v.output_list[0].item_num / 100 + "元")
                this.confirmNode.active = true
                this.setLabelValue("confirmNode/node/content/lblNum", v.output_list[0].item_num / 100)
                let guang = cc.find("confirmNode/guang", this.node)
                guang.runAction(cc.repeatForever(cc.rotateBy(2, 360)))
                DataMgr.data.Bundle.load("sound/dhhb", cc.AudioClip, (err, res: cc.AudioClip) => {
                    if (err) {
                        return
                    }
                    cc.audioEngine.playEffect(res, false)
                })

                DataMgr.setData(Constants.DATA_DEFINE.EXCHANGE_DATA + this.typeId, null)
                UserSrv.UpdateItem()
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
                        UIMgr.OpenUI("lobby", "component/Base/GameGuidance", { single: true, param: { index: 17, node: btnClose } })
                    }, 1.0)
                }
            }
        })
    }
}
