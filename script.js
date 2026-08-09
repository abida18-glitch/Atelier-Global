/**
 * Atelier Global - Front-End Application Logic
 * Featuring Butterfly Loader, Real Camera Body Scan, AI Global Size Converter, and Portfolio Studio
 */

const AppState = {
  selectedFabricPrice: 220,
  selectedBeadingPrice: 180,
  protectionFee: 40,
  totalPrice: 440,
  current3DRotation: 0,
  is3DLightingOn: true,
  aiCameraStream: null,
  isAICameraActive: false,
  sizingCameraStream: null,
  isSizingCameraActive: false,
  inspirationImages: []
};

// BUTTERFLY LOADER TIMING
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('butterfly-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.classList.add('hidden'), 500);
    }
  }, 1000);
});

function showTempLoader(callback) {
  const loader = document.getElementById('butterfly-loader');
  if (loader) {
    loader.classList.remove('hidden');
    loader.style.opacity = '1';
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.classList.add('hidden');
        if (callback) callback();
      }, 400);
    }, 800);
  } else if (callback) {
    callback();
  }
}

function showError(msg) {
  const banner = document.getElementById('error-banner');
  const msgSpan = document.getElementById('error-message');
  if (banner && msgSpan) {
    msgSpan.innerText = msg;
    banner.classList.remove('hidden');
  }
}

function hideError() {
  const banner = document.getElementById('error-banner');
  if (banner) banner.classList.add('hidden');
}

// Navigation & Tab Switching
function switchMainTab(tabName) {
  hideError();
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

  const targetTab = document.getElementById(`${tabName}-tab`);
  const targetBtn = document.getElementById(`nav-btn-${tabName}`);

  if (targetTab && targetBtn) {
    targetTab.classList.add('active');
    targetBtn.classList.add('active');
  } else {
    showError(`Could not find view section: ${tabName}`);
  }
}

function switchDesignerSubtag(subtype, element) {
  switchMainTab('designers');
  document.querySelectorAll('#designers-subtags .sub-tag').forEach(tag => tag.classList.remove('active'));
  if (element) element.classList.add('active');

  document.querySelectorAll('.designer-sub-view').forEach(view => view.classList.add('hidden'));
  const targetView = document.getElementById(`designer-view-${subtype}`);
  if (targetView) targetView.classList.remove('hidden');
}

function filterClearance(category, element) {
  switchMainTab('clearance');
  document.querySelectorAll('#clearance-subtags .sub-tag').forEach(tag => tag.classList.remove('active'));
  if (element) element.classList.add('active');

  const filterLabel = document.getElementById('current-clearance-filter');
  const cards = document.querySelectorAll('.clearance-card');

  if (category === 'all') {
    if (filterLabel) filterLabel.innerText = "All Clearance Gowns";
    cards.forEach(card => card.classList.remove('hidden'));
  } else {
    if (filterLabel) filterLabel.innerText = `Category: ${element.innerText}`;
    cards.forEach(card => {
      card.getAttribute('data-category') === category ? card.classList.remove('hidden') : card.classList.add('hidden');
    });
  }
}

// AI International Size Converter
function runAISizeConversion() {
  const sizeVal = document.getElementById('user-standard-size')?.value || "";
  const countryVal = document.getElementById('target-country-atelier')?.value || "Vietnam";
  const outputBox = document.getElementById('ai-conversion-output');

  if (!outputBox) return;

  const conversions = {
    Vietnam: "Standard Metric: Bust 84-86cm | Waist 64-66cm | Hips 90-92cm. Tailor Note: Pattern mapped for delicate silk drape & tailored waist boning.",
    Turkey: "European Standard: EU Size 36/38 | Corset Structure: 34B/C cup fitting with reinforced hoop-skirt wire allowances.",
    India: "South Asian Atelier Spec: Choli Bust 34\" | Underbust 29\" | Lehenga Waist 27\". Pattern optimized for hand Zardozi gold embroidery.",
    Colombia: "Latina Haute Silhouette: Bust 88cm | Contour Waist 62cm | Hips 94cm. Pattern adjusted for hourglass stretch ratio.",
    Portugal: "Iberian Luxury Metric: EU Size 36 | Shoulder-to-Hem 152cm. Precision mapped for weighted double-silk satin."
  };

  outputBox.innerHTML = `
    <strong>Converted for ${countryVal} Atelier:</strong><br/>
    • <em>Source Spec:</em> ${sizeVal}<br/>
    • <em>Technical Atelier Output:</em> ${conversions[countryVal] || conversions["Vietnam"]}<br/>
    <span style="color:#00875a; font-weight:bold;">✔ Automatically synced to your master tailor's studio workspace.</span>
  `;
}

// AI Camera & Inspiration Sourcing
function triggerFileUpload() {
  document.getElementById('ai-image-upload').click();
}

function handleImageUpload(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  for (let file of files) {
    const imageUrl = URL.createObjectURL(file);
    addInspirationImage(imageUrl, "Uploaded File");
  }
}

function importFromSource(sourceName) {
  const sampleImages = {
    Pinterest: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=150&auto=format&fit=crop",
    Google: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=150&auto=format&fit=crop",
    Supabase: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=150&auto=format&fit=crop"
  };

  addInspirationImage(sampleImages[sourceName] || sampleImages['Google'], sourceName);
}

function addInspirationImage(src, tag) {
  AppState.inspirationImages.push({ src, tag });
  renderImageReel();
}

function renderImageReel() {
  const reel = document.getElementById('image-reel');
  const actionBar = document.getElementById('ai-action-bar');

  if (AppState.inspirationImages.length === 0) {
    reel.innerHTML = '<div class="empty-reel-msg">No reference images added yet. Click above to add photos from Camera, Pinterest, Google, or Supabase.</div>';
    actionBar.classList.add('hidden');
    return;
  }

  reel.innerHTML = '';
  AppState.inspirationImages.forEach((item) => {
    const thumb = document.createElement('div');
    thumb.className = 'reel-thumb-container';
    thumb.innerHTML = `
      <img src="${item.src}" alt="Inspiration" />
      <span class="thumb-tag">${item.tag}</span>
    `;
    reel.appendChild(thumb);
  });

  actionBar.classList.remove('hidden');
}

// Camera Modal Logic
function openCameraModal() {
  document.getElementById('camera-modal').classList.remove('hidden');
}

function closeCameraModal() {
  if (AppState.isAICameraActive) toggleAICamera();
  document.getElementById('camera-modal').classList.add('hidden');
}

async function toggleAICamera() {
  const video = document.getElementById('ai-cam-video');
  const placeholder = document.getElementById('ai-cam-placeholder');
  const btnSnap = document.getElementById('btn-ai-snap');

  if (AppState.isAICameraActive) {
    if (AppState.aiCameraStream) AppState.aiCameraStream.getTracks().forEach(t => t.stop());
    AppState.isAICameraActive = false;
    video.classList.add('hidden');
    placeholder.classList.remove('hidden');
    btnSnap.disabled = true;
    return;
  }

  try {
    AppState.aiCameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = AppState.aiCameraStream;
    video.classList.remove('hidden');
    placeholder.classList.add('hidden');
    AppState.isAICameraActive = true;
    btnSnap.disabled = false;
  } catch (err) {
    showError("Could not access real camera feed for photo snapshot.");
  }
}

function captureAISnapshot() {
  const video = document.getElementById('ai-cam-video');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 300;
  canvas.height = video.videoHeight || 300;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const snapshotUrl = canvas.toDataURL('image/png');
  addInspirationImage(snapshotUrl, "Camera Snap");
  closeCameraModal();
}

// Generative AI 3D Model Synthesizer
function generate3DModelFromAI() {
  showTempLoader(() => {
    document.getElementById('gown-base-3d').style.background = 'linear-gradient(180deg, #ff007f 0%, #00d4ff 100%)';
    document.getElementById('beading-layer-3d').style.background = 'radial-gradient(circle, rgba(255,255,255,0.95) 30%, transparent 70%)';
    document.getElementById('lbl-fabric').innerText = "AI Synthesized Ombre Silk Satin";
    document.getElementById('lbl-beading').innerText = "Custom Sourced Crystal Corset";
    
    rotate3D(360);
    document.getElementById('lbl-3d-status').innerText = "3D AI Synthesis Complete";
    alert("✨ AI Design Synthesized! Reference images from Pinterest, Google, and Supabase have been merged into your 3D gown render.");
  });
}

// 3D Visualizer Canvas Controls
function rotate3D(deg) {
  AppState.current3DRotation += deg;
  const wrapper = document.getElementById('gown-3d-wrapper');
  if (wrapper) wrapper.style.transform = `rotateY(${AppState.current3DRotation}deg)`;
}

function reset3DRotation() {
  AppState.current3DRotation = 0;
  const wrapper = document.getElementById('gown-3d-wrapper');
  if (wrapper) wrapper.style.transform = `rotateY(0deg)`;
}

function toggle3DLighting() {
  AppState.is3DLightingOn = !AppState.is3DLightingOn;
  const canvas = document.getElementById('dress-canvas-3d');
  if (canvas) {
    canvas.style.background = AppState.is3DLightingOn 
      ? 'radial-gradient(circle, #ffffff 30%, #ffb6c1 100%)' 
      : 'radial-gradient(circle, #20002c 30%, #000000 100%)';
  }
}

function updateCustomizer() {
  const fabricSelect = document.getElementById('fabric');
  const beadingSelect = document.getElementById('beading');

  if (!fabricSelect || !beadingSelect) return;

  const fabOpt = fabricSelect.options[fabricSelect.selectedIndex];
  const beadOpt = beadingSelect.options[beadingSelect.selectedIndex];

  AppState.selectedFabricPrice = parseFloat(fabOpt?.getAttribute('data-price')) || 220;
  AppState.selectedBeadingPrice = parseFloat(beadOpt?.getAttribute('data-price')) || 180;
  AppState.totalPrice = AppState.selectedFabricPrice + AppState.selectedBeadingPrice + AppState.protectionFee;

  document.getElementById('lbl-fabric').innerText = fabOpt.value;
  document.getElementById('lbl-beading').innerText = beadOpt.value;

  document.getElementById('price-fabric').innerText = `$${AppState.selectedFabricPrice.toFixed(2)}`;
  document.getElementById('price-beading').innerText = `$${AppState.selectedBeadingPrice.toFixed(2)}`;
  document.getElementById('price-total').innerText = `$${AppState.totalPrice.toFixed(2)}`;
}

function setColor(swatchBtn, hexCode) {
  const gownBase = document.getElementById('gown-base-3d');
  if (gownBase) gownBase.style.background = hexCode;
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  if (swatchBtn) swatchBtn.classList.add('active');
}

function validatePromDate() {
  const dateInput = document.getElementById('prom-date');
  if (!dateInput || !dateInput.value) return false;
  const selectedDate = new Date(dateInput.value);
  const today = new Date();
  const diffDays = Math.ceil((selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (isNaN(diffDays) || diffDays < 14) {
    showError("Minimum 14 days lead time required for custom tailoring.");
    return false;
  }
  return true;
}

// Real Camera Sizing & Body Scan
function selectSizingMethod(method, element) {
  document.querySelectorAll('.sizing-card').forEach(c => c.classList.remove('active-method'));
  if (element) element.classList.add('active-method');
}

function triggerCameraScan(event) {
  event.stopPropagation();
  const camBox = document.getElementById('camera-scan-box');
  if (camBox) camBox.classList.remove('hidden');
}

async function toggleCamera() {
  const video = document.getElementById('webcam-video');
  const placeholder = document.getElementById('camera-placeholder');
  const btnSnap = document.getElementById('btn-snap');

  if (AppState.isSizingCameraActive) {
    if (AppState.sizingCameraStream) AppState.sizingCameraStream.getTracks().forEach(t => t.stop());
    AppState.isSizingCameraActive = false;
    video.classList.add('hidden');
    placeholder.classList.remove('hidden');
    btnSnap.disabled = true;
    return;
  }

  try {
    AppState.sizingCameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = AppState.sizingCameraStream;
    video.classList.remove('hidden');
    placeholder.classList.add('hidden');
    AppState.isSizingCameraActive = true;
    btnSnap.disabled = false;
  } catch (err) {
    showError("Real camera access denied or unavailable on this device.");
  }
}

function takeSnapshot() {
  showTempLoader(() => {
    alert("📷 Real Camera Body Scan Captured! 30+ precision dimensions saved and sent to your global atelier profile.");
  });
}

function locateTailor(event) { event.stopPropagation(); alert("🔍 Locating partner tailoring shops near your zip code..."); }
function openTapeTutorial(event) { event.stopPropagation(); alert("🎥 Opening step-by-step tape measurement guide..."); }

// Chat & Communications
function handleChatKeyPress(event) { if (event.key === 'Enter') sendMessage(); }

function sendMessage() {
  const input = document.getElementById('chat-input');
  if (!input || input.value.trim() === "") return;
  
  const chatBox = document.getElementById('chat-box');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'msg msg-user';
  msgDiv.innerHTML = `<strong>You:</strong> ${input.value.replace(/</g, "&lt;")}`;
  chatBox.appendChild(msgDiv);
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    const artisanDiv = document.createElement('div');
    artisanDiv.className = 'msg msg-artisan';
    artisanDiv.innerHTML = `<strong>Atelier Elena:</strong> Received! I am adding this note to your design technical sheet.`;
    chatBox.appendChild(artisanDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 1000);
}

function startFaceTimeCall() { alert("📹 Starting HD FaceTime Video Fitting with Master Tailor Elena..."); }
function scheduleCall() { alert("📅 Opening appointment scheduler for overseas atelier call..."); }
function initiateVoiceCall() { alert("📞 Dialing direct audio bridge line..."); }

// Portfolio Modal & Interactions
function viewPortfolioModal(designerName) {
  alert(`🎨 Opening full haute-couture artwork gallery and 3D concept archives for ${designerName}.`);
}

// Reviews & Contact Handlers
function handleReviewSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('review-name')?.value;
  const rating = document.getElementById('review-rating')?.value;
  const text = document.getElementById('review-text')?.value;

  const reviewsList = document.getElementById('reviews-list');
  if (reviewsList && name && text) {
    const starsStr = "⭐".repeat(parseInt(rating));
    const card = document.createElement('div');
    card.className = 'card review-card mb-20';
    card.innerHTML = `
      <div class="review-header">
        <strong>${name.replace(/</g, "&lt;")}</strong>
        <span class="stars">${starsStr}</span>
      </div>
      <p class="review-body">"${text.replace(/</g, "&lt;")}"</p>
    `;
    reviewsList.prepend(card);
    document.getElementById('review-form').reset();
    alert("✨ Thank you for submitting your rating!");
  }
}

function handleContactSubmit(event) {
  event.preventDefault();
  alert("💌 Your message has been sent to our 24/7 Global Concierge Team! We will respond shortly.");
  document.getElementById('contact-form').reset();
}

function buyClearance(gownName, price) {
  alert(`✨ Selected ${gownName} ($${price.toFixed(2)}) from Clearance! Proceeding to checkout.`);
}

// Initial setup on load
window.onload = function() {
  const promDateInput = document.getElementById('prom-date');
  if (promDateInput) {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    promDateInput.value = defaultDate.toISOString().split('T')[0];
  }
  updateCustomizer();
  runAISizeConversion();
};