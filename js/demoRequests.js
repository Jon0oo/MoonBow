// ✅ demoRequest.js (Form Submission Logic)
import { db } from "./firebaseConfig.js";
import { getRegion, resetSubmissionState, resetButtonVisuals } from "./firebaseHelpers.js";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

let isSubmitting = false;

// Handle form submission
export async function submitDemoRequest(event) {
  event.preventDefault();

  if (isSubmitting) {
    console.warn("🚨 Submission blocked: already in progress.");
    return false;
  }

  isSubmitting = true;
  const button = document.querySelector(".button-sent-demo-request");
  if (button) button.disabled = true;

  console.log("✅ Form submission started.");

  // Get selected products
  const selectedProducts = Array.from(document.querySelectorAll(".product-toggle.active"))
    .map(button => button.querySelector(".product-selection-span").textContent);

  console.log("🛍️ Selected products:", selectedProducts);

  // Get form fields
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("demo-message").value.trim();
  const company = document.getElementById("company").value.trim();
  const phone = document.getElementById("phone").value.trim();

  // Validate required fields
  if (!name || !email || !company) {
    console.error("❌ Form validation failed - missing required fields.");
    resetSubmissionState();
    return false;
  }

  // Validate product selection
  if (selectedProducts.length === 0) {
    console.error("❌ Form validation failed - no product selected.");
    const validationMessageWrapper = document.getElementById("productValidationMessageWrapper");
    if (validationMessageWrapper) {
      validationMessageWrapper.classList.add("isVisible");
      document.getElementById("productValidationMessage").style.display = "block";
    }
    resetSubmissionState();
    return false;
  }

  const region = await getRegion();

  try {
    // Submit to Firebase with a default "status" property (pending, seen, workedOn, completed can be used later)
    const docRef = await addDoc(collection(db, "demoRequests"), {
      name,
      email,
      message,
      company,
      phone,
      selectedProducts,
      timestamp: serverTimestamp(),
      region,
      status: "pending" // New property to track the request's progress
    });

    console.log("✅ Document successfully written with ID:", docRef.id);

    // Reset form and UI feedback
    document.getElementById("scheduleDemoForm").reset();
    if (button) {
      button.querySelector(".default").style.display = "none";
      button.querySelector(".success").style.display = "inline";
    }

    // Reset product selection UI
    document.querySelectorAll(".product-toggle").forEach(button => button.classList.remove("active"));

    // Dispatch success event
    document.dispatchEvent(new CustomEvent("demoSubmissionComplete", { detail: { success: true } }));

    return true;
  } catch (error) {
    console.error("❌ Error submitting request:", error);
    resetSubmissionState();

    // Dispatch failure event
    document.dispatchEvent(new CustomEvent("demoSubmissionComplete", { detail: { success: false } }));

    return false;
  }
}

// Attach event listener to form (ensuring only one)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("scheduleDemoForm");
  if (form && !form.getAttribute("data-listener-attached")) {
    form.addEventListener("submit", submitDemoRequest);
    form.setAttribute("data-listener-attached", "true");
    console.log("✅ Form event listener attached.");
  } else {
    console.error("❌ Form element not found or listener already attached.");
  }
});
