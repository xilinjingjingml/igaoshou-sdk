import { DataMgr } from "../../base/DataMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FontColor extends cc.Component {

    @property({
        type: cc.Color
    })
    set Color(color: cc.Color) {
        this._color = color
        this.updateColor()
    }
    get Color(): cc.Color {
        return this._color
    }

    @property(cc.Color)
    _color: cc.Color = cc.Color.BLACK

    _material: cc.Material = null

    onLoad() {
        let label = this.node.getComponent(cc.Label)
        let bundler = DataMgr.Bundle
        if (bundler) {
            bundler.load("image/shader/fill_color", cc.EffectAsset, (err, src) => {
                if (err) {
                    return
                }

                if (src instanceof cc.EffectAsset) {
                    let material = new cc.Material()
                    material["effectAsset"] = src
                    label.setMaterial(0, material)  
                    this._material = label.getMaterial(0)
                    this.updateColor()                  
                }
            })
        }
        // this._material = new cc.Material()
        // this._material.
        // if (label) {
        //     this._material = label.getMaterial(0)
        // }
        // if (this._material.name !== "font-color") {
        //     this._material = null
        //     let bundler = DataMgr.Bundle
        //     if (bundler) {
        //         bundler.load("image/font/font-color", cc.Material, (err, src) => {
        //             if (err) {
        //                 return
        //             }

        //             if (src instanceof cc.Material) {
        //                 label.setMaterial(0, src)
        //                 this._material = label.getMaterial(0)
        //             }
        //             this.updateColor()
        //         })
        //     }
        // } else {
        //     this.updateColor()
        // }
    }

        updateColor() {
            if (!this._material)
                return

                
            // let color = this._material.getProperty("discolor", 0)
            // let label = this.node.getComponent(cc.Label)
            // if (label.string === "10" && this.node.parent.name === "item") {
            //     cc.log("updateColor " + this.node.parent.name + " color " + this._color)
            // }

            // cc.log("fontColor updateColor " + this.node.parent.name + " color = " + this._color)
            this._material.setProperty("discolor", this._color)
        }

        // update() {
        //     if (!this._material)
        //         return

        //     let color = this._material.getProperty("discolor", 0)
        //     // if (this.node.parent.name === "diamond" && color === cc.Color.WHITE)
        //     let label = this.node.getComponent(cc.Label)
        //     if (label.string === "10" && this.node.parent.name === "item") {
        //         cc.log(this.node.parent.name + " fontColor " + color + " this._color " + this._color)
        //         if (color[0] !== this._color.r || color[1] !== this._color.g || color[2] !== this._color.b || color[3] !== this._color.a)
        //             this._material.setProperty("discolor", this._color, 0, true)
        //     }
        // }
    }
