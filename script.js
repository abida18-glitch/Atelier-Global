/**
 * Atelier Global - Prom Dress Customizer & Escrow Tracker Logic
 */

// Tab Navigation Logic
function switchTab(tabName) {
  const tabs = document.querySelectorAll('.tab-content');
  const buttons = document.querySelectorAll('.nav-btn');

  tabs.forEach(tab => tab.classList.remove('active'));
  buttons.forEach(btn => btn.classList.remove('active'));

  if (tabName === 'customizer') {
    document.getElementById('customizer-tab').classList.add('active');
    buttons[0].classList.add('active');
  } else if (tabName === 'production') {
    document.getElementById('production-tab').classList.add('active');
    buttons[1].classList.add('active');
  } else if (tabName === 'chat') {
    document.getElementById('chat-tab').classList.add('active');
    buttons[2].classList.add('active');
  }
}

// Live Customizer & Pricing Logic
function updateCustomizer() {
  const fabricSelect = document.getElementById('fabric');
  const beadingSelect = document.getElementById('beading');

  const selectedFabricOpt = fabricSelect.options[fabricSelect.selectedIndex];
  const selectedBeadingOpt = beadingSelect.options[beadingSelect.selectedIndex];

  const fabricPrice = parseInt(selectedFabricOpt.getAttribute('data-price')) || 0;
  const beadingPrice = parseInt(selectedBeadingOpt.getAttribute('data-price')) || 0;
  const protectionFee = 40;

  const totalPrice = fabricPrice + beadingPrice + protectionFee;

  // Update Labels
  document.getElementById('lbl-fabric').innerText = selectedFabricOpt.value;
  document.getElementById('lbl-beading').innerText = selectedBeadingOpt.value;

  // Update Price Summary Breakdown
  document.getElementById('price-fabric').innerText = `$${fabricPrice}`;
  document.getElementById('price-beading').innerText = `$${beadingPrice}`;
  document.getElementById('price-total').innerText = `$${totalPrice}`;

  // Adjust Beading Visualizer Layer
  const beadingLayer = document.getElementById('beading-layer');
  if (beadingSelect.value.includes('Heavy')) {
    beadingLayer.style.opacity = '0.9';
    beadingLayer.style.backgroundSize = '10px 10px';
  } else if (beadingSelect.value.includes('Medium')) {
    beadingLayer.style.opacity = '0.6';
    beadingLayer.style.backgroundSize = '18px 18px';
  } else {
    beadingLayer.style.opacity = '0.3';
    beadingLayer.style.backgroundSize = '24px 24px';
  }
}

// Color Swatch Selection
function setColor(hexCode, colorName) {
  document.getElementById('gown-base').style.backgroundColor = hexCode;

  // Swatch Active UI Toggle
  const swatches = document.querySelectorAll('.swatch');
  swatches.forEach(swatch => swatch.classList.remove('active'));
  event.target.classList.add('active');
}

// Submit Order Event
function submitOrder() {
  alert("✨ Design Reserved! Your 3D measurement scan invitation link has been sent to your phone. Transitioning to your Live Escrow Tracker...");
  switchTab('production');
}

// Escrow Stage Milestone Approval
function approveMilestone() {
  alert("✓ Milestone Approved! 25% payment unlocked to Master Artisan Elena. Next stage: Corset & Bodice Construction initialized.");
}

// Request Revision / Designer Update
function requestRevision() {
  const feedback = prompt("Specify desired modification for your designer (e.g., 'Add more crystals along the lower neckline'):");
  if (feedback) {
    switchTab('chat');
    appendChatMessage("User (Design Change Request)", feedback, "msg-user");
    setTimeout(() => {
      appendChatMessage("Atelier Elena", "Thank you for the update! I will adjust the crystal pattern on the bodice and upload a revised photo tomorrow.", "msg-artisan");
    }, 1200);
  }
}

// Chat System Functions
function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (text !== "") {
    appendChatMessage("You", text, "msg-user");
    input.value = "";
    
    // Simulated Automated Designer Reply
    setTimeout(() => {
      appendChatMessage("Atelier Elena", "Got your note! Working on perfecting this for your prom date.", "msg-artisan");
    }, 1500);
  }
}

function appendChatMessage(sender, text, msgClass) {
  const chatBox = document.getElementById('chat-box');
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${msgClass}`;
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Initialize Customizer Defaults on Load
window.onload = function() {
  updateCustomizer();
};