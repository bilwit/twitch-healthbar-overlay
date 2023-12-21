import { healthbar } from '@prisma/client';
import { Router } from 'express';

module.exports = Router({ mergeParams: true }).delete('/healthbars/:id', async (req: any, res: any) => {
  try {
    const healthbar: healthbar = await req.db.healthbar.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    if (healthbar) {
      return res.status(200).json({
        success: true,
        data: [{ id: healthbar.id }],
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
