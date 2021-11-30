import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { coalesceRules } from '../rules/index';

// eslint-disable-next-line new-cap
export const coalescesRouter = express.Router();

const FAKE_NUMBER = 0;

coalescesRouter.get('/:memberId', async (req: Request, res: Response) => {
  const { params } = req;
  if (params.memberId) {
    const memberId = Number(params.memberId) || FAKE_NUMBER;
    const result = await coalesceRules.getCoalesce(memberId);
    if (result) {
      res.status(StatusCodes.OK).send(result);
    } else {
      res.status(StatusCodes.NOT_FOUND);
    }
  }
});

export default coalescesRouter;
