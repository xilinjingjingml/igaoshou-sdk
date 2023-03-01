import BaseUI from "../base/BaseUI";
import { DataMgr } from "../base/DataMgr";
import { Constants } from "../constants";
import { UIMgr } from "../base/UIMgr";
import { Helper } from "../system/Helper";
import { ActivitySrv, SignSrv } from "../system/ActivitySrv"
import { AdSrv } from "../system/AdSrv";
import GetAwardEntry from "../component/shop/GetAwardEntry"
import { EventMgr } from "../base/EventMgr";
import WxWrapper from "../system/WeChatMini";

const { ccclass, property } = cc._decorator;

//196 212

const icons = [
    "image/shop/SC-icon-libao1",
    "image/icon/big_weibi",
    "image/shop/SC-icon-kanguanggao1",
    "image/shop/icon_zhuanpan",
    "image/shop/icon_bisai",
    "image/icon/many_zuanshi",
    "image/shop/meiriqiandaotubiao",
    "image/icon/many_weibi",
]

const icons_bg = [
    "image/shop/tankuangtiao2-1",
    "image/shop/tankuangtiao4-1",
    "image/shop/tankuangtiao2-1",
    "image/shop/tankuangtiao3-1",
    "image/shop/tankuangtiao2-1",
    "image/shop/tankuangtiao2-1",
    "image/shop/tankuangtiao3-1",
    "image/shop/tankuangtiao3-1"
]

// let icons = new Map();
//         icons.set(1,"image/shop/SC-icon-libao1")
//         icons.set(2,"image/icon/daoju-weibi")
//         icons.set(3,"image/shop/SC-icon-kanguanggao1")
//         icons.set(4,"image/shop/icon_zhuanpan")
//         icons.set(5,"image/shop/icon_bisai")
//         icons.set(6,"image/icon/many_zuanshi")
//         icons.set(7,"image/shop/meiriqiandaotubiao")

@ccclass
export default class ShopScene extends BaseUI {
    @property(cc.Prefab)
    freeAwardModePrefab: cc.Node = null

    @property(cc.Prefab)
    freeAwardModeStressPrefab: cc.Node = null

    // freeAwardContent: cc.Node = null
    // diamondsAwardContent: cc.Node = null
    // moreContent: cc.Node = null
    freeAwardContent: cc.Node[] = []

    acvitityConfig = new Map()

    _bInit = false

    onLoad() {
        // this.node.children.forEach(i => i.active = false)

        this.initNode()
    }

    onOpen() {
        Helper.reportEvent("大厅", "商城", "打开界面")
        console.log("ShopScene onOpen")
        // this.initNode()
        this.initEvent()
        this.initData()

        let screenHeight = this.node.parent.parent.height

        this.node.children.forEach(i => {
            i.on(cc.Node.EventType.SIZE_CHANGED, () => {
                if (!i.active) return
                let height = 0
                this.node.children.forEach(o => o.active && (height += o.height))
                if (screenHeight + 100 >= height) {
                    this.node.height = screenHeight + 100
                } else {
                    this.node.height = height + 20
                }
            })
        })
    }

    initNode() {
        this.getNode("preference").opacity = 0
        this.getNode("boxes").opacity = 0

        this.freeAwardContent[1] = this.getNode("stressAward")
        this.freeAwardContent[2] = this.getNode("freeAward")
        this.freeAwardContent[3] = this.getNode("diamondsAward")
        this.freeAwardContent[4] = this.getNode("moreAward")
        this.freeAwardContent.forEach(i => { i.opacity = 0, i.active = false })        
    }

    initEvent() {
    }

    initData() {
        let sx = ((this.freeAwardContent[1].width - 40) - (this.freeAwardModeStressPrefab["data"].width * 2)) / 3
        this.setLayoutInfo("list/content", this.freeAwardContent[1], {
            left: sx,
            right: sx,
            spacingX: sx,
            top: 10,
            bottom: 10,
            spacingY: 10
        })

        sx = ((this.freeAwardContent[2].width - 40) - (this.freeAwardModePrefab["data"].width * 3)) / 2
        this.setLayoutInfo("list/content", this.freeAwardContent[2], {
            left: 0,
            right: 0,
            spacingX: sx,
            top: 10,
            bottom: 10,
            spacingY: 10
        })

        if (DataMgr.Config.platId !== 2 && DataMgr.Config.platId !== 5) {
            this.initPreference()
            this.initShopBox()
        } else {
            this.setActive("preference", false)
            this.setActive("boxes", false)
        }

        // this.scheduleOnce(this.refreshActivityData, 0.1)
        this._bInit = true
        this.getActivityData()
    }

    onEnable() {
        console.log("ShopScene onEnable")
        if (!this._bInit) {
            return
        }
        this.getActivityData()

        WxWrapper.showUserInfoButton(null, "activity")
    }

    onDisable() {
        WxWrapper.hideUserInfoButton("activity")
    }

    getActivityData() {
        ActivitySrv.GetActivityConfig(0, (res: any[]) => {
            if (!res)
                return

            // res.forEach(i => { try { i.param = JSON.parse(i.param); i.shop_place = i.param.shop_place; i.sort_id = i.param.sort_id || 0 } catch { } })
            // res = res.sort((a, b) => {
            //     return a.sort_id < b.sort_id ? -1 : a.sort_id > b.sort_id ? 1 : a.activity_id < b.activity_id ? -1 : 1
            // })
            this.initFreeData(res)
        })
    }

    initPreference() {
        let boxes = DataMgr.getData<TShopBoxes>(Constants.DATA_DEFINE.PREFERENCE_BOXES)
        for (let idx in boxes) {
            this.setLabelValue("preference/content/title/time", Helper.FormatTimeString(boxes[idx].time))
            this.setChildParam("preference/content/ShopPreference", { data: boxes[idx] })
            this.setActive("preference", true)
            cc.tween(this.getNode("preference")).delay(.1).to(.5, { opacity: 255 }).start()
            return
        }
    }

    initShopBox() {
        let content = this.getNode("boxes/content")
        let boxes = DataMgr.getData<TShopBoxes>(Constants.DATA_DEFINE.SHOP_BOXES)
        let boxCount = 0
        let layout = content.getComponent(cc.Layout)
        let small = (content.width - layout.spacingX * 2 - layout.paddingLeft - layout.paddingRight) / 3
        let big = (content.width - layout.spacingX - layout.paddingLeft - layout.paddingRight) / 2
        for (let idx in boxes) {
            let box = boxes[idx]
            if (box && box.type === Constants.SHOP_TYPE.NORMAL) {
                this.setChildParam("ShopItemMode" + boxCount, content, { data: box, width: boxCount >= 3 ? big : small })
                boxCount++
                // UIMgr.OpenUI("component/Shop/ShopItemMode", { parent: content, param: { data: box, width: boxCount >= 4 ? big : small } })
            }
        }
        this.setActive("boxes/content", boxCount > 0)
        content.active = boxCount > 0
        this.setActive("boxes", boxCount > 0)
        cc.tween(this.getNode("boxes")).delay(.1).to(.5, { opacity: 255 }).start()
    }

    initFreeData(list: any[]) {
        this.freeAwardContent.forEach(p => p.children.forEach(i => i.active = false))
        for (let info of list) {
            let data = info
            if (undefined === data.shop_place) {
                continue
            }
            if (data.activity_id === 1002 && data.receive_num === 1) {
                continue
            }

            let itemNode = this.getNode("item" + data.activity_id, this.getNode("list/content", this.freeAwardContent[data.shop_place]))
            if (null === itemNode || itemNode.name === "New Node") {
                let prefab = this.freeAwardModePrefab
                if (info.shop_place === 1) {
                    prefab = this.freeAwardModeStressPrefab
                }
                itemNode = cc.instantiate(prefab)
                itemNode.name = "item" + data.activity_id
                itemNode.parent = this.getNode("list/content", this.freeAwardContent[data.shop_place])
                this.freeAwardContent[data.shop_place].active = true
                // this.setChildParam(itemNode, data)
            }

            // this.scheduleOnce(() => itemNode.active = true)
            itemNode.active = true
            // itemNode.active = false
            itemNode["_data"] = data
            // flustList.push(itemNode)
            this.setChildParam(itemNode, data)
            this.acvitityConfig.set(data.activity_id, data)
        }
        
        this.freeAwardContent.forEach(p => p.children.forEach(c => c.active = this.getNode("list/content", p).childrenCount > 0))
        this.freeAwardContent.forEach(i => cc.tween(i).delay(.1).to(.5, { opacity: 255 }).start())
    }
}
