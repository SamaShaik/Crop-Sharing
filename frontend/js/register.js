const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const phone = document.getElementById('phone').value;
  const country = document.getElementById('country').value;
  const state = document.getElementById('state').value;
  const village = document.getElementById('village').value;
  const farmSize = document.getElementById('farmSize').value;
  const role = document.querySelector('.role-btn.active').textContent.toLowerCase();
  if (!/^\d{10}$/.test(phone)) {
    alert("Phone number must contain exactly 10 digits.");
    return;
  }
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }
  const payload = { name, email, password, phone, country, state, village, role };
  if (role === 'farmer') payload.farmSize = farmSize;
  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      alert('Registration successful! You can now login.');
      window.location.href = 'login.html';
    } else {
      alert(data.error || 'Registration failed.');
    }
  } catch (err) {
    console.error('Register error:', err);
    alert('Something went wrong. Please try again.');
  }
});
