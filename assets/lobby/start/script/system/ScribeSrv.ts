import { DataMgr } from "../base/DataMgr"
import { Constants } from "../igsConstants"
import { WxProxyWrapper } from "../pulgin/WxProxyWrapper"
import { Helper } from "./Helper"


const WE_CHAT_SCRIBE_MSG = "mcbeam-authen-srv/user/weChatScribeMsg"

export namespace ScribeSrv {    
    export const WE_CHAT_SCRIBE_SIGN = 1001

    export function scribeWeChatMsg(param, callback?: Function) {
        Helper.PostHttp(WE_CHAT_SCRIBE_MSG, null, param, (res) => {
            console.log("WE_CHAT_SCRIBE_MSG", res)
            callback && callback(res)
        })
    }

    export function checkShowScribeWeChatMsg(){
        let signTemplateTip = DataMgr.getData(Constants.DATA_DEFINE.SIGN_TEMPLATE_TIP)
        if(cc.sys.WECHAT_GAME === cc.sys.platform && !signTemplateTip && DataMgr.data.OnlineParam.sign_template_id){            
            WxProxyWrapper.requestSubscribeMessage(DataMgr.data.OnlineParam.sign_template_id, (res)=>{
                DataMgr.setData(Constants.DATA_DEFINE.SIGN_TEMPLATE_TIP, true)
                if(res){
                    let param = {
                        pn: DataMgr.data.Config.pn,
                        template_id: DataMgr.data.OnlineParam.sign_template_id,
                        page_id: ScribeSrv.WE_CHAT_SCRIBE_SIGN
                    }
                    ScribeSrv.scribeWeChatMsg(param)
                }
            })
        }
    }
}