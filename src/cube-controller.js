import { edgeIndices } from './meshes/cube';

export default class CubeController {
    setCube(cube) {
        this.cube = cube;
        this.vertexColors = cube.vertexColors;
    }

    handleVertexClick(index) {
        for (let i = 0; i < edgeIndices.length; i++) {
            const indices = edgeIndices[i];
            if (indices.indexOf(index) !== -1) {
                this.cube.setEdgeColor(i, this.vertexColors[index]);
            }
        }
    }
}
