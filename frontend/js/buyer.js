let allCrops = [];
const buyer = JSON.parse(localStorage.getItem('user'));
const buyerId = buyer ? buyer.id : 1;
const buyerName = buyer ? buyer.name : "Buyer Name";

document.getElementById("buyerName").innerText = buyerName;
const profileInfo = document.getElementById("profileInfo");

if (profileInfo && buyer) {

    profileInfo.innerHTML = `
        <p><strong>Name:</strong> ${buyer.name}</p>
        <p><strong>Email:</strong> ${buyer.email}</p>
        <p><strong>State:</strong> ${buyer.state}</p>
        <p><strong>Village:</strong> ${buyer.village}</p>
    `;

}

function toggleProfile() {
  document.getElementById("profileInfo").classList.toggle("hidden");
}

async function fetchAvailableCrops() {
  try {
    const res = await fetch('http://localhost:3000/api/crops');
    if (!res.ok) throw new Error("Failed to fetch crops");
    const data = await res.json();
    allCrops = data;
    loadStateFilter(allCrops);
    renderAvailableCrops(allCrops);
  } catch (err) {
    console.error("Error fetching crops:", err);
  }
}




function renderAvailableCrops(cropsList) {

    const container = document.getElementById("cropsList");

    container.innerHTML = "";

    if (cropsList.length === 0) {

        container.innerHTML = `
            <h3 style="text-align:center;">
                No crops found.
            </h3>
        `;

        return;

    }

    cropsList.forEach(c => {

        const card = document.createElement("div");

        card.className = "grid-card";

       card.innerHTML = `

            <img
                src="${c.image
                    ? `http://localhost:3000/${c.image}`
                    : 'https://via.placeholder.com/300x200?text=No+Image'}"
                alt="${c.crop_name}"
                class="crop-image"
            >

            <h3>${c.crop_name}</h3>

            <p><strong>Quantity:</strong> ${c.quantity} kg</p>

            <p><strong>Price:</strong> ₹${c.price}/kg</p>

            <p>
                <strong>Rating:</strong>
                ${"★".repeat(Math.round(Number(c.average_rating || 0)))}
                ${"☆".repeat(5 - Math.round(Number(c.average_rating || 0)))}
                (${c.total_reviews || 0} Reviews)
            </p>

            <p class="${
                Number(c.quantity) > 0
                    ? "available"
                    : "out-of-stock"
            }">
                ${
                    Number(c.quantity) > 0
                        ? "Available"
                        : "Out of Stock"
                }
            </p>

        `;

        const detailsBtn = document.createElement("button");

        detailsBtn.textContent =
            Number(c.quantity) > 0
                ? "View Details"
                : "Out of Stock";

        detailsBtn.disabled =
            Number(c.quantity) <= 0;

        if (Number(c.quantity) > 0) {

            detailsBtn.onclick = () => {

                window.location.href = `crop_details.html?id=${c.id}`;

            };

        }

        const reviewBtn = document.createElement("button");

        reviewBtn.textContent = "View Reviews";

        const reviewsDiv = document.createElement("div");

        reviewsDiv.style.display = "none";

        reviewBtn.onclick = async () => {

            if (reviewsDiv.style.display === "block") {

                reviewsDiv.style.display = "none";

                reviewBtn.textContent = "View Reviews";

                return;

            }

            reviewBtn.textContent = "Hide Reviews";

            try {
                console.log("Farmer ID:", c.farmer_id);
                console.log("Crop Name:", c.crop_name);

                const res = await fetch(

                    `http://localhost:3000/api/reviews/crop/${c.farmer_id}/${encodeURIComponent(c.crop_name)}`

                );

                const reviews = await res.json();

                if (reviews.length === 0) {

                    reviewsDiv.innerHTML = `
                        <p>No reviews yet.</p>
                    `;

                }

                else {

                    reviewsDiv.innerHTML = reviews.map(r => `

                        <div style="
                            border-top:1px solid #ddd;
                            margin-top:10px;
                            padding-top:10px;
                        ">

                            <strong>
                                ${"★".repeat(r.rating)}
                                ${"☆".repeat(5-r.rating)}
                            </strong>

                            <p><b>${r.buyer_name}</b></p>

                           

                            <p>${r.review}</p>

                        </div>

                    `).join("");

                }

                reviewsDiv.style.display = "block";

            }

            catch(err){

                console.error(err);

                alert("Unable to load reviews.");

            }

        };

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "card-buttons";

        buttonContainer.appendChild(detailsBtn);
        buttonContainer.appendChild(reviewBtn);

        card.appendChild(buttonContainer);
        card.appendChild(reviewsDiv);

        container.appendChild(card);
    });

}
function loadStateFilter(cropsList) {

    const filter = document.getElementById("filterState");

    filter.innerHTML = `<option value="">All States</option>`;

    const states = [
        ...new Set(
            cropsList
                .map(c => c.state)
                .filter(state => state)
        )
    ];

    states.sort();

    states.forEach(state => {

        const option = document.createElement("option");

        option.value = state;

        option.textContent = state;

        filter.appendChild(option);

    });

}


function applyFilters() {

    const search = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const state = document
        .getElementById("filterState")
        .value;

    const sort = document
        .getElementById("sortPrice")
        .value;

    let filtered = allCrops.filter(crop => {

        const matchesSearch =
            crop.crop_name.toLowerCase().includes(search);

        const matchesState =
            state === "" || crop.state === state;

        return matchesSearch && matchesState;

    });

    if (sort === "low") {

        filtered.sort((a, b) => Number(a.price) - Number(b.price));

    }

    else if (sort === "high") {

        filtered.sort((a, b) => Number(b.price) - Number(a.price));

    }

    renderAvailableCrops(filtered);

}




// Logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  alert("Logged out!");
  window.location.href = "login.html";
}

// Initial fetch
fetchAvailableCrops();
async function showFarmerDetails(farmerId) {
  try {
    const res = await fetch(`http://localhost:3000/api/users/farmer/${farmerId}`);
    if (!res.ok) {
      alert("Failed to fetch farmer details");
      return;
    }

    const farmer = await res.json();

    alert(
      `Farmer Details\n\n` +
      `Name: ${farmer.name}\n` +
      `Country: ${farmer.country}\n` +
      `State: ${farmer.state}\n` +
      `Phone: ${farmer.phone}`
    );

  } catch (err) {
    console.error(err);
    alert("Error loading farmer details");
  }
}
async function calculateTransport(crop){

    const vehicle = document.querySelector(
        `input[name="transport_${crop.id}"]:checked`
    )?.value;

    const destinationCity =
        document.getElementById(`city_${crop.id}`).value;

    if(!vehicle){
        alert("Please select a transport.");
        return;
    }

    if(!destinationCity){
        alert("Please select destination city.");
        return;
    }

    try{

        const res = await fetch(
            "http://localhost:3000/api/transport/calculate",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    source_city: crop.source_city,

                    destination_city: destinationCity,

                    vehicle: vehicle

                })

            }
        );

        const data = await res.json();

        if(!res.ok){

            alert(data.error);

            return;

        }

        const cropCost =
            parseFloat(crop.price) *
            parseFloat(crop.quantity);

        const total =
            cropCost +
            data.transportCost;

        document.getElementById(`result_${crop.id}`).innerHTML = `

            <hr>

            <p><strong>Distance:</strong> ${data.distance} KM</p>

            <p><strong>Rate:</strong> ₹${data.rate}/KM</p>

            <p><strong>Toll:</strong> ₹${data.toll}</p>

            <p><strong>Base Charge:</strong> ₹${data.base}</p>

            <p><strong>Transport Cost:</strong> ₹${data.transportCost}</p>

            <h3>Total Cost : ₹${total}</h3>

        `;

    }

    catch(err){

        console.error(err);

        alert("Server Error");

    }

}
document
    .getElementById("searchInput")
    .addEventListener("input", applyFilters);

document
    .getElementById("filterState")
    .addEventListener("change", applyFilters);

document
    .getElementById("sortPrice")
    .addEventListener("change", applyFilters);