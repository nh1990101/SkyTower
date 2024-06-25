import { _decorator, Node, Camera, Vec3, UITransform, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ModelToUIConverter')
export class ModelToUIConverter {


    static convertModelToUI(modelNode: Node, UINode: Node) {
        // 获取模型的世界坐标
        const worldPosition = modelNode.getWorldPosition();

        // 获取摄像机组件
        const camera = UINode.getComponentInChildren(Camera);

        // 将世界坐标转换为屏幕坐标
        const screenPosition = camera.worldToScreen(worldPosition);

        // 调整Y坐标以匹配UI坐标系
        const canvas = UINode.getComponentInChildren(UITransform);
        const canvasSize = canvas.contentSize;
    
        return screenPosition;
    }
}