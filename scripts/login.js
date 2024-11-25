import { login } from "./api.js";

// Function to handle login
export async function validateLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const messageElement = document.getElementById("message");

  try {
    const response = await login(username, password);

    if (response && response.token) {
      // Show success message and redirect to the dashboard
      messageElement.style.color = "green";
      messageElement.textContent = "Login successful!";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      // Show error message for invalid credentials
      messageElement.style.color = "red";
      messageElement.textContent = "Invalid username or password.";
    }
  } catch (error) {
    // Handle login failure
    console.error("Error during login:", error);
    messageElement.style.color = "red";
    messageElement.textContent = "Login failed. Please try again later.";
  }
}
