import BaseUI from "../../../../start/script/base/BaseUI";
import { Helper } from "../../../../start/script/system/Helper";
import { Constants } from "../../../../start/script/igsConstants";
import { UIMgr } from "../../../../start/script/base/UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ExchangeRecordEntry extends BaseUI {
    scrollView: cc.Node = null
    listContent: cc.Node = null
    itemPrefab: cc.Node = null
    emptyNode: cc.Node = null

    currentPage = 1
    pageSize = 30
    pageEnd = true  //只显示30条记录
    onOpen() {
        console.log("ExchangeRecordEntry onOpen", this.param)
    }

    onLoad() {
        this.scrollView = cc.find("scrollView", this.node)
        this.listContent = cc.find("scrollView/view/content/content", this.node)
        this.itemPrefab = cc.find("scrollView/view/content/content/item", this.node)
        this.itemPrefab.active = false

        this.emptyNode = cc.find("scrollView/view/content/content/emptyNode", this.node)
        this.emptyNode.active = false

        this.initButton()
        this.exchangeLogList()

        this.setScrollViewEvent(this.scrollView, (sender, eventType, customEventData) => {
            if (eventType == cc.ScrollView.EventType.BOUNCE_BOTTOM) {
                if (!this.pageEnd) {
                    this.currentPage += 1
                    this.exchangeLogList()
                }
            }
        })
    }

    start() {
        console.log("ExchangeRecordEntry start")
    }


    // update (dt) {}

    initButton() {
        this.setButtonClick("scrollView/view/content/content/emptyNode/btnEmpty", () => {
            console.log("btnEmpty on click")
            UIMgr.OpenUI("lobby", "component/exchange/credits/ExchangeCredits", { single: true })

            this.scheduleOnce(() => {
                this.close()
            }, 1)
        })

        if (Helper.checkExchangeCredits()) {
            this.setActive("scrollView/view/content/content/emptyNode/btnEmpty", false)
        }
    }

    //兑换记录
    exchangeLogList() {
        let param = {
            page_code: this.currentPage,
            page_size: this.pageSize
        }
        console.log("exchangeLogList", param)
        Helper.PostHttp("igaoshou-shop-srv/exchange/exchangeLogList", null, param, (res, event) => {
            console.log("exchangeLogList", res)
            if (res && res.code == "0000") {
                if (res.result) {
                    for (let i = 0; i < res.result.length; i++) {
                        this.addItem(res.result[i])
                    }
                } else {
                    this.emptyNode.active = true
                }

                if (!res.result || res.result.length < this.pageSize) {
                    this.pageEnd = true
                }
            }
        })
    }

    addItem(info: any) {
        if (this.emptyNode.active) {
            this.emptyNode.active = false
        }
        let itemNode = cc.instantiate(this.itemPrefab)
        itemNode.active = true
        this.listContent.addChild(itemNode)

        let logistics = cc.find("logistics", itemNode)
        logistics.active = false

        let lblTime = cc.find("info/time", itemNode)
        lblTime.getComponent(cc.Label).string = Helper.FormatTimeString(info.time * 1000, "yyyy-MM-dd hh:mm:ss")

        let lblName = cc.find("info/goods/name", itemNode)
        lblName.getComponent(cc.Label).string = info.output_list[0].item_name + "*" + info.output_list[0].item_num

        let icon = cc.find("info/goods/ExchangePriceMode/icon", itemNode)
        icon.active = true

        let lblPrice = cc.find("info/goods/ExchangePriceMode/lblPrice", itemNode)
        lblPrice.getComponent(cc.Label).string = info.consume_list[0].item_num

        info.output_list[0].item_id = info.output_list[0].item_id || 0
        if (info.output_list[0].item_id == Constants.ITEM_INDEX.DIAMOND) {
            this.setActive("info/goods/diamond", itemNode, true)
            lblName.getComponent(cc.Label).string = info.output_list[0].item_name + "*" + info.output_list[0].item_num / 100
        } else if (info.output_list[0].item_id == Constants.ITEM_INDEX.REDPACKET) {
            this.setActive("info/goods/hongbao", itemNode, true)
            lblName.getComponent(cc.Label).string = info.output_list[0].item_name + "*" + info.output_list[0].item_num / 100
        } else if (info.output_list[0].item_id == Constants.ITEM_INDEX.WCOIN) {
            this.setActive("info/goods/wcoin", itemNode, true)
        } else if (info.output_list[0].item_id == Constants.ITEM_INDEX.LOTTERY) {
            this.setActive("info/goods/lottery", itemNode, true)
        }
    }
}
