import path from 'path';
import fs from 'fs';
import multer from 'multer';

export const AVATAR_STORAGE_PATH = path.resolve('storage/avatars') + '/';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
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
  filename: (_req, _file, cb) => {
    cb(null, Date.now() + '.png');
  },
});

export const deleteAvatar = (fileName: string): Promise<{msg: string}> => {
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

export default multer({ storage: storage });