import { Helper } from "./Helper"
import { Constants } from "../igsConstants"
import { DataMgr } from "../base/DataMgr"
import { UIMgr } from "../base/UIMgr";

const HOME_GOODS = "igaoshou-shop-srv/goods/homeInfo"
const CATEGORY_GOODS = "igaoshou-shop-srv/goods/categoryGoods"

let FIRST_GOODS: any[] = []
let ALL_GOODS: any[] = []
let KIND_GOODS: { [index: number]: any[] } = {}

let CATEGORY_TYPE: any[] = []

export namespace ExchangeSrv {
    export function getHomeInfo(info: any, callback?: Function) {
        if (FIRST_GOODS.length >= info.page_size * info.page_code) {
            callback?.(FIRST_GOODS)
            return
        }

        let param = {
            page_size: info.page_size,
            page_code: info.page_code,
            sort_by: info?.sort_by, //排序字段
            order_code: info?.order_code //顺序 -1降序 1升序
        }
        
        Helper.PostHttp(HOME_GOODS, null, param, (res, event) => {
            if (res) {
                console.log(res)
                let start = info.page_size * (info.page_code - 1)
                for (let i = 0; i < res.first_goods.length; i++) {
                    FIRST_GOODS[start + i] = res.first_goods[i]
                }

                CATEGORY_TYPE = res.category_list

                callback?.(FIRST_GOODS)
            }
        })
    }

    export function getCategoryGoods(info: any, callback?: Function) {
        console.log("getCategoryGoods", info?.type)
        if (info.category_id === -1) {
            if (ALL_GOODS.length >= info.page_size * info.page_code) {
                callback?.(ALL_GOODS)
                return
            }
        } else {
            if (KIND_GOODS[info.category_id] && KIND_GOODS[info.category_id].length >= info.page_size * info.page_code) {
                callback?.(KIND_GOODS[info.category_id])
                return
            }
        }

        let param = {
            type_id: info?.type_id,
            category_id: info?.category_id,
            keyword: "",
            page_size: info?.page_size,
            page_code: info?.page_code,
            sort_by: info?.sort_by,
            order_code: info?.order_code
        }
        Helper.PostHttp(CATEGORY_GOODS, null, param, (res, event) => {
            if (res) {
                console.log(res)
                let start = info.page_size * (info.page_code - 1)
                if (info.category_id === -1) {
                    for (let i = 0; i < res.goods_list.length; i++) {
                        ALL_GOODS[start + i] = res.goods_list[i]
                    }
                    callback?.(ALL_GOODS)
                } else {
                    if (!KIND_GOODS[info.category_id]) {
                        KIND_GOODS[info.category_id] = []
                    }

                    for (let i = 0; i < res.goods_list.length; i++) {
                        KIND_GOODS[info.category_id][start + i] = res.goods_list[i]
                    }
                    callback?.(KIND_GOODS[info.category_id])
                }
            }
        })
    }

    export function CategoryGoods(param: any, callback?: Function) {
        Helper.PostHttp(CATEGORY_GOODS, null, param, (res) => {
            cc.log("CATEGORY_GOODS", res)
            if (res && res.goods_list) {
                if (DataMgr.data.Config.platId === 2 || DataMgr.data.Config.platId === 5) {
                    for (let i = 0; i < res.goods_list.length; i++) {
                        let goodsInfo = res.goods_list[i]
                        if (goodsInfo.pris) {
                            for (let j = goodsInfo.pris.length - 1; j >= 0; j--) {
                                let pris = goodsInfo.pris[j]
                                let onlyTicket = true
                                for (let k = 0; k < pris.pri.length; k++) {
                                    let pri = pris.pri[k]
                                    pri.pri_type = pri.pri_type || 0
                                    if (pri.pri_type != 0) {
                                        onlyTicket = false
                                    }
                                }
                                if (!onlyTicket) {
                                    goodsInfo.pris.splice(j, 1)
                                    break
                                }
                            }
                        }
                    }
                }

                for (let i = res.goods_list.length - 1; i >= 0; i--) {
                    let goodsInfo = res.goods_list[i]
                    if (null == goodsInfo.pris || goodsInfo.pris.length == 0) {
                        res.goods_list.splice(i, 1)
                    }
                }
                callback && callback(res)
            }
        })
    }

    export function getCartList(param: any, callback?: Function) {
        console.log("CartList", param)
        Helper.PostHttp("igaoshou-shop-srv/goods/cartList", null, param, (res, event) => {
            console.log("CartList", res)
            if (res) {
                callback && callback(res)
            }
        })
    }

    //获取兑换商品列表
    export function getExchangeTemplateInfo(param, callback?: Function) {
        let res = DataMgr.getData(Constants.DATA_DEFINE.EXCHANGE_DATA + param.typeId)
        if (res) {
            callback && callback(res)
        } else {
            Helper.PostHttp("igaoshou-shop-srv/exchange/exchangeTemplateInfo", null, param, (res, event) => {
                if (res) {
                    // callback && callback(res)
                    if (res.result && res.result.length > 0) {
                        DataMgr.setData(Constants.DATA_DEFINE.EXCHANGE_DATA + param.typeId, res)
                    }
                }
                callback?.(res)
            })
        }
    }

    //兑换商品
    export function exchangeTemplateInfo(param, callback?: Function) {
        Helper.PostHttp("igaoshou-shop-srv/exchange/exchangeInfo", null, param, (res, event) => {
            if (res) {
                callback && callback(res)
            }
        })
    }

    export function getFirstGoods(idx) {
        return FIRST_GOODS[idx]
    }

    export function getAllGoods(idx) {
        return ALL_GOODS[idx]
    }

    export function getkindGoods(id, idx) {
        return KIND_GOODS[id][idx]
    }

    export function getKinds() {
        return CATEGORY_TYPE
    }
}