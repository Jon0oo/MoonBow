import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CustomEase } from "gsap/CustomEase";




gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, CustomEase);

document.addEventListener("DOMContentLoaded", () => {



  




  const car = document.querySelector('.carDiv');
  const lightTrailElement = document.getElementById("lightTrail");
  const lightTrailElement2 = document.getElementById("lightTrailOrange");
  const pathLength = lightTrailElement.getTotalLength();
  const pathLength2 = lightTrailElement2.getTotalLength();
  console.log("Path total length:", pathLength);
  
  // Use the actual path length for the dash array and offset.
  lightTrailElement.style.strokeDasharray = pathLength;
  lightTrailElement.style.strokeDashoffset = pathLength ;

  lightTrailElement2.style.strokeDasharray = pathLength2;
  lightTrailElement2.style.strokeDashoffset = pathLength2;








  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".slide2 .image-section",
      scroller: ".slide2",
      start: "top top",
      end: "100% bottom bottom",
      scrub: 2,
       //markers: true,  // Enable for debugging
    }
  });
  
  // Animate the car along the light trail path
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
  
  // Small push forward at the end
  timeline.to(car, {
    y: "+=100",  // Optional slight drop
    duration: 0.3,
    ease: "power2.out"
  }, ">"); // Runs immediately after the motionPath animation
  
  
  
  // Animate the drawing of the light trail by reducing the dash offset
  timeline.to(lightTrailElement, {
    strokeDashoffset: 0,
    duration:0.5,
    ease: CustomEase.create("custom", "M0,0 C0,0 0.074,0.072 0.092,0.084 0.097,0.087 0.141,0.123 0.202,0.184 0.232,0.214 0.306,0.255 0.35,0.286 0.393,0.317 0.456,0.355 0.5,0.4 0.564,0.467 0.677,0.489 0.741,0.559 0.779,0.6 0.906,0.671 0.906,0.671 0.906,0.671 0.962,0.746 0.988,0.818 1.02,0.907 1,1 1,1 "),
  }, 0); // start at the same time; if needed, you can add a delay (e.g., 0.1) here

  // Animate the drawing of the light trail by reducing the dash offset
  timeline.to(lightTrailElement2, {
    strokeDashoffset: 0,
    duration:0.5,
    ease: CustomEase.create("custom", "M0,0 C0,0 0.074,0.072 0.092,0.084 0.097,0.087 0.141,0.123 0.202,0.184 0.232,0.214 0.306,0.255 0.35,0.286 0.393,0.317 0.456,0.355 0.5,0.4 0.564,0.467 0.677,0.489 0.741,0.559 0.779,0.6 0.906,0.671 0.906,0.671 0.906,0.671 0.962,0.746 0.988,0.818 1.02,0.907 1,1 1,1 "),
  }, 0); // start at the same time; if needed, you can add a delay (e.g., 0.1) here
  








  const imageSection = document.querySelector(".slide2 .image-section");
  const contentSection = document.querySelector(".slide2 .content-section");


















  // Create a timeline that drives both animations together.
  gsap.timeline({
    scrollTrigger: {
      trigger: imageSection,
      scroller: ".slide2",
      start: "top top",
      end: "bottom bottom",
      scrub: 2,
      // markers: true,  // Uncomment for debugging
    }
  });

  // Animate image-section upward by 40vh.
  timeline.to(imageSection, {
    y: "-60vh",
    ease: CustomEase.create("M0,0 C0,0 0.384,0.033 0.429,0.048 0.468,0.061 0.603,0.166 0.64,0.184 0.676,0.202 0.669,0.19 0.783,0.315 0.89,0.433 0.863,0.403 0.878,0.441 0.93,0.581 0.936,0.615 0.936,0.615 0.936,0.615 0.983,0.822 0.983,0.822 0.983,0.822 1,1 1,1 "),
    duration: 2,
  }, 0);













  






});