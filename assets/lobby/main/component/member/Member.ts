import BaseUI from "../../../start/script/base/BaseUI";
import { Helper } from "../../../start/script/system/Helper";
import { EventMgr } from "../../../start/script/base/EventMgr";
import { Constants } from "../../../start/script/igsConstants";
import { MemberSrv } from "../../../start/script/system/MemberSrv";
import { UserSrv } from "../../../start/script/system/UserSrv";
import { UIMgr } from "../../../start/script/base/UIMgr";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { User } from "../../../start/script/data/User";
import { ShopSvr } from "../../../start/script/system/ShopSvr";

const { ccclass, property } = cc._decorator;

// const GET_USER_INFO = "mcbeam-authen-srv/user/GetUserInfo"

@ccclass
export default class Member extends BaseUI {

    btnRecharge: cc.Node = null
    btnClose: cc.Node = null
    timetip1: cc.Node = null
    box_list = null
    award = ""

    // wx_openid = ""

    onOpen() {

        this.initButton()
        this.initEvent()

        // Helper.PostHttp(GET_USER_INFO, null, {}, (res) => {
        //     console.log("GET_USER_INFO", res)
        //     if (res && res.code == "0000") {
        //         console.log("GET_USER_INFO_SUCC", res)
        //         if (res.wx_openid) {
        //             this.wx_openid = res.wx_openid
        //         }
        //     }
        // })
    }

    onClose() {
    }

    onLoad() {
        this.btnRecharge = cc.find("node/btnRecharge", this.node)
        this.btnClose = cc.find("node/btnClose", this.node)
        this.timetip1 = cc.find("node/timeleft/timetip1", this.node)
        // this.boxList()

        this.initData()
    }

    initEvent() {
    }

    initButton() {
        this.setButtonClick(this.btnClose, this.node, () => {
            this.param.checkQueue && EventMgr.dispatchEvent(Constants.EVENT_DEFINE.FIRST_OPEN_QUEUE)
            this.closeAni()
        })

        this.setButtonClick(this.btnRecharge, this.node, () => {
            this.param.checkQueue && EventMgr.dispatchEvent(Constants.EVENT_DEFINE.FIRST_OPEN_QUEUE)
            this.openRecharge()
        })
    }

    boxList() {
        // MemberSrv.getBoxList((res) =>{
        //     this.initData(res)
        // })
        // ShopSvr.getBoxList()
    }

    getAward(award) {
        // Helper.PostHttp("igaoshou-shop-srv/Box/GetVipItem", null, {}, (res, event) => {
        //     console.log("GetVipItem", res)
        //     if (res && res.code == "000000") {
        //         UserSrv.UpdateItem(() => UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: award, member: 1 }, }, null))
        //     }
        // })
        MemberSrv.getMemberAward(0)
    }

    openRecharge() {
        UIMgr.OpenUI("lobby", "component/member/Recharge", {}, () => this.close())
    }

    initData() {
        // if(res.box_list){
        //     this.box_list = res.box_list
        // }
        let isMember = DataMgr.getData(User.OpenID + Constants.DATA_DEFINE.IS_MEMBER)
        if (isMember) {
            // const vip_card = JSON.parse(res.vip_card)
            const vip_card = MemberSrv.getMemberInfo()
            let date = Date.parse(new Date().toString()) / 1000

            // 会员未到期
            this.timetip1.getComponent(cc.Label).string = this.formateTime(vip_card.invalid_date - date)
            this.timetip1.parent.active = true
            this.btnRecharge.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string = "立即续费"
            // 且是当天第一次打开
            if (Helper.GMTToStr() > vip_card.receive_date) {
                this.getAward(vip_card.days_item)
            }

        } else {
            this.timetip1.getComponent(cc.Label).string = ""
            this.timetip1.parent.active = false
            this.btnRecharge.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string = "马上开通"
        }
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

    getDays(before, after) {
        const startDate = Date.parse(before)
        const endDate = Date.parse(after)
        return (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
    }

    formateTime(time) {
        let day = 0
        let hour = 0
        let min = 0

        if (time < 60) {
            min = 1
        }
        if (time >= 60) {
            min = Math.floor(time / 60);
            time = time % 60
        }
        if (min >= 60) {
            hour = Math.floor(min / 60)
            min = min % 60
        }
        if (hour >= 24) {
            day = Math.floor(hour / 24)
            hour = hour % 24
        }
        let timeStr = ''
        timeStr += (day + "天")
        timeStr += (hour + "时")
        timeStr += (min + "分")
        return timeStr
    }
}
