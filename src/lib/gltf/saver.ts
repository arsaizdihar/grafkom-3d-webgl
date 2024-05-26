import { AnimationRunner } from "../engine/animation";
import { BufferGeometry } from "../engine/buffer-geometry";
import { GLImage } from "../engine/image";
import { Mesh } from "../engine/mesh";
import { GLNode } from "../engine/node";
import { Scene } from "../engine/scene";
import { Texture } from "../engine/texture";
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
import { ShaderMaterial } from "../material/shader-material";
import { GLTF, GLTFGeometry, GLTFMaterial, GLTFMesh, GLTFNode } from "./type";

export async function saveGLTF(
  scene: Scene | GLNode,
  animations: AnimationRunner[]
) {
  const result: GLTF = {
    scene: scene instanceof Scene ? 0 : undefined,
    root: scene instanceof GLNode ? 0 : undefined,
    nodes: [],
    meshes: [],
    images: [],
    materials: [],
    textures: [],
    animations: [],
    geometries: [],
  };

  const nodeRefs: GLNode[] = [];
  const meshRefs: Mesh[] = [];
  const materialRefs: ShaderMaterial[] = [];
  const geometryRefs: BufferGeometry[] = [];
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
      nodeData.lightPos = node.lightPos.toArray();
      nodeData.lightDir = node.lightDir.toArray();
      nodeData.lightRadius = node.lightRadius;
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
          geometry: processGeometry(mesh.geometry),
          material: 0,
        },
      };
      processGeometry(mesh.geometry);

      const material = mesh.material;
      const materialIndex = processMaterial(material);
      meshData.primitive.material = materialIndex;

      meshRefs.push(mesh);
      index = meshRefs.length - 1;
      result.meshes.push(meshData);
    }
    return index;
  }

  function processGeometry(geometry: BufferGeometry) {
    let index = geometryRefs.indexOf(geometry);
    if (index === -1) {
      const geometryData: GLTFGeometry = {
        type: "cube",
        vertex: Array.from(geometry.attributes.position.data),
        texcoord: Array.from(geometry.attributes.texcoord.data),
      };
      geometryRefs.push(geometry);
      if (geometry instanceof CubeGeometry) {
        geometryData.type = "cube";
        geometryData.cube = {
          size: geometry.size,
        };
      } else if (geometry instanceof PlaneGeometry) {
        geometryData.type = "plane";
        geometryData.plane = {
          width: geometry.width,
          height: geometry.height,
        };
      } else if (geometry instanceof PyramidHollowGeometry) {
        geometryData.type = "pyramidhollow";
        geometryData.pyramidhollow = {
          size: geometry.size,
          thickness: geometry.thickness,
        };
      } else if (geometry instanceof CubeHollowGeometry) {
        geometryData.type = "cubehollow";
        geometryData.cubehollow = {
          size: geometry.size,
          thickness: geometry.thickness,
        };
      } else if (geometry instanceof TorusGeometry) {
        geometryData.type = "torus";
        geometryData.torus = {
          innerRad: geometry.innerRad,
          outerRad: geometry.outerRad,
          slices: geometry.slices,
        };
      } else if (geometry instanceof ParallelepipedGeometry) {
        geometryData.type = "parallelepiped";
        geometryData.parallelepiped = {
          size: geometry.size,
        };
      } else if (geometry instanceof SphereGeometry) {
        geometryData.type = "sphere";
      } else if (geometry instanceof ParallelepipedHollowGeometry) {
        geometryData.type = "parallelepipedhollow";
        geometryData.parallelepipedhollow = {
          size: geometry.size,
          thickness: geometry.thickness,
        };
      }
      result.geometries.push(geometryData);
      index = geometryRefs.length - 1;
    }
    return index;
  }

  function processMaterial(material: ShaderMaterial) {
    let index = materialRefs.indexOf(material);
    if (index === -1) {
      const materialData: GLTFMaterial = {
        type: "basic",
        texture: material.texture
          ? processTexture(material.texture)
          : undefined,
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
          displacementTexture: material.displacementTexture
            ? processTexture(material.displacementTexture)
            : undefined,
          displacementFactor: material.displacementFactor,
          displacementBias: material.displacementBias,
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
      if (texture.color) {
        result.textures.push({
          color: texture.color.value,
        });
      } else {
        const image = texture.image!;
        const imageIndex = processImage(image);
        result.textures.push({
          source: imageIndex,
        });
      }
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
