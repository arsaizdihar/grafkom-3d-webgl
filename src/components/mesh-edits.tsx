import { Mesh } from "@/lib/engine/mesh";
import { useState } from "react";
import { MaterialEdits } from "./material-edits";
import { MaterialSelect } from "./material-select";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export function MeshEdits({ mesh }: { mesh: Mesh }) {
  const [open, setOpen] = useState(false);
  // edit mesh here
  return (
    <div>
      <MaterialEdits material={mesh.material} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full mt-4"
            size={"md"}
          >
            Change Material
          </Button>
        </DialogTrigger>
        <DialogContent>
          <MaterialSelect
            onSelect={(mat) => {
              mesh.material = mat;
              setOpen(false);
            }}
            currentMaterial={mesh.material}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
