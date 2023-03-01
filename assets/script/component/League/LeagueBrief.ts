/*
 * @Description: 联赛简报
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210331 1654
 * @LastEditors: sonke
 * @LastEditTime: 20210331 1654
 */

import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { DataMgr } from "../../base/DataMgr";
import { LeagueSvr } from "../../system/LeagueSvr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LeagueBrief extends BaseUI {

    @property({
        type: cc.Enum(Constants.LEAGUE_TYPE)
    })
    type: Constants.LEAGUE_TYPE = Constants.LEAGUE_TYPE.NONE

    _userId: string = null

    onOpen() {
        this.initEvent()
        this.initData()
    }

    initEvent() {
        DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, this.updateLeague, this)
        LeagueSvr.GetCurLeague(this.type)
    }

    initData() {
        this._userId = this.param.uid
        this.updateLeague()
    }

    updateLeague() {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (this._userId && this._userId !== user.userId) {
            let list = DataMgr.getData<TPlayers>(Constants.DATA_DEFINE.PLAYERS_INFO)
            user = list[this._userId]
        }
        if (!user.league) {
            this.node.children.forEach(item => item.active = false)
            this.setLayoutInfo(this.node, {bottom: 0, spacingY: 0})
            return
        }
        
        let league = user.league[this.type]
        if (this.type === Constants.LEAGUE_TYPE.PRACTICE_LEAGUE) {
            let profession = user.league[Constants.LEAGUE_TYPE.PROFESSION_LEAGUE]
            if (profession && profession.rank >= 0) {
                league = null
            }
        }
        if (!league || league.rank < 0) {
            this.node.children.forEach(item => item.active = false)
            this.setLayoutInfo(this.node, {bottom: 0, spacingY: 0})
        } else {
            this.node.children.forEach(item => item.active = true)
            this.setLayoutInfo(this.node, {bottom: 8,spacingY: 8})
            this.setChildParam("LeagueBriefMode", {league: league, userName: user.userName, avatar: user.avatar})
        }
    }
}