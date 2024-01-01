import { Router } from 'express';

module.exports = Router({ mergeParams: true }).put('/monsters/relations/:id', async (req: any, res: any) => {
  if (!req.query.ref) {
    throw 'No reference id provided';
  }

  try {
    const monster1 = await req.db.monster.findFirst({
      where: {
        id: Number(req.params.id),
      },
      select: {
        relations_id: true,
      }
    });

    const monster2 = await req.db.monster.findFirst({
      where: {
        id: Number(req.query.ref),
      },
      select: {
        relations_id: true,
      }
    });

    if (monster1?.relations_id && !monster2?.relations_id) {
      const updatedMonster2 = await req.db.monster.update({
        where: {
          id: Number(req.query.ref),
        },
        data: {
          relations_id: monster1.relations_id,
        },
      });

      return res.status(200).json({
        success: true,
        data: [updatedMonster2],
      });
    } else if (monster2?.relations_id && !monster1?.relations_id) {
      const updatedMonster1 = await req.db.monster.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          relations_id: monster2.relations_id,
        },
      });

      return res.status(200).json({
        success: true,
        data: [updatedMonster1],
      });
    } else if (!monster1?.relations_id && !monster2?.relations_id) {
      const relation = await req.db.relations.create({});

      if (relation?.id) {
        const updatedMonster1 = await req.db.monster.update({
          where: {
            id: Number(req.params.id),
          },
          data: {
            relations_id: relation.id,
          },
        });

        const updatedMonster2 = await req.db.monster.update({
          where: {
            id: Number(req.query.ref),
          },
          data: {
            relations_id: relation.id,
          },
        });
  
        return res.status(200).json({
          success: true,
          data: [updatedMonster1, updatedMonster2],
        }); 
      } else {
        console.log('Couuld not create new relationship');
        throw true;
      }
     
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