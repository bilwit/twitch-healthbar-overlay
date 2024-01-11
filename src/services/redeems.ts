import { PrismaClient } from "@prisma/client";

export async function upsertRedeems(data: any, db: PrismaClient): Promise<Map<any, any>> {
  // to back-reference for local db item deletion (redeem may not exist anymore)
  const redeemDict = new Map();

  async function upsertRedeem(item: any) {
    redeemDict.set(item.id, true);
    try {
      const updatedRedeem = await db.redeems.upsert({
        where: {
          twitch_id: String(item.id),
        },
        update: {
          twitch_id: String(item.id),
          title: item.title,
          default_image: item.default_image.url_1x,
        },
        create: {
          twitch_id: String(item.id),
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

  return Promise.all(data.map((item: any) => upsertRedeem(item))).then((redeems) => redeemDict);
}

export async function deleteObsoleteEntries(dictionary: Map<string, boolean>, db: PrismaClient) {
  // we do not care about the result
  try {
    const redeems = await db.redeems.findMany({
      select: {
        twitch_id: true,
      }
    });
    for (const redeem of redeems) {
      if (!dictionary.get(redeem.twitch_id)) {
        try {
          db.redeems.delete({
            where: {
              id: Number(redeem.twitch_id),
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
