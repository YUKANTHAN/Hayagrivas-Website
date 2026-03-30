document.addEventListener('DOMContentLoaded', () => {
    // Preloader Logic (Session-Based)
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        // If already shown in this session, hide immediately
        if (sessionStorage.getItem('preloaderShown')) {
            preloader.style.display = 'none';
        } else {
            const minDisplayTime = 800; // Reduced for a snappier feel
            const startTime = Date.now();

            window.addEventListener('load', () => {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

                setTimeout(() => {
                    preloader.classList.add('hidden');
                    sessionStorage.setItem('preloaderShown', 'true');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 500);
                }, remainingTime);
            });

            // Fallback
            setTimeout(() => {
                if (!preloader.classList.contains('hidden')) {
                    preloader.classList.add('hidden');
                    sessionStorage.setItem('preloaderShown', 'true');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 1200);
                }
            }, 5000);
        }
    }

    // Header Scroll Effect
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
        observer.observe(el);
    });

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero Slideshow
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slide-ctrl.prev');
    const nextBtn = document.querySelector('.slide-ctrl.next');
    let currentSlide = 0;
    let slideTimer;
    const slideInterval = 6000; // Reduced to 6 seconds for faster transitions

    function showSlide(index) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');

        // Reset timer on manual interaction
        resetTimer();
    }

    function resetTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(() => showSlide(currentSlide + 1), slideInterval);
    }

    if (slides.length > 0) {
        // Init timer
        resetTimer();

        // Control button events
        if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));


    }

    // Mobile Nav Toggle (Implemented)
    const mobileBtn = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }



    // Contact Form Submission (Real Backend Integration)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                program: document.getElementById('program').value,
                message: document.getElementById('message').value
            };

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            try {
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    // Show success modal instead of alert
                    showSuccessModal();
                    contactForm.reset();
                } else {
                    alert('Submission failed. Please try again later.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please ensure the server is running.');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // Modal Functions
    window.showSuccessModal = function () {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('active');
            // Auto close after 5 seconds
            setTimeout(() => {
                closeSuccessModal();
            }, 5000);
        }
    }

    window.closeSuccessModal = function () {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('successModal');
        if (e.target === modal) {
            closeSuccessModal();
        }
    });


    // Gallery Backend Integration
    const addPhotoBox = document.querySelector('.add-photo-box');
    const galleryGrid = document.querySelector('.gallery-grid');

    if (addPhotoBox && galleryGrid) {
        // Create hidden file input if it doesn't exist
        let fileInput = document.getElementById('galleryFileInput');
        if (!fileInput) {
            fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = 'galleryFileInput';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
        }

        // Trigger file input when "Add Photo" is clicked
        addPhotoBox.addEventListener('click', () => {
            fileInput.click();
        });

        // Handle file selection and upload
        fileInput.addEventListener('change', async () => {
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                const uploadData = new FormData();
                uploadData.append('photo', file);

                try {
                    const response = await fetch('http://localhost:3000/api/gallery/upload', {
                        method: 'POST',
                        body: uploadData
                    });

                    const result = await response.json();

                    if (result.success) {
                        // Dynamically add the new photo to the grid
                        const newPhotoDiv = document.createElement('div');
                        newPhotoDiv.className = 'gallery-item fade-up visible';
                        newPhotoDiv.innerHTML = `
                            <img src="http://localhost:3000/${result.photo.url.replace('./', '')}" alt="Newly Added Photo">
                            <div class="gallery-overlay">
                                <span>Uploaded Photo</span>
                            </div>
                        `;

                        // Insert before the "Add Photo" box
                        galleryGrid.insertBefore(newPhotoDiv, addPhotoBox);
                        alert('Photo added successfully to gallery!');
                    } else {
                        alert('Upload failed.');
                    }
                } catch (error) {
                    console.error('Error uploading:', error);
                    alert('Failed to upload photo. Ensure the backend is running.');
                }
            }
        });

        // Fetch existing uploaded photos on load
        async function fetchGallery() {
            try {
                const response = await fetch('http://localhost:3000/api/gallery');
                const photos = await response.json();

                photos.forEach(photo => {
                    const photoDiv = document.createElement('div');
                    photoDiv.className = 'gallery-item fade-up visible';
                    const imgUrl = photo.url.startsWith('http') ? photo.url : `http://localhost:3000/${photo.url.replace('./', '')}`;
                    photoDiv.innerHTML = `
                        <img src="${imgUrl}" alt="Gallery Photo">
                        <div class="gallery-overlay">
                            <span>Gallery Item</span>
                        </div>
                    `;
                    galleryGrid.insertBefore(photoDiv, addPhotoBox);
                });
            } catch (error) {
                console.log('No existing gallery data or server not running.');
            }
        }

        // Lightbox Implementation
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-content" src="" alt="Enlarged Image">
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('.lightbox-content');
        const lightboxClose = lightbox.querySelector('.lightbox-close');

        function openLightbox(src) {
            lightboxImg.src = src;
            lightbox.classList.add('active');
        }

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.classList.remove('active');
        });

        // Add click listener to all gallery items (including dynamic ones)
        galleryGrid.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (item && !item.classList.contains('add-photo-box')) {
                const img = item.querySelector('img');
                if (img) openLightbox(img.src);
            }
        });
        fetchGallery();
    }

    // Admission Popup Logic (Home Page Only)
    const popupOverlay = document.getElementById('admissionPopup');
    if (popupOverlay && (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('1/'))) {
        // Check if user already saw it this session
        if (!sessionStorage.getItem('popupShown')) {
            popupOverlay.classList.add('active');
            sessionStorage.setItem('popupShown', 'true');
        }

        const closePopup = () => {
            popupOverlay.classList.remove('active');
        };

        const closeBtn = popupOverlay.querySelector('.popup-close');
        if (closeBtn) closeBtn.addEventListener('click', closePopup);

        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) closePopup();
        });
    }

    // Apply Now Button Global Redirect
    document.querySelectorAll('.btn-apply').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSfViBX5wuzPK8uUIwvPcj3LAHdEf2sCs91KsNgz0gzUtKWw9A/viewform?usp=publish-editor';
        });
    });
});
