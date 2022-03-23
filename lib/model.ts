import { AnimationAction, AnimationClip, AnimationMixer, Clock, Scene, Vector3 } from "three";
import { MoveState, moveArr, PenguinAction } from "./types";

type Props = {
  scene: Scene,
  model: any;
}

/* モデルを動かす */
export class ModelDriver {
  scene: Scene;
  model: any;
  mixer: AnimationMixer | null;
  clips: AnimationClip[] | null;
  actions: AnimationAction[] | null;
  clock: Clock;
  moveState: MoveState;
  moveSpeed: number;
  currentAnimation: PenguinAction;

  constructor({ scene, model }: Props) {
    this.scene = scene;
    this.model = model;
    this.mixer = null;
    this.clips = null;
    this.actions = null;
    this.currentAnimation = 'shake';
    this.clock = new Clock();
    this.moveState = { front: false, back: false, left: false, right: false };
    this.moveSpeed = 1 / 10;
    this.animate();
    this.addToScene();
  }

  move = (cameraRotation: number): moveArr => {
    const prevPosition = { ...this.model.scene.position };

    const camRot = cameraRotation * Math.PI;

    const moves = []; 
    if (this.moveState.front) moves.push(this.getFrontMove(camRot));
    if (this.moveState.back) moves.push(this.getBackMove(camRot));
    if (this.moveState.left) moves.push(this.getLeftMove(camRot));
    if (this.moveState.right) moves.push(this.getRightMove(camRot));

    const moveReducer = (acc: moveArr, [ x, z ]: moveArr) => {
      acc[0] += x;
      acc[1] += z;
      return acc;
    }

    const [ moveX, moveZ ] = moves.reduce(moveReducer, [ 0, 0 ]);
    const { position, rotation } = this.model.scene;
    this.model.scene.position.set(position.x + moveX, position.y, position.z + moveZ);    

    if (moves.length) {
      this.switchAnimation('walk');
    } else {
      this.switchAnimation('shake');
    }

    const rad = this.getDirection(position, prevPosition);
    if (rad || rad === 0) {
      this.model.scene.rotation.set(rotation.x, rad, rotation.z);
    }

    return [ moveX, moveZ ];
  }

  getFrontMove = (cameraRotation: number, position: Vector3 = this.model.scene.position): moveArr => {
    return [ -(this.moveSpeed * Math.sin(cameraRotation)), -(this.moveSpeed * Math.cos(cameraRotation)) ];
  }

  getBackMove = (cameraRotation: number, position: Vector3 = this.model.scene.position): moveArr => {
    return [ (this.moveSpeed * Math.sin(cameraRotation)), (this.moveSpeed * Math.cos(cameraRotation)) ];
  }

  getLeftMove = (cameraRotation: number, position: Vector3 = this.model.scene.position): moveArr => {
    return [ -(this.moveSpeed * Math.cos(cameraRotation)), (this.moveSpeed * Math.sin(cameraRotation)) ];
  }

  getRightMove = (cameraRotation: number, position: Vector3 = this.model.scene.position): moveArr => {
    return [  (this.moveSpeed * Math.cos(cameraRotation)), -(this.moveSpeed * Math.sin(cameraRotation)) ];
  }

  getDirection = (targetPos: Vector3, sourcePos: Vector3) => {
    const xRot = targetPos.x - sourcePos.x;
    const zRot = targetPos.z - sourcePos.z;
    if (xRot === 0 && zRot === 0) return;
    const rad = Math.atan2(xRot, zRot); // 東向きが０度の方向
    if (isNaN(rad) || !isFinite(rad)) return;
    return rad;
  }

  mixerUpdate = () => {
    if (this.mixer) {
      this.mixer.update(this.clock.getDelta());
    }
  }

  switchAnimation = (animationName: PenguinAction) => {
    if (animationName === this.currentAnimation) return;
    this.currentAnimation = animationName;
    this.playAnimationClip(this.currentAnimation);
  }

  playAnimationClip = (animationName: PenguinAction) => {
    if (!this.clips || !this.mixer) return;

    const shakeClip = AnimationClip.findByName(this.clips, 'shake');
    const walkClip = AnimationClip.findByName(this.clips, 'walk');
    const shakeAction = this.mixer.existingAction(shakeClip);
    const walkAction = this.mixer.existingAction(walkClip);
    if (!shakeAction || !walkAction) return;
    if (animationName === 'walk') {
      shakeAction.setEffectiveWeight(0);
      walkAction.setEffectiveWeight(1);
    } else {
      shakeAction.setEffectiveWeight(1);
      walkAction.setEffectiveWeight(0);
    }
  }

  initAnimationClip = () => {
    if (!this.clips || !this.mixer) return;
    this.clips.forEach((clip: AnimationClip) => {
      if (!this.mixer) return;
      const action = this.mixer.clipAction(clip);
      action.reset().play().fadeIn(0.5);
    })
  }

  animate = () => {
    this.mixer = new AnimationMixer(this.model.scene);
    this.clips = this.model.animations;

    this.initAnimationClip();

    this.playAnimationClip(this.currentAnimation);
  }

  // シーンに追加
  addToScene = () => {
    if (!this.scene || !this.model) return;
    this.scene.add(this.model.scene);
  }
}
