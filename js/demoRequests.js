// ✅ demoRequests.js (Form Submission Logic)
import { db } from "./firebaseConfig.js";
import { getRegion, resetSubmissionState, resetButtonVisuals } from "./firebaseHelpers.js";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

let isSubmitting = false;

// Handle form submission
export async function submitDemoRequest(event) {
  event.preventDefault();
  console.log("✅ Form submission triggered!");

  // Work with the specific form instance
  const form = event.currentTarget;

  if (isSubmitting) {
    console.warn("🚨 Submission blocked: already in progress.");
    return false;
  }

  isSubmitting = true;

  // Scope button selection to this form instance
  const button = form.querySelector(".button-sent-demo-request");
  if (button) button.disabled = true;

  console.log("✅ Form submission started.");

  // Get selected products scoped to this form or a parent container within it
  console.log("🔍 Checking for .product-toggle.active elements:", form.querySelectorAll(".product-toggle.active"));

  
  const modalElement = form.closest(".modal-popup"); // Get the modal containing the form

const selectedProducts = Array.from(modalElement.querySelectorAll(".product-toggle.active"))
  .map(btn => btn.querySelector(".product-selection-span")?.textContent.trim() || "");

console.log("🛍️ Selected products:", selectedProducts);


  // Get form fields scoped to this form
  const name = form.querySelector('[name="fullName"]').value.trim();
  const email = form.querySelector('[name="email"]').value.trim();
  const message = form.querySelector('[name="demo-message"]').value.trim();
  const company = form.querySelector('[name="company"]').value.trim();
  const phone = form.querySelector('[name="phone"]').value.trim();

  // Validate required fields
  if (!name || !email || !company) {
    console.error("❌ Form validation failed - missing required fields.");
    resetSubmissionState();
    isSubmitting = false; // Reset submitting flag
    return false;
  }

  // Validate product selection
  if (selectedProducts.length === 0) {
    console.error("❌ Form validation failed - no product selected.");
    // Use a form-scoped query for validation message elements
    const validationMessageWrapper = form.querySelector(".validation-message-wrapper");
    if (validationMessageWrapper) {
      validationMessageWrapper.classList.add("isVisible");
      form.querySelector(".validation-message").style.display = "block";
    }
    resetSubmissionState();
    isSubmitting = false;
    return false;
  }

  const region = await getRegion();

  try {
    // Submit to Firebase with a default "status" property
    const docRef = await addDoc(collection(db, "demoRequests"), {
      name,
      email,
      message,
      company,
      phone,
      selectedProducts,
      timestamp: serverTimestamp(),
      region,
      state: "pending"
    });

    console.log("✅ Document successfully written with ID:", docRef.id);

    // Reset form and UI feedback using the specific form instance
    form.reset();
    if (button) {
      button.querySelector(".default").style.display = "none";
      button.querySelector(".success").style.display = "inline";
    }

    // Reset product selection UI scoped to this form
    form.querySelectorAll(".product-toggle").forEach(btn => btn.classList.remove("active"));

    // Dispatch success event
    document.dispatchEvent(new CustomEvent("demoSubmissionComplete", { detail: { success: true } }));

    return true;
  } catch (error) {
    console.error("❌ Error submitting request:", error);
    resetSubmissionState();

    // Dispatch failure event
    document.dispatchEvent(new CustomEvent("demoSubmissionComplete", { detail: { success: false } }));

    return false;
  } finally {
    isSubmitting = false;
    if (button) button.disabled = false;
  }
}

// Attach event listener to all form instances on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".modal-content");
  forms.forEach(form => {
    if (!form.getAttribute("data-listener-attached")) {
      form.addEventListener("submit", submitDemoRequest);
      form.setAttribute("data-listener-attached", "true");
      console.log("✅ Form event listener attached for form instance.");
    }
  });
});
