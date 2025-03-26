import { gsap } from "gsap"; // assuming gsap is bundled via Parcel or similar
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import anime from 'animejs';


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
gsap.to(".slide1 .content-section", {
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











document.addEventListener("DOMContentLoaded", () => {
  const contactContainer = document.querySelector(".slide1 .contact-container");
  const contactBtn = document.querySelector(".slide1 .contact-btn");
  const contactBtnSvg = document.getElementById("svg-info-box-button-contact");
  const emailBtn = document.querySelector(".slide1 .email");
  const callBtn = document.querySelector(".slide1 .call");

  // Mouseenter event with delayed scaling.
  contactBtn.addEventListener("mouseenter", () => {
    emailBtn.style.transform = "translateX(30px)";
    callBtn.style.transform = "translateX(-30px)";
    contactBtn.style.pointerEvents = "none";

    contactBtnSvg.style.opacity = "0";

    contactBtn.style.opacity = "0";
    emailBtn.style.opacity = "1";
    callBtn.style.opacity = "1";

    // Delay pointer events enabling so the scaling isn't immediately seen.
    setTimeout(() => {
      emailBtn.style.pointerEvents = "auto";
      callBtn.style.pointerEvents = "auto";
    }, 300); // adjust delay as needed
  });

  // Mouseleave event with delayed scaling reset.
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

      // Disable pointer events after a delay.
      setTimeout(() => {
        contactBtn.style.pointerEvents = "auto";
        emailBtn.style.pointerEvents = "none";
        callBtn.style.pointerEvents = "none";
      }, 300); // adjust delay as needed
    }
  });






// Get references to the necessary elements
const scheduleDemoBtn = document.querySelector('.scedule-demo-btn');
const modalPopup = document.getElementById('scheduleDemoPopup');
const closeButton = modalPopup.querySelector('.modal-close');

// Function to open the modal
function openModal() {
  modalPopup.classList.add('active');
  modalPopup.setAttribute('aria-hidden', 'false');
  // Optionally, shift focus to the first input in the modal for accessibility
  const firstInput = modalPopup.querySelector('input');
  if (firstInput) {
    firstInput.focus();
  }
}

// Function to close the modal
function closeModal() {
  modalPopup.classList.remove('active');
  modalPopup.setAttribute('aria-hidden', 'true');
  // Optionally, return focus to the schedule demo button
  scheduleDemoBtn.focus();
}

// Toggle the modal open when the button is clicked
scheduleDemoBtn.addEventListener('click', openModal);

// Close the modal when the close button is clicked
closeButton.addEventListener('click', closeModal);

// Optionally: close the modal if the user clicks outside the modal content (on the backdrop)
modalPopup.addEventListener('click', (event) => {
  // Check if the click target is the modal container (backdrop)
  if (event.target === modalPopup) {
    closeModal();
  }
});

// Optionally: close the modal if the user presses the Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modalPopup.classList.contains('active')) {
    closeModal();
  }
});








document.querySelectorAll('.product-toggle').forEach(button => {
  button.addEventListener('click', () => {
    // Toggle the active class on this button
    button.classList.toggle('active');
  });
});


document.getElementById('SendButtonDemo').addEventListener('click', function(e) {
  // Prevent the default form submission behavior if needed
  e.preventDefault();
  anime({
    targets: '#morphPath',
    d: [
      {
        // Morph into the paper plane shape – ensure that the path is compatible (consider using a tool to match path commands)
        value: "M139.947,499.201L250.88,388.267l0,0l-42.667-17.067L498.347,4.267l-358.4,341.333V499.201L139.947,499.201z M498.347,4.267l-358.4,341.333l-119.467-51.2c-23.04-10.24-22.187-30.72,0-42.667L498.347,4.267z M498.347,4.267l-87.04,409.6c-4.267,20.48-20.48,29.013-40.96,20.48L250.88,387.414l-42.667-17.067L498.347,4.267z"
      }
    ],
    duration: 800,
    easing: 'easeInOutQuad'
  });
});











  
});
