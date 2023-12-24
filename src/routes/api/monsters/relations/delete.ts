import { Router } from 'express';

module.exports = Router({ mergeParams: true }).delete('/monsters/relations/:id', async (req: any, res: any) => {
  try {
    const relations = await req.db.relations.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    if (relations) {
      return res.status(200).json({
        success: true,
        data: [{ id: relations.id }],
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
