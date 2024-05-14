import { Application } from "@/lib/engine/application";
import { AnimationRunner } from "../engine/animation";
import { BufferGeometry } from "../engine/buffer-geometry";
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
import { PyramidHollowGeometry } from "../geometry/pyramid-hollow-geometry";
import { BasicMaterial } from "../material/basic-material";
import { PhongMaterial } from "../material/phong-material";
import { Euler } from "../math/euler";
import { GLTFSchema } from "./type";

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
        case "pyramidhollow":
          if (!mesh.primitive.pyramidhollow) {
            throw new Error("Pyramid hollow geometry missing parameter");
          }
          geometry = new PyramidHollowGeometry(
            mesh.primitive.pyramidhollow.size,
            mesh.primitive.pyramidhollow.thickness
          );
          break;
      }
      const meshGL = new Mesh(geometry, material);
      meshGL.transform = transform;
      if (node.name) {
        meshGL.name = node.name;
      }
      return meshGL;
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

  const animations = gltf.animations.map((animation) => {
    const root = nodes[animation.root];
    if (!root) {
      throw new Error(
        `Root node animation not found for index ${animation.root}`
      );
    }
    return new AnimationRunner(animation.clip, root, { fps: animation.fps });
  });

  const scene = nodes[gltf.scene];
  if (!scene || !(scene instanceof Scene)) {
    throw new Error("Scene not found");
  }
  return [scene, animations] as const;
}
