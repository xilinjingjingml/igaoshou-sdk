import BaseUI from "../../../start/script/base/BaseUI";
import { Constants } from "../../../start/script/igsConstants";
import { QualifyingSrv } from "../../../start/script/system/QualifyingSrv";
import { LeagueSvr } from "../../../start/script/system/LeagueSvr";
import { Helper } from "../../../start/script/system/Helper";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { UIMgr } from "../../../start/script/base/UIMgr";
import { User } from "../../../start/script/data/User";
import { EventMgr } from "../../../start/script/base/EventMgr";

const { ccclass, property } = cc._decorator;

const LEAGUE_TAB = "leagueTab"

const FILL_LEN = 30

const MAX_RANK_NUM = 10000

@ccclass
export default class LeagueList extends BaseUI {
    @property({
        type: cc.Enum(Constants.LEAGUE_TYPE)
    })
    type = Constants.LEAGUE_TYPE.NONE

    _scrollView: cc.Node = null
    _content: cc.Node = null
    _itemPrefab: cc.Node = null

    _selfLeagueNode: cc.Node = null
    _selfNodePos1: cc.Node = null
    _selfNodePos2: cc.Node = null

    _loadAniBtm: cc.Node = null

    _selfRank = 0

    visibleHeight: number = 0  //可视区域高度
    curOffset = 0;// 滑动偏移 距离左上角
    needSize = 0;//需求要求的高度/宽度
    initY = 0;
    maxY = 0;
    minY = 0;
    miniIdx = 0;// 开始的数据列表index
    itemHeight = 0
    cachePool = [];// 移除的等待使用的item池
    showItemList = [];// 显示的item列表
    maxNum = 20;// 必须小于服务器返回的每页最大个数，这里每页是20个
    loadData = false
    showNum = 0 //可视区域显示的个数

    loadDataEnd = false


    _ILeagueInfo: ILeagueInfo = null

    _curSeason: any = null

    _firstItemNode: cc.Node = null //新手引导用

    start() {
        this._scrollView = cc.find("list", this.node)
        this._content = cc.find("list/view/content", this.node)
        this._itemPrefab = cc.find("list/view/content/item", this.node)
        this._itemPrefab.active = false
        this.itemHeight = this._itemPrefab.height
        this.setActive("btnTop", this.node, false)

        this._selfNodePos1 = cc.find("selfNodePos1", this.node)
        this._selfNodePos2 = cc.find("selfNodePos2", this.node)

        this._loadAniBtm = this.getNode("list/view/content/loadAniBtm")
        this._loadAniBtm.active = false

        if (this.type == Constants.LEAGUE_TYPE.QUALIFYING) {
            this.itemHeight = this._itemPrefab.height + 5
            QualifyingSrv.GetCurSeason((res) => {
                this._curSeason = res
                QualifyingSrv.GetRankList({ season_id: res.cur_season_id, start: 0, end: FILL_LEN }, (res) => {
                    this.visibleHeight = this._scrollView.getContentSize().height;
                    this._scrollView.on("scrolling", this.onScrolling.bind(this), this);

                    this.showNum = Math.ceil(this.visibleHeight / this.itemHeight) + 1
                    this.maxNum = this.showNum
                    this.initY = -this.itemHeight / 2

                    this.setSelfLeagueMode()
                    this.updateContentSize()
                    this.InitObjs()
                })
            })
        } else {
            let initData = function (res) {
                this.visibleHeight = this._scrollView.getContentSize().height;
                this._scrollView.on("scrolling", this.onScrolling.bind(this), this);

                this.showNum = Math.ceil(this.visibleHeight / this.itemHeight) + 1
                this.maxNum = this.showNum
                this.initY = -this.itemHeight / 2

                if (!res) {
                    return
                }
                this._ILeagueInfo = res
                this.setLeagueInfo()

                this.setSelfLeagueMode()
                LeagueSvr.GetLeagueList(this.type, 0, 0 + FILL_LEN, (res) => {
                    this.updateContentSize()
                    this.InitObjs()
                })
            }.bind(this)

            let data = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type)
            if (data) {
                Helper.DelayFun(() => {
                    initData(data)
                })
            } else {
                LeagueSvr.GetCurLeague(this.type, (res) => {
                    initData(res)
                })
            }
        }

        this.initButton()
    }

    initButton() {
        this.setButtonClick("btnTop", this.onPressTop.bind(this))
        this.setButtonClick("selfNodePos1/btn", this.onPressSelfRank.bind(this))
        this.setButtonClick("selfNodePos2/btn", this.onPressSelfRank.bind(this))

        this.setButtonClick("statistic/countdown/btnExplain", () => {
            console.log("btnExplain on click")
            UIMgr.OpenUI("lobby", "component/league/explainPop/ExplainPop", { param: {} })
        })
    }

    onPressTop() {
        this._scrollView.getComponent(cc.ScrollView).stopAutoScroll()
        this._scrollView.getComponent(cc.ScrollView).scrollToTop()
        this.onScrolling()
    }

    onPressSelfRank() {
        console.log("onPressSelfRank")
        if (this.type == Constants.LEAGUE_TYPE.QUALIFYING) {
            UIMgr.OpenUI("lobby", "component/league/qualifying/QualifyingMain", {})
        } else {
            let data = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type)
            if (data.rows[this._selfRank]) {
                this._scrollView.getComponent(cc.ScrollView).stopAutoScroll()
                if (this._selfRank * this.itemHeight - this.visibleHeight / 2 + this.visibleHeight > this.needSize) {
                    this._scrollView.getComponent(cc.ScrollView).scrollToOffset(cc.v2(0, this.needSize - this.visibleHeight))
                } else {
                    this._scrollView.getComponent(cc.ScrollView).scrollToOffset(cc.v2(0, this._selfRank * this.itemHeight - this.visibleHeight / 2))
                }
                this.onScrolling()
            } else {
                if (this._selfRank < (MAX_RANK_NUM - 1)) {
                    Helper.OpenTip("获取失败，请稍后再试！")
                }
            }
        }
    }

    updateContentSize() {
        let dataList = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type)
        // 设置内容高度
        this.needSize = dataList.rows.length * this.itemHeight
        this._content.setContentSize(new cc.Size(this._content.getContentSize().width, this.needSize));

        if (this.needSize > this.visibleHeight) {
            this._loadAniBtm.active = true
            this._loadAniBtm.y = - this.needSize - this._loadAniBtm.height / 2
            if (this.loadDataEnd) {
                this.setActive("tip", this._loadAniBtm, true)
                this.setActive("jz", this._loadAniBtm, false)
            } else {
                this.setActive("tip", this._loadAniBtm, false)
                this.setActive("jz", this._loadAniBtm, true)
            }
        }
    }

    setLeagueInfo() {
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
        let wnode = this.getNode("statistic/award/list/gold")
        let lnode = this.getNode("statistic/award/list/lottery")
        let dnode = this.getNode("statistic/award/list/credits")
        wnode.active = false
        lnode.active = false
        dnode.active = false
        for (let i in items) {
            if (items[i].id === Constants.ITEM_INDEX.GOLD) {
                wnode.active = true
                wnode.opacity = 0
                this.setLabelValue("num", wnode, Helper.FormatNumWYCN(items[i].num))
                this.runTween(wnode, cc.tween().to(.1, { opacity: 255 }))
            } else if (items[i].id === Constants.ITEM_INDEX.LOTTERY) {
                // this.setActive("statistic/award/list/lottery", true)
                lnode.active = true
                lnode.opacity = 0
                this.setLabelValue("num", lnode, Helper.FormatNumWYCN(items[i].num))
                this.runTween(lnode, cc.tween().to(.1, { opacity: 255 }))
            } else if (items[i].id === Constants.ITEM_INDEX.CREDITS) {
                // this.setActive("statistic/award/list/diamond", true)
                dnode.active = true
                dnode.opacity = 0
                this.setLabelValue("num", dnode, Helper.FormatNumWYCN(items[i].num))
                this.runTween(dnode, cc.tween().to(.1, { opacity: 255 }))
            }
        }
    }

    onScrolling() {
        let scrollOffset: cc.Vec2 = this._scrollView.getComponent(cc.ScrollView).getScrollOffset();
        this.curOffset = scrollOffset.y;
        this.refresh();

        this.setActive("btnTop", this.node, this.curOffset > 0)
    }

    InitObjs() {
        let curX = 0;
        let curY = 0;
        let dataList = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type)
        let num = this.maxNum * 2
        if (dataList.rows.length < num) {
            num = dataList.rows.length
        }
        for (let i = 0; i < num; i++) {
            // if (!this.dataList[i]) break;
            let obj = cc.instantiate(this._itemPrefab);
            obj.parent = this._content;
            obj.active = true;
            curY = this.initY - this.itemHeight * i;
            obj.position = cc.v3(curX, curY);
            this.onRefresh(obj, i + "", i);
            this.showItemList.push(obj);
        }
    }

    private countBorder(offest) {
        let height = this.visibleHeight;
        this.minY = offest;
        this.maxY = offest + height;
    }


    public refresh() {
        let offest = this.curOffset;

        let maxY = this.needSize;
        // if (Math.floor(offest) < 0 || Math.floor(offest + this.visibleHeight) > maxY)
        if (offest < 0 || Math.floor(offest + this.visibleHeight) > maxY)
            return;

        let idx: number = 0;
        this.countBorder(offest);
        let lastMinIdx = this.miniIdx;
        let miniIdx = Math.floor(offest / this.itemHeight);
        miniIdx = miniIdx < 0 ? 0 : miniIdx
        if (this.miniIdx != miniIdx) {
            let curY = this.initY - this.itemHeight * miniIdx;
            let curEndY = this.initY - this.itemHeight * (miniIdx + this.maxNum);
            let deleteNodeUuIdList = [];
            let remainList = [];
            this.showItemList.forEach((item, index) => {
                if (item.position.y > curY || item.position.y <= curEndY) {
                    deleteNodeUuIdList.push(item.uuid);
                }
                else {
                    remainList.push(lastMinIdx + index)
                }
            })
            let len = this.showItemList.length;
            for (let index = len - 1; index >= 0; index--) {
                let item = this.showItemList[index];
                if (deleteNodeUuIdList.indexOf(item.uuid) >= 0) {
                    this.cachePool.push(item);
                    this.showItemList.splice(index, 1);
                }
            }
            this.miniIdx = miniIdx
            for (let i = 0; i < this.maxNum; i++) {
                idx = this.miniIdx + i;
                if (remainList.indexOf(idx) < 0) {
                    this.refreshItem(idx, i);
                }
            }

            if (this.miniIdx > lastMinIdx) {
                this.requestNextList()
            } else {
                this.requestPrevvList()
            }

            if (this._selfLeagueNode && this.type != Constants.LEAGUE_TYPE.QUALIFYING) {
                if (this._selfRank < this.miniIdx) {
                    this._selfLeagueNode.active = true
                    this._selfLeagueNode.setPosition(this._selfLeagueNode.getPosition().x, this._selfNodePos1.getPosition().y - this._selfNodePos2.getPosition().y)
                    this.setActive("selfNodePos1/btn", true)
                    this.setActive("selfNodePos2/btn", false)
                } else if (this._selfRank > (this.miniIdx + this.maxNum - 1)) {
                    this._selfLeagueNode.active = true
                    this._selfLeagueNode.setPosition(this._selfLeagueNode.getPosition().x, 0)
                    this.setActive("selfNodePos1/btn", false)
                    this.setActive("selfNodePos2/btn", true)
                } else {
                    this._selfLeagueNode.active = false
                }
            }
        }
    }

    private refreshItem(idx, objIdx) {
        let dataList = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type)
        if (idx < 0 || idx >= dataList.rows.length)
            return;
        let obj = this.cachePool.pop();
        if (obj == null) {
            console.error("obj is null！");
            return;
        }

        let curX = 0;
        let curY = 0;
        curY = this.initY - this.itemHeight * idx;


        obj.position = cc.v3(curX, curY);
        obj.active = true;
        this.onRefresh(obj, objIdx, idx);

        this.showItemList.push(obj);
        this.showItemList.sort((a, b) => {
            return -a.position.y + b.position.y;
        })
    }


    private onRefresh(itemNode, idx: string, objIdx) {
        itemNode["_rank"] = objIdx
        let dataList = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type)
        let data = dataList.rows[objIdx]
        if (data) {
            if (data.rank == 0 && this.type == Constants.LEAGUE_TYPE.PRACTICE_LEAGUE) {
                this._firstItemNode = itemNode
            }
            this.setChildParam(itemNode, { data: data })
        } else {
            let league = this.getNode("league", itemNode)
            league.children.forEach(item => item.active = false)

            this.setActive("league/n", itemNode, true)
            this.setLabelValue("league/n/num", itemNode, "" + objIdx)

            this.setLabelValue("userName", itemNode, "")

            this.setActive("medal/silver", itemNode, false)
            this.setActive("medal/gold", itemNode, false)

            this.setActive("award/null", itemNode, false)
            this.setActive("award/gold", itemNode, false)
            this.setActive("award/lottery", itemNode, false)
            this.setActive("award/credits", itemNode, false)

            let rank = objIdx
            if (this.type == Constants.LEAGUE_TYPE.QUALIFYING) {
                QualifyingSrv.GetRankList({ season_id: this._curSeason.cur_season_id, start: objIdx, end: objIdx }, (res) => {
                    if (itemNode["_rank"] == rank) {
                        this.onRefresh(itemNode, idx, objIdx)
                    }
                })
            } else {
                LeagueSvr.GetLeagueList(this.type, objIdx, objIdx, (res) => {
                    if (itemNode["_rank"] == rank) {
                        this.onRefresh(itemNode, idx, objIdx)
                    }
                })
            }
        }
    }

    requestPrevvList() {
        if (this.loadData) {
            return
        }
        let start = this.miniIdx - FILL_LEN * 2
        start = start < 0 ? 0 : start
        let data = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type)
        if (data.rows[start] == null) {
            this.loadData = true
            if (this.type == Constants.LEAGUE_TYPE.QUALIFYING) {
                QualifyingSrv.GetRankList({ season_id: this._curSeason.cur_season_id, start: start, end: start + FILL_LEN * 2 }, (res) => {
                    this.loadData = false
                    this.updateContentSize()
                })
            } else {
                LeagueSvr.GetLeagueList(this.type, start, start + FILL_LEN * 2, (res) => {
                    this.loadData = false
                    this.updateContentSize()
                })
            }
        }
    }

    requestNextList() {
        if (this.loadData) {
            return
        }

        let data = DataMgr.getData<ILeagueInfo>(Constants.DATA_DEFINE.LEAGUE_PRACTICE + this.type)
        if (data.rows[this.miniIdx + FILL_LEN] == null) {
            this.loadData = true
            let start = this.miniIdx + FILL_LEN// - this.maxNum
            if (this.type == Constants.LEAGUE_TYPE.QUALIFYING) {
                QualifyingSrv.GetRankList({ season_id: this._curSeason.cur_season_id, start: start, end: start + FILL_LEN * 2 }, (res) => {
                    if (res && (!res.list || res.list.length == 0)) {
                        this.loadDataEnd = true
                    }
                    this.loadData = false
                    this.updateContentSize()
                })
            } else {
                if (start < (MAX_RANK_NUM - 1)) {
                    let end = start + FILL_LEN * 2
                    end = end > (MAX_RANK_NUM - 1) ? (MAX_RANK_NUM - 1) : end
                    LeagueSvr.GetLeagueList(this.type, start, end, (res) => {
                        if (res && (!res.rank_list || res.rank_list.length == 0)) {
                            this.loadDataEnd = true
                        }
                        this.loadData = false
                        this.updateContentSize()
                    })
                }
            }
        }
    }

    setSelfLeagueMode() {
        // let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)

        if (!this._selfLeagueNode && this._itemPrefab) {
            if (User.League[this.type] && User.League[this.type].rank > 0) {
                this._selfRank = User.League[this.type].rank
                this._selfLeagueNode = cc.instantiate(this._itemPrefab)
                this._selfLeagueNode.active = true
                this._selfLeagueNode.y = 0
                this._selfNodePos2.addChild(this._selfLeagueNode)

                let data: ILeagueRow = {
                    type: this.type,
                    rank: User.League[this.type].rank,
                    medal: User.League[this.type].medal,
                    awards: [],
                    user: User.Data,
                    props: []
                }
                data.props[Constants.ITEM_INDEX.MemberCard] = User.Items[Constants.ITEM_INDEX.MemberCard]

                let league = this.getNode("league", this._selfLeagueNode)
                league.children.forEach(item => item.active = false)
                data.rank = Number(data.rank) || 0
                this.setChildParam(this._selfLeagueNode, { data: data })
                if (this.type != Constants.LEAGUE_TYPE.QUALIFYING) {
                    if (User.League[this.type].rank < this.showNum) {
                        this._selfLeagueNode.active = false
                    }
                }

                let start = User.League[this.type].rank - this.showNum
                start = start < 0 ? 0 : start
                if (this.type == Constants.LEAGUE_TYPE.QUALIFYING) {
                    // QualifyingSrv.GetRankList({season_id: this._curSeason.cur_season_id, start:start, end: start + FILL_LEN*2}, (res)=>{
                    //     this.updateContentSize()
                    // })
                } else {
                    if (User.League[this.type].rank < (MAX_RANK_NUM - 1)) {
                        LeagueSvr.GetLeagueList(this.type, start, start + FILL_LEN * 2, (res) => {
                            this.updateContentSize()
                        })
                    } else {
                        this.setLabelValue("league/n/num", this._selfLeagueNode, MAX_RANK_NUM + "+")
                    }
                }
            } else {
                if (this.type == Constants.LEAGUE_TYPE.QUALIFYING) {
                    this._selfLeagueNode = cc.instantiate(this._itemPrefab)
                    this._selfLeagueNode.active = true
                    this._selfLeagueNode.y = 0
                    this._selfNodePos2.addChild(this._selfLeagueNode)

                    let data: ILeagueRow = {
                        type: this.type,
                        rank: -1,
                        medal: 0,
                        awards: [],
                        user: User.Data,
                    }

                    let league = this.getNode("league", this._selfLeagueNode)
                    league.children.forEach(item => item.active = false)
                    data.rank = Number(data.rank) || 0
                    this.setChildParam(this._selfLeagueNode, { data: data })
                }
            }
        } else if (this._selfLeagueNode) {
            if (User.League[this.type] && User.League[this.type].rank > 0) {
                this._selfRank = User.League[this.type].rank
                let data: ILeagueRow = {
                    type: this.type,
                    rank: User.League[this.type].rank,
                    medal: User.League[this.type].medal,
                    awards: [],
                    user: User.Data,
                }

                let league = this.getNode("league", this._selfLeagueNode)
                league.children.forEach(item => item.active = false)
                data.rank = Number(data.rank) || 0
                this.setChildParam(this._selfLeagueNode, { data: data })
            }
        }
    }

    checkGuide(itemNode) {
        let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
        if (record[10] !== 1) {
            EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_LEAGUE_GUIDE, { guide: true })
            UIMgr.OpenUI("lobby", "component/base/LockPop", { single: true, index: 999 })
            UIMgr.OpenUI("lobby", "component/guidance/GameGuidance", { single: true, 
                param: { index: 10, node: itemNode, static: this.getNode("statistic", this.node) }, 
                closeCb: () => EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_LEAGUE_GUIDE, { guide: false })}, 
                () => { UIMgr.CloseUI("component/base/LockPop") })
        }
    }

    setParam(param: any) {
        console.log("setParam", param)
        if (param.checkGuide && this._firstItemNode) {
            this.checkGuide(this._firstItemNode)
        }
    }
}