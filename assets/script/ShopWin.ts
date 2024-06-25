import { _decorator, Component, director, Node, Prefab } from 'cc';
import { ShopItem } from './ShopItem';
import { List } from './List';
import { GameController } from './GameController';
import { GameConfig, Item } from './GameConfig';
import { BaseWin } from './BaseWin';
import { UImanager } from './UImanager';
import { AdvNoticeWin } from './AdvNoticeWin';
import { GlobalData } from './GlobalData';
import { AudioMgr } from './AudioMgr';
import { AssetMgr } from './AssetMgr';
const { ccclass, property } = _decorator;

@ccclass('ShopWin')
export class ShopWin extends BaseWin {
    @property(List)
    public list: List;
    public ctrMgr: GameController;

    start() {

        this.ctrMgr = director.getScene().getChildByName("GameController").getComponent(GameController);
    }

    update(deltaTime: number) {

    }

    public showWin(data: ShopItem[]) {
        super.showWin(data);
        this.node.active = true;

        this.list.dataProvider = data;
    }

    public buyItem() {
        var selectItem = this.list.selectItem
        var shopItem = selectItem.getComponent(ShopItem)
        if (shopItem) {
            var data: Item = shopItem.data

            if (this.ctrMgr.mainUI.money >= GameConfig.config.getPriceByTimes(data)) {
                this.selectItem(false);
            } else if (AssetMgr.instance.RES_CONFIG.isSupportAdv) {
                UImanager.showWin("AdvNoticeWin", "金币不足", this.selectItem.bind(this, true))
            } else {

                UImanager.showNotice("金币不足")
            }
        }
    }
    selectItem(isAdv: boolean) {
        var selectItem = this.list.selectItem
        var shopItem = selectItem.getComponent(ShopItem)

        if (shopItem) {
            var mainUI = this.ctrMgr.mainUI
            var data: Item = shopItem.data
            switch (data.type) {
                case 1://加生命
                    if (mainUI.maxHp <= mainUI.curHp) {
                        UImanager.showNotice("生命值已达最高")
                        return;
                    }
                    mainUI.addHP(data.num)
                    break;
                case 2://房子升级
                    if (mainUI.towerQuality >= GameConfig.config.maxQuality) {
                        UImanager.showNotice("房子已经是最高级")
                        return;
                    }
                    mainUI.towerQuality += 1;
                    break;
                case 3://加层
                    this.ctrMgr.addFloor(data.num);
                    break;
            }
            if (!isAdv) {
                mainUI.addMoney(-GameConfig.config.getPriceByTimes(data))
            }
            var times = GlobalData.getBuyTimes(data.type)
            GlobalData.setBuyTimes(data.type, times + 1)
            AudioMgr.inst.playRemoteSound("checkpoint", true)
            this.closeWin();
        }
    }

}


