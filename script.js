import React, { useState, useEffect, Component } from 'react';
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
  Palette,
  AlertTriangle,
  RefreshCw,
  ImageOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ==============================================================================
// 1. ERROR BOUNDARY COMPONENT (CATCHES UNHANDLED UI/RENDER ERRORS)
// ==============================================================================

class AtelierErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message || 'An unexpected rendering error occurred.' };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Atelier Couture Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white border border-stone-200 rounded-sm p-8 shadow-sm text-center">
            <div className="w-12 h-12 bg-red-100 text-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif italic text-stone-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Studio Interface Error
            </h2>
            <p className="text-xs text-stone-600 mb-6 leading-relaxed">
              We encountered an issue displaying this component. Please attempt to recover the session.
            </p>
            <div className="bg-stone-100 p-3 rounded text-[11px] font-mono text-stone-700 mb-6 text-left overflow-x-auto">
              {this.state.errorMessage}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload Studio Viewport
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ==============================================================================
// 2. IMAGE COMPONENT WITH FALLBACK ERROR HANDLING
// ==============================================================================

function ImageWithFallback({ src, alt, className }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`bg-stone-200 flex flex-col items-center justify-center text-stone-500 p-4 text-center ${className}`}>
        <ImageOff className="w-6 h-6 mb-2 stroke-[1.5]" />
        <span className="text-[10px] uppercase font-sans tracking-wider">Asset Unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}

// ==============================================================================
// 3. COLOR PALETTES & DATASETS
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
  }
];

const FABRICS_LIST = [
  'Silk', 'Satin', 'Lace', 'Chiffon', 'Velvet', 'Brocade', 'Organza', 
  'Linen', 'Tweed', 'Taffeta', 'Georgette', 'Crepe', 'Tulle'
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
  }
];

// ==============================================================================
// 4. MAIN APPLICATION COMPONENT
// ==============================================================================

function AtelierStudioAppContent() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [activeTheme, setActiveTheme] = useState(EXTENDED_COLOR_PALETTES[0]);
  const [selectedDress, setSelectedDress] = useState(DRESS_CATALOG[0]);
  const [cameraAngle, setCameraAngle] = useState('front');
  const [fabricFilter, setFabricFilter] = useState('All');
  const [turntableAngle, setTurntableAngle] = useState(0);

  // Form State & Error Validation
  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      comment: 'Review One: The macro texture review predicted the silk drape flawlessly.',
      verified: true,
      dressName: 'Ruby Silk Evening Gown'
    }
  ]);

  // Handled Submission with try...catch
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      // Input Validation Errors
      if (!newAuthor.trim()) {
        throw new Error('Please enter a valid client name.');
      }
      if (!newComment.trim() || newComment.trim().length < 10) {
        throw new Error('Feedback comment must be at least 10 characters long.');
      }

      // Simulate network request latency
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newEntry = {
        id: `rev-${Date.now()}`,
        author: newAuthor.trim(),
        rating: userRating,
        date: new Date().toISOString().split('T')[0],
        comment: newComment.trim(),
        verified: true,
        dressName: selectedDress.name
      };

      setReviews([newEntry, ...reviews]);
      setNewAuthor('');
      setNewComment('');
      setUserRating(5);
    } catch (err) {
      setFormError(err.message || 'Failed to record feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDresses = fabricFilter === 'All' 
    ? DRESS_CATALOG 
    : DRESS_CATALOG.filter(d => d.fabric === fabricFilter);

  return (
    <div className="flex min-h-screen bg-stone-50 text-stone-900 font-sans antialiased selection:bg-stone-200 transition-colors duration-700">

      {/* SIDEBAR */}
      <aside className={`w-80 bg-stone-100/90 backdrop-blur-md border-r ${activeTheme.border} flex flex-col justify-between p-8 sticky top-0 h-screen z-50 shrink-0 transition-colors duration-700`}>
        <div>
          <div className={`mb-8 pb-6 border-b ${activeTheme.border} transition-colors duration-700`}>
            <h1 
              className={`text-3xl tracking-wide font-light italic transition-colors duration-700 ${activeTheme.textPrimary}`}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Atelier Couture
            </h1>
            <p className={`text-[10px] uppercase tracking-[0.3em] font-sans mt-2 font-semibold transition-colors duration-700 ${activeTheme.textAccent}`}>
              HAUTE COUTURE STUDIO
            </p>
          </div>

          {/* PALETTE SELECTOR */}
          <div className="mb-10 p-4 rounded-sm bg-white border border-stone-200/80 shadow-xs font-sans">
            <div className="flex items-center gap-2 mb-3">
              <Palette className={`w-3.5 h-3.5 ${activeTheme.textAccent}`} />
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-600">
                Custom Theme Palette
              </span>
            </div>
            
            <div className="grid grid-cols-5 gap-1.5">
              {EXTENDED_COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => setActiveTheme(palette)}
                  title={palette.name}
                  className={`h-7 rounded-xs transition-all duration-300 relative flex items-center justify-center border text-[9px] font-medium ${
                    activeTheme.id === palette.id ? 'ring-2 ring-offset-1 ring-stone-900 scale-105 text-white' : 'hover:scale-100 opacity-80 hover:opacity-100 text-white'
                  }`}
                  style={{ backgroundColor: palette.accentHex }}
                />
              ))}
            </div>
          </div>

          {/* NAVIGATION */}
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
                  3D Fabric Catalog & Camera
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'catalog' ? `opacity-100 translate-x-1 ${activeTheme.textAccent}` : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full text-left py-2 flex items-center justify-between group transition-all ${
                activeTab === 'reviews' ? `${activeTheme.textPrimary} font-semibold` : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div>
                <span className="block text-xl font-serif font-light italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Tab Two
                </span>
                <span className="text-[11px] uppercase tracking-widest text-stone-500 font-sans">
                  Client Feedback & Ratings
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'reviews' ? `opacity-100 translate-x-1 ${activeTheme.textAccent}` : 'opacity-0'}`} />
            </button>
          </nav>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 p-12 overflow-y-auto max-w-7xl mx-auto">
        {activeTab === 'catalog' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className={`mb-10 pb-6 border-b ${activeTheme.border}`}>
              <h2 className={`text-4xl font-light italic ${activeTheme.textPrimary}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                3D Garment Design Studio
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
              <div className={`lg:col-span-8 bg-white border ${activeTheme.border} rounded-sm p-8 shadow-sm flex flex-col justify-between min-h-[520px]`}>
                <div className="flex justify-between items-center font-sans text-xs border-b border-stone-100 pb-4">
                  <span className="text-stone-400 uppercase tracking-widest text-[10px]">Viewport Camera</span>
                  <span className={`font-medium ${activeTheme.textPrimary}`}>{selectedDress.name}</span>
                </div>

                <div className={`relative my-6 h-96 flex items-center justify-center overflow-hidden rounded-sm ${activeTheme.bgLight}`}>
                  <AnimatePresence mode="wait">
                    <motion.div key={selectedDress.id} className="w-full h-full flex items-center justify-center p-4">
                      <ImageWithFallback
                        src={cameraAngle === 'macro' ? selectedDress.macroImage : selectedDress.image}
                        alt={selectedDress.name}
                        className="h-full object-contain filter drop-shadow-md"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-4 gap-3 font-sans">
                  <button onClick={() => setCameraAngle('front')} className={`py-2 text-xs border ${cameraAngle === 'front' ? `${activeTheme.bgPrimary} text-white` : 'bg-white text-stone-600'}`}>Front View</button>
                  <button onClick={() => setCameraAngle('macro')} className={`py-2 text-xs border ${cameraAngle === 'macro' ? `${activeTheme.bgPrimary} text-white` : 'bg-white text-stone-600'}`}>Macro View</button>
                  <button onClick={() => setCameraAngle('turntable')} className={`py-2 text-xs border ${cameraAngle === 'turntable' ? `${activeTheme.bgPrimary} text-white` : 'bg-white text-stone-600'}`}>360 View</button>
                </div>
              </div>

              <div className={`lg:col-span-4 bg-white border ${activeTheme.border} rounded-sm p-8 flex flex-col justify-between`}>
                <div>
                  <span className={`text-[10px] uppercase px-2.5 py-1 rounded-full font-medium ${activeTheme.badgeBg} ${activeTheme.badgeText}`}>{selectedDress.fabric}</span>
                  <h3 className={`text-3xl font-light italic mt-4 mb-2 ${activeTheme.textPrimary}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>{selectedDress.name}</h3>
                  <p className="text-xl text-stone-800 mb-6 font-light">${selectedDress.price} USD</p>
                  <p className="text-xs text-stone-600 leading-relaxed">{selectedDress.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* REVIEWS TAB WITH FORM ERROR HANDLING */}
        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className={`mb-10 pb-6 border-b ${activeTheme.border}`}>
              <h2 className={`text-4xl font-light italic ${activeTheme.textPrimary}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>Client Reviews</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className={`lg:col-span-5 bg-white border ${activeTheme.border} rounded-sm p-8 shadow-sm h-fit font-sans`}>
                <h3 className={`text-2xl font-light italic mb-2 ${activeTheme.textPrimary}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>Record Assessment</h3>
                
                {/* Error Banner */}
                {formError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xs text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-stone-500 mb-1">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setUserRating(star)} className="text-amber-500">
                          <Star className={`w-4 h-4 ${userRating >= star ? 'fill-current' : 'text-stone-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-stone-500 font-semibold mb-1">Client Name</label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="Enter client name"
                      className="w-full bg-stone-50 border border-stone-200 px-3.5 py-2 text-xs focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-stone-500 font-semibold mb-1">Feedback</label>
                    <textarea
                      rows={4}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Minimum 10 characters detailing quality..."
                      className="w-full bg-stone-50 border border-stone-200 px-3.5 py-2 text-xs focus:outline-none focus:border-stone-900 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full ${activeTheme.bgPrimary} ${activeTheme.bgHover} text-white py-3 text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50`}
                  >
                    {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Submit Review
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 space-y-4 font-sans">
                {reviews.map((rev) => (
                  <div key={rev.id} className={`bg-white border ${activeTheme.border} p-6 shadow-sm`}>
                    <h4 className={`font-serif italic text-lg ${activeTheme.textPrimary}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>{rev.author}</h4>
                    <p className="text-xs text-stone-600 my-2">{rev.comment}</p>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest">{rev.date}</span>
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

// Wrap Content Component in Error Boundary
export default function AtelierStudioApp() {
  return (
    <AtelierErrorBoundary>
      <AtelierStudioAppContent />
    </AtelierErrorBoundary>
  );
}