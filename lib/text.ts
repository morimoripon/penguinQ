import { MeshBasicMaterial, Mesh, Scene, Material } from "three";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Position, TextProps } from "./types";

type Props = {
  textParamsArr: TextProps[],
  scene: Scene
}

/* 直方体を管理する */
export class TextDriver {
  textParamsArr: TextProps[];
  scene: Scene;
  models: TextModel[]

  constructor({ textParamsArr, scene }: Props) {
    this.textParamsArr = textParamsArr;
    this.scene = scene;
    this.models = this.makeCubes(this.textParamsArr);
    this.addToScene();
  }

  // 複数のライトを生成
  makeCubes = (textParamsArr: TextProps[]) => {
    if (!Array.isArray(textParamsArr) || !textParamsArr.length) {
      return [];
    }
    return textParamsArr.map((lightParams) => {
      return new TextModel(lightParams);
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

export class TextModel {
  position: Position;
  rotateY?: number;
  geometry: TextGeometry;
  materials: Material[];
  mesh: Mesh;

  constructor({ text, fontJson, position = { x: 0, y: 0, z: 0 }, textColor, backgroundColor, rotateY }: TextProps) {
    const loader = new FontLoader();
    // フォントをロードする
    const font = loader.parse(fontJson);

    this.position = position;
    this.rotateY = rotateY;
    this.geometry = this.makeGeometry(text, font);
    this.materials = this.makeMaterials(textColor, backgroundColor);
    this.mesh = this.makeMesh(this.geometry, this.materials);
    this.align();
    this.setPosition(this.position.x, this.position.y, this.position.z);
    this.setRotate(this.rotateY)
  }

  // 配置を直す
  align = () => {
    if (!this.geometry || !this.mesh) return;
    this.geometry.center();
  }

  setPosition = (positionX: number, positionY: number = 0, positionZ: number = 0) => {
    if (positionX || positionX === 0) {
      this.mesh.position.setX(positionX);
    }
    this.mesh.position.setY(positionY);
    this.mesh.position.setZ(positionZ);
  }

  setRotate = (rotateY?: number) => {
    if (!rotateY) return;
    this.mesh.rotateY(rotateY);
  }

  // 文字列メッシュを作成して返す
  makeMesh = (geometry: TextGeometry, materials: Material[]) => {
    // ジオメトリとマテリアルを渡してメッシュを生成。これをシーンに追加することで画面に表示できる。
    return new Mesh(geometry, materials);
  }

  // 文字自体に関するオブジェクトを作成して返す
  makeGeometry = (text: string, font: any) => {
    // font: json形式のfont
    // size: サイズ
    // height: 高さ
    // curveSegments: 曲線上のポイントの数。数値が高いと文字オブジェクトが丸くなる
    // bevelxxxxx: bevelは傾斜とか斜角という意味だが、ここら辺は見ながら設定
    return new TextGeometry(text, {
      font: font,
      size: 3,
      height: 3,
      curveSegments: 1,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 1
    });
  }

  // 材質のオブジェクトを作成して返す
  makeMaterials = (textColor = 0x222222, backgroundColor = 0xeeeeee) => {
    // [ 文字の材質, 文字まわり（背景）の材質 ]
    // MeshPhongMaterial: 光沢のある材質, MeshLambertMaterial: マットな材質, MeshStandardMaterial: 中間くらいの材質
    // color: 色
    return [
      new MeshBasicMaterial({ color: textColor }),
      new MeshBasicMaterial({ color: backgroundColor }),
    ];
  }
}
