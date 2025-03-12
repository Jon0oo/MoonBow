import { gsap } from "gsap"; // assuming gsap is bundled via Parcel or similar
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded event fired.");

    // Check if the current page is vision.html
    if (window.location.pathname.endsWith("vision.html")) {
        console.log("Executing script on vision.html");

        const text = "Moonbow was founded with a singular ambition: to redefine the way organizations communicate internally. Recognizing the inefficiencies in traditional communication infrastructures, our founders set out to create a company that seamlessly blends cutting-edge technology with intuitive, human-centric solutions. <br> <br> The Beginning: A Vision of Change. <br> <br> The idea behind Moonbow emerged from a simple yet profound realization—communication within organizations, no matter how advanced their technology, was often fragmented and inefficient. Inspired by the elusive beauty of a moonbow, our founders saw an opportunity to bring clarity, efficiency, and innovation to internal networks and IT management. From the outset, Moonbow was built on the principle that technology should not only be powerful but also effortless to use. With a deep focus on smart connectivity, streamlined IT solutions, and sustainable innovation, we embarked on a mission to revolutionize digital and physical networks. <br> <br> Growth & Innovation As Moonbow evolved, we expanded our product offerings to address both physical-level and software-level communication challenges. <br> <br> Our flagship solutions—FiberFlow, SmartLink, FastIT, and FactoryIT—were developed to empower businesses of all sizes, ensuring seamless integration between digital and physical infrastructures. <br> <br> By staying ahead of industry trends and embracing emerging technologies like AI, IoT, and automation, Moonbow has continued to refine its approach. Today, we stand as a leader in smart, scalable, and sustainable communication solutions. <br> <br> Looking to the Future While our journey has been one of innovation and progress, the essence of Moonbow remains unchanged: We challenge the ordinary, push the boundaries of technology, and deliver solutions that not only meet but exceed expectations. As we move forward, our commitment to excellence, sustainability, and customer-centric innovation continues to guide us toward new horizons. <br> <br> At Moonbow, the future of communication isn't just something we anticipate—it's something we create.";

        let index = 0;
        const speed = 50; // Milliseconds between each character

        function typeWriter() {
            const textSpan = document.getElementById("text");

            if (index < text.length) {
                if (text.substring(index, index + 4) === "<br>") {
                    textSpan.innerHTML += "<br>";
                    index += 4;
                } else {
                    textSpan.innerHTML += text.charAt(index);
                    index++;
                }
                setTimeout(typeWriter, speed);
            }
        }

        typeWriter();

        // Create the ScrollTrigger
        gsap.to(".contentHistory", {
            y: "-40vh",
            ease: "none",
            duration: 1,
            scrollTrigger: {
                trigger: ".contentHistory",
                markers: true,
                start: "1% top top",
                end: "bottom bottom",
                scrub: 2,
            }
        });
    } else {
        console.log("Script not executed: This is not vision.html");
    }
});
