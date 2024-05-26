# 3D Engine WebGL

3D Engine is a web-based 3D Object Viewer app built using WebGL tools. WebGL is a library used to display renderings of simple objects on the web, one of which is 3D objects. The application can display 3D objects provided by the application, selected by the user. Users can manipulate the properties of the model, as well as save the manipulated model for reloading. The model also allows animations that can be displayed in the program.

## Features

1. Display 3D hollow objects
2. Display 3D articulated models
3. gLTF file format, save and load model
4. Change camera projection type: orthographic, oblique, and perspective and property type: orbit control and z position
5. Adjust lighting configuration
6. Component editor (scene graph)
7. Display model animations
9. Animation editor
10. Animation tweening
11. Point lighting
12. Multiple light sources
13. Character controller
14. Text rendering

## How to Start

1. Clone Repository
2. Install dependencies (you can use pnpm instead) ```npm install -g pnpm``` and ```pnpm install```
3. Run ```pnpm run dev``` and then open it on ```http://localhost:5173/```

## Work Division
| Nim      | Task                        |
| :------: | :-------------------------: |
| 13521051 | Component editor, load save UI, create node UI |
| 13521055 | Camera projection, camera editor, scene graph
| 13521096 | Transform editor            |
| 13521101 | Setup, load save model, shaders, maths, textures, shading, mappings (normal, displacement), animation, mesh editor, texture editor, animation management, animation editor, character controller, point lighting, multiple lighting, text rendering |

## Hollow Objects

1. Parallelepiped Hollow (13521051)
2. Hollow cube & torus (13521055)
3. xxx (13521096)
4. Hollow prism (13521101)

## Articulated Models

1. House (13521051)
2. Steve (human) (13521055)
3. Hand (13521096)
4. Car (13521101)

## Teams

| Nama                           | Nim      |
| :----------------------------- | :------: |
| Manuella Ivana Uli Sianipar    | 13521051 |
| Muhammad Bangkit Dwi Chahyono  | 13521055 |
| Noel Christoffel Simbolon      | 13521096 |
| Arsa Izdihar Islam             | 13521101 |

## Copyright
2024 © minecraft. All Rights Reserved.
