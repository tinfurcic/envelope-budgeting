import express from "express";
import { envelopesRouter } from "./apiRouters/envelopesRouter.js";
import { usersRouter } from "./apiRouters/usersRouter.js";
import { incomeRouter } from "./apiRouters/incomeRouter.js";
import { savingsRouter } from "./apiRouters/savingsRouter.js";
import { expensesRouter } from "./apiRouters/expensesRouter.js";
import { goalsRouter } from "./apiRouters/goalsRouter.js";
import { settingsRouter } from "./apiRouters/settingsRouter.js";
import { expensesHistoryRouter } from "./apiRouters/expensesHistoryRouter.js";
import authenticateToken from "./middleware/authenticateToken.js";

export const apiRouter = express.Router();

apiRouter.use(authenticateToken);

apiRouter.use("/users", usersRouter);
apiRouter.use("/envelopes", envelopesRouter);
apiRouter.use("/income", incomeRouter);
apiRouter.use("/savings", savingsRouter);
apiRouter.use("/expenses", expensesRouter);
apiRouter.use("/goals", goalsRouter);
apiRouter.use("/settings", settingsRouter);
apiRouter.use("/expenses-history", expensesHistoryRouter);
