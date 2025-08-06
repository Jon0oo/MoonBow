import '../css/slideFactoryIt.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const imageColumns = document.querySelectorAll('.image-column');

imageColumns.forEach(column => {
  column.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent click from bubbling to document
    
    if (column.classList.contains('active')) {
      // If clicked element is already active, remove active
      column.classList.remove('active');
      // Remove inactive from all others
      imageColumns.forEach(c => c.classList.remove('inactive'));
    } else {
      // Remove active from all columns first
      imageColumns.forEach(c => {
        c.classList.remove('active');
        c.classList.add('inactive');
      });
      // Add active to the clicked column and remove inactive from it
      column.classList.add('active');
      column.classList.remove('inactive');
    }
  });
});

// Remove .active and .inactive when clicking outside
document.addEventListener('click', () => {
  imageColumns.forEach(c => {
    c.classList.remove('active');
    c.classList.remove('inactive');
  });
});

// Optional: Remove .active and .inactive on mouse leave
imageColumns.forEach(column => {
  column.addEventListener('mouseleave', () => {
    column.classList.remove('active');
    imageColumns.forEach(c => c.classList.remove('inactive'));
  });
});




















window.addEventListener("load", () => {
  const markers = {
    "top-left": document.querySelector(".marker.top-left"),
    "top-right": document.querySelector(".marker.top-right"),
    "bottom-left": document.querySelector(".marker.bottom-left"),
    "bottom-right": document.querySelector(".marker.bottom-right"),
  };

  const columns = document.querySelectorAll(".image-column");

  const scale = 1.18; // scale factor to push marker outward

  columns.forEach((col) => {
    const rect = col.getBoundingClientRect();
    const parentRect = col.closest(".image-section").getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const scaledWidth = rect.width * scale;
    const scaledHeight = rect.height * scale;

    const dx = (scaledWidth - rect.width) / 2;
    const dy = (scaledHeight - rect.height) / 2;

    const top = rect.top - parentRect.top - dy;
    const left = rect.left - parentRect.left - dx;

    const key =
      (col.classList.contains("top") ? "top" : "bottom") +
      "-" +
      (col.classList.contains("left") ? "left" : "right");

    const marker = markers[key];

    if (marker) {
      // Position at the scaled corner
      const offsetX = col.classList.contains("right") ? scaledWidth - 20 : 0;
      const offsetY = col.classList.contains("bottom") ? scaledHeight - 20 : 0;

      marker.style.left = left + offsetX + "px";
      marker.style.top = top + offsetY + "px";
    }
  });
});

