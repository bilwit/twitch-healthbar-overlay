import { Router } from 'express';
import { Prisma } from '@prisma/client';
import upload from '../../../utils/storage';
import { UpdatedHealthBarData } from './healthbars.interface';

module.exports = Router({ mergeParams: true }).post('/healthbars', upload.single('avatarFile'), async (req: any, res: any) => {
  try {
    const newData: UpdatedHealthBarData = {
      name: JSON.parse(req.body.name),
    }

    if (JSON.parse(req.body.isAvatarChanged)) {
      newData['avatar_url'] = req?.file?.filename || undefined;
    }

    const healthbar = await req.db.healthbar.create({
      data: newData,
    });
  
    if (healthbar && healthbar?.id > 0) {
      return res.status(200).json({
        success: true,
        data: [healthbar],
      });
    } else {
      throw new Error('Could not create monster');
    }
  } catch (e: any) {
    let msg = e;
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        let target = e?.meta?.['target'];
        msg = 'Health Bar with the same ' + (Array.isArray(target) ? target[0] : '') +  ' already exists';
      }
    }
    return res.status(500).json({
      success: false,
      msg: msg,
    });
  }
});