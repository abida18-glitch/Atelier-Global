import React, { useState } from 'react';
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
  Navigation
} from 'lucide-react';

export default function FashionDesignStudio() {
  const [activeTab, setActiveTab] = useState('II');
  const [selectedGarment, setSelectedGarment] = useState(0);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [selectedWaypoint, setSelectedWaypoint] = useState(1); // Active tracking step

  const [reviews, setReviews] = useState([
    { id: 1, author: 'Evelyn V.', rating: 5, date: 'OCT 24, 2025', text: 'The structural silhouette and drape of the Silk Atelier Gown exceeded expectations. Uncompromising precision.' },
    { id: 2, author: 'Julian C.', rating: 4, date: 'NOV 12, 2025', text: 'Minimalist aesthetic realized perfectly. Minor delay in rendering high-poly textures, but overall sublime.' }
  ]);

  // Catalog Data
  const garments = [
    { id: 1, name: 'Silk Atelier Gown', code: 'LOOK 01', category: 'Eveningwear', img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'Structured Wool Coat', code: 'LOOK 02', category: 'Outerwear', img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Draped Linen Blazer', code: 'LOOK 03', category: 'Tailoring', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Monochrome Slip Dress', code: 'LOOK 04', category: 'Prêt-à-Porter', img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80' },
  ];

  // Tracking Waypoints Data
  const waypoints = [
    { id: 0, title: 'Atelier Origin', city: 'Milan, IT', coords: '45.4642° N, 9.1900° E', status: 'Completed', time: 'NOV 10 • 09:00 AM' },
    { id: 1, title: 'Regional Logistics Hub', city: 'Paris, FR', coords: '48.8566° N, 2.3522° E', status: 'In Transit', time: 'TODAY • 08:30 AM' },
    { id: 2, title: 'Customs Clearance', city: 'London, UK', coords: '51.5074° N, 0.1278° W', status: 'Pending', time: 'EST. NOV 16' },
    { id: 3, title: 'Destination Studio', city: 'New York, US', coords: '40.7128° N, 74.0060° W', status: 'Pending', time: 'EST. NOV 18' }
  ];

  const handleCameraAction = (action) => {
    console.log(`Camera Action Triggered: ${action}`);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setReviews([
      { id: Date.now(), author: 'Client Visitor', rating, date: 'JUST NOW', text: reviewText },
      ...reviews
    ]);
    setReviewText('');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1A1A1A] font-sans flex antialiased selection:bg-[#2A2A2A] selection:text-[#FBFBFA]">
      
      {/* ------------------------------------------------------------------- */}
      {/* SIDEBAR NAVIGATION                                                  */}
      {/* ------------------------------------------------------------------- */}
      <aside className="w-72 border-r border-[#E5E5E0] p-8 flex flex-col justify-between h-screen sticky top-0 bg-[#FBFBFA]">
        <div>
          <div className="mb-16">
            <h1 className="font-serif text-2xl tracking-widest uppercase text-[#1A1A1A] font-normal">
              A T E L I E R
            </h1>
            <p className="text-[10px] tracking-widest text-[#737370] uppercase mt-1">
              3D Digital Studio
            </p>
          </div>

          <nav className="space-y-6">
            <button
              onClick={() => setActiveTab('I')}
              className={`w-full flex items-center justify-between text-xs tracking-widest uppercase transition-colors duration-200 pb-2 border-b ${
                activeTab === 'I' 
                  ? 'border-[#1A1A1A] text-[#1A1A1A] font-medium' 
                  : 'border-transparent text-[#737370] hover:text-[#1A1A1A]'
              }`}
            >
              <span className="font-serif text-sm mr-3 text-[#A3A39E]">I.</span>
              <span className="flex-1 text-left">Catalog & Studio</span>
              <Compass className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>

            <button
              onClick={() => setActiveTab('II')}
              className={`w-full flex items-center justify-between text-xs tracking-widest uppercase transition-colors duration-200 pb-2 border-b ${
                activeTab === 'II' 
                  ? 'border-[#1A1A1A] text-[#1A1A1A] font-medium' 
                  : 'border-transparent text-[#737370] hover:text-[#1A1A1A]'
              }`}
            >
              <span className="font-serif text-sm mr-3 text-[#A3A39E]">II.</span>
              <span className="flex-1 text-left">Logistics Tracker</span>
              <Package className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>

            <button
              onClick={() => setActiveTab('III')}
              className={`w-full flex items-center justify-between text-xs tracking-widest uppercase transition-colors duration-200 pb-2 border-b ${
                activeTab === 'III' 
                  ? 'border-[#1A1A1A] text-[#1A1A1A] font-medium' 
                  : 'border-transparent text-[#737370] hover:text-[#1A1A1A]'
              }`}
            >
              <span className="font-serif text-sm mr-3 text-[#A3A39E]">III.</span>
              <span className="flex-1 text-left">Client Reviews</span>
              <MessageSquare className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </nav>
        </div>

        <div className="pt-8 border-t border-[#E5E5E0]">
          <p className="text-[10px] text-[#A3A39E] tracking-wider uppercase">
            Edition 2026 / V2.04
          </p>
        </div>
      </aside>

      {/* ------------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA                                                   */}
      {/* ------------------------------------------------------------------- */}
      <main className="flex-1 overflow-y-auto p-12 lg:p-16">

        {/* =================================================================== */}
        {/* TAB I: 3D CATALOG & CAMERA                                          */}
        {/* =================================================================== */}
        {activeTab === 'I' && (
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="border-b border-[#E5E5E0] pb-6 flex justify-between items-end">
              <div>
                <span className="text-xs font-serif text-[#A3A39E] tracking-widest">SECTION I</span>
                <h2 className="font-serif text-3xl font-light text-[#1A1A1A] tracking-wide mt-1">
                  Collection Gallery & Virtual Studio
                </h2>
              </div>
              <p className="text-xs text-[#737370] tracking-widest uppercase">
                {garments.length} Active Renderings
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-8 bg-[#F2F2EE] border border-[#E5E5E0] p-8 flex flex-col justify-between h-[560px] relative">
                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-[#737370]">
                      {garments[selectedGarment].code}
                    </span>
                    <h3 className="font-serif text-xl font-normal text-[#1A1A1A]">
                      {garments[selectedGarment].name}
                    </h3>
                  </div>
                  <span className="text-[10px] tracking-widest uppercase border border-[#2A2A2A] px-2.5 py-1 text-[#2A2A2A]">
                    Interactive Canvas
                  </span>
                </div>

                <div className="absolute inset-0 p-8 flex items-center justify-center">
                  <img 
                    src={garments[selectedGarment].img} 
                    alt={garments[selectedGarment].name}
                    className="max-h-full max-w-full object-contain grayscale opacity-90 contrast-105 transition-all duration-500 ease-out"
                  />
                </div>

                <div className="z-10 bg-[#FBFBFA]/90 backdrop-blur-sm border border-[#E5E5E0] p-2 flex items-center justify-between self-center gap-6">
                  <button 
                    onClick={() => handleCameraAction('Rotate Left')}
                    className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#737370] hover:text-[#1A1A1A] transition-colors px-3 py-1.5"
                  >
                    <RotateCw className="w-3 h-3 transform -scale-x-100" />
                    <span>Orbit L</span>
                  </button>
                  <span className="text-[#E5E5E0]">|</span>
                  <button 
                    onClick={() => handleCameraAction('Zoom In')}
                    className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#737370] hover:text-[#1A1A1A] transition-colors px-3 py-1.5"
                  >
                    <ZoomIn className="w-3 h-3" />
                    <span>Zoom In</span>
                  </button>
                  <span className="text-[#E5E5E0]">|</span>
                  <button 
                    onClick={() => handleCameraAction('Zoom Out')}
                    className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#737370] hover:text-[#1A1A1A] transition-colors px-3 py-1.5"
                  >
                    <ZoomOut className="w-3 h-3" />
                    <span>Zoom Out</span>
                  </button>
                  <span className="text-[#E5E5E0]">|</span>
                  <button 
                    onClick={() => handleCameraAction('Reset')}
                    className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#737370] hover:text-[#1A1A1A] transition-colors px-3 py-1.5"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Reset View</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <p className="text-xs uppercase tracking-widest text-[#737370] mb-2 font-medium">
                  Select Garment
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {garments.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedGarment(idx)}
                      className={`text-left border transition-all p-3 group bg-[#FBFBFA] ${
                        selectedGarment === idx 
                          ? 'border-[#1A1A1A]' 
                          : 'border-[#E5E5E0] hover:border-[#A3A39E]'
                      }`}
                    >
                      <div className="aspect-[3/4] bg-[#F2F2EE] mb-3 overflow-hidden">
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <p className="text-[10px] tracking-widest uppercase text-[#737370]">{item.code}</p>
                      <p className="font-serif text-sm font-normal text-[#1A1A1A] truncate">{item.name}</p>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB II: INTERACTIVE PACKAGE TRACKER MAP                             */}
        {/* =================================================================== */}
        {activeTab === 'II' && (
          <div className="max-w-5xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="border-b border-[#E5E5E0] pb-6 flex justify-between items-end">
              <div>
                <span className="text-xs font-serif text-[#A3A39E] tracking-widest">SECTION II</span>
                <h2 className="font-serif text-3xl font-light text-[#1A1A1A] tracking-wide mt-1">
                  Logistics & Real-Time Track
                </h2>
              </div>
              <p className="text-xs text-[#737370] tracking-widest uppercase">
                WAYBILL: #882-9012-LX
              </p>
            </div>

            <div className="bg-[#F2F2EE] border border-[#E5E5E0] p-8 space-y-8">
              
              {/* Delivery Meta Summary */}
              <div className="flex flex-wrap justify-between items-center pb-6 border-b border-[#E5E5E0] gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#737370]">Current Location</span>
                  <p className="font-serif text-xl text-[#1A1A1A] mt-0.5">
                    {waypoints[selectedWaypoint].city} — {waypoints[selectedWaypoint].title}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest text-[#737370]">Coordinates</span>
                  <p className="font-mono text-xs text-[#2A2A2A] mt-1">{waypoints[selectedWaypoint].coords}</p>
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* INTERACTIVE VECTOR MAP CONTAINER                            */}
              {/* ----------------------------------------------------------- */}
              <div className="h-80 border border-[#E5E5E0] bg-[#FBFBFA] relative overflow-hidden flex flex-col justify-between p-6">
                
                {/* Background Grid Lines (Map Cartography aesthetic) */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e0_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30"></div>
                
                {/* Map Overlay Controls */}
                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex items-center gap-2 bg-[#FBFBFA]/90 border border-[#E5E5E0] px-3 py-1.5 backdrop-blur-sm">
                    <Navigation className="w-3 h-3 text-[#1A1A1A]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#1A1A1A] font-medium">Live GPS Feed</span>
                  </div>
                  
                  <div className="bg-[#FBFBFA]/90 border border-[#E5E5E0] text-[10px] uppercase tracking-widest text-[#737370] px-3 py-1.5 backdrop-blur-sm">
                    Route: MXP ➔ CDG ➔ LHR ➔ JFK
                  </div>
                </div>

                {/* SVG Route Curve & Interactive Location Nodes */}
                <div className="relative z-10 my-auto w-full px-12">
                  <svg className="w-full h-24 overflow-visible" viewBox="0 0 800 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Background Transit Line */}
                    <path d="M 50 50 Q 250 10, 400 50 T 750 50" stroke="#E5E5E0" strokeWidth="2" strokeDasharray="4 4" />
                    
                    {/* Active Transit Path Segment */}
                    <path d="M 50 50 Q 250 10, 400 50" stroke="#1A1A1A" strokeWidth="1.5" />

                    {/* Nodes along the path */}
                    {[
                      { cx: 50, cy: 50, idx: 0 },
                      { cx: 280, cy: 26, idx: 1 },
                      { cx: 520, cy: 42, idx: 2 },
                      { cx: 750, cy: 50, idx: 3 }
                    ].map((node) => (
                      <g 
                        key={node.idx} 
                        onClick={() => setSelectedWaypoint(node.idx)} 
                        className="cursor-pointer group"
                      >
                        {/* Node Halo for Active Step */}
                        {selectedWaypoint === node.idx && (
                          <circle cx={node.cx} cy={node.cy} r="14" className="fill-none stroke-[#1A1A1A] stroke-1 animate-ping opacity-25" />
                        )}
                        <circle 
                          cx={node.cx} 
                          cy={node.cy} 
                          r={selectedWaypoint === node.idx ? "6" : "4"} 
                          className={`${
                            node.idx <= 1 ? 'fill-[#1A1A1A]' : 'fill-[#FBFBFA] stroke-[#A3A39E] stroke-2'
                          } transition-all duration-300 group-hover:scale-125`} 
                        />
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Interactive Map Waypoint Selector Bar */}
                <div className="relative z-10 grid grid-cols-4 gap-2 pt-4 border-t border-[#E5E5E0]">
                  {waypoints.map((wp) => (
                    <button
                      key={wp.id}
                      onClick={() => setSelectedWaypoint(wp.id)}
                      className={`text-left p-2.5 transition-colors border ${
                        selectedWaypoint === wp.id
                          ? 'border-[#1A1A1A] bg-[#FBFBFA]'
                          : 'border-transparent hover:border-[#E5E5E0]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <MapPin className={`w-3 h-3 ${selectedWaypoint === wp.id ? 'text-[#1A1A1A]' : 'text-[#A3A39E]'}`} />
                        <span className="text-[10px] uppercase tracking-wider font-medium text-[#1A1A1A]">
                          {wp.city}
                        </span>
                      </div>
                      <p className="text-[9px] text-[#737370] truncate mt-0.5">{wp.title}</p>
                    </button>
                  ))}
                </div>

              </div>

              {/* Waypoint Details Timeline */}
              <div className="space-y-6 max-w-2xl mx-auto pt-2">
                {waypoints.map((wp) => (
                  <div key={wp.id} className={`flex gap-6 items-start transition-opacity ${selectedWaypoint === wp.id ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="w-28 text-right pt-0.5">
                      <span className="text-[10px] font-mono text-[#737370]">{wp.time}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full ${wp.id <= 1 ? 'bg-[#1A1A1A]' : 'border border-[#A3A39E] bg-[#FBFBFA]'}`} />
                      {wp.id < waypoints.length - 1 && <div className="w-[1px] h-10 bg-[#E5E5E0]" />}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#1A1A1A] font-medium">{wp.title} — {wp.city}</p>
                      <p className="text-xs text-[#737370] font-light mt-0.5">Status: {wp.status}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB III: REVIEWS & RATINGS                                         */}
        {/* =================================================================== */}
        {activeTab === 'III' && (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="border-b border-[#E5E5E0] pb-6 flex justify-between items-end">
              <div>
                <span className="text-xs font-serif text-[#A3A39E] tracking-widest">SECTION III</span>
                <h2 className="font-serif text-3xl font-light text-[#1A1A1A] tracking-wide mt-1">
                  Client Evaluations & Feedback
                </h2>
              </div>
              <p className="text-xs text-[#737370] tracking-widest uppercase">
                {reviews.length} Submissions
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="border border-[#E5E5E0] bg-[#FBFBFA] p-8 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-[#1A1A1A] font-medium">
                  Submit Assessment
                </span>
                
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star 
                        className={`w-4 h-4 transition-colors ${
                          star <= rating 
                            ? 'fill-[#2A2A2A] stroke-[#2A2A2A]' 
                            : 'fill-transparent stroke-[#A3A39E]'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience regarding fabric drape, fit accuracy, or digital presentation..."
                className="w-full bg-[#F2F2EE] border border-[#E5E5E0] p-4 text-xs text-[#1A1A1A] placeholder-[#A3A39E] focus:outline-none focus:border-[#1A1A1A] resize-none transition-colors"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#1A1A1A] text-[#FBFBFA] px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-[#2A2A2A] transition-colors"
                >
                  <span>Submit Review</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>

            <div className="space-y-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="border-b border-[#E5E5E0] pb-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-base text-[#1A1A1A]">{rev.author}</span>
                      <span className="text-[10px] text-[#A3A39E] tracking-widest">•</span>
                      <span className="text-[10px] tracking-widest text-[#737370] uppercase">{rev.date}</span>
                    </div>
                    
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`w-3 h-3 ${
                            s <= rev.rating 
                              ? 'fill-[#2A2A2A] stroke-[#2A2A2A]' 
                              : 'fill-transparent stroke-[#E5E5E0]'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-[#2A2A2A] leading-relaxed font-light">
                    "{rev.text}"
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}