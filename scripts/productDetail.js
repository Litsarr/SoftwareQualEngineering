window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const category = urlParams.get("category");

  // Set the banner and background color based on the category
  const bannerImage = document.querySelector("#category-banner");
  const categoryBannerContainer = document.querySelector(".category");

  if (category === "Islander Classics") {
    bannerImage.src = "./assets/images/islander-classics/banner.png";
    categoryBannerContainer.style.backgroundColor = "#d5eeef";
    bannerImage.style.width = "20%";
  } else if (category === "Islander Outdoors") {
    bannerImage.src = "./assets/images/islander-outdoors/banner.png";
    categoryBannerContainer.style.backgroundColor = "#9ccb58";
    bannerImage.style.width = "20%";
  } else if (category === "Islander Women") {
    bannerImage.src = "./assets/images/islander-women/banner.png";
    categoryBannerContainer.style.backgroundColor = "#9ccb58";
    bannerImage.style.width = "20%";
  } else if (category === "Children") {
    bannerImage.src = "./assets/images/kids-banner.png";
    categoryBannerContainer.style.backgroundColor = "#ffcb5c";
    bannerImage.style.width = "20%";
  } else {
    // Default background color if category is not matched
    categoryBannerContainer.style.backgroundColor = "#ffffff"; // White background
  }

  fetch("./assets/data/data.json")
    .then((res) => res.json())
    .then((data) => {
      const product = data.find((item) => item.id == productId);

      if (product) {
        document.querySelector(".product-title").innerText = product.name[0];

        // Display the price range (basePrice - maxPrice) initially
        document.querySelector(
          ".product-price"
        ).innerText = `₱${product.basePrice} - ₱${product.maxPrice}`;

        document.querySelector("#description").innerText =
          product.description.overview;

        const materialsList = product.description.materials
          .map((material) => `<li>${material}</li>`)
          .join("");
        document.querySelector(
          "#materials"
        ).innerHTML = `<ul>${materialsList}</ul>`;

        const shippingList = product.description.shippingRules
          .map((rule) => `<li>${rule}</li>`)
          .join("");
        document.querySelector(
          "#shipping"
        ).innerHTML = `<ul>${shippingList}</ul>`;

        const returnRefundList = product.description.returnsRules
          .map((rule) => `<li>${rule}</li>`)
          .join("");
        document.querySelector(
          "#returnRefund"
        ).innerHTML = `<ul>${returnRefundList}</ul>`;

        document.getElementById("size-chart").src = product.sizeChart;

        document.getElementById("main-image").src = product.images[0];

        // Dynamically create image thumbnails
        const thumbnailsContainer = document.querySelector(".thumbnails");
        product.images.forEach((image, index) => {
          const thumbnail = document.createElement("img");
          thumbnail.src = image;
          thumbnail.alt = `Image ${index + 1}`;
          thumbnail.classList.add("thumbnail"); // Add 'thumbnail' class for styling
          thumbnail.onclick = function () {
            // Change the main image to the clicked thumbnail's image
            document.getElementById("main-image").src = image;

            // Remove 'active' class from all thumbnails
            const allThumbnails = document.querySelectorAll(".thumbnail");
            allThumbnails.forEach((t) => t.classList.remove("active"));

            // Add 'active' class to the clicked thumbnail
            thumbnail.classList.add("active");
          };

          thumbnailsContainer.appendChild(thumbnail);
        });

        // Set the first thumbnail as active by default
        const firstThumbnail = document.querySelector(".thumbnail");
        if (firstThumbnail) {
          firstThumbnail.classList.add("active");
        }

        // Dynamically create size buttons and update price, quantity
        const sizeButtonsContainer = document.getElementById("size-buttons");
        let selectedStockItem = null; // Variable to track the selected stock item

        product.stock.forEach((stockItem) => {
          const button = document.createElement("button");
          button.innerText = `${stockItem.size}`;
          button.disabled = stockItem.quantity === 0; // Disable button if out of stock
          if (stockItem.quantity === 0) {
            button.classList.add("out-of-stock"); // Add class to out-of-stock buttons
          }
          button.onclick = function () {
            // Remove 'selected' class from all size buttons
            const allSizeButtons = document.querySelectorAll(
              "#size-buttons button"
            );
            allSizeButtons.forEach((btn) => btn.classList.remove("selected"));

            // Add 'selected' class to the clicked button
            button.classList.add("selected");

            // Update price and quantity based on selected size
            document.querySelector(
              ".product-price"
            ).innerText = `₱${stockItem.price}`;
            selectedStockItem = stockItem;
            updateQuantity(stockItem.quantity);
          };

          sizeButtonsContainer.appendChild(button);
        });

        // Function to update the quantity input box and available quantity message
        function updateQuantity(stockQuantity) {
          const quantityInput = document.getElementById("quantity");
          const minusButton = document.querySelector(".minus");
          const plusButton = document.querySelector(".plus");
          const availableQuantityMessage = document.querySelector(
            "#available-quantity"
          );
          const maxQuantityMessage = document.querySelector(
            "#max-quantity-message"
          );

          // Set the available stock in the quantity input
          quantityInput.value = 1;
          quantityInput.setAttribute("max", stockQuantity);

          // Update the available quantity message
          availableQuantityMessage.innerText = `${stockQuantity} pieces available`;

          // Enable or disable quantity buttons based on available stock
          minusButton.disabled = quantityInput.value <= 1;
          plusButton.disabled = quantityInput.value >= stockQuantity;

          // Show or hide the max quantity message
          if (quantityInput.value >= stockQuantity) {
            maxQuantityMessage.style.display = "block"; // Show message when maximum reached
          } else {
            maxQuantityMessage.style.display = "none"; // Hide message if not at maximum
          }

          // Update the quantity when the user clicks the buttons
          minusButton.onclick = function () {
            if (quantityInput.value > 1) {
              quantityInput.value--;
              minusButton.disabled = quantityInput.value <= 1;
              plusButton.disabled = quantityInput.value >= stockQuantity;
              if (quantityInput.value >= stockQuantity) {
                maxQuantityMessage.style.display = "block"; // Show message when maximum reached
              } else {
                maxQuantityMessage.style.display = "none"; // Hide message when quantity is less than max
              }
            }
          };

          plusButton.onclick = function () {
            if (quantityInput.value < stockQuantity) {
              quantityInput.value++;
              plusButton.disabled = quantityInput.value >= stockQuantity;
              minusButton.disabled = quantityInput.value <= 1;
              if (quantityInput.value >= stockQuantity) {
                maxQuantityMessage.style.display = "block"; // Show message when maximum reached
              } else {
                maxQuantityMessage.style.display = "none"; // Hide message when quantity is less than max
              }
            }
          };
        }
      } else {
        console.error("Product not found");
      }
    })
    .catch((error) => console.error("Error fetching product details:", error));
};
