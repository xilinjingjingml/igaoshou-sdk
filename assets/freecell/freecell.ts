import { Helper } from "../lobby/start/script/system/Helper";
import { Match } from "../lobby/start/script/api/matchApi";
import { igs } from "../igs";

// igs注册启动项
export default class freecell extends igs.listener.DefaultBundleBooter {
    onMatch = function (matchInfo, opponentId, roomInfo) {
        cc.log("====freecell onMatch ====")
        
    };
    onJoin = function (players, roomInfo) {
        cc.log("===freecell onJoin ====")
        Helper.DelayFun(() => Match.ReportFinalScore(3500 + Math.floor(Math.random() * 100)), 3)
    };
    init = function (bundleConfig, initparams, cb) {
        cc.log("===freecell init ===")
        cb(this, { success: true });
    };
}
// 模块中注册
window["igs"].bundle.registerBooter("freecell", freecell)