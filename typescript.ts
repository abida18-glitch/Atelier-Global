import React, { useState, useEffect } from 'react';
import { 
  Shirt, 
  Package, 
  Star, 
  Camera, 
  RotateCw, 
  Maximize2, 
  Eye, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles, 
  Sliders, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// ==========================================
// DATA & TYPES DEFINITIONS
// ==========================================

type FabricType = 
  | 'Satin' | 'Silk' | 'Lace' | 'Denim' | 'Velvet' 
  | 'Corduroy' | 'Chiffon' | 'Brocade' | 'Organza' 
  | 'Tulle' | 'Linen' | 'Tweed' | 'Leather' | 'Technical Knit';

type SilhouetteType = 'A-Line' | 'Bodycon' | 'Mermaid' | 'Ballgown' | 'Slip' | 'Asymmetrical';

interface DressItem {
  id: string;
  name: string;
  silhouette: SilhouetteType;
  fabric: FabricType;
  price: number;
  image: string;
  macroImage: string;
  description: string;
  roughness: number;
  sheen: number;
  weight: string;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  dressName: string;
}

// Sample catalog dataset featuring real fashion photography references
const DRESS_CATALOG: DressItem[] = [
  {
    id: 'd1',
    name: 'Midnight Azure Silk Gown',
    silhouette: 'Ballgown',
    fabric: 'Silk',
    price: 850,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    description: '100% Mulberry Silk featuring a lustrous drape and lightweight breathability designed for formal galas.',
    roughness: 0.1,
    sheen: 0.9,
    weight: '19mm Silk Crepe'
  },
  {
    id: 'd2',
    name: 'Crimson Velvet Bodycon',
    silhouette: 'Bodycon',
    fabric: 'Velvet',
    price: 620,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    description: 'Deep crimson cotton velvet with rich pile depth and structured stretch support.',
    roughness: 0.8,
    sheen: 0.95,
    weight: '350 GSM'
  },
  {
    id: 'd3',
    name: 'Victorian Lace Slip Dress',
    silhouette: 'Slip',
    fabric: 'Lace',
    price: 740,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=80',
    description: 'Intricate corded floral Chantilly lace overlay over fine silk organza lining.',
    roughness: 0.6,
    sheen: 0.2,
    weight: '120 GSM'
  },
  {
    id: 'd4',
    name: 'Royal Brocade Mermaid Gown',
    silhouette: 'Mermaid',
    fabric: 'Brocade',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    description: 'Gold-metallic interwoven floral motifs providing architectural rigidity and structured flare.',
    roughness: 0.35,
    sheen: 0.6,
    weight: '420 GSM'
  },
  {
    id: 'd5',
    name: 'Asymmetrical Chiffon Breeze',
    silhouette: 'Asymmetrical',
    fabric: 'Chiffon',
    price: 490,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=800&q=80',
    description: 'Ethereal multi-layered silk chiffon creating dynamic fluid movement with light transmission.',
    roughness: 0.25,
    sheen: 0.4,
    weight: '50 GSM'
  },
  {
    id: 'd6',
    name: 'Structured Raw Denim Maxi',
    silhouette: 'A-Line',
    fabric: 'Denim',
    price: 380,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80',
    description: 'Heavyweight organic indigo raw denim with contrast topstitching and custom tailoring lines.',
    roughness: 0.75,
    sheen: 0.05,
    weight: '14 oz Denim'
  },
  {
    id: 'd7',
    name: 'Sculpted Leather Silhouette',
    silhouette: 'Bodycon',
    fabric: 'Leather',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    description: 'Supple full-grain Nappa leather with semi-matte finish and precision seam panelling.',
    roughness: 0.2,
    sheen: 0.1,
    weight: '1.1mm Nappa'
  },
  {
    id: 'd8',
    name: 'Neoprene Technical Knit Gown',
    silhouette: 'Mermaid',
    fabric: 'Technical Knit',
    price: 560,
    image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    description: 'High-tech double-knit synthetic mesh offering 4-way stretch and moisture-wicking properties.',
    roughness: 0.4,
    sheen: 0.3,
    weight: '280 GSM'
  }
];

const FABRIC_OPTIONS: FabricType[] = [
  'Satin', 'Silk', 'Lace', 'Denim', 'Velvet', 
  'Corduroy', 'Chiffon', 'Brocade', 'Organza', 
  'Tulle', 'Linen', 'Tweed', 'Leather', 'Technical Knit'
];

export default function FashionStudioApp() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'tracker' | 'reviews'>('catalog');
  
  // Studio Camera & Selection State
  const [selectedDress, setSelectedDress] = useState<DressItem>(DRESS_CATALOG[0]);
  const [cameraAngle, setCameraAngle] = useState<'turntable' | 'high' | 'front' | 'macro'>('front');
  const [activeFabricFilter, setActiveFabricFilter] = useState<string>('All');
  const [turntableRotation, setTurntableRotation] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  // Auto-turntable animation effect
  useEffect(() => {
    let interval: any;
    if (cameraAngle === 'turntable' || isRotating) {
      interval = setInterval(() => {
        setTurntableRotation((prev) => (prev + 5) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [cameraAngle, isRotating]);

  // Review State
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'r1',
      author: 'Sophia Rothschild',
      rating: 5,
      date: '2026-07-28',
      comment: 'The 3D micro texture preview was spot on! When the silk dress arrived, the sheen and stitch detail matched the exact specifications shown in the studio view.',
      verified: true,
      dressName: 'Midnight Azure Silk Gown'
    },
    {
      id: 'r2',
      author: 'Elena Rostova',
      rating: 5,
      date: '2026-08-02',
      comment: 'Ordering custom couture online used to terrify me. The live shipment tracker gave me complete transparency from tailoring to pre-shipment QA!',
      verified: true,
      dressName: 'Royal Brocade Mermaid Gown'
    }
  ]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;

    const newEntry: Review = {
      id: `r-${Date.now()}`,
      author: newReviewAuthor,
      rating: newRating,
      date: new Date().toISOString().split('T')[0],
      comment: newReviewText,
      verified: true,
      dressName: selectedDress.name
    };

    setReviews([newEntry, ...reviews]);
    setNewReviewAuthor('');
    setNewReviewText('');
    setNewRating(5);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#1e3a8a', '#9f1239', '#e11d48', '#ffffff']
    });
  };

  const filteredCatalog = activeFabricFilter === 'All' 
    ? DRESS_CATALOG 
    : DRESS_CATALOG.filter(d => d.fabric === activeFabricFilter);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-rose-950 text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* ============================================================================== */}
      {/* STICKY LEFT-HAND COLUMN NAVIGATION                                           */}
      {/* ============================================================================== */}
      <aside className="w-72 bg-slate-950/80 backdrop-blur-xl border-r border-rose-900/30 flex flex-col justify-between p-6 sticky top-0 h-screen z-50">
        <div>
          {/* Brand Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-amber-100 tracking-wide font-bold italic" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Atelier Lumière
            </h1>
            <p className="text-xs uppercase tracking-widest text-rose-300/60 mt-2 font-medium">3D Haute Couture Studio</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-3">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'catalog'
                  ? 'bg-gradient-to-r from-blue-900/80 to-rose-900/80 text-white shadow-lg shadow-rose-950/50 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Shirt className={`w-5 h-5 ${activeTab === 'catalog' ? 'text-rose-400' : ''}`} />
              <span className="text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>3D Studio Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'tracker'
                  ? 'bg-gradient-to-r from-blue-900/80 to-rose-900/80 text-white shadow-lg shadow-rose-950/50 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Package className={`w-5 h-5 ${activeTab === 'tracker' ? 'text-rose-400' : ''}`} />
              <span className="text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Package Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'reviews'
                  ? 'bg-gradient-to-r from-blue-900/80 to-rose-900/80 text-white shadow-lg shadow-rose-950/50 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Star className={`w-5 h-5 ${activeTab === 'reviews' ? 'text-rose-400' : ''}`} />
              <span className="text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Couture Reviews</span>
            </button>
          </nav>
        </div>

        {/* Footer Info */}
        <div className="border-t border-slate-800/80 pt-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-rose-400/80 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-semibold">Tailor-Certified Platform</span>
          </div>
          <p>Powered by Real-Time WebGL Rendering & Overseas Escrow Guarantee.</p>
        </div>
      </aside>

      {/* ============================================================================== */}
      {/* MAIN CONTENT WORKSPACE                                                         */}
      {/* ============================================================================== */}
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto">
        
        {/* TAB 1: DYNAMIC 3D DRESS CATALOG & CAMERA STUDIO */}
        {activeTab === 'catalog' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            
            {/* Header Title */}
            <div className="mb-8">
              <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-amber-100 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                3D Fashion Design & Camera Studio
              </h2>
              <p className="text-slate-400 mt-2">Explore multi-angle cinematic views, macro stitch textures, and internet-sourced textile arrays.</p>
            </div>

            {/* MAIN STUDIO VIEWPORT & CONTROLS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              
              {/* 3D Viewport Box */}
              <div className="lg:col-span-8 bg-slate-900/60 border border-rose-900/30 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[520px]">
                
                {/* Viewport Overlay Controls */}
                <div className="flex justify-between items-center z-10">
                  <div className="bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-slate-300 font-medium">Cycles Engine Active</span>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-rose-300 uppercase tracking-widest font-semibold">{selectedDress.silhouette}</p>
                    <p className="text-sm font-semibold text-white">{selectedDress.name}</p>
                  </div>
                </div>

                {/* Simulated Visual 3D Viewport Stage */}
                <div className="relative my-4 h-96 flex items-center justify-center overflow-hidden rounded-xl bg-slate-950/40">
                  
                  {/* Angle Specific Render Simulations */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${selectedDress.id}-${cameraAngle}-${turntableRotation}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      {cameraAngle === 'macro' ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={selectedDress.macroImage} 
                            alt="Macro Texture View" 
                            className="w-full h-full object-cover rounded-lg border border-rose-500/30"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                            <div>
                              <p className="text-xs uppercase text-rose-400 font-bold tracking-widest">Macro Texture Analysis</p>
                              <p className="text-sm text-slate-200">Fabric Weight: {selectedDress.weight} | Roughness: {selectedDress.roughness}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative h-full flex items-center justify-center" style={{ transform: cameraAngle === 'turntable' ? `rotateY(${turntableRotation}deg)` : 'none' }}>
                          <img 
                            src={selectedDress.image} 
                            alt={selectedDress.name}
                            className={`h-full object-contain filter drop-shadow-[0_20px_50px_rgba(225,29,72,0.25)] transition-all duration-500 ${
                              cameraAngle === 'high' ? 'scale-125 translate-y-8 rotate-3' : 'scale-100'
                            }`}
                          />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Grid Lines Overlay to mimic 3D Software */}
                  <div className="absolute inset-0 border border-slate-800/40 pointer-events-none rounded-xl grid grid-cols-6 grid-rows-6">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className="border-[0.5px] border-slate-800/20"></div>
                    ))}
                  </div>
                </div>

                {/* CINEMATIC CAMERA TOOL CONTROL PANEL */}
                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl backdrop-blur-md z-10">
                  <p className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-2 flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5 text-rose-400" />
                    Cinematic Camera Rig Control
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <button
                      onClick={() => setCameraAngle('front')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                        cameraAngle === 'front' 
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-950' 
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      1. Studio Front
                    </button>

                    <button
                      onClick={() => setCameraAngle('high')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                        cameraAngle === 'high' 
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-950' 
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      2. High Angle
                    </button>

                    <button
                      onClick={() => setCameraAngle('macro')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                        cameraAngle === 'macro' 
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-950' 
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5" />
                      3. Macro Close-Up
                    </button>

                    <button
                      onClick={() => setCameraAngle('turntable')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                        cameraAngle === 'turntable' 
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-950' 
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${cameraAngle === 'turntable' ? 'animate-spin' : ''}`} />
                      4. 360° Turntable
                    </button>
                  </div>
                </div>

              </div>

              {/* Garment Details & Shader Specs */}
              <div className="lg:col-span-4 bg-slate-900/60 border border-rose-900/30 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-rose-400 bg-rose-950/60 border border-rose-800/40 px-2.5 py-1 rounded-full">
                      {selectedDress.fabric}
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {selectedDress.name}
                    </h3>
                    <p className="text-2xl font-semibold text-rose-300 mt-1">${selectedDress.price} <span className="text-xs text-slate-400 font-normal">USD</span></p>
                  </div>

                  <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                    {selectedDress.description}
                  </p>

                  {/* Material Shader Controls (Procedural Map Display) */}
                  <div className="space-y-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs uppercase text-slate-400 font-bold tracking-wider flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-blue-400" />
                      PBR Material Properties
                    </p>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Roughness Parameter</span>
                        <span>{selectedDress.roughness}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: `${selectedDress.roughness * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Specular Sheen</span>
                        <span>{selectedDress.sheen}</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full" style={{ width: `${selectedDress.sheen * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Fabric Spec Density</span>
                        <span>{selectedDress.weight}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-rose-950/80 transition-all duration-300 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Order Custom Tailored Fit
                </button>
              </div>

            </div>

            {/* DYNAMIC FABRIC FILTER BAR & CATALOG GRID */}
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Internet-Sourced Textile Catalog
                </h3>

                {/* Fabric Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  <button
                    onClick={() => setActiveFabricFilter('All')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      activeFabricFilter === 'All'
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    All Fabrics
                  </button>
                  {FABRIC_OPTIONS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFabricFilter(f)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        activeFabricFilter === f
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Dresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCatalog.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDress(item)}
                    className={`group bg-slate-900/40 border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                      selectedDress.id === item.id 
                        ? 'border-rose-500 shadow-xl shadow-rose-950/40 bg-slate-900/80' 
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="h-64 overflow-hidden relative bg-slate-950/50">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-slate-950/80 border border-slate-700 text-xs px-2.5 py-1 rounded-full text-rose-300 font-medium backdrop-blur-md">
                        {item.fabric}
                      </span>
                    </div>

                    <div className="p-4">
                      <p className="text-xs text-slate-400 uppercase tracking-wider">{item.silhouette}</p>
                      <h4 className="font-bold text-slate-100 group-hover:text-rose-300 transition-colors">{item.name}</h4>
                      <p className="text-rose-400 font-semibold text-sm mt-1">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 2: LIVE PACKAGE TRACKER MAP */}
        {activeTab === 'tracker' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            
            <div className="mb-8">
              <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-amber-100 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                Live Bespoke Shipment Tracker
              </h2>
              <p className="text-slate-400 mt-2">Track your custom overseas tailoring, quality assurance audit, and transit progress.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Visual Map Component Simulation */}
              <div className="lg:col-span-8 bg-slate-900/60 border border-rose-900/30 backdrop-blur-md rounded-2xl p-6 shadow-2xl relative overflow-hidden min-h-[480px] flex flex-col justify-between">
                
                {/* Map Control Header */}
                <div className="flex justify-between items-center z-10 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <div>
                    <p className="text-xs text-rose-400 uppercase font-bold tracking-wider">Tracking ID: #AG-88492-NY</p>
                    <p className="text-sm font-semibold text-white">Route: Da Nang Workshop → New York Hub</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                      In Transit (Flight CX882)
                    </span>
                  </div>
                </div>

                {/* Simulated Geographical Map Canvas */}
                <div className="relative my-4 flex-1 rounded-xl bg-slate-950/80 overflow-hidden border border-slate-800 flex items-center justify-center">
                  
                  {/* Abstract Map Styling (Stylized Grid + Radar Nodes) */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px]"></div>

                  {/* Flight Route Path Visualization */}
                  <svg className="absolute inset-0 w-full h-full stroke-rose-500/40" strokeWidth="2" strokeDasharray="6 6">
                    <path d="M 120 280 Q 300 80 520 200" fill="none" />
                  </svg>

                  {/* Origin Location Node */}
                  <div className="absolute left-[20%] bottom-[30%] flex flex-col items-center">
                    <div className="w-4 h-4 bg-rose-500 rounded-full animate-ping absolute"></div>
                    <div className="w-4 h-4 bg-rose-600 rounded-full border-2 border-white z-10"></div>
                    <span className="text-xs bg-slate-900/90 text-slate-300 px-2 py-0.5 rounded border border-slate-700 mt-2">
                      Vietnam Workshop
                    </span>
                  </div>

                  {/* In-Flight Parcel Icon */}
                  <div className="absolute left-[50%] top-[35%] flex flex-col items-center animate-bounce">
                    <div className="bg-rose-600 text-white p-2 rounded-full shadow-lg shadow-rose-950 border border-rose-300">
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="text-xs bg-rose-950 text-rose-200 px-2 py-0.5 rounded border border-rose-800 mt-1 font-bold">
                      Pacific Air Freight
                    </span>
                  </div>

                  {/* Destination Location Node */}
                  <div className="absolute right-[20%] top-[45%] flex flex-col items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white z-10"></div>
                    <span className="text-xs bg-slate-900/90 text-slate-300 px-2 py-0.5 rounded border border-slate-700 mt-2">
                      New York Client
                    </span>
                  </div>
                </div>

                {/* Live Coordinates Footer */}
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 flex justify-between items-center z-10">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    Current Vector: 35.6762° N, 139.6503° E (Cruising Altitude)
                  </span>
                  <span>Est. Delivery: <strong>Aug 12, 2026</strong></span>
                </div>

              </div>

              {/* Step-by-Step Progress Tracking Timeline */}
              <div className="lg:col-span-4 bg-slate-900/60 border border-rose-900/30 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Milestone Progress
                </h3>

                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
                  
                  {/* Step 1 */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs z-10 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Order Confirmed & 3D Approved</h4>
                      <p className="text-xs text-slate-400">Aug 01, 2026 - Digital pattern sent to master tailor.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs z-10 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Custom Hand Tailoring Completed</h4>
                      <p className="text-xs text-slate-400">Aug 05, 2026 - Silk draping and seam stitching finished.</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs z-10 shrink-0 ring-4 ring-rose-950">
                      <Clock className="w-4 h-4 animate-spin" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-rose-300">Overseas QA Hub Inspection</h4>
                      <p className="text-xs text-slate-300">Aug 08, 2026 - Video inspection verified against 3D specs.</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative flex items-start gap-4 opacity-50">
                    <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs z-10 shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300">Domestic US Hub Arrival</h4>
                      <p className="text-xs text-slate-400">Pending international customs clearance.</p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="relative flex items-start gap-4 opacity-50">
                    <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs z-10 shrink-0">
                      5
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300">Final White-Glove Delivery</h4>
                      <p className="text-xs text-slate-400">Out for courier delivery to recipient.</p>
                    </div>
                  </div>

                </div>

                {/* Help Box */}
                <div className="mt-8 bg-slate-950/60 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-400 shrink-0" />
                  <p className="text-xs text-slate-400">
                    Covered by <strong className="text-slate-200">Atelier Escrow Protection</strong>. Payment released to workshop only upon your final fit approval.
                  </p>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 3: CUSTOMER RATINGS & REVIEWS */}
        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            
            <div className="mb-8">
              <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-amber-100 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                Client Reviews & Ratings
              </h2>
              <p className="text-slate-400 mt-2">Verified feedback on 3D visualization accuracy, tailoring quality, and fit reliability.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Form to Submit New Review */}
              <div className="lg:col-span-5 bg-slate-900/60 border border-rose-900/30 backdrop-blur-md rounded-2xl p-6 shadow-xl h-fit">
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Write a Review
                </h3>
                <p className="text-xs text-slate-400 mb-6">Share your custom dress experience with the Atelier community.</p>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs uppercase text-slate-400 font-bold mb-2">Overall Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              (hoverRating || newRating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-slate-400 font-bold mb-1">Your Name</label>
                    <input
                      type="text"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="e.g. Lady Genevieve"
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-slate-400 font-bold mb-1">Associated Design</label>
                    <input
                      type="text"
                      disabled
                      value={selectedDress.name}
                      className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-slate-400 font-bold mb-1">Feedback Comment</label>
                    <textarea
                      rows={4}
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Describe the fabric quality, fitting accuracy, and shipping process..."
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-rose-950/80 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Verified Review
                  </button>
                </form>
              </div>

              {/* Reviews Display List */}
              <div className="lg:col-span-7 space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-slate-900/60 border border-rose-900/30 backdrop-blur-md rounded-2xl p-6 shadow-md transition-all hover:border-rose-800/50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-lg">{rev.author}</h4>
                          {rev.verified && (
                            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                              Verified Order
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-rose-300">{rev.dressName}</p>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed mb-3">
                      "{rev.comment}"
                    </p>

                    <p className="text-xs text-slate-500 text-right">
                      Reviewed on {rev.date}
                    </p>
                  </div>
                ))}
              </div>

            </div>

          </motion.div>
        )}

      </main>
    </div>
  );
}