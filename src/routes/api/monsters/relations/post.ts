import { Router } from 'express';
import { Prisma } from '@prisma/client';

interface NewRelation {
  ref_id: number,
}

module.exports = Router({ mergeParams: true }).post('/monsters/relations', async (req: any, res: any) => {
  try {
    const isNotUnique = await req.db.relations.findFirst({
      where: {
        id: JSON.parse(req.body.id),
        ref_id: JSON.parse(req.body.ref_id),
      },
    });

    if (isNotUnique) {
      throw new Error('Relation for these monsters already exists');
    } else {
      const newData: NewStage = {
        hp_value: JSON.parse(req.body.hp_value),
        ref_id: JSON.parse(req.body.ref_id),
      }
  
      if (JSON.parse(req.body.isAvatarChanged)) {
        newData['avatar_url'] = req?.file?.filename || undefined;
      }
  
      const stage = await req.db.stages.create({
        data: newData,
      });
    
      if (stage && stage?.id > 0) {
        return res.status(200).json({
          success: true,
          data: [stage],
        });
      } else {
        throw new Error('Could not create stage');
      }
    }

  } catch (e: any) {
    console.log(e);
    let msg = e;
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        let target = e?.meta?.['target'];
        msg = new Error('Stage with the same ' + (Array.isArray(target) ? target[0] : '') +  ' already exists');
      }
    }
    return res.status(500).json({
      success: false,
      msg: msg.message,
    });
  }
});