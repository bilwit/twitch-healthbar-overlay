import { Router } from 'express';

module.exports = Router({ mergeParams: true }).get('/healthbars/:id', async (req: any, res: any) => {
  try {
    const healthbar = await req.db.healthbar.findFirst({
      where: {
        id: Number(req.params.id),
      },
    });

    if (healthbar) {
      return res.status(200).json({
        success: true,
        data: [healthbar],
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
