import BaseUI from "../../../start/script/base/BaseUI";
import { ShopSvr } from "../../../start/script/system/ShopSvr";
import { Helper } from "../../../start/script/system/Helper";
import { Constants } from "../../../start/script/igsConstants";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CashierEntry extends BaseUI {
    payTypeContent: cc.Node = null
    payTypePrefab: cc.Node = null

    payTypeData: any[] = [
        {
            type: 1,
            name: "微信支付",
            icon: "component/cashier/image/weixin"
        },
        {
            type: 2,
            name: "支付宝",
            icon: "component/cashier/image/zhifubao"
        }
    ]

    curPayType: any = this.payTypeData[0]
    payValue: number = 0

    orderDetail: any = null
    onOpen() {
        console.log("CashierEntry onOpen")
        this.payTypeContent = cc.find("body/PayType", this.node)
        this.payTypePrefab = cc.find("item", this.payTypeContent)
        this.payTypePrefab.active = false

        this.initButton()
        this.initPayType()

        if (this.param && this.param.orderNo) {
            this.getOrderDetail()
        }
    }

    start() {
        console.log("CashierEntry start")
    }


    // update (dt) {}


    initButton() {
        let btnConfirm = cc.find("btm/btnConfirm", this.node)
        this.setButtonClick(btnConfirm, () => {
            console.log("btnConfirm on click", this.curPayType)
            if (this.curPayType.type == this.payTypeData[0].type) {
                console.log("ShopSvr.WechatPay")
                // ShopSvr.WechatPay(this.param.orderNo, 1)
            }
            if (this.curPayType.type == this.payTypeData[1].type) {
                console.log("ShopSvr.AliPay")
                // ShopSvr.AliPay(this.param.orderNo, 1)
            }

        })
    }

    initPayType() {
        for (let i = 0; i < this.payTypeData.length; i++) {
            let info = this.payTypeData[i]
            let itemNode = cc.instantiate(this.payTypePrefab)
            itemNode.active = true
            this.payTypeContent.addChild(itemNode)

            let name = cc.find("name", itemNode)
            name.getComponent(cc.Label).string = info.name

            let icon = cc.find("icon", itemNode)
            this.setSpriteFrame(icon, info.icon)

            if (i == this.payTypeData.length - 1) {
                let line = cc.find("line", itemNode)
                line.active = false
            }

            this.setToggleClick(itemNode, () => {
                console.log("itemNode on click")
                this.curPayType = info
            })

            if (i == 0) {
                this.curPayType = info
                itemNode.getComponent(cc.Toggle).isChecked = true
            }
        }
    }

    updateTime() {
        let lblTime = cc.find("body/Price/lblTime", this.node)
        let remaining: number = this.orderDetail.end_time - Date.now() / 1000
        if (remaining > 0) {
            let h = Math.floor(remaining / (60 * 60) % 24)
            let m = Math.floor(remaining / (60) % 60)
            let s = Math.floor(remaining % 60)
            lblTime.getComponent(cc.Label).string = "剩余 " + this.prefixInteger(h, 2) + ":" + this.prefixInteger(m, 2) + ":" + this.prefixInteger(s, 2) + "  待支付"
        } else {
            let btnConfirm = cc.find("btm/btnConfirm", this.node)
            btnConfirm.getComponent(cc.Button).interactable = false
        }
    }

    prefixInteger(num, m) {
        return (Array(m).join("0") + num).slice(-m);
    }

    //获取订单详情
    getOrderDetail() {
        let param = {
            order_no: this.param.orderNo
        }
        console.log("getOrderDetail", param)
        Helper.PostHttp("igaoshou-shop-srv/goods/orderDetail", null, param, (res, event) => {
            console.log("getOrderDetail", res)
            if (res && res.code == "00000") {
                if (this.orderDetail == null) {
                    this.orderDetail = res
                    for (let v of res.pris.pri) {
                        v.pri_type = v.pri_type ? v.pri_type : 0
                        if (Constants.EXCHANGE_PRI_TYPE.TICKET != v.pri_type) {//奖券                        
                            this.payValue += v.pri_value
                        }
                    }

                    if (this.payValue > 0) {
                        let lblPrice = cc.find("body/Price/Node/lblPrice", this.node)
                        lblPrice.getComponent(cc.Label).string = (this.payValue / 100).toString()
                    }

                    this.schedule(this.updateTime.bind(this), 1)
                    this.updateTime()
                }

                res.order_state = res.order_state ? res.order_state : 0
                if (res.order_state != 0) {
                    if (this.param && this.param.callback) {
                        this.param.callback(1)
                    }
                    this.close()

                    //0：待付款 1：待收货 2：已完成 3：取消  -1：删除
                    if (res.order_state == 1 || res.order_state == 2) {
                        Helper.OpenTip("下单成功")
                    } else if (res.order_state == 3) {
                        Helper.OpenTip("订单已取消")
                    } else if (res.order_state == -1) {
                        Helper.OpenTip("订单已删除")
                    }
                    return
                }
            }

            this.scheduleOnce(this.getOrderDetail.bind(this), 10)
        })
    }
}
