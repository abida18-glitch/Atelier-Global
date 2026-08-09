import React, { useState } from 'react';
import { 
  Sparkles, 
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
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ==============================================================================
// 1. DATA MODELS & DATASET
// ==============================================================================

type FabricType = 
  | 'Satin' | 'Silk' | 'Lace' | 'Denim' | 'Velvet' 
  | 'Chiffon' | 'Brocade' | 'Organza' | 'Linen' | 'Tweed';

type SilhouetteType = 'A-Line' | 'Bodycon' | 'Mermaid' | 'Ballgown' | 'Slip';

interface DressItem {
  id: string;
  name: string;
  silhouette: SilhouetteType;
  fabric: FabricType;
  price: number;
  image: string;
  macroImage: string;
  description: string;
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
  'Silk', 'Satin', 'Lace', 'Chiffon', 'Velvet', 'Brocade', 'Organza', 'Linen', 'Tweed'
];

const DRESS_CATALOG: DressItem[] = [
  {
    id: 'd1',
    name: 'Mulberry Silk Evening Gown',
    silhouette: 'Ballgown',
    fabric: 'Silk',
    price: 850,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    description: 'I. Premium 100% Mulberry Silk featuring fluid drape dynamics, subtle luster, and breathable weave.',
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
    description: 'II. Deep-pile combed velvet with soft structured boning and light-absorbing depth.',
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
    description: 'IV. Heavily jacquard-woven threads providing crisp structure and regal subtle shine.',
    weight: '440 GSM Brocade'
  },
  {
    id: 'd5',
    name: 'Sage Chiffon Cascade Gown',
    silhouette: 'A-Line',
    fabric: 'Chiffon',
    price: 510,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=800&q=80',
    description: 'V. Semi-translucent layered chiffon with delicate ruffle drapes in warm linen beige tone.',
    weight: '55 GSM Chiffon'
  },
  {
    id: 'd6',
    name: 'Ethereal Tulle Illusion Gown',
    silhouette: 'Ballgown',
    fabric: 'Organza',
    price: 890,
    image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    description: 'VI. Multi-tiered diamond mesh tulle creating lightweight architectural silhouette layers.',
    weight: '80 GSM Fine Mesh'
  }
];

export default function AtelierStudioApp() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'tracker' | 'reviews'>('catalog');
  
  // Selection State
  const [selectedDress, setSelectedDress] = useState<DressItem>(DRESS_CATALOG[0]);
  const [cameraAngle, setCameraAngle] = useState<'front' | 'high' | 'macro' | 'turntable'>('front');
  const [fabricFilter, setFabricFilter] = useState<string>('All');
  const [turntableAngle, setTurntableAngle] = useState<number>(0);

  // 360-Degree Turntable Loop
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cameraAngle === 'turntable') {
      timer = setInterval(() => {
        setTurntableAngle((prev) => (prev + 3) % 360);
      }, 50);
    }
    return () => clearInterval(timer);
  }, [cameraAngle]);

  // Review State
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'r1',
      author: 'Duchess Victoria Vance',
      rating: 5,
      date: '2026-08-01',
      comment: 'I. The macro texture review predicted the silk drape flawlessly. The final garment was delivered with exquisite craftsmanship.',
      verified: true,
      dressName: 'Mulberry Silk Evening Gown'
    },
    {
      id: 'r2',
      author: 'Isabella De La Cruz',
      rating: 5,
      date: '2026-08-05',
      comment: 'II. Tracking my bespoke gown milestone by milestone gave me complete peace of mind. Exceptional service.',
      verified: true,
      dressName: 'Imperial Jacquard Brocade Gown'
    }
  ]);

  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(5);

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
    <div className="flex min-h-screen bg-stone-50 text-stone-900 font-serif antialiased selection:bg-stone-200">

      {/* ============================================================================== */}
      {/* MINIMALIST LEFT-HAND NAVIGATION SIDEBAR                                       */}
      {/* ============================================================================== */}
      <aside className="w-80 bg-stone-100/80 backdrop-blur-md border-r border-stone-200/80 flex flex-col justify-between p-8 sticky top-0 h-screen z-50 shrink-0">
        <div>
          {/* Brand Logo */}
          <div className="mb-14 pb-6 border-b border-stone-200">
            <h1 
              className="text-3xl text-stone-900 tracking-wide font-normal italic"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Atelier Global
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-sans mt-2 font-medium">
              HAUTE COUTURE STUDIO
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-6 font-sans">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`w-full text-left py-2 flex items-center justify-between group transition-all ${
                activeTab === 'catalog' ? 'text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div>
                <span className="block text-xl font-serif font-normal italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                  TAB I
                </span>
                <span className="text-[11px] uppercase tracking-widest text-stone-500 font-sans">
                  3D Fabric Catalog & Camera
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'catalog' ? 'opacity-100 translate-x-1' : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`w-full text-left py-2 flex items-center justify-between group transition-all ${
                activeTab === 'tracker' ? 'text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div>
                <span className="block text-xl font-serif font-normal italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                  TAB II
                </span>
                <span className="text-[11px] uppercase tracking-widest text-stone-500 font-sans">
                  Live Package Tracker
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'tracker' ? 'opacity-100 translate-x-1' : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full text-left py-2 flex items-center justify-between group transition-all ${
                activeTab === 'reviews' ? 'text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div>
                <span className="block text-xl font-serif font-normal italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                  TAB III
                </span>
                <span className="text-[11px] uppercase tracking-widest text-stone-500 font-sans">
                  Client Feedback & Ratings
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'reviews' ? 'opacity-100 translate-x-1' : 'opacity-0'}`} />
            </button>
          </nav>
        </div>

        {/* Minimal Footer Policy Note */}
        <div className="pt-6 border-t border-stone-200 font-sans text-xs text-stone-500 space-y-2">
          <div className="flex items-center gap-2 text-stone-800">
            <ShieldCheck className="w-4 h-4 text-stone-600" />
            <span className="font-medium uppercase tracking-wider text-[10px]">The Golden Guarantee</span>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-500">
            I. Up to $50 credit for local alterations.<br />
            II. Escrow payment & pre-shipment inspection.
          </p>
        </div>
      </aside>

      {/* ============================================================================== */}
      {/* ELEGANT WORKSPACE AREA                                                         */}
      {/* ============================================================================== */}
      <main className="flex-1 p-12 overflow-y-auto max-w-7xl mx-auto">
        
        {/* TAB I: ADVANCED 3D FABRIC CATALOG & CAMERA TOOL */}
        {activeTab === 'catalog' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            
            {/* Header */}
            <div className="mb-10 pb-6 border-b border-stone-200">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500 font-sans mb-1">
                I. Select Design | II. Examine Fabric Texture | III. Trigger Studio Camera
              </p>
              <h2 className="text-4xl font-normal italic text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                3D Garment Studio
              </h2>
            </div>

            {/* MAIN DISPLAY CANVAS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
              
              {/* Studio Canvas Box */}
              <div className="lg:col-span-8 bg-white border border-stone-200/80 rounded-sm p-8 shadow-sm flex flex-col justify-between min-h-[520px]">
                
                {/* Canvas Top Bar */}
                <div className="flex justify-between items-center font-sans text-xs border-b border-stone-100 pb-4">
                  <span className="text-stone-500 uppercase tracking-widest text-[10px]">
                    Interactive Studio Viewport
                  </span>
                  <span className="text-stone-800 font-medium">
                    Silhouette: <span className="text-stone-500">{selectedDress.silhouette}</span>
                  </span>
                </div>

                {/* Garment / Macro View Container */}
                <div className="relative my-6 h-96 flex items-center justify-center overflow-hidden bg-stone-50/50 rounded-sm">
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
                          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 border border-stone-200 text-stone-800 text-xs font-sans">
                            <p className="font-semibold uppercase text-[10px] tracking-wider text-stone-500">Camera IV: High Resolution Macro</p>
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
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-3 font-semibold">
                    Camera Controls
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => setCameraAngle('front')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 text-xs tracking-wider transition-all border ${
                        cameraAngle === 'front' 
                          ? 'bg-stone-900 text-white border-stone-900' 
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      I. Studio Front
                    </button>

                    <button
                      onClick={() => setCameraAngle('high')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 text-xs tracking-wider transition-all border ${
                        cameraAngle === 'high' 
                          ? 'bg-stone-900 text-white border-stone-900' 
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      II. High-Angle
                    </button>

                    <button
                      onClick={() => setCameraAngle('macro')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 text-xs tracking-wider transition-all border ${
                        cameraAngle === 'macro' 
                          ? 'bg-stone-900 text-white border-stone-900' 
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5" />
                      III. Macro Close-Up
                    </button>

                    <button
                      onClick={() => setCameraAngle('turntable')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 text-xs tracking-wider transition-all border ${
                        cameraAngle === 'turntable' 
                          ? 'bg-stone-900 text-white border-stone-900' 
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${cameraAngle === 'turntable' ? 'animate-spin' : ''}`} />
                      IV. 360° Turntable
                    </button>
                  </div>
                </div>

              </div>

              {/* Garment Details Side Panel */}
              <div className="lg:col-span-4 bg-white border border-stone-200/80 rounded-sm p-8 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-widest text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                    {selectedDress.fabric}
                  </span>

                  <h3 
                    className="text-3xl font-normal italic text-stone-900 mt-4 mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
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
                      <span className="font-semibold text-stone-800">{selectedDress.weight}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3.5 text-xs font-sans uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm">
                  <Sparkles className="w-4 h-4 text-stone-300" />
                  Commission Bespoke Order
                </button>
              </div>

            </div>

            {/* CATALOG GRID */}
            <div className="bg-white border border-stone-200/80 rounded-sm p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-100">
                <div>
                  <h3 className="text-2xl font-normal italic text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Curated Collection Catalog
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-stone-400 font-sans mt-1">
                    I. Browse variations sourced from global artisanal studios
                  </p>
                </div>

                {/* Minimalist Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 font-sans">
                  <button
                    onClick={() => setFabricFilter('All')}
                    className={`px-3 py-1 text-xs transition-all ${
                      fabricFilter === 'All'
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    All
                  </button>
                  {FABRICS_LIST.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFabricFilter(f)}
                      className={`px-3 py-1 text-xs transition-all ${
                        fabricFilter === f
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDresses.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDress(item)}
                    className={`group cursor-pointer border transition-all ${
                      selectedDress.id === item.id ? 'border-stone-900 ring-1 ring-stone-900' : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className="h-72 overflow-hidden bg-stone-50 relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 text-stone-800 text-[10px] font-sans font-medium px-2 py-0.5 tracking-wider uppercase border border-stone-200">
                        {item.fabric}
                      </span>
                    </div>
                    <div className="p-4 font-sans bg-white">
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest">{item.silhouette}</p>
                      <h4 className="font-serif italic text-lg text-stone-900 mt-0.5">{item.name}</h4>
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
            
            <div className="mb-10 pb-6 border-b border-stone-200">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500 font-sans mb-1">
                I. Route Tracking | II. Milestone Timeline | III. Delivery Escrow
              </p>
              <h2 className="text-4xl font-normal italic text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Live Order Logistics
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Visual Route Map */}
              <div className="lg:col-span-8 bg-white border border-stone-200/80 rounded-sm p-8 shadow-sm flex flex-col justify-between min-h-[480px]">
                
                <div className="flex justify-between items-center font-sans border-b border-stone-100 pb-4">
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase font-semibold tracking-widest">MANIFEST ID: #AG-99482</p>
                    <p className="text-xs text-stone-800 font-medium mt-0.5">Atelier Studio → Client Destination</p>
                  </div>
                  <span className="bg-stone-100 text-stone-800 px-3 py-1 rounded-full text-xs font-sans">
                    In Transit
                  </span>
                </div>

                {/* Minimal Route Visualizer */}
                <div className="relative my-8 h-80 rounded-sm bg-stone-50 border border-stone-200/60 flex items-center justify-center p-8">
                  
                  {/* Subtle Grid Lines */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]"></div>

                  {/* Route Line */}
                  <div className="w-full h-0.5 bg-stone-300 relative flex items-center justify-between">
                    
                    {/* Departure Node */}
                    <div className="relative flex flex-col items-center">
                      <div className="w-3.5 h-3.5 bg-stone-900 rounded-full"></div>
                      <span className="absolute top-6 text-[10px] uppercase tracking-wider font-sans text-stone-600 font-semibold whitespace-nowrap bg-white px-2 py-0.5 border border-stone-200">
                        I. Origin Atelier
                      </span>
                    </div>

                    {/* Active Transit Node */}
                    <div className="relative flex flex-col items-center animate-pulse">
                      <div className="p-2 bg-stone-900 text-white rounded-full shadow-md">
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="absolute top-10 text-[10px] uppercase tracking-wider font-sans text-stone-900 font-bold whitespace-nowrap bg-white px-2 py-0.5 border border-stone-300 shadow-sm">
                        II. In Transit (Air Freight)
                      </span>
                    </div>

                    {/* Destination Node */}
                    <div className="relative flex flex-col items-center">
                      <div className="w-3.5 h-3.5 bg-stone-300 rounded-full border-2 border-white"></div>
                      <span className="absolute top-6 text-[10px] uppercase tracking-wider font-sans text-stone-400 whitespace-nowrap bg-white px-2 py-0.5 border border-stone-200">
                        III. New York Facility
                      </span>
                    </div>

                  </div>
                </div>

                <div className="flex justify-between items-center font-sans text-xs text-stone-600 border-t border-stone-100 pt-4">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    GPS Coordinates: 35.6762° N, 139.6503° E
                  </span>
                  <span>Estimated Arrival: <strong className="text-stone-900">Aug 14, 2026</strong></span>
                </div>

              </div>

              {/* Milestone Phases */}
              <div className="lg:col-span-4 bg-white border border-stone-200/80 rounded-sm p-8 shadow-sm">
                <h3 className="text-2xl font-normal italic text-stone-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Milestone Status
                </h3>

                <div className="space-y-6 font-sans relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200">
                  
                  <div className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs shrink-0 z-10">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">Phase I: Tailoring Completed</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">Aug 02, 2026 - Master seamstress finalized silk drapes.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs shrink-0 z-10">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">Phase II: Pre-Shipment QA</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">Aug 05, 2026 - Inspection video approved by client.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-stone-800 text-white flex items-center justify-center font-bold text-xs shrink-0 z-10 ring-4 ring-stone-100">
                      <Clock className="w-3.5 h-3.5 animate-spin text-stone-200" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">Phase III: In Transit</h4>
                      <p className="text-[11px] text-stone-600 mt-0.5 font-medium">Aug 08, 2026 - Cleared export customs hub.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4 opacity-40">
                    <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-xs shrink-0 z-10">
                      IV
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">Phase IV: White-Glove Delivery</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">Pending local arrival.</p>
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
            
            <div className="mb-10 pb-6 border-b border-stone-200">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500 font-sans mb-1">
                I. Verified Feedback | II. Submit Quality & Render Assessment
              </p>
              <h2 className="text-4xl font-normal italic text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Client Reviews
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Form */}
              <div className="lg:col-span-5 bg-white border border-stone-200/80 rounded-sm p-8 shadow-sm h-fit font-sans">
                <h3 className="text-2xl font-normal italic font-serif text-stone-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Record Review
                </h3>
                <p className="text-xs text-stone-500 mb-6">I. Submit your evaluation regarding 3D accuracy and tailoring fit.</p>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  
                  <div>
                    <label className="block text-[10px] uppercase text-stone-500 font-semibold tracking-widest mb-2">
                      I. OVERALL SATISFACTION
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="p-1 text-stone-800 hover:scale-105 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              userRating >= star ? 'fill-stone-900 text-stone-900' : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-stone-500 font-semibold tracking-widest mb-1">
                      II. CLIENT NAME
                    </label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Lady Genevieve"
                      required
                      className="w-full bg-stone-50 border border-stone-200 px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-stone-500 font-semibold tracking-widest mb-1">
                      III. GARMENT SPECIMEN
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
                      IV. DETAILED FEEDBACK
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
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 text-xs font-sans uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 text-stone-300" />
                    Submit Verified Review
                  </button>
                </form>
              </div>

              {/* Feed */}
              <div className="lg:col-span-7 space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white border border-stone-200/80 rounded-sm p-6 shadow-sm font-sans"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif italic text-lg text-stone-900">{rev.author}</h4>
                          {rev.verified && (
                            <span className="bg-stone-100 text-stone-700 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">
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
                              i < rev.rating ? 'fill-stone-900 text-stone-900' : 'text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      {rev.comment}
                    </p>

                    <p className="text-[10px] uppercase font-semibold tracking-widest text-stone-400 text-right">
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