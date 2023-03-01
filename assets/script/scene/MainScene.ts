/*
 * @Description: 主页
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import BaseUI from "../base/BaseUI";
import { MatchSvr } from "../system/MatchSvr";
import { LeagueSvr } from "../system/LeagueSvr";
import { DataMgr } from "../base/DataMgr";
import { Constants } from "../constants";
import { UIMgr } from "../base/UIMgr";
import { User } from "../system/User";
import { EventMgr } from "../base/EventMgr";
import { Util } from "../api/utilApi";
import { Helper } from "../system/Helper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainScene extends BaseUI {

    _base: cc.Node = null
    _pop: cc.Node = null

    onLoad() {
        this._base = this.getNode("baseInfo")
        this._pop = this.getNode("popInfo")
        this._base.children.forEach(i => i.opacity = 0)

        let screenHeight = this.node.parent.parent.height

        this._base.on(cc.Node.EventType.SIZE_CHANGED, () => {
            if (!this._base.active) return
            if (screenHeight + 100 >= this._base.height) {
                this.node.height = screenHeight + 100
            } else {
                this.node.height = this._base.height
            }
        }, this, true)        
    }

    onOpen() {
        Helper.reportEvent("大厅", "主页", "打开界面")
        this.initNode()
        this.initEvent()  
        this.initData()
    }
    
    onEnable() {
        MatchSvr.GetInProgressList()
        User.GetPlayerGameList()

        MatchSvr.GeCompletedList(() => {
            let data = DataMgr.getData<TResults>(Constants.DATA_DEFINE.MATCH_COMPLETED)
            if (!data) {
                return
            }
            
            // let results: TResults = data.filter(item => item.playerState === Constants.PLAYER_MATCH_STATE.PLAYER_MATCH_STATE_AWARD)
            // if (results.length > 0) {
            //     results.forEach(item => MatchSvr.GetMatchAward(item.matchUuid))
            // }
        })        
    }

    initNode() {
        // this._pop.height = cc.winSize.height - (87 + 70 + 97 + 20)
        this._pop.height = this.node.parent.parent.height
        this._pop.active = false        
    }

    initEvent() {
        // if (this._pop) {
            // this._pop.on(cc.Node.EventType, this.onShowPop, this, true)
            // this._pop.on(cc.Node.EventType.CHILD_REMOVED, this.onClosePop, this, true)
        // }
        EventMgr.on("POP_SHOW", this.onShowPop, this)
        EventMgr.on("POP_HIDE", this.onClosePop, this)
    }

    initData() {
        // let i = 0
        // cc.tween(this.node)
        // .repeat(this.node.childrenCount, cc.tween().delay(.0).call(() => this.node.children[i++].active = true))
        // .start()
        // this.node.children.forEach(i => cc.tween(i).delay(.1).to(.5, {opacity: 255}).start())
        this._base.children.forEach(i => i.active && cc.tween(i).delay(.1).to(.5, {opacity: 255}).start())
        this.checkGuide()
    }

    onShowPop() {
        cc.tween(this.node)
        .parallel(
            cc.tween().delay(.3),
            cc.tween().call(() => {
                cc.tween(this._base).to(.3, {opacity: 0}).start()
                this._base.children.forEach(item => {
                    this.removeNodeComponent(item, cc.Widget)
                    cc.tween(item).to(.3, {scale: .9}).start()
                })
            })
        )        
        .call(() => this._base.active = false)
        .delay(.1)
        // .call(() => this.node.y = 0)
        .call(() => this._pop.active = true)
        .call(() => this.node.height = this.node.parent.parent.height)
        .call(() => this.node.y = 0)
        // .call(() => this.getNodeComponent(this.node.parent.parent.parent, cc.ScrollView).scrollToTop())
        .start()
    }

    onClosePop() {
        cc.tween(this.node)
        .call(() => this._base.active = true)        
        .call(() => this._pop.active = false)        
        .delay(.1)        
        .parallel(
            cc.tween().delay(.3),
            cc.tween().call(() => {
                cc.tween(this._base).to(.3, {opacity: 255}).start()
                this._base.children.forEach(item => {
                    cc.tween(item).to(.3, {scale: 1}).start()
                })
            })
        )            
        .call(() => this.node.y)
        .call(() => {
            if (this.node.parent.parent.height + 100 >= this._base.height) {
                this.node.height = this.node.parent.parent.height + 100
            } else {
                this.node.height = this._base.height
            }
        })
        .start()
    }

    checkGuide() {
        if (!this.node || !this.node.isValid)
            return

        let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
        // let league = this.getNode("baseInfo/PracticeLeague/LeagueBriefMode")
        // if (!league.active) {
        //     league = this.getNode("baseInfo/ProfessionLeague/LeagueBriefMode")
        // }

        if (record[8] !== 1) {
            let find = null
            if (this.getNode("baseInfo/NewTurn/list").childrenCount > 0) {
                find = this.getNode("baseInfo/NewTurn/list").children[0]
            } else if (this.getNode("baseInfo/Running/list").childrenCount > 0) {
                find = this.getNode("baseInfo/Running/list").children[0]
            } else if (this.getNode("baseInfo/Finished/list").childrenCount > 0) {
                find = this.getNode("baseInfo/Finished/list").children[0]
            } 
            if (null === find) {
                this.scheduleOnce(() => this.checkGuide(), .1)
                return
            }
            UIMgr.OpenUI("component/Base/GameGuidance", {single: true, param: {index: 8, node: find}})
        } 
        // else if (record[9] !== 1) {
        //     UIMgr.OpenUI("component/Base/GameGuidance", {single: true, param: {index: 9, node: league}})          
        // }
    }
}
