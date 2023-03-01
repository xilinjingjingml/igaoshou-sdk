import BaseUI from "../../../start/script/base/BaseUI";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { Helper } from "../../../start/script/system/Helper";
import { Constants } from "../../../start/script/igsConstants";
import { igs } from "../../../../igs";
import { EventMgr } from "../../../start/script/base/EventMgr";


const { ccclass, property } = cc._decorator;

const LEAGUE_TAB = "leagueTab"

const FILL_LEN = 30


@ccclass
export default class leagueTab extends BaseUI {
    _pageView: cc.PageView = null
    _content: cc.Node = null
    _slide: cc.Node = null

    _guide: boolean = false

    onLoad() {
        let content = this.node.parent.parent
        if (content) {
            this.setNodeHeight(this.node, content.height - 2)
        }

        this._pageView = this.getNodeComponent("page", cc.PageView)
        this._content = this.getNode("page/view/content")

        this._slide = this.getNode("top/slideLine")
        this.setNodeWidth(this._slide, cc.winSize.width / 2)

        this.initButton()
        this.initEvent()
        this.initNode()
    }

    onEnable() {
        let idx = DataMgr.getData<number>(Constants.DATA_DEFINE.LEAGUE_TAB)
        if (undefined === idx || null === idx) {
            idx = 1
        }

        if (Helper.isIosAudit()) {
            idx = 0
            this.setActive("top", false)
        }

        this._pageView.setCurrentPageIndex(idx)
        this.onTabSelect(idx)
    }

    initButton() {
        this.setButtonClick("top/tab/tab0", this.onTabSelect.bind(this, 0))
        this.setButtonClick("top/tab/tab1", this.onTabSelect.bind(this, 1))
    }

    initEvent() {
        if (this._content) {
            this._content.on(cc.Node.EventType.POSITION_CHANGED, this.onPageTouch, this)
        }

        this._pageView = this.getNodeComponent("page", cc.PageView)

        EventMgr.on(Constants.EVENT_DEFINE.SHOW_LEAGUE_GUIDE, (msg) => { this._guide = msg.guide })
    }

    initNode() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME && igs.odc) {
            this.setActive("page/view/content/profession/top", true)
            this.setActive("page/view/content/profession/professionWx", true)
            let widget = this.getNodeComponent("page/view/content/profession/profession", cc.Widget)
            widget.top = 90
            widget.updateAlignment()

            this.setToggleClick("page/view/content/profession/top/toggles/services", () => {
                this.setActive("page/view/content/profession/profession", true)
                this.setActive("page/view/content/profession/professionWx", false)
            })

            this.setToggleClick("page/view/content/profession/top/toggles/friends", () => {
                this.setActive("page/view/content/profession/profession", false)
                this.setActive("page/view/content/profession/professionWx", true)
                igs.odc.showListData()
            })

            this.setToggleCheck("page/view/content/profession/top/toggles/services", true)
        } else {
            this.setActive("page/view/content/profession/top", false)
            this.setActive("page/view/content/profession/professionWx", false)
        }
    }

    onTabSelect(idx: number) {
        if (!this._pageView)
            return

        if (this._guide) {
            return
        }

        this.setChildParam("page/view/content/profession", { isShow: idx === 0 })
        this.setChildParam("page/view/content/practice", { isShow: idx === 1 })

        this._pageView.setCurrentPageIndex(idx)

        DataMgr.setData(Constants.DATA_DEFINE.LEAGUE_TAB, idx)

        cc.tween(this._content)
            .to(0.2, { x: -idx * cc.winSize.width - cc.winSize.width / 2 })
            .call(() => {
                if (idx == 1) {
                    this.setChildParam("page/view/content/practice", { checkGuide: true })
                }
            })
            .start()
    }

    onPageTouch() {
        if (!this._content || !this._slide)
            return

        this._slide.setPosition(-(cc.winSize.width + this._content.position.x) / 2, this._slide.position.y)
    }
}