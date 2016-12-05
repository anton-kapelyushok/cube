import { Raycaster, Vector2 } from 'three';

export default class MouseEventsHandler {
    constructor() {
        this.registerEvents();
        this.meshes = [];
        this.raycaster = null;
        this.state = {
            camera: null,
            mouse: {
                position: {
                    x: 0,
                    y: 0,
                },
                mouseDown: false,
            },
            target: null,
        };
    }

    updateCamera(camera) {
        if (!this.state.camera) {
            this.raycaster = new Raycaster();
        }
        if ( camera !== this.state.camera) {
            this.state.camera = camera;
            this.updateRayCaster();
        }
    }

    updateRayCaster() {
        if (!this.state.camera) {
            return;
        }
        const mouse = new Vector2(this.state.mouse.position.x, this.state.mouse.position.y);
        this.raycaster.setFromCamera(mouse, this.state.camera);
    }

    registerEvents() {
        const $on = document.addEventListener.bind(document);
        $on('mousemove', this.onMouseMove.bind(this), false);
        $on('mouseup', this.onMouseUp.bind(this), false);
        $on('mousedown', this.onMouseDown.bind(this), false);
    }

    onMouseMove(event) {
        event.preventDefault();

        this.state.mouse.position.x = (event.offsetX / event.target.width) * 2 - 1;
        this.state.mouse.position.y = -(event.offsetY / event.target.height) * 2 + 1;

        this.updateRayCaster();
        const target = this.getTarget();
        this.handleTargetChange(target);
    }

    handleTargetChange(target) {
        if (this.state.target === target) {
            return;
        }
        this.state.target &&
            this.state.target.handleMouseOut && this.state.target.handleMouseOut();
        target && target.handleMouseIn && target.handleMouseIn();
        this.state.target = target;
    }

    onMouseUp() {
        if (!this.state.mouse.mouseDown) {
            return;
        }
        this.state.mouse.mouseDown = false;
        const target = this.getTarget();
        target && target.handleMouseUp && target.handleMouseUp();
    }

    onMouseDown() {
        if (this.state.mouse.mouseDown) {
            return;
        }
        this.state.mouse.mouseDown = true;
        const target = this.getTarget();
        target && target.handleMouseDown && target.handleMouseDown();
    }

    getTarget() {
        const closest = this.getClosestIntersection(this.getIntersections());
        return closest ? closest.mesh : null;
    }

    getIntersections() {
        if (!this.raycaster) {
            return [];
        }
        const intersections = [];

        const getAllChildren = mesh => {
            const result = [];
            const children = mesh.getChildren();
            result.push(...children);
            children.forEach(child => result.push(...getAllChildren(child)));
            return result;
        };
        const watchedMeshes = [];
        this.meshes.forEach(mesh => watchedMeshes.push(mesh, ...getAllChildren(mesh)));
        watchedMeshes.forEach(mesh => {
            const meshIntersections = mesh.getIntersections(this.raycaster);
            const meshWithIntersections = meshIntersections.map(intersection => ({
                mesh,
                intersection,
            }))
            intersections.push(...meshWithIntersections);

        });
        return intersections;
    }

    getClosestIntersection(intersections) {
        const sorted = intersections.sort((l, r) => l.intersection.distance - r.intersection.distance);
        return sorted.length ? sorted[0] : null;
    }

    registerMesh(mesh) {
        if (this.meshes.indexOf(mesh) === -1) {
            this.meshes.push(mesh);
        }
    }

    removeMesh(mesh) {
        this.meshes = this.meshes.filter(item => item !== mesh);
    }
}
