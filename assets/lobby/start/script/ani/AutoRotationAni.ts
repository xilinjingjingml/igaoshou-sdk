

const {ccclass, property} = cc._decorator;

@ccclass
export default class AutoRotationAni extends cc.Component {

    start () {
        cc.tween(this.node).repeatForever(cc.tween().to(1.5, { angle: -180 }).to(1.5, { angle: -360 }).set({ angle: 0 })).start()        
    }

}
