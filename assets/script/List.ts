import { _decorator, CCBoolean, Component, director, EventTouch, Input, Node, Prefab } from 'cc';
import { AssetMgr } from './AssetMgr';
import { BaseItemCell } from './BaseItemCell';
const { ccclass, property } = _decorator;
export interface ItemBaseInterface {
    set data(val: any)
    set selected(val: boolean)
}
@ccclass('List')
export class List extends Component {
    @property(CCBoolean)//默认选中第一个
    public isAutoSelected: boolean = true;
    @property(Prefab)
    public Prefab: Prefab;
    protected myList: Node[]
    protected myDatas: any[];
    public selecedIdx = -1;
    public selectItem: Node;
    private assetMgr: AssetMgr;

    start() {
        // this.myList = []
    }

    update(deltaTime: number) {

    }
    onDisable() {
        this.clearData();
    }
    public set dataProvider(data: any[]) {
        if (this.myDatas == data) {
            return;
        }
        this.myDatas = data;
        if (!data) {
            this.clearData();
        }
        if (!this.assetMgr) {
            this.assetMgr = AssetMgr.instance;

        }
        if (data && data) {
            this.node.active = true;
            var len = data.length;
            if (!this.myList) {
                this.myList = [];
            }
            for (var i = 0; i < len; i++) {
                var cell = this.getCellByIdx(i)
                if (!cell) {
                    cell = this.assetMgr.instantiate(this.Prefab)
                    cell.setParent(this.node)
                    this.myList.push(cell)
                    cell.on(Input.EventType.TOUCH_START, this.onSelected, this)
                }
           
                var itemCell = cell.getComponent(BaseItemCell)
                if (itemCell) {
                    itemCell.idx=i;
                    itemCell.data = data[i]
                }
            }
            if (this.isAutoSelected) {
                this.selecteIdx(0)
            }
        }
    }
    clearData() {
        // this.node.active = false;
        // this.node.removeAllChildren();
        this.selecedIdx = -1;
        this.selectItem = null;
    }
    public getCellByIdx(idx: number): Node {
        return this.myList[idx]
    }
    onSelected(e: EventTouch) {
        var cell = e.currentTarget;
        this.selecteCell(cell)
    }
    selecteIdx(idx: number) {
        var cell = this.getCellByIdx(idx)
        if (cell) {
            this.selecteCell(cell)
        }
    }
    selecteCell(cell: Node) {
        this.selectItem = cell;
        if (!cell) {
            return;
        }
        this.selecedIdx = this.myList.indexOf(cell)
        this.myList.forEach(item => {
            let baseItem = item.getComponent(BaseItemCell)
            if (baseItem) {
                baseItem.selected = false;
            }
        })
        if (cell) {
            var itemCell = cell.getComponent(BaseItemCell)
            if (itemCell) {
                itemCell.selected = true;
            }
        }

    }
}


