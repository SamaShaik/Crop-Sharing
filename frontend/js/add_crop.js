const API_URL = "http://localhost:3000/api";

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

if (!user || !token) {
    window.location.href = "login.html";
}

const addressInput = document.getElementById("farmAddress");
const suggestionBox = document.getElementById("addressSuggestions");

const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");

// let marker = null;

// -----------------------
// Leaflet Map
// -----------------------

// const map = L.map("map").setView([20.5937, 78.9629], 5);

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "&copy; OpenStreetMap contributors"
// }).addTo(map);

// -----------------------
// Address Search
// -----------------------

let debounceTimer;

addressInput.addEventListener("input", () => {

    clearTimeout(debounceTimer);

    const query = addressInput.value.trim();

    if (query.length < 3) {
        suggestionBox.style.display = "none";
        suggestionBox.innerHTML = "";
        return;
    }

    debounceTimer = setTimeout(() => {
        searchAddress(query);
    }, 500);

});

async function searchAddress(query) {

    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
        );

        const data = await response.json();

        suggestionBox.innerHTML = "";

        if (data.length === 0) {
            suggestionBox.style.display = "none";
            return;
        }

        suggestionBox.style.display = "block";

        data.forEach(place => {

            const item = document.createElement("div");

            item.className = "suggestion-item";

            item.textContent = place.display_name;

            item.onclick = () => selectAddress(place);

            suggestionBox.appendChild(item);

        });

    } catch (error) {
        console.error(error);
    }

}

let selectedCity = "";

function selectAddress(place) {

    addressInput.value = place.display_name;

    latitudeInput.value = place.lat;
    longitudeInput.value = place.lon;

    selectedCity =
        place.address?.city ||
        place.address?.town ||
        place.address?.village ||
        place.address?.municipality ||
        place.address?.county ||
        "";

    suggestionBox.innerHTML = "";
    suggestionBox.style.display = "none";

}

// Hide suggestions when clicked outside

document.addEventListener("click", function (e) {

    if (
        !addressInput.contains(e.target) &&
        !suggestionBox.contains(e.target)
    ) {
        suggestionBox.style.display = "none";
    }

});

// -----------------------
// Save Crop
// -----------------------

document
    .getElementById("addCropForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const selectedTransport = [];

        document
            .querySelectorAll('input[name="transport"]:checked')
            .forEach(item => {
                selectedTransport.push(item.value);
            });

        if (selectedTransport.length === 0) {
            alert("Please select at least one transport.");
            return;
        }

        if (
            latitudeInput.value === "" ||
            longitudeInput.value === ""
        ) {
            alert("Please select a valid farm address.");
            return;
        }

        const formData = new FormData();

        formData.append("crop_name", document.getElementById("crop").value);
        formData.append("quantity", document.getElementById("qty").value);
        formData.append("price", document.getElementById("price").value);
        formData.append("details", document.getElementById("details").value);
        formData.append("state", user.state);
        formData.append("source_city", selectedCity);
        formData.append("farm_address", addressInput.value);
        formData.append("latitude", latitudeInput.value);
        formData.append("longitude", longitudeInput.value);

        selectedTransport.forEach(vehicle => {
            formData.append("transport", vehicle);
        });

        const image = document.getElementById("image").files[0];

        if (image) {
            formData.append("image", image);
        }

        try {

            const response = await fetch(`${API_URL}/crops`, {

                method: "POST",

                headers: {
                    Authorization: `Bearer ${token}`
                },

                body: formData

            });

            const data = await response.json();

            if (!response.ok) {

                alert(data.error || "Failed to save crop.");

                return;

            }

            alert("Crop added successfully!");

            window.location.href = "farmer_dashboard.html";

        } catch (error) {

            console.error(error);

            alert("Server Error");

        }

    });