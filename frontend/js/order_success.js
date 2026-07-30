function goHome() {
    window.location.href = "/my-orders.html";
}

const params = new URLSearchParams(window.location.search);

const orderId = params.get("id");

document.getElementById("orderInfo").innerHTML = `
    <p><strong>Order ID:</strong> #${orderId}</p>
`;