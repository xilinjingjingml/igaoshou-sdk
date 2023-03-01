import { Helper } from "../system/Helper"
import { EventMgr } from "./EventMgr"
import { Constants } from "../igsConstants"

let _settings = null

export namespace SettingMgr {

    export async function init() {
        if (!_settings) {
            cc.assetManager.getBundle("lobby").load("setting", cc.JsonAsset, (err, data: cc.JsonAsset) => {
                _settings = data.json
            })
        }
    }

    function repleatToken(set) {
        if (typeof set === "string" && set.indexOf("$") !== -1) {
            return getConfig(set.substr(1))
        } else if (typeof set === "object") {
            for (let i in set) {
                set[i] = repleatToken(set[i])
            }
        }

        return set
    }

    export function getConfig(name: string) {
        if (!_settings) {
            return
        }
        name = name || ""
        let trees = name.split(".")
        let set = _settings[trees[0]]
        for (let i = 1; i < trees.length; i++) {
            set = set[trees[i]]
            if (null === set || undefined === set) {
                return null
            }
        }

        set = repleatToken(set)

        // cc.log("get name = " + name, set)

        return set
    }
}

EventMgr.once(Constants.EVENT_DEFINE.CONFIG_INIT, SettingMgr.init)