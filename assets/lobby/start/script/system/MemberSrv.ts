import { DataMgr } from "../base/DataMgr"
import { Constants } from "../igsConstants"
import { Helper } from "./Helper"
import { User } from "../data/User";
import { UserSrv } from "./UserSrv";
import { UIMgr } from "../base/UIMgr";
import { ShopSvr } from "./ShopSvr";

const GET_BoxList = "igaoshou-shop-srv/Box/BoxList"
const GET_VIP_ITEM = "igaoshou-shop-srv/Box/GetVipItem"

let vipCardInfo: any = {}

export namespace MemberSrv {

    // export function getBoxList(callback?: Function) {
    //     let param = {
    //         plat_aid: DataMgr.data.Config.platId,
    //     }

    //     Helper.PostHttp(GET_BoxList, null, param, (res, event) => {
    //         console.log("boxList", res)
    //         if (res && res.code == "00000") {
    //             if (res.box_list) {
    //                 DataMgr.setData(Constants.DATA_DEFINE.BOX_LIST, res)
    //             }
    //             if (res.vip_card) {
    //                 const vip_card = JSON.parse(res.vip_card)
    //                 let date = Date.parse(new Date().toString()) / 1000
    //                 if (date < vip_card.invalid_date) {
    //                     // 会员未到期
    //                     DataMgr.setData(User.OpenID + Constants.DATA_DEFINE.IS_MEMBER, true)
    //                 } else {
    //                     DataMgr.setData(User.OpenID + Constants.DATA_DEFINE.IS_MEMBER, false)
    //                 }
    //             } else {
    //                 // 未开通会员
    //                 DataMgr.setData(User.OpenID + Constants.DATA_DEFINE.IS_MEMBER, false)
    //             }
    //         }
    //         callback && callback(res)
    //     })
    // }

    export function updateMemberInfo(vipCard) {
        if (vipCard) {
            vipCardInfo = JSON.parse(vipCard)
            let date = Date.parse(new Date().toString()) / 1000
            if (date < vipCardInfo.invalid_date) {
                // 会员未到期
                DataMgr.setData(User.OpenID + Constants.DATA_DEFINE.IS_MEMBER, true)
            } else {
                DataMgr.setData(User.OpenID + Constants.DATA_DEFINE.IS_MEMBER, false)
            }
        } else {
            // 未开通会员
            DataMgr.setData(User.OpenID + Constants.DATA_DEFINE.IS_MEMBER, false)
        }

        // const vip_card = JSON.parse(res.vip_card)
        // let date = Date.parse(new Date().toString()) / 1000

        // // 会员未到期
        // this.timetip1.getComponent(cc.Label).string = this.formateTime(vip_card.invalid_date - date)
        // this.timetip1.parent.active = true
        // this.btnRecharge.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string = "立即续费"
        // // 且是当天第一次打开
        // if (Helper.GMTToStr() > vip_card.receive_date) {
        //     this.getAward(vip_card.days_item)
        // }
    }

    export function getMemberAward(daysNum: number, callback?: Function) {
        Helper.PostHttp(GET_VIP_ITEM, null, {}, (res, event) => {
            // console.log("GetVipItem", res)
            if (res && res.code == "000000") {
                // console.log("getAward:", res)
                let award: any[] = []
                award.concat(vipCardInfo.days_item)
                if (daysNum) {
                    award.push({
                        item_id: 301,
                        item_num: daysNum
                    })
                }
                UserSrv.UpdateItem(() => {
                    UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: award, member: 1 }, }, null)
                    callback?.()
                })
            }
        })
    }

    export function getMemberInfo() {
        return vipCardInfo
    }
}