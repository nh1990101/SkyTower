import { _decorator, Component, Node } from 'cc';
import { ItemBaseInterface } from './List';
const { ccclass, property } = _decorator;

@ccclass('BaseItemCell')
export class BaseItemCell extends Component implements ItemBaseInterface {
    protected m_data: any;
    protected isSelected: boolean
    public idx:number;
    start() {

    }

    update(deltaTime: number) {

    }
    public set data(data: any) {
        this.m_data = data;
    }
    public get data(): any {
        return this.m_data;
    }
    public set selected(val: boolean) {
        this.isSelected = val;
    }
    public get selected(): boolean {
        return this.isSelected;
    }
}


