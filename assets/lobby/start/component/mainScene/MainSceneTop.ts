import BaseUI from "../../script/base/BaseUI";
import { PluginMgr } from "../../script/base/PluginMgr";
import { Helper } from "../../script/system/Helper";
import { WxProxyWrapper } from "../../script/pulgin/WxProxyWrapper";
import { DataMgr } from "../../script/base/DataMgr";
import { EventMgr } from "../../script/base/EventMgr";
import { Constants } from "../../script/igsConstants";
import { User } from "../../script/data/User";
import { UIMgr } from "../../script/base/UIMgr";
import { IgsBundles } from "../../script/data/IgsBundles";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MainSceneTop extends BaseUI {

    _credits: number = null
    _gold: number = null
    _lottery: number = null

    start() {
        this.initEvent()

        cc.director.once(cc.Director.EVENT_AFTER_DRAW, () => {
            this.initData()
        })

        if (PluginMgr.isH52345Game() || cc.sys.BYTEDANCE_GAME == cc.sys.platform || !Helper.checkExchange()) {
            this.setActive("lottery/btnExchange", false)
        }
    }

    onLoad(): void {
        this.setActive("player/faceFrame", false)
        this.setActive("player/faceFrameMember", false)
    }

    onDestroy() {
        cc.Canvas.instance.node.off(cc.Node.EventType.CHILD_ADDED, this.onChildChange, this)
        cc.Canvas.instance.node.off(cc.Node.EventType.CHILD_REMOVED, this.onChildChange, this)
        WxProxyWrapper.hideFeedbackButton()
    }

    initEvent() {
        DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, this.updateData, this)
        EventMgr.on(Constants.EVENT_DEFINE.UPDATE_USER_ITEM, this.tokenAni, this)

        cc.Canvas.instance.node.on(cc.Node.EventType.CHILD_ADDED, this.onChildChange, this)
        cc.Canvas.instance.node.on(cc.Node.EventType.CHILD_REMOVED, this.onChildChange, this)

        EventMgr.on(Constants.EVENT_DEFINE.GAME_START, () => WxProxyWrapper.hideFeedbackButton(), this)
        EventMgr.on(Constants.EVENT_DEFINE.GAME_START, () => WxProxyWrapper.hideGameClubButton("btnClub"), this)
        EventMgr.on(Constants.EVENT_DEFINE.HIDE_TOP_BUTTON_POP, () => this.hidebuttonPop(), this)

        EventMgr.on(Constants.EVENT_DEFINE.CHANGE_SKIN, (res) => {
            if (!Helper.isIosAudit()) {
                this.setLabelInfo("player/userName/value", { color: res.skin === 1 ? new cc.Color().fromHEX("#0e2325") : cc.Color.WHITE })
            }
        }, this)
    }

    initData() {
        this.updateData()

        if (cc.sys.OS_IOS == cc.sys.os && Helper.isIosAudit()) {
            this.setActive("btnNode", false)
        }

        if (Helper.isNative()) {
            this.setActive("btnNode/popNode/btnFeed", false)
            this.setActive("btnNode/popNode/btnClub", false)
            // this.setNodePositionX("btnNode", cc.winSize.width / 2 - 45)
        } else {
            this.setActive("btnNode/popNode/btnAccount", false)
            this.setActive("btnNode/popNode/btnPersonal", false)
        }

        if (DataMgr.data.Config.platId === 3) {
            this.setActive("btnNode/popNode/btnKefu", false)
        }

        if (!Helper.isNative() && (cc.sys.OPPO_GAME == cc.sys.platform || cc.sys.VIVO_GAME == cc.sys.platform)) {
            let btnNode = this.getNode("btnNode")
            btnNode.x = 40
            let popNode = this.getNode("btnNode/popNode")
            for (let node of popNode.children) {
                this.setActive(node, false)
            }
            this.setActive("btnNode/popNode/jiantou", true)
            if (cc.sys.VIVO_GAME === cc.sys.platform) {
                this.setActive("btnNode/popNode/btnShare", true)
                this.setActive("btnNode/popNode/btnBindPhone", true)
            }
        } else if (cc.sys.BYTEDANCE_GAME === cc.sys.platform || PluginMgr.isH52345Game()) {
            let btnNode = this.getNode("btnNode")
            btnNode.x = 40
            let popNode = this.getNode("btnNode/popNode")
            for (let node of popNode.children) {
                this.setActive(node, false)
            }
            this.setActive("btnNode/popNode/jiantou", true)
            this.setActive("btnNode/popNode/btnShare", true)
            if (cc.sys.BYTEDANCE_GAME == cc.sys.platform) {
                this.setActive("btnNode/popNode/btnBindPhone", false)
            } else {
                this.setActive("btnNode/popNode/btnBindPhone", true)
            }
        }

        if (Helper.checkExchangeCredits()) {
            this.setActive("credits/btnExchange", false)
        }
    }

    updateData() {
        this.setLabelValue("player/userName/value", User.UserName)
        this.setSpriteFrame("player/face/avatar", User.Avatar, true)

        this.setRichTextValue("credits/num", Helper.FormatNumWYCNinRichText(User.Credits, 23))
        this.setRichTextValue("gold/num", Helper.FormatNumWYCNinRichText(User.Gold, 23))
        this.setRichTextValue("lottery/num", Helper.FormatNumWYCNinRichText(User.Lottery, 23))

        if (DataMgr.data.OnlineParam.golden_card && DataMgr.data.OnlineParam.golden_card == 1) {
            let isMember = DataMgr.getData<boolean>(User.OpenID + Constants.DATA_DEFINE.IS_MEMBER)
            this.setActive("player/faceFrame", !isMember)
            this.setActive("player/faceFrameMember", isMember)
        }

        let pos = {
            [Constants.ITEM_INDEX.GOLD]: this.getNode("gold/num").convertToWorldSpaceAR(cc.Vec2.ZERO),
            [Constants.ITEM_INDEX.LOTTERY]: this.getNode("lottery/num").convertToWorldSpaceAR(cc.Vec2.ZERO),
            [Constants.ITEM_INDEX.CREDITS]: this.getNode("credits/num").convertToWorldSpaceAR(cc.Vec2.ZERO),
        }
        DataMgr.setData(Constants.DATA_DEFINE.MAIN_SCENE_TOKEN_POS, pos)
    }

    tokenAni(msg) {
        if (msg && msg.bAni) {
            if (null !== this._credits && this._credits !== User.Credits) {
                this.stopTween("credits/num")
                this.runTween("credits/num", Helper.TokenAni(this._credits, User.Credits, .5, (src) => {
                    this.setRichTextValue("credits/num", "<b>" + (src >= 10000 ? Helper.FormatNumWYCNinRichText(src, 18) : src) + "</b>")
                    this._credits = src
                }))
            } else {
                this.setRichTextValue("credits/num", "<b>" + (User.Credits >= 10000 ? Helper.FormatNumWYCNinRichText(User.Credits, 18) : User.Credits) + "</b>")
                this._credits = User.Credits
            }

            if (null !== this._gold && this._gold !== User.Gold) {
                this.stopTween("lottery/num")
                this.runTween("lottery/num", Helper.TokenAni(this._gold, User.Gold, .5, (src) => {
                    this.setRichTextValue("lottery/num", "<b>" + (src >= 10000 ? Helper.FormatNumWYCNinRichText(src, 18) : src) + "</b>")
                    this._gold = src
                }))
            } else {
                this.setRichTextValue("lottery/num", "<b>" + (User.Gold >= 10000 ? Helper.FormatNumWYCNinRichText(User.Gold, 18) : User.Gold) + "</b>")
                this._gold = User.Gold
            }

            if (null !== this._lottery && this._lottery !== User.Lottery) {
                this.stopTween("lottery/num")
                this.runTween("lottery/num", Helper.TokenAni(this._lottery, User.Lottery, .5, (src) => {
                    this.setRichTextValue("lottery/num", "<b>" + (src >= 10000 ? Helper.FormatNumWYCNinRichText(src, 18) : src) + "</b>")
                    this._lottery = src
                }))
            } else {
                this.setRichTextValue("lottery/num", "<b>" + (User.Lottery >= 10000 ? Helper.FormatNumWYCNinRichText(User.Lottery, 18) : User.Lottery) + "</b>")
                this._lottery = User.Lottery
            }
        } else {
            this.setRichTextValue("credits/num", "<b>" + (User.Credits >= 10000 ? Helper.FormatNumWYCNinRichText(User.Credits, 18) : User.Credits) + "</b>")
            this._credits = User.Credits
            this.setRichTextValue("gold/num", "<b>" + (User.Gold >= 10000 ? Helper.FormatNumWYCNinRichText(User.Gold, 18) : User.Gold) + "</b>")
            this._gold = User.Gold
            this.setRichTextValue("lottery/num", "<b>" + (User.Lottery >= 10000 ? Helper.FormatNumWYCNinRichText(User.Lottery, 18) : User.Lottery) + "</b>")
            this._lottery = User.Lottery
        }
    }

    hidebuttonPop() {
        this.setActive("btnNode/popNode", false)
        this.setActive("btnNode/btnHide", false)
        WxProxyWrapper.hideFeedbackButton()
        WxProxyWrapper.hideGameClubButton("btnClub")
    }

    onPressFace() {
        Helper.OpenPageUI("component/personal/PersonalScene", "个人中心")
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_TOP_BUTTON_POP)
    }

    onPressMore() {
        this.setActive("btnNode/popNode", true)
        this.setActive("btnNode/btnHide", true)
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_TOP_BUTTON_POP)
        Helper.DelayFun(() => {
            WxProxyWrapper.showFeedBackButton(this.getNode("btnNode/popNode/btnFeed"), () => EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_TOP_BUTTON_POP))
            WxProxyWrapper.showGameClubButton(this.getNode("btnNode/popNode/btnClub"), () => EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_TOP_BUTTON_POP))
        }, 0.1)
    }

    onPressHide() {
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_TOP_BUTTON_POP)
    }

    onPressExchange() {
        // if (DataMgr.data.Config.platId !== 3 && Constants.sys.WECHAT_GAME_QQ !== cc.sys.platform && !cc.sys.isNative) {
        // if (Helper.checkExchange()) {
        //     UIMgr.OpenUI("lobby", "component/exchange/huafei/ExchangeLottery", { single: true })
        // }
        UIMgr.OpenUI("lobby", "component/exchange/credits/ExchangeCredits", { single: true })
    }

    onPressShop() {
        // UIMgr.OpenUI("lobby", "component/exchange/credits/ExchangeCredits", { single: true })
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, { name: "shop" })
    }

    onPressKefu() {
        let param = {
            buttons: 1,
            confirmName: "复制公众号",
            confirmUnclose: true,
            confirm: () => { Helper.copyToClipBoard("高手竞技") }
        }
        Helper.OpenPopUI("component/personal/KefuPop", "客服中心", null, param)
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_TOP_BUTTON_POP)
    }

    onPressShare() {
        let node = this.getNode("ShareInfo/share")
        let self = this
        let share = (node) => {
            if (!node) {
                return
            }

            if (cc.sys.WECHAT_GAME === cc.sys.platform) {
                let canvas: any = Helper.CaptureNode(node)
                if (canvas) {
                    Helper.DelayFun(() => {
                    canvas.toTempFilePath({
                        x: 0,
                        y: 0,
                        width: node.width,
                        height: node.height,
                        destWidth: node.width,
                        destHeight: node.height,
                        success(res) {
                            console.log("success: " + res.tempFilePath)
                            Helper.shareInfo({ share_pic: res.tempFilePath })
                        },
                        fail(res) {
                            console.log(res)
                        }
                    })
                }, 0.1)
                } else {
                    Helper.shareInfo()
                }
            } else if (Helper.isNative()) {
                let path = Helper.CaptureNodeInNative(node)
                if (path.length > 0) {
                    Helper.shareInfo({ share_pic: path })
                }
            } else {
                Helper.shareInfo()
            }

            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_TOP_BUTTON_POP)
        }

        if (node?.parent) {
            share(node)
        } else {
            IgsBundles.LoadPrefab("lobby", "component/shareInfo/ShareInfo", (assets) => {
                if (!assets) {
                    return
                }

                let node: cc.Node = cc.instantiate(assets)
                node.parent = self.node
                // node.position = cc.Vec3.ZERO
                share(node.getChildByName("share"))
            })
        }
    }

    onPressAccount() {
        UIMgr.OpenUI("lobby", "component/account/SessionPop/SessionPop", { single: true, param: { changeAccount: true } })
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_TOP_BUTTON_POP)
    }

    onPressBindPhone() {
        UIMgr.OpenUI("lobby", "component/account/PhoneBind/PhoneBind", { single: true, param: {} })
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_TOP_BUTTON_POP)
    }

    onChildChange() {
        if (cc.Canvas.instance.node.childrenCount > 3) {
            WxProxyWrapper.hideFeedbackButton()
            WxProxyWrapper.hideGameClubButton("btnClub")
        } else if (this.getNode("btnNode/popNode").active) {
            Helper.DelayFun(() => {
                WxProxyWrapper.showFeedBackButton(this.getNode("btnNode/popNode/btnFeed"))
                WxProxyWrapper.hideGameClubButton(this.getNode("btnNode/popNode/btnClub"))
            }, 0.1)
        }
    }

}
