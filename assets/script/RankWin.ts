import { _decorator, Component, Label, Node } from 'cc';
import { List } from './List';
import { RankCell } from './RankCell';
import { BaseWin } from './BaseWin';
import { GlobalData, UserGameData } from './GlobalData';
import { Platform } from './Platform';
const { ccclass, property } = _decorator;

@ccclass('RankWin')
export class RankWin extends BaseWin {
    @property(Label)
    public lb_myRank: Label;
    @property(List)
    public list: List;
    @property(Label)
    public lb_none: Label;
    protected myDatas: RankCell[]
    start() {

    }

    update(deltaTime: number) {

    }
    public showWin(data: UserGameData[]): void {
        super.showWin();
        this.lb_myRank.string = "未上榜"
        if (!data || data.length < 1) {
            this.list.node.active = false;
            this.lb_none.node.active = true;
        }
        else {
            this.lb_none.node.active = false;
            this.list.node.active = true;
            this.list.dataProvider = data;
            var len = data.length;
            if (GlobalData.myGameInfo) {
                for (let i = 0; i < len; i++) {
                    var itemData = data[i]
                    if (itemData && itemData.openid == GlobalData.myGameInfo.openid) {
                        this.lb_myRank.string = "" + (i + 1)
                        break;
                    }
                }
            }
        }
    }
    public shareFunc() {
        Platform.share();
    }
}


