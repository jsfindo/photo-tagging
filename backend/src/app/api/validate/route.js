import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

// Middleware configuration
app.use(cors());
app.use(express.json());

// 🎯 The exact route your frontend is fetching
app.post('/api/validate', async (request, response) => {
  try {
    const { characterName, clickedX, clickedY } = request.body;

    // 1. Fetch target from your PostgreSQL table using Prisma
    const targetChar = await prisma.char.findUnique({
      where: { name: characterName }
    });

    if (!targetChar) {
      return response.status(404).json({ error: "Character not found in database" });
    }

    // 2. 25px acceptable radius margin of error
    const RADIUS = 25;
    const isCorrect = 
      Math.abs(clickedX - targetChar.locationx) <= RADIUS && 
      Math.abs(clickedY - targetChar.locationy) <= RADIUS;

    // 3. Return the response back to React
    return response.json({ found: isCorrect });

  } catch (error) {
    console.error("Validation error:", error);
    return response.status(500).json({ error: "Server error handling validation" });
  }
});

// Start listening for connections
app.listen(PORT, () => {
  console.log(`🚀 Backend validation server running on http://localhost:${PORT}`);
});
