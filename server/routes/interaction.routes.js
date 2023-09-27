module.exports = (app) => {
  const interactions = require("../controllers/interaction.controller.js");
  var router = require("express").Router();

  router.post("/", interactions.create);
  router.get("/", interactions.findAll);

  app.use("/api/interaction", router);
};
