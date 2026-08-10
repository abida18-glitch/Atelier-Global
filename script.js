/**
 * Atelier Global — Core App Engine & 3D WebGL Controller
 */

// const state = {
//     activeTab: 'doll',
//     avatarType: 'petite',
//     avatarSkinColor: '#F5D0C5',
//     avatarHeight: 1.0,
//     avatarPose: 'runway',
//     silhouette: 'a-line',
//     neckline: 'sweetheart',
//     sleeve: 'sleeveless',
//     fabricColor: '#6B4E3D',
//     texture: 'Silk',
//     cameraPreset: '360',
//     selectedRating: 5
// };

// function showToast(message) {
//     const toast = document.getElementById('toast');
//     const toastMsg = document.getElementById('toast-message');
//     if (!toast || !toastMsg) return;

//     toastMsg.textContent = message;
//     toast.classList.remove('hidden');
//     toast.style.opacity = '1';

//     setTimeout(() => {
//         toast.style.opacity = '0';
//         setTimeout(() => toast.classList.add('hidden'), 300);
//     }, 3000);
// }

// // ---------------------------------------------------------------------------
// // 3D DOLL THREE.JS CONTROLLER (Tab I)
// // ---------------------------------------------------------------------------
// let dollScene, dollCamera, dollRenderer, dollControls;
// let dollAvatarGroup, torsoMesh, dollMaterial;

// function initDollThreeJS() {
//     const container = document.getElementById('doll-canvas-container');
//     if (!container) return;

//     try {
//         dollScene = new THREE.Scene();
//         dollScene.background = new THREE.Color(0xF5F0EB);

//         dollCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
//         dollCamera.position.set(0, 1.0, 4.0);

//         dollRenderer = new THREE.WebGLRenderer({ antialias: true });
//         dollRenderer.setSize(container.clientWidth, container.clientHeight);
//         dollRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//         container.appendChild(dollRenderer.domElement);

//         if (typeof THREE.OrbitControls !== 'undefined') {
//             dollControls = new THREE.OrbitControls(dollCamera, dollRenderer.domElement);
//             dollControls.enableDamping = true;
//             dollControls.target.set(0, 0.8, 0);
//         }

//         dollScene.add(new THREE.AmbientLight(0xffffff, 0.8));
//         const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
//         dirLight.position.set(3, 5, 4);
//         dollScene.add(dirLight);

//         build3DAvatarDoll();

//         const animateDoll = () => {
//             requestAnimationFrame(animateDoll);
//             if (dollControls) dollControls.update();
//             if (dollAvatarGroup) dollAvatarGroup.rotation.y += 0.003;
//             dollRenderer.render(dollScene, dollCamera);
//         };
//         animateDoll();

//         window.addEventListener('resize', () => {
//             if (!container || !dollRenderer || !dollCamera) return;
//             dollCamera.aspect = container.clientWidth / container.clientHeight;
//             dollCamera.updateProjectionMatrix();
//             dollRenderer.setSize(container.clientWidth, container.clientHeight);
//         });
//     } catch (err) {
//         console.error("Doll Canvas Error:", err);
//     }
// }

// function build3DAvatarDoll() {
//     dollAvatarGroup = new THREE.Group();
//     dollAvatarGroup.position.set(0, -0.4, 0);

//     dollMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(state.avatarSkinColor), roughness: 0.4 });

//     const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), dollMaterial);
//     head.position.set(0, 1.85, 0);
//     dollAvatarGroup.add(head);

//     torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.7, 32), dollMaterial);
//     torsoMesh.position.set(0, 1.25, 0);
//     dollAvatarGroup.add(torsoMesh);

//     const armGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.6, 16);
//     const leftArm = new THREE.Mesh(armGeo, dollMaterial);
//     leftArm.position.set(-0.33, 1.25, 0);
//     dollAvatarGroup.add(leftArm);

//     const rightArm = new THREE.Mesh(armGeo, dollMaterial);
//     rightArm.position.set(0.33, 1.25, 0);
//     dollAvatarGroup.add(rightArm);

//     const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.8, 16);
//     const leftLeg = new THREE.Mesh(legGeo, dollMaterial);
//     leftLeg.position.set(-0.12, 0.45, 0);
//     dollAvatarGroup.add(leftLeg);

//     const rightLeg = new THREE.Mesh(legGeo, dollMaterial);
//     rightLeg.position.set(0.12, 0.45, 0);
//     dollAvatarGroup.add(rightLeg);

//     dollScene.add(dollAvatarGroup);
// }

// function updateAvatarProportions() {
//     if (!dollAvatarGroup) return;
//     dollMaterial.color.set(state.avatarSkinColor);
//     dollAvatarGroup.scale.set(1.0, state.avatarHeight, 1.0);
//     let torsoWidth = state.avatarType === 'petite' ? 0.85 : state.avatarType === 'curvy' ? 1.25 : 1.0;
//     if (torsoMesh) torsoMesh.scale.set(torsoWidth, 1.0, torsoWidth);
// }

// // ---------------------------------------------------------------------------
// // 3D DRESS DESIGNER THREE.JS CONTROLLER (Tab II)
// // ---------------------------------------------------------------------------
// let scene, camera, renderer, controls;
// let dressMeshGroup, skirtMesh, sleevesGroup, dressMaterial;

// function initThreeJS() {
//     const container = document.getElementById('three-canvas-container');
//     const errorOverlay = document.getElementById('webgl-error');
//     if (!container) return;

//     try {
//         scene = new THREE.Scene();
//         scene.background = new THREE.Color(0xF5F0EB);

//         camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
//         camera.position.set(0, 0.5, 4.5);

//         renderer = new THREE.WebGLRenderer({ antialias: true });
//         renderer.setSize(container.clientWidth, container.clientHeight);
//         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//         container.appendChild(renderer.domElement);

//         if (typeof THREE.OrbitControls !== 'undefined') {
//             controls = new THREE.OrbitControls(camera, renderer.domElement);
//             controls.enableDamping = true;
//         }

//         scene.add(new THREE.AmbientLight(0xffffff, 0.7));
//         const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
//         keyLight.position.set(5, 8, 5);
//         scene.add(keyLight);

//         createProceduralDress();

//         const animate = () => {
//             requestAnimationFrame(animate);
//             if (controls) controls.update();
//             if (state.cameraPreset === '360' && dressMeshGroup) dressMeshGroup.rotation.y += 0.005;
//             renderer.render(scene, camera);
//         };
//         animate();

//         window.addEventListener('resize', () => {
//             if (!container || !renderer || !camera) return;
//             camera.aspect = container.clientWidth / container.clientHeight;
//             camera.updateProjectionMatrix();
//             renderer.setSize(container.clientWidth, container.clientHeight);
//         });
//     } catch (error) {
//         console.error('WebGL Init Error:', error);
//         if (errorOverlay) errorOverlay.classList.remove('hidden');
//     }
// }

// function createProceduralDress() {
//     dressMeshGroup = new THREE.Group();
//     dressMeshGroup.position.set(0, -1.2, 0);

//     dressMaterial = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(state.fabricColor), roughness: 0.3 });
//     const bodice = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 1.1, 32), dressMaterial);
//     bodice.position.set(0, 2.2, 0);
//     dressMeshGroup.add(bodice);

//     rebuildSkirtGeometry();
//     sleevesGroup = new THREE.Group();
//     dressMeshGroup.add(sleevesGroup);
//     rebuildSleeves();

//     scene.add(dressMeshGroup);
// }

// function rebuildSkirtGeometry() {
//     if (skirtMesh) dressMeshGroup.remove(skirtMesh);
//     let radius = state.silhouette === 'ballgown' ? 1.8 : state.silhouette === 'column' ? 0.7 : 1.2;
//     skirtMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.36, radius, 3.2, 48), dressMaterial);
//     skirtMesh.position.set(0, 0.9, 0);
//     dressMeshGroup.add(skirtMesh);
// }

// function rebuildSleeves() {
//     while (sleevesGroup.children.length > 0) sleevesGroup.remove(sleevesGroup.children[0]);
//     if (state.sleeve === 'long') {
//         const sleeveGeo = new THREE.CylinderGeometry(0.12, 0.09, 1.2, 16);
//         const left = new THREE.Mesh(sleeveGeo, dressMaterial);
//         left.position.set(-0.55, 2.3, 0);
//         left.rotation.z = 0.3;
//         const right = new THREE.Mesh(sleeveGeo, dressMaterial);
//         right.position.set(0.55, 2.3, 0);
//         right.rotation.z = -0.3;
//         sleevesGroup.add(left);
//         sleevesGroup.add(right);
//     }
// }

// function updateCameraPreset(preset) {
//     state.cameraPreset = preset;
//     if (!camera || !controls) return;
//     if (preset === 'top') {
//         camera.position.set(0, 4.0, 0.1);
//         controls.target.set(0, 0, 0);
//     } else if (preset === 'front') {
//         camera.position.set(0, 0, 3.5);
//         controls.target.set(0, 0, 0);
//     } else if (preset === 'macro') {
//         camera.position.set(0, 1.2, 1.5);
//         controls.target.set(0, 1.0, 0);
//     } else {
//         camera.position.set(0, 0.5, 4.5);
//         controls.target.set(0, 0, 0);
//     }
// }

// function updateMaterialShader() {
//     if (!dressMaterial) return;
//     dressMaterial.color.set(state.fabricColor);
//     dressMaterial.roughness = state.texture === 'Velvet' ? 0.9 : 0.15;
// }

// // ---------------------------------------------------------------------------
// // 100+ FABRICS DIRECTORY GENERATOR
// // ---------------------------------------------------------------------------
// const fabricsDatabase = [];
// function generate100Fabrics() {
//     ['Silks', 'Velvets', 'Laces', 'Organza & Tulle'].forEach(cat => {
//         for (let i = 1; i <= 25; i++) {
//             fabricsDatabase.push({ id: `${cat}-${i}`, name: `${cat.slice(0, -1)} Grade ${i * 4}`, category: cat });
//         }
//     });
// }

// function renderFabrics(filterCat = 'All', searchQuery = '') {
//     const grid = document.getElementById('fabric-grid');
//     if (!grid) return;
//     grid.innerHTML = '';
    
//     fabricsDatabase.filter(f => (filterCat === 'All' || f.category === filterCat) && f.name.toLowerCase().includes(searchQuery.toLowerCase()))
//         .forEach(fabric => {
//             const card = document.createElement('div');
//             card.className = 'p-4 bg-cream border border-[#E6DDD3] rounded-xl cursor-pointer hover:border-charcoal transition-all';
//             card.innerHTML = `<span class="text-[9px] uppercase text-taupe">${fabric.category}</span><h4 class="font-serif text-sm mt-1">${fabric.name}</h4>`;
//             card.addEventListener('click', () => showToast(`Fabric Selected: ${fabric.name}`));
//             grid.appendChild(card);
//         });
// }

// // ---------------------------------------------------------------------------
// // EVENT BINDINGS & ERROR HANDLING
// // ---------------------------------------------------------------------------
// document.addEventListener('DOMContentLoaded', () => {
//     try {
//         initDollThreeJS();
//         initThreeJS();
//         generate100Fabrics();
//         renderFabrics();
//     } catch (e) {
//         console.error("Initialization exception caught:", e);
//     }

//     // Navigation Switches
//     const navButtons = document.querySelectorAll('#main-nav .nav-btn');
//     const tabViews = document.querySelectorAll('.tab-view');

//     navButtons.forEach(btn => {
//         btn.addEventListener('click', () => {
//             const tabId = btn.getAttribute('data-tab');
//             navButtons.forEach(b => b.classList.toggle('active', b === btn));
//             tabViews.forEach(v => {
//                 const match = v.id === `view-${tabId}`;
//                 v.classList.toggle('active', match);
//                 v.classList.toggle('hidden', !match);
//             });
//             window.scrollTo({ top: 0, behavior: 'smooth' });
//         });
//     });

//     // Avatar Customization Bindings
//     document.querySelectorAll('[data-avatar-type]').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             document.querySelectorAll('[data-avatar-type]').forEach(b => b.classList.remove('active'));
//             e.target.classList.add('active');
//             state.avatarType = e.target.getAttribute('data-avatar-type');
//             updateAvatarProportions();
//         });
//     });

//     document.querySelectorAll('[data-avatar-skin]').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             document.querySelectorAll('[data-avatar-skin]').forEach(b => b.classList.remove('active'));
//             e.target.classList.add('active');
//             state.avatarSkinColor = e.target.getAttribute('data-avatar-skin');
//             updateAvatarProportions();
//         });
//     });

//     const heightSlider = document.getElementById('avatar-height-slider');
//     if (heightSlider) {
//         heightSlider.addEventListener('input', (e) => {
//             state.avatarHeight = parseFloat(e.target.value);
//             updateAvatarProportions();
//         });
//     }

//     document.getElementById('go-to-design-btn')?.addEventListener('click', () => {
//         document.querySelector('[data-tab="studio"]').click();
//         showToast('Avatar configured. Initializing Dress Studio.');
//     });

//     // Sidebar Sub-Tabs Switcher (Roman Numerals)
//     document.querySelectorAll('.sidebar-tab-btn').forEach(tab => {
//         tab.addEventListener('click', () => {
//             const target = tab.getAttribute('data-sidebar-tab');
//             document.querySelectorAll('.sidebar-tab-btn').forEach(t => t.classList.remove('active'));
//             tab.classList.add('active');
//             document.querySelectorAll('.sidebar-content').forEach(c => {
//                 const match = c.id === `sidebar-content-${target}`;
//                 c.classList.toggle('hidden', !match);
//                 c.classList.toggle('active', match);
//             });
//         });
//     });

//     // Garment Configurator Bindings
//     document.querySelectorAll('[data-silhouette]').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             document.querySelectorAll('[data-silhouette]').forEach(b => b.classList.remove('active'));
//             e.target.classList.add('active');
//             state.silhouette = e.target.getAttribute('data-silhouette');
//             rebuildSkirtGeometry();
//         });
//     });

//     document.querySelectorAll('[data-sleeve]').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             document.querySelectorAll('[data-sleeve]').forEach(b => b.classList.remove('active'));
//             e.target.classList.add('active');
//             state.sleeve = e.target.getAttribute('data-sleeve');
//             rebuildSleeves();
//         });
//     });

//     document.querySelectorAll('.cam-btn').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
//             e.target.classList.add('active');
//             updateCameraPreset(e.target.getAttribute('data-cam'));
//         });
//     });

//     document.getElementById('fabric-color-picker')?.addEventListener('input', (e) => {
//         state.fabricColor = e.target.value;
//         document.getElementById('fabric-color-hex').textContent = state.fabricColor;
//         updateMaterialShader();
//     });

//     document.querySelectorAll('[data-texture]').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             document.querySelectorAll('[data-texture]').forEach(b => b.classList.remove('active'));
//             e.target.classList.add('active');
//             state.texture = e.target.getAttribute('data-texture');
//             updateMaterialShader();
//         });
//     });

//     // Fabrics Search & Filters
//     document.getElementById('fabric-search-input')?.addEventListener('input', (e) => {
//         const cat = document.querySelector('#fabric-cat-filters .filter-btn.active')?.getAttribute('data-cat') || 'All';
//         renderFabrics(cat, e.target.value);
//     });

//     document.querySelectorAll('#fabric-cat-filters .filter-btn').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             document.querySelectorAll('#fabric-cat-filters .filter-btn').forEach(b => b.classList.remove('active'));
//             e.target.classList.add('active');
//             renderFabrics(e.target.getAttribute('data-cat'), document.getElementById('fabric-search-input')?.value || '');
//         });
//     });

//     // AI Image Generator Search Engine
//     document.getElementById('ai-search-form')?.addEventListener('submit', (e) => {
//         e.preventDefault();
//         const query = document.getElementById('ai-input').value;
//         if (!query) return;
//         showToast(`AI engine scraping Google, Pinterest & TikTok for: "${query}"`);
//     });

//     // AI Camera Sizing Scan
//     document.getElementById('start-scan-btn')?.addEventListener('click', () => {
//         const status = document.getElementById('camera-status');
//         const results = document.getElementById('scan-results');
//         if (status) status.textContent = "Scanning body ratios via AI camera detector...";
//         setTimeout(() => {
//             if (status) status.textContent = "Scan successful!";
//             if (results) results.classList.remove('hidden');
//             showToast("AI size calculation complete.");
//         }, 1500);
//     });

//     document.getElementById('video-tutorial-btn')?.addEventListener('click', () => {
//         showToast("Opening self-measuring masterclass video guide.");
//     });

//     // Embellishments
//     document.querySelectorAll('.embellish-select-btn').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             showToast(`Added sequence: ${e.target.getAttribute('data-name')}`);
//         });
//     });

//     // Chat Form
//     document.getElementById('chat-form')?.addEventListener('submit', (e) => {
//         e.preventDefault();
//         const input = document.getElementById('chat-input');
//         const box = document.getElementById('chat-messages');
//         if (!input || !input.value || !box) return;

//         const userMsg = document.createElement('div');
//         userMsg.className = 'p-3 bg-[#E8EFE9] text-charcoal rounded text-xs max-w-xs ml-auto';
//         userMsg.textContent = input.value;
//         box.appendChild(userMsg);
//         input.value = '';
//         box.scrollTop = box.scrollHeight;

//         setTimeout(() => {
//             const reply = document.createElement('div');
//             reply.className = 'p-3 bg-cream border border-[#E6DDD3] rounded text-xs max-w-xs';
//             reply.textContent = "Received! We will adjust the pattern lines accordingly.";
//             box.appendChild(reply);
//             box.scrollTop = box.scrollHeight;
//         }, 1000);
//     });

//     // Checkout & Payment Methods
//     document.querySelectorAll('.pay-btn').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             document.querySelectorAll('.pay-btn').forEach(b => b.classList.remove('active'));
//             e.target.classList.add('active');
//         });
//     });

//     document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
//         e.preventDefault();
//         showToast("Commission order securely placed. Your designer has been notified.");
//     });

//     // Reviews Modal Logic
//     document.getElementById('open-review-btn')?.addEventListener('click', () => document.getElementById('review-modal').classList.remove('hidden'));
//     document.getElementById('close-review-btn')?.addEventListener('click', () => document.getElementById('review-modal').classList.add('hidden'));
    
//     document.querySelectorAll('#star-rating-container span').forEach(star => {
//         star.addEventListener('click', (e) => {
//             state.selectedRating = parseInt(e.target.getAttribute('data-star'));
//             document.querySelectorAll('#star-rating-container span').forEach((s, idx) => {
//                 s.style.color = idx < state.selectedRating ? '#3A2E2B' : '#8C7A6B';
//             });
//         });
//     });

//     document.getElementById('submit-review-btn')?.addEventListener('click', () => {
//         document.getElementById('review-modal').classList.add('hidden');
//         showToast("Thank you! Your review was recorded.");
//     });
// });

/**
 * Atelier Global — Core App Engine, 3D WebGL Controller, AI Generator & Google Maps Tracking System
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
    cameraPreset: '360',
    selectedRating: 5
};

// Database of Sample Waybill Packages & Map Coordinates
const shipmentsDatabase = {
    'ATG-8902-PARIS': {
        waybill: 'ATG-8902-PARIS',
        statusBadge: 'In Transit — Paris Hub',
        mapQuery: 'Charles+de+Gaulle+Airport+Paris',
        origin: 'Rue Saint-Honoré, Paris',
        destination: '5th Ave, New York, NY',
        eta: 'Oct 28, 2026',
        courier: 'DHL Haute Express',
        stepIndex: 3, // 1 to 4
        checkpoints: [
            { time: 'Oct 24, 14:20 GMT', loc: 'Paris, France', desc: 'Cleared export customs & loaded on flight AF022.' },
            { time: 'Oct 23, 09:15 GMT', loc: 'Paris Atelier', desc: 'Handcrafted dress inspected and packed in luxury garment vault.' }
        ]
    },
    'ATG-1042-MILAN': {
        waybill: 'ATG-1042-MILAN',
        statusBadge: 'Tailoring Completed — Milan',
        mapQuery: 'Via+Monte+Napoleone+Milan',
        origin: 'Via Monte Napoleone, Milan',
        destination: 'Bond Street, London',
        eta: 'Nov 02, 2026',
        courier: 'FedEx Couture Direct',
        stepIndex: 2,
        checkpoints: [
            { time: 'Oct 25, 11:00 GMT', loc: 'Milan Atelier', desc: 'Final crystal embroidery embellishments completed.' },
            { time: 'Oct 22, 16:30 GMT', loc: 'Milan Atelier', desc: 'Silk pattern cutting initialized.' }
        ]
    },
    'ATG-5521-NY': {
        waybill: 'ATG-5521-NY',
        statusBadge: 'Out for Local Courier Delivery',
        mapQuery: 'Manhattan+New+York+USA',
        origin: 'SoHo Atelier, New York',
        destination: 'Upper East Side, NY',
        eta: 'Today, 18:00',
        courier: 'Atelier White Glove Valet',
        stepIndex: 4,
        checkpoints: [
            { time: 'Oct 26, 08:30 EST', loc: 'New York, NY', desc: 'Loaded on white glove delivery van.' },
            { time: 'Oct 25, 20:00 EST', loc: 'New York Hub', desc: 'Arrived at local sorting facility.' }
        ]
    }
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
// GOOGLE MAPS & SHIPMENT TRACKING ENGINE
// ---------------------------------------------------------------------------
function updateShipmentTracking(waybillCode) {
    const cleanCode = waybillCode.trim().toUpperCase();
    let data = shipmentsDatabase[cleanCode];

    if (!data) {
        // Fallback for custom searched tracking numbers
        data = {
            waybill: cleanCode,
            statusBadge: 'In Transit — Custom Logistics Route',
            mapQuery: encodeURIComponent(cleanCode),
            origin: 'Atelier Central Paris',
            destination: 'Client Destination Address',
            eta: 'Pending Courier Scan',
            courier: 'Global Express Line',
            stepIndex: 3,
            checkpoints: [
                { time: 'Just Now', loc: 'Transit Terminal', desc: `Realtime updates initialized for ${cleanCode}.` }
            ]
        };
    }

    // Update Text Elements
    document.getElementById('map-waybill-title').textContent = `Waybill #${data.waybill}`;
    document.getElementById('map-location-badge').textContent = data.statusBadge;
    document.getElementById('info-origin').textContent = data.origin;
    document.getElementById('info-destination').textContent = data.destination;
    document.getElementById('info-eta').textContent = data.eta;
    document.getElementById('info-courier').textContent = data.courier;

    // Update Embedded Google Maps iFrame URL
    const iframe = document.getElementById('google-map-iframe');
    if (iframe) {
        iframe.src = `https://maps.google.com/maps?q=${data.mapQuery}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
    }

    // Update Progress Step Boxes
    const stepBoxes = document.querySelectorAll('.step-box');
    stepBoxes.forEach((box, idx) => {
        if (idx < data.stepIndex) {
            box.className = 'step-box p-1.5 bg-charcoal text-cream rounded text-[9px] uppercase tracking-wider font-medium';
        } else {
            box.className = 'step-box p-1.5 bg-cream border border-[#E6DDD3] text-taupe rounded text-[9px] uppercase tracking-wider font-medium';
        }
    });

    // Render Checkpoints
    const logList = document.getElementById('checkpoints-list');
    if (logList) {
        logList.innerHTML = '';
        data.checkpoints.forEach(cp => {
            const item = document.createElement('div');
            item.className = 'p-2.5 bg-cream rounded-lg border border-[#E6DDD3] space-y-0.5';
            item.innerHTML = `
                <div class="flex justify-between text-[10px] text-taupe">
                    <span>${cp.time}</span>
                    <span class="text-sage font-medium">${cp.loc}</span>
                </div>
                <p class="font-medium">${cp.desc}</p>
            `;
            logList.appendChild(item);
        });
    }

    showToast(`Loaded tracking updates for #${data.waybill}`);
}

// ---------------------------------------------------------------------------
// 3D THREE.JS DOLL CONTROLLER (Tab I)
// ---------------------------------------------------------------------------
let dollScene, dollCamera, dollRenderer, dollControls;
let dollAvatarGroup, torsoMesh, dollMaterial;

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
    const leftArm = new THREE.Mesh(armGeo, dollMaterial);
    leftArm.position.set(-0.33, 1.25, 0);
    dollAvatarGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, dollMaterial);
    rightArm.position.set(0.33, 1.25, 0);
    dollAvatarGroup.add(rightArm);

    const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.8, 16);
    const leftLeg = new THREE.Mesh(legGeo, dollMaterial);
    leftLeg.position.set(-0.12, 0.45, 0);
    dollAvatarGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, dollMaterial);
    rightLeg.position.set(0.12, 0.45, 0);
    dollAvatarGroup.add(rightLeg);

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
// 3D THREE.JS DRESS DESIGNER CONTROLLER (Tab II)
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

function updateCameraPreset(preset) {
    state.cameraPreset = preset;
    if (!camera || !controls) return;
    if (preset === 'top') {
        camera.position.set(0, 4.0, 0.1);
        controls.target.set(0, 0, 0);
    } else if (preset === 'front') {
        camera.position.set(0, 0, 3.5);
        controls.target.set(0, 0, 0);
    } else if (preset === 'macro') {
        camera.position.set(0, 1.2, 1.5);
        controls.target.set(0, 1.0, 0);
    } else {
        camera.position.set(0, 0.5, 4.5);
        controls.target.set(0, 0, 0);
    }
}

function updateMaterialShader() {
    if (!dressMaterial) return;
    dressMaterial.color.set(state.fabricColor);
    dressMaterial.roughness = state.texture === 'Velvet' ? 0.9 : 0.15;
}

// ---------------------------------------------------------------------------
// 100+ FABRICS DIRECTORY GENERATOR
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
            card.className = 'p-4 bg-cream border border-[#E6DDD3] rounded-xl cursor-pointer hover:border-charcoal transition-all';
            card.innerHTML = `<span class="text-[9px] uppercase text-taupe">${fabric.category}</span><h4 class="font-serif text-sm mt-1">${fabric.name}</h4>`;
            card.addEventListener('click', () => showToast(`Fabric Selected: ${fabric.name}`));
            grid.appendChild(card);
        });
}

// ---------------------------------------------------------------------------
// INITIALIZATION & EVENT LISTENERS
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    try {
        initDollThreeJS();
        initThreeJS();
        generate100Fabrics();
        renderFabrics();
    } catch (e) {
        console.error("Initialization exception caught:", e);
    }

    // Navigation Switches
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

    // Route Map Tracking Event Listeners
    document.getElementById('tracking-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('tracking-input');
        if (input && input.value.trim()) {
            updateShipmentTracking(input.value.trim());
        }
    });

    document.querySelectorAll('.quick-waybill-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const code = e.target.getAttribute('data-waybill');
            const input = document.getElementById('tracking-input');
            if (input) input.value = code;
            updateShipmentTracking(code);
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
        showToast('Avatar configured. Initializing Dress Studio.');
    });

    // Sidebar Sub-Tabs Switcher
    document.querySelectorAll('.sidebar-tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-sidebar-tab');
            document.querySelectorAll('.sidebar-tab-btn').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.sidebar-content').forEach(c => {
                const match = c.id === `sidebar-content-${target}`;
                c.classList.toggle('hidden', !match);
                c.classList.toggle('active', match);
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

    document.querySelectorAll('.cam-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updateCameraPreset(e.target.getAttribute('data-cam'));
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

    // Fabrics Search & Filters
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

    // AI Camera Sizing Scan
    document.getElementById('start-scan-btn')?.addEventListener('click', () => {
        const status = document.getElementById('camera-status');
        const results = document.getElementById('scan-results');
        if (status) status.textContent = "Scanning body ratios via AI camera detector...";
        setTimeout(() => {
            if (status) status.textContent = "Scan successful!";
            if (results) results.classList.remove('hidden');
            showToast("AI size calculation complete.");
        }, 1500);
    });

    // Embellishments
    document.querySelectorAll('.embellish-select-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            showToast(`Added sequence: ${e.target.getAttribute('data-name')}`);
        });
    });

    // Chat Form
    document.getElementById('chat-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const box = document.getElementById('chat-messages');
        if (!input || !input.value || !box) return;

        const userMsg = document.createElement('div');
        userMsg.className = 'p-3 bg-[#E8EFE9] text-charcoal rounded-lg text-xs max-w-xs ml-auto';
        userMsg.textContent = input.value;
        box.appendChild(userMsg);
        input.value = '';
        box.scrollTop = box.scrollHeight;

        setTimeout(() => {
            const reply = document.createElement('div');
            reply.className = 'p-3 bg-cream border border-[#E6DDD3] rounded-lg text-xs max-w-xs';
            reply.textContent = "Received! We will adjust the pattern lines accordingly.";
            box.appendChild(reply);
            box.scrollTop = box.scrollHeight;
        }, 1000);
    });

    // Checkout Form
    document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast("Commission order securely placed. Your designer has been notified.");
    });

    // Reviews Modal Logic
    document.getElementById('open-review-btn')?.addEventListener('click', () => document.getElementById('review-modal').classList.remove('hidden'));
    document.getElementById('close-review-btn')?.addEventListener('click', () => document.getElementById('review-modal').classList.add('hidden'));

    document.getElementById('submit-review-btn')?.addEventListener('click', () => {
        document.getElementById('review-modal').classList.add('hidden');
        showToast("Thank you! Your review was recorded.");
    });
});