/*
 * @Description: 联赛简报模块
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210331 1654
 * @LastEditors: sonke
 * @LastEditTime: 20210331 1724
 */

import { Constants } from "../../constants";
import BaseUI from "../../base/BaseUI";
import { UIMgr } from "../../base/UIMgr";
import { EventMgr } from "../../base/EventMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LeagueBriefMode extends BaseUI {

    onOpen() {
        this.initEvent()
        this.initData()
    }

    setParam(param: any = null) {
        this.param = param
        this.initData()
    }

    initEvent() {
        this.setButtonClick("btnShow", this.onPressShow.bind(this))
    }

    initData() {
        if (!this.param)
            return

        let data: ILeagueBase = this.param.league
        if (data) {
            this.setLabelValue("league/index", data.rank < 0 ? 0 : (data.rank + 1))
            this.setLabelValue("award/num", data.medal)

            this.setActive("award/slive", data.type === Constants.LEAGUE_TYPE.PRACTICE_LEAGUE)
            this.setActive("award/gold", data.type === Constants.LEAGUE_TYPE.PROFESSION_LEAGUE)
        }

        this.setLabelValue("player/userName", this.param.userName)
        this.setSpriteFrame("player/avatar", this.param.avatar)
    }
    
    onPressShow() {
        if (!this.param)
            return

        let data: ILeagueBase = this.param.league
        if (data) {
        //    UIMgr.OpenUI("scene/LeagueScene", {parent: "BaseScene/GameCenter/main/view/content", tabPage:true, param: {type: data.type}})
           EventMgr.dispatchEvent(Constants.EVENT_DEFINE.CHANGE_MAIN_TAB, {name: "league", param: {type: data.type}})
        }
    }
}
