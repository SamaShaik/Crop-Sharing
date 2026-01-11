const API_URL = "http://localhost:3000/api";

async function fetchFarmerCrops() {
  try {
    const res = await fetch(`${API_URL}/crops/farmer`);
    const crops = await res.json();
    renderFarmerCrops(crops);
  } catch (err) {
    console.error("Error fetching crops:", err);
  }
}

async function addCrop(cropData) {
  try {
    const res = await fetch(`${API_URL}/crops`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cropData),
    });
    const result = await res.json();
    if (res.ok) {
      alert("Crop added successfully!");
      fetchFarmerCrops(); 
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.error("Error adding crop:", err);
  }
}
