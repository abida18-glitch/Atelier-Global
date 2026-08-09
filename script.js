document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. TAB SWITCHING LOGIC (Smooth Transitions)
  // ==========================================
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update Nav active states
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Fade out current tab and fade in target tab
      tabContents.forEach(content => {
        if (content.classList.contains('active')) {
          content.style.opacity = '0';
          setTimeout(() => {
            content.classList.remove('active');
            const newTab = document.getElementById(targetTab);
            if (newTab) {
              newTab.classList.add('active');
              setTimeout(() => { newTab.style.opacity = '1'; }, 50);
            }
          }, 200);
        }
      });
    });
  });

  // ==========================================
  // 2. 3D STUDIO INTERACTION
  // ==========================================
  const colorPicker = document.getElementById('color-picker');
  const colorOverlay = document.getElementById('color-overlay');
  const hexCodeDisplay = document.getElementById('hex-code');
  const swatches = document.querySelectorAll('.swatch');
  const dressModelWrapper = document.getElementById('dress-model-wrapper');
  const dressImage = document.getElementById('dress-image');

  // Color Swatch Selection
  const applyColor = (hex) => {
    colorOverlay.style.backgroundColor = hex;
    hexCodeDisplay.textContent = hex.toUpperCase();
    colorPicker.value = hex;
  };

  colorPicker.addEventListener('input', (e) => applyColor(e.target.value));

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      applyColor(swatch.getAttribute('data-color'));
    });
  });

  // 3D Canvas Controls (Rotation & Zoom)
  let rotation = 0;
  let scale = 1;

  document.getElementById('btn-rotate').addEventListener('click', () => {
    rotation += 45;
    dressModelWrapper.style.transform = `rotate(${rotation}deg) scale(${scale})`;
  });

  document.getElementById('btn-zoom-in').addEventListener('click', () => {
    scale = Math.min(scale + 0.15, 1.3);
    dressModelWrapper.style.transform = `rotate(${rotation}deg) scale(${scale})`;
  });

  document.getElementById('btn-zoom-out').addEventListener('click', () => {
    scale = Math.max(scale - 0.15, 0.7);
    dressModelWrapper.style.transform = `rotate(${rotation}deg) scale(${scale})`;
  });

  // Silhouette Switcher
  const silhouetteBtns = document.querySelectorAll('.silhouette-btn');
  silhouetteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      silhouetteBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      dressImage.src = btn.getAttribute('data-img');
    });
  });

  // AI Generator Form Handler
  const aiForm = document.getElementById('ai-form');
  aiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const gallery = document.getElementById('ai-gallery');
    gallery.style.opacity = '0.5';
    setTimeout(() => {
      gallery.style.opacity = '1';
    }, 800);
  });

  // ==========================================
  // 3. 100+ FABRICS GENERATOR & FILTERING
  // ==========================================
  const fabricGrid = document.getElementById('fabric-grid');
  const fabricCategories = ['Silks', 'Velvets', 'Laces', 'Organza & Tulle'];

  // Seed data generator for 100+ fabrics
  const generate100Fabrics = () => {
    const fabrics = [
      { name: 'Mulberry Silk Charmeuse', category: 'Silks', tag: 'Atelier Recommended' },
      { name: 'French Chantilly Lace', category: 'Laces', tag: 'Couture Classic' },
      { name: 'Silk Organza Triple-Gazar', category: 'Organza & Tulle', tag: 'Architectural' },
      { name: 'Lyons Cotton-Silk Velvet', category: 'Velvets', tag: 'Winter Gala' }
    ];

    fabricCategories.forEach(cat => {
      for (let i = 1; i <= 25; i++) {
        fabrics.push({
          name: `${cat.slice(0, -1)} Grade ${i * 5} Variant`,
          category: cat,
          tag: i % 5 === 0 ? 'Recommended' : 'Standard'
        });
      }
    });

    return fabrics;
  };

  const allFabrics = generate100Fabrics();

  const renderFabrics = (filterText = '', filterCat = 'All') => {
    fabricGrid.innerHTML = '';
    const filtered = allFabrics.filter(f => {
      const matchSearch = f.name.toLowerCase().includes(filterText.toLowerCase());
      const matchCat = filterCat === 'All' || f.category === filterCat;
      return matchSearch && matchCat;
    });

    filtered.slice(0, 12).forEach((f, idx) => {
      const card = document.createElement('div');
      card.className = `fabric-card ${idx === 0 ? 'active' : ''}`;
      card.innerHTML = `
        <span class="badge">${f.tag}</span>
        <h4 style="font-family: var(--font-serif); font-size: 1.1rem; margin-top: 0.5rem;">${f.name}</h4>
        <p class="small-text">${f.category}</p>
      `;
      card.addEventListener('click', () => {
        document.querySelectorAll('.fabric-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
      fabricGrid.appendChild(card);
    });
  };

  renderFabrics();

  // Search Input Event
  document.getElementById('fabric-search').addEventListener('input', (e) => {
    renderFabrics(e.target.value, document.querySelector('.filter-btn.active').getAttribute('data-cat'));
  });

  // Category Filter Events
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFabrics(
        document.getElementById('fabric-search').value,
        btn.getAttribute('data-cat')
      );
    });
  });

  // ==========================================
  // 4. SIZING & AI SCANNER TOGGLE
  // ==========================================
  const modeAiBtn = document.getElementById('mode-ai-btn');
  const modeVideoBtn = document.getElementById('mode-video-btn');
  const aiScannerView = document.getElementById('ai-scanner-view');
  const videoGuideView = document.getElementById('video-guide-view');

  modeAiBtn.addEventListener('click', () => {
    modeAiBtn.classList.add('active');
    modeVideoBtn.classList.remove('active');
    aiScannerView.classList.remove('hidden');
    videoGuideView.classList.add('hidden');
  });

  modeVideoBtn.addEventListener('click', () => {
    modeVideoBtn.classList.add('active');
    modeAiBtn.classList.remove('active');
    videoGuideView.classList.remove('hidden');
    aiScannerView.classList.add('hidden');
  });

  const startScanBtn = document.getElementById('start-scan-btn');
  const scanResults = document.getElementById('scan-results');

  startScanBtn.addEventListener('click', () => {
    startScanBtn.textContent = 'Scanning Contours...';
    setTimeout(() => {
      startScanBtn.textContent = 'Start Camera Scan';
      scanResults.classList.remove('hidden');
    }, 1500);
  });

  // ==========================================
  // 5. DESIGNERS CHAT SYSTEM
  // ==========================================
  const designerCards = document.querySelectorAll('.designer-card');
  const chatAvatar = document.getElementById('chat-avatar');
  const chatName = document.getElementById('chat-designer-name');
  const chatLoc = document.getElementById('chat-designer-loc');

  designerCards.forEach(card => {
    card.addEventListener('click', () => {
      designerCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      chatAvatar.src = card.getAttribute('data-img');
      chatName.textContent = card.getAttribute('data-name');
      chatLoc.textContent = `Atelier • ${card.getAttribute('data-loc')}`;
    });
  });

  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!chatInput.value.trim()) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'msg user';
    userMsg.innerHTML = `<p>${chatInput.value}</p><span class="time">Just now</span>`;
    chatMessages.appendChild(userMsg);

    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  // ==========================================
  // 6. 5-STAR RATING WIDGET
  // ==========================================
  const stars = document.querySelectorAll('#star-rating span');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.getAttribute('data-star'));
      stars.forEach((s, idx) => {
        if (idx < rating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
  });

});