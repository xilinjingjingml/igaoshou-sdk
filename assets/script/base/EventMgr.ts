/*
 * @Description: 
 * @Version: 1.0
 * @Autor: sonke
 * @Date: 20210330 1528
 * @LastEditors: sonke
 * @LastEditTime: 20210330 1529
 */

interface IEventData {
    func: Function
    target: any
    once?: boolean
}
interface IEvent {
    [eventName: string]: IEventData[]
}

let _handles: IEvent = {}

export namespace EventMgr {
    export function on(eventName: string, cb: Function, target?: any): IEventData {
        if(!_handles[eventName]) {
            _handles[eventName] = []
        }
        const data: IEventData = {func: cb, target: target}
        _handles[eventName].push(data)
        return data
    }

    export function off(eventName: string, cb: Function | any, target?: any) {
        const list = _handles[eventName]
        if(!list || list.length <= 0) {
            return;
        }
        
        for (let i = 0; i < list.length; i++) {
            const event = list[i]
            if (typeof cb === "function") {
                if(event.func == cb && (!target || target == event.target)) {
                    list.splice(i, 1)
                    // break
                }    
            } else {
                if (event.target === cb) {
                    list.splice(i, 1)
                    // break
                }
            }
        }
    }
    
    export function once(eventName: string, cb: Function, target?: any) {
        if(!_handles[eventName]) {
            _handles[eventName] = []
        }
        const data: IEventData = {func: cb, target: target, once: true}
        _handles[eventName].push(data)
    }

    export function offByTag(target: any) {
        if (!target)
            return

        for (let eventName in _handles) {
            _handles[eventName] = _handles[eventName].filter(item => item.target !== target)
        }
    }

    export function clearTargets() {
        for(let key in _handles) {
            _handles[key] = _handles[key].filter(i => typeof i.target !== "object")
        }
    }

    export function dispatchEvent(eventName: string, ...args:any): boolean {
        if (!eventName)
            return false

        const list = _handles[eventName]
        if(!list || list.length <= 0){
            return false
        }
        
        let len = list.length
        for (let i = 0; i < len; i++) {
            const event = list[i]   
            if (event.target && typeof event.target === "object" && !event.target.isValid) {
                continue
            }

            event.func.apply(event.target, args)
            if (event.once) {
                list[i] = null
            }
        }

        _handles[eventName] = list.filter(i => i != null)

        return true
    }
}