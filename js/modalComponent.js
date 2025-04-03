import { submitDemoRequest } from './demoRequests.js'; // ✅ Corrected import
import { gsap } from "gsap";

function getVar(variableName) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  console.log(`getVar: ${variableName} = ${value}`);
  return value;
}

class DemoModal {
  constructor(modalElement) {
    this.modalElement = modalElement;
    this.closeButton = this.modalElement.querySelector(".modal-close");
    this.submitButtons = this.modalElement.querySelectorAll(".button-sent-demo-request");
    this.productToggles = this.modalElement.querySelectorAll(".product-toggle");
    this.form = this.modalElement.querySelector(".scheduleDemoForm");

    // Add a flag to track if this modal is active
    this.isActive = false;

    // Bind methods
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.attachListeners();
    this.attachProductListeners();
    this.attachSubmitButtonAnimations();
    this.attachFormListener(); // ✅ Ensure form submission works
  }

  attachListeners() {
    this.closeButton.addEventListener("click", this.close);
    this.modalElement.addEventListener("click", this.handleBackdropClick);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  attachProductListeners() {
    this.productToggles.forEach((button) => {
      button.addEventListener("click", () => {
        button.classList.toggle("active");
        this.updateValidationMessage();  // Call on each toggle
      });
    });
  }

  // This method now updates the validation message for *this* instance
  updateValidationMessage() {
    if (!this.isActive) return;  // Do nothing if this modal isn't active

   

    const selectedProducts = this.modalElement.querySelectorAll(".product-toggle.active");
    const validationMessage = this.modalElement.querySelector(".validation-message");
    const validationMessageWrapper = this.modalElement.querySelector(".validation-message-wrapper");

    if (!validationMessage || !validationMessageWrapper) {
      console.warn("⚠️ Validation elements not found inside modal!");
      return;
    }

    if (selectedProducts.length === 0) {
        validationMessage.style.display = "block";
        validationMessage.classList.add("isVisible");
        validationMessageWrapper.classList.add("isVisible");
    } else {
        validationMessage.style.display = "none";
        validationMessage.classList.remove("isVisible");
        validationMessageWrapper.classList.remove("isVisible");
    }
  }

  attachSubmitButtonAnimations() {
    this.submitButtons.forEach((button) => {
      const form = button.closest("form");
      if (!form) return;

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (button.classList.contains("active")) return;

        button.classList.add("active");
        try {
          document.dispatchEvent(new CustomEvent("demoSubmissionStart", {
            detail: { formData: new FormData(form) }
          }));

          const result = await new Promise((resolve) => {
            document.addEventListener("demoSubmissionComplete", (event) => {
              resolve(event.detail.success);
            }, { once: true });
          });

          if (!result) return;

          gsap.to(button, {
            keyframes: [{
              '--left-wing-first-x': 50,
              '--left-wing-first-y': 100,
              '--right-wing-second-x': 50,
              '--right-wing-second-y': 100,
              duration: .2,
              onComplete() {
                gsap.set(button, {
                  '--left-wing-first-y': 0,
                  '--left-wing-second-x': 40,
                  '--left-wing-second-y': 100,
                  '--left-wing-third-x': 0,
                  '--left-wing-third-y': 100,
                  '--left-body-third-x': 40,
                  '--right-wing-first-x': 50,
                  '--right-wing-first-y': 0,
                  '--right-wing-second-x': 60,
                  '--right-wing-second-y': 100,
                  '--right-wing-third-x': 100,
                  '--right-wing-third-y': 100,
                  '--right-body-third-x': 60
                });
              }
            }, {
              '--left-wing-third-x': 20,
              '--left-wing-third-y': 90,
              '--left-wing-second-y': 90,
              '--left-body-third-y': 90,
              '--right-wing-third-x': 80,
              '--right-wing-third-y': 90,
              '--right-body-third-y': 90,
              '--right-wing-second-y': 90,
              duration: .2
            }, {
              '--rotate': 50,
              '--left-wing-third-y': 95,
              '--left-wing-third-x': 27,
              '--right-body-third-x': 45,
              '--right-wing-second-x': 45,
              '--right-wing-third-x': 60,
              '--right-wing-third-y': 83,
              duration: .25
            }, {
              '--rotate': 55,
              '--plane-x': -8,
              '--plane-y': 24,
              duration: .2
            }, {
              '--rotate': 40,
              '--plane-x': 45,
              '--plane-y': -180,
              '--plane-opacity': 0,
              duration: .3
    }, {
              '--rotate': 0,  // Add this final keyframe
              duration: .2    // Adjust duration as needed
            }]
          });
  
          // Success state animation
          gsap.to(button, {
            keyframes: [{
              '--text-opacity': 0,
              '--border-radius': 0,
              '--left-wing-background': getVar('--primary-darkest'),
              '--right-wing-background': getVar('--primary-darkest'),
              duration: .1
            }, {
              '--left-wing-background': getVar('--primary'),
              '--right-wing-background': getVar('--primary'),
              duration: .1
            }, {
              '--left-body-background': getVar('--primary-dark'),
              '--right-body-background': getVar('--primary-darkest'),
              duration: .4
            }, {
              '--success-opacity': 1,
              '--success-scale': 1,
              duration: .25,
              delay: .25
            }]
          });
  
          gsap.to(button, {
            onComplete() {
              button.classList.add('sent');
              button.disabled = true;
              console.log('Form submitted successfully and button animated');
            }
          });

        } catch (error) {
          console.error("❌ Form submission failed:", error);
          button.classList.remove("active");
          button.disabled = false;
        }
      });

      document.addEventListener("dialogOpened", () => {
        button.classList.remove("active", "sent");
        button.removeAttribute("style");
        button.disabled = false;
      });
    });
  }

  attachFormListener() {
    document.addEventListener("dialogOpened", () => {
      const form = this.modalElement.querySelector(".scheduleDemoForm");
      if (form && !form.getAttribute("data-listener-attached")) {
        form.addEventListener("submit", submitDemoRequest);
        form.setAttribute("data-listener-attached", "true");
        console.log("✅ Form listener attached inside modal.");
      }
    });
  }

  open() {
    this.modalElement.classList.add("active");
    this.modalElement.setAttribute("aria-hidden", "false");
    this.isActive = true;  // Mark this modal as active
    document.dispatchEvent(new Event("dialogOpened"));

    const firstInput = this.modalElement.querySelector("input");
    if (firstInput) firstInput.focus();

    // Call validation on open
    this.updateValidationMessage();
  }

  close() {
    this.modalElement.classList.remove("active");
    this.modalElement.setAttribute("aria-hidden", "true");
    this.isActive = false;  // Mark this modal as inactive
  }

  handleBackdropClick(event) {
    if (event.target === this.modalElement) {
      this.close();
    }
  }

  handleKeyDown(event) {
    if (event.key === "Escape" && this.modalElement.classList.contains("active")) {
      this.close();
    }
  }
}

export default DemoModal;
