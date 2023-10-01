import { Router } from 'express';
import fs from 'fs';
import { AVATAR_STORAGE_PATH } from '../../../utils/storage';

module.exports = Router({ mergeParams: true }).get('/avatar/:fileName', (req, res) => {
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
