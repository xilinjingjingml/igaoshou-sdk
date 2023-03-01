import BaseUI from "../../../start/script/base/BaseUI";
import { PromoteSrv } from "../../../start/script/system/PromoteSrv";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PromoteContribute extends BaseUI {
    _scrollView: cc.Node = null
    _content: cc.Node = null
    _itemPrefab: cc.Node = null

    listData = []

    onOpen() {
        console.log("PromoteContribute onOpen", this.param)
        this.initEvent()
        this.initButton()
        this.initData()

        let date = new Date()
        let startTime = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
        let endTime = new Date(date.getFullYear(), startTime.getMonth() + 1, 0, 23, 59, 59)
        let param = { start: 0, size: 31, start_time: startTime.getTime() / 1000, end_time: endTime.getTime() / 1000 }
        console.log("onOpen", param)
        PromoteSrv.GetBillList(param, (res) => {
            this.initBillList(res)
        })
    }

    onLoad() {
        this._content = cc.find("sptBgInfo/scrollView/view/content", this.node)
        this._itemPrefab = cc.find("item", this._content)
        this._itemPrefab.active = false
    }

    onClose() {
    }

    initEvent() {

    }

    initButton() {
        this.setButtonClick("top/btnBack", this.node, () => {
            cc.log("on click btnBack")
            this.close()
        })

        this.setButtonClick("sptBgContribute/btnPrev", this.node, () => {
            cc.log("on click btnPrev")
            this.setActive("sptBgContribute/btnPrev", false)
            this.setActive("sptBgContribute/btnNext", true)

            let date = new Date()
            let startTime = new Date(date.getFullYear(), date.getMonth() - 1, 1, 0, 0, 0, 0)
            let endTime = new Date(startTime.getFullYear(), startTime.getMonth() + 1, 0, 23, 59, 59)
            let param = { start: 0, size: 31, start_time: startTime.getTime() / 1000, end_time: endTime.getTime() / 1000 }
            console.log("btnPrev", param)
            PromoteSrv.GetBillList(param, (res) => {
                this.initBillList(res)
            })
            this.setLabelValue("sptBgContribute/lblDate", startTime.getFullYear() + "年" + (startTime.getMonth() + 1) + "月")
        })

        this.setButtonClick("sptBgContribute/btnNext", this.node, () => {
            cc.log("on click btnNext")
            this.setActive("sptBgContribute/btnPrev", true)
            this.setActive("sptBgContribute/btnNext", false)

            let date = new Date()
            let startTime = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
            let endTime = new Date(startTime.getFullYear(), startTime.getMonth() + 1, 0, 23, 59, 59)
            let param = { start: 0, size: 31, start_time: startTime.getTime() / 1000, end_time: endTime.getTime() / 1000 }
            console.log("btnPrev", param)
            PromoteSrv.GetBillList(param, (res) => {
                this.initBillList(res)
            })
            this.setLabelValue("sptBgContribute/lblDate", startTime.getFullYear() + "年" + (startTime.getMonth() + 1) + "月")
        })
    }

    initData() {
        let date = new Date()
        this.setLabelValue("sptBgContribute/lblDate", date.getFullYear() + "年" + (date.getMonth() + 1) + "月")
    }

    initBillList(data: any) {
        this._content.removeAllChildren(true)
        if (data && data.list) {
            this.setActive("lblNo", false)
            this.setActive("sptBgInfo", true)

            for (let i = 0; i < data.list.length; i++) {
                let itemData = data.list[i]
                let item = cc.instantiate(this._itemPrefab)
                item.active = true
                item.parent = this._content

                let date = new Date(itemData.receive_time * 1000)
                this.setLabelValue("lblDate", item, (date.getMonth() + 1) + "月" + date.getDate() + "日")
                itemData.award_item.item_num = itemData.award_item.item_num || 0
                this.setLabelValue("lblMoney1", item, (itemData.award_item.item_num / 100) + "元")
                itemData.second_award.item_num = itemData.second_award.item_num || 0
                this.setLabelValue("lblMoney2", item, (itemData.second_award.item_num / 100) + "元")
                this.setLabelValue("lblTotalMoney", item, ((itemData.award_item.item_num + itemData.second_award.item_num) / 100) + "元")
            }

            if (77 + data.list.length * 41 > cc.winSize.height - 250) {
                this.setNodeHeight("sptBgInfo", cc.winSize.height - 250)
            } else {
                this.setNodeHeight("sptBgInfo", 77 + data.list.length * 41)
            }
        } else {
            this.setActive("lblNo", true)
            this.setActive("sptBgInfo", false)
        }
    }
}
