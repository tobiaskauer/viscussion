module.exports = app => {
    const traces = require("../controllers/trace.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Trace
    router.post("/", traces.create);
  
    // Retrieve all Traces for one image
    router.get("/:image", traces.findImageTraces);

    router.get("/", traces.findAll);
  
    // Retrieve all published Traces
    router.get("/published", traces.findAllPublished);
  
    // Update a Trace with id
    router.put("/:id", traces.update);
  
    // Delete a Trace with id
    router.delete("/:id", traces.delete);


  
    // Delete all Traces
    router.delete("/", traces.deleteAll);
  
    app.use('/api/trace', router);
  };