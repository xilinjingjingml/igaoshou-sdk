import { Constants } from "../igsConstants"
import { DataMgr } from "../base/DataMgr"
import { Helper } from "./Helper"
import { WxProxyWrapper } from "../pulgin/WxProxyWrapper"
import { User } from "../data/User"
import { MemberSrv } from "./MemberSrv"
import { EventMgr } from "../base/EventMgr"

const ALI_PAY = "api/igaoshou-pay-api/payApi/aliPay"
const WECHAT_PAY = "api/igaoshou-pay-api/PayApi/WeChatPay"
const HUAWEI_PAY = "igaoshou-pay-api/PayApi/HuaWeiPay"

const GET_BOX_LIST = "igaoshou-shop-srv/Box/BoxList"

const PAY_ORDER = "api/mcbeam-pay-api/payApi/payOrder"
const GET_PAY_ORDER = "mcbeam-pay-srv/pay/queryOrder"

export namespace ShopSvr {
    export function initShop() {
        getBoxList((res) => {
            console.log("===initshop===")
            console.log(res)
            if (res) {
                fillData(res)
            }
        })
    }

    export function getBoxList(callback?: Function) {
        let param = {
            plat_aid: DataMgr.data.Config.platId,
        }

        Helper.PostHttp(GET_BOX_LIST, null, param, (res, event) => {
            if (res && res.code == "00000") {
                res.vip_card && MemberSrv.updateMemberInfo(res.vip_card)
                callback?.(res)
            }
            callback?.(null)
        })
    }

    export function fillData(data) {
        if (!data/* || !data.shop*/) {
            return
        }

        // let cfg = Helper.ParseJson(data.shop, "initShop")
        // if (!cfg) {
        //     return
        // }
        let cfg = data.box_list

        let boxid = DataMgr.getData(Constants.DATA_DEFINE.PREFERENCE_BOX_RANDOM)

        let boxes: TShopBoxes = {}
        // let preference: TShopBoxes = {}
        // let firstPay: TShopBoxes = {}
        // let member: TShopBoxes = {}
        let random: string[] = []
        for (let idx in cfg) {
            let b = cfg[idx]
            let box: IShopInfo = {
                boxId: b.box_gid,
                type: b.box_type || Constants.SHOP_TYPE.NORMAL,
                name: b.name,
                pic: b.image,
                items: [],
                worth: 1,
                price: b.price,
                rate: b.rate || 100,

                daysNum: b.days_num,
                // isBuy: false,
            }

            for (let i in b.box_item) {
                box.items[b.box_item[i].item_id] = {
                    id: b.box_item[i].item_id,
                    num: b.box_item[i].item_num,
                }
            }

            if (box.type === Constants.SHOP_TYPE.PREFERENCE) {
                box.addition = [{ id: Constants.ITEM_INDEX.GOLD, num: (b.rate - 100) / 100 * b.price }]
                random.push(box.boxId)
                DataMgr.setData(Constants.DATA_DEFINE.LIMIT_BUY, data.limit_buy === 1)
            } else if (box.type === Constants.SHOP_TYPE.FIRST_PAY) {
                DataMgr.setData(Constants.DATA_DEFINE.FIRST_BUY, data.first_buy === 1)
            }
            boxes[box.type] = boxes[box.type] || {}
            boxes[box.type][box.boxId] = box

            // if (box.type === Constants.SHOP_TYPE.PREFERENCE) {
            //     box.addition = [{ id: Constants.ITEM_INDEX.GOLD, num: (b.rate - 100) / 100 * b.price }]
            //     preference[box.boxId] = box
            //     random.push(box.boxId)
            // } else if (box.type === Constants.SHOP_TYPE.MONTH_CARD) {
            //     member[box.boxId] = box
            // } else if (box.type === Constants.SHOP_TYPE.FIRST_PAY) {
            //     // box.isBuy = true//data.firstPay === 1
            //     DataMgr.setData(Constants.DATA_DEFINE.FIRST_PAY_BOX_ISBUY, true)
            //     firstPay[box.boxId] = box
            // } else if (box.type === Constants.SHOP_TYPE.NORMAL) {
            //     boxes[box.boxId] = box
            // }
        }

        if (random.length > 0) {
            let idx = Math.floor(Math.random() * 100 % random.length)
            DataMgr.setData(Constants.DATA_DEFINE.PREFERENCE_BOX_RANDOM, { id: random[idx], time: Date.now() + 86400 * 1000 })
        }

        DataMgr.setData(Constants.DATA_DEFINE.SHOP_BOXES, boxes, true)
        // DataMgr.setData(Constants.DATA_DEFINE.PREFERENCE_BOXES, preference, true)
        // DataMgr.setData(Constants.DATA_DEFINE.FIRST_PAY_BOX, firstPay, true)
        // DataMgr.setData(Constants.DATA_DEFINE.MEMBER_CARD, member, true)
    }

    function payOrder(payInfo: any, callback?: Function) {
        Helper.PostHttp(PAY_ORDER, null, payInfo, (res) => {
            callback?.(res)
        })
    }

    export function Pay(box: IShopInfo, callback?: Function) {
        let param: any = {
            goods_param: box.boxId,
            goods_name: box.name,
            goods_pic: box.pic,
            box_type: box.type,
            price: box.price,
            store_id: 0,
            notify_url: 'igaoshou,igaoshou-shop-srv,Box.SendItem',
            metadata: { "openid": User.WxOpenId }
        }
        console.log("payInfo")
        console.log(JSON.stringify(param))
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (cc.sys.os === cc.sys.OS_IOS) {
                console.log("===wechat game ios")
                DataMgr.setData(Constants.DATA_DEFINE.LAST_PAY_GOODS, box.boxId)
                param.pay_plat = 2
                param.metadata.env = 0
                WxProxyWrapper.payOrderByCustome(param)
            } else if (cc.sys.os === cc.sys.OS_ANDROID) {
                console.log("===wechat game android")
                param.pay_plat = 7
                param.metadata.env = 0
                payOrder(param, (res) => {
                    if (res && res.errcode === 0) {
                        if (res.bill_no) {
                            callback?.({ code: 0, msg: "" })
                        } else {
                            // 客户端调米大师支付
                            WxProxyWrapper.requestMidasPayment(param, res.offerId)
                                .then(() => {
                                    payOrder(param, (res1) => {
                                        if (res?.bill_no) {
                                            callback?.({ code: 0, msg: "" })
                                        } else {
                                            callback?.({ code: res1.Code, msg: res.Detail })
                                        }
                                    })
                                })
                                .catch((code) => {
                                    callback?.({ code: code, msg: "支付失败" })
                                })
                        }
                    } else {
                        callback?.({ code: res.Code, msg: res.Detail })
                    }
                })
            }
        } else if (cc.sys.isNative || cc.sys.isBrowser) {
            EventMgr.offByTag("SHOP_SVR_ALIPAY")
            EventMgr.once("aliPay", (msg) => {
                if (msg.pay_url) {
                    if (cc.sys.isBrowser) {
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

                        web["web_handler"] = (webview, eventType, customEventData) => {
                            console.log("webview eventType = " + eventType)
                        }

                        let event = new cc.Component.EventHandler()
                        event.target = node,
                            event.component = "cc.WebView",
                            event.handler = "web_handler"
                        web["webviewEvents"].push(event)

                        web.url = msg.pay_url
                    } else {
                        cc.sys.openURL(msg.pay_url)
                    }
                }
            }, "SHOP_SVR_ALIPAY")

            console.log("===native pay")
            param.pay_plat = box.payType || 1
            param.metadata.pay_type = "app"
            payOrder(param, (res) => {
                console.log("===payOrder===")
                console.log(JSON.stringify(res))
                if (res.pay_url) {
                    cc.director.once(cc.Director.EVENT_AFTER_UPDATE, () => {
                        EventMgr.dispatchEvent("aliPay", { pay_url: res?.pay_url })
                    })
                }
            })
        }
    }

    export function WechatPay(box: IShopInfo, callback?: Function) {
        if (!User.WxOpenId) {
            callback?.(false)
        }
        let param = {}

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // WxProxyWrapper.payOrder(param, (res) => {
            //     console.log("payOrder----", res)
            //     if (res.code === 0) {
            //         getBoxList(() => {
            //             callback?.(true)
            //         })
            //     } else if (res.code === 1) {
            //         callback?.(true)
            //     } else {
            //         Helper.OpenTip(res.msg)
            //         callback?.(false)
            //     }
            // })
        } else if (cc.sys.os === cc.sys.OS_IOS) {
            if ((cc.sys.platform === cc.sys.WECHAT_GAME || cc.sys.platform === cc.sys.WECHAT_GAME_SUB) &&
                (undefined === DataMgr.data.OnlineParam.shop_rounds || DataMgr.data.OnlineParam.shop_rounds > User.PlayGame)) {
                return
            }
            WxProxyWrapper.payOrderByCustome(param, (res) => {
                console.log("payOrderByCustome----", res)
                // if (res.code === 0) {
                //     getBoxList(() => {
                //         callback?.(true)
                //     })
                // } else if (res.code === 1) {
                //     callback?.(true)
                // } else {
                //     // Helper.OpenTip(res.msg)
                callback?.(false)
                // }
            })
        }

    }

    export function AliPay(goods: string, store: number) {
        EventMgr.offByTag("SHOP_SVR_ALIPAY")
        EventMgr.once("aliPay", (msg) => {
            if (msg.pay_url) {
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

                web.url = msg.pay_url
            }
        }, "SHOP_SVR_ALIPAY")

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

                cc.director.on(cc.Director.EVENT_AFTER_UPDATE, () => {
                    EventMgr.dispatchEvent("aliPay", { pay_url: res?.pay_url })
                })

                // if (res.pay_url) {
                //     let node = cc.Canvas.instance.node.getChildByName("alipay")
                //     if (!node) {
                //         node = new cc.Node()
                //         node.name = "alipay"
                //         cc.Canvas.instance.node.addChild(node)
                //     }

                //     let web = node.getComponent(cc.WebView)
                //     if (!web) {
                //         web = node.addComponent(cc.WebView)
                //     }

                //     web.url = res.pay_url
                // }
            }
        })
    }

    export function getPayOrder(callback?: Function) {
        Helper.PostHttp(GET_PAY_ORDER, null, {}, (res, event) => {
            if (res) {
                console.log(res)
                callback?.(res)
            }
        })

    }

    export function getBoxById(boxId: string) {
        let boxes = DataMgr.getData<TShopBoxes>(Constants.DATA_DEFINE.SHOP_BOXES)
        for (let i in boxes) {
            for (let j in boxes[i]) {
                if (boxes[i][j].boxId === boxId) {
                    let box = boxes[i][j]
                    return box
                }
            }
        }

        return null
    }
}

EventMgr.once(Constants.EVENT_DEFINE.LOGIN_SUCCESS, ShopSvr.initShop)