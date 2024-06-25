import { _decorator, CCFloat, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ForwardMove')
export class ForwardMove extends Component {
    @property(CCFloat)
    public speed: number = 0.1;
    start() {

    }

    update(deltaTime: number) {
        this.node.setPosition(this.node.position.add(this.node.forward.multiplyScalar(this.speed)))

    }
}


