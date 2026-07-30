const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document
        .querySelector(".role-btn.active")
        .textContent
        .toLowerCase();

    try {

        const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                role
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Login failed");
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login successful!");

        if (role === "farmer") {
            window.location.href = "/farmer_dashboard.html";
        }
        else {
            window.location.href = "/buyer_dashboard.html";
        }

    }
    catch (err) {

        console.error(err);
        alert("Unable to login");

    }

});