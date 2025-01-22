import express from "express";
import { envelopesRouter } from "./apiRouters/envelopesRouter.js";
import { budgetRouter } from "./apiRouters/budgetRouter.js";
import { usersRouter } from "./apiRouters/usersRouter.js";
import { incomeRouter } from "./apiRouters/incomeRouter.js";
import authenticateToken from "./middleware/authenticateToken.js";

export const apiRouter = express.Router();

apiRouter.use(authenticateToken);

apiRouter.use("/users", usersRouter);
apiRouter.use("/envelopes", envelopesRouter);
apiRouter.use("/budget", budgetRouter);
apiRouter.use("/income", incomeRouter);