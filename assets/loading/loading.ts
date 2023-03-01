
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad() {
        cc.log("=====Loading=====")
    }

    start() {
        let msg = this.node.getChildByName("msg").getComponent(cc.Label)
        msg.string += "\n" + Date.now() + ":start"
        console.log("loadBundle")
        cc.assetManager.loadBundle("billiard")
        cc.assetManager.loadBundle("igaoshou", (err, bundle) => {
            console.log("loadBundle finish")
            msg.string += "\n" + Date.now() + ":loadBundle"
            if (!err) {
                window["iGaoShouApi"].Launch(msg)
                return
            }

            cc.error("err " + err)
        })
    }
}
