import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ErrorBoundary from './ErrorBoundary';
import ImageWithFallback from './ImageWithFallback';

// Generate 100+ Master Fabrics Database
const GENERATED_FABRICS = [];
const categories = ['Silks', 'Velvets', 'Laces', 'Organza & Tulle', 'Brocades', 'Chiffons', 'Tweed', 'Leather'];
categories.forEach((cat, catIdx) => {
  for (let i = 1; i <= 15; i++) {
    GENERATED_FABRICS.push({
      id: `fab-${catIdx}-${i}`,
      name: `${cat.slice(0, -1)} Artisan Edition ${i * 3}`,
      category: cat,
      weight: `${(80 + i * 5)} GSM`,
      origin: i % 2 === 0 ? 'Como, Italy' : 'Lyon, France',
      priceMultiplier: 1.0 + (i * 0.05)
    });
  }
});

export default function AtelierStudioApp() {
  const [activeTab, setActiveTab] = useState('studio');
  const [sidebarTab, setSidebarTab] = useState('I'); // I. Silhouette, II. Fabric/Color, III. WIP Tracker

  // Design State
  const [silhouette, setSilhouette] = useState('a-line');
  const [neckline, setNeckline] = useState('sweetheart');
  const [sleeve, setSleeve] = useState('sleeveless');
  const [fabricColor, setFabricColor] = useState('#7A6B5D');
  const [selectedTexture, setSelectedTexture] = useState('Silk');
  const [cameraPreset, setCameraPreset] = useState('360');

  // Doll Customization State
  const [avatarType, setAvatarType] = useState('classic');
  const [avatarSkin, setAvatarSkin] = useState('#E0AC69');
  const [avatarHeight, setAvatarHeight] = useState(1.0);

  // Fabrics Tab Search & Filter State
  const [fabricSearchQuery, setFabricSearchQuery] = useState('');
  const [fabricCategoryFilter, setFabricCategoryFilter] = useState('All');

  // AI Image Search Engine State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiReferences, setAiReferences] = useState([
    { id: 1, title: 'Baroque Silk Corset Gown', source: 'Pinterest', url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80' },
    { id: 2, title: 'Minimalist Crepe Column', source: 'Instagram', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80' },
    { id: 3, title: 'Tulle Ballgown Cascade', source: 'TikTok', url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80' }
  ]);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Three.js Canvas Refs
  const canvasContainerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const dressMaterialRef = useRef(null);
  const skirtMeshRef = useRef(null);
  const dressGroupRef = useRef(null);

  // Initialize Three.js Viewport
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    try {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#F5F0EB');
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.set(0, 1.0, 4.5);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controlsRef.current = controls;

      // Studio Lighting Rig
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
      keyLight.position.set(4, 7, 5);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xffeedd, 0.4);
      fillLight.position.set(-4, 3, -3);
      scene.add(fillLight);

      // Build Base Mannequin & Dress Group
      const dressGroup = new THREE.Group();
      dressGroup.position.set(0, -1.0, 0);
      scene.add(dressGroup);
      dressGroupRef.current = dressGroup;

      // Mannequin Head & Torso Stand
      const manMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(avatarSkin), roughness: 0.5 });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), manMat);
      head.position.set(0, 2.3, 0);
      dressGroup.add(head);

      const upperTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 0.9, 32), manMat);
      upperTorso.position.set(0, 1.7, 0);
      dressGroup.add(upperTorso);

      // Dress Bodice
      const dressMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(fabricColor),
        roughness: selectedTexture === 'Velvet' ? 0.9 : 0.2,
        metalness: 0.1
      });
      dressMaterialRef.current = dressMat;

      const bodice = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.33, 1.1, 32), dressMat);
      bodice.position.set(0, 1.7, 0);
      dressGroup.add(bodice);

      // Skirt Mesh Placeholder
      const skirtGeo = new THREE.CylinderGeometry(0.33, 1.4, 2.8, 48);
      const skirt = new THREE.Mesh(skirtGeo, dressMat);
      skirt.position.set(0, 0.1, 0);
      dressGroup.add(skirt);
      skirtMeshRef.current = skirt;

      // Animation Loop
      let animationFrameId;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (controlsRef.current) controlsRef.current.update();
        if (cameraPreset === '360' && dressGroupRef.current) {
          dressGroupRef.current.rotation.y += 0.004;
        }
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    } catch (err) {
      console.error("Three.js initialization failure:", err);
    }
  }, []);

  // Update Material Color/Texture in Real-time
  useEffect(() => {
    if (dressMaterialRef.current) {
      dressMaterialRef.current.color.set(fabricColor);
      dressMaterialRef.current.roughness = selectedTexture === 'Velvet' ? 0.9 : 0.25;
    }
  }, [fabricColor, selectedTexture]);

  // Update Camera Presets
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    if (cameraPreset === 'top') {
      cam.position.set(0, 4.5, 0.1);
      ctrl.target.set(0, 1.0, 0);
    } else if (cameraPreset === 'front') {
      cam.position.set(0, 1.2, 3.8);
      ctrl.target.set(0, 1.2, 0);
    } else if (cameraPreset === 'macro') {
      cam.position.set(0, 1.6, 1.8);
      ctrl.target.set(0, 1.5, 0);
    } else {
      cam.position.set(0, 1.0, 4.5);
      ctrl.target.set(0, 1.0, 0);
    }
  }, [cameraPreset]);

  // Filter 100+ Fabrics
  const filteredFabrics = useMemo(() => {
    return GENERATED_FABRICS.filter(f => {
      const matchesCat = fabricCategoryFilter === 'All' || f.category === fabricCategoryFilter;
      const matchesQuery = f.name.toLowerCase().includes(fabricSearchQuery.toLowerCase()) || f.origin.toLowerCase().includes(fabricSearchQuery.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [fabricCategoryFilter, fabricSearchQuery]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F9F9F8] text-[#1C1917] font-sans antialiased flex flex-col selection:bg-[#E8C5C8] selection:text-[#1C1917]">
        
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-[#1C1917] text-[#F9F9F8] px-5 py-3 rounded shadow-2xl text-xs uppercase tracking-[0.15em] flex items-center gap-3 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#4A6B53]"></span>
            {toastMessage}
          </div>
        )}

        {/* TOP HEADER NAVIGATION */}
        <header className="sticky top-0 z-40 bg-[#F9F9F8]/90 backdrop-blur-md border-b border-[#E6DDD3] px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl tracking-[0.25em] font-light uppercase">Atelier Global</span>
              <span className="bg-[#E8EFE9] text-[#4A6B53] text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full font-medium">Haute 3D Studio</span>
            </div>

            <nav className="flex flex-wrap justify-center gap-1 overflow-x-auto pb-1 md:pb-0">
              <button onClick={() => setActiveTab('studio')} className={`nav-tab-btn ${activeTab === 'studio' ? 'active' : ''}`}>I. 3D Doll & Dress Studio</button>
              <button onClick={() => setActiveTab('fabrics')} className={`nav-tab-btn ${activeTab === 'fabrics' ? 'active' : ''}`}>100+ Master Fabrics</button>
              <button onClick={() => setActiveTab('designers')} className={`nav-tab-btn ${activeTab === 'designers' ? 'active' : ''}`}>Global Designers</button>
              <button onClick={() => setActiveTab('tracking')} className={`nav-tab-btn ${activeTab === 'tracking' ? 'active' : ''}`}>Live GPS Tracker</button>
              <button onClick={() => setActiveTab('sizing')} className={`nav-tab-btn ${activeTab === 'sizing' ? 'active' : ''}`}>AI Size Detector</button>
              <button onClick={() => setActiveTab('clearance')} className={`nav-tab-btn ${activeTab === 'clearance' ? 'active' : ''}`}>Clearance Archive</button>
              <button onClick={() => setActiveTab('checkout')} className={`nav-tab-btn ${activeTab === 'checkout' ? 'active' : ''}`}>Secure Checkout</button>
            </nav>
          </div>
        </header>

        {/* MAIN APPLICATION CONTAINER */}
        <main className="max-w-7xl w-full mx-auto px-4 md:px-6 py-6 flex-1 flex flex-col">

          {/* TAB 1: 3D DOLL & DRESS STUDIO */}
          {activeTab === 'studio' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
              
              {/* LEFT-HAND NAVIGATION COLUMN (DESIGN CONTROLS) */}
              <div className="lg:col-span-5 bg-[#F5F0EB] border border-[#E6DDD3] rounded-xl p-5 shadow-sm space-y-6 sticky top-24">
                
                {/* Roman Numeral Sidebar Tabs */}
                <div className="flex border-b border-[#E6DDD3] pb-3 gap-2">
                  <button onClick={() => setSidebarTab('I')} className={`sidebar-tab-btn ${sidebarTab === 'I' ? 'active' : ''}`}>I. Silhouette & Avatar</button>
                  <button onClick={() => setSidebarTab('II')} className={`sidebar-tab-btn ${sidebarTab === 'II' ? 'active' : ''}`}>II. Texture & Color</button>
                  <button onClick={() => setSidebarTab('III')} className={`sidebar-tab-btn ${sidebarTab === 'III' ? 'active' : ''}`}>III. WIP Timeline</button>
                </div>

                {/* TAB I: SILHOUETTE & AVATAR CONFIGURATOR */}
                {sidebarTab === 'I' && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <label className="section-label">3D Doll Proportions</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['petite', 'classic', 'curvy'].map((type) => (
                          <button
                            key={type}
                            onClick={() => { setAvatarType(type); triggerToast(`Avatar proportion set to ${type}`); }}
                            className={`config-option-btn ${avatarType === type ? 'active' : ''}`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="section-label">Structural Silhouette Selection</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['a-line', 'column', 'ballgown'].map((s) => (
                          <button
                            key={s}
                            onClick={() => { setSilhouette(s); triggerToast(`Silhouette swapped to ${s.toUpperCase()}`); }}
                            className={`config-option-btn ${silhouette === s ? 'active' : ''}`}
                          >
                            {s.replace('-', ' ').toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="section-label">Neckline Cut</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['sweetheart', 'v-neck', 'halter', 'off-shoulder'].map((n) => (
                          <button
                            key={n}
                            onClick={() => { setNeckline(n); triggerToast(`Neckline modified`); }}
                            className={`config-option-btn ${neckline === n ? 'active' : ''}`}
                          >
                            {n.replace('-', ' ').toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="section-label">Cinematic Camera Control Panel</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: '360', label: '1) 360° Turntable' },
                          { id: 'top', label: '2) High-Angle Top' },
                          { id: 'front', label: '3) Studio Front' },
                          { id: 'macro', label: '4) Extreme Macro' }
                        ].map((cam) => (
                          <button
                            key={cam.id}
                            onClick={() => setCameraPreset(cam.id)}
                            className={`config-option-btn ${cameraPreset === cam.id ? 'active' : ''}`}
                          >
                            {cam.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB II: ONLINE TEXTURE, FABRIC PAINTER & AI SEARCH */}
                {sidebarTab === 'II' && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <label className="section-label">Interactive Color Wheel & Custom Spectrum</label>
                      <div className="flex items-center gap-3 bg-[#FDFBF7] p-3 rounded border border-[#E6DDD3]">
                        <input
                          type="color"
                          value={fabricColor}
                          onChange={(e) => setFabricColor(e.target.value)}
                          className="w-9 h-9 rounded border-none cursor-pointer bg-transparent"
                        />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-[#8C7A6B] uppercase">Active Hex Code</span>
                          <span className="font-mono text-xs uppercase font-medium">{fabricColor}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="section-label">Shader Reference Maps</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Silk', 'Satin', 'Velvet', 'Lace', 'Chiffon', 'Tweed'].map((tex) => (
                          <button
                            key={tex}
                            onClick={() => { setSelectedTexture(tex); triggerToast(`Shader updated: ${tex}`); }}
                            className={`config-option-btn ${selectedTexture === tex ? 'active' : ''}`}
                          >
                            {tex}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E6DDD3]">
                      <label className="section-label">✨ AI Internet Vision Search Engine</label>
                      <p className="text-[11px] text-[#8C7A6B] mb-2">Scrapes Google, Pinterest, Instagram & TikTok to extract reference design palettes.</p>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!aiPrompt.trim()) return;
                          setAiReferences([{ id: Date.now(), title: aiPrompt, source: 'AI Generator', url: 'https://images.unsplash.com/photo-1594552072238-b8a3da72ae9a?auto=format&fit=crop&w=400&q=80' }, ...aiReferences]);
                          triggerToast(`AI generated mood board references for "${aiPrompt}"`);
                          setAiPrompt('');
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          placeholder="e.g. 1950s Parisian pearl embroidered bodice..."
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          className="flex-1 px-3 py-2 text-xs bg-[#FDFBF7] border border-[#E6DDD3] rounded focus:outline-none focus:border-[#1C1917]"
                        />
                        <button type="submit" className="px-3 py-2 bg-[#1C1917] text-[#F9F9F8] text-xs rounded hover:bg-[#8C7A6B] transition-colors">
                          Generate
                        </button>
                      </form>

                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {aiReferences.slice(0, 3).map((ref) => (
                          <div key={ref.id} className="relative group overflow-hidden rounded border border-[#E6DDD3]">
                            <ImageWithFallback src={ref.url} alt={ref.title} className="w-full h-16 object-cover group-hover:scale-105 transition-transform" />
                            <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] px-1 rounded">{ref.source}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB III: LIVE WORK-IN-PROGRESS TRACKER MAP */}
                {sidebarTab === 'III' && (
                  <div className="space-y-4 animate-fade-in">
                    <label className="section-label">Gamified Digital Tailoring Timeline</label>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between p-3 bg-[#FDFBF7] border border-[#E6DDD3] rounded">
                        <span className="font-medium">1. 3D Digital Sketching & Simulation</span>
                        <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-[#E8EFE9] text-[#4A6B53] font-medium">Completed</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#FDFBF7] border border-[#E6DDD3] rounded">
                        <span className="font-medium">2. Master Artisan Pattern Cutting</span>
                        <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-[#E8EFE9] text-[#4A6B53] font-medium">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#FDFBF7] border border-[#E6DDD3] rounded">
                        <span className="font-medium">3. Hand Embroidery & Assembly</span>
                        <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-[#FAF8F5] text-[#8C7A6B] font-medium">Pending</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* RIGHT-HAND 3D VIEWPORT CANVAS */}
              <div className="lg:col-span-7 bg-[#F5F0EB] border border-[#E6DDD3] rounded-xl h-[620px] relative overflow-hidden shadow-inner flex flex-col">
                <div className="absolute top-4 left-4 z-10 bg-[#F9F9F8]/85 backdrop-blur-md px-3.5 py-1.5 rounded border border-[#E6DDD3] text-[10px] uppercase tracking-[0.15em] shadow-sm">
                  Interactive 3D Doll Engine • Drag to Rotate 360° • Scroll to Zoom
                </div>
                <div ref={canvasContainerRef} className="w-full h-full flex-1"></div>
              </div>

            </div>
          )}

          {/* TAB 2: 100+ MASTER FABRICS DIRECTORY */}
          {activeTab === 'fabrics' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center max-w-xl mx-auto">
                <span className="section-label">Global Textile Archives</span>
                <h1 className="font-serif text-3xl my-1">Over 100+ Master Fabrics</h1>
                <p className="text-xs text-[#8C7A6B]">Search through our extensive library of verified global silks, velvets, and specialty textiles.</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-between bg-[#F5F0EB] p-4 rounded-xl border border-[#E6DDD3]">
                <input
                  type="text"
                  placeholder="Search fabric name or origin..."
                  value={fabricSearchQuery}
                  onChange={(e) => setFabricSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-[#FDFBF7] border border-[#E6DDD3] rounded text-xs focus:outline-none focus:border-[#1C1917]"
                />
                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                  {['All', 'Silks', 'Velvets', 'Laces', 'Organza & Tulle', 'Brocades', 'Chiffons', 'Tweed', 'Leather'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFabricCategoryFilter(cat)}
                      className={`filter-btn ${fabricCategoryFilter === cat ? 'active' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[520px] overflow-y-auto pr-2">
                {filteredFabrics.map((fabric) => (
                  <div
                    key={fabric.id}
                    onClick={() => triggerToast(`Selected Fabric: ${fabric.name} (${fabric.origin})`)}
                    className="p-4 bg-[#F5F0EB] border border-[#E6DDD3] rounded-xl cursor-pointer hover:border-[#1C1917] transition-all space-y-1.5 shadow-sm"
                  >
                    <span className="text-[9px] uppercase tracking-widest text-[#8C7A6B]">{fabric.category}</span>
                    <h4 className="font-serif text-sm font-medium">{fabric.name}</h4>
                    <p className="text-[11px] text-[#8C7A6B]">{fabric.origin} • {fabric.weight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GLOBAL DESIGNERS DIRECTORY */}
          {activeTab === 'designers' && (
            <div className="space-y-6 animate-fade-in max-w-5xl mx-auto w-full">
              <div className="text-center max-w-xl mx-auto">
                <span className="section-label">International Master Artisans</span>
                <h1 className="font-serif text-3xl my-1">Collaborate With World-Class Designers</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Elena Vance-Amore', city: 'Paris, France', specialty: 'Haute Couture & Beading', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Marcus Thorne', city: 'Milan, Italy', specialty: 'Structural Tailoring & Silks', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
                  { name: 'Aaliyah Chen', city: 'Tokyo, Japan', specialty: 'Avant-Garde Organza & Draping', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' }
                ].map((designer, idx) => (
                  <div key={idx} className="bg-[#F5F0EB] border border-[#E6DDD3] rounded-xl p-6 space-y-4 shadow-sm text-center">
                    <ImageWithFallback src={designer.img} alt={designer.name} className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-[#E6DDD3]" />
                    <div>
                      <h3 className="font-serif text-lg">{designer.name}</h3>
                      <p className="text-xs text-[#8C7A6B]">{designer.city}</p>
                      <p className="text-xs font-medium mt-1 text-[#1C1917]">{designer.specialty}</p>
                    </div>
                    <button
                      onClick={() => triggerToast(`Initiating secure video consultation with ${designer.name}`)}
                      className="w-full py-2.5 bg-[#1C1917] text-[#F9F9F8] text-xs uppercase tracking-widest rounded hover:bg-[#8C7A6B] transition-colors"
                    >
                      Connect & FaceTime
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LIVE GPS TRACKER */}
          {activeTab === 'tracking' && (
            <div className="space-y-6 animate-fade-in max-w-3xl mx-auto w-full">
              <div className="text-center">
                <span className="section-label">Real-Time Logistics & GPS</span>
                <h1 className="font-serif text-3xl my-1">Waybill #ATG-9042-PARIS</h1>
                <p className="text-xs text-[#8C7A6B]">Visual map tracking your custom garment from atelier assembly to final doorstep delivery.</p>
              </div>

              <div className="bg-[#F5F0EB] p-6 rounded-xl border border-[#E6DDD3] space-y-4 shadow-sm">
                <div className="w-full h-72 bg-[#FDFBF7] border border-[#E6DDD3] rounded-lg relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#1C1917_1px,transparent_1px)] [background-size:20px_20px]"></div>
                  <div className="text-center z-10 space-y-2 bg-[#F5F0EB]/90 backdrop-blur-md p-6 rounded-xl border border-[#E6DDD3]">
                    <span className="text-xs uppercase tracking-widest text-[#4A6B53] font-semibold">📍 Current Status: Hand-Stitching in Paris Atelier</span>
                    <p className="text-xs text-[#8C7A6B]">Estimated Transit Arrival: 12 Business Days</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI SIZE DETECTOR */}
          {activeTab === 'sizing' && (
            <div className="space-y-6 animate-fade-in max-w-2xl mx-auto w-full">
              <div className="text-center">
                <span className="section-label">Precision Fit Technology</span>
                <h1 className="font-serif text-3xl my-1">AI Camera Detector & Measuring Guide</h1>
              </div>

              <div className="bg-[#F5F0EB] p-8 rounded-xl border border-[#E6DDD3] text-center space-y-4 shadow-sm">
                <div className="w-full h-52 bg-[#FDFBF7] border border-dashed border-[#8C7A6B] rounded-lg flex items-center justify-center p-6">
                  <p className="text-xs text-[#8C7A6B]">Camera detector ready. Position yourself 6 feet away from the lens for automated skeletal ratio detection.</p>
                </div>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => triggerToast("AI camera scan calibrated successfully. Size US 4 determined.")} className="px-6 py-3 bg-[#1C1917] text-[#F9F9F8] text-xs uppercase tracking-widest rounded hover:bg-[#8C7A6B] transition-colors">
                    Start AI Snapshot Scan
                  </button>
                  <button onClick={() => triggerToast("Opening masterclass self-measuring tutorial video.")} className="px-6 py-3 border border-[#1C1917] text-[#1C1917] text-xs uppercase tracking-widest rounded hover:bg-[#1C1917] hover:text-[#F9F9F8] transition-colors">
                    Watch Tutorial
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CLEARANCE ARCHIVE */}
          {activeTab === 'clearance' && (
            <div className="space-y-6 animate-fade-in max-w-5xl mx-auto w-full">
              <div className="text-center max-w-xl mx-auto">
                <span className="section-label">Private Archive Samples</span>
                <h1 className="font-serif text-3xl my-1">Clearance Collection</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'The Ivory Silk Slip Sample', price: '$1,200', original: '$3,400', img: 'https://images.unsplash.com/photo-1594552072238-b8a3da72ae9a?auto=format&fit=crop&w=400&q=80' },
                  { title: 'Baroque Velvet Corset Gown', price: '$2,100', original: '$5,200', img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80' },
                  { title: 'Chantilly Lace Cascade', price: '$1,850', original: '$4,100', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#F5F0EB] p-4 rounded-xl border border-[#E6DDD3] space-y-3 shadow-sm">
                    <ImageWithFallback src={item.img} alt={item.title} className="w-full h-64 object-cover rounded" />
                    <h3 className="font-serif text-base">{item.title}</h3>
                    <p className="text-xs text-[#8C7A6B]">{item.price} <span className="line-through">{item.original}</span></p>
                    <button onClick={() => triggerToast(`Claimed archive sample: ${item.title}`)} className="w-full py-2 bg-[#1C1917] text-[#F9F9F8] text-xs uppercase tracking-widest rounded hover:bg-[#8C7A6B] transition-colors">
                      Claim Sample
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SECURE CHECKOUT */}
          {activeTab === 'checkout' && (
            <div className="space-y-6 animate-fade-in max-w-xl mx-auto w-full">
              <div className="text-center">
                <span className="section-label">Secure Commission</span>
                <h1 className="font-serif text-3xl my-1">Checkout & Payment Gateway</h1>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); triggerToast("Commission successfully placed. Your designer has been notified."); }} className="bg-[#F5F0EB] p-6 rounded-xl border border-[#E6DDD3] space-y-4 shadow-sm">
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="First Name" required className="p-3 bg-[#FDFBF7] border border-[#E6DDD3] rounded text-xs focus:outline-none" />
                  <input type="text" placeholder="Last Name" required className="p-3 bg-[#FDFBF7] border border-[#E6DDD3] rounded text-xs focus:outline-none" />
                </div>
                <input type="email" placeholder="Email Address" required className="w-full p-3 bg-[#FDFBF7] border border-[#E6DDD3] rounded text-xs focus:outline-none" />
                <input type="text" placeholder="Shipping Address & Postal Code" required className="w-full p-3 bg-[#FDFBF7] border border-[#E6DDD3] rounded text-xs focus:outline-none" />

                <div className="pt-2 border-t border-[#E6DDD3]">
                  <label className="section-label mb-2">Select Payment Method</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Credit Card', 'Apple Pay', 'Debit Card', 'CashApp'].map((pm) => (
                      <button key={pm} type="button" onClick={() => triggerToast(`Payment method selected: ${pm}`)} className="py-2.5 bg-[#FDFBF7] border border-[#E6DDD3] rounded text-[11px] hover:border-[#1C1917]">
                        {pm}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full py-3.5 bg-[#1C1917] text-[#F9F9F8] text-xs uppercase tracking-[0.2em] rounded mt-2 hover:bg-[#8C7A6B] transition-colors">
                  Complete Commission
                </button>
              </form>
            </div>
          )}

        </main>
      </div>
    </ErrorBoundary>
  );
}