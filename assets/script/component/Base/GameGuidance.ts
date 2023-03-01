import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { User } from "../../system/User";
import { Helper } from "../../system/Helper";
import { ActivitySrv } from "../../system/ActivitySrv";
import { AdSrv } from "../../system/AdSrv";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameGuidance extends BaseUI {

    _index: number = -1
    _guideId: number = 0;

    onOpen() {
        cc.log("===GameGuied pop===")
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

        this.node.setSiblingIndex(10)
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
        this.setButtonClick("Step6/tishikuang1-2/btnNext", this.onPressNext.bind(this))
        this.setButtonClick("Step7/tishikuang1-2/btnNext", this.onPressNext.bind(this))
    }

    initData() {
        this.setActive("Step" + this._index, true)
        this["initStep" + this._index] && this["initStep" + this._index]()

        Helper.reportEvent("新手引导", "加载新手引导", "配置ID " + this._guideId + " 加载")
    }

    onPressNext() {
        this.close()
    }

    saveTag() {
        let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
        record[this._index] = 1
        DataMgr.setData(Constants.DATA_DEFINE.NEWBIE_LIST, record, true)

        Helper.reportEvent("新手引导", "加载新手引导", "配置ID " + this._guideId + " 关闭")
    }

    setNodeXuxian(node: cc.Node | cc.Node[]) {
        let content = cc.Size.ZERO
        if (node) {
            let step = this.getNode("Step" + this._index)
            let newNode = new cc.Node()
            newNode.name = "TargetNode"
            newNode.position = cc.Vec3.ZERO
            // newNode.parent = step
            newNode.setContentSize(step.getContentSize())
            let cpos = null
            let cpNode = (node: cc.Node): cc.Node => {
                let n = cc.instantiate(node)
                // n.parent = newNode
                n.scale = 1
                n.removeComponent(cc.Widget)
                let pos = step.convertToNodeSpaceAR(node.convertToWorldSpaceAR(cc.Vec3.ZERO))
                pos.y += (.5 - n.anchorY) * n.height
                n.setAnchorPoint(.5, .5)
                n.position = pos

                n.on(cc.Node.EventType.POSITION_CHANGED, () => {
                    pos = step.convertToNodeSpaceAR(n.convertToWorldSpaceAR(cc.Vec3.ZERO))
                    pos.y += (.5 - n.anchorY) * n.height
                    n.position = pos
                }, this, true)

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
            this.setNodeSize("Step" + this._index + "/xuxian", content)
            this.setNodePosition("Step" + this._index + "/xuxian", cpos)

            this.setNodePositionY("Step" + this._index + "/tishikuang1-2", cpos.y - content.height / 2 - 10)
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
                    this.setSpriteFrame(spt, "image/icon/Q6")
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

        Helper.reportEvent("大厅引导1", "匹配对手提示", "")
    }

    initStep1() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        let target = this.getNodeComponent("Step1/TargetNode", cc.Button)
        target.clickEvents.forEach(b => b.target = node)

        this.setButtonClick(target.node, this.onPressNext.bind(this))

        let jiantou = this.getNode("Step1/jiantou")
        jiantou.setSiblingIndex(jiantou.parent.childrenCount)

        let pos = target.node.position
        pos.x += target.node.width / 2 - 60
        pos.y += 50
        jiantou.position = pos

        cc.tween(jiantou).repeatForever(cc.tween().by(.5, { y: -30 }).by(.5, { y: 30 })).start()

        this._guideId = 121

        Helper.reportEvent("大厅引导2", "第二局指引", "")
    }

    initStep2() {
        this._guideId = 122

        Helper.reportEvent("大厅引导2", "公平竞技引导", "")
    }

    initStep3() {
        this.param.activityInfo.ad_aid = this.param.activityInfo.ad_aid || 0
        let awards = this.param.activityInfo.weight[0].rewards.filter(i => i.item_id && i.item_id !== Constants.ITEM_INDEX.WCOIN)
        let multiple = true
        let _lottery = 0
        let lottery = 0
        let _diamond = 0
        let diamond = 0
        let lotteryName = User.GetItemInfo(Constants.ITEM_INDEX.LOTTERY).name
        let diamondName = User.GetItemInfo(Constants.ITEM_INDEX.DIAMOND).name

        let manyIcons = []
        manyIcons[Constants.ITEM_INDEX.WCOIN] = "image/icon/many_weibi"
        manyIcons[Constants.ITEM_INDEX.LOTTERY] = "image/icon/dianquan1"
        manyIcons[Constants.ITEM_INDEX.DIAMOND] = "image/icon/many_zuanshi"

        let litterIcons = []
        litterIcons[Constants.ITEM_INDEX.WCOIN] = "image/icon/big_weibi"
        litterIcons[Constants.ITEM_INDEX.LOTTERY] = "image/icon/big-jiangquan"
        litterIcons[Constants.ITEM_INDEX.DIAMOND] = "image/icon/big_zuanshi"

        if (this.param.activityInfo.ad_aid == 0) {
            this.setActive("Step3/doubleToggle", false)
            multiple = false
        }

        let setContent = () => {
            for (let v of awards) {
                v.multiple_min_num = v.multiple_min_num || v.min_num
                if (v.item_id == Constants.ITEM_INDEX.LOTTERY) {
                    if (multiple) {
                        lottery = v.multiple_min_num
                        this.setSpriteFrame("Step3/daoju-jiangquan", manyIcons[Constants.ITEM_INDEX.LOTTERY])
                    } else {
                        lottery = v.min_num
                        this.setSpriteFrame("Step3/daoju-jiangquan", litterIcons[Constants.ITEM_INDEX.LOTTERY])
                    }
                } else if (v.item_id == Constants.ITEM_INDEX.DIAMOND) {
                    if (multiple) {
                        diamond = v.multiple_min_num
                        this.setSpriteFrame("Step3/many_zuanshi", manyIcons[Constants.ITEM_INDEX.DIAMOND])
                    } else {
                        diamond = v.min_num
                        this.setSpriteFrame("Step3/many_zuanshi", manyIcons[Constants.ITEM_INDEX.DIAMOND])
                    }
                }
            }

            let msg = "担心报名费和奖券不够？现在就赠送你\n"
            msg += "一份启动资金，看视频即可10倍领取\n"
            msg += "，快开始你的竞技高手之旅吧！ "

            this.setLabelValue("Step3/msg", msg)

            if (_lottery == 0) {
                _lottery = lottery
            }
            this.stopTween("Step3/lottery")
            this.runTween("Step3/lottery", Helper.TokenAni(_lottery, lottery, 0.4, (src) => {
                this.setLabelValue("Step3/lottery", src)
                _lottery = src
            }))

            if (_diamond === 0) {
                _diamond = diamond
            }
            this.stopTween("Step3/diamond")
            this.runTween("Step3/diamond", Helper.TokenAni(_diamond, diamond, 0.4, (src) => {
                this.setLabelValue("Step3/diamond", Helper.FormatNumPrice(src / 100))
                _diamond = src
            }))
        }

        setContent()

        let getReward = (multiple: number) => {
            let param = {
                activity_id: this.param.activityInfo.activity_id,
                multiple: multiple
            }
            Helper.reportEvent("大厅引导2", "第二局结束", "请求新手奖励")
            ActivitySrv.GetRewardParam(param, (res) => {
                if (res && res.err_code == 1) {
                    Helper.reportEvent("大厅引导2", "第二局结束", "领取奖励成功")
                    this.setButtonInfo("Step3/btnNext", { instantiate: false })
                    this.setButtonInfo("Step3/btnClose", { instantiate: false })
                    let jh = this.getNode("Step3/jiahao")
                    let pos = jh.parent.convertToWorldSpaceAR(jh.position)
                    this.starAwardAni(pos, 0, () => this.close())

                    Helper.reportEvent("大厅引导3", "新手奖励关闭", "")
                } else if (res.err_msg) {
                    Helper.OpenTip(res.err_msg)
                }
            })
        }


        this.setButtonClick("Step3/btnNext", () => {
            if (multiple && this.param.activityInfo.ad_aid > 0) {
                Helper.reportEvent("大厅引导2", "第二局结束", "观看新手奖励激励视频")
                AdSrv.createAdOrder(this.param.activityInfo.ad_aid, JSON.stringify(this.param.activityConfig), (order_no: string) => {
                    if (order_no && order_no.length > 0) {
                        Helper.reportEvent("大厅引导2", "第二局结束", "观看新手奖励激励视频完成")
                        AdSrv.completeAdOrder((res) => {
                            if (res && res.code == "00000") {
                                getReward(1)
                            }
                        })
                    }
                })
            } else {
                getReward(0)
            }
        })

        this.setButtonClick("Step3/btnClose", () => {
            getReward(0)
        })

        let doubleToggle = cc.find("Step3/doubleToggle", this.node)
        this.setToggleClick(doubleToggle, () => {
            console.log("doubleToggle on click", doubleToggle.getComponent(cc.Toggle).isChecked)
            multiple = doubleToggle.getComponent(cc.Toggle).isChecked
            setContent()
        })

        this._guideId = 131

        Helper.reportEvent("大厅引导3", "新手奖励", "")
    }

    initStep4() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        this._guideId = 134

        Helper.reportEvent("大厅", "对手未完成比赛", "")
    }

    initStep5() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        this._guideId = 135

        Helper.reportEvent("大厅", "正在匹配对手", "")
    }

    initStep6() {
        let nodes: cc.Node = this.param.nodes
        this.setNodeXuxian(nodes)

        let awards: TItems = this.param.awards
        for (let i in awards) {
            if (awards[i].id === Constants.ITEM_INDEX.LOTTERY) {
                this.setLabelValue("Step6/tishikuang1-2/label", "恭喜你获胜，赢得" + awards[i].num + "奖券，积累足够\n数量的奖券即可兑换奖品！")
                break
            }
        }

        this._guideId = 111

        Helper.reportEvent("大厅引导2", "首局胜利指引", "")
    }

    initStep7() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        this._guideId = 141

        Helper.reportEvent("大厅引导3", "再来一局比赛指引", "")
    }

    initStep8() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

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

        Helper.reportEvent("大厅", "主页赛事列表", "")
    }

    initStep9() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        this.setButtonClick("Step9/btnNext", this.onPressNext.bind(this))
        this.setButtonClick("Step9/tishikuang1-2/btnNext", this.onPressNext.bind(this))

        this._guideId = 152

        Helper.reportEvent("大厅", "等级引导", "")
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
            this.initData()
        }

        this.setButtonClick("Step10/btnNext", onNext)
        this.setButtonClick("Step10/tishikuang1-2/btnNext", onNext)

        this._guideId = 161

        Helper.reportEvent("大厅", "排行榜记录指引", "")
    }

    initStep11() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        this.setButtonClick("Step11/btnNext", this.onPressNext.bind(this))
        this.setButtonClick("Step11/tishikuang1-2/btnNext", this.onPressNext.bind(this))

        this._guideId = 162

        Helper.reportEvent("大厅", "排行榜奖励指引", "")
    }

    initStep12() {
        let node: cc.Node = this.param.node
        this.setNodeXuxian(node)

        this.setButtonClick("Step12/btnNext", () => {
            this.setActive("Step12", false)
            let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
            if (DataMgr.Config.platId !== 5 && record[3] === 1) {
                this.saveTag()
                this._index = 13
                this.initData()
            } else {
                this.close()
            }
        })

        this.getNode("Step12/btnNext").setSiblingIndex(this.getNode("Step12").childrenCount)

        this._guideId = 171

        Helper.reportEvent("大厅", "练习赛指引", "")
    }

    initStep13() {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        let wcoin = this.param.wcoin || user.items[Constants.ITEM_INDEX.WCOIN].num
        let wcoinName = User.GetItemInfo(Constants.ITEM_INDEX.WCOIN).name

        let msg = "练习赛需要银币才能参赛，现在赠送你\n"
        msg += wcoin + wcoinName + "的启动资金，继续提升你的实\n"
        msg += "力吧！"

        this.setLabelValue("Step13/msg", msg)
        this.setLabelValue("Step13/wcoin", wcoin)

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

        Helper.reportEvent("大厅", "练习赛奖励", "")
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

        Helper.reportEvent("大厅", "兑换引导", "")
    }
}
