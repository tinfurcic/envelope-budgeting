import express from 'express'; 
import { envelopesRouter } from './apiRouters/envelopesRouter.js';

export const apiRouter = express.Router();

apiRouter.use('/envelopes', envelopesRouter);