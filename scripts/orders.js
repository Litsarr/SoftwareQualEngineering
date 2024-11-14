import { getRecentOrders } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch the recent orders from the backend
    const recentOrders = await getRecentOrders();

    const ordersContainer = document.getElementById("all-orders");

    // If there are no orders, display a message
    if (recentOrders.length === 0) {
      ordersContainer.innerHTML = "<p>No orders available.</p>";
    } else {
      // Populate the order details dynamically
      recentOrders.forEach((order) => {
        const orderElement = document.createElement("div");
        orderElement.classList.add("order-block");
        orderElement.id = `order-${order.orderId}`;

        // Map OrderResponseDTO fields to HTML content
        orderElement.innerHTML = `
                    <div class="order-header">
                        <span>Order Number: ${order.orderId}</span>
                        <span>Date: ${new Date(
                          order.orderDate
                        ).toLocaleDateString()}</span>
                        <span>Total Price: ₱${order.totalAmount.toFixed(
                          2
                        )}</span>
                    </div>
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Size</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.orderItems
                              .map(
                                (item) => `
                                <tr>
                                    <td>${item.productName}</td>
                                    <td>${item.quantity}</td>
                                    <td>${item.size}</td>
                                    <td>₱${item.price.toFixed(2)}</td>
                                </tr>
                            `
                              )
                              .join("")}
                        </tbody>
                    </table>
                    <div class="item-details">
                        <p><strong>Name:</strong> ${order.customerName}</p>
                        <p><strong>Address:</strong> ${order.address}</p>
                        <p><strong>Postal Code:</strong> ${order.postalCode}</p>
                        <p><strong>Contact Info:</strong> ${
                          order.contactInfo
                        }</p>
                    </div>
                `;
        ordersContainer.appendChild(orderElement);
      });
    }
  } catch (error) {
    console.error("Error loading orders:", error);

    // Handle unauthorized error (JWT expired or invalid)
    if (error.message === "Failed to fetch recent orders") {
      alert("Your session has expired. Please log in again.");
      window.location.href = "/login"; // Redirect to the login page or show a login modal
    } else {
      // Display a general error message for other errors
      alert("Something went wrong while loading the orders.");
    }
  }
});

// Handle tab switching
document
  .getElementById("all-orders-tab")
  .addEventListener("click", function () {
    document.getElementById("all-orders").classList.add("active");
    document.getElementById("completed-orders").classList.remove("active");
    this.classList.add("active");
    document.getElementById("completed-orders-tab").classList.remove("active");
  });

document
  .getElementById("completed-orders-tab")
  .addEventListener("click", function () {
    document.getElementById("completed-orders").classList.add("active");
    document.getElementById("all-orders").classList.remove("active");
    this.classList.add("active");
    document.getElementById("all-orders-tab").classList.remove("active");
  });
