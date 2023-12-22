import { Router } from 'express';

module.exports = Router({ mergeParams: true }).get('/monsters/base/:id', async (req: any, res: any) => {
  try {
    if (req.params.id === 'all') {
      const monsters = await req.db.monster.findMany({});
  
      if (monsters && monsters.length > 0) {
        return res.status(200).json({
          success: true,
          data: monsters,
        });
      } else {
        throw true;
      }
    } else {
      const monster = await req.db.monster.findFirst({
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
