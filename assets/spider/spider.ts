import { igs } from "../igs";

// igs注册启动项
export default class spider extends igs.listener.DefaultBundleBooter {
    onMatch = function (matchInfo, opponentId, roomInfo) {
        cc.log("====spider onMatch ====")
        
    };
    onJoin = function (players, roomInfo) {
        cc.log("===spider onJoin ====")
        
        setTimeout(() => window["iGaoShouApi"].ReportFinalScore(3500 + Math.floor(Math.random() * 100)), 3000)
    };
    init = function (bundleConfig, initparams, cb) {
        cc.log("===spider init ===")
        cb(this, { success: true });
    };
}
// 模块中注册
console.log("spider registerBooter")
window["igs"].bundle.registerBooter("spider", spider)