/*
 * @Description: 热更新
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import { Constants } from "../igsConstants"
import { DataMgr } from "../base/DataMgr"
import { UserSrv } from "../system/UserSrv"
import { AdSrv } from "../system/AdSrv"
import { PluginMgr } from "../base/PluginMgr"
import { EAdsResult, ESocialResult } from "../pulgin/IPluginProxy"
import { UIMgr } from "../base/UIMgr"
import { NewGateMgr } from "../base/NewGateMgr"
import { Helper } from "../system/Helper"
import { User } from "../data/User"

const GAME_MUSIC = "game_music"
const GAME_EFFECT = "game_effect"

let _background: cc.AudioClip = null
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

    export function getEAdsResult() {
        return EAdsResult
    }

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
        cc.sys.localStorage.setItem("soundVolume", music.toString());
        cc.audioEngine.setMusicVolume(music)
    }

    export function SetEffectVolume(effect: number) {
        cc.sys.localStorage.setItem("effectVolume", effect.toString());
        cc.audioEngine.setEffectsVolume(effect)
    }

    export function GetMusicVolume(): number {
        let music = cc.sys.localStorage.getItem("soundVolume")
        music && (music = Number(music))
        if (undefined === music || null === music || "" === music || Number.isNaN(music))
            music = cc.audioEngine.getMusicVolume()
        return music
    }

    export function GetEffectVolume(): number {
        let effect = cc.sys.localStorage.getItem("effectVolume")
        effect && (effect = Number(effect))
        if (undefined === effect || null === effect || "" === effect || Number.isNaN(effect))
            effect = cc.audioEngine.getEffectsVolume()
        return effect
    }

    export function GetPromotion(callback?: () => void) {
        UserSrv.GetPromotion(callback)
    }

    export function NativeGame(gameId: string) {
        PluginMgr.navigateToMiniGame(gameId)
    }

    export function SetProto(name: string, proto: any) {
        NewGateMgr.setProto(name, proto, true)
    }

    export function UnsetProto(name: string) {
        NewGateMgr.unsetProto(name)
    }

    export function SetBackgroundImage(image: cc.SpriteFrame) {
        DataMgr.setData(Constants.DATA_DEFINE.BACK_GROUND_IMAGE, image)
    }

    export function GetEnv() {
        return DataMgr.data.Config ? DataMgr.data.Config.env : null
    }

    export function PlayAD(index: number, callback?: Function) {
        let play = () => {
            AdSrv.createAdOrder(2001 + index, "PlayAD", (playAdCallBack: IPlayAdCallBack) => {
                if (playAdCallBack && playAdCallBack.order_no && playAdCallBack.order_no.length > 0) {
                    AdSrv.completeAdOrder((res) => {
                        if (res && res.code == "00000") {
                            callback && callback(index, true, playAdCallBack)
                        } else {
                            callback && callback(index, false, playAdCallBack)
                        }
                    })
                } else {
                    callback && callback(index, false, playAdCallBack)
                }
            })
        }

        let isMember = DataMgr.getData(User.OpenID+Constants.DATA_DEFINE.IS_MEMBER)
        if(isMember){
            callback && callback(index, true, { adsInfo: { id: index }, AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_SUCCEES, order_no: "" })
            return
        }

        if (cc.sys.platform === cc.sys.WECHAT_GAME || Helper.isNative()) {
            play()
        } else {
            UIMgr.OpenUI("component/AdConfirm/AdConfirm",
                {
                    parent: cc.director.getScene(),
                    param: {
                        cancel: () => {
                            callback?.(index, false, {
                                order_no: "",
                                AdsResultCode: EAdsResult.RESULT_CODE_REWARTVIDEO_CANCEL,
                                adsInfo: {},
                                msg: ""
                            })
                        },
                        play: () => play()
                    }
                })
        }
    }

    export function shareInfo(param?: any, callback?: Function) {
        if (param && typeof param === "function") {
            callback = param
            param = null
        }
        
        Helper.shareInfo(param, (res)=>{
            if(res && res.ShareResultCode == ESocialResult.SHARERESULT_SUCCESS){
                callback?.({ret: 1})
            }else{
                callback?.({ret: 0})
            }
        })
    }
}

function InitVolume() {
    cc.audioEngine.setMusicVolume(Util.GetMusicVolume())
    cc.audioEngine.setEffectsVolume(Util.GetEffectVolume())
}
InitVolume()