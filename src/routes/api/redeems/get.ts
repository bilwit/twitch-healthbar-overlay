import { Router } from 'express';

module.exports = Router({ mergeParams: true }).get('/redeems', async (req: any, res: any) => {
  try {
    const redeems = await req.db.redeems.findMany({});

    if (redeems) {
      return res.status(200).json({
        success: true,
        data: redeems,
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
