import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
//import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
//import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';
//import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/FBXLoader.js';
import { TrackballControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/TrackballControls.js';
import Stats from 'https://unpkg.com/three@0.127.0/examples/jsm/libs/stats.module.js';


const statsEnabled = true;

let container, stats;

let camera, scene, renderer, controls;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 3;

    //

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.z = 100;

    controls = new TrackballControls(camera, renderer.domElement);

    //

    scene.add(new THREE.HemisphereLight(0x444443, 0x233333, 4));

    //

    const material = new THREE.MeshStandardMaterial();

    new FBXLoader()
        .setPath('./assets/models/')
        .load('vase.fbx', function(group) {

            const loader = new THREE.TextureLoader()
                .setPath('');

            material.roughness = 1; // attenuates roughnessMap
            material.metalness = 1; // attenuates metalnessMap

            const diffuseMap = loader.load('');
            diffuseMap.encoding = THREE.sRGBEncoding;
            material.map = diffuseMap;
            // roughness is in G channel, metalness is in B channel
            // material.metalnessMap = material.roughnessMap = loader.load('');
            // material.normalMap = loader.load('');

            // material.map.wrapS = THREE.RepeatWrapping;
            // material.roughnessMap.wrapS = THREE.RepeatWrapping;
            // material.metalnessMap.wrapS = THREE.RepeatWrapping;
            // material.normalMap.wrapS = THREE.RepeatWrapping;

            group.traverse(function(child) {

                if (child.isMesh) {

                    child.material = material;

                }

            });

            group.position.x = -0.45;
            group.rotation.y = -Math.PI / 2;
            scene.add(group);

        });

    const environments = {

        'Venice Sunset': { filename: 'venice_sunset_1k.hdr' },
        'Overpass': { filename: 'pedestrian_overpass_1k.hdr' }

    };

    function loadEnvironment(name) {

        if (environments[name].texture !== undefined) {

            scene.background = environments[name].texture;
            scene.environment = environments[name].texture;
            return;

        }

        //const filename = environments[name].filename;
        // new RGBELoader()
        //     .setPath('textures/equirectangular/')
        //     .load(filename, function(hdrEquirect) {

        //         hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;

        //         scene.background = hdrEquirect;
        //         scene.environment = hdrEquirect;
        //         environments[name].texture = hdrEquirect;

        //     });

    }

    const params = {

        environment: Object.keys(environments)[0]

    };
    loadEnvironment(params.environment);

    // const gui = new GUI();
    // gui.add(params, 'environment', Object.keys(environments)).onChange(function(value) {

    //     loadEnvironment(value);

    // });
    // gui.open();

    //

    if (statsEnabled) {

        stats = new Stats();
        container.appendChild(stats.dom);

    }

    window.addEventListener('resize', onWindowResize);

}

//

function onWindowResize() {

    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

}

//

function animate() {

    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);

    if (statsEnabled) stats.update();

}