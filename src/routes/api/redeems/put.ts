import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

module.exports = Router({ mergeParams: true }).put('/monsters/redeems', async (req: any, res: any) => {
  // to back-reference for local db item deletion (redeem may not exist anymore)
  const redeemDict = new Map();

  async function upsertRedeem(item: any) {
    redeemDict.set(item.id, true);
    try {
      const updatedRedeem = await req.db.redeems.upsert({
        where: {
          redeem_id: item.id,
        },
        update: {
          redeem_id: item.id,
          title: item.title,
          default_image: item.default_image.url_1x,
        },
        create: {
          redeem_id: item.id,
          title: item.title,
          default_image: item.default_image.url_1x,
        },
      });
    
      if (updatedRedeem && updatedRedeem?.id > 0) {
        return updatedRedeem;
      } else {
        throw 'Could not upsert: ' + item?.title;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async function upsertRedeems(data: any) {
    return Promise.all(data.map((item: any) => upsertRedeem(item))).then((redeems) => redeems);
  }
  

  try {
    // sync local redeem database with Twitch
    req['TwitchEmitter'].emit('getRedeems');
    req['TwitchEmitter'].on('sendRedeems', async (data: any) => {
      try {
        if (data) {
          const upsertedRedeems = await upsertRedeems(data);

          if (upsertedRedeems) {
            deleteObsoleteEntries(req.db, redeemDict);
            
            return res.status(200).json({
              success: true,
              data: upsertedRedeems,
            });
          }
        }
      } catch (_e) {
        null;
      }
    })

  } catch (e) {
    if (e !== true) {
      console.error(e);
    }
    return res.status(500).json({
      success: false,
    });
  }
});

async function deleteObsoleteEntries(db: PrismaClient, dictionary: Map<string, boolean>) {
  // we do not care about the result
  try {
    const redeems = await db.redeems.findMany({
      select: {
        redeem_id: true,
      }
    });
    for (const redeem of redeems) {
      if (!dictionary.get(redeem.redeem_id)) {
        try {
          db.redeems.delete({
            where: {
              id: Number(redeem.redeem_id),
            },
          });
        } catch (er) {
          console.log(er);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}
