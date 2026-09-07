// backend/index.js
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors()); // Allows frontend requests
app.use(express.json());

// Sample API route
app.get('/api/message', (req, res) => {
  res.json({ message: "Hello from the Node.js backend!" });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
