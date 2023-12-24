import { Router } from 'express';

module.exports = Router({ mergeParams: true }).get('/monsters/relations/:ref', async (req: any, res: any) => {
  try {
    const monsters = await req.db.monsters.findMany({
      where: {
        relations_id: Number(req.params.ref),
      },
    });

    if (monsters) {
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
