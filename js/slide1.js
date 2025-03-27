import { gsap } from "gsap"; // assuming gsap is bundled via Parcel or similar
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import anime from '../node_modules/animejs/lib/anime.es.js';








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
  '.leftText, .rightText',
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
const scheduleDemoBtn = document.querySelector('.schedule-demo-btn');
const modalPopup = document.getElementById('scheduleDemoPopup');
const closeButton = modalPopup.querySelector('.modal-close');

// Function to open the modal
function openModal() {
  modalPopup.classList.add('active');
  modalPopup.setAttribute('aria-hidden', 'false');
  document.dispatchEvent(new Event('dialogOpened'));
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







//handle product button changes
document.querySelectorAll('.product-toggle').forEach(button => {
  button.addEventListener('click', () => {
    // Toggle the active class on this button
    button.classList.toggle('active');

    
    updateValidationMessage();

  });
});






function updateValidationMessage() {
  // Get all active product buttons
  const selectedProducts = document.querySelectorAll('.product-toggle.active');
  
  // Get the validation message and its wrapper elements
  const validationMessage = document.getElementById('productValidationMessage');
  const validationMessageWrapper = document.getElementById('productValidationMessageWrapper');

  // If no product is selected, show the error; otherwise, hide it
  if (selectedProducts.length === 0) {
    // Show the error message
    validationMessage.style.display = 'block';
    validationMessage.classList.add('isVisible');
    validationMessageWrapper.classList.add('isVisible');
  } else {
    // Hide the error message
    validationMessage.style.display = 'none';
    validationMessage.classList.remove('isVisible');
    validationMessageWrapper.classList.remove('isVisible');
  }
}



//begin animation for submit button

document.querySelectorAll('.button-sent-demo-request').forEach(button => {
  let getVar = variable => getComputedStyle(button).getPropertyValue(variable);

  // Get the parent form
  const form = button.closest('form');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!button.classList.contains('active')) {
      button.classList.add('active');
  
      try {
        // Dispatch form submission event
        const submitEvent = new CustomEvent('demoSubmissionStart', {
          detail: { formData: new FormData(form) }
        });
        document.dispatchEvent(submitEvent);
        
        // Wait for completion
        const result = await new Promise((resolve) => {
          document.addEventListener('demoSubmissionComplete', (event) => {
            resolve(event.detail.success);
          }, { once: true });
        });
  
        if (!result) {
          return; // Stop here if validation failed
        }

        // Airplane animation
        gsap.to(button, {
          keyframes: [{
            '--left-wing-first-x': 50,
            '--left-wing-first-y': 100,
            '--right-wing-second-x': 50,
            '--right-wing-second-y': 100,
            duration: .2,
            onComplete() {
              gsap.set(button, {
                '--left-wing-first-y': 0,
                '--left-wing-second-x': 40,
                '--left-wing-second-y': 100,
                '--left-wing-third-x': 0,
                '--left-wing-third-y': 100,
                '--left-body-third-x': 40,
                '--right-wing-first-x': 50,
                '--right-wing-first-y': 0,
                '--right-wing-second-x': 60,
                '--right-wing-second-y': 100,
                '--right-wing-third-x': 100,
                '--right-wing-third-y': 100,
                '--right-body-third-x': 60
              });
            }
          }, {
            '--left-wing-third-x': 20,
            '--left-wing-third-y': 90,
            '--left-wing-second-y': 90,
            '--left-body-third-y': 90,
            '--right-wing-third-x': 80,
            '--right-wing-third-y': 90,
            '--right-body-third-y': 90,
            '--right-wing-second-y': 90,
            duration: .2
          }, {
            '--rotate': 50,
            '--left-wing-third-y': 95,
            '--left-wing-third-x': 27,
            '--right-body-third-x': 45,
            '--right-wing-second-x': 45,
            '--right-wing-third-x': 60,
            '--right-wing-third-y': 83,
            duration: .25
          }, {
            '--rotate': 55,
            '--plane-x': -8,
            '--plane-y': 24,
            duration: .2
          }, {
            '--rotate': 40,
            '--plane-x': 45,
            '--plane-y': -180,
            '--plane-opacity': 0,
            duration: .3
  }, {
    '--rotate': 0,  // Add this final keyframe
    duration: .2    // Adjust duration as needed
  }]
});

        // Success state animation
        gsap.to(button, {
          keyframes: [{
            '--text-opacity': 0,
            '--border-radius': 0,
            '--left-wing-background': getVar('--primary-darkest'),
            '--right-wing-background': getVar('--primary-darkest'),
            duration: .1
          }, {
            '--left-wing-background': getVar('--primary'),
            '--right-wing-background': getVar('--primary'),
            duration: .1
          }, {
            '--left-body-background': getVar('--primary-dark'),
            '--right-body-background': getVar('--primary-darkest'),
            duration: .4
          }, {
            '--success-opacity': 1,
            '--success-scale': 1,
            duration: .25,
            delay: .25
          }]
        });

        gsap.to(button, {
          onComplete() {
            button.classList.add('sent');
            button.disabled = true;
            console.log('Form submitted successfully and button animated');
          }
        });

      } catch (error) {
        console.error('Form submission failed:', error);
        button.classList.remove('active');
        button.disabled = false;
      }
    }
  });

  // Reset button when dialog opens
  document.addEventListener('dialogOpened', () => {
    button.classList.remove('active', 'sent');
    button.removeAttribute('style');
    button.disabled = false;
    console.log('Dialog opened, button reset');
  });
});





//end animation submit button







  
});
