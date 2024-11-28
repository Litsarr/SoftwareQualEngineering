import {
  getRecentOrders,
  completeOrder,
  deleteOrder,
  getCompletedOrders,
  fetchCart,
  checkout,
} from "./api.js";

// Function to handle order completion
async function completeOrderHandler(orderId) {
  try {
    await completeOrder(orderId);
    alert("Order completed successfully!");
    location.reload(); // Reload the page to reflect changes
  } catch (error) {
    alert("Failed to complete the order");
  }
}

// Function to handle order deletion
async function deleteOrderHandler(orderId) {
  try {
    await deleteOrder(orderId);
    alert("Order deleted successfully!");
    document.getElementById(`order-${orderId}`).remove(); // Remove the order from the UI
  } catch (error) {
    alert("Failed to delete the order");
  }
}

// Updated render orders function
function renderOrders(orders, containerId, isCompleted = false) {
  const ordersContainer = document.getElementById(containerId);

  if (orders.length === 0) {
    ordersContainer.innerHTML = `<p class="no-orders">No ${
      isCompleted ? "completed" : ""
    } orders available.</p>`;
    return;
  }

  ordersContainer.innerHTML = ""; // Clear existing orders

  orders.forEach((order) => {
    const orderElement = document.createElement("div");
    orderElement.classList.add("order-block");
    orderElement.id = `order-${order.orderId}`;

    orderElement.innerHTML = `
            <div class="order-header">
                <strong>#${order.orderId}</strong>
                <span>${new Date(
                  isCompleted ? order.completedAt : order.orderDate
                ).toLocaleDateString()}</span>
                <span class="order-total">₱${order.totalAmount.toFixed(
                  2
                )}</span>
            </div>
            <div class="order-content">
                <div class="customer-info">
                    <p><strong>${order.customerName}</strong></p>
                    <p>${order.address}</p>
                    <p>Postal: ${order.postalCode}</p>
                    <p>Contact: ${order.contactInfo}</p>
                </div>
                <div class="order-items">
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Size</th>
                                <th>Qty</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.orderItems
                              .map(
                                (item) => `
                                <tr>
                                    <td>${item.productName}</td>
                                    <td>${item.size}</td>
                                    <td>${item.quantity}</td>
                                    <td>₱${item.price.toFixed(2)}</td>
                                </tr>
                            `
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>
                ${
                  !isCompleted
                    ? `
                    <div class="order-actions">
                        <button class="complete-btn">Complete</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                `
                    : ""
                }
            </div>
        `;

    ordersContainer.appendChild(orderElement);

    if (!isCompleted) {
      const completeBtn = orderElement.querySelector(".complete-btn");
      const deleteBtn = orderElement.querySelector(".delete-btn");

      completeBtn.addEventListener("click", () =>
        completeOrderHandler(order.orderId)
      );
      deleteBtn.addEventListener("click", () =>
        deleteOrderHandler(order.orderId)
      );
    }
  });
}

// Fetch and render recent orders
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const recentOrders = await getRecentOrders();
    renderOrders(recentOrders, "all-orders");
  } catch (error) {
    console.error("Error loading orders:", error);
    alert("Something went wrong while loading the orders.");
  }
});

// Fetch and render completed orders
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const completedOrders = await getCompletedOrders();
    renderOrders(completedOrders, "completed-orders", true);
  } catch (error) {
    console.error("Error loading completed orders:", error);
    alert("Something went wrong while loading the completed orders.");
  }
});

// Handle tab switching
function handleTabSwitch(activeTabId, activeContentId) {
  const tabs = [
    "all-orders-tab",
    "completed-orders-tab",
    "add-item-tab",
    "existing-items-tab",
  ];
  const contents = [
    "all-orders",
    "completed-orders",
    "add-item",
    "existing-items",
  ];

  tabs.forEach((tab) =>
    document.getElementById(tab).classList.remove("active")
  );
  contents.forEach((content) =>
    document.getElementById(content).classList.remove("active")
  );

  document.getElementById(activeTabId).classList.add("active");
  document.getElementById(activeContentId).classList.add("active");
}

document
  .getElementById("all-orders-tab")
  .addEventListener("click", () =>
    handleTabSwitch("all-orders-tab", "all-orders")
  );
document
  .getElementById("completed-orders-tab")
  .addEventListener("click", () =>
    handleTabSwitch("completed-orders-tab", "completed-orders")
  );
document
  .getElementById("add-item-tab")
  .addEventListener("click", () => handleTabSwitch("add-item-tab", "add-item"));
document
  .getElementById("existing-items-tab")
  .addEventListener("click", () =>
    handleTabSwitch("existing-items-tab", "existing-items")
  );
