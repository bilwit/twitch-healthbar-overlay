import { Router } from 'express';

module.exports = Router({ mergeParams: true }).get('/monsters/stages/:id', async (req: any, res: any) => {
  try {
    const stage = await req.db.stages.findMany({
      where: {
        ref_id: Number(req.params.id),
      },
    });

    if (stage) {
      return res.status(200).json({
        success: true,
        data: stage,
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
