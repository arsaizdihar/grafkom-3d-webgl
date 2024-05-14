import { z } from "zod";
import { GLNode } from "./node";

export const AnimationTRSSchema = z.object({
  translation: z.array(z.number()).length(3).optional(),
  rotation: z.array(z.number()).length(3).optional(),
  scale: z.array(z.number()).length(3).optional(),
});

export type AnimationTRS = z.infer<typeof AnimationTRSSchema>;

export type AnimationPath = {
  keyframe?: AnimationTRS;
  children?: {
    [childName: string]: AnimationPath;
  };
};

export const AnimationPathSchema: z.ZodType<AnimationPath> = z.object({
  keyframe: AnimationTRSSchema.optional(),
  children: z.lazy(() => z.record(AnimationPathSchema)).optional(),
});

export const AnimationClipSchema = z.object({
  name: z.string(),
  frames: z.array(AnimationPathSchema),
});

export type AnimationClip = z.infer<typeof AnimationClipSchema>;

export class AnimationRunner {
  isPlaying: boolean = true;
  fps: number = 30;
  private root: GLNode;
  private currentFrame: number = 0;
  private deltaFrame: number = 0;
  private currentAnimation: AnimationClip;

  constructor(animClip: AnimationClip, root: GLNode, { fps = 30 } = {}) {
    this.currentAnimation = animClip;
    this.fps = fps;
    this.root = root;
  }

  get CurrentFrame() {
    return this.currentFrame;
  }

  get length() {
    return this.currentAnimation.frames.length;
  }

  private get frame() {
    return this.currentAnimation.frames[this.currentFrame];
  }

  update(deltaSecond: number) {
    if (this.isPlaying) {
      this.deltaFrame += deltaSecond * this.fps;
      if (this.deltaFrame >= 1) {
        // 1 frame
        this.currentFrame =
          (this.currentFrame + Math.floor(this.deltaFrame)) % this.length;
        this.deltaFrame = this.deltaFrame % 1;
        this.updateSceneGraph();
      }
    }
  }

  updateSceneGraph(frame = this.frame, node: GLNode = this.root) {
    // Update scene graph with current frame
    this.updateNode(node, frame);
    if (frame.children) {
      for (const childName in frame.children) {
        const child = this.root.children.find(
          (node) => node.name === childName
        );
        if (child) {
          this.updateSceneGraph(frame.children[childName], child);
        }
      }
    }
  }

  updateNode(node: GLNode, frame: AnimationPath) {
    if (!frame.keyframe) {
      return;
    }
    const { translation, rotation, scale } = frame.keyframe;
    if (translation) {
      node.transform.position.set(
        translation[0],
        translation[1],
        translation[2]
      );
      node.dirty();
    }

    if (rotation) {
      node.transform.rotation.set(rotation[0], rotation[1], rotation[2]);
      node.dirty();
    }

    if (scale) {
      node.transform.scale.set(scale[0], scale[1], scale[2]);
      node.dirty();
    }
  }

  getFrameAt(frame: number) {
    return this.currentAnimation.frames[frame % this.length];
  }
}
