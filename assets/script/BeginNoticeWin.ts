import { _decorator, Component, Label, Node, RichText, Sprite } from 'cc';
import { Platform } from './Platform';
import { BaseWin } from './BaseWin';
const { ccclass, property } = _decorator;

@ccclass('BeginNoticeWin')
export class BeginNoticeWin extends BaseWin {
    @property(Label)
    public tittle: Label;
    @property(RichText)
    public rt_content: RichText;
    @property(Sprite)
    public mask: Sprite;
    private _callBack: Function;

    start() {

    }

    update(deltaTime: number) {

    }
    showWin(content: string, callFunc: Function, title: string = "提示") {
        this.node.active = true;

        this.tittle.string = title;
        this.rt_content.string = content;
        this._callBack = callFunc;

    }
    onClickComfirm() {
        Platform.rewardAdv(() => {
            if (this._callBack) {
                this._callBack();
            }
        })
        this.closeWin();

    }
}


