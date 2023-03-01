import { DataMgr } from "../../base/DataMgr";
const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadBubble extends cc.Component {

    onLoad() {
        if(DataMgr.Config.platId === 3){
            this.node.active = false
        }
    }

    start() {
        for (let i = 0; i < this.node.childrenCount; i ++) {
            this.playerBubble(this.node.children[i], .5 * i)
        }
    }

    playerBubble(node: cc.Node, time: number) {
        node.scale = 0
        let start = node.position
        let pos = node.position

        cc.log(start, pos)

        let elasticity = cc.tween().repeat(3, 
            cc.tween()
            .to(.2, {scaleX: .7})
            .to(.2, {scaleX: .9})
            .to(.2, {scaleX: .7})
            .to(.2, {scaleX: .8})
            .delay(1)
            .to(.2, {scaleY: .7})
            .to(.2, {scaleY: .9})
            .to(.2, {scaleY: .7})
            .to(.2, {scaleY: .8})
            .delay(1)
        )

        let snake = cc.tween().repeat(3, 
            cc.tween()                 
            .call(() => {
                cc.tween(node)
                .bezierBy(3, 
                        cc.v2(120, 120), 
                        cc.v2(-80, 240), 
                        cc.v2(0, 360))    
                .start()
                })
            .delay(2.5)
        )

        cc.tween(node)
        .delay(time)
        .repeatForever(
            cc.tween()
            .to(.1, {scale: .8})
            .parallel(
                elasticity,
                snake,
                cc.tween().delay(7).to(.5, {opacity: 0})
            )
            // .to(.5, {opacity: 0,})
            .set({position: start, scale: 0, opacity: 255})
            .call(() => {
                pos = start
                cc.log(start, pos)
            })
            .delay(.2)
        )
        .start()        
    }

}
