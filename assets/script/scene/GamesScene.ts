import BaseUI from "../base/BaseUI";
import { ActivitySrv } from "../system/ActivitySrv";
import { DataMgr } from "../base/DataMgr";
import { Constants } from "../constants";
import { User } from "../system/User";
import { Helper } from "../system/Helper";
import { Util } from "../api/utilApi";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GamesScene extends BaseUI {

    _mode: cc.Node = null

    onLoad() {
        this.initNode()
    }

    onOpen() {
        // this.initNode()
        this.initEvent()
        this.initData()
    }

    initNode() {
        this._mode = this.getNode("games/itemMode")
        this._mode.active = false
    }

    initEvent() {
        this.setButtonClick("btns/btnSign", this.onPressSign.bind(this))
        this.setButtonClick("btns/btnSlyder", this.onPressSlyder.bind(this))
    }

    initData() {
        let promotionList = DataMgr.getData(Constants.DATA_DEFINE.OTHER_GAME_PROMOTION)
        if (promotionList) {
            this.updateList(promotionList)
        } else {
            User.GetPromotion((res) => {
                console.log("GetPromotion", res)
                if (res && res.length > 0) {
                    this.updateList(res)
                    DataMgr.setData(Constants.DATA_DEFINE.OTHER_GAME_PROMOTION, res)
                } else {
                    Helper.OpenTip("暂无推荐游戏")
                }
            })
        }
    }

    updateList(data) {
        data.sort((a, b) => {
            return a.sort_id < b.sort_id ? -1 : 1
        })
        let games = this.getNode("games")
        let spaceX = (games.width - (3 * this._mode.width)) / 4
        this.setLayoutInfo("games", {spacingX: spaceX})
        let list = []
        for (let v of data) {
            let n = cc.instantiate(this._mode)
            n.name = v.promotion_game_gid
            n.active = true
            n.parent = this.getNode("games")
            this.setLabelValue("name", n, v.promotion_game_name)
            this.setLabelValue("popularity", n, "人气值: " + Math.floor(Math.random() * 10000))
            this.setSpriteFrame("icon", n, v.icon, true)

            this.setActive("new", n, v.new === 1)
            this.setActive("hot", n, v.hot === 1)

            this.setButtonClick(n, () => {Util.NativeGame(v.promotion_appid)})

            if (null === v.online_num || undefined === v.online_num) {
                list.push(v.promotion_game_gid)
            } else {
                this.setLabelValue("popularity", n, "人气值: " + v.online_num)
            }
        }

        User.GetOnlineNum(list, (res) => {
            if (!res || !res.online_num_list) {
                return
            }
            for (let k in data) {
                let d = data[k]
                if (res.online_num_list[d.promotion_game_gid]) {
                    data[k].online_num = res.online_num_list[d.promotion_game_gid]
                    this.setLabelValue(d.promotion_game_gid + "/popularity", this.getNode("games"), "人气值: " + d.online_num)
                }
            }

            DataMgr.setData(Constants.DATA_DEFINE.OTHER_GAME_PROMOTION, data)
        })
    }

    onPressSign() {
        let info = ActivitySrv.GetActivityById(8)
        ActivitySrv.OnClickActivity(info)
    }

    onPressSlyder() {
        let info = ActivitySrv.GetActivityById(4)
        ActivitySrv.OnClickActivity(info)
    }
}
