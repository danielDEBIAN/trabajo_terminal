import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/+esm'

// FORMATION OF THE MESH
let R = [[0, 0, 0]];
const numGrados = 20;
for (let r = 0.1; r <= 1; r += 0.1) {
    const intervalo = new Array(numGrados + 1).fill().map((_, i) => i * (2 * Math.PI) / numGrados);
    const x = intervalo.map(angle => r * Math.cos(angle));
    const y = intervalo.map(angle => r * Math.sin(angle));
    const z = new Array(numGrados + 1).fill(0);
    R = R.concat(x.map((_, i) => [x[i], y[i], z[i]]));
}

// Create a scene
const scene = new THREE.Scene();

// Create a WebGLRenderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create points geometry and material
const pointsGeometry = new THREE.BufferGeometry();
const pointsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const points = new THREE.Points(pointsGeometry, pointsMaterial);

// Add points to the scene
scene.add(points);

// INICIALIZACION
const N = R.length;
const p = new Array(N);
for (let k = 0; k < N; k++) {
    p[k] = {
        r: new THREE.Vector3().fromArray(R[k]), // posicion
        v: new THREE.Vector3(0, 0, 0),           // velocidad
        f: new THREE.Vector3(0, 0, 0),           // fuerza
        vec: [],
        deq: [],
    };

    const indices = [];
    for (let i = 0; i < R.length; i++) {
        if (i !== k) {
            indices.push(i);
        }
    }

    p[k].vec = indices;
    for (let j = 0; j < indices.length; j++) {
        p[k].deq[j] = p[k].r.distanceTo(p[indices[j]].r) * 0.9;
    }
}

for (let k = 0; k < numGrados + 1; k++) {
    p[k].r.z = 1;
}

const DT = 0.001;
const K = 100;  // resorte
const K2 = 1;   // amortiguamiento

// SIMULACION
function animate() {
    requestAnimationFrame(animate);

    for (let i = 0; i < N - numGrados - 1; i++) {
        const numVec = p[i].vec.length;
        for (let j = 0; j < numVec; j++) {
            const indVec = p[i].vec[j];
            const DR = p[indVec].r.clone().sub(p[i].r);
            const modulo = DR.length();
            const U = DR.clone().normalize();
            const F = U.clone().multiplyScalar(K * (modulo - p[i].deq[j]));
            p[i].f.add(F);
            p[indVec].f.sub(F);
        }

        p[i].v.add(p[i].f.clone().sub(p[i].v.clone().multiplyScalar(K2)).multiplyScalar(DT));
        p[i].r.add(p[i].v.clone().multiplyScalar(DT));
    }

    const positions = new Float32Array(N * 3);
    for (let k = 0; k < N; k++) {
        positions[k * 3] = p[k].r.x;
        positions[k * 3 + 1] = p[k].r.y;
        positions[k * 3 + 2] = p[k].r.z;
        p[k].f.set(0, 0, 0);
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    renderer.render(scene, camera);
}

animate();
