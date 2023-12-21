import { Router } from 'express';

module.exports = Router({ mergeParams: true }).get('/healthbars', async (req: any, res: any) => { 
  try {
    const healthbars = await req.db.healthbar.findMany({});
  
    if (healthbars && healthbars.length > 0) {
      return res.status(200).json({
        success: true,
        data: healthbars,
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
