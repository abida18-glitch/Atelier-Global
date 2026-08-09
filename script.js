/**
 * Atelier Global — Core App Engine & 3D WebGL Controller
 */

const state = {
    activeTab: 'doll',
    avatarType: 'petite',
    avatarSkinColor: '#F5D0C5',
    avatarHeight: 1.0,
    avatarPose: 'runway',
    silhouette: 'a-line',
    neckline: 'sweetheart',
    sleeve: 'sleeveless',
    fabricColor: '#6B4E3D',
    texture: 'Silk',
    cameraPreset: '360'
};

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.remove('hidden');
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
}

// ---------------------------------------------------------------------------
// 3D DOLL THREE.JS CONTROLLER
// ---------------------------------------------------------------------------
let dollScene, dollCamera, dollRenderer, dollControls;
let dollAvatarGroup, torsoMesh, leftArmMesh, rightArmMesh, dollMaterial;

function initDollThreeJS() {
    const container = document.getElementById('doll-canvas-container');
    if (!container) return;

    try {
        dollScene = new THREE.Scene();
        dollScene.background = new THREE.Color(0xF5F0EB);

        dollCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        dollCamera.position.set(0, 1.0, 4.0);

        dollRenderer = new THREE.WebGLRenderer({ antialias: true });
        dollRenderer.setSize(container.clientWidth, container.clientHeight);
        dollRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(dollRenderer.domElement);

        if (typeof THREE.OrbitControls !== 'undefined') {
            dollControls = new THREE.OrbitControls(dollCamera, dollRenderer.domElement);
            dollControls.enableDamping = true;
            dollControls.target.set(0, 0.8, 0);
        }

        dollScene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
        dirLight.position.set(3, 5, 4);
        dollScene.add(dirLight);

        build3DAvatarDoll();

        const animateDoll = () => {
            requestAnimationFrame(animateDoll);
            if (dollControls) dollControls.update();
            if (dollAvatarGroup) dollAvatarGroup.rotation.y += 0.003;
            dollRenderer.render(dollScene, dollCamera);
        };
        animateDoll();

        window.addEventListener('resize', () => {
            if (!container || !dollRenderer || !dollCamera) return;
            dollCamera.aspect = container.clientWidth / container.clientHeight;
            dollCamera.updateProjectionMatrix();
            dollRenderer.setSize(container.clientWidth, container.clientHeight);
        });
    } catch (err) {
        console.error("Doll Canvas Error:", err);
    }
}

function build3DAvatarDoll() {
    dollAvatarGroup = new THREE.Group();
    dollAvatarGroup.position.set(0, -0.4, 0);

    dollMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(state.avatarSkinColor), roughness: 0.4 });

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), dollMaterial);
    head.position.set(0, 1.85, 0);
    dollAvatarGroup.add(head);

    torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.7, 32), dollMaterial);
    torsoMesh.position.set(0, 1.25, 0);
    dollAvatarGroup.add(torsoMesh);

    const armGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.6, 16);
    leftArmMesh = new THREE.Mesh(armGeo, dollMaterial);
    leftArmMesh.position.set(-0.33, 1.25, 0);
    dollAvatarGroup.add(leftArmMesh);

    rightArmMesh = new THREE.Mesh(armGeo, dollMaterial);
    rightArmMesh.position.set(0.33, 1.25, 0);
    dollAvatarGroup.add(rightArmMesh);

    const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.8, 16);
    dollAvatarGroup.add(new THREE.Mesh(legGeo, dollMaterial)).position.set(-0.12, 0.45, 0);
    dollAvatarGroup.add(new THREE.Mesh(legGeo, dollMaterial)).position.set(0.12, 0.45, 0);

    dollScene.add(dollAvatarGroup);
}

function updateAvatarProportions() {
    if (!dollAvatarGroup) return;
    dollMaterial.color.set(state.avatarSkinColor);
    dollAvatarGroup.scale.set(1.0, state.avatarHeight, 1.0);
    let torsoWidth = state.avatarType === 'petite' ? 0.85 : state.avatarType === 'curvy' ? 1.25 : 1.0;
    if (torsoMesh) torsoMesh.scale.set(torsoWidth, 1.0, torsoWidth);
}

// ---------------------------------------------------------------------------
// 3D DRESS DESIGNER THREE.JS CONTROLLER
// ---------------------------------------------------------------------------
let scene, camera, renderer, controls;
let dressMeshGroup, skirtMesh, sleevesGroup, dressMaterial;

function initThreeJS() {
    const container = document.getElementById('three-canvas-container');
    const errorOverlay = document.getElementById('webgl-error');
    if (!container) return;

    try {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xF5F0EB);

        camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 0.5, 4.5);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
        }

        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
        keyLight.position.set(5, 8, 5);
        scene.add(keyLight);

        createProceduralDress();

        const animate = () => {
            requestAnimationFrame(animate);
            if (controls) controls.update();
            if (state.cameraPreset === '360' && dressMeshGroup) dressMeshGroup.rotation.y += 0.005;
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            if (!container || !renderer || !camera) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    } catch (error) {
        console.error('WebGL Init Error:', error);
        if (errorOverlay) errorOverlay.classList.remove('hidden');
    }
}

function createProceduralDress() {
    dressMeshGroup = new THREE.Group();
    dressMeshGroup.position.set(0, -1.2, 0);

    dressMaterial = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(state.fabricColor), roughness: 0.3 });
    const bodice = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 1.1, 32), dressMaterial);
    bodice.position.set(0, 2.2, 0);
    dressMeshGroup.add(bodice);

    rebuildSkirtGeometry();
    sleevesGroup = new THREE.Group();
    dressMeshGroup.add(sleevesGroup);
    rebuildSleeves();

    scene.add(dressMeshGroup);
}

function rebuildSkirtGeometry() {
    if (skirtMesh) dressMeshGroup.remove(skirtMesh);
    let radius = state.silhouette === 'ballgown' ? 1.8 : state.silhouette === 'column' ? 0.7 : 1.2;
    skirtMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.36, radius, 3.2, 48), dressMaterial);
    skirtMesh.position.set(0, 0.9, 0);
    dressMeshGroup.add(skirtMesh);
}

function rebuildSleeves() {
    while (sleevesGroup.children.length > 0) sleevesGroup.remove(sleevesGroup.children[0]);
    if (state.sleeve === 'long') {
        const sleeveGeo = new THREE.CylinderGeometry(0.12, 0.09, 1.2, 16);
        const left = new THREE.Mesh(sleeveGeo, dressMaterial);
        left.position.set(-0.55, 2.3, 0);
        left.rotation.z = 0.3;
        const right = new THREE.Mesh(sleeveGeo, dressMaterial);
        right.position.set(0.55, 2.3, 0);
        right.rotation.z = -0.3;
        sleevesGroup.add(left);
        sleevesGroup.add(right);
    }
}

function updateMaterialShader() {
    if (!dressMaterial) return;
    dressMaterial.color.set(state.fabricColor);
    dressMaterial.roughness = state.texture === 'Velvet' ? 0.9 : 0.15;
}

// ---------------------------------------------------------------------------
// 100+ FABRICS GENERATOR
// ---------------------------------------------------------------------------
const fabricsDatabase = [];
function generate100Fabrics() {
    ['Silks', 'Velvets', 'Laces', 'Organza & Tulle'].forEach(cat => {
        for (let i = 1; i <= 25; i++) {
            fabricsDatabase.push({ id: `${cat}-${i}`, name: `${cat.slice(0, -1)} Grade ${i * 4}`, category: cat });
        }
    });
}

function renderFabrics(filterCat = 'All', searchQuery = '') {
    const grid = document.getElementById('fabric-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    fabricsDatabase.filter(f => (filterCat === 'All' || f.category === filterCat) && f.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .forEach(fabric => {
            const card = document.createElement('div');
            card.className = 'p-4 bg-cream border border-[#E6DDD3] rounded-xl cursor-pointer hover:border-charcoal';
            card.innerHTML = `<span class="text-[9px] uppercase text-taupe">${fabric.category}</span><h4 class="font-serif text-sm mt-1">${fabric.name}</h4>`;
            card.addEventListener('click', () => showToast(`Selected: ${fabric.name}`));
            grid.appendChild(card);
        });
}

// ---------------------------------------------------------------------------
// EVENT BINDINGS
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initDollThreeJS();
    initThreeJS();
    generate100Fabrics();
    renderFabrics();

    // Navigation Switches
    const navButtons = document.querySelectorAll('#main-nav .nav-btn');
    const tabViews = document.querySelectorAll('.tab-view');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            navButtons.forEach(b => b.classList.toggle('active', b === btn));
            tabViews.forEach(v => v.classList.toggle('active', v.id === `view-${tabId}`) || v.classList.toggle('hidden', v.id !== `view-${tabId}`));
        });
    });

    // Avatar Customization Bindings
    document.querySelectorAll('[data-avatar-type]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-avatar-type]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.avatarType = e.target.getAttribute('data-avatar-type');
            updateAvatarProportions();
        });
    });

    document.querySelectorAll('[data-avatar-skin]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-avatar-skin]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.avatarSkinColor = e.target.getAttribute('data-avatar-skin');
            updateAvatarProportions();
        });
    });

    const heightSlider = document.getElementById('avatar-height-slider');
    if (heightSlider) {
        heightSlider.addEventListener('input', (e) => {
            state.avatarHeight = parseFloat(e.target.value);
            updateAvatarProportions();
        });
    }

    document.getElementById('go-to-design-btn')?.addEventListener('click', () => {
        document.querySelector('[data-tab="studio"]').click();
        showToast('3D Doll Avatar configured successfully.');
    });

    // Sub-Tabs Switcher (Roman Numerals)
    document.querySelectorAll('.sidebar-tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-sidebar-tab');
            document.querySelectorAll('.sidebar-tab-btn').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.sidebar-content').forEach(c => {
                c.classList.toggle('hidden', c.id !== `sidebar-content-${target}`);
                c.classList.toggle('active', c.id === `sidebar-content-${target}`);
            });
        });
    });

    // Garment Configurator Bindings
    document.querySelectorAll('[data-silhouette]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-silhouette]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.silhouette = e.target.getAttribute('data-silhouette');
            rebuildSkirtGeometry();
        });
    });

    document.querySelectorAll('[data-sleeve]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-sleeve]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.sleeve = e.target.getAttribute('data-sleeve');
            rebuildSleeves();
        });
    });

    document.getElementById('fabric-color-picker')?.addEventListener('input', (e) => {
        state.fabricColor = e.target.value;
        document.getElementById('fabric-color-hex').textContent = state.fabricColor;
        updateMaterialShader();
    });

    document.querySelectorAll('[data-texture]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-texture]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.texture = e.target.getAttribute('data-texture');
            updateMaterialShader();
        });
    });

    // Fabrics search filter
    document.getElementById('fabric-search-input')?.addEventListener('input', (e) => {
        const cat = document.querySelector('#fabric-cat-filters .filter-btn.active')?.getAttribute('data-cat') || 'All';
        renderFabrics(cat, e.target.value);
    });

    // Modals & Chat
    document.getElementById('open-review-btn')?.addEventListener('click', () => document.getElementById('review-modal').classList.remove('hidden'));
    document.getElementById('close-review-btn')?.addEventListener('click', () => document.getElementById('review-modal').classList.add('hidden'));
    document.getElementById('submit-review-btn')?.addEventListener('click', () => {
        document.getElementById('review-modal').classList.add('hidden');
        showToast('Review submitted successfully!');
    });
});