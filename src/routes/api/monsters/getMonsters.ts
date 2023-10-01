import { Router } from 'express';

module.exports = Router({ mergeParams: true }).get('/monsters', async (req: any, res: any) => { 
  try {
    const monsters = await req.db.monster.findMany({});
  
    if (monsters && monsters.length > 0) {
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
