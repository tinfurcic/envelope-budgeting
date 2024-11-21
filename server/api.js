import express from "express";
import { envelopesRouter } from "./apiRouters/envelopesRouter.js";
import { budgetRouter } from "./apiRouters/budgetRouter.js";
import authenticateToken from "./middleware/authenticateToken.js";

export const apiRouter = express.Router();

apiRouter.use(authenticateToken);

apiRouter.use("/envelopes", envelopesRouter);
apiRouter.use("/budget", budgetRouter);
