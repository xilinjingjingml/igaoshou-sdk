/*
 * @Description: 热更新
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import { UIMgr } from "../base/UIMgr"
import { Constants } from "../constants"
import { DataMgr } from "../base/DataMgr"
import { User } from "../system/User"
import WxWrapper from "../system/WeChatMini"
import { GateMgr } from "../base/GateMgr"
import { ActivitySrv } from "../system/ActivitySrv"
import { AdSrv } from "../system/AdSrv"

const GAME_MUSIC = "game_music"
const GAME_EFFECT = "game_effect"

let _background:cc.AudioClip = null
let _count: number = 0

class iRandom {
    _seed: number
    setSeed(seed: number) {
        this._seed = Number(seed)
    }

    Random() {
        if (undefined === this._seed || null === this._seed) {
            this._seed = Math.random()
        }

        // if (this._seed) {
        this._seed = (this._seed * 9301 + 49297) % 233280;
        return this._seed / 233280.0;
        // }
    }   
}

let randomList: iRandom[] = []
export namespace Util {    
    export function SetSeed(seed: number) {
        DataMgr.setData(Constants.DATA_DEFINE.RAND_SEED, seed)
        if (null === seed) {
            randomList.forEach(i => i = null)
            randomList = []
        }
    }

    export function Random(id: number = 0): number {
        let seed = DataMgr.getData<number>(Constants.DATA_DEFINE.RAND_SEED)
        if (seed) {
            // seed = (seed * 9301 + 49297) % 233280;
            // DataMgr.setData(Constants.DATA_DEFINE.RAND_SEED, seed)
            // let num = seed / 233280.0;
            // // cc.log("Random count " + (_count++) + " num = " + num)
            // return num
            if (!randomList[id]) {
                randomList[id] = new iRandom()
                randomList[id].setSeed(seed)       
            }

            return randomList[id].Random()
        }
        return Math.random()
    }

    export function SetBackgroundMusic(music: string | cc.AudioClip) {
        if (typeof music === "string") {
            cc.loader.loadRes(music, cc.AudioClip, (err, asset) => {
                if (err) {
                    cc.error("Background Music is null! Path is " + music)
                    return
                }
                if (asset instanceof cc.AudioClip) {
                    _background = asset
                }
            })
        } else {
            _background = music
        }
    }

    export function PlayBackgroundMusic() {
        if (_background) {
            cc.audioEngine.playMusic(_background, true)
        }
    }

    export function SetMusicVolume(music: number) {
        DataMgr.setData<number>(GAME_MUSIC, music, true)
        cc.audioEngine.setMusicVolume(music)
    }

    export function SetEffectVolume(effect: number) {
        DataMgr.setData<number>(GAME_EFFECT, effect, true)
        cc.audioEngine.setEffectsVolume(effect)
    }

    export function GetMusicVolume(): number {
        let music = DataMgr.getData<number>(GAME_MUSIC)
        if (undefined === music || null === music || Number.isNaN(music))
            music = cc.audioEngine.getMusicVolume()
        return music
    }

    export function GetEffectVolume(): number {
        let effect = DataMgr.getData<number>(GAME_EFFECT)
        if (undefined === effect || null === effect || Number.isNaN(effect))
            effect = cc.audioEngine.getEffectsVolume()
        return effect
    }

    export function GetPromotion(callback?: () => void) {
        User.GetPromotion(callback)
    }

    export function NativeGame(gameId: string) {
        WxWrapper.navigateToMiniProgram(gameId)
    }

    export function CheckWxVersion() {
        WxWrapper.checkAppUpdate()
    }

    export function SetProto(name: string, proto: any) {
        GateMgr.setProto(name, proto, true)
    }

    export function UnsetProto(name: string) {
        GateMgr.unsetProto(name)
    }

    export function SetBackgroundImage(image: cc.SpriteFrame) {
        DataMgr.setData(Constants.DATA_DEFINE.BACK_GROUND_IMAGE, image)
    }

    export function GetEnv() {
        return DataMgr.Config.env
    }

    export function PlayAD(index: number, callback?: Function) {
        // let activity = ActivitySrv.GetActivityById(2001 + index)
        // if (activity) {
            AdSrv.createAdOrder(2001 + index, "PlayAD", (order_no: string) => {
                if (order_no && order_no.length > 0) {
                    AdSrv.completeAdOrder((res) => {
                        if (res && res.code == "00000"){
                            callback && callback(index, true)
                        } else {
                            callback && callback(index, false)
                        }
                    })
                } else {
                    callback && callback(index, false)
                }
            })
        // } else {
        //     callback && callback(index, false)
        // }
        }
    
}

function InitVolume(){
    cc.audioEngine.setMusicVolume(Util.GetMusicVolume())
    cc.audioEngine.setEffectsVolume(Util.GetEffectVolume())
}
InitVolume()

