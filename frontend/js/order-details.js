const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const params = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");

let currentOrder = null;
let selectedRating = 0;
async function loadOrder() {

    try {

        const res = await fetch(
            `http://localhost:3000/api/orders/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const order = await res.json();

        if (!res.ok) {

            alert(order.message);
            return;

        }

        currentOrder = order;

        document.getElementById("cropName").textContent = order.crop_name;
        document.getElementById("farmer").textContent = order.farmer_name;
        document.getElementById("quantity").textContent = order.quantity + " kg";
        document.getElementById("cropCost").textContent = order.crop_price;
        document.getElementById("transportCost").textContent = order.transport_cost;
        document.getElementById("totalAmount").textContent = order.total_amount;
        document.getElementById("transport").textContent = order.transport_type;
        document.getElementById("destination").textContent = order.destination_address;
        const statusElement = document.getElementById("status");

        statusElement.textContent = order.order_status;

        statusElement.className = "status-badge";

        switch (order.order_status.toLowerCase()) {

            case "pending":
                statusElement.classList.add("status-pending");
                break;

            case "accepted":
                statusElement.classList.add("status-accepted");
                break;

            case "transit":
                statusElement.classList.add("status-transit");
                break;

            case "delivered":
                statusElement.classList.add("status-delivered");
                break;

            case "rejected":
                statusElement.classList.add("status-rejected");
                break;

        }

        if (order.order_status === "Delivered") {

            document
                .getElementById("reviewSection")
                .classList
                .remove("hidden");

            loadMyReview();

        }

    }

    catch (err) {

        console.error(err);

    }

}

async function submitReview() {

    const review = document.getElementById("review").value.trim();

    if (selectedRating === 0) {

        alert("Please select a rating.");
        return;

    }

    try {

        const res = await fetch(
            "http://localhost:3000/api/reviews",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({

                    order_id: currentOrder.id,
                    crop_id: currentOrder.crop_id,
                    farmer_id: currentOrder.farmer_id,
                    buyer_id: user.id,
                    rating: selectedRating,
                    review

                })
            }
        );

        const data = await res.json();

        alert(data.message);

        if (res.ok) {

            document
                .getElementById("writeReview")
                .classList
                .add("hidden");

            document
                .getElementById("myReview")
                .classList
                .remove("hidden");

            document.getElementById("myRating").textContent =
                "★".repeat(selectedRating) +
                "☆".repeat(5 - selectedRating);

            document.getElementById("myReviewText").textContent =
                review;

            document.getElementById("myReviewDate").textContent =
                new Date().toLocaleDateString();

        }

    }

    catch (err) {

        console.error(err);

    }

}

async function loadMyReview() {

    try {

        const res = await fetch(

            `http://localhost:3000/api/reviews/order/${orderId}`,

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const review = await res.json();

        if (!review) {

            return;

        }

        document
            .getElementById("writeReview")
            .classList
            .add("hidden");

        document
            .getElementById("myReview")
            .classList
            .remove("hidden");

        const rating = Number(review.rating);

        document.getElementById("myRating").textContent =
            "★".repeat(rating) +
            "☆".repeat(5 - rating);

        document.getElementById("myReviewText").textContent =
            review.review;

        document.getElementById("myReviewDate").textContent =
            new Date(review.created_at).toLocaleDateString();

    }

    catch (err) {

        console.error(err);

    }

}
document
    .querySelector(".submit-btn")
    .addEventListener("click", submitReview);
function initializeStars() {

    const stars = document.querySelectorAll("#starRating span");

    stars.forEach(star => {

        star.addEventListener("click", () => {

            selectedRating = Number(star.dataset.value);

            stars.forEach(s => {

                if (Number(s.dataset.value) <= selectedRating) {

                    s.textContent = "★";

                } else {

                    s.textContent = "☆";

                }

            });

        });

    });

}

initializeStars();

loadOrder();