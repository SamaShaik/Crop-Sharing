const params = new URLSearchParams(window.location.search);

const cropId = params.get("id");

async function fetchCropDetails() {

    try {

        const res = await fetch(`http://localhost:3000/api/crops/${cropId}`);

        if (!res.ok) {
            throw new Error("Failed to fetch crop");
        }

        const crop = await res.json();

        const image = document.getElementById("cropImage");
        const info = document.getElementById("cropInfo");

        image.src = crop.image
            ? `http://localhost:3000/${crop.image}`
            : "https://via.placeholder.com/500x300?text=No+Image";

        info.innerHTML = `

            <h2>${crop.crop_name}</h2>

            <p><strong>Price:</strong> ₹${crop.price}/kg</p>

            <p><strong>Quantity:</strong> ${crop.quantity}</p>

            <p><strong>Description:</strong> ${crop.details}</p>

            <hr>

            <h3>Farmer Details</h3>

            <p><strong>Name:</strong> ${crop.farmer_name}</p>

            <p><strong>Phone:</strong> ${crop.phone}</p>

            <p><strong>Country:</strong> ${crop.country}</p>

            <p><strong>State:</strong> ${crop.farmer_state}</p>

            <p><strong>Village:</strong> ${crop.village}</p>
            <hr>

<button id="orderBtn" class="order-btn">
    🛒 Order Now
</button>

        `;

        document.getElementById("orderBtn").addEventListener("click", () => {
    window.location.href = `order.html?id=${crop.id}`;
});
    }
    

    catch (err) {

        console.error(err);

    }

}

fetchCropDetails();