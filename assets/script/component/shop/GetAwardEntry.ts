import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { DataMgr } from "../../base/DataMgr";
import { ITEM_STYLE } from "../Base/ItemMode";
import { ShopSvr } from "../../system/ShopSvr";
import { Helper } from "../../system/Helper";
import { User } from "../../system/User";
import { EventMgr } from "../../base/EventMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GetAwardEntry extends BaseUI {
    @property(cc.Node)
    itemNode: cc.Node = null
    itemIcon: cc.Node = null
    itemNum: cc.Node = null

    spLiBao: cc.Node = null
    spLiBaoSpine: sp.Skeleton = null
    btnOpen: cc.Node = null

    state = 0

    _lottery: number = null
    _wcoin: number = null
    _diamond: number = null

    _count: number = 0

    onOpen() {
        console.log("GetAwardEntry onOpen", this.param)
        this.initEvent()
        this.initData()
        this.initButton()
        // this.updateData()        
    }

    onClose() {
        cc.log("===getAwardclose")
    }

    onLoad() {
        this.runTween("light", cc.tween().repeatForever(cc.tween().to(2, { angle: 180 }).to(2, { angle: 360 }).set({ angle: 0 })))
        this.itemNode.active = false

        DataMgr.Bundle.load("sound/gxhd", cc.AudioClip, (err, res: cc.AudioClip) => {
            if (!err) {
                return
            }

            cc.audioEngine.playEffect(res, false)
        })
    }

    setParam(data) {
        this.param = data
    }

    initEvent() {

    }

    initButton() {
        this.setButtonClick("btnOpen", () => this.showAni())
    }

    initData() {
        let awards = this.param.awards
        if (!awards) {
            return
        }

        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        let lottery = user.items[Constants.ITEM_INDEX.LOTTERY]
        
        this._count = awards.length
        for (let i in awards) {
            let a = awards[i]
            let node = cc.instantiate(this.itemNode)
            node.active = true
            node.parent = this.node
            node.name = "item" + a.item_id            
            if (a.item_id === Constants.ITEM_INDEX.WCOIN) {
                this.setSpriteFrame("icon", node, "image/icon/many_weibi", true)
                this.setLabelValue("num", node, "" + a.item_num)
            } else if (a.item_id === Constants.ITEM_INDEX.LOTTERY) {
                this.setSpriteFrame("icon", node, "image/icon/dianquan1", true)
                this.setLabelValue("num", node, "" + a.item_num)
            } else if (a.item_id === Constants.ITEM_INDEX.DIAMOND) {
                this.setSpriteFrame("icon", node, "image/icon/jinbi1", true)
                this.setLabelValue("num", node, "" + Helper.FormatNumPrice(a.item_num / 100))
            }

            this.setLabelValue("name", node, User.GetItemInfo(a.item_id).name)
            this.setNodePositionX("item" + i, (500 / (this._count + 1)) * Number(i))

            user.items[a.item_id].num -= Number(a.item_num)
        }

        DataMgr.setData(Constants.DATA_DEFINE.USER_INFO, user)
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_USER_ITEM)

        let str = ""
        if (lottery.num >= 100000) {
            str = "<color=#ffffff>我的奖券：</c><color=#ffec69>"
            str += lottery.num + "</c><color=#ffffff>，已经可以兑换物品</c>"
        } else {
            str = "<color=#ffffff>我的奖券：</c><color=#ffec69>"
            str += lottery.num + "</c><color=#ffffff>，差 </c><color=#ffec69>"
            str += (100000 - lottery.num) + "</c><color=#ffffff> 可以兑换物品</c>"
        }
        this.setRichTextValue("msg", str)
    }

    // updateData() {
    //     let data = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
    //     if (!data) {
    //         return
    //     }

    //     let lottery = data.lottery || 0
    //     let wcoin = data.wcoin || 0
    //     let diamond = data.diamond || 0
    //     for (let idx in data.items) {        
    //         let i = data.items[idx]
    //         if (i.id === Constants.ITEM_INDEX.LOTTERY) {
    //             lottery += i.num
    //         } else if (i.id === Constants.ITEM_INDEX.WCOIN) {
    //             wcoin += i.num
    //         } else if (i.id === Constants.ITEM_INDEX.DIAMOND) {
    //             diamond += i.num
    //         }
    //     }

    //     if (this.state == 0) {
    //         this.param.awards[0].item_id = this.param.awards[0].item_id || 0
    //         if (this.param.awards[0].item_id == Constants.ITEM_INDEX.LOTTERY) {
    //             lottery -= this.param.awards[0].item_num
    //         } else if (this.param.awards[0].item_id == Constants.ITEM_INDEX.WCOIN) {
    //             wcoin -= this.param.awards[0].item_num
    //         } else if (this.param.awards[0].item_id == Constants.ITEM_INDEX.DIAMOND) {
    //             diamond -= (this.param.awards[0].item_num / 100)
    //         }

    //         this._lottery = lottery
    //         this._wcoin = wcoin
    //         this._diamond = diamond

    //         this.setLabelValue("topNode/lottery/num", Helper.FormatNumWY(lottery))
    //         this.setLabelValue("topNode/wcoin/num", Helper.FormatNumWY(wcoin))
    //         this.setLabelValue("topNode/diamond/num", diamond >= 10000 ? Helper.FormatNumWY(diamond) : Helper.FormatNumPrice(diamond / 100))
    //     } else {
    //         this.setLabelValue("topNode/lottery/num", Helper.FormatNumWY(lottery))
    //         this._lottery = lottery

    //         if (null !== this._wcoin && this._wcoin !== wcoin) {
    //             this.stopTween("topNode/wcoin")
    //             this.runTween("topNode/wcoin", Helper.TokenAni(this._wcoin, wcoin, (src) => {
    //                 this.setLabelValue("topNode/wcoin/num", Helper.FormatNumWY(src))
    //                 this._wcoin = src
    //             }))
    //         } else {
    //             this.setLabelValue("topNode/wcoin/num", Helper.FormatNumWY(wcoin))
    //             this._wcoin = wcoin
    //         }

    //         if (null !== this._diamond && this._diamond < 10000 && this._diamond !== diamond) {
    //             this.stopTween("topNode/diamond")
    //             this.runTween("topNode/diamond", Helper.TokenAni(this._diamond, diamond, (src) => {
    //                 this.setLabelValue("topNode/diamond/num", src >= 10000 ? Helper.FormatNumWY(src) : Helper.FormatNumPrice(src / 100))
    //                 this._diamond = src
    //             }))
    //         } else {
    //             this.setLabelValue("topNode/diamond/num", diamond >= 10000 ? Helper.FormatNumWY(diamond) : Helper.FormatNumPrice(diamond / 100))
    //             this._diamond = diamond
    //         }
    //     }
    // }

    // openBox() {
    //     if (this.state == 0) {
    //         this.state = 1
    //         this.btnOpen.getComponent(cc.Button).interactable = false
    //         console.log("btnOpen on click")

    //         this.spLiBaoSpine.clearTracks()
    //         this.spLiBaoSpine.setAnimation(2, "dakai", false)
    //         this.spLiBaoSpine.addAnimation(2, "jiesu", true)

    //         this.itemNode.y = -70
    //         this.itemNode.active = false
    //         this.itemNum.active = false
    //         cc.tween(this.itemNode)
    //             .delay(0.1)
    //             .set({ active: true })
    //             .to(0.6, { y: 300 })
    //             .to(0.2, { y: 250 })
    //             .call(() => {
    //                 this.itemNum.active = true
    //                 this.btnOpen.getComponent(cc.Button).interactable = true
    //             })
    //             .start()

    //         cc.tween(this.itemNode)
    //             .delay(0.1)
    //             .set({ scale: 0.0 })
    //             .to(0.6, { scale: 1 })
    //             .start()

    //         this.updateData()
    //     }
    // }

    // 
    showAni() {
        this.node.children.forEach(i => i.active = false)
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        let awards = this.param.awards
        for (let i in awards) {
            let a = awards[i]
            let n = this.getNode("item" + a.item_id)
            let pos = this.node.convertToWorldSpaceAR(n.position)

            user.items[a.item_id].num += Number(a.item_num)
            this.createAni(a.item_id, Number(a.item_num), pos, user)
        }

        
    }

    createAni(id: number, num: number, startPos: cc.Vec3, user) {
        num = Math.max(10, num > 20 ? 20 : num)
        for (let i = 0; i < num; i++) {
            let pos = cc.Vec2.ZERO
            pos.x = startPos.x + Math.random() * 100 - 50
            pos.y = startPos.y + Math.random() * -20
            let spt = new cc.Node()
            spt.addComponent(cc.Sprite)
            cc.director.getScene().addChild(spt)
            spt.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.TRIMMED
            let tPos = cc.Vec2.ZERO
            if (id === Constants.ITEM_INDEX.WCOIN) {
                this.setSpriteFrame(spt, "image/icon/big_weibi")
                tPos = this.node.convertToNodeSpace(cc.v2(cc.winSize.width / 3 + 50, cc.winSize.height - 120))
            } else if (id === Constants.ITEM_INDEX.LOTTERY) {
                this.setSpriteFrame(spt, "image/icon/daoju-jiangquan1")
                tPos = this.node.convertToNodeSpace(cc.v2(cc.winSize.width / 3 - 50, cc.winSize.height - 120))
            } else if (id === Constants.ITEM_INDEX.DIAMOND) {
                this.setSpriteFrame(spt, "image/icon/big_zuanshi")
                tPos = this.node.convertToNodeSpace(cc.v2(cc.winSize.width / 3 * 2 + 80, cc.winSize.height - 120))
            }
            
            spt.width = 39
            spt.height = 40

            spt.setPosition(startPos)
            spt.setScale(1)

            let x = Math.random() * 200 - 100
            let y = Math.random() * 200
            
            var born = [cc.v2(startPos.x, startPos.y), cc.v2(startPos.x + (pos.x - startPos.x) / 2, startPos.y + Math.random() * 80), pos]
            var bezier = [cc.v2(pos.x - x, pos.y + y), cc.v2(pos.x - x, pos.y + y), tPos]//cc.v2(cc.winSize.width / 2 - 40, cc.winSize.height - 126)];
            var bezierTo = cc.bezierTo(.8, bezier);
            let t = null
            if (i === num - 1) {
                t = cc.tween()
                .call(() => {
                    DataMgr.setData(Constants.DATA_DEFINE.USER_INFO, user)
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_USER_ITEM, {bAni: true})
                    this.close()
                })
            } else {
                t = cc.tween().delay(0)
            }

            cc.tween(spt)
                .delay(0.02 * i)
                .parallel(
                    cc.tween()
                    .delay(.1)
                    .to(.1, {position: cc.v3(born[1])})
                    .to(.15, {position: cc.v3(born[2])}),
                    cc.tween()
                    .to(.2, {scale: 1.5})
                )
                .delay(.3)
                .parallel(
                    cc.tween().then(bezierTo),
                    cc.tween().to(.8, {scale: 1})
                )
                .to(0.2, { opacity: 0 })
                .then(t)
                .call(() => {
                    spt.destroy()
                })                
                .start()
        }
    }
}
