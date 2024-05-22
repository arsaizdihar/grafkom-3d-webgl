import { z } from "zod";
import { GLTFAnimation } from "../gltf/type";
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
  isPlaying: boolean = false;
  fps: number = 30;
  private root: GLNode;
  private _currentFrame: number = 0;
  private _tweeningFn: TweeningFn = TWEENING_FN.linear;
  private _tween: keyof typeof TWEENING_FN = "linear";
  public deltaFrame: number = 0;
  public currentAnimation: AnimationClip;
  private _onFrameChange: ((frame: number) => void) | null = null;
  public reverse: boolean = false;
  public enableTweening = true;

  constructor(
    animClip: AnimationClip,
    root: GLNode,
    {
      fps = 30,
      tween = "linear",
    }: { fps?: number; tween?: keyof typeof TWEENING_FN } = {}
  ) {
    this.currentAnimation = animClip;
    this.fps = fps;
    this.root = root;
    this.tweening = tween;
  }

  get currentFrame() {
    return this._currentFrame;
  }

  set currentFrame(frame: number) {
    frame = ((frame % this.length) + this.length) % this.length;
    this._currentFrame = frame;
    this._onFrameChange?.(frame);
  }

  get length() {
    return this.currentAnimation.frames.length;
  }

  get name() {
    return this.currentAnimation.name;
  }

  set tweening(tweening: keyof typeof TWEENING_FN) {
    this._tween = tweening;
    this._tweeningFn = TWEENING_FN[tweening];
  }

  get tweening() {
    return this._tween;
  }

  get rootNode() {
    return this.root;
  }

  set onFrameChange(cb: ((frame: number) => void) | null) {
    this._onFrameChange = cb;
  }

  private get frame() {
    return this.currentAnimation.frames[this._currentFrame];
  }

  nextFrame() {
    this.currentFrame += 1;
    this.updateSceneGraph();
  }

  prevFrame() {
    this.currentFrame -= 1;
    this.updateSceneGraph();
  }

  lastFrame() {
    this.currentFrame = this.length - 1;
    this.updateSceneGraph();
  }

  firstFrame() {
    this.currentFrame = 0;
    this.updateSceneGraph();
  }

  getFrameNumberDelta(delta: number) {
    return (
      (((this.currentFrame + delta) % this.length) + this.length) % this.length
    );
  }

  update(deltaSecond: number) {
    if (this.isPlaying) {
      this.deltaFrame += deltaSecond * this.fps;
      const beforeFrame = this.currentFrame;
      const multiplier = this.reverse ? -1 : 1;
      if (this.deltaFrame >= 1) {
        // 1 frame
        this.currentFrame =
          this.currentFrame + Math.floor(this.deltaFrame) * multiplier;
        if (!this.enableTweening) {
          this.updateSceneGraph();
        }
        this.deltaFrame = this.deltaFrame % 1;
      }
      if (!this.enableTweening) {
        return;
      }
      if (this.deltaFrame === 0 && beforeFrame === this.currentFrame) {
        return;
      }
      // tweening to start
      if (
        !this.reverse &&
        this.currentFrame === this.currentAnimation.frames.length - 1
      ) {
        this.currentFrame = 0;
      }
      if (this.reverse && this.currentFrame === 0) {
        this.currentFrame = this.currentAnimation.frames.length - 1;
      }
      this.updateSceneGraphTweening(
        this.currentFrame,
        this.deltaFrame,
        this.root
      );
    }
  }

  updateSceneGraphTweening(
    frameNumber: number,
    delta: number,
    node: GLNode = this.root,
    names: string[] = []
  ) {
    let prevFrame: AnimationPath | undefined =
      this.currentAnimation.frames[frameNumber];
    let frame: AnimationPath | undefined =
      this.currentAnimation.frames[
        this.getFrameNumberDelta(this.reverse ? -1 : 1)
      ];
    names.forEach((name) => {
      frame = frame?.children?.[name];
      prevFrame = prevFrame?.children?.[name];
    });

    if (frame?.keyframe && prevFrame?.keyframe) {
      const tweeningFn = this._tweeningFn;
      const resFrame = tweenFrame(
        prevFrame.keyframe,
        frame.keyframe,
        delta,
        tweeningFn
      );
      this.updateNode(node, resFrame);
    } else if (frame?.keyframe) {
      this.updateNode(node, frame.keyframe);
    }

    if (frame?.children) {
      for (const childName in frame.children) {
        const child = node.children.find((node) => node.name === childName);
        if (child) {
          names.push(childName);
          this.updateSceneGraphTweening(frameNumber, delta, child, names);
          names.pop();
        }
      }
    }
  }

  updateSceneGraph(frame = this.frame, node: GLNode = this.root) {
    if (!frame) {
      return;
    }
    // Update scene graph with current frame
    this.updateNode(node, frame.keyframe);
    if (frame.children) {
      for (const childName in frame.children) {
        const child = node.children.find((node) => node.name === childName);
        if (child) {
          this.updateSceneGraph(frame.children[childName], child);
        }
      }
    }
  }

  private updateNode(node: GLNode, keyframe?: AnimationTRS) {
    if (!keyframe) {
      return;
    }
    const { translation, rotation, scale } = keyframe;
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

  switchFrame(a: number, b: number) {
    const frameA = this.currentAnimation.frames[a];
    const frameB = this.currentAnimation.frames[b];
    this.currentAnimation.frames[a] = frameB;
    this.currentAnimation.frames[b] = frameA;
  }

  addFrame(frame?: number) {
    if (frame === undefined) {
      this.currentAnimation.frames.push({});
    } else {
      this.currentAnimation.frames.splice(frame + 1, 0, {});
    }
  }

  deleteFrame(frame: number) {
    this.currentAnimation.frames.splice(frame, 1);
  }

  static fromJSON(obj: GLTFAnimation, nodes: GLNode[]) {
    const runner = new AnimationRunner(obj.clip, nodes[obj.root], {
      fps: obj.fps,
      tween: obj.tween,
    });
    return runner;
  }

  toJSON(nodeRefs: GLNode[]): GLTFAnimation {
    return {
      root: nodeRefs.indexOf(this.root),
      clip: this.currentAnimation,
      fps: this.fps,
      tween: this.tweening,
    };
  }
}

function tweenFrame(
  trs1: AnimationTRS,
  trs2: AnimationTRS,
  delta: number,
  tweeningFn: TweeningFn
) {
  const { translation: t1, rotation: r1, scale: s1 } = trs1;
  const { translation: t2, rotation: r2, scale: s2 } = trs2;
  const t = !t1
    ? t2
    : !t2
      ? t1
      : t1.map((v, i) => v + (t2[i] - v) * tweeningFn(delta));
  const r = !r1
    ? r2
    : !r2
      ? r1
      : r1.map((v, i) => v + (r2[i] - v) * tweeningFn(delta));
  const s = !s1
    ? s2
    : !s2
      ? s1
      : s1.map((v, i) => v + (s2[i] - v) * tweeningFn(delta));
  return { translation: t, rotation: r, scale: s };
}

type TweeningFn = (x: number) => number;

export const TWEENING_FN_KEYS = [
  "sine",
  "quad",
  "cubic",
  "expo",
  "circ",
  "bounce",
  "linear",
] as const;

const TWEENING_FN: Record<(typeof TWEENING_FN_KEYS)[number], TweeningFn> = {
  sine,
  quad,
  cubic,
  expo,
  circ,
  bounce,
  linear,
} as const;

// all is ease in

function linear(x: number) {
  return x;
}

function sine(x: number) {
  return 1 - Math.cos((x * Math.PI) / 2);
}

function quad(x: number): number {
  return x * x;
}

function cubic(x: number): number {
  return x * x * x;
}

function expo(x: number): number {
  return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}

function circ(x: number): number {
  return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

function outBounce(x: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}

function bounce(x: number): number {
  return 1 - outBounce(1 - x);
}
