import BaseUI from "../../script/base/BaseUI";
import { WxProxyWrapper } from "../../script/pulgin/WxProxyWrapper";
import { MatchSvr } from "../../script/system/MatchSvr";
import { DataMgr } from "../../script/base/DataMgr";
import { EventMgr } from "../../script/base/EventMgr";
import { Constants } from "../../script/igsConstants";
import { Helper } from "../../script/system/Helper";
import { PromoteSrv } from "../../script/system/PromoteSrv";
import { MemberSrv } from "../../script/system/MemberSrv";
import { User } from "../../script/data/User";
import { PluginMgr } from "../../script/base/PluginMgr";
import { ActivitySrv, SignSrv } from "../../script/system/ActivitySrv";
import { UIMgr } from "../../script/base/UIMgr";
import { ScribeSrv } from "../../script/system/ScribeSrv";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchTab extends BaseUI {

    _list: cc.Node = null

    btnSign: cc.Node = null
    btnNewbie: cc.Node = null
    btnMember: cc.Node = null
    btnSlyder: cc.Node = null
    btnSubscribe: cc.Node = null
    btnBindPhone: cc.Node = null
    btnPromote: cc.Node = null
    onLoad() {
        this.btnSign = this.getNode("logo/leftNode/btnSign")
        this.btnNewbie = this.getNode("logo/leftNode/btnNewbie")
        this.btnMember = this.getNode("logo/leftNode/btnMember")
        this.btnSlyder = this.getNode("logo/rightNode/btnSlyder")
        this.btnSubscribe = this.getNode("logo/rightNode/btnSubscribe")
        this.btnBindPhone = this.getNode("logo/rightNode/btnBindPhone")
        this.btnPromote = this.getNode("logo/rightNode/btnPromote")
        this.node.opacity = 0
        this._list = this.getNode("list")
        this.initEvent()
        this.initData()
    }

    onClose() {
        WxProxyWrapper.hideGameClubButton("btnClub")
    }

    onEnable() {
        let matchs = MatchSvr.GetMatchsByGame(DataMgr.data.Config.gameId)
        let idx = 0
        for (let i in matchs) {
            idx++
        }

        if (idx <= 3) {
            MatchSvr.LoadMatchConfig(DataMgr.data.Config.gameId)
        }

        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_MATCH_LIST)
    }

    onDisable() {
        // cc.Canvas.instance.node.off(cc.Node.EventType.CHILD_ADDED, this.onChildChange, this)
        // cc.Canvas.instance.node.off(cc.Node.EventType.CHILD_REMOVED, this.onChildChange, this)
        // WxProxyWrapper.hideGameClubButton("btnClub")
    }


    initEvent() {
        let adHeight = this.getNode("adNode").height
        if (cc.sys.BYTEDANCE_GAME === cc.sys.platform || Helper.isIosAudit()) {
            this.setActive("adNode", false)
            adHeight = 0
        }

        this._list.on(cc.Node.EventType.SIZE_CHANGED, () => {
            if (this._list.height + adHeight + 50 + 50 + 222 + 10 > this.node.parent.parent.height) {
                // ad.position = cc.v3(ad.position.x, -this._list.height - 50)
                this.node.height = this._list.height + adHeight + 50 + 50 + 222 + 10
            } else {
                this.node.height = this.node.parent.parent.height
                // ad.position = cc.v3(ad.position.x, -this.node.height + 50 + ad.height)
            }
        }, this, true)

        let self = this

        EventMgr.on(Constants.EVENT_DEFINE.MATCH_LIST_UPDATE, this.updateList, this)
        EventMgr.on(Constants.EVENT_DEFINE.CHANGE_GAME_ID, this.onChangeGame, this)
        // EventMgr.on(Constants.EVENT_DEFINE.GAME_START, () => WxProxyWrapper.hideGameClubButton("btnClub"), this) 
        // EventMgr.on(Constants.EVENT_DEFINE.SHOW_TOP_BUTTON_POP, () => WxProxyWrapper.hideGameClubButton("btnClub"), this)
        // EventMgr.on(Constants.EVENT_DEFINE.HIDE_TOP_BUTTON_POP, () => WxProxyWrapper.showGameClubButton(self.getNode("logo/btnClub")), this)

        EventMgr.once(Constants.EVENT_DEFINE.PHONE_BIND_SUCCESS, () => {
            this.setActive(this.btnBindPhone, false)
        }, this)
    }

    initData() {
        this.scheduleOnce(() => this.node.opacity = 255, .1)

        this.updateList()

        this.setActive(this.btnNewbie, false)
        this.setActive(this.btnSign, false)
        this.setActive(this.btnMember, false)
        this.setActive(this.btnPromote, false)

        if (DataMgr.data.OnlineParam.promote_system === 1) {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.BIND_PROMOTE)
            this.btnPromote.active = true

            if (cc.sys.isNative) {
                PromoteSrv.GetPromoteInfo((res) => {
                    if (res && res.promote_code) {
                        User.InvitationCode = res.promote_code
                    }
                })
            }
        }

        this.checkSubscribe()

        this.checkNewbiew()

        this.checkSlyder()

        this.setSpriteFrame("logo/logo", "https://download.mcbeam.cc/Image/" + DataMgr.data.Config.gameId + "_logo.png", false)

        // this.runTween(this.btnNewbie, cc.tween().repeatForever(cc.tween().to(.8, { scale: 1.2 }).to(.8, { scale: 1 })))
        // this.runTween(this.btnSign, cc.tween().repeatForever(cc.tween().to(.5, { scale: 1.2 }).to(.8, { scale: 1 })))
        this.runTween(this.btnPromote, cc.tween().repeatForever(cc.tween().to(.5, { scale: 1.1 }).to(.8, { scale: 0.9 })))

        this.checkMember()

        // MemberSrv.getBoxList((res) => {
        //     if (res && res.vip_card) {
        //         const vip_card = JSON.parse(res.vip_card)
        //         let date = Date.parse(new Date().toString()) / 1000
        //         if (date < vip_card.invalid_date) {
        //             if (Helper.GMTToStr() > vip_card.receive_date) {
        //                 this.setActive("anniu-hongdian", this.btnMember, true)
        //             }
        //         }
        //     }
        // })

        if (cc.sys.OPPO_GAME == cc.sys.platform || cc.sys.BYTEDANCE_GAME == cc.sys.platform || cc.sys.OS_IOS == cc.sys.os) {
            this.setActive(this.btnBindPhone, false)
        }

        if (this.btnBindPhone.active) {
            let phone: string = DataMgr.getData(Constants.DATA_DEFINE.BIND_PHONE + User.OpenID)
            if (!phone || phone.length == 0) {
                phone = User.Data.metaData["phone"]
            }
            if (phone && phone.length > 0) {
                this.setActive(this.btnBindPhone, false)
            }
        }
    }

    updateList() {
        this._list.getComponent(cc.Layout).updateLayout()
    }

    checkSubscribe() {
        this.setActive(this.btnSubscribe, false)
        if (PluginMgr.isH52345Game() || Helper.isNative() || cc.sys.BYTEDANCE_GAME == cc.sys.platform) {
            return
        }

        if (cc.sys.OS_IOS == cc.sys.os) {
            return
        }

        let self = this
        ActivitySrv.GetActivityConfig(1012, (info) => {
            if (info) {
                self.setActive(this.btnSubscribe, true)
                EventMgr.once(Constants.EVENT_DEFINE.SUBSCRIBE_UPDATE, () => {
                    self.setActive(this.btnSubscribe, false)
                })
            }
        })
    }

    onPressSubscribe() {
        this.setActive("anniu-hongdian", this.btnSubscribe, false)
        UIMgr.OpenUI("lobby", "component/subscribe/Subscribe", { single: true, param: { btn: this.btnSubscribe } })
    }

    checkSign() {
        let self = this
        self.setActive(this.btnSign, true)
        SignSrv.GetConfig((config) => {
            if (config) {
                config.Receive = config.Receive || 0
                for (let i = 0; i < config.list.length; i++) {
                    let index = i + 1
                    if (index == config.DayIndex) {
                        if (config.Receive !== 1) {
                            let srcScale = 1
                            ActivitySrv.GetActivityConfigPromise(8)
                                .then((info) => {
                                    EventMgr.once(Constants.EVENT_DEFINE.SIGN_AWARD_UPDATE, () => {
                                        self.btnSign.scale = srcScale
                                        self.stopTween(this.btnSign)
                                    })
                                })
                                .catch(() => { })
                        }
                    }
                }
            }
        })
    }

    checkNewbiew() {
        let self = this
        ActivitySrv.GetActivityConfigPromise(1002)
            .then((info) => {
                this.setActive(this.btnNewbie, true)
                EventMgr.once(Constants.EVENT_DEFINE.NEWBIE_AWARD_UPDATE, () => {
                    self.setActive(this.btnNewbie, false)
                    self.checkSign()
                }, this)
            })
            .catch(() => {
                self.setActive(this.btnNewbie, false)
                self.checkSign()
            })
    }

    onPressNewbie() {
        ScribeSrv.checkShowScribeWeChatMsg()
        let info = ActivitySrv.GetActivityById(1002)
        if (info) {
            UIMgr.OpenUI("lobby", "component/activity/newbie/NewbieAward", { single: true, param: { activityInfo: info, btn: this.btnNewbie } })
        }
    }

    onPressSign() {
        ScribeSrv.checkShowScribeWeChatMsg()
        SignSrv.GetConfig((config) => {
            let info = ActivitySrv.GetActivityById(8)
            UIMgr.OpenUI("lobby", "component/activity/sign/Sign", { single: true, param: { signConfig: config, activityConfig: info, btn: this.btnSign }, index: 20 })
        })
    }

    checkMember() {
        if (DataMgr.data.OnlineParam.golden_card && DataMgr.data.OnlineParam.golden_card == 1 && !Helper.checkRegionLimit()) {
            this.setActive(this.btnMember, true)
            const vip_card = MemberSrv.getMemberInfo()
            let date = Date.parse(new Date().toString()) / 1000
            if (date < vip_card.invalid_date) {
                if (Helper.GMTToStr() > vip_card.receive_date) {
                    this.setActive("anniu-hongdian", this.btnMember, true)
                }
            }
        } else {
            this.setActive(this.btnMember, false)
        }
    }

    onPressMember() {
        this.setActive("anniu-hongdian", this.btnMember, false)
        UIMgr.OpenUI("lobby", "component/member/Member", { single: true, param: { btn: this.btnMember }, index: 20 })
    }

    onPressPromote() {
        UIMgr.OpenUI("lobby", "component/promote/PromoteMain", { single: true }, () => {
            this.setActive("anniu-hongdian", this.btnPromote, false)
        })
    }

    checkSlyder() {
        this.setActive("anniu-hongdian", this.btnSlyder, false)
        let info = ActivitySrv.GetActivityById(4)
        if (info) {
            info.receive_time = info.receive_time || 1
            info.receive_num = info.receive_num || 0
            if (info.day_times && info.receive_num < info.day_times) {
                if (info.receive_time && Date.now() / 1000 - info.receive_time >= info.interval_time * 60) {
                    this.setActive("anniu-hongdian", this.btnSlyder, true)
                }
            }
        }
    }

    onPressBindPhone() {
        UIMgr.OpenUI("lobby", "component/account/PhoneBind/PhoneBind", { single: true, param: { btn: this.btnBindPhone } })
    }

    onPressSlyder() {
        if (true) {
            this.setActive("anniu-hongdian", this.btnSlyder, false)
            UIMgr.OpenUI("lobby", "component/activity/turntable/MainTurntable", { single: true, param: { btn: this.btnSlyder } })
            return
        }
    }

    onChangeGame() {
        this.setSpriteFrame("logo/logo", "https://download.mcbeam.cc/Image/" + DataMgr.data.Config.gameId + "_logo.png", false)
    }

    onChildChange() {
        // if (cc.Canvas.instance.node.childrenCount > 3) {
        //     WxProxyWrapper.hideGameClubButton("btnClub")
        // } else if (this.node.active) {
        //     WxProxyWrapper.showGameClubButton(this.getNode("logo/btnClub"))
        // }
    }
}
