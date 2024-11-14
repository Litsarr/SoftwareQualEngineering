// Import the logout function from api.js
import { logout } from "./api.js"; // Assuming logout function is implemented in api.js

export async function handleLogout() {
  try {
    // Send logout request (no need for CSRF token as JWT is handled)
    await logout();

    // Clear local storage or any session data related to the user
    localStorage.removeItem("jwtToken"); // Assuming you're storing the JWT token in localStorage

    // Redirect the user to the login page
    window.location.href = "admin.html";
  } catch (error) {
    console.error("Logout failed", error);
  }
}
