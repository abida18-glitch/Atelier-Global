/**
 * Atelier Global - Comprehensive Customizer, Clearance, Checkout, Camera QA & Tracker
 */

const AppState = {
  isStageApproved: false,
  minimumLeadDays: 14,
  selectedDressName: "Custom Prom Dress",
  selectedTotalPrice: 440,
  webcamStream: null
};

function showError(message) {
  const banner = document.getElementById('error-banner');
  const msgSpan = document.getElementById('error-message');
  if (banner && msgSpan) {
    msgSpan.innerText = message;
    banner.classList.remove('hidden');
  }
}

function hideError() {
  const banner = document.getElementById('error-banner');
  if (banner) banner.classList.add('hidden');
}

function switchTab(tabName) {
  try {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.nav-btn');

    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));

    const targetTab = document.getElementById(`${tabName}-tab`);
    const targetBtn = document.getElementById(`nav-btn-${tabName}`);

    if (targetTab && targetBtn) {
      targetTab.classList.add('active');
      targetBtn.classList.add('active');
    } else {
      showError(`Unable to switch to tab: ${tabName}`);
    }
  } catch (err) {
    console.error("Tab error:", err);
    showError("Error switching view tabs.");
  }
}

// Live Customizer
function updateCustomizer() {
  hideError();
  try {
    const fabricSelect = document.getElementById('fabric');
    const beadingSelect = document.getElementById('beading');

    if (!fabricSelect || !beadingSelect) return;

    const selectedFabricOpt = fabricSelect.options[fabricSelect.selectedIndex];
    const selectedBeadingOpt = beadingSelect.options[beadingSelect.selectedIndex];

    const fabricPrice = parseFloat(selectedFabricOpt?.getAttribute('data-price')) || 220;
    const beadingPrice = parseFloat(selectedBeadingOpt?.getAttribute('data-price')) || 180;
    const protectionFee = 40;

    AppState.selectedTotalPrice = fabricPrice + beadingPrice + protectionFee;
    AppState.selectedDressName = `Custom ${selectedFabricOpt.value} Prom Dress`;

    document.getElementById('lbl-fabric').innerText = selectedFabricOpt?.value || 'Silk Satin';
    document.getElementById('lbl-beading').innerText = selectedBeadingOpt?.value || 'Heavy Crystal';

    document.getElementById('price-fabric').innerText = `$${fabricPrice}`;
    document.getElementById('price-beading').innerText = `$${beadingPrice}`;
    document.getElementById('price-total').innerText = `$${AppState.selectedTotalPrice}`;

    // Update Summary
    document.getElementById('summary-item-name').innerText = AppState.selectedDressName;
    document.getElementById('summary-total').innerText = `$${AppState.selectedTotalPrice}`;
  } catch (err) {
    showError("Could not update customizer pricing.");
  }
}

function setColor(swatchBtn, hexCode) {
  const gownBase = document.getElementById('gown-base');
  if (gownBase) gownBase.style.backgroundColor = hexCode;
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  if (swatchBtn) swatchBtn.classList.add('active');
}

// Clearance Action
function buyClearance(gownName, price) {
  AppState.selectedDressName = gownName;
  AppState.selectedTotalPrice = price;

  document.getElementById('summary-item-name').innerText = gownName;
  document.getElementById('summary-total').innerText = `$${price}`;

  alert(`✨ Selected: ${gownName} ($${price}). Redirecting to checkout...`);
  switchTab('checkout');
}

function proceedToCheckout() {
  updateCustomizer();
  switchTab('checkout');
}

function confirmPaymentAndOrder() {
  const name = document.getElementById('chk-name').value.trim();
  const address = document.getElementById('chk-address').value.trim();

  if (!name || !address) {
    showError("Please provide your name and shipping address for escrow protection.");
    return;
  }

  alert(`🔒 Payment Authorized! $${AppState.selectedTotalPrice} is now securely locked in Escrow. Your artisan team has been notified.`);
  switchTab('production');
}

// Live Camera Functionality for Steps 2 & 3
async function startCamera() {
  hideError();
  const video = document.getElementById('webcam-video');
  const placeholder = document.getElementById('camera-placeholder');

  try {
    AppState.webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = AppState.webcamStream;
    video.classList.remove('hidden');
    if (placeholder) placeholder.classList.add('hidden');
  } catch (err) {
    console.error("Camera access error:", err);
    showError("Unable to access camera. Please allow camera permissions or upload a photo file instead.");
  }
}

function takeSnapshot() {
  const video = document.getElementById('webcam-video');
  const canvas = document.getElementById('snapshot-canvas');

  if (!AppState.webcamStream || video.classList.contains('hidden')) {
    showError("Please start the live camera first before taking a snapshot.");
    return;
  }

  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth || 320;
  canvas.height = video.videoHeight || 240;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  video.classList.add('hidden');
  canvas.classList.remove('hidden');

  alert("📷 Snapshot captured! Submitted to artisan for Stage 2/3 fit verification.");
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    alert(`📁 File "${file.name}" uploaded successfully for designer review!`);
  }
}

// Escrow Milestone & Shipment Progress
function approveMilestone() {
  if (AppState.isStageApproved) {
    showError("This stage is already approved.");
    return;
  }

  AppState.isStageApproved = true;
  document.getElementById('btn-approve').disabled = true;
  document.getElementById('btn-revision').disabled = true;

  const statusMsg = document.getElementById('stage-status-msg');
  statusMsg.innerText = "✓ Stage 2 Approved! 25% Escrow Released. Order moved to Express Shipment Track.";
  statusMsg.className = "status-msg success";

  document.getElementById('step-2').classList.remove('active');
  document.getElementById('step-2').classList.add('completed');
  document.getElementById('step-3').classList.add('completed');
  document.getElementById('step-4').classList.add('active');

  // Advance Shipment Tracker Bar to 75%
  document.getElementById('shipment-progress').style.width = '75%';
  alert("✓ Success: Stage approved! Shipment progress updated.");
}

function requestRevision() {
  const feedback = prompt("Specify change for your designer:");
  if (feedback && feedback.trim() !== "") {
    switchTab('chat');
    appendChatMessage("User (Design Change Request)", feedback.trim(), "msg-user");
  }
}

// Chat Handlers
function handleChatKeyPress(event) {
  if (event.key === 'Enter') sendMessage();
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (text === "") return;

  appendChatMessage("You", text, "msg-user");
  input.value = "";
  
  setTimeout(() => {
    appendChatMessage("Atelier Elena", "Got your note! Working on perfecting this for your prom date.", "msg-artisan");
  }, 1200);
}

function appendChatMessage(sender, text, msgClass) {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${msgClass}`;
  const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${safeText}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

window.onload = function() {
  updateCustomizer();
};