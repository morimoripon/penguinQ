import { WebGLRenderer, Color, Scene, SkeletonHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FC, useEffect, useRef, useState } from 'react';
import { ModelDriver } from '../lib/model';
import { LightDriver } from '../lib/light';
import { LightProps, MoveState } from '../lib/types';
import { CameraDriver } from '../lib/camera';
import { PlaneDriver, PlaneModel } from '../lib/plane';
import { CubeDriver, CubeModel } from '../lib/cube';
import Router from 'next/router';
import fontJson from '../public/fonts/GenEi_Antique_Pv5_Regular.typeface.json';
import { TextDriver, TextModel } from '../lib/text';
import { ModelController } from '../lib/modelController';
import { CameraController } from '../lib/cameraController';

type Props = { 
  pages: {
    a: string,
    b: string,
    c: string,
    d: string
  },
  answer: {
    a: string,
    b: string,
    c: string,
    d: string
  }
}

export const Model: FC<Props> = ({ pages, answer }: Props) => {
  const [ penguinModel, setPenguinModel ] = useState<GLTF | null>(null);
  const refCanvas = useRef<HTMLDivElement>(null);

  const renderThree = () => {
    // レンダラーをリサイズする
    const resizeRenderer = (renderer: any) => {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(window.devicePixelRatio);
      }
      return needResize;
    }
    /* 基礎部分の生成 */
    const { innerWidth, innerHeight } = window;
    // レンダラーを生成
    const renderer = new WebGLRenderer();
    // レンダラーのサイズを設定
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    if (!refCanvas.current || !penguinModel) return;
    
    const canvas = refCanvas.current;
    canvas.appendChild(renderer.domElement);
    // シーンを生成
    const scene = new Scene();
    scene.background = new Color(0xddffff);

    // 床（海）生成
    const planeDriver = new PlaneDriver({ scene, planeParams: { color: 0x1976d2 } });

    // 直方体生成
    const cubeParamsArr = [
      { size: { x: 100, y: 10, z: 100 }, position: { x: 0, y: -7.9, z: 0 }, rotation: { x: 0, y: Math.PI * -.25, z: 0 } },
      { onIntersects: () => { Router.push(pages.a); }, position: { x: 60, y: 0, z: 0 }, color: 0xffaaaa },
      { onIntersects: () => { Router.push(pages.b); }, position: { x: -60, y: 0, z: 0 }, color: 0xaaffaa },
      { onIntersects: () => { Router.push(pages.c); }, position: { x: 0, y: 0, z: 60 }, color: 0xaaaaff },
      { onIntersects: () => { Router.push(pages.d); }, position: { x: 0, y: 0, z: -60 }, color: 0xffffaa }
    ];
    const cubeDriver = new CubeDriver({ scene, cubeParamsArr });
    const [ cube, linkCube1, linkCube2, linkCube3, linkCube4 ] = cubeDriver.models;

    // ペンギン生成
    const modelDriver = new ModelDriver({ scene, model: penguinModel });
    const modelController = new ModelController(modelDriver);
    modelController.init();

    // 文字列を生成
    const textParamsArr = [
      { text: answer.a, position: { x: 60, y: 10, z: 0 }, rotateY: -(Math.PI / 2), fontJson, backgroundColor: 0xffaaaa },
      { text: answer.b, position: { x: -60, y: 10, z: 0 }, rotateY: Math.PI / 2, fontJson, backgroundColor: 0xaaffaa },
      { text: answer.c, position: { x: 0, y: 10, z: 60 }, rotateY: Math.PI, fontJson, backgroundColor: 0xaaaaff },
      { text: answer.d, position: { x: 0, y: 10, z: -60 }, fontJson, backgroundColor: 0xffffaa },
    ];
    const textDriver = new TextDriver({ scene, textParamsArr });

    // ライトを生成
    const lightParamsArr: LightProps[] = [
      { color: 0xFFFFFF, position: { x: 0, y: 40, z: 200 }, target: cube.mesh },
      { color: 0xFFFFFF, position: { x: 0, y: -40, z: -200 }, target: cube.mesh },
    ];
    const lightDriver = new LightDriver({ scene, lightParamsArr });

    // カメラを生成
    const cameraDriver = new CameraDriver({ 
      cameraParams: { fov: 45, aspect: 2, near: 0.1, far: 500, position: { x: 0, y: 5, z: 20 } }, 
      lightDriver, // ライトのインスタンス
      targetDriver: modelDriver.model.scene, // ライトを当てる対象のインスタンス
    });

    const controls = new CameraController(cameraDriver, modelDriver, canvas);

    let count = 0;

    // 約毎フレームごとに動く
    const render = () => {
      if (resizeRenderer(renderer)) {
        const canvas = renderer.domElement;
        cameraDriver.rerender(canvas.clientWidth, canvas.clientHeight);
      }

      count++;

      // 60フレーム（約1秒）に一回
      if (count > 60) {
        linkCube1.watchIntersects(modelDriver.model.scene.position)
        linkCube2.watchIntersects(modelDriver.model.scene.position)
        linkCube3.watchIntersects(modelDriver.model.scene.position)
        linkCube4.watchIntersects(modelDriver.model.scene.position)
        count = 0;
      }

      modelDriver.mixerUpdate();

      const rotY = (cameraDriver.model.camera.quaternion.y > 0 && cameraDriver.model.camera.quaternion.x > 0) ? -cameraDriver.model.camera.quaternion.y : cameraDriver.model.camera.quaternion.y;
      const [ moveX, moveZ ] = modelDriver.move(rotY);

      cameraDriver.model.camera.position.set(cameraDriver.model.camera.position.x + moveX, cameraDriver.model.camera.position.y, cameraDriver.model.camera.position.z + moveZ)
      controls.update();
  
      renderer.render(scene, cameraDriver.model.camera);
  
      // 次のアニメーションをリクエスト
      requestAnimationFrame(render);
    }
    // 次のアニメーションをリクエスト
    requestAnimationFrame(render);
  }

  useEffect(() => {
    const modelLoader = new GLTFLoader();
    modelLoader.load('/gltf/penguin.glb', (gltf: GLTF) => {
      console.log(gltf);
      setPenguinModel(gltf);
    }, undefined, (error) => {
      console.log(error);
      console.error('3Dオブジェクトをシーンに追加できませんでした', error);
    });
  }, []);

  useEffect(() => {
    if (!penguinModel) return;
    renderThree();
  }, [penguinModel])

  return <div ref={refCanvas}></div>;
}
