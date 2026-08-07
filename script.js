/**
 * Atelier Global - Core App Logic with Section 4 Customer Checkout
 */

const AppState = {
  isStageApproved: false,
  minimumLeadDays: 14,
  selectedDressName: "Custom Silk Satin Prom Dress",
  selectedFabricPrice: 220,
  selectedBeadingPrice: 180,
  protectionFee: 40,
  totalPrice: 440,
  webcamStream: null,
  isCameraActive: false
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
      showError(`Unable to locate tab section: ${tabName}`);
    }
  } catch (err) {
    console.error("Tab Navigation Error:", err);
    showError("Could not switch section view.");
  }
}

// Customizer & Pricing Calculation Engine
function updateCustomizer() {
  hideError();
  try {
    const fabricSelect = document.getElementById('fabric');
    const beadingSelect = document.getElementById('beading');

    if (!fabricSelect || !beadingSelect) return;

    const selectedFabricOpt = fabricSelect.options[fabricSelect.selectedIndex];
    const selectedBeadingOpt = beadingSelect.options[beadingSelect.selectedIndex];

    AppState.selectedFabricPrice = parseFloat(selectedFabricOpt?.getAttribute('data-price')) || 220;
    AppState.selectedBeadingPrice = parseFloat(selectedBeadingOpt?.getAttribute('data-price')) || 180;
    AppState.selectedDressName = `Custom ${selectedFabricOpt.value} Prom Dress`;
    
    AppState.totalPrice = AppState.selectedFabricPrice + AppState.selectedBeadingPrice + AppState.protectionFee;

    // Update Visual Labels
    document.getElementById('lbl-fabric').innerText = selectedFabricOpt?.value || 'Silk Satin';
    document.getElementById('lbl-beading').innerText = selectedBeadingOpt?.value || 'Heavy Crystal';

    // Update Customizer Section Prices
    document.getElementById('price-fabric').innerText = `$${AppState.selectedFabricPrice.toFixed(2)}`;
    document.getElementById('price-beading').innerText = `$${AppState.selectedBeadingPrice.toFixed(2)}`;
    document.getElementById('price-total').innerText = `$${AppState.totalPrice.toFixed(2)}`;

    // Sync Section 4 Checkout Summary
    syncCheckoutPricing();
  } catch (err) {
    console.error("Customizer error:", err);
    showError("Could not update customizer pricing.");
  }
}

function setColor(swatchBtn, hexCode) {
  const gownBase = document.getElementById('gown-base');
  if (gownBase) gownBase.style.backgroundColor = hexCode;
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  if (swatchBtn) swatchBtn.classList.add('active');
}

function validatePromDate() {
  const dateInput = document.getElementById('prom-date');
  const dateHint = document.getElementById('date-hint');
  hideError();

  if (!dateInput || !dateInput.value) return false;

  const selectedDate = new Date(dateInput.value);
  const today = new Date();
  const diffDays = Math.ceil((selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (isNaN(diffDays) || diffDays < AppState.minimumLeadDays) {
    if (dateHint) {
      dateHint.innerText = `Error: At least ${AppState.minimumLeadDays} days required for production.`;
      dateHint.style.color = 'var(--error-red)';
    }
    showError(`Selected event date is too soon! Minimum ${AppState.minimumLeadDays} days required.`);
    return false;
  }

  if (dateHint) {
    dateHint.innerText = `Confirmed: ${diffDays} days available for artisan tailoring.`;
    dateHint.style.color = 'var(--text-muted)';
  }
  return true;
}

// Clearance Gown Actions
function buyClearance(gownName, price) {
  AppState.selectedDressName = gownName;
  AppState.selectedFabricPrice = price;
  AppState.selectedBeadingPrice = 0;
  AppState.totalPrice = price;

  syncCheckoutPricing();
  alert(`✨ Selected: ${gownName} ($${price.toFixed(2)}). Moving to Section 4 Customer Checkout...`);
  switchTab('checkout');
}

function proceedToCheckout() {
  if (!validatePromDate()) return;
  updateCustomizer();
  switchTab('checkout');
}

// Sync Section 4 Checkout Pricing & Installments
function syncCheckoutPricing() {
  const subtotal = AppState.selectedFabricPrice + AppState.selectedBeadingPrice;
  
  document.getElementById('summary-item-name').innerText = AppState.selectedDressName;
  document.getElementById('summary-subtotal').innerText = `$${subtotal.toFixed(2)}`;
  document.getElementById('summary-protection').innerText = `$${AppState.protectionFee.toFixed(2)}`;
  document.getElementById('summary-total').innerText = `$${AppState.totalPrice.toFixed(2)}`;

  const installmentAmount = (AppState.totalPrice / 4).toFixed(2);
  document.getElementById('installment-amount').innerText = `$${installmentAmount}`;
}

function updatePaymentPlanDisplay() {
  const plan = document.getElementById('payment-plan').value;
  const installmentNote = document.getElementById('installment-note');
  const btnPayNow = document.getElementById('btn-pay-now');

  if (plan === 'installments') {
    installmentNote.classList.remove('hidden');
    const firstPayment = (AppState.totalPrice / 4).toFixed(2);
    btnPayNow.innerText = `Authorize 1st Installment ($${firstPayment}) & Start Order`;
  } else {
    installmentNote.classList.add('hidden');
    btnPayNow.innerText = `Complete Checkout & Authorize Escrow ($${AppState.totalPrice.toFixed(2)})`;
  }
}

// Process Section 4 Checkout Payment
function processCheckoutPayment() {
  hideError();

  const name = document.getElementById('chk-name').value.trim();
  const email = document.getElementById('chk-email').value.trim();
  const address = document.getElementById('chk-address').value.trim();
  const cardNum = document.getElementById('card-num').value.trim();

  if (!name || !email || !address) {
    showError("Please complete all required customer shipping details.");
    return;
  }

  if (cardNum.length < 12) {
    showError("Please enter a valid card number.");
    return;
  }

  alert(`🔒 Section 4 Customer Checkout Successful!\n\nYour payment of $${AppState.totalPrice.toFixed(2)} is securely locked in Escrow. Your gown order is now sent to master artisan production!`);
  switchTab('tracker');
  document.getElementById('shipment-progress').style.width = '75%';
}

// Camera Verification (Steps 2 & 3)
async function toggleCamera() {
  hideError();
  const video = document.getElementById('webcam-video');
  const canvas = document.getElementById('snapshot-canvas');
  const placeholder = document.getElementById('camera-placeholder');
  const btnToggle = document.getElementById('btn-toggle-cam');
  const btnSnap = document.getElementById('btn-snap');
  const badge = document.getElementById('camera-status-badge');

  if (AppState.isCameraActive) {
    if (AppState.webcamStream) {
      AppState.webcamStream.getTracks().forEach(track => track.stop());
    }
    AppState.isCameraActive = false;
    video.classList.add('hidden');
    canvas.classList.add('hidden');
    placeholder.classList.remove('hidden');
    btnToggle.innerText = "Start Live Camera";
    btnSnap.disabled = true;
    badge.innerText = "Camera Inactive";
    badge.classList.remove('active');
    return;
  }

  try {
    AppState.webcamStream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false
    });

    video.srcObject = AppState.webcamStream;
    video.classList.remove('hidden');
    placeholder.classList.add('hidden');
    canvas.classList.add('hidden');

    AppState.isCameraActive = true;
    btnToggle.innerText = "Stop Camera";
    btnSnap.disabled = false;
    badge.innerText = "Camera Live";
    badge.classList.add('active');
  } catch (err) {
    console.error("Camera access error:", err);
    showError("Could not access camera. Please allow permissions or upload a fit photo instead.");
  }
}

function takeSnapshot() {
  const video = document.getElementById('webcam-video');
  const canvas = document.getElementById('snapshot-canvas');

  if (!AppState.isCameraActive || !video) {
    showError("Camera feed is inactive.");
    return;
  }

  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  video.classList.add('hidden');
  canvas.classList.remove('hidden');

  alert("📷 Fitting Snapshot Captured! Submitted to Master Artisan Elena for Step 2 & 3 fit inspection.");
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    alert(`📁 Fitting file "${file.name}" uploaded successfully.`);
  }
}

// Milestone Approval
function approveMilestone() {
  hideError();

  if (AppState.isStageApproved) {
    showError("Step 2 & 3 fitting is already verified.");
    return;
  }

  AppState.isStageApproved = true;
  document.getElementById('btn-approve').disabled = true;
  document.getElementById('btn-revision').disabled = true;

  const statusMsg = document.getElementById('stage-status-msg');
  statusMsg.innerText = "✓ Steps 2 & 3 Verified! Proceeding to Section 4 Customer Checkout...";
  statusMsg.className = "status-msg success";

  document.getElementById('step-2').classList.add('completed');
  document.getElementById('step-3').classList.add('completed');
  document.getElementById('step-4').classList.add('active');

  setTimeout(() => {
    switchTab('checkout');
  }, 1000);
}

function requestRevision() {
  hideError();
  const feedback = prompt("Specify required fit adjustment for your tailor:");
  if (feedback && feedback.trim() !== "") {
    switchTab('tracker');
    appendChatMessage("User (Fit Modification Request)", feedback.trim(), "msg-user");
  }
}

// Tailor Chat
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
    appendChatMessage("Atelier Elena", "Thank you! I have updated your order notes.", "msg-artisan");
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
  const promDateInput = document.getElementById('prom-date');
  if (promDateInput) {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    promDateInput.value = defaultDate.toISOString().split('T')[0];
  }
  updateCustomizer();
};