module.exports = (app) => {
  const images = require("../controllers/image.controller.js");

  var router = require("express").Router();

  // Create a new Trace
  //router.post("/", images.createMeta);

  router.post("/", images.create);

  //router.post("/", images.uploadFile);

  // Retrieve all Traces
  router.get("/", images.findAll);

  router.get("/:id", images.findOne);

  /*// Retrieve a single Trace with id
    router.get("/:id", traces.findOne);
  
    // Update a Trace with id
    router.put("/:id", traces.update);
    */

  // Delete a Trace with id
  router.delete("/:id", images.delete);

  app.use("/api/image", router);
};
