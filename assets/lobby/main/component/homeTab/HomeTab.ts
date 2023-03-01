/*
 * @Description: 主页
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import BaseUI from "../../../start/script/base/BaseUI";
import { IgsBundles } from "../../../start/script/data/IgsBundles";
import { MatchSvr } from "../../../start/script/system/MatchSvr";
import { UserSrv } from "../../../start/script/system/UserSrv";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { Constants } from "../../../start/script/igsConstants";
import { EventMgr } from "../../../start/script/base/EventMgr";
import { UIMgr } from "../../../start/script/base/UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HomeTab extends BaseUI {

    _base: cc.Node = null
    _pop: cc.Node = null

    _bInit: boolean = false

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

        this.initNode()
        this.initEvent()
        this.initData()

        this._bInit = true

        this.scheduleOnce(() => IgsBundles.Preload("lobby", "component/homeTab/matchRunning/MatchRunningList"), 0.0)
    }

    onEnable() {
        if (!this._bInit) {
            return
        }
        MatchSvr.GetInProgressList()
        UserSrv.GetPlayerGameList()

        MatchSvr.GeCompletedList(() => {
            let data = DataMgr.getData<TResults>(Constants.DATA_DEFINE.MATCH_COMPLETED)
            if (!data) {
                return
            }
        })
    }

    initNode() {
        this._pop.height = this.node.parent.parent.height
        this._pop.active = false
    }

    initEvent() {
        EventMgr.on("POP_SHOW", this.onShowPop, this)
        EventMgr.on("POP_HIDE", this.onClosePop, this)
    }

    initData() {
        this._base.children.forEach(i => i.active && cc.tween(i).delay(.1).to(.5, { opacity: 255 }).start())
        this.checkGuide()
    }

    onDestroy() {
        EventMgr.offByTag(this)
    }

    onShowPop() {
        cc.tween(this.node)
            .parallel(
                cc.tween().delay(.3),
                cc.tween().call(() => {
                    cc.tween(this._base).to(.3, { opacity: 0 }).start()
                    this._base.children.forEach(item => {
                        this.removeNodeComponent(item, cc.Widget)
                        cc.tween(item).to(.3, { scale: .9 }).start()
                    })
                })
            )
            .call(() => this._base.active = false)
            .delay(.1)
            .call(() => this._pop.active = true)
            .call(() => this.node.height = this.node.parent.parent.height)
            .call(() => this.node.y = 0)
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
                    cc.tween(this._base).to(.3, { opacity: 255 }).start()
                    this._base.children.forEach(item => {
                        cc.tween(item).to(.3, { scale: 1 }).start()
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
        
        if (record[33] !== 1) {
            let nodes = []
            nodes.push(this.getNode("baseInfo/LevelInfo/LevelInfoEntry"))

            let find = null
            if (this.getNode("baseInfo/NewTurn/list").childrenCount > 0) {
                find = this.getNode("baseInfo/NewTurn/list").children[0]
                nodes.push(this.getNode("baseInfo/NewTurn/list").children[0])
            } else if (this.getNode("baseInfo/Running/list").childrenCount > 0) {
                find = this.getNode("baseInfo/Running/list").children[0]
                nodes.push(this.getNode("baseInfo/Running/list").children[0])
            } else if (this.getNode("baseInfo/Finished/list").childrenCount > 0) {
                find = this.getNode("baseInfo/Finished/list").children[0]
                nodes.push(this.getNode("baseInfo/Finished/list").children[0])
            }
            if (null === find) {
                this.scheduleOnce(() => this.checkGuide(), .1)
                return
            }
            
            UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", { single: true, param: { index: 33, nodes: nodes } })
        }
    }
}
