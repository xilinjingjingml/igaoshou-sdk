import BaseUI from "../../../../start/script/base/BaseUI";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { ExchangeSrv } from "../../../../start/script/system/ExchangeSrv";
import { Helper } from "../../../../start/script/system/Helper";
import { UIMgr } from "../../../../start/script/base/UIMgr";
import ExchangePriceMix from "./ExchangePriceMix";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ExchangeSubstance extends BaseUI {
    //无货提示
    noStock: cc.Node = null

    //颜色数量选择
    selectColor: cc.Node = null
    selectColorNode: cc.Node = null
    goodsNum: number = 1

    //选择收货地址
    selectAddress: cc.Node = null
    selectAddressNode: cc.Node = null
    noAddress: cc.Node = null
    address: cc.Node = null
    addressList: cc.Node = null
    addressPrefab: cc.Node = null

    btnPutCart: cc.Node = null
    btnBuy: cc.Node = null

    cartNum: cc.Node = null

    cartGoodsNum = 0

    curPrisGid: string = "" //选择的价格组合ID
    goodsInfo: any = null
    prisGid: string = ""
    goodsDetail: any = null

    defaultAddressInfo = null
    selectAddressInfo = null

    onOpen() {
        console.log("ExchangeSubstanceEntry", this.param)
        this.goodsInfo = this.param.goodsInfo
        this.prisGid = this.param.pris_gid
        this.noStock = cc.find("btm/noStock", this.node)

        this.selectColor = cc.find("selectColor", this.node)
        this.selectColorNode = cc.find("selectColor/node", this.node)

        this.selectAddress = cc.find("selectAddress", this.node)
        this.selectAddressNode = cc.find("selectAddress/node", this.node)
        this.noAddress = cc.find("selectAddress/node/noAddress", this.node)
        this.address = cc.find("selectAddress/node/address", this.node)
        this.addressList = cc.find("selectAddress/node/address/list", this.node)
        this.addressPrefab = cc.find("selectAddress/node/address/list/toggle", this.node)
        this.addressPrefab.active = false

        this.btnPutCart = cc.find("btm/btnPutCart", this.node)
        this.btnBuy = cc.find("btm/btnBuy", this.node)
        this.cartNum = cc.find("btm/btnCart/cartNum", this.node)
        this.cartNum.active = false

        this.initButton()

        this.noStock.active = false
        this.noAddress.active = true
        this.address.active = false

        this.getGoodsDetailRsp()
        this.getCartList()

        let addressList: any[] = DataMgr.getData(Constants.DATA_DEFINE.ADDRESS_DATA)
        addressList = addressList ? addressList : []
        if (addressList.length > 0) {
            this.defaultAddressInfo = addressList[0]
        }
        for (let i = 0; i < addressList.length; i++) {
            if (addressList[i].is_default == 1) {
                this.defaultAddressInfo = addressList[i]
            }
        }
        this.setDefaultAddress(this.defaultAddressInfo)


        EventMgr.on(Constants.EVENT_DEFINE.ADDRESS_LIST_UPDATE, this.initAddressList.bind(this))
        EventMgr.on(Constants.EVENT_DEFINE.SUBMIT_ORDER_SUCCESS, (args) => {
            this.close()
        })
    }

    onLoad() {
        let topPageView = cc.find("body/view/content/picsPage", this.node)
        let pageView = topPageView.getComponent(cc.PageView)

        let page = cc.find("view/content/page", topPageView)
        page.active = false

        let goodsInfo = DataMgr.getData("ExchangeSubstanceEntryGoodsInfo")
        if (goodsInfo) {
            this.initGoodsInfo(goodsInfo)
        }
    }

    start() {
        console.log("ExchangeSubstanceEntry start")
    }

    getCartList() {
        ExchangeSrv.getCartList(null, (res) => {
            if (res && res.cart_list && res.cart_list.length > 0) {
                let totalNum = 0
                for (let v of res.cart_list) {
                    totalNum += v.goods_num
                    if (this.goodsInfo.goods_gid == v.goods_gid) {
                        this.cartGoodsNum = v.goods_num
                    }
                }
                this.cartNum.active = true
                let num = cc.find("num", this.cartNum)
                num.getComponent(cc.Label).string = totalNum.toString()
            }
        })
    }

    getGoodsDetailRsp() {
        let dataInfo = DataMgr.getData("goodsDetail" + this.goodsInfo.goods_gid)
        if (dataInfo) {
            this.goodsDetail = dataInfo
            this.setGoodsDetail()
        } else {
            let param = {
                goods_gid: this.goodsInfo.goods_gid,
                // pris_gid: this.prisGid
            }
            console.log("getGoodsDetailRsp", param)
            Helper.PostHttp("igaoshou-shop-srv/goods/goodsDetail", null, param, (res, event) => {
                console.log("goodsDetail", res)
                if (res) {
                    this.goodsDetail = res
                    this.setGoodsDetail()
                    DataMgr.setData("goodsDetail" + this.goodsInfo.goods_gid, res)
                }
            })
        }
    }

    cartAdd() {
        let param = {
            goods_gid: this.goodsInfo.goods_gid,
            goods_num: this.cartGoodsNum + this.goodsNum,
            pris_gid: this.curPrisGid
        }
        console.log("cartAdd", param)
        Helper.PostHttp("igaoshou-shop-srv/goods/cartAdd", null, param, (res, event) => {
            console.log("cartAdd res", res)
            if (res && res.code == "00000") {
                this.startAddAni()
                this.getCartList()
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_CART)
            }
        })
    }

    // update (dt) {}

    initButton() {
        //购物车
        let btnCart = cc.find("btm/btnCart", this.node)
        this.setButtonClick(btnCart, () => {
            console.log("btnPutCart on click")
            Helper.OpenPageUI("component/exchange/credits/exchangeCart", "", null)
            // UIMgr.OpenUI("lobby", "component/Base/gamePage",
            //     {
            //         enterAni: Constants.PAGE_ANI.LEFT_IN, leaveAni: Constants.PAGE_ANI.LEFT_OUT,
            //         param: { page: "component/Exchange/ExchangeCart", title: "" }
            //     })
        })

        //加入购物车
        let btnPutCart = cc.find("btm/btnPutCart", this.node)
        this.setButtonClick(btnPutCart, () => {
            console.log("btnPutCart on click")

            this.selectColor.x = 0
            this.selectColorNode.y = -this.selectColor.height / 2 - this.selectColorNode.height
            cc.tween(this.selectColorNode)
                .to(0.2, { position: cc.v3(0, -this.selectColor.height / 2) })
                .start()
        })

        //颜色数量选择
        this.setButtonClick("selectColor/node/btnClose", () => {
            console.log("btnClose on click")
            this.selectColor.x = cc.winSize.width
        })

        this.setButtonClick("selectColor/node/btnSelect", () => {
            console.log("btnSelect on click")
            this.selectColor.x = cc.winSize.width
            this.cartAdd()
        })

        let btnAdd = cc.find("node/numNode/num/btnAdd", this.selectColor)
        this.setButtonClick(btnAdd, () => {
            console.log("btnAdd on click")
            this.goodsNum++
            let lblNum = cc.find("node/numNode/num/lbl", this.selectColor)
            lblNum.getComponent(cc.Label).string = this.goodsNum.toString()
        })

        let btnDel = cc.find("node/numNode/num/btnDel", this.selectColor)
        this.setButtonClick(btnDel, () => {
            console.log("btnDel on click")
            this.goodsNum--
            this.goodsNum = this.goodsNum < 1 ? 1 : this.goodsNum
            let lblNum = cc.find("node/numNode/num/lbl", this.selectColor)
            lblNum.getComponent(cc.Label).string = this.goodsNum.toString()
        })

        //立刻购买
        this.setButtonClick("btm/btnBuy", () => {
            console.log("btnBuy on click")
            let param = {
                goodsDetail: this.goodsDetail,
                addressGid: null,
                curPrisGid: this.curPrisGid
            }
            if (this.defaultAddressInfo) {
                param.addressGid = this.defaultAddressInfo.address_gid
            }
            Helper.OpenPageUI("component/exchange/credits/ExchangeConfirm", "确认订单", null, param)
        })

        //选择地址
        this.setButtonClick("body/view/content/goodsNode/addressNode/btn", () => {
            console.log("addressNode/btn on click")
            this.initAddressList()
            this.selectAddress.x = 0
            this.selectAddressNode.y = -this.selectAddress.height / 2 - this.selectAddressNode.height
            cc.tween(this.selectAddressNode)
                .to(0.2, { position: cc.v3(0, -this.selectAddress.height / 2) })
                .start()
        })

        //关闭选择地址
        this.setButtonClick("selectAddress/node/btnClose", () => {
            console.log("btnClose on click")
            this.selectAddress.x = cc.winSize.width
        })

        //确定收货地址
        this.setButtonClick("selectAddress/node/address/btnSelect", () => {
            console.log("btnSelect on click")
            this.selectAddress.x = cc.winSize.width
            this.setDefaultAddress(this.selectAddressInfo)
        })

        //添加地址
        this.setButtonClick("selectAddress/node/noAddress/btnAdd", () => {
            console.log("btnAdd on click")
            Helper.OpenPageUI("component/address/AddressEditEntry", "编辑收货地址", null)
            // UIMgr.OpenUI("lobby", "component/Base/GamePage",
            //     {
            //         enterAni: Constants.PAGE_ANI.LEFT_IN, leaveAni: Constants.PAGE_ANI.LEFT_OUT,
            //         param: { page: "component/address/AddressEditEntry", title: "编辑收货地址" }
            //     })
        })

        btnPutCart.active = false
        btnCart.active = false
    }

    setDefaultAddress(addressInfo: any) {
        this.defaultAddressInfo = addressInfo
        let text = "您还没有添加地址，请选择地址"
        if (this.defaultAddressInfo) {
            text = this.defaultAddressInfo.province + this.defaultAddressInfo.city + this.defaultAddressInfo.county + this.defaultAddressInfo.town + this.defaultAddressInfo.address_detail
        }
        let lbl = cc.find("body/view/content/goodsNode/addressNode/lbl", this.node)
        lbl.getComponent(cc.Label).string = text.length > 18 ? text.substr(0, 17) + "..." : text
    }

    initAddressList() {
        console.log("initAddressList")
        let addressList: any[] = DataMgr.getData(Constants.DATA_DEFINE.ADDRESS_DATA)
        addressList = addressList ? addressList : []
        if (addressList.length > 0) {
            this.noAddress.active = false
            this.address.active = true
            this.addressList.removeAllChildren()
            for (let i = 0; i < addressList.length; i++) {
                let info = addressList[i]
                let itemNode = cc.instantiate(this.addressPrefab)
                itemNode.active = true
                this.addressList.addChild(itemNode)

                let lbl1 = cc.find("lbl1", itemNode)
                let text1 = info.province + info.city + info.county + info.town
                lbl1.getComponent(cc.Label).string = text1.length > 15 ? text1.substr(0, 14) + "..." : text1
                let lbl2 = cc.find("lbl2", itemNode)
                let text2 = info.address_detail
                lbl2.getComponent(cc.Label).string = text2.length > 15 ? text2.substr(0, 14) + "..." : text2

                this.setToggleClick(itemNode, () => {
                    this.selectAddressInfo = addressList[i]
                })

                if (this.selectAddressInfo == null) {
                    this.selectAddressInfo = info
                }

                if (this.defaultAddressInfo == null) {
                    this.setDefaultAddress(info)
                }

                if (this.defaultAddressInfo.address_gid == info.address_gid) {
                    itemNode.getComponent(cc.Toggle).isChecked = true
                    this.setDefaultAddress(info)
                }
            }
        } else {
            this.setDefaultAddress(null)
            this.noAddress.active = true
            this.address.active = false
        }
    }

    setNoStock(ret: boolean) {
        this.noStock.active = ret
        // this.btnPutCart.active = !ret
        // this.btnBuy.getComponent(cc.Button).interactable = !ret
    }

    initGoodsInfo(goodsInfo) {
        let productName = cc.find("body/view/content/goodsNode/infoNode/desc/name", this.node)
        let productDesc = cc.find("body/view/content/goodsNode/infoNode/desc/desc", this.node)
        let name = goodsInfo.product_name
        productName.getComponent(cc.Label).string = name.length > 20 ? name.substr(0, 19) + "..." : name


        let topPageView = cc.find("body/view/content/picsPage", this.node)
        let pageView = topPageView.getComponent(cc.PageView)

        let page = cc.find("view/content/page", topPageView)
        page.active = false
        pageView.removePage(page)

        let pageNode = cc.instantiate(page)
        pageNode.active = true
        pageView.addPage(pageNode)

        let spt = cc.find("mask/icon", pageNode)
        this.setSpriteFrame(spt, goodsInfo.product_images)
    }

    setCurPris(prisOne: any) {
        this.curPrisGid = prisOne.pris_gid

        if (prisOne) {
            let priceMix = cc.find("selectColor/node/ExchangePriceMix", this.node)
            priceMix.getComponent(ExchangePriceMix).setPriMix(prisOne)
        }
    }

    setGoodsDetail() {
        let topPageView = cc.find("body/view/content/picsPage", this.node)
        let pageView = topPageView.getComponent(cc.PageView)

        let page = cc.find("view/content/page", topPageView)
        page.active = false
        pageView.removeAllPages()
        let pics = this.goodsDetail.images.split(",")
        for (let i = 0; i < pics.length; i++) {
            let pageNode = cc.instantiate(page)
            pageNode.active = true
            pageView.addPage(pageNode)

            let spt = cc.find("mask/icon", pageNode)
            this.setSpriteFrame(spt, pics[i])
            if (i == 0) {
                let addAniIcon = cc.find("btm/addAni/icon", this.node)
                this.setSpriteFrame(addAniIcon, pics[i])

                //数量选择界面
                let icon = cc.find("node/icon", this.selectColor)
                this.setSpriteFrame(icon, pics[i])
            }
        }


        //商品名称和描述
        let productName = cc.find("body/view/content/goodsNode/infoNode/desc/name", this.node)
        let productDesc = cc.find("body/view/content/goodsNode/infoNode/desc/desc", this.node)
        let name = this.goodsDetail.product_name
        productName.getComponent(cc.Label).string = name//.length > 20 ? name.substr(0, 19) + "..." : name

        let desc = ""
        let specifications = JSON.parse(this.goodsDetail.specifications)
        for (var key in specifications) {
            desc = desc + key + specifications[key] + " "
        }

        productDesc.getComponent(cc.Label).string = desc.length > 55 ? desc.substr(0, 54) + "..." : desc
        productDesc.active = productDesc.getComponent(cc.Label).string.length > 0

        //价格组合
        let priceMix = cc.find("body/view/content/goodsNode/infoNode/price/content/priceMix", this.node)
        let priceMixPrefab = cc.find("item", priceMix)  //价格组合模版
        priceMixPrefab.active = false

        let mix2 = cc.find("mix2", priceMix)  //价格组合模版
        mix2.active = false
        for (let i = 0; i < this.goodsDetail.pris.length; i++) {
            let v = this.goodsDetail.pris[i]

            if (DataMgr.data.Config.platId === 2 || DataMgr.data.Config.platId === 5) {
                let onlyTicket = true
                for (let k = 0; k < v.pri.length; k++) {
                    let pri = v.pri[k]
                    pri.pri_type = pri.pri_type || 0
                    if (pri.pri_type != 0) {
                        onlyTicket = false
                    }
                }
                if (!onlyTicket) {
                    break
                }
            }

            let itemNode: cc.Node = null
            itemNode = cc.instantiate(priceMixPrefab)
            itemNode.active = true
            priceMix.addChild(itemNode)

            let exchangePriceMix = cc.find("ExchangePriceMix", itemNode)
            exchangePriceMix.getComponent(ExchangePriceMix).setPriMix(v)

            if (itemNode) {
                this.setToggleClick(itemNode, (sender, data) => {
                    console.log("v", v)
                    this.setCurPris(v)
                })

                if (i == 0) {
                    itemNode.getComponent(cc.Toggle).isChecked = true
                    this.setCurPris(v)
                }
            }
        }

        //商品详情
        let detailContent = cc.find("body/view/content/goodsNode/detail", this.node)
        let startStr = "<p>"
        let endStr = "</p>"
        let start = this.goodsDetail.app_introduce.indexOf(startStr)
        let end = this.goodsDetail.app_introduce.indexOf(endStr)
        let app_introduce = this.goodsDetail.app_introduce.substr(start + startStr.length, end - startStr.length)
        let imgList: string[] = app_introduce.split("/>")
        for (let v of imgList) {
            if (v.length > 0) {
                startStr = "<img src=\""
                endStr = "\" _src"
                let start = v.indexOf(startStr)
                let end = v.indexOf(endStr)
                v = v.substr(start + startStr.length, end - startStr.length)
                let spt = new cc.Node()
                spt.addComponent(cc.Sprite)
                detailContent.addChild(spt)
                spt.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.CUSTOM

                cc.assetManager.loadRemote(v, cc.Texture2D, (err, res: cc.Texture2D) => {
                    if (err) {
                        cc.warn("BaseUI.setSpriteFrame sprite " + v + " err: " + err)
                        return
                    }
                    spt.getComponent(cc.Sprite).spriteFrame = (<cc.SpriteFrame>new cc.SpriteFrame(res))
                    spt.width = cc.winSize.width
                    spt.height = res.height * (spt.width / res.width)
                })
            }
        }

        if (this.goodsDetail.type_id == Constants.EXCHANGE_GOODS_TYPE.CARD || this.goodsDetail.type_id == Constants.EXCHANGE_GOODS_TYPE.PHONE) {
            this.btnPutCart.active = false

            let addressNode = cc.find("body/view/content/goodsNode/addressNode", this.node)
            addressNode.active = false
        } else if (this.goodsDetail.product_id < 0) {//仅展示商品
            this.btnPutCart.active = false
        }

        if (this.goodsDetail.product_name === "10元充值卡") {
            this.btnBuy.getComponent(cc.Button).interactable = false
            this.setActive("tip", this.btnBuy, true)
        }
    }

    startAddAni() {
        let btnCart = cc.find("btm/btnCart", this.node)
        let addAni = cc.find("btm/addAni", this.node)
        addAni.active = true
        addAni.setPosition(0, cc.winSize.height - 400)
        addAni.stopAllActions()
        addAni.setScale(3)
        var bezier = [cc.v2(btnCart.x - 100, cc.winSize.height - 600), cc.v2(btnCart.x - 50, cc.winSize.height - 800), cc.v2(btnCart.x, btnCart.y)];
        var bezierTo = cc.bezierTo(0.5, bezier);
        cc.tween(addAni)
            .to(0.2, { scale: 0.9 })
            .to(0.1, { scale: 1.2 })
            .delay(0.1)
            .call(() => {
                cc.tween(addAni)
                    .then(bezierTo)
                    .start()
            })
            .to(0.5, { scale: 0.5 })
            .call(() => {
                addAni.active = false
                cc.tween(btnCart)
                    .to(0.1, { angle: -10 })
                    .to(0.1, { angle: 10 })
                    .to(0.1, { angle: 0 })
                    .start()
            })
            .start()
    }
}
