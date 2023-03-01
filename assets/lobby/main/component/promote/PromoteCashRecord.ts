import BaseUI from "../../../start/script/base/BaseUI";
import { Helper } from "../../../start/script/system/Helper";
import { Constants } from "../../../start/script/igsConstants";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PromoteCashRecord extends BaseUI {
    _scrollView: cc.Node = null
    _content: cc.Node = null
    _itemPrefab: cc.Node = null
    currentPage = 1
    pageSize = 30
    pageEnd = true  //只显示30条记录
    _totalMoney = 0
    onOpen() {
        console.log("PromoteCashRecord onOpen", this.param)

        this.initButton()
        this.initData()
    }

    onLoad() {
        this._scrollView = cc.find("node/scrollView", this.node)
        this._content = cc.find("node/scrollView/view/content", this.node)
        this._itemPrefab = cc.find("item", this._content)
        this._itemPrefab.active = false

        this.exchangeLogList()

        this.setScrollViewEvent(this._scrollView, (sender, eventType, customEventData) => {
            if (eventType == cc.ScrollView.EventType.BOUNCE_BOTTOM) {
                if (!this.pageEnd) {
                    this.currentPage += 1
                    this.exchangeLogList()
                }
            }
        })
    }

    initEvent() {

    }

    initButton() {
        this.setButtonClick("node/btnOk", this.node, () => {
            this.close()
        })
    }

    initData() {
    }

    //兑换记录
    exchangeLogList() {
        let param = {
            page_code: this.currentPage,
            page_size: this.pageSize
        }
        console.log("exchangeLogList param = ", param)
        Helper.PostHttp("igaoshou-shop-srv/exchange/exchangeLogList", null, param, (res, event) => {
            console.log("exchangeLogList res = ", res)
            if (res && res.code == "0000") {
                if (res.result) {
                    this.setActive(this._scrollView, true)
                    for (let i = 0; i < res.result.length; i++) {
                        let result = res.result[i]
                        if (result.consume_list[0].item_id == Constants.ITEM_INDEX.PROM_REDPACKET) {
                            this.addItem(res.result[i])
                        }
                    }
                    this.setLabelValue("node/sptBgMoney/lblMoney", (this._totalMoney / 100) + "元")
                } else {
                    this.setActive("node/lblNo", true)
                }

                if (!res.result || res.result.length < this.pageSize) {
                    this.pageEnd = true
                }
            }
        })
    }

    addItem(info: any) {
        // if(this.emptyNode.active){
        //     this.emptyNode.active = false
        // }
        let itemNode = cc.instantiate(this._itemPrefab)
        itemNode.active = true
        this._content.addChild(itemNode)

        // let logistics = cc.find("logistics", itemNode)
        // logistics.active = false

        let lblTime = cc.find("lblDate", itemNode)
        lblTime.getComponent(cc.Label).string = Helper.FormatTimeString(info.time * 1000, "yy/MM/dd hh:mm")

        // let lblName = cc.find("info/goods/name", itemNode)
        // lblName.getComponent(cc.Label).string = info.output_list[0].item_name + "*" + info.output_list[0].item_num

        // let icon = cc.find("info/goods/ExchangePriceMode/icon", itemNode)
        // icon.active = true

        this.setSpriteFrame("iconPay", itemNode, "image/promote/feature/weixin")

        this.setRichTextValue("lblMoney", itemNode, "<color=#fc7507>" + (info.output_list[0].item_num / 100) + "</c>元")

        this._totalMoney += info.output_list[0].item_num

        /*info.output_list[0].item_id = info.output_list[0].item_id || 0
        if (info.output_list[0].item_id == Constants.ITEM_INDEX.DIAMOND) {
            this.setActive("info/goods/diamond", itemNode, true)
            // lblName.getComponent(cc.Label).string = info.output_list[0].item_name + "*" + info.output_list[0].item_num/100
        } else if (info.output_list[0].item_id == Constants.ITEM_INDEX.REDPACKET) {
            this.setActive("info/goods/hongbao", itemNode, true)
            // lblName.getComponent(cc.Label).string = info.output_list[0].item_name + "*" + info.output_list[0].item_num/100
        } else if (info.output_list[0].item_id == Constants.ITEM_INDEX.WCOIN) {
            this.setActive("info/goods/wcoin", itemNode, true)
        } else if (info.output_list[0].item_id == Constants.ITEM_INDEX.LOTTERY) {
            this.setActive("info/goods/lottery", itemNode, true)
        } else if (info.output_list[0].item_id == Constants.ITEM_INDEX.LOTTERY) {
            this.setActive("info/goods/lottery", itemNode, true)
        }*/
    }
}
