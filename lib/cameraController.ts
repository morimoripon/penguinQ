import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CameraDriver } from "./camera";
import { ModelDriver } from "./model";

/* モデルを操作する */
export class CameraController {
  controls: OrbitControls;

  constructor(cameraDriver: CameraDriver, modelDriver: ModelDriver, canvas: any) {
    this.controls = new OrbitControls(cameraDriver.model.camera, canvas);
    // 滑らかにカメラコントローラーを制御する
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.2;
    this.controls.target = modelDriver.model.scene.position;
    this.update();
  }

  update = () => {
    this.controls.update();
  }
}
