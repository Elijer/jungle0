import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BoardConfig } from '../interfaces.js';

const sceneSetup = () => {

  const b: BoardConfig = {
    gridSize: 10,
    squareSize: 1,
    gapSize: 0.0,
    verticalOffset: -9,
    terrainTiles: []
  }

  // Set up camera with a view from above
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 ); // there ARE other cameras
  camera.position.set(0, -20, 10);

  // Set up renderer and add it to the DOM
  const renderer = new THREE.WebGLRenderer(); // There are also other...renders?
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Set up orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  // Add a directional light to the scene
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 100, 100).normalize();
  scene.add(light);

  // Create a material for each square
  for (let i = 0; i < b.gridSize * b.gridSize; i++) {
    b.terrainTiles.push(new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
  }

  const group = new THREE.Group();

  for (let i = 0; i < b.gridSize; i++) {
    for (let j = 0; j < b.gridSize; j++) {
      const squareGeometry = new THREE.PlaneGeometry(b.squareSize, b.squareSize);
      const square = new THREE.Mesh(squareGeometry, b.terrainTiles[i * b.gridSize + j]);
      square.position.set(i * (b.squareSize + b.gapSize) - b.gridSize/2, 0, j * (b.squareSize + b.gapSize) + b.verticalOffset);
      square.rotation.x = -Math.PI / 2;
      group.add(square);
    }
  }

  group.rotation.x = -Math.PI / 2;
  scene.add(group);

  for (let x = 0; x < b.gridSize; x++) {
    for (let y = 0; y < b.gridSize; y++) {
      const index = x * b.gridSize + y;
      b.terrainTiles[index].color.setHex(0xffffff);
    }
  }

  return {scene, camera, renderer, b}
}

export default sceneSetup