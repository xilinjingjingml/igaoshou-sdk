import { igs } from "../igs";

// igs注册启动项
export default class billiard extends igs.listener.DefaultBundleBooter {
    onMatch = function (matchInfo, opponentId, roomInfo) {
        cc.log("====billiard onMatch ====")
        
    };
    onJoin = function (players, roomInfo) {
        cc.log("===billiard onJoin ====")
        
        window["isGameTest"] = true
        setTimeout(() => {
            window["iGaoShouApi"].ReportFinalScore(2000 + Math.floor(Math.random() * 100))
        }, 3000)
    };
    init = function (bundleConfig, initparams, cb) {
        cc.log("===billiard init ===")
        cb(this, { success: true });
    };
}
// 模块中注册
console.log("billiard registerBooter")
window["igs"].bundle.registerBooter("billiard", billiard)