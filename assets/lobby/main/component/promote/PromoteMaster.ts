import BaseUI from "../../../start/script/base/BaseUI";
import { PromoteSrv } from "../../../start/script/system/PromoteSrv";
import { UserSrv } from "../../../start/script/system/UserSrv";
import { Helper } from "../../../start/script/system/Helper";
import { User } from "../../../start/script/data/User";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PromoteMaster extends BaseUI {
    _promoteInfo = null

    onOpen() {
        console.log("PromoteMaster onOpen", this.param)

        this.initButton()
        this.initData()

        PromoteSrv.GetPromoteInfo((res) => {
            this._promoteInfo = res
            this.initData()
        })
    }

    onLoad() {
    }

    initEvent() {

    }

    initButton() {
        this.setButtonClick("node/btnOk", this.node, () => {
            this.close()
        })
    }

    initData() {
        if (this._promoteInfo && this._promoteInfo.promote_openid) {
            this.setActive("node/ndNo1", false)
            this.setActive("node/ndNo2", false)
            this.setActive("node/ndHave", true)
            UserSrv.GetPlyDetail(this._promoteInfo.promote_openid, (ply: IPlayerData) => {
                this.setActive("node/ndHave", this.node, true)
                this.setLabelValue("node/ndHave/sptBgNickname/lblNickname", this.node, Helper.formatNickname(ply.userName))
                this.setSpriteFrame("node/ndHave/headbg/head", this.node, ply.avatar, true)
            }, this._promoteInfo.promote_game_id)
            this.setLabelValue("node/ndHave/lblDate", Helper.FormatTimeString(this._promoteInfo.promote_bind_time * 1000, "yyyy/MM/dd"))
        } else {
            if (cc.sys.WECHAT_GAME === cc.sys.platform) {
                this.setActive("node/ndNo1", true)
            } else {                
                if(Math.floor(Date.now() / 1000 )- User.Data.regTime > 2*24*60*60){
                    this.setActive("node/ndNo1", true)
                    this.setActive("node/ndNo1/lblOverdue", true)
                }else{
                    this.setActive("node/ndNo2", true)
                }
            }
        }
    }

    onEditingDidEnded() {
        console.log("onEditingDidEnded")
        let code = this.getNodeComponent("node/ndNo2/code", cc.EditBox).string
        PromoteSrv.BindPromote({ promote_openid: "", promote_code: code }, (res) => {
            if (res.err && res.err.code == 200) {
                Helper.OpenTip("绑定成功！观看视频即可激活师徒关系")

                PromoteSrv.GetPromoteInfo((res) => {
                    this._promoteInfo = res
                    this.initData()
                })
            } else {
                Helper.OpenTip("邀请码错误，请填写正确的邀请码")
            }

        })
    }
}
