import { Scene } from "three";
import { DirectionalLight } from "three";
import { LightProps } from "./types";

type Props = {
  lightParamsArr: LightProps[],
  scene: Scene
}

/* ライトを動かす */
export class LightDriver {
  lightParamsArr: LightProps[];
  scene: Scene;
  lightModels: LightModel[]

  constructor({ lightParamsArr, scene }: Props) {
    this.lightParamsArr = lightParamsArr;
    this.scene = scene;
    this.lightModels = this.makeLights(this.lightParamsArr);
    this.addToScene();
  }

  // 複数のライトを生成
  makeLights = (lightParamsArr: LightProps[]) => {
    if (!Array.isArray(lightParamsArr) || !lightParamsArr.length) {
      return [];
    }
    return lightParamsArr.map((lightParams) => {
      return new LightModel(lightParams);
    });
  }

  // シーンに追加
  addToScene = () => {
    if (!this.scene || !Array.isArray(this.lightModels) || !this.lightModels.length) return;
    this.lightModels.forEach(lightModel => {
      if (!this.scene) return;
      this.scene.add(lightModel.light);
      this.scene.add(lightModel.light.target);
    })
  }
}

/* ライト */
export class LightModel {
  light: DirectionalLight;

  constructor({ color, intensity, distance, angle, penumbra, decay, position, target }: LightProps) {
    this.light = this.makeLight({ color, intensity, distance, angle, penumbra, decay, position, target });
  }

  // ライトを生成
  makeLight = ({ color = 0xFFFFFF, intensity = 3, distance = 1000, angle = Math.PI / 20, penumbra = 0.5, decay = 0.5, position = { x: 0, y: 100, z: -40 }, target }: LightProps) => {
    const light = new DirectionalLight(color, intensity);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    light.shadow.camera.near = 500;
    light.shadow.camera.far = 4000;
    light.position.set(position.x, position.y, position.z);
    light.target = target;
    return light;
  }
}
