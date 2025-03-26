// Import Firebase modules properly for Webpack
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// 🔹 Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Function to handle form submission
async function submitDemoRequest(event) {
  event.preventDefault(); // Prevent page refresh

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    await addDoc(collection(db, "demoRequests"), {
      name: name,
      email: email,
      message: message,
      timestamp: new Date()
    });

    alert("Demo request submitted successfully!");
    document.getElementById("demoRequestForm").reset();
  } catch (error) {
    console.error("Error submitting request: ", error);
    alert("Something went wrong. Please try again!");
  }
}

// Attach event listener when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("demoRequestForm");
  if (form) {
    form.addEventListener("submit", submitDemoRequest);
  } else {
    console.error("Form not found!");
  }
});
