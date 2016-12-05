import * as THREE from 'three';

import Cube from './meshes/cube';
import CubeController from './cube-controller';
import MouseEventsHandler from './mouse-events-handler';

import './index.css';

let scene, camera, renderer;
let mouseEventsHandler, t = 0;


init();
animate();

document.querySelector('.add-cube').addEventListener('click', addRandomCube);

function addRandomCube () {
    const cube = createCube({
        position: {
            x: Math.random() * 8 - 4,
            y: Math.random() * 8 - 4,
            z: - Math.random() * 3 + 1,
        },
        rotation: {
            x: Math.random() * Math.PI/2,
            y: Math.random() * Math.PI/2,
            z: Math.random() * Math.PI/2,
        },
        size: Math.random() * 2 + .5,
    });
    addCube(cube);
}

function createCube(options = {}) {
    const position = options.position || { x: 0, y: 0, z: 0 };
    const rotation = options.rotation || { x: 0, y: 0, z: 0};
    const size = options.size || 1;

    const cubeController = new CubeController();
    const cube = new Cube({
        size,
        onVertexClick: cubeController.handleVertexClick.bind(cubeController),
    });
    const mesh = cube.getMesh();
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    cubeController.setCube(cube);

    return cube;
}

function addCube(cube) {
    mouseEventsHandler.registerMesh(cube);
    const mesh = cube.getMesh();
    scene.add(mesh);
}

function init() {
    mouseEventsHandler = new MouseEventsHandler();
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 10;

    for (let i = 0; i < 3; i++) {
        addRandomCube();
    }

    renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderer.setClearColor('white');
    renderer.setSize(window.innerWidth, window.innerHeight);
    mouseEventsHandler.updateCamera(camera);

    document.body.appendChild(renderer.domElement);
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame(animate);
    t += 5;
    camera.position.x = (Math.sin( t/1000) * 1);
    camera.position.y = 0;
    camera.position.z = (Math.cos( t/1000) * 1) + 8;

    renderer.render(scene, camera );
}
