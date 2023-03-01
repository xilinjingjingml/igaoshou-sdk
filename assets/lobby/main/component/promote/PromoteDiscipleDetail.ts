import BaseUI from "../../../start/script/base/BaseUI";
import { UserSrv } from "../../../start/script/system/UserSrv";
import { Helper } from "../../../start/script/system/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PromoteDiscipleDetail extends BaseUI {

    like_star: number = 0

    initBtn = false
    onOpen() {
        console.log("PromoteDiscipleDetail onOpen", this.param)
        this.initData()
    }

    initNode() {

    }

    onLoad() {
    }

    initButton() {
    }

    initData() {
        if (1 == this.param.dir) {
            this.setActive("sptArrow1", this.node, true)
        }
        else if (2 == this.param.dir) {
            this.setActive("sptArrow2", this.node, true)
        }

        let data = this.param.data
        if (data) {
            if (1 != data.activate) {
                this.setActive("ndNoActive", true)
            } else {
                if (1 == this.param.discipleType) {
                    this.setLabelValue("ndActive/lblDirectDisciple", "徒弟人数：" + data.member_num)
                    this.setActive("ndActive/lblDirectDisciple", true)
                } else if (2 == this.param.discipleType) {
                    UserSrv.GetPlyDetail(data.promote_openid, (ply: IPlayerData) => {
                        this.setLabelValue("ndActive/lblIndirectDisciple", "师父：" + Helper.formatNickname(ply.userName))
                        this.setActive("ndActive/lblIndirectDisciple", true)
                    }, data.game_id)
                }

                let yesterdayAwardNum = data.yesterday_award.item_num
                if (yesterdayAwardNum) {
                    this.setLabelValue("ndActive/lblContribute", "昨日贡献：" + (yesterdayAwardNum / 100) + "元")
                }

                let totalAwardNum = data.total_award.item_num
                if (totalAwardNum) {
                    this.setLabelValue("ndActive/lblTotalContribute", "总贡献：" + (totalAwardNum / 100) + "元")
                }
                this.setActive("lblContribute", this.node, true)
                this.setActive("ndActive", true)
            }
        }
    }

    setParam(param) {
        this.param = param
        this.initData()
        this.initButton()
    }
}
