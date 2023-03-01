import BaseUI from "../base/BaseUI";
import { UIMgr } from "../base/UIMgr";
import { Helper } from "../system/Helper";
import { Constants } from "../constants";
import { DataMgr } from "../base/DataMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ExchangeTokenEntry extends BaseUI {
    @property(cc.Prefab)
    goodsPrefab: cc.Prefab = null;

    listContent: cc.Node = null

    confirmNode: cc.Node = null
    btnConfirm: cc.Node = null
    btnOk: cc.Node = null

    exchangeData: any[] = []
    selectExchangeInfo: any = null
    onOpen() {
        console.log("ExchangeTokenEntry onOpen", this.param)
        this.listContent = cc.find("list/view/content/content", this.node)

        //兑换确认框
        this.btnConfirm = cc.find("node/btnConfirm", this.confirmNode)
        this.btnOk = cc.find("node/btnOk", this.confirmNode)

        this.initButton()
        this.getExchangeTemplateInfo()
    }

    onLoad() {
        this.confirmNode = cc.find("confirmNode", this.node)
        this.confirmNode.active = false
    }

    start() {
        console.log("ExchangeTokenEntry start")
    }


    // update (dt) {}

    initButton() {
        this.setButtonClick("btm/btnBuy", () => {
            console.log("btnBuy on click")
            // UIMgr.OpenUI("component/Base/GamePage", {param: {page: "component/Exchange/ExchangeConfirmEntry"}})
        })


        //兑换确认框
        let btnClose = cc.find("node/btnClose", this.confirmNode)
        this.setButtonClick(btnClose, () => {
            console.log("btnClose on click")
            this.confirmNode.active = false
        })

        this.setButtonClick(this.btnConfirm, () => {
            console.log("btnConfirm on click")
            if (this.selectExchangeInfo) {
                this.exchangeInfo(this.selectExchangeInfo)
            }
            this.confirmNode.active = false
        })

        this.setButtonClick(this.btnOk, () => {
            console.log("btnOk on click")
            this.confirmNode.active = false
        })
    }

    //获取商品列表
    getExchangeTemplateInfo() {
        let param = {
        }
        console.log("getExchangeTemplateInfo", param)
        Helper.PostHttp("igaoshou-shop-srv/exchange/exchangeTemplateInfo", null, param, (res, event) => {
            console.log("getExchangeTemplateInfo", res)
            if (res && res.code == "0000") {
                if (res.result) {
                    this.exchangeData = res.result
                    this.initList()
                }
            }
        })
    }

    //兑换
    exchangeInfo(info: any) {
        if (info.consume_list[0].item_num > this.getPlayerLottery()) {
            Helper.OpenTip("奖券不足")
        } else {
            let param = {
                id: info.id
            }
            console.log("exchangeInfo", param)
            Helper.PostHttp("igaoshou-shop-srv/exchange/exchangeInfo", null, param, (res, event) => {
                console.log("exchangeInfo", res)
                if (res && res.code == "0000") {
                    // this.confirmNode.active = true
                    // this.btnConfirm.active = false
                    // this.btnOk.active = true
                    // let lblTitle = cc.find("node/lblTitle", this.confirmNode)
                    // lblTitle.getComponent(cc.Label).string = "恭喜获得"

                    this.confirmNode.active = false
                    UIMgr.OpenUI("component/Shop/GetAwardEntry", { param: { awards: info.output_list}})
                }
            })
        }
    }

    getPlayerLottery() {
        let lottery = 0
        let data = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (data) {
            lottery = data.lottery || 0
            for (let idx in data.items) {
                let i = data.items[idx]
                if (i.id === Constants.ITEM_INDEX.LOTTERY) {
                    lottery += i.num
                }
            }
        }
        return lottery
    }

    initList() {
        for (let i = 0; i < this.exchangeData.length; i++) {
            let info = this.exchangeData[i]
            let itemNode = cc.instantiate(this.goodsPrefab)
            itemNode.active = true
            this.listContent.addChild(itemNode)

            let outputNum = cc.find("goods/num", itemNode)
            if (info.output_list[0].item_id === Constants.ITEM_INDEX.DIAMOND) {
                outputNum.getComponent(cc.Label).string = "x" + Helper.FormatNumPrice(info.output_list[0].item_num / 100)
            } else {
                outputNum.getComponent(cc.Label).string = "x" + Helper.FormatNumWY(info.output_list[0].item_num)
            }

            let consumeNum = cc.find("btnBuy/Background/price/num", itemNode)
            consumeNum.getComponent(cc.Label).string = Helper.FormatNumWY(info.consume_list[0].item_num)

            info.output_list[0].item_id = info.output_list[0].item_id ? info.output_list[0].item_id : Constants.ITEM_INDEX.WCOIN
            if (info.output_list[0].item_id == Constants.ITEM_INDEX.DIAMOND) {
                let outputIcon = cc.find("goods/icon", itemNode)
                this.setSpriteFrame(outputIcon, "image/exchange/DHYXB-zuanshi")
            }

            let btnBuy = cc.find("btnBuy", itemNode)
            this.setButtonClick(btnBuy, (sender, data) => {
                console.log("btnBuy on click")
                this.selectExchangeInfo = info

                this.confirmNode.active = true
                this.btnConfirm.active = true
                this.btnOk.active = false

                let lblTitle = cc.find("node/lblTitle", this.confirmNode)
                lblTitle.getComponent(cc.Label).string = "兑换"

                let lblNum = cc.find("node/lblNum", this.confirmNode)
                if (info.output_list[0].item_id === Constants.ITEM_INDEX.DIAMOND) {
                    lblNum.getComponent(cc.Label).string = "x" + Helper.FormatNumPrice(info.output_list[0].item_num / 100)
                } else {
                    lblNum.getComponent(cc.Label).string = "x" + Helper.FormatNumWY(info.output_list[0].item_num)
                }

                let priceNum = cc.find("node/btnConfirm/Background/priceNode/num", this.confirmNode)
                priceNum.getComponent(cc.Label).string = Helper.FormatNumWY(info.consume_list[0].item_num)//this.calcPrice(info.consume_list[0].item_num)

                if (info.output_list[0].item_id == Constants.ITEM_INDEX.WCOIN) {
                    let icon = cc.find("node/icon", this.confirmNode)
                    this.setSpriteFrame(icon, "image/exchange/DHYXB-weibi", false)
                } else if (info.output_list[0].item_id == Constants.ITEM_INDEX.DIAMOND) {
                    let icon = cc.find("node/icon", this.confirmNode)
                    this.setSpriteFrame(icon, "image/exchange/DHYXB-zuanshi", false)
                }


            })
        }
    }

    calcPrice(pri: number) {
        if (pri >= Math.pow(10, 4)) {
            let text = ""
            let company = ""
            if (pri >= Math.pow(10, 8)) {
                text = (pri / Math.pow(10, 8)).toString()
                company = "亿"
            } else if (pri >= Math.pow(10, 4)) {
                text = (pri / Math.pow(10, 4)).toString()
                company = "万"
            }
            text = text.substr(0, 5)
            if (text[text.length - 1] == '.') {
                text = text.substr(0, text.length - 1)
            }
            return text + company
        }
        return pri.toString()
    }
}
