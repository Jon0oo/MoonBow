// Moves the indicator to the active dot's position.
export function updateIndicatorPosition(activeDot) {
  const indicator = document.querySelector('.nav-dot-indicator');
  if (!indicator || !activeDot) return;

  const container = activeDot.parentElement; // .nav-dots container
  const offset = activeDot.offsetLeft; // Get the left offset of the dot within the container

  indicator.style.transform = `translateX(${offset}px)`;
}

// Observe slides and update the indicator.
export function observeSlides() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.nav-dot');
  const slidesContainer = document.querySelector('.slides-container');

  if (!slides.length || !dots.length || !slidesContainer) return;

  const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const index = Array.from(slides).indexOf(entry.target);
              
              // Remove 'active' class from all dots.
              dots.forEach(dot => dot.classList.remove('active'));
              
              if (dots[index]) {
                  dots[index].classList.add('active');
                  updateIndicatorPosition(dots[index]);
              }
          }
      });
  }, {
      root: slidesContainer, // Use the slides container as the viewport.
      threshold: 0.6         // 60% of the slide must be visible to trigger.
  });

  slides.forEach(slide => observer.observe(slide));
}

// Set up click functionality for the navigation dots.
export function setupDotNavigation() {
  const dots = document.querySelectorAll('.nav-dot');
  const slides = document.querySelectorAll('.slide');

  if (!dots.length || !slides.length) return;

  dots.forEach((dot, index) => {
      dot.addEventListener('click', function (event) {
          event.preventDefault();

          if (slides[index]) {
              slides[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
              updateIndicatorPosition(dot);

              // Update active dot manually since IntersectionObserver might not update instantly
              dots.forEach(d => d.classList.remove('active'));
              dot.classList.add('active');
          }
      });
  });
}