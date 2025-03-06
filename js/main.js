import '../css/global.css';
import '../css/slideFastIt.css';
import '../css/slideFactoryIt.css';
import '../css/slideFiberFlow.css';
import '../css/slideSmartLink.css';







import { observeSlides, setupDotNavigation } from './animations.js';

// Opens a dropdown while closing any other open dropdowns.
function openDropdown(dropdownId) {
    document.querySelectorAll('.dropdown.show').forEach(dropdown => {
        if (dropdown.id !== dropdownId) {
            dropdown.classList.remove('show');
        }
    });
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.classList.add('show');
    }
}

// Closes the specified dropdown.
function closeDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}


// Initializes dropdown behavior.
function setupDropdowns() {
    const dropdownToggles = document.querySelectorAll('nav .menu > li > a[data-dropdown-id]');
    dropdownToggles.forEach(toggle => {
        const dropdownId = toggle.getAttribute('data-dropdown-id');
        toggle.addEventListener('mouseenter', () => openDropdown(dropdownId));
        toggle.parentElement.addEventListener('mouseleave', () => closeDropdown(dropdownId));
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.menu')) {
            document.querySelectorAll('.dropdown.show').forEach(dropdown => dropdown.classList.remove('show'));
        }
    });
}


// Scroll smoothly to the slide.
export function scrollToSlide(event, slideId) {
    event.preventDefault();
    const slide = document.getElementById(slideId);
    if (slide) {
        slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
}

// Handles navigation dot clicks.
function setupDotClickHandlers() {
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach(dot => {
        dot.addEventListener('click', event => {
            const slideId = dot.getAttribute('data-slide');
            scrollToSlide(event, slideId);
        });
    });
}

// On page load, initialize all functionalities.
document.addEventListener('DOMContentLoaded', function () {
    setupDropdowns();
    setupDotClickHandlers();
    observeSlides();
    setupDotNavigation();
});




function adjustSlides() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.style.width = `${window.innerWidth}px`;
        slide.style.height = `${window.innerHeight}px`;
    });
}

// Run on load and window resize
window.addEventListener('resize', adjustSlides);
window.addEventListener('DOMContentLoaded', adjustSlides);


