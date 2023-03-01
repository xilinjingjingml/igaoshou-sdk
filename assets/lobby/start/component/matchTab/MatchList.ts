/*
 * @Description: 比赛列表 通过配置数据源构建
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import BaseUI from "../../script/base/BaseUI";
import { Constants } from "../../script/igsConstants";
import { DataMgr } from "../../script/base/DataMgr";
import { User } from "../../script/data/User";
import { EventMgr } from "../../script/base/EventMgr";
import { UIMgr } from "../../script/base/UIMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchList extends BaseUI {
    @property({
        type: cc.Enum(Constants.MATCH_TYPE)
    })
    type = -1

    @property()
    isRealTime: boolean = false

    @property()
    listOpen: boolean = false

    @property({ type: cc.SpriteFrame })
    openButton: cc.SpriteFrame

    @property({ type: cc.SpriteFrame })
    closeButton: cc.SpriteFrame

    _list: cc.Node = null
    _mode: cc.Node = null

    _init: boolean = false

    _gameId: string = null

    _bCheckGuide: boolean = false

    start() {
        cc.log("Match List open type: " + this.type + " " + Date.now())
        this.initNode()
        this.initEvent()
        this.node.opacity = 0
        this._init = true

        cc.director.once(cc.Director.EVENT_AFTER_DRAW, () => {
            this.initData()
        })
    }

    initNode() {
        this._list = this.getNode("list")
        this._mode = this.getNode("MatchMode")

        let set = DataMgr.getData<boolean>("ml" + this.type + "s")
        if (null !== set && undefined !== set)
            this.listOpen = set

        if (DataMgr.data.Config.platId === 5) {
            if (this.type === Constants.MATCH_TYPE.BATTLE_MATCH) {
                this.listOpen = User.PlayGame < 2 ? false : this.listOpen
            } else if (this.type === Constants.MATCH_TYPE.PRACTICE_MATCH) {
                this.listOpen = User.PlayGame === 0 ? true : this.listOpen
            }
        } else {
            if (this.type === Constants.MATCH_TYPE.BATTLE_MATCH) {
                this.listOpen = User.PlayGame === 0 ? true : this.listOpen
            } else if (this.type === Constants.MATCH_TYPE.PRACTICE_MATCH) {
                this.listOpen = User.PlayGame < 2 ? false : this.listOpen
            }
        }

        cc.log(" match list initNode getListOpen " + this.listOpen)
        if (this.listOpen) {
            this.setButtonInfo("title/btn", { interactable: true, normalSprite: this.closeButton })
        } else {
            this.setButtonInfo("title/btn", { interactable: true, normalSprite: this.openButton })
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

        this.setButtonClick("title/btn", this.switchList.bind(this), 0)

        // DataMgr.feed(Constants.DATA_DEFINE.USER_INFO, this.updateData, this
        DataMgr.feed(Constants.DATA_DEFINE.MATCH_CONFIG, this.updateData, this)
        EventMgr.on(Constants.EVENT_DEFINE.UPDATE_MATCH_LIST, this.updateData, this)
        EventMgr.on(Constants.EVENT_DEFINE.MATCH_LIST_CLOSE + this.type, () => {
            cc.log(" match list initEvent getCloseEvent ")
            this.listOpen !== false && this.switchList()
        }, this)
        EventMgr.on(Constants.EVENT_DEFINE.UPDATE_MATCH_LIST_CHILDREN, this.updateDataList, this)
    }

    initData() {
        this.updateUserLimit()
        if (!this.node.active) {
            return
        }
        this.updateData()

        // this.node.opacity = 255
        this._list.getComponent(cc.Layout).updateLayout()
        this.node.getComponent(cc.Layout).updateLayout()
        this.node.parent.getComponent(cc.Layout).updateLayout()

        // Helper.DelayFun(() =>this.checkGuide(), .2)
    }

    onDestroy() {
        EventMgr.offByTag(this)
    }

    checkGuide() {
        this._bCheckGuide = true
        let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
        if (this.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
            //if (User.PlayGame === 5 && record[29] !== 1) {
            //    UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", { single: true, param: { index: 29, node: this._list.children[0], type: this.type }, index: 8 })
            //}
        } else if (this.type === Constants.MATCH_TYPE.BATTLE_MATCH) {
            if (DataMgr.data.OnlineParam.guideBattle === 1 && User.PlayGame === 3 && record[30] !== 1) {
                UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", { single: true, param: { index: 30, node: this._list.children[0], type: this.type }, index: 8 })
            }
        } else if (this.type === Constants.MATCH_TYPE.REALTIME_MATCH) {
            if (DataMgr.data.OnlineParam.guideRealTime === 1 && User.PlayGame === 3 && record[30] !== 1) {
                UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", { single: true, param: { index: 30, node: this._list.children[0], type: this.type }, index: 8 })
            }
        } else if (this.type === Constants.MATCH_TYPE.PRACTICE_MATCH) {
            if (DataMgr.data.OnlineParam.guideBattle === 1 || DataMgr.data.OnlineParam.guideRealTime === 1 || DataMgr.data.OnlineParam.guideRealTime === 2) {
                return
            }
            if (DataMgr.data.Config.platId === 5) {
                if (User.PlayGame === 2 && record[7] !== 1 && this._list.childrenCount >= 2) {
                    UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", { single: true, param: { index: 7, node: this._list.children[1] }, index: 8 })
                }
            } else if (DataMgr.data.Config.platId !== 5) {
                if (User.PlayGame === 3 && User.PlayGame <= 10 && record[12] !== 1 && this._list.childrenCount >= 2) {
                    UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", { single: true, param: { index: 12, node: this._list.children[1] }, index: 8 })
                } else if (DataMgr.data.Config.platId !== 5 && User.PlayGame >= 3 && User.PlayGame <= 10
                    && record[3] === 1 && record[12] === 1 && record[13] !== 1) {
                }
            }
        }
    }

    updateData() {
        this.updateUserLimit()

        if (this.type === Constants.MATCH_TYPE.REALTIME_MATCH) {
            this.updateRealTime()
            return
        }

        if (this._gameId !== DataMgr.data.Config.gameId) {
            this._list.removeAllChildren(true)
            this._gameId = DataMgr.data.Config.gameId
        }

        let data: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)

        if (!data) {
            return
        }

        for (let idx in data) {
            // length++
            let d = data[idx]
            if (d.gameId !== DataMgr.data.Config.gameId) {
                continue
            }

            if (d.type !== this.type) {
                continue
            }

            if (!d.hide)
                continue

            if (!!d.realTime !== this.isRealTime) {
                continue
            }

            let name = "MatchMode" + d.matchId
            let mode = this._list.getChildByName(name)

            if (!mode) {
                mode = cc.instantiate(this._mode)
                mode.name = name
                mode.parent = this._list

                if (d.order) {
                    mode.setSiblingIndex(d.order)
                }
            }

            mode.active = (!this.listOpen && this._list.children.length === 1) || this.listOpen
            mode["highLight"] = d.highLight
            this.setChildParam(mode, this._list, d)

            // console.log("====create " + d.type + " mode " + name + " activie" + mode.active)
        }
        this.updateDataList()
    }

    updateRealTime() {
        let data: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)

        if (!data) {
            return
        }

        let realTimeMatch = false
        let realTimeAdMatch = false

        for (let i in data) {
            if (data[i].type === Constants.MATCH_TYPE.REALTIME_MATCH) {
                // let gateMoney = data[i].gateMoney.filter(i => i.id === Constants.ITEM_INDEX.LOTTERY && i.num > 0)
                if (data[i].freeAd) {//} || gateMoney.length === 0) {
                    realTimeAdMatch = true
                } else {
                    realTimeMatch = true
                }

                if (realTimeMatch && realTimeAdMatch) {
                    break
                }
            }
        }

        if (realTimeMatch) {
            let mode = this._list.getChildByName("realtime")
            if (!mode) {
                mode = cc.instantiate(this._mode)
                mode.name = "realtime"
                mode.parent = this._list
                mode.active = true
            }

            this.stopTween(mode)
            if (DataMgr.data.OnlineParam.breathing_tips === Constants.MATCH_TYPE.REALTIME_MATCH) {
                this.setActive("top", mode, true)
                this.runTween(mode,
                    cc.tween()
                        .repeatForever(cc.tween()
                            .to(.8, { scale: .95 })
                            .to(.8, { scale: 1 }))
                        .start()
                )
            }

            this.setChildParam(mode, { realTime: true, freeAd: false, _noInit: true })
        }

        if (realTimeAdMatch) {
            let mode = this._list.getChildByName("realtimeAd")
            if (!mode) {
                mode = cc.instantiate(this._mode)
                mode.name = "realtimeAd"
                mode.parent = this._list
                mode.active = true
                this.setLabelValue("info/detail/name", mode, "免费实时对战赛")
                this.setActive("info/detail/join/bofang", mode, true)
            }

            this.setChildParam(mode, { realTime: true, freeAd: true, _noInit: true })
        }

        // for (let i in data) {
        //     if (data[i].type === Constants.MATCH_TYPE.REALTIME_MATCH) {
        //         let mode = this._list.getChildByName("realtime")
        //         if (!mode) {
        //             mode = cc.instantiate(this._mode)
        //             mode.name = "realtime"
        //             mode.parent = this._list
        //             mode.active = true
        //         }
        //         cc.assetManager.loadBundle("realTime")
        //         break
        //     }
        // }

        this.updateDataList()
    }

    updateDataList() {
        if (!this.listOpen) {
            let firstIdx = null
            for (let idx in this._list.children) {
                let node = this._list.children[idx]
                // cc.log(node.name + " : " + node.height)
                if (node.height === 0 && null === firstIdx) {
                    // firstIdx = idx
                    node.active = true
                } else if (node.height > 0 && null === firstIdx) {
                    firstIdx = idx
                    node.active = true
                } else if (node["highLight"]) {
                    this._list.children[firstIdx].active = false
                    node.active = true
                } else {
                    node.active = false
                }
            }
        } else {
            this._list.children.forEach(i => i.active = true)
        }

        let length = 0
        this._list.children.forEach(i => length += i.active ? 1 : 0)
        this.node.children.forEach(item => item.name === "MatchMode" ? item.active = false : item.active = length > 0)
        // this.setLayoutInfo(this.node, { spacingY: length === 0 ? 0 : 8, bottom: length === 0 ? 0 : 8, })

        if (length > 0) {
            this.node.opacity = 255
        }
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.MATCH_LIST_UPDATE)

        if (!this._bCheckGuide) {
            this.checkGuide()
        }
    }

    updateUserLimit() {
        if (DataMgr.data.Config.platId === 5) {
            if (this.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                this.node.active = User.PlayGame >= 5
            } else if (this.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
                this.node.active = User.PlayGame >= 20
            } else if (this.type === Constants.MATCH_TYPE.BATTLE_MATCH) {

            } else if (this.type === Constants.MATCH_TYPE.PRACTICE_MATCH) {

            } else if (this.type === Constants.MATCH_TYPE.REALTIME_MATCH) {
                this.node.active = User.PlayGame >= 1
            }
        } else {
            if (this.type === Constants.MATCH_TYPE.ACTIVITY_MATCH) {
                this.node.active = User.PlayGame >= 5
            } else if (this.type === Constants.MATCH_TYPE.TOURNEY_MATCH) {
                this.node.active = User.PlayGame >= 20
            } else if (this.type === Constants.MATCH_TYPE.BATTLE_MATCH) {

            } else if (this.type === Constants.MATCH_TYPE.PRACTICE_MATCH) {
                this.node.active = User.PlayGame >= 3
            } else if (this.type === Constants.MATCH_TYPE.REALTIME_MATCH) {
                this.node.active = User.PlayGame >= 1
            }
        }

        this._list.getComponent(cc.Layout).updateLayout()
        this.node.getComponent(cc.Layout).updateLayout()
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.MATCH_LIST_UPDATE)
    }

    switchList() {
        this.setButtonInfo("title/btn", { interactable: false })
        if (this.listOpen) {
            if (this.type === Constants.MATCH_TYPE.REALTIME_MATCH) {
                this._list.children.forEach(item => item.active = false)
                this._list.children[0].active = true
                this.setButtonInfo("title/btn", { interactable: true, normalSprite: this.openButton })
                this.listOpen = false
                DataMgr.setData("ml" + this.type + "s", false, true)
            } else {
                let i = 1
                let mid = null
                let data: TMatchs = DataMgr.getData<TMatchs>(Constants.DATA_DEFINE.MATCH_CONFIG)
                for (let idx in data) {
                    if (data[idx].gameId !== DataMgr.data.Config.gameId) {
                        continue
                    }
                    if (data[idx].type === this.type && data[idx].highLight) {
                        mid = "MatchMode" + data[idx].matchId
                    }
                }
                this._list.children.forEach(item => item.active = mid ? item.name === mid : (1 === i++))
                this.setButtonInfo("title/btn", { interactable: true, normalSprite: this.openButton })
                this.listOpen = false
                DataMgr.setData("ml" + this.type + "s", false, true)
                this.updateData()
            }
        } else {
            if (this.type === Constants.MATCH_TYPE.REALTIME_MATCH) {
                this._list.children.forEach(item => item.active = true)
                this.setButtonInfo("title/btn", { interactable: true, normalSprite: this.closeButton })                
                this.listOpen = true
                DataMgr.setData("ml" + this.type + "s", true, true)
            } else {
                let i = 1
                cc.tween(this._list)
                    .repeat(this._list.childrenCount - 1,
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
                        this.setButtonInfo("title/btn", { interactable: true, normalSprite: this.closeButton })
                        this.listOpen = true
                        DataMgr.setData("ml" + this.type + "s", true, true)
                        this.updateData()
                    })
                    .start()
            }
        }
    }

    // onEnable() {
    //     if (this._init) {
    //         this.initData()
    //     }
    // }

    // onPressRealTime(sender, data) {
    //     this.setButtonClickDelay("list/realtime", 1)
    //     UIMgr.OpenUI("lobby", "component/match/realTimeMatch/matchStart/RealTimeMatchStart", { single: true, param: { isAd: sender?.target.name === "realtimeAd" } })
    // }
}