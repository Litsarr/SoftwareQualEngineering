import { createProduct, getProducts } from "./api.js";

// Function to dynamically add size and stock input fields
async function addSize() {
  const sizesContainer = document.getElementById("sizes-container");
  const sizeBlock = document.createElement("div");
  sizeBlock.classList.add("size-block");
  sizeBlock.innerHTML = `
        <input type="text" name="sizes[]" placeholder="Size" required>
        <input type="number" name="stock[]" class="stock-input" placeholder="Stock" required>
    `;
  sizesContainer.appendChild(sizeBlock);
}

// Handle form submission to create a new product
document
  .getElementById("add-item-form")
  .addEventListener("submit", async function (event) {
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

// Render products in the table
function renderProducts(products) {
  const tableBody = document.querySelector("#items-table tbody");
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
    row.appendChild(createActionsCell()); // Action buttons cell

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

function createActionsCell(productId) {
  const actionsCell = document.createElement("td");
  actionsCell.innerHTML = `
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
  `;

  const editButton = actionsCell.querySelector(".edit-btn");
  editButton.addEventListener("click", async () => {
    // Fetch product data
    const product = await getProductById(productId);

    // Populate the form with the product data
    document.getElementById("edit-name").value = product.name;
    document.getElementById("edit-description").value = product.description;
    document.getElementById("edit-price").value = product.price;
    document.getElementById("edit-category").value = product.category.id;

    // Populate sizes
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

    // Open the edit form modal
    document.getElementById("edit-product-form").style.display = "block";
  });

  return actionsCell;
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

// Initialize product display when the page loads
window.addEventListener("DOMContentLoaded", displayProducts);

export { addSize };
