/* eslint-disable no-case-declarations */
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
import { CubeHollowGeometry } from "../geometry/cube-hollow-geometry";
import { ParallelepipedGeometry } from "../geometry/parallelepiped-geometry";
import { PlaneGeometry } from "../geometry/plane-geometry";
import { PyramidHollowGeometry } from "../geometry/pyramid-hollow-geometry";
import { SphereGeometry } from "../geometry/sphere-geometry";
import { TorusGeometry } from "../geometry/torus-geometry";
import { ParallelepipedHollowGeometry } from "../geometry/parallelepiped-hollow-geometry";
import { BasicMaterial } from "../material/basic-material";
import { PhongMaterial } from "../material/phong-material";
import { Euler } from "../math/euler";
import { GLTFSchema } from "./type";

function parseColor(color: string | number[]) {
  return Array.isArray(color)
    ? Color.fromArray(color)
    : Color.hex(Number(color));
}

export async function loadGLTF(
  data: unknown,
  app: Application,
  isScene = true
) {
  const gltf = GLTFSchema.parse(data);
  const images = await Promise.all(
    gltf.images.map(async (image) => {
      const img = new GLImage(image.uri);
      await img.load();
      return img;
    })
  );

  const textures = gltf.textures.map((texture) => {
    if (texture.source !== undefined) {
      const image = images[texture.source];
      if (!image) {
        throw new Error(`Image not found for index ${texture.source}`);
      }
      return new Texture(
        {
          image,
          ...texture,
          color: undefined,
        },
        app.gl
      );
    } else if (texture.color) {
      return new Texture(
        {
          ...texture,
          color: parseColor(texture.color),
          image: undefined,
        },
        app.gl
      );
    } else {
      throw new Error("Texture missing parameter, source or color");
    }
  });

  const materials = gltf.materials.map((material) => {
    const texture =
      material.texture === undefined ? undefined : textures[material.texture];
    if (!texture && material.texture !== undefined) {
      throw new Error(`Texture not found for index ${material.texture}`);
    }

    switch (material.type) {
      case "basic":
        if (!material.basic) {
          throw new Error("Basic material missing parameter");
        }
        return new BasicMaterial(
          {
            color: parseColor(material.basic.color),
            texture: texture,
          },
          app.basicProgram
        );
      case "phong":
        if (!material.phong) {
          throw new Error("Phong material missing parameter");
        }
        const specularTexture =
          material.phong.specularTexture !== undefined
            ? textures[material.phong.specularTexture]
            : undefined;
        const normalTexture =
          material.phong.normalTexture !== undefined
            ? textures[material.phong.normalTexture]
            : undefined;
        const displacementTexture =
          material.phong.displacementTexture !== undefined
            ? textures[material.phong.displacementTexture]
            : undefined;
        return new PhongMaterial(
          {
            ambient: parseColor(material.phong.ambient),
            diffuse: parseColor(material.phong.diffuse),
            specular: parseColor(material.phong.specular),
            shininess: material.phong.shininess,
            texture: texture,
            specularTexture: specularTexture,
            normalTexture: normalTexture,
            displacementTexture: displacementTexture,
            displacementFactor: material.phong.displacementFactor,
            displacementBias: material.phong.displacementBias,
          },
          app.phongProgram
        );
    }
  });

  const geometries: BufferGeometry[] = gltf.geometries.map((geometry) => {
    const data = {
      position: geometry.vertex,
      texcoord: geometry.texcoord,
    };
    switch (geometry.type) {
      case "cube":
        if (!geometry.cube) {
          throw new Error("Cube geometry missing parameter");
        }
        return new CubeGeometry(geometry.cube.size, data);
      case "plane":
        if (!geometry.plane) {
          throw new Error("Plane geometry missing parameter");
        }
        return new PlaneGeometry(
          geometry.plane.width,
          geometry.plane.height,
          50,
          50,
          data
        );
      case "pyramidhollow":
        if (!geometry.pyramidhollow) {
          throw new Error("Pyramid hollow geometry missing parameter");
        }
        return new PyramidHollowGeometry(
          geometry.pyramidhollow.size,
          geometry.pyramidhollow.thickness,
          data
        );
      case "cubehollow":
        if (!geometry.cubehollow) {
          throw new Error("Cube hollow geometry missing parameter");
        }
        return new CubeHollowGeometry(
          geometry.cubehollow.size,
          geometry.cubehollow.thickness,
          data
        );
      case "torus":
        if (!geometry.torus) {
          throw new Error("Torus geometry missing parameter");
        }
        return new TorusGeometry(
          geometry.torus.slices,
          20,
          geometry.torus.innerRad,
          geometry.torus.outerRad,
          data
        );
      case "parallelepiped":
        console.log(geometry.parallelepiped);
        if (!geometry.parallelepiped) {
          throw new Error("Parallelepiped geometry missing parameter");
        }
        return new ParallelepipedGeometry(geometry.parallelepiped.size, data);
      case "sphere":
        return new SphereGeometry(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          data
      );
      case "parallelepipedhollow":
        console.log(geometry.parallelepipedhollow);
        if (!geometry.parallelepipedhollow) {
          throw new Error("Parallelepipedhollow geometry missing parameter");
        }
        return new ParallelepipedHollowGeometry(geometry.parallelepipedhollow.size, geometry.parallelepipedhollow.thickness, data);
    }
  });

  const nodes = gltf.nodes.map((node, index) => {
    const transform = new Transform(
      Vector3.fromArray(node.translation),
      Euler.fromArray(node.rotation),
      Vector3.fromArray(node.scale)
    );

    if (gltf.scene === index) {
      return new Scene(
        parseColor(node.background || "0x000000"),
        node.lightPos && Vector3.fromArray(node.lightPos),
        node.lightDir && Vector3.fromArray(node.lightDir),
        node.lightRadius ?? 100
      );
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
      const geometry = geometries[mesh.primitive.geometry];
      if (!geometry) {
        throw new Error(
          `Geometry not found for index ${mesh.primitive.geometry}`
        );
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
    const anim = new AnimationRunner(animation.clip, root, {
      fps: animation.fps,
    });
    anim.tweening = animation.tween;
    return anim;
  });
  if (gltf.scene === undefined && gltf.root !== undefined && !isScene) {
    const root = nodes[gltf.root];
    if (!root) {
      throw new Error("Root node not found");
    }
    return [
      nodes[gltf.root],
      animations,
      materials,
      geometries,
      textures,
    ] as const;
  } else if (isScene && gltf.scene !== undefined) {
    const scene = nodes[gltf.scene];
    if (!scene || !(scene instanceof Scene)) {
      throw new Error("Scene not found");
    }
    scene.materials = materials;
    scene.geometries = geometries;
    scene.textures = textures;
    scene.images = images;
    return [scene, animations] as const;
  } else {
    throw new Error(isScene ? "Scene not found" : "Root node not found");
  }
}
