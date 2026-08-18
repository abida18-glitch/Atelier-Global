document.addEventListener('DOMContentLoaded', () => {
    // Tab Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // If tracker tab is opened, invalidate map size to render correctly
                if (targetId === 'tracker' && window.royalMapInstance) {
                    setTimeout(() => {
                        window.royalMapInstance.invalidateSize();
                    }, 200);
                }
            }
        });
    });

    // Modal System Utility
    window.showRoyalModal = function(title, message, actionsHtml = null, customContentHtml = null) {
        const modalOverlay = document.getElementById('royal-modal-overlay');
        document.getElementById('royal-modal-title').textContent = title;
        
        const messageEl = document.getElementById('royal-modal-message');
        if (customContentHtml) {
            messageEl.innerHTML = customContentHtml;
        } else {
            messageEl.textContent = message;
        }

        const actions = document.getElementById('royal-modal-actions');
        if (actionsHtml) {
            actions.innerHTML = actionsHtml;
        } else {
            actions.innerHTML = `<button class="primary-btn" onclick="document.getElementById('royal-modal-overlay').classList.add('hidden')">Acknowledge</button>`;
        }
        modalOverlay.classList.remove('hidden');
    }

    // Color Wheel Real-time Value Sync
    const colorWheel = document.getElementById('opt-color-wheel');
    const colorHexLabel = document.getElementById('color-hex-label');

    if (colorWheel && colorHexLabel) {
        colorWheel.addEventListener('input', (e) => {
            const hexVal = e.target.value.toUpperCase();
            colorHexLabel.textContent = `${hexVal} (Custom Hue)`;
        });
    }

    // Dedicated Camera and Gallery Elements
    const cameraInput = document.getElementById('camera-capture-input');
    const galleryInput = document.getElementById('gallery-upload-input');
    const triggerCameraBtn = document.getElementById('trigger-camera-btn');
    const triggerGalleryBtn = document.getElementById('trigger-gallery-btn');

    // Live Camera Stream Elements
    const liveCameraContainer = document.getElementById('live-camera-container');
    const cameraStreamVideo = document.getElementById('camera-stream-video');
    const cameraSnapshotCanvas = document.getElementById('camera-snapshot-canvas');
    const captureSnapshotBtn = document.getElementById('capture-snapshot-btn');
    const closeCameraBtn = document.getElementById('close-camera-btn');
    let activeMediaStream = null;

    // Text-based Search Handler with Real Images
    const imageSearchInput = document.getElementById('image-search-input');
    const imageSearchBtn = document.getElementById('image-search-btn');

    if (imageSearchBtn) {
        imageSearchBtn.addEventListener('click', () => {
            const query = imageSearchInput.value.trim();
            if (query) {
                showRoyalModal('Archival Search', `Searching royal archives for "${query}"...`, `
                    <button class="primary-btn" onclick="executeImageSearch('${query}')">View Results</button>
                `);
            } else {
                showRoyalModal('Notice', 'Please type a search query for reference styles.');
            }
        });
    }

    window.executeImageSearch = function(searchTerm) {
        document.getElementById('royal-modal-overlay').classList.add('hidden');
        document.getElementById('image-search-results').innerHTML = `
            <div class="inspiration-card">
                <img src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=400&q=80" alt="Search Result 1" class="result-real-img">
                <span>Result: ${searchTerm} Style A</span>
            </div>
            <div class="inspiration-card">
                <img src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80" alt="Search Result 2" class="result-real-img">
                <span>Result: ${searchTerm} Style B</span>
            </div>
        `;
    }

    if (triggerCameraBtn) {
        triggerCameraBtn.addEventListener('click', async () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    activeMediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                    cameraStreamVideo.srcObject = activeMediaStream;
                    liveCameraContainer.classList.remove('hidden');
                } catch (err) {
                    console.warn('Webcam stream unavailable, falling back to native capture input.', err);
                    if (cameraInput) cameraInput.click();
                }
            } else {
                if (cameraInput) cameraInput.click();
            }
        });
    }

    if (captureSnapshotBtn) {
        captureSnapshotBtn.addEventListener('click', () => {
            const context = cameraSnapshotCanvas.getContext('2d');
            cameraSnapshotCanvas.width = cameraStreamVideo.videoWidth || 640;
            cameraSnapshotCanvas.height = cameraStreamVideo.videoHeight || 480;
            context.drawImage(cameraStreamVideo, 0, 0, cameraSnapshotCanvas.width, cameraSnapshotCanvas.height);
            
            stopCameraStream();
            liveCameraContainer.classList.add('hidden');
            
            showRoyalModal('AI Dress Detection Complete', 'Live camera frame captured successfully! Analyzing silhouette and pattern match...', `
                <button class="primary-btn" onclick="processLiveCameraMatch()">View Similar Results</button>
            `);
        });
    }

    if (closeCameraBtn) {
        closeCameraBtn.addEventListener('click', () => {
            stopCameraStream();
            liveCameraContainer.classList.add('hidden');
        });
    }

    function stopCameraStream() {
        if (activeMediaStream) {
            activeMediaStream.getTracks().forEach(track => track.stop());
            activeMediaStream = null;
        }
    }

    if (cameraInput) {
        cameraInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                showRoyalModal('AI Dress Detection Complete', 'Captured hardware camera photo successfully! Analyzing silhouette and pattern match...', `
                    <button class="primary-btn" onclick="processLiveCameraMatch()">View Similar Results</button>
                `);
            }
        });
    }

    window.processLiveCameraMatch = function() {
        document.getElementById('royal-modal-overlay').classList.add('hidden');
        document.getElementById('image-search-results').innerHTML = `
            <div class="inspiration-card">
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80" alt="Camera Match 1" class="result-real-img">
                <span>Detected Royal Silhouette</span>
            </div>
            <div class="inspiration-card">
                <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80" alt="Camera Match 2" class="result-real-img">
                <span>Matched Velvet Drape</span>
            </div>
        `;
    }

    if (triggerGalleryBtn) {
        triggerGalleryBtn.addEventListener('click', () => {
            if (galleryInput) galleryInput.click();
        });
    }

    if (galleryInput) {
        galleryInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                showRoyalModal('Gallery Upload Successful', `Loaded reference image from gallery: "${file.name}". AI matching grid updated.`, `
                    <button class="primary-btn" onclick="processGalleryMatch()">View Similar Results</button>
                `);
            }
        });
    }

    window.processGalleryMatch = function() {
        document.getElementById('royal-modal-overlay').classList.add('hidden');
        document.getElementById('image-search-results').innerHTML = `
            <div class="inspiration-card">
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80" alt="Gallery Match 1" class="result-real-img">
                <span>Archival Reference Style A</span>
            </div>
            <div class="inspiration-card">
                <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80" alt="Gallery Match 2" class="result-real-img">
                <span>Archival Reference Style B</span>
            </div>
        `;
    }

    // Configuration Save Functionality
    const saveDesignBtn = document.getElementById('save-design-btn');
    if (saveDesignBtn) {
        saveDesignBtn.addEventListener('click', () => {
            const selectedColor = colorWheel ? colorWheel.value.toUpperCase() : '#C5A059';
            const fabricElement = document.getElementById('opt-fabric');
            const necklineElement = document.getElementById('opt-neckline');
            
            const fabric = fabricElement ? fabricElement.value : 'Standard Fabric';
            const neckline = necklineElement ? necklineElement.value : 'Standard Neckline';

            showRoyalModal('Configuration Saved', `Selected Color Hex: ${selectedColor}\nFabric: ${fabric}\nNeckline: ${neckline}`);
        });
    }

    // Couturiers Database with Face Portraits & Dress Galleries
    const couturiersDatabase = [
        {
            id: 1,
            name: "Maison Elie Saab",
            country: "Lebanon",
            address: "Beirut, Lebanon",
            basePrice: 18000,
            style: "Romantic Filigree",
            image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80",
            faceImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            description: "Renowned worldwide for majestic bridal gowns and intricate thread embroidery fit for reigning monarchs.",
            leadDesigner: "Elie Saab",
            established: "1982",
            specialty: "Hand-stitched Crystal Beading & Lace Applique",
            recommended: true,
            dresses: [
                "https://images.unsplash.com/photo-1594552072238-b8a3da72ae8a?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"
            ]
        },
        {
            id: 2,
            name: "Atelier Dior Couture",
            country: "France",
            address: "Paris, France",
            basePrice: 25000,
            style: "Imperial Ballgown",
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80",
            faceImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
            description: "The pinnacle of Parisian craftsmanship, defining structural elegance and timeless grace since 1946.",
            leadDesigner: "Maria Grazia Chiuri",
            established: "1946",
            specialty: "Structured Duchess Satin & Flowing Pleats",
            recommended: true,
            dresses: [
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80"
            ]
        },
        {
            id: 3,
            name: "Akris Grand Maison",
            country: "Switzerland",
            address: "St. Gallen, Switzerland",
            basePrice: 9500,
            style: "Classic Tailoring",
            image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80",
            faceImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
            description: "Swiss luxury house celebrated for exceptional fabrics, understated architectural lines, and precision tailoring.",
            leadDesigner: "Albert Kriemler",
            established: "1922",
            specialty: "Double-face Cashmere & Minimalist Silhouettes",
            recommended: false,
            dresses: [
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80"
            ]
        },
        {
            id: 4,
            name: "Alexander McQueen Atelier",
            country: "United Kingdom",
            address: "London, United Kingdom",
            basePrice: 22000,
            style: "Avant-Garde",
            image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
            faceImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
            description: "Master British tailoring house blending theatrical romanticism with uncompromising structural construction.",
            leadDesigner: "Seán McGirr",
            established: "1992",
            specialty: "Tailored Corsetry & Dramatic Train Construction",
            recommended: true,
            dresses: [
                "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1594552072238-b8a3da72ae8a?auto=format&fit=crop&w=400&q=80"
            ]
        },
        {
            id: 5,
            name: "Armani Privé",
            country: "Italy",
            address: "Milan, Italy",
            basePrice: 20000,
            style: "Classic Tailoring",
            image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80",
            faceImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
            description: "Italian haute couture line focusing on fluid silhouettes, subtle beadwork, and sophisticated understated luxury.",
            leadDesigner: "Giorgio Armani",
            established: "2005",
            specialty: "Fluid Silk Drapes & Subdued Metallics",
            recommended: false,
            dresses: [
                "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"
            ]
        },
        {
            id: 6,
            name: "Alaïa House",
            country: "France",
            address: "Paris, France",
            basePrice: 11000,
            style: "Avant-Garde",
            image: "https://images.unsplash.com/photo-1594552072238-b8a3da72ae8a?auto=format&fit=crop&w=400&q=80",
            faceImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
            description: "Celebrated for sculptural knitwear and second-skin mastery that honors the natural geometry of the form.",
            leadDesigner: "Pieter Mulier",
            established: "1964",
            specialty: "Laser-cut Leather & Body-sculpting Fabrics",
            recommended: false,
            dresses: [
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80",
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80"
            ]
        }
    ];

    function renderCouturiers(items) {
        const grid = document.getElementById('couturiers-grid');
        if (!grid) return;

        if (items.length === 0) {
            grid.innerHTML = `<p class="search-desc" style="grid-column: span 2; text-align: center;">No royal couturiers match your specific filter criteria.</p>`;
            return;
        }

        grid.innerHTML = items.map(c => `
            <div class="couturier-card" onclick="openCouturierProfile('${c.name}')">
                <img src="${c.image}" alt="${c.name}" class="couturier-img">
                <div class="couturier-info">
                    ${c.recommended ? '<span class="badge-rec">★ Royal Recommendation</span>' : ''}
                    <h4 class="couturier-name">${c.name}</h4>
                    <div class="couturier-meta">${c.country} • From $${c.basePrice.toLocaleString()}</div>
                    <p class="couturier-desc">${c.description}</p>
                    <div class="profile-card-action">View Mini Profile →</div>
                </div>
            </div>
        `).join('');
    }

    renderCouturiers(couturiersDatabase);

    const applyCouturierFiltersBtn = document.getElementById('apply-couturier-filters');
    if (applyCouturierFiltersBtn) {
        applyCouturierFiltersBtn.addEventListener('click', () => {
            const query = document.getElementById('couturier-search-input').value.toLowerCase().trim();
            const country = document.getElementById('filter-country').value;
            const addressQuery = document.getElementById('filter-address').value.toLowerCase().trim();
            const maxPriceInput = document.getElementById('filter-max-price').value;
            const maxPrice = maxPriceInput ? parseFloat(maxPriceInput) : Infinity;
            const style = document.getElementById('filter-style').value;

            const filtered = couturiersDatabase.filter(c => {
                const matchesQuery = query === '' || c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query);
                const matchesCountry = country === 'all' || c.country === country;
                const matchesAddress = addressQuery === '' || c.address.toLowerCase().includes(addressQuery);
                const matchesPrice = c.basePrice <= maxPrice;
                const matchesStyle = style === 'all' || c.style === style;

                return matchesQuery && matchesCountry && matchesAddress && matchesPrice && matchesStyle;
            });

            renderCouturiers(filtered);
        });
    }

    window.openCouturierProfile = function(name) {
        const designer = couturiersDatabase.find(d => d.name === name);
        if (designer) {
            const profileContent = `
                <div class="profile-header-grid">
                    <img src="${designer.faceImage}" alt="${designer.leadDesigner}" class="designer-face-img">
                    <div class="profile-designer-meta">
                        <h4>${designer.leadDesigner}</h4>
                        <p>Master Couturier & Director</p>
                    </div>
                </div>

                <div class="profile-details-list">
                    <p><strong>Headquarters / Address:</strong> ${designer.address}</p>
                    <p><strong>Established Year:</strong> ${designer.established}</p>
                    <p><strong>Primary Specialty:</strong> ${designer.specialty}</p>
                    <p><strong>Base Investment:</strong> $${designer.basePrice.toLocaleString()} USD</p>
                    <p><strong>About House:</strong> ${designer.description}</p>
                </div>

                <div class="profile-gallery-title">Curated House Masterpieces</div>
                <div class="profile-gallery-grid">
                    <img src="${designer.dresses[0]}" alt="Masterpiece 1" class="profile-gallery-img">
                    <img src="${designer.dresses[1]}" alt="Masterpiece 2" class="profile-gallery-img">
                </div>
            `;
            
            showRoyalModal(designer.name, '', `
                <button class="primary-btn" onclick="selectDesignerAndSchedule('${designer.name}')">Schedule Consultation with ${designer.leadDesigner}</button>
            `, profileContent);
        }
    }

    window.selectDesignerAndSchedule = function(houseName) {
        document.getElementById('royal-modal-overlay').classList.add('hidden');
        
        navButtons.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        const schedulerBtn = document.querySelector('[data-target="scheduler"]');
        const schedulerSection = document.getElementById('scheduler');
        if (schedulerBtn) schedulerBtn.classList.add('active');
        if (schedulerSection) schedulerSection.classList.add('active');

        const selectEl = document.getElementById('schedule-couturier-select');
        if (selectEl) {
            selectEl.value = houseName;
        }

        updateBookedSlotsDisplay();
    }

    let scheduledBookingsRegistry = JSON.parse(localStorage.getItem('royal_bookings')) || {
        "Maison Elie Saab": { "2026-06-10": ["10:00 AM", "02:00 PM"] },
        "Atelier Dior Couture": { "2026-06-11": ["11:30 AM", "04:15 PM"] }
    };

    let selectedTimeSlot = null;
    const timeSlotButtons = document.querySelectorAll('.time-slot-btn');
    const scheduleDateInput = document.getElementById('schedule-date-input');
    const scheduleCouturierSelect = document.getElementById('schedule-couturier-select');

    timeSlotButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('booked')) return;
            timeSlotButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedTimeSlot = btn.getAttribute('data-time');
        });
    });

    function updateBookedSlotsDisplay() {
        const currentHouse = scheduleCouturierSelect ? scheduleCouturierSelect.value : '';
        const currentDate = scheduleDateInput ? scheduleDateInput.value : '';

        timeSlotButtons.forEach(btn => {
            btn.classList.remove('booked', 'selected');
        });
        selectedTimeSlot = null;

        if (currentHouse && currentDate && scheduledBookingsRegistry[currentHouse] && scheduledBookingsRegistry[currentHouse][currentDate]) {
            const bookedTimes = scheduledBookingsRegistry[currentHouse][currentDate];
            timeSlotButtons.forEach(btn => {
                const timeText = btn.getAttribute('data-time');
                if (bookedTimes.includes(timeText)) {
                    btn.classList.add('booked');
                }
            });
        }
    }

    if (scheduleDateInput) {
        scheduleDateInput.addEventListener('change', updateBookedSlotsDisplay);
    }
    if (scheduleCouturierSelect) {
        scheduleCouturierSelect.addEventListener('change', updateBookedSlotsDisplay);
    }

    const confirmBookingBtn = document.getElementById('confirm-booking-btn');
    if (confirmBookingBtn) {
        confirmBookingBtn.addEventListener('click', () => {
            const couturierHouse = scheduleCouturierSelect.value;
            const channel = document.getElementById('schedule-channel-select').value;
            const dateInput = scheduleDateInput.value;

            if (!dateInput) {
                showRoyalModal('Missing Date', 'Please select a calendar date for your consultation.');
                return;
            }

            if (!selectedTimeSlot) {
                showRoyalModal('Missing Time Slot', 'Please select an available time slot from the matrix.');
                return;
            }

            if (!scheduledBookingsRegistry[couturierHouse]) {
                scheduledBookingsRegistry[couturierHouse] = {};
            }
            if (!scheduledBookingsRegistry[couturierHouse][dateInput]) {
                scheduledBookingsRegistry[couturierHouse][dateInput] = [];
            }
            scheduledBookingsRegistry[couturierHouse][dateInput].push(selectedTimeSlot);
            localStorage.setItem('royal_bookings', JSON.stringify(scheduledBookingsRegistry));

            const summaryContainer = document.getElementById('booking-summary-card');
            summaryContainer.innerHTML = `
                <div class="active-ticket-box">
                    <h4>Confirmed Consultation Ticket</h4>
                    <p><strong>House:</strong> ${couturierHouse}</p>
                    <p><strong>Channel:</strong> ${channel}</p>
                    <p><strong>Date:</strong> ${dateInput}</p>
                    <p><strong>Time Slot:</strong> ${selectedTimeSlot}</p>
                    <p style="color: var(--gold-accent); font-weight: 600; margin-top: 0.75rem;">Status: Priority Secure Link Issued</p>
                </div>
            `;

            updateBookedSlotsDisplay();
            showRoyalModal('Consultation Confirmed', `Your appointment with ${couturierHouse} via ${channel} on ${dateInput} at ${selectedTimeSlot} has been successfully logged and locked on the schedule.`);
        });
    }

    // --- Live Leaflet Map & Courier Tracking Implementation ---
    const shipmentsDatabase = {
        "ROYAL-9821-PARIS": {
            courier: "Jean-Luc Moreau (Secure Armored Transit)",
            eta: "Today, 4:45 PM",
            route: "Atelier Vault Paris → Private Residence London",
            status: "In Transit (Live GPS)",
            startCoords: [48.8566, 2.3522], // Paris
            endCoords: [51.5074, -0.1278],   // London
            currentCoords: [50.1500, 1.1000]   // English Channel midway
        },
        "COURT-4432-MILAN": {
            courier: "Matteo Rossi (Express Alpine Courier)",
            eta: "Tomorrow, 10:00 AM",
            route: "Armani Privé Milan → Villa Geneva",
            status: "Clearing Customs Checkpoint",
            startCoords: [45.4642, 9.1900],   // Milan
            endCoords: [46.2044, 6.1432],    // Geneva
            currentCoords: [45.9000, 7.8000]   // Alps midway
        }
    };

    let royalMap = null;
    let packageMarker = null;
    let routePolyline = null;

    function initRoyalMap(start, current, end) {
        const mapContainer = document.getElementById('royal-map');
        if (!mapContainer) return;

        if (!royalMap) {
            royalMap = L.map('royal-map', { zoomControl: true }).setView(current, 6);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(royalMap);
        } else {
            royalMap.setView(current, 6);
        }

        // Clear existing markers/polylines
        if (packageMarker) royalMap.removeLayer(packageMarker);
        if (routePolyline) royalMap.removeLayer(routePolyline);

        // Draw Route Line
        routePolyline = L.polyline([start, end], { color: '#1b263b', weight: 3, dashArray: '5, 5' }).addTo(royalMap);

        // Custom Package HTML Icon
        const packageIcon = L.divIcon({
            className: '',
            html: '<div class="custom-package-marker" style="width: 36px; height: 36px;">📦</div>',
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });

        packageMarker = L.marker(current, { icon: packageIcon }).addTo(royalMap);
        packageMarker.bindPopup("<b>Bespoke Couture Package</b><br>Live GPS Active").openPopup();

        royalMap.fitBounds(routePolyline.getBounds(), { padding: [40, 40] });
    }

    // Initialize default map on load
    const defaultShipment = shipmentsDatabase["ROYAL-9821-PARIS"];
    setTimeout(() => {
        initRoyalMap(defaultShipment.startCoords, defaultShipment.currentCoords, defaultShipment.endCoords);
    }, 300);

    const trackCodeBtn = document.getElementById('track-code-btn');
    const trackingCodeInput = document.getElementById('tracking-code-input');
    const sampleCodeChips = document.querySelectorAll('.sample-code-chip');

    function lookupShipment(code) {
        const cleanCode = code.trim().toUpperCase();
        const shipment = shipmentsDatabase[cleanCode];

        if (shipment) {
            if (trackingCodeInput) trackingCodeInput.value = cleanCode;
            
            document.getElementById('ship-status-text').textContent = shipment.status;
            document.getElementById('ship-courier-name').textContent = shipment.courier;
            document.getElementById('ship-eta').textContent = shipment.eta;
            document.getElementById('ship-route').textContent = shipment.route;

            initRoyalMap(shipment.startCoords, shipment.currentCoords, shipment.endCoords);
            showRoyalModal('Tracking Success', `Shipment telemetry located for tracking code: ${cleanCode}`);
        } else {
            showRoyalModal('Tracking Code Not Found', `No active royal courier entry matches code "${cleanCode}". Please try sample codes like ROYAL-9821-PARIS or COURT-4432-MILAN.`);
        }
    }

    if (trackCodeBtn) {
        trackCodeBtn.addEventListener('click', () => {
            if (trackingCodeInput) lookupShipment(trackingCodeInput.value);
        });
    }

    sampleCodeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const code = chip.getAttribute('data-code');
            lookupShipment(code);
        });
    });
    function applyCoupon() {
  const code = document.getElementById('coupon-code').value;
  if (code === "ROYAL10") {
    document.getElementById('final-total').innerText = "$135.00";
    alert("Coupon applied!");
  } else {
    alert("Invalid code.");
  }
}

document.getElementById('royal-checkout-form').addEventListener('submit', (e) => {
  e.preventDefault();
  alert("Processing your secure Royal payment...");
});
});