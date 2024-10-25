import express from "express";
import { skillsModel } from "./models";

const port = 8000;
const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  skillsModel;
  res.status(200).json(JSON.stringify("works"));
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}.`);
});
