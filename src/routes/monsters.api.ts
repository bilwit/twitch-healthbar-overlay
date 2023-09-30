import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const monsters = await prisma.monster.findMany({
      select: {
        id: true,
        created_at: true,
        name: true,
        published: true,
        hp_multiplier: true,
      }
    });
  
    if (monsters && monsters.length > 0) {
      return res.status(200).json({
        success: true,
        data: monsters,
      });
    } else {
      throw true;
    }
  } catch (e) {
    if (e !== true) {
      console.error(e);
    }
    return res.status(500).json({
      success: false,
    });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const monster = await prisma.monster.findFirst({
      where: {
        id: Number(req.params.id),
      },
    });
  
    if (monster) {
      return res.status(200).json({
        success: true,
        data: [monster],
      });
    } else {
      throw true;
    }
  } catch (e) {
    if (e !== true) {
      console.error(e);
    }
    return res.status(500).json({
      success: false,
    });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const monster = await prisma.monster.upsert({
      where: {
        id: Number(req.params.id),
      },
      update: {
        name: req.body.name,
        published: req.body.published,
        hp_multiplier: req.body.hp_multiplier,
        trigger_words: req.body.trigger_words,
      },
      create: {
        name: req.body.name,
        published: req.body.published,
        hp_multiplier: req.body.hp_multiplier,
        trigger_words: req.body.trigger_words,
      },
    });
  
    if (monster && monster?.id > 0) {
      return res.status(200).json({
        success: true,
        data: [monster],
      });
    } else {
      throw true;
    }
  } catch (e) {
    if (e !== true) {
      console.error(e);
    }
    return res.status(500).json({
      success: false,
    });
  }
});

prisma.$disconnect();

module.exports = router;
