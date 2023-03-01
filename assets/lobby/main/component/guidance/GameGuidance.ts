import BaseUI from "../../../start/script/base/BaseUI";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { Constants } from "../../../start/script/igsConstants";
import { Helper } from "../../../start/script/system/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameGuidance extends BaseUI {

    _index: number = -1
    _guideId: number = 0;

    maskBg: cc.Node = null
    autoMask = false
    onOpen() {
        cc.log("===GameGuied pop===", this.param.index)
        let index = this.param.index
        if (undefined === index || null === index) {
            this.close()
        }

        this._index = index
        // Helper.reportEvent("新手引导", "加载新手引导", "配置ID" + this._index + "加载")
        let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
        if (record[this._index] === 1) {
            this.close()
        }

        this.initEvent()
        this.initData()

        this.node.zIndex = 10

        if (!this.autoMask) {
            this.maskBg.width = 0
            this.maskBg.height = 0
        }

        // EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_BANNER)
    }

    onLoad() {
        cc.log("===GameGuied onLoad===")
        this.maskBg = cc.find("maskBg", this.node)
        let mask = cc.find("maskBg/mask", this.node)
        mask.width = cc.winSize.width * 2
        mask.height = cc.winSize.height * 2

        this.maskBg.width = cc.winSize.width * 2
        this.maskBg.height = cc.winSize.height * 2
    }

    onClose() {
        if (this._index === -1) {
            return
        }

        this.saveTag()
    }

    initEvent() {
        this.setButtonClick("Step0/btnNext", this.onPressNext.bind(this))
        this.setButtonClick("Step1/btnNext", this.onPressNext.bind(this))
        this.setButtonClick("Step2/btnNext", this.onPressNext.bind(this))
        // this.setButtonClick("Step3/btnNext", this.onPressNext.bind(this))
        this.setButtonClick("Step4/tishikuang1-2/btnNext", this.onPressNext.bind(this))
        this.setButtonClick("Step5/tishikuang1-2/btnNext", this.onPressNext.bind(this))
        this.setButtonClick("Step31/tishikuang1-2/btnNext", this.onPressNext.bind(this))
        this.setButtonClick("Step4/mask", this.onPressNext.bind(this))
        this.setButtonClick("Step5/mask", this.onPressNext.bind(this))
        // this.setButtonClick("Step6/tishikuang1-2/btnNext", this.onPressNext.bind(this))
        this.setButtonClick("Step7/tishikuang1-2/btnNext", this.onPressNext.bind(this))
        this.setButtonClick("Step18/tishikuang1-1/btnNext", this.onPressNext.bind(this))
    }

    initData() {
        this.setActive("Step" + this._index, true)
        this["initStep" + this._index] && this["initStep" + this._index]()

        // Helper.reportEvent("新手引导", "加载新手引导", "配置ID " + this._guideId + " 加载")
        if (this._guideId === 101) {
            Helper.reportEvent("匹配-3.4、匹配引导弹出")
        } else if (this._guideId === 111) {
            Helper.reportEvent("首局结算-5.2、首局胜利引导")
            if (window["wx"]) {
                window["wx"].reportEvent('expt_first_game_guide', { expt_data: 1 })
                console.log("===expt_first_game_guide===")
            }
        } else if (this._guideId === 112) {
            Helper.reportEvent("首局结算-5.2.1、红包兑换指引弹出")
        } else if (this._guideId === 115) {
            Helper.reportEvent("首局结算-5.2.2、兑换指引1弹出")
        } else if (this._guideId === 116) {
            Helper.reportEvent("首局结算-5.2.3、兑换指引2弹出")
        } else if (this._guideId === 122) {
            Helper.reportEvent("第二局-6.1、公平竞技指引弹出")
        } else if (this._guideId === 125) {
            Helper.reportEvent("段位引导-9.1、段位引导弹出")
        }
    }

    onPressNext() {
        this.close()
    }

    saveTag() {
        let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
        record[this._index] = 1
        DataMgr.setData(Constants.DATA_DEFINE.NEWBIE_LIST, record, true)

        // Helper.reportEvent("新手引导", "加载新手引导", "配置ID " + this._guideId + " 关闭")
        if (this._guideId === 101) {
            Helper.reportEvent("匹配-3.4、匹配引导确认")
        } else if (this._guideId === 111) {
            Helper.reportEvent("首局结算-5.2.0.1、首局胜利引导关闭")
        } else if (this._guideId === 112) {
            Helper.reportEvent("首局结算-5.2.1.1、红包兑换指引关闭")
        } else if (this._guideId === 115) {
            Helper.reportEvent("首局结算-5.2.2.1、兑换指引1关闭")
        } else if (this._guideId === 116) {
            Helper.reportEvent("首局结算-5.2.3.1、兑换指引2关闭")
        } else if (this._guideId === 122) {
            Helper.reportEvent("第二局-6.1.1、公平竞技指引关闭")
        } else if (this._guideId === 125) {
            Helper.reportEvent("段位引导-9.1.1、段位引导关闭")
        }
    }

    setNodeXuxian(node: cc.Node | cc.Node[], name: string = null) {
        let content = cc.Size.ZERO
        if (node) {
            name = name || "Step" + this._index
            let step = this.getNode(name)
            let newNode = new cc.Node()
            newNode.name = "TargetNode"
            newNode.position = cc.Vec3.ZERO
            // newNode.parent = step
            newNode.setContentSize(step.getContentSize())
            let cpos = null
            let cpNode = (node: cc.Node): cc.Node => {
                // console.log("==node " + node.name + " pos " + node.position)
                let n = cc.instantiate(node)
                // n.parent = newNode
                n.scale = 1
                n.removeComponent(cc.Widget)
                let pos = step.convertToNodeSpaceAR(node.convertToWorldSpaceAR(cc.Vec3.ZERO))
                pos.y += (.5 - n.anchorY) * n.height
                n.setAnchorPoint(.5, .5)
                n.position = pos
                console.log("==node " + n.name + " pos " + pos)

                content.width = Math.max(n.width, content.width)
                content.height += n.height

                if (!cpos) {
                    cpos = pos
                } else {
                    cpos.y = cpos.y - (cpos.y - pos.y) / 2
                    content.height += 30
                    cpos.y -= 10
                }

                return n
            }

            if (node instanceof cc.Node) {
                newNode = cpNode(node)
                newNode.name = "TargetNode"
            } else {
                node.forEach(i => newNode && newNode.addChild(cpNode(i)))
            }

            newNode.parent = step
            content.width += 10
            content.height += 10
            this.setNodeSize(name + "/xuxian", content)
            this.setNodePosition(name + "/xuxian", cpos)

            let kuang = this.getNode(name + "/tishikuang1-2")
            if (kuang.scaleY > 0) {
                this.setNodePositionY(kuang, cpos.y - content.height / 2 - 10)
            } else {
                this.setNodePositionY(kuang, cpos.y + content.height / 2 + 10)
            }

            this.maskBg.position = cpos
            cc.tween(this.maskBg)
                .to(0.5, { width: content.width, height: content.height })
                .start()
            this.autoMask = true
        }
    }

    starAwardAni(startPos: cc.Vec3, type: number, callback?: Function) {
        let num = 30
        for (let i = 0; i < num; i++) {
            let pos = cc.Vec2.ZERO
            pos.x = startPos.x + Math.random() * 100 - 50
            pos.y = startPos.y + Math.random() * 100 - 50
            let spt = new cc.Node()
            spt.addComponent(cc.Sprite)
            cc.director.getScene().addChild(spt)
            spt.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.TRIMMED
            if (type === 0) {
                if (Math.random() > .5) {
                    this.setSpriteFrame(spt, "image/icon/daoju-jiangquan1")
                } else {
                    this.setSpriteFrame(spt, "image/icon/big_zuanshi")
                }
            } else {
                this.setSpriteFrame(spt, "image/icon/big_weibi")
            }

            spt.width = 39
            spt.height = 40

            spt.setPosition(pos)
            spt.setScale((Math.random() * 5) / 10 + 0.5)

            let x = Math.random() * 200 - 100
            let y = Math.random() * 200
            var bezier = [cc.v2(pos.x - x, pos.y + y), cc.v2(pos.x - x, pos.y + y), cc.v2(cc.winSize.width / 2 + (Math.random() * 80) - 40, cc.winSize.height - 120)];
            var bezierTo = cc.bezierTo(0.8, bezier);
            cc.tween(spt)
                .delay(0.02 * i)
                .then(bezierTo)
                .to(0.2, { opacity: 0 })
                .call(() => {
                    spt.destroy()
                    if (i === num - 1) {
                        callback && callback()
                    }
                })
                .start()
        }
    }

    initStep0() {
        this._guideId = 101

        //Helper.reportEvent("大厅引导1", "匹配对手提示", "")
    }

    initStep1() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        let target = this.getNodeComponent("Step1/TargetNode", cc.Button)
        let event = target.clickEvents
        target.clickEvents = []
        this.setButtonClick(target.node, () => {
            this.onPressNext()
            if (node && node.isValid) {
                event.forEach(e => node.getComponent(e.component)[e.handler]?.(e.customEventData))
            }
        })

        let jiantou = this.getNode("Step1/jiantou")
        jiantou.setSiblingIndex(jiantou.parent.childrenCount)

        let pos = target.node.position
        pos.x += target.node.width / 2 - 60
        pos.y += 50
        jiantou.position = pos

        cc.tween(jiantou).repeatForever(cc.tween().by(.5, { y: -30 }).by(.5, { y: 30 })).start()

        this._guideId = 121

        //Helper.reportEvent("大厅引导2", "第二局指引", "")
    }

    initStep2() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        let target = this.getNodeComponent("Step2/TargetNode", cc.Button)

        let jiantou = this.getNode("Step2/jiantou")
        jiantou.setSiblingIndex(jiantou.parent.childrenCount)
        let pos = target.node.position
        pos.x += target.node.width / 2 - 60
        pos.y -= 50
        jiantou.position = pos

        let event = target.clickEvents
        target.clickEvents = []
        this.setButtonClick(target.node, () => {
            this.onPressNext()
            if (node && node.isValid) {
                event.forEach(e => node.getComponent(e.component)[e.handler]?.(e.customEventData))
            }
        })

        if (DataMgr.data.OnlineParam.guideRealTime === 1) {
            this.setLabelValue("Step2/tishikuang1-2/label", "恭喜你解锁实时赛，快去看看吧！")
        } else if (DataMgr.data.OnlineParam.guideBattle === 1) {
            this.setLabelValue("Step2/tishikuang1-2/label", "恭喜你解锁对战赛，快去看看吧！")
        }
    }

    initStep3() {

    }

    initStep4() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        this._guideId = 134

        //Helper.reportEvent("大厅", "对手未完成比赛", "")
    }

    initStep5() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        this._guideId = 135

        //Helper.reportEvent("大厅", "正在匹配对手", "")
    }

    initStep6() {
        let nodes: cc.Node = this.param.nodes
        this.setNodeXuxian(nodes)

        let onNext = () => {
            this.onPressNext()
        }

        this.setButtonClick("Step6/tishikuang1-2/btnNext", onNext)

        this._guideId = 111
        //Helper.reportEvent("大厅引导2", "首局胜利指引", "")
    }

    initStep7() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        this._guideId = 141

        let target = this.getNodeComponent("Step7/TargetNode", cc.Button)
        // target.clickEvents.forEach(b => b.target = node)
        this.setButtonClick(target.node, this.onPressNext.bind(this))
        this.setButtonClick("Step7/btnNext", this.onPressNext.bind(this))

        //Helper.reportEvent("大厅引导3", "再来一局比赛指引", "")
    }

    initStep8() {
        let nodes: cc.Node = this.param.nodes
        this.setNodeXuxian(nodes[1])

        let target = this.getNode("Step8/TargetNode")

        this.setNodePositionY("Step8/tishikuang1-2", target.position.y + 10)


        let onNext = () => {
            // this.setActive("Step8", false)
            // this.saveTag()
            // if (this.param.league) {
            //     this.param.node = this.param.league
            // }
            // this._index = 9
            // this.initData()
            this.close()
        }

        this.setButtonClick("Step8/btnNext", onNext)
        this.setButtonClick("Step8/tishikuang1-2/btnNext", onNext)

        this._guideId = 151

        //Helper.reportEvent("大厅", "主页赛事列表", "")
    }

    initStep9() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        this.setButtonClick("Step9/btnNext", this.onPressNext.bind(this))
        this.setButtonClick("Step9/tishikuang1-2/btnNext", this.onPressNext.bind(this))

        this._guideId = 152

        //Helper.reportEvent("大厅", "等级引导", "")
    }

    initStep10() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        let target = this.getNode("Step10/TargetNode")
        this.setNodePosition("Step10/bg", target.position)
        this.setNodeSize("Step10/bg", target.getContentSize())

        let onNext = () => {
            this.setActive("Step10", false)
            this.saveTag()
            if (this.param.static) {
                this.param.node = this.param.static
            }
            this._index = 11
            this.maskBg.width = cc.winSize.width * 2
            this.maskBg.height = cc.winSize.height * 2
            this.initData()
        }

        this.setButtonClick("Step10/btnNext", onNext)
        this.setButtonClick("Step10/tishikuang1-2/btnNext", onNext)

        this._guideId = 161

        //Helper.reportEvent("大厅", "排行榜记录指引", "")
    }

    initStep11() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        this.setButtonClick("Step11/btnNext", this.onPressNext.bind(this))
        this.setButtonClick("Step11/tishikuang1-2/btnNext", this.onPressNext.bind(this))

        this._guideId = 162

        //Helper.reportEvent("大厅", "排行榜奖励指引", "")
    }

    initStep12() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        this.setButtonClick("Step12/btnNext", () => {
            this.setActive("Step12", false)
            let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
            if (DataMgr.data.Config.platId !== 5 && record[3] === 1) {
                this.saveTag()
                this._index = 13
                this.maskBg.width = cc.winSize.width * 2
                this.maskBg.height = cc.winSize.height * 2
                this.initData()
            } else {
                this.close()
            }
        })

        this.setActive("Step12/btnNext", false)

        this.getNode("Step12/btnNext").setSiblingIndex(this.getNode("Step12").childrenCount)

        this._guideId = 171

        //Helper.reportEvent("大厅", "练习赛指引", "")
    }

    initStep13() {
        this.setButtonClick("Step13/btnNext", () => {
            this.setButtonInfo("Step13/btnNext", { instantiate: false })
            this.setButtonInfo("Step13/btnClose", { instantiate: false })
            let w = this.getNode("Step13/wcoin")
            let pos = w.parent.convertToWorldSpaceAR(cc.v3(0, w.position.y))
            this.starAwardAni(pos, 1, () => this.close())
        })

        this.setButtonClick("Step13/btnClose", () => {
            this.setButtonInfo("Step13/btnNext", { instantiate: false })
            this.setButtonInfo("Step13/btnClose", { instantiate: false })
            let w = this.getNode("Step13/wcoin")
            let pos = w.parent.convertToWorldSpaceAR(cc.v3(0, w.position.y))
            this.starAwardAni(pos, 1, () => this.close())
        })

        this._guideId = 172

        //Helper.reportEvent("大厅", "练习赛奖励", "")
    }

    initStep14() {
        let nodes: cc.Node[] = this.param.nodes
        if (nodes) {
            let content = cc.Size.ZERO
            let pos = cc.Vec3.ZERO
            let left = 0
            let right = 0
            for (let n of nodes) {
                let newNode = cc.instantiate(n)
                newNode.name = "TargetNode"
                newNode.removeComponent(cc.Widget)
                let step = this.getNode("Step14")
                step.addChild(newNode)

                let p = step.convertToNodeSpaceAR(n.convertToWorldSpaceAR(cc.Vec3.ZERO))
                newNode.position = p

                content.height = newNode.height
                pos.y = p.y
                left = Math.min(p.x - newNode.width * newNode.anchorX, left)
                right = Math.max(p.x + newNode.width * newNode.anchorX, right)
            }
            this.setNodePosition("Step14/xuxian", pos)

            content.width = right - left + 10
            content.height += 10
            this.setNodeSize("Step14/xuxian", content)

            this.setNodePositionY("Step14/tishikuang1-2", pos.y + content.height / 2 + 10)
        }

        this.setButtonClick("Step14/btnNext", this.onPressNext.bind(this))
        this.setButtonClick("Step14/tishikuang1-2/btnNext", this.onPressNext.bind(this))

        this._guideId = 181

        //Helper.reportEvent("大厅", "兑换引导", "")
    }

    initStep15() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        let target = this.getNodeComponent("Step15/TargetNode", cc.Button)
        let event = target.clickEvents
        target.clickEvents = []
        this.setButtonClick(target.node, () => {
            this.onPressNext()
            if (node && node.isValid) {
                event.forEach(e => node.getComponent(e.component)[e.handler]?.(e.customEventData))
            }
        })

        let jiantou = this.getNode("Step15/jiantou")
        jiantou.setSiblingIndex(jiantou.parent.childrenCount)

        let pos = target.node.position
        pos.x += 0
        pos.y += 150
        jiantou.position = pos

        cc.tween(jiantou).repeatForever(cc.tween().by(.5, { y: -30 }).by(.5, { y: 30 })).start()

        this._guideId = 113
    }

    initStep16() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        let onNext = () => {
            this.onPressNext()
        }

        let target = this.getNodeComponent("Step16/TargetNode", cc.Button)
        let event = target.clickEvents
        target.clickEvents = []
        this.setButtonClick(target.node, () => {
            this.onPressNext()
            if (node && node.isValid) {
                event.forEach(e => node.getComponent(e.component)[e.handler]?.(e.customEventData))
            }
        })
        this.setButtonClick("Step16/tishikuang1-2/btnNext", onNext)

        let tween = cc.tween().set({ opacity: 0 }).delay(2).to(.5, { opacity: 255 })
        this.runTween("Step16/tishikuang1-2/btnNext/shou1", tween)

        this._guideId = 115
    }

    initStep17() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        let onNext = () => {
            this.onPressNext()
        }

        let target = this.getNodeComponent("Step17/TargetNode", cc.Button)
        let event = target.clickEvents
        target.clickEvents = []
        this.setButtonClick(target.node, () => {
            this.onPressNext()
            if (node && node.isValid) {
                event.forEach(e => node.getComponent(e.component)[e.handler]?.(e.customEventData))
            }
        })

        let jiantou = this.getNode("Step17/jiantou")
        jiantou.setSiblingIndex(jiantou.parent.childrenCount)

        let pos = target.node.position
        pos.x += 0
        pos.y += 50
        jiantou.position = pos

        cc.tween(jiantou).repeatForever(cc.tween().by(.5, { y: -30 }).by(.5, { y: 30 })).start()

        this._guideId = 116
    }

    initStep18() {
        let nodes: cc.Node = this.param.nodes
        this.setNodeXuxian(nodes)

        let onNext = () => {
            this.onPressNext()
            // UIMgr.OpenUI("component/Exchange/ExchangeLotteryEntry", {})
        }

        let guide = this.getNode("Step18/TargetNode/guide")
        guide.addComponent(cc.Button)
        let target = this.getNodeComponent(guide, cc.Button)
        this.setButtonClick(target.node, onNext)

        let jiantou = this.getNode("Step18/jiantou")
        jiantou.setSiblingIndex(jiantou.parent.childrenCount)

        let pos = target.node.position
        pos.x += target.node.width / 2 - 60
        pos.y += 50
        jiantou.position = pos

        let tishikuang = this.getNode("Step18/tishikuang1-1")
        tishikuang.y = pos.y + 200

        cc.tween(jiantou).repeatForever(cc.tween().by(.5, { y: -30 }).by(.5, { y: 30 })).start()


        // if (User.Lottery < 3000) {
        //     this.setLabelValue("Step18/tishikuang1-2/label", "点击这里可以兑换红包，快来看看吧！")
        //     // this._guideId = 114
        //     //Helper.reportEvent("大厅引导2", "首局红包不足兑换指引 ", "")
        // } else {
        //     let awards: TItems = this.param.awards
        //     for (let i in awards) {
        //         if (awards[i].id === Constants.ITEM_INDEX.LOTTERY) {
        //             this.setLabelValue("Step18/tishikuang1-2/label", "现在可以兑换红包，快来试试吧！")
        //             break
        //         }
        //     }
        // }

        this._guideId = 112
    }

    initStep19() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        let onNext = () => {
            this.onPressNext()
        }

        let target = this.getNodeComponent("Step19/TargetNode", cc.Button)
        let event = target.clickEvents
        target.clickEvents = []
        this.setButtonClick(target.node, () => {
            this.onPressNext()
            if (node && node.isValid) {
                event.forEach(e => node.getComponent(e.component)[e.handler]?.(e.customEventData))
            }
        })

        let jiantou = this.getNode("Step19/jiantou")
        jiantou.setSiblingIndex(jiantou.parent.childrenCount)

        let pos = target.node.position
        pos.x += 0
        pos.y += 50
        jiantou.position = pos

        cc.tween(jiantou).repeatForever(cc.tween().by(.5, { y: -30 }).by(.5, { y: 30 })).start()

        this._guideId = 117
        //Helper.reportEvent("大厅", "赢取更多奖券", "")
    }

    initStep20() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        let target = this.getNodeComponent("Step20/TargetNode", cc.Button)
        let event = target.clickEvents
        target.clickEvents = []
        this.setButtonClick(target.node, () => {
            this.onPressNext()
            if (node && node.isValid) {
                event.forEach(e => node.getComponent(e.component)[e.handler]?.(e.customEventData))
            }
        })

        let jiantou = this.getNode("Step20/jiantou")
        jiantou.setSiblingIndex(jiantou.parent.childrenCount)

        let pos = target.node.position
        pos.x += 0
        pos.y += 50
        jiantou.position = pos

        cc.tween(jiantou).repeatForever(cc.tween().by(.5, { y: -30 }).by(.5, { y: 30 })).start()

        this._guideId = 114
        //Helper.reportEvent("大厅", "获胜兑换指引2", "")
    }

    initStep21() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        let onNext = () => {
            this.onPressNext()
        }

        let target = this.getNodeComponent("Step21/TargetNode", cc.Button)
        // target.clickEvents.forEach(b => b.target = node)
        target.clickEvents = []
        this.setButtonClick(target.node, onNext)
        this.setButtonClick("Step21/tishikuang1-2/btnNext", onNext)

        this._guideId = 125
        //Helper.reportEvent("大厅", "结算段位引导", "")
    }

    initStep22() {
        this.setActive("Step2", true)

        let node: cc.Node = this.param.node
        this.setNodeXuxian(node, "Step2")

        let target = this.getNodeComponent("Step2/TargetNode", cc.Button)

        let jiantou = this.getNode("Step2/jiantou")
        jiantou.setSiblingIndex(jiantou.parent.childrenCount)
        let pos = target.node.position
        pos.x = 0
        pos.y -= 50
        jiantou.position = pos

        let event = target.clickEvents
        target.clickEvents = []
        this.setButtonClick(target.node, () => {
            this.onPressNext()
            if (node && node.isValid) {
                event.forEach(e => node.getComponent(e.component)[e.handler]?.(e.customEventData))
            }
        })

        this.setLabelValue("Step2/tishikuang1-2/label", "为了确保比赛的公平, 你与对手的游戏\n内容和时间限制将会完全一致！！")
    }

    initStep23() {
        let nodes: cc.Node = this.param.nodes
        this.setNodeXuxian(nodes[0])

        this.setButtonClick("Step23/tishikuang1-2/btnNext", () => {
            this.saveTag()

            this.setActive("Step23", false)
            this.setActive("Step24", true)
            this.initStep24()
        })
    }

    initStep24() {
        let nodes: cc.Node = this.param.nodes
        this.setNodeXuxian(nodes[1])

        this.setButtonClick("Step24/tishikuang1-2/btnNext", () => {
            this.setActive("Step24", false)
            this.setActive("Step25", true)
            this.initStep25()
        })
    }

    initStep25() {
        let nodes: cc.Node = this.param.nodes
        this.setNodeXuxian(nodes[2])

        this.setButtonClick("Step25/tishikuang1-2/btnNext", () => {
            this.setActive("Step25", false)
            this.setActive("Step26", true)
            this.initStep26()
        })
    }

    initStep26() {
        let nodes: cc.Node = this.param.nodes
        this.setNodeXuxian(nodes[3])

        this.setButtonClick("Step26/tishikuang1-2/btnNext", () => this.close())
    }

    initStep27() {
        this.setActive("Step27/icon/duanwei", true)
        this.setActive("Step27/icon/huodongsai", false)

        this.setRichTextValue("Step27/label", "<color=#fffa67><b>段位功能</c><color=#ffffff><b>已开启，是否前往查看？</color>")

        this.setButtonClick("Step27/btnCancel", () => { this.param.cancel?.(); this.close() })
        this.setButtonClick("Step27/btnCakan", () => { this.param.confirm?.(); this.close() })
    }

    initStep28() {
        this.setActive("Step27", true)
        this.setActive("Step27/icon/duanwei", false)
        this.setActive("Step27/icon/huodongsai", true)

        this.setRichTextValue("Step27/label", "<color=#fffa67><b>活动赛</c><color=#ffffff><b>已开启，是否前往查看？</color>")

        this.setButtonClick("Step27/btnCancel", () => { this.param.cancel?.(); this.close() })
        this.setButtonClick("Step27/btnCakan", () => { this.param.confirm?.(); this.close() })
    }

    initStep29() {
        this.setActive("Step12", true)
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node, "Step12")
       
        this.setActive("Step12/btnNext", false)

        let target = this.getNodeComponent("Step12/TargetNode", cc.Button)
        let event = target.clickEvents
        target.clickEvents = []
        this.setButtonClick(target.node, () => {
            this.onPressNext()
            if (node && node.isValid) {
                event.forEach(e => node.getComponent(e.component)[e.handler]?.(e.customEventData))
            }
        })

        if (this.param.type === Constants.MATCH_TYPE.BATTLE_MATCH) {
            this.setLabelValue("Step12/tishikuang1-2/label", "参加专业赛，可以和玩家进行专业对战！")
        } else if (this.param.type === Constants.MATCH_TYPE.REALTIME_MATCH) {
            this.setLabelValue("Step12/tishikuang1-2/label", "参加实时赛，可以和玩家进行实时对战！")
        } else if (this.param.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            this.setLabelValue("Step12/tishikuang1-2/label", "参加活动赛，可赢取高额奖励！")
        }
    }

    initStep30() {
        this.initStep29()
    }

    initStep31() {
        let nodes: cc.Node = this.param.nodes
        this.setNodeXuxian(nodes)

        //Helper.reportEvent("大厅", "正在匹配对手", "")
    }

    initStep33() {
        let nodes: cc.Node = this.param.nodes
        this.setNodeXuxian(nodes[0])

        this.setButtonClick("Step33/tishikuang1-2/btnNext", () => {
            this.saveTag()
            
            this.setActive("Step33", false)
            this._index = 8
            this.initData()
        })
    }
}
