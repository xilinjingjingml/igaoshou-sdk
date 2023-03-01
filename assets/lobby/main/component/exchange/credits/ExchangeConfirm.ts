import BaseUI from "../../../../start/script/base/BaseUI";
import { Constants } from "../../../../start/script/igsConstants";
import { Helper } from "../../../../start/script/system/Helper";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import ExchangePriceMode from "./ExchangePriceMode";
import { ExchangeSrv } from "../../../../start/script/system/ExchangeSrv";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import AddressMode from "../../address/AddressMode";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ExchangeConfirm extends BaseUI {
    addressNode: cc.Node = null
    addressMode: cc.Node = null
    goodsContent: cc.Node = null
    goodsPrefab: cc.Node = null

    cardNode: cc.Node = null
    phoneNode: cc.Node = null
    phoneTipNode: cc.Node = null
    cardTipNode: cc.Node = null
    insufficientTip: cc.Node = null

    addressInfo: any = null

    payLottery = 0  //需要支付的奖券
    payValue = 0   //需要支付的金额
    onOpen() {
        console.log("ExchangeConfirmEntry onOpen", this.param)

        this.initButton()
        // this.initGoodsList()

        //立刻购买
        if (this.param && this.param.goodsDetail) {
            let goodsInfo = {
                goods_name: this.param.goodsDetail.product_name,
                goods_num: 1,
                add_pris: {
                    pri: this.param.goodsDetail.pris[0].pri
                },
                goods_images: this.param.goodsDetail.product_images,
            }

            let pri = null
            if (this.param.curPrisGid) {
                pri = this.getCartInfoPris(this.param.goodsDetail, this.param.curPrisGid)
            }

            if (pri) {
                goodsInfo.add_pris = {
                    pri: pri
                }
            } else {
                pri = this.param.goodsDetail.pris[0].pri
            }

            this.addGoodsList(goodsInfo)

            this.setTotalPrice(pri)

            if (this.param.goodsDetail.type_id == Constants.EXCHANGE_GOODS_TYPE.CARD || this.param.goodsDetail.type_id == Constants.EXCHANGE_GOODS_TYPE.PHONE) {
                this.addressNode.active = false
                this.phoneNode.active = true
                this.cardTipNode.active = true
                if (this.param.goodsDetail.product_id == 38104) {
                    this.cardNode.active = true
                }

                if (this.param.goodsDetail.type_id == Constants.EXCHANGE_GOODS_TYPE.PHONE) {
                    this.phoneTipNode.active = true
                    this.cardTipNode.active = false
                } else {
                    let name = cc.find("name", this.phoneNode)
                    name.getComponent(cc.Label).string = "接受手机"
                }
            }

            if (this.param.goodsDetail.product_id < 0) {//仅展示商品
                if (this.payLottery > this.getPlayerLottery()) {
                } else {
                    let btnConfirm = cc.find("btm/btnConfirm", this.node)
                    btnConfirm.getComponent(cc.Button).interactable = false
                    this.insufficientTip.active = true
                    this.setLabelValue("name", this.insufficientTip, "库存不足")
                }
            }
        } else {
            this.getCartList()
        }

        this.updateAddressList()
        EventMgr.on(Constants.EVENT_DEFINE.ADDRESS_SELECT, this.setAddressInfo.bind(this))
        EventMgr.on(Constants.EVENT_DEFINE.ADDRESS_LIST_UPDATE, this.updateAddressList.bind(this))
    }

    onLoad() {
        this.addressNode = cc.find("bodyScrollView/view/content/content/addressNode", this.node)
        this.addressMode = cc.find("AddressMode", this.addressNode)
        this.goodsContent = cc.find("bodyScrollView/view/content/content/goodsList", this.node)
        this.goodsPrefab = cc.find("goods", this.goodsContent)
        this.goodsPrefab.active = false

        this.cardNode = cc.find("bodyScrollView/view/content/content/cardNode", this.node)
        this.phoneNode = cc.find("bodyScrollView/view/content/content/phoneNode", this.node)
        this.phoneTipNode = cc.find("bodyScrollView/view/content/content/phoneTipNode", this.node)
        this.cardTipNode = cc.find("bodyScrollView/view/content/content/cardTipNode", this.node)
        this.insufficientTip = cc.find("btm/btnConfirm/tip", this.node)
        this.cardNode.active = false
        this.phoneNode.active = false
        this.phoneTipNode.active = false
        this.cardTipNode.active = false
        this.insufficientTip.active = false
    }

    start() {
        console.log("ExchangeConfirmEntry start")
    }


    // update (dt) {}

    initButton() {
        this.setButtonClick("btm/btnConfirm", () => {
            console.log("btnConfirm on click")
            let cardEditBox = cc.find("EditBox", this.cardNode)
            let phoneEditBox = cc.find("EditBox", this.phoneNode)
            if (this.phoneNode.active == true && phoneEditBox.getComponent(cc.EditBox).string == "") {
                Helper.OpenTip("请输入完整的手机号码")
            } else if (this.cardNode.active == true && cardEditBox.getComponent(cc.EditBox).string == "") {
                Helper.OpenTip("请输入加油卡卡号")
            } else {
                //立刻购买
                if (this.param && this.param.goodsDetail) {
                    if (this.param.goodsDetail.type_id != Constants.EXCHANGE_GOODS_TYPE.CARD && this.param.goodsDetail.type_id != Constants.EXCHANGE_GOODS_TYPE.PHONE) {
                        if (this.addressInfo == null) {
                            Helper.OpenTip("请输入收货地址")
                            return
                        }
                    }
                } else if (this.addressInfo == null) {
                    Helper.OpenTip("请输入收货地址")
                    return
                }

                this.rearrangeOrder()
            }
        })
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

    setTotalPrice(pri) {
        let priceMode = cc.find("bodyScrollView/view/content/content/pay/payNode/Layout/ExchangePriceMode", this.node)
        priceMode.getComponent(ExchangePriceMode).setPri(pri)

        let totalPriceMode = cc.find("btm/pay/ExchangePriceMode", this.node)
        totalPriceMode.getComponent(ExchangePriceMode).setPri(pri)

        if (pri.length > 0) {
            let pris_string = ""
            for (let v of pri) {
                if (Constants.EXCHANGE_PRI_TYPE.TICKET == v.pri_type) {//奖券
                    this.payLottery += v.pri_value
                } else {
                    this.payValue += v.pri_value
                }
            }
        }

        if (this.payLottery > this.getPlayerLottery()) {
            let btnConfirm = cc.find("btm/btnConfirm", this.node)
            btnConfirm.getComponent(cc.Button).interactable = false
            this.insufficientTip.active = true
        }
    }

    //根据玩家加入购物车的价格组合ID，获取最新的价格
    getCartInfoPris(cartInfo: any, prisGid: string) {
        for (let i = 0; i < cartInfo.pris.length; i++) {
            if (cartInfo.pris[i].pris_gid == prisGid) {
                return cartInfo.pris[i].pri
            }
        }
        return null
    }

    getCartList() {
        ExchangeSrv.getCartList(null, (res) => {
            if (res && res.cart_list && res.cart_list.length > 0) {
                for (let i = 0; i < res.cart_list.length; i++) {
                    if (res.cart_list[i].checked == 1) {
                        this.addGoodsList(res.cart_list[i])
                    }
                }
            }

            if (res && res.settle_info && res.settle_info.total) {
                this.setTotalPrice(res.settle_info.total)
            }
        })
    }

    //重整订单
    rearrangeOrder() {
        let param = {
            goods_gid: "",
            goods_num: 0,
            pris_gid: "",
            address_gid: ""
        }
        if (this.param && this.param.goodsDetail) {
            param.goods_gid = this.param.goodsDetail.goods_gid
            param.goods_num = 1
            param.pris_gid = this.param.curPrisGid
        }

        if (this.addressInfo) {
            param.address_gid = this.addressInfo.address_gid
        }

        console.log("rearrangeOrder", param)
        Helper.PostHttp("igaoshou-shop-srv/goods/rearrangeOrder", null, param, (res, event) => {
            console.log("rearrangeOrder", res)
            if (res && res.code == "00000") {
                this.submitOrder()
            }
        })
    }

    //提交订单
    submitOrder() {
        let param = {
            goods_gid: "",
            goods_num: 0,
            pris_gid: "",
            address_gid: "",
            tel: "",
            card_no: ""
        }
        if (this.param && this.param.goodsDetail) {
            param.goods_gid = this.param.goodsDetail.goods_gid
            param.goods_num = 1
            param.pris_gid = this.param.curPrisGid
        }
        if (this.addressInfo) {
            param.address_gid = this.addressInfo.address_gid
        }

        let cardEditBox = cc.find("EditBox", this.cardNode)
        param.card_no = cardEditBox.getComponent(cc.EditBox).string
        let phoneEditBox = cc.find("EditBox", this.phoneNode)
        param.tel = phoneEditBox.getComponent(cc.EditBox).string

        if (param.tel.length > 0 && !Helper.checkPhoneNum(param.tel)) {
            Helper.OpenTip("请填写正确的手机号码")
            return
        }

        console.log("submitOrder", param)
        Helper.PostHttp("igaoshou-shop-srv/goods/submitOrder", null, param, (res, event) => {
            console.log("submitOrder", res)
            if (res && res.code == "00000") {
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_CART)
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_BILL)
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SUBMIT_ORDER_SUCCESS)
                if (res.order_no) {
                    if (this.payValue > 0) {
                        Helper.OpenPageUI("component/Cashier/CashierEntry", "收银台", null, { orderNo: res.order_no })
                    } else {
                        Helper.OpenPageUI("component/Exchange/ExchangeBill", "我的订单", null, {})
                        Helper.OpenTip("下单成功")
                    }
                    this.close()
                }
            }
        })
    }

    updateAddressList() {
        let addressInfo = null
        let addressList: any[] = DataMgr.getData(Constants.DATA_DEFINE.ADDRESS_DATA)
        if (addressList && addressList.length > 0) {
            if (this.param && this.param.goodsDetail) {
                for (let i = 0; i < addressList.length; i++) {
                    if (addressList[i].address_gid == this.param.addressGid) {
                        addressInfo = addressList[i]
                        break
                    }
                }
            } else {
                for (let i = 0; i < addressList.length; i++) {
                    if (addressList[i].is_default == 1) {
                        addressInfo = addressList[i]
                        break
                    }
                }
            }

            if (!addressInfo) {
                addressInfo = addressList[0]
            }
        }

        this.setAddressInfo(addressInfo)
    }

    setAddressInfo(addressInfo: any) {
        this.addressInfo = addressInfo
        console.log("setAddressInfo", addressInfo)
        let infoNode = cc.find("infoNode", this.addressMode)
        let noAddress = cc.find("noAddress", this.addressMode)
        if (addressInfo) {
            infoNode.active = true
            noAddress.active = false

            this.addressMode.getComponent(AddressMode).setData(addressInfo)

            let btnEdit = cc.find("infoNode/btnEdit", this.addressMode)
            btnEdit.active = false

            let btnChange = cc.find("infoNode/btnChange", this.addressMode)
            btnChange.active = true
        } else {
            infoNode.active = false
            noAddress.active = true
        }
    }

    addGoodsList(goodsInfo: any) {
        let itemNode = cc.instantiate(this.goodsPrefab)
        itemNode.active = true
        this.goodsContent.addChild(itemNode)

        let lblName = cc.find("name", itemNode)
        lblName.getComponent(cc.Label).string = goodsInfo.goods_name.length > 10 ? goodsInfo.goods_name.substr(0, 9) + "..." : goodsInfo.goods_name

        let lblNum = cc.find("num", itemNode)
        lblNum.getComponent(cc.Label).string = goodsInfo.goods_num + "件"

        let priceMode = cc.find("ExchangePriceMode", itemNode)
        priceMode.getComponent(ExchangePriceMode).setPri(goodsInfo.add_pris.pri)

        let icon = cc.find("mask/icon", itemNode)
        this.setSpriteFrame(icon, goodsInfo.goods_images)
    }
}
