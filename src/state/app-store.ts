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
  setScene: (scene: Scene) => void;
  currentCamera: Camera | null;
  setCurrentCamera: (camera: Camera) => void;
  focusedNode: GLNode | null;
  setFocusedNode: (node: GLNode | null) => void;
  _rerenderSceneGraph: boolean;
  rerenderSceneGraph: () => void;
  animations: AnimationRunner[];
  setAnimations: (animations: AnimationRunner[]) => void;
  cameraParams: CameraParams;
  setCameraParams: (
    params: CameraParams | ((prevParams: CameraParams) => CameraParams)
  ) => void;
};

export const useApp = create<AppStore>()((set) => ({
  app: null,
  setApp: (app) => set({ app }),
  scene: null,
  setScene: (scene) => set({ scene }),
  currentCamera: null,
  setCurrentCamera: (camera) => set({ currentCamera: camera }),
  focusedNode: null,
  setFocusedNode: (node) => set({ focusedNode: node }),
  _rerenderSceneGraph: false,
  rerenderSceneGraph: () =>
    set((state) => ({ _rerenderSceneGraph: !state._rerenderSceneGraph })),
  animations: [],
  setAnimations: (animations) => set({ animations }),
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
}));
