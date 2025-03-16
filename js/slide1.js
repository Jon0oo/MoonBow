import { gsap } from "gsap"; // assuming gsap is bundled via Parcel or similar
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

/* === Animated Text Timelines (unchanged) === */
const tl = gsap.timeline({
  defaults: {
    duration: 2,
    yoyo: true,
    ease: 'power2.inOut'
  }
})
.fromTo(
  '.left, .right',
  {
    svgOrigin: '640 500',
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
document.querySelectorAll('text').forEach((t, i) => {
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
        ease: 'sine.inOut'
      }
    ),
    i % 3 * 0.2
  );
});

window.onpointermove = (e) => {
  tl.pause();
  tl2.pause();
  gsap.to([tl, tl2], {
    duration: 2,
    ease: 'power4',
    progress: e.x / innerWidth
  });
};


// Set initial position of the content section


// Create the ScrollTrigger
gsap.to(".slide1 content-section", {
  y: "-20vh", 
  ease: "none", // Linear easing ensures the movement matches the scroll exactly
  duration: 1, // The duration of the animation
  scrollTrigger: {
    trigger: ".content-wrapper",
    scroller: ".slide1",
    

    
    start: "top bottom",  // When the top of .content-wrapper reaches 20% from the bottom of the viewport
    end: "top  bottom ",       // Until the top of .content-wrapper is 20% above the top of the viewport
    scrub: 2,               // Smoothly links the animation to the scroll position
  }
});


window.addEventListener("load", () => {
  ScrollTrigger.refresh(); // Ensure everything calculates properly on load
});

setTimeout(() => {
  ScrollTrigger.refresh();
}, 500);




let triggerElement = document.querySelector(".content-wrapper");
console.log(triggerElement.getBoundingClientRect());







/// Select the path
const path = document.querySelector('#fiberflow-path');

// Get the total length of the path
const pathLength = path.getTotalLength();

// Set up the path's stroke properties
path.style.strokeDasharray = pathLength;
path.style.strokeDashoffset = pathLength;





// Animate the path
gsap.to(path, {
  strokeDashoffset: 0,
  ease: "power4.Out",
  scrollTrigger: {
    trigger: ".content-spacer  ",  
    scroller: ".slide1",
    start: "top bottom",   
    endTrigger: ".content-section" ,  
    //markers: true,
    end: "top bottom",         
    scrub: 2,       
            
                  
  }
});

 




//animation for the info boxes svg borders


document.querySelectorAll(".rect-info-box").forEach((rect) => {
  const length = rect.getTotalLength(); // Get path length

  // Set initial stroke properties
  gsap.set(rect, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });

  // Animate the stroke when the parent info box enters the viewport
  gsap.to(rect, {
    strokeDashoffset: 0,
    duration: 1.5,
    ease: "power4.Out",
    
    scrollTrigger: {
      trigger: rect.closest(".info-box-fiber-1-1, .info-box-fiber-1-2, .info-box-fiber-1-3, .info-box-fiber-2"),
      scroller: ".slide1",
      start: "top 100%", // Start animation when 80% of the info box is in view
      toggleActions: "play none none none", // Only play once
      //markers: true,
      scrub: 2,
    }
  });
});
