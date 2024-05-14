import { z } from "zod";

const arrayIndex = () => z.number().int().nonnegative();
const ColorSchema = z.union([z.string(), z.array(z.number()).length(4)]);
const GeometryEnum = ["cube", "plane", "pyramidhollow"] as const;

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
        material: arrayIndex(),
      }),
    })
  ),
  materials: z.array(
    z.object({
      type: z.enum(["basic", "phong"]),
      textures: z.array(arrayIndex()),
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
});

export type GLTF = z.infer<typeof GLTFSchema>;
export type GLTFNode = GLTF["nodes"][number];
export type GLTFMesh = GLTF["meshes"][number];
export type GLTFMaterial = GLTF["materials"][number];
