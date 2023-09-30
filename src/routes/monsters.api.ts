import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const monsters = await prisma.monster.findMany();
  
    if (monsters && monsters.length > 0) {
      return res.status(200).json({
        success: true,
        data: monsters,
      });
    } else {
      throw true;
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
    });
  }
});

prisma.$disconnect();

module.exports = router;
