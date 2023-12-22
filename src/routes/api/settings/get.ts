import { Router } from 'express';

module.exports = Router({ mergeParams: true }).get('/settings', async (req: any, res: any) => {
  try {
    
    const settings = await req.db.settings.findFirst();
    if (settings && settings?.id > 0) {
      return res.status(200).json({
        success: true,
        data: settings,
      });
    } else {
      throw new Error('No settings found');
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
    });
  }
});
