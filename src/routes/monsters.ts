import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  console.log('here')
  return res.status(200).json({
    success: true,
  });
});

module.exports = router;
