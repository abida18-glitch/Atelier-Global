import React, { useState, useEffect, useRef, Component } from 'react';
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
  Loader2,
  Tag,
  SlidersHorizontal,
  Video,
  Check,
  Sparkles,
  AlertTriangle,
  XCircle,
  Eye,
  Sliders,
  ChevronRight
} from 'lucide-react';

// ---------------------------------------------------------------------------
// ERROR BOUNDARY COMPONENT
// Encapsulates runtime exceptions with an elegant fallback UI.
// ---------------------------------------------------------------------------
class AtelierErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Atelier Engine Exception:", error, errorInfo);
    this.setState({ errorInfo: error?.toString() || 'Unspecified Render Failure' });
  }

  handleReset = () => {
    this.setState({ hasError: false, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-8 text-[#1A1816]">
          <div className="max-w-lg w-full border border-[#D4AF37]/40 p-10 bg-[#FAF9F6] shadow-2xl space-y-6 text-center">
            <div className="inline-flex p-3 rounded-full bg-[#1A1816] text-[#D4AF37]">
              <AlertTriangle className="w-6 h-6 stroke-[1.25]" />
            </div>
            <h2 className="font-serif text-2xl font-light tracking-[0.2em] uppercase text-[#1A1816]">
              Atelier Interrupted
            </h2>
            <p className="text-xs font-serif italic text-[#8C857B] leading-relaxed max-w-sm mx-auto">
              An unhandled rendering exception occurred within the digital studio viewport.
            </p>
            {this.state.errorInfo && (
              <div className="p-4 bg-[#F2F0EB] border border-[#E8E5DE] font-mono text-[10px] text-[#A33B3B] text-left overflow-x-auto rounded-none">
                {this.state.errorInfo}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="px-8 py-3 bg-[#1A1816] text-[#FAF9F6] text-[10px] uppercase tracking-[0.25em] font-medium hover:bg-[#D4AF37] hover:text-[#1A1816] transition-all duration-300"
            >
              Reinitialize Studio View
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// MAIN HIGH-FASHION ATELIER STUDIO COMPONENT
// ---------------------------------------------------------------------------
function HighFashionDesignStudioContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('I'); 
  const [errorMessage, setErrorMessage] = useState(null);
  
  // ---------------------------------------------------------------------------
  // 3D DRESS MODEL & CAMERA CUSTOMIZER STATE
  // ---------------------------------------------------------------------------
  const [selectedDressModel, setSelectedDressModel] = useState(0);
  const [dressColor, setDressColor] = useState('#1A1816');
  const [dressTexture, setDressTexture] = useState('Silk Satin');
  const [modelRotation, setModelRotation] = useState(0);
  const [modelScale, setModelScale] = useState(1);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturedDesign, setCapturedDesign] = useState(null);
  const videoRef = useRef(null);

  // ---------------------------------------------------------------------------
  // CLEARANCE FILTERS STATE
  // ---------------------------------------------------------------------------
  const [maxPrice, setMaxPrice] = useState(600);
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
    { id: 1, author: 'Evelyn V. De La Tour', rating: 5, date: 'OCT 24, 2025', text: 'The structural silhouette and drape of the Silk Atelier Gown exceeded expectations. Uncompromising precision and haute couture elegance.' },
    { id: 2, author: 'Julian C. Sterling', rating: 5, date: 'NOV 12, 2025', text: 'Minimalist aesthetic realized perfectly on the digital canvas. Exquisite attention to seam rendering.' },
    { id: 3, author: 'Clara M. Rothschild', rating: 5, date: 'JAN 08, 2026', text: 'Sublime experience fitting the bespoke column gown virtually. Highly recommended for couture preparations.' }
  ]);

  // Initial Loader Simulation
  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } catch (err) {
      setErrorMessage("Initialization Error: Unable to access studio configuration.");
      setIsLoading(false);
    }
  }, []);

  // Safe Navigation Handler
  const handleTabSwitch = (tab) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setActiveTab(tab);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } catch (err) {
      setErrorMessage("Failed to transition workspace context.");
      setIsLoading(false);
    }
  };

  // Safe Camera Toggle with Graceful Refusal
  const toggleCamera = async () => {
    setCameraError(null);
    if (cameraActive) {
      try {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      } catch (err) {
        console.warn("Camera teardown warning:", err);
      } finally {
        setCameraActive(false);
      }
    } else {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Live camera video interface is unavailable in this environment.");
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraActive(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }, 100);
      } catch (err) {
        console.error("Camera access failure:", err);
        setCameraError(
          err.name === 'NotAllowedError' 
            ? "Camera permission denied. Please allow camera access in browser permissions." 
            : err.message || "Unable to open fitting camera video feed."
        );
        setCameraActive(false);
      }
    }
  };

  // Design Capture
  const captureDesignSnapshot = () => {
    try {
      if (!dressModels[selectedDressModel]) {
        throw new Error("No active gown selected.");
      }
      setCapturedDesign({
        id: Date.now(),
        dress: dressModels[selectedDressModel].name,
        color: dressColor,
        texture: dressTexture,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      setErrorMessage("Unable to save design snapshot. " + err.message);
    }
  };

  // Dress Models
  const dressModels = [
    { id: 1, name: 'Architectural Silk Gown', code: 'COUTURE-01', baseImg: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80', originalPrice: 1850 },
    { id: 2, name: 'Asymmetric Pleated Dress', code: 'COUTURE-02', baseImg: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80', originalPrice: 1250 },
    { id: 3, name: 'Draped Satin Column', code: 'COUTURE-03', baseImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', originalPrice: 1480 },
    { id: 4, name: 'Minimalist Silk Slip', code: 'COUTURE-04', baseImg: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80', originalPrice: 950 },
  ];

  // Clearance Private Archive
  const clearanceCatalog = [
    { id: 101, name: 'Sculptured Velvet Mini Dress', category: 'Eveningwear', color: 'Noir', colorHex: '#1A1816', price: 290, originalPrice: 850, img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80' },
    { id: 102, name: 'Ivory Layered Chiffon Gown', category: 'Eveningwear', color: 'Ivory', colorHex: '#FAF9F6', price: 420, originalPrice: 1350, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80' },
    { id: 103, name: 'Crimson Draped Wrap Dress', category: 'Prêt-à-Porter', color: 'Crimson', colorHex: '#7A1C1C', price: 180, originalPrice: 580, img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80' },
    { id: 104, name: 'Midnight Blue Column Gown', category: 'Tailoring', color: 'Midnight', colorHex: '#1B2A4A', price: 340, originalPrice: 990, img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80' },
    { id: 105, name: 'Emerald Satin Slip Dress', category: 'Prêt-à-Porter', color: 'Emerald', colorHex: '#1B4A38', price: 210, originalPrice: 620, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80' },
    { id: 106, name: 'Obsidian Trench Coat Dress', category: 'Outerwear', color: 'Noir', colorHex: '#1A1816', price: 480, originalPrice: 1450, img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80' }
  ];

  // Filtered Clearance Products
  const filteredClearance = clearanceCatalog.filter(item => {
    try {
      const matchesPrice = item.price <= maxPrice;
      const matchesColor = selectedColorFilter === 'All' || item.color === selectedColorFilter;
      const matchesCategory = selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter;
      return matchesPrice && matchesColor && matchesCategory;
    } catch (err) {
      return false;
    }
  });

  // Tracking Waypoints
  const waypoints = [
    { id: 0, title: 'Atelier Origin', city: 'Milan', country: 'Italy', coords: '45.4642° N, 9.1900° E', status: 'Completed', time: 'NOV 10 • 09:00 AM', cx: 150, cy: 220, details: 'Garment packaged in custom climate-controlled archival case.' },
    { id: 1, title: 'Regional Logistics Hub', city: 'Paris', country: 'France', coords: '48.8566° N, 2.3522° E', status: 'In Transit', time: 'TODAY • 08:30 AM', cx: 320, cy: 140, details: 'Cleared customs terminal. Flight LX-402 departed.' },
    { id: 2, title: 'Customs Clearance', city: 'London', country: 'United Kingdom', coords: '51.5074° N, 0.1278° W', status: 'Spot Check', time: 'EST. NOV 16 • 11:00 AM', cx: 500, cy: 180, details: 'Pre-clearance documentation submitted to priority registry.' },
    { id: 3, title: 'Destination Studio', city: 'New York', country: 'United States', coords: '40.7128° N, 74.0060° W', status: 'Pending', time: 'EST. NOV 18 • 02:00 PM', cx: 700, cy: 260, details: 'Scheduled for white-glove courier delivery to Fifth Avenue Studio.' }
  ];

  // Map Controls
  const handleZoom = (dir) => setMapZoom(prev => dir === 'in' ? Math.min(prev + 0.3, 2.2) : Math.max(prev - 0.3, 0.8));
  const handleResetMap = () => { setMapZoom(1); setMapPan({ x: 0, y: 0 }); };
  const handleMouseDown = (e) => { setIsDragging(true); setDragStart({ x: e.clientX - mapPan.x, y: e.clientY - mapPan.y }); };
  const handleMouseMove = (e) => { if (isDragging) setMapPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUp = () => setIsDragging(false);

  // Review Submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setErrorMessage("Please compose a critique before sending.");
      return;
    }
    setReviews([{ id: Date.now(), author: 'Client Private Visitor', rating, date: 'JUST NOW', text: reviewText.trim() }, ...reviews]);
    setReviewText('');
    setRating(5);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1816] font-sans flex antialiased selection:bg-[#D4AF37] selection:text-[#1A1816] relative">
      
      {/* ------------------------------------------------------------------- */}
      {/* INITIAL / TAB LOADER                                               */}
      {/* ------------------------------------------------------------------- */}
      {isLoading && (
        <div className="fixed inset-0 bg-[#FAF9F6] z-50 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin stroke-[1]" />
          <p className="font-serif text-base tracking-[0.3em] uppercase text-[#1A1816] font-light">M A I S O N</p>
          <span className="text-[9px] tracking-[0.3em] text-[#8C857B] uppercase font-light">Preparing Virtual Fitting Room</span>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* NOTIFICATION ERROR BANNER                                           */}
      {/* ------------------------------------------------------------------- */}
      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#1A1816] text-[#FAF9F6] border border-[#D4AF37]/50 px-5 py-3.5 flex items-center gap-4 shadow-xl max-w-md">
          <AlertTriangle className="w-4 h-4 text-[#D4AF37] shrink-0 stroke-[1.5]" />
          <span className="text-xs font-serif italic text-[#FAF9F6] flex-1">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-[#8C857B] hover:text-[#FAF9F6]">
            <XCircle className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* ELEGANT SIDEBAR NAVIGATION                                         */}
      {/* ------------------------------------------------------------------- */}
      <aside className="w-80 border-r border-[#E8E5DE] p-10 flex flex-col justify-between h-screen sticky top-0 bg-[#FAF9F6] z-20">
        <div>
          <div className="mb-14 text-center border-b border-[#E8E5DE] pb-8">
            <h1 className="font-serif text-2xl tracking-[0.3em] uppercase text-[#1A1816] font-light">
              M A I S O N
            </h1>
            <p className="text-[9px] tracking-[0.35em] text-[#D4AF37] uppercase mt-2 font-medium">
              Haute Couture Digital Studio
            </p>
          </div>

          <nav className="space-y-6">
            <button
              onClick={() => handleTabSwitch('I')}
              className={`w-full flex items-center justify-between text-xs tracking-[0.2em] uppercase transition-all duration-300 pb-3 border-b ${
                activeTab === 'I' ? 'border-[#1A1816] text-[#1A1816] font-medium pl-2' : 'border-transparent text-[#8C857B] hover:text-[#1A1816]'
              }`}
            >
              <span className="font-serif text-sm mr-3 text-[#D4AF37]">I.</span>
              <span className="flex-1 text-left">3D Couture & Camera</span>
              <Compass className="w-3.5 h-3.5 stroke-[1.25]" />
            </button>

            <button
              onClick={() => handleTabSwitch('II')}
              className={`w-full flex items-center justify-between text-xs tracking-[0.2em] uppercase transition-all duration-300 pb-3 border-b ${
                activeTab === 'II' ? 'border-[#1A1816] text-[#1A1816] font-medium pl-2' : 'border-transparent text-[#8C857B] hover:text-[#1A1816]'
              }`}
            >
              <span className="font-serif text-sm mr-3 text-[#D4AF37]">II.</span>
              <span className="flex-1 text-left">Logistics Tracker</span>
              <Package className="w-3.5 h-3.5 stroke-[1.25]" />
            </button>

            <button
              onClick={() => handleTabSwitch('III')}
              className={`w-full flex items-center justify-between text-xs tracking-[0.2em] uppercase transition-all duration-300 pb-3 border-b ${
                activeTab === 'III' ? 'border-[#1A1816] text-[#1A1816] font-medium pl-2' : 'border-transparent text-[#8C857B] hover:text-[#1A1816]'
              }`}
            >
              <span className="font-serif text-sm mr-3 text-[#D4AF37]">III.</span>
              <span className="flex-1 text-left">Client Critiques</span>
              <MessageSquare className="w-3.5 h-3.5 stroke-[1.25]" />
            </button>

            <button
              onClick={() => handleTabSwitch('IV')}
              className={`w-full flex items-center justify-between text-xs tracking-[0.2em] uppercase transition-all duration-300 pb-3 border-b ${
                activeTab === 'IV' ? 'border-[#1A1816] text-[#1A1816] font-medium pl-2' : 'border-transparent text-[#8C857B] hover:text-[#1A1816]'
              }`}
            >
              <span className="font-serif text-sm mr-3 text-[#D4AF37]">IV.</span>
              <span className="flex-1 text-left">Private Sale Archive</span>
              <Tag className="w-3.5 h-3.5 stroke-[1.25]" />
            </button>
          </nav>
        </div>

        <div className="pt-8 border-t border-[#E8E5DE] text-center">
          <p className="text-[9px] text-[#8C857B] tracking-[0.25em] uppercase font-light">
            Collection 2026 — Paris / Milan
          </p>
        </div>
      </aside>

      {/* ------------------------------------------------------------------- */}
      {/* MAIN CONTENT WORKSPACE                                              */}
      {/* ------------------------------------------------------------------- */}
      <main className="flex-1 overflow-y-auto p-12 lg:p-16">

        {/* =================================================================== */}
        {/* SECTION I: 3D DRESS CUSTOMIZER & FITTING CAMERA                      */}
        {/* =================================================================== */}
        {activeTab === 'I' && (
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="border-b border-[#E8E5DE] pb-6 flex justify-between items-end">
              <div>
                <span className="text-[10px] font-serif text-[#D4AF37] tracking-[0.3em] uppercase block">Atelier Atelier Fitting</span>
                <h2 className="font-serif text-3xl font-light text-[#1A1816] tracking-[0.05em] mt-1">
                  3D Garment Customizer & Fitting Canvas
                </h2>
              </div>
              <p className="text-[10px] text-[#8C857B] tracking-[0.25em] uppercase font-light">
                Virtual Fitting Room
              </p>
            </div>

            {/* Camera Error Message */}
            {cameraError && (
              <div className="p-4 bg-[#FAF9F6] border border-[#A33B3B]/40 text-[#A33B3B] flex items-center justify-between text-xs font-serif italic">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#A33B3B]" />
                  <span>{cameraError}</span>
                </div>
                <button onClick={() => setCameraError(null)} className="text-[10px] tracking-widest uppercase font-sans font-medium text-[#1A1816]">Dismiss</button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* 3D Model Display Canvas */}
              <div className="lg:col-span-8 bg-[#F4F2EB] border border-[#E8E5DE] p-8 flex flex-col justify-between h-[620px] relative overflow-hidden shadow-inner">
                
                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="text-[9px] tracking-[0.25em] uppercase text-[#8C857B] font-light">
                      {dressModels[selectedDressModel]?.code}
                    </span>
                    <h3 className="font-serif text-2xl font-light text-[#1A1816]">
                      {dressModels[selectedDressModel]?.name}
                    </h3>
                  </div>

                  {/* Camera Toggle Button */}
                  <button
                    onClick={toggleCamera}
                    className={`flex items-center gap-2.5 px-4 py-2 border text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
                      cameraActive 
                        ? 'bg-[#1A1816] text-[#FAF9F6] border-[#1A1816]' 
                        : 'bg-[#FAF9F6] text-[#1A1816] border-[#D4AF37]/50 hover:border-[#1A1816]'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 stroke-[1.25]" />
                    <span>{cameraActive ? 'Disable Fitting Camera' : 'Enable Fitting Camera'}</span>
                  </button>
                </div>

                {/* 3D Viewport Render */}
                <div className="absolute inset-0 p-8 flex items-center justify-center pointer-events-none">
                  
                  {/* Camera Video Overlay */}
                  {cameraActive && (
                    <div className="absolute inset-0 z-0 opacity-30 overflow-hidden flex items-center justify-center">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover grayscale contrast-125" 
                      />
                    </div>
                  )}

                  {/* Dynamic Dress Graphic Canvas */}
                  <div 
                    className="relative transition-all duration-500 ease-out z-10 flex items-center justify-center"
                    style={{
                      transform: `rotate(${modelRotation}deg) scale(${modelScale})`,
                      filter: `drop-shadow(0px 15px 30px rgba(26, 24, 22, 0.12))`
                    }}
                  >
                    <img 
                      src={dressModels[selectedDressModel]?.baseImg} 
                      alt="Couture Model" 
                      className="max-h-[460px] object-contain grayscale opacity-90 transition-all duration-700"
                    />
                    {/* Color Blend Mask */}
                    <div 
                      className="absolute inset-0 mix-blend-color opacity-70 pointer-events-none transition-colors duration-500"
                      style={{ backgroundColor: dressColor }}
                    />
                  </div>
                </div>

                {/* Toolbar */}
                <div className="z-10 bg-[#FAF9F6]/95 backdrop-blur-md border border-[#E8E5DE] px-4 py-2.5 flex items-center justify-between self-center gap-6 shadow-sm">
                  <button 
                    onClick={() => setModelRotation(r => r - 45)}
                    className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#8C857B] hover:text-[#1A1816] transition-colors"
                  >
                    <RotateCw className="w-3 h-3 transform -scale-x-100" />
                    <span>Rotate L</span>
                  </button>
                  <span className="text-[#E8E5DE]">|</span>
                  <button 
                    onClick={() => setModelScale(s => Math.min(s + 0.15, 1.4))}
                    className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#8C857B] hover:text-[#1A1816] transition-colors"
                  >
                    <ZoomIn className="w-3 h-3" />
                    <span>Zoom In</span>
                  </button>
                  <span className="text-[#E8E5DE]">|</span>
                  <button 
                    onClick={() => setModelScale(s => Math.max(s - 0.15, 0.7))}
                    className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#8C857B] hover:text-[#1A1816] transition-colors"
                  >
                    <ZoomOut className="w-3 h-3" />
                    <span>Zoom Out</span>
                  </button>
                  <span className="text-[#E8E5DE]">|</span>
                  <button 
                    onClick={() => { setModelRotation(0); setModelScale(1); }}
                    className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#8C857B] hover:text-[#1A1816] transition-colors"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                  <span className="text-[#E8E5DE]">|</span>
                  <button 
                    onClick={captureDesignSnapshot}
                    className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase bg-[#1A1816] text-[#FAF9F6] px-4 py-1.5 hover:bg-[#D4AF37] hover:text-[#1A1816] transition-all duration-300"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Snapshot</span>
                  </button>
                </div>

              </div>

              {/* Sidebar Controls */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Fabric Tint Selector */}
                <div className="border border-[#E8E5DE] bg-[#FAF9F6] p-6 space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#1A1816] font-medium block border-b border-[#E8E5DE] pb-2">
                    Fabric Color Palette
                  </span>
                  <div className="flex items-center justify-between pt-1">
                    {[
                      { name: 'Noir', hex: '#1A1816' },
                      { name: 'Champagne', hex: '#D4AF37' },
                      { name: 'Ivory', hex: '#FAF9F6' },
                      { name: 'Crimson', hex: '#7A1C1C' },
                      { name: 'Midnight', hex: '#1B2A4A' }
                    ].map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setDressColor(c.hex)}
                        style={{ backgroundColor: c.hex }}
                        className={`w-8 h-8 rounded-full border transition-all duration-300 flex items-center justify-center ${
                          dressColor === c.hex ? 'scale-110 border-[#1A1816] ring-2 ring-offset-2 ring-[#D4AF37]' : 'border-[#E8E5DE]'
                        }`}
                      >
                        {dressColor === c.hex && <Check className={`w-3.5 h-3.5 ${c.hex === '#FAF9F6' ? 'text-[#1A1816]' : 'text-white'}`} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fabric Material Selection */}
                <div className="border border-[#E8E5DE] bg-[#FAF9F6] p-6 space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#1A1816] font-medium block border-b border-[#E8E5DE] pb-2">
                    Textile Drapery
                  </span>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {['Silk Satin', 'Heavy Wool', 'Organza'].map((mat) => (
                      <button
                        key={mat}
                        onClick={() => setDressTexture(mat)}
                        className={`py-2 px-2 text-[9px] uppercase tracking-[0.15em] border text-center transition-all duration-300 ${
                          dressTexture === mat ? 'bg-[#1A1816] text-[#FAF9F6] border-[#1A1816]' : 'bg-[#F4F2EB] text-[#8C857B] border-[#E8E5DE] hover:border-[#1A1816]'
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Base Silhouette Picker */}
                <div className="border border-[#E8E5DE] bg-[#FAF9F6] p-6 space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#1A1816] font-medium block border-b border-[#E8E5DE] pb-2">
                    Couture Silhouettes
                  </span>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {dressModels.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedDressModel(idx)}
                        className={`p-2.5 border text-left bg-[#F4F2EB] transition-all duration-300 ${
                          selectedDressModel === idx ? 'border-[#1A1816] shadow-sm' : 'border-[#E8E5DE] opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="aspect-[3/4] bg-[#FAF9F6] mb-2 overflow-hidden border border-[#E8E5DE]">
                          <img src={item.baseImg} alt={item.name} className="w-full h-full object-cover grayscale" />
                        </div>
                        <p className="text-[8px] uppercase tracking-[0.2em] text-[#D4AF37] font-medium">{item.code}</p>
                        <p className="font-serif text-xs text-[#1A1816] truncate font-light mt-0.5">{item.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Snapshot Details */}
                {capturedDesign && (
                  <div className="border border-[#D4AF37]/60 bg-[#FAF9F6] p-5 space-y-2 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-medium">Bespoke Design Saved</span>
                      <span className="text-[9px] font-mono text-[#8C857B]">{capturedDesign.time}</span>
                    </div>
                    <p className="text-sm font-serif text-[#1A1816] font-light">{capturedDesign.dress}</p>
                    <p className="text-[10px] text-[#8C857B]">Fabric: {capturedDesign.texture} • Custom Colorway Applied</p>
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
            <div className="border-b border-[#E8E5DE] pb-6 flex justify-between items-end">
              <div>
                <span className="text-[10px] font-serif text-[#D4AF37] tracking-[0.3em] uppercase block">Global Courier</span>
                <h2 className="font-serif text-3xl font-light text-[#1A1816] tracking-[0.05em] mt-1">
                  Private Waybill & Live Route Tracker
                </h2>
              </div>
              <p className="text-[10px] text-[#8C857B] tracking-[0.25em] uppercase font-light">WAYBILL: #882-9012-LX</p>
            </div>

            <div className="bg-[#F4F2EB] border border-[#E8E5DE] p-8 space-y-6">
              <div className="flex flex-wrap justify-between items-center pb-6 border-b border-[#E8E5DE] gap-4">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#8C857B] font-light">Current Destination</span>
                  <p className="font-serif text-2xl text-[#1A1816] mt-1 font-light">
                    {waypoints[selectedWaypoint]?.city}, {waypoints[selectedWaypoint]?.country}
                  </p>
                  <p className="text-xs text-[#8C857B] font-serif italic mt-1">
                    {waypoints[selectedWaypoint]?.title} — <span className="text-[#1A1816] font-sans font-medium uppercase text-[10px] tracking-wider">{waypoints[selectedWaypoint]?.status}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#8C857B] font-light">Coordinates</span>
                  <p className="font-mono text-xs text-[#1A1816] mt-1 bg-[#FAF9F6] px-3.5 py-1.5 border border-[#E8E5DE] inline-block">
                    {waypoints[selectedWaypoint]?.coords}
                  </p>
                </div>
              </div>

              {/* Map Canvas Frame */}
              <div 
                className={`h-[440px] border border-[#E8E5DE] relative overflow-hidden select-none cursor-grab active:cursor-grabbing transition-colors ${
                  showSatelliteOverlay ? 'bg-[#1A1816]' : 'bg-[#FAF9F6]'
                }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div className={`absolute inset-0 pointer-events-none transition-opacity ${
                  showSatelliteOverlay 
                    ? 'bg-[linear-gradient(to_right,#222222_1px,transparent_1px),linear-gradient(to_bottom,#222222_1px,transparent_1px)] opacity-30' 
                    : 'bg-[linear-gradient(to_right,#e8e5de_1px,transparent_1px),linear-gradient(to_bottom,#e8e5de_1px,transparent_1px)] opacity-50'
                } bg-[size:2.5rem_2.5rem]`} />

                <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
                  <div className="flex items-center gap-2 bg-[#FAF9F6]/90 border border-[#E8E5DE] px-3.5 py-1.5 backdrop-blur-sm pointer-events-auto">
                    <Navigation className="w-3 h-3 text-[#D4AF37]" />
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#1A1816] font-medium">GPS Telemetry</span>
                  </div>

                  <div className="flex items-center gap-2 bg-[#FAF9F6]/90 border border-[#E8E5DE] p-1 backdrop-blur-sm pointer-events-auto shadow-sm">
                    <button onClick={() => handleZoom('in')} className="p-1.5 hover:bg-[#F4F2EB] text-[#1A1816]"><ZoomIn className="w-3.5 h-3.5 stroke-[1.25]" /></button>
                    <button onClick={() => handleZoom('out')} className="p-1.5 hover:bg-[#F4F2EB] text-[#1A1816]"><ZoomOut className="w-3.5 h-3.5 stroke-[1.25]" /></button>
                    <span className="text-[#E8E5DE]">|</span>
                    <button onClick={handleResetMap} className="p-1.5 hover:bg-[#F4F2EB] text-[#1A1816]"><RefreshCw className="w-3.5 h-3.5 stroke-[1.25]" /></button>
                    <span className="text-[#E8E5DE]">|</span>
                    <button onClick={() => setShowSatelliteOverlay(!showSatelliteOverlay)} className={`p-1.5 transition-colors ${showSatelliteOverlay ? 'bg-[#1A1816] text-[#FAF9F6]' : 'hover:bg-[#F4F2EB] text-[#1A1816]'}`}><Layers className="w-3.5 h-3.5 stroke-[1.25]" /></button>
                  </div>
                </div>

                <div 
                  className="w-full h-full transition-transform duration-100 ease-out flex items-center justify-center"
                  style={{ transform: `translate(${mapPan.x}px, ${mapPan.y}px) scale(${mapZoom})`, transformOrigin: 'center center' }}
                >
                  <svg className="w-[850px] h-[320px] overflow-visible" viewBox="0 0 850 320" fill="none">
                    <g className={showSatelliteOverlay ? 'stroke-[#333333]' : 'stroke-[#E8E5DE]'} strokeWidth="1" fill="none">
                      <path d="M 50,180 Q 100,120 200,140 T 300,200 T 220,280 T 80,240 Z" />
                      <path d="M 280,80 Q 380,40 480,90 T 520,180 T 400,220 T 310,140 Z" />
                      <path d="M 580,120 Q 680,80 780,140 T 750,260 T 620,220 Z" />
                    </g>
                    <path d="M 150 220 C 220 160, 260 130, 320 140 C 380 150, 440 200, 500 180 C 580 150, 640 220, 700 260" stroke={showSatelliteOverlay ? '#444444' : '#D4AF37'} strokeWidth="1.5" strokeDasharray="4 4" />
                    <path d="M 150 220 C 220 160, 260 130, 320 140" stroke={showSatelliteOverlay ? '#FAF9F6' : '#1A1816'} strokeWidth="2" />

                    {waypoints.map((wp) => {
                      const isSelected = selectedWaypoint === wp.id;
                      const isCompleted = wp.id <= 1;

                      return (
                        <g key={wp.id} onClick={(e) => { e.stopPropagation(); setSelectedWaypoint(wp.id); }} className="cursor-pointer group">
                          {isSelected && <circle cx={wp.cx} cy={wp.cy} r="18" className={`fill-none animate-ping opacity-30 ${showSatelliteOverlay ? 'stroke-[#FAF9F6]' : 'stroke-[#1A1816]'}`} strokeWidth="1.5" />}
                          <circle cx={wp.cx} cy={wp.cy} r={isSelected ? "9" : "5"} className={`transition-all duration-300 ${isSelected ? (showSatelliteOverlay ? 'fill-[#1A1816] stroke-[#FAF9F6] stroke-2' : 'fill-[#FAF9F6] stroke-[#1A1816] stroke-2') : isCompleted ? (showSatelliteOverlay ? 'fill-[#FAF9F6]' : 'fill-[#1A1816]') : (showSatelliteOverlay ? 'fill-[#222222] stroke-[#555555] stroke-1' : 'fill-[#FAF9F6] stroke-[#8C857B] stroke-1')}`} />
                          {isSelected && <circle cx={wp.cx} cy={wp.cy} r="3" className={showSatelliteOverlay ? 'fill-[#FAF9F6]' : 'fill-[#D4AF37]'} />}
                          <text x={wp.cx} y={wp.cy - 16} textAnchor="middle" className={`text-[9px] font-sans tracking-[0.2em] uppercase font-medium transition-all ${isSelected ? (showSatelliteOverlay ? 'fill-[#FAF9F6]' : 'fill-[#1A1816]') : 'fill-[#8C857B]'}`}>
                            {wp.city}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Waypoint Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {waypoints.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => setSelectedWaypoint(wp.id)}
                    className={`text-left p-4 transition-all duration-300 border ${
                      selectedWaypoint === wp.id ? 'border-[#1A1816] bg-[#FAF9F6] shadow-sm' : 'border-[#E8E5DE] bg-[#FAF9F6]/50 hover:border-[#D4AF37]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] tracking-[0.2em] uppercase text-[#D4AF37]">0{wp.id + 1}.</span>
                      <MapPin className={`w-3 h-3 ${selectedWaypoint === wp.id ? 'text-[#1A1816]' : 'text-[#8C857B]'}`} />
                    </div>
                    <p className="font-serif text-sm text-[#1A1816] truncate font-light">{wp.city}</p>
                    <p className="text-[8px] uppercase tracking-[0.15em] text-[#8C857B] truncate mt-0.5">{wp.status}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* SECTION III: REVIEWS & CLIENT EVALUATIONS                           */}
        {/* =================================================================== */}
        {activeTab === 'III' && (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="border-b border-[#E8E5DE] pb-6 flex justify-between items-end">
              <div>
                <span className="text-[10px] font-serif text-[#D4AF37] tracking-[0.3em] uppercase block">Client Feedback</span>
                <h2 className="font-serif text-3xl font-light text-[#1A1816] tracking-[0.05em] mt-1">
                  Private Client Critiques & Evaluations
                </h2>
              </div>
              <p className="text-[10px] text-[#8C857B] tracking-[0.25em] uppercase font-light">{reviews.length} Submissions</p>
            </div>

            {/* Critique Form */}
            <form onSubmit={handleReviewSubmit} className="border border-[#E8E5DE] bg-[#FAF9F6] p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E5DE] pb-4">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#1A1816] font-medium block">Compose Critique</span>
                  <span className="text-[10px] text-[#8C857B]">Evaluate virtual fitting, garment drape, or custom atelier options.</span>
                </div>
                
                <div className="flex items-center gap-2 bg-[#F4F2EB] px-4 py-2 border border-[#E8E5DE]">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#8C857B] mr-2">Score:</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star className={`w-3.5 h-3.5 transition-colors ${star <= (hoverRating || rating) ? 'fill-[#D4AF37] stroke-[#D4AF37]' : 'fill-transparent stroke-[#8C857B]'}`} />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-serif text-[#1A1816] ml-2">{hoverRating || rating}/5</span>
                </div>
              </div>

              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience regarding fabric behavior, silhouette precision, or studio delivery..."
                className="w-full bg-[#F4F2EB] border border-[#E8E5DE] p-4 text-xs font-serif italic text-[#1A1816] focus:outline-none focus:border-[#1A1816] resize-none"
              />

              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2.5 bg-[#1A1816] text-[#FAF9F6] px-8 py-3 text-[10px] uppercase tracking-[0.25em] hover:bg-[#D4AF37] hover:text-[#1A1816] transition-all duration-300">
                  <span>Submit Critique</span>
                  <Send className="w-3 h-3 stroke-[1.25]" />
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="border border-[#E8E5DE] bg-[#FAF9F6] p-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-lg font-light text-[#1A1816]">{rev.author}</span>
                      <span className="text-[10px] text-[#D4AF37]">•</span>
                      <span className="text-[9px] tracking-[0.2em] text-[#8C857B] uppercase">{rev.date}</span>
                    </div>
                    <div className="flex gap-1 bg-[#F4F2EB] px-3 py-1 border border-[#E8E5DE]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-[#D4AF37] stroke-[#D4AF37]' : 'fill-transparent stroke-[#E8E5DE]'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#1A1816] leading-relaxed font-serif italic">"{rev.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* SECTION IV: CLEARANCE ARCHIVE & PRIVATE SALE                        */}
        {/* =================================================================== */}
        {activeTab === 'IV' && (
          <div className="max-w-6xl mx-auto space-y-10">
            
            {/* Header */}
            <div className="border-b border-[#E8E5DE] pb-6 flex justify-between items-end">
              <div>
                <span className="text-[10px] font-serif text-[#D4AF37] tracking-[0.3em] uppercase block">Archive Private Sale</span>
                <h2 className="font-serif text-3xl font-light text-[#1A1816] tracking-[0.05em] mt-1">
                  Clearance Archive & Seasonal Pieces
                </h2>
              </div>
              <p className="text-[10px] text-[#8C857B] tracking-[0.25em] uppercase font-light">
                {filteredClearance.length} Available Pieces
              </p>
            </div>

            {/* Filter Panel */}
            <div className="border border-[#E8E5DE] bg-[#FAF9F6] p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-[#E8E5DE] pb-3">
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1816] font-medium">
                  Refine Archive Selection
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Max Price Filter */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="uppercase tracking-[0.2em] text-[#8C857B] text-[9px]">Max Price Ceiling:</span>
                    <span className="font-serif font-light text-[#1A1816]">${maxPrice}</span>
                  </div>
                  <input 
                    type="range" 
                    min="150" 
                    max="600" 
                    step="20"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#1A1816] cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-[#8C857B] font-mono">
                    <span>$150</span>
                    <span>$600</span>
                  </div>
                </div>

                {/* Color Palette Filter */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#8C857B] block">Colorway:</span>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Noir', 'Ivory', 'Crimson', 'Midnight', 'Emerald'].map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColorFilter(col)}
                        className={`px-3 py-1 text-[9px] uppercase tracking-[0.15em] border transition-all duration-300 ${
                          selectedColorFilter === col 
                            ? 'bg-[#1A1816] text-[#FAF9F6] border-[#1A1816]' 
                            : 'bg-[#F4F2EB] text-[#8C857B] border-[#E8E5DE] hover:border-[#1A1816]'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Garment Category Filter */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#8C857B] block">Garment Classification:</span>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="w-full bg-[#F4F2EB] border border-[#E8E5DE] p-2 text-xs font-serif text-[#1A1816] focus:outline-none focus:border-[#1A1816]"
                  >
                    <option value="All">All Classifications</option>
                    <option value="Eveningwear">Eveningwear</option>
                    <option value="Prêt-à-Porter">Prêt-à-Porter</option>
                    <option value="Tailoring">Tailoring</option>
                    <option value="Outerwear">Outerwear</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Catalog Grid */}
            {filteredClearance.length === 0 ? (
              <div className="text-center py-20 border border-[#E8E5DE] bg-[#FAF9F6]">
                <p className="font-serif text-xl font-light text-[#1A1816]">No archive pieces match your criteria.</p>
                <button 
                  onClick={() => { setMaxPrice(600); setSelectedColorFilter('All'); setSelectedCategoryFilter('All'); }}
                  className="mt-4 text-[10px] uppercase tracking-[0.2em] border-b border-[#1A1816] pb-1 text-[#1A1816] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors"
                >
                  Reset Filter Parameters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredClearance.map((item) => (
                  <div key={item.id} className="border border-[#E8E5DE] bg-[#FAF9F6] p-5 flex flex-col justify-between group hover:border-[#1A1816] transition-all duration-300">
                    <div>
                      <div className="aspect-[3/4] bg-[#F4F2EB] mb-4 overflow-hidden relative border border-[#E8E5DE]">
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';
                          }}
                          className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                        />
                        <span className="absolute top-3 right-3 bg-[#1A1816] text-[#D4AF37] text-[8px] uppercase tracking-[0.2em] px-2.5 py-1">
                          ARCHIVE
                        </span>
                      </div>
                      <span className="text-[9px] tracking-[0.2em] uppercase text-[#D4AF37] font-medium">{item.category} • {item.color}</span>
                      <h3 className="font-serif text-lg font-light text-[#1A1816] mt-1 mb-3">{item.name}</h3>
                    </div>

                    <div className="pt-4 border-t border-[#E8E5DE] flex items-center justify-between">
                      <div>
                        <span className="line-through text-xs text-[#8C857B] mr-2 font-mono">${item.originalPrice}</span>
                        <span className="font-serif text-lg font-light text-[#1A1816]">${item.price}</span>
                      </div>
                      <button className="text-[9px] uppercase tracking-[0.2em] border border-[#1A1816] px-4 py-2 hover:bg-[#1A1816] hover:text-[#FAF9F6] transition-all duration-300">
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

// Wrap export with Error Boundary
export default function FashionDesignStudio() {
  return (
    <AtelierErrorBoundary>
      <HighFashionDesignStudioContent />
    </AtelierErrorBoundary>
  );
}