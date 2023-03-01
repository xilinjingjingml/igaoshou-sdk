import { LocalMgr } from "./LocalMgr";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class LocalSetting extends cc.Component {

    static settings: { [key: string]: string } = {}

    @property
    _languageID: string = ""

    _label: cc.Label = null
    _richText: cc.RichText = null

    _param: any = []

    @property
    set LanguageID(id: string) {
        this._languageID = id
        this._updateLanguage()
    }
    get LanguageID(): string {
        return this._languageID
    }

    onLoad() {
        if (CC_EDITOR) {
            LocalMgr.Init()
        }
    }

    start() {
        this._updateLanguage()
    }

    _updateLanguage() {
        if (null === this._label && null === this._richText) {
            this._label = this.node.getComponent(cc.Label)
            this._richText = this.node.getComponent(cc.RichText)
        }

        let msg = LocalMgr.GetMessage(this._languageID, this._param)
        if (msg) {           
            this._label && (this._label.string = msg)
            this._richText && (this._richText.string = msg)
        }
    }

    setParam(param: any) {
        this._param = param || []
        this._updateLanguage()
    }
}
