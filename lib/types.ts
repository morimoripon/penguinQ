export type Position = { 
  x: number, 
  y: number, 
  z: number 
}

export type threeD = {
  x: number,
  y: number,
  z: number
}

export type LightProps = {
  color?: number, 
  intensity?: number, 
  distance?: number, 
  angle?: number, 
  penumbra?: number, 
  decay?: number, 
  position?: Position, 
  target?: any
}

export type CameraProps = { 
  fov?: number,
  aspect?: number,
  near?: number,
  far?: number,
  position?: Position
}

export type MoveState = {
  front: boolean,
  back: boolean,
  left: boolean,
  right: boolean,
}

export type moveTuple = [number, number];

export type PenguinAction = 'shake' | 'walk';

export type QuestionData = {
  id: number
  question: string,
  answer: 'a' | 'b' | 'c' | 'd',
  a: string,
  b: string,
  c: string,
  d: string
}