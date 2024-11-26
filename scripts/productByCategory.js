document.addEventListener("DOMContentLoaded", () => {
  // Function to fetch products and render them by category and subcategory
  const renderProductsByCategory = (
    category,
    subcategory,
    containerSelector,
    categoryLabel
  ) => {
    fetch("./assets/data/data.json")
      .then((res) => res.json())
      .then((data) => {
        const getProductsByCategory = (category, subcategory = null) => {
          return data.filter((product) => {
            if (subcategory) {
              // If subcategory is provided, filter by both category and subcategory
              return (
                product.category === category &&
                product.subcategory === subcategory
              );
            } else {
              // If no subcategory is provided, just filter by category
              return product.category === category;
            }
          });
        };

        // Color mapping for categories
        const categoryColors = {
          "Islander Women": "#F37724",
          Children: "#1786B3",
          "Islander Outdoors": "#1E1E1E",
          "Islander Classics": "#0F079D",
        };

        const products = getProductsByCategory(category, subcategory);
        const container = document.querySelector(containerSelector);

        products.forEach((product) => {
          const productCard = document.createElement("div");
          productCard.classList.add("product__card");

          const productLink = document.createElement("a");
          productLink.href = `productDetailPage.html?id=${product.id}&name=${product.name[0]}&category=${product.category}`;

          // Apply color based on the category
          const color = categoryColors[category] || "#000"; // Default to black if category not in mapping

          // Special color for h3 in "Islander Outdoors" category
          const h3Color = category === "Islander Outdoors" ? "#356CB1" : "#000";

          productLink.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name[0]}">
            <h4 style="color: ${color};">${categoryLabel}</h4>
            <h3 style="color: ${h3Color};">${product.name[0]}</h3>
            <h2 style="color: ${color};">₱${product.basePrice}.00</h2>
          `;

          productCard.appendChild(productLink);
          container.appendChild(productCard);
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  // Call the render function for each category/subcategory
  renderProductsByCategory(
    "Children",
    "Toddlers",
    ".products-toddlers__container",
    "TODDLERS"
  );
  renderProductsByCategory(
    "Children",
    "Kids",
    ".products-kids__container",
    "KIDS"
  );
  renderProductsByCategory(
    "Islander Classics",
    "",
    ".products__container",
    "CLASSICS"
  );
  renderProductsByCategory(
    "Islander Women",
    "",
    ".products-women__container",
    "WOMEN"
  );
  renderProductsByCategory(
    "Islander Outdoors",
    "",
    ".products-outdoors__container",
    "OUTDOORS"
  );
});
