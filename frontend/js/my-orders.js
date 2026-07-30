const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

let allOrders = [];

async function fetchOrders() {

    try {

        const res = await fetch(
            `http://localhost:3000/api/orders/buyer/${user.id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        allOrders = await res.json();

        loadFilters(allOrders);

        renderOrders(allOrders);

    }

    catch (err) {

        console.error(err);

    }

}

function renderOrders(orders) {

    const container = document.querySelector(".grid-container");

    container.innerHTML = "";

    if (orders.length === 0) {

        container.innerHTML = "<h3>No orders found.</h3>";

        return;

    }

    orders.forEach(order => {

        container.innerHTML += `

            <div class="card">

                <h3>${order.crop_name}</h3>

                <p><strong>Farmer:</strong> ${order.farmer_name}</p>

                <p><strong>Quantity:</strong> ${order.quantity} kg</p>

                <p><strong>Total Amount:</strong> ₹${order.total_amount}</p>

                <p><strong>Status:</strong> ${order.order_status}</p>

                <br>

                <button
                    onclick="viewOrderDetails(${order.id})"
                    style="
                        background:#2e7d32;
                        color:white;
                        border:none;
                        padding:8px 14px;
                        border-radius:6px;
                        cursor:pointer;
                        font-weight:600;
                    "
                >
                    View Details
                </button>

            </div>

        `;

    });

}

function loadFilters(orders) {

    const cropFilter = document.getElementById("cropFilter");
    const statusFilter = document.getElementById("statusFilter");
    const locationFilter = document.getElementById("locationFilter");

    cropFilter.innerHTML = `<option value="">All Crops</option>`;
    statusFilter.innerHTML = `<option value="">All Status</option>`;
    locationFilter.innerHTML = `<option value="">All Locations</option>`;

    [...new Set(orders.map(o => o.crop_name))]
        .sort()
        .forEach(crop => {

            cropFilter.innerHTML +=
                `<option value="${crop}">${crop}</option>`;

        });

    [...new Set(orders.map(o => o.order_status))]
        .sort()
        .forEach(status => {

            statusFilter.innerHTML +=
                `<option value="${status}">${status}</option>`;

        });

    [...new Set(orders.map(o => o.destination_address))]
        .sort()
        .forEach(location => {

            locationFilter.innerHTML +=
                `<option value="${location}">${location}</option>`;

        });

}

function applyFilters() {

    const search =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const crop =
        document.getElementById("cropFilter").value;

    const status =
        document.getElementById("statusFilter").value;

    const location =
        document.getElementById("locationFilter").value;

    const filtered = allOrders.filter(order => {

        const matchesSearch =
            order.crop_name.toLowerCase().includes(search) ||
            order.farmer_name.toLowerCase().includes(search);

        const matchesCrop =
            crop === "" || order.crop_name === crop;

        const matchesStatus =
            status === "" || order.order_status === status;

        const matchesLocation =
            location === "" ||
            order.destination_address === location;

        return (
            matchesSearch &&
            matchesCrop &&
            matchesStatus &&
            matchesLocation
        );

    });

    renderOrders(filtered);

}

document
    .getElementById("searchInput")
    .addEventListener("input", applyFilters);

document
    .getElementById("cropFilter")
    .addEventListener("change", applyFilters);

document
    .getElementById("statusFilter")
    .addEventListener("change", applyFilters);

document
    .getElementById("locationFilter")
    .addEventListener("change", applyFilters);

fetchOrders();
function viewOrderDetails(orderId) {

    window.location.href =
        `order-details.html?orderId=${orderId}`;

}