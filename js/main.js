import '../css/global.css';
import '../css/slideFastIt.css';
import '../css/slideFactoryIt.css';
import '../css/slideFiberFlow.css';
import '../css/slideSmartLink.css';
import '../css/vision.css';
import '../css/history.css';







import { observeSlides, setupDotNavigation,updateIndicatorPosition } from './animations.js';





// On page load, initialize all functionalities.
document.addEventListener('DOMContentLoaded', function () {
    setupDropdowns();
    setupDotClickHandlers();
    observeSlides();
    setupDotNavigation();
    setupDropdownSlideNavigation(); 
});















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





//make dropdown entrys scroll to the slide

function setupDropdownSlideNavigation() {
    const dropdownLinks = document.querySelectorAll('.dropdown a[data-slide]');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const slideId = link.getAttribute('data-slide');
            // Smoothly scroll to the target slide.
            scrollToSlide(event, slideId);
            
            // Manually update nav dot active state:
            const dots = document.querySelectorAll('.nav-dot');
            // Remove 'active' from all nav dots.
            dots.forEach(dot => dot.classList.remove('active'));
            // Find the corresponding nav dot.
            const targetDot = Array.from(dots).find(dot => dot.getAttribute('data-slide') === slideId);
            if (targetDot) {
                targetDot.classList.add('active');
                // Update the indicator position.
                updateIndicatorPosition(targetDot);
            }
            
            // Optionally close the dropdown after clicking.
            const dropdown = link.closest('.dropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        });
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


