import { _decorator, Component, MeshRenderer, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CraneLod')
export class CraneLod extends Component {
    @property(Node)
    public cube: Node;
    start() {

    }

    update(deltaTime: number) {

    }
    public lodShow() {
        this.cube.active = true;
        this.getComponent(MeshRenderer).enabled = false;
        this.enabled=false;
    }
}


