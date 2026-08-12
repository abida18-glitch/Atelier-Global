/**
 * Atelier Global — Core App Engine, Three.js 3D Virtual Mannequin, 100+ Catalogues & Persistent Server Session
 */

const state = {
    currentUser: null, // Saved in localStorage so it never drops into guest mode unexpectedly
    activeTab: 'doll',
    avatarHeight: 1.0,
    bustCircumference: 1.0,
    waistCircumference: 1.0,
    hipsCircumference: 1.0,
    silhouette: 'a-line',
    neckline: 'sweetheart',
    sleeve: 'sleeveless',
    fabricColor: '#990033',
    texture: 'Silk',
    cameraPreset: '360',
    cart: [
        { id: 'item-1', name: 'Custom Silk Gown (A-Line)', price: 3450, quantity: 1 }
    ]
};

// Toast Notification Engine
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
// PERSISTENT SERVER SESSION MANAGEMENT
// ---------------------------------------------------------------------------
function initAuthSession() {
    const savedUser = localStorage.getItem('atelier_current_user');
    if (savedUser) {
        state.currentUser = JSON.parse(savedUser);
        updateAuthNavUI();
    }
}

function updateAuthNavUI() {
    const authBtn = document.getElementById('nav-auth-status');
    if (!authBtn) return;
    if (state.currentUser) {
        authBtn.textContent = `VIP: ${state.currentUser.name || state.currentUser.email}`;
        authBtn.classList.add('bg-sage-light', 'text-sage', 'border-sage');
    } else {
        authBtn.textContent = 'Sign In';
        authBtn.classList.remove('bg-sage-light', 'text-sage', 'border-sage');
    }
}

// ---------------------------------------------------------------------------
// THREE.JS 3D PARAMETRIC MANNEQUIN & DRESS OVERLAY
// ---------------------------------------------------------------------------
let scene, camera, renderer, controls;
let mannequinGroup, upperChestMesh, lowerTorsoMesh, hipsMesh, dressOverlayMesh;

function initThreeMannequin() {
    const container = document.getElementById('doll-canvas-container');
    if (!container) return;

    try {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xF5F0EB);

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 520;

        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 1.2, 4.5);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.target.set(0, 1.0, 0);
        }

        // Professional Studio Lighting
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(3, 5, 4);
        scene.add(dirLight);

        const rimLight = new THREE.PointLight(0xffffff, 0.5, 10);
        rimLight.position.set(-3, 3, -3);
        scene.add(rimLight);

        buildMannequinHierarchy();

        const animate = () => {
            requestAnimationFrame(animate);
            if (controls) controls.update();
            if (mannequinGroup) mannequinGroup.rotation.y += 0.003;
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            if (!container || !renderer || !camera) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            if (w > 0 && h > 0) {
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            }
        });
    } catch (e) {
        console.error("Three.js Init Error:", e);
    }
}

function buildMannequinHierarchy() {
    mannequinGroup = new THREE.Group();
    mannequinGroup.position.set(0, -0.4, 0);

    const studioGrayMaterial = new THREE.MeshStandardMaterial({
        color: 0xD8D2CB,
        roughness: 0.6,
        metalness: 0.1
    });

    // 1. Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 32), studioGrayMaterial);
    head.position.set(0, 2.15, 0);
    mannequinGroup.add(head);

    // 2. Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.25, 16), studioGrayMaterial);
    neck.position.set(0, 1.9, 0);
    mannequinGroup.add(neck);

    // 3. Upper Chest (Bust)
    upperChestMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.6, 32), studioGrayMaterial);
    upperChestMesh.position.set(0, 1.45, 0);
    mannequinGroup.add(upperChestMesh);

    // 4. Lower Torso (Waist)
    lowerTorsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.30, 0.5, 32), studioGrayMaterial);
    lowerTorsoMesh.position.set(0, 0.95, 0);
    mannequinGroup.add(lowerTorsoMesh);

    // 5. Hips / Pelvis
    hipsMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.28, 0.45, 32), studioGrayMaterial);
    hipsMesh.position.set(0, 0.52, 0);
    mannequinGroup.add(hipsMesh);

    // Arms & Legs
    const armGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.8, 16);
    const leftArm = new THREE.Mesh(armGeo, studioGrayMaterial);
    leftArm.position.set(-0.42, 1.35, 0);
    leftArm.rotation.z = 0.15;
    mannequinGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, studioGrayMaterial);
    rightArm.position.set(0.42, 1.35, 0);
    rightArm.rotation.z = -0.15;
    mannequinGroup.add(rightArm);

    const legGeo = new THREE.CylinderGeometry(0.09, 0.07, 1.0, 16);
    const leftLeg = new THREE.Mesh(legGeo, studioGrayMaterial);
    leftLeg.position.set(-0.16, -0.15, 0);
    mannequinGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, studioGrayMaterial);
    rightLeg.position.set(0.16, -0.15, 0);
    mannequinGroup.add(rightLeg);

    // 6. Digital Dress Overlay (Crimson red translucent foundation)
    updateDressOverlayMesh();

    scene.add(mannequinGroup);
}

function updateDressOverlayMesh() {
    if (!mannequinGroup) return;
    if (dressOverlayMesh) mannequinGroup.remove(dressOverlayMesh);

    let skirtRadius = state.silhouette === 'ballgown' ? 1.4 : state.silhouette === 'column' ? 0.45 : 0.85;

    const dressMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(state.fabricColor),
        roughness: 0.3,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });

    dressOverlayMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.35, skirtRadius, 1.8, 32), dressMat);
    dressOverlayMesh.position.set(0, 0.95, 0);
    mannequinGroup.add(dressOverlayMesh);
}

function updateMannequinProportions() {
    if (!mannequinGroup) return;
    mannequinGroup.scale.set(1.0, state.avatarHeight, 1.0);
    if (upperChestMesh) upperChestMesh.scale.set(state.bustCircumference, 1.0, state.bustCircumference);
    if (lowerTorsoMesh) lowerTorsoMesh.scale.set(state.waistCircumference, 1.0, state.waistCircumference);
    if (hipsMesh) hipsMesh.scale.set(state.hipsCircumference, 1.0, state.hipsCircumference);
    if (dressOverlayMesh) {
        dressOverlayMesh.scale.set(state.bustCircumference, state.avatarHeight, state.bustCircumference);
    }
}

// ---------------------------------------------------------------------------
// 100+ FABRICS DIRECTORY GENERATION WITH IMAGES & YARD PRICING
// ---------------------------------------------------------------------------
const fabricsDatabase = [];
function generate100Fabrics() {
    const sampleImages = {
        'Silks': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80',
        'Velvets': 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=400&q=80',
        'Laces': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
        'Organza & Tulle': 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=400&q=80'
    };

    ['Silks', 'Velvets', 'Laces', 'Organza & Tulle'].forEach(cat => {
        for (let i = 1; i <= 25; i++) {
            fabricsDatabase.push({
                id: `FAB-${cat.slice(0,3).toUpperCase()}-${i}`,
                name: `${cat.slice(0, -1)} Grade ${i * 4}`,
                category: cat,
                pricePerYard: 45 + (i * 8),
                image: sampleImages[cat]
            });
        }
    });
}

function renderFabrics(filterCat = 'All', searchQuery = '') {
    const grid = document.getElementById('fabric-grid');
    if (!grid) return;
    grid.innerHTML = '';

    fabricsDatabase
        .filter(f => (filterCat === 'All' || f.category === filterCat) && f.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .forEach(fab => {
            const card = document.createElement('div');
            card.className = 'bg-sand border border-[#E6DDD3] rounded-xl overflow-hidden flex flex-col justify-between group shadow-sm';
            card.innerHTML = `
                <div class="h-32 w-full overflow-hidden bg-cream relative">
                    <img src="${fab.image}" alt="${fab.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <span class="absolute top-2 left-2 bg-charcoal/80 text-cream text-[8px] uppercase tracking-wider px-2 py-0.5 rounded">${fab.category}</span>
                </div>
                <div class="p-3 space-y-1.5">
                    <h4 class="font-serif text-xs font-semibold">${fab.name}</h4>
                    <div class="flex justify-between items-center text-[11px]">
                        <span class="text-taupe">$${fab.pricePerYard} / yard</span>
                        <button class="select-fabric-btn px-2.5 py-1 bg-charcoal text-cream text-[10px] uppercase rounded hover:bg-taupe" data-id="${fab.id}">Select</button>
                    </div>
                </div>
            `;
            card.querySelector('.select-fabric-btn').addEventListener('click', () => {
                state.cart.push({ id: fab.id, name: `${fab.name} (3 Yards)`, price: fab.pricePerYard * 3, quantity: 3 });
                showToast(`Added ${fab.name} (3 yards) to cart`);
                updateCheckoutCartSummary();
            });
            grid.appendChild(card);
        });
}

// ---------------------------------------------------------------------------
// 100+ EMBELLISHMENTS DIRECTORY GENERATION
// ---------------------------------------------------------------------------
const embellishmentsDatabase = [];
function generate100Embellishments() {
    const sampleImages = {
        'Pearls': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
        'Crystals': 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=400&q=80',
        'Threads': 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=400&q=80'
    };

    ['Pearls', 'Crystals', 'Threads'].forEach(cat => {
        for (let i = 1; i <= 35; i++) {
            embellishmentsDatabase.push({
                id: `EMB-${cat.slice(0,3).toUpperCase()}-${i}`,
                name: `${cat.slice(0, -1)} Handcrafted Motif #${i}`,
                category: cat,
                price: 120 + (i * 5),
                image: sampleImages[cat] || sampleImages['Pearls']
            });
        }
    });
}

function renderEmbellishments(filterCat = 'All', searchQuery = '') {
    const grid = document.getElementById('embellish-grid');
    if (!grid) return;
    grid.innerHTML = '';

    embellishmentsDatabase
        .filter(e => (filterCat === 'All' || e.category === filterCat) && e.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .forEach(emb => {
            const card = document.createElement('div');
            card.className = 'bg-sand border border-[#E6DDD3] rounded-xl overflow-hidden flex flex-col justify-between group shadow-sm';
            card.innerHTML = `
                <div class="h-32 w-full overflow-hidden bg-cream relative">
                    <img src="${emb.image}" alt="${emb.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <span class="absolute top-2 left-2 bg-charcoal/80 text-cream text-[8px] uppercase tracking-wider px-2 py-0.5 rounded">${emb.category}</span>
                </div>
                <div class="p-3 space-y-1.5">
                    <h4 class="font-serif text-xs font-semibold">${emb.name}</h4>
                    <div class="flex justify-between items-center text-[11px]">
                        <span class="text-taupe">$${emb.price}</span>
                        <button class="select-emb-btn px-2.5 py-1 bg-charcoal text-cream text-[10px] uppercase rounded hover:bg-taupe" data-id="${emb.id}">Add</button>
                    </div>
                </div>
            `;
            card.querySelector('.select-emb-btn').addEventListener('click', () => {
                state.cart.push({ id: emb.id, name: emb.name, price: emb.price, quantity: 1 });
                showToast(`Added ${emb.name} to commission order`);
                updateCheckoutCartSummary();
            });
            grid.appendChild(card);
        });
}

// ---------------------------------------------------------------------------
// DESIGNERS COMMISSION DIRECTORY & REGISTRATION FEATURE
// ---------------------------------------------------------------------------
const designersDatabase = [
    { name: 'Maison Vianney', country: 'Paris, France', spec: 'Haute Couture & Silk Draping ($4,200+)', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80' },
    { name: 'Studio Bellini', country: 'Milan, Italy', spec: 'Tailored Velvet & Swarovski Crystals ($3,800+)', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80' },
    { name: 'Kenji Takahashi', country: 'Tokyo, Japan', spec: 'Minimalist Organza & Architectural Form ($5,000+)', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80' }
];

function renderDesigners(searchQuery = '') {
    const grid = document.getElementById('designer-grid');
    if (!grid) return;
    grid.innerHTML = '';

    designersDatabase
        .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.country.toLowerCase().includes(searchQuery.toLowerCase()) || d.spec.toLowerCase().includes(searchQuery.toLowerCase()))
        .forEach(des => {
            const card = document.createElement('div');
            card.className = 'bg-sand border border-[#E6DDD3] rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm';
            card.innerHTML = `
                <div class="h-48 w-full overflow-hidden relative">
                    <img src="${des.img}" alt="${des.name}" class="w-full h-full object-cover">
                    <span class="absolute bottom-2 left-2 bg-charcoal/80 text-cream text-[9px] uppercase tracking-wider px-2.5 py-1 rounded backdrop-blur-sm">${des.country}</span>
                </div>
                <div class="p-5 space-y-3">
                    <h3 class="font-serif text-base font-semibold">${des.name}</h3>
                    <p class="text-xs text-taupe">${des.spec}</p>
                    <button class="commission-designer-btn w-full py-2.5 bg-charcoal text-cream text-[10px] uppercase tracking-wider rounded-xl hover:bg-taupe" data-name="${des.name}">Commission Designer</button>
                </div>
            `;
            card.querySelector('.commission-designer-btn').addEventListener('click', (e) => {
                showToast(`Consultation requested with master designer ${e.target.getAttribute('data-name')}`);
            });
            grid.appendChild(card);
        });
}

// ---------------------------------------------------------------------------
// CLEARANCE RACK DIRECTORY
// ---------------------------------------------------------------------------
const clearanceDatabase = [
    { name: 'Archive Runway Gown #01', price: 1200, originalPrice: 4500, img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=500&q=80' },
    { name: 'Parisian Silk Cocktail Dress', price: 850, originalPrice: 2800, img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80' },
    { name: 'Milan Velvet Evening Dress', price: 990, originalPrice: 3400, img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=500&q=80' },
    { name: 'Tokyo Organza Ceremonial Robe', price: 1450, originalPrice: 5200, img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=80' }
];

function renderClearance() {
    const grid = document.getElementById('clearance-grid');
    if (!grid) return;
    grid.innerHTML = '';

    clearanceDatabase.forEach(item => {
        const card = document.createElement('div');
        card.className = 'bg-sand border border-[#E6DDD3] rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm';
        card.innerHTML = `
            <div class="h-60 w-full overflow-hidden relative">
                <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover">
                <span class="absolute top-2 right-2 bg-red-900 text-cream text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">Clearance Sale</span>
            </div>
            <div class="p-4 space-y-3">
                <h4 class="font-serif text-sm font-semibold">${item.name}</h4>
                <div class="flex items-center space-x-2 text-xs">
                    <span class="font-bold text-red-900">$${item.price}</span>
                    <span class="line-through text-taupe">$${item.originalPrice}</span>
                </div>
                <button class="buy-clearance-btn w-full py-2.5 bg-charcoal text-cream text-[10px] uppercase tracking-wider rounded-xl hover:bg-taupe" data-name="${item.name}" data-price="${item.price}">Acquire Sample</button>
            </div>
        `;
        card.querySelector('.buy-clearance-btn').addEventListener('click', (e) => {
            state.cart.push({ id: 'CLR-' + Math.random(), name: e.target.getAttribute('data-name'), price: parseFloat(e.target.getAttribute('data-price')), quantity: 1 });
            showToast(`Added ${e.target.getAttribute('data-name')} to cart`);
            updateCheckoutCartSummary();
        });
        grid.appendChild(card);
    });
}

// ---------------------------------------------------------------------------
// CHECKOUT CART SUMMARY UPDATER
// ---------------------------------------------------------------------------
function updateCheckoutCartSummary() {
    const container = document.getElementById('checkout-cart-items');
    const totalEl = document.getElementById('checkout-total-price');
    if (!container || !totalEl) return;

    container.innerHTML = '';
    let total = 0;

    state.cart.forEach(item => {
        total += item.price * (item.quantity || 1);
        const row = document.createElement('div');
        row.className = 'flex justify-between text-xs text-taupe';
        row.innerHTML = `<span>${item.name} (x${item.quantity || 1})</span> <span class="font-mono">$${item.price * (item.quantity || 1)}</span>`;
        container.appendChild(row);
    });

    totalEl.textContent = `$${total.toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// LIVE GOOGLE MAPS SHIPMENT TRACKING DATABASE
// ---------------------------------------------------------------------------
const shipmentsDatabase = {
    'ATG-8902-PARIS': { waybill: 'ATG-8902-PARIS', status: 'In Transit — Paris Hub', query: 'Charles+de+Gaulle+Airport+Paris', origin: 'Rue Saint-Honoré, Paris', destination: '5th Ave, New York, NY', eta: 'Oct 28, 2026', courier: 'DHL Haute Express' },
    'ATG-1042-MILAN': { waybill: 'ATG-1042-MILAN', status: 'Tailoring Completed — Milan', query: 'Via+Monte+Napoleone+Milan', origin: 'Via Monte Napoleone, Milan', destination: 'Bond Street, London', eta: 'Nov 02, 2026', courier: 'FedEx Couture Direct' },
    'ATG-5521-NY': { waybill: 'ATG-5521-NY', status: 'Out for Local Courier Delivery', query: 'Manhattan+New+York+USA', origin: 'SoHo Atelier, New York', destination: 'Upper East Side, NY', eta: 'Today, 18:00', courier: 'Atelier White Glove Valet' }
};

function updateShipmentTracking(code) {
    const cleanCode = code.trim().toUpperCase();
    const data = shipmentsDatabase[cleanCode] || {
        waybill: cleanCode, status: 'In Custom Logistics Transit', query: encodeURIComponent(cleanCode), origin: 'Atelier Central Paris', destination: 'Global Client Address', eta: 'Pending Scan', courier: 'Global Express'
    };

    document.getElementById('map-waybill-title').textContent = `Waybill #${data.waybill}`;
    document.getElementById('map-location-badge').textContent = data.status;
    document.getElementById('info-origin').textContent = data.origin;
    document.getElementById('info-destination').textContent = data.destination;
    document.getElementById('info-eta').textContent = data.eta;
    document.getElementById('info-courier').textContent = data.courier;

    const iframe = document.getElementById('google-map-iframe');
    if (iframe) {
        iframe.src = `https://maps.google.com/maps?q=${data.query}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
    }
    showToast(`Loaded tracking telemetry for #${data.waybill}`);
}

// ---------------------------------------------------------------------------
// DOM EVENT LISTENERS & INITIALIZERS
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initAuthSession();
    initThreeMannequin();
    generate100Fabrics();
    renderFabrics();
    generate100Embellishments();
    renderEmbellishments();
    renderDesigners();
    renderClearance();
    updateCheckoutCartSummary();

    // Navigation Tab Router
    const navButtons = document.querySelectorAll('#main-nav .nav-btn');
    const tabViews = document.querySelectorAll('.tab-view');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            navButtons.forEach(b => b.classList.toggle('active', b === btn));
            tabViews.forEach(v => {
                const match = v.id === `view-${tabId}`;
                v.classList.toggle('active', match);
                v.classList.toggle('hidden', !match);
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Mannequin Sliders
    const bindSlider = (id, stateKey, labelId, unit = 'x') => {
        const slider = document.getElementById(id);
        const label = document.getElementById(labelId);
        if (slider) {
            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                state[stateKey] = val;
                if (label) label.textContent = `${val.toFixed(2)}${unit}`;
                updateMannequinProportions();
            });
        }
    };

    bindSlider('slider-height', 'avatarHeight', 'val-height');
    bindSlider('slider-bust', 'bustCircumference', 'val-bust');
    bindSlider('slider-waist', 'waistCircumference', 'val-waist');
    bindSlider('slider-hips', 'hipsCircumference', 'val-hips');

    // Garment Architectural Options
    document.querySelectorAll('[data-silhouette]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-silhouette]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.silhouette = e.target.getAttribute('data-silhouette');
            updateDressOverlayMesh();
        });
    });

    document.querySelectorAll('[data-neckline]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-neckline]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.neckline = e.target.getAttribute('data-neckline');
        });
    });

    document.querySelectorAll('[data-sleeve]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-sleeve]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.sleeve = e.target.getAttribute('data-sleeve');
        });
    });

    const colorPicker = document.getElementById('fabric-color-picker');
    const colorHex = document.getElementById('fabric-color-hex');
    if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
            state.fabricColor = e.target.value;
            if (colorHex) colorHex.textContent = state.fabricColor;
            updateDressOverlayMesh();
        });
    }

    document.getElementById('proceed-fabrics-btn')?.addEventListener('click', () => {
        document.querySelector('[data-tab="fabrics"]').click();
    });

    // Fabric Search & Filter Listeners
    document.getElementById('fabric-search-input')?.addEventListener('input', (e) => {
        const cat = document.querySelector('#fabric-cat-filters .filter-btn.active')?.getAttribute('data-cat') || 'All';
        renderFabrics(cat, e.target.value);
    });

    document.querySelectorAll('#fabric-cat-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#fabric-cat-filters .filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderFabrics(e.target.getAttribute('data-cat'), document.getElementById('fabric-search-input')?.value || '');
        });
    });

    // Embellishment Search & Filter Listeners
    document.getElementById('embellish-search-input')?.addEventListener('input', (e) => {
        const cat = document.querySelector('#embellish-cat-filters .filter-btn.active')?.getAttribute('data-cat') || 'All';
        renderEmbellishments(cat, e.target.value);
    });

    document.querySelectorAll('#embellish-cat-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#embellish-cat-filters .filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderEmbellishments(e.target.getAttribute('data-cat'), document.getElementById('embellish-search-input')?.value || '');
        });
    });

    // AI Camera Usage Integration
    let cameraStream = null;
    document.getElementById('start-camera-btn')?.addEventListener('click', async () => {
        const video = document.getElementById('webcam-feed');
        const placeholder = document.getElementById('camera-placeholder-text');
        const scanBtn = document.getElementById('capture-scan-btn');

        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (video) {
                video.srcObject = cameraStream;
                video.classList.remove('hidden');
                if (placeholder) placeholder.classList.add('hidden');
                if (scanBtn) scanBtn.classList.remove('hidden');
                showToast("AI Camera feed active");
            }
        } catch (err) {
            showToast("Camera permission denied or unavailable.");
        }
    });

    document.getElementById('capture-scan-btn')?.addEventListener('click', () => {
        showToast("Scanning body ratios via AI camera...");
        setTimeout(() => {
            document.getElementById('bio-bust').textContent = '35.0 in';
            document.getElementById('bio-waist').textContent = '26.5 in';
            document.getElementById('bio-hip').textContent = '37.5 in';
            document.getElementById('bio-size').textContent = 'FR 38 / US 6';
            showToast("Biometric scan successfully recorded.");
        }, 1500);
    });

    // Designer Search & Registration Modal
    document.getElementById('designer-search-input')?.addEventListener('input', (e) => {
        renderDesigners(e.target.value);
    });

    const designerModal = document.getElementById('designer-modal');
    document.getElementById('open-designer-signup-btn')?.addEventListener('click', () => designerModal.classList.remove('hidden'));
    document.getElementById('close-designer-modal')?.addEventListener('click', () => designerModal.classList.add('hidden'));

    document.getElementById('designer-signup-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-des-name').value;
        const loc = document.getElementById('reg-des-loc').value;
        const spec = document.getElementById('reg-des-spec').value;
        const img = document.getElementById('reg-des-img').value;

        designersDatabase.unshift({ name, country: loc, spec, img });
        renderDesigners();
        designerModal.classList.add('hidden');
        showToast(`Designer profile for "${name}" successfully published.`);
    });

    // Checkout Form & Coupon
    document.getElementById('apply-coupon-btn')?.addEventListener('click', () => {
        const code = document.getElementById('coupon-input').value.trim();
        if (code === 'ATELIERVIP') {
            state.cart.push({ id: 'DISC', name: 'VIP 15% Architectural Discount', price: -517.5, quantity: 1 });
            updateCheckoutCartSummary();
            showToast("VIP Coupon successfully applied.");
        } else {
            showToast("Invalid coupon code.");
        }
    });

    document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast("Commission order securely authorized. Your international designer has been notified.");
    });

    // Live Tracking Form
    document.getElementById('tracking-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = document.getElementById('tracking-input').value;
        if (val) updateShipmentTracking(val);
    });

    document.querySelectorAll('.quick-waybill-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const code = e.target.getAttribute('data-waybill');
            document.getElementById('tracking-input').value = code;
            updateShipmentTracking(code);
        });
    });

    // AI Concierge Chatbot & Calendar
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (chatForm && chatInput && chatMessages) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            const userMsg = document.createElement('div');
            userMsg.className = 'p-3 bg-sage-light text-charcoal rounded-lg max-w-md ml-auto';
            userMsg.textContent = text;
            chatMessages.appendChild(userMsg);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            setTimeout(() => {
                const aiReply = document.createElement('div');
                aiReply.className = 'p-3 bg-cream border border-[#E6DDD3] rounded-lg max-w-md';
                aiReply.textContent = `Understood! I have registered your update ("${text}") and dispatched the pattern note to our master tailor in Paris.`;
                chatMessages.appendChild(aiReply);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        });
    }

    // Auth Modal & Persistent Server Simulation
    const authModal = document.getElementById('auth-modal');
    const authNavBtn = document.getElementById('nav-auth-status');
    let isRegisterMode = false;

    authNavBtn?.addEventListener('click', () => {
        if (state.currentUser) {
            if (confirm("Sign out of Atelier VIP Session?")) {
                state.currentUser = null;
                localStorage.removeItem('atelier_current_user');
                updateAuthNavUI();
                showToast("Signed out successfully.");
            }
        } else {
            authModal.classList.remove('hidden');
        }
    });

    document.getElementById('close-auth-modal')?.addEventListener('click', () => authModal.classList.add('hidden'));

    document.getElementById('toggle-auth-mode')?.addEventListener('click', () => {
        isRegisterMode = !isRegisterMode;
        document.getElementById('auth-modal-title').textContent = isRegisterMode ? 'Create Atelier VIP Profile' : 'Atelier Client Sign In';
        document.getElementById('auth-name-field').classList.toggle('hidden', !isRegisterMode);
        document.getElementById('auth-submit-btn').textContent = isRegisterMode ? 'Register & Save Profile' : 'Sign In To Atelier';
        document.getElementById('toggle-auth-mode').textContent = isRegisterMode ? 'Already have an account? Sign In' : 'Need an account? Create VIP Profile';
    });

    document.getElementById('auth-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const identifier = document.getElementById('auth-email-phone').value;
        const name = document.getElementById('auth-name')?.value || identifier.split('@')[0];

        state.currentUser = { name, identifier };
        localStorage.setItem('atelier_current_user', JSON.stringify(state.currentUser));
        updateAuthNavUI();
        authModal.classList.add('hidden');
        showToast(isRegisterMode ? "VIP Profile successfully created and saved!" : "Successfully signed into Atelier portal.");
    });
});