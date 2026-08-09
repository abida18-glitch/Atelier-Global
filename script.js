document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // UTILITY: ERROR TOAST NOTIFICATION SYSTEM
  // ==========================================
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');
  const toastClose = document.getElementById('toast-close');
  let toastTimer = null;

  const showToast = (msg, isError = false) => {
    if (!toast || !toastMessage) return;
    
    // Clear any active timer
    if (toastTimer) clearTimeout(toastTimer);

    toastMessage.textContent = msg;
    toast.className = `toast ${isError ? 'error-toast' : ''}`;
    
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 4000);
  };

  if (toastClose) {
    toastClose.addEventListener('click', () => toast.classList.add('hidden'));
  }

  // ==========================================
  // 1. SAFE TAB SWITCHING LOGIC
  // ==========================================
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');
      const targetTab = document.getElementById(targetTabId);

      if (!targetTab) {
        showToast(`Unable to locate tab section: "${targetTabId}"`, true);
        return;
      }

      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabContents.forEach(content => {
        if (content.classList.contains('active')) {
          content.style.opacity = '0';
          setTimeout(() => {
            content.classList.remove('active');
            targetTab.classList.add('active');
            setTimeout(() => { targetTab.style.opacity = '1'; }, 50);
          }, 200);
        }
      });
    });
  });

  // ==========================================
  // 2. 3D STUDIO INTERACTION & IMAGE ERROR HANDLING
  // ==========================================
  const colorPicker = document.getElementById('color-picker');
  const colorOverlay = document.getElementById('color-overlay');
  const hexCodeDisplay = document.getElementById('hex-code');
  const swatches = document.querySelectorAll('.swatch');
  const dressModelWrapper = document.getElementById('dress-model-wrapper');
  const dressImage = document.getElementById('dress-image');

  // Hex color validation helper
  const isValidHex = (hex) => /^#([0-9A-F]{3}){1,2}$/i.test(hex);

  const applyColor = (hex) => {
    if (!isValidHex(hex)) {
      showToast("Invalid color code selected.", true);
      return;
    }
    if (colorOverlay) colorOverlay.style.backgroundColor = hex;
    if (hexCodeDisplay) hexCodeDisplay.textContent = hex.toUpperCase();
    if (colorPicker) colorPicker.value = hex;
  };

  if (colorPicker) {
    colorPicker.addEventListener('input', (e) => applyColor(e.target.value));
  }

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const selectedColor = swatch.getAttribute('data-color');
      applyColor(selectedColor);
    });
  });

  // 3D Canvas Controls (Rotation & Zoom Bounds)
  let rotation = 0;
  let scale = 1;

  const updateTransform = () => {
    if (dressModelWrapper) {
      dressModelWrapper.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    }
  };

  const btnRotate = document.getElementById('btn-rotate');
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');

  if (btnRotate) {
    btnRotate.addEventListener('click', () => {
      rotation = (rotation + 45) % 360;
      updateTransform();
    });
  }

  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', () => {
      if (scale >= 1.5) {
        showToast("Maximum zoom level reached.");
        return;
      }
      scale = parseFloat((scale + 0.15).toFixed(2));
      updateTransform();
    });
  }

  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', () => {
      if (scale <= 0.6) {
        showToast("Minimum zoom level reached.");
        return;
      }
      scale = parseFloat((scale - 0.15).toFixed(2));
      updateTransform();
    });
  }

  // Silhouette Switcher with Image Fallback
  const silhouetteBtns = document.querySelectorAll('.silhouette-btn');
  silhouetteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const imgUrl = btn.getAttribute('data-img');
      if (!imgUrl) return;

      silhouetteBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (dressImage) {
        dressImage.onerror = () => {
          showToast("Failed to load silhouette image. Reverting...", true);
          dressImage.src = "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80";
        };
        dressImage.src = imgUrl;
      }
    });
  });

  // AI Generator Validation Handler
  const aiForm = document.getElementById('ai-form');
  const aiQuery = document.getElementById('ai-query');
  const aiErrorMsg = document.getElementById('ai-error-msg');
  const aiSubmitBtn = document.getElementById('ai-submit-btn');

  if (aiForm) {
    aiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = aiQuery ? aiQuery.value.trim() : '';

      if (aiErrorMsg) aiErrorMsg.classList.add('hidden');

      if (!query) {
        if (aiErrorMsg) {
          aiErrorMsg.textContent = "Please enter a design prompt.";
          aiErrorMsg.classList.remove('hidden');
        }
        return;
      }

      if (query.length < 3) {
        if (aiErrorMsg) {
          aiErrorMsg.textContent = "Prompt must be at least 3 characters long.";
          aiErrorMsg.classList.remove('hidden');
        }
        return;
      }

      // Simulate API call state
      if (aiSubmitBtn) {
        aiSubmitBtn.disabled = true;
        aiSubmitBtn.textContent = 'Generating...';
      }

      const gallery = document.getElementById('ai-gallery');
      if (gallery) gallery.style.opacity = '0.3';

      setTimeout(() => {
        if (gallery) gallery.style.opacity = '1';
        if (aiSubmitBtn) {
          aiSubmitBtn.disabled = false;
          aiSubmitBtn.textContent = 'Generate';
        }
        showToast("Inspiration moodboard updated successfully!");
      }, 1000);
    });
  }

  // ==========================================
  // 3. 100+ FABRICS GENERATOR & FILTERING
  // ==========================================
  const fabricGrid = document.getElementById('fabric-grid');
  const noFabricsMsg = document.getElementById('no-fabrics-msg');
  const summaryFabric = document.getElementById('summary-fabric');
  const fabricCategories = ['Silks', 'Velvets', 'Laces', 'Organza & Tulle'];

  const generate100Fabrics = () => {
    const fabrics = [
      { name: 'Mulberry Silk Charmeuse', category: 'Silks', tag: 'Atelier Recommended' },
      { name: 'French Chantilly Lace', category: 'Laces', tag: 'Couture Classic' },
      { name: 'Silk Organza Triple-Gazar', category: 'Organza & Tulle', tag: 'Architectural' },
      { name: 'Lyons Cotton-Silk Velvet', category: 'Velvets', tag: 'Winter Gala' }
    ];

    try {
      fabricCategories.forEach(cat => {
        for (let i = 1; i <= 25; i++) {
          fabrics.push({
            name: `${cat.slice(0, -1)} Grade ${i * 5} Variant`,
            category: cat,
            tag: i % 5 === 0 ? 'Recommended' : 'Standard'
          });
        }
      });
    } catch (err) {
      showToast("Error generating fabric database.", true);
    }

    return fabrics;
  };

  const allFabrics = generate100Fabrics();

  const renderFabrics = (filterText = '', filterCat = 'All') => {
    if (!fabricGrid) return;
    
    fabricGrid.innerHTML = '';
    const cleanFilterText = filterText.trim().toLowerCase();

    const filtered = allFabrics.filter(f => {
      const matchSearch = f.name.toLowerCase().includes(cleanFilterText);
      const matchCat = filterCat === 'All' || f.category === filterCat;
      return matchSearch && matchCat;
    });

    if (filtered.length === 0) {
      if (noFabricsMsg) noFabricsMsg.classList.remove('hidden');
      return;
    } else {
      if (noFabricsMsg) noFabricsMsg.classList.add('hidden');
    }

    filtered.slice(0, 12).forEach((f, idx) => {
      const card = document.createElement('div');
      card.className = `fabric-card ${idx === 0 ? 'active' : ''}`;
      card.tabIndex = 0;
      card.innerHTML = `
        <span class="badge">${f.tag}</span>
        <h4 style="font-family: var(--font-serif); font-size: 1.1rem; margin-top: 0.5rem;">${f.name}</h4>
        <p class="small-text">${f.category}</p>
      `;

      const selectFabric = () => {
        document.querySelectorAll('.fabric-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        if (summaryFabric) summaryFabric.textContent = f.name;
        showToast(`Selected fabric: ${f.name}`);
      };

      card.addEventListener('click', selectFabric);
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter') selectFabric(); });

      fabricGrid.appendChild(card);
    });
  };

  renderFabrics();

  const fabricSearch = document.getElementById('fabric-search');
  if (fabricSearch) {
    fabricSearch.addEventListener('input', (e) => {
      const activeFilterBtn = document.querySelector('.filter-btn.active');
      const cat = activeFilterBtn ? activeFilterBtn.getAttribute('data-cat') : 'All';
      renderFabrics(e.target.value, cat);
    });
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFabrics(fabricSearch ? fabricSearch.value : '', btn.getAttribute('data-cat'));
    });
  });

  // Embellishment Selector
  const summaryEmbellishment = document.getElementById('summary-embellishment');
  const embCards = document.querySelectorAll('.emb-card');
  embCards.forEach(card => {
    const handleSelect = () => {
      embCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const title = card.querySelector('h4');
      if (title && summaryEmbellishment) {
        summaryEmbellishment.textContent = title.textContent;
      }
    };
    card.addEventListener('click', handleSelect);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSelect(); });
  });

  // ==========================================
  // 4. SIZING & AI SCANNER SIMULATION WITH TIMEOUTS
  // ==========================================
  const modeAiBtn = document.getElementById('mode-ai-btn');
  const modeVideoBtn = document.getElementById('mode-video-btn');
  const aiScannerView = document.getElementById('ai-scanner-view');
  const videoGuideView = document.getElementById('video-guide-view');

  if (modeAiBtn && modeVideoBtn) {
    modeAiBtn.addEventListener('click', () => {
      modeAiBtn.classList.add('active');
      modeVideoBtn.classList.remove('active');
      if (aiScannerView) aiScannerView.classList.remove('hidden');
      if (videoGuideView) videoGuideView.classList.add('hidden');
    });

    modeVideoBtn.addEventListener('click', () => {
      modeVideoBtn.classList.add('active');
      modeAiBtn.classList.remove('active');
      if (videoGuideView) videoGuideView.classList.remove('hidden');
      if (aiScannerView) aiScannerView.classList.add('hidden');
    });
  }

  const startScanBtn = document.getElementById('start-scan-btn');
  const scanResults = document.getElementById('scan-results');

  if (startScanBtn) {
    startScanBtn.addEventListener('click', () => {
      startScanBtn.disabled = true;
      startScanBtn.textContent = 'Scanning Contours...';

      setTimeout(() => {
        startScanBtn.disabled = false;
        startScanBtn.textContent = 'Start Camera Scan';
        if (scanResults) {
          scanResults.classList.remove('hidden');
          showToast("AI Fit Analysis Complete!");
        }
      }, 1500);
    });
  }

  // ==========================================
  // 5. DESIGNERS CHAT SYSTEM & INPUT SANITIZATION
  // ==========================================
  const designerCards = document.querySelectorAll('.designer-card');
  const chatAvatar = document.getElementById('chat-avatar');
  const chatName = document.getElementById('chat-designer-name');
  const chatLoc = document.getElementById('chat-designer-loc');

  designerCards.forEach(card => {
    const switchDesigner = () => {
      designerCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      if (chatAvatar) chatAvatar.src = card.getAttribute('data-img');
      if (chatName) chatName.textContent = card.getAttribute('data-name');
      if (chatLoc) chatLoc.textContent = `Atelier • ${card.getAttribute('data-loc')}`;
    };

    card.addEventListener('click', switchDesigner);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') switchDesigner(); });
  });

  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  // Prevent XSS script injection
  const escapeHTML = (str) => {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  };

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput ? chatInput.value.trim() : '';

      if (!text) {
        showToast("Cannot send empty message.", true);
        return;
      }

      const userMsg = document.createElement('div');
      userMsg.className = 'msg user';
      userMsg.innerHTML = `<p>${escapeHTML(text)}</p><span class="time">Just now</span>`;

      if (chatMessages) {
        chatMessages.appendChild(userMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      if (chatInput) chatInput.value = '';
    });
  }

  // Clearance "Acquire Piece" Handlers
  document.querySelectorAll('.acquire-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const checkoutNav = document.querySelector('.nav-btn[data-tab="checkout"]');
      if (checkoutNav) checkoutNav.click();
      showToast("Item added to commission form.");
    });
  });

  // ==========================================
  // 6. CHECKOUT FORM VALIDATION
  // ==========================================
  const checkoutForm = document.getElementById('checkout-form');
  const payBtns = document.querySelectorAll('.pay-btn');
  const cardFields = document.getElementById('card-fields');

  // Payment Method Switcher
  payBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      payBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const method = btn.getAttribute('data-method');
      if (cardFields) {
        if (method === 'card') {
          cardFields.classList.remove('hidden');
        } else {
          cardFields.classList.add('hidden');
        }
      }
    });
  });

  const setFieldError = (inputId, message) => {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.classList.add('input-invalid');
    const parent = input.closest('.input-group');
    if (parent) {
      const errSpan = parent.querySelector('.field-error');
      if (errSpan) errSpan.textContent = message;
    }
  };

  const clearErrors = () => {
    document.querySelectorAll('.input-invalid').forEach(el => el.classList.remove('input-invalid'));
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  };

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
      let isValid = true;

      // Validate Text Fields
      const firstName = document.getElementById('first-name');
      const lastName = document.getElementById('last-name');
      const email = document.getElementById('email');
      const address = document.getElementById('address');

      if (!firstName || !firstName.value.trim()) {
        setFieldError('first-name', 'First name is required.');
        isValid = false;
      }

      if (!lastName || !lastName.value.trim()) {
        setFieldError('last-name', 'Last name is required.');
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.value.trim())) {
        setFieldError('email', 'Please enter a valid email address.');
        isValid = false;
      }

      if (!address || !address.value.trim()) {
        setFieldError('address', 'Shipping address is required.');
        isValid = false;
      }

      // Validate Card Fields if Card method is selected
      const activePayBtn = document.querySelector('.pay-btn.active');
      const isCardSelected = activePayBtn && activePayBtn.getAttribute('data-method') === 'card';

      if (isCardSelected) {
        const cardNumber = document.getElementById('card-number');
        const cardExp = document.getElementById('card-exp');
        const cardCvc = document.getElementById('card-cvc');

        const cleanCardNum = cardNumber ? cardNumber.value.replace(/\s+/g, '') : '';
        if (!cleanCardNum || !/^\d{16}$/.test(cleanCardNum)) {
          setFieldError('card-number', 'Enter a valid 16-digit card number.');
          isValid = false;
        }

        if (!cardExp || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExp.value.trim())) {
          setFieldError('card-exp', 'Use MM/YY format.');
          isValid = false;
        }

        if (!cardCvc || !/^\d{3,4}$/.test(cardCvc.value.trim())) {
          setFieldError('card-cvc', '3 or 4 digits.');
          isValid = false;
        }
      }

      if (isValid) {
        const submitBtn = document.getElementById('submit-checkout-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Processing Commission...';
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Complete Commission';
          }
          checkoutForm.reset();
          showToast("Commission submitted successfully! Check your email for details.");
        }, 1500);
      } else {
        showToast("Please fix errors in the form before submitting.", true);
      }
    });
  }

  // ==========================================
  // 7. REVIEWS & ACCESSIBLE STAR RATING
  // ==========================================
  const stars = document.querySelectorAll('#star-rating span');
  const submitReviewBtn = document.getElementById('submit-review-btn');

  const updateStarState = (rating) => {
    stars.forEach((s, idx) => {
      const isSelected = idx < rating;
      s.classList.toggle('active', isSelected);
      s.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
  };

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.getAttribute('data-star') || '5', 10);
      updateStarState(rating);
    });

    star.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const rating = parseInt(star.getAttribute('data-star') || '5', 10);
        updateStarState(rating);
      }
    });
  });

  if (submitReviewBtn) {
    submitReviewBtn.addEventListener('click', () => {
      submitReviewBtn.disabled = true;
      submitReviewBtn.textContent = 'Review Submitted';
      showToast("Thank you for submitting your rating!");
    });
  }

});