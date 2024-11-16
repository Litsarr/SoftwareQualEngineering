import { uploadImage, createProduct } from "./api.js"; // Import your createProduct API function

document
  .getElementById("add-item-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form from submitting normally

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = parseFloat(document.getElementById("price").value);
    const imageTop = document.getElementById("ImageTop").value;
    const imageSide = document.getElementById("ImageSide").value;
    const categoryId = document.getElementById("category").value; // Get the selected category ID
    const sizes = {}; // Prepare the sizes map

    const sizeInputs = document.querySelectorAll('input[name="sizes[]"]');
    const stockInputs = document.querySelectorAll(".stock-input");

    sizeInputs.forEach((input, index) => {
      const size = input.value;
      const stock = stockInputs[index].value;
      sizes[size] = parseInt(stock); // Add to the sizes object
    });

    const product = {
      name,
      description,
      price,
      imageTop,
      imageSide,
      category: {
        id: categoryId, // Send the selected category ID
      },
      sizes,
    };

    try {
      // First, upload images (if needed)
      // Upload imageTop and imageSide URLs to Supabase and update product object
      const uploadedImageTop = imageTop; // If images are already URLs, no need to upload again
      const uploadedImageSide = imageSide;

      product.imageTop = uploadedImageTop; // Add the image URL to product
      product.imageSide = uploadedImageSide;

      // Call createProduct function from api.js to send product data to backend
      const newProduct = await createProduct(product);

      alert("Product added successfully!");
      // Optionally, reset the form or update the UI
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product");
    }
  });
