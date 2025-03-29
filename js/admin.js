import { auth } from "./firebaseConfig.js";
import { db } from "./firebaseConfig.js";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";

import '../css/admin.css';

// Check if user is logged in
document.addEventListener("DOMContentLoaded", () => {
  const adminData = JSON.parse(localStorage.getItem("admin"));
  if (!adminData) {
    const basePath = window.location.pathname.includes("/MoonBow/") ? "/MoonBow" : "";
    window.location.href = `${basePath}/html/signin.html`;
  } else {
    // If logged in, fetch the demo rlequests
    fetchDemoRequests();
  }
});

// Logout function
document.getElementById("logout").addEventListener("click", () => {
  auth.signOut().then(() => {
    localStorage.removeItem("admin");
    const basePath = window.location.pathname.includes("/MoonBow/") ? "/MoonBow" : "";
    window.location.href = `${basePath}/index.html`;
  });
});

// Function to fetch and display demo requests
async function fetchDemoRequests() {
  const demoRequestsContainer = document.getElementById("demo-requests-container");

  // Firestore query to get demo requests ordered by timestamp (descending)
  const q = query(collection(db, "demoRequests"), orderBy("timestamp", "desc"));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const docId = docSnap.id;
      
      const demoRequestDiv = document.createElement("div");
      demoRequestDiv.classList.add("demo-request");

      demoRequestDiv.innerHTML = `
        <h3>${data.name}</h3>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong> ${data.message}</p>
        <p><strong>Company:</strong> ${data.company}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Selected Products:</strong> ${data.selectedProducts.join(", ")}</p>
        <p><strong>Region:</strong> ${data.region}</p>
        <p><strong>Status:</strong> <span class="status">${data.state || "Pending"}</span></p>
        <button class="update-status" data-id="${docId}" data-state="working on it">Mark as Working on it</button>
        <button class="update-status" data-id="${docId}" data-state="done">Mark as Done</button>
      `;
      
      demoRequestsContainer.appendChild(demoRequestDiv);
    });
    
    // Add event listeners for status buttons
    const updateButtons = document.querySelectorAll(".update-status");
    updateButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const docId = e.target.getAttribute("data-id");
        const newState = e.target.getAttribute("data-state");
        
        // Call the function to update the state
        await updateRequestState(docId, newState);
      });
    });
  } catch (error) {
    console.error("Error fetching demo requests: ", error);
  }
}

// Function to update the state of a demo request
async function updateRequestState(docId, newState) {
  const demoRequestRef = doc(db, "demoRequests", docId);

  try {
    await updateDoc(demoRequestRef, {
      state: newState
    });
    
    
    // Reload the requests after the update
    document.getElementById("demo-requests-container").innerHTML = '';
    fetchDemoRequests(); // Refresh the demo requests
  } catch (error) {
    console.error("Error updating demo request status: ", error);
  }
}
