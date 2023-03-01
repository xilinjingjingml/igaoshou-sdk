import BaseUI from "../../../start/script/base/BaseUI";
import { Helper } from "../../../start/script/system/Helper";
import { UIMgr } from "../../../start/script/base/UIMgr";
import { PromoteSrv } from "../../../start/script/system/PromoteSrv";
import { UserSrv } from "../../../start/script/system/UserSrv";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PromoteRecruit extends BaseUI {
    _content: cc.Node = null
    _itemPrefab: cc.Node = null
    _loadAniBtm: cc.Node = null

    onOpen() {
        console.log("PromoteRecruit onOpen", this.param)

        this.initButton()
        this.initData()
    }

    onLoad() {
        this._content = cc.find("node/scrollView/view/content", this.node)
        this._itemPrefab = cc.find("item", this._content)
        this._itemPrefab.active = false

        this._loadAniBtm = this.getNode("node/scrollView/view/content/loadAniBtm")
        this._loadAniBtm.parent = this.node
        this._loadAniBtm.y = 0

        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            this.setActive("node/ndMine/lblDesc", true)
        } else {
            this.setActive("node/ndMine/ndCode", true)
        }
    }

    initEvent() {

    }

    initButton() {
        this.setButtonClick("node/btnOk", this.node, () => {
            this.close()
        })

        this.setButtonClick("node/ndMine/ndCode/btnCopy", this.node, () => {
            if (this.param && this.param.promoteInfo && this.param.promoteInfo.promote_code) {
                Helper.copyToClipBoard(this.param.promoteInfo.promote_code)
            }

        })

        this.setButtonClick("node/ndMine/btnRecruit", this.node, () => {
            UIMgr.OpenUI("lobby", "component/promote/PromoteShare", { single: true })
        })
    }

    initData() {
        if (this.param && this.param.promoteInfo && this.param.promoteInfo.promote_code) {
            this.setLabelValue("node/ndMine/ndCode/lblCode", "邀请码：" + this.param.promoteInfo.promote_code)
        }

        this.scheduleOnce(() => {
            if (this.param && this.param.taskInfo) {
                this.initTaskList(this.param.taskInfo)
            } else {
                PromoteSrv.GetTask({}, (res) => {
                    this.initTaskList(res)
                })
            }
        }, 0.3)
    }

    initTaskList(data: any) {
        if (data && data.list) {
            if (0 == data.list.length) {
                this.setActive("lblNo", true)
            } else {
                this.setActive("sptBgInfo", true)
                for (let i = 0; i < data.list.length; i++) {
                    let itemData = data.list[i]
                    let item = cc.instantiate(this._itemPrefab)
                    item.active = true
                    item.parent = this._content

                    this.setRichTextValue("lblGoal", item, "<b>目标：招募<color=#e78129>" + itemData.member_target + "</c>个亲传弟子</b>")

                    let awardNum = itemData.award_item.item_num
                    this.setRichTextValue("lblReward", item, "<b>获得<color=#e78129>" + awardNum + "</c>奖券</b>")

                    if (2 == itemData.state || "Receive" == itemData.state) {
                        this.setLabelValue("lblStatus", item, "已领取")
                        this.setActive("lblStatus", item, true)
                    } else if (1 == itemData.state || "Finish" == itemData.state) {
                        this.setActive("lblStatus", item, false)
                        this.setActive("btnGet", item, true)

                        this.setButtonClick("btnGet", item, () => {
                            cc.log("on click btnGet")
                            PromoteSrv.GetTaskReward({ task_id: itemData.task_id }, (res => {
                                if (res.award_item) {
                                    let awardList = []
                                    awardList.push(res.award_item)
                                    UserSrv.UpdateItem(() => UIMgr.OpenUI("lobby", "component/activity/getAwardPop/GetAwardPop", { param: { awards: awardList } }))

                                    this.setActive("btnGet", item, false)
                                    this.setLabelValue("lblStatus", item, "已领取")
                                    this.setActive("lblStatus", item, true)
                                }
                            }))
                        })
                    }
                }
            }
        }        

        this._loadAniBtm.parent = this._content
        this.setActive("jz", this._loadAniBtm, false)
        this.setActive("tip", this._loadAniBtm, true)
    }
}
