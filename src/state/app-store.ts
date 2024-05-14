import { AnimationRunner } from "@/lib/engine/animation";
import { Application } from "@/lib/engine/application";
import { Camera } from "@/lib/engine/camera";
import { GLNode } from "@/lib/engine/node";
import { Scene } from "@/lib/engine/scene";
import { create } from "zustand";

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
}));
