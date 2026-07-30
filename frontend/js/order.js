const params = new URLSearchParams(window.location.search);

const cropId = params.get("id");

const token = localStorage.getItem("token");

let crop = null;

let cropCost = 0;

let transportCost = 0;

let totalCost = 0;

let selectedAddress = "";

let selectedLat = null;

let selectedLon = null;

let searchTimer;

async function fetchCrop() {

    try {

        const res = await fetch(
            `http://localhost:3000/api/crops/${cropId}`
        );

        crop = await res.json();
        console.log(JSON.stringify(crop, null, 2));

        document.getElementById("orderDetails").innerHTML = `

            <h2>${crop.crop_name}</h2>

            <p><strong>Price:</strong> ₹${crop.price}/kg</p>

            <p><strong>Available Quantity:</strong> ${crop.quantity} kg</p>

            <p><strong>Farm Address:</strong> ${crop.farm_address}</p>

            <hr>

            <label><strong>Enter Quantity</strong></label><br>

            <input
                type="number"
                id="quantity"
                min="1"
                max="${crop.quantity}"
                placeholder="Enter quantity"
            >

            <br><br>

            <label><strong>Destination Address</strong></label><br>

            <input
                type="text"
                id="destinationSearch"
                placeholder="Search address..."
                autocomplete="off"
            >

            <div
                id="suggestions"
                style="
                    border:1px solid #ccc;
                    max-height:220px;
                    overflow-y:auto;
                "
            ></div>

            <br>

            <label><strong>Select Transport</strong></label>

            <div id="transportOptions"></div>

            <br>

            <button id="calculateBtn" class="primary-btn">
                Calculate Cost
            </button>

            <hr>

            <div id="costDetails"></div>

        `;

        loadTransportOptions();

        document
            .getElementById("destinationSearch")
            .addEventListener("input", handleSearch);

        document
            .getElementById("calculateBtn")
            .addEventListener("click", calculateCost);

    }

    catch (err) {

        console.error(err);

    }

}

function loadTransportOptions() {

    const container = document.getElementById("transportOptions");

    container.innerHTML = "";

    crop.transport
        .split(",")
        .map(vehicle => vehicle.trim())
        .forEach(vehicle => {

            container.innerHTML += `
                <label class="transport-option">

                    <input
                        type="radio"
                        name="transport"
                        value="${vehicle}"
                    >

                    <span>${vehicle}</span>

                </label>
            `;

        });

}


async function handleSearch() {

    clearTimeout(searchTimer);

    const text =
        document
            .getElementById("destinationSearch")
            .value
            .trim();

    if (text.length < 3) {

        document.getElementById("suggestions").innerHTML = "";

        return;

    }

    searchTimer = setTimeout(async () => {

        const res = await fetch(

            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5`

        );

        const places = await res.json();

        const list =
            document.getElementById("suggestions");

        list.innerHTML = "";

        places.forEach(place => {

            const item =
                document.createElement("div");

            item.style.cursor = "pointer";

            item.style.padding = "8px";

            item.textContent = place.display_name;

            item.onclick = () => {

                selectedAddress =
                    place.display_name;

                selectedLat =
                    Number(place.lat);

                selectedLon =
                    Number(place.lon);

                document.getElementById(
                    "destinationSearch"
                ).value = selectedAddress;

                list.innerHTML = "";

            };

            list.appendChild(item);

        });

    }, 400);

}
async function calculateCost() {

    const quantity =
        Number(document.getElementById("quantity").value);

    const transport =
        document.querySelector('input[name="transport"]:checked');

    if (!quantity) {

        alert("Enter quantity");

        return;

    }

    if (!selectedLat || !selectedLon) {

        alert("Select a destination from the suggestions");

        return;

    }

    if (!transport) {

        alert("Select transport");

        return;

    }

    try {

        const res = await fetch(

            "http://localhost:3000/api/transport/calculate",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization": `Bearer ${token}`

                },

                body: JSON.stringify({

                    source_lat: crop.latitude,

                    source_lon: crop.longitude,

                    destination_lat: selectedLat,

                    destination_lon: selectedLon,

                    vehicle: transport.value

                })

            }

        );

        const data = await res.json();

        transportCost = Number(data.transportCost);

        cropCost = quantity * Number(crop.price);

        totalCost = cropCost + transportCost;

        document.getElementById("costDetails").innerHTML = `

            <h3>Cost Summary</h3>

            <p><strong>Crop Cost :</strong> ₹${cropCost.toFixed(2)}</p>

            <hr>

            <h4>Transport Details</h4>

            <p>Distance : ${data.distance} km</p>

            <p>Rate : ₹${data.rate}/km</p>

            <p>Loading Charge : ₹${data.loadingCharge}</p>

            <p>Toll : ₹${data.toll}</p>

            <p><strong>Transport Cost :</strong> ₹${transportCost.toFixed(2)}</p>

            <hr>

            <h3>Total Amount : ₹${totalCost.toFixed(2)}</h3>

            <br>

            <button id="placeOrderBtn" class="place-order-btn">
                🛒 Place Order
            </button>

        `;

        document
            .getElementById("placeOrderBtn")
            .addEventListener("click", showOrderConfirmation);

    }

    catch (err) {

        console.error(err);

        alert("Unable to calculate transport");

    }

}
function showOrderConfirmation() {

    const ok = confirm(

`Confirm Order?

Crop Cost: ₹${cropCost.toFixed(2)}

Transport Cost: ₹${transportCost.toFixed(2)}

Total Amount: ₹${totalCost.toFixed(2)}

Press OK to place the order.`

    );

    if (ok) {

        placeOrder();

    }

}

async function placeOrder() {

    const user =
        JSON.parse(localStorage.getItem("user"));

    const quantity =
        Number(document.getElementById("quantity").value);

    const transport =
        document.querySelector('input[name="transport"]:checked').value;

    try {

        const res = await fetch(

            "http://localhost:3000/api/orders",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization": `Bearer ${token}`

                },

                body: JSON.stringify({

                    buyer_id: user.id,

                    crop_id: crop.id,

                    farmer_id: crop.farmer_id,

                    quantity: quantity,

                    crop_price: crop.price,

                    transport_cost: transportCost,

                    total_amount: totalCost,

                    destination_address: selectedAddress,

                    destination_lat: selectedLat,

                    destination_lon: selectedLon,

                    transport_type: transport

                })

            }

        );

        const result = await res.json();

        if (res.ok) {

            window.location.href =
                `/order_success.html?id=${result.orderId}`;
        }

        else {

            alert(result.message);

        }

    }

    catch (err) {

        console.error(err);

        alert("Unable to place order");

    }

}

fetchCrop();