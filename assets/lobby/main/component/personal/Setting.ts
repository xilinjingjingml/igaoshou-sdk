import BaseUI from "../../../start/script/base/BaseUI";
import { DataMgr } from "../../../start/script/base/DataMgr";
import { Util } from "../../../start/script/api/utilApi";
import { Constants } from "../../../start/script/igsConstants";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Setting extends BaseUI {

    _music: cc.Node = null
    _effect: cc.Node = null

    onOpen() {
        if(DataMgr.data.Config.hideMusic){
            this.setActive("node/content/music", false)
            this.setActive("node/content/line", false)
        }
        
        this.initEvent()
        this.initData()
    }

    initEvent() {
        this._music = this.getNode("node/content/music/slider")
        this._effect = this.getNode("node/content/effect/slider")
        this.setSliderEvent(this._music, this.onMusicMove.bind(this))
        this.setSliderEvent(this._effect, this.onEffectMove.bind(this))
        this._music.on(cc.Node.EventType.TOUCH_MOVE, this.onMusicMove, this, false)
        this._effect.on(cc.Node.EventType.TOUCH_MOVE, this.onEffectMove, this, false)
        this._music.on(cc.Node.EventType.TOUCH_START, this.onMusicMove, this, false)
        this._effect.on(cc.Node.EventType.TOUCH_START, this.onEffectMove, this, false)
    }

    initData() {
        let music = Util.GetMusicVolume()
        if (undefined === music || null === music || Number.isNaN(music)) {
            music = 1
        } else if (music < 0) {
            music = 0
        } else if (music > 1) {
            music = 1
        }
        this.setSliderProgress(this._music, music)

        let effect = Util.GetEffectVolume()
        if (undefined === effect || null === effect || Number.isNaN(effect)) {
            effect = 1
        } else if (effect < 0) {
            effect = 0
        } else if (effect > 1) {
            effect = 1
        }
        this.setSliderProgress(this._effect, effect)

        this.setLabelValue("version", Constants.version)
    }

    musicSlider() {
        let music = this.getNodeComponent(this._music, cc.Slider)   
        if (music) {
            Util.SetMusicVolume(music.progress)
        }
    }

    effectSlider() {
        let effect = this.getNodeComponent(this._effect, cc.Slider)   
        if (effect) {
            Util.SetEffectVolume(effect.progress)
        }
    }

    onMusicMove(event: cc.Event.EventTouch) {
        if (event.type === cc.Node.EventType.TOUCH_MOVE || event.type === cc.Node.EventType.TOUCH_START) {
            let pos = this._music.convertToNodeSpaceAR(event.getLocation())
            if (pos.x < -this._music.width / 2) {
                pos.x = -this._music.width / 2
            } else if (pos.x > this._music.width / 2) {
                pos.x = this._music.width / 2
            }            
            // this.setNodePositionX("Handle", this._music, pos.x)

            let music = this.getNodeComponent(this._music, cc.Slider)   
            if (music) {
                let progress = Math.floor((pos.x + this._music.width / 2) / this._music.width * 100) / 100
                if (progress !== music.progress) {
                    music.progress = progress
                    Util.SetMusicVolume(progress)
                }
            }
        }
    }

    onEffectMove(event: cc.Event.EventTouch) {
        if (event.type === cc.Node.EventType.TOUCH_MOVE || event.type === cc.Node.EventType.TOUCH_START) {
            let pos = this._effect.convertToNodeSpaceAR(event.getLocation())
            if (pos.x < -this._effect.width / 2) {
                pos.x = -this._effect.width / 2
            } else if (pos.x > this._effect.width / 2) {
                pos.x = this._effect.width / 2
            }
            // this.setNodePositionX("Handle", this._effect, pos.x)

            let effect = this.getNodeComponent(this._effect, cc.Slider)   
            if (effect) {
                let progress = Math.floor((pos.x + this._effect.width / 2) / this._effect.width * 100) / 100
                if (progress !== effect.progress) {
                    effect.progress = progress
                    Util.SetEffectVolume(progress)
                }
            }
        }
    }
}
