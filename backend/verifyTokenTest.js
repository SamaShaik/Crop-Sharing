const jwt = require('jsonwebtoken');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImZhcm1lciIsImlhdCI6MTc1ODY1MjAyMywiZXhwIjoxNzU4NzM4NDIzfQ.kJaHE82qcLWqvgHGZU8XMhaWhC-GasG0QMGjB7TKsko"; // <-- paste token from Step 1
const secret = "secret_jwt@692";     
jwt.verify(token, secret, (err, decoded) => {
  if (err) {
    console.log("Error:", err);
  } else {
    console.log("Decoded:", decoded);
  }
});
