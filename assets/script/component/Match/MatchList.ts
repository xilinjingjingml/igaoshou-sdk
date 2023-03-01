/*
 * @Description: 比赛列表 通过配置数据源构建
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { DataMgr } from "../../base/DataMgr";
import MatchMode from "./MatchMode";
import { EventMgr } from "../../base/EventMgr";
import { UIMgr } from "../../base/UIMgr";
import { Helper } from "../../system/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchList extends BaseUI {

    @property({
        type: cc.Enum(Constants.MATCH_TYPE)
    })
    type = -1

    @property()
    listOpen: boolean = false

    @property()
    openButton: cc.SpriteFrame = new cc.SpriteFrame()

    @property()
    closeButton: cc.SpriteFrame = new cc.SpriteFrame()

    _list: cc.Node = null
    _mode: cc.Node = null

    _init: boolean = false

    onOpen() {
        cc.log("Match List open type: " + this.type + " " + Date.now())
        this.initNode()
        this.initEvent()
        this.initData()

        this._init = true
    }

    initNode() {
        this._list = this.getNode("list")
        this._mode = this.getNode("MatchMode")

        let set = DataMgr.getData<boolean>("ml" + this.type + "s")
        if (null !== set && undefined !== set)
            this.listOpen = set

        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (DataMgr.Config.platId === 5) {
            if (this.type === Constants.MATCH_TYPE.BATTLE_MATCH) {
                this.listOpen = user.histroy.allGame < 3 ? false : this.listOpen
            } else if (this.type === Constants.MATCH_TYPE.PRACTICE_MATCH) {
                this.listOpen = user.histroy.allGame === 0 ? true : this.listOpen
            } 
        } else {
            if (this.type === Constants.MATCH_TYPE.BATTLE_MATCH) {
                this.listOpen = user.histroy.allGame === 0 ? true : this.listOpen
            } else if (this.type === Constants.MATCH_TYPE.PRACTICE_MATCH) {
                this.listOpen = user.histroy.allGame < 3 ? false : this.listOpen
            }
        }

        cc.log(" match list initNode getListOpen " + this.listOpen)
        if (this.listOpen) {
            this.setButtonInfo("GameItemTitle/btn", { interactable: true, normalSprite: this.closeButton })
        } else {
            this.setButtonInfo("GameItemTitle/btn", { interactable: true, normalSprite: this.openButton })
        }
    }

    initEvent() {
        // if (this.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
        //     DataMgr.feed(Constants.DATA_DEFINE.MATCH_ACTIVITY, this.updateData, this)
        // } else if (this.type === Constants.MATCH_TYPE.BATTLE_MATCH) {
        //     DataMgr.feed(Constants.DATA_DEFINE.MATCH_BATTLE, this.updateData, this)
        // } if (this.type === Constants.MATCH_TYPE.PRACTICE_MATCH) {
        //     DataMgr.feed(Constants.DATA_DEFINE.MATCH_PRACTICE, this.updateData, this)
        // }

        this.setButtonClick("GameItemTitle/btn", this.switchList.bind(this), 0)

        // DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, this.updateData, this)
        DataMgr.feed(Constants.DATA_DEFINE.MATCH_CONFIG, this.updateData, this)
        EventMgr.on(Constants.EVENT_DEFINE.MATCH_LIST_CLOSE + this.type, () => {
            cc.log(" match list initEvent getCloseEvent ")
            this.listOpen !== false && this.switchList()
        }, this)
    }

    initData() {
        this.updateUserLimit()
        this.updateData()

        Helper.DelayFun(() => this.checkGuide(), .2)
    }

    checkGuide() {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (this.type === Constants.MATCH_TYPE.BATTLE_MATCH) {
            // if (user.histroy.platGame === 1) {
            //     UIMgr.OpenUI("component/Base/GameGuidance", { single: true, param: { index: 1, node: this._list.children[0] } })
            // } else 
            // if (user.histroy.platGame === 2) {
            //     UIMgr.OpenUI("component/Base/GameGuidance", { single: true, param: { index: 7, node: this._list.children[0] } })
            // }
        } else if (this.type === Constants.MATCH_TYPE.PRACTICE_MATCH) {
            let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
            if (DataMgr.Config.platId === 5) {
                if (user.histroy.platGame === 1 && record[1] !== 1) {
                    UIMgr.OpenUI("component/Base/GameGuidance", { single: true, param: { index: 1, node: this._list.children[1] } })
                } else if (user.histroy.platGame === 2 && record[7] !== 1) {
                    UIMgr.OpenUI("component/Base/GameGuidance", { single: true, param: { index: 7, node: this._list.children[1] } })
                }
            } else if (DataMgr.Config.platId !== 5) {
                // else 
                if (user.histroy.platGame >= 3 && user.histroy.platGame <= 10 && record[12] !== 1) {
                    UIMgr.OpenUI("component/Base/GameGuidance", { single: true, param: { index: 12, node: this._list.children[1] } })
                } else if (DataMgr.Config.platId !== 5 && user.histroy.platGame >= 3 && user.histroy.platGame <= 10
                    && record[3] === 1 && record[12] === 1 && record[13] !== 1) {
                    // 领过新手礼包 提示过练习场 没有展示过银币礼包
                    if (DataMgr.Config.platId != 5) {
                        let wcoin = user.items[Constants.ITEM_INDEX.WCOIN].num
                        UIMgr.OpenUI("component/Base/GameGuidance", { single: true, param: { index: 13, wcoin: wcoin } })
                    }
                }
            }
        }
    }

    updateData() {
        let data: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)

        if (!data) {
            return
        }

        let length = 0
        let highLight = false
        let now = Date.now()
        for (let idx in data) {
            length++
            let d = data[idx]
            if (d.type !== this.type)
                continue

            if (!d.hide)
                continue

            let name = "MatchMode" + d.matchId
            let mode = this._list.getChildByName(name)

            if (!mode) {
                mode = cc.instantiate(this._mode)
                if (mode) {
                    mode.name = name
                    mode.parent = this._list
                    mode.active = (!this.listOpen && this._list.children.length === 1) || this.listOpen

                    if (d.order) {
                        mode.setSiblingIndex(d.order)
                    }
                }
            }

            let findShow = false
            this._list.children.forEach(i => i.active ? findShow = true : "")

            if ((!this.listOpen && d.highLight) || (!this.listOpen && !findShow)) {
                this._list.children[0].active = false
                mode.active = true
            }

            highLight = d.highLight || highLight
            if (mode.active) {
                this.setChildParam(mode, this._list, d)
            }
        }

        length = 0
        this._list.children.forEach(i => length += i.name.indexOf("MatchMode") !== -1 && i.active ? 1 : 0)
        this.node.children.forEach(item => item.name === "MatchMode" ? item.active = false : item.active = length > 0)
        this.setLayoutInfo(this.node, { spacingY: length === 0 ? 0 : 8, bottom: length === 0 ? 0 : 8, })
    }

    updateUserLimit() {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (DataMgr.Config.platId === 5) {
            if (this.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                this.node.active = user.histroy.allGame >= 3
            } else if (this.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
                this.node.active = user.histroy.allGame >= 20
            } else if (this.type === Constants.MATCH_TYPE.BATTLE_MATCH) {

            } else if (this.type === Constants.MATCH_TYPE.PRACTICE_MATCH) {

            }
        } else {
            if (this.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                this.node.active = user.histroy.allGame >= 3
            } else if (this.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
                this.node.active = user.histroy.allGame >= 20
            } else if (this.type === Constants.MATCH_TYPE.BATTLE_MATCH) {

            } else if (this.type === Constants.MATCH_TYPE.PRACTICE_MATCH) {
                this.node.active = user.histroy.allGame >= 3 || !user.newbie
            }
        }
    }

    switchList() {
        this.setButtonInfo("GameItemTitle/btn", { interactable: false })
        if (this.listOpen) {
            let i = 1
            let mid = null
            let data: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
            for (let idx in data) {
                if (data[idx].type === this.type && data[idx].highLight) {
                    mid = "MatchMode" + data[idx].matchId
                }
            }
            this._list.children.forEach(item => item.active = mid ? item.name === mid : (1 === i++))
            this.setButtonInfo("GameItemTitle/btn", { interactable: true, normalSprite: this.openButton })
            this.listOpen = false
            DataMgr.setData("ml" + this.type + "s", false, true)
            this.updateData()
        } else {
            let i = 0
            cc.tween(this._list)
                .repeat(this._list.childrenCount,
                    cc.tween()
                        .delay(.03)
                        .call(() => {
                            let n = this._list.children[i++]
                            n.opacity = 0
                            n.scaleY = 0
                            n.active = true
                            cc.log("open", this._list.position)
                            cc.tween(n)
                                .to(.05, { opacity: 255, scaleY: 1 })
                                .start()
                        }))
                .call(() => {
                    this.setButtonInfo("GameItemTitle/btn", { interactable: true, normalSprite: this.closeButton })
                    this.listOpen = true
                    DataMgr.setData("ml" + this.type + "s", true, true)
                    this.updateData()
                })
                .start()
        }
    }

    onEnable() {
        if (this._init) {
            this.initData()
        }
    }
}