/**
 * Atelier Global — Core Frontend Engine
 */

// ============================================================================
// 1. GLOBAL STATE MANAGEMENT & UI TOAST
// ============================================================================
const state = {
    activeTab: 'doll',
    activeSidebarTab: 'I',
    avatarType: 'petite',
    avatarSkinColor: '#F5D0C5',
    avatarHeight: 1.0,
    avatarPose: 'runway',
    silhouette: 'a-line',
    neckline: 'sweetheart',
    sleeve: 'sleeveless',
    fabricColor: '#6B4E3D',
    texture: 'Silk',
    cameraPreset: '360',
    userRating: 5
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

// ============================================================================
// 2. THREE.JS 3D AVATAR DOLL ENGINE (GAME/ROBLOX STYLE)
// ============================================================================
let dollScene, dollCamera, dollRenderer, dollControls;
let dollAvatarGroup, headMesh, torsoMesh, leftArmMesh, rightArmMesh, leftLegMesh, rightLegMesh;
let dollMaterial;

function initDollThreeJS() {
    const container = document.getElementById('doll-canvas-container');
    if (!container) return;

    dollScene = new THREE.Scene();
    dollScene.background = new THREE.Color(0xF5F0EB);

    dollCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    dollCamera.position.set(0, 1.0, 4.0);

    dollRenderer = new THREE.WebGLRenderer({ antialias: true });
    dollRenderer.setSize(container.clientWidth, container.clientHeight);
    dollRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    dollRenderer.shadowMap.enabled = true;

    container.appendChild(dollRenderer.domElement);

    if (THREE.OrbitControls) {
        dollControls = new THREE.OrbitControls(dollCamera, dollRenderer.domElement);
        dollControls.enableDamping = true;
        dollControls.dampingFactor = 0.05;
        dollControls.minDistance = 1.8;
        dollControls.maxDistance = 6.0;
        dollControls.target.set(0, 0.8, 0);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    dollScene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(3, 5, 4);
    dirLight.castShadow = true;
    dollScene.add(dirLight);

    build3DAvatarDoll();

    const animateDoll = () => {
        requestAnimationFrame(animateDoll);
        if (dollControls) dollControls.update();

        if (dollAvatarGroup) {
            dollAvatarGroup.rotation.y += 0.003;
        }

        dollRenderer.render(dollScene, dollCamera);
    };
    animateDoll();

    window.addEventListener('resize', onDollResize);
}

function build3DAvatarDoll() {
    dollAvatarGroup = new THREE.Group();
    dollAvatarGroup.position.set(0, -0.4, 0);

    dollMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(state.avatarSkinColor),
        roughness: 0.4,
        metalness: 0.05
    });

    // Head
    const headGeo = new THREE.SphereGeometry(0.28, 32, 32);
    headMesh = new THREE.Mesh(headGeo, dollMaterial);
    headMesh.position.set(0, 1.85, 0);
    headMesh.castShadow = true;
    dollAvatarGroup.add(headMesh);

    // Torso
    const torsoGeo = new THREE.CylinderGeometry(0.22, 0.18, 0.7, 32);
    torsoMesh = new THREE.Mesh(torsoGeo, dollMaterial);
    torsoMesh.position.set(0, 1.25, 0);
    torsoMesh.castShadow = true;
    dollAvatarGroup.add(torsoMesh);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.6, 16);
    leftArmMesh = new THREE.Mesh(armGeo, dollMaterial);
    leftArmMesh.position.set(-0.33, 1.25, 0);
    leftArmMesh.castShadow = true;
    dollAvatarGroup.add(leftArmMesh);

    rightArmMesh = new THREE.Mesh(armGeo, dollMaterial);
    rightArmMesh.position.set(0.33, 1.25, 0);
    rightArmMesh.castShadow = true;
    dollAvatarGroup.add(rightArmMesh);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.8, 16);
    leftLegMesh = new THREE.Mesh(legGeo, dollMaterial);
    leftLegMesh.position.set(-0.12, 0.45, 0);
    leftLegMesh.castShadow = true;
    dollAvatarGroup.add(leftLegMesh);

    rightLegMesh = new THREE.Mesh(legGeo, dollMaterial);
    rightLegMesh.position.set(0.12, 0.45, 0);
    rightLegMesh.castShadow = true;
    dollAvatarGroup.add(rightLegMesh);

    dollScene.add(dollAvatarGroup);
    updateAvatarProportions();
}

function updateAvatarProportions() {
    if (!dollAvatarGroup) return;

    dollMaterial.color.set(state.avatarSkinColor);
    dollAvatarGroup.scale.set(1.0, state.avatarHeight, 1.0);

    let torsoWidth = 1.0;
    if (state.avatarType === 'petite') torsoWidth = 0.85;
    if (state.avatarType === 'curvy') torsoWidth = 1.25;

    if (torsoMesh) torsoMesh.scale.set(torsoWidth, 1.0, torsoWidth);

    if (state.avatarPose === 'poseA') {
        if (leftArmMesh) leftArmMesh.rotation.z = 0.45;
        if (rightArmMesh) rightArmMesh.rotation.z = -0.45;
    } else {
        if (leftArmMesh) leftArmMesh.rotation.z = 0.1;
        if (rightArmMesh) rightArmMesh.rotation.z = -0.1;
    }
}

function onDollResize() {
    const container = document.getElementById('doll-canvas-container');
    if (!container || !dollRenderer || !dollCamera) return;

    dollCamera.aspect = container.clientWidth / container.clientHeight;
    dollCamera.updateProjectionMatrix();
    dollRenderer.setSize(container.clientWidth, container.clientHeight);
}

// ============================================================================
// 3. THREE.JS 3D DRESS CANVAS ENGINE
// ============================================================================
let scene, camera, renderer, controls;
let dressMeshGroup, bodiceMesh, skirtMesh, necklineMesh, sleevesGroup;
let dressMaterial;

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
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        container.appendChild(renderer.domElement);

        if (THREE.OrbitControls) {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 1.5;
            controls.maxDistance = 7;
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
        keyLight.position.set(5, 8, 5);
        keyLight.castShadow = true;
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight.position.set(-5, -2, -5);
        scene.add(fillLight);

        createProceduralDress();

        const animate = () => {
            requestAnimationFrame(animate);
            if (controls) controls.update();

            if (state.cameraPreset === '360' && dressMeshGroup) {
                dressMeshGroup.rotation.y += 0.005;
            }

            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', onWindowResize);

    } catch (error) {
        console.error('WebGL Initialization Error:', error);
        if (errorOverlay) errorOverlay.classList.remove('hidden');
    }
}

function createProceduralDress() {
    dressMeshGroup = new THREE.Group();
    dressMeshGroup.position.set(0, -1.2, 0);

    dressMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(state.fabricColor),
        roughness: 0.3,
        metalness: 0.1,
        clearcoat: 0.5
    });

    const bodiceGeo = new THREE.CylinderGeometry(0.4, 0.35, 1.1, 32);
    bodiceMesh = new THREE.Mesh(bodiceGeo, dressMaterial);
    bodiceMesh.position.set(0, 2.2, 0);
    bodiceMesh.castShadow = true;
    dressMeshGroup.add(bodiceMesh);

    rebuildSkirtGeometry();

    const neckGeo = new THREE.ConeGeometry(0.3, 0.4, 32);
    necklineMesh = new THREE.Mesh(neckGeo, new THREE.MeshStandardMaterial({ color: 0x3A2E2B }));
    necklineMesh.position.set(0, 2.65, 0.2);
    necklineMesh.rotation.x = 0.4;
    dressMeshGroup.add(necklineMesh);

    sleevesGroup = new THREE.Group();
    dressMeshGroup.add(sleevesGroup);
    rebuildSleeves();

    scene.add(dressMeshGroup);
}

function rebuildSkirtGeometry() {
    if (skirtMesh) dressMeshGroup.remove(skirtMesh);

    let radius = 1.2;
    if (state.silhouette === 'ballgown') radius = 1.8;
    if (state.silhouette === 'column') radius = 0.7;

    const skirtGeo = new THREE.CylinderGeometry(0.36, radius, 3.2, 48);
    skirtMesh = new THREE.Mesh(skirtGeo, dressMaterial);
    skirtMesh.position.set(0, 0.9, 0);
    skirtMesh.castShadow = true;
    dressMeshGroup.add(skirtMesh);
}

function rebuildSleeves() {
    while (sleevesGroup.children.length > 0) {
        sleevesGroup.remove(sleevesGroup.children[0]);
    }

    if (state.sleeve === 'long') {
        const sleeveGeo = new THREE.CylinderGeometry(0.12, 0.09, 1.2, 16);
        const leftSleeve = new THREE.Mesh(sleeveGeo, dressMaterial);
        leftSleeve.position.set(-0.55, 2.3, 0);
        leftSleeve.rotation.z = 0.3;

        const rightSleeve = new THREE.Mesh(sleeveGeo, dressMaterial);
        rightSleeve.position.set(0.55, 2.3, 0);
        rightSleeve.rotation.z = -0.3;

        sleevesGroup.add(leftSleeve);
        sleevesGroup.add(rightSleeve);
    }
}

function updateMaterialShader() {
    if (!dressMaterial) return;
    dressMaterial.color.set(state.fabricColor);

    switch (state.texture) {
        case 'Silk':
        case 'Satin':
            dressMaterial.roughness = 0.15;
            dressMaterial.clearcoat = 0.8;
            dressMaterial.wireframe = false;
            break;
        case 'Velvet':
            dressMaterial.roughness = 0.9;
            dressMaterial.clearcoat = 0.1;
            dressMaterial.wireframe = false;
            break;
        case 'Lace':
            dressMaterial.roughness = 0.6;
            dressMaterial.wireframe = true;
            break;
        default:
            dressMaterial.roughness = 0.4;
            dressMaterial.wireframe = false;
    }
}

function applyCameraPreset(preset) {
    state.cameraPreset = preset;
    if (!camera) return;

    switch (preset) {
        case 'top':
            camera.position.set(0, 5, 0.1);
            break;
        case 'front':
            camera.position.set(0, 0.5, 4.5);
            break;
        case 'macro':
            camera.position.set(0, 1.2, 1.8);
            break;
        default:
            camera.position.set(0, 0.5, 4.5);
    }
    if (controls) controls.target.set(0, 0.5, 0);
}

function onWindowResize() {
    const container = document.getElementById('three-canvas-container');
    if (!container || !renderer || !camera) return;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// ============================================================================
// 4. 100+ FABRICS CATALOG GENERATOR
// ============================================================================
const fabricsDatabase = [];

function generate100Fabrics() {
    const categories = ['Silks', 'Velvets', 'Laces', 'Organza & Tulle'];
    let id = 1;

    categories.forEach(cat => {
        for (let i = 1; i <= 25; i++) {
            fabricsDatabase.push({
                id: id++,
                name: `${cat.slice(0, -1)} Variant Grade ${i * 4}`,
                category: cat
            });
        }
    });
}

function renderFabrics(filterCat = 'All', searchQuery = '') {
    const grid = document.getElementById('fabric-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const filtered = fabricsDatabase.filter(f => {
        const matchesCat = filterCat === 'All' || f.category === filterCat;
        const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<p class="text-xs text-taupe col-span-4 text-center py-8">No textiles matched your criteria.</p>';
        return;
    }

    filtered.forEach(fabric => {
        const card = document.createElement('div');
        card.className = 'p-4 bg-cream border border-[#E6DDD3] rounded-xl cursor-pointer hover:border-charcoal transition-all';
        card.innerHTML = `
            <span class="text-[9px] uppercase tracking-widest text-taupe">${fabric.category}</span>
            <h4 class="font-serif text-sm mt-1 text-charcoal">${fabric.name}</h4>
        `;
        card.addEventListener('click', () => {
            showToast(`Selected Material: ${fabric.name}`);
        });
        grid.appendChild(card);
    });
}

// ============================================================================
// 5. EVENT LISTENERS & INTERACTION BINDINGS
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    initDollThreeJS();
    initThreeJS();
    generate100Fabrics();
    renderFabrics();

    const navButtons = document.querySelectorAll('#main-nav .nav-btn');
    const tabViews = document.querySelectorAll('.tab-view');

    function switchMainTab(tabId) {
        navButtons.forEach(b => {
            if (b.getAttribute('data-tab') === tabId) b.classList.add('active');
            else b.classList.remove('active');
        });

        tabViews.forEach(view => {
            if (view.id === `view-${tabId}`) {
                view.classList.remove('hidden');
                view.classList.add('active');
            } else {
                view.classList.add('hidden');
                view.classList.remove('active');
            }
        });

        if (tabId === 'doll') {
            setTimeout(onDollResize, 100);
        } else if (tabId === 'studio') {
            setTimeout(onWindowResize, 100);
        }
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => switchMainTab(btn.getAttribute('data-tab')));
    });

    // Avatar Controls Handlers
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

    document.querySelectorAll('[data-avatar-pose]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-avatar-pose]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.avatarPose = e.target.getAttribute('data-avatar-pose');
            updateAvatarProportions();
        });
    });

    const goToDesignBtn = document.getElementById('go-to-design-btn');
    if (goToDesignBtn) {
        goToDesignBtn.addEventListener('click', () => {
            switchMainTab('studio');
            showToast('3D Doll Avatar configured. Ready to design dress.');
        });
    }

    // Sidebar Sub-Tabs Handler
    const sidebarTabs = document.querySelectorAll('.sidebar-tab-btn');
    const sidebarContents = document.querySelectorAll('.sidebar-content');

    sidebarTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-sidebar-tab');

            sidebarTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            sidebarContents.forEach(c => {
                if (c.id === `sidebar-content-${target}`) {
                    c.classList.remove('hidden');
                    c.classList.add('active');
                } else {
                    c.classList.add('hidden');
                    c.classList.remove('active');
                }
            });
        });
    });

    // Garment Options
    document.querySelectorAll('[data-silhouette]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-silhouette]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.silhouette = e.target.getAttribute('data-silhouette');
            rebuildSkirtGeometry();
        });
    });

    document.querySelectorAll('[data-neckline]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-neckline]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.neckline = e.target.getAttribute('data-neckline');
            showToast(`Neckline set to ${state.neckline}`);
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

    document.querySelectorAll('[data-cam]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-cam]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            applyCameraPreset(e.target.getAttribute('data-cam'));
        });
    });

    const colorPicker = document.getElementById('fabric-color-picker');
    const colorHexLabel = document.getElementById('fabric-color-hex');

    if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
            state.fabricColor = e.target.value;
            if (colorHexLabel) colorHexLabel.textContent = state.fabricColor;
            updateMaterialShader();
        });
    }

    document.querySelectorAll('[data-texture]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-texture]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.texture = e.target.getAttribute('data-texture');
            updateMaterialShader();
        });
    });

    // Modal Rating Handlers
    const reviewModal = document.getElementById('review-modal');
    const openReviewBtn = document.getElementById('open-review-btn');
    const closeReviewBtn = document.getElementById('close-review-btn');
    const submitReviewBtn = document.getElementById('submit-review-btn');

    if (openReviewBtn) openReviewBtn.addEventListener('click', () => reviewModal.classList.remove('hidden'));
    if (closeReviewBtn) closeReviewBtn.addEventListener('click', () => reviewModal.classList.add('hidden'));

    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', () => {
            reviewModal.classList.add('hidden');
            showToast('Thank you for rating Atelier Global!');
        });
    }
});