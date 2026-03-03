// ProdSecOps - The Migration Beam 3D Visual
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;
camera.position.y = 5;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// --- 1. THE DATA TUNNEL (Representing Migration Path) ---
const tunnelGeometry = new THREE.CylinderGeometry(10, 10, 100, 32, 1, true);
const tunnelMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00f0ff, 
    wireframe: true, 
    transparent: true, 
    opacity: 0.05,
    side: THREE.DoubleSide
});
const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
tunnel.rotation.x = Math.PI / 2; // Lay flat
scene.add(tunnel);

// --- 2. DATA PARTICLES (The Workloads Moving) ---
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 400;
const posArray = new Float32Array(particlesCount * 3);
const speeds = [];

for(let i = 0; i < particlesCount * 3; i += 3) {
    // Spread in a cylinder shape
    const radius = Math.random() * 8;
    const angle = Math.random() * Math.PI * 2;
    
    posArray[i] = Math.cos(angle) * radius; // x
    posArray[i+1] = Math.sin(angle) * radius; // y
    posArray[i+2] = (Math.random() - 0.5) * 100; // z (Length of tunnel)
    
    speeds.push((Math.random() * 0.2) + 0.1);
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.2,
    color: 0xffffff,
    transparent: true,
    opacity: 0.6
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// --- 3. SECURITY SCANNERS (The Rings) ---
const ringsGroup = new THREE.Group();
for (let i = 0; i < 5; i++) {
    const ringGeo = new THREE.RingGeometry(9, 9.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.z = -40 + (i * 20);
    ringsGroup.add(ring);
}
scene.add(ringsGroup);

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);

    // 1. Move Tunnel for speed illusion
    tunnel.rotation.y += 0.002;

    // 2. Move Particles
    const positions = particlesMesh.geometry.attributes.position.array;
    for(let i = 0; i < particlesCount; i++) {
        // Move Z forward
        positions[i*3 + 2] += speeds[i];

        // Loop back
        if (positions[i*3 + 2] > 50) {
            positions[i*3 + 2] = -50;
        }
    }
    particlesMesh.geometry.attributes.position.needsUpdate = true;

    // 3. Pulse Rings
    ringsGroup.children.forEach((ring, index) => {
        ring.rotation.z += 0.01 * (index % 2 === 0 ? 1 : -1);
        ring.scale.setScalar(1 + Math.sin(Date.now() * 0.001 + index) * 0.05);
    });

    // 4. Slight Camera Sway
    camera.position.x = Math.sin(Date.now() * 0.0005) * 2;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

animate();

// --- RESIZE ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
