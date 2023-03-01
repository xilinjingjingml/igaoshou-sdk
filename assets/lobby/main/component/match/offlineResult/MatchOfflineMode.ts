import BaseUI from "../../../../start/script/base/BaseUI";
import { Constants } from "../../../../start/script/igsConstants";
import { MatchSvr } from "../../../../start/script/system/MatchSvr";
import { Helper } from "../../../../start/script/system/Helper";
import { User } from "../../../../start/script/data/User";
import { UserSrv } from "../../../../start/script/system/UserSrv";
import { QualifyingSrv } from "../../../../start/script/system/QualifyingSrv";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchOfflineMode extends BaseUI {

    onLoad() {
        this.node.children.forEach(i => i.active = false)
    }

    onOpen() {
        this.initEvent()
        this.initData()
    }

    setParam(param) {
        this.param = param
        this.initData()
    }

    initEvent() {
        this.setButtonClick("btnOpen", this.onPressGetAwards.bind(this))
    }

    initData() {
        let data: IMatchDetail = this.param.data
        if (!data) {
            // this.setActive("bg", this.param.idx % 2 === 1)
            this.setActive("bg", true)
            return
        }

        this.node.children.forEach(i => i.active = true)        
        this.setActive("grade", false)
        // this.setActive("bg", this.param.idx % 2 === 1)
        let match = MatchSvr.GetMatchInfo(data.matchId)
        if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH || match.isMultiplayer) {
            if (undefined !== data.rank && null !== data.rank && !isNaN(data.rank)) {
                let items = {}
                if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                    this.setLabelValue("result", "第" + (data.rank + 1) + "名")
                    items = MatchSvr.GetAwards(data.matchId, data.rank + 1)
                } else if (match.isMultiplayer) {
                    this.setLabelValue("result", "第" + (data.rank + 1) + "名")
                    items = MatchSvr.GetAwards(data.matchId, data.rank)
                }
                                
                this.setActive("awards/gold", false)
                this.setActive("awards/lottery", false)
                this.setActive("awards/credits", false)
                for (let i in items) {
                    if (items[i].id === Constants.ITEM_INDEX.GOLD) {
                        this.setActive("awards/gold", true)
                        this.setLabelValue("awards/gold/num", Helper.FormatNumWYCN(items[i].num))
                    } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                        this.setActive("awards/lottery", true)
                        this.setLabelValue("awards/lottery/num", Helper.FormatNumWYCN(items[i].num))
                    } else if (items[i].id === Constants.ITEM_INDEX.CREDITS) {
                        this.setActive("awards/credits", true)
                        this.setLabelValue("awards/credits/num", Helper.FormatNumWYCN(items[i].num))
                    }
                }
            } else {
                this.setLabelValue("result", "未上榜")

                this.setActive("awards/gold", false)
                this.setActive("awards/lottery", false)
                this.setActive("awards/credits", false)
            }

            // this.setNodePositionY("result", 20)
            this.setLabelValue("matchName", data.name)

            // this.setSpriteFrame("avatar", user.avatar)
            if (data.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                this.setActive("huodongsai", true)
            } else if (data.playerNum > 2) {
                this.setActive("tuandui", true)
            } 

            this.setActive("vs", false)
            this.setLabelValue("name", "")
        } else {
            for (let idx in data.players) {
                let p = data.players[idx]
                if (p.win) {
                    if (p.openid === User.OpenID) {
                        this.setLabelValue("result", "您赢了")
                    } else {
                        this.setLabelValue("result", "您输了")                        
                        // this.setLabelInfo("result", {color:cc.color(255,116,116)})           
                        UserSrv.GetPlyDetail(p.openid, (ply: IPlayerData) => {
                            this.setLabelValue("name", ply.userName)
                        })
                    }
                }

                this.setActive("huodongsai", false)
                this.setActive("tuandui", false)

                if (p.openid === User.OpenID) {
                    let items = MatchSvr.GetAwards(data.matchId, p.rank)
                    // this.setChildParam("awards/ItemMode", {items: MatchSvr.GetAwards(data.matchId, p.rank)})
                    this.setActive("awards/gold", false)
                    this.setActive("awards/lottery", false)
                    this.setActive("awards/credits", false)
                    let idx = 0
                    for (let i in items) {
                        if (items[i].id === Constants.ITEM_INDEX.GOLD) {
                            this.setActive("awards/gold", true)
                            this.setLabelValue("awards/gold/num", Helper.FormatNumWYCN(items[i].num))
                        } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                            this.setActive("awards/lottery", true)
                            this.setLabelValue("awards/lottery/num", Helper.FormatNumWYCN(items[i].num))
                        } else if (items[i].id === Constants.ITEM_INDEX.CREDITS) {
                            this.setActive("awards/credits", true)
                            this.setLabelValue("awards/credits/num", Helper.FormatNumWYCN(items[i].num))
                        }
                        idx++
                    }
                } else {
                    UserSrv.GetPlyDetail(p.openid, (ply: IPlayerData) => {
                        this.setLabelValue("name", ply.userName)
                        this.setSpriteFrame("avatar", ply.avatar)
                    })
                }
            }
        }

        if (data.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_AWARD) {
            this.setActive("LXJS-lihetubiao", true)
            this.setActive("awards", false)
            this.setLabelValue("result", "比赛完成")
        } else {
            this.setActive("LXJS-lihetubiao", false)
            let awards = this.getNode("awards")
            cc.tween(awards)
                .set({ opacity: 0, active: true })
                .delay(.2)
                .to(.2, { opacity: 255 })
                .start()

            if(data.gradeDate && data.gradeDate.after_grade){
                QualifyingSrv.resetGradeData(data.gradeDate.before_grade)
                QualifyingSrv.resetGradeData(data.gradeDate.after_grade)                
                let after = data.gradeDate.after_grade
                if(after){
                    this.setActive("grade", true)                
                    this.setSpriteFrame("grade/major", "image/qualifyingIcons/major_icon_lv" + after.major)
                    this.setSpriteFrame("grade/minor", "image/qualifyingIcons/name_lv" + (after.level >= 25 ? 25 : after.level))
                    this.setLabelValue("grade/grade_lv_label", after.name)
                    if(after.maxStar > 5){
                        this.setActive("grade/star1", false)
                        this.setActive("grade/star2", false)
                        this.setActive("grade/star3", false)
                        this.setActive("grade/star4", false)
                        this.setActive("grade/star5", false)
                        this.setActive("grade/totalStar", true)
                        this.setLabelValue("grade/totalStar/num", "x" + after.star)
                    }else{
                        for(let i = 1; i <= 5; i++){
                            if(i <= after.maxStar){
                                this.setActive("grade/star" + i, true)
                            }else{
                                this.setActive("grade/star" + i, false)
                            }
            
                            if(i <= after.star){
                                this.setActive("grade/star" + i + "/star", true)
                            }else{
                                this.setActive("grade/star" + i + "/star", false)
                            }
                        }
                    }
                }
            }
        }
    }

    onPressGetAwards() {
        let data: IMatchDetail = this.param.data
        MatchSvr.GetMatchAward(data.matchUuid, () => {
            data.playerState = Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_GAMEOVER
            this.param.data = data
            this.initData()
        })
    }
}
