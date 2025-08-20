import '../css/privacy.css';

const navContainer = document.querySelector('.nav-container');
const footerPrivacy = document.querySelector('.footer');
const footerShadow = document.querySelector('.footer-shadow');

const textPrivacyWrapper = document.querySelector('.text-privacy-wrapper');

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
      textPrivacyWrapper.style.display = 'block';

      lockClosed.style.left = '90%';

      // Unveil nav and footer during the expansion
      navContainer.classList.remove('invisible');
      footerPrivacy.classList.remove('invisible');
      footerShadow.classList.remove('invisible');

      navContainer.style.opacity = '1';
      footerPrivacy.style.opacity = '1';
    }, 500);

    // Hide slider and toggle after the expansion completes
    setTimeout(() => {
      slider.style.display = 'none';
      toggleSwitch.style.display = 'none';
      textPrivacyWrapper.style.zIndex = '9999'; // note the capital 'I'
      textPrivacyWrapper.style.display = 'block';
      textPrivacyWrapper.style.opacity = '1';

      showBarNet();


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



function showBarNet() {
  const net = document.createElement('div');
  net.classList.add('bar-net');

  const overlay = document.createElement('div');
  overlay.classList.add('bar-overlay');
  net.appendChild(overlay);

  const verticalCount = 8;
  for (let i = 0; i < verticalCount; i++) {
    const bar = document.createElement('div');
    bar.classList.add('bar', 'vertical');

    const positionPercent = (i / (verticalCount - 1)) * 100;
    bar.style.left = `${positionPercent}%`;

    // Opacity stays max for first 15% of width, then decreases
    let opacity;
    if (positionPercent <= 15) {
      opacity = 1; // full opacity in leftmost 15%
    } else {
      const fadeProgress = (positionPercent - 15) / 85; // remaining width
      opacity = 1 - fadeProgress * 0.8; // fades to ~0.2 at far right
    }
    bar.style.opacity = opacity;

    let extraHeight = 0;
    if (i === Math.floor(verticalCount / 2) || i === Math.floor(verticalCount / 2) - 1) {
      extraHeight = Math.random() * 50 + 30;
    } else {
      extraHeight = Math.random() * 20;
    }
    bar.dataset.finalHeight = `calc(100% + ${extraHeight}px)`;
    bar.style.height = bar.dataset.finalHeight;

    net.appendChild(bar);
  }

  const horizontalCount = 6;
  for (let i = 0; i < horizontalCount; i++) {
    const bar = document.createElement('div');
    bar.classList.add('bar', 'horizontal');
    bar.style.top = `${(i / (horizontalCount - 1)) * 100}%`;

    // Horizontal bars use same fade logic based on X position percentage
    const posXPercent = 0; // they span full width, so use left fade
    let opacity;
    if (posXPercent <= 15) {
      opacity = 1;
    } else {
      const fadeProgress = (posXPercent - 15) / 85;
      opacity = 1 - fadeProgress * 0.8;
    }
    bar.style.opacity = opacity;

    net.appendChild(bar);
  }

  document.body.appendChild(net);

  // Step 1: Expand container
  requestAnimationFrame(() => {
    net.style.transition = "transform 0.8s ease-out";
    net.style.transform = "scaleX(1)";

    // Step 2: Fade overlay
    setTimeout(() => {
      overlay.style.opacity = '1';
    }, 200);

    // Step 3: Animate bars with overshoot
    const bars = net.querySelectorAll('.bar');
    bars.forEach(bar => {
      const delay = Math.random() * 300 + 100;
      const duration = Math.random() * 500 + 300;

      setTimeout(() => {
        bar.style.transition = `transform ${duration}ms ease-out, opacity 300ms ease`;

        if (bar.classList.contains('vertical')) {
          bar.style.transform = 'scaleY(1.05)';
          setTimeout(() => {
            bar.style.transition = 'transform 200ms ease-out';
            bar.style.transform = 'scaleY(1)';
          }, duration); 
        } else {
          bar.style.transform = 'scaleX(1.05)';
          setTimeout(() => {
            bar.style.transition = 'transform 200ms ease-out';
            bar.style.transform = 'scaleX(1)';
          }, duration);
        }
      }, delay);
    });
  });
}
