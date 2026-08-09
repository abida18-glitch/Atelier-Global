import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Star, 
  RotateCw, 
  Eye, 
  Maximize2, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Send,
  ChevronRight,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ==============================================================================
// 1. EXPANDED INTERACTIVE COLOR SPECTRUM
// ==============================================================================

const EXTENDED_COLOR_PALETTES = [
  {
    id: 'ruby',
    name: 'Ruby Crimson',
    bgLight: 'bg-rose-50/50',
    border: 'border-red-900/20',
    textPrimary: 'text-red-950',
    textAccent: 'text-red-800',
    bgPrimary: 'bg-red-950',
    bgHover: 'hover:bg-red-900',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-red-950',
    accentHex: '#881337'
  },
  {
    id: 'burgundy',
    name: 'Deep Burgundy',
    bgLight: 'bg-stone-100/60',
    border: 'border-rose-950/20',
    textPrimary: 'text-rose-950',
    textAccent: 'text-rose-900',
    bgPrimary: 'bg-rose-950',
    bgHover: 'hover:bg-rose-900',
    badgeBg: 'bg-rose-200/50',
    badgeText: 'text-rose-950',
    accentHex: '#4c0519'
  },
  {
    id: 'scarlet',
    name: 'Bright Scarlet',
    bgLight: 'bg-red-50/50',
    border: 'border-red-600/20',
    textPrimary: 'text-red-900',
    textAccent: 'text-red-700',
    bgPrimary: 'bg-red-800',
    bgHover: 'hover:bg-red-700',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-900',
    accentHex: '#991b1b'
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    bgLight: 'bg-emerald-50/50',
    border: 'border-emerald-900/20',
    textPrimary: 'text-emerald-950',
    textAccent: 'text-emerald-800',
    bgPrimary: 'bg-emerald-950',
    bgHover: 'hover:bg-emerald-900',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-950',
    accentHex: '#064e3b'
  },
  {
    id: 'sapphire',
    name: 'Sapphire Blue',
    bgLight: 'bg-sky-50/50',
    border: 'border-blue-900/20',
    textPrimary: 'text-blue-950',
    textAccent: 'text-blue-800',
    bgPrimary: 'bg-blue-950',
    bgHover: 'hover:bg-blue-900',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-950',
    accentHex: '#1e3a8a'
  },
  {
    id: 'amethyst',
    name: 'Amethyst Purple',
    bgLight: 'bg-purple-50/50',
    border: 'border-purple-900/20',
    textPrimary: 'text-purple-950',
    textAccent: 'text-purple-800',
    bgPrimary: 'bg-purple-950',
    bgHover: 'hover:bg-purple-900',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-950',
    accentHex: '#581c87'
  },
  {
    id: 'onyx',
    name: 'Onyx Black',
    bgLight: 'bg-stone-100',
    border: 'border-stone-900/20',
    textPrimary: 'text-stone-950',
    textAccent: 'text-stone-800',
    bgPrimary: 'bg-stone-950',
    bgHover: 'hover:bg-stone-900',
    badgeBg: 'bg-stone-200',
    badgeText: 'text-stone-950',
    accentHex: '#0c0a09'
  },
  {
    id: 'amber',
    name: 'Golden Amber',
    bgLight: 'bg-amber-50/50',
    border: 'border-amber-900/20',
    textPrimary: 'text-amber-950',
    textAccent: 'text-amber-800',
    bgPrimary: 'bg-amber-900',
    bgHover: 'hover:bg-amber-800',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-950',
    accentHex: '#78350f'
  },
  {
    id: 'champagne',
    name: 'Champagne Rose',
    bgLight: 'bg-orange-50/40',
    border: 'border-orange-900/20',
    textPrimary: 'text-orange-950',
    textAccent: 'text-orange-900',
    bgPrimary: 'bg-amber-950',
    bgHover: 'hover:bg-amber-900',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-950',
    accentHex: '#451a03'
  }
];

// ==============================================================================
// 2. EXTENDED FABRIC SELECTION & DATASET
// ==============================================================================

const FABRICS_LIST = [
  'Silk', 'Satin', 'Lace', 'Chiffon', 'Velvet', 'Brocade', 'Organza', 
  'Linen', 'Tweed', 'Taffeta', 'Georgette', 'Crepe', 'Tulle', 'Cashmere', 
  'Jacquard', 'Damask', 'Charmeuse', 'Leather', 'Suede', 'Cotton', 'Rayon', 'Wool'
];

const DRESS_CATALOG = [
  {
    id: 'd1',
    name: 'Ruby Silk Evening Gown',
    silhouette: 'Ballgown',
    fabric: 'Silk',
    price: 850,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    description: 'Item One: Premium 100% Mulberry Silk in fluid drape dynamics with subtle luster.',
    weight: '19mm Silk Crepe'
  },
  {
    id: 'd2',
    name: 'Scarlet Velvet Corset Dress',
    silhouette: 'Bodycon',
    fabric: 'Velvet',
    price: 640,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    description: 'Item Two: Rich combed velvet with soft structured boning and light-absorbing depth.',
    weight: '380 GSM Velvet'
  },
  {
    id: 'd3',
    name: 'Chantilly Crimson Lace Slip',
    silhouette: 'Slip',
    fabric: 'Lace',
    price: 720,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=80',
    description: 'Item Three: Intricate French corded floral lace motif overlaid across sheer silk lining.',
    weight: '110 GSM Fine Lace'
  },
  {
    id: 'd4',
    name: 'Imperial Brocade Gown',
    silhouette: 'Mermaid',
    fabric: 'Brocade',
    price: 1150,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    description: 'Item Four: Heavily jacquard-woven threads providing crisp structure and regal shine.',
    weight: '440 GSM Brocade'
  },
  {
    id: 'd5',
    name: 'Chiffon Cascade Gown',
    silhouette: 'A-Line',
    fabric: 'Chiffon',
    price: 510,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=800&q=80',
    description: 'Item Five: Semi-translucent layered chiffon with delicate ruffle drapes.',
    weight: '55 GSM Chiffon'
  },
  {
    id: 'd6',
    name: 'Ethereal Organza Gown',
    silhouette: 'Ballgown',
    fabric: 'Organza',
    price: 890,
    image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    description: 'Item Six: Multi-tiered mesh tulle creating lightweight architectural silhouette layers.',
    weight: '80 GSM Fine Mesh'
  },
  {
    id: 'd7',
    name: 'Satin Column Dress',
    silhouette: 'Slip',
    fabric: 'Satin',
    price: 680,
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    description: 'Item Seven: Ultra-smooth satin finish with seamless liquid sheen.',
    weight: '220 GSM Satin'
  },
  {
    id: 'd8',
    name: 'Structured Taffeta Gown',
    silhouette: 'A-Line',
    fabric: 'Taffeta',
    price: 930,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    description: 'Item Eight: Crisp high-sheen silk taffeta engineered for dramatic volume.',
    weight: '160 GSM Taffeta'
  }
];

export default function AtelierStudioApp() {
  const [activeTab, setActiveTab] = useState('catalog');
  
  // Interactive Theme / Color Transition State
  const [activeTheme, setActiveTheme] = useState(EXTENDED_COLOR_PALETTES[0]);

  // Selection State
  const [selectedDress, setSelectedDress] = useState(DRESS_CATALOG[0]);
  const [cameraAngle, setCameraAngle] = useState('front');
  const [fabricFilter, setFabricFilter] = useState('All');
  const [turntableAngle, setTurntableAngle] = useState(0);

  // 360-Degree Turntable Loop
  useEffect(() => {
    let timer;
    if (cameraAngle === 'turntable') {
      timer = setInterval(() => {
        setTurntableAngle((prev) => (prev + 3) % 360);
      }, 50);
    }
    return () => clearInterval(timer);
  }, [cameraAngle]);

  // Review State
  const [reviews, setReviews] = useState([
    {
      id: 'r1',
      author: 'Duchess Victoria Vance',
      rating: 5,
      date: '2026-08-01',
      comment: 'Review One: The macro texture review predicted the silk drape flawlessly. The final garment was delivered with exquisite craftsmanship.',
      verified: true,
      dressName: 'Ruby Silk Evening Gown'
    },
    {
      id: 'r2',
      author: 'Isabella De La Cruz',
      rating: 5,
      date: '2026-08-05',
      comment: 'Review Two: Tracking my bespoke gown milestone by milestone gave me complete peace of mind. Exceptional service.',
      verified: true,
      dressName: 'Imperial Brocade Gown'
    }
  ]);

  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(5);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newEntry = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      rating: userRating,
      date: new Date().toISOString().split('T')[0],
      comment: `Review Three: ${newComment}`,
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
    <div className="flex min-h-screen bg-stone-50 text-stone-900 font-sans antialiased selection:bg-stone-200 transition-colors duration-700">

      {/* ============================================================================== */}
      {/* SIDEBAR WITH EXTENDED COLOR PALETTE PICKER                                    */}
      {/* ============================================================================== */}
      <aside className={`w-80 bg-stone-100/90 backdrop-blur-md border-r ${activeTheme.border} flex flex-col justify-between p-8 sticky top-0 h-screen z-50 shrink-0 transition-colors duration-700`}>
        <div>
          {/* Brand Logo with Cormorant Garamond Font */}
          <div className={`mb-8 pb-6 border-b ${activeTheme.border} transition-colors duration-700`}>
            <h1 
              className={`text-3xl tracking-wide font-light italic transition-colors duration-700 ${activeTheme.textPrimary}`}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Atelier Couture
            </h1>
            <p className={`text-[10px] uppercase tracking-[0.3em] font-sans mt-2 font-semibold transition-colors duration-700 ${activeTheme.textAccent}`}>
              HAUTE COUTURE DESIGN STUDIO
            </p>
          </div>

          {/* EXTENDED COLOR SPECTRUM PICKER */}
          <div className="mb-10 p-4 rounded-sm bg-white border border-stone-200/80 shadow-xs font-sans">
            <div className="flex items-center gap-2 mb-3">
              <Palette className={`w-3.5 h-3.5 ${activeTheme.textAccent}`} />
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-600">
                Custom Color Palette
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {EXTENDED_COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => setActiveTheme(palette)}
                  title={palette.name}
                  className={`h-7 px-1 rounded-xs transition-all duration-300 relative flex items-center justify-center border text-[9px] font-medium ${
                    activeTheme.id === palette.id ? 'ring-2 ring-offset-1 ring-stone-900 scale-105 text-white' : 'hover:scale-100 opacity-80 hover:opacity-100 text-white'
                  }`}
                  style={{ backgroundColor: palette.accentHex }}
                >
                  {palette.name.split(' ')[0]}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-stone-400 mt-2 font-mono text-center">
              Selected Theme: {activeTheme.name}
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-6 font-sans">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`w-full text-left py-2 flex items-center justify-between group transition-all ${
                activeTab === 'catalog' ? `${activeTheme.textPrimary} font-semibold` : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div>
                <span className="block text-xl font-serif font-light italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Tab One
                </span>
                <span className="text-[11px] uppercase tracking-widest text-stone-500 font-sans">
                  3D Fabric Catalog and Camera
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'catalog' ? `opacity-100 translate-x-1 ${activeTheme.textAccent}` : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`w-full text-left py-2 flex items-center justify-between group transition-all ${
                activeTab === 'tracker' ? `${activeTheme.textPrimary} font-semibold` : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div>
                <span className="block text-xl font-serif font-light italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Tab Two
                </span>
                <span className="text-[11px] uppercase tracking-widest text-stone-500 font-sans">
                  Live Package Tracker
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'tracker' ? `opacity-100 translate-x-1 ${activeTheme.textAccent}` : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full text-left py-2 flex items-center justify-between group transition-all ${
                activeTab === 'reviews' ? `${activeTheme.textPrimary} font-semibold` : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div>
                <span className="block text-xl font-serif font-light italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Tab Three
                </span>
                <span className="text-[11px] uppercase tracking-widest text-stone-500 font-sans">
                  Client Feedback and Ratings
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'reviews' ? `opacity-100 translate-x-1 ${activeTheme.textAccent}` : 'opacity-0'}`} />
            </button>
          </nav>
        </div>

        {/* Minimal Footer Policy Note */}
        <div className={`pt-6 border-t ${activeTheme.border} font-sans text-xs text-stone-500 space-y-2 transition-colors duration-700`}>
          <div className={`flex items-center gap-2 ${activeTheme.textAccent}`}>
            <ShieldCheck className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">The Golden Guarantee</span>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-600">
            Section One: Up to fifty dollar credit for local alterations.<br />
            Section Two: Escrow payment and pre-shipment inspection.
          </p>
        </div>
      </aside>

      {/* ============================================================================== */}
      {/* MAIN WORKSPACE AREA                                                            */}
      {/* ============================================================================== */}
      <main className="flex-1 p-12 overflow-y-auto max-w-7xl mx-auto">
        
        {/* TAB I: ADVANCED 3D FABRIC CATALOG & CAMERA TOOL */}
        {activeTab === 'catalog' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            
            {/* Header */}
            <div className={`mb-10 pb-6 border-b ${activeTheme.border} transition-colors duration-700`}>
              <p className={`text-xs uppercase tracking-[0.2em] font-sans mb-1 transition-colors duration-700 ${activeTheme.textAccent}`}>
                Section One: Select Design | Section Two: Examine Fabric Texture | Section Three: Trigger Studio Camera
              </p>
              <h2 className={`text-4xl font-light italic transition-colors duration-700 ${activeTheme.textPrimary}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                3D Garment Design Studio
              </h2>
            </div>

            {/* MAIN DISPLAY CANVAS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
              
              {/* Studio Canvas Box */}
              <div className={`lg:col-span-8 bg-white border ${activeTheme.border} rounded-sm p-8 shadow-sm flex flex-col justify-between min-h-[520px] transition-colors duration-700`}>
                
                {/* Canvas Top Bar */}
                <div className="flex justify-between items-center font-sans text-xs border-b border-stone-100 pb-4">
                  <span className="text-stone-400 uppercase tracking-widest text-[10px]">
                    Interactive Studio Viewport
                  </span>
                  <span className={`font-medium ${activeTheme.textPrimary}`}>
                    Silhouette: <span className="text-stone-500">{selectedDress.silhouette}</span>
                  </span>
                </div>

                {/* Garment / Macro View Container */}
                <div className={`relative my-6 h-96 flex items-center justify-center overflow-hidden rounded-sm transition-colors duration-700 ${activeTheme.bgLight}`}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${selectedDress.id}-${cameraAngle}-${turntableAngle}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full flex items-center justify-center p-4"
                    >
                      {cameraAngle === 'macro' ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={selectedDress.macroImage} 
                            alt="Macro Texture View" 
                            className="w-full h-full object-cover rounded-sm shadow-inner"
                          />
                          <div className={`absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 border ${activeTheme.border} text-stone-800 text-xs font-sans`}>
                            <p className={`font-semibold uppercase text-[10px] tracking-wider ${activeTheme.textAccent}`}>Camera Four: Micro Texture View</p>
                            <p className="text-stone-700">Specimen Density: {selectedDress.weight}</p>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="h-full flex items-center justify-center transition-transform duration-500"
                          style={{ transform: cameraAngle === 'turntable' ? `rotateY(${turntableAngle}deg)` : 'none' }}
                        >
                          <img 
                            src={selectedDress.image} 
                            alt={selectedDress.name}
                            className={`h-full object-contain filter drop-shadow-md transition-all duration-500 ${
                              cameraAngle === 'high' ? 'scale-110 translate-y-4' : 'scale-100'
                            }`}
                          />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* CAMERA CONTROLS */}
                <div className="border-t border-stone-100 pt-4 font-sans">
                  <p className={`text-[10px] uppercase tracking-widest font-semibold mb-3 ${activeTheme.textAccent}`}>
                    Camera Controls
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => setCameraAngle('front')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 text-xs tracking-wider transition-all border ${
                        cameraAngle === 'front' 
                          ? `${activeTheme.bgPrimary} text-white border-transparent` 
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Option One: Front
                    </button>

                    <button
                      onClick={() => setCameraAngle('high')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 text-xs tracking-wider transition-all border ${
                        cameraAngle === 'high' 
                          ? `${activeTheme.bgPrimary} text-white border-transparent` 
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      Option Two: High Angle
                    </button>

                    <button
                      onClick={() => setCameraAngle('macro')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 text-xs tracking-wider transition-all border ${
                        cameraAngle === 'macro' 
                          ? `${activeTheme.bgPrimary} text-white border-transparent` 
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5" />
                      Option Three: Macro
                    </button>

                    <button
                      onClick={() => setCameraAngle('turntable')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 text-xs tracking-wider transition-all border ${
                        cameraAngle === 'turntable' 
                          ? `${activeTheme.bgPrimary} text-white border-transparent` 
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${cameraAngle === 'turntable' ? 'animate-spin' : ''}`} />
                      Option Four: Turntable
                    </button>
                  </div>
                </div>

              </div>

              {/* Garment Details Side Panel */}
              <div className={`lg:col-span-4 bg-white border ${activeTheme.border} rounded-sm p-8 flex flex-col justify-between shadow-sm transition-colors duration-700`}>
                <div>
                  <span className={`text-[10px] font-sans uppercase tracking-widest px-2.5 py-1 rounded-full font-medium transition-colors duration-700 ${activeTheme.badgeBg} ${activeTheme.badgeText}`}>
                    {selectedDress.fabric}
                  </span>

                  <h3 
                    className={`text-3xl font-light italic mt-4 mb-2 transition-colors duration-700 ${activeTheme.textPrimary}`}
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {selectedDress.name}
                  </h3>
                  
                  <p className="text-xl font-sans text-stone-800 mb-6 font-light">
                    ${selectedDress.price} <span className="text-xs text-stone-400">USD</span>
                  </p>

                  <div className="space-y-4 font-sans text-xs text-stone-600 leading-relaxed border-t border-b border-stone-100 py-6 mb-6">
                    <p>{selectedDress.description}</p>
                    <div className="pt-2">
                      <span className="block text-[10px] uppercase tracking-wider text-stone-400">Standard Textile Density</span>
                      <span className={`font-semibold ${activeTheme.textPrimary}`}>{selectedDress.weight}</span>
                    </div>
                  </div>
                </div>

                <button className={`w-full ${activeTheme.bgPrimary} ${activeTheme.bgHover} text-white py-3.5 text-xs font-sans uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm`}>
                  Commission Bespoke Order
                </button>
              </div>

            </div>

            {/* CATALOG GRID WITH FULL FABRIC SELECTOR */}
            <div className={`bg-white border ${activeTheme.border} rounded-sm p-8 shadow-sm transition-colors duration-700`}>
              <div className="flex flex-col gap-4 mb-8 pb-4 border-b border-stone-100">
                <div>
                  <h3 className={`text-2xl font-light italic ${activeTheme.textPrimary}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Complete Fabric Selection Catalogue
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-stone-400 font-sans mt-1">
                    Select from twenty-two artisanal textile materials
                  </p>
                </div>

                {/* Expanded Fabric Selector Grid */}
                <div className="flex flex-wrap gap-1.5 font-sans pt-2">
                  <button
                    onClick={() => setFabricFilter('All')}
                    className={`px-3 py-1 text-xs transition-all ${
                      fabricFilter === 'All'
                        ? `${activeTheme.bgPrimary} text-white`
                        : `${activeTheme.bgLight} ${activeTheme.textAccent}`
                    }`}
                  >
                    All Fabrics
                  </button>
                  {FABRICS_LIST.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFabricFilter(f)}
                      className={`px-2.5 py-1 text-xs transition-all ${
                        fabricFilter === f
                          ? `${activeTheme.bgPrimary} text-white`
                          : `${activeTheme.bgLight} ${activeTheme.textAccent}`
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Catalog Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredDresses.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDress(item)}
                    className={`group cursor-pointer border transition-all ${
                      selectedDress.id === item.id ? `${activeTheme.border} ring-1 ring-stone-900` : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className={`h-64 overflow-hidden relative ${activeTheme.bgLight}`}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <span className={`absolute top-3 left-3 bg-white/90 ${activeTheme.textAccent} text-[10px] font-sans font-medium px-2 py-0.5 tracking-wider uppercase border border-stone-200`}>
                        {item.fabric}
                      </span>
                    </div>
                    <div className="p-4 font-sans bg-white">
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest">{item.silhouette}</p>
                      <h4 className={`font-serif italic text-base mt-0.5 ${activeTheme.textPrimary}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.name}</h4>
                      <p className="text-xs text-stone-700 mt-1">${item.price} USD</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB II: LIVE PACKAGE TRACKER (MAP INTERFACE) */}
        {activeTab === 'tracker' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            
            <div className={`mb-10 pb-6 border-b ${activeTheme.border} transition-colors duration-700`}>
              <p className={`text-xs uppercase tracking-[0.2em] font-sans mb-1 ${activeTheme.textAccent}`}>
                Section One: Route Tracking | Section Two: Milestone Timeline | Section Three: Delivery Escrow
              </p>
              <h2 className={`text-4xl font-light italic ${activeTheme.textPrimary}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Live Order Logistics
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Visual Route Map */}
              <div className={`lg:col-span-8 bg-white border ${activeTheme.border} rounded-sm p-8 shadow-sm flex flex-col justify-between min-h-[480px] transition-colors duration-700`}>
                
                <div className="flex justify-between items-center font-sans border-b border-stone-100 pb-4">
                  <div>
                    <p className={`text-[10px] uppercase font-semibold tracking-widest ${activeTheme.textAccent}`}>MANIFEST IDENTIFIER NUMBER AR 99482</p>
                    <p className="text-xs text-stone-800 font-medium mt-0.5">Atelier Studio to Client Destination</p>
                  </div>
                  <span className={`border px-3 py-1 rounded-full text-xs font-sans font-medium ${activeTheme.bgLight} ${activeTheme.textAccent} ${activeTheme.border}`}>
                    Status: In Transit
                  </span>
                </div>

                {/* Minimal Route Visualizer */}
                <div className="relative my-8 h-80 rounded-sm bg-stone-50 border border-stone-200/60 flex items-center justify-center p-8">
                  
                  {/* Subtle Grid Lines */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]"></div>

                  {/* Route Line */}
                  <div className="w-full h-0.5 bg-stone-200 relative flex items-center justify-between">
                    
                    {/* Departure Node */}
                    <div className="relative flex flex-col items-center">
                      <div className={`w-3.5 h-3.5 rounded-full ${activeTheme.bgPrimary}`}></div>
                      <span className="absolute top-6 text-[10px] uppercase tracking-wider font-sans text-stone-600 font-semibold whitespace-nowrap bg-white px-2 py-0.5 border border-stone-200">
                        Point One: Origin Atelier
                      </span>
                    </div>

                    {/* Active Transit Node */}
                    <div className="relative flex flex-col items-center animate-pulse">
                      <div className={`p-2 text-white rounded-full shadow-md ${activeTheme.bgPrimary}`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className={`absolute top-10 text-[10px] uppercase tracking-wider font-sans font-bold whitespace-nowrap bg-white px-2 py-0.5 border shadow-sm ${activeTheme.textPrimary} ${activeTheme.border}`}>
                        Point Two: In Transit Air Freight
                      </span>
                    </div>

                    {/* Destination Node */}
                    <div className="relative flex flex-col items-center">
                      <div className="w-3.5 h-3.5 bg-stone-300 rounded-full border-2 border-white"></div>
                      <span className="absolute top-6 text-[10px] uppercase tracking-wider font-sans text-stone-400 whitespace-nowrap bg-white px-2 py-0.5 border border-stone-200">
                        Point Three: New York Facility
                      </span>
                    </div>

                  </div>
                </div>

                <div className="flex justify-between items-center font-sans text-xs text-stone-600 border-t border-stone-100 pt-4">
                  <span className="flex items-center gap-1.5">
                    <MapPin className={`w-3.5 h-3.5 ${activeTheme.textAccent}`} />
                    GPS Coordinates: 35.6762 N, 139.6503 E
                  </span>
                  <span>Estimated Arrival Date: <strong className={activeTheme.textPrimary}>August 14, 2026</strong></span>
                </div>

              </div>

              {/* Milestone Phases */}
              <div className={`lg:col-span-4 bg-white border ${activeTheme.border} rounded-sm p-8 shadow-sm transition-colors duration-700`}>
                <h3 className={`text-2xl font-light italic mb-6 ${activeTheme.textPrimary}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Milestone Status
                </h3>

                <div className="space-y-6 font-sans relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-100">
                  
                  <div className="relative flex items-start gap-4">
                    <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 z-10 ${activeTheme.bgPrimary}`}>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-semibold uppercase tracking-wider ${activeTheme.textPrimary}`}>Phase One: Tailoring Completed</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">August 02, 2026: Master seamstress finalized silk drapes.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 z-10 ${activeTheme.bgPrimary}`}>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-semibold uppercase tracking-wider ${activeTheme.textPrimary}`}>Phase Two: Pre Shipment Inspection</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">August 05, 2026: Inspection video approved by client.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 z-10 ring-4 ring-stone-100 ${activeTheme.bgPrimary}`}>
                      <Clock className="w-3.5 h-3.5 animate-spin text-white" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-semibold uppercase tracking-wider ${activeTheme.textPrimary}`}>Phase Three: In Transit</h4>
                      <p className={`text-[11px] mt-0.5 font-medium ${activeTheme.textAccent}`}>August 08, 2026: Cleared export customs hub.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4 opacity-40">
                    <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-xs shrink-0 z-10">
                      Phase Four
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">Phase Four: White Glove Delivery</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">Status: Pending local arrival.</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB III: CLIENT FEEDBACK & STAR RATING SYSTEM */}
        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            
            <div className={`mb-10 pb-6 border-b ${activeTheme.border} transition-colors duration-700`}>
              <p className={`text-xs uppercase tracking-[0.2em] font-sans mb-1 ${activeTheme.textAccent}`}>
                Section One: Verified Feedback | Section Two: Submit Assessment
              </p>
              <h2 className={`text-4xl font-light italic ${activeTheme.textPrimary}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Client Reviews
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Form */}
              <div className={`lg:col-span-5 bg-white border ${activeTheme.border} rounded-sm p-8 shadow-sm h-fit font-sans transition-colors duration-700`}>
                <h3 className={`text-2xl font-light italic font-serif mb-2 ${activeTheme.textPrimary}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Record Review
                </h3>
                <p className="text-xs text-stone-500 mb-6">Section One: Submit your evaluation regarding 3D accuracy and tailoring fit.</p>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  
                  <div>
                    <label className={`block text-[10px] uppercase font-semibold tracking-widest mb-2 ${activeTheme.textAccent}`}>
                      Field One: Overall Satisfaction Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className={`p-1 transition-transform ${activeTheme.textPrimary} hover:scale-105`}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              userRating >= star ? 'fill-current text-current' : 'text-stone-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-stone-500 font-semibold tracking-widest mb-1">
                      Field Two: Client Name
                    </label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="Example: Lady Genevieve"
                      required
                      className="w-full bg-stone-50 border border-stone-200 px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-stone-500 font-semibold tracking-widest mb-1">
                      Field Three: Garment Specimen
                    </label>
                    <input
                      type="text"
                      disabled
                      value={selectedDress.name}
                      className="w-full bg-stone-100 border border-stone-200 px-3.5 py-2.5 text-xs text-stone-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-stone-500 font-semibold tracking-widest mb-1">
                      Field Four: Detailed Feedback
                    </label>
                    <textarea
                      rows={4}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Detail the fabric texture, rendering accuracy, and tailoring quality..."
                      required
                      className="w-full bg-stone-50 border border-stone-200 px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className={`w-full ${activeTheme.bgPrimary} ${activeTheme.bgHover} text-white py-3 text-xs font-sans uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Verified Review
                  </button>
                </form>
              </div>

              {/* Feed */}
              <div className="lg:col-span-7 space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`bg-white border ${activeTheme.border} rounded-sm p-6 shadow-sm font-sans transition-colors duration-700`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`font-serif italic text-lg ${activeTheme.textPrimary}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>{rev.author}</h4>
                          {rev.verified && (
                            <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium border ${activeTheme.bgLight} ${activeTheme.textAccent} ${activeTheme.border}`}>
                              Verified Order
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">{rev.dressName}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? `fill-current ${activeTheme.textAccent}` : 'text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      {rev.comment}
                    </p>

                    <p className="text-[10px] uppercase font-semibold tracking-widest text-stone-400 text-right">
                      Recorded on Date: {rev.date}
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