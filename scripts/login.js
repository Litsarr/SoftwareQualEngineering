import { login } from "./api.js"; // Import functions from api.js

// Function to handle login
export async function validateLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const messageElement = document.getElementById("message");

  try {
    // Call login function from api.js
    const response = await login(username, password);

    if (response && response.token) {
      // If the response contains a valid JWT token, show success message
      messageElement.style.color = "green";
      messageElement.textContent = "Login successful!";

      // Redirect to the dashboard after a short delay
      setTimeout(() => {
        window.location.href = "dashboard.html"; // Redirect to your dashboard or homepage
      }, 1000);
    } else {
      messageElement.style.color = "red";
      messageElement.textContent = "Invalid username or password.";
    }
  } catch (error) {
    console.error("Error during login:", error);
    messageElement.style.color = "red";
    messageElement.textContent = "Login failed. Please try again later.";
  }
}
