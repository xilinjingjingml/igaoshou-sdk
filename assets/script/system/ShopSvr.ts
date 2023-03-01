import { Constants } from "../constants"
import { DataMgr } from "../base/DataMgr"
import { Helper } from "./Helper"


const PAY_ORDER = "api/mcbeam-pay-api/payApi/payOrder"
const ALI_PAY = "api/igaoshou-pay-api/payApi/aliPay"
const WECHAT_PAY = "api/igaoshou-pay-api/PayApi/WeChatPay"
const HUAWEI_PAY = "igaoshou-pay-api/PayApi/HuaWeiPay"

export namespace ShopSvr {

    export function initShop(data) {
        if (!data || !data.shop) {
            return
        }

        let cfg = JSON.parse(data.shop)
        if (!cfg) {
            return
        }

        let boxes: TShopBoxes = {}
        let preference: TShopBoxes = {}
        for (let idx in cfg) {
            let b = cfg[idx]
            let box: IShopInfo = {
                boxId: b.box_gid,
                type: b.box_type,
                name: b.name,
                pic: b.image,
                items: [{id: Constants.ITEM_INDEX.DIAMOND, num: 1 * b.price}],
                worth: 1,
                price: b.price
            }

            if (box.type === Constants.SHOP_TYPE.PREFERENCE) {
                box.addition = [{id: Constants.ITEM_INDEX.DIAMOND, num: (b.rate - 100) / 100 * b.price}]
                preference[box.boxId] = box
            } else {
                boxes[box.boxId] = box
            }
            
        }
        
        DataMgr.setData(Constants.DATA_DEFINE.SHOP_BOXES, boxes, true)
        DataMgr.setData(Constants.DATA_DEFINE.PREFERENCE_BOXES, preference, true)
    }

    export function WechatPay(goods: string, store: number) {
        let param = {
            goods_param: goods,
            pay_type : "h5",
            store_id: store,
        }
        Helper.PostHttp(WECHAT_PAY, null, param, (res, event) => {
            if (res) {
                cc.log(res)
                if (res.code !== "00000") {
                    cc.log("wechat code = " + res.code)
                    return
                }

                let weChatParams = JSON.parse(res.weChatParams)
                if (weChatParams && weChatParams.h5_url) {
                    let node = cc.Canvas.instance.node.getChildByName("wechat")
                    if (!node) {
                        node = new cc.Node()
                        node.name = "wechat"
                        cc.Canvas.instance.node.addChild(node,100)
                    }

                    let web = node.getComponent(cc.WebView)
                    if (!web) {
                        web = node.addComponent(cc.WebView)
                    }
                    
                    web.url = weChatParams.h5_url
                }                       
            }
        })
    }

    export function AliPay(goods: string, store: number) {
        let param = {
            goods_param: goods,
            store_id: store,
        }
        Helper.PostHttp(ALI_PAY, null, param, (res, event) => {
            if (res) {
                cc.log(res)
                if (res.code !== "00000") {
                    cc.log("aliPay code = " + res.code)
                    return
                }

                if (res.pay_url) {
                    let node = cc.Canvas.instance.node.getChildByName("alipay")
                    if (!node) {
                        node = new cc.Node()
                        node.name = "alipay"                        
                        cc.Canvas.instance.node.addChild(node)
                    }

                    let web = node.getComponent(cc.WebView)
                    if (!web) {
                        web = node.addComponent(cc.WebView)
                    }
                    
                    web.url = res.pay_url
                }                       
            }
        })
    }

    export function PayOrder(goods: IShopInfo) {
        console.log("PayOrder goods", goods)
        // let pay_url = "https://secure.xsolla.com/paystation3/?access_token="

        // let testPay = false
        // let xsolla = {
        //     merchant_id:223324,
        //     project_id:154645,
        //     mode:"",
        //     country:"US"
        // }

        // //沙盒测试
        // if(testPay){
        //     xsolla.mode = "sandbox"
        //     pay_url = "https://sandbox-secure.xsolla.com/paystation3/?access_token="
        // }

        let param = {
            goods_param : goods.boxId,
            goods_name : goods.name,
            price : goods.price,
            store_id : 0, //0:充值商城，1：积分商城
            notify_url : "igaoshou,igaoshou-shop-srv,Box.SendItem",
            pay_plat : 5,
            // metadata : JSON.stringify(xsolla)
            metadata : {mode:"sandbox"}
        }
        
        console.log("PayOrder param", param)

        Helper.PostHttp(PAY_ORDER, null, param, (res, event) => {
            if (res) {
                cc.log(res)
                if (res.code !== "00000") {
                    cc.log("aliPay code = " + res.code)
                    return
                }

                if(res.payPalLinks){
                    let payPalLinks = JSON.parse(res.payPalLinks)
                    console.log("payPalLinks", payPalLinks)
                    if(payPalLinks.links){
                        for(let v of payPalLinks.links){
                            if(v.rel == "approve" && v.href){
                                Helper.OpenPageUI("component/Base/WebView", "", null, { url: v.href})
                            }
                        }
                    }
                }

                // Helper.OpenPageUI("component/Base/WebView", "", null, { url: pay_url + res.token})
            }
        })
    }
}