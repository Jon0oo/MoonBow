// ✅ firebaseHelpers.js (Utility Functions)

// Get visitor's region via IP
export async function getRegion() {
    try {
      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      return data.region;
    } catch (error) {
      console.error("⚠️ Error fetching region:", error);
      return null;
    }
  }
  
  // Reset the submission state to allow new form submissions
  export function resetSubmissionState() {
    const button = document.querySelector(".button-sent-demo-request");
    if (button) button.disabled = false;
  }
  
  // Reset button visuals after form submission
  export function resetButtonVisuals() {
    const button = document.querySelector(".button-sent-demo-request");
    if (button) {
      button.classList.remove("active", "sent");
      const defaultSpan = button.querySelector(".default");
      const successSpan = button.querySelector(".success");
      if (defaultSpan) defaultSpan.style.display = "inline";
      if (successSpan) successSpan.style.display = "none";
    }
  }
  