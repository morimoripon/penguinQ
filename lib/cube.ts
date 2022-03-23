import { BoxGeometry, DoubleSide, Material, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshStandardMaterial, PlaneGeometry, Scene, Vector3 } from "three";
import { CubeProps, threeD } from "./types";

type Props = {
  cubeParamsArr: CubeProps[],
  scene: Scene
}

/* 直方体を管理する */
export class CubeDriver {
  cubeParamsArr: CubeProps[];
  scene: Scene;
  models: CubeModel[]

  constructor({ cubeParamsArr, scene }: Props) {
    this.cubeParamsArr = cubeParamsArr;
    this.scene = scene;
    this.models = this.makeCubes(this.cubeParamsArr);
    this.addToScene();
  }

  // 複数のライトを生成
  makeCubes = (cubeParamsArr: CubeProps[]) => {
    if (!Array.isArray(cubeParamsArr) || !cubeParamsArr.length) {
      return [];
    }
    return cubeParamsArr.map((lightParams) => {
      return new CubeModel(lightParams);
    });
  }

  // シーンに追加
  addToScene = () => {
    if (!this.scene || !Array.isArray(this.models) || !this.models.length) return;
    this.models.forEach(model => {
      if (!this.scene) return;
      this.scene.add(model.mesh);
    })
  }
}

/* 直方体 */
export class CubeModel {
  size: threeD;
  geometry: PlaneGeometry;
  material: Material;
  mesh: Mesh;
  onIntersects: Function; 
  doneIntersectsEvent: boolean;

  constructor({ size = { x: 10, y: 10, z: 10 }, position = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0  }, color = 0xffffff, onIntersects = () => {} }: CubeProps) {
    this.size = size;
    this.geometry = this.makeGeometry(this.size.x, this.size.y, this.size.z);
    this.material = this.makeMaterial(color);
    this.mesh = this.makeMesh(this.geometry, this.material);
    this.onIntersects = onIntersects;
    this.doneIntersectsEvent = false;
    if (rotation) {
      this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    }
    if (position) {
      this.mesh.position.set(position.x, position.y, position.z);
    }
  }

  watchIntersects = (position: threeD) => {
    if (!this.doneIntersectsEvent && this.isIntersects(position)) {
      console.log('intersects')
      this.onIntersects();
      this.doneIntersectsEvent = true;
    } 
  }

  isIntersects = (position: threeD) => {
    const { x, z } = this.mesh.position;
    const { x: sizeX, z: sizeZ } = this.size;
    const diffX = sizeX / 2;
    const diffZ = sizeZ / 2;
    if (position.x > (x - diffX) && position.x < (x + diffX) && position.z > (z - diffZ) && position.z < (z + diffZ)) {
      return true;
    } else {
      return false;
    }
  }

  // 床メッシュを作成して返す
  makeMesh = (geometry: PlaneGeometry, materials: Material) => {
    return new Mesh(geometry, materials);
  }

  // 床自体に関するオブジェクトを作成して返す
  makeGeometry = (sizeX: number, sizeY: number, sizeZ: number) => {
    return new BoxGeometry(sizeX, sizeY, sizeZ);
  }

  // 材質のオブジェクトを作成して返す
  makeMaterial = (color: number) => {
    return new MeshBasicMaterial({
      color,
      side: DoubleSide,
    });
  }
}
