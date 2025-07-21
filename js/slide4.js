import '../css/slideFactoryIt.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';



gsap.registerPlugin(ScrollTrigger);

window.addEventListener('DOMContentLoaded', () => {
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
        wrapper: slide4,  // 👈 Apply only to slide2
        content: slide4,  // 👈 Set the scrollable content
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
          wrapper: slide4,
          content: slide4,
          gestureOrientation: "vertical",
        });
        requestAnimationFrame(raf);
      }
    });

  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      return arguments.length ? lenis.scrollTo(value, { immediate: true }) : window.scrollY;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: document.body.style.transform ? "transform" : "absolute",
  });





  // ---- CONFIG ----
  const frameCount = 24;
  const framePath = i => `/images/frame_${String(i + 1).padStart(4, '0')}.webp`;



// ---- SETUP DOM ----
const container = document.querySelector('#video-section');
const img = document.createElement('img');
img.id = 'frame-sequence';
container.appendChild(img);

// ---- PRELOAD IMAGES ----
const images = [];
for (let i = 0; i < frameCount; i++) {
  images[i] = new Image();
  images[i].src = framePath(i);
}

// ← Here’s the key addition:
img.src = images[0].src;

// ---- ANIMATION OBJECT ----
const seq = { frame: 0 };

gsap.to(seq, {
  frame: frameCount - 1,
  ease: 'none',
  scrollTrigger: {
    scroller: ".slide4",
    trigger: '#video-section',
    start: '5% top top',
    end: '40% top top',
    scrub: 1,
    //markers: true,
  },
  onUpdate() {
    const idx = Math.floor(seq.frame);
    img.src = images[idx].src;
  }
});



  // ---- REFRESH SCROLLTRIGGER AFTER LAYOUT SETUP ----

  ScrollTrigger.refresh();












  const specialElement = document.getElementById('frame-sequence');

function updateSpecialElementVisibility() {
  const params = new URLSearchParams(window.location.search);
  const currentSlide = params.get('slide');

  if (currentSlide === 'slide4') {
    specialElement.style.display = 'block';
    specialElement.style.position = 'fixed';
  } else {
    specialElement.style.display = 'none';
  }
}

// Run on load
updateSpecialElementVisibility();

// Listen for URL changes (if you use pushState or replaceState)
window.addEventListener('popstate', updateSpecialElementVisibility);

// Optional: Monkey-patch pushState/replaceState if you're using them
(function() {
  const pushState = history.pushState;
  const replaceState = history.replaceState;

  history.pushState = function() {
    pushState.apply(history, arguments);
    updateSpecialElementVisibility();
  };

  history.replaceState = function() {
    replaceState.apply(history, arguments);
    updateSpecialElementVisibility();
  };
})();

  





// start scroll text animation//





});


