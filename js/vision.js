import '../css/global.css';
import '../css/vision.css';



import { gsap } from "gsap"; // assuming gsap is bundled via Parcel or similar
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded event fired.");

    // Ensure the script runs only on vision.html
if (window.location.pathname.endsWith("vision.html")) {
    console.log("Executing script on vision.html");

    let refreshCounter = 0; // Start counter at 0
    const textElement = document.getElementById("text");
    const fullText = `At <big> Moonbow </big>, we empower organizations to achieve unparalleled communication efficiency by merging cutting-edge technology with intuitive, user-friendly solutions. <br> <br> <br> A moonbow is a rare and extraordinary phenomenon—a nighttime rainbow that appears under unique conditions. Unlike the common rainbow, a moonbow stands out as something unexpected and awe-inspiring. <br> <br> <br> This reflects our commitment to delivering solutions that break the mold, bringing both innovation and elegance to the world of business communication. <br>`;
    // Split text into tokens (words, spaces, <br> tags)
    const tokens = fullText.split(/(<big>.*?<\/big>|\s+|<br\s*\/?>)/gi).filter(token => token !== "");
    let tokenIndex = 0;
    const delay = 30; // Delay in ms between tokens

    function typeWriter() {
        if (tokenIndex < tokens.length) {
            let newToken = tokens[tokenIndex];

            // Convert <big> tags into spans for styling & animation
            if (newToken.startsWith("<big>") && newToken.endsWith("</big>")) {
                let wordInside = newToken.replace(/<\/?big>/g, ""); // Extract the word
                newToken = `<span class="highlight">${wordInside}</span>`;
            }

            textElement.innerHTML += newToken;
            tokenIndex++;
            refreshCounter++;

            // Animate highlighted words
            if (newToken.includes('class="highlight"')) {
                gsap.fromTo(".highlight:last-child",
                    { fontSize: "4rem" },
                    { fontSize: "4rem", duration: 5, yoyo: true, repeat: 1, ease: "power4.inOut" }
                );
            }

            // Refresh ScrollTrigger every 10 tokens for smooth scrolling
            if (refreshCounter % 20 === 0 && typeof ScrollTrigger !== "undefined") {
                ScrollTrigger.refresh();
            }

            setTimeout(typeWriter, delay);
        }
    }

    typeWriter();



        gsap.to(".vision-page", {
            backgroundColor: "#6e6e6e", // Transition to a light gray
            ease: "none",
            scrollTrigger: {
              trigger: ".contentVision",
              start: "10% top top",
              end: "bottom top",
              scrub: true,
              
            }
          });







          gsap.to(".contentVision", {
            y: "-20vh", 
            ease: "none", // Linear easing ensures the movement matches the scroll exactly
            duration: 1, // The duration of the animation
            scrollTrigger: {
              trigger: ".contentVision",
              
              //markers:true,
          
              
              start: "10% top top",
              end: "bottom top",     
              scrub: 2,               // Smoothly links the animation to the scroll position
            }
          });








          if (module.hot) {
            module.hot.accept('./vision.js', () => {
              console.log('HMR accepted update forr vision.js');
            });
          }
          

          

    } else {
        console.log("Script not executed: This is not vision.html");
    }
});
