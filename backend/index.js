import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

app.use(cors()); 
app.use(express.json());

// 🎯 The missing verification route
app.post('/api/validate', async (req, res) => {
  try {
    const { characterName, clickedX, clickedY } = req.body;

    // 1. Find the target coordinates in PostgreSQL using Prisma
    const targetChar = await prisma.char.findUnique({
      where: { name: characterName }
    });

    if (!targetChar) {
      return res.status(404).json({ error: "Character not found in database" });
    }

    // 2. Define standard 25px radius margin of error tolerance
    const RADIUS = 25;
    const isCorrect = 
      Math.abs(clickedX - targetChar.locationx) <= RADIUS && 
      Math.abs(clickedY - targetChar.locationy) <= RADIUS;

    // 3. Return the evaluation result safely back to your front end
    return res.json({ found: isCorrect });

  } catch (error) {
    console.error("Database validation error:", error);
    return res.status(500).json({ error: "Server error handling validation" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
