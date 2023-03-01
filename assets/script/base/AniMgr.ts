/*
 * @Description: 
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

import { Constants } from "../constants"

export namespace AniMgr {
    export function doPageAni(ani: Constants.PAGE_ANI = Constants.PAGE_ANI.IDLE, target: cc.Node, callback?: Function) {
        if (ani === Constants.PAGE_ANI.IDLE || !target || !(target instanceof cc.Node) || !target.isValid) {
            callback && callback()
            return
        } else if (ani === Constants.PAGE_ANI.LEFT_IN) {
            leftIn(target, callback)
        } else if (ani === Constants.PAGE_ANI.LEFT_OUT) {
            leftOut(target, callback)
        } else if (ani === Constants.PAGE_ANI.RIGHT_IN) {
            rightIn(target, callback)
        } else if (ani === Constants.PAGE_ANI.RIGHT_OUT) {
            rightOut(target, callback)
        } else if (ani === Constants.PAGE_ANI.TOP_IN) {
        } else if (ani === Constants.PAGE_ANI.TOP_OUT) {
        } else if (ani === Constants.PAGE_ANI.POP_IN) {
            popIn(target, callback)
        } else if (ani === Constants.PAGE_ANI.FADE_IN) {
            fadeIn(target, callback)
        } else if (ani === Constants.PAGE_ANI.ITMEIZE_SHOW) {
            itemizeShow(target, callback)
        } else {
            cc.tween(target).set({opacity: 255}).start()
        }
    }

    function leftIn(target: cc.Node, callback?: Function) {
        // let pos = cc.v3(target.position)
        let x = 0
        cc.tween(target)        
        .set({opacity: 0})
        .delay(.15)
        .call(() => x = target.x)
        .call(() => cc.log("start" + target.x))
        .set({x: -cc.winSize.width})
        .delay(.1)
        // .set({opacity: 255})
        .call(() => cc.log("end" + target.x))
        .to(.3, {x: target.x, opacity: 255}, {easing: "quadOut"})
        .call(() => cc.log("x " + x + "finish" + target.x))
        .call(() => callback && callback())
        .call(() => cc.log("finish" + target.x))
        .start()
    }

    function leftOut(target: cc.Node, callback?: Function) {
        cc.tween(target)        
        .delay(.1)
        .set({opacity: 255})
        .to(.3, {opacity: 0, position: cc.v3(-cc.winSize.width, target.position.y)}, {easing: "quadIn"})
        .call(() => callback && callback())
        .start()
    }

    function rightIn(target: cc.Node, callback?: Function) {
        // let pos = cc.v3(target.position)
        let x = 0
        cc.tween(target)        
        .set({opacity: 0})
        .delay(.15)
        .call(() => x = target.x)
        .to(.0, {x: +cc.winSize.width})
        .delay(.1)
        .set({opacity: 255})
        .to(.3, {x: x})
        .call(() => callback && callback())
        .start()
    }

    function rightOut(target: cc.Node, callback?: Function) {
        cc.tween(target)        
        .delay(.1)
        .set({opacity: 255})
        .to(.3, {position: cc.v3(+cc.winSize.width, target.position.y)})
        .call(() => callback && callback())
        .start()
    }

    function fadeIn(target: cc.Node, callback?: Function) {
        cc.tween(target)
        .set({opacity: 0})
        .to(.15, {opacity: 255}, {easing: 'sineOutIn'})
        .delay(.4)
        .call(() => callback && callback())
        .start()
    } 

    function popIn(target: cc.Node, callback?: Function) {
        cc.tween(target)
        .set({scaleY: 0, opacity: 255})
        .to(.15, {scaleY: 1})
        .call(() => callback && callback())
        .start()
    }

    function itemizeShow(target: cc.Node, callback?: Function) {
        target.children.forEach(item => item.opacity = 0)
        
        let i = 0 
        cc.tween(target)
        .delay(.05)
        .set({opacity: 255})
        .repeat(target.children.length, 
                cc.tween()
                .delay(.0)
                .call(() => { cc.tween(target.children[i++]).to(.1, {opacity: 255}).start()}))
        .call(() => callback && callback())
        .start()
    }
}