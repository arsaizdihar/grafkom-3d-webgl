import { AnimationRunner } from "../engine/animation";
import { GLImage } from "../engine/image";
import { Mesh } from "../engine/mesh";
import { GLNode } from "../engine/node";
import { Scene } from "../engine/scene";
import { Texture } from "../engine/texture";
import { CubeGeometry } from "../geometry/cube-geometry";
import { CubeHollowGeometry } from "../geometry/cube-hollow-geometry";
import { PlaneGeometry } from "../geometry/plane-geometry";
import { PyramidHollowGeometry } from "../geometry/pyramid-hollow-geometry";
import { BasicMaterial } from "../material/basic-material";
import { PhongMaterial } from "../material/phong-material";
import { ShaderMaterial } from "../material/shader-material";
import { GLTF, GLTFMaterial, GLTFMesh, GLTFNode } from "./type";

export async function saveGLTF(scene: Scene, animations: AnimationRunner[]) {
  const result: GLTF = {
    scene: 0,
    nodes: [],
    meshes: [],
    images: [],
    materials: [],
    textures: [],
    animations: [],
  };

  const nodeRefs: GLNode[] = [];
  const meshRefs: Mesh[] = [];
  const materialRefs: ShaderMaterial[] = [];
  const textureRefs: Texture[] = [];
  const imageRefs: GLImage[] = [];

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
    } else if (node instanceof Scene) {
      nodeData.background = node.background.value;
    }
    result.nodes.push(nodeData);
    nodeRefs.push(node);
    node.children.forEach((child) => traverseNode(child));
    nodeData.children = node.children.map((child) => nodeRefs.indexOf(child));
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
      } else if (mesh.geometry instanceof PyramidHollowGeometry) {
        meshData.primitive.geometry = "pyramidhollow";
        meshData.primitive.pyramidhollow = {
          size: mesh.geometry.size,
          thickness: mesh.geometry.thickness,
        };
      } else if (mesh.geometry instanceof CubeHollowGeometry) {
        meshData.primitive.geometry = "cubehollow";
        meshData.primitive.cubehollow = {
          size: mesh.geometry.size,
          thickness: mesh.geometry.thickness,
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
        texture: processTexture(material.texture),
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
          specularTexture: material.specularTexture
            ? processTexture(material.specularTexture)
            : undefined,
          normalTexture: material.normalTexture
            ? processTexture(material.normalTexture)
            : undefined,
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

      const image = texture.image!;
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

  animations.forEach((runner) => {
    result.animations.push(runner.toJSON(nodeRefs));
  });

  return result;
}
