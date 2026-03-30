document.addEventListener("DOMContentLoaded", () => {
  // Preloader - Only show once per session
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    const hasSeenPreloader = sessionStorage.getItem("hasSeenPreloader");

    if (hasSeenPreloader) {
      // Already seen in this session, hide immediately
      preloader.style.display = "none";
      preloader.classList.add("hidden");
    } else {
      // First time this session, show animation
      const minDisplayTime = 3000; // 3s
      const startTime = Date.now();

      const hidePreloader = () => {
        if (!preloader.classList.contains("hidden")) {
          preloader.classList.add("hidden");
          sessionStorage.setItem("hasSeenPreloader", "true");
          setTimeout(() => {
            preloader.style.display = "none";
          }, 1200);
        }
      };

      window.addEventListener("load", () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
        setTimeout(hidePreloader, remainingTime);
      });

      // Fallback in case load event takes too long
      setTimeout(hidePreloader, 5000);
    }
  }

  // Admission Popup Logic
  const admissionPopup = document.getElementById("admissionPopup");
  const closePopup = document.getElementById("closePopup");

  if (admissionPopup) {
    const showAdmissionPopup = () => {
      const hasSeenPopup = sessionStorage.getItem("hasSeenAdmissionPopup");
      if (!hasSeenPopup) {
        setTimeout(() => {
          admissionPopup.classList.add("active");
          // Mark as seen immediately so it doesn't repeat if they navigate away
          sessionStorage.setItem("hasSeenAdmissionPopup", "true");

          // Auto-close after 5 seconds
          setTimeout(() => {
            admissionPopup.classList.remove("active");
          }, 5000); // 5 seconds
        }, 1500); // 1.5s delay after preloader hides
      }
    };

    // Trigger after preloader is hidden
    if (preloader) {
      const checkPreloader = setInterval(() => {
        if (preloader.classList.contains("hidden")) {
          clearInterval(checkPreloader);
          showAdmissionPopup();
        }
      }, 500);
    } else {
      showAdmissionPopup();
    }

    if (closePopup) {
      closePopup.addEventListener("click", () => {
        admissionPopup.classList.remove("active");
        sessionStorage.setItem("hasSeenAdmissionPopup", "true");
      });
    }

    admissionPopup.addEventListener("click", (e) => {
      if (e.target === admissionPopup) {
        admissionPopup.classList.remove("active");
        sessionStorage.setItem("hasSeenAdmissionPopup", "true");
      }
    });
  }

  // Header Scroll Effect - Hide logo when scrolling
  const header = document.querySelector(".header");
  const logo = document.querySelector(".logo");
  const whatsappButton = document.querySelector(".whatsapp-float");

  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Header and logo behavior
        if (currentScrollY > 50) {
          header.classList.add("scrolled");
          if (logo) {
            logo.classList.add("hidden");
          }
        } else {
          header.classList.remove("scrolled");
          if (logo) {
            logo.classList.remove("hidden");
          }
        }

        // WhatsApp button is now permanently visible as per user request


        lastScrollY = currentScrollY;
        ticking = false;
      });

      ticking = true;
    }
  });

  // Intersection Observer for Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-up, .fade-in").forEach((el) => {
    observer.observe(el);
  });

  // Footer Observer - To hide floating buttons when footer is in view
  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.body.classList.add("footer-active");
      } else {
        document.body.classList.remove("footer-active");
      }
    });
  }, { threshold: 0.1 });

  const footerEl = document.querySelector(".footer");
  if (footerEl) {
    footerObserver.observe(footerEl);
  }

  // Smooth Scroll for Navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Hero Slideshow
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".slide-ctrl.prev");
  const nextBtn = document.querySelector(".slide-ctrl.next");
  let currentSlide = 0;
  let slideTimer;
  const slideInterval = 8000; // Increased to 8 seconds

  function showSlide(index) {
    slides[currentSlide].classList.remove("active");
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");

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
    if (prevBtn)
      prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
    if (nextBtn)
      nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
  }

  // Mobile Nav Toggle (Implemented)
  const mobileBtn = document.querySelector(".mobile-nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", () => {
      mobileBtn.classList.toggle("active");
      navLinks.classList.toggle("active");
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        const isDropdownToggle = link.classList.contains("dropdown-toggle");
        const isMobile = window.innerWidth <= 768;

        if (isMobile && isDropdownToggle) {
          e.preventDefault();
          const parent = link.closest(".dropdown");
          if (parent) {
            parent.classList.toggle("active");
          }
        } else {
          mobileBtn.classList.remove("active");
          navLinks.classList.remove("active");
          // Reset all dropdowns when closing menu
          navLinks.querySelectorAll(".dropdown").forEach(d => d.classList.remove("active"));
        }
      });
    });
  }

  // Contact Form Submission - DISABLED (Using Google Forms instead)
  // const contactForm = document.getElementById('contactForm');
  // if (contactForm) {
  //     contactForm.addEventListener('submit', async (e) => {
  //         e.preventDefault();
  //         const btn = contactForm.querySelector('button');
  //         const originalText = btn.innerHTML;

  //         const formData = {
  //             name: document.getElementById('name').value,
  //             email: document.getElementById('email').value,
  //             phone: document.getElementById('phone').value,
  //             program: document.getElementById('program').value,
  //             message: document.getElementById('message').value
  //         };

  //         btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  //         btn.disabled = true;

  //         try {
  //             const response = await fetch('http://localhost:3000/api/contact', {
  //                 method: 'POST',
  //                 headers: { 'Content-Type': 'application/json' },
  //                 body: JSON.stringify(formData)
  //             });

  //             const result = await response.json();

  //             if (result.success) {
  //                 // Show success modal instead of alert
  //                 showSuccessModal();
  //                 contactForm.reset();
  //             } else {
  //                 alert('Submission failed. Please try again later.');
  //             }
  //         } catch (error) {
  //             console.error('Error:', error);
  //             alert('An error occurred. Please ensure the server is running.');
  //         } finally {
  //             btn.innerHTML = originalText;
  //             btn.disabled = false;
  //         }
  //     });
  // }

  // Modal Functions
  window.showSuccessModal = function () {
    const modal = document.getElementById("successModal");
    if (modal) {
      modal.classList.add("active");
      // Auto close after 5 seconds
      setTimeout(() => {
        closeSuccessModal();
      }, 5000);
    }
  };

  window.closeSuccessModal = function () {
    const modal = document.getElementById("successModal");
    if (modal) {
      modal.classList.remove("active");
    }
  };

  // Close modal when clicking outside
  document.addEventListener("click", (e) => {
    const modal = document.getElementById("successModal");
    if (e.target === modal) {
      closeSuccessModal();
    }
  });

  // Gallery Backend Integration
  const addPhotoBox = document.querySelector(".add-photo-box");
  const galleryGrid = document.querySelector(".gallery-grid");

  if (galleryGrid) {
    if (addPhotoBox) {
      // Create hidden file input if it doesn't exist
      let fileInput = document.getElementById("galleryFileInput");
      if (!fileInput) {
        fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.id = "galleryFileInput";
        fileInput.accept = "image/*";
        fileInput.style.display = "none";
        document.body.appendChild(fileInput);
      }

      // Trigger file input when "Add Photo" is clicked
      addPhotoBox.addEventListener("click", () => {
        fileInput.click();
      });

      // Handle file selection and upload
      fileInput.addEventListener("change", async () => {
        if (fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          const uploadData = new FormData();
          uploadData.append("photo", file);

          try {
            const response = await fetch(
              "http://localhost:3000/api/gallery/upload",
              {
                method: "POST",
                body: uploadData,
              },
            );

            const result = await response.json();

            if (result.success) {
              // Dynamically add the new photo to the grid
              const newPhotoDiv = document.createElement("div");
              newPhotoDiv.className = "gallery-item fade-up visible";
              newPhotoDiv.innerHTML = `
                            <img src="http://localhost:3000/${result.photo.url.replace("./", "")}" alt="Newly Added Photo">
                            <div class="gallery-overlay">
                                <span>Uploaded Photo</span>
                            </div>
                        `;

              // Insert before the "Add Photo" box
              galleryGrid.insertBefore(newPhotoDiv, addPhotoBox);
              alert("Photo added successfully to gallery!");
            } else {
              alert("Upload failed.");
            }
          } catch (error) {
            console.error("Error uploading:", error);
            alert("Failed to upload photo. Ensure the backend is running.");
          }
        }
      });
    }

    // Fetch existing uploaded photos on load
    async function fetchGallery() {
      try {
        const response = await fetch("http://localhost:3000/api/gallery");
        const photos = await response.json();

        photos.forEach((photo) => {
          const photoDiv = document.createElement("div");
          photoDiv.className = "gallery-item fade-up visible";
          const imgUrl = photo.url.startsWith("http")
            ? photo.url
            : `http://localhost:3000/${photo.url.replace("./", "")}`;
          photoDiv.innerHTML = `
                        <img src="${imgUrl}" alt="Gallery Photo">
                        <div class="gallery-overlay">
                            <span>Gallery Item</span>
                        </div>
                    `;
          galleryGrid.insertBefore(photoDiv, addPhotoBox);
        });
      } catch (error) {
        console.log("No existing gallery data or server not running.");
      }
    }

    // Video Hover Functionality
    const videoItems = document.querySelectorAll(".video-item");
    videoItems.forEach((item) => {
      const video = item.querySelector("video");
      if (video) {
        item.addEventListener("mouseenter", () => video.play());
        item.addEventListener("mouseleave", () => {
          video.pause();
          video.currentTime = 0;
        });
      }
    });

    // Lightbox Implementation
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <div class="lightbox-container">
                <img class="lightbox-content img-content" src="" alt="Enlarged Image">
                <video class="lightbox-content video-content" controls>
                    <source src="" type="video/mp4">
                </video>
                <iframe class="lightbox-content youtube-content" src="" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            </div>
        `;
    document.body.appendChild(lightbox);

    const imgContent = lightbox.querySelector(".img-content");
    const videoContent = lightbox.querySelector(".video-content");
    const youtubeContent = lightbox.querySelector(".youtube-content");
    const lightboxClose = lightbox.querySelector(".lightbox-close");

    function openLightbox(src, type = "image") {
      // Reset all
      imgContent.style.display = "none";
      videoContent.style.display = "none";
      youtubeContent.style.display = "none";
      videoContent.pause();
      videoContent.src = "";
      youtubeContent.src = "";

      if (type === "youtube") {
        youtubeContent.style.display = "block";
        youtubeContent.src = `https://www.youtube.com/embed/${src}?autoplay=1`;
      } else if (type === "video") {
        videoContent.style.display = "block";
        videoContent.src = src;
        videoContent.play();
      } else {
        imgContent.style.display = "block";
        imgContent.src = src;
      }
      lightbox.classList.add("active");
    }

    const closeLightbox = () => {
      lightbox.classList.remove("active");
      videoContent.pause();
      videoContent.src = "";
      youtubeContent.src = "";
    };

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (
        e.target === lightbox ||
        e.target.classList.contains("lightbox-container")
      )
        closeLightbox();
    });

    // Add click listener to all gallery items
    const galleryGrids = document.querySelectorAll(".gallery-grid");
    galleryGrids.forEach((grid) => {
      grid.addEventListener("click", (e) => {
        const item = e.target.closest(".gallery-item");
        if (item && !item.classList.contains("add-photo-box")) {
          const videoType = item.getAttribute("data-video-type");
          const videoId = item.getAttribute("data-video-id");

          if (videoType === "youtube") {
            openLightbox(videoId, "youtube");
          } else {
            const img = item.querySelector("img");
            const video = item.querySelector("video source");
            if (video) {
              openLightbox(video.src, "video");
            } else if (img) {
              openLightbox(img.src, "image");
            }
          }
        }
      });
    });

    if (typeof fetchGallery === "function") fetchGallery();
  }
});
