import { logout } from "./api.js";

export async function handleLogout() {
  try {
    // Send logout request
    await logout();

    // Clear local storage or any session data related to the user
    localStorage.removeItem("jwtToken");

    // Redirect the user to the login page
    window.location.href = "admin.html";
  } catch (error) {
    console.error("Logout failed", error);
  }
}
