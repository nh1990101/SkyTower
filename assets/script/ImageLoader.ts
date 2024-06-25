import { _decorator, Component, ImageAsset, Node, Sprite, SpriteFrame } from 'cc';
import { AssetMgr, BUNDLE_NAME, BUNDLE_NAMES } from './AssetMgr';
const { ccclass, property } = _decorator;

@ccclass('ImageLoader')
export class ImageLoader extends Sprite {
    start() {

    }

    update(deltaTime: number) {

    }
    /**异步加载图片 */
    public load(url: string, bundleName: BUNDLE_NAME<typeof BUNDLE_NAMES[number]>) {
        AssetMgr.instance.getRes(url, ImageAsset, bundleName).then((data) => {

            this.spriteFrame = SpriteFrame.createWithImage(data);
        })
    }
}


