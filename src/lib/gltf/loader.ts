import { Application } from "@/lib/engine/application";
import z from "zod";
import { PerspectiveCamera } from "../camera/perspective-camera";
import { BufferGeometry } from "../engine/buffer-geometry";
import { Camera } from "../engine/camera";
import { Color } from "../engine/color";
import { GLImage } from "../engine/image";
import { Mesh } from "../engine/mesh";
import { GLNode } from "../engine/node";
import { Scene } from "../engine/scene";
import { Texture } from "../engine/texture";
import { Transform } from "../engine/transform";
import { Vector3 } from "../engine/vector";
import { CubeGeometry } from "../geometry/cube-geometry";
import { PlaneGeometry } from "../geometry/plane-geometry";
import { BasicMaterial } from "../material/basic-material";
import { PhongMaterial } from "../material/phong-material";
import { ShaderMaterial } from "../material/shader-material";
import { Euler } from "../math/euler";
import { OrthographicCamera } from "../camera/orthographic-camera";

const arrayIndex = () => z.number().int().nonnegative();
const ColorSchema = z.union([z.string(), z.array(z.number()).length(4)]);
const GeometryEnum = ["cube", "plane"] as const;

const GLTFSchema = z.object({
  scene: arrayIndex(),
  nodes: z.array(
    z.object({
      translation: z.array(z.number()).length(3),
      rotation: z.array(z.number()).length(3),
      scale: z.array(z.number()).length(3),
      children: z.array(arrayIndex()).default([]),
      mesh: arrayIndex().optional(),
      name: z.string().optional(),
      camera: arrayIndex().optional(),
      activeCamera: z.boolean().optional(),
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
  cameras: z.array(
    z.object({
      type: z.enum(["perspective", "orthographic"]),
      perspective: z
        .object({
          fovy: z.number(),
          near: z.number(),
          far: z.number(),
        })
        .optional(),
      orthographic: z
        .object({
          top: z.number(),
          bottom: z.number(),
          left: z.number(),
          right: z.number(),
          near: z.number(),
          far: z.number(),
        })
        .optional()
    })
  ),
});

function parseColor(color: string | number[]) {
  return Array.isArray(color)
    ? Color.fromArray(color)
    : Color.hex(Number(color));
}

export async function loadGLTF(data: unknown, app: Application) {
  const gltf = GLTFSchema.parse(data);
  const images = await Promise.all(
    gltf.images.map(async (image) => {
      const img = new GLImage(image.uri);
      await img.load();
      return img;
    })
  );
  const textures = gltf.textures.map((texture) => {
    const image = images[texture.source];
    if (!image) {
      throw new Error(`Image not found for index ${texture.source}`);
    }
    return new Texture({
      image,
      texture: app.gl.createTexture(),
      ...texture,
    });
  });

  const materials = gltf.materials.map((material) => {
    const matTextures = material.textures.map((texture) => {
      if (!textures[texture]) {
        throw new Error(`Texture not found for index ${texture}`);
      }
      return textures[texture];
    });
    switch (material.type) {
      case "basic":
        if (!material.basic) {
          throw new Error("Basic material missing parameter");
        }
        return new BasicMaterial({
          color: parseColor(material.basic.color),
          textures: matTextures,
          id: "basic",
        });
      case "phong":
        if (!material.phong) {
          throw new Error("Phong material missing parameter");
        }
        return new PhongMaterial({
          ambient: parseColor(material.phong.ambient),
          diffuse: parseColor(material.phong.diffuse),
          specular: parseColor(material.phong.specular),
          shininess: material.phong.shininess,
          textures: matTextures,
          id: "phong",
        });
    }
  });

  let activeCamera: Camera | undefined;

  const nodes = gltf.nodes.map((node, index) => {
    const transform = new Transform(
      Vector3.fromArray(node.translation),
      Euler.fromArray(node.rotation),
      Vector3.fromArray(node.scale)
    );

    if (gltf.scene === index) {
      return new Scene(parseColor(node.background || "0x000000"));
    }

    if (node.mesh !== undefined) {
      const mesh = gltf.meshes[node.mesh];
      if (!mesh) {
        throw new Error(`Mesh not found for index ${node.mesh}`);
      }
      const material = materials[mesh.primitive.material];
      if (!material) {
        throw new Error(
          `Material not found for index ${mesh.primitive.material}`
        );
      }
      let geometry: BufferGeometry;
      switch (mesh.primitive.geometry) {
        case "cube":
          if (!mesh.primitive.cube) {
            throw new Error("Cube geometry missing parameter");
          }
          geometry = new CubeGeometry(mesh.primitive.cube.size);
          break;
        case "plane":
          if (!mesh.primitive.plane) {
            throw new Error("Plane geometry missing parameter");
          }
          geometry = new PlaneGeometry(
            mesh.primitive.plane.width,
            mesh.primitive.plane.height
          );
          break;
      }
      const meshGL = new Mesh(geometry, material);
      meshGL.transform = transform;
      if (node.name) {
        meshGL.name = node.name;
      }
      return meshGL;
    } else if (node.camera !== undefined) {
      let camera: Camera;
      const cameraGltf = gltf.cameras[node.camera];
      if (!cameraGltf) {
        throw new Error(`Camera not found for index ${node.camera}`);
      }

      switch (cameraGltf.type) {
        case "perspective":
          if (!cameraGltf.perspective) {
            throw new Error("Perspective camera missing parameter");
          }
          camera = new PerspectiveCamera(
            cameraGltf.perspective.fovy,
            app.canvas.width / app.canvas.height,
            cameraGltf.perspective.near,
            cameraGltf.perspective.far
          );
          break;
        case "orthographic":
          if (!cameraGltf.orthographic) {
            throw new Error("Perspective camera missing parameter");
          }
          camera = new OrthographicCamera(
            cameraGltf.orthographic.left,
            cameraGltf.orthographic.right,
            cameraGltf.orthographic.bottom,
            cameraGltf.orthographic.top,
            cameraGltf.orthographic.near,
            cameraGltf.orthographic.far,
          );
          break;
      }
      camera.transform = transform;
      if (node.name) {
        camera.name = node.name;
      }
      if (node.activeCamera) {
        activeCamera = camera;
      }
      return camera;
    } else {
      const nodeGL = new GLNode(transform);
      if (node.name) {
        nodeGL.name = node.name;
      }
      return nodeGL;
    }
  });

  nodes.map((node, index) => {
    const nodeGltf = gltf.nodes[index];
    nodeGltf.children.forEach((childIndex) => {
      const child = nodes[childIndex];
      if (!child) {
        throw new Error(`Child not found for index ${childIndex}`);
      }
      node.addChild(child);
    });
  });
  const scene = nodes[gltf.scene];
  if (!scene || !(scene instanceof Scene)) {
    throw new Error("Scene not found");
  }

  if (!activeCamera) {
    throw new Error("Active camera not found");
  }

  return [scene, activeCamera] as const;
}

type GLTF = z.infer<typeof GLTFSchema>;
type GLTFNode = GLTF["nodes"][number];
type GLTFMesh = GLTF["meshes"][number];
type GLTFMaterial = GLTF["materials"][number];
type GLTFCamera = GLTF["cameras"][number];

export async function saveGLTF(scene: Scene, activeCamera: Camera) {
  const result: GLTF = {
    scene: 0,
    nodes: [],
    meshes: [],
    cameras: [],
    images: [],
    materials: [],
    textures: [],
  };

  const nodeRefs: GLNode[] = [];
  const meshRefs: Mesh[] = [];
  const materialRefs: ShaderMaterial[] = [];
  const textureRefs: Texture[] = [];
  const imageRefs: GLImage[] = [];
  const cameraRefs: Camera[] = [];

  function traverseNode(node: GLNode) {
    if (nodeRefs.includes(node)) return;
    const nodeData: GLTFNode = {
      translation: node.transform.position.toArray(),
      rotation: node.transform.rotation.toArray(),
      scale: node.transform.scale.toArray(),
      children: [],
    };
    nodeData.name = node.name;

    if (node instanceof Mesh) {
      nodeData.mesh = processMesh(node);
    } else if (node instanceof Camera) {
      nodeData.camera = processCamera(node);
      if (node === activeCamera) {
        nodeData.activeCamera = true;
      }
    } else if (node instanceof Scene) {
      nodeData.background = node.background.value;
    }
    result.nodes.push(nodeData);
    nodeRefs.push(node);
    node.children.forEach((child) => traverseNode(child));
    nodeData.children = node.children.map((child) => nodeRefs.indexOf(child));
  }

  function processCamera(camera: Camera) {
    let index = cameraRefs.indexOf(camera);
    if (index === -1) {
      const cameraData: GLTFCamera = {
        type: "perspective",
      };
      if (camera instanceof PerspectiveCamera) {
        cameraData.perspective = {
          fovy: camera.fovy,
          near: camera.near,
          far: camera.far,
        };
      }
      cameraRefs.push(camera);
      index = cameraRefs.length - 1;
      result.cameras.push(cameraData);
    }
    return index;
  }

  function processMesh(mesh: Mesh) {
    let index = meshRefs.indexOf(mesh);
    if (index === -1) {
      const meshData: GLTFMesh = {
        primitive: {
          geometry: "cube",
          material: 0,
        },
      };
      if (mesh.geometry instanceof CubeGeometry) {
        meshData.primitive.geometry = "cube";
        meshData.primitive.cube = {
          size: mesh.geometry.size,
        };
      } else if (mesh.geometry instanceof PlaneGeometry) {
        meshData.primitive.geometry = "plane";
        meshData.primitive.plane = {
          width: mesh.geometry.width,
          height: mesh.geometry.height,
        };
      }

      const material = mesh.material;
      const materialIndex = processMaterial(material);
      meshData.primitive.material = materialIndex;

      meshRefs.push(mesh);
      index = meshRefs.length - 1;
      result.meshes.push(meshData);
    }
    return index;
  }

  function processMaterial(material: ShaderMaterial) {
    let index = materialRefs.indexOf(material);
    if (index === -1) {
      const materialData: GLTFMaterial = {
        type: "basic",
        textures: material.textures.map(processTexture),
      };
      if (material instanceof BasicMaterial) {
        materialData.type = "basic";
        materialData.basic = {
          color: material.color.value,
        };
      } else if (material instanceof PhongMaterial) {
        materialData.type = "phong";
        materialData.phong = {
          ambient: material.ambient.value,
          diffuse: material.diffuse.value,
          specular: material.specular.value,
          shininess: material.shininess,
        };
      }
      materialRefs.push(material);
      index = materialRefs.length - 1;
      result.materials.push(materialData);
    }
    return index;
  }

  function processTexture(texture: Texture) {
    let index = textureRefs.indexOf(texture);
    if (index === -1) {
      textureRefs.push(texture);
      index = textureRefs.length - 1;

      const image = texture.image;
      const imageIndex = processImage(image);
      result.textures.push({
        source: imageIndex,
        generateMipmaps: texture.generateMipmaps,
        wrapS: texture.wrapS,
        wrapT: texture.wrapT,
        magFilter: texture.magFilter,
        minFilter: texture.minFilter,
      });
    }
    return index;
  }

  function processImage(image: GLImage) {
    let index = imageRefs.indexOf(image);
    if (index === -1) {
      index = result.images.length;
      result.images.push({ uri: image.src });
    }
    return index;
  }

  traverseNode(scene);

  return result;
}
