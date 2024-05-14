import { Button } from "./ui/button";

export function Load() {
    return (
        <div className="mt-5 flex space-x-2">
            <Button
            size={"sm"}
            onClick={() => {}}
            className="flex-1 text-center"
            >
            Load
            </Button>

            <Button
            size={"sm"}
            onClick={() => {}}
            className="flex-1 text-center"
            >
            Save
            </Button>
        </div>
    );
  }