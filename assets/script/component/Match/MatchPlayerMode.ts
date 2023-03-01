import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";
import { User } from "../../system/User";
import { Helper } from "../../system/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchPlayerMode extends BaseUI {

    _init: boolean = false

    onOpen() {
        // this.initData()

        this._init = true
    }

    setParam(data) {
        this.param = data
        this.initData()
    }

    initData() {
        // if (!this._init)
        //     return

        let type = this.param.type
        let data = this.param.player
        if (!data)
            return

        this.updateUser(data)

        this.getNode("league").children.forEach(i => i.active = false)

        if (!data.openid) {
            this.setLabelValue("score", "")
        } else if (data.state === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING || data.state === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_GAMING) {
            this.setLabelValue("score", "未完成")
        } else if (data.state === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_ABORTED) {
            this.setLabelValue("score", "已中止")
        } else if (type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            this.setLabelValue("score", data.score || 0)
            this.setActive("league/cup", data.win)
        } else {
            this.setLabelValue("score", Number.isNaN(data.score) ? "?" : data.score || 0)
            this.setActive("league/1", data.rank === 1)
            this.setActive("league/2", data.rank === 2)
            this.setActive("league/3", data.rank === 3)
            this.setActive("league/n", data.rank > 3)
            this.setLabelValue("league/n/value", data.rank || 0)
        }
    }

    updateUser(player: IMatchPlayer) {
        let userInfo = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (userInfo.userId === player.openid) {
            this.setLabelValue("userName", userInfo.userName)
            this.setSpriteFrame("avatar", userInfo.avatar, true)
            this.setSpriteFrame("country", "image/common/common-country")//Helper.GetContry(userInfo.region))
            this.setActive("self", true)

            if (DataMgr.Config.env != 2) {
                this.setActive("country", false)
                this.setActive("areaInfo", true)
                this.setLabelValue("areaInfo/Label", userInfo.region)
            }
        } else {
            
            // if (id) {
            // User.GetPlyDetail(id, (ply: IPlayerBase) => {
            let setData = (player) => {
                this.setLabelValue("userName", player.userName)
                this.setSpriteFrame("avatar", player.avatar, true)
                this.setSpriteFrame("country", "image/common/common-country")//Helper.GetContry(ply.region))

                if (DataMgr.Config.env != 2) {
                    this.setActive("country", false)
                    this.setActive("areaInfo", true)
                    this.setLabelValue("areaInfo/Label", player.region)
                }
            }
            if (player.openid) {
                if (!player.userName || !player.avatar) {
                    User.GetPlyDetail(player.openid, (ply) => setData(ply))
                } else {
                    setData(player)
                }
            } else {
                this.setLabelValue("userName", this.param.type === Constants.MATCH_TYPE.TOURNEY_MATCH ? "待确定" : "匹配中")
                this.setActive("areaInfo", false)
                this.setActive("country", false)
            }
            // })
            // }
            this.setActive("self", false)
        }
    }

}
