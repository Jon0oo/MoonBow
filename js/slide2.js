import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CustomEase } from "gsap/CustomEase";
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, CustomEase);

//
// Lazy-load DemoModal (formerly imported statically)
//
let modalComponentPromise;

function loadModalComponent() {
  if (!modalComponentPromise) {
    modalComponentPromise = import(
      /* webpackChunkName: "modalComponent", webpackPrefetch: true */
      './modalComponent.js'
    )
      .then(module => module.default)
      .catch(error => {
        console.error("Error loading modal component:", error);
      });
  }
  return modalComponentPromise;
}


document.addEventListener("DOMContentLoaded", () => {
  // Cache DOM elements
  const car = document.querySelector('.carDiv');
  const lightTrailElement = document.getElementById("lightTrail");
  const lightTrailElement2 = document.getElementById("lightTrailOrange");
  const imageSection = document.querySelector(".slide2 .image-section");
  const slide2 = document.querySelector(".slide2");
  const infoBoxLink1Text = document.getElementById("info-box-link-1-text");
  const infoBoxLink2Text = document.getElementById("info-box-link-2-text");
  const imageSectionWrapper = document.querySelector('.image-section-wrapper');
  const contentSection = document.querySelector('.slide2 .content-section');

  let timeline;
  let scrollRAF; // for scroll throttling
  let lastScrollTop = 0;
  let isResizing = false; // flag for debouncing scroll events during resize

  // Debounce helper function
  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  function setupPathAnimation(keepProgress = false) {
    if (!car || !lightTrailElement || !lightTrailElement2) return;

    const pathLength = lightTrailElement.getTotalLength();
    const pathLength2 = lightTrailElement2.getTotalLength();

    // Set up stroke dash arrays and offsets
    [lightTrailElement, lightTrailElement2].forEach((el, i) => {
      const len = i === 0 ? pathLength : pathLength2;
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
    });

    let currentProgress = 0;
    if (timeline && keepProgress) {
      currentProgress = timeline.progress();
      timeline.kill();
    }

    timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".slide2 .image-section",
        scroller: ".slide2",
        start: "top top",
        end: "100% bottom bottom",
        scrub: 2,
      }
    });

    // Animate car along the motion path
    timeline.to(car, {
      duration: 1.1,
      motionPath: {
        ease: "none",
        path: lightTrailElement,
        align: lightTrailElement,
        autoRotate: 180,
        alignOrigin: [0.5, 0.5]
      }
    }, 0);

    // Slight vertical movement
    timeline.to(car, {
      y: "+=100",
      duration: 0.3,
      ease: "power2.out"
    }, ">");

    // Define custom ease string once for reuse
    const customEaseStr = "M0,0 C0,0 0.074,0.072 0.092,0.084 0.097,0.087 0.141,0.123 0.202,0.184 0.232,0.214 0.306,0.255 0.35,0.286 0.393,0.317 0.456,0.355 0.5,0.4 0.564,0.467 0.677,0.489 0.741,0.559 0.779,0.6 0.906,0.671 0.906,0.671 0.906,0.671 0.962,0.746 0.988,0.818 1.02,0.907 1,1 1,1 ";

    // Animate the light trails
    timeline.to(lightTrailElement, {
      strokeDashoffset: 0,
      duration: 0.5,
      ease: CustomEase.create("custom", customEaseStr)
    }, 0);

    timeline.to(lightTrailElement2, {
      strokeDashoffset: 0,
      duration: 0.5,
      ease: CustomEase.create("custom", customEaseStr)
    }, 0);

    if (keepProgress) {
      timeline.progress(currentProgress);
    }
  }

  setupPathAnimation();

  // Use debounced resize event for recalculating animations
  window.addEventListener('resize', debounce(() => {
    isResizing = true;
    setupPathAnimation(true);
    initImageSectionAnimation();
    initParallaxEffects();
    // Delay turning off the resizing flag and refresh ScrollTrigger instances
    setTimeout(() => {
      isResizing = false;
      ScrollTrigger.refresh();
    }, 300);
  }, 100));

  // Initialize image section animation with debouncing on resize
  function initImageSectionAnimation() {
    // Kill any existing ScrollTrigger on imageSectionAnimation
    const existingTrigger = ScrollTrigger.getById("imageSectionAnimation");
    if (existingTrigger) {
      existingTrigger.kill();
    }

    if (window.innerWidth < 1000) {
      // If screen width is below 1000px, apply a permanent zoom effect.
      // Adjust scale value if width drops below 800px.
      if (window.innerWidth < 800) {
        // Add adjustments if needed
      } else {
        // Add adjustments if needed
      }
      // Optionally, you can reset any Y translation if needed:
      gsap.set(imageSection, { y: 0 });
    } else {
      // Otherwise, use your scroll-triggered animation
      // Reset any permanent scale if necessary (or set it to 1)
      gsap.set(imageSection, { scale: 1, transformOrigin: "center bottom" });
    }
  }

  initImageSectionAnimation();
  window.addEventListener('resize', debounce(initImageSectionAnimation, 100));

  function initParallaxEffects() {
    console.log('Initializing parallax effects...');
  
    // Debug: Log initial elements and dimensions
    const imageSection = document.querySelector(".slide2 .image-section");
    const contentSection = document.querySelector(".slide2 .content-section");
    
    console.log('Sections found:', {
      imageSection: Boolean(imageSection),
      contentSection: Boolean(contentSection),
      scrollHeight: slide2.scrollHeight,
      viewportHeight: slide2.clientHeight
    });
  
    // Kill existing ScrollTriggers if any
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.id === "slide2Parallax") {
        console.log('Killing existing ScrollTrigger:', st.vars.id);
        st.kill();
      }
    });
  
    // Create ScrollTrigger for image section (slower scroll - 0.8x speed)
    gsap.to(".slide2 .image-section", {
      y: () => {
        const distance = -(slide2.scrollHeight - slide2.clientHeight) * 0.01; // 10% of scroll distance
        console.log('Image section scroll distance:', distance);
        return distance;
      },
      ease: "none",
      scrollTrigger: {
        id: "slide2Parallax",
        trigger: ".slide2",
        scroller: ".slide2",
        start: "1% top 2% top",
        end: () => {
          if (window.innerWidth < 700) {
            return "130% bottom bottom";
          } else if (window.innerWidth < 800) {
            return "140% bottom bottom";
          } else if (window.innerWidth < 900) {
            return "150% bottom bottom";
          } else if (window.innerWidth < 1024) {
            return "200% bottom bottom";
          } else {
            return "220% bottom bottom";
          }
        },
        scrub: 1,
        //markers: true,
      }
    });
  
    // Create ScrollTrigger for content section (faster scroll - 2x speed)
    gsap.to(".slide2 .content-section", {
      y: () => {
        const distance = -(slide2.scrollHeight - slide2.clientHeight) * 1; // Negative for opposite direction
        console.log('Content section scroll distance:', distance);
        return distance;
      },
      ease: "none",
      scrollTrigger: {
        id: "slide2Parallax",
        trigger: ".slide2",
        scroller: ".slide2",
        start: "1% top 2% top",
        end: () => {
          if (window.innerWidth < 700) {
            return "130% bottom bottom";
          } else if (window.innerWidth < 800) {
            return "140% bottom bottom";
          } else if (window.innerWidth < 900) {
            return "150% bottom bottom";
          } else if (window.innerWidth < 1024) {
            return "200% bottom bottom";
          } else {
            return "220% bottom bottom";
          }
        },
        scrub: 1,
        //markers:true,
      }
    });
  
    console.log('Parallax effects initialization complete');
  }
    
  initParallaxEffects();
  window.addEventListener('resize', debounce(initParallaxEffects, 100));

  function handleSlide2Scroll() {
    if (isResizing) return; // ignore scroll events if resizing

    const currentScrollTop = slide2.scrollTop;
    const isScrollingUp = currentScrollTop < lastScrollTop;  // Check if scrolling up
    lastScrollTop = currentScrollTop;

    if (isScrollingUp) {
      // Set transform origin to "top center" when scrolling up
      const origin = "top center";
      infoBoxLink1Text.style.transformOrigin = origin;
      infoBoxLink2Text.style.transformOrigin = origin;

      // Calculate scale factor within desired bounds
      const minScale = 1;
      const maxScale = 1.1;
      const scaleFactor = Math.min(maxScale, Math.max(minScale, 1 + currentScrollTop / 1200));

      // GSAP animation for scaling/stretching when scrolling up
      gsap.to([infoBoxLink1Text, infoBoxLink2Text], {
        scaleY: scaleFactor,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      return;
    }

    // Reset scale after a short delay using a debounced callback
    clearTimeout(slide2.resetScaleTimeout);
    slide2.resetScaleTimeout = setTimeout(() => {
      gsap.to([infoBoxLink1Text, infoBoxLink2Text], {
        scaleY: 1,
        duration: 0.7,
        ease: "power2.out",
      });
    }, 150);
  }

  slide2.addEventListener("scroll", () => {
    if (!scrollRAF) {
      scrollRAF = requestAnimationFrame(() => {
        handleSlide2Scroll();
        scrollRAF = null;
      });
    }
  });

  // Visibility toggle functions and event listeners
  function toggleVisibility() {
    document.querySelectorAll(".slide-2-button").forEach(button => {
      if (button.id !== "slide2DemoButton") {
        button.classList.toggle("visible");
        button.classList.toggle("invisible");
      }
    });
  }

  function addClickListener(id, callback) {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("click", callback);
    } else {
      console.warn(`Element with ID '${id}' not found.`);
    }
  }

  // Handle visibility toggle for button-box-link-3-contact
  addClickListener("button-box-link-3-contact", toggleVisibility);

  // Handle call + visibility toggle for contact-2
  addClickListener("contact-2", function() {
    toggleVisibility();
    setTimeout(() => {
      window.location.href = "tel:+49152-28817386";
    }, 100);
  });

  // Handle email + visibility toggle for contact-3
  addClickListener("contact-3", function() {
    toggleVisibility();
    setTimeout(() => {
      window.location.href = "mailto:contact@moonbow.online";
    }, 100);
  });

  // Function to create a modal instance using the lazy-loaded DemoModal
  function createModalInstance(DemoModal) {
    const template = document.getElementById('modalTemplate');
    const modalContent = document.importNode(template.content, true);
    const modalElement = modalContent.querySelector('.modal-popup');
    modalElement.dataset.instanceId = Date.now();
    
    const container = document.querySelector('.slider-wrapper .slide2 .content-section');
    if (container) {
      container.appendChild(modalContent);
    } else {
      console.error("Container not found");
    }
    
    const modalInstance = new DemoModal(modalElement);
    return modalInstance;
  }

  // Update the event listener to lazy-load the modal component
  const scheduleDemoBtn = document.getElementById("slide2DemoButton");
  // Create a variable to hold your modal instance globally
  let modalInstance = null;

  scheduleDemoBtn.addEventListener("click", () => {
    if (modalInstance) {
      // If a modal instance exists, just open it again
      modalInstance.open();
    } else {
      // Otherwise, lazy-load the modal component and create a new instance
      loadModalComponent().then(DemoModal => {
        if (DemoModal) {
          modalInstance = createModalInstance(DemoModal);
          modalInstance.open();
        }
      });
    }
  });

  // Conditionally initialize Lenis based on screen width
  const isMobile = window.innerWidth <= 600;

  // Move raf function definition outside
  function raf(time) {
    if (lenis) {  // Add check to ensure lenis exists
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
  }

  let lenis = null;
  if (!isMobile) {
    lenis = new Lenis({
      duration: 1.2,  // Adjusts speed (higher = slower)
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smooth: true,
      smoothTouch: false,
      wrapper: slide2,  // 👈 Apply only to slide2
      content: slide2,  // 👈 Set the scrollable content
      gestureOrientation: "vertical", // 👈 Only allow vertical scroll
    });

    requestAnimationFrame(raf);
  }

  // Resize listener to adjust scroll settings based on screen size
  window.addEventListener("resize", () => {
    const isMobileNow = window.innerWidth <= 600;

    if (isMobileNow && lenis) {
      lenis.destroy(); // Destroy Lenis on mobile screens
      lenis = null;
    } else if (!isMobileNow && !lenis) {
      // Reinitialize Lenis if it was previously disabled on mobile
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smooth: true,
        smoothTouch: false,
        wrapper: slide2,
        content: slide2,
        gestureOrientation: "vertical",
      });
      requestAnimationFrame(raf);
    }
  });
});
