import { PlaneGeometry, MeshPhongMaterial, DoubleSide, Mesh, Material, Scene } from "three";
import { PlaneProps } from "./types";

type Props = {
  planeParams: PlaneProps,
  scene: Scene,
}

/* 床を操作する */
export class PlaneDriver {
  planeParams: PlaneProps;
  scene: Scene;
  model: PlaneModel;

  constructor({ planeParams, scene }: Props) {
    this.planeParams = planeParams;
    this.scene = scene;
    this.model = new PlaneModel(planeParams);
    this.addToScene();
  }

  // シーンに追加
  addToScene = () => {
    if (!this.scene || !this.model) return;
    this.scene.add(this.model.mesh);
  }
}

/* 床 */
export class PlaneModel {
  size: number;
  geometry: PlaneGeometry;
  material: Material;
  mesh: Mesh;

  constructor({ size = 500, color = 0x7777ff }: PlaneProps) {
    this.size = size;
    this.geometry = this.makeGeometry(this.size, this.size);
    this.material = this.makeMaterial(color);
    this.mesh = this.makeMesh(this.geometry, this.material);
    this.mesh.rotation.x = Math.PI * -.5; // 床を回転
    this.mesh.position.y = -5;
  }

  // 床メッシュを作成して返す
  makeMesh = (geometry: PlaneGeometry, materials: Material) => {
    return new Mesh(geometry, materials);
  }

  // 床自体に関するオブジェクトを作成して返す
  makeGeometry = (sizeX: number, sizeY: number) => {
    return new PlaneGeometry(sizeX, sizeY);
  }

  // 材質のオブジェクトを作成して返す
  makeMaterial = (color: number) => {
    return new MeshPhongMaterial({
      color,
      side: DoubleSide,
    });
  }
}