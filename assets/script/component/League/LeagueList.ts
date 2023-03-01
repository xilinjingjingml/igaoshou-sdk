import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { DataMgr } from "../../base/DataMgr";
import { Helper } from "../../system/Helper";
import { LeagueSvr } from "../../system/LeagueSvr";
import { ITEM_STYLE } from "../Base/ItemMode";
import { User } from "../../system/User";

const { ccclass, property } = cc._decorator;

const FILL_LEN = 50

@ccclass
export default class LeagueList extends BaseUI {

    @property({
        type: cc.Enum(Constants.LEAGUE_TYPE)
    })
    type = Constants.LEAGUE_TYPE.NONE

    _content: cc.Node = null
    _mode: cc.Node = null
    _loadAniTop: cc.Node = null
    _loadAniBtm: cc.Node = null

    _pageNum: number = 0
    _pageIdx: number = 0

    _bScroll: boolean = false
    _bPage: boolean = false
    _bTouchStart: boolean = true

    _deltaY: { y: number } = { y: 0 }

    _selfItem: cc.Node = null
    _selfLeague: cc.Node = null
    _selfLeagueShowAni: boolean = false

    _btnTop: cc.Node = null
    _btnTopShowAni: boolean = false

    _bInit: boolean = false
    _bGetPrev: boolean = false
    _bGetNext: boolean = false

    _list: cc.ScrollView = null
    _page: cc.PageView = null

    _modeList: cc.Node[] = []
    _listMax: number = 0

    _lastPosY: number = 0

    _startIdx: number = 0
    _endIdx: number = 0

    _fillAni: boolean = false

    _bGetNewList: boolean = false
    _bGetPlayer: boolean = false
    _newList = []

    _bReset: boolean = false

    _bShow: boolean = false
    _bData: boolean = false

    _scrollEnd: boolean = false

    onLoad() {
        this.getNode("statistic/award").opacity = 0
        this.getNode("statistic/countdown").opacity = 0
    }

    onOpen() {
        this.initNode()
        this.initEvent()
        this.initData()

        this._bInit = true
    }

    setParam(param: any) {
        this._bShow = param.isShow
        this.initData()
    }

    onEnable() {
        // if (this._bInit) {
        //     this.initData()
        // }
    }

    initNode() {
        this._content = this.getNode("list/view/content")
        this._mode = this.getNode("LeagueMode")

        this._list = this.getNodeComponent("list", cc.ScrollView)
        this._page = this.getNodeComponent(this.node.parent.parent.parent, cc.PageView)

        this._list.enabled = false
        this._page.enabled = false

        this._pageNum = Math.round(this._content.parent.height / this._mode.height)
        this._listMax = this._pageNum * 2

        this._btnTop = this.getNode("btnTop")
        this._btnTop.opacity = 0

        this._loadAniTop = this.getNode("list/view/content/loadAni")
        this._loadAniTop.zIndex = -1
        this.runTween("loading", this._loadAniTop,
            cc.tween().repeatForever(cc.tween().to(1.5, { angle: -180 }).to(1.5, { angle: -360 }).set({ angle: 0 })))

        this._loadAniBtm = cc.instantiate(this._loadAniTop)
        this._loadAniBtm.parent = this._loadAniTop.parent
        this._loadAniBtm.zIndex = 999999

        this.runTween("loading", this._loadAniBtm,
            cc.tween().repeatForever(cc.tween().to(1.5, { angle: -180 }).to(1.5, { angle: -360 }).set({ angle: 0 })))
    }

    initEvent() {
        let node = this.getNode("touchNode")
        node.on(cc.Node.EventType.TOUCH_START, this.scroll, this, true)
        node.on(cc.Node.EventType.TOUCH_MOVE, this.scroll, this, true)
        node.on(cc.Node.EventType.TOUCH_END, this.scroll, this, true)
        node.on(cc.Node.EventType.TOUCH_CANCEL, this.scroll, this, true)

        this._content.on(cc.Node.EventType.POSITION_CHANGED, () => {
            let top = -this._content.position.y + 70
            let btm = -this._content.position.y - this._content.parent.height - 70
            this._startIdx = 32767
            this._endIdx = 0
            this._content.children.forEach(i => {
                if (i.position.y < top && i.position.y > btm) {
                    this._startIdx = this._startIdx > i["_rank"] ? i["_rank"] : this._startIdx
                    this._endIdx = this._endIdx < i["_rank"] ? i["_rank"] : this._endIdx
                    i.opacity = 255
                } else {
                    i.opacity = 0
                }
            })

            if (this._endIdx > this._pageNum) {
                if (!this._btnTopShowAni && this._btnTop.opacity === 0) {
                    cc.tween(this._btnTop).to(.15, { opacity: 255 }).call(() => this._btnTopShowAni = false).start()
                }
            } else {
                if (!this._btnTopShowAni && this._btnTop.opacity === 255) {
                    cc.tween(this._btnTop).to(.15, { opacity: 0 }).call(() => this._btnTopShowAni = false).start()
                }
            }

            if (this._content.y < -120) {
                this.requestPrevList()
            } else if (this._content.y + this._content.parent.height - 120 > this._content.height) {
                this.requestNextList()
            }

            let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
            if (user.league[this.type].rank > 0) {
                if (this._startIdx !== 99999999 && user.league[this.type].rank < this._startIdx) {
                    if (!this._selfLeagueShowAni && this._selfLeague.opacity === 0) {
                        cc.tween(this._selfLeague).to(.15, { opacity: 255 }).call(() => this._selfLeagueShowAni = false).start()
                    }
                    this._selfLeague.setPosition(cc.v3(this._selfLeague.position.x, 0))
                } else if (this._endIdx !== 0 && user.league[this.type].rank > this._endIdx) {
                    if (!this._selfLeagueShowAni && this._selfLeague.opacity === 0) {
                        cc.tween(this._selfLeague).to(.15, { opacity: 255 }).call(() => this._selfLeagueShowAni = false).start()
                    }
                    this._selfLeague.setPosition(cc.v3(this._selfLeague.position.x, - this._content.parent.height + this._mode.height))
                } else {
                    if (!this._selfLeagueShowAni && this._selfLeague.opacity === 255) {
                        cc.tween(this._selfLeague).to(.15, { opacity: 0 }).call(() => this._selfLeagueShowAni = false).start()
                    }
                }
            } else {
                // if (!this._selfLeagueShowAni && this._selfLeague.opacity === 0) {
                //     cc.tween(this._selfLeague).to(.15, { opacity: 255 }).call(() => this._selfLeagueShowAni = false).start()
                // }
                // this._selfLeague.setPosition(cc.v3(this._selfLeague.position.x, - this._content.parent.height + this._mode.height))
            }

        }, this, true)

        this._list.node.on("scroll-ended", () => { if (!this._bTouchStart) this._list.enabled = false }, this, true)
        this._page.node.on("scroll-ended", () => { if (!this._bTouchStart) this._page.enabled = false }, this, true)

        // this._list.node.on("scroll-to-top", () => { this.requestPrevList() })
        // this._list.node.on("scroll-to-bottom", () => { this.requestNextList() })

        cc.tween(this.getNode("statistic/award"))
            .delay(.1)
            .to(.5, { opacity: 255 })
            .start()

        cc.tween(this.getNode("statistic/countdown"))
            .delay(.1)
            .to(.5, { opacity: 255 })
            .start()

        // DataMgr.feed(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type, this.updateLeagueList, this)
        this.setButtonClick("btnTop", this.onPressTop.bind(this))
    }

    initData() {
        if (!this._bShow) {
            return
        }

        if (this._bData) {
            return
        }

        DataMgr.setData(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type, null)
        LeagueSvr.GetCurLeague(this.type, (res) => {
            if (!res) {
                return
            }
            this.updateLeagueInfo()
            this.setSelfLeagueMode()
            this._bData = true
        })
    }

    updateLeagueInfo() {
        let data = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type)
        if (!data) {
            return
        }

        let time = (data.time * 1000) - Date.now()
        let label = this.getNodeComponent("statistic/countdown/value", cc.Label)
        cc.tween(label)
            .repeat(Math.floor(time / 1000),
                cc.tween()
                    .call(() => {
                        let time = (data.time * 1000) - Date.now()
                        label.string =
                            time > 24 * 60 * 60 * 1000 ?
                                Helper.FormatTimeString(time, "d天 h小时mm分ss秒") :
                                Helper.FormatTimeString(time, "h小时mm分ss秒")
                    })
                    .delay(1)
            )
            .start()

        let items = data.totalBouns
        let wnode = this.getNode("statistic/award/list/wcoin")
        let lnode = this.getNode("statistic/award/list/lottery")
        let dnode = this.getNode("statistic/award/list/diamond")
        wnode.active = false
        lnode.active = false
        dnode.active = false
        // this.setActive("statistic/award/list/wcoin", false)
        // this.setActive("statistic/award/list/lottery", false)
        // this.setActive("statistic/award/list/diamond", false)
        for (let i in items) {
            if (items[i].id === Constants.ITEM_INDEX.WCOIN) {
                wnode.active = true
                wnode.opacity = 0
                this.setLabelValue("num", wnode, Helper.FormatNumWY(items[i].num))
                this.runTween(wnode, cc.tween().to(.1, { opacity: 255 }))
            } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                // this.setActive("statistic/award/list/lottery", true)
                lnode.active = true
                lnode.opacity = 0
                this.setLabelValue("num", lnode, Helper.FormatNumWY(items[i].num))
                this.runTween(lnode, cc.tween().to(.1, { opacity: 255 }))
            } else if (items[i].id === Constants.ITEM_INDEX.DIAMOND) {
                // this.setActive("statistic/award/list/diamond", true)
                dnode.active = true
                dnode.opacity = 0
                this.setLabelValue("num", dnode, items[i].num >= 10000 ? Helper.FormatNumWY(items[i].num) : Helper.FormatNumPrice(items[i].num / 100))
                this.runTween(dnode, cc.tween().to(.1, { opacity: 255 }))
            }
        }

        LeagueSvr.GetLeagueAwardConfig(data.type, data.leagueId, () => {
            cc.tween(this.node)
                .call(() => {
                    this._startIdx = 0
                    this._endIdx = this._pageNum
                    LeagueSvr.GetLeagueList(this.type, 0, FILL_LEN - 1, () => {
                        this.updateLeagueList(0, FILL_LEN - 1)
                    })
                })
                .start()
        })
    }

    drawLeagueItem(data: ILeagueRow) {
        let item = cc.instantiate(this._mode)
        item.parent = this._content
        item.name = "" + data.rank
        item["_rank"] = data.rank
        item.zIndex = data.rank
        item.setSiblingIndex(data.rank)
        item.active = true
        item.opacity = 0
        this.setChildParam(item, { data: data })
    }

    updateLeagueList(start: number, end: number, callback?: Function) {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        if (this.type === Constants.LEAGUE_TYPE.PROFESSION_LEAGUE && user.histroy.allGame < Constants.PROFESSION_LEAGUE_COUNT) {
            return
        }

        let data = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type)
        if (!data) {
            return
        }

        if (data.rows) {
            this._bReset = false
            let t = this._content.getChildByName("temp")
            if (t) {
                t.removeFromParent(true)
            }
            for (let idx = start; idx < start + FILL_LEN; idx++) {
                if (this._bReset) {
                    this._fillAni = false
                    return
                }

                let l = data.rows[idx]
                if (!l) {
                    this._fillAni = false
                    break
                }

                if (this._content.getChildByName("" + l.rank)) {
                    this.setChildParam("" + l.rank, this._content, { data: l })
                } else {
                    this.drawLeagueItem(l)
                }

                let c = this._content.getChildByName("" + l.rank)
                Helper.DelayFun(() => {
                    let top = -this._content.position.y + 140
                    let btm = -this._content.position.y - this._content.parent.height - 70
                    c.opacity = c.position.y <= top && c.position.y >= btm ? 255 : 0
                }, .1)
            }


            if (this._content.childrenCount - 2 < this._pageNum) {
                let node = null
                if (t) {
                    node = t
                } else {
                    node = new cc.Node()
                }
                node.name = "temp"
                cc.log(" ==== this._pageNum " + this._pageNum + " this._count = " + this._content.childrenCount)
                node.setContentSize(cc.size(this._content.width, this._content.parent.height - this._mode.height * (this._content.childrenCount - 2)))
                node.zIndex = 32766
                node.parent = this._content
            }
            // Helper.DelayFun(() => {
            this._content.sortAllChildren()
            callback && callback()
            // }, .1)
        }
    }

    setSelfLeagueMode() {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)

        if (user.league[this.type].rank > 0) {
            this._selfLeague = cc.instantiate(this._mode)
            this._content.parent.addChild(this._selfLeague)
            // this._selfLeague.zIndex = 1
            // this._btnTop.zIndex = 2
            // this._content.sortAllChildren()
            this._selfLeague.active = true
            this._selfLeague.opacity = 0

            let data: ILeagueRow = {
                type: this.type,
                rank: user.league[this.type].rank,
                medal: user.league[this.type].medal,
                awards: [],
                user: user,
            }
            this.setChildParam(this._selfLeague, { data: data, self: true })
        }

        if (this._selfLeague && user.league[this.type].rank > this._pageNum) {
            if (!this._selfLeagueShowAni && this._selfLeague.opacity === 0) {
                cc.tween(this._selfLeague).to(.15, { opacity: 255 }).call(() => this._selfLeagueShowAni = false).start()
            }
            this._selfLeague.setPosition(cc.v3(this._selfLeague.position.x, - this._content.parent.height + this._mode.height))
        } else if (this._selfLeague) {
            if (!this._selfLeagueShowAni && this._selfLeague.opacity === 255) {
                cc.tween(this._selfLeague).to(.15, { opacity: 0 }).call(() => this._selfLeagueShowAni = false).start()
            }
        }
    }

    scroll(event: cc.Event.EventTouch) {
        // cc.log("scroll event " + event.type)
        if (event.type === cc.Node.EventType.TOUCH_START) {  
            this._scrollEnd = false          
        } else if (event.type === cc.Node.EventType.TOUCH_MOVE) {
            this._bTouchStart = true
            if (!this._bScroll && !this._bPage) {
                let angle = event.getDelta().normalize().angle(cc.v2(1, 0)) / Math.PI * 180
                if (event.getDelta().mag() <= 5)
                    return
                // cc.log("===move angle " + angle)
                if (angle >= 30 && angle <= 150) {
                    this._bScroll = true
                    this._list.enabled = true
                    var startEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
                    startEvent.type = cc.Node.EventType.TOUCH_START;
                    startEvent.touch = event.touch;
                    startEvent.target = this._list.content
                    this._list.content.dispatchEvent(startEvent);
                    this._bGetNewList = false
                } else {
                    this._bPage = true
                    this._page.enabled = true
                    var startEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
                    startEvent.type = cc.Node.EventType.TOUCH_START;
                    startEvent.touch = event.touch;
                    startEvent.target = this._page.node
                    this._page.node.dispatchEvent(startEvent);
                }
            }

            if (this._bScroll) {
                event.target = this._list.content
                if (!this._scrollEnd)
                    this._list.content.dispatchEvent(event)
            } else if (this._bPage) {
                event.target = this._page.node
                if (!this._scrollEnd)
                    this._page.node.dispatchEvent(event)
            }
        } else if (event.type === cc.Node.EventType.TOUCH_END || event.type === cc.Node.EventType.TOUCH_CANCEL) {
            if (this._bScroll) {
                this._bScroll = false
                event.target = this._list.content
                this._list.content.dispatchEvent(event)
            } else if (this._bPage) {
                this._bPage = false
                event.target = this._page.node
                this._page.node.dispatchEvent(event)
            } else if (!this._list.isAutoScrolling()) {
                let tPos = event.target.convertTouchToNodeSpaceAR(event.touch)

                if (this._selfLeague) {
                    let pos = this._selfLeague.convertToWorldSpaceAR(cc.Vec3.ZERO)
                    pos = event.target.convertToNodeSpaceAR(pos)
                    if (pos.x - this._selfLeague.width / 2 < tPos.x && pos.x + this._selfLeague.width / 2 > tPos.x &&
                        pos.y - this._selfLeague.height < tPos.y && pos.y > tPos.y) {
                        this.onPressSelf()
                    }
                }
            }

            this._bTouchStart = false
        }
    }

    endScorll() {
        this._bScroll = false
        this._bPage = false

        this._content.pauseSystemEvents(false)
        if (this._content.height < this._content.parent.height) {
            cc.tween(this._content)
                .to(.2, { position: cc.Vec3.ZERO }, { easing: "expoIn" })
                .call(() => this._content.resumeSystemEvents(true))
                .start()
        } else if (this._content.position.y < 0) {
            cc.tween(this._content)
                .to(.2, { y: 0 }, { easing: "expoIn" })
                .call(() => this._content.resumeSystemEvents(true))
                .start()
        } else if (this._content.position.y > this._content.height - this._content.parent.height) {
            cc.tween(this._content)
                .to(.2, { y: this._content.height - this._content.parent.height }, { easing: "expoIn" })
                .call(() => this._content.resumeSystemEvents(true))
                .start()
        } else if (this._deltaY.y) {
            let max = this._content.height - this._content.parent.height
            cc.tween(this._deltaY)
                .to(.25, { y: 0 },
                    {
                        progress: (start, end, current, t) => {
                            let v = start + (end - start) * t
                            if (v < 0 && this._content.position.y + v <= 0)
                                v = 0 - this._content.position.y
                            else if (v > 0 && this._content.position.y - v >= max)
                                v = this._content.position.y - max
                            this.scrollItem(0, v)
                            return v
                        }
                    })
                .call(() => this._content.resumeSystemEvents(true))
                .call(() => this.endScorll())
                .start()
        }
    }

    scroll2End() {
        let scroll = this.getNodeComponent("list", cc.ScrollView)
        if (scroll) {
            scroll.scrollToBottom()
        }
    }

    scroll2Top() {
        let scroll = this.getNodeComponent("list", cc.ScrollView)
        if (scroll) {
            scroll.scrollToTop()
        }
    }

    requestPrevList() {
        if (this._bGetPrev || this._bGetNewList) {
            return
        }
        let data = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type)
        if (!data) {
            this.initData()
            return
        }

        if (this._startIdx === 0) {
            return
        }
        cc.log("===request prev " + this._startIdx)
        let s = Math.max(0, this._startIdx - FILL_LEN)
        if (data[s]) {
            this.updateLeagueList(s, s + FILL_LEN - 1)
            return
        }

        this._bGetPrev = true
        this._bGetNewList = true        
        // this._list.scrollToBottom()
        LeagueSvr.GetLeagueList(this.type, s, s + FILL_LEN - 1,
            (res) => {
                this._bGetPrev = false
                this._scrollEnd = true
                if (res && res.rank_list && res.rank_list.length > 0) {
                    this._startIdx = s
                    this._endIdx = s + FILL_LEN - 1
                    this._list.stopAutoScroll()
                    this._list.scrollToTop()

                    Helper.DelayFun(() => {
                        this.updateLeagueList(s, s + FILL_LEN - 1)
                    }, .1)
                }
            })
    }

    requestNextList() {
        if (this._bGetNext || this._bGetNewList) {
            return
        }
        let data = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type)
        if (!data) {
            this.initData()
            return
        }
        let s = this._endIdx + 1
        if (data[s]) {
            this.updateLeagueList(s, s + FILL_LEN - 1)
            return
        }

        this._bGetNext = true
        this._bGetNewList = true        
        LeagueSvr.GetLeagueList(this.type, s, s + FILL_LEN - 1,
            (res) => {
                if (res && res.rank_list && res.rank_list.length > 0) {
                    this._bGetNext = false
                    this._scrollEnd = true
                    this._startIdx = s
                    this._endIdx = s + FILL_LEN - 1
                    this._list.stopAutoScroll()
                    this._list.scrollToBottom()

                    Helper.DelayFun(() => {
                        this.updateLeagueList(s, s + FILL_LEN - 1)
                    }, .1)
                }
            })
    }

    scrollItem(pos: cc.Vec3 | number, y?: number) {
        if (typeof pos === "number") {
            pos = cc.v3(pos, typeof y === "number" ? y : 0)
        }
        this._content.setPosition(this._content.position.add(pos))
    }

    onPressTop() {
        let data = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type)
        data.rows = []
        DataMgr.setData(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type, data)
        let s = 0
        LeagueSvr.GetLeagueList(this.type, s, s + FILL_LEN,
            () => {
                this._bGetPrev = false
                this._startIdx = s
                this._endIdx = s + this._pageNum
                this._list.stopAutoScroll()
                this._bReset = true
                Helper.DelayFun(() => {
                    // this._content.removeAllChildren()
                    // this._loadAniTop.removeFromParent(true)
                    // this._loadAniBtm.removeFromParent(true)
                    this._content.removeAllChildren(true)
                    this._loadAniTop.parent = this._content
                    this._loadAniBtm.parent = this._content
                    this.runTween("loading", this._loadAniTop,
                        cc.tween().repeatForever(cc.tween().to(1.5, { angle: -180 }).to(1.5, { angle: -360 }).set({ angle: 0 })))
                    this.runTween("loading", this._loadAniBtm,
                        cc.tween().repeatForever(cc.tween().to(1.5, { angle: -180 }).to(1.5, { angle: -360 }).set({ angle: 0 })))
                    this.updateLeagueList(s, s + this._pageNum, () => this._list.scrollToTop())
                }, .1)

                // cc.log("this._startIdx " + this._startIdx)
                // this.scroll2Top()
                if (this._selfLeague)
                    this._selfLeague.opacity = 255
                this._btnTop.opacity = 0
            })
    }

    onPressSelf() {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        let rank = user.league[this.type].rank
        if (rank > 0) {
            let data = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type)
            data.rows = []
            DataMgr.setData(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type, data)
            let s = rank - Math.floor(this._pageNum / 2)
            LeagueSvr.GetLeagueList(this.type, s, s + FILL_LEN,
                () => {
                    this._bGetPrev = false
                    this._startIdx = s
                    this._endIdx = s + this._pageNum
                    this._list.stopAutoScroll()
                    this._bReset = true
                    Helper.DelayFun(() => {
                        this._content.removeAllChildren(true)
                        this._loadAniTop.parent = this._content
                        this._loadAniBtm.parent = this._content
                        this.runTween("loading", this._loadAniTop,
                            cc.tween().repeatForever(cc.tween().to(1.5, { angle: -180 }).to(1.5, { angle: -360 }).set({ angle: 0 })))
                        this.runTween("loading", this._loadAniBtm,
                            cc.tween().repeatForever(cc.tween().to(1.5, { angle: -180 }).to(1.5, { angle: -360 }).set({ angle: 0 })))
                        this.updateLeagueList(s, s + this._pageNum, () => this._list.scrollToTop())
                    }, .1)

                    // cc.log("this._startIdx " + this._startIdx)

                    // this.scroll2Top()
                    if (this._selfLeague)
                        this._selfLeague.opacity = 0
                    this._btnTop.opacity = 255
                })
        }
    }
}
