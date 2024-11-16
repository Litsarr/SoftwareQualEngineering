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

// Function to fetch recent orders
async function getRecentOrders() {
  try {
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

// Function to complete an order
async function completeOrder(orderId) {
  try {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      throw new Error("No JWT token found");
    }

    const response = await fetch(`${BASE_URL}/orders/complete/${orderId}`, {
      method: "POST", // Change this from PUT to POST
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
      },
      credentials: "include", // Include credentials for authenticated requests
    });

    if (!response.ok) {
      throw new Error("Failed to complete the order");
    }

    const responseText = await response.text(); // Use text() to get plain text response

    // Log or handle the plain text response
    console.log(responseText); // Logs the message returned by the backend

    return responseText; // Return the plain text response if needed
  } catch (error) {
    console.error("Error completing order:", error);
    throw error;
  }
}

// Function to delete an order
async function deleteOrder(orderId) {
  try {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      throw new Error("No JWT token found");
    }

    const response = await fetch(`${BASE_URL}/orders/delete/${orderId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
      },
      credentials: "include", // Include credentials for authenticated requests
    });

    if (!response.ok) {
      throw new Error("Failed to delete the order");
    }

    const responseText = await response.text(); // Use text() to get plain text response

    // Log or handle the plain text response
    console.log(responseText); // Logs the message returned by the backend

    return responseText; // Return the plain text response if needed
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}

async function getCompletedOrders() {
  try {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      throw new Error("No JWT token found");
    }

    const response = await fetch(`${BASE_URL}/orders/completed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
      },
      credentials: "include", // Include credentials for authenticated requests
    });

    if (!response.ok) {
      throw new Error("Failed to fetch completed orders");
    }

    const completedOrders = await response.json();
    return completedOrders;
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    return [];
  }
}

async function uploadImages(event) {
  event.preventDefault(); // Prevent form from submitting the traditional way
  const uploadForm = document.getElementById("upload-images-form");
  const formData = new FormData(uploadForm);

  try {
    const response = await fetch(`${BASE_URL}/images/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(
        `Failed to upload images: ${response.statusText}. Response: ${responseText}`
      );
    }

    const responseJson = await response.json();

    // Get image paths from the response
    const topImageUrl = responseJson.topImagePath;
    const sideImageUrl = responseJson.sideImagePath;

    // Set the hidden input fields with the image URLs
    document.getElementById("topImageUrl").value = topImageUrl;
    document.getElementById("sideImageUrl").value = sideImageUrl;

    // Log the hidden fields to confirm they are set correctly
    console.log("Top Image URL:", document.getElementById("topImageUrl").value);
    console.log(
      "Side Image URL:",
      document.getElementById("sideImageUrl").value
    );

    // Enable the "Add Item" form submit button or proceed with the next steps
    document.querySelector(
      "#add-item-form button[type='submit']"
    ).disabled = false;
  } catch (error) {
    console.error("Error uploading images:", error);
    alert("Error uploading images: " + error.message);
  }
}

// Function to create a new product
async function createProduct(productData) {
  const token = localStorage.getItem("jwtToken");

  try {
    const response = await fetch(`${BASE_URL}/products/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include JWT token in Authorization header
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    const result = await response.json();
    return result; // Return the created product
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

// Function to fetch all products
async function getProducts() {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    throw new Error("No JWT token found");
  }

  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include JWT token in Authorization header
      },
      credentials: "include", // Include credentials for authenticated requests
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json(); // Parse the response to get product data
    return products; // Return the list of products
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array if there is an error
  }
}

// Export functions for use in other scripts
export {
  login,
  logout,
  getRecentOrders,
  completeOrder,
  deleteOrder,
  uploadImages,
  createProduct,
  getCompletedOrders,
  getProducts,
};
