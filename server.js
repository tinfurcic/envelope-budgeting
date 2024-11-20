import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { apiRouter } from "./server/api.js";

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

export default app;
