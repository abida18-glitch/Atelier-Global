/**
 * Atelier Global — Core Frontend Engine
 */

// ============================================================================
// 1. GLOBAL STATE MANAGEMENT & UI TOAST
// ============================================================================
const state = {
    activeTab: 'studio',
    activeSidebarTab: 'I',
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
// 2. THREE.JS 3D CANVAS & ENVIRONMENT ENGINE
// ============================================================================
let scene, camera, renderer, controls;
let dressMeshGroup, bodiceMesh, skirtMesh, necklineMesh, sleevesGroup;
let dressMaterial;

function initThreeJS() {
    const container = document.getElementById('three-canvas-container');
    const errorOverlay = document.getElementById('webgl-error');

    if (!container) return;

    try {
        // Scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xF5F0EB);

        // Camera setup
        camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 0.5, 4.5);

        // WebGL Renderer with Error Guarding
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        container.appendChild(renderer.domElement);

        // OrbitControls
        if (THREE.OrbitControls) {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 1.5;
            controls.maxDistance = 7;
        }

        // Professional Lighting Rig
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
        keyLight.position.set(5, 8, 5);
        keyLight.castShadow = true;
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight.position.set(-5, -2, -5);
        scene.add(fillLight);

        // Build Procedural 3D Dress Model
        createProceduralDress();

        // Render Loop
        const animate = () => {
            requestAnimationFrame(animate);
            if (controls) controls.update();

            // Auto rotation for 360 view
            if (state.cameraPreset === '360' && dressMeshGroup) {
                dressMeshGroup.rotation.y += 0.005;
            }

            renderer.render(scene, camera);
        };
        animate();

        // Responsive Resize Handler
        window.addEventListener('resize', onWindowResize);

    } catch (error) {
        console.error('WebGL Initialization Error:', error);
        if (errorOverlay) errorOverlay.classList.remove('hidden');
    }
}

function createProceduralDress() {
    dressMeshGroup = new THREE.Group();
    dressMeshGroup.position.set(0, -1.2, 0);

    // Dynamic Material Shader base
    dressMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(state.fabricColor),
        roughness: 0.3,
        metalness: 0.1,
        clearcoat: 0.5
    });

    // Bodice Geometry
    const bodiceGeo = new THREE.CylinderGeometry(0.4, 0.35, 1.1, 32);
    bodiceMesh = new THREE.Mesh(bodiceGeo, dressMaterial);
    bodiceMesh.position.set(0, 2.2, 0);
    bodiceMesh.castShadow = true;
    dressMeshGroup.add(bodiceMesh);

    // Skirt Geometry
    rebuildSkirtGeometry();

    // Neckline Detail Mesh
    const neckGeo = new THREE.ConeGeometry(0.3, 0.4, 32);
    necklineMesh = new THREE.Mesh(neckGeo, new THREE.MeshStandardMaterial({ color: 0x3A2E2B }));
    necklineMesh.position.set(0, 2.65, 0.2);
    necklineMesh.rotation.x = 0.4;
    dressMeshGroup.add(necklineMesh);

    // Sleeves Container Group
    sleevesGroup = new THREE.Group();
    dressMeshGroup.add(sleevesGroup);
    rebuildSleeves();

    scene.add(dressMeshGroup);
}

function rebuildSkirtGeometry() {
    if (skirtMesh) dressMeshGroup.remove(skirtMesh);

    let radius = 1.2; // A-Line
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
        default: // 360 mode
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
// 3. 100+ FABRICS CATALOG DYNAMIC GENERATOR
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
// 4. EVENT LISTENERS & INTERACTION BINDINGS
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize 3D Engine & Fabric Database
    initThreeJS();
    generate100Fabrics();
    renderFabrics();

    // Top Header Navigation Tabs Switcher
    const navButtons = document.querySelectorAll('#main-nav .nav-btn');
    const tabViews = document.querySelectorAll('.tab-view');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabViews.forEach(view => {
                if (view.id === `view-${tabId}`) {
                    view.classList.remove('hidden');
                    view.classList.add('active');
                } else {
                    view.classList.add('hidden');
                    view.classList.remove('active');
                }
            });

            // Trigger window resize update for Three canvas if returning to studio
            if (tabId === 'studio') {
                setTimeout(onWindowResize, 100);
            }
        });
    });

    // Sidebar Roman Numeral Sub-Tabs Switcher
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

    // 3D Garment Configurator Options (Silhouette, Neckline, Sleeve)
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

    // Camera Presets Buttons
    document.querySelectorAll('[data-cam]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-cam]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            applyCameraPreset(e.target.getAttribute('data-cam'));
        });
    });

    // Color Wheel & Texture Finish Handlers
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

    // AI Vision Search Handler
    const aiForm = document.getElementById('ai-search-form');
    if (aiForm) {
        aiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('ai-input').value;
            if (query.trim()) {
                showToast(`AI Vision searching web for: "${query}"`);
            }
        });
    }

    // Fabric Library Filters and Search Input
    const fabricSearchInput = document.getElementById('fabric-search-input');
    if (fabricSearchInput) {
        fabricSearchInput.addEventListener('input', (e) => {
            renderFabrics('All', e.target.value);
        });
    }

    document.querySelectorAll('#fabric-cat-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#fabric-cat-filters .filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderFabrics(e.target.getAttribute('data-cat'), fabricSearchInput ? fabricSearchInput.value : '');
        });
    });

    // AI Size Detector Trigger
    const startScanBtn = document.getElementById('start-scan-btn');
    const scanResults = document.getElementById('scan-results');
    const cameraStatus = document.getElementById('camera-status');

    if (startScanBtn) {
        startScanBtn.addEventListener('click', () => {
            if (cameraStatus) cameraStatus.textContent = 'Initializing AI Body Contour Detector...';
            startScanBtn.textContent = 'Scanning...';

            setTimeout(() => {
                if (cameraStatus) cameraStatus.textContent = 'Scan Analysis Complete';
                if (scanResults) scanResults.classList.remove('hidden');
                startScanBtn.textContent = 'Re-scan Fit';
                showToast('Bespoke measurements verified.');
            }, 2000);
        });
    }

    // Designer Direct Chat Form
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!chatInput || !chatInput.value.trim()) return;

            const userMsg = document.createElement('div');
            userMsg.className = 'p-3 bg-charcoal text-white rounded text-xs max-w-xs ml-auto';
            userMsg.textContent = chatInput.value;
            chatMessages.appendChild(userMsg);

            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            setTimeout(() => {
                const reply = document.createElement('div');
                reply.className = 'p-3 bg-cream border border-[#E6DDD3] rounded text-xs max-w-xs';
                reply.textContent = 'I have received your note and updated your commission specifications.';
                chatMessages.appendChild(reply);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1200);
        });
    }

    // Review Modal Controls
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

    // Star Rating Interactivity
    document.querySelectorAll('#star-rating .star').forEach(star => {
        star.addEventListener('click', (e) => {
            const val = parseInt(e.target.getAttribute('data-star'));
            state.userRating = val;
            document.querySelectorAll('#star-rating .star').forEach((s, idx) => {
                if (idx < val) {
                    s.classList.remove('text-taupe');
                    s.classList.add('text-charcoal');
                } else {
                    s.classList.remove('text-charcoal');
                    s.classList.add('text-taupe');
                }
            });
        });
    });

    // Checkout Form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Order successfully placed! Redirecting to tracking...');
        });
    }
});