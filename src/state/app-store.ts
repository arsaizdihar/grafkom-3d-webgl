import { AnimationRunner } from "@/lib/engine/animation";
import { Application } from "@/lib/engine/application";
import { Camera } from "@/lib/engine/camera";
import { GLNode } from "@/lib/engine/node";
import { Scene } from "@/lib/engine/scene";
import { degToRad } from "@/lib/math/math-utils";
import { create } from "zustand";

type CameraParams = {
  fovy: number;
  aspect: number;
  near: number;
  far: number;
  left: number;
  right: number;
  bottom: number;
  top: number;
  theta: number;
  phi: number;
  cameraAngleDegreeY: number;
  cameraAngleDegreeX: number;
  zPos: number;
};

type AppStore = {
  app: Application | null;
  setApp: (app: Application) => void;
  scene: Scene | null;
  setScene: (scene: Scene | ((scene: Scene | null) => Scene)) => void;
  currentCamera: Camera | null;
  setCurrentCamera: (camera: Camera) => void;
  focusedNode: GLNode | null;
  setFocusedNode: (node: GLNode | null) => void;
  _rerenderSceneGraph: boolean;
  rerenderSceneGraph: () => void;
  animations: AnimationRunner[];
  setAnimations: (
    animations:
      | AnimationRunner[]
      | ((prevAnimations: AnimationRunner[]) => AnimationRunner[])
  ) => void;
  cameraParams: CameraParams;
  setCameraParams: (
    params: CameraParams | ((prevParams: CameraParams) => CameraParams)
  ) => void;
  animationEdit: AnimationRunner | null;
  setAnimationEdit: (animation: AnimationRunner | null) => void;
};

export const useApp = create<AppStore>()((set) => ({
  app: null,
  setApp: (app) => set({ app }),
  scene: null,
  setScene: (arg) =>
    set(({ scene }) => {
      if (typeof arg === "function") {
        return { scene: arg(scene) };
      }
      return { scene: arg };
    }),
  currentCamera: null,
  setCurrentCamera: (camera) => set({ currentCamera: camera }),
  focusedNode: null,
  setFocusedNode: (node) => set({ focusedNode: node }),
  _rerenderSceneGraph: false,
  rerenderSceneGraph: () =>
    set((state) => ({ _rerenderSceneGraph: !state._rerenderSceneGraph })),
  animations: [],
  setAnimations: (arg) =>
    set(({ animations }) => {
      if (typeof arg === "function") {
        return { animations: arg(animations) };
      }
      return { animations: arg };
    }),
  cameraParams: {
    fovy: 60,
    aspect: 0,
    near: -100,
    far: 2000,
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    theta: degToRad(75),
    phi: degToRad(75),
    cameraAngleDegreeY: 0,
    cameraAngleDegreeX: 0,
    zPos: 1,
  },
  setCameraParams: (params) => {
    set(({ cameraParams }) => {
      if (typeof params === "function") {
        return { cameraParams: params(cameraParams) };
      }
      return { cameraParams: params };
    });
  },
  animationEdit: null,
  setAnimationEdit: (animation) => set({ animationEdit: animation }),
}));
