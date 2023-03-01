import BaseUI from "../../../start/script/base/BaseUI";
import { UIMgr } from "../../../start/script/base/UIMgr";
import { PromoteSrv } from "../../../start/script/system/PromoteSrv";
import { EventMgr } from "../../../start/script/base/EventMgr";
import { Constants } from "../../../start/script/igsConstants";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PromoteMoreDisciple extends BaseUI {
    _scrollView: cc.Node = null
    _content: cc.Node = null
    _itemPrefab: cc.Node = null
    _loadAniBtm: cc.Node = null

    _curStart = 0
    _size = 30
    pageEnd = false  //只显示30条记录

    onOpen() {
        console.log("PromoteMoreDisciple onOpen", this.param)

        this.initEvent()
        this.initButton()
        this.initData()
    }

    onLoad() {
        this._scrollView = cc.find("node/scrollView", this.node)
        this._content = cc.find("node/scrollView/view/content", this.node)
        this._itemPrefab = cc.find("item", this._content)
        this._itemPrefab.active = false

        this._loadAniBtm = this.getNode("node/scrollView/view/content/loadAniBtm")
        this._loadAniBtm.parent = this.node
        this._loadAniBtm.y = 0
    }

    initEvent() {
        this._scrollView.parent.on(cc.Node.EventType.TOUCH_END, (event) => {
            console.log(this.node.name + " " + event.type)
            UIMgr.CloseUI("component/promote/PromoteDiscipleDetail")
        })
        this._scrollView.on(cc.Node.EventType.TOUCH_END, (event) => {
            console.log(this.node.name + " " + event.type)
            UIMgr.CloseUI("component/promote/PromoteDiscipleDetail")
        })

        this.setScrollViewEvent(this._scrollView, (sender, eventType, customEventData) => {
            if (eventType == cc.ScrollView.EventType.BOUNCE_BOTTOM) {
                if (!this.pageEnd) {
                    this._loadAniBtm.active = true
                    this._curStart += 1
                    this.getMemberList()
                }
            }
        })
    }

    initButton() {
        this.setButtonClick("node/btnOk", this.node, () => {
            this.close()
        })
    }

    initData() {
        if (1 == this.param.discipleType) {
            if (this.param.promoteInfo && this.param.promoteInfo.member_num) {
                this.setLabelValue("node/lblTotalNum", this.node, "共" + this.param.promoteInfo.member_num + "人")
            }
        } else if (2 == this.param.discipleType) {
            this.setLabelValue("node/lblTitleShadow", "再传弟子")
            this.setLabelValue("node/lblTitle", "再传弟子")
            if (this.param.promoteInfo && this.param.promoteInfo.second_member_num) {
                this.setLabelValue("node/lblTotalNum", this.node, "共" + this.param.promoteInfo.second_member_num + "人")
            }
        }

        this.getMemberList()
    }

    //更多弟子记录
    getMemberList() {
        let param = { start: this._curStart, size: this._size, member_openid: "", generation: 1 }
        if (2 == this.param.discipleType) {
            param.generation = 3
        }
        PromoteSrv.GetMemberList(param, (res) => {
            if (res.member_list) {
                this._loadAniBtm.active = false
                this.initMemberList(res.member_list)
                if (res.member_list.length < this._size) {
                    this.pageEnd = true

                    this._loadAniBtm.active = true
                    this._loadAniBtm.parent = this._content
                    this.setActive("jz", this._loadAniBtm, false)
                    this.setActive("tip", this._loadAniBtm, true)
                }

                if (0 == this._curStart) {
                    EventMgr.dispatchEvent(Constants.EVENT_DEFINE.UPDATE_PROMOTE_MEMBER, res)
                }
            } else {
                this.pageEnd = true

                this._loadAniBtm.active = true
                this._loadAniBtm.parent = this._content
                this.setActive("jz", this._loadAniBtm, false)
                this.setActive("tip", this._loadAniBtm, true)
            }
        })
    }

    initMemberList(memberList: any) {
        for (let i = 0; i < memberList.length; i += 3) {
            let obj = cc.instantiate(this._itemPrefab);
            obj.parent = this._content;
            obj.active = true;
            for (let m = 1; m < 4; m++) {
                if (i + m - 1 < memberList.length) {
                    let memberData = memberList[i + m - 1]
                    let disciple = cc.find("ndDirectDisciple" + m, obj)
                    disciple.active = true
                    this.setChildParam(disciple, { data: memberData, pos: disciple.position, discipleType: this.param.discipleType })
                }
            }
        }
    }
}
