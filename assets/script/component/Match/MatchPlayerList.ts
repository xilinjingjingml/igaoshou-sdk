import BaseUI from "../../base/BaseUI";
import { Helper } from "../../system/Helper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchPlayerList extends BaseUI {

    onOpen() {
        this.initEvent()
        // this.initData()        
    }

    initEvent() {
        this.setButtonClick("content/share/btnShare", this.onPressShare.bind(this))
    }

    initData() {
        let players = this.param.players
        let type = this.param.type
        let num = this.param.num
        if (!players || !num)
            return

        let content = this.getNode("content")
        let mode = this.getNode("content/player")
        players = players.sort((a, b) => {
            return !a.openid ? -1 : !b.openid ? -1 : a.rank < b.rank ? 1 : -1
        })

        for (let i = 0 ; i < num; i++ ) {
            let p = players[i] || {openid: undefined, score: 0, state: undefined}
            let n = cc.instantiate(mode)               
            n.name = "player" + i
            n.parent = content
            n.setSiblingIndex(0)
            
            this.setChildParam(n.name, content, {type: type, player: p})
        }

        mode.active = false
    }

    setParam(data) {
        this.param = data
        this.initData()
    }

    onPressShare() {
        Helper.shareInfo()
    }

}
