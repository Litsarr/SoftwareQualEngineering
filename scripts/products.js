console.log("products.js script loaded");

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategories,
  uploadEditImages,
  getProductsByCategory,
  addItemToCart,
  fetchCart,
  removeItemFromCart, // Import removeItemFromCart
  updateCartItemQuantity, // Import updateCartItemQuantity
} from "./api.js";

// Function to dynamically add size and stock input fields
async function addSize() {
  const sizesContainer = document.getElementById("sizes-container");
  if (!sizesContainer) {
    console.error("sizes-container element not found");
    return;
  }
  const sizeBlock = document.createElement("div");
  sizeBlock.classList.add("size-block");
  sizeBlock.innerHTML = `
    <input type="text" name="sizes[]" placeholder="Size" required>
    <input type="number" name="stock[]" class="stock-input" placeholder="Stock" required>
  `;
  sizesContainer.appendChild(sizeBlock);
}

// Function to dynamically add size and stock input fields in the edit form
async function addEditSize() {
  const sizesContainer = document.getElementById("edit-sizes-container");
  if (!sizesContainer) {
    console.error("edit-sizes-container element not found");
    return;
  }
  const sizeBlock = document.createElement("div");
  sizeBlock.classList.add("size-block");
  sizeBlock.innerHTML = `
    <input type="text" name="sizes[]" placeholder="Size" required>
    <input type="number" name="stock[]" class="stock-input" placeholder="Stock" required>
  `;
  sizesContainer.appendChild(sizeBlock);
}

// Function to populate categories in both add and edit forms
async function populateCategories() {
  try {
    const categories = await getCategories();
    const categorySelects = document.querySelectorAll(
      "#category, #edit-category"
    );
    categorySelects.forEach((select) => {
      select.innerHTML = ""; // Clear existing options
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
      });
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

// Handle form submission to create a new product
const addItemForm = document.getElementById("add-item-form");
if (addItemForm) {
  addItemForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    const formData = new FormData(this);

    // Prepare product data object from form input
    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      category: { id: parseInt(formData.get("category")) },
      imageTop: formData.get("topImageUrl"), // URL for top image
      imageSide: formData.get("sideImageUrl"), // URL for side image
      sizes: {}, // Initialize sizes object
    };

    // Map sizes and stock to productData
    const sizes = formData.getAll("sizes[]");
    const stock = formData.getAll("stock[]");
    sizes.forEach((size, index) => {
      productData.sizes[size] = parseInt(stock[index]);
    });

    try {
      await createProduct(productData); // Create the product in the backend
      alert("Product created successfully!");
      this.reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    }
  });
} else {
  console.error("add-item-form element not found");
}

// Handle form submission to update a product
const editProductForm = document.getElementById("edit-product-form");
if (editProductForm) {
  editProductForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    const formData = new FormData(this);
    const productId = formData.get("productId");

    // Prepare updated product data object from form input
    const updatedData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      category: { id: parseInt(formData.get("category")) },
      sizes: {},
    };

    // Only update image URLs if new images are uploaded
    if (formData.get("topImageUrl")) {
      updatedData.imageTop = formData.get("topImageUrl");
    } else {
      updatedData.imageTop = document.getElementById("edit-topImageUrl").value;
    }
    if (formData.get("sideImageUrl")) {
      updatedData.imageSide = formData.get("sideImageUrl");
    } else {
      updatedData.imageSide =
        document.getElementById("edit-sideImageUrl").value;
    }

    // Map sizes and stock to updatedData
    const sizes = formData.getAll("sizes[]");
    const stock = formData.getAll("stock[]");
    sizes.forEach((size, index) => {
      updatedData.sizes[size] = parseInt(stock[index]);
    });

    try {
      await updateProduct(productId, updatedData); // Update the product in the backend
      alert("Product updated successfully!");
      document.getElementById("edit-modal").style.display = "none"; // Close the modal
      displayProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  });
} else {
  console.error("edit-product-form element not found");
}

// Handle image upload for the edit form
const editUploadButton = document.getElementById("edit-upload-button");
if (editUploadButton) {
  editUploadButton.addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent form submission
    await uploadEditImages(event);
  });
} else {
  console.error("edit-upload-button element not found");
}

// Fetch and display products
async function displayProducts() {
  try {
    const products = await getProducts(); // Fetch products from API
    renderProducts(products); // Render products in the table
  } catch (error) {
    console.error("Error displaying products:", error);
  }
}

// Render products in the table
function renderProducts(products) {
  const tableBody = document.querySelector("#items-table tbody");
  if (!tableBody) {
    console.error("items-table tbody element not found");
    return;
  }
  tableBody.innerHTML = ""; // Clear the table before adding new products

  products.forEach((product) => {
    const row = document.createElement("tr");

    // Create table cells for product details
    row.appendChild(createCell(product.name)); // Name cell
    row.appendChild(createCell(product.description)); // Description cell
    row.appendChild(createCell(`$${product.price.toFixed(2)}`)); // Price cell
    row.appendChild(createCell(formatSizes(product.sizes))); // Sizes and stock cell
    row.appendChild(createImageCell(product.imageSideUrl, "Side Image")); // Side image cell
    row.appendChild(createImageCell(product.imageTopUrl, "Top Image")); // Top image cell
    row.appendChild(
      createCell(product.category ? product.category.name : "Unknown")
    ); // Category cell
    row.appendChild(createActionsCell(product.id)); // Action buttons cell

    tableBody.appendChild(row);
  });
}

// Helper function to create a table cell
function createCell(content) {
  const cell = document.createElement("td");
  cell.textContent = content;
  return cell;
}

// Format sizes and stock for display
function formatSizes(sizes) {
  return Object.entries(sizes)
    .map(([size, quantity]) => `${size}: ${quantity}`)
    .join(", ");
}

// Create a table cell for displaying images
function createImageCell(imageUrl, altText) {
  const cell = document.createElement("td");
  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl.startsWith("https://")
      ? imageUrl
      : `https://ozptbbwzmxdbmzgeyqmf.supabase.co/storage/v1/object/public/${imageUrl}`;
    img.alt = altText;
    img.style.maxWidth = "100px";
    cell.appendChild(img);
  } else {
    cell.textContent = "No Image";
  }
  return cell;
}

// Create action buttons cell with update and delete functionality
function createActionsCell(productId) {
  const actionsCell = document.createElement("td");
  actionsCell.innerHTML = `
    <button class="edit-btn" data-product-id="${productId}">Edit</button>
    <button class="delete-btn" data-product-id="${productId}">Delete</button>
  `;

  const editButton = actionsCell.querySelector(".edit-btn");
  const deleteButton = actionsCell.querySelector(".delete-btn");

  // Edit button logic
  editButton.addEventListener("click", async () => {
    const product = await getProductById(productId);

    if (!product) {
      alert("Product not found.");
      return;
    }

    // Populate the edit form with the product data
    document.getElementById("edit-product-id").value = product.id;
    document.getElementById("edit-name").value = product.name;
    document.getElementById("edit-description").value = product.description;
    document.getElementById("edit-price").value = product.price;
    document.getElementById("edit-category").value = product.category.id;

    // Extract relative paths for images
    const topImagePath = product.imageTopUrl.split("/").slice(-2).join("/");
    const sideImagePath = product.imageSideUrl.split("/").slice(-2).join("/");

    document.getElementById("edit-topImageUrl").value = topImagePath;
    document.getElementById("edit-sideImageUrl").value = sideImagePath;

    // Populate sizes in the edit form
    const sizesContainer = document.getElementById("edit-sizes-container");
    sizesContainer.innerHTML = "";
    Object.entries(product.sizes).forEach(([size, stock]) => {
      const sizeBlock = document.createElement("div");
      sizeBlock.classList.add("size-block");
      sizeBlock.innerHTML = `
        <input type="text" name="sizes[]" value="${size}" required>
        <input type="number" name="stock[]" class="stock-input" value="${stock}" required>
      `;
      sizesContainer.appendChild(sizeBlock);
    });

    // Populate categories in the edit form
    const categorySelect = document.getElementById("edit-category");
    categorySelect.innerHTML = ""; // Clear existing options
    const categories = await getCategories();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      if (category.id === product.category.id) {
        option.selected = true;
      }
      categorySelect.appendChild(option);
    });

    // Open the edit form modal
    document.getElementById("edit-modal").style.display = "block";
  });

  // Delete button logic
  deleteButton.addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await deleteProduct(productId); // Call the delete API
        alert(response.message);
        displayProducts(); // Refresh the product list after deletion
      } catch (error) {
        alert("Failed to delete product. Please try again.");
      }
    }
  });

  return actionsCell;
}

// Function to fetch and display products by category
async function displayProductsByCategory(categoryId, sectionId) {
  try {
    console.log(`Fetching products for category ID: ${categoryId}`);
    const products = await getProductsByCategory(categoryId);
    console.log(`Products fetched for category ID ${categoryId}:`, products);
    const section = document.getElementById(sectionId);
    if (!section) {
      console.error(`Section with ID ${sectionId} not found`);
      return;
    }
    section.innerHTML = ""; // Clear the section before adding new products

    if (products.length === 0) {
      console.log(`No products found for category ID ${categoryId}`);
      section.innerHTML = "<p>No products available in this category.</p>";
    } else {
      products.forEach((product) => {
        console.log(`Rendering product: ${product.name}`);
        const productCard = document.createElement("div");
        productCard.classList.add("product-card"); // Add the product-card class
        productCard.setAttribute("data-product-id", product.id); // Set the product ID
        productCard.innerHTML = `
          <div class="content">
            <img src="${product.imageSideUrl}" alt="${product.name}">
            <h3>${product.category.name.toUpperCase()}</h3>
            <p>${product.name}</p>
            <h4>P${product.price}</h4>
            <div class="overlay">
              <button class="add-to-cart-btn">Add to Cart</button>
            </div>
          </div>
        `;
        section.appendChild(productCard);
      });
    }
  } catch (error) {
    console.error(
      `Error displaying products for category ${categoryId}:`,
      error
    );
  }
}

// Function to handle redirection to the individual product page
function redirectToProductPage(productId) {
  window.location.href = `/pages/product.html?id=${productId}`;
}

// Function to load product details on the individual product page
async function loadProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    console.error("Product ID not found in URL");
    return;
  }

  try {
    const product = await getProductById(productId);
    if (!product) {
      console.error("Product not found");
      return;
    }

    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-description").textContent =
      product.description;
    document.getElementById(
      "product-price"
    ).textContent = `₱${product.price.toFixed(2)}`;
    document.getElementById("product-category").textContent =
      product.category.name;
    document.getElementById("product-image-top").src = product.imageTopUrl;
    document.getElementById("product-image-side").src = product.imageSideUrl;

    // Populate size options
    const sizeSelect = document.getElementById("size-select");
    sizeSelect.innerHTML = ""; // Clear existing options
    Object.keys(product.sizes).forEach((size) => {
      const option = document.createElement("option");
      option.value = size;
      option.textContent = size;
      sizeSelect.appendChild(option);
    });

    return product; // Return the product data for size/quantity handling
  } catch (error) {
    console.error("Error loading product details:", error);
    return null;
  }
}

// Add event listener for add to cart buttons
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("add-to-cart-btn")) {
    const productId = event.target.closest(".product-card").dataset.productId;
    redirectToProductPage(productId);
  }
});

// Function to fetch the cart and redirect to cart.html
async function fetchCartAndRedirect() {
  try {
    const cart = await fetchCart();
    console.log("Fetched cart:", cart);
    window.location.href = "/pages/cart.html";
  } catch (error) {
    console.error("Error fetching cart:", error);
    alert("Failed to fetch cart. Please try again.");
  }
}

// Add event listener for the shopping cart icon
const cartIcon = document.querySelector(".cart-img a");
if (cartIcon) {
  cartIcon.addEventListener("click", async (event) => {
    event.preventDefault();
    await fetchCartAndRedirect();
  });
} else {
  console.error(".cart-img a element not found");
}

// Function to clear the cart
async function clearCart() {
  try {
    const cart = await fetchCart();
    for (const item of cart.items) {
      await removeItemFromCart(item.id); // Use the item ID to remove each item from the cart
    }
    console.log("Cart cleared successfully");
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
}

// Initialize product display when the page loads
window.addEventListener("DOMContentLoaded", displayProducts);

// Export the loadProductDetails and fetchCart functions for use in the product page
export {
  addSize,
  addEditSize,
  displayProducts,
  populateCategories,
  displayProductsByCategory,
  loadProductDetails,
  addItemToCart,
  fetchCart,
  clearCart, // Add clearCart to exports
  removeItemFromCart, // Add removeItemFromCart to exports
  updateCartItemQuantity, // Add updateCartItemQuantity to exports
};
