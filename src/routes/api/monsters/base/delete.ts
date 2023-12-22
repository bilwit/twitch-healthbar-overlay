import { monster } from '@prisma/client';
import { Router } from 'express';

module.exports = Router({ mergeParams: true }).delete('/monsters/base/:id', async (req: any, res: any) => {
  try {
    const monster: monster = await req.db.monster.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    if (monster) {
      return res.status(200).json({
        success: true,
        data: [{ id: monster.id }],
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
