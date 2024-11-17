import { logout } from "./api.js";

// Function to handle user logout
export async function handleLogout() {
  try {
    await logout(); // Send logout request

    localStorage.removeItem("jwtToken"); // Clear local storage

    window.location.href = "admin.html"; // Redirect to login page
  } catch (error) {
    console.error("Logout failed", error); // Log any errors
  }
}
