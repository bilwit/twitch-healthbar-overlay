import express, { Response } from 'express';
import { Prisma } from '@prisma/client';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();

interface UpdatedMonsterData {
  name: string,
  published: boolean,
  hp_multiplier: number,
  trigger_words: string,
  avatar_url?: string | undefined,
}

router.get('/', async (req: any, res: Response) => {
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

router.get('/:id', async (req: any, res: Response) => {
  try {
    const monster = await req.db.monster.findFirst({
      where: {
        id: Number(req.params.id),
      },
    });
  
    if (monster) {
      return res.status(200).json({
        success: true,
        data: [monster],
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

const AVATAR_STORAGE_PATH = path.resolve('storage/avatars') + '/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.access(AVATAR_STORAGE_PATH, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(err);
        fs.mkdir(AVATAR_STORAGE_PATH, { recursive: false }, (err1) => {
          console.log(err1);
          cb(null, AVATAR_STORAGE_PATH);
        });
      }
      cb(null, AVATAR_STORAGE_PATH);
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.png');
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('avatarFile'), async (req: any, res: Response) => {
  try {
    const newData: UpdatedMonsterData = {
      name: JSON.parse(req.body.name),
      published: JSON.parse(req.body.published),
      hp_multiplier: JSON.parse(req.body.hp_multiplier),
      trigger_words: Array.isArray(JSON.parse(req.body.trigger_words)) && JSON.parse(req.body.trigger_words).length > 0 ? JSON.parse(req.body.trigger_words).join(',') : '',
    }

    if (JSON.parse(req.body.isAvatarChanged)) {
      newData['avatar_url'] = req?.file?.filename || undefined;
    }

    const monster = await req.db.monster.create({
      data: newData,
    });
  
    if (monster && monster?.id > 0) {
      return res.status(200).json({
        success: true,
        data: [monster],
      });
    } else {
      throw new Error('Could not create monster');
    }
  } catch (e) {
    let msg = e;
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        let target = e?.meta?.['target'];
        msg = 'Monster with the same ' + (Array.isArray(target) ? target[0] : '') +  ' already exists';
      }
    }
    return res.status(500).json({
      success: false,
      msg: msg,
    });
  }
});

const deleteAvatar = (fileName: string): Promise<{msg: string}> => {
  return new Promise(async (resolve, reject) => {
    fs.access(
      AVATAR_STORAGE_PATH + fileName,
      fs.constants.F_OK,
      async (err) => {
        if (err) {
          reject({ msg: 'File not found' });
        } else {
          // delete file from storage
          fs.unlink(AVATAR_STORAGE_PATH + fileName, (err) => {
            if (err) {
              reject({ msg: 'Cannot delete file' });
            } else {
              resolve({ msg: 'Avatar deleted' });
            }
          });
        }
      },
    );
  });
};

router.put('/:id', upload.single('avatarFile'), async (req: any, res: Response) => {
  try {

    let deleteOldAvatarPath = '';
    // delete existing avatar if request indicated change
    if (JSON.parse(req.body.isAvatarChanged)) {
      const CheckAvatar = await req.db.monster.findFirst({
        where: {
          id: Number(req.params.id),
        },
        select: {
          avatar_url: true,
        }
      });
      if (CheckAvatar?.avatar_url) {
        deleteOldAvatarPath = CheckAvatar?.avatar_url;
      }
    }

    const updatedData: UpdatedMonsterData = {
      name: JSON.parse(req.body.name),
      published: JSON.parse(req.body.published),
      hp_multiplier: JSON.parse(req.body.hp_multiplier),
      trigger_words: Array.isArray(JSON.parse(req.body.trigger_words)) && JSON.parse(req.body.trigger_words).length > 0 ? JSON.parse(req.body.trigger_words).join(',') : '',
    }

    if (JSON.parse(req.body.isAvatarChanged)) {
      updatedData['avatar_url'] = req?.file?.filename || undefined;
    }

    const monster = await req.db.monster.update({
      where: {
        id: Number(req.params.id),
      },
      data: updatedData,
    });
  
    if (monster && monster?.id > 0) {

      if (deleteOldAvatarPath) {
        try {
          const isDeleted = await deleteAvatar(deleteOldAvatarPath);
          if (isDeleted) {
            console.log(isDeleted?.msg);
          }
        } catch (e) {
          console.error('Could not delete old avatar');
        }
      }

      return res.status(200).json({
        success: true,
        data: [monster],
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

router.get('/avatar/:fileName', (req, res) => {
  const hostFile = (file: string) => {
    return new Promise(async (resolve, reject) => {
      // check if file exists
      fs.access(file, fs.constants.F_OK, async (err) => {
        if (err) {
          console.log(err);
          reject({
            success: false,
            msg: 'File does not exist: ' + file,
          });
        } else {
          res.writeHead(200);
          fs.createReadStream(file).pipe(res);
          resolve(true);
        }
      });
    });
  };
  hostFile(AVATAR_STORAGE_PATH + req.params.fileName).catch((err) => {
    res.status(500).json(err);
  });
});

module.exports = router;
