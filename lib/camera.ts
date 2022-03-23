import { PerspectiveCamera } from "three";
import { LightDriver } from "./light";
import { ModelDriver } from "./model";
import { CameraProps, Position } from "./types";

type Props = {
  cameraParams: CameraProps,
  lightDriver: LightDriver
};

/* カメラを動かす */
export class CameraDriver {
  model: CameraModel;
  lightDriver: LightDriver;
  animationComplete: boolean;

  constructor({ cameraParams, lightDriver }: Props) {
    this.model = new CameraModel(cameraParams);
    this.lightDriver = lightDriver;
    this.animationComplete = false;
  }

  setPosition = ({ x, y, z }: Position) => {
    this.model.camera.position.set(x, y, z);
  }

  // カメラを再レンダリング
  rerender = (width: number, height: number) => {
    if (!this.model) return;
    this.model.rerender(width, height);
  }
}

/* カメラ */
export class CameraModel {
  camera: PerspectiveCamera;

  constructor({ fov, aspect, near, far, position }: CameraProps) {
    this.camera = this.makeCamera({ fov, aspect, near, far, position });
  }

  // カメラを生成
  makeCamera = ({ fov = 45, aspect = 2, near = 0.1, far = 1000, position = { x: 0, y: 0, z: 0 } }: CameraProps) => {
    // fov: 視野角
    // aspect: アスペクト比
    // near: 設定した近さまでカメラに映る
    // for: 設定した遠さまでカメラに映る
    const camera = new PerspectiveCamera(fov, aspect, near, far);
    // カメラのポジションをセット
    camera.position.set(position.x, position.y, position.z);
    return camera;
  }

  // カメラを再レンダリング
  rerender = (width: number, height: number) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
