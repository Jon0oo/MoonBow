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
    // If logged in, fetch the demo requests
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

// Function to switch between colors depending on status
function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return "#ba1717"; // red-ish
    case "working on it":
      return "#de6b12"; // orange-ish
    case "done":
      return "#28a745"; // green
    default:
      return "#bdc3c7"; // gray for unknown statuses
  }
}

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
        <div class="demo-request-header">
          <div class="name-wrapper">
            <h3>${data.name}</h3>
          </div>
          <div class="status-stripe" style="background-color: ${getStatusColor(data.state || "pending")}"></div>
        </div>
        <table class="demo-request-table">
          <tr>
            <td class="label"><strong>Email:</strong></td>
            <td class="value">${data.email}</td>
          </tr>
          <tr>
            <td class="label"><strong>Company:</strong></td>
            <td class="value">${data.company}</td>
          </tr>
          <tr>
            <td class="label"><strong>Phone:</strong></td>
            <td class="value">${data.phone}</td>
          </tr>
          <tr>
            <td class="label" id="labelMessage"><strong>Message:</strong></td>
            <td class="value">${data.message}</td>
          </tr>
          <tr>
            <td class="label"><strong>Products:</strong></td>
            <td class="value">${data.selectedProducts.join(", ")}</td>
          </tr>
          <tr>
            <td class="label"><strong>Region:</strong></td>
            <td class="value">${data.region}</td>
          </tr>
        </table>
        <button class="update-status update-status-pending" data-id="${docId}" data-state="pending">Mark as pending</button>
        <button class="update-status update-status-working" data-id="${docId}" data-state="working on it">Working on it</button>
        <button class="update-status update-status-done" data-id="${docId}" data-state="done">Done</button>
      `;

      demoRequestsContainer.appendChild(demoRequestDiv);
    });
    
    // Add event listeners for status buttons
    const updateButtons = document.querySelectorAll(".update-status");
    updateButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const docId = e.target.getAttribute("data-id");
        const newState = e.target.getAttribute("data-state");
        
        // Update the colored stripe immediately
        const demoRequestDiv = e.target.closest(".demo-request");
        const stripe = demoRequestDiv.querySelector(".status-stripe");
        if (stripe) {
          stripe.style.backgroundColor = getStatusColor(newState);
        }
        
        // Update the status in Firestore without reloading the entire container
        await updateRequestState(docId, newState);
      });
    });

  } catch (error) {
    console.error("Error fetching demo requests: ", error);
  }
}

// Function to update the state of a demo request on the server
async function updateRequestState(docId, newState) {
  const demoRequestRef = doc(db, "demoRequests", docId);
  try {
    await updateDoc(demoRequestRef, {
      state: newState
    });
    // No reload here—the UI update is handled by the event listener
  } catch (error) {
    console.error("Error updating demo request status: ", error);
  }
}
