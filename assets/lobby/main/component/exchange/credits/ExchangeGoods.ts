import BaseUI from "../../../../start/script/base/BaseUI";
import { Helper } from "../../../../start/script/system/Helper";
import { User } from "../../../../start/script/data/User";
import { ExchangeSrv } from "../../../../start/script/system/ExchangeSrv";
import ExchangeItemMode from "./ExchangeItemMode";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ExchangeGoods extends BaseUI {

    page: any = {
        page_size: 6,
        page_code: 1,
        sort_by: "market_price",
        order_code: 1
    }

    _mode: cc.Node = null
    _content: cc.Node = null
    _scrollView: cc.ScrollView = null
    _update: boolean = false

    onLoad() {
        this.initNode()
        this.initEvent()
    }

    onOpen() {
        this.initData()
    }

    initNode() {
        this._mode = this.getNode("list/view/ExchangeItemMode")
        this._mode.active = false
        this._content = this.getNode("list/view/content")
        this._scrollView = this.getNodeComponent("list", cc.ScrollView)
    }

    initEvent() {
        this._scrollView.node.on("scrolling", this.onScrolling.bind(this), this);
    }

    initData() {
        this.setLabelValue("top/title", this.param.name)
        this.setLabelValue("top/num", Helper.FormatNumWYCN(User.Credits))

        if (this.param.type === -2) {
            ExchangeSrv.getHomeInfo(this.page, (list) => this.updateList(list))
        } else {
            this.page.type_id = 0
            this.page.category_id = this.param.type
            ExchangeSrv.getCategoryGoods(this.page, (list) => this.updateList(list))
        }
    }

    onPressBack() {
        this.close()
    }

    updateList(list: any[]) {
        this._content.height = (521 + 28) * (list.length + 2) + 38 + 38
        for (let i = -2; i < 6; i++) {
            let item = cc.instantiate(this._mode)
            item.active = true
            item.parent = this._content

            this.setItem(item, list[i], i)
        }
    }

    setItem(item: cc.Node, goods, idx) {
        if (item["_idx"] === idx) {
            return
        }

        item.active = false

        if (goods) {
            item.active = true
            item.getComponent(ExchangeItemMode).setData(goods)
        }

        item.setPosition(cc.v2(idx % 2 ? 171 : -171, -(38 + (Math.floor(idx / 2) + .5) * (521 + 28))))
        item["_idx"] = idx
    }

    getGoods(idx) {
        let goods = null
        if (this.param.type === -2) {
            goods = ExchangeSrv.getFirstGoods(idx)
        } else if (this.param.type === -1) {
            goods = ExchangeSrv.getAllGoods(idx)
        } else {
            goods = ExchangeSrv.getkindGoods(this.param.type, idx)
        }
        return goods
    }

    onScrolling() {
        let offset = this._scrollView.getScrollOffset()
        if (offset.y < 0 || offset.y > this._content.height - this._scrollView.node.height)
            return

        let idx = Math.ceil((offset.y - 38) / (521 + 28))
        for (let i = 0; i < this._content.childrenCount / 2; i++) {
            if (idx + i - 1 < 0) {
                continue
            }

            for (let j = 0; j < 2; j++) {
                let goods = this.getGoods((idx + i - 1) * 2 + j)
                if (goods) {
                    this.setItem(this._content.children[i * 2 + j], goods, (idx + i - 1) * 2 + j)
                } else if (!this._update) {
                    this._update = true
                    this.page.page_code++
                    let fill = (list) => {
                        this._content.height = (521 + 28) * (list.length + 2) + 38 + 38
                        this.setItem(this._content.children[i * 2 + j], this.getGoods((idx + i - 1) * 2 + j), (idx + i - 1) * 2 + j)
                        this._update = false
                    }

                    if (this.param.type === -2) {
                        ExchangeSrv.getHomeInfo(this.page, (list) => fill(list))
                    } else {
                        ExchangeSrv.getCategoryGoods(this.page, (list) => fill(list))
                    }
                }
            }
        }
    }
}
