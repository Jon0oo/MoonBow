// Slide 4 css
import '../css/slideFactoryIt.css';

import { gsap } from "gsap"; // assuming gsap is bundled via Parcel or similar
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const vid = document.getElementById('scrollVideo');
vid.src = "videos/AnimationCarFactoryIT.webm";
vid.load();

    vid.addEventListener('loadedmetadata', () => {
      gsap.to(vid, {
        currentTime: vid.duration,
        ease: "none",
        scrollTrigger: {
          trigger: "#video-section",
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
          pin: true,
          markers: true
        }
      });
    });