console.log("api.js script loaded");

const BASE_URL = "http://localhost:8081"; // Backend API URL

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
      credentials: "include",
    });

    if (response.ok) {
      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Login successful", data);

        // Store JWT token to process requests
        localStorage.setItem("jwtToken", data.token);

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
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      throw new Error("No JWT token found for logout.");
    }

    const response = await fetch(`${BASE_URL}/admin/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    console.log("Successfully logged out");
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
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to complete the order");
    }

    const responseText = await response.text();
    console.log(responseText);

    return responseText;
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
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete the order");
    }

    const responseText = await response.text();
    console.log(responseText);

    return responseText;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}

// Function to fetch completed orders
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
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
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

// Function to upload images
async function uploadImages(event) {
  event.preventDefault();
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
    const topImageUrl = responseJson.topImagePath;
    const sideImageUrl = responseJson.sideImagePath;

    document.getElementById("topImageUrl").value = topImageUrl;
    document.getElementById("sideImageUrl").value = sideImageUrl;

    console.log("Top Image URL:", document.getElementById("topImageUrl").value);
    console.log(
      "Side Image URL:",
      document.getElementById("sideImageUrl").value
    );

    document.querySelector(
      "#add-item-form button[type='submit']"
    ).disabled = false;
  } catch (error) {
    console.error("Error uploading images:", error);
    alert("Error uploading images: " + error.message);
  }
}

// Function to upload edited images
async function uploadEditImages(event) {
  event.preventDefault();
  const uploadForm = document.getElementById("edit-upload-images-form");
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
    const topImageUrl = responseJson.topImagePath;
    const sideImageUrl = responseJson.sideImagePath;

    document.getElementById("edit-topImageUrl").value = topImageUrl;
    document.getElementById("edit-sideImageUrl").value = sideImageUrl;

    console.log(
      "Top Image URL:",
      document.getElementById("edit-topImageUrl").value
    );
    console.log(
      "Side Image URL:",
      document.getElementById("edit-sideImageUrl").value
    );

    document.querySelector(
      "#edit-product-form button[type='submit']"
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
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    const result = await response.json();
    return result;
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
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Function to fetch products by category ID
async function getProductsByCategory(categoryId) {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    throw new Error("No JWT token found");
  }

  try {
    console.log(
      `Making API call to fetch products for category ID: ${categoryId}`
    );
    const response = await fetch(
      `${BASE_URL}/products/category/${categoryId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products by category");
    }

    const products = await response.json();
    console.log(`API response for category ID ${categoryId}:`, products);
    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

// Function to update a product
async function updateProduct(productId, updatedData) {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    throw new Error("No JWT token found");
  }

  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

// Function to delete a product
async function deleteProduct(productId) {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    throw new Error("No JWT token found");
  }

  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Failed to delete product: ${responseText}`);
    }

    return { message: "Product deleted successfully" };
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

// Function to fetch a product by ID
async function getProductById(productId) {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    throw new Error("No JWT token found");
  }

  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const product = await response.json();
    console.log("Fetched product:", product);
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Function to fetch category by ID
async function getCategoryById(categoryId) {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    throw new Error("No JWT token found");
  }

  try {
    const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch category");
    }

    const category = await response.json();
    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

// Function to fetch all categories
async function getCategories() {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    throw new Error("No JWT token found");
  }

  try {
    const response = await fetch(`${BASE_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
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
  uploadEditImages,
  createProduct,
  getCompletedOrders,
  getProducts,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  getProductById,
  getCategoryById,
  getCategories,
};
