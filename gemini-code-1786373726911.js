document.addEventListener('DOMContentLoaded', () => {
  const swatches = document.querySelectorAll('.color-swatch');
  const hexInput = document.getElementById('hex-input');
  const dressSilhouette = document.getElementById('dress-silhouette');
  const scanBtn = document.getElementById('scan-btn');
  const consultBtn = document.getElementById('consult-btn');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Updates visual customizer color dynamically
  function updateFabricColor(colorHex) {
    if (dressSilhouette) {
      dressSilhouette.style.backgroundColor = colorHex;
    }
    if (hexInput) {
      hexInput.value = colorHex.toUpperCase();
    }
  }

  // Handle preset color swatch clicks
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const selectedColor = swatch.getAttribute('data-color');
      updateFabricColor(selectedColor);
    });
  });

  // Handle direct manual HEX color input
  hexInput.addEventListener('input', (e) => {
    const val = e.target.value;
    const hexPattern = /^#([0-9A-F]{3}){1,2}$/i;

    if (hexPattern.test(val)) {
      if (dressSilhouette) {
        dressSilhouette.style.backgroundColor = val;
      }
      swatches.forEach(s => {
        if (s.getAttribute('data-color').toLowerCase() === val.toLowerCase()) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    }
  });

  // Interactive Button Triggers
  scanBtn.addEventListener('click', () => {
    alert('Initializing AI Camera Scanner...');
  });

  consultBtn.addEventListener('click', () => {
    alert('Connecting to Atelier Designer Directory...');
  });

  checkoutBtn.addEventListener('click', () => {
    alert('Redirecting to Stripe Express Checkout...');
  });
});