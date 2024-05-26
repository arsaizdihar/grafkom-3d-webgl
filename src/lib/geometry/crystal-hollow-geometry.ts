import { BufferAttribute } from "../engine/buffer-attribute";
import { BufferGeometry, GeometryData } from "../engine/buffer-geometry";
import { addCube } from "./pyramid-hollow-geometry";

export class CrystalHollowGeometry extends BufferGeometry {
    constructor(
        public size: number = 50,
        public thickness: number = 5,
        data?: GeometryData
    ) {
        super(data);
        this.size = Math.max(this.size, 1);
        this.thickness = Math.min(this.thickness, this.size / 4);

        if (data) {
            return;
        }

        const vertices: number[] = [];
        const texcoord: number[] = [];

        const hs = size / 2;
        const ht = this.thickness / 2;

        // bottom front and back
        for (let i = 0; i < 2; i++) {
            const z = i === 0 ? hs : -hs;
            const front = z + ht;
            const back = z - ht;
            const top = -hs + ht;
            const bottom = -hs - ht;
            const left = -hs - ht;
            const right = hs + ht;
            addCube(vertices, texcoord, front, back, top, bottom, left, right);
        }

        // left and right
        for (let i = 0; i < 2; i++) {
            const x = i === 0 ? -hs : hs;
            let front = hs + ht;
            let back = -hs - ht;
            const top = -hs + ht;
            const bottom = -hs - ht;
            const left = x - ht;
            const right = x + ht;
            addCube(vertices, texcoord, front, back, top, bottom, left, right);
        }

        // front left to top
        let front = hs + ht;
        let back = hs - ht;
        let top = hs + ht;
        let bottom = -hs + ht;
        let left = -hs - ht;
        let right = -hs + ht;

        addCube(vertices, texcoord, front, back, top, bottom, left, right, hs, -hs);

        // front right to top
        left = hs - ht;
        right = hs + ht;
        addCube(
            vertices,
            texcoord,
            front,
            back,
            top,
            bottom,
            left,
            right,
            -hs,
            -hs
        );

        // back right to top
        front = -hs + ht;
        back = -hs - ht;
        addCube(vertices, texcoord, front, back, top, bottom, left, right, -hs, hs);

        // back left to top
        left = -hs - ht;
        right = -hs + ht;
        addCube(vertices, texcoord, front, back, top, bottom, left, right, hs, hs);

        // top triangles
        front = ht;
        back = -ht;
        top = hs + this.thickness + ht;
        bottom = hs + ht;
        left = -ht;
        right = +ht;
        const topVert = [0, top, 0];
        vertices.push(
            left,
            bottom,
            front,
            right,
            bottom,
            front,
            ...topVert,
            right,
            bottom,
            back,
            ...topVert,
            right,
            bottom,
            front,
            left,
            bottom,
            back,
            ...topVert,
            right,
            bottom,
            back,
            left,
            bottom,
            front,
            ...topVert,
            left,
            bottom,
            back
        );
        texcoord.push(
            0,
            1,
            1,
            1,
            0.5,
            0.5,
            1,
            1,
            0.5,
            0.5,
            0,
            1,
            1,
            1,
            0.5,
            0.5,
            0,
            1,
            1,
            1,
            0.5,
            0.5,
            0,
            1
        );

        this.setAttribute(
            "position",
            new BufferAttribute(new Float32Array(vertices), 3)
        );
        this.setAttribute(
            "texcoord",
            new BufferAttribute(new Float32Array(texcoord), 2)
        );
        this.calculateNormals();
    }
}
