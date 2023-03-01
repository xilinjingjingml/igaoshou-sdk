const {ccclass, property} = cc._decorator;

let DISTType = cc.Enum({
    NONE: 0,
    HORIZONTAL: 1,
    VERTICAL: 2,
})

@ccclass
export default class DISTLayout extends cc.Component {
    
    @property({type: cc.Enum(DISTType)})
    Type = DISTType.NONE

    onLoad() {
        this.node.on(cc.Node.EventType.SIZE_CHANGED, () => this.updateLayout, this, true)
        this.node.on(cc.Node.EventType.CHILD_ADDED, () => this.updateLayout, this, true)
        this.node.on(cc.Node.EventType.CHILD_REMOVED, () => this.updateLayout, this, true)
        this.node.on(cc.Node.EventType.CHILD_REORDER, () => this.updateLayout, this, true)
    }

    start() {
        this.updateLayout()
    }

    updateLayout() {
        if (this.Type === DISTType.HORIZONTAL) {
            this.updateHorizontal()
        } else if (this.Type === DISTType.VERTICAL) {
            this.updateVertical()
        }
    }

    updateHorizontal() {
        let width = this.node.width / (this.node.childrenCount + 1)
        this.node.children.sort((a, b) => a.getSiblingIndex() < b.getSiblingIndex() ? -1 : 1)
        let idx = 1;
        this.node.children.forEach(i => {
            i.removeComponent(cc.Widget)
            i.position = cc.v3(width * idx++, i.y)
        })
    }

    updateVertical() {
        let height = this.node.height / (this.node.childrenCount + 1)
        this.node.children.sort((a, b) => a.getSiblingIndex() < b.getSiblingIndex() ? -1 : 1)
        let idx = 1;
        this.node.children.forEach(i => {
            i.removeComponent(cc.Widget)
            i.position = cc.v3(i.x, (height * idx++) - this.node.height / 2)
        })

        this.node.children.forEach(i => cc.log(i.position))
    }

}
