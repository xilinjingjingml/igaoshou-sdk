import BaseUI from "../../../start/script/base/BaseUI";
import { Helper } from "../../../start/script/system/Helper";
import { MemberSrv } from "../../../start/script/system/MemberSrv";
import { UserSrv } from "../../../start/script/system/UserSrv";
import { UIMgr } from "../../../start/script/base/UIMgr";
import { ShopSvr } from "../../../start/script/system/ShopSvr";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { Constants } from "../../../start/script/igsConstants";

const { ccclass, property } = cc._decorator;
let wx = window["wx"]

@ccclass
export default class Recharge extends BaseUI {

    btnClose: cc.Node = null

    itemNode: cc.Node = null
    numLayout: cc.Node = null

    onOpen() {
        this.initButton()
        this.initData()
    }

    onClose() {
    }

    onLoad() {
        this.btnClose = cc.find("node/btnClose", this.node)
        this.itemNode = cc.find("item", this.node)
        this.itemNode.active = false

        this.numLayout = cc.find("node/numLayout", this.node)
    }

    initEvent() {
    }

    initButton() {
        this.setButtonClick(this.btnClose, this.node, () => {
            this.close()
        })
    }

    initData() {
        // if (this.param.box_list) {
        // let boxes = DataMgr.getData<TShopBoxes>(Constants.DATA_DEFINE.MEMBER_CARD)
        let boxes = DataMgr.getData<TShopBoxes>(Constants.DATA_DEFINE.SHOP_BOXES) || {}
        // boxes.forEach(box => {
        for (let i in boxes[Constants.SHOP_TYPE.MONTH_CARD] || {}) {
            let box = boxes[Constants.SHOP_TYPE.MONTH_CARD][i]
            let itemNode = cc.instantiate(this.itemNode)
            itemNode.active = true
            itemNode.name = box.name
            itemNode.getChildByName("node").getChildByName("moneynum").getComponent(cc.Label).string = box.name
            this.numLayout.addChild(itemNode)
            if (box.daysNum == 7) {
                this.setSpriteFrame(itemNode.getChildByName("node").getChildByName("7tianhuiyuan"), "component/member/image/7tianhuiyuan", true)
                this.setSpriteFrame(itemNode, "component/member/image/kaitongdikuang1", true)
                itemNode.getChildByName("node").getChildByName("daynum").getComponent(cc.Label).string = "每天1元"
                itemNode.getChildByName("node2").getChildByName("Lbl2").getComponent(cc.Label).string = "每天1元"
            } else if (box.daysNum == 15) {
                this.setSpriteFrame(itemNode.getChildByName("node").getChildByName("7tianhuiyuan"), "component/member/image/15tianhuiyuan", true)
                this.setSpriteFrame(itemNode, "component/member/image/kaitongdikuang2", true)
                itemNode.getChildByName("node").getChildByName("daynum").getComponent(cc.Label).string = "立省3元"
                itemNode.getChildByName("node2").getChildByName("Lbl2").getComponent(cc.Label).string = "每天0.88元"
            } else if (box.daysNum == 30) {
                this.setSpriteFrame(itemNode.getChildByName("node").getChildByName("7tianhuiyuan"), "component/member/image/30tianhuiyuan", true)
                this.setSpriteFrame(itemNode, "component/member/image/kaitongdikuang3", true)
                itemNode.getChildByName("node").getChildByName("daynum").getComponent(cc.Label).string = "立省12元"
                itemNode.getChildByName("node2").getChildByName("Lbl2").getComponent(cc.Label).string = "每天0.6元"
            }
            this.setButtonClick(itemNode, this.node, () => {
                this.payOrder(box)
            })
        };
        // }
    }

    payOrder(box) {
        // let param = {
        //     goods_param: box.box_gid,
        //     goods_name: box.name,
        //     price: box.price,
        //     store_id: 0,
        //     notify_url: 'igaoshou,igaoshou-shop-srv,Box.SendItem',
        //     pay_plat: 7,
        //     metadata: { "openid": this.param.wx_openid, "env": 0 }
        // }
        // ShopSvr.WechatPay(box, (succ: boolean) => {
        ShopSvr.Pay(box, (succ) => {
            if (!succ) {
                return
            }

            //充值成功
            this.close()

            Helper.OpenTip("购买金卡会员成功")
            // MemberSrv.getBoxList((res) => {
            // this.checkReceiveAward(res, box)
            // })
            this.checkReceiveAward(box)
        })
    }

    checkReceiveAward(box: any) {
        // console.log("checkReceiveAward:", res)
        let vipCardInfo = MemberSrv.getMemberInfo()
        // if (res.vip_card) {
        // const vip_card = JSON.parse(res.vip_card)
        let date = Date.parse(new Date().toString()) / 1000
        if (date < vipCardInfo.invalid_date) {
            // 会员未到期
            // 且是当天第一次打开
            if (Helper.GMTToStr() > vipCardInfo.receive_date) {
                this.getAward(box)
            }
        }
        // }
    }

    getAward(box: IShopInfo) {
        // award.push({
        //     item_id: 301,
        //     item_num: box.daysNum
        // })
        // Helper.PostHttp("igaoshou-shop-srv/Box/GetVipItem", null, {}, (res, event) => {
        //     console.log("GetVipItem", res)
        //     if (res && res.code == "000000") {
        //         console.log("getAward:", res)
        //         UserSrv.UpdateItem(() => UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: award, member: 1 }, }, null))
        //     }
        // })
        MemberSrv.getMemberAward(box.daysNum || 0)
    }

    showAni(src: number, dst: number, callback: Function): cc.Tween {
        let val = src - dst
        let interval = 3.0 / Math.abs(val)
        if (Math.abs(val) < 1) {
            interval = 3.0 / Math.abs(val * 100)
        }
        let cb = cc.tween().delay(interval).call(() => {
            if (Math.abs(val) < 1) {
                src += (src > dst) ? -.01 : .01
            } else {
                src += (src > dst) ? -1 : 1
            }

            callback(src)
        })
        return cc.tween().repeat(Math.abs(val) < 1 ? Math.abs(Math.floor(val * 100)) : Math.abs(val), cb)
    }

    closeAni() {
        let pos = cc.v3(-40, cc.winSize.height / 2 - 40)
        let btn: cc.Node = this.param.btn
        if (btn) {
            pos = this.node.convertToNodeSpaceAR(btn.convertToWorldSpaceAR(cc.Vec3.ZERO))
        }
        this.runTween("node",
            cc.tween()
                .to(.3, { position: pos, scale: .05 })
                .delay(0)
                .call(() => this.close())
        )
    }
}
