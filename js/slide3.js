// Import the CSS file for this component
import '../css/slideFastIt.css';



import gsap from "../node_modules/gsap/index.js";

// Import images and variants; in this example, each box will have an array of images.
// For instance, box 1 has three variants.
import image1a from '../images/slide3Image1.webp';
import image1b from '../images/slide3Image1-1.webp';
import image1c from '../images/slide3Image1-2.webp';

import image2a from '../images/slide3Image2.webp';
import image2b from '../images/slide3Image2-1.webp';
import image2c from '../images/slide3Image2-2.webp';
import image2d from '../images/slide3Image2-3.webp';

import image3a from '../images/slide3Image3.webp';
import image3b from '../images/slide3Image3-1.webp';
import image3c from '../images/slide3Image3-2.webp';


import image4a from '../images/slide3Image4.webp';
import image4b from '../images/slide3Image4-1.webp';
import image4c from '../images/slide3Image4-2.webp';
import image4d from '../images/slide3Image4-3.webp';
import image4e from '../images/slide3Image4-4.webp';



// Structure each box's images as an array of variants
const images = [
  [ image1a, image1b, image1c ],
  [ image2a, image2b, image2c, image2d ],
  [ image3a, image3b, image3c ],
  [ image4a, image4b, image4c, image4d, image4e  ],
];

const originalTexts = [
  'Sleek IT Control',
  'Accelerate Digital Workflows',
  'Intelligent Automation',
  'Future- Proof Your IT'
];

const hoverTexts = [
  '           <span class="quote-mark">❝</span>      Experience effortless control with FastIT’s intuitive design that simplifies your internal communications while enhancing overall operational efficiency.      <span class="quote-mark">❞</span>',
  '           <span class="quote-mark">❝</span>      Boost productivity with smart, high-performance tools that fast-track your digital processes and keep your business moving at the speed of innovation.      <span class="quote-mark">❞</span>',
  '           <span class="quote-mark">❝</span>      Discover how FastIT leverages automation to minimize manual tasks—providing precision, reducing errors, and freeing up your team to focus on core initiatives.      <span class="quote-mark">❞</span>',
  '           <span class="quote-mark">❝</span>      Embrace tomorrow’s technology today with solutions that adapt to evolving IT landscapes, ensuring seamless integration with emerging innovations like AI and IoT.      <span class="quote-mark">❞</span>'
];



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

const preloadedImages = new Map();

function preloadImagesDuringIdle(imagesArray) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      imagesArray.flat().forEach(src => {
        const img = new Image();
        img.src = src;
        preloadedImages.set(src, img);
      });
    });
  } else {
    setTimeout(() => {
      imagesArray.flat().forEach(src => {
        const img = new Image();
        img.src = src;
        preloadedImages.set(src, img);
      });
    }, 2000);
  }
}

preloadImagesDuringIdle(images);

document.addEventListener('DOMContentLoaded', () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const cursor = document.getElementById('custom-cursor');
  const cursorInner = document.querySelector('.cursor-inner');
  const slide3 = document.getElementById('slide3');

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;
  let scale = 3;
  let targetScale = 3;
  const speed = 0.25;
  let isClickable = false;
  let slide3Active = false;
  let cursorInnerIsActive = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.id === 'slide3') {
        slide3Active = entry.isIntersecting;
        if (slide3Active && !isMobile) {
          cursor.style.display = 'flex';
          document.body.classList.add('cursor-none');
        } else {
          cursor.style.display = 'none';
          document.body.classList.remove('cursor-none');
          isClickable = false;
          targetScale = 3;
        }
      }
    });
  }, { threshold: 0.6 });
  if (slide3) observer.observe(slide3);

  if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
      if (!slide3Active) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener('mouseover', (e) => {
      if (!slide3Active) return;
      const isNowClickable = !!e.target.closest('a, button, .nav-dot, [role="button"], .box');
      if (isNowClickable !== isClickable) {
        isClickable = isNowClickable;
        targetScale = isClickable ? 20 : 3;
        cursorInnerIsActive = isNowClickable;
        cursorInner.style.opacity = cursorInnerIsActive ? '1' : '0';
      }
    });

    function animateCursor() {
      if (!cursor || !slide3Active) {
        requestAnimationFrame(animateCursor);
        return;
      }
      currentX += (mouseX - currentX) * speed;
      currentY += (mouseY - currentY) * speed;
      scale += (targetScale - scale) * speed;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${scale})`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  const container = document.querySelector('.boxes-container');
  const overlay = document.querySelector('.hover-background');
  const boxes = container.querySelectorAll('.box');

  let currentHoveredBox = null;
  let hoverInTimer = null;
  let hoverOutOverlayTimer = null;
  let hoverOutBoxTimer = null;
  const hoverInDelay = 100;
  const hoverOutOverlayDelay = 100;
  const hoverOutBoxDelay = 100;

  function clearAllTimers() {
    clearTimeout(hoverInTimer);
    clearTimeout(hoverOutOverlayTimer);
    clearTimeout(hoverOutBoxTimer);
  }

  boxes.forEach((box, index) => {
    box.innerHTML = `
      <span class="span-box-head">${originalTexts[index]}</span>
      <span class="span-box-text" style="display: none;"></span>
    `;
  });

  const variantIndices = Array(images.length).fill(0);

  boxes.forEach((box, index) => {
    const triggerEvent = isMobile ? 'click' : 'pointerenter';
    const endEvent = isMobile ? null : 'pointerleave';

    box.addEventListener(triggerEvent, () => {
      clearAllTimers();
      let currentVariantIndex = variantIndices[index];
      const imageToShow = images[index][currentVariantIndex];
      variantIndices[index] = (currentVariantIndex + 1) % images[index].length;

      if (!box.classList.contains('is-hovered')) {
        boxes.forEach((b, i) => {
          b.classList.remove('is-hovered');
          b.querySelector('.span-box-head').style.display = 'block';
          b.querySelector('.span-box-text').style.display = 'none';
        });

        box.classList.add('is-hovered');
        const headlineEl = box.querySelector('.span-box-head');
        const hoverTextEl = box.querySelector('.span-box-text');
        if (headlineEl) headlineEl.style.display = 'none';
        if (hoverTextEl) {
          hoverTextEl.style.display = 'block';
          hoverTextEl.innerHTML = hoverTexts[index];
        }

        const preloaded = preloadedImages.get(imageToShow);
        if (preloaded && preloaded.complete) {
          overlay.style.backgroundImage = `url(${imageToShow})`;
        } else {
          const fallbackImg = new Image();
          fallbackImg.src = imageToShow;
          fallbackImg.onload = () => {
            overlay.style.backgroundImage = `url(${imageToShow})`;
          };
        }

        overlay.style.opacity = 1;
        container.classList.add('hover-active');
        currentHoveredBox = box;
      } else if (isMobile) {
        box.classList.remove('is-hovered');
        box.querySelector('.span-box-head').style.display = 'block';
        box.querySelector('.span-box-text').style.display = 'none';
        overlay.style.opacity = 0;
        container.classList.remove('hover-active');
      }
    });

    if (endEvent) {
      box.addEventListener(endEvent, () => {
        hoverOutOverlayTimer = setTimeout(() => {
          if (![...boxes].some(b => b.matches(':hover'))) {
            overlay.style.opacity = 0;
            container.classList.remove('hover-active');
          }
        }, hoverOutOverlayDelay);

        hoverOutBoxTimer = setTimeout(() => {
          if (currentHoveredBox === box) {
            box.classList.remove('is-hovered');
            const headlineEl = box.querySelector('.span-box-head');
            const hoverTextEl = box.querySelector('.span-box-text');
            if (headlineEl) headlineEl.style.display = 'block';
            if (hoverTextEl) hoverTextEl.style.display = 'none';
            currentHoveredBox = null;
          }
        }, hoverOutBoxDelay);
      });
    }
  });
});
