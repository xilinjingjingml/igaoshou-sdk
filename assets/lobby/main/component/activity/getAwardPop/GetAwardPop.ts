import BaseUI from "../../../../start/script/base/BaseUI";
import { EventMgr } from "../../../../start/script/base/EventMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { User } from "../../../../start/script/data/User";
import { Helper } from "../../../../start/script/system/Helper";
import { UserSrv } from "../../../../start/script/system/UserSrv";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GetAwardEntry extends BaseUI {
    @property(cc.Layout)
    itemArea: cc.Layout = null
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

    @property({ type: cc.AudioClip })
    sound = null

    onOpen() {
        console.log("GetAwardEntry onOpen", this.param)
        this.initEvent()
        this.initData()
        this.initButton()
        // this.updateData()
        this.node.zIndex = 11

        this.sound && cc.audioEngine.playEffect(this.sound, false)

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_BANNER)
    }

    onClose() {
        cc.log("===getAwardclose")
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BANNER)
    }

    onLoad() {
        //this.runTween("node/light", cc.tween().repeatForever(cc.tween().to(2, { angle: 180 }).to(2, { angle: 360 }).set({ angle: 0 })))
        this.itemNode.active = false

        // DataMgr.data.Bundle.load("sound/gxhd", cc.AudioClip, (err, res: cc.AudioClip) => {
        //     if (!err) {
        //         return
        //     }
        //     cc.audioEngine.playEffect(res, false)
        // })
    }

    setParam(data) {
        this.param = data
    }

    initEvent() {

    }

    initButton() {
        this.setButtonClick("node/btnOpen", () => this.param.noShowAni === true ? this.close() : this.showAni())
    }

    initData() {
        if (this.param.member) {
            cc.find("node/membertip", this.node).active = true
        }
        let nodes = this.getNode("node")
        nodes.active = false

        if (!this.param.awards) {
            this.close()
        }

        this.param.awards.forEach(i => {
            i.item_id = i.item_id || i.id
            i.item_num = i.item_num || i.num
        })

        let awards = this.param.awards.filter(i => undefined !== i.item_id)
        if (!awards) {
            this.close()
        }

        this._count = awards.length
        for (let i in awards) {
            let a = awards[i]
            let node = cc.instantiate(this.itemNode)
            if (this._count == 1) {
            } else if (this._count == 2) {
                node.scale = 0.8
            } else {
                node.scale = 0.5
            }
            this.itemArea.node.addChild(node)
            node.active = true
            node.name = "item" + a.item_id
            this.runTween(node.getChildByName("light"), cc.tween().repeatForever(cc.tween().to(2, { angle: 180 }).to(2, { angle: 360 }).set({ angle: 0 })))

            if (a.item_id === Constants.ITEM_INDEX.GOLD) {
                this.setActive("gold", node, true)
                this.setLabelValue("num", node, "" + a.item_num)
            } else if (a.item_id === Constants.ITEM_INDEX.LOTTERY) {
                this.setActive("lottery", node, true)
                this.setLabelValue("num", node, "" + a.item_num)
                this.setSpriteFrame("itemname", node, "component/activity/getAwardPop/image/jiangquan", true)
                if (!this.param.noShowAni) {
                    User.Lottery -= Number(a.item_num)
                }
            } else if (a.item_id === Constants.ITEM_INDEX.CREDITS) {
                this.setActive("credits", node, true)
                this.setLabelValue("num", node, "" + a.item_num)
            } else if (a.item_id === Constants.ITEM_INDEX.MemberCard) {
                this.setActive("member", node, true)
                this.setLabelValue("num", node, "" + a.item_num + "天")
                this.setSpriteFrame("itemname", node, "component/activity/getAwardPop/image/huiyuantouxiangkuang", true)
            } else if (a.item_id === Constants.ITEM_INDEX.TURNTABLE) {
                this.setActive("turntable", node, true)
                this.setLabelValue("num", node, "" + a.item_num)
            }
            if (UserSrv.GetItemInfo(a.item_id)) {
                this.setLabelValue("name", node, UserSrv.GetItemInfo(a.item_id).name)
            }
            //this.setNodePositionX("item" + i, (500 / (this._count + 1)) * Number(i))
        }

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_USER_ITEM)

        let str = ""
        if (User.Lottery >= 100000) {
            str = "<color=#ffffff>我的奖券：</c><color=#ffec69>"
            str += User.Lottery + "</c><color=#ffffff>，已经可以兑换物品</c>"
        } else {
            str = "<color=#ffffff>我的奖券：</c><color=#ffec69>"
            str += User.Lottery + "</c><color=#ffffff>，差 </c><color=#ffec69>"
            str += (100000 - User.Lottery) + "</c><color=#ffffff> 可以兑换物品</c>"
        }
        this.setRichTextValue("msg", str)

        //TODO 界面动画弹出
        cc.tween(nodes)
            .call(() => {
                nodes.active = true
                nodes.opacity = 0
                nodes.scale = 0.1
            })
            .to(0.25, { opacity: 255, scale: 1.2 })
            .to(0.06, { scale: 1 })
            .start()
    }

    showAni() {
        this.node.children.forEach(i => i.active = false)
        let awards = this.param.awards
        for (let i in awards) {
            let a = awards[i]
            let n = this.getNode("item" + a.item_id)
            let pos = this.node.convertToWorldSpaceAR(n.position)

            this.createAni(a.item_id, Number(a.item_num), pos)
        }
    }

    createAni(id: number, num: number, startPos: cc.Vec3) {
        let dirs = DataMgr.getData<cc.Vec2[]>(Constants.DATA_DEFINE.MAIN_SCENE_TOKEN_POS)
        let src = num
        num = Math.max(10, num > 20 ? 20 : num)
        for (let i = 0; i < num; i++) {
            let pos = cc.Vec2.ZERO
            pos.x = startPos.x + Math.random() * 100 - 50
            pos.y = startPos.y + Math.random() * -20
            let spt = new cc.Node()
            spt.addComponent(cc.Sprite)
            cc.director.getScene().addChild(spt)
            spt.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.TRIMMED
            let tPos = this.node.convertToNodeSpace(dirs[id] || cc.Vec2.ZERO)
            if (id === Constants.ITEM_INDEX.GOLD) {
                this.setSpriteFrame(spt, this.getNodeComponent("gold", this.itemNode, cc.Sprite).spriteFrame)
                // tPos = this.node.convertToNodeSpace(cc.v2(155, cc.winSize.height - 90))
            } else if (id === Constants.ITEM_INDEX.LOTTERY) {
                this.setSpriteFrame(spt, this.getNodeComponent("lottery", this.itemNode, cc.Sprite).spriteFrame)
                // tPos = this.node.convertToNodeSpace(cc.v2(565, cc.winSize.height - 90))
            } else if (id === Constants.ITEM_INDEX.CREDITS) {
                this.setSpriteFrame(spt, this.getNodeComponent("credits", this.itemNode, cc.Sprite).spriteFrame)
                // tPos = this.node.convertToNodeSpace(cc.v2(365, cc.winSize.height - 90))
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
                        if (id === Constants.ITEM_INDEX.LOTTERY) {
                            User.Lottery += src
                        } else if (id === Constants.ITEM_INDEX.DIAMOND) {
                            User.Diamond += src
                        }
                        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_USER_ITEM, { bAni: true })
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
                        .to(.1, { position: cc.v3(born[1]) })
                        .to(.15, { position: cc.v3(born[2]) }),
                    cc.tween()
                        .to(.2, { scale: 1.5 })
                )
                .delay(.3)
                .parallel(
                    cc.tween().then(bezierTo),
                    cc.tween().to(.8, { scale: 1 })
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
