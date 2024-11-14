const BASE_URL = "http://localhost:8080"; // Backend API URL

// Function to log in and receive a JWT token
async function login(username, password) {
  const loginData = { username, password };

  try {
    const response = await fetch(`${BASE_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
      credentials: "include", // Ensures cookies are sent with the request
    });

    if (response.ok) {
      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Login successful", data); // Logs the JSON response

        // Store JWT token to process requests
        localStorage.setItem("jwtToken", data.token);

        // Return the response data for further use
        return data;
      } else {
        throw new Error("Unexpected response type");
      }
    } else {
      console.error("Login failed with status", response.status);
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

// Function to log out and invalidate the JWT token
async function logout() {
  try {
    const token = localStorage.getItem("jwtToken"); // Retrieve the JWT token from localStorage

    if (!token) {
      throw new Error("No JWT token found for logout.");
    }

    const response = await fetch(`${BASE_URL}/admin/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Pass the JWT token in the Authorization header
      },
      credentials: "include", // Ensure cookies are included
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    console.log("Successfully logged out");
    // Clear the JWT token from localStorage after successful logout
    localStorage.removeItem("jwtToken");

    return response;
  } catch (error) {
    throw new Error("Logout failed: " + error.message);
  }
}

async function getRecentOrders() {
  try {
    // Retrieve the JWT token from local storage (or other storage mechanisms)
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      throw new Error("No JWT token found");
    }

    const response = await fetch(`${BASE_URL}/orders/recent`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
      },
      credentials: "include", // Include credentials for authenticated requests
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recent orders");
    }

    const recentOrders = await response.json();
    return recentOrders;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return [];
  }
}

// Export functions for use in other scripts
export { login, logout, getRecentOrders };
