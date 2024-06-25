import { _decorator, Color, Component, ImageAsset, Label, Node, Sprite, SpriteFrame, Texture2D } from 'cc';
import { BaseItemCell } from './BaseItemCell';
import { GlobalData, UserGameData } from './GlobalData';
import { AssetMgr } from './AssetMgr';
const { ccclass, property } = _decorator;

@ccclass('RankCell')
export class RankCell extends BaseItemCell {
    @property(Label)
    public lb_rank: Label;
    @property(Label)
    public lb_name: Label;
    @property(Label)
    public lb_score: Label;
    @property(Sprite)
    public headIcon: Sprite;
    start() {

    }

    update(deltaTime: number) {

    }
    public set data(item: UserGameData) {
        if (item.openid == GlobalData.myGameInfo.openid) {
            this.lb_rank.color = this.lb_name.color = this.lb_score.color = Color.YELLOW;
        } else {
            this.lb_rank.color = this.lb_name.color = this.lb_score.color = Color.WHITE;
        }
        this.lb_name.string = item.nickName;
        this.lb_score.string = item.score + "";
        this.lb_rank.string = (this.idx + 1) + ""
        AssetMgr.instance.getRemoteResByUrl(item.headUrl, ImageAsset,'.png').then(data => {

            this.headIcon.spriteFrame = SpriteFrame.createWithImage(data);
        })
    }
}


