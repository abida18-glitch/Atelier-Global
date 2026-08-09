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
  Send, 
  ShieldCheck, 
  Info,
  Check,
  Layers,
  Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ==============================================================================
// 1. DATA MODELS & DATASET
// ==============================================================================

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

const FABRICS_LIST: FabricType[] = [
  'Satin', 'Silk', 'Lace', 'Denim', 'Velvet', 
  'Corduroy', 'Chiffon', 'Brocade', 'Organza', 
  'Tulle', 'Linen', 'Tweed', 'Leather', 'Technical Knit'
];

// Comprehensive Real-World Referenced Catalog Dataset
const DRESS_CATALOG: DressItem[] = [
  {
    id: 'd1',
    name: 'Lavender Mulberry Silk Evening Gown',
    silhouette: 'Ballgown',
    fabric: 'Silk',
    price: 850,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    description: 'I. Premium 100% Mulberry Silk featuring fluid drape dynamics, specular highlights, and breathable weave.',
    roughness: 0.1,
    sheen: 0.9,
    weight: '19mm Silk Crepe'
  },
  {
    id: 'd2',
    name: 'Twilight Velvet Corset Dress',
    silhouette: 'Bodycon',
    fabric: 'Velvet',
    price: 640,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    description: 'II. Deep-pile combed velvet with structured boning and light-absorbing micro-shadows.',
    roughness: 0.85,
    sheen: 0.95,
    weight: '380 GSM Velvet'
  },
  {
    id: 'd3',
    name: 'Chantilly Corded Lace Slip',
    silhouette: 'Slip',
    fabric: 'Lace',
    price: 720,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=80',
    description: 'III. Intricate French corded floral motif overlaid across sheer silk organza lining layer.',
    roughness: 0.6,
    sheen: 0.2,
    weight: '110 GSM Fine Lace'
  },
  {
    id: 'd4',
    name: 'Imperial Jacquard Brocade Gown',
    silhouette: 'Mermaid',
    fabric: 'Brocade',
    price: 1150,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    description: 'IV. Heavily jacquard-woven metallic threads providing structural stiffness and regal lustre.',
    roughness: 0.35,
    sheen: 0.75,
    weight: '440 GSM Brocade'
  },
  {
    id: 'd5',
    name: 'Soft Lavender Chiffon Cascade',
    silhouette: 'Asymmetrical',
    fabric: 'Chiffon',
    price: 510,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=800&q=80',
    description: 'V. Semi-translucent layered chiffon with delicate ruffle drapes transitioning to linen beige highlights.',
    roughness: 0.25,
    sheen: 0.3,
    weight: '55 GSM Chiffon'
  },
  {
    id: 'd6',
    name: 'Structured Indigo Denim Couture',
    silhouette: 'A-Line',
    fabric: 'Denim',
    price: 390,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80',
    description: 'VI. Heavyweight organic Japanese selvedge denim with precision contrast topstitching.',
    roughness: 0.8,
    sheen: 0.05,
    weight: '14.5 oz Selvedge'
  },
  {
    id: 'd7',
    name: 'Sculpted Nappa Leather Mini',
    silhouette: 'Bodycon',
    fabric: 'Leather',
    price: 1290,
    image: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    description: 'VII. Full-grain calfskin leather with hand-waxed sheen, precision darting, and micro-grain texture.',
    roughness: 0.2,
    sheen: 0.4,
    weight: '1.2mm Premium Hide'
  },
  {
    id: 'd8',
    name: 'Ethereal Tulle Illusion Prom Gown',
    silhouette: 'Ballgown',
    fabric: 'Tulle',
    price: 890,
    image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    description: 'VIII. Multi-tiered diamond mesh tulle creating voluminous architectural silhouette layers.',
    roughness: 0.4,
    sheen: 0.2,
    weight: '80 GSM Fine Mesh'
  }
];

export default function AtelierStudioApp() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'tracker' | 'reviews'>('catalog');
  
  // 3D Studio Camera & Selection State
  const [selectedDress, setSelectedDress] = useState<DressItem>(DRESS_CATALOG[0]);
  const [cameraAngle, setCameraAngle] = useState<'turntable' | 'high' | 'front' | 'macro'>('front');
  const [fabricFilter, setFabricFilter] = useState<string>('All');
  const [turntableAngle, setTurntableAngle] = useState<number>(0);

  // 360-Degree Turntable Animation Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cameraAngle === 'turntable') {
      timer = setInterval(() => {
        setTurntableAngle((prev) => (prev + 4) % 360);
      }, 40);
    }
    return () => clearInterval(timer);
  }, [cameraAngle]);

  // Review System State
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'r1',
      author: 'Duchess Victoria Vance',
      rating: 5,
      date: '2026-08-01',
      comment: 'I. The extreme macro close-up camera rendering perfectly predicted the silk sheen and stitch density. The final tailor-made gown matched the 3D studio specs flawlessly.',
      verified: true,
      dressName: 'Lavender Mulberry Silk Evening Gown'
    },
    {
      id: 'r2',
      author: 'Isabella De La Cruz',
      rating: 5,
      date: '2026-08-05',
      comment: 'II. Tracking my custom gown step-by-step from the master tailor through the Pacific transit route with milestone escrow approval gave me 100% confidence.',
      verified: true,
      dressName: 'Imperial Jacquard Brocade Gown'
    }
  ]);

  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newEntry: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      rating: userRating,
      date: new Date().toISOString().split('T')[0],
      comment: `III. ${newComment}`,
      verified: true,
      dressName: selectedDress.name
    };

    setReviews([newEntry, ...reviews]);
    setNewAuthor('');
    setNewComment('');
    setUserRating(5);
  };

  const filteredDresses = fabricFilter === 'All' 
    ? DRESS_CATALOG 
    : DRESS_CATALOG.filter(d => d.fabric === fabricFilter);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-950/40 to-stone-900 text-stone-100 font-serif selection:bg-purple-500/30 selection:text-purple-200">

      {/* ============================================================================== */}
      {/* STICKY LEFT-HAND COLUMN NAVIGATION                                           */}
      {/* ============================================================================== */}
      <aside className="w-80 bg-slate-950/90 backdrop-blur-2xl border-r border-stone-800/60 flex flex-col justify-between p-6 sticky top-0 h-screen z-50 shrink-0 shadow-2xl text-stone-200">
        <div>
          {/* Brand Header */}
          <div className="mb-10 text-center border-b border-stone-800/60 pb-6">
            <h1 
              className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-stone-100 to-amber-100 font-bold italic tracking-wide drop-shadow-md"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              Atelier Global
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-purple-300 mt-2 font-sans font-semibold">
              3D HAUTE COUTURE STUDIO
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-4">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-300 border ${
                activeTab === 'catalog'
                  ? 'bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-stone-900 border-purple-400/40 text-white shadow-xl shadow-purple-950/80 scale-[1.02]'
                  : 'bg-stone-900/30 border-transparent text-stone-300 hover:text-white hover:bg-stone-900/60'
              }`}
            >
              <Shirt className={`w-5 h-5 ${activeTab === 'catalog' ? 'text-purple-300' : 'text-stone-400'}`} />
              <div>
                <span className="block text-2xl font-bold tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  TAB I
                </span>
                <span className="text-[11px] uppercase tracking-widest text-purple-200 font-sans font-semibold">
                  3D Fabric Catalog & Camera
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-300 border ${
                activeTab === 'tracker'
                  ? 'bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-stone-900 border-purple-400/40 text-white shadow-xl shadow-purple-950/80 scale-[1.02]'
                  : 'bg-stone-900/30 border-transparent text-stone-300 hover:text-white hover:bg-stone-900/60'
              }`}
            >
              <Package className={`w-5 h-5 ${activeTab === 'tracker' ? 'text-purple-300' : 'text-stone-400'}`} />
              <div>
                <span className="block text-2xl font-bold tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  TAB II
                </span>
                <span className="text-[11px] uppercase tracking-widest text-purple-200 font-sans font-semibold">
                  Live Package Tracker
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-300 border ${
                activeTab === 'reviews'
                  ? 'bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-stone-900 border-purple-400/40 text-white shadow-xl shadow-purple-950/80 scale-[1.02]'
                  : 'bg-stone-900/30 border-transparent text-stone-300 hover:text-white hover:bg-stone-900/60'
              }`}
            >
              <Star className={`w-5 h-5 ${activeTab === 'reviews' ? 'text-purple-300' : 'text-stone-400'}`} />
              <div>
                <span className="block text-2xl font-bold tracking-wide text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  TAB III
                </span>
                <span className="text-[11px] uppercase tracking-widest text-purple-200 font-sans font-semibold">
                  Client Ratings & Reviews
                </span>
              </div>
            </button>
          </nav>
        </div>

        {/* System Trust Badge referencing Business Framework */}
        <div className="border-t border-stone-800/60 pt-4 font-sans text-xs text-stone-300 space-y-2">
          <div className="flex items-center gap-2 text-purple-200">
            <ShieldCheck className="w-4 h-4 text-purple-300" />
            <span className="font-semibold tracking-wider uppercase text-[11px]">The Golden Guarantee</span>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-400">
            I. Up to $50 local fit protection coverage.<br />
            II. Escrow payment & pre-shipment QA inspection.
          </p>
        </div>
      </aside>

      {/* ============================================================================== */}
      {/* MAIN CONTENT WORKSPACE                                                         */}
      {/* ============================================================================== */}
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto">
        
        {/* TAB I: ADVANCED 3D FABRIC CATALOG & CAMERA TOOL */}
        {activeTab === 'catalog' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            
            {/* Header Title */}
            <div className="mb-8 bg-stone-900/60 backdrop-blur-md p-6 rounded-2xl border border-stone-800/80 shadow-lg">
              <h2 
                className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-stone-100 to-amber-100 italic drop-shadow-sm"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Virtual Haute Couture Studio
              </h2>
              <p className="text-xs uppercase tracking-widest text-purple-300 font-sans font-bold mt-1">
                I. SELECT GARMENT SPECIMEN | II. APPLY TEXTILE SHADERS | III. TRIGGER CINEMATIC RENDER
              </p>
            </div>

            {/* MAIN VIRTUAL VIEWPORT & SHADER CANVAS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              
              {/* 3D Viewport Simulation Box */}
              <div className="lg:col-span-8 bg-slate-950/80 border border-purple-900/40 backdrop-blur-xl rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[540px]">
                
                {/* Viewport Overlay Controls */}
                <div className="flex justify-between items-center z-10 font-sans">
                  <div className="bg-purple-950/80 border border-purple-700/40 text-purple-200 px-3.5 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                    <span className="font-medium tracking-wide">3D Shader Render Engine Active</span>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">SILHOUETTE CLASS</p>
                    <p className="text-sm font-semibold text-purple-200 tracking-wide">{selectedDress.silhouette}</p>
                  </div>
                </div>

                {/* Interactive Viewport Frame */}
                <div className="relative my-4 h-96 flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-purple-950/30 via-slate-900/60 to-stone-950 border border-stone-800">
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${selectedDress.id}-${cameraAngle}-${turntableAngle}`}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.25 }}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      {cameraAngle === 'macro' ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={selectedDress.macroImage} 
                            alt="Extreme Macro Texture View" 
                            className="w-full h-full object-cover rounded-lg border border-purple-500/30 shadow-inner"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6 font-sans text-white">
                            <div>
                              <p className="text-xs uppercase text-purple-300 font-bold tracking-widest">
                                CAMERA IV: EXTREME MACRO TEXTURE ANALYSIS
                              </p>
                              <p className="text-xs text-stone-300 mt-1">
                                Specimen Density: {selectedDress.weight} | Surface Roughness: {selectedDress.roughness}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="relative h-full flex items-center justify-center transition-transform duration-300"
                          style={{ transform: cameraAngle === 'turntable' ? `rotateY(${turntableAngle}deg)` : 'none' }}
                        >
                          <img 
                            src={selectedDress.image} 
                            alt={selectedDress.name}
                            className={`h-full object-contain filter drop-shadow-[0_20px_30px_rgba(168,85,247,0.2)] transition-all duration-500 ${
                              cameraAngle === 'high' ? 'scale-125 translate-y-8 rotate-2' : 'scale-100'
                            }`}
                          />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Blueprint Grid Overlay */}
                  <div className="absolute inset-0 border border-purple-500/10 pointer-events-none rounded-xl grid grid-cols-6 grid-rows-6">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className="border-[0.5px] border-purple-500/10"></div>
                    ))}
                  </div>
                </div>

                {/* CINEMATIC CAMERA CONTROL UI PANEL */}
                <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl backdrop-blur-md z-10 font-sans shadow-lg">
                  <p className="text-xs uppercase text-purple-300 font-bold tracking-widest mb-3 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-purple-300" />
                    CINEMATIC CAMERA RIG RIGGING & ANGLE CONTROLS
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    <button
                      onClick={() => setCameraAngle('front')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                        cameraAngle === 'front' 
                          ? 'bg-gradient-to-r from-purple-800 to-purple-600 text-white shadow-md border border-purple-400/40' 
                          : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-700/40'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      I. Studio Front Profile
                    </button>

                    <button
                      onClick={() => setCameraAngle('high')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                        cameraAngle === 'high' 
                          ? 'bg-gradient-to-r from-purple-800 to-purple-600 text-white shadow-md border border-purple-400/40' 
                          : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-700/40'
                      }`}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      II. High-Angle View
                    </button>

                    <button
                      onClick={() => setCameraAngle('macro')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                        cameraAngle === 'macro' 
                          ? 'bg-gradient-to-r from-purple-800 to-purple-600 text-white shadow-md border border-purple-400/40' 
                          : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-700/40'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5" />
                      III. Macro Texture Focus
                    </button>

                    <button
                      onClick={() => setCameraAngle('turntable')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                        cameraAngle === 'turntable' 
                          ? 'bg-gradient-to-r from-purple-800 to-purple-600 text-white shadow-md border border-purple-400/40' 
                          : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-700/40'
                      }`}
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${cameraAngle === 'turntable' ? 'animate-spin' : ''}`} />
                      IV. 360° Turntable Loop
                    </button>
                  </div>
                </div>

              </div>

              {/* Technical Specifications Panel */}
              <div className="lg:col-span-4 bg-slate-950/80 border border-purple-900/40 backdrop-blur-xl rounded-2xl p-6 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="border-b border-stone-800 pb-4 mb-4">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-purple-200 bg-purple-950 border border-purple-700/40 px-3 py-1 rounded-full shadow">
                      {selectedDress.fabric} SHADER MAP
                    </span>
                    <h3 
                      className="text-3xl font-bold text-stone-100 mt-3 italic"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {selectedDress.name}
                    </h3>
                    <p className="text-2xl font-bold text-purple-300 mt-1 font-sans">
                      ${selectedDress.price} <span className="text-xs text-stone-400 font-normal">USD</span>
                    </p>
                  </div>

                  {/* Roman Style Detailed Description */}
                  <div className="font-sans text-xs text-stone-300 leading-relaxed mb-6 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
                    {selectedDress.description}
                  </div>

                  {/* Shader Values */}
                  <div className="space-y-4 bg-stone-900/80 p-4 rounded-xl border border-stone-800 font-sans shadow-inner">
                    <p className="text-[11px] uppercase text-purple-300 font-bold tracking-widest flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-purple-300" />
                      PHYSICALLY BASED SHADER MAPS
                    </p>

                    <div>
                      <div className="flex justify-between text-xs text-stone-300 mb-1">
                        <span>I. Roughness Parameter</span>
                        <span className="font-mono text-purple-300">{selectedDress.roughness}</span>
                      </div>
                      <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-400 h-full" style={{ width: `${selectedDress.roughness * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-stone-300 mb-1">
                        <span>II. Specular Sheen Factor</span>
                        <span className="font-mono text-purple-300">{selectedDress.sheen}</span>
                      </div>
                      <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full" style={{ width: `${selectedDress.sheen * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-stone-300">
                        <span>III. Textile Weight Standard</span>
                        <span className="font-semibold text-white">{selectedDress.weight}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-purple-800 via-purple-700 to-stone-900 hover:from-purple-700 hover:to-purple-800 text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest border border-purple-500/40 shadow-xl shadow-purple-950/40 transition-all duration-300 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  Request Bespoke Tailored Order
                </button>
              </div>

            </div>

            {/* EXPANSIVE FABRIC CATALOG GRID */}
            <div className="bg-stone-900/60 backdrop-blur-md p-6 rounded-2xl border border-stone-800 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-stone-100 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Internet-Sourced Textile Catalog
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-purple-300 font-sans font-bold mt-1">
                    I. Browse variations derived from global apparel database arrays
                  </p>
                </div>

                {/* Fabric Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-sans">
                  <button
                    onClick={() => setFabricFilter('All')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      fabricFilter === 'All'
                        ? 'bg-purple-900 border border-purple-400/40 text-white shadow'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700'
                    }`}
                  >
                    All Textiles
                  </button>
                  {FABRICS_LIST.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFabricFilter(f)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        fabricFilter === f
                          ? 'bg-purple-900 border border-purple-400/40 text-white shadow'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Dresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredDresses.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDress(item)}
                    className={`group bg-slate-950 border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-md ${
                      selectedDress.id === item.id 
                        ? 'border-purple-500 ring-2 ring-purple-500/40 shadow-xl' 
                        : 'border-stone-800 hover:border-purple-700/50'
                    }`}
                  >
                    <div className="h-64 overflow-hidden relative bg-stone-900">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-slate-950/90 text-purple-200 border border-purple-800/60 text-[10px] uppercase font-sans font-semibold px-2.5 py-1 rounded-full shadow">
                        {item.fabric}
                      </span>
                    </div>

                    <div className="p-4 font-sans bg-slate-950">
                      <p className="text-[10px] text-purple-300 uppercase tracking-widest font-bold">{item.silhouette}</p>
                      <h4 className="font-bold text-stone-200 group-hover:text-purple-300 transition-colors text-sm mt-0.5">{item.name}</h4>
                      <p className="text-purple-200 font-bold text-xs mt-1">${item.price} USD</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB II: LIVE PACKAGE TRACKER (MAP INTERFACE) */}
        {activeTab === 'tracker' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            
            <div className="mb-8 bg-stone-900/60 backdrop-blur-md p-6 rounded-2xl border border-stone-800 shadow-lg">
              <h2 
                className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-stone-100 to-amber-100 italic drop-shadow-sm"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Live Overseas Shipment Tracker
              </h2>
              <p className="text-xs uppercase tracking-widest text-purple-300 font-sans font-bold mt-1">
                I. MAP ROUTE VISUALIZATION | II. MILESTONE LOGS | III. ESCROW PROTECTION STATUS
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Visual Map Component Panel */}
              <div className="lg:col-span-8 bg-slate-950/80 border border-purple-900/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-between">
                
                {/* Map Control Header */}
                <div className="flex justify-between items-center z-10 bg-stone-900/90 border border-stone-800 text-stone-200 p-4 rounded-xl font-sans shadow-lg">
                  <div>
                    <p className="text-[10px] text-purple-300 uppercase font-bold tracking-widest">ORDER MANIFEST #AG-99482-NY</p>
                    <p className="text-sm font-semibold text-white">Route: Da Nang Atelier Hub → New York Runway Facility</p>
                  </div>
                  <div>
                    <span className="bg-purple-900/80 border border-purple-500/40 text-purple-200 px-3 py-1 rounded-full text-xs font-semibold shadow">
                      In Transit via Flight CX882
                    </span>
                  </div>
                </div>

                {/* Interactive Map Visual Stage */}
                <div className="relative my-4 flex-1 rounded-xl bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-900 overflow-hidden border border-stone-800 flex items-center justify-center shadow-inner">
                  
                  {/* Subtle Topographical Pattern */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

                  {/* Arc Vector Flight Route */}
                  <svg className="absolute inset-0 w-full h-full stroke-purple-400/60" strokeWidth="2" strokeDasharray="8 8">
                    <path d="M 140 320 Q 340 100 580 220" fill="none" />
                  </svg>

                  {/* Origin Landmark Node */}
                  <div className="absolute left-[20%] bottom-[25%] flex flex-col items-center font-sans">
                    <div className="w-4 h-4 bg-purple-400 rounded-full animate-ping absolute"></div>
                    <div className="w-4 h-4 bg-white rounded-full border-2 border-purple-600 z-10"></div>
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-950 text-purple-200 px-2 py-1 rounded border border-purple-800/60 mt-2 shadow">
                      I. Da Nang Workshop
                    </span>
                  </div>

                  {/* Air Freight Node */}
                  <div className="absolute left-[52%] top-[38%] flex flex-col items-center animate-bounce font-sans">
                    <div className="bg-purple-900 text-white p-2.5 rounded-full shadow-xl border border-purple-400/60">
                      <Truck className="w-5 h-5 text-purple-200" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-slate-950 text-stone-200 px-2.5 py-1 rounded border border-purple-800/60 mt-1 shadow-lg">
                      II. Pacific Air Transit
                    </span>
                  </div>

                  {/* Destination Landmark Node */}
                  <div className="absolute right-[22%] top-[45%] flex flex-col items-center font-sans">
                    <div className="w-4 h-4 bg-white rounded-full border-2 border-purple-500 z-10"></div>
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-950 text-purple-200 px-2 py-1 rounded border border-purple-800/60 mt-2 shadow">
                      III. New York Client Hub
                    </span>
                  </div>
                </div>

                {/* Map Vector Footer */}
                <div className="bg-stone-900/90 border border-stone-800 text-stone-200 p-3.5 rounded-xl text-xs font-sans flex justify-between items-center z-10 shadow-md">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-300" />
                    GPS Coordinates: 35.6762° N, 139.6503° E
                  </span>
                  <span>Estimated Arrival: <strong className="text-purple-200">Aug 14, 2026</strong></span>
                </div>

              </div>

              {/* Roman Step-by-Step Logistics Timeline */}
              <div className="lg:col-span-4 bg-slate-950/80 border border-purple-900/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
                <h3 className="text-2xl font-bold text-stone-100 mb-6 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Shipping Milestones
                </h3>

                <div className="space-y-6 relative font-sans before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-800">
                  
                  {/* Phase I */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-purple-900 text-white flex items-center justify-center font-bold text-xs z-10 shrink-0 shadow border border-purple-500/40">
                      <CheckCircle2 className="w-4 h-4 text-purple-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">Phase I: Tailoring & Assembly</h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">Aug 02, 2026 - Master seamstress finalized silk drapes.</p>
                    </div>
                  </div>

                  {/* Phase II */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-purple-900 text-white flex items-center justify-center font-bold text-xs z-10 shrink-0 shadow border border-purple-500/40">
                      <CheckCircle2 className="w-4 h-4 text-purple-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">Phase II: Packaging & Pre-Shipment QA</h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">Aug 05, 2026 - High-res inspection video approved by client.</p>
                    </div>
                  </div>

                  {/* Phase III */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs z-10 shrink-0 ring-4 ring-purple-900 shadow">
                      <Clock className="w-4 h-4 animate-spin" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">Phase III: In Transit via Air Freight</h4>
                      <p className="text-[11px] text-stone-300 mt-0.5 font-semibold">Aug 08, 2026 - Cleared export customs at Pacific hub.</p>
                    </div>
                  </div>

                  {/* Phase IV */}
                  <div className="relative flex items-start gap-4 opacity-50">
                    <div className="w-7 h-7 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center font-bold text-xs z-10 shrink-0 border border-stone-700">
                      IV
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">Phase IV: Domestic Arrival</h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">Pending US customs clearance.</p>
                    </div>
                  </div>

                  {/* Phase V */}
                  <div className="relative flex items-start gap-4 opacity-50">
                    <div className="w-7 h-7 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center font-bold text-xs z-10 shrink-0 border border-stone-700">
                      V
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">Phase V: White-Glove Delivery</h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">Final hand delivery to recipient.</p>
                    </div>
                  </div>

                </div>

                {/* Policy Guarantee Callout referencing business plan */}
                <div className="mt-8 bg-stone-900/90 border border-stone-800 text-stone-200 p-4 rounded-xl flex items-center gap-3 font-sans shadow-lg">
                  <Info className="w-5 h-5 text-purple-300 shrink-0" />
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    <strong>The Golden Guarantee:</strong> If fit varies by &gt;0.5 inches, Atelier Global covers up to $50 in local tailoring alterations.
                  </p>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* TAB III: CLIENT FEEDBACK & STAR RATING SYSTEM */}
        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            
            <div className="mb-8 bg-stone-900/60 backdrop-blur-md p-6 rounded-2xl border border-stone-800 shadow-lg">
              <h2 
                className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-stone-100 to-amber-100 italic drop-shadow-sm"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                Client Reviews & Ratings
              </h2>
              <p className="text-xs uppercase tracking-widest text-purple-300 font-sans font-bold mt-1">
                I. VERIFIED COUTURE FEEDBACK | II. SUBMIT 3D ACCURACY ASSESSMENTS
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Interactive Submission Form */}
              <div className="lg:col-span-5 bg-slate-950/80 border border-purple-900/40 backdrop-blur-xl rounded-2xl p-6 shadow-xl h-fit font-sans">
                <h3 className="text-2xl font-bold text-stone-100 mb-1 italic font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Submit Client Review
                </h3>
                <p className="text-xs text-stone-400 mb-6">I. Record your experience regarding 3D visual match and fit accuracy.</p>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  
                  {/* Star Rating Component */}
                  <div>
                    <label className="block text-[10px] uppercase text-purple-300 font-bold tracking-widest mb-2">
                      I. OVERALL SATISFACTION RATING
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 text-purple-400 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              (hoverRating || userRating) >= star ? 'fill-purple-400 text-purple-400' : 'text-stone-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-purple-300 font-bold tracking-widest mb-1">
                      II. CLIENT NAME / TITLE
                    </label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Lady Genevieve"
                      required
                      className="w-full bg-stone-900/80 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-purple-300 font-bold tracking-widest mb-1">
                      III. SELECTED DRESS SPECIMEN
                    </label>
                    <input
                      type="text"
                      disabled
                      value={selectedDress.name}
                      className="w-full bg-stone-900/40 border border-stone-800 rounded-xl px-4 py-3 text-xs text-purple-200 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-purple-300 font-bold tracking-widest mb-1">
                      IV. DETAILED COUTURE FEEDBACK
                    </label>
                    <textarea
                      rows={4}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Detail the fabric texture, rendering accuracy, and tailoring quality..."
                      required
                      className="w-full bg-stone-900/80 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none shadow-sm"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-800 via-purple-700 to-stone-900 hover:from-purple-700 hover:to-purple-800 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest border border-purple-500/40 shadow-lg shadow-purple-950/40 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-purple-200" />
                    Post Verified Review
                  </button>
                </form>
              </div>

              {/* Reviews Display Feed */}
              <div className="lg:col-span-7 space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-slate-950/80 border border-purple-900/40 backdrop-blur-xl rounded-2xl p-6 shadow-md transition-all hover:border-purple-700/60"
                  >
                    <div className="flex justify-between items-start mb-3 font-sans">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-100 text-base">{rev.author}</h4>
                          {rev.verified && (
                            <span className="bg-purple-950 text-purple-200 border border-purple-800/60 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold shadow">
                              Verified Order
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-purple-300 mt-0.5 font-semibold">{rev.dressName}</p>
                      </div>

                      <div className="flex items-center gap-1 bg-stone-900 px-2.5 py-1 rounded-full border border-stone-800">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-purple-400 text-purple-400' : 'text-stone-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs font-sans text-stone-300 leading-relaxed mb-3">
                      {rev.comment}
                    </p>

                    <p className="text-[10px] uppercase font-sans font-bold tracking-widest text-stone-400 text-right">
                      Recorded on {rev.date}
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