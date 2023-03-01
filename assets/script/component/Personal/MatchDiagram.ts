import BaseUI from "../../base/BaseUI";
import { DataMgr } from "../../base/DataMgr";
import { Constants } from "../../constants";

const {ccclass, property} = cc._decorator;

interface DiagramPoint {
    isWin: boolean
    pos: cc.Vec3
}

@ccclass
export default class MatchDiagram extends BaseUI {

    @property()
    winColor: cc.Color = cc.color(251, 146, 39)

    @property()
    lostColor: cc.Color = cc.color(136, 136, 136)

    _diagram: cc.Node = null
    _graphics: cc.Graphics = null

    onOpen() {
        this.initNode()
        this.initEvent()
        this.initData()
    }

    initNode() {
        let node = new cc.Node()
        this._diagram = this.getNode("diagram")
        if (this._diagram) {
            this._diagram.addChild(node)
            this._graphics = node.addComponent(cc.Graphics)
        }
    }

    initEvent() {
        DataMgr.feed(Constants.DATA_DEFINE.USER_INFO + ".histroy", this.initData, this)
    }

    initData() {
        let IPlayerData = DataMgr.getData<IPlayerData>(Constants.DATA_DEFINE.USER_INFO)
        this._diagram.children.forEach(
            item => item.children.forEach(
                child => {
                    if (child.name === "points") {
                        child.children.forEach(p => p.active = false)
                    } else if (child.name === "tip") {
                        child.active = false
                    }                    
                }))
        
        let records = IPlayerData.histroy.records
        let points: DiagramPoint[] = []
        for (let idx in records) {
            let isWin = records[idx]// === 1
            let pos = this.getPointPos(isWin, Number(idx))
            points.push({
                isWin: isWin,
                pos: pos
            })

            this.setNodePositionX((isWin ? "win" : "lost") + "/tip", this._diagram, pos.x)
        }

        if (points.length >= 2) {
            let start = points[0]
            for (let i = 1; i < points.length; i ++) {
                let end = points[i]
                this.drawLine(cc.v3(start.pos), cc.v3(end.pos), start.isWin ? this.winColor : this.lostColor, end.isWin ? this.winColor : this.lostColor)
                start = end
            }
        }
    }

    getPointPos(isWin: boolean, idx: number): cc.Vec3 {
        let list = this.getNode((isWin ? "win" : "lost") + "/points", this._diagram)
        if (list) {
            list.children[idx].active = true
            return this._diagram.convertToNodeSpaceAR(list.convertToWorldSpaceAR(list.children[idx].position))
        }
    }

    drawLine(sPos: cc.Vec3, ePos: cc.Vec3, sColor: cc.Color, eColor: cc.Color) {
        if (!this._graphics) {
            return
        }

        let dir = ePos.sub(sPos).normalize()
        sPos.addSelf(dir.mul(15))
        ePos.addSelf(dir.neg().mul(15))
        this._graphics.lineWidth = 10
        this._graphics.moveTo(sPos.x, sPos.y)    
        if (sColor === eColor) {                        
            this._graphics.lineTo(ePos.x, ePos.y)
            this._graphics.strokeColor = sColor
            this._graphics.stroke()
        } else {
            let cPos = sPos.add(dir.mul(ePos.sub(sPos).mag() / 2))
            this._graphics.lineTo(cPos.x, cPos.y)
            this._graphics.strokeColor = sColor
            this._graphics.stroke()
            this._graphics.moveTo(cPos.x, cPos.y)
            this._graphics.lineTo(ePos.x, ePos.y)
            this._graphics.strokeColor = eColor
            this._graphics.stroke()
        }
    }

}
