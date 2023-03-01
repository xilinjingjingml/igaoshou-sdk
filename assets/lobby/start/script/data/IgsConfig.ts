import { Constants } from "../igsConstants"

const igs = window["igs"]

export class igsConfig {
    static _config: IGameConfig = null
    static get Config() {
        if (!igsConfig._config) {
            igsConfig._config = igs.exports.config
        }

        if (!igsConfig._config) {
            let str = localStorage.getItem("iGaoShouData" + Constants.DATA_DEFINE.IGS_CONFIG)
            if (str) {
                try{
                    igsConfig._config = JSON.parse(str)
                } 
                catch {}
            }
        }

        return igsConfig._config
    }    
}