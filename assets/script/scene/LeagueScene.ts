import BaseUI from "../base/BaseUI";
import { EventMgr } from "../base/EventMgr";
import { Constants } from "../constants";
import { LeagueSvr } from "../system/LeagueSvr";
import { DataMgr } from "../base/DataMgr";
import { MatchSvr } from "../system/MatchSvr";
import { Helper } from "../system/Helper";
import { UIMgr } from "../base/UIMgr";

const { ccclass, property } = cc._decorator;

const LEAGUE_TAB = "leagueTab"

@ccclass
export default class LeagueScene extends BaseUI {

    _bInit: boolean = false

    _page: cc.Node = null
    _slide: cc.Node = null

    _pageView: cc.PageView = null
    _pageIndex: number = 0

    _profession: cc.Node = null
    _practice: cc.Node = null

    onLoad() {
        let content = cc.find("BaseScene/GameCenter", cc.Canvas.instance.node)
        if (content) {
            this.setNodeHeight(this.node, content.height)
        }

        // this.setActive("page/view/content/profession/list/view/content", false)
        // this.setActive("page/view/content/practice/list/view/content", false)    
        this._profession = this.getNode("page/view/content/profession/list/view/content")
        this._practice = this.getNode("page/view/content/practice/list/view/content")
    }

    onEnable() {
        if (!this._bInit) {
            this.initNode()
            this.initEvent()
            this._bInit = true
        }
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.HIDE_TOKEN_INFO)       
        let idx = DataMgr.getData<number>(LEAGUE_TAB)
        if (undefined === idx || null === idx) {
            idx = 0
        //     DataMgr.setData(LEAGUE_TAB, idx)
        }
        this._pageIndex = idx
        this.initData()
        // this.onTabSelect(idx)
        let scroll = this.getNodeComponent(this.node.parent.parent.parent, cc.ScrollView)
        if (scroll) scroll.enabled = false
    }

    onDisable() {
        EventMgr.dispatchEvent(Constants.EVENT_DEFINE.SHOW_TOKEN_INFO)
        let scroll = this.getNodeComponent(this.node.parent.parent.parent, cc.ScrollView)
        if (scroll) scroll.enabled = true
    }

    setParam(param) {
        if (!param)
            return

        if (param.type && param.type === Constants.LEAGUE_TYPE.PRACTICE_LEAGUE) {
            this._pageIndex = 0
            // this.onTabSelect(0)
        } else if (param.type && param.type === Constants.LEAGUE_TYPE.PROFESSION_LEAGUE) {
            this._pageIndex = 1
            // this.onTabSelect(1)
        }

        this.initData()
    }

    onOpen() {
        Helper.reportEvent("大厅", "排行榜", "打开界面")
        // cc.log("leagueScene onOpen")
        if (!this._bInit) {
            this.initNode()
            this.initEvent()
            this._bInit = true
        }
        this.initData()
    }

    initNode() {
        this._page = this.getNode("page/view/content")
        this._slide = this.getNode("page/view/slideLine")
        this.setNodeWidth(this._slide, cc.winSize.width / 2)
    }

    initEvent() {
        if (this._page) {
            this._page.on(cc.Node.EventType.POSITION_CHANGED, this.onPageTouch, this)
        }

        this._pageView = this.getNodeComponent("page", cc.PageView)
        this._pageView.node.on('page-turning', this.onPageTurning, this);

        this.setButtonClick("top/tab/tab0", this.onTabSelect.bind(this, 0))
        this.setButtonClick("top/tab/tab1", this.onTabSelect.bind(this, 1))

        this._pageView.node.on("scroll-ended", () => { this._pageView.enabled = false }, this, true)
        
        this.setButtonClick("page/view/content/profession/statistic/countdown/btnExplain", ()=>{
            console.log("btnExplain on click")
            UIMgr.OpenUI("component/League/ExplainPop", { param: {}})
        })

        this.setButtonClick("page/view/content/practice/statistic/countdown/btnExplain", ()=>{
            console.log("btnExplain on click")
            UIMgr.OpenUI("component/League/ExplainPop", { param: {}})
        })
    }

    initData() {
        // this._pageView.setCurrentPageIndex(this._pageIndex)
        this._page.setPosition(-(cc.winSize.width * this._pageIndex + cc.winSize.width / 2), this._page.position.y)
        this._pageView["_curPageIdx"] = this._pageIndex
        this.setToggleCheck("top/tab/tab" + this._pageIndex, false)

        cc.tween(this.node)
        .delay(0.1)
        .call(() => {            
            // this.setActive("page/view/content/profession/list/view/content", this._pageIndex === 0)
            // this.setActive("page/view/content/practice/list/view/content", this._pageIndex === 1)
            this._profession.opacity = this._pageIndex === 0 ? 255 : 0
            this._practice.opacity = this._pageIndex === 1 ? 255 : 0
            this.setChildParam("page/view/content/profession", {isShow: this._pageIndex === 0})
            this.setChildParam("page/view/content/practice", {isShow: this._pageIndex === 1})
        })
        .delay(.5)
        .call(() => this.checkGuide())
        .start()
    }

    onPageTouch() {
        if (!this._page || !this._slide)
            return

        // cc.log("onPageTouch " + this._page.position)
        this._slide.setPosition(-(cc.winSize.width + this._page.position.x) / 2, this._slide.position.y)
    }

    onPageTurning() {
        if (!this._pageView)
            return

        let idx = this._pageView.getCurrentPageIndex()
        // this.setActive("page/view/content/profession/list/view/content", idx === 0)
        // this.setActive("page/view/content/practice/list/view/content", idx === 1)
        this._profession.opacity = idx === 0 ? 255 : 0
        this._practice.opacity = idx === 1 ? 255 : 0
        this.setChildParam("page/view/content/profession", {isShow: idx === 0})
        this.setChildParam("page/view/content/practice", {isShow: idx === 1})

        this.setToggleCheck("top/tab/tab" + idx, false)
    }

    onTabSelect(idx: number) {
        if (!this._pageView)
            return

        // this.setActive("page/view/content/profession/list/view/content", idx === 0)
        // this.setActive("page/view/content/practice/list/view/content", idx === 1)
        this._profession.opacity = idx === 0 ? 255 : 0
        this._practice.opacity = idx === 1 ? 255 : 0
        this.setChildParam("page/view/content/profession", {isShow: idx === 0})
        this.setChildParam("page/view/content/practice", {isShow: idx === 1})

        this._pageView.enabled = true
        this._pageView.setCurrentPageIndex(idx)

        DataMgr.setData(LEAGUE_TAB, idx)
    }   

    checkGuide() {
        let record = DataMgr.getData(Constants.DATA_DEFINE.NEWBIE_LIST) || {}
        let pro = this.getNode("page/view/content/profession")
        let pra = this.getNode("page/view/content/practice")
        let find = pro.active ? pro : pra
        if (record[10] !== 1) {
            let node = this.getNode("list/view/content", find).children[1]
            if (node) {
                UIMgr.OpenUI("component/Base/GameGuidance", {single: true, param: {index: 10, node: node, static: this.getNode("statistic", find)}})
            }            
        } else if (record[11] !== 1) {
            UIMgr.OpenUI("component/Base/GameGuidance", {single: true, param: {index: 11, node: this.getNode("statistic", find)}})            
        }
    }
}
