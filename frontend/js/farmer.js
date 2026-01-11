const user = JSON.parse(localStorage.getItem("user"));
const farmerId = user?.id;
const token = localStorage.getItem("token");

if (!farmerId || !token) {
  alert("Unauthorized. Please login again.");
  window.location.href = "login.html";
}

const farmerName = user?.name || "Farmer";
document.getElementById("farmerName").innerText = farmerName;

function toggleProfile() {
  document.getElementById("profileInfo").classList.toggle("hidden");
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
let requests = [];

async function fetchFarmerRequests() {
  try {
    const res = await fetch(
      `http://localhost:3000/api/requests/farmer/${farmerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to fetch requests");
      return;
    }

    requests = data;
    renderRequests();

  } catch (err) {
    console.error(err);
    alert("Server error while loading requests");
  }
}

function renderRequests() {
  const container = document.getElementById("requestsList");
  container.innerHTML = "";

  if (requests.length === 0) {
    container.innerHTML = "<p>No requests found</p>";
    return;
  }

  requests.forEach(r => {
    const div = document.createElement("div");
    div.className = "card";

    const statusColor =
      r.status === "accepted"
        ? "green"
        : r.status === "rejected"
        ? "red"
        : "orange";

    div.innerHTML = `
      <div>
        <strong>${r.crop_name}</strong>
        <p>Buyer: ${r.buyer_name}</p>
        <p>Offered Price: ₹${r.requested_price}</p>
        <p>
          Status:
          <span style="font-weight:600;color:${statusColor}">
            ${r.status}
          </span>
        </p>
        <a href="#" onclick='showBuyerDetails(${JSON.stringify(r)})'>
          More details
        </a>
      </div>
    `;

    if (r.status === "pending") {
      const acceptBtn = document.createElement("button");
      acceptBtn.textContent = "Accept";
      acceptBtn.style.background = "green";
      acceptBtn.onclick = () => updateStatus(r.id, "accepted");

      const rejectBtn = document.createElement("button");
      rejectBtn.textContent = "Reject";
      rejectBtn.style.background = "red";
      rejectBtn.onclick = () => updateStatus(r.id, "rejected");

      div.appendChild(acceptBtn);
      div.appendChild(rejectBtn);
    }

    container.appendChild(div);
  });
}


async function updateStatus(requestId, status) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/requests/${requestId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to update status");
      return;
    }

    alert(data.message);
    fetchFarmerRequests();

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

function showBuyerDetails(buyer) {
  alert(
    "Buyer Details\n\n" +
    "Name: " + buyer.buyer_name + "\n" +
    "Country: " + buyer.buyer_country + "\n" +
    "State: " + buyer.buyer_state + "\n" +
    "Phone: " + buyer.buyer_phone
  );
}

function showSection(sectionId) {
  document.getElementById("dashboard").classList.add("hidden");
  document.querySelectorAll(".fullView").forEach(s => s.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");

  if (sectionId === "requests") fetchFarmerRequests();
}

function goBack() {
  document.getElementById("dashboard").classList.remove("hidden");
  document.querySelectorAll(".fullView").forEach(s => s.classList.add("hidden"));
}

fetchFarmerRequests();
