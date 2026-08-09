import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Package, 
  MessageSquare, 
  Camera, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Star, 
  MapPin, 
  Send,
  Navigation,
  Layers,
  RefreshCw,
  Info,
  Loader2,
  Tag,
  Filter,
  SlidersHorizontal,
  Video,
  Check,
  Sparkles,
  Download
} from 'lucide-react';

export default function FashionDesignStudio() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('I'); // Options: 'I' (3D Studio & Camera), 'II' (Tracker Map), 'III' (Reviews), 'IV' (Clearance)
  
  // ---------------------------------------------------------------------------
  // 3D DRESS MODEL & CAMERA CUSTOMIZER STATE
  // ---------------------------------------------------------------------------
  const [selectedDressModel, setSelectedDressModel] = useState(0);
  const [dressColor, setDressColor] = useState('#1A1A1A');
  const [dressTexture, setDressTexture] = useState('Silk');
  const [modelRotation, setModelRotation] = useState(0);
  const [modelScale, setModelScale] = useState(1);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedDesign, setCapturedDesign] = useState(null);
  const videoRef = useRef(null);

  // ---------------------------------------------------------------------------
  // CLEARANCE FILTERS STATE
  // ---------------------------------------------------------------------------
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedColorFilter, setSelectedColorFilter] = useState('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // ---------------------------------------------------------------------------
  // LOGISTICS TRACKER MAP STATE
  // ---------------------------------------------------------------------------
  const [selectedWaypoint, setSelectedWaypoint] = useState(1);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showSatelliteOverlay, setShowSatelliteOverlay] = useState(false);

  // ---------------------------------------------------------------------------
  // REVIEWS STATE
  // ---------------------------------------------------------------------------
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([
    { id: 1, author: 'Evelyn V.', rating: 5, date: 'OCT 24, 2025', text: 'The structural silhouette and drape of the Silk Atelier Gown exceeded expectations. Uncompromising precision.' },
    { id: 2, author: 'Julian C.', rating: 4, date: 'NOV 12, 2025', text: 'Minimalist aesthetic realized perfectly. Minor delay in rendering high-poly textures, but overall sublime.' },
    { id: 3, author: 'Clara M.', rating: 5, date: 'JAN 08, 2026', text: 'Exquisite attention to seams and material movement on the virtual canvas. Highly recommended for couture fittings.' }
  ]);

  // Initial Loader Simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleTabSwitch = (tab) => {
    setIsLoading(true);
    setActiveTab(tab);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  // Camera Access Handler
  const toggleCamera = async () => {
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraActive(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }, 100);
      } catch (err) {
        alert("Unable to access camera. Please check permissions.");
      }
    }
  };

  const captureDesignSnapshot = () => {
    setCapturedDesign({
      id: Date.now(),
      dress: dressModels[selectedDressModel].name,
      color: dressColor,
      texture: dressTexture,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  // Dress Models Data
  const dressModels = [
    { id: 1, name: 'Architectural Silk Gown', code: 'MODEL-01', baseImg: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80', originalPrice: 1200 },
    { id: 2, name: 'Asymmetric Pleated Dress', code: 'MODEL-02', baseImg: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80', originalPrice: 850 },
    { id: 3, name: 'Draped Satin Column', code: 'MODEL-03', baseImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', originalPrice: 980 },
    { id: 4, name: 'Minimalist Slip Dress', code: 'MODEL-04', baseImg: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80', originalPrice: 650 },
  ];

  // Clearance Items Data
  const clearanceCatalog = [
    { id: 101, name: 'Sculptured Velvet Mini Dress', category: 'Eveningwear', color: 'Black', colorHex: '#1A1A1A', price: 290, originalPrice: 750, img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80' },
    { id: 102, name: 'Ivory Layered Chiffon Gown', category: 'Eveningwear', color: 'White', colorHex: '#FBFBFA', price: 420, originalPrice: 1100, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80' },
    { id: 103, name: 'Crimson Draped Wrap Dress', category: 'Prêt-à-Porter', color: 'Red', colorHex: '#991B1B', price: 180, originalPrice: 480, img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80' },
    { id: 104, name: 'Midnight Blue Column Gown', category: 'Tailoring', color: 'Blue', colorHex: '#1E3A8A', price: 340, originalPrice: 890, img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80' },
    { id: 105, name: 'Emerald Satin Slip Dress', category: 'Prêt-à-Porter', color: 'Green', colorHex: '#065F46', price: 210, originalPrice: 520, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80' },
    { id: 106, name: 'Obsidian Trench Coat Dress', category: 'Outerwear', color: 'Black', colorHex: '#1A1A1A', price: 480, originalPrice: 1300, img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80' }
  ];

  // Filtered Clearance Products
  const filteredClearance = clearanceCatalog.filter(item => {
    const matchesPrice = item.price <= maxPrice;
    const matchesColor = selectedColorFilter === 'All' || item.color === selectedColorFilter;
    const matchesCategory = selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter;
    return matchesPrice && matchesColor && matchesCategory;
  });

  // Tracking Waypoints
  const waypoints = [
    { id: 0, title: 'Atelier Origin', city: 'Milan', country: 'Italy', coords: '45.4642° N, 9.1900° E', status: 'Completed', time: 'NOV 10 • 09:00 AM', cx: 150, cy: 220, details: 'Garment packaged in custom climate-controlled archival case.' },
    { id: 1, title: 'Regional Logistics Hub', city: 'Paris', country: 'France', coords: '48.8566° N, 2.3522° E', status: 'In Transit', time: 'TODAY • 08:30 AM', cx: 320, cy: 140, details: 'Cleared customs terminal. Currently loaded on flight LX-402.' },
    { id: 2, title: 'Customs Clearance', city: 'London', country: 'United Kingdom', coords: '51.5074° N, 0.1278° W', status: 'Spot Check', time: 'EST. NOV 16 • 11:00 AM', cx: 500, cy: 180, details: 'Pre-clearance documentation submitted to priority trade registry.' },
    { id: 3, title: 'Destination Studio', city: 'New York', country: 'United States', coords: '40.7128° N, 74.0060° W', status: 'Pending', time: 'EST. NOV 18 • 02:00 PM', cx: 700, cy: 260, details: 'Scheduled for white-glove courier delivery to Fifth Avenue Studio.' }
  ];

  // Map Handlers
  const handleZoom = (direction) => {
    setMapZoom((prev) => direction === 'in' ? Math.min(prev + 0.3, 2.2) : Math.max(prev - 0.3, 0.8));
  };
  const handleResetMap = () => { setMapZoom(1); setMapPan({ x: 0, y: 0 }); };
  const handleMouseDown = (e) => { setIsDragging(true); setDragStart({ x: e.clientX - mapPan.x, y: e.clientY - mapPan.y }); };
  const handleMouseMove = (e) => { if (isDragging) setMapPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUp = () => setIsDragging(false);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setReviews([{ id: Date.now(), author: 'Client Visitor', rating, date: 'JUST NOW', text: reviewText }, ...reviews]);
    setReviewText('');
    setRating(5);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1A1A1A] font-sans flex antialiased selection:bg-[#2A2A2A] selection:text-[#FBFBFA] relative">
      
      {/* ------------------------------------------------------------------- */}
      {/* INITIAL / TAB LOADER                                               */}
      {/* ------------------------------------------------------------------- */}
      {isLoading && (
        <div className="fixed inset-0 bg-[#FBFBFA] z-50 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-6 h-6 text-[#1A1A1A] animate-spin stroke-[1.25]" />
          <p className="font-serif text-sm tracking-widest uppercase text-[#1A1A1A]">A T E L I E R</p>
          <span className="text-[10px] tracking-widest text-[#A3A39E] uppercase">Loading Studio Assets...</span>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SIDEBAR NAVIGATION                                                  */}
      {/* ------------------------------------------------------------------- */}
      <aside className="w-72 border-r border-[#E5E5E0] p-8 flex flex-col justify-between h-screen sticky top-0 bg-[#FBFBFA] z-20">
        <div>
          <div className="mb-12">
            <h1 className="font-serif text-2xl tracking-widest uppercase text-[#1A1A1A] font-normal">
              A T E L I E R
            </h1>
            <p className="text-[10px] tracking-widest text-[#737370] uppercase mt-1">
              3D Digital Studio
            </p>
          </div>

          <nav className="space-y-5">
            <button
              onClick={() => handleTabSwitch('I')}
              className={`w-full flex items-center justify-between text-xs tracking-widest uppercase transition-colors duration-200 pb-2 border-b ${
                activeTab === 'I' ? 'border-[#1A1A1A] text-[#1A1A1A] font-medium' : 'border-transparent text-[#737370] hover:text-[#1A1A1A]'
              }`}
            >
              <span className="font-serif text-sm mr-3 text-[#A3A39E]">I.</span>
              <span className="flex-1 text-left">3D Dress & Camera Studio</span>
              <Compass className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>

            <button
              onClick={() => handleTabSwitch('II')}
              className={`w-full flex items-center justify-between text-xs tracking-widest uppercase transition-colors duration-200 pb-2 border-b ${
                activeTab === 'II' ? 'border-[#1A1A1A] text-[#1A1A1A] font-medium' : 'border-transparent text-[#737370] hover:text-[#1A1A1A]'
              }`}
            >
              <span className="font-serif text-sm mr-3 text-[#A3A39E]">II.</span>
              <span className="flex-1 text-left">Tracker Map</span>
              <Package className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>

            <button
              onClick={() => handleTabSwitch('III')}
              className={`w-full flex items-center justify-between text-xs tracking-widest uppercase transition-colors duration-200 pb-2 border-b ${
                activeTab === 'III' ? 'border-[#1A1A1A] text-[#1A1A1A] font-medium' : 'border-transparent text-[#737370] hover:text-[#1A1A1A]'
              }`}
            >
              <span className="font-serif text-sm mr-3 text-[#A3A39E]">III.</span>
              <span className="flex-1 text-left">Reviews & Ratings</span>
              <MessageSquare className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>

            <button
              onClick={() => handleTabSwitch('IV')}
              className={`w-full flex items-center justify-between text-xs tracking-widest uppercase transition-colors duration-200 pb-2 border-b ${
                activeTab === 'IV' ? 'border-[#1A1A1A] text-[#1A1A1A] font-medium' : 'border-transparent text-[#737370] hover:text-[#1A1A1A]'
              }`}
            >
              <span className="font-serif text-sm mr-3 text-[#A3A39E]">IV.</span>
              <span className="flex-1 text-left">Clearance Archive</span>
              <Tag className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </nav>
        </div>

        <div className="pt-8 border-t border-[#E5E5E0]">
          <p className="text-[10px] text-[#A3A39E] tracking-wider uppercase">
            Edition 2026 / V2.08
          </p>
        </div>
      </aside>

      {/* ------------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA                                                   */}
      {/* ------------------------------------------------------------------- */}
      <main className="flex-1 overflow-y-auto p-12 lg:p-16">

        {/* =================================================================== */}
        {/* SECTION I: 3D DRESS MODEL & INTERACTIVE CUSTOMIZER WITH CAMERA       */}
        {/* =================================================================== */}
        {activeTab === 'I' && (
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="border-b border-[#E5E5E0] pb-6 flex justify-between items-end">
              <div>
                <span className="text-xs font-serif text-[#A3A39E] tracking-widest">SECTION I</span>
                <h2 className="font-serif text-3xl font-light text-[#1A1A1A] tracking-wide mt-1">
                  3D Dress Customizer & Fitting Camera
                </h2>
              </div>
              <p className="text-xs text-[#737370] tracking-widest uppercase">
                Custom Fitting Canvas
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* 3D Model Display Canvas */}
              <div className="lg:col-span-8 bg-[#F2F2EE] border border-[#E5E5E0] p-8 flex flex-col justify-between h-[580px] relative overflow-hidden">
                
                {/* Header info */}
                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-[#737370]">
                      {dressModels[selectedDressModel].code}
                    </span>
                    <h3 className="font-serif text-xl font-normal text-[#1A1A1A]">
                      {dressModels[selectedDressModel].name}
                    </h3>
                  </div>

                  {/* Camera Fitting Toggle Button */}
                  <button
                    onClick={toggleCamera}
                    className={`flex items-center gap-2 px-3 py-1.5 border text-xs tracking-widest uppercase transition-all ${
                      cameraActive ? 'bg-[#1A1A1A] text-[#FBFBFA] border-[#1A1A1A]' : 'bg-[#FBFBFA] text-[#1A1A1A] border-[#E5E5E0] hover:border-[#1A1A1A]'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{cameraActive ? 'Disable Camera' : 'Live Fitting Camera'}</span>
                  </button>
                </div>

                {/* Simulated 3D Model Render Frame */}
                <div className="absolute inset-0 p-8 flex items-center justify-center pointer-events-none">
                  
                  {/* Camera Video Overlay (If Enabled) */}
                  {cameraActive && (
                    <div className="absolute inset-0 z-0 opacity-40 overflow-hidden flex items-center justify-center">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover grayscale contrast-125" 
                      />
                    </div>
                  )}

                  {/* 3D Model Dress Layer with Dynamic Controls */}
                  <div 
                    className="relative transition-all duration-300 ease-out z-10 flex items-center justify-center"
                    style={{
                      transform: `rotate(${modelRotation}deg) scale(${modelScale})`,
                      filter: `drop-shadow(0px 10px 20px rgba(0,0,0,0.15))`
                    }}
                  >
                    <img 
                      src={dressModels[selectedDressModel].baseImg} 
                      alt="3D Dress Model" 
                      className="max-h-[420px] object-contain grayscale opacity-90 transition-all duration-500"
                    />
                    {/* Color tint mask for dress customization */}
                    <div 
                      className="absolute inset-0 mix-blend-color opacity-70 pointer-events-none transition-colors duration-300"
                      style={{ backgroundColor: dressColor }}
                    />
                  </div>
                </div>

                {/* 3D Canvas Interactive Viewport Controls */}
                <div className="z-10 bg-[#FBFBFA]/90 backdrop-blur-sm border border-[#E5E5E0] p-2 flex items-center justify-between self-center gap-4">
                  <button 
                    onClick={() => setModelRotation(r => r - 45)}
                    className="flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-[#737370] hover:text-[#1A1A1A] px-2.5 py-1"
                  >
                    <RotateCw className="w-3 h-3 transform -scale-x-100" />
                    <span>Rotate L</span>
                  </button>
                  <span className="text-[#E5E5E0]">|</span>
                  <button 
                    onClick={() => setModelScale(s => Math.min(s + 0.15, 1.4))}
                    className="flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-[#737370] hover:text-[#1A1A1A] px-2.5 py-1"
                  >
                    <ZoomIn className="w-3 h-3" />
                    <span>Zoom In</span>
                  </button>
                  <span className="text-[#E5E5E0]">|</span>
                  <button 
                    onClick={() => setModelScale(s => Math.max(s - 0.15, 0.7))}
                    className="flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-[#737370] hover:text-[#1A1A1A] px-2.5 py-1"
                  >
                    <ZoomOut className="w-3 h-3" />
                    <span>Zoom Out</span>
                  </button>
                  <span className="text-[#E5E5E0]">|</span>
                  <button 
                    onClick={() => { setModelRotation(0); setModelScale(1); }}
                    className="flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-[#737370] hover:text-[#1A1A1A] px-2.5 py-1"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                  <span className="text-[#E5E5E0]">|</span>
                  <button 
                    onClick={captureDesignSnapshot}
                    className="flex items-center gap-1.5 text-[11px] tracking-widest uppercase bg-[#1A1A1A] text-[#FBFBFA] px-3 py-1 hover:bg-[#2A2A2A]"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Capture Snapshot</span>
                  </button>
                </div>

              </div>

              {/* Sidebar Customizer Tools */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Custom Color Selector */}
                <div className="border border-[#E5E5E0] bg-[#FBFBFA] p-5 space-y-3">
                  <span className="text-xs uppercase tracking-widest text-[#1A1A1A] font-medium block">
                    Fabric Color Tone
                  </span>
                  <div className="flex items-center gap-3">
                    {[
                      { name: 'Noir', hex: '#1A1A1A' },
                      { name: 'Ivory', hex: '#E5E5E0' },
                      { name: 'Crimson', hex: '#881337' },
                      { name: 'Midnight', hex: '#1E3A8A' },
                      { name: 'Olive', hex: '#365314' }
                    ].map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setDressColor(c.hex)}
                        style={{ backgroundColor: c.hex }}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center transition-transform ${
                          dressColor === c.hex ? 'scale-110 border-[#1A1A1A] ring-2 ring-offset-2 ring-[#1A1A1A]' : 'border-[#E5E5E0]'
                        }`}
                      >
                        {dressColor === c.hex && <Check className={`w-3 h-3 ${c.hex === '#E5E5E0' ? 'text-black' : 'text-white'}`} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fabric Texture Selector */}
                <div className="border border-[#E5E5E0] bg-[#FBFBFA] p-5 space-y-3">
                  <span className="text-xs uppercase tracking-widest text-[#1A1A1A] font-medium block">
                    Material Drapery
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Silk Satin', 'Heavy Wool', 'Organza'].map((mat) => (
                      <button
                        key={mat}
                        onClick={() => setDressTexture(mat)}
                        className={`py-2 px-2 text-[10px] uppercase tracking-wider border text-center transition-colors ${
                          dressTexture === mat ? 'bg-[#1A1A1A] text-[#FBFBFA] border-[#1A1A1A]' : 'bg-[#F2F2EE] text-[#737370] border-[#E5E5E0] hover:border-[#1A1A1A]'
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select Base Model */}
                <div className="border border-[#E5E5E0] bg-[#FBFBFA] p-5 space-y-3">
                  <span className="text-xs uppercase tracking-widest text-[#1A1A1A] font-medium block">
                    Base Dress Silhouette
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {dressModels.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedDressModel(idx)}
                        className={`p-2 border text-left bg-[#F2F2EE] transition-all ${
                          selectedDressModel === idx ? 'border-[#1A1A1A]' : 'border-[#E5E5E0] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="aspect-[3/4] bg-[#FBFBFA] mb-2 overflow-hidden">
                          <img src={item.baseImg} alt={item.name} className="w-full h-full object-cover grayscale" />
                        </div>
                        <p className="text-[9px] uppercase tracking-widest text-[#737370]">{item.code}</p>
                        <p className="font-serif text-xs text-[#1A1A1A] truncate">{item.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Snapshot Result Box */}
                {capturedDesign && (
                  <div className="border border-[#1A1A1A] bg-[#FBFBFA] p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest text-[#1A1A1A] font-medium">Design Snapshot Saved</span>
                      <span className="text-[9px] font-mono text-[#737370]">{capturedDesign.time}</span>
                    </div>
                    <p className="text-xs font-serif text-[#1A1A1A]">{capturedDesign.dress}</p>
                    <p className="text-[10px] text-[#737370]">Material: {capturedDesign.texture} • Color Tint Applied</p>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* SECTION II: LOGISTICS TRACKER MAP                                  */}
        {/* =================================================================== */}
        {activeTab === 'II' && (
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="border-b border-[#E5E5E0] pb-6 flex justify-between items-end">
              <div>
                <span className="text-xs font-serif text-[#A3A39E] tracking-widest">SECTION II</span>
                <h2 className="font-serif text-3xl font-light text-[#1A1A1A] tracking-wide mt-1">
                  Package Tracking & Live Route Map
                </h2>
              </div>
              <p className="text-xs text-[#737370] tracking-widest uppercase">WAYBILL: #882-9012-LX</p>
            </div>

            <div className="bg-[#F2F2EE] border border-[#E5E5E0] p-8 space-y-6">
              <div className="flex flex-wrap justify-between items-center pb-6 border-b border-[#E5E5E0] gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#737370]">Current Waypoint</span>
                  <p className="font-serif text-2xl text-[#1A1A1A] mt-0.5">
                    {waypoints[selectedWaypoint].city}, {waypoints[selectedWaypoint].country}
                  </p>
                  <p className="text-xs text-[#737370] font-light mt-1">
                    {waypoints[selectedWaypoint].title} — <span className="text-[#1A1A1A] font-medium">{waypoints[selectedWaypoint].status}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest text-[#737370]">Live Coordinates</span>
                  <p className="font-mono text-xs text-[#2A2A2A] mt-1 bg-[#FBFBFA] px-3 py-1.5 border border-[#E5E5E0] inline-block">
                    {waypoints[selectedWaypoint].coords}
                  </p>
                </div>
              </div>

              {/* Map Canvas */}
              <div 
                className={`h-[440px] border border-[#E5E5E0] relative overflow-hidden select-none cursor-grab active:cursor-grabbing transition-colors ${
                  showSatelliteOverlay ? 'bg-[#1A1A1A]' : 'bg-[#FBFBFA]'
                }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div className={`absolute inset-0 pointer-events-none transition-opacity ${
                  showSatelliteOverlay 
                    ? 'bg-[linear-gradient(to_right,#333333_1px,transparent_1px),linear-gradient(to_bottom,#333333_1px,transparent_1px)] opacity-20' 
                    : 'bg-[linear-gradient(to_right,#e5e5e0_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e0_1px,transparent_1px)] opacity-40'
                } bg-[size:2.5rem_2.5rem]`} />

                <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
                  <div className="flex items-center gap-2 bg-[#FBFBFA]/90 border border-[#E5E5E0] px-3 py-1.5 backdrop-blur-sm pointer-events-auto">
                    <Navigation className="w-3 h-3 text-[#1A1A1A]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#1A1A1A] font-medium">GPS Route Tracker</span>
                  </div>

                  <div className="flex items-center gap-2 bg-[#FBFBFA]/90 border border-[#E5E5E0] p-1 backdrop-blur-sm pointer-events-auto shadow-sm">
                    <button onClick={() => handleZoom('in')} className="p-1.5 hover:bg-[#F2F2EE] text-[#1A1A1A]"><ZoomIn className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleZoom('out')} className="p-1.5 hover:bg-[#F2F2EE] text-[#1A1A1A]"><ZoomOut className="w-3.5 h-3.5" /></button>
                    <span className="text-[#E5E5E0]">|</span>
                    <button onClick={handleResetMap} className="p-1.5 hover:bg-[#F2F2EE] text-[#1A1A1A]"><RefreshCw className="w-3.5 h-3.5" /></button>
                    <span className="text-[#E5E5E0]">|</span>
                    <button onClick={() => setShowSatelliteOverlay(!showSatelliteOverlay)} className={`p-1.5 transition-colors ${showSatelliteOverlay ? 'bg-[#1A1A1A] text-[#FBFBFA]' : 'hover:bg-[#F2F2EE] text-[#1A1A1A]'}`}><Layers className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <div 
                  className="w-full h-full transition-transform duration-100 ease-out flex items-center justify-center"
                  style={{ transform: `translate(${mapPan.x}px, ${mapPan.y}px) scale(${mapZoom})`, transformOrigin: 'center center' }}
                >
                  <svg className="w-[850px] h-[320px] overflow-visible" viewBox="0 0 850 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g className={showSatelliteOverlay ? 'stroke-[#333333]' : 'stroke-[#E5E5E0]'} strokeWidth="1" fill="none">
                      <path d="M 50,180 Q 100,120 200,140 T 300,200 T 220,280 T 80,240 Z" />
                      <path d="M 280,80 Q 380,40 480,90 T 520,180 T 400,220 T 310,140 Z" />
                      <path d="M 580,120 Q 680,80 780,140 T 750,260 T 620,220 Z" />
                    </g>
                    <path d="M 150 220 C 220 160, 260 130, 320 140 C 380 150, 440 200, 500 180 C 580 150, 640 220, 700 260" stroke={showSatelliteOverlay ? '#555555' : '#D1D1C9'} strokeWidth="2" strokeDasharray="6 6" />
                    <path d="M 150 220 C 220 160, 260 130, 320 140" stroke={showSatelliteOverlay ? '#FBFBFA' : '#1A1A1A'} strokeWidth="2.5" />

                    {waypoints.map((wp) => {
                      const isSelected = selectedWaypoint === wp.id;
                      const isCompleted = wp.id <= 1;

                      return (
                        <g key={wp.id} onClick={(e) => { e.stopPropagation(); setSelectedWaypoint(wp.id); }} className="cursor-pointer group">
                          {isSelected && <circle cx={wp.cx} cy={wp.cy} r="18" className={`fill-none animate-ping opacity-30 ${showSatelliteOverlay ? 'stroke-[#FBFBFA]' : 'stroke-[#1A1A1A]'}`} strokeWidth="1.5" />}
                          <circle cx={wp.cx} cy={wp.cy} r={isSelected ? "10" : "6"} className={`transition-all duration-300 ${isSelected ? (showSatelliteOverlay ? 'fill-[#1A1A1A] stroke-[#FBFBFA] stroke-2' : 'fill-[#FBFBFA] stroke-[#1A1A1A] stroke-2') : isCompleted ? (showSatelliteOverlay ? 'fill-[#FBFBFA]' : 'fill-[#1A1A1A]') : (showSatelliteOverlay ? 'fill-[#2A2A2A] stroke-[#555555] stroke-1' : 'fill-[#FBFBFA] stroke-[#A3A39E] stroke-1.5')}`} />
                          {isSelected && <circle cx={wp.cx} cy={wp.cy} r="3" className={showSatelliteOverlay ? 'fill-[#FBFBFA]' : 'fill-[#1A1A1A]'} />}
                          <text x={wp.cx} y={wp.cy - 16} textAnchor="middle" className={`text-[10px] font-sans tracking-widest uppercase font-medium transition-all ${isSelected ? (showSatelliteOverlay ? 'fill-[#FBFBFA]' : 'fill-[#1A1A1A]') : 'fill-[#737370]'}`}>
                            {wp.city}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Waypoint Card Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {waypoints.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => setSelectedWaypoint(wp.id)}
                    className={`text-left p-3 transition-all border ${
                      selectedWaypoint === wp.id ? 'border-[#1A1A1A] bg-[#FBFBFA] shadow-sm' : 'border-[#E5E5E0] bg-[#FBFBFA]/60 hover:border-[#A3A39E]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] tracking-widest uppercase text-[#737370]">0{wp.id + 1}.</span>
                      <MapPin className={`w-3 h-3 ${selectedWaypoint === wp.id ? 'text-[#1A1A1A]' : 'text-[#A3A39E]'}`} />
                    </div>
                    <p className="font-serif text-sm text-[#1A1A1A] truncate">{wp.city}</p>
                    <p className="text-[9px] uppercase tracking-wider text-[#737370] truncate mt-0.5">{wp.status}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* SECTION III: REVIEWS & 5-STAR COMMENTS                              */}
        {/* =================================================================== */}
        {activeTab === 'III' && (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="border-b border-[#E5E5E0] pb-6 flex justify-between items-end">
              <div>
                <span className="text-xs font-serif text-[#A3A39E] tracking-widest">SECTION III</span>
                <h2 className="font-serif text-3xl font-light text-[#1A1A1A] tracking-wide mt-1">
                  Client Reviews & Evaluations
                </h2>
              </div>
              <p className="text-xs text-[#737370] tracking-widest uppercase">{reviews.length} Submissions</p>
            </div>

            {/* Form */}
            <form onSubmit={handleReviewSubmit} className="border border-[#E5E5E0] bg-[#FBFBFA] p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#1A1A1A] font-medium block">Write an Assessment</span>
                  <span className="text-[10px] text-[#737370]">Select star rating and write your feedback below.</span>
                </div>
                
                <div className="flex items-center gap-2 bg-[#F2F2EE] px-4 py-2 border border-[#E5E5E0]">
                  <span className="text-[10px] uppercase tracking-widest text-[#737370] mr-2">Score:</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none"
                      >
                        <Star className={`w-4 h-4 transition-colors ${star <= (hoverRating || rating) ? 'fill-[#1A1A1A] stroke-[#1A1A1A]' : 'fill-transparent stroke-[#A3A39E]'}`} />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-serif text-[#1A1A1A] ml-2">{hoverRating || rating}/5</span>
                </div>
              </div>

              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review regarding dress fitting, drape simulation, or custom studio options..."
                className="w-full bg-[#F2F2EE] border border-[#E5E5E0] p-4 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] resize-none"
              />

              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2 bg-[#1A1A1A] text-[#FBFBFA] px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-[#2A2A2A]">
                  <span>Submit Comment</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="border-b border-[#E5E5E0] pb-6 space-y-3 bg-[#FBFBFA] p-6 border">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-base text-[#1A1A1A]">{rev.author}</span>
                      <span className="text-[10px] text-[#A3A39E]">•</span>
                      <span className="text-[10px] tracking-widest text-[#737370] uppercase">{rev.date}</span>
                    </div>
                    <div className="flex gap-1 bg-[#F2F2EE] px-2.5 py-1 border border-[#E5E5E0]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-[#1A1A1A] stroke-[#1A1A1A]' : 'fill-transparent stroke-[#E5E5E0]'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#2A2A2A] leading-relaxed font-light">"{rev.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* SECTION IV: CLEARANCE ARCHIVE WITH FILTERING                       */}
        {/* =================================================================== */}
        {activeTab === 'IV' && (
          <div className="max-w-6xl mx-auto space-y-10">
            
            {/* Header */}
            <div className="border-b border-[#E5E5E0] pb-6 flex justify-between items-end">
              <div>
                <span className="text-xs font-serif text-[#A3A39E] tracking-widest">SECTION IV</span>
                <h2 className="font-serif text-3xl font-light text-[#1A1A1A] tracking-wide mt-1">
                  Clearance Archive & Private Sale
                </h2>
              </div>
              <p className="text-xs text-[#737370] tracking-widest uppercase">
                {filteredClearance.length} Available Pieces
              </p>
            </div>

            {/* Interactive Filters Bar */}
            <div className="border border-[#E5E5E0] bg-[#FBFBFA] p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-[#E5E5E0] pb-3">
                <SlidersHorizontal className="w-4 h-4 text-[#1A1A1A]" />
                <span className="text-xs uppercase tracking-widest text-[#1A1A1A] font-medium">
                  Filter Clearance Items
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Maximum Price Filter */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="uppercase tracking-widest text-[#737370]">Max Price:</span>
                    <span className="font-serif font-medium text-[#1A1A1A]">${maxPrice}</span>
                  </div>
                  <input 
                    type="range" 
                    min="150" 
                    max="600" 
                    step="20"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#1A1A1A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#A3A39E] font-mono">
                    <span>$150</span>
                    <span>$600</span>
                  </div>
                </div>

                {/* Color Palette Filter */}
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-[#737370] block">Color Family:</span>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Black', 'White', 'Red', 'Blue', 'Green'].map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColorFilter(col)}
                        className={`px-3 py-1 text-[10px] uppercase tracking-wider border transition-colors ${
                          selectedColorFilter === col 
                            ? 'bg-[#1A1A1A] text-[#FBFBFA] border-[#1A1A1A]' 
                            : 'bg-[#F2F2EE] text-[#737370] border-[#E5E5E0] hover:border-[#1A1A1A]'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Garment Category Filter */}
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-[#737370] block">Garment Type:</span>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="w-full bg-[#F2F2EE] border border-[#E5E5E0] p-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  >
                    <option value="All">All Categories</option>
                    <option value="Eveningwear">Eveningwear</option>
                    <option value="Prêt-à-Porter">Prêt-à-Porter</option>
                    <option value="Tailoring">Tailoring</option>
                    <option value="Outerwear">Outerwear</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Clearance Product Grid */}
            {filteredClearance.length === 0 ? (
              <div className="text-center py-16 border border-[#E5E5E0] bg-[#FBFBFA]">
                <p className="font-serif text-lg text-[#1A1A1A]">No pieces found matching your filter criteria.</p>
                <button 
                  onClick={() => { setMaxPrice(600); setSelectedColorFilter('All'); setSelectedCategoryFilter('All'); }}
                  className="mt-4 text-xs uppercase tracking-widest border-b border-[#1A1A1A] pb-0.5 text-[#1A1A1A]"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredClearance.map((item) => (
                  <div key={item.id} className="border border-[#E5E5E0] bg-[#FBFBFA] p-4 flex flex-col justify-between group hover:border-[#1A1A1A] transition-colors">
                    <div>
                      <div className="aspect-[3/4] bg-[#F2F2EE] mb-4 overflow-hidden relative">
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-opacity" 
                        />
                        <span className="absolute top-3 right-3 bg-[#1A1A1A] text-[#FBFBFA] text-[9px] uppercase tracking-widest px-2 py-1">
                          SALE
                        </span>
                      </div>
                      <span className="text-[10px] tracking-widest uppercase text-[#737370]">{item.category} • {item.color}</span>
                      <h3 className="font-serif text-base text-[#1A1A1A] mt-1 mb-2">{item.name}</h3>
                    </div>

                    <div className="pt-3 border-t border-[#E5E5E0] flex items-center justify-between">
                      <div>
                        <span className="line-through text-xs text-[#A3A39E] mr-2">${item.originalPrice}</span>
                        <span className="font-serif text-base font-normal text-[#1A1A1A]">${item.price}</span>
                      </div>
                      <button className="text-[10px] uppercase tracking-widest border border-[#1A1A1A] px-3 py-1.5 hover:bg-[#1A1A1A] hover:text-[#FBFBFA] transition-colors">
                        Acquire Piece
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}