import { Router } from 'express';

module.exports = Router({ mergeParams: true }).delete('/monsters/relations/:id', async (req: any, res: any) => {
  try {
    const monster = await req.db.monster.update({
      data: {
        relations_id: null,
      },
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
