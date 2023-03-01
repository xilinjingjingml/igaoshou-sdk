import { EventMgr } from "../../start/script/base/EventMgr";
import { Constants } from "../../start/script/igsConstants";
import { UIMgr } from "../../start/script/base/UIMgr";

EventMgr.on(Constants.EVENT_DEFINE.QUALIFYING_BTN, (msg) => {
    UIMgr.OpenUI("lobby", "component/league/qualifying/QualifyingBtn", { single: true, parent: msg.parent, param: msg.param })
})