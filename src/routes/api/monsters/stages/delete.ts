import { stages } from '@prisma/client';
import { Router } from 'express';

module.exports = Router({ mergeParams: true }).delete('/monsters/stages/:id', async (req: any, res: any) => {
  try {
    const stage: stages = await req.db.stages.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    if (stage) {
      return res.status(200).json({
        success: true,
        data: [{ id: stage.id }],
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
