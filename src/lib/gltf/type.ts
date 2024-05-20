import { z } from "zod";
import { AnimationClipSchema, TWEENING_FN_KEYS } from "../engine/animation";

const arrayIndex = () => z.number().int().nonnegative();
const ColorSchema = z.union([z.string(), z.array(z.number()).length(4)]);
const GeometryEnum = [
  "cube",
  "plane",
  "pyramidhollow",
  "torus",
  "cubehollow",
] as const;

export const GLTFSchema = z.object({
  scene: arrayIndex(),
  nodes: z.array(
    z.object({
      translation: z.array(z.number()).length(3),
      rotation: z.array(z.number()).length(3),
      scale: z.array(z.number()).length(3),
      children: z.array(arrayIndex()).default([]),
      mesh: arrayIndex().optional(),
      name: z.string().optional(),
      background: ColorSchema.optional(),
      lightPos: z.array(z.number()).length(3).optional(),
    })
  ),
  meshes: z.array(
    z.object({
      primitive: z.object({
        geometry: z.enum(GeometryEnum),
        cube: z
          .object({
            size: z.number().nonnegative(),
          })
          .optional(),
        plane: z
          .object({
            width: z.number().nonnegative(),
            height: z.number().nonnegative(),
          })
          .optional(),
        pyramidhollow: z
          .object({
            size: z.number().nonnegative(),
            thickness: z.number().nonnegative(),
          })
          .optional(),
        cubehollow: z
          .object({
            size: z.number().nonnegative(),
            thickness: z.number().nonnegative(),
          })
          .optional(),
        torus: z
          .object({
            slices: z.number().nonnegative(),
            innerRad: z.number().nonnegative(),
            outerRad: z.number().nonnegative(),
          })
          .optional(),
        material: arrayIndex(),
      }),
    })
  ),
  materials: z.array(
    z.object({
      type: z.enum(["basic", "phong"]),
      texture: arrayIndex(),
      basic: z
        .object({
          color: z.union([z.string(), z.array(z.number()).length(4)]),
        })
        .optional(),
      phong: z
        .object({
          ambient: ColorSchema,
          diffuse: ColorSchema,
          specular: ColorSchema,
          shininess: z.number().nonnegative(),
        })
        .optional(),
    })
  ),
  textures: z.array(
    z.object({
      source: arrayIndex(),
      wrapS: z.number().optional(),
      wrapT: z.number().optional(),
      magFilter: z.number().optional(),
      minFilter: z.number().optional(),
      generateMipmaps: z.boolean().optional(),
    })
  ),
  images: z.array(z.object({ uri: z.string() })),
  animations: z.array(
    z.object({
      root: arrayIndex(),
      fps: z.number().default(30),
      tween: z.enum(TWEENING_FN_KEYS).default("linear"),
      clip: AnimationClipSchema,
    })
  ),
});

export type GLTF = z.infer<typeof GLTFSchema>;
export type GLTFNode = GLTF["nodes"][number];
export type GLTFMesh = GLTF["meshes"][number];
export type GLTFMaterial = GLTF["materials"][number];
export type GLTFAnimation = GLTF["animations"][number];
