import BaseUI from "../../script/base/BaseUI";
import { Constants } from "../../script/igsConstants";
import { Helper } from "../../script/system/Helper";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchPlayerList extends BaseUI {

    onOpen() {
        this.initEvent()
        // this.initData()        
    }

    initEvent() {
        this.setButtonClick("view/content/share/btnShare", this.onPressShare.bind(this))
    }

    initData() {
        let data: IMatchDetail = this.param.match
        let players = data.players
        let num = data.playerNum
        if (!players || !num)
            return

        let content = this.getNode("view/content")
        let mode = this.getNode("view/content/player")
        players = players.sort((a, b) => {
            return !a.openid ? 1 : !b.openid ? -1 :
                (undefined === a.score || null === a.score) ? 1 :
                    (undefined === b.score || null === b.score) ? -1 :
                        a.state === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SETTLE && b.state !== Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SETTLE ? -1 :
                            b.state === Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SETTLE && a.state !== Constants.PLAYER_BATTLE_STATE.PLAYER_STATE_SETTLE ? 1 :
                                a.score > b.score ? -1 :
                                    a.score < b.score ? 1 :
                                        a.rank < b.rank ? -1 : 1
        })

        for (let i = 0; i < num; i++) {
            let p = players[i] || { openid: undefined, score: 0, state: undefined }
            p.rank = (i + 1)
            let n = cc.find("player" + i, content)
            if (!n) {
                n = cc.instantiate(mode)
                n.name = "player" + i
                n.parent = content
                n.setSiblingIndex(i)
            }            

            this.setChildParam(n.name, content, { match: data, player: p })
        }

        mode.active = false

        let n = content.childrenCount - 1
        if (n >= 5) {
            n = 5.5
        }

        // this.setNodeHeight(this.node, mode.height * n + 20 + 10 * n)
    }

    setParam(data) {
        this.param = data
        this.initData()
    }

    onPressShare() {
        Helper.shareInfo()
    }

}
