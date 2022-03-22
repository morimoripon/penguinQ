import { PerspectiveCamera } from "three";
import { LightDriver } from "./light";
import { ModelDriver } from "./model";
import { CameraProps } from "./types";

type Props = {
  cameraParams: CameraProps,
  lightDriver: any,
  targetDriver?: any
};

/* カメラを動かす */
export class CameraDriver {
  model: CameraModel;
  lightDriver: any;
  targetDriver: any;
  animationComplete: boolean;

  constructor({ cameraParams, lightDriver, targetDriver }: Props) {
    this.model = new CameraModel(cameraParams);
    this.lightDriver = lightDriver;
    this.targetDriver = targetDriver;
    this.animationComplete = false;
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
