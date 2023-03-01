import BaseUI from "../../base/BaseUI";
import { Constants } from "../../constants";
import { DataMgr } from "../../base/DataMgr";
import { Helper } from "../../system/Helper";
import { User } from "../../system/User";
import MatchPlayerMode from "./MatchPlayerMode";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchTreeListMode extends BaseUI {

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
        // let widget = this.getNodeComponent("JBS-shengchuxian-1", cc.Widget)
        if (group % 2 === 0) {
            jbs1.scaleY = 1
            jbs1.height = this.node.height / 2 + 39
            jbs1.position = cc.v3(jbs1.position.x, 33)
        } else {
            jbs1.scaleY = -1
            jbs1.height = this.node.height / 2 + 39
            jbs1.position = cc.v3(jbs1.position.x, -33)
        }         

        // cc.log(round)
        jbs1.active = data.totalStage - 1 !== Number(round)
    }

    initData() {
        let user = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        let roundId = this.param.roundId
        let data: IMatchDetail = this.param.data
        let round = data.rounds[roundId]

        cc.log("round " + this.param.round + " group " + this.param.group + " roundId " + roundId)
        cc.log(round)
        
        let idx = 0
        let uis = this.node.getComponentsInChildren(MatchPlayerMode)
        let bSelf = false
        for (let p of round) {
            uis[idx++].setParam({type: data.type, player:p})
            if (p.openid === user.userId) bSelf = true
        }

        this.setActive("link0/fill", bSelf)
    }
}
