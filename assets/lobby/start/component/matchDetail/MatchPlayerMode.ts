import BaseUI from "../../script/base/BaseUI";
import { Constants } from "../../script/igsConstants";
import { MatchSvr } from "../../script/system/MatchSvr";
import { User } from "../../script/data/User";
import { DataMgr } from "../../script/base/DataMgr";
import { UserSrv } from "../../script/system/UserSrv";
import { Helper } from "../../script/system/Helper";


const { ccclass, property } = cc._decorator;

const SEARCH_TIP = "正在寻找对手..."

@ccclass
export default class MatchPlayerMode extends BaseUI {

    _init: boolean = false
    _curOpenId: string = ""

    onOpen() {
        // this.initData()

        this._init = true
    }

    onLoad(): void {
        this.setActive("avatarFrame", false)
        this.setActive("avatarFrameMember", false)
    }

    setParam(data) {
        this.param = data
        this.initData()
    }

    initData() {
        // if (!this._init)
        //     return

        let data: IMatchDetail = this.param.match

        let player = this.param.player
        if (!player)
            return

        this.updateUser(player)

        this.getNode("league").children.forEach(i => i.active = false)

        this.setActive("score", false)
        this.setActive("scoreTip", false)
        this.setActive("state", false)
        this.setActive("searchTip", false)

        this.setActive("country", false)
        this.setActive("awards", false)

        if (!player.openid) {
            this.setActive("searchTip", true)
            // this.setLabelValue("searchTip", "正在寻找对手...")            
            if (player.openid !== this._curOpenId) {
                this.stopTween("searchTip")
                let idx = 0
                this.runTween("searchTip", cc.tween().repeatForever(cc.tween()
                .delay(.5).call(() => {
                    this.setLabelValue("searchTip", SEARCH_TIP.substring(0, 6 + (idx++ % 4)))
                })))
                this._curOpenId = player.openid
            }
            this.setActive("userName", false)
            if (data.playerNum > 2) {
            this.setActive("league/n", true)
            this.setLabelValue("league/n/value", "?")
            }
        } else if (player.state === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_REBATTLE) {
            this.setActive("score", true)
            this.setActive("scoreTip", true)
            this.setLabelValue("score", player.rebattleScore || 0)
            if (data.playerNum > 2) {
            this.setActive("league/n", true)
            this.setLabelValue("league/n/value", "?")
            }
        } else if (player.state === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_WAITING || player.state === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_GAMING) {
            this.setActive("state", true)
            this.setLabelValue("state", "未完成")
            if (data.playerNum > 2) {
            this.setActive("league/n", true)
            this.setLabelValue("league/n/value", "?")
            }
        } else if (player.state === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_ABORTED) {
            this.setActive("state", true)
            this.setLabelValue("state", "已中止")
            // if (data.playerNum > 2) {
            //     this.setActive("league/n", true)
            //     this.setLabelValue("league/n/value", "?")
            // }
            if (player.rank) {
                this.setActive("league/1", player.rank === 1)
                this.setActive("league/2", player.rank === 2)
                this.setActive("league/3", player.rank === 3)
                this.setActive("league/n", player.rank > 3)
                this.setLabelValue("league/n/value", player.rank || 0)
            }
        } else if (data.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
            this.setActive("score", true)
            this.setActive("scoreTip", true)
            this.setLabelValue("score", player.score || 0)
            this.setActive("league/cup", player.win)
        } else if (data.playerState !== Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_AWARD && data.playerState !== Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMEOVER) {
            this.setActive("score", true)
            this.setActive("scoreTip", true)
            this.setLabelValue("score", Number.isNaN(player.score) ? "?" : player.score || 0)
            if (data.playerNum > 2) {
                this.setActive("league/n", true)
                this.setLabelValue("league/n/value", "?")
            }
        } else if (data.type === Constants.MATCH_TYPE.REALTIME_MATCH) {
            this.setActive("datingjiesuan-win", player.win === true || player.rank === 1)
            this.setActive("datingjiesuan-lose", player.win === false || player.rank > 1)
            this.setActive("score", false)
        } else {
            this.setActive("league/1", player.rank === 1)
            this.setActive("league/2", player.rank === 2)
            this.setActive("league/3", player.rank === 3)
            this.setActive("league/n", player.rank > 3)
            this.setLabelValue("league/n/value", player.rank || 0)
            this.setActive("score", true)
            this.setActive("scoreTip", true)
            this.setLabelValue("score", Number.isNaN(player.score) ? "?" : player.score || 0)
        }

        if (player.state === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SETTLE) {
            this.setActive("awards", true)
            this.setActive("awards/gold", false)
            this.setActive("awards/lottery", false)
            this.setActive("awards/credits", false)
            let awards = MatchSvr.GetAwards(data.matchId, player.rank)
            awards = awards.filter(i => i.id < Constants.ITEM_INDEX.Exp && i.num > 0)
            for (let idx in awards) {
                if (awards[idx].id === Constants.ITEM_INDEX.GOLD) {
                    this.setActive("awards/gold", true)
                    this.setLabelValue("awards/gold/num", awards[idx].num)
                } else if (awards[idx].id === Constants.ITEM_INDEX.LOTTERY) {
                    this.setActive("awards/lottery", true)
                    this.setLabelValue("awards/lottery/num", awards[idx].num)
                } else if (awards[idx].id === Constants.ITEM_INDEX.CREDITS) {
                    this.setActive("awards/credits", true)
                    this.setLabelValue("awards/credits/num", awards[idx].num)
                }
            }
        }
    }

    updateUser(player: IMatchPlayer) {
        if (User.OpenID === player.openid) {
            this.setActive("userName", true)
            this.setLabelValue("userName", User.UserName)
            this.setSpriteFrame("face/avatar", User.Avatar, true)
            this.setSpriteFrame("country", "image/common/common-country")//Helper.GetContry(userInfo.region))
            this.setActive("self", true)
            if (DataMgr.data.OnlineParam.golden_card && DataMgr.data.OnlineParam.golden_card == 1) {
                this.setActive("avatarFrame", true)
                let isMember = DataMgr.getData<boolean>(User.OpenID+Constants.DATA_DEFINE.IS_MEMBER)
                this.setActive("avatarFrame", !isMember)
                this.setActive("avatarFrameMember", isMember)
            }

            if (DataMgr.data.Config.env != 2) {
                this.setActive("country", false)
                this.setActive("areaInfo", this.param.match?.playerNum <= 2)
                this.setLabelValue("areaInfo/Label", User.Region)
            }
        } else {
            let setData = (player) => {
                this.setActive("userName", true)
                this.setLabelValue("userName", player.userName)
                this.setSpriteFrame("face/avatar", player.avatar, true)
                this.setSpriteFrame("country", "image/common/common-country")//Helper.GetContry(ply.region))

                if (DataMgr.data.OnlineParam.golden_card && DataMgr.data.OnlineParam.golden_card == 1) {
                    let isMember = player.props && Helper.isMember(player.props[Constants.ITEM_INDEX.MemberCard])
                    this.setActive("avatarFrame", !isMember)
                    this.setActive("avatarFrameMember", isMember)                    
                }
                if (DataMgr.data.Config.env != 2) {
                    this.setActive("country", false)
                    this.setActive("areaInfo", this.param.match?.playerNum <= 2)
                    let region = "上海市"
                    if (player.region) {
                        let area_arr = player.region.split("|")
                        region = area_arr[2] || area_arr[0]
                    }
                    region = region.length > 0 ? region : "上海市"
                    this.setLabelValue("areaInfo/Label", region)
                }
            }
            if (player.openid) {
                if (!player.userName || !player.avatar /*|| !player.props*/) {
                    UserSrv.GetPlyDetail(player.openid, (ply) => setData(ply))
                } else {
                    setData(player)
                }
            } else {
                this.setSpriteFrame("face/avatar", "image/common-morentouxiang")
                if (this.param.match?.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
                    this.setLabelValue("userName", "待确定")
                } else {
                    this.setLabelValue("userName", "正在寻找对手")
                }
                this.setActive("areaInfo", false)
                this.setActive("country", false)
            }

            this.setActive("self", false)
        }
    }

}
