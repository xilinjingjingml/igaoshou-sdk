import BaseUI from "../../../../start/script/base/BaseUI";
import { QualifyingSrv } from "../../../../start/script/system/QualifyingSrv";
import { DataMgr } from "../../../../start/script/base/DataMgr";
import { Constants } from "../../../../start/script/igsConstants";
import { User } from "../../../../start/script/data/User";
import { Helper } from "../../../../start/script/system/Helper";
import { LeagueSvr } from "../../../../start/script/system/LeagueSvr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class LeagueMode extends BaseUI {

    like_star:number = 0

    initBtn = false
    onOpen() {

    }

    initNode() {

    }

    onLoad(){
        this.setActive("avatar/avatarFrame", false)
    }

    initButton() {
        if(!this.initBtn){
            this.initBtn = true
            this.setButtonClick("btnPraise", this.node, () => {
                cc.log("on click btnPraise")
                QualifyingSrv.GetCurSeason((res)=>{
                    let param = {
                        season_id: res.cur_season_id,
                        openid: this.param.data.user.openId
                    }
                    QualifyingSrv.RankLike(param, (res)=>{
                        this.like_star = this.like_star + 1
                        this.setLabelValue("btnPraise/Background/Label", "x" + this.like_star)
                        this.setLabelValue("btnBePraise/Background/Label", "x" + this.like_star)
                        let btnPraise = cc.find("btnPraise", this.node)
                        let btnBePraise = cc.find("btnBePraise", this.node)
                        if(btnPraise && btnBePraise){                        
                            btnPraise.active = false
                            btnBePraise.active = true
                        }

                        let data: ILeagueRow = this.param.data
                        if(data && data.user && data.user.gradeRank){
                            let dataList = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + Constants.LEAGUE_TYPE.QUALIFYING)  
                            if(dataList.rows[data.user.gradeRank.rank]){
                                dataList.rows[data.user.gradeRank.rank].user.gradeRank.like_star += 1
                                dataList.rows[data.user.gradeRank.rank].user.gradeRank.today_like = true
                                DataMgr.setData(Constants.DATA_DEFINE.LEAGUE_PRACTICE + Constants.LEAGUE_TYPE.QUALIFYING, dataList)
                            }
                        }
                    })
                })
            })
        }
    }

    initData() {
        let data: ILeagueRow = this.param.data
        if (!data) {
            return
        }

        let leagueId = this.param.leagueId

        let league = this.getNode("league")
        league.children.forEach(item => item.active = false)
        data.rank = Number(data.rank) || 0

        if (data.rank === 0) {
            this.setActive("league/1", true)
        } else if (data.rank === 1) {
            this.setActive("league/2", true)
        } else if (data.rank === 2) {
            this.setActive("league/3", true)
        } else if (data.rank >= 0) {
            this.setActive("league/n", true)
            this.setLabelValue("league/n/num", "" + (data.rank + 1))
        }else {
            this.setActive("league/n", true)
            this.setLabelValue("league/n/num", "1000+")
        }

        if (data.user) {    
            this.setActive("bg/self_bg", data.user.openId === User.OpenID)
            // if (data.user.openId === user.openId) {
            //     this.setLabelValue("userName", user.userName)
            //     this.setSpriteFrame("avatar", user.avatar)
            //     this.setSpriteFrame("country", Helper.GetContry(user.region))
            // } else {
                this.setLabelValue("userName", data.user.userName || "未知用户")
                let avatar = cc.find("avatar", this.node)
                avatar.getComponent(cc.Sprite).spriteFrame = null
                this.setSpriteFrame("avatar", data.user.avatar)
                this.setSpriteFrame("country", Helper.GetContry(User.Region))

                this.setActive("avatar/avatarFrame", false)
                this.setActive("avatar/avatarFrameMember", false)

                if (DataMgr.data.OnlineParam.golden_card && DataMgr.data.OnlineParam.golden_card == 1) {                    
                    let isMember = false
                    if(data.user.openId === User.OpenID){
                        isMember = DataMgr.getData(User.OpenID+Constants.DATA_DEFINE.IS_MEMBER)
                    }else if(data.props && Helper.isMember(data.props[Constants.ITEM_INDEX.MemberCard])){
                        isMember = true
                    }
                    this.setActive("avatar/avatarFrame", !isMember)
                    this.setActive("avatar/avatarFrameMember", isMember)
                }

            //段位排行信息
            if(data.user.gradeRank){
                let gradeRank = data.user.gradeRank
                this.setSpriteFrame("grade_icon", "image/qualifyingIcons/major_icon_lv" + gradeRank.grade.major)
                this.setSpriteFrame("grade_lv", "image/qualifyingIcons/name_lv" + (gradeRank.grade.level >= 25 ? 25 : gradeRank.grade.level))
                this.setLabelValue("grade_lv_label", gradeRank.grade.name)
                this.setLabelValue("stars/num", "x" + gradeRank.grade.star)
                this.setLabelValue("btnPraise/Background/Label", "x" + gradeRank.like_star)
                this.setLabelValue("btnBePraise/Background/Label", "x" + gradeRank.like_star)
                this.like_star = gradeRank.like_star
                

                let btnPraise = cc.find("btnPraise", this.node)
                let btnBePraise = cc.find("btnBePraise", this.node)
                if(btnPraise && btnBePraise){
                    if(data.user.openId === User.OpenID){
                        btnPraise.active = false
                        btnBePraise.active = false
                    }else{
                        btnPraise.active = !gradeRank.today_like
                        btnBePraise.active = gradeRank.today_like
                    }
                }
            }
        }

        if (data.medal) {
            let medalId = data.type === Constants.LEAGUE_TYPE.PROFESSION_LEAGUE ? Constants.ITEM_INDEX.GoldenMedal : Constants.ITEM_INDEX.SilverMedal
            this.setActive("medal/silver", false)
            this.setActive("medal/gold", false)
            let idx = 0
            if (medalId === Constants.ITEM_INDEX.GoldenMedal) {
                this.setActive("medal/gold", true)
                this.setLabelValue("medal/gold/num", Helper.FormatNumWYCN(data.medal))
            } else if (medalId === Constants.ITEM_INDEX.SilverMedal) {
                this.setActive("medal/silver", true)
                this.setLabelValue("medal/silver/num", Helper.FormatNumWYCN(data.medal))
            } else {
                this.setActive("medal", false)
            }

            LeagueSvr.GetLeagueAwardConfigByRank(data.type, data.rank + 1, leagueId, (awards) => {
                if (awards && awards.length > 0) {                   
                    this.setActive("award/null", false)
                    this.setActive("award/gold", false)
                    this.setActive("award/lottery", false)
                    this.setActive("award/credits", false)
                    for (let i in awards) {
                        if (awards[i].id === Constants.ITEM_INDEX.GOLD) {
                            this.setActive("award/gold", true)
                            this.setLabelValue("award/gold/num", Helper.FormatNumWYCN(awards[i].num))
                        } else if (awards[i].id === Constants.ITEM_INDEX.LOTTERY) {
                            this.setActive("award/lottery", true)
                            this.setLabelValue("award/lottery/num", Helper.FormatNumWYCN(awards[i].num))
                        } else if (awards[i].id === Constants.ITEM_INDEX.CREDITS) {
                            this.setActive("award/credits", true)
                            this.setLabelValue("award/credits/num", Helper.FormatNumWYCN(awards[i].num))
                            this.setActive("award/credits/add", idx > 0)
                        }
                    }
                } else {
                    this.setActive("award/gold", false)
                    this.setActive("award/lottery", false)
                    this.setActive("award/credits", false)
                    this.setActive("award/null", true)
                }
            })

            this.setActive("self", !!this.param.self)
        }
    }

    setParam(param) {
        this.param = param
        this.initData()
        this.initButton()
    }
}
