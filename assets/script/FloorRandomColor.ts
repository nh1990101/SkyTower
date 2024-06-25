import { _decorator, color, Component, Material, MeshRenderer, Node, random, tween, Tween, Vec4 } from 'cc';
import { AssetMgr } from './AssetMgr';
import { GameConfig } from './GameConfig';
const { ccclass, property } = _decorator;

@ccclass('FloorRandomColor')
export class FloorRandomColor extends Component {
    @property(Material)
    public color01: Material;
    @property(Material)
    public color02: Material;
    @property(Material)
    public color11: Material;
    @property(Material)
    public color12: Material;
    @property(Material)
    public color21: Material;
    @property(Material)
    public color22: Material;
    @property(Material)
    public color31: Material;
    @property(Material)
    public color32: Material;
    @property(Material)
    public color41: Material;
    @property(Material)
    public color42: Material;
    @property(Material)
    public color51: Material;
    @property(Material)
    public color52: Material;
    @property(Node)
    public cube: Node;
    public quality = 1;
    public tw: Tween<Vec4>
    private _to: number
    start() {
        var randomItem = this.quality;
        var color0 = this[`color${randomItem}1`]
        var color1 = this[`color${randomItem}2`]
        var meshRender = this.getComponent(MeshRenderer);
        // var materials = this.getComponent(MeshRenderer).materials;
        meshRender.setMaterialInstance(color0, 0);
        meshRender.setMaterialInstance(color1, 2);
        meshRender.setMaterialInstance(color1, 3);
        // this.scheduleOnce
        // materials[0] = color0;
        // materials[2] = materials[3] = color1;
    }
    public getColorMaterial(): Material {
        return this.getComponent(MeshRenderer).materials[3]
    }
    public lodShow() {
        var meshRender = this.getComponent(MeshRenderer)
        meshRender.enabled = false;
        // var material = meshRender.materials[3]
        this.cube.active = true;
        AssetMgr.instance.getRes(`material/cubeColor${this.quality}`, Material, "components").then(data => {
            this.cube.getComponent(MeshRenderer).setMaterialInstance(data, 0)
            this.enabled = false;
        })

    }
    protected onDestroy(): void {
        if (this._to) {
            clearTimeout(this._to)
        }
    }
    public showOutLight(isShow: boolean, node: Node) {

        var material = this.getComponent(MeshRenderer).materials[3]
        var pass = material.passes[1]
        var ab = pass.getHandle("outlineParams");
        if (ab) {
            if (isShow) {
                if (!this.tw) {
                    this._to = setTimeout(() => {
                        this.showOutLight(false, node)
                    }, GameConfig.config.continuteCountTime * 1000);
                    var params: Vec4 = new Vec4();
                    pass.getUniform(ab, params)
                    this.tw = tween(params).to(0.3, { z: 0.3 }, {
                        onUpdate: (value, ratio) => {

                            pass.setUniform(ab, params);
                        }
                    }).to(0.3, { z: 0 }, {
                        onUpdate: (value, ratio) => {

                            pass.setUniform(ab, params);
                        }
                    }).union().repeatForever().start();
                }
            } else {
                if (this.tw) {
                    this.tw.stop();
                    var params: Vec4 = new Vec4();
                    pass.getUniform(ab, params)
                    params.z = 0;
                    pass.setUniform(ab, params);
                    this.tw = null;

                }
            }
        }

    }
    update(deltaTime: number) {

    }
}


