import BaseUI from "../../../../start/script/base/BaseUI";
import { User } from "../../../../start/script/data/User";


const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchTreeListMode extends BaseUI {

    _players: cc.Node[] = []

    onOpen() {
        this.initNode()
        this.initData()
    }

    initNode() {        
        let round = this.param.round
        let group = this.param.group
        let data: IMatchDetail = this.param.data
        this.node.height *= Math.pow(2, round)
        let jbs1 = this.getNode("link0") 
        if (group % 2 === 0) {
            jbs1.scaleY = 1
            jbs1.height = this.node.height / 2 + 39
            jbs1.position = cc.v3(jbs1.position.x, 33)
        } else {
            jbs1.scaleY = -1
            jbs1.height = this.node.height / 2 + 39
            jbs1.position = cc.v3(jbs1.position.x, -33)
        }         

        jbs1.active = data.totalStage - 1 !== Number(round)
    }

    initData() {
        let roundId = this.param.roundId
        let data: IMatchDetail = this.param.data
        let round = data.rounds[roundId]
        
        let idx = 0
        let bSelf = false
        for (let p of round) {
            this.setChildParam(this.getNode("player" + idx++), {type: data.type, player:p})
            if (p.openid === User.OpenID) bSelf = true
        }

        this.setActive("link0/fill", bSelf)
    }
}
