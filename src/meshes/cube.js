import {
    Object3D,
} from 'three';

import Vertex from './vertex';
import Edge from './edge';

const createVertexColors = () => {
    const result = [];
    for (let i = 0; i < 8; i++) {
        result.push(Math.floor(Math.random() * (0xffffff + 1)));
    }
    return result;
};

export const edgeIndices = [
    [0, 1],
    [0, 4],
    [1, 5],
    [5, 4],
    [2, 6],
    [2, 3],
    [3, 7],
    [7, 6],
    [1, 3],
    [5, 7],
    [2, 0],
    [4, 6],
];

const initVertexPositions = [
    [-1, -1, -1],
    [-1, -1, 1],
    [-1, 1, -1],
    [-1, 1, 1],
    [1, -1, -1],
    [1, -1, 1],
    [1, 1, -1],
    [1, 1, 1],
];

export default class Cube {
    constructor(options = {}) {
        this.options = options;
        this.vertexColors = options.vertexColors || createVertexColors();

        const size = options.size || 1;

        this.group = new Object3D();

        const vertexPositions = initVertexPositions
            .map(position => position.map(coord => coord * size));
        this.edges = edgeIndices.map(indices => new Edge([vertexPositions[indices[0]], vertexPositions[indices[1]]], 0x000000));
        this.vertices = vertexPositions.map((position, index) => {
            const color = this.vertexColors[index];
            const onMouseDown = this.handleVertexClick.bind(this, index);
            return new Vertex({
                color,
                size,
                position,
                onMouseDown,
            });
        });

        this.edges.forEach(edge => {
            this.group.add(edge.getMesh())
        });

        this.vertices.forEach(vertex => {
            this.group.add(vertex.getMesh());
        });
    }

    handleVertexClick(index) {
        this.options.onVertexClick && this.options.onVertexClick(index);
    }

    setEdgeColor(index, color) {
        this.edges[index].setColor(color);
    }

    getChildren() {
        return [...this.vertices, ...this.edges];
    }

    getMesh() {
        return this.group;
    }

    getIntersections(raycaster) {
        return raycaster.intersectObject(this.group);
    }

}
