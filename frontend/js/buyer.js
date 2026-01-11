const buyer = JSON.parse(localStorage.getItem('user'));
const buyerId = buyer ? buyer.id : 1;
const buyerName = buyer ? buyer.name : "Buyer Name";

document.getElementById("buyerName").innerText = buyerName;
const profileInfo = document.querySelector("#profileInfo");
if(profileInfo) profileInfo.querySelector("p").innerHTML = `<strong>Name:</strong> ${buyerName}`;

function toggleProfile() {
  document.getElementById("profileInfo").classList.toggle("hidden");
}

async function fetchAvailableCrops() {
  try {
    const res = await fetch('http://localhost:3000/api/crops');
    if (!res.ok) throw new Error("Failed to fetch crops");
    const data = await res.json();
    renderAvailableCrops(data);
  } catch (err) {
    console.error("Error fetching crops:", err);
  }
}

function renderAvailableCrops(cropsList) {
  const container = document.getElementById("cropsList");
  container.innerHTML = "";

  cropsList.forEach(c => {
    const card = document.createElement("div");
    card.className = "grid-card";
    card.innerHTML = `
      <strong>${c.crop_name}</strong>
      <p>Quantity: ${c.quantity}</p>
      <p>₹${c.price}/kg</p>
      <p>State: ${c.state}</p>
      <p>Farmer: ${c.farmer_name}</p>
      <a href="#" onclick="showFarmerDetails(${c.farmer_id})">More details</a>
    `;

    const btn = document.createElement("button");
    btn.textContent = "Request";
    btn.onclick = () => sendRequest(c);
    card.appendChild(btn);

    container.appendChild(card);
  });
}

async function sendRequest(crop) {
  const offer = prompt(`Enter your price per kg (Farmer price: ₹${crop.price}):`, crop.price);
  if (!offer) return;

  try {
    const res = await fetch('http://localhost:3000/api/requests/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        crop_id: crop.id,
        quantity: crop.quantity,
        requested_price: offer
      })
    });


    if (!res.ok) {
      const errText = await res.text(); 
      let msg;
      try { msg = JSON.parse(errText).error; } catch { msg = errText; }
      throw new Error(msg || "Failed to send request");
    }

    const result = await res.json();
    alert(result.message || "Request sent successfully!");
    fetchMyRequests();

  } catch (err) {
    console.error(err);
    alert("Error sending request: " + err.message);
  }
}

async function fetchMyRequests() {
  try {
    const res = await fetch(`http://localhost:3000/api/requests/${buyerId}`);
    if (!res.ok) throw new Error("Failed to fetch requests");
    const data = await res.json();

    const container = document.getElementById("myRequestsList");
    container.innerHTML = "";

    data.forEach(r => {
      const card = document.createElement("div");
      card.className = "grid-card";
      card.innerHTML = `
        <strong>${r.crop_name}</strong>
        <p>Offered Price: ₹${r.requested_price}/kg</p>
        <p>Farmer: ${r.farmer_name}</p>

        <p>
          Status:
          <span style="
            font-weight:600;
            color:${
              r.status === 'accepted'
                ? 'green'
                : r.status === 'rejected'
                ? 'red'
                : 'orange'
            };
          ">
            ${r.status}
          </span>
        </p>

        <a href="#" onclick="showFarmerDetails(${r.farmer_id})">
          More details
        </a>
      `;


      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
      deleteBtn.onclick = () => deleteRequest(r.id);

      card.appendChild(deleteBtn);
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error fetching requests:", err);
    alert("Error fetching your requests. Please try again later.");
  }
}

async function deleteRequest(id) {
  if (!confirm("Are you sure you want to delete this request?")) return;

  try {
    const res = await fetch(`http://localhost:3000/api/requests/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error("Failed to delete request");
    const result = await res.json();
    alert(result.message || "Request deleted");
    fetchMyRequests();
  } catch (err) {
    console.error(err);
    alert("Error deleting request: " + err.message);
  }
}

function showSection(sectionId) {
  document.getElementById("dashboard").classList.add("hidden");
  document.querySelectorAll(".fullView").forEach(s => s.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");

  if (sectionId === "myRequestsSection") fetchMyRequests();
}

function goBack() {
  document.getElementById("dashboard").classList.remove("hidden");
  document.querySelectorAll(".fullView").forEach(s => s.classList.add("hidden"));
}

// Filters
document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("filterState").addEventListener("change", applyFilters);
document.getElementById("priceFilter").addEventListener("change", applyFilters);

// Apply search & filters
async function applyFilters() {
  try {
    const res = await fetch('http://localhost:3000/api/crops');
    if (!res.ok) throw new Error("Failed to fetch crops");
    let cropsList = await res.json();

    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const state = document.getElementById("filterState").value;
    const priceSort = document.getElementById("priceFilter").value;

    if (searchText) cropsList = cropsList.filter(c => c.crop_name.toLowerCase().includes(searchText));
    if (state) cropsList = cropsList.filter(c => c.state === state);
    if (priceSort === "lowToHigh") cropsList.sort((a, b) => a.price - b.price);
    if (priceSort === "highToLow") cropsList.sort((a, b) => b.price - a.price);

    renderAvailableCrops(cropsList);

  } catch (err) {
    console.error("Error applying filters:", err);
  }
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
fetchMyRequests();
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
