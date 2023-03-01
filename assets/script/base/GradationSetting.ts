const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class GradationSetting extends cc.Component {

    @property()
    _colors: cc.Color[] = []

    @property({ type: [cc.Color] })
    set colors(colors: cc.Color[]) {
        this._colors = colors
        this._updateColors()
    }
    get colors(): cc.Color[] {
        return this._colors
    }

    onEnable() {
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, this._updateColors, this)
    }

    onDisable() {
        cc.director.off(cc.Director.EVENT_AFTER_DRAW, this._updateColors, this)
        this.node["_renderFlag"] |= cc["RenderFlow"].FLAG_COLOR
    }

    _updateColors() {
        const cmp = this.getComponent(cc.RenderComponent);
        if (!cmp)
            return
        const _assembler = cmp['_assembler']
        if (!(_assembler instanceof cc['Assembler2D']))
            return
        const uintVerts = _assembler._renderData.uintVDatas[0]
        if (!uintVerts)
            return
        const color = this.node.color
        const floatsPerVert = _assembler.floatsPerVert
        const colorOffset = _assembler.colorOffset        
        let count = 0
        for (let i = colorOffset; i < uintVerts.length; i += floatsPerVert) {
            uintVerts[i] = (this._colors[count] || color)['_val']
            count = ++count % this._colors.length
        }
    }

}