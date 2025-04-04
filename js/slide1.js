import { gsap } from "gsap"; // assuming gsap is bundled via Parcel or similar
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

function loadModalComponent() {
  // Return the promise so the caller can use the loaded module
  return import(/* webpackChunkName: "modalComponent", webpackPrefetch: true */ './modalComponent.js')
    .then(module => {
      // Assuming the modal component exports a class or function (DemoModal)
      return module.default;
    })
    .catch(error => {
      console.error("Error loading modal component:", error);
    });
}

gsap.registerPlugin(ScrollTrigger, CustomEase);

/* === Animated Text Timelines === */
const tl = gsap.timeline({
  defaults: {
    duration: 2,
    yoyo: true,
    ease: "power2.inOut"
  }
})
.fromTo(
  ".leftText, .rightText",
  {
    svgOrigin: "640 500",
    skewY: (i) => [-30, 15][i],
    scaleX: (i) => [0.6, 0.85][i],
    x: 200
  },
  {
    skewY: (i) => [-15, 30][i],
    scaleX: (i) => [0.85, 0.6][i],
    x: -200
  }
)
.play(0.5);

const tl2 = gsap.timeline();
document.querySelectorAll("text").forEach((t, i) => {
  tl2.add(
    gsap.fromTo(
      t,
      {
        xPercent: -100,
        x: 700
      },
      {
        duration: 1,
        xPercent: 0,
        x: 575,
        ease: "sine.inOut"
      }
    ),
    (i % 3) * 0.2
  );
});

// Throttle pointermove events with requestAnimationFrame
let pointerMoveRaf = null;
window.addEventListener("pointermove", (e) => {
  if (!pointerMoveRaf) {
    pointerMoveRaf = requestAnimationFrame(() => {
      tl.pause();
      tl2.pause();
      gsap.to([tl, tl2], {
        duration: 2,
        ease: "power4",
        progress: e.x / innerWidth
      });
      pointerMoveRaf = null;
    });
  }
});

// Create the ScrollTrigger for the content section
gsap.to(".slide1 .content-section", {
  y: "-20vh",
  ease: "none", // Linear easing for exact scroll-sync
  duration: 1,
  scrollTrigger: {
    trigger: ".content-wrapper",
    scroller: ".slide1",
    start: "top bottom",
    end: "top bottom",
    scrub: 2
  }
});

// Refresh ScrollTrigger on load and shortly after for recalculation
window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});
setTimeout(() => {
  ScrollTrigger.refresh();
}, 500);

const triggerElement = document.querySelector(".content-wrapper");
console.log(triggerElement.getBoundingClientRect());

// Optimize the fiberflow path animation
const path = document.querySelector("#fiberflow-path");
const pathLength = path.getTotalLength();
path.style.strokeDasharray = pathLength;
path.style.strokeDashoffset = pathLength;

gsap.to(path, {
  strokeDashoffset: 0,
  ease: "power4.Out",
  scrollTrigger: {
    trigger: ".content-spacer",
    scroller: ".slide1",
    start: "top bottom",
    endTrigger: ".content-section",
    end: "top bottom",
    scrub: 2
  }
});

// Animation for the info boxes SVG borders
document.querySelectorAll(".rect-info-box").forEach((rect) => {
  const length = rect.getTotalLength();
  gsap.set(rect, {
    strokeDasharray: length,
    strokeDashoffset: length
  });
  gsap.to(rect, {
    strokeDashoffset: 0,
    duration: 1.5,
    ease: "power4.Out",
    scrollTrigger: {
      trigger: rect.closest(
        ".info-box-fiber-1-1, .info-box-fiber-1-2, .info-box-fiber-1-3, .info-box-fiber-2"
      ),
      scroller: ".slide1",
      start: "top 100%",
      toggleActions: "play none none none",
      scrub: 2
    }
  });
});

// Wait for the DOM to load for the remaining interactions
document.addEventListener("DOMContentLoaded", () => {
  // Cache DOM references for the contact interactions
  const contactContainer = document.querySelector(".slide1 .contact-container");
  const contactBtn = document.querySelector(".slide1 .contact-btn");
  const contactBtnSvg = document.getElementById("svg-info-box-button-contact");
  const emailBtn = document.querySelector(".slide1 .email");
  const callBtn = document.querySelector(".slide1 .call");

  contactBtn.addEventListener("mouseenter", () => {
    emailBtn.style.transform = "translateX(30px)";
    callBtn.style.transform = "translateX(-30px)";
    contactBtn.style.pointerEvents = "none";
    contactBtnSvg.style.opacity = "0";
    contactBtn.style.opacity = "0";
    emailBtn.style.opacity = "1";
    callBtn.style.opacity = "1";

    setTimeout(() => {
      emailBtn.style.pointerEvents = "auto";
      callBtn.style.pointerEvents = "auto";
    }, 300);
  });

  contactContainer.addEventListener("mouseleave", (event) => {
    const related = event.relatedTarget;
    if (
      !contactContainer.contains(related) &&
      !emailBtn.contains(related) &&
      !callBtn.contains(related)
    ) {
      emailBtn.style.transform = "translateX(0)";
      callBtn.style.transform = "translateX(0)";
      emailBtn.style.opacity = "0";
      callBtn.style.opacity = "0";
      contactBtn.style.opacity = "1";
      contactBtnSvg.style.opacity = "1";

      setTimeout(() => {
        contactBtn.style.pointerEvents = "auto";
        emailBtn.style.pointerEvents = "none";
        callBtn.style.pointerEvents = "none";
      }, 300);
    }
  });

  // Function to create a modal instance
  function createModalInstance(DemoModal) {
    // Grab and clone the template
    const template = document.getElementById('modalTemplate');
    const modalContent = document.importNode(template.content, true);
    // Get the root modal element from the cloned content
    const modalElement = modalContent.querySelector('.modal-popup');
    // Optionally assign a unique identifier
    modalElement.dataset.instanceId = Date.now();
  
    // Instead of appending to body, append to the specific container:
    const container = document.querySelector('.slider-wrapper .slide1 .content-section .content-wrapper');
    if (container) {
      container.appendChild(modalContent);
    } else {
      console.error("Container not found");
    }
  
    // Create a new DemoModal instance for this modalElement using the lazy-loaded module
    const modalInstance = new DemoModal(modalElement);
    return modalInstance;
  }

  const scheduleDemoBtn = document.querySelector(".schedule-demo-btn");
  scheduleDemoBtn.addEventListener("click", () => {
    loadModalComponent().then(DemoModal => {
      if (DemoModal) {
        const modalInstance = createModalInstance(DemoModal);
        modalInstance.open();
      }
    });
  });
});
