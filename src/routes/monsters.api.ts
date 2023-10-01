import express, { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

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

router.post('/', async (req: Request, res: Response) => {
  try {
    const monster = await prisma.monster.create({
      data: {
        name: req.body.name, // must be unique
        published: req.body.published,
        hp_multiplier: req.body.hp_multiplier,
        trigger_words: req.body.trigger_words.join(','),
      },
    });
  
    if (monster && monster?.id > 0) {
      return res.status(200).json({
        success: true,
        data: [monster],
      });
    } else {
      throw new Error('Could not create monster');
    }
  } catch (e) {
    let msg = e;
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        let target = e?.meta?.['target'];
        msg = 'Monster with the same ' + (Array.isArray(target) ? target[0] : '') +  ' already exists';
      }
    }
    return res.status(500).json({
      success: false,
      msg: msg,
    });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const monster = await prisma.monster.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
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
