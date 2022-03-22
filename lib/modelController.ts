import { ModelDriver } from "./model";

/* モデルを操作する */
export class ModelController {
  modelDriver: ModelDriver;

  constructor(modelDriver: ModelDriver) {
    this.modelDriver = modelDriver;
  }

  init = () => {
    document.addEventListener('keydown', e => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        this.modelDriver.moveState.front = true;
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        this.modelDriver.moveState.left = true;
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        this.modelDriver.moveState.back = true;
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        this.modelDriver.moveState.right = true;
      }
      return false;
    });
    document.addEventListener('keyup', e => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        this.modelDriver.moveState.front = false;
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        this.modelDriver.moveState.left = false;
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        this.modelDriver.moveState.back = false;
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        this.modelDriver.moveState.right = false;
      }
      return false;
    });
  }
}
