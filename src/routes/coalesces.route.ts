import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { coalesceRules } from '../rules/index';

// eslint-disable-next-line new-cap
export const coalescesRouter = express.Router();

coalescesRouter.get('/:memberId', async (req: Request, res: Response) => {
  const { params } = req;
  if (params.memberId) {
    const memberId = Number(params.memberId);
    const result = await coalesceRules.getCoalesce(memberId);
    if (result) {
      res.status(StatusCodes.OK).send(result);
    } else {
      const unavailbleMsg = 'Something wrong happened!';
      res.status(StatusCodes.SERVICE_UNAVAILABLE).send(unavailbleMsg);
    }
  }
  const badRequestMsg = 'Was not possible to find memberId parameter';
  res.status(StatusCodes.BAD_REQUEST).send(badRequestMsg);
});

export default coalescesRouter;
