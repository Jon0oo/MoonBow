import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, CustomEase);

document.addEventListener("DOMContentLoaded", () => {
    const car = document.querySelector('.carDiv');
    const lightTrailElement = document.getElementById("lightTrail");
    const lightTrailElement2 = document.getElementById("lightTrailOrange");

    let timeline;

    function setupPathAnimation(keepProgress = false) {
        if (!car || !lightTrailElement || !lightTrailElement2) return;

        const pathLength = lightTrailElement.getTotalLength();
        const pathLength2 = lightTrailElement2.getTotalLength();
        lightTrailElement.style.strokeDasharray = pathLength;
        lightTrailElement.style.strokeDashoffset = pathLength;
        lightTrailElement2.style.strokeDasharray = pathLength2;
        lightTrailElement2.style.strokeDashoffset = pathLength2;

        let currentProgress = 0;

        if (timeline && keepProgress) {
            currentProgress = timeline.progress(); // Save progress before recreating
            timeline.kill(); // Remove old timeline without resetting progress
        }

        timeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".slide2 .image-section",
                scroller: ".slide2",
                start: "top top",
                end: "100% bottom bottom",
                scrub: 2,
            }
        });

        timeline.to(car, {
            duration: 1.1,
            motionPath: {
                ease: "none",
                path: lightTrailElement,
                align: lightTrailElement,
                autoRotate: 180,
                alignOrigin: [0.5, 0.5]
            }
        }, 0);

        timeline.to(car, {
            y: "+=100",
            duration: 0.3,
            ease: "power2.out"
        }, ">");

        timeline.to(lightTrailElement, {
            strokeDashoffset: 0,
            duration: 0.5,
            ease: CustomEase.create("custom", "M0,0 C0,0 0.074,0.072 0.092,0.084 0.097,0.087 0.141,0.123 0.202,0.184 0.232,0.214 0.306,0.255 0.35,0.286 0.393,0.317 0.456,0.355 0.5,0.4 0.564,0.467 0.677,0.489 0.741,0.559 0.779,0.6 0.906,0.671 0.906,0.671 0.906,0.671 0.962,0.746 0.988,0.818 1.02,0.907 1,1 1,1 "),
        }, 0);

        timeline.to(lightTrailElement2, {
            strokeDashoffset: 0,
            duration: 0.5,
            ease: CustomEase.create("custom", "M0,0 C0,0 0.074,0.072 0.092,0.084 0.097,0.087 0.141,0.123 0.202,0.184 0.232,0.214 0.306,0.255 0.35,0.286 0.393,0.317 0.456,0.355 0.5,0.4 0.564,0.467 0.677,0.489 0.741,0.559 0.779,0.6 0.906,0.671 0.906,0.671 0.906,0.671 0.962,0.746 0.988,0.818 1.02,0.907 1,1 1,1 "),
        }, 0);

        if (keepProgress) {
            timeline.progress(currentProgress); // Restore progress after refresh
        }
    }

    setupPathAnimation(); // Run on page load

    // Recalculate and update the animation on resize without losing scroll progress
    window.addEventListener('resize', () => {
        setTimeout(() => setupPathAnimation(true), 100);
    });

    // Scroll-triggered animations for slide2
    const imageSection = document.querySelector(".slide2 .image-section");
    const slide2 = document.querySelector(".slide2");

    function initImageSectionAnimation() {
        // Kill any existing ScrollTrigger instance for this animation.
        const existingTrigger = ScrollTrigger.getById("imageSectionAnimation");
        if (existingTrigger) {
          existingTrigger.kill();
        }
      
        if (window.innerWidth / window.innerHeight >= 0.52) {
          gsap.timeline({
            scrollTrigger: {
              id: "imageSectionAnimation", // assign an ID for easy reference
              trigger: imageSection,
              scroller: ".slide2",
              start: "top top",
              end: "bottom bottom",
              scrub: 2,
            }
          }).to(imageSection, {
            y: "-60vh",
            ease: CustomEase.create(
              "custom",
              "M0,0 C0,0 0.384,0.033 0.429,0.048 0.468,0.061 0.603,0.166 0.64,0.184 0.676,0.202 0.669,0.19 0.783,0.315 0.89,0.433 0.863,0.403 0.878,0.441 0.93,0.581 0.936,0.615 0.936,0.615 0.936,0.615 0.983,0.822 0.983,0.822 0.983,0.822 1,1 1,1 "
            ),
            duration: 2,
          });
        }
      }
      
      // Initialize on page load
      initImageSectionAnimation();
      
      // Reinitialize on resize
      window.addEventListener("resize", () => {
        setTimeout(initImageSectionAnimation, 100);
      });
      

    // Stretch effect on links when scrolling
    const infoBoxLink2Text = document.getElementById("info-box-link-2-text");
    const infoBoxLink1Text = document.getElementById("info-box-link-1-text");
    let scrollTimeout;
    let lastScrollTop = 0;

    slide2.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);
        const currentScrollTop = slide2.scrollTop;
        const isScrollingDown = currentScrollTop > lastScrollTop;

        if (isScrollingDown) {
            infoBoxLink1Text.style.transformOrigin = "bottom center";
            infoBoxLink2Text.style.transformOrigin = "bottom center";
        } else {
            infoBoxLink1Text.style.transformOrigin = "top center";
            infoBoxLink2Text.style.transformOrigin = "top center";
        }

        lastScrollTop = currentScrollTop;

        const minScale = 1;
        const maxScale = 1.1;
        const scaleFactor = Math.min(maxScale, Math.max(minScale, 1 + slide2.scrollTop / 1200));

        gsap.to([infoBoxLink1Text, infoBoxLink2Text], {
            scaleY: scaleFactor,
            duration: 0.5,
            ease: "power2.out",
        });

        scrollTimeout = setTimeout(() => {
            gsap.to([infoBoxLink1Text, infoBoxLink2Text], {
                scaleY: 1,
                duration: 0.7,
                ease: "power2.out",
            });
        }, 150);
    });
});
