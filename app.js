document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication Flow Logic ---
    const authOverlay = document.getElementById('auth-modal-overlay');
    const mainHeader = document.getElementById('main-header');
    const mainContentWrapper = document.getElementById('main-content-wrapper');

    const goSigninBtn = document.getElementById('go-signin-btn');
    const goSignupBtn = document.getElementById('go-signup-btn');
    const authModeChoice = document.getElementById('auth-mode-choice');
    const signinForm = document.getElementById('signin-form');
    const signupStep1Form = document.getElementById('signup-step1-form');
    const signupStep2Form = document.getElementById('signup-step2-form');

    const authHeading = document.getElementById('auth-heading');
    const authSubtitle = document.getElementById('auth-subtitle');

    window.resetAuthScreen = function() {
        authHeading.textContent = "Welcome. Would you like to sign in or sign up?";
        authSubtitle.textContent = "Enter your credentials or register a royal profile.";
        authModeChoice.classList.remove('hidden');
        signinForm.classList.add('hidden');
        signupStep1Form.classList.add('hidden');
        signupStep2Form.classList.add('hidden');
        document.getElementById('verification-group').classList.add('hidden');
    }

    if (goSigninBtn) {
        goSigninBtn.addEventListener('click', () => {
            authHeading.textContent = "Sign In";
            authSubtitle.textContent = "Retrieve your user profile & design data.";
            authModeChoice.classList.add('hidden');
            signinForm.classList.remove('hidden');
        });
    }

    if (goSignupBtn) {
        goSignupBtn.addEventListener('click', () => {
            authHeading.textContent = "Sign Up";
            authSubtitle.textContent = "Enter your phone number or email to receive confirmation code.";
            authModeChoice.classList.add('hidden');
            signupStep1Form.classList.remove('hidden');
        });
    }

    // Sign In Submit Handler
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const identifier = document.getElementById('signin-identifier').value.trim();
            if (identifier) {
                localStorage.setItem('royal_user_identifier', identifier);
                localStorage.setItem('royal_is_new_user', 'false');
                completeAuthenticationFlow(false);
            }
        });
    }

    // Sign Up Step 1: Send Code Simulation
    const sendCodeBtn = document.getElementById('send-code-btn');
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', () => {
            const identifier = document.getElementById('signup-identifier').value.trim();
            if (identifier) {
                showRoyalModal('Verification Code', 'A 6-digit confirmation code has been dispatched to your identifier. (Simulated code: 123456)');
                document.getElementById('verification-group').classList.remove('hidden');
            } else {
                showRoyalModal('Input Required', 'Please enter a valid phone number or email first.');
            }
        });
    }

    // Sign Up Step 1 Code Verification Submit
    if (signupStep1Form) {
        signupStep1Form.addEventListener('submit', (e) => {
            e.preventDefault();
            const codeInput = document.getElementById('signup-code-input').value.trim();
            if (codeInput === '123456' || codeInput.length === 6) {
                signupStep1Form.classList.add('hidden');
                signupStep2Form.classList.remove('hidden');
                authHeading.textContent = "Create Password";
                authSubtitle.textContent = "Secure your new account.";
            } else {
                showRoyalModal('Invalid Code', 'Please enter the correct verification code (e.g. 123456).');
            }
        });
    }

    // Sign Up Step 2: Password Creation & Validation
    if (signupStep2Form) {
        signupStep2Form.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('signup-new-password').value;
            
            // Password validation: minimum 7 characters, requires letters and numbers
            const hasMinLength = password.length >= 7;
            const hasLetters = /[a-zA-Z]/.test(password);
            const hasNumbers = /[0-9]/.test(password);

            if (hasMinLength && hasLetters && hasNumbers) {
                const identifier = document.getElementById('signup-identifier').value.trim();
                localStorage.setItem('royal_user_identifier', identifier);
                localStorage.setItem('royal_is_new_user', 'true');
                completeAuthenticationFlow(true);
            } else {
                showRoyalModal('Weak Password', 'Password must be at least 7 characters long and contain both letters and numbers.');
            }
        });
    }

    function completeAuthenticationFlow(isNewUser) {
        authOverlay.classList.add('hidden');
        mainHeader.classList.remove('hidden-header');
        mainContentWrapper.classList.remove('blurred-main');

        if (isNewUser) {
            showRoyalModal('Welcome', 'Welcome. Let’s start customizing your dream dress', `
                <button class="primary-btn" onclick="triggerNewUserMiniSurvey()">Ok</button>
            `);
        } else {
            showRoyalModal('Welcome Back', 'Welcome back. Let’s pick up where you left off of.', `
                <button class="primary-btn" onclick="document.getElementById('royal-modal-overlay').classList.add('hidden')">Ok</button>
            `);
        }
    }

    window.triggerNewUserMiniSurvey = function() {
        document.getElementById('royal-modal-overlay').classList.add('hidden');
        showRoyalModal('Recommendation Survey', 'To personalize your dress recommendations, what is your preferred ceremonial silhouette?', `
            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.5rem;">
                <button class="primary-btn" onclick="saveSurveyPref('Ballgown & Plus')">Imperial Ballgown & Plus</button>
                <button class="primary-btn" onclick="saveSurveyPref('Classic Lace')">Classic Lace & A-Line</button>
                <button class="primary-btn" onclick="saveSurveyPref('Grandeur & Drama')">High Grandeur & Drama</button>
            </div>
        `);
    }

    window.saveSurveyPref = function(prefStyle) {
        localStorage.setItem('royal_user_survey_pref', prefStyle);
        document.getElementById('royal-modal-overlay').classList.add('hidden');
        showRoyalModal('Survey Complete', `Preferences saved! We have tailored recommendations for style "${prefStyle}".`);
    }

    // --- Tab Navigation with Animated Transitions ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);

            if (targetSection && !targetSection.classList.contains('active')) {
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                sections.forEach(s => {
                    if (s.classList.contains('active')) {
                        s.style.opacity = '0';
                        s.style.transform = 'translateY(-10px)';
                        setTimeout(() => {
                            s.classList.remove('active');
                            s.style.opacity = '';
                            s.style.transform = '';
                        }, 200);
                    }
                });

                setTimeout(() => {
                    targetSection.classList.add('active');
                    if (targetId === 'profile') {
                        loadUserProfileData();
                    }
                    if (targetId === 'tracker' && window.royalMapInstance) {
                        setTimeout(() => { window.royalMapInstance.invalidateSize(); }, 200);
                    }
                }, 200);
            }
        });
    });

    // Modal Utility
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
            actions.innerHTML = `<button class="primary-btn" onclick="document.getElementById('royal-modal-overlay').classList.add('hidden')">Ok</button>`;
        }
        modalOverlay.classList.remove('hidden');
    }

    // Color Wheel Sync
    const colorWheel = document.getElementById('opt-color-wheel');
    const colorHexLabel = document.getElementById('color-hex-label');
    if (colorWheel && colorHexLabel) {
        colorWheel.addEventListener('input', (e) => {
            const hexVal = e.target.value.toUpperCase();
            colorHexLabel.textContent = `${hexVal} (Custom Hue)`;
        });
    }

    // Camera and Gallery Handling in Customize Tab
    const cameraInput = document.getElementById('camera-capture-input');
    const galleryInput = document.getElementById('gallery-upload-input');
    const triggerCameraBtn = document.getElementById('trigger-camera-btn');
    const triggerGalleryBtn = document.getElementById('trigger-gallery-btn');
    const liveCameraContainer = document.getElementById('live-camera-container');
    const cameraStreamVideo = document.getElementById('camera-stream-video');
    const cameraSnapshotCanvas = document.getElementById('camera-snapshot-canvas');
    const captureSnapshotBtn = document.getElementById('capture-snapshot-btn');
    const closeCameraBtn = document.getElementById('close-camera-btn');
    let activeMediaStream = null;

    // Image Categorized Search
    const imageSearchInput = document.getElementById('image-search-input');
    const imageSearchBtn = document.getElementById('image-search-btn');

    if (imageSearchBtn) {
        imageSearchBtn.addEventListener('click', () => {
            const query = imageSearchInput.value.trim().toLowerCase();
            if (query) {
                filterInspirationGallery(query);
            } else {
                resetInspirationGallery();
            }
        });
    }

    function filterInspirationGallery(query) {
        const resultsGrid = document.getElementById('image-search-results');
        const cards = resultsGrid.querySelectorAll('.inspiration-card');
        cards.forEach(card => {
            const title = card.getAttribute('data-title').toLowerCase();
            const category = card.getAttribute('data-category').toLowerCase();
            if (title.includes(query) || category.includes(query)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    function resetInspirationGallery() {
        const cards = document.querySelectorAll('#image-search-results .inspiration-card');
        cards.forEach(c => c.classList.remove('hidden'));
    }

    if (triggerCameraBtn) {
        triggerCameraBtn.addEventListener('click', async () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    activeMediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                    cameraStreamVideo.srcObject = activeMediaStream;
                    liveCameraContainer.classList.remove('hidden');
                } catch (err) {
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
            showRoyalModal('AI Categorization Complete', 'Captured dress reference frame successfully! Categorized under Ballgown & Grandeur.');
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
            activeMediaStream.getTracks().forEach(t => t.stop());
            activeMediaStream = null;
        }
    }

    if (triggerGalleryBtn) {
        triggerGalleryBtn.addEventListener('click', () => {
            if (galleryInput) galleryInput.click();
        });
    }

    if (galleryInput) {
        galleryInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                showRoyalModal('Gallery Upload', 'Reference dress image successfully loaded and categorized into matching style database.');
            }
        });
    }

    // --- Sizing Tab & Unit Conversion Logic ---
    const startAiScanBtn = document.getElementById('start-ai-scan-btn');
    const aiScanPreviewBox = document.getElementById('ai-scan-preview-box');
    let aiBodyVideo = document.getElementById('ai-body-video');
    let aiScanStream = null;

    if (startAiScanBtn) {
        startAiScanBtn.addEventListener('click', async () => {
            try {
                aiScanStream = await navigator.mediaDevices.getUserMedia({ video: true });
                document.getElementById('ai-scan-placeholder-content').classList.add('hidden');
                aiBodyVideo.classList.remove('hidden');
                aiBodyVideo.srcObject = aiScanStream;

                showRoyalModal('AI Body Scan Active', 'Scanning body proportions and estimating custom sizing...');
                setTimeout(() => {
                    // Populate estimated AI sizing
                    document.getElementById('measure-height').value = "66.5";
                    document.getElementById('measure-bust').value = "34.0";
                    document.getElementById('measure-shoulders').value = "15.5";
                    document.getElementById('measure-waist').value = "26.5";
                    document.getElementById('measure-hips').value = "37.0";
                    document.getElementById('measure-arms').value = "23.0";

                    if (aiScanStream) {
                        aiScanStream.getTracks().forEach(t => t.stop());
                    }
                    aiBodyVideo.classList.add('hidden');
                    document.getElementById('ai-scan-placeholder-content').classList.remove('hidden');

                    showRoyalModal('Scan Successful', 'AI body scan completed! Estimated dimensions populated in measurement fields.');
                }, 4000);
            } catch (err) {
                showRoyalModal('Camera Notice', 'Simulating AI body scan telemetry based on baseline configuration.');
                document.getElementById('measure-height').value = "66.0";
                document.getElementById('measure-bust').value = "34.0";
                document.getElementById('measure-shoulders').value = "16.0";
                document.getElementById('measure-waist').value = "26.0";
                document.getElementById('measure-hips').value = "36.0";
                document.getElementById('measure-arms').value = "22.5";
            }
        });
    }

    // Unit Conversion Handling (Inches vs Centimeters)
    const measurementUnitSelect = document.getElementById('measurement-unit-select');
    let currentUnit = 'inches';

    if (measurementUnitSelect) {
        measurementUnitSelect.addEventListener('change', (e) => {
            const newUnit = e.target.value;
            const ids = ['measure-height', 'measure-bust', 'measure-shoulders', 'measure-waist', 'measure-hips', 'measure-arms'];
            
            ids.forEach(id => {
                const inputEl = document.getElementById(id);
                if (inputEl && inputEl.value !== '') {
                    let val = parseFloat(inputEl.value);
                    if (!isNaN(val)) {
                        if (currentUnit === 'inches' && newUnit === 'cm') {
                            val = val * 2.54; // convert inches to cm
                        } else if (currentUnit === 'cm' && newUnit === 'inches') {
                            val = val / 2.54; // convert cm to inches
                        }
                        inputEl.value = val.toFixed(1);
                    }
                }
            });
            currentUnit = newUnit;
        });
    }

    const saveSizingBtn = document.getElementById('save-sizing-btn');
    if (saveSizingBtn) {
        saveSizingBtn.addEventListener('click', () => {
            const sizingData = {
                unit: currentUnit,
                height: document.getElementById('measure-height').value,
                bust: document.getElementById('measure-bust').value,
                shoulders: document.getElementById('measure-shoulders').value,
                waist: document.getElementById('measure-waist').value,
                hips: document.getElementById('measure-hips').value,
                arms: document.getElementById('measure-arms').value,
                timestamp: new Date().toLocaleString()
            };
            localStorage.setItem('royal_custom_sizing', JSON.stringify(sizingData));
            showRoyalModal('Sizing Saved', 'Your customized body sizing has been successfully saved and synced to your dossier.');
        });
    }

    // Save Design Configuration
    const saveDesignBtn = document.getElementById('save-design-btn');
    if (saveDesignBtn) {
        saveDesignBtn.addEventListener('click', () => {
            const config = {
                fabric: document.getElementById('opt-fabric').value,
                colorHex: colorWheel ? colorWheel.value.toUpperCase() : '#C5A059',
                colorName: colorHexLabel ? colorHexLabel.textContent : '#C5A059 (Royal Gold)',
                embellishment: document.getElementById('opt-embellishment').value,
                neckline: document.getElementById('opt-neckline').value,
                skirt: document.getElementById('opt-skirt').value,
                timestamp: new Date().toLocaleString()
            };

            localStorage.setItem('royal_atelier_config', JSON.stringify(config));
            const statusLabel = document.getElementById('dispatch-status-label');
            const timestampLabel = document.getElementById('dispatch-timestamp');
            if (statusLabel) statusLabel.textContent = 'Synced & Ready for Designer Transmission';
            if (timestampLabel) timestampLabel.textContent = config.timestamp;

            showRoyalModal('Configuration Preserved', 'Your bespoke design specifications have been successfully saved and synced to Your Order!', `
                <button class="primary-btn" onclick="navigateToOrderTab()">View Your Order</button>
            `);
        });
    }

    window.navigateToOrderTab = function() {
        document.getElementById('royal-modal-overlay').classList.add('hidden');
        const profileBtn = document.querySelector('[data-target="profile"]');
        if (profileBtn) profileBtn.click();
    }

    window.loadUserProfileData = function() {
        const savedDataRaw = localStorage.getItem('royal_atelier_config');
        const savedSizingRaw = localStorage.getItem('royal_custom_sizing');
        const specsDisplay = document.getElementById('profile-specs-display');
        const statusLabel = document.getElementById('dispatch-status-label');
        const timestampLabel = document.getElementById('dispatch-timestamp');

        if (!specsDisplay) return;

        let htmlContent = '';
        if (savedDataRaw) {
            const config = JSON.parse(savedDataRaw);
            if (statusLabel) statusLabel.textContent = 'Synced & Ready for Designer Transmission';
            if (timestampLabel) timestampLabel.textContent = config.timestamp;

            htmlContent += `
                <div class="profile-spec-item"><span class="profile-spec-label">Fabric</span> <span>${config.fabric}</span></div>
                <div class="profile-spec-item"><span class="profile-spec-label">Color Hue</span> <span style="display:inline-flex; align-items:center; gap:0.5rem;"><span style="width:12px;height:12px;background:${config.colorHex};border:1px solid #b89753;display:inline-block;"></span>${config.colorName}</span></div>
                <div class="profile-spec-item"><span class="profile-spec-label">Embellishment</span> <span>${config.embellishment}</span></div>
                <div class="profile-spec-item"><span class="profile-spec-label">Neckline</span> <span>${config.neckline}</span></div>
                <div class="profile-spec-item"><span class="profile-spec-label">Skirt Style</span> <span>${config.skirt}</span></div>
            `;
        }

        if (savedSizingRaw) {
            const sizing = JSON.parse(savedSizingRaw);
            htmlContent += `
                <div style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;">
                    <p style="font-weight: 600; font-size: 0.8rem; text-transform: uppercase; color: var(--accent-color);">Custom Sizing (${sizing.unit})</p>
                    <div class="profile-spec-item"><span class="profile-spec-label">Height</span> <span>${sizing.height || 'N/A'}</span></div>
                    <div class="profile-spec-item"><span class="profile-spec-label">Bust</span> <span>${sizing.bust || 'N/A'}</span></div>
                    <div class="profile-spec-item"><span class="profile-spec-label">Waist</span> <span>${sizing.waist || 'N/A'}</span></div>
                    <div class="profile-spec-item"><span class="profile-spec-label">Hips</span> <span>${sizing.hips || 'N/A'}</span></div>
                </div>
            `;
        }

        if (htmlContent === '') {
            specsDisplay.innerHTML = `<p class="search-desc">No customized design saved yet. Visit the <strong>Customize</strong> tab to configure your gown.</p>`;
        } else {
            specsDisplay.innerHTML = htmlContent;
        }
    }

    if (localStorage.getItem('royal_atelier_config')) {
        loadUserProfileData();
    }

    // --- Explore Designers Database with Provided URLs & Mini Profiles ---
    const couturiersDatabase = [
        {
            id: 1,
            name: "Stacees Atelier",
            country: "United States",
            address: "500 Fashion Ave, New York, NY",
            email: "concierge@stacees-atelier.com",
            phone: "+1 (800) 555-0192",
            basePrice: 12000,
            style: "Ballgown & Plus",
            image: "https://cdn-5.stacees.co.uk/static/2025/1/nav/brides/wedding-plus.jpg",
            faceImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            description: "Master house specializing in majestic ballgowns and plus-size bridal elegance with breathtaking detail.",
            leadDesigner: "Elena Vance",
            established: "2010",
            specialty: "Plus-size Grandeur & Structured Ballgowns",
            recommended: true,
            dresses: [
                "https://cdn-5.stacees.co.uk/static/2025/1/nav/brides/wedding-plus.jpg",
                "https://naamanatbridal.com/wp-content/uploads/2023/10/8-1-scaled.jpg"
            ]
        },
        {
            id: 2,
            name: "Naama Anat Couture",
            country: "France",
            address: "12 Rue de la Paix, Paris, France",
            email: "atelier@naamanatbridal.com",
            phone: "+33 1 42 68 55 00",
            basePrice: 18000,
            style: "Classic Lace",
            image: "https://naamanatbridal.com/wp-content/uploads/2023/10/8-1-scaled.jpg",
            faceImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
            description: "Legendary European atelier known for delicate French Chantilly lace and timeless romance.",
            leadDesigner: "Naama Anat",
            established: "2005",
            specialty: "Chantilly Lace Masterpieces",
            recommended: true,
            dresses: [
                "https://naamanatbridal.com/wp-content/uploads/2023/10/8-1-scaled.jpg",
                "https://cdn0.hitched.co.uk/article/5818/original/1280/png/128185-suzanne-neville-corset-lace-wellesley-wedding-dress.jpeg"
            ]
        },
        {
            id: 3,
            name: "Pinterest Royal House",
            country: "United Kingdom",
            address: "44 Kensington High St, London, UK",
            email: "studio@pinterest-royal.co.uk",
            phone: "+44 20 7946 0912",
            basePrice: 15000,
            style: "Grandeur & Drama",
            image: "https://i.pinimg.com/originals/27/03/cd/2703cdff400293df708f23a4d43c57d7.jpg",
            faceImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
            description: "Avant-garde design house creating high-drama silhouettes for royal ceremonies across the globe.",
            leadDesigner: "Julian Sterling",
            established: "2015",
            specialty: "Dramatic Trains & Architectural Drapery",
            recommended: false,
            dresses: [
                "https://i.pinimg.com/originals/27/03/cd/2703cdff400293df708f23a4d43c57d7.jpg",
                "https://greenweddingshoes.com/wp-content/uploads/2023/07/timeless-off-the-shoulder-elegant-wedding-dresses-with-high-leg-slit-thumb.jpg"
            ]
        },
        {
            id: 4,
            name: "Green Wedding Shoes Atelier",
            country: "United States",
            address: "880 Coast Village Rd, Santa Barbara, CA",
            email: "concierge@greenweddingshoes.com",
            phone: "+1 (805) 555-8831",
            basePrice: 9500,
            style: "Modern Slit & Elegance",
            image: "https://greenweddingshoes.com/wp-content/uploads/2023/07/timeless-off-the-shoulder-elegant-wedding-dresses-with-high-leg-slit-thumb.jpg",
            faceImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
            description: "Contemporary bridal house celebrated for off-the-shoulder designs and modern high-leg slits.",
            leadDesigner: "Jen Campbell",
            established: "2012",
            specialty: "Off-the-Shoulder & Slit Elegance",
            recommended: true,
            dresses: [
                "https://greenweddingshoes.com/wp-content/uploads/2023/07/timeless-off-the-shoulder-elegant-wedding-dresses-with-high-leg-slit-thumb.jpg",
                "https://mireasamoderna.com/wp-content/uploads/2023/05/Geranium-1-edited-scaled.jpg"
            ]
        },
        {
            id: 5,
            name: "Mireasa Moderna",
            country: "Italy",
            address: "Via Montenapoleone 8, Milan, Italy",
            email: "info@mireasamoderna.com",
            phone: "+39 02 7600 1122",
            basePrice: 16000,
            style: "Classic Lace",
            image: "https://mireasamoderna.com/wp-content/uploads/2023/05/Geranium-1-edited-scaled.jpg",
            faceImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
            description: "Italian master tailor specializing in graceful floral appliques and flowing silhouettes.",
            leadDesigner: "Matteo Rossi",
            established: "1998",
            specialty: "Floral Applique & Silk Organza",
            recommended: false,
            dresses: [
                "https://mireasamoderna.com/wp-content/uploads/2023/05/Geranium-1-edited-scaled.jpg",
                "https://cdn0.hitched.co.uk/article/5818/original/1280/png/128185-suzanne-neville-corset-lace-wellesley-wedding-dress.jpeg"
            ]
        },
        {
            id: 6,
            name: "Suzanne Neville House",
            country: "United Kingdom",
            address: "23 Granger St, London, UK",
            email: "bespoke@suzanneneville.com",
            phone: "+44 20 7823 9123",
            basePrice: 21000,
            style: "Grandeur & Drama",
            image: "https://cdn0.hitched.co.uk/article/5818/original/1280/png/128185-suzanne-neville-corset-lace-wellesley-wedding-dress.jpeg",
            faceImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
            description: "World-renowned British designer famous for exquisite corsetry and structured luxury silhouettes.",
            leadDesigner: "Suzanne Neville",
            established: "1991",
            specialty: "Handcrafted Corsetry & Lace Wellesley Gowns",
            recommended: true,
            dresses: [
                "https://cdn0.hitched.co.uk/article/5818/original/1280/png/128185-suzanne-neville-corset-lace-wellesley-wedding-dress.jpeg",
                "https://cdn-5.stacees.co.uk/static/2025/1/nav/brides/wedding-plus.jpg"
            ]
        },
        {
            id: 7,
            name: "Cinderella Divine",
            country: "United States",
            address: "1100 S Hope St, Los Angeles, CA",
            email: "support@abcfashion.net",
            phone: "+1 (213) 555-4920",
            basePrice: 4500,
            style: "Ballgown & Plus",
            image: "https://www.abcfashion.net/cdn/shop/products/glitter-print-mermaid-dress-by-cinderella-divine-j810-long-formal-dresses-cinderella-divine-2-smoky-blue-815190.jpg?v=1696790391&width=900",
            faceImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            description: "Sparkling glitter print mermaid and formal evening gowns designed for unforgettable entrances.",
            leadDesigner: "Divine Team",
            established: "2014",
            specialty: "Glitter Print & Mermaid Silhouettes",
            recommended: false,
            dresses: [
                "https://www.abcfashion.net/cdn/shop/products/glitter-print-mermaid-dress-by-cinderella-divine-j810-long-formal-dresses-cinderella-divine-2-smoky-blue-815190.jpg?v=1696790391&width=900",
                "https://www.abcfashion.net/cdn/shop/files/A1369_PARIS--BLUE_1.jpg?v=1734640057&width=900"
            ]
        },
        {
            id: 8,
            name: "Parisian Bridal Co.",
            country: "France",
            address: "75001 Paris, France",
            email: "contact@parisianbridal.fr",
            phone: "+33 1 40 50 60 70",
            basePrice: 14000,
            style: "Modern Slit & Elegance",
            image: "https://www.abcfashion.net/cdn/shop/files/A1369_PARIS--BLUE_1.jpg?v=1734640057&width=900",
            faceImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
            description: "Chic Parisian house offering stunning evening and bridal wear with sophisticated color tones.",
            leadDesigner: "Henri Dupont",
            established: "2018",
            specialty: "Parisian Blue & Flowing Silhouettes",
            recommended: false,
            dresses: [
                "https://www.abcfashion.net/cdn/shop/files/A1369_PARIS--BLUE_1.jpg?v=1734640057&width=900",
                "https://i.pinimg.com/originals/27/03/cd/2703cdff400293df708f23a4d43c57d7.jpg"
            ]
        }
    ];

    function renderCouturiers(items) {
        const grid = document.getElementById('couturiers-grid');
        if (!grid) return;

        if (items.length === 0) {
            grid.innerHTML = `<p class="search-desc" style="grid-column: span 2; text-align: center;">No designers match your specific filter criteria.</p>`;
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
            const maxPriceInput = document.getElementById('filter-max-price').value;
            const maxPrice = maxPriceInput ? parseFloat(maxPriceInput) : Infinity;
            const style = document.getElementById('filter-style').value;

            const filtered = couturiersDatabase.filter(c => {
                const matchesQuery = query === '' || c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query);
                const matchesCountry = country === 'all' || c.country === country;
                const matchesPrice = c.basePrice <= maxPrice;
                const matchesStyle = style === 'all' || c.style === style;

                return matchesQuery && matchesCountry && matchesPrice && matchesStyle;
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
                    <p><strong>Headshot:</strong> Verified Atelier Director</p>
                    <p><strong>Name:</strong> ${designer.leadDesigner}</p>
                    <p><strong>Contact Information:</strong> ${designer.phone}</p>
                    <p><strong>Email Address:</strong> ${designer.email}</p>
                    <p><strong>Headquarters Address:</strong> ${designer.address}</p>
                    <p><strong>Established Year:</strong> ${designer.established}</p>
                    <p><strong>Primary Specialty:</strong> ${designer.specialty}</p>
                    <p><strong>Base Investment:</strong> $${designer.basePrice.toLocaleString()} USD</p>
                    <p><strong>About House:</strong> ${designer.description}</p>
                </div>

                <div class="profile-gallery-title">Pictures of Their Dresses and Work</div>
                <div class="profile-gallery-grid">
                    <img src="${designer.dresses[0]}" alt="Masterpiece 1" class="profile-gallery-img">
                    <img src="${designer.dresses[1]}" alt="Masterpiece 2" class="profile-gallery-img">
                </div>
            `;
            
            showRoyalModal(designer.name, '', `
                <button class="primary-btn" onclick="selectDesignerAndSchedule('${designer.name}')">Schedule Consultation & Dispatch Dossier to ${designer.leadDesigner}</button>
            `, profileContent);
        }
    }

    window.selectDesignerAndSchedule = function(houseName) {
        document.getElementById('royal-modal-overlay').classList.add('hidden');
        
        navButtons.forEach(b => b.classList.remove('active'));
        sections.forEach(s => {
            s.classList.remove('active');
            s.style.opacity = '';
            s.style.transform = '';
        });
        
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

    // --- Consultation & Booking Logic ---
    let scheduledBookingsRegistry = JSON.parse(localStorage.getItem('royal_bookings')) || {
        "Stacees Atelier": { "2026-06-10": ["10:00 AM", "02:00 PM"] },
        "Naama Anat Couture": { "2026-06-11": ["11:30 AM", "04:15 PM"] }
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

    if (scheduleDateInput) scheduleDateInput.addEventListener('change', updateBookedSlotsDisplay);
    if (scheduleCouturierSelect) scheduleCouturierSelect.addEventListener('change', updateBookedSlotsDisplay);

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

            const savedConfigRaw = localStorage.getItem('royal_atelier_config');
            const customConfigSummary = savedConfigRaw ? JSON.parse(savedConfigRaw) : { fabric: 'Standard', neckline: 'Standard' };

            const summaryContainer = document.getElementById('booking-summary-card');
            summaryContainer.innerHTML = `
                <div class="active-ticket-box">
                    <h4>Confirmed Consultation Ticket</h4>
                    <p><strong>House:</strong> ${couturierHouse}</p>
                    <p><strong>Channel:</strong> ${channel}</p>
                    <p><strong>Date:</strong> ${dateInput}</p>
                    <p><strong>Time Slot:</strong> ${selectedTimeSlot}</p>
                    <p><strong>Dispatched Dossier:</strong> ${customConfigSummary.fabric} (${customConfigSummary.neckline})</p>
                    <p style="color: var(--gold-accent); font-weight: 600; margin-top: 0.5rem;">Status: Dossier Securely Delivered to Designer</p>
                </div>
            `;

            updateBookedSlotsDisplay();
            showRoyalModal('Consultation Confirmed & Dossier Dispatched', `Your appointment with ${couturierHouse} via ${channel} on ${dateInput} at ${selectedTimeSlot} has been locked. Your custom atelier dossier and sizing have been securely encrypted and dispatched to the designer.`);
        });
    }

    // --- Live Leaflet Map & Courier Tracking Implementation ---
    const shipmentsDatabase = {
        "ROYAL-9821-PARIS": {
            courier: "Jean-Luc Moreau (Secure Armored Transit)",
            eta: "Today, 4:45 PM",
            route: "Atelier Vault Paris → Private Residence London",
            status: "In Transit (Live GPS)",
            startCoords: [48.8566, 2.3522],
            endCoords: [51.5074, -0.1278],
            currentCoords: [50.1500, 1.1000]
        },
        "COURT-4432-MILAN": {
            courier: "Matteo Rossi (Express Alpine Courier)",
            eta: "Tomorrow, 10:00 AM",
            route: "Armani Privé Milan → Villa Geneva",
            status: "Clearing Customs Checkpoint",
            startCoords: [45.4642, 9.1900],
            endCoords: [46.2044, 6.1432],
            currentCoords: [45.9000, 7.8000]
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
            window.royalMapInstance = royalMap;
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(royalMap);
        } else {
            royalMap.setView(current, 6);
        }

        if (packageMarker) royalMap.removeLayer(packageMarker);
        if (routePolyline) royalMap.removeLayer(routePolyline);

        routePolyline = L.polyline([start, end], { color: '#1a1a1a', weight: 2, dashArray: '4, 4' }).addTo(royalMap);

        const packageIcon = L.divIcon({
            className: '',
            html: '<div class="custom-package-marker" style="width: 32px; height: 32px;">📦</div>',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        packageMarker = L.marker(current, { icon: packageIcon }).addTo(royalMap);
        packageMarker.bindPopup("<b>Bespoke Couture Package</b><br>Live GPS Active").openPopup();

        royalMap.fitBounds(routePolyline.getBounds(), { padding: [30, 30] });
    }

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
            showRoyalModal('Tracking Code Not Found', `No active royal courier entry matches code "${cleanCode}".`);
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

    window.applyCoupon = function() {
        const codeInput = document.getElementById('coupon-code');
        const code = codeInput ? codeInput.value.trim() : '';
        if (code === "ROYAL10") {
            const finalTotal = document.getElementById('final-total');
            if (finalTotal) finalTotal.innerText = "$135.00";
            showRoyalModal('Coupon Applied', 'Your 10% royal privilege discount has been applied successfully.');
        } else {
            showRoyalModal('Invalid Code', 'The coupon code entered is not valid for this transaction.');
        }
    }

    const checkoutForm = document.getElementById('royal-checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showRoyalModal('Payment Processing', 'Processing your secure Royal payment through verified encrypted channels...');
        });
    }
});