import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AnimationPath,
  AnimationTRS,
  TWEENING_FN_KEYS,
} from "@/lib/engine/animation";
import { GLNode } from "@/lib/engine/node";
import { Transform } from "@/lib/engine/transform";
import { useApp } from "@/state/app-store";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
} from "lucide-react";
import { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { InputDrag } from "./ui/input-drag";

export function AnimationEdits() {
  const { animationEdit, setAnimationEdit, focusedNode, setFocusedNode } =
    useApp((state) => ({
      animationEdit: state.animationEdit!,
      setAnimationEdit: state.setAnimationEdit,
      focusedNode: state.focusedNode,
      setFocusedNode: state.setFocusedNode,
    }));
  const [currentFrameIdx, setCurrentFrameIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(animationEdit.isPlaying);
  const [tweening, setTweening] = useState(animationEdit.tweening);
  const fpsRef = useRef<HTMLInputElement>(null);

  const [_, rerender] = useReducer((state) => !state, false);
  useEffect(() => {
    let node = focusedNode;
    if (!focusedNode) {
      return;
    }
    while (node != null) {
      if (node === animationEdit.rootNode) {
        return;
      }
      node = node.parent;
    }
    setFocusedNode(null);
  }, [animationEdit, focusedNode, setFocusedNode]);

  useEffect(() => {
    animationEdit.currentFrame = 0;
    animationEdit.updateSceneGraph();
  }, [animationEdit]);

  const animation = animationEdit.currentAnimation;
  const currentFrame =
    currentFrameIdx === -1 ? null : animation.frames[currentFrameIdx] ?? null;

  let focusedFrame = getFocusedFrame(
    currentFrame,
    focusedNode,
    animationEdit.rootNode
  );

  useEffect(() => {
    if (!animationEdit) return;
    animationEdit.onFrameChange = (frame) => {
      setCurrentFrameIdx(frame);
      if (frame === animationEdit.length - 1) {
        animationEdit.isPlaying = false;
        animationEdit.updateSceneGraph();
        setIsPlaying(false);
      }
    };
    return () => {
      animationEdit.onFrameChange = null;
    };
  }, [animationEdit]);

  return (
    <div className="p-4 overflow-y-auto h-screen">
      <Button
        variant={"ghost"}
        className="w-full mb-2"
        onClick={() => {
          setAnimationEdit(null);
        }}
      >
        Back
      </Button>
      {animationEdit.currentAnimation.frames.length > 0 ? (
        <>
          <div className="bg-slate-300 rounded p-2">
            <div className="flex justify-center gap-1">
              <Button
                size="sm"
                className="aspect-square h-auto w-10"
                variant={"secondary"}
                onClick={() => {
                  animationEdit.firstFrame();
                }}
                disabled={isPlaying}
              >
                <SkipBack className="w-4" />
              </Button>
              <Button
                size="sm"
                className="aspect-square h-auto w-10"
                variant={"secondary"}
                onClick={() => {
                  animationEdit.prevFrame();
                }}
                disabled={isPlaying}
                // {...longPressPrev}
              >
                <StepBack className="w-4" />
              </Button>
              <Button
                size="sm"
                className="aspect-square h-auto w-10"
                variant={isPlaying ? "default" : "secondary"}
                onClick={() => {
                  animationEdit.isPlaying = !animationEdit.isPlaying;
                  setIsPlaying(animationEdit.isPlaying);
                  if (!animationEdit.isPlaying) {
                    animationEdit.updateSceneGraph();
                  }
                }}
              >
                {isPlaying ? (
                  <Pause className="w-4" />
                ) : (
                  <Play className="w-4" />
                )}
              </Button>
              <Button
                size="sm"
                className="aspect-square h-auto w-10"
                variant={"secondary"}
                onClick={() => {
                  animationEdit.nextFrame();
                }}
                disabled={isPlaying}
                // {...longPressNext}
              >
                <StepForward className="w-4" />
              </Button>
              <Button
                size="sm"
                className="aspect-square h-auto w-10"
                variant={"secondary"}
                onClick={() => {
                  animationEdit.lastFrame();
                }}
                disabled={isPlaying}
              >
                <SkipForward className="w-4" />
              </Button>
            </div>
          </div>

          <div className="my-2">
            <h4 className="font-medium">FRAME</h4>
            <Progress
              value={(currentFrameIdx / (animationEdit.length - 1)) * 100}
              className="w-full"
            />
            <div className="flex justify-between">
              <span>{currentFrameIdx + 1}</span>
              <span>{animationEdit.length}</span>
            </div>
          </div>
        </>
      ) : (
        <Button
          onClick={() => {
            animationEdit.addFrame(0);
            animationEdit.updateSceneGraph();
            setCurrentFrameIdx(0);
          }}
        >
          Add Frame
        </Button>
      )}
      <div>
        <label>FPS</label>
        <InputDrag
          ref={fpsRef}
          defaultValue={animationEdit.fps}
          getValue={() => animationEdit.fps}
          onChange={(value) => {
            if (animationEdit) {
              animationEdit.fps = value;
            }
          }}
          min={0.01}
          max={60}
          step={1}
        />
      </div>
      <div className="my-2">
        <label>Tweening</label>
        <Select
          value={tweening}
          onValueChange={(value: typeof tweening) => {
            if (animationEdit) {
              animationEdit.tweening = value;
            }
            setTweening(value);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TWEENING_FN_KEYS.map((key) => (
              <SelectItem key={key} value={key}>
                {key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ul className="flex gap-2 flex-wrap my-4">
        {animation.frames.map((frame, i) => {
          return (
            <li key={i}>
              <ContextMenu>
                <ContextMenuTrigger>
                  <Button
                    size={"sm"}
                    variant={i === currentFrameIdx ? "default" : "outline"}
                    className="h-auto w-auto p-2"
                    onClick={() => {
                      setCurrentFrameIdx(i);
                      animationEdit.currentFrame = i;
                      animationEdit.updateSceneGraph();
                    }}
                  >
                    {i + 1}
                  </Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    onSelect={() => {
                      animationEdit.deleteFrame(i);
                      animationEdit.updateSceneGraph();
                      setCurrentFrameIdx(-1);
                      rerender();
                    }}
                  >
                    Delete
                  </ContextMenuItem>
                  <ContextMenuItem
                    onSelect={() => {
                      animationEdit.addFrame(i);
                      animationEdit.currentFrame = i + 1;
                      animationEdit.updateSceneGraph();
                    }}
                  >
                    Add after
                  </ContextMenuItem>
                  {i !== 0 && (
                    <ContextMenuItem
                      onSelect={() => {
                        animationEdit.switchFrame(i, i - 1);
                        animationEdit.currentFrame = i - 1;
                        animationEdit.updateSceneGraph();
                      }}
                    >
                      Switch before
                    </ContextMenuItem>
                  )}
                  {i !== animation.frames.length - 1 && (
                    <ContextMenuItem
                      onSelect={() => {
                        animationEdit.switchFrame(i, i + 1);
                        animationEdit.currentFrame = i + 1;
                        animationEdit.updateSceneGraph();
                      }}
                    >
                      Switch after
                    </ContextMenuItem>
                  )}
                </ContextMenuContent>
              </ContextMenu>
            </li>
          );
        })}
      </ul>
      <h2 className="mt-4 mb-2">TRS</h2>
      {focusedFrame?.keyframe && (
        <TRSEdits
          key={currentFrameIdx + (focusedNode?.id ?? "")}
          trs={focusedFrame?.keyframe}
          triggerChange={() => {
            console.log(currentFrame);
            animationEdit.updateSceneGraph(currentFrame!);
          }}
          initial={focusedNode!.transform}
        />
      )}
      {currentFrame &&
        focusedNode &&
        (!focusedFrame?.keyframe ? (
          <Button
            onClick={() => {
              addKeyframe(currentFrame, focusedNode, animationEdit.rootNode);
              rerender();
            }}
          >
            Add keyframe
          </Button>
        ) : (
          <Button
            onClick={() => {
              removeKeyframe(currentFrame, focusedFrame!);
              rerender();
            }}
            variant={"destructive"}
            className="w-full mt-2"
          >
            Remove keyframe
          </Button>
        ))}
    </div>
  );
}

function addKeyframe(frame: AnimationPath, node: GLNode, rootNode: GLNode) {
  if (node === rootNode) {
    return;
  }
  const parents = [node.name];
  let parent = node.parent;
  while (parent && parent !== rootNode) {
    parents.push(parent.name);
    parent = parent.parent;
  }
  let currentFrame = frame;
  for (const parent of parents.reverse()) {
    if (!currentFrame.children) {
      currentFrame.children = {};
    }
    if (!currentFrame.children[parent]) {
      currentFrame.children[parent] = {};
    }
    currentFrame = currentFrame.children[parent];
  }
  currentFrame.keyframe = {};
}

function removeKeyframe(frame: AnimationPath, removeFrame: AnimationPath) {
  if (!frame.children) {
    return;
  }
  for (const key in frame.children) {
    if (frame.children[key] === removeFrame) {
      delete frame.children[key];
      return;
    }
    removeKeyframe(frame.children[key], removeFrame);
  }
}

function getFocusedFrame(
  frame: AnimationPath | null,
  node: GLNode | null,
  rootNode: GLNode
): AnimationPath | null {
  if (!frame || !node) {
    return null;
  }
  if (node === rootNode) {
    return frame;
  }
  const parents = [node.name];
  let parent = node.parent;
  while (parent && parent !== rootNode) {
    parents.push(parent.name);
    parent = parent.parent;
  }
  let currentFrame = frame;
  for (const parent of parents.reverse()) {
    if (!currentFrame.children) {
      return null;
    }
    currentFrame = currentFrame.children[parent];
    if (!currentFrame) {
      return null;
    }
  }
  return currentFrame || null;
}

function TRSEdits({
  trs,
  triggerChange,
  initial,
}: {
  trs: AnimationTRS;
  triggerChange: () => void;
  initial: Transform;
}) {
  const [_, rerender] = useReducer((state) => !state, false);
  return (
    <div className="flex flex-col gap-2">
      {trs.translation ? (
        <>
          <h4>Position</h4>
          <div className="flex space-x-3">
            <div className="flex items-center flex-1">
              <span className="mr-2">X</span>
              <InputDrag
                getValue={() => trs.translation![0]}
                onChange={(value) => {
                  trs.translation![0] = value;
                  triggerChange();
                }}
                step={0.5}
              />
            </div>
            <div className="flex items-center flex-1">
              <span className="mr-2">Y</span>
              <InputDrag
                getValue={() => trs.translation![1]}
                onChange={(value) => {
                  trs.translation![1] = value;
                  triggerChange();
                }}
                step={0.5}
              />
            </div>
            <div className="flex items-center flex-1">
              <span className="mr-2">Z</span>
              <InputDrag
                getValue={() => trs.translation![2]}
                onChange={(value) => {
                  trs.translation![2] = value;
                  triggerChange();
                }}
                step={0.5}
              />
            </div>
          </div>
          <Button
            onClick={() => {
              trs.translation = undefined;
              triggerChange();
              rerender();
            }}
            variant={"destructive"}
            className="mt-2"
          >
            Delete position
          </Button>
        </>
      ) : (
        <Button
          onClick={() => {
            trs.translation = [
              initial.position.x,
              initial.position.y,
              initial.position.z,
            ];
            triggerChange();
            rerender();
          }}
        >
          Add position
        </Button>
      )}
      {trs.rotation ? (
        <>
          <h4>Rotation</h4>
          <div className="flex space-x-3">
            <div className="flex items-center flex-1">
              <span className="mr-2">X</span>
              <InputDrag
                getValue={() => trs.rotation![0]}
                onChange={(value) => {
                  trs.rotation![0] = value;
                  triggerChange();
                }}
                step={0.5}
              />
            </div>
            <div className="flex items-center flex-1">
              <span className="mr-2">Y</span>
              <InputDrag
                getValue={() => trs.rotation![1]}
                onChange={(value) => {
                  trs.rotation![1] = value;
                  triggerChange();
                }}
                step={0.5}
              />
            </div>
            <div className="flex items-center flex-1">
              <span className="mr-2">Z</span>
              <InputDrag
                getValue={() => trs.rotation![2]}
                onChange={(value) => {
                  trs.rotation![2] = value;
                  triggerChange();
                }}
                step={0.5}
              />
            </div>
          </div>
          <Button
            onClick={() => {
              trs.rotation = undefined;
              triggerChange();
              rerender();
            }}
            variant={"destructive"}
            className="mt-2"
          >
            Delete rotation
          </Button>
        </>
      ) : (
        <Button
          onClick={() => {
            trs.rotation = [
              initial.rotation.x,
              initial.rotation.y,
              initial.rotation.z,
            ];
            triggerChange();
            rerender();
          }}
        >
          Add rotation
        </Button>
      )}
      {trs.scale ? (
        <>
          <h4>Scale</h4>
          <div className="flex space-x-3">
            <div className="flex items-center flex-1">
              <span className="mr-2">X</span>
              <InputDrag
                getValue={() => trs.scale![0]}
                onChange={(value) => {
                  trs.scale![0] = value;
                  triggerChange();
                }}
                step={0.5}
              />
            </div>
            <div className="flex items-center flex-1">
              <span className="mr-2">Y</span>
              <InputDrag
                getValue={() => trs.scale![1]}
                onChange={(value) => {
                  trs.scale![1] = value;
                  triggerChange();
                }}
                step={0.5}
              />
            </div>
            <div className="flex items-center flex-1">
              <span className="mr-2">Z</span>
              <InputDrag
                getValue={() => trs.scale![2]}
                onChange={(value) => {
                  trs.scale![2] = value;
                  triggerChange();
                }}
                step={0.5}
              />
            </div>
          </div>
          <Button
            onClick={() => {
              trs.scale = undefined;
              triggerChange();
              rerender();
            }}
            variant={"destructive"}
            className="mt-2"
          >
            Delete scale
          </Button>
        </>
      ) : (
        <Button
          onClick={() => {
            trs.scale = [initial.scale.x, initial.scale.y, initial.scale.z];
            triggerChange();
            rerender();
          }}
        >
          Add scale
        </Button>
      )}
    </div>
  );
}
