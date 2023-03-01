import BaseUI from "../../../start/script/base/BaseUI";
import { User } from "../../../start/script/data/User";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShareInfo extends BaseUI {
    onLoad() {
        this.setSpriteFrame("share/wanjiatouxiang-di2", User.Avatar, true)
    }
}
