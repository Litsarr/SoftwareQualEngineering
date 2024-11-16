import {
  getRecentOrders,
  completeOrder,
  deleteOrder,
  getCompletedOrders,
} from "./api.js";

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
            <span>Date: ${new Date(order.orderDate).toLocaleDateString()}</span>
            <span>Total Price: ₱${order.totalAmount.toFixed(2)}</span>
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
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <div class="item-details">
            <p><strong>Name:</strong> ${order.customerName}</p>
            <p><strong>Address:</strong> ${order.address}</p>
            <p><strong>Postal Code:</strong> ${order.postalCode}</p>
            <p><strong>Contact Info:</strong> ${order.contactInfo}</p>
          </div>
          <div class="crud-btns">
            <button class="complete-btn">Complete Order</button>
            <button class="delete-btn">Delete</button>
          </div>
        `;
        ordersContainer.appendChild(orderElement);

        // Attach event listeners to the newly created buttons
        const completeBtn = orderElement.querySelector(".complete-btn");
        const deleteBtn = orderElement.querySelector(".delete-btn");

        completeBtn.addEventListener("click", () =>
          completeOrderHandler(order.orderId)
        );
        deleteBtn.addEventListener("click", () =>
          deleteOrderHandler(order.orderId)
        );
      });
    }
  } catch (error) {
    console.error("Error loading orders:", error);
    alert("Something went wrong while loading the orders.");
  }
});

// Complete Order handler
async function completeOrderHandler(orderId) {
  try {
    const response = await completeOrder(orderId);
    alert("Order completed successfully!");
    location.reload(); // Reload the page to reflect changes
  } catch (error) {
    alert("Failed to complete the order");
  }
}

// Delete Order handler
async function deleteOrderHandler(orderId) {
  try {
    const response = await deleteOrder(orderId);
    alert("Order deleted successfully!");
    document.getElementById(`order-${orderId}`).remove(); // Remove the order from the UI
  } catch (error) {
    alert("Failed to delete the order");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch completed orders from the backend
    const completedOrders = await getCompletedOrders(); // Assuming this function is defined in api.js

    const ordersContainer = document.getElementById("completed-orders");

    // If there are no completed orders, display a message
    if (completedOrders.length === 0) {
      ordersContainer.innerHTML = "<p>No completed orders available.</p>";
    } else {
      // Populate the completed orders dynamically
      completedOrders.forEach((order) => {
        const orderElement = document.createElement("div");
        orderElement.classList.add("order-block");
        orderElement.id = `order-${order.orderId}`;

        // Map CompletedOrderResponseDTO fields to HTML content
        orderElement.innerHTML = `
          <div class="order-header">
            <span>Order Number: ${order.orderId}</span>
            <span>Date Completed: ${new Date(
              order.completedAt
            ).toLocaleDateString()}</span>
            <span>Total Price: ₱${order.totalAmount.toFixed(2)}</span>
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
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <div class="item-details">
            <p><strong>Name:</strong> ${order.customerName}</p>
            <p><strong>Address:</strong> ${order.address}</p>
            <p><strong>Postal Code:</strong> ${order.postalCode}</p>
            <p><strong>Contact Info:</strong> ${order.contactInfo}</p>
          </div>
        `;
        ordersContainer.appendChild(orderElement);
      });
    }
  } catch (error) {
    console.error("Error loading completed orders:", error);
    alert("Something went wrong while loading the completed orders.");
  }
});

// Handle tab switching
document
  .getElementById("all-orders-tab")
  .addEventListener("click", function () {
    document.getElementById("all-orders").classList.add("active");
    document.getElementById("completed-orders").classList.remove("active");
    document.getElementById("add-item").classList.remove("active");
    document.getElementById("existing-items").classList.remove("active");
    this.classList.add("active");
    document.getElementById("completed-orders-tab").classList.remove("active");
    document.getElementById("add-item-tab").classList.remove("active");
    document.getElementById("existing-items-tab").classList.remove("active");
  });

document
  .getElementById("completed-orders-tab")
  .addEventListener("click", function () {
    document.getElementById("completed-orders").classList.add("active");
    document.getElementById("all-orders").classList.remove("active");
    document.getElementById("add-item").classList.remove("active");
    document.getElementById("existing-items").classList.remove("active");
    this.classList.add("active");
    document.getElementById("all-orders-tab").classList.remove("active");
    document.getElementById("add-item-tab").classList.remove("active");
    document.getElementById("existing-items-tab").classList.remove("active");
  });

document.getElementById("add-item-tab").addEventListener("click", function () {
  document.getElementById("add-item").classList.add("active");
  document.getElementById("all-orders").classList.remove("active");
  document.getElementById("completed-orders").classList.remove("active");
  document.getElementById("existing-items").classList.remove("active");
  this.classList.add("active");
  document.getElementById("completed-orders-tab").classList.remove("active");
  document.getElementById("all-orders-tab").classList.remove("active");
  document.getElementById("existing-items-tab").classList.remove("active");
});

document
  .getElementById("existing-items-tab")
  .addEventListener("click", function () {
    document.getElementById("existing-items").classList.add("active");
    document.getElementById("add-item").classList.remove("active");
    document.getElementById("all-orders").classList.remove("active");
    document.getElementById("completed-orders").classList.remove("active");
    this.classList.add("active");
    document.getElementById("completed-orders-tab").classList.remove("active");
    document.getElementById("add-item-tab").classList.remove("active");
    document.getElementById("all-orders-tab").classList.remove("active");
  });
