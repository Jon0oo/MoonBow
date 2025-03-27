// Import required Firebase SDK modules
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";



console.log('🔍 Firebase script loaded at:', new Date().toISOString());



// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDY1zNPbPtrXbXpOTXjp45xwEv97pqK88I",
  authDomain: "moonbow-1.firebaseapp.com",
  projectId: "moonbow-1",
  storageBucket: "moonbow-1.firebasestorage.app",
  messagingSenderId: "857153315917",
  appId: "1:857153315917:web:91cfab2128c8c16119e804",
};

// Create a global variable for the database
let db;

// Initialize Firebase only once
window.initializeFirebase = () => {
  if (window.firebaseInitialized) return;
  window.firebaseInitialized = true;
  
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app); // Assign to the global variable
};

// Call initialization
window.initializeFirebase();

// Global flag to prevent duplicate submissions
let isSubmitting = false;

// Helper function to get visitor's region
async function getRegion() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.region;
  } catch (error) {
    console.error("Error fetching region:", error);
    return null;
  }
}

function resetSubmissionState() {
  isSubmitting = false;
  const button = document.querySelector('.button-sent-demo-request');
  if (button) {
    button.disabled = false;
  }
}

function resetButtonVisuals() {
  const button = document.querySelector('.button-sent-demo-request');
  if (button) {
    button.classList.remove('active', 'sent');
    const defaultSpan = button.querySelector(".default");
    const successSpan = button.querySelector(".success");
    if (defaultSpan) defaultSpan.style.display = 'inline';
    if (successSpan) successSpan.style.display = 'none';
  }
}

// Prevent multiple form submissions
export async function submitDemoRequest(event) {
  event.preventDefault();

  if (isSubmitting) {
    console.warn("🚨 Submission blocked: already in progress.");
    return false;
  }
  isSubmitting = true; // Set flag to prevent double execution

  const button = document.querySelector('.button-sent-demo-request');
  if (button) button.disabled = true; // Disable button immediately

  console.log("✅ Form submission started.");

  // Get selected products
  const selectedProducts = Array.from(document.querySelectorAll('.product-toggle.active'))
    .map(button => button.querySelector('.product-selection-span').textContent);

  console.log("Selected products:", selectedProducts);

  // Get form fields
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("demo-message").value.trim();
  const company = document.getElementById("company").value.trim();
  const phone = document.getElementById("phone").value.trim();

  // Validate required fields
  if (!name || !email || !company) {
    console.error("❌ Form validation failed - missing required fields");
    resetSubmissionState();
    return false;
  }

  // Validate product selection
  if (selectedProducts.length === 0) {
    console.error("❌ Form validation failed - no product selected");
    const validationMessage = document.getElementById("productValidationMessage");
    const validationMessageWrapper = document.getElementById("productValidationMessageWrapper");

    if (validationMessage) {
      validationMessageWrapper.classList.remove("isVisible");
      validationMessage.style.display = 'none';
    }

    void validationMessageWrapper.offsetWidth;

    validationMessageWrapper.classList.add("isVisible");
    validationMessage.style.display = 'block';

    resetButtonState();
    return false;
  }

  const region = await getRegion();

  try {
    // Submit to Firebase
    const docRef = await addDoc(collection(db, "demoRequests"), {
      name,
      email,
      message,
      company,
      phone,
      selectedProducts,
      timestamp: serverTimestamp(),
      region
    });

    console.log("✅ Document written with ID:", docRef.id);

    // Reset form and update UI
    document.getElementById("scheduleDemoForm").reset();
    if (button) {
      const defaultSpan = button.querySelector(".default");
      const successSpan = button.querySelector(".success");
      if (defaultSpan) defaultSpan.style.display = 'none';
      if (successSpan) successSpan.style.display = 'inline';
    }

    // Reset product selection
    document.querySelectorAll('.product-toggle').forEach(button => {
      button.classList.remove('active');
    });

    

    // Dispatch success event
    const customEvent = new CustomEvent('demoSubmissionComplete', {
      detail: { success: true }
    });
    document.dispatchEvent(customEvent);

    return true;
  } catch (error) {
    console.error("❌ Error submitting request:", error);
    resetSubmissionState();

    // Dispatch failure event
    const customEvent = new CustomEvent('demoSubmissionComplete', {
      detail: { success: false }
    });
    document.dispatchEvent(customEvent);

    return false;
  }
}

// Ensure the form only has one event listener

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("scheduleDemoForm");
  
  if (form) {
    // Check if we already attached a listener
    if (form.getAttribute('data-listener-attached')) {
      console.log("⚠️ Form already has a listener attached, skipping.");
      return;
    }

    form.removeEventListener("submit", submitDemoRequest);
    form.addEventListener("submit", submitDemoRequest);
    
    // Mark the form as having a listener
    form.setAttribute('data-listener-attached', 'true');
    console.log("✅ Form event listener attached (only once).");
  } else {
    console.error("❌ Form element not found.");
  }
});
