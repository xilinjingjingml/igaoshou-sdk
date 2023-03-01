export class IgsBundles {
    static async Preload(name: string, asset: string) {
        let bundle = cc.assetManager.getBundle(name) || await IgsBundles._load(func => cc.assetManager.loadBundle(name, func))
        bundle.preload(asset)
    }

    static async LoadPrefab(name: string, asset: string, callback?: Function) {
        let bundle = cc.assetManager.getBundle(name) || await IgsBundles._load(func => cc.assetManager.loadBundle(name, func))
        let perfab = await IgsBundles._load<cc.Prefab>(func => bundle.load(asset, cc.Prefab, func))
        callback?.(perfab)
    }

    private static _load<T>(callback: (onComplete: (err: Error, asset: T) => void) => void) {
        return new Promise<T>((resolve, reject) => callback((err: Error, asset: T) => {
            if (err) {
                return reject(err)
            }

            resolve(asset)
        }))
    }
}