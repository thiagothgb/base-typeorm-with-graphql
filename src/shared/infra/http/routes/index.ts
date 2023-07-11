import { Router } from "express";

const routes = Router();

routes.get("/", function (req, res) {
  res.send("Hello World");
});

export default routes;
