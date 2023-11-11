import Delaunator from 'https://cdn.skypack.dev/delaunator@5.0.0';
import { trimesh } from './trimesh';

// FORMATION OF THE MESH
let R = [[0, 0, 0]];
const numGrados = 20;

for (let r = 0.1; r <= 1; r += 0.1) {
    const intervalo = Array.from({ length: numGrados + 1 }, (_, i) => (2 * Math.PI * i) / numGrados);
    const x = intervalo.map(theta => r * Math.cos(theta));
    const y = intervalo.map(theta => r * Math.sin(theta));
    const z = new Array(numGrados + 1).fill(0);

    R.push(...x.map((_, i) => [x[i], y[i], z[i]]));
}

// Triangulation
const tri = delaunay(R.map(point => [point[0], point[1]]));
const numVertices = R.length;
trimesh (tri, R.map(point => [point[0], point[1]]));

// Initialization
const p = [];
for (let k = 0; k < numVertices; k++) {
const [rX, rY, rZ] = R[k];
const vec = [];
const deq = [];

const trianglesWithK = tri.filter(triangle => triangle.includes(k));
const neighbors = [...new Set(trianglesWithK.flat())].filter(neighbor => neighbor !== k);

for (const j of neighbors) {
    const [neighborX, neighborY, neighborZ] = R[j];
    vec.push(j);
    deq.push(Math.sqrt((rX - neighborX) ** 2 + (rY - neighborY) ** 2 + (rZ - neighborZ) ** 2) * 0.9);
}

p.push({
    r: [rX, rY, rZ],
    v: [0, 0, 0],
    f: [0, 0, 0],
    vec: vec,
    deq: deq,
});
}

for (let k = 0; k < numGrados + 1; k++) {
    p[k].r[2] = 1;
}

const DT = 0.001;
const K = 100; // spring constant
const K2 = 1; // damping constant

// SIMULATION
const y = new Array(1000);
for (let i = 0; i < 1000; i++) {
for (let k = 0; k < numVertices - numGrados - 1; k++) {
    const numVec = p[k].vec.length;

    for (let j = 0; j < numVec; j++) {
        const indVec = p[k].vec[j];
        const DR = p[indVec].r.map((coord, idx) => coord - p[k].r[idx]);
        const modulo = Math.sqrt(DR.reduce((acc, val) => acc + val ** 2, 0));
        const U = DR.map(coord => coord / modulo);
        const F = U.map((coord, idx) => K * (modulo - p[k].deq[j]) * coord);

        p[k].f = p[k].f.map((coord, idx) => coord + F[idx]);
        p[indVec].f = p[indVec].f.map((coord, idx) => coord - F[idx]);
    }

    p[k].v = p[k].v.map((coord, idx) => coord - (K2 * p[k].v[idx] + p[k].f[idx]) * DT);
    p[k].r = p[k].r.map((coord, idx) => coord + p[k].v[idx] * DT);
}

y[i] = p[0].r[2];

for (let k = 0; k < numVertices; k++) {
    R[k] = p[k].r;
    p[k].f = [0, 0, 0];
}

// Visualization (you may need to replace this with appropriate code for your environment)
console.log(R); // Display coordinates for each step
}

console.log(y); // Output the resulting array `y` to the console

function delaunay(points) {
const flatPoints = points.reduce((arr, point) => arr.concat(point), []);
const delaunayTriangulation = Delaunator.from(flatPoints);
const triangles = delaunayTriangulation.triangles;

const result = [];
for (let i = 0; i < triangles.length; i += 3) {
    const triangle = [triangles[i], triangles[i + 1], triangles[i + 2]];
    result.push(triangle);
}

return result;
}