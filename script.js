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
  Info,
  Loader2,
  Tag,
  Filter,
  SlidersHorizontal,
  Video,
  Check,
  Sparkles,
  AlertTriangle,
  XCircle
} from 'lucide-react';

// ---------------------------------------------------------------------------
// ERROR BOUNDARY COMPONENT
// Catches JavaScript errors anywhere in their child component tree.
// ---------------------------------------------------------------------------
class StudioErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Atelier Studio Error Boundary Caught:", error, errorInfo);
    this.setState({ errorInfo: error?.toString() || 'Unknown Runtime Error' });
  }

  handleReset = () => {
    this.setState({ hasError: false, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center p-8 text-[#1A1A1A]">
          <div className="max-w-md w-full border border-[#1A1A1A] p-8 bg-[#F2F2EE] space-y-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertTriangle className="w-6 h-6 stroke-[1.5]" />
              <h2 className="font-serif text-xl font-normal uppercase tracking-wider">Application Exception</h2>
            </div>
            <p className="text-xs text-[#737370] leading-relaxed">
              An unexpected error occurred within the interactive rendering pipeline.
            </p>
            {this.state.errorInfo && (
              <div className="p-3 bg-[#FBFBFA] border border-[#E5E5E0] font-mono text-[10px] text-red-800 overflow-x-auto">
                {this.state.errorInfo}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full bg-[#1A1A1A] text-[#FBFBFA] py-2.5 text-xs uppercase tracking-widest hover:bg-[#2A2A2A] transition-colors"
            >
              Reload Studio Context
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// MAIN STUDIO COMPONENT WITH ERROR HANDLING
// ---------------------------------------------------------------------------
function FashionDesignStudioContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('I'); 
  const [errorMessage, setErrorMessage] = useState(null);
  
  // ---------------------------------------------------------------------------
  // 3D DRESS MODEL & CAMERA CUSTOMIZER STATE
  // ---------------------------------------------------------------------------
  const [selectedDressModel, setSelectedDressModel] = useState(0);
  const [dressColor, setDressColor] = useState('#1A1A1A');
  const [dressTexture, setDressTexture] = useState('Silk');
  const [modelRotation, setModelRotation] = useState(0);
  const [modelScale, setModelScale] = useState(1);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
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

  // Initial Loader Simulation with Error Guard
  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    } catch (err) {
      setErrorMessage("Initialization Error: Unable to load interactive modules.");
      setIsLoading(false);
    }
  }, []);

  // Safe Tab Switching Handler
  const handleTabSwitch = (tab) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setActiveTab(tab);
      setTimeout(() => {
        setIsLoading(false);
      }, 400);
    } catch (err) {
      setErrorMessage("Failed to transition workspace tabs.");
      setIsLoading(false);
    }
  };

  // Safe Camera Toggle with Graceful Fallback
  const toggleCamera = async () => {
    setCameraError(null);
    if (cameraActive) {
      try {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      } catch (err) {
        console.warn("Camera stream cleanup warning:", err);
      } finally {
        setCameraActive(false);
      }
    } else {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera API is not supported in this browser environment.");
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraActive(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }, 100);
      } catch (err) {
        console.error("Camera access error:", err);
        setCameraError(
          err.name === 'NotAllowedError' 
            ? "Camera permission denied. Please grant permission in your browser settings." 
            : err.message || "Failed to initialize live fitting camera."
        );
        setCameraActive(false);
      }
    }
  };

  // Safe Snapshot Capture
  const captureDesignSnapshot = () => {
    try {
      if (!dressModels[selectedDressModel]) {
        throw new Error("No dress model selected for snapshot.");
      }
      setCapturedDesign({
        id: Date.now(),
        dress: dressModels[selectedDressModel].name,
        color: dressColor,
        texture: dressTexture,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      setErrorMessage("Unable to capture studio snapshot. " + err.message);
    }
  };

  // Dress Models Dataset
  const dressModels = [
    { id: 1, name: 'Architectural Silk Gown', code: 'MODEL-01', baseImg: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80', originalPrice: 1200 },
    { id: 2, name: 'Asymmetric Pleated Dress', code: 'MODEL-02', baseImg: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80', originalPrice: 850 },
    { id: 3, name: 'Draped Satin Column', code: 'MODEL-03', baseImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', originalPrice: 980 },
    { id: 4, name: 'Minimalist Slip Dress', code: 'MODEL-04', baseImg: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80', originalPrice: 650 },
  ];

  // Clearance Items Dataset
  const clearanceCatalog = [
    { id: 101, name: 'Sculptured Velvet Mini Dress', category: 'Eveningwear', color: 'Black', colorHex: '#1A1A1A', price: 290, originalPrice: 750, img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80' },
    { id: 102, name: 'Ivory Layered Chiffon Gown', category: 'Eveningwear', color: 'White', colorHex: '#FBFBFA', price: 420, originalPrice: 1100, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80' },
    { id: 103, name: 'Crimson Draped Wrap Dress', category: 'Prêt-à-Porter', color: 'Red', colorHex: '#991B1B', price: 180, originalPrice: 480, img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80' },
    { id: 104, name: 'Midnight Blue Column Gown', category: 'Tailoring', color: 'Blue', colorHex: '#1E3A8A', price: 340, originalPrice: 890, img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80' },
    { id: 105, name: 'Emerald Satin Slip Dress', category: 'Prêt-à-Porter', color: 'Green', colorHex: '#065F46', price: 210, originalPrice: 520, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80' },
    { id: 106, name: 'Obsidian Trench Coat Dress', category: 'Outerwear', color: 'Black', colorHex: '#1A1A1A', price: 480, originalPrice: 1300, img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80' }
  ];

  // Filter Clearance Items Safely
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
    { id: 1, title: 'Regional Logistics Hub', city: 'Paris', country: 'France', coords: '48.8566° N, 2.3522° E', status: 'In Transit', time: 'TODAY • 08:30 AM', cx: 320, cy: 140, details: 'Cleared customs terminal. Currently loaded on flight LX-402.' },
    { id: 2, title: 'Customs Clearance', city: 'London', country: 'United Kingdom', coords: '51.5074° N, 0.1278° W', status: 'Spot Check', time: 'EST. NOV 16 • 11:00 AM', cx: 500, cy: 180, details: 'Pre-clearance documentation submitted to priority trade registry.' },
    { id: 3, title: 'Destination Studio', city: 'New York', country: 'United States', coords: '40.7128° N, 74.0060° W', status: 'Pending', time: 'EST. NOV 18 • 02:00 PM', cx: 700, cy: 260, details: 'Scheduled for white-glove courier delivery to Fifth Avenue Studio.' }
  ];

  // Map Navigation Handlers
  const handleZoom = (direction) => {
    setMapZoom((prev) => direction === 'in' ? Math.min(prev + 0.3, 2.2) : Math.max(prev - 0.3, 0.8));
  };
  const handleResetMap = () => { setMapZoom(1); setMapPan({ x: 0, y: 0 }); };
  const handleMouseDown = (e) => { setIsDragging(true); setDragStart({ x: e.clientX - mapPan.x, y: e.clientY - mapPan.y }); };
  const handleMouseMove = (e) => { if (isDragging) setMapPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUp = () => setIsDragging(false);

  // Review Form Handler with Validation
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setErrorMessage("Please enter valid feedback before submitting.");
      return;
    }
    setReviews([{ id: Date.now(), author: 'Client Visitor', rating, date: 'JUST NOW', text: reviewText.trim() }, ...reviews]);
    setReviewText('');
    setRating(5);
    setErrorMessage(null);
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
      {/* GLOBAL ERROR BANNER                                                */}
      {/* ------------------------------------------------------------------- */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 bg-red-900 text-[#FBFBFA] px-4 py-3 border border-red-700 flex items-center gap-3 shadow-lg max-w-md">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="text-xs font-sans flex-1">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="p-1 hover:bg-red-800">
            <XCircle className="w-4 h-4" />
          </button>
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
            Edition 2026 / V2.10
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

            {/* Camera Specific Error Alert */}
            {