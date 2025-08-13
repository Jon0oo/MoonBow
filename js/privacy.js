import '../css/privacy.css';

const navContainer = document.querySelector('.nav-container');
const footerPrivacy = document.querySelector('.footer');

const lockSection = document.querySelector('.lock-section');
const toggleSwitch = document.getElementById('toggleSwitch');
const lockClosed = document.querySelector('.lock-closed');
const lockOpen = document.querySelector('.lock-open');
const slider = document.querySelector('.slide'); // Assuming your slider has this class

let isLocked = true;

function updateSliderScale() {
  if (lockClosed.classList.contains('visible')) {
    // Disable interactions
    toggleSwitch.style.pointerEvents = 'none';
    slider.style.pointerEvents = 'none';

    // Start slider expansion after short delay
    setTimeout(() => {
      slider.style.transition = 'transform 4s ease, background-color 2s ease';
      slider.style.transform = 'scale(200)';
      slider.style.color = '#efefef';

      lockClosed.style.left = '90%';

      // Unveil nav and footer during the expansion
      navContainer.classList.remove('invisible');
      footerPrivacy.classList.remove('invisible');

      navContainer.style.opacity = '1';
      footerPrivacy.style.opacity = '1';
    }, 500);

    // Hide slider and toggle after the expansion completes
    setTimeout(() => {
      slider.style.display = 'none';
      toggleSwitch.style.display = 'none';
    }, 1100); // slightly longer than the slider transform duration
  }
}

toggleSwitch.addEventListener('click', () => {
  toggleSwitch.classList.toggle('on');
  isLocked = !isLocked;

  // Toggle visibility classes for smooth fade
  lockClosed.classList.toggle('hidden', isLocked);
  lockClosed.classList.toggle('visible', !isLocked);

  lockOpen.classList.toggle('hidden', !isLocked);
  lockOpen.classList.toggle('visible', isLocked);

  // Update slider scale and animation
  updateSliderScale();
});
