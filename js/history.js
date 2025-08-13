import '../css/global.css';
import '../css/history.css';









import { gsap } from "gsap"; // assuming gsap is bundled via Parcel or similar
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded event fired.");

    // Ensure the script runs only on history.html
if (window.location.pathname.endsWith("history.html")) {
    console.log("Executing script on history.html");

    let refreshCounter = 0; // Start counter at 0
    const textElement = document.getElementById("text");
    const fullText = "Moonbow was founded with a singular ambition: to redefine the way organizations communicate internally. Recognizing the inefficiencies in traditional communication infrastructures, our founders set out to create a company that seamlessly blends cutting-edge technology with intuitive, human-centric solutions. <br> <br> <br> <big>The Beginning: A Vision of Change.</big> <br> <br> The idea behind Moonbow emerged from a simple yet profound realization—communication within organizations, no matter how advanced their technology, was often fragmented and inefficient. Inspired by the elusive beauty of a moonbow, our founders saw an opportunity to bring clarity, efficiency, and innovation to internal networks and IT management. <br> <br> <br> From the outset, Moonbow was built on the principle that technology should not only be powerful but also effortless to use. With a deep focus on smart connectivity, streamlined IT solutions, and sustainable innovation, we embarked on a mission to revolutionize digital and physical networks. <br> <br> <br> <big>Growth & Innovation</big> <br> <br> <br> As Moonbow evolved, we expanded our product offerings to address both physical-level and software-level communication challenges. <br> <br> <br> Our flagship solutions — FiberFlow, SmartLink, FastIT, and FactoryIT — were developed to empower businesses of all sizes, ensuring seamless integration between digital and physical infrastructures. <br> <br> By staying ahead of industry trends and embracing emerging technologies like AI, IoT, and automation, Moonbow has continued to refine its approach. Today, we stand as a leader in smart, scalable, and sustainable communication solutions. <br> <br> <br> Looking to the Future While our journey has been one of innovation and progress, the essence of Moonbow remains unchanged: We challenge the ordinary, push the boundaries of technology, and deliver solutions that not only meet but exceed expectations. As we move forward, our commitment to excellence, sustainability, and customer-centric innovation continues to guide us toward new horizons. <br> <br> <br> At Moonbow, the future of communication isn't just something we anticipate—it's something we create. <br>";

    const tokens = fullText.split(/(<big>.*?<\/big>|\s+|<br\s*\/?>)/gi).filter(token => token !== "");
    let tokenIndex = 0;
    const delay = 1; // Delay in ms between tokens

    function typeWriter() {
        if (tokenIndex < tokens.length) {
            let newToken = tokens[tokenIndex];

            // Convert <big> tags into pans for styling & animation
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



        gsap.to(".history-page", {
            backgroundColor: "#6e6e6e", // Transition to a light gray
            ease: "none",
            scrollTrigger: {
              trigger: ".contentHistory",
              start: "10% top top",
              end: "bottom top",
              scrub: true,
              //markers:true,
            }
          });






          gsap.to(".contentHistory", {
            y: "-20vh", 
            ease: "none", // Linear easing ensures the movement matches the scroll exactly
            duration: 1, // The duration of the animation
            scrollTrigger: {
              trigger: ".contentHistory",
              
              
          
              
              start: "10% top top",
              end: "bottom top",     
              scrub: 2,               // Smoothly links the animation to the scroll position
            }
          });








          

    } else {
        console.log("Script not executed: This is not history.html");
    }
});
