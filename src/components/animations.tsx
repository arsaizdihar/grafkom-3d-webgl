import { AnimationRunner, TWEENING_FN_KEYS } from "@/lib/engine/animation";
import { useApp } from "@/state/app-store";
import { useLongPress } from "@uidotdev/usehooks";
import {
  Pause,
  Play,
  Repeat,
  Rewind,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { InputDrag } from "./ui/input-drag";
import { Progress } from "./ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
let interval: NodeJS.Timeout | undefined = undefined;

export function Animations() {
  const animations = useApp((state) => state.animations);
  const setAnimationEdit = useApp((state) => state.setAnimationEdit);
  const [focusedAnimation, setFocusedAnimation] =
    useState<AnimationRunner | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [loop, setLoop] = useState(true);
  const [reverse, setReverse] = useState(false);
  const [tweening, setTweening] =
    useState<(typeof TWEENING_FN_KEYS)[number]>("linear");
  const fpsRef = useRef<HTMLInputElement>(null);

  const longPressNext = useLongPress(
    () => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (focusedAnimation === null) return;
        focusedAnimation.nextFrame();
      }, 100);
    },
    {
      onFinish(e) {
        clearInterval(interval);
      },
      threshold: 900,
    }
  );

  const longPressPrev = useLongPress(
    () => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (focusedAnimation === null) return;
        focusedAnimation.prevFrame();
      }, 100);
    },
    {
      onFinish(e) {
        clearInterval(interval);
      },
      threshold: 900,
    }
  );

  useEffect(() => {
    if (!focusedAnimation) return;
    focusedAnimation.onFrameChange = (frame) => {
      setFrame(frame);
      if (
        !loop &&
        ((frame === 0 && reverse) ||
          (frame === focusedAnimation.length - 1 && !reverse))
      ) {
        focusedAnimation.isPlaying = false;
        setIsPlaying(false);
      }
    };
    return () => {
      focusedAnimation.onFrameChange = null;
    };
  }, [focusedAnimation, loop, reverse]);

  return (
    <div className="flex flex-col h-full gap-2">
      <h2 className="font-semibold">Animations</h2>
      {animations.length > 0 ? (
        <ul className="flex-1">
          {animations.map((animation, idx) => (
            <li key={idx}>
              <Button
                className="w-full justify-start"
                size={"md"}
                variant={
                  focusedAnimation === animation ? "destructive" : "outline"
                }
                onClick={() => {
                  if (focusedAnimation) {
                    focusedAnimation.isPlaying = false;
                  }
                  setFocusedAnimation(animation);
                  setIsPlaying(animation.isPlaying);
                  setFrame(animation.currentFrame);
                  setTweening(animation.tweening);
                }}
              >
                {animation.name}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm">No animations yet.</div>
      )}
      <div className="flex-1">
        {focusedAnimation !== null && (
          <>
            <div className="bg-slate-300 rounded p-2">
              <div className="flex justify-center gap-1">
                <Button
                  size="sm"
                  className="aspect-square h-auto w-10"
                  variant={"secondary"}
                  onClick={() => {
                    focusedAnimation.firstFrame();
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
                    focusedAnimation.prevFrame();
                  }}
                  disabled={isPlaying}
                  {...longPressPrev}
                >
                  <StepBack className="w-4" />
                </Button>
                <Button
                  size="sm"
                  className="aspect-square h-auto w-10"
                  variant={isPlaying ? "default" : "secondary"}
                  onClick={() => {
                    focusedAnimation.isPlaying = !focusedAnimation.isPlaying;
                    setIsPlaying(focusedAnimation.isPlaying);
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
                    focusedAnimation.nextFrame();
                  }}
                  disabled={isPlaying}
                  {...longPressNext}
                >
                  <StepForward className="w-4" />
                </Button>
                <Button
                  size="sm"
                  className="aspect-square h-auto w-10"
                  variant={"secondary"}
                  onClick={() => {
                    focusedAnimation.lastFrame();
                  }}
                  disabled={isPlaying}
                >
                  <SkipForward className="w-4" />
                </Button>
              </div>
              <div className="flex justify-center gap-1 mt-2">
                <Button
                  size="sm"
                  className="aspect-square h-auto w-10"
                  variant={loop ? "default" : "secondary"}
                  onClick={() => {
                    setLoop(!loop);
                  }}
                >
                  <Repeat className="w-4" />
                </Button>
                <Button
                  size="sm"
                  className="aspect-square h-auto w-10"
                  variant={reverse ? "default" : "secondary"}
                  onClick={() => {
                    focusedAnimation.reverse = !focusedAnimation.reverse;
                    setReverse(focusedAnimation.reverse);
                  }}
                >
                  <Rewind className="w-4" />
                </Button>
              </div>
            </div>

            <div className="my-2 flex flex-col gap-2">
              <h4 className="font-medium">Frame</h4>
              <Progress
                value={(frame / (focusedAnimation.length - 1)) * 100}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span>{frame + 1}</span>
                <span>{focusedAnimation.length}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">FPS</label>
              <InputDrag
                ref={fpsRef}
                defaultValue={focusedAnimation.fps}
                getValue={() => focusedAnimation.fps}
                onChange={(value) => {
                  if (focusedAnimation) {
                    focusedAnimation.fps = value;
                  }
                }}
                min={0.01}
                max={60}
                step={1}
              />
            </div>
            <div className="my-2 flex flex-col gap-2">
              <label className="text-sm">Tweening</label>
              <Select
                value={tweening}
                onValueChange={(value: typeof tweening) => {
                  if (focusedAnimation) {
                    focusedAnimation.tweening = value;
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
            <Button
              size={"md"}
              className="w-full mt-2"
              onClick={() => {
                setAnimationEdit(focusedAnimation);
              }}
            >
              Edit
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
