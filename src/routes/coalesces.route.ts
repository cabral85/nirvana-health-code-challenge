import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { orderRule } from '../rules/index';

// eslint-disable-next-line new-cap
export const coalescesRouter = express.Router();

coalescesRouter.get('/:member/:strat', async (req: Request, res: Response) => {
  const result = await orderRule.getOrders();
  if (result) {
    res.status(StatusCodes.OK).send(result);
  } else {
    res.status(StatusCodes.NOT_FOUND);
  }
});

export default coalescesRouter;
