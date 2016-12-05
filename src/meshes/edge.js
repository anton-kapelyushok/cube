import {
    LineBasicMaterial,
    Geometry,
    Vector3,
    Line,
    LineSegments,
} from 'three';

export default class Edge {
    constructor(vertices, color) {
        this.vertices = vertices;
        this.color = color;

        const geometry = new Geometry();
        geometry.vertices.push(new Vector3(...vertices[0]));
        geometry.vertices.push(new Vector3(...vertices[1]));

        const material = new LineBasicMaterial({ color });
        this.mesh =  new Line(geometry, material, LineSegments);
    }

    setColor(color) {
        this.mesh.material = new LineBasicMaterial({ color });
    }

    getChildren() {
        return [];
    }

    getMesh() {
        return this.mesh;
    }

    getIntersections() {
        return [];
    }
}
