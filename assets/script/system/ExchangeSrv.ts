import { Helper } from "./Helper"
import { Constants } from "../constants"
import { DataMgr } from "../base/DataMgr"
import { UIMgr } from "../base/UIMgr";

const CATEGORY_GOODS = "igaoshou-shop-srv/goods/categoryGoods"

export namespace ExchangeSrv {
    export function CategoryGoods(param:any,callback?: Function) {
        Helper.PostHttp(CATEGORY_GOODS, null, param, (res) => {
            cc.log("CATEGORY_GOODS", res)
            if (res && res.goods_list) {
                if (DataMgr.Config.platId === 2 || DataMgr.Config.platId === 5) {
                    for(let i=0;i<res.goods_list.length;i++){
                        let goodsInfo = res.goods_list[i]
                        if(goodsInfo.pris){
                            for(let j=goodsInfo.pris.length-1;j>=0;j--){
                                let pris = goodsInfo.pris[j]
                                let onlyTicket = true
                                for(let k=0;k<pris.pri.length;k++){
                                    let pri = pris.pri[k]
                                    pri.pri_type = pri.pri_type || 0
                                    if(pri.pri_type != 0){
                                        onlyTicket = false
                                    }
                                }
                                if(!onlyTicket){                                    
                                    goodsInfo.pris.splice(j, 1)
                                    break
                                }
                            }
                        }
                    }
                }

                for(let i=res.goods_list.length-1;i>=0;i--){
                    let goodsInfo = res.goods_list[i]
                    if(null == goodsInfo.pris || goodsInfo.pris.length == 0){
                        res.goods_list.splice(i, 1)
                    }
                }
                callback && callback(res)
            }
        })
    }

    export function getCartList(param:any,callback?: Function){
        console.log("CartList", param)
        Helper.PostHttp("igaoshou-shop-srv/goods/cartList", null , param, (res, event) => {   
            console.log("CartList",res)
            if (res) {
                callback && callback(res)
            }
        })
    }
}