import BaseUI from "../../../start/script/base/BaseUI";
import { UIMgr } from "../../../start/script/base/UIMgr";
import { UserSrv } from "../../../start/script/system/UserSrv";
import { Helper } from "../../../start/script/system/Helper";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PromoteDisciple extends BaseUI {
    onOpen() {
        // console.log("PromoteDisciple onOpen", this.param)
    }

    initNode() {

    }

    onLoad() {
    }

    initButton() {
        this.setButtonClick("btnAdd", this.node, () => {
            cc.log("on click btnAdd")
            UIMgr.OpenUI("lobby", "component/promote/PromoteShare", { single: true })
        })

        this.setButtonClick("headbg/btnDetail", this.node, () => {
            cc.log("on click btnDetail")
            UIMgr.CloseUI("component/pomote/PromoteDiscipleDetail")
            let headbg = cc.find("headbg", this.node)
            let param = { single: true, param: this.param, parent: this.node.parent, position: cc.v3(this.param.pos.x + this.node.width / 2 + headbg.width - 10, this.param.pos.y, 0) }
            if (2 == this.param.dir) {
                param.position = cc.v3(this.param.pos.x - this.node.width / 2 - headbg.width + 10, this.param.pos.y, 0)
            }
            UIMgr.OpenUI("lobby", "component/promote/PromoteDiscipleDetail", param)
        })
    }

    initData() {
        let data = this.param.data
        if (data) {
            this.setActive("btnAdd", this.node, false)

            UserSrv.GetPlyDetail(data.openid, (ply: IPlayerData) => {
                this.setActive("sptBgNickname", this.node, true)
                this.setLabelValue("sptBgNickname/lblNickname", this.node, Helper.formatNickname(ply.userName))
                this.setActive("headbg", this.node, true)
                this.setSpriteFrame("headbg/head", this.node, ply.avatar, true)
            }, data.game_id)
            if (data.pool_award && data.pool_award.item_num && data.pool_award.item_num > 0) {
                this.setActive("headbg/sptBgBubble", this.node, true)
                this.setRichTextValue("headbg/sptBgBubble/lblDesc", "<outline color=#000000><color=#ffffff>" + (data.pool_award.item_num / 100) + "元</color></outline>")
            } else {
                this.setActive("headbg/sptBgBubble", this.node, false)
            }

            let todayAwardNum = data.today_award.item_num
            // if (todayAwardNum) {
            this.setActive("lblContribute", this.node, true)
            this.setLabelValue("lblContribute", "今日贡献：" + (todayAwardNum / 100) + "元")
            // }

            if (1 != data.activate) {
                this.setActive("headbg/sptNoActive", this.node, true)
            } else {
                this.setActive("headbg/sptNoActive", this.node, false)
            }

            let now = new Date()
            let bind = new Date(data.bind_time * 1000)
            if (now.getFullYear() == bind.getFullYear() && now.getMonth() == bind.getMonth() && now.getDate() == bind.getDate()) {
                this.setActive("headbg/sptNew", this.node, true)
            } else {
                this.setActive("headbg/sptNew", this.node, false)
            }
        } else {
            this.setActive("btnAdd", this.node, true)
            this.setActive("headbg", this.node, false)
            this.setActive("sptBgNickname", this.node, false)
            this.setActive("lblContribute", this.node, false)
        }
    }

    setParam(param) {
        this.param = param
        let headbg = cc.find("headbg", this.node)
        if (this.param.pos.x + this.node.width / 2 + headbg.width - 10 + 195 > cc.winSize.width / 2) {
            this.param.dir = 2
        } else {
            this.param.dir = 1
        }
        this.initData()
        this.initButton()
    }
}
