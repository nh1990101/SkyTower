
export const BUNDLE_NAMES = ["components", "loading"] as const
export type BUNDLE_NAME<S extends string> = S

import { _decorator, Asset, assetManager, AssetManager, Component, director, ImageAsset, instantiate, Node, Prefab, Vec3 } from 'cc';
import { Plat, Platform } from './Platform';
import { GameConfig, GameRes } from './GameConfig';
import { GlobalData } from './GlobalData';
const { ccclass, property } = _decorator;
@ccclass('AssetMgr')
export class AssetMgr {
    private static _ins: AssetMgr
    public RES_CONFIG: GameRes;
    public static get instance(): AssetMgr {
        if (!this._ins) {
            this._ins = new AssetMgr;
        }
        return this._ins
    }
    public init(plat: number) {
        assetManager.downloader.maxConcurrency = 1000
        assetManager.downloader.maxRequestsPerFrame = 1000
        var itemRes = GameConfig.gameSeting[plat]
        if (itemRes) {
            if (plat != Plat.LOCAL) {
                if (itemRes.version > GlobalData.version) {//当前代码版本小于最新版本时，默认审核服
                    itemRes.resUrl = itemRes.lastResUrl;
                    itemRes.resUrl += itemRes.version + "/remote/"//资源地址+最新版本号目录
                } else {
                    itemRes.resUrl += GlobalData.version + "/remote/"//资源地址+当前版本号目录
                }
                console.log("获取到的版本为：" + itemRes.version + "本地版本号：" + GlobalData.version + "当前资源路径：" + itemRes.resUrl)
            }
            this.RES_CONFIG = itemRes
        }
    }
    public mapBundleAssets = new Map<string, AssetManager.Bundle>();
    // public resUrl = "https://kongdahongproject.oss-cn-hangzhou.aliyuncs.com/tower/wx/remote/"//"http://192.168.233.107/res/wx/remote/"
    /**预加载资源 */
    public preLoadBundles() {
        var arrPromise = []
        var len = BUNDLE_NAMES.length;
        for (let i = 0; i < len; i++) {

            arrPromise.push(this.loadBundles(BUNDLE_NAMES[i]));

        }
        return Promise.all(arrPromise)
    }
    public loadBundles(bundleName: BUNDLE_NAME<typeof BUNDLE_NAMES[number]>): Promise<AssetManager.Bundle> {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(this.getUrl() + bundleName, (err, data) => {
                if (err) {
                    console.error("bundle加载失败：" + err.message);
                    reject(err);
                } else {
                    this.mapBundleAssets.set(data.name, data)
                    resolve(data);
                }
            });
        })
    }
    public getRes<T extends Asset>(name: string, cls: new () => T, bundleName?: BUNDLE_NAME<typeof BUNDLE_NAMES[number]>) {
        if (!bundleName) {
            bundleName = BUNDLE_NAMES[0]
        }
        if (bundleName) {
            let bundle = this.mapBundleAssets.get(bundleName)
            if (bundle) {
                return this.getResByBundle(name, cls, bundle)
            } else {
                this.loadBundles(bundleName).then(data => {
                    return this.getResByBundle(name, cls, data)
                })
            }
        }
    }
    public getResByBundle<T extends Asset>(name: string, cls: new () => T, bundle: AssetManager.Bundle): Promise<T> {
        if (bundle) {
            return new Promise<T>((resolve, reject) => {
                bundle.load(name, cls, null, (err, data) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(data);
                    }
                })
            })
        }

    }
    public createPrefab(name: string, bundleName: BUNDLE_NAME<typeof BUNDLE_NAMES[number]>, pos: Vec3, parent: Node) {
        return new Promise((resolve, reject) => {
            this.getRes(name, Prefab, bundleName).then(data => {
                if (data) {
                    var obj = this.instantiate(data);
                    if (obj) {
                        obj.setWorldPosition(pos);
                        obj.setParent(parent, true);
                        resolve(obj);
                    } else {
                        reject("Failed to instantiate prefab.");
                    }
                } else {
                    reject("Failed to load prefab data.");
                }
            }).catch(error => {
                reject(error);
            });
        });
    }
    public instantiate(data: Prefab) {
        return instantiate(data);
    }
    public removeInstant(node: Node) {
        if (node) {
            return node.destroy()
        }
    }
    public getUrl(): string {

        return this.RES_CONFIG.resUrl;
    }
    public getRemoteResByUrl<T extends Asset>(remoteUrl: string, cls: new () => T, ext: string) {

        return new Promise<T>((resolve, reject) => {
            assetManager.loadRemote<T>(remoteUrl, { ext: ext }, function (err, imageAsset) {

                resolve(imageAsset)
                // ...
            });
        })
    }
    /**清空所有缓存 */
    public clearCache() {
        if (assetManager.cacheManager) {
            assetManager.cacheManager.clearCache()
        }
    }

}
