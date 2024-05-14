import { Camera } from "../engine/camera";
import { GLImage } from "../engine/image";
import { Mesh } from "../engine/mesh";
import { GLNode } from "../engine/node";
import { Scene } from "../engine/scene";
import { Texture } from "../engine/texture";
import { CubeGeometry } from "../geometry/cube-geometry";
import { PlaneGeometry } from "../geometry/plane-geometry";
import { BasicMaterial } from "../material/basic-material";
import { PhongMaterial } from "../material/phong-material";
import { ShaderMaterial } from "../material/shader-material";
import { GLTF, GLTFMaterial, GLTFMesh, GLTFNode } from "./type";

export async function saveGLTF(scene: Scene) {
  const result: GLTF = {
    scene: 0,
    nodes: [],
    meshes: [],
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
