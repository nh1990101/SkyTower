import { _decorator, AssetManager, Color, Component, director, ImageAsset, Label, Node, Sprite, SpriteFrame, Texture2D } from 'cc';
import { GameConfig, Item } from './GameConfig';
import { GameController } from './GameController';
import { AssetMgr } from './AssetMgr';
import { BaseItemCell } from './BaseItemCell';
const { ccclass, property } = _decorator;

@ccclass('ShopItem')
export class ShopItem extends BaseItemCell {
    @property(Node)
    public selectImg: Node;
    @property(Label)
    public lb_price: Label;
    @property(Label)
    public lb_name: Label;
    @property(Label)
    public lb_desc: Label;
    @property(Sprite)
    public icon: Sprite;
    private ctrMgr: GameController;
    private assetMgr: AssetMgr;
    start() {
    }

    update(deltaTime: number) {

    }
    public set data(item: Item) {
        if (!this.ctrMgr) {

            this.ctrMgr = director.getScene().getChildByName("GameController").getComponent(GameController);
        }
        if (!this.assetMgr) {

            this.assetMgr = AssetMgr.instance;
        }
        this.m_data = item;
        var price = GameConfig.config.getPriceByTimes(item);
        var color = price <= this.ctrMgr.mainUI.money ? Color.GREEN : Color.RED;
        this.lb_price.color = color;
        this.lb_price.string = price + ""
        this.lb_name.string = item.name;
        this.lb_desc.string = item.desc;
        this.assetMgr.getRes(`UI/common/${item.icon}`, SpriteFrame, "components").then(data => {

            this.icon.spriteFrame = data
        })
    }
    public get data(): Item {
        return this.m_data;
    }
    public set selected(val: boolean) {
        this.selectImg.active = val;
    }
    
}


