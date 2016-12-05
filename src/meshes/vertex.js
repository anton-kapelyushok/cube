import {
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
} from 'three';

export default class Vertex {
    constructor(options) {
        this.options = options;
        this.position = options.position;
        this.size = options.size;
        this.color = options.color;

        const geometry = new SphereGeometry(this.size / 10, 32, 32);
        const material = new MeshBasicMaterial({ color: this.color });
        this.mesh = new Mesh(geometry, material);
        this.mesh.position.set(...this.position);
    }

    getChildren() {
        return [];
    }

    getMesh() {
        return this.mesh;
    }

    getIntersections(raycaster) {
        return raycaster.intersectObject(this.mesh);
    }

    handleMouseIn() {
        this.mesh.scale.set(1.5, 1.5, 1.5);
    }

    handleMouseOut() {
        this.mesh.scale.set(1, 1, 1);
    }

    handleMouseDown() {
        this.options.onMouseDown && this.options.onMouseDown();
    }
}
