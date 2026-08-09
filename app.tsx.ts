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
    name: 'Ruby Silk Evening Gown',
    silhouette: 'Ballgown',
    fabric: 'Silk',
    price: 850,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    description: 'I. Premium 100% Mulberry Silk in vibrant deep crimson featuring fluid drape dynamics and subtle luster.',
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
    description: 'II. Rich deep-red combed velvet with soft structured boning and light-absorbing depth.',
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
    description: 'III. Intricate French corded floral lace motif overlaid across sheer red silk lining.',
    weight: '110 GSM Fine Lace'
  },
  {
    id: 'd4',
    name: 'Imperial Burgundy Brocade Gown',
    silhouette: 'Mermaid',
    fabric: 'Brocade',
    price: 1150,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    description: 'IV. Heavily jacquard-woven red threads providing crisp structure and regal shine.',
    weight: '440 GSM Brocade'
  },
  {
    id: 'd5',
    name: 'Rose Chiffon Cascade Gown',
    silhouette: 'A-Line',
    fabric: 'Chiffon',
    price: 510,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=800&q=80',
    description: 'V. Semi-translucent layered chiffon with delicate ruffle drapes in muted rose-red tone.',
    weight: '55 GSM Chiffon'
  },
  {
    id: 'd6',
    name: 'Ethereal Garnet Organza Gown',
    silhouette: 'Ballgown',
    fabric: 'Organza',
    price: 890,
    image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80',
    macroImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    description: 'VI. Multi-tiered deep garnet mesh tulle creating lightweight architectural silhouette layers.',
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
      comment: 'I. The macro texture review predicted the ruby silk drape flawlessly. The final garment was delivered with exquisite craftsmanship.',
      verified: true,
      dressName: 'Ruby Silk Evening Gown'
    },
    {
      id: 'r2',
      author: 'Isabella De La Cruz',
      rating: 5,
      date: '2026-08-05',
      comment: 'II. Tracking my bespoke gown milestone by milestone gave me complete peace of mind. Exceptional service.',
      verified: true,
      dressName: 'Imperial Burgundy Brocade Gown'
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
    <div className="flex min-h-screen bg-stone-50 text-stone-900 font-serif antialiased selection:bg-rose-100">

      {/* ============================================================================== */}
      {/* MINIMALIST RED ACCENTED SIDEBAR                                                */}
      {/* ============================================================================== */}
      <aside className="w-80 bg-stone-100/90 backdrop-blur-md border-r border-rose-900/10 flex flex-col justify-between p-8 sticky top-0 h-screen z-50 shrink-0">
        <div>
          {/* Brand Logo */}
          <div className="mb-14 pb-6 border-b border-rose-900/10">
            <h1 
              className="text-3xl text-red-950 tracking-wide font-normal italic"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Atelier Rouge
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-red-800 font-sans mt-2 font-medium">
              HAUTE COUTURE STUDIO
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-6 font-sans">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`w-full text-left py-2 flex items-center justify-between group transition-all ${
                activeTab === 'catalog' ? 'text-red-950 font-semibold' : 'text-stone-500 hover:text-red-900'
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
              <ChevronRight className={`w-4 h-4 text-red-900 transition-transform ${activeTab === 'catalog' ? 'opacity-100 translate-x-1' : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`w-full text-left py-2 flex items-center justify-between group transition-all ${
                activeTab === 'tracker' ? 'text-red-950 font-semibold' : 'text-stone-500 hover:text-red-900'
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
              <ChevronRight className={`w-4 h-4 text-red-900 transition-transform ${activeTab === 'tracker' ? 'opacity-100 translate-x-1' : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full text-left py-2 flex items-center justify-between group transition-all ${
                activeTab === 'reviews' ? 'text-red-950 font-semibold' : 'text-stone-500 hover:text-red-900'
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
              <ChevronRight className={`w-4 h-4 text-red-900 transition-transform ${activeTab === 'reviews' ? 'opacity-100 translate-x-1' : 'opacity-0'}`} />
            </button>
          </nav>
        </div>

        {/* Minimal Footer Policy Note */}
        <div className="pt-6 border-t border-rose-900/10 font-sans text-xs text-stone-500 space-y-2">
          <div className="flex items-center gap-2 text-red-900">
            <ShieldCheck className="w-4 h-4 text-red-800" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">The Golden Guarantee</span>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-600">
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
            <div className="mb-10 pb-6 border-b border-rose-900/10">
              <p className="text-xs uppercase tracking-[0.2em] text-red-800 font-sans mb-1">
                I. Select Crimson Design | II. Examine Fabric Texture | III. Trigger Studio Camera
              </p>
              <h2 className="text-4xl font-normal italic text-red-950" style={{ fontFamily: "'Playfair Display', serif" }}>
                3D Garment Studio
              </h2>
            </div>

            {/* MAIN DISPLAY CANVAS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
              
              {/* Studio Canvas Box */}
              <div className="lg:col-span-8 bg-white border border-rose-900/10 rounded-sm p-8 shadow-sm flex flex-col justify-between min-h-[520px]">
                
                {/* Canvas Top Bar */}
                <div className="flex justify-between items-center font-sans text-xs border-b border-stone-100 pb-4">
                  <span className="text-stone-400 uppercase tracking-widest text-[10px]">
                    Interactive Studio Viewport
                  </span>
                  <span className="text-red-950 font-medium">
                    Silhouette: <span className="text-stone-500">{selectedDress.silhouette}</span>
                  </span>
                </div>

                {/* Garment / Macro View Container */}
                <div className="relative my-6 h-96 flex items-center justify-center overflow-hidden bg-rose-50/30 rounded-sm">
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
                          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 border border-red-900/20 text-stone-800 text-xs font-sans">
                            <p className="font-semibold uppercase text-[10px] tracking-wider text-red-900">Camera IV: Red Micro-Texture</p>
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
                  <p className="text-[10px] uppercase tracking-widest text-red-900 font-semibold mb-3">
                    Camera Controls
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => setCameraAngle('front')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 text-xs tracking-wider transition-all border ${
                        cameraAngle === 'front' 
                          ? 'bg-red-950 text-white border-red-950' 
                          : 'bg-white text-stone-600 border-stone-200 hover:border-red-900/40'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      I. Studio Front
                    </button>

                    <button
                      onClick={() => setCameraAngle('high')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 text-xs tracking-wider transition-all border ${
                        cameraAngle === 'high' 
                          ? 'bg-red-950 text-white border-red-950' 
                          : 'bg-white text-stone-600 border-stone-200 hover:border-red-900/40'
                      }`}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      II. High-Angle
                    </button>

                    <button
                      onClick={() => setCameraAngle('macro')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 text-xs tracking-wider transition-all border ${
                        cameraAngle === 'macro' 
                          ? 'bg-red-950 text-white border-red-950' 
                          : 'bg-white text-stone-600 border-stone-200 hover:border-red-900/40'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5" />
                      III. Macro Close-Up
                    </button>

                    <button
                      onClick={() => setCameraAngle('turntable')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 text-xs tracking-wider transition-all border ${
                        cameraAngle === 'turntable' 
                          ? 'bg-red-950 text-white border-red-950' 
                          : 'bg-white text-stone-600 border-stone-200 hover:border-red-900/40'
                      }`}
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${cameraAngle === 'turntable' ? 'animate-spin' : ''}`} />
                      IV. 360° Turntable
                    </button>
                  </div>
                </div>

              </div>

              {/* Garment Details Side Panel */}
              <div className="lg:col-span-4 bg-white border border-rose-900/10 rounded-sm p-8 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-widest text-red-900 bg-rose-50 px-2.5 py-1 rounded-full font-medium">
                    {selectedDress.fabric}
                  </span>

                  <h3