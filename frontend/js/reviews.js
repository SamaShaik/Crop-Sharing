const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);

const farmerId = params.get("farmerId");

async function loadReviews() {

    try {

        const res = await fetch(

            `http://localhost:3000/api/reviews/farmer/${farmerId}`,

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        const reviews = await res.json();

        const container = document.getElementById("reviewsContainer");

        container.innerHTML = "";

        if(reviews.length===0){

            container.innerHTML="<h3>No reviews yet.</h3>";

            return;

        }

        reviews.forEach(r=>{

            container.innerHTML+=`

                <div class="review-card">

                    <h3>${r.buyer_name}</h3>

                    <p>⭐ ${r.rating}/5</p>

                    <p>${r.review}</p>

                </div>

            `;

        });

    }

    catch(err){

        console.error(err);

    }

}

loadReviews();