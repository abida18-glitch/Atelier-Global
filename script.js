/**
 * Atelier Global - Prom Dress Customizer & Escrow Tracker Logic
 * Includes complete UI validation, fallbacks, and error handling.
 */

// Global State Safeguards
const AppState = {
  isStageApproved: false,
  minimumLeadDays: 14
};

// UI Error Banner Helper
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
  if (banner) {
    banner.classList.add('hidden');
  }
}

// Defensive Tab Navigation
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
    console.error("Tab switching error:", err);
    showError("An unexpected error occurred while switching tabs.");
  }
}

// Live Customizer & Dynamic Pricing Logic with Defensive Fallbacks
function updateCustomizer() {
  hideError();
  try {
    const fabricSelect = document.getElementById('fabric');
    const beadingSelect = document.getElementById('beading');

    if (!fabricSelect || !beadingSelect) {
      throw new Error("Required customization controls missing.");
    }

    const selectedFabricOpt = fabricSelect.options[fabricSelect.selectedIndex];
    const selectedBeadingOpt = beadingSelect.options[beadingSelect.selectedIndex];

    // Safe Numerical Parsing with Fallbacks
    const fabricPrice = parseFloat(selectedFabricOpt?.getAttribute('data-price')) || 220;
    const beadingPrice = parseFloat(selectedBeadingOpt?.getAttribute('data-price')) || 180;
    const protectionFee = 40;

    const totalPrice = fabricPrice + beadingPrice + protectionFee;

    // Safe Label Updates
    const lblFabric = document.getElementById('lbl-fabric');
    const lblBeading = document.getElementById('lbl-beading');
    if (lblFabric) lblFabric.innerText = selectedFabricOpt?.value || 'Silk Satin';
    if (lblBeading) lblBeading.innerText = selectedBeadingOpt?.value || 'Heavy Crystal';

    // Safe Price Display Updates
    document.getElementById('price-fabric').innerText = `$${fabricPrice.toFixed(0)}`;
    document.getElementById('price-beading').innerText = `$${beadingPrice.toFixed(0)}`;
    document.getElementById('price-total').innerText = `$${totalPrice.toFixed(0)}`;

    // Adjust Beading Visualizer Layer Safely
    const beadingLayer = document.getElementById('beading-layer');
    if (beadingLayer && selectedBeadingOpt) {
      const value = selectedBeadingOpt.value;
      if (value.includes('Heavy')) {
        beadingLayer.style.opacity = '0.9';
        beadingLayer.style.backgroundSize = '10px 10px';
      } else if (value.includes('Medium')) {
        beadingLayer.style.opacity = '0.6';
        beadingLayer.style.backgroundSize = '18px 18px';
      } else {
        beadingLayer.style.opacity = '0.3';
        beadingLayer.style.backgroundSize = '24px 24px';
      }
    }
  } catch (err) {
    console.error("Customizer update error:", err);
    showError("Could not update dress preview or total price.");
  }
}

// Color Swatch Selection
function setColor(swatchBtn, hexCode, colorName) {
  try {
    const gownBase = document.getElementById('gown-base');
    if (gownBase) {
      gownBase.style.backgroundColor = hexCode;
    }

    const swatches = document.querySelectorAll('.swatch');
    swatches.forEach(s => s.classList.remove('active'));
    if (swatchBtn) {
      swatchBtn.classList.add('active');
    }
  } catch (err) {
    console.error("Color swatch error:", err);
  }
}

// Date Lead-Time Validation
function validatePromDate() {
  const dateInput = document.getElementById('prom-date');
  const dateHint = document.getElementById('date-hint');
  hideError();

  if (!dateInput || !dateInput.value) {
    if (dateHint) {
      dateHint.innerText = "Please select a valid prom date.";
      dateHint.classList.add('error');
    }
    dateInput.classList.add('input-error');
    return false;
  }

  const selectedDate = new Date(dateInput.value);
  const today = new Date();
  
  // Calculate difference in days
  const diffTime = selectedDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (isNaN(diffDays) || diffDays < AppState.minimumLeadDays) {
    if (dateHint) {
      dateHint.innerText = `Error: Custom artisan dresses require at least ${AppState.minimumLeadDays} days lead time.`;
      dateHint.classList.add('error');
    }
    dateInput.classList.add('input-error');
    showError(`Selected date is too close! We require at least ${AppState.minimumLeadDays} days for tailoring.`);
    return false;
  }

  // Clear Error State
  dateInput.classList.remove('input-error');
  if (dateHint) {
    dateHint.innerText = `Great! ${diffDays} days allows optimal tailor scheduling.`;
    dateHint.classList.remove('error');
  }
  return true;
}

// Order Submission Validation
function submitOrder() {
  hideError();

  if (!validatePromDate()) {
    showError("Please correct your event date before proceeding.");
    return;
  }

  const form = document.getElementById('dress-form');
  if (form && !form.checkValidity()) {
    showError("Please fill out all required customizer selections.");
    return;
  }

  alert("✨ Design Reserved! Your 3D measurement scan invitation link has been sent to your phone. Transitioning to your Live Escrow Tracker...");
  switchTab('production');
}

// Milestone Approval Guard
function approveMilestone() {
  hideError();

  if (AppState.isStageApproved) {
    showError("This milestone has already been approved.");
    return;
  }

  AppState.isStageApproved = true;

  const btnApprove = document.getElementById('btn-approve');
  const btnRevision = document.getElementById('btn-revision');
  const statusMsg = document.getElementById('stage-status-msg');
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');

  if (btnApprove) btnApprove.disabled = true;
  if (btnRevision) btnRevision.disabled = true;

  if (statusMsg) {
    statusMsg.innerText = "✓ Stage 2 Approved! 25% Escrow Released to Master Artisan Elena. Initializing Stage 3.";
    statusMsg.className = "status-msg success";
  }

  if (step2) {
    step2.classList.remove('active');
    step2.classList.add('completed');
  }
  if (step3) {
    step3.classList.add('active');
  }

  alert("✓ Success: Milestone approved! 25% payment unlocked in escrow.");
}

// Revision Request Guard
function requestRevision() {
  hideError();

  if (AppState.isStageApproved) {
    showError("Cannot request revisions for an already approved milestone.");
    return;
  }

  const feedback = prompt("Specify desired modification for your designer (e.g., 'Add more crystals along the lower neckline'):");
  
  if (feedback === null) {
    // User cancelled prompt
    return;
  }

  if (feedback.trim() === "") {
    showError("Revision request cannot be empty. Please specify what you would like changed.");
    return;
  }

  switchTab('chat');
  appendChatMessage("User (Design Change Request)", feedback.trim(), "msg-user");

  setTimeout(() => {
    appendChatMessage("Atelier Elena", "Thank you for the update! I will adjust the crystal pattern on the bodice and upload a revised photo tomorrow.", "msg-artisan");
  }, 1200);
}

// Chat Input Handlers
function handleChatKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

function sendMessage() {
  hideError();
  const input = document.getElementById('chat-input');
  
  if (!input) return;

  const text = input.value.trim();
  if (text === "") {
    showError("Cannot send an empty chat message.");
    return;
  }

  appendChatMessage("You", text, "msg-user");
  input.value = "";
  
  // Simulated Automated Designer Reply
  setTimeout(() => {
    appendChatMessage("Atelier Elena", "Got your note! Working on perfecting this for your prom date.", "msg-artisan");
  }, 1500);
}

function appendChatMessage(sender, text, msgClass) {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${msgClass}`;
  
  // Sanitize text to prevent script injection
  const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${safeText}`;
  
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Initialize System Defaults & Set Default Dates Safely
window.onload = function() {
  try {
    // Set default date to +30 days from today
    const promDateInput = document.getElementById('prom-date');
    if (promDateInput) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      promDateInput.value = defaultDate.toISOString().split('T')[0];
    }

    updateCustomizer();
  } catch (err) {
    console.error("Initialization error:", err);
    showError("Initial setup encountered an error.");
  }
};