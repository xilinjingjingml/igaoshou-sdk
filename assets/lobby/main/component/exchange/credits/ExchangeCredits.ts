import BaseUI from "../../../../start/script/base/BaseUI";
import { Helper } from "../../../../start/script/system/Helper";
import { User } from "../../../../start/script/data/User";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { ExchangeSrv } from "../../../../start/script/system/ExchangeSrv";
import { UIMgr } from "../../../../start/script/base/UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ExchangeCredits extends BaseUI {

    firstPage: any = {
        page_size: 6,
        page_code: 1,
        sort_by: "market_price",
        order_code: 1
    }

    allPage: any = {
        type_id: 0,
        category_id: -1,
        page_size: 6,
        page_code: 1,
        sort_by: "market_price",
        order_code: 1
    }

    kindPage: any = {
        type_id: 0,
        category_id: -1,
        page_size: 6,
        page_code: 1,
        sort_by: "market_price",
        order_code: 1
    }

    _hotMode: cc.Node = null
    _allMode: cc.Node = null
    _kindMode: cc.Node = null

    _hotScroll: cc.ScrollView = null
    _hotContent: cc.Node = null
    _bHotUpdate: boolean = false

    _allScroll: cc.ScrollView = null
    _allContent: cc.Node = null
    _bAllUpdate: boolean = false

    _kindScroll: cc.ScrollView = null
    _kindContent: cc.Node = null
    _bKindUpdate: boolean = false

    _hotStart: number = 0

    _kindType: number = 0
    _kindName: string = ""

    onLoad() {
        this.initNode()
        this.initEvent()
    }

    onOpen() {
        this.initData()
    }

    onClose() {

    }

    initNode() {
        this._hotMode = this.getNode("goodslist/view/content/hotPage/list/view/item")
        this._hotMode.active = false
        this._hotScroll = this.getNodeComponent("goodslist/view/content/hotPage/list", cc.ScrollView)
        this._hotContent = this.getNode("goodslist/view/content/hotPage/list/view/content")
        this._hotContent.width = 70 + 266 * 24 + 32 * 23
        this._hotContent.x = -360

        this._allMode = this.getNode("goodslist/view/content/allPage/list/view/item")
        this._allMode.active = false
        this._allScroll = this.getNodeComponent("goodslist/view/content/allPage/list", cc.ScrollView)
        this._allContent = this.getNode("goodslist/view/content/allPage/list/view/content")
        this._allContent.width = 70 + 266 * 24 + 32 * 23
        this._allContent.x = -360

        this._kindMode = this.getNode("goodslist/view/content/kindPage/list/view/item")
        this._kindMode.active = false
        this._kindScroll = this.getNodeComponent("goodslist/view/content/kindPage/list", cc.ScrollView)
        this._kindContent = this.getNode("goodslist/view/content/kindPage/list/view/content")
        this._kindContent.width = 70 + 266 * 24 + 32 * 23
        this._kindContent.x = -360
    }

    initEvent() {
        DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, this.updateCredits, this)
        this._hotScroll.node.on("scrolling", this.onHotScrolling.bind(this), this);
        this._allScroll.node.on("scrolling", this.onAllScrolling.bind(this), this);
        this._kindScroll.node.on("scrolling", this.onKindScrolling.bind(this), this);

        this.setButtonClick("goodslist/view/content/hotPage/btnMore", () => {
            UIMgr.OpenUI("lobby", "component/exchange/credits/ExchangeGoods", { single: true, param: { type: -2, name: "热门" } })
        })

        this.setButtonClick("goodslist/view/content/allPage/btnMore", () => {
            UIMgr.OpenUI("lobby", "component/exchange/credits/ExchangeGoods", { single: true, param: { type: -1, name: "全部" } })
        })

        this.setButtonClick("goodslist/view/content/kindPage/btnMore", () => {
            UIMgr.OpenUI("lobby", "component/exchange/credits/ExchangeGoods", { single: true, param: { type: this._kindType, name: this._kindName } })
        })
    }

    initData() {
        this.updateCredits()
        ExchangeSrv.getHomeInfo(this.firstPage, (list) => this.updateGoods(list))
        ExchangeSrv.getCategoryGoods(this.allPage, (list) => this.updateAllList(list))
    }

    onHotScrolling() {
        let offset = this._hotScroll.getScrollOffset()
        if (offset.x > 0 || offset.x < -this._hotContent.width + 720)
            return

        if ((-offset.x - 35) / (266 + 32) % 1 < .5) {
            return
        }

        let idx = Math.ceil((-offset.x - 35) / (266 + 32))
        for (let i = 0; i < this._hotContent.childrenCount; i++) {
            if (ExchangeSrv.getFirstGoods(idx + i - 1)) {
                this.setItem(this._hotContent.children[i], ExchangeSrv.getFirstGoods(idx + i - 1), idx + i - 1)
            } else if (!this._bHotUpdate && this.firstPage.page_code < 4) {
                this._bHotUpdate = true
                this.firstPage.page_code++
                ExchangeSrv.getHomeInfo(this.firstPage, () => {
                    this.setItem(this._hotContent.children[i], ExchangeSrv.getFirstGoods(idx + i - 1), idx + i - 1)
                    this._bHotUpdate = false
                })
            }

        }
    }

    onAllScrolling() {
        let offset = this._allScroll.getScrollOffset()
        if (offset.x > 0 || offset.x < -this._allContent.width + 720)
            return

        let idx = Math.ceil((-offset.x - 35) / (266 + 32))
        for (let i = 0; i < this._allContent.childrenCount; i++) {
            if (ExchangeSrv.getFirstGoods(idx + i - 1)) {
                this.setItem(this._allContent.children[i], ExchangeSrv.getFirstGoods(idx + i - 1), idx + i - 1)
            } else if (!this._bAllUpdate && this.allPage.page_code < 4) {
                this._bAllUpdate = true
                this.allPage.page_code++
                ExchangeSrv.getCartList(this.allPage, () => {
                    this.setItem(this._allContent.children[i], ExchangeSrv.getFirstGoods(idx + i - 1), idx + i - 1)
                    this._bAllUpdate = false
                })
            }

        }
    }

    onKindScrolling() {
        let offset = this._kindScroll.getScrollOffset()
        if (offset.x > 0 || offset.x < -this._kindContent.width + 720)
            return

        let idx = Math.ceil((-offset.x - 35) / (266 + 32))
        for (let i = 0; i < this._kindContent.childrenCount; i++) {
            if (ExchangeSrv.getFirstGoods(idx + i - 1)) {
                this.setItem(this._kindContent.children[i], ExchangeSrv.getFirstGoods(idx + i - 1), idx + i - 1)
            } else if (!this._bKindUpdate && this.firstPage.page_code < 4) {
                this._bKindUpdate = true
                this.firstPage.page_code++
                ExchangeSrv.getHomeInfo(this.firstPage, () => {
                    this.setItem(this._kindContent.children[i], ExchangeSrv.getFirstGoods(idx + i - 1), idx + i - 1)
                    this._bKindUpdate = false
                })
            }

        }
    }

    updateCredits() {
        this.setLabelValue("baseInfo/num", Helper.FormatNumWYCN(User.Credits))
    }

    updateGoods(list) {
        if (list && list.length > 0) {
            this.setActive("nogoods", false)
            this.setActive("goodslist", true)

            this.updateKind()
            this.updateHotList(list)
        } else {
            this.setActive("nogoods", true)
            this.setActive("goodslist", false)
        }
    }

    setItem(item, goods, idx) {
        if (item["_idx"] === idx) {
            return
        }

        item.active = false

        if (goods) {
            item.active = true
            this.setSpriteFrame("icon", item, null)
            this.setSpriteFrame("icon", item, goods.product_images)
            this.setLabelValue("name", item, goods.product_name)

            let price = goods.pris[0]
            if (price?.pri.length > 0) {
                this.setLabelValue("price/num", item, Helper.FormatNumWYCN(price?.pri[0].pri_value))
            } else {
                this.setLabelValue("price/num", item, 0)
            }

            this.setButtonClick("btnExchange", item, () => {
                DataMgr.setData("ExchangeSubstanceEntryGoodsInfo", goods)
                Helper.OpenPageUI("component/exchange/credits/ExchangeSubstance", "实物详情", null, { goodsInfo: goods, pris_gid: price?.pris_gid })
            })
        }

        item.x = 35 + (266 + 32) * idx + 133
        item["_idx"] = idx
    }

    updateKind() {
        let kinds = ExchangeSrv.getKinds()
        if (!kinds) {
            this.setActive("goodslist/view/content/kindPage", false)
            return
        }

        let mode = this.getNode("goodslist/view/content/kindPage/title/view/content/toggle")
        mode.active = false
        let init = false
        for (let i of ExchangeSrv.getKinds()) {
            let item = cc.instantiate(mode)
            item.active = true
            item.parent = mode.parent

            this.setLabelValue("Background", item, i.category_name)
            this.setLabelValue("checkmark/Background", item, i.category_name)

            this.setToggleClick(item, () => {
                this._kindType = i.category_id
                this._kindName = i.category_name
                this.kindPage.category_id = i.category_id
                this.kindPage.page_code = 1
                ExchangeSrv.getCategoryGoods(this.kindPage, (list) => this.updateKindList(list))
            })

            if (!init) {
                this.setToggleCheck(item, true)
                init = true
            }
        }
    }

    updateHotList(list) {
        for (let i = -1; i < 7; i++) {
            let item = cc.instantiate(this._hotMode)
            item.parent = this._hotContent
            item.active = true
            let goods = list[i]
            this.setItem(item, goods, i)
        }
    }

    updateAllList(list) {
        for (let i = -1; i < 7; i++) {
            let item = cc.instantiate(this._allMode)
            item.parent = this._allContent
            item.active = true
            let goods = list[i]
            this.setItem(item, goods, i)
        }
    }

    updateKindList(list) {
        for (let i = -1; i < 7; i++) {
            let item = cc.instantiate(this._kindMode)
            item.parent = this._kindContent
            item.active = true
            let goods = list[i]
            this.setItem(item, goods, i)
        }
    }

    onPressBack() {
        this.close()
    }

    onPressHelp() {
        Helper.OpenPageUI("component/exchange/credits/ExchangeGuide", "帮助", null, { single: true })
    }

    onPressOrder() {
        Helper.OpenPageUI("component/exchange/credits/ExchangeRecord", "兑换记录", null, { single: true })
    }
}


