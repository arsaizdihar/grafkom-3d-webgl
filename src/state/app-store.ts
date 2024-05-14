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
  setFocusedNode: (node: GLNode) => void;
  _rerender: boolean;
  rerenderReact: () => void;
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
  _rerender: false,
  rerenderReact: () => set((state) => ({ _rerender: !state._rerender })),
}));
