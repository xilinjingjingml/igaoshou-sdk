import BaseUI from "../base/BaseUI";
import { UIMgr } from "../base/UIMgr";
import ExchangeItemMode from "../exchange/ExchangeItemMode"
import { Constants } from "../constants";
import { Helper } from "../system/Helper";
import { DataMgr } from "../base/DataMgr";
import { EventMgr } from "../base/EventMgr";
import { ActivitySrv } from "../system/ActivitySrv";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ExchangeScene extends BaseUI {

    // onLoad () {}

    topPageViewIndex: number = 0

    content: cc.Node = null

    ticketNode: cc.Node = null
    topbtnSearch: cc.Node = null

    //分类
    kindsTab: cc.Node = null
    kindsNode: cc.Node = null
    kindsContent: cc.Node = null
    kindsPrefab: cc.Node = null

    topKindsNode: cc.Node = null
    isTopKinds = false
    //商品列表
    goodsNode: cc.Node = null
    goodsContent: cc.Node = null
    @property(cc.Prefab)
    goodsPrefab: cc.Node = null

    HomeInfoData: any = null

    sort_by = "market_price"
    order_code = 1
    curCategoryId: number = -1
    currentPage = 1
    pageSize = 8
    pageEnd = false

    _bInit: boolean = false

    onOpen() {
        Helper.reportEvent("大厅", "兑换界面", "打开界面")
        console.log("ExchangeScene onOpen")
        let openid = DataMgr.getData<IOpenId>(Helper.GetTokenDataKey())
        console.log("ExchangeScene onOpen openid", openid)

        if (!this._bInit) {
            this.node.height = this.node.parent.parent.height

            this.ticketNode = cc.find("titleNode/ticketNode", this.node)
            this.topbtnSearch = cc.find("titleNode/btnSearch", this.node)

            this.content = cc.find("body/view/content", this.node)
            this.kindsTab = cc.find("goodsNode/tab", this.content)
            this.kindsNode = cc.find("goodsNode/tab/kindsNode", this.content)
            this.kindsContent = cc.find("goodsNode/tab/kindsNode/kinds/view/content", this.content)
            this.kindsPrefab = cc.find("goodsNode/tab/kindsNode/kinds/view/content/toggle1", this.content)
            this.kindsPrefab.active = false

            this.topKindsNode = cc.find("topKinds", this.node)

            this.goodsNode = cc.find("goodsNode", this.content)
            this.goodsContent = cc.find("goodsNode/content", this.content)

            this.initButton()
            this.getHomeInfo((res) => {
                console.log("getHomeInfo", res)
                if (res && res.code === "00000") {
                    this.HomeInfoData = res
                    DataMgr.setData(Constants.DATA_DEFINE.EXCHANGE_HOME_INFO_DATA, res)
                    this.initTopPageView()
                    this.initKinds()
                }
            })

            this.setScrollViewEvent("body", (sender, eventType, customEventData) => {
                if (eventType == cc.ScrollView.EventType.BOUNCE_BOTTOM) {
                    if (!this.pageEnd) {
                        this.currentPage += 1
                        if (this.curCategoryId == -1) {
                            this.getfirstGoods()
                        } else {
                            this.getCategoryGoods(this.curCategoryId)
                        }
                    }
                }
            })
            // EventMgr.on(Constants.EVENT_DEFINE.ENTER_MATCH_SCEME, this.close, this)

            EventMgr.on(Constants.EVENT_DEFINE.ADDRESS_LIST_REQ, this.getUserInfo, this)
            DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, this.updateData, this)
            this._bInit = true
        }

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.ADDRESS_LIST_REQ)
        DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, this.updateData, this)
        this.updateData()
    }

    onEnterBegin() {
        // cc.log("ExchangeScene onEnterBegin")
    }

    onEnterEnd() {
        // cc.log("ExchangeScene onEnterEnd")
    }

    onLoad() {
        console.log("onLoad")
        // this.scheduleOnce(()=>{
        //     this.node.getParent().getParent().getComponent(cc.Widget).top = -70
        //     this.node.getParent().getComponent(cc.Widget).top = 70
        //     this.node.getParent().getParent().getComponent(cc.Widget).updateAlignment()
        //     this.node.getParent().getComponent(cc.Widget).updateAlignment()
        // }, 0.55)
    }

    onDisable() {
        // EventMgr.offByTag(this)
    }

    start() {
        // console.log("ExchangeScene start")
    }

    updateData() {
        let data = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (!data) {
            return
        }

        let lottery = data.lottery || 0
        let wcoin = data.wcoin || 0
        let diamond = data.diamond || 0
        for (let idx in data.items) {
            let i = data.items[idx]
            if (i.id === Constants.ITEM_INDEX.LOTTERY) {
                lottery += i.num
            } else if (i.id === Constants.ITEM_INDEX.WCOIN) {
                wcoin += i.num
            } else if (i.id === Constants.ITEM_INDEX.DIAMOND) {
                diamond += i.num
            }
        }

        // let lbl = cc.find("titleNode/ticketNode/lbl", this.node)
        // lbl.getComponent(cc.Label).string = lottery.toString()
        this.setLabelInfo("titleNode/ticketNode/lbl", lottery)
    }

    getUserInfo() {
        let param = {
        }
        Helper.PostHttp("mcbeam-authen-srv/user/getUserInfo", null, param, (res, event) => {
            console.log("getUserInfo", res)
            if (res && res.code == "0000") {
                if (res.address) {
                    DataMgr.setData(Constants.DATA_DEFINE.ADDRESS_DATA, JSON.parse(res.address))
                } else {
                    DataMgr.setData(Constants.DATA_DEFINE.ADDRESS_DATA, null)
                }
                EventMgr.dispatchEvent(Constants.EVENT_DEFINE.ADDRESS_LIST_UPDATE)
            }
        })
    }

    getHomeInfo(callback) {
        let param = {
            page_size: this.pageSize,
            // current_page:1
            page_code: 1,
            sort_by: this.sort_by, //排序字段
            order_code: this.order_code //顺序 -1降序 1升序
        }
        Helper.PostHttp("igaoshou-shop-srv/goods/homeInfo", null, param, (res, event) => {
            if (res) {
                callback(res)
            }
        })
    }

    getfirstGoods() {
        let param = {
            page_size: this.pageSize,
            page_code: this.currentPage,
            sort_by: this.sort_by, //排序字段
            order_code: this.order_code //顺序 -1降序 1升序
        }
        Helper.PostHttp("igaoshou-shop-srv/goods/homeInfo", null, param, (res, event) => {
            if (res && res.first_goods) {
                this.initGoods(res.first_goods)
            }
        })
    }

    getCategoryGoods(category_id) {
        console.log("getCategoryGoods", category_id)
        let param = {
            type_id: -1,
            category_id: category_id,
            keyword: "",
            page_size: this.pageSize,
            page_code: this.currentPage,
            sort_by: this.sort_by, //排序字段
            order_code: this.order_code //顺序 -1降序 1升序
        }

        let strParam = ""
        for (var k in param) {
            strParam += k + "=" + param[k] + "&"
        }
        let data: any = DataMgr.getData("categoryGoods" + strParam)
        if (data) {
            this.initGoods(data.goods_list)
        } else {
            Helper.PostHttp("igaoshou-shop-srv/goods/categoryGoods", null, param, (res, event) => {
                console.log("categoryGoods", res)
                if (res && res.goods_list) {
                    this.initGoods(res.goods_list)
                    DataMgr.setData("categoryGoods" + strParam, res)
                }

                if (!event) {
                    if (!res || !res.goods_list || res.goods_list.length < this.pageSize) {
                        this.pageEnd = true
                    }
                }
                console.log("this.pageEnd", this.pageEnd)
            })
        }
    }

    // update (dt) {}

    initButton() {

        // //购物车
        // let btnCart = cc.find("titleNode/btnCart", this.node)
        // this.setButtonClick(btnCart, () => {
        //     Helper.OpenPageUI("component/Exchange/ExchangeCart", "", null, {})
        // })

        // //订单
        // let btnBill = cc.find("titleNode/btnBill", this.node)
        // this.setButtonClick(btnBill, () => {
        //     Helper.OpenPageUI("component/Exchange/ExchangeBill", "我的订单", null, {})
        // })


        //搜索
        this.setButtonClick("btnSearch", this.content, () => {
            Helper.OpenPageUI("component/Exchange/ExchangeSearch", "", null, {})
        })
        this.setButtonClick(this.topbtnSearch, () => {
            Helper.OpenPageUI("component/Exchange/ExchangeSearch", "", null, {})
        })

        //兑换红包
        this.setButtonClick("mid/layer/btnRedEnvelope", this.content, () => {
            Helper.OpenPageUI("component/Exchange/ExchangeLotteryEntry", "兑换红包", null, {})
        })
        //兑换话费
        this.setButtonClick("mid/layer/btnPhoneBill", this.content, () => {
            Helper.OpenPageUI("component/Exchange/ExchangeGoods", "兑换话费", null, { exchangeType: Constants.EXCHANGE_GOODS_TYPE.PHONE })
        })
        //兑换卡劵
        let btnCard = cc.find("mid/layer/btnCard", this.content)
        this.setButtonClick(btnCard, () => {
            Helper.OpenPageUI("component/Exchange/ExchangeGoods", "兑换卡劵", null, { exchangeType: Constants.EXCHANGE_GOODS_TYPE.CARD })
        })
        //兑游戏币
        this.setButtonClick("mid/layer/btnToken", this.content, () => {
            Helper.OpenPageUI("component/Exchange/ExchangeTokenEntry", "兑换游戏币", null, {})
        })
        //兑游记录
        this.setButtonClick("mid/layer/btnRecord", this.content, () => {
            Helper.OpenPageUI("component/Exchange/ExchangeRecordEntry", "兑换记录", null, {})
        })
        //全部分类
        let btnClassify = cc.find("mid/layer/btnClassify", this.content)
        this.setButtonClick(btnClassify, () => {
            Helper.OpenPageUI("component/Exchange/ExchangeClassify", "全部分类", null, { categoryList: this.HomeInfoData.category_list })
        })

        let btnSort = cc.find("goodsNode/tab/kindsNode/btnSort", this.content)
        this.setButtonClick(btnSort, () => {
            let arrowNode = cc.find("arrowNode", btnSort)
            this.order_code = this.order_code == 1 ? -1 : 1
            if (this.order_code == 1) {
                arrowNode.angle = 0
            } else {
                arrowNode.angle = 180
            }

            this.currentPage = 1

            if (this.content.y > 399) {
                this.content.y = 399
                this.content.getParent().getParent().getComponent(cc.ScrollView).stopAutoScroll()
            }
            this.goodsContent.removeAllChildren()
            if (this.curCategoryId == -1) {
                this.getfirstGoods()
            } else {
                this.getCategoryGoods(this.curCategoryId)
            }
        })

        if (DataMgr.Config.platId === 2 || DataMgr.Config.platId === 5) {
            this.setActive(this.topbtnSearch, false)
            this.setActive("btnSearch", this.content, false)
            this.setActive(btnCard, false)
            this.setActive(btnClassify, false)
        }
    }

    initTopPageView() {
        //奖券攻略
        this.setButtonClick("topPageView/view/content/page/btn", this.content, () => {
            Helper.OpenPageUI("component/Exchange/ExchangeGuide", "奖券攻略", null, {})
        })
        // let topPageView = cc.find("content/topPageView",this.node)
        // let pageView = topPageView.getComponent(cc.PageView)

        // let page = cc.find("view/content/page", topPageView)
        // page.active = false
        // pageView.removePage(page)
        // for(let i=0;i<this.HomeInfoData.ads.length;i++){
        //     let pageNode = cc.instantiate(page)
        //     pageNode.active = true
        //     pageView.addPage(pageNode)

        //     let ads = this.HomeInfoData.ads[i]
        //     // this.setSpriteFrame("btn/Background", pageNode, ads.ads_img)

        //     this.setButtonClick("btn", pageNode, () => {
        //         console.log("page/btn on click", ads.ads_title)
        //     })
        // }

        // let eventName = "pageView" + topPageView.name + "_click"
        // pageView[eventName] = (sender, eventType,customEventData) => {
        //     console.log("eventType",eventType)
        // }
        // pageView.pageEvents = pageView.pageEvents || []

        // let clickEventHandler = new cc.Component.EventHandler();
        // clickEventHandler.target = topPageView
        // clickEventHandler.component = "cc.PageView"
        // clickEventHandler.handler = eventName
        // clickEventHandler.customEventData = ""

        // pageView.pageEvents.push(clickEventHandler)

        // this.schedule(() => {   
        //     this.topPageViewIndex++
        //     this.topPageViewIndex = this.topPageViewIndex >= this.HomeInfoData.ads.length ? 0 : this.topPageViewIndex
        //     pageView.scrollToPage(this.topPageViewIndex, 1)
        // }, 5);
    }

    initKinds() {
        let category_list = new Array()
        category_list.splice(0, 0, { category_name: "精选好物", category_id: -1 })
        if (DataMgr.Config.platId === 2 || DataMgr.Config.platId === 5) {
        } else {
            if (this.HomeInfoData.category_list) {
                for (let v of this.HomeInfoData.category_list) {
                    category_list.push(v)
                }
            }
        }

        for (let i = 0; i < category_list.length; i++) {
            let categoryInfo = category_list[i]
            let itemNode = cc.instantiate(this.kindsPrefab)
            itemNode.active = true
            this.kindsContent.addChild(itemNode)

            let lbl1 = cc.find("Background/lbl", itemNode)
            lbl1.getComponent(cc.Label).string = categoryInfo.category_name

            let lbl2 = cc.find("checkmark/lbl", itemNode)
            lbl2.getComponent(cc.Label).string = categoryInfo.category_name

            this.setToggleClick(itemNode, (sender, data) => {
                console.log("i", i)
                if (categoryInfo.category_id != this.curCategoryId) {
                    this.pageEnd = false
                    this.currentPage = 1
                    this.curCategoryId = categoryInfo.category_id
                    if (this.content.y > 399) {
                        this.content.y = 399
                        this.content.getParent().getParent().getComponent(cc.ScrollView).stopAutoScroll()
                    }
                    this.goodsContent.removeAllChildren()
                    if (categoryInfo.category_id == -1) {
                        this.initGoods(this.HomeInfoData.first_goods)
                    } else {
                        this.getCategoryGoods(categoryInfo.category_id)
                    }
                }
            })

            if (0 == i) {
                itemNode.getComponent(cc.Toggle).isChecked = true
                this.initGoods(this.HomeInfoData.first_goods)
            }
        }

        let content = cc.find("body/view/content", this.node)
        content.on(cc.Node.EventType.POSITION_CHANGED, () => {
            if (content.y >= 399) {
                this.topKindsNode.active = true
                if (!this.isTopKinds) {
                    this.isTopKinds = true

                    let kindsScrollOffset = this.kindsContent.x
                    this.kindsNode.removeFromParent(false)
                    this.topKindsNode.addChild(this.kindsNode)
                    this.scheduleOnce(() => {
                        this.kindsContent.x = kindsScrollOffset
                    })
                }
            } else {
                this.topKindsNode.active = false
                if (this.isTopKinds) {
                    this.isTopKinds = false
                    let kindsScrollOffset = this.kindsContent.x
                    this.kindsNode.removeFromParent(false)
                    this.kindsTab.addChild(this.kindsNode)
                    this.scheduleOnce(() => {
                        this.kindsContent.x = kindsScrollOffset
                    })
                }
            }

            if (DataMgr.Config.platId === 2 || DataMgr.Config.platId === 5) {
            } else {
                if (content.y > 10) {
                    let opacity = 255
                    if (content.y < 73) {
                        opacity = content.y / 73 * 255
                    }
                    this.topbtnSearch.opacity = opacity
                    this.ticketNode.active = false
                    this.topbtnSearch.active = true
                } else {
                    this.ticketNode.active = true
                    this.topbtnSearch.active = false
                }
            }

        })

    }

    initGoods(goodsList: any) {
        let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
        let bCheck = record[14] !== 1

        let idx = 0
        cc.tween(this.node)
            .repeat(2,
                cc.tween()
                    .call(() => {
                        let goodsInfo = goodsList[idx]
                        if (!goodsInfo) {
                            return
                        }
                        let itemNode = cc.instantiate(this.goodsPrefab)
                        itemNode.active = true
                        itemNode.name = "item" + idx
                        this.goodsContent.addChild(itemNode)

                        itemNode.getComponent(ExchangeItemMode).setData(goodsInfo, goodsInfo.pris[0].pris_gid)
                        idx++
                    })
                    .delay(.05))
            .call(() => {
                if (bCheck) {
                    this.checkGuide()
                }
            })
            .repeat(goodsList.length - 2,
                cc.tween()
                    .call(() => {
                        let goodsInfo = goodsList[idx]
                        if (!goodsInfo) {
                            return
                        }
                        let itemNode = cc.instantiate(this.goodsPrefab)
                        itemNode.active = true
                        itemNode.name = "item" + idx
                        this.goodsContent.addChild(itemNode)

                        itemNode.getComponent(ExchangeItemMode).setData(goodsInfo, goodsInfo.pris[0].pris_gid)
                        idx++
                    })
                    .delay(.05))
            .start()

        // for (let i = 0; i < goodsList.length; i++) {
        //     let goodsInfo = goodsList[i]
        //     let itemNode = cc.instantiate(this.goodsPrefab)
        //     itemNode.active = true
        //     itemNode.name = "item" + i
        //     this.goodsContent.addChild(itemNode)

        //     itemNode.getComponent(ExchangeItemMode).setData(goodsInfo, goodsInfo.pris[0].pris_gid)
        // }

        // this.checkGuide()
    }

    checkGuide() {
        let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
        if (record[14] !== 1) {
            let node = this.getNode("body/view/content/goodsNode/content")
            if (node.childrenCount >= 0) {
                UIMgr.OpenUI("component/Base/GameGuidance", { single: true, param: { index: 14, nodes: [node.children[0], node.children[1]] } })
            }
        }
    }
}
