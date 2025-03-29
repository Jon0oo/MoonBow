import { auth } from "./firebaseConfig.js";
import { signInWithEmailAndPassword } from "firebase/auth";


import '../css/signin.css';

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

   



    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store login status in localStorage
      localStorage.setItem("admin", JSON.stringify(user));

      

      const basePath = window.location.pathname.includes("/MoonBow/") ? "/MoonBow" : "";
      window.location.href = `${basePath}/html/admin.html`;

    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });
});
    