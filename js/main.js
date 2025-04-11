import '../css/global.css';






import { observeSlides, setupDotNavigation,updateIndicatorPosition } from './animations.js';

// Überprüfen, ob der <base>-Tag bereits existiert
let baseTag = document.querySelector('base');
if (!baseTag) {
    baseTag = document.createElement('base');
    document.head.appendChild(baseTag);
}
// 
baseTag.href = '/';

document.addEventListener('DOMContentLoaded', function () {
    setupDropdowns();
    setupDotClickHandlers();
    observeSlides();
    setupDotNavigation();
    setupDropdownSlideNavigation(); 


//handle footer links
    
        const loginLink = document.getElementById("loginLink");
        if (loginLink) {
         
          loginLink.href = `/html/signin.html`;
        }
      

    // Check for slide parameter in URL
    const params = new URLSearchParams(window.location.search);
    const slideId = params.get('slide');
    if (slideId) {
        navigateToSlide(slideId);
    }
});

// Function to handle smooth scrolling to a slide
function navigateToSlide(slideId) {
    const slide = document.getElementById(slideId);
    if (slide) {
        slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });

        // Update nav dots
        const dots = document.querySelectorAll('.nav-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        const targetDot = Array.from(dots).find(dot => dot.getAttribute('data-slide') === slideId);
        if (targetDot) {
            targetDot.classList.add('active');
            updateIndicatorPosition(targetDot);
        }
    }
}


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


// Initializes dropdown navigation for slides.
function setupDropdownSlideNavigation() {
    const dropdownLinks = document.querySelectorAll('.dropdown a[data-slide]');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const slideId = link.getAttribute('data-slide');

            // Ensure the base path is correct for MoonBow
            const basePath = "/";

            // Check if we are NOT already on the homepage
            if (!window.location.pathname.startsWith(basePath) || 
                (window.location.pathname !== basePath && !window.location.pathname.endsWith('/'))) {
                
                // Redirect to /MoonBow/ while keeping the slide parameter
                window.location.href = `${basePath}?slide=${slideId}`;
                return;
            }

            // If already on /MoonBow/, navigate to the slide smoothly
            navigateToSlide(slideId);
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

// Adjusts the size of slides based on window size.
function adjustSlides() {
    const slides = document.querySelectorAll('.slide');
    const slidesContainer = document.querySelector('.slides-container');

    slides.forEach(slide => {
        slide.style.width = `${window.innerWidth}px`;
        slide.style.height = `${window.innerHeight}px`;
    });

    // Ensure the active slide is properly centered after resizing
    const activeDot = document.querySelector('.nav-dot.active');
    if (activeDot) {
        const slideId = activeDot.getAttribute('data-slide');
        setTimeout(() => navigateToSlide(slideId), 50); // Small delay to allow resizing adjustments
    }
}

// Run on window resize and DOM load
window.addEventListener('resize', adjustSlides);
window.addEventListener('DOMContentLoaded', adjustSlides);





